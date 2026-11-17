/* --------------------------------------------------------------
   Street Racer — Particle System
   Drift smoke, nitro flames, collision sparks
   -------------------------------------------------------------- */
import { state } from './state.js';

let particles = [];

export class Particle {
  constructor(x, y, color, life, speed, angle) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.life = life;
    this.maxLife = life;
    this.speed = speed;
    this.angle = angle;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.vx *= 0.95;
    this.vy *= 0.95;
  }

  draw(ctx) {
    const alpha = this.life / this.maxLife;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3 + alpha * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export function spawnParticles(x, y, color, count, speedMin, speedMax, angleMin, angleMax) {
  for (let i = 0; i < count; i++) {
    const angle = angleMin + Math.random() * (angleMax - angleMin);
    const speed = speedMin + Math.random() * (speedMax - speedMin);
    particles.push(new Particle(x, y, color, state.particleLife || 20, speed, angle));
  }
}

export function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    if (particles[i].life <= 0) particles.splice(i, 1);
  }
}

export function drawParticles(ctx) {
  for (const p of particles) p.draw(ctx);
}

export function clearParticles() {
  particles = [];
}
