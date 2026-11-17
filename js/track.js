/* --------------------------------------------------------------
   Street Racer — Track Generation
   Procedural open field: curves, hills and roadside scenery
   -------------------------------------------------------------- */
import { CONFIG, TRACKS } from './config.js';
import { state } from './state.js';

export class Segment {
  constructor(i, curve, y, color) {
    this.index = i;
    this.world = { z: i * CONFIG.segmentLength, x: 0, y };
    this.curve = curve;
    this.color = color;
    this.scenery = null;
  }
}

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const THEMES = {
  grid: {
    colors: ['#0a0a12', '#0d0d16'],
    hillAmp: 260,
    hillFreq: 0.0011,
    hillFreq2: 0.0037,
    curveScale: 1.0,
    scenery: 'pylon',
    sceneryMix: ['pylon', 'pylon', 'pylon', 'rock', 'bush'],
    fogColor: 0x0a0a18,
    fogAlpha: 0.9,
  },
  void: {
    colors: ['#0b0812', '#0e0a16'],
    hillAmp: 420,
    hillFreq: 0.0014,
    hillFreq2: 0.0043,
    curveScale: 1.25,
    scenery: 'crystal',
    sceneryMix: ['crystal', 'crystal', 'crystal', 'rock'],
    fogColor: 0x120a1e,
    fogAlpha: 0.9,
  },
  synth: {
    colors: ['#0a0810', '#0d0a14'],
    hillAmp: 340,
    hillFreq: 0.001,
    hillFreq2: 0.0031,
    curveScale: 1.1,
    scenery: 'tree',
    sceneryMix: ['tree', 'tree', 'tree', 'bush', 'rock'],
    fogColor: 0x140a1c,
    fogAlpha: 0.88,
  },
  core: {
    colors: ['#0c0810', '#100a14'],
    hillAmp: 560,
    hillFreq: 0.0016,
    hillFreq2: 0.005,
    curveScale: 1.4,
    scenery: 'tree',
    sceneryMix: ['tree', 'tree', 'tree', 'crystal', 'rock'],
    fogColor: 0x180a20,
    fogAlpha: 0.92,
  },
};

export function generateTrack(trackId) {
  const theme = THEMES[trackId] || THEMES.grid;
  const total = 6000;
  const segs = [];

  for (let i = 0; i < total; i++) {
    const z = i * CONFIG.segmentLength;
    const y =
      Math.sin(z * theme.hillFreq) * theme.hillAmp +
      Math.sin(z * theme.hillFreq2 + 1.7) * theme.hillAmp * 0.35;

    // Long sweeping curve sections, scaled per track theme
    let curve = 0;
    if (i > 200 && i < 1000) curve = 1.2 * theme.curveScale;
    if (i > 1400 && i < 2200) curve = -1.0 * theme.curveScale;
    if (i > 2600 && i < 3400) curve = 1.6 * theme.curveScale;
    if (i > 3800 && i < 4600) curve = -1.3 * theme.curveScale;
    if (i > 5000) curve = 0.8 * theme.curveScale;

    const color = i % 4 < 2 ? theme.colors[0] : theme.colors[1];
    segs.push(new Segment(i, curve, y, color));
  }

  const rand = mulberry32(
    Object.keys(TRACKS).indexOf(trackId) * 9176 + 1337
  );

  // Roadside scenery — dense near the road, sparse further out
  for (let i = 12; i < total - 20; i += 3) {
    const seg = segs[i];
    const roll = rand();
    if (roll < 0.28) continue;
    const side = rand() < 0.5 ? -1 : 1;
    const dist = 2.2 + rand() * 6.5; // in half-road widths
    const scale = 0.6 + rand() * 1.1;
    const variant = rand();
    // Pick scenery type from theme mix
    const typeRoll = rand();
    const mix = theme.sceneryMix || [theme.scenery];
    const type = mix[Math.floor(typeRoll * mix.length)];
    seg.scenery = {
      type,
      side,
      dist,
      scale,
      variant,
      offset: rand() * 60 - 30,
    };
  }

  // On-road obstacle trees — sparse, dodgeable, clear of the start grid
  for (let i = 60; i < total - 60; i += 16) {
    if (rand() < 0.42) continue;
    const seg = segs[i];
    if (seg.obstacle) continue;
    const offset = rand() * 1.7 - 0.85; // on road: -0.85..0.85 half-road widths
    const scale = 0.8 + rand() * 0.5;
    const variant = rand();
    seg.obstacle = {
      offset,
      scale,
      variant,
      hit: false,
      fall: 1,
      fallDir: 1,
      gone: false,
    };
  }

  state.segments = segs;
  state.trackLength = total * CONFIG.segmentLength;
  state.trackTheme = theme;
  state.currentTrackId = trackId || 'grid';
  return segs;
}

// Reset all obstacle trees (called on lap wrap)
export function resetObstacles(segments) {
  const segs = segments || state.segments;
  for (const seg of segs) {
    if (seg.obstacle) {
      seg.obstacle.hit = false;
      seg.obstacle.fall = 1;
      seg.obstacle.gone = false;
    }
  }
}

// Track preview images (procedural)

export function generateTrackImages() {
  const off = document.createElement('canvas');
  off.width = 280;
  off.height = 160;
  const octx = off.getContext('2d');

  const trackData = {
    grid: { color: '#00f3ff', curve: 1, name: 'NEON GRID' },
    void: { color: '#ff00ff', curve: -1, name: 'VOID CIRCUIT' },
    synth: { color: '#ffff00', curve: 1.5, name: 'SYNTHWAVE RUN' },
    core: { color: '#b000ff', curve: -1.3, name: 'CORE OVERFLOW' },
  };

  state.trackImages = {};

  for (const [id, spec] of Object.entries(trackData)) {
    octx.clearRect(0, 0, off.width, off.height);
    octx.fillStyle = '#05050a';
    octx.fillRect(0, 0, off.width, off.height);
    octx.fillStyle = spec.color + '0a';
    octx.fillRect(0, 0, off.width, off.height / 2);

    octx.save();
    octx.translate(off.width / 2, off.height * 0.62);
    octx.beginPath();
    octx.moveTo(-120, 60);
    octx.bezierCurveTo(-120 + spec.curve * 40, 20, 120 - spec.curve * 40, 20, 120, 60);
    octx.lineTo(110, 70);
    octx.bezierCurveTo(110 - spec.curve * 40, 30, -110 + spec.curve * 40, 30, -110, 70);
    octx.closePath();
    octx.fillStyle = '#161625';
    octx.fill();
    octx.strokeStyle = spec.color;
    octx.lineWidth = 4;
    octx.stroke();
    octx.strokeStyle = 'rgba(255,255,255,0.2)';
    octx.setLineDash([12, 12]);
    octx.beginPath();
    octx.moveTo(-100, 65);
    octx.bezierCurveTo(-100 + spec.curve * 35, 47, 100 - spec.curve * 35, 47, 100, 65);
    octx.stroke();
    octx.restore();

    octx.fillStyle = '#e8eaf2';
    octx.font = '12px monospace';
    octx.textAlign = 'center';
    octx.fillText(spec.name, off.width / 2, off.height - 14);

    state.trackImages[id] = off.toDataURL('image/png');
  }
}

export function getTrackImage(id) {
  return state.trackImages[id] || '';
}