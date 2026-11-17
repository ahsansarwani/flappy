/* --------------------------------------------------------------
   Street Racer — Car Class
   Physics, drift, nitro, damage, and sprite animation
   -------------------------------------------------------------- */
import { CONFIG } from './config.js';
import { state, startTimeRef } from './state.js';
import { spawnParticles } from './particles.js';
import { resetObstacles } from './track.js';

export class Car {
  constructor(id, name, isPlayer, spec, sprite) {
    this.id = id;
    this.name = name;
    this.isPlayer = isPlayer;
    this.color = spec.color;
    this.spec = spec;
    this.sprite = sprite;
    this.reset();
  }

  reset() {
    this.world = { x: 0, y: 0, z: 0 };
    this.speed = 0;
    this.offset = 0;
    this.finished = false;
    this.lap = 1;
    this.finishTime = 0;
    this.boostTimer = 0;
    this.drift = 0;
    this.driftAngle = 0;
    this.shake = 0;
    this.damage = 0;
    this.screen = { x: 0, y: 0, scale: 1, w: 0, h: 0 };
    this.lastLane = 0;
    this.curveOffset = 0;
    this.offsetVel = 0;
  }

  update(player, segments, trackLength) {
    if (this.finished) return;

    const isPlayer = this.isPlayer;
    const maxSpeed = this.spec.maxSpeed;
    const accel = this.spec.accel;
    const breakForce = this.spec.break;
    const handling = this.spec.handling || 1.0;

    if (isPlayer) {
      if (window.keys && (window.keys['KeyW'] || window.keys['ArrowUp'])) {
        this.speed = Math.min(this.speed + accel, maxSpeed);
      }
      if (window.keys && (window.keys['KeyS'] || window.keys['ArrowDown'])) {
        this.speed = Math.max(this.speed - breakForce, -maxSpeed * 0.35);
      }
      if (window.keys && window.keys['Space'] && this.boostTimer <= 0 && this.speed > 12) {
        this.boostTimer = CONFIG.boostDuration;
        this.damage = Math.min(1, this.damage + 0.02);
      }

      let steer = 0;
      if (window.keys && (window.keys['KeyA'] || window.keys['ArrowLeft'])) steer = -1;
      if (window.keys && (window.keys['KeyD'] || window.keys['ArrowRight'])) steer = 1;

      const speedPercent = Math.max(this.speed / maxSpeed, 0.3);
      const turnPower = CONFIG.turnKeySpeed * speedPercent * handling;
      const dx = steer * turnPower;
      this.offset += dx;
      this.offset = Math.max(-3, Math.min(3, this.offset));

      if (Math.abs(steer) > 0 && speedPercent > CONFIG.driftThreshold) {
        this.drift = Math.min(1, this.drift + 0.06);
        this.driftAngle = steer * 0.35;
        this.lastLane = this.offset;
      } else {
        this.drift = Math.max(0, this.drift - 0.04);
        this.driftAngle *= 0.88;
      }

      const seg = segments[Math.floor(this.world.z / CONFIG.segmentLength) % segments.length];
      const offroad = Math.abs(this.offset) > 1;
      if (offroad) {
        this.speed -= CONFIG.offroadDecel;
        this.damage = Math.min(1, this.damage + 0.01);
      } else {
        this.damage = Math.max(0, this.damage - 0.002);
      }
    } else {
      this.speed = Math.min(
        this.speed + accel * 0.88,
        maxSpeed * (0.82 + Math.random() * 0.3)
      );
      const segIdx = Math.floor(this.world.z / CONFIG.segmentLength) % segments.length;
      const seg = segments[segIdx];
      if (seg && player) {
        const targetOffset = player.offset + (Math.random() - 0.5) * 0.7;
        const diff = targetOffset - this.offset;
        const turn = Math.sign(diff) * CONFIG.turnKeySpeed * 0.75 * (this.speed / maxSpeed) * handling;
        this.offset += turn;
        this.offset = Math.max(-2.4, Math.min(2.4, this.offset));
        this.lastLane = this.offset;
      }
    }

    // Lateral knockback velocity (impulse physics from obstacle hits)
    this.offset += this.offsetVel;
    this.offsetVel *= 0.82;
    this.offset = Math.max(-3, Math.min(3, this.offset));

    if (this.boostTimer > 0) {
      this.boostTimer--;
      this.speed *= CONFIG.boostMultiplier;
    }

    this.speed *= CONFIG.friction;
    this.world.z += this.speed;

    // Can't reverse behind the start line
    if (this.world.z < 0) {
      this.world.z = 0;
      this.speed = Math.max(0, this.speed);
    }

    if (this.world.z >= trackLength) {
      this.world.z -= trackLength;
      this.lap++;
      resetObstacles(segments);
      if (this.lap > CONFIG.maxLaps) this.finish();
    }

    this.checkObstacles(segments);

    // drift smoke
    if (this.drift > 0.35 && this.speed > 12 && Math.random() < 0.45) {
      const sx = this.screen.x;
      const sy = this.screen.y;
      if (sx && sy) {
        spawnParticles(sx + (Math.random() - 0.5) * 18, sy + 34, 0x00f3ff, 1, 1, 3, Math.PI * 0.35, Math.PI * 0.65);
      }
    }

    // nitro flames
    if (this.boostTimer > 0 && Math.random() < 0.5) {
      const sx = this.screen.x;
      const sy = this.screen.y;
      if (sx && sy) {
        spawnParticles(sx - 10 + Math.random() * 20, sy + 42, 0xff00ff, 1, 2, 6, Math.PI * 1.3, Math.PI * 1.7);
      }
    }
  }

