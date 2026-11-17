/* --------------------------------------------------------------
   Street Racer — Mutable Game State
   Shared state object imported across modules
   -------------------------------------------------------------- */

import { CONFIG, CARS, TRACKS } from './config.js';

export const state = {
  racing: false,
  cars: [],
  player: null,
  result: null,
  onFinish: null,
  shake: 0,
};

export const startTimeRef = { current: 0 };

// Track data (populated at runtime)
export let segments = [];
export let trackLength = 0;
export let trackImages = {};

// Phaser scene reference (set in engine create)
export let scene = null;

// Phaser game reference
export let game = null;

// Particle manager reference
export let particleManager = null;

// Speed lines array (for boost visual)
export let speedLines = [];

// Helper to get player world Z
export function playerWorldZ() {
  return state.player ? state.player.world.z : 0;
}

export function sortedCars() {
  return [...state.cars].sort((a, b) => {
    if (a.finished !== b.finished) return a.finished ? 1 : -1;
    const lapDiff = b.lap - a.lap;
    if (lapDiff !== 0) return lapDiff;
    return b.world.z - a.world.z;
  });
}
