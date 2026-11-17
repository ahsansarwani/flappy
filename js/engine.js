/* --------------------------------------------------------------
   Street Racer — Phaser Engine (PlayScene)
   Pseudo-3D projection, rolling terrain, roadside scenery, cars
   -------------------------------------------------------------- */
import { CONFIG, CARS } from './config.js';
import { state, startTimeRef, sortedCars } from './state.js';
import { Car } from './car.js';
import { generateTrack, generateTrackImages } from './track.js';
import { generateTextures } from './textures.js';
import { checkCollisions } from './collisions.js';
import { animateCar, applyShake, updateSpeedLines } from './animations.js';
import { drawSceneryItem, drawGuardPost, drawObstacleTree } from './scenery.js';
import { Sky } from './sky.js';

export class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  preload() {
    // textures generated in create()
  }

  create() {
    state.scene = this;
    generateTextures(this);
    generateTrack(state.currentTrackId || 'grid');
    generateTrackImages();

    this.roadGraphics = this.add.graphics();
    this.sky = new Sky(this);
    this.sky.setTheme(state.currentTrackId || 'grid');

    this.playerWorldX = 0;

    const cars = [];
    const playerSpec = CARS.starter;
    const playerSprite = this.add.sprite(0, 0, playerSpec.id).setVisible(false);
    const player = new Car(0, 'You', true, playerSpec, playerSprite);
    player.world = { x: 0, y: 0, z: 0 };
    cars.push(player);
    state.player = player;

    const rivals = [
      { name: 'Raze', key: 'tuner' },
      { name: 'Volt', key: 'muscle' },
      { name: 'Null', key: 'exotic' },
      { name: 'Glitch', key: 'starter' },
    ];
    let z = 300;
    for (const r of rivals) {
      const spec = CARS[r.key];
      const sprite = this.add.sprite(0, 0, spec.id).setVisible(false);
      const c = new Car(cars.length, r.name, false, spec, sprite);
      c.world = { x: (Math.random() - 0.5) * 400, y: 0, z };
      c.offset = (Math.random() - 0.5) * 2;
      cars.push(c);
      z += 400;
    }
    state.cars = cars;

    state.racing = false;
    state.result = null;
    state.shake = 0;
  }

  update(time, delta) {
    if (!state.racing || !state.scene) return;

    const player = state.player;

    // Sync sky theme if track changed
    const currentTrackId = state.currentTrackId || 'grid';
    if (this.sky.currentTheme !== currentTrackId) {
      this.sky.setTheme(currentTrackId);
    }

    const ordered = [...state.cars].sort((a, b) => b.world.z - a.world.z);
    for (const c of ordered) c.update(player, state.segments, state.trackLength);

    // collisions
    checkCollisions(state.cars);

    if (state.shake > 0) {
      state.shake *= 0.9;
      if (state.shake < 0.3) state.shake = 0;
    }
    applyShake(this);

    if (player.boostTimer > 0) {
      updateSpeedLines(this, true);
    }

    const finished = state.cars.filter((c) => c.finished);
    if (finished.length > 0 && !state.result) {
      const pFinished = finished.find((c) => c.isPlayer);
      if (pFinished) {
        state.racing = false;
        state.result = {
          position: sortedCars().findIndex((c) => c.id === player.id) + 1,
          totalCars: state.cars.length,
          time: (Date.now() - startTimeRef.current) / 1000,
          won: player.lap > CONFIG.maxLaps,
        };
        if (state.onFinish) state.onFinish(state.result);
      }
    }

    this.sky.update(time);
    this.render(player, ordered, time, delta);
  }

  render(player, ordered, time, delta) {
    const g = this.roadGraphics;
    g.clear();

    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const horizonY = H / 2;
    const theme = state.trackTheme;
    const sky = this.sky;

    // === SKY LAYER ===
    sky.drawGradient(g, W, H, horizonY);
    sky.drawStars(g, W, horizonY, this.playerWorldX, time);
    sky.drawSun(g, W, horizonY, this.playerWorldX, time);

    // Compute curve accumulation for mountain parallax
    let curveAccum = 0;
    const segments = state.segments;
    const segCount = segments.length;
    const baseSeg = Math.floor(player.world.z / CONFIG.segmentLength);
    const basePercent = (player.world.z % CONFIG.segmentLength) / CONFIG.segmentLength;
    const playerSeg = segments[baseSeg % segCount];
    const playerY =
      playerSeg.world.y +
      ((segments[(baseSeg + 1) % segCount].world.y - playerSeg.world.y) * basePercent);

    // Pre-compute curve accumulation for mountains (use first ~50 segments)
    for (let i = 0; i < 60; i++) {
      curveAccum += segments[(baseSeg + i) % segCount].curve * 50;
    }

    sky.drawMountains(g, W, horizonY, this.playerWorldX, curveAccum);

    // Horizon glow line
    g.lineStyle(2, sky.palette ? sky.palette.glow : 0x00f3ff, 0.25);
    g.beginPath();
    g.moveTo(0, horizonY);
    g.lineTo(W, horizonY);
    g.strokePath();

    // === PROJECT SEGMENTS ===
    curveAccum = 0;
    const projected = [];
    const safeMod = (i, n) => ((i % n) + n) % n;
    for (let n = 0; n < CONFIG.drawDistance; n++) {
      const seg = segments[safeMod(baseSeg + n, segCount)];
      const prevCurve = curveAccum;
      curveAccum += seg.curve * 50;

      const worldZ1 = (baseSeg + n) * CONFIG.segmentLength;
      const worldZ2 = worldZ1 + CONFIG.segmentLength;
      const segZ1 = worldZ1 - player.world.z;
      const segZ2 = worldZ2 - player.world.z;
      if (segZ2 <= 0 || segZ1 <= 0) continue;

      const s1 = CONFIG.fieldOfView / segZ1;
      const s2 = CONFIG.fieldOfView / segZ2;

      const centerX1 = (prevCurve - this.playerWorldX) * s1;
      const centerX2 = (curveAccum - this.playerWorldX) * s2;

      const sx1 = W / 2 + centerX1;
      const sx2 = W / 2 + centerX2;

      const sy1 = horizonY + (CONFIG.cameraHeight + seg.world.y - playerY) * s1;
      const sy2 = horizonY + (CONFIG.cameraHeight + segments[safeMod(baseSeg + n + 1, segCount)].world.y - playerY) * s2;

      const w1 = (CONFIG.roadWidth * s1) / 2;
      const w2 = (CONFIG.roadWidth * s2) / 2;

      projected.push({ seg, n, sx1, sy1, sx2, sy2, w1, w2, s1, s2, segZ1, segZ2 });
    }

    // Sort far to near for correct overlap
    projected.sort((a, b) => b.segZ1 - a.segZ1);

    const fogColor = theme ? theme.fogColor : 0x0a0a18;
    const fogAlphaMax = theme ? theme.fogAlpha : 0.9;
    const drawDist = CONFIG.drawDistance * CONFIG.segmentLength;

    // === DRAW SEGMENTS (far to near) ===
    for (const p of projected) {
      const { seg, n, sx1, sy1, sx2, sy2, w1, w2 } = p;

      if (sy1 <= sy2) continue;

      // Alternating ground bands with texture
      const grass = n % 4 < 2 ? 0x0a0a14 : 0x06060e;
      const roadColor = n % 2 === 0 ? 0x181828 : 0x12121c;
      const rumbleColor = n % 4 < 2 ? 0xff00ff : 0xb000ff;

      // Distance fog (gradient: 0 at near, 1 at far)
      const fogT = Math.min(1, p.segZ1 / drawDist);
      const fogAlpha = fogT * fogT * fogAlphaMax; // quadratic for smoother fade

      // Ground band
      g.fillStyle(grass, 1);
      g.fillRect(0, sy2, W, sy1 - sy2 + 2);

      // Ground texture: subtle streaks on near segments
      if (fogT < 0.4 && w1 > 2) {
        const streakAlpha = (0.4 - fogT) * 0.15;
        g.fillStyle(0x151528, streakAlpha);
        const streakY = (sy1 + sy2) / 2;
        const streakH = Math.max(1, (sy1 - sy2) * 0.3);
        g.fillRect(w1 * 0.5, streakY, W - w1, streakH);
        g.fillRect(-w1 * 0.5 + W / 2 - W / 2, streakY, w1 * 1.5, streakH);
      }

      // Road surface
      if (w1 > 0.5 && w2 > 0.5) {
        // Road base
        g.fillStyle(roadColor, 1);
        g.beginPath();
        g.moveTo(sx1 - w1, sy1);
        g.lineTo(sx2 - w2, sy2);
        g.lineTo(sx2 + w2, sy2);
        g.lineTo(sx1 + w1, sy1);
        g.closePath();
        g.fillPath();

        // Rumble strips
        const rumbleW1 = w1 * 0.1;
        const rumbleW2 = w2 * 0.1;
        g.fillStyle(rumbleColor, 0.85);
        g.fillRect(sx1 - w1 - rumbleW1, sy2, rumbleW1, sy1 - sy2 + 2);
        g.fillRect(sx1 + w1, sy2, rumbleW1, sy1 - sy2 + 2);

        // Lane markings (center dashed line — 2 lanes)
        if (n % 2 === 0) {
          const laneW1 = w1 * 0.025;
          const laneW2 = w2 * 0.025;
          g.fillStyle(0x00f3ff, 0.5);
          g.beginPath();
          g.moveTo(sx1 - laneW1, sy1);
          g.lineTo(sx2 - laneW2, sy2);
          g.lineTo(sx2 + laneW2, sy2);
          g.lineTo(sx1 + laneW1, sy1);
          g.closePath();
          g.fillPath();
        }

        // Lane edge lines (solid, dimmer)
        const edgeW1 = w1 * 0.015;
        const edgeW2 = w2 * 0.015;
        g.fillStyle(0x00f3ff, 0.2);
        // Left edge
        g.fillRect(sx1 - w1 * 0.55 - edgeW1, sy2, edgeW1, sy1 - sy2 + 2);
        // Right edge
        g.fillRect(sx1 + w1 * 0.55, sy2, edgeW1, sy1 - sy2 + 2);

        // Road edge glow lines
        g.fillStyle(0x00f3ff, 0.12);
        g.fillRect(sx1 - w1, sy2, 2, sy1 - sy2 + 2);
        g.fillRect(sx1 + w1 - 2, sy2, 2, sy1 - sy2 + 2);
      }

      // Headlight glow on near road segments (player illuminates road ahead)
      if (fogT < 0.15 && w1 > 1) {
        const glowAlpha = (0.15 - fogT) * 0.8;
        g.fillStyle(0xfff8e0, glowAlpha);
        g.beginPath();
        g.moveTo(sx1 - w1 * 0.6, sy1);
        g.lineTo(sx2 - w2 * 0.4, sy2);
        g.lineTo(sx2 + w2 * 0.4, sy2);
        g.lineTo(sx1 + w1 * 0.6, sy1);
        g.closePath();
        g.fillPath();
      }

      // Guard posts on road edges (every 3rd segment, near only)
      if (fogT < 0.3 && w1 > 1) {
        const postScale = p.s1 * 0.8;
        // Left guard post
        drawGuardPost(g, sx1 - w1 - w1 * 0.15, sy1, postScale, -1);
        // Right guard post
        drawGuardPost(g, sx1 + w1 + w1 * 0.15, sy1, postScale, 1);
      }

      // On-road obstacle tree (with fall-over animation when hit)
      const ob = seg.obstacle;
      if (ob && !ob.gone && w1 > 0.5) {
        if (ob.hit && ob.fall > 0) {
          ob.fall = Math.max(0, ob.fall - (delta || 16) / 450);
          if (ob.fall <= 0) ob.gone = true;
        }
        if (!ob.gone) {
          const obScale = p.s1 * ob.scale;
          const ocx = sx1 + ob.offset * w1;
          const lean = ob.hit ? (1 - ob.fall) * 1.5 * ob.fallDir : 0;
          const alpha = ob.hit ? Math.min(1, ob.fall * 2) : 1;
          drawObstacleTree(g, ocx, sy1, obScale, lean, alpha);
        }
      }

      // Distance fog overlay (gradient alpha)
      if (fogAlpha > 0.01) {
        g.fillStyle(fogColor, fogAlpha);
        g.fillRect(0, sy2, W, sy1 - sy2 + 2);
      }

      // Roadside scenery billboard
      if (seg.scenery && sy1 > sy2 && w1 > 0.5) {
        const item = seg.scenery;
        const scale = p.s1 * item.scale;
        const cx = (n % 2 === 0 ? sx1 : sx2) + item.side * ((n % 2 === 0 ? w1 : w2) * (1 + item.dist));
        const baseY = n % 2 === 0 ? sy1 : sy2;
        drawSceneryItem(g, item, cx, baseY, scale, horizonY, H);
        // Fog on scenery
        if (fogAlpha > 0.01) {
          const topY = baseY - scale * 55 * 6;
          g.fillStyle(fogColor, fogAlpha * 0.85);
          g.fillRect(cx - scale * 100, topY, scale * 200, baseY - topY + 2);
        }
      }
    }

    // === CARS ===
    const startPos = baseSeg;
    for (const c of state.cars) {
      if (c.isPlayer) { c.curveOffset = 0; continue; }
      const relSegs = Math.floor((c.world.z - player.world.z) / CONFIG.segmentLength);
      if (relSegs < 0 || relSegs >= CONFIG.drawDistance) { c.curveOffset = 0; continue; }
      let offset = 0;
      for (let i = 0; i <= relSegs; i++) {
        offset += segments[(startPos + i) % segCount].curve * 50;
      }
      c.curveOffset = offset;
    }

    for (const c of ordered) {
      c.updateSprite();
      animateCar(c);
    }
  }
}