  finish() {
    this.finished = true;
    this.finishTime = (Date.now() - startTimeRef.current) / 1000;
  }

  // Impulse-based collision with on-road obstacle trees
  checkObstacles(segments) {
    if (this.finished || !segments) return;
    const segLen = CONFIG.segmentLength;
    const baseIdx = Math.floor(this.world.z / segLen);
    const segCount = segments.length;

    for (let k = 0; k < 3; k++) {
      const seg = segments[(baseIdx + k) % segCount];
      const ob = seg && seg.obstacle;
      if (!ob || ob.hit || ob.gone) continue;

      // Longitudinal overlap check
      const obZ = (baseIdx + k) * segLen + segLen * 0.5;
      if (Math.abs(this.world.z - obZ) > segLen * 0.55) continue;

      // Lateral overlap check (circle-circle in track space)
      const latDist = this.offset - ob.offset;
      const minDist = 0.34;
      if (Math.abs(latDist) > minDist) continue;

      // --- Impulse response ---
      const dir = latDist >= 0 ? 1 : -1; // push car away from tree
      const impactSpeed = Math.abs(this.offsetVel) + Math.abs(this.speed) * 0.004;
      const restitution = 0.45;

      // Reflect lateral velocity with restitution + positional correction
      this.offsetVel = dir * (0.35 + impactSpeed * 0.15) - this.offsetVel * restitution;
      this.offset += dir * 0.1;

      // Forward speed loss proportional to impact
      const speedLoss = Math.min(0.7, 0.35 + impactSpeed * 0.25);
      this.speed *= 1 - speedLoss;

      this.damage = Math.min(1, this.damage + 0.22);
      this.shake = 12;
      if (state.scene) state.shake = Math.max(state.shake, 12);

      // Knock the tree over (falls in push direction)
      ob.hit = true;
      ob.fallDir = dir;

      // Leaf + wood particles at screen position
      if (this.screen && this.screen.x) {
        const sx = this.screen.x;
        const sy = this.screen.y - 20;
        spawnParticles(sx, sy, 0x39ff88, 10, 2, 5, Math.PI * 1.05, Math.PI * 1.95);
        spawnParticles(sx, sy, 0x2a8a4a, 6, 1, 3.5, Math.PI * 1.1, Math.PI * 1.9);
        spawnParticles(sx, sy + 8, 0x6a4a2a, 5, 1, 3, Math.PI * 1.15, Math.PI * 1.85);
      }
      break;
    }
  }

