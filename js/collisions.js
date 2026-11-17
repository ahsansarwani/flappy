/* --------------------------------------------------------------
   Street Racer — Collision Detection
   Car-to-car physics with bounce and sparks
   -------------------------------------------------------------- */
import { state } from './state.js';
import { spawnParticles } from './particles.js';

export function checkCollisions(cars) {
  for (let i = 0; i < cars.length; i++) {
    for (let j = i + 1; j < cars.length; j++) {
      const a = cars[i];
      const b = cars[j];
      if (a.finished || b.finished) continue;

      const dz = Math.abs(a.world.z - b.world.z);
      const dx = Math.abs(
        (a.world.x + a.offset * 150) - (b.world.x + b.offset * 150)
      );

      if (dz < 90 && dx < 90 * 0.8) {
        // Bounce apart
        const push = 300;
        if (a.world.z < b.world.z) {
          a.world.z -= push * 0.5;
          b.world.z += push * 0.5;
        } else {
          a.world.z += push * 0.5;
          b.world.z -= push * 0.5;
        }

        // Speed loss on impact
        a.speed *= 0.6;
        b.speed *= 0.6;

        // Impact shake + damage
        a.shake = 12;
        b.shake = 12;
        a.damage = Math.min(1, a.damage + 0.15);
        b.damage = Math.min(1, b.damage + 0.15);

        // Spark particles at impact point
        const midX = (a.screen.x + b.screen.x) / 2 || 640;
        const midY = (a.screen.y + b.screen.y) / 2 || 360;
        spawnParticles(midX, midY, 0xffff00, 8, 2, 6, 0, Math.PI * 2);
      }
    }
  }
}
