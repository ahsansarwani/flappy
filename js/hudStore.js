/* --------------------------------------------------------------
   Street Racer — HUD Store
   Reactive mirror of the mutable game state, synced per frame
   -------------------------------------------------------------- */
import { state, sortedCars } from './state.js';

const { reactive } = window.Vue;

export const hud = reactive({
  speed: 0,
  lap: 1,
  rank: 1,
  boost: 0,
  drift: 0,
  standings: [],
});

let frame = 0;

export function syncHud() {
  const p = state.racing ? state.player : null;
  hud.speed = p ? Math.floor(p.speed * 2.5) : 0;
  hud.lap = p ? p.lap : 1;
  const idx = p ? sortedCars().findIndex((c) => c.id === p.id) : -1;
  hud.rank = idx >= 0 ? idx + 1 : 1;
  hud.boost = p ? p.boostTimer : 0;
  hud.drift = p ? Math.floor(p.drift * 100) : 0;

  if (frame++ % 12 === 0) {
    hud.standings = sortedCars().map((c) => ({
      id: c.id,
      name: c.name,
      lap: c.lap,
      isPlayer: c.isPlayer,
    }));
  }
}