    updateSprite() {
      const cameraZ = state.player ? state.player.world.z : 0;
      const cameraX = state.scene.playerWorldX || 0;
      if (this.isPlayer) {
        if (this.sprite) {
          this.sprite.setVisible(true);
          const w = (this.spec.spriteW || 100) * 1.8;
          const h = w * (this.spec.spriteH || 60) / (this.spec.spriteW || 100);
          const screenX = state.scene.cameras.main.width / 2;
          const screenY = state.scene.cameras.main.height - h - 40;
          this.sprite.setPosition(screenX, screenY);
          this.sprite.setDisplaySize(w, h);
          this.sprite.setDepth(999999);
        }
        this.screen = {
          x: state.scene.cameras.main.width / 2,
          y: state.scene.cameras.main.height - 40,
          scale: 1.8,
          w: (this.spec.spriteW || 100) * 1.8,
          h: ((this.spec.spriteW || 100) * 1.8) * (this.spec.spriteH || 60) / (this.spec.spriteW || 100),
        };
        return;
      }

      if (this.world.z < 0 || this.world.z >= CONFIG.drawDistance * CONFIG.segmentLength) {
        if (this.sprite) this.sprite.setVisible(false);
        return;
      }

      const z = this.world.z - cameraZ;
      if (z <= 0) { if (this.sprite) this.sprite.setVisible(false); return; }

      const scale = CONFIG.fieldOfView / z;
      const W = state.scene.cameras.main.width;
      const H = state.scene.cameras.main.height;
      const horizonY = H / 2;

      // Elevation at the car's segment, relative to the camera
      const segs = state.segments;
      const segCount = segs.length;
      const segIdx = Math.floor(this.world.z / CONFIG.segmentLength) % segCount;
      const playerIdx = Math.floor(cameraZ / CONFIG.segmentLength) % segCount;
      const relY = segs[segIdx].world.y - segs[playerIdx].world.y;

      // X: car's lateral position + curve offset, projected to screen
      const carWorldX = this.world.x + this.offset * (CONFIG.roadWidth / 2) + (this.curveOffset || 0);
      const screenX = W / 2 + (carWorldX - cameraX) * scale;

      // Y: below horizon based on perspective + elevation
      const screenY = horizonY + (CONFIG.cameraHeight + relY) * scale;

      // Size: proportional to perspective scale
      const w = Math.max((this.spec.spriteW || 100) * scale * 2, 14);
      const h = Math.max(w * (this.spec.spriteH || 60) / (this.spec.spriteW || 100), 10);

      this.screen = { x: screenX, y: screenY, scale, w, h };

      if (this.sprite) {
        this.sprite.setVisible(true);
        this.sprite.setPosition(screenX, screenY - h / 2);
        this.sprite.setDisplaySize(w, h);
        this.sprite.setDepth(Math.floor(100000 - this.world.z));
      }
  }

  animateSprite() {
    if (!this.sprite) return;
    const sprite = this.sprite;
    const speedPercent = this.speed / this.spec.maxSpeed;

    const targetLean = -this.offset * 10;
    sprite.angle = Phaser.Math.Linear(sprite.angle, targetLean, 0.18);

    if (!this.isPlayer) {
      const bob = Math.sin(Date.now() / 110) * (1.5 + speedPercent * 5);
      sprite.y = this.screen.y - this.screen.h / 2 + bob;
    }

    if (this.boostTimer > 0) {
      sprite.setDisplaySize(this.screen.w * 1.12, this.screen.h * 0.88);
      sprite.setTint(Math.random() < 0.5 ? 0xffffff : 0x00f3ff);
    } else {
      sprite.setDisplaySize(this.screen.w, this.screen.h);
      sprite.clearTint();
    }

    if (this.damage > 0.7 && Math.random() < 0.3) {
      sprite.setAlpha(0.5);
    } else {
      sprite.setAlpha(1);
    }
  }
}
