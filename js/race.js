/* --------------------------------------------------------------
   Street Racer — Race API
   Bridge between Vue UI and the Phaser engine
   -------------------------------------------------------------- */
import { CONFIG, CARS } from './config.js';
import { state, sortedCars } from './state.js';
import { PlayScene } from './engine.js';
import { PreloaderScene } from './preloaderScene.js';
import { generateTrack } from './track.js';

export const RACE = {
  init: (parentId) => {
    const config = {
      type: Phaser.AUTO,
      parent: parentId,
      width: CONFIG.canvasWidth,
      height: CONFIG.canvasHeight,
      backgroundColor: '#05050a',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [PreloaderScene, PlayScene],
      input: { keyboard: true },
    };
    state.game = new Phaser.Game(config);
    return state.game;
  },
  startRace: (carId, trackId) => {
    state.cars.forEach((c) => c.reset());
    state.player = state.cars[0];
    const carSpec = CARS[carId];
    state.player.color = carSpec.color;
    state.player.spec = carSpec;
    if (state.player.sprite) {
      state.player.sprite.setTexture(carSpec.id);
      state.player.sprite.setVisible(true);
    }
    // Starting grid: player at front, rivals staggered ahead
    state.player.world = { x: 0, y: 0, z: 0 };
    let z = 300;
    for (const c of state.cars) {
      if (c.isPlayer) continue;
      c.world = { x: (Math.random() - 0.5) * 300, y: 0, z };
      z += 350;
    }
    state.currentTrackId = trackId;
    generateTrack(trackId);
    state.maxLaps = CONFIG.maxLaps;
    state.result = null;
    state.racing = false;
    state.shake = 0;
    state.scene.playerWorldX = 0;
  },
  start: () => {
    state.racing = true;
  },
  stop: () => {
    state.racing = false;
  },
  isRacing: () => state.racing,
  getResult: () => state.result,
  getPlayer: () => state.player,
  sortedCars,
  getTrackImage: (id) => state.trackImages?.[id] || '',
  onFinish: (cb) => { state.onFinish = cb; },
};
