/* --------------------------------------------------------------
   Street Racer — Animations & Screen Effects
   Lean, bob, squash-stretch, camera shake, speed lines
   -------------------------------------------------------------- */
import { state } from './state.js';
import { spawnParticles } from './particles.js';

export function animateCar(car) {
  car.animateSprite();
}

export function applyShake(scene) {
  if (state.shake > 1) {
    scene.cameras.main.shake(150, 0.015 * state.shake);
  }
}

export function updateSpeedLines(scene, boosting) {
  state.speedLines.forEach((s) => s.destroy());
  state.speedLines = [];

  if (!boosting) return;

  const w = scene.cameras.main.width;
  const h = scene.cameras.main.height;
  for (let i = 0; i < 6; i++) {
    const line = scene.add.rectangle(
      Math.random() * w,
      Math.random() * h,
      40, 2,
      0x00f3ff
    );
    line.setAlpha(0.3 + Math.random() * 0.4);
    line.setDepth(9999);
    scene.tweens.add({
      targets: line,
      x: line.x - 200,
      alpha: 0,
      duration: 400,
      onComplete: () => line.destroy(),
    });
    state.speedLines.push(line);
  }
}
