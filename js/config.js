/* --------------------------------------------------------------
   Street Racer — Game Configuration
   All constants, tuning values, car specs, track specs
   -------------------------------------------------------------- */

export const CONFIG = {
  // Track / road
  roadWidth: 2200,
  segmentLength: 200,
  fieldOfView: 100,
  cameraHeight: 1000,
  drawDistance: 300,
  cameraX: 0,
  maxLaps: 3,

  // Car physics
  maxSpeed: 200,
  accel: 8,
  break: 40,
  decel: 2,
  offroadDecel: 6,
  turnKeySpeed: 0.004,
  driftThreshold: 0.6,
  boostDuration: 40,
  boostMultiplier: 1.45,
  friction: 0.982,

  // Collision
  collisionRadius: 90,

  // Particles
  particleLife: 20,

  // Canvas
  canvasWidth: 1280,
  canvasHeight: 720,
};

// Car specifications
export const CARS = {
  starter: {
    id: 'starter',
    name: 'Rookie Sled',
    color: '#00f3ff',
    maxSpeed: 160,
    accel: 7,
    break: 35,
    handling: 1.0,
    spriteW: 100,
    spriteH: 60,
    cost: 0,
    owned: true,
    supercar: false,
    svgViewBox: '0 0 24 24',
    svg: '<path d="M2 12h20M12 2v20M5 5l7 7M17 5l-7 7"/>',
  },
  tuner: {
    id: 'tuner',
    name: 'Neon Runner',
    color: '#ff00ff',
    maxSpeed: 180,
    accel: 9,
    break: 40,
    handling: 1.1,
    spriteW: 100,
    spriteH: 60,
    cost: 500,
    owned: false,
    supercar: false,
    svgViewBox: '0 0 24 24',
    svg: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
  },
  muscle: {
    id: 'muscle',
    name: 'Chrome Brute',
    color: '#ffaa00',
    maxSpeed: 170,
    accel: 6,
    break: 30,
    handling: 0.9,
    spriteW: 100,
    spriteH: 60,
    cost: 1200,
    owned: false,
    supercar: false,
    svgViewBox: '0 0 24 24',
    svg: '<path d="M17 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12m-4 4h-4m4 4h-4m-4-4h4m4-4h4M16 18h4M16 10h4"/>',
  },
  exotic: {
    id: 'exotic',
    name: 'Revuelto X',
    color: '#b000ff',
    maxSpeed: 200,
    accel: 10,
    break: 45,
    handling: 1.2,
    spriteW: 150,
    spriteH: 68,
    cost: 3000,
    owned: false,
    supercar: true,
    svgViewBox: '0 0 24 24',
    svg: '<path d="M5 12s3-4 7-4 7 4 7 4-3 4-7 4-7-4-7-4zM12 10s3-4 7-4 7 4-3 4-7 4-7-4-7-4zM12 16s3-4 7-4 7 4-3 4-7 4-7-4-7-4z"/>',
  },
};

// Track specifications
export const TRACKS = {
  grid: {
    id: 'grid',
    name: 'Neon Grid',
    svgViewBox: '0 0 24 24',
    svg: '<path d="M2 12h20M12 2v20M5 5l7 7M17 5l-7 7"/>',
    unlockLevel: 1,
  },
  void: {
    id: 'void',
    name: 'Void Circuit',
    svgViewBox: '0 0 24 24',
    svg: '<path d="M12 2L2 12l10 10 10-10L12 2zM12 22L2 12l10-10 10 10L12 22z"/>',
    unlockLevel: 3,
  },
  synth: {
    id: 'synth',
    name: 'Synthwave Run',
    svgViewBox: '0 0 24 24',
    svg: '<path d="M2 12s3-4 7-4 7 4 7 4-3 4-7 4-7-4-7-4zM2 12s3 4 7 4 7-4 7-4-3-4-7-4-7 4z"/>',
    unlockLevel: 6,
  },
  core: {
    id: 'core',
    name: 'Core Overflow',
    svgViewBox: '0 0 24 24',
    svg: '<path d="M3 3h18v18H3zM6 6h12v12H6zM9 9h6v6H9z"/>',
    unlockLevel: 9,
  },
};
