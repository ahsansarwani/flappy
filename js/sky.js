/* --------------------------------------------------------------
   Street Racer — Sky & Atmosphere
   Stars, sun/moon, distant mountains, parallax layers
   -------------------------------------------------------------- */

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Per-theme sky palettes (top, mid, horizon colors)
const SKY_PALETTES = {
  grid: {
    top: 0x05050a,
    mid: 0x0a0a1a,
    horizon: 0x1a0a2e,
    glow: 0x00f3ff,
    starAlpha: 0.7,
    sunColor: 0x00f3ff,
    sunGlow: 0x00f3ff,
    mountain: 0x0d0a1a,
    mountainFar: 0x080614,
  },
  void: {
    top: 0x08050e,
    mid: 0x120818,
    horizon: 0x2a0a3e,
    glow: 0xff00ff,
    starAlpha: 0.9,
    sunColor: 0xff00ff,
    sunGlow: 0xb000ff,
    mountain: 0x140a20,
    mountainFar: 0x0a0414,
  },
  synth: {
    top: 0x06040a,
    mid: 0x0e0818,
    horizon: 0x2e0a28,
    glow: 0xffff00,
    starAlpha: 0.6,
    sunColor: 0xffff00,
    sunGlow: 0xff8800,
    mountain: 0x100a18,
    mountainFar: 0x080410,
  },
  core: {
    top: 0x0a040a,
    mid: 0x180818,
    horizon: 0x3a0a28,
    glow: 0xb000ff,
    starAlpha: 0.85,
    sunColor: 0xb000ff,
    sunGlow: 0xff00ff,
    mountain: 0x180a20,
    mountainFar: 0x0c0414,
  },
};

// Generate deterministic star field
function generateStars(seed, count) {
  const rand = mulberry32(seed);
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand(),
      y: rand() * 0.55, // top 55% of screen
      size: 0.5 + rand() * 1.8,
      brightness: 0.3 + rand() * 0.7,
      twinkle: rand() * Math.PI * 2,
      layer: rand() < 0.3 ? 0 : (rand() < 0.5 ? 1 : 2),
    });
  }
  return stars;
}

// Generate mountain silhouette points (2 layers for parallax)
function generateMountains(seed, width, peaks, height) {
  const rand = mulberry32(seed);
  const points = [];
  const step = width / peaks;
  for (let i = 0; i <= peaks; i++) {
    const x = i * step;
    const peakY = -height * (0.4 + rand() * 0.6);
    points.push({ x, y: peakY });
  }
  return points;
}

export class Sky {
  constructor(scene) {
    this.scene = scene;
    this.stars = null;
    this.mountainsNear = null;
    this.mountainsFar = null;
    this.palette = null;
    this.time = 0;
    this.currentTheme = null;
  }

  setTheme(themeId) {
    this.palette = SKY_PALETTES[themeId] || SKY_PALETTES.grid;
    this.currentTheme = themeId;
    const seed = Object.keys(SKY_PALETTES).indexOf(themeId) * 4231 + 777;
    this.stars = generateStars(seed, 140);
    this.mountainsNear = generateMountains(seed + 1, 1400, 24, 120);
    this.mountainsFar = generateMountains(seed + 2, 1400, 16, 80);
  }

  // Draw the sky gradient
  drawGradient(g, W, H, horizonY) {
    const p = this.palette;
    if (!p) return;

    // Top half: gradient from top to horizon
    const steps = 24;
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      // Blend from top to mid to horizon
      let color;
      if (t < 0.5) {
        color = lerpColor(p.top, p.mid, t * 2);
      } else {
        color = lerpColor(p.mid, p.horizon, (t - 0.5) * 2);
      }
      const y = t * horizonY;
      g.fillStyle(color, 1);
      g.fillRect(0, y, W, horizonY / steps + 1);
    }

    // Horizon glow band
    for (let i = 0; i < 6; i++) {
      const t = i / 6;
      const alpha = 0.12 * (1 - t);
      const y = horizonY - 30 + t * 30;
      g.fillStyle(p.glow, alpha);
      g.fillRect(0, y, W, 5);
    }
  }

  // Draw stars with parallax and twinkle
  drawStars(g, W, horizonY, playerWorldX, time) {
    if (!this.stars || !this.palette) return;
    const p = this.palette;
    const parallax = playerWorldX * 0.02;

    for (const s of this.stars) {
      const layerFactor = s.layer === 0 ? 0.3 : s.layer === 1 ? 0.6 : 1;
      const sx = ((s.x * W - parallax * layerFactor) % W + W) % W;
      const sy = s.y * horizonY * 0.85;
      const twinkle = 0.6 + 0.4 * Math.sin(time * 0.002 + s.twinkle);
      const alpha = s.brightness * p.starAlpha * twinkle;
      const size = s.size;

      g.fillStyle(0xffffff, alpha * 0.9);
      if (size < 1) {
        g.fillRect(sx, sy, 1, 1);
      } else {
        g.fillRect(sx, sy, size, size);
      }
      // Bright stars get a subtle glow
      if (s.brightness > 0.8) {
        g.fillStyle(p.glow, alpha * 0.15);
        g.fillRect(sx - 1, sy - 1, size + 2, size + 2);
      }
    }
  }

  // Draw sun/moon disc with glow
  drawSun(g, W, horizonY, playerWorldX, time) {
    if (!this.palette) return;
    const p = this.palette;
    const sunX = W * 0.7 - playerWorldX * 0.05 % W;
    const sunY = horizonY * 0.55;
    const sunR = 28;
    const pulse = 1 + Math.sin(time * 0.001) * 0.05;

    // Outer glow
    for (let i = 4; i >= 0; i--) {
      const r = sunR * (1 + i * 0.6) * pulse;
      const alpha = 0.08 / (i + 1);
      g.fillStyle(p.sunGlow, alpha);
      g.fillCircle(sunX, sunY, r);
    }

    // Core disc
    g.fillStyle(p.sunColor, 0.85);
    g.fillCircle(sunX, sunY, sunR * pulse);

    // Inner bright core
    g.fillStyle(0xffffff, 0.5);
    g.fillCircle(sunX - sunR * 0.2, sunY - sunR * 0.2, sunR * 0.5);
  }

  // Draw mountain silhouettes (two parallax layers)
  drawMountains(g, W, horizonY, playerWorldX, curveAccum) {
    if (!this.mountainsNear || !this.palette) return;
    const p = this.palette;
    const parallaxX = playerWorldX * 0.5 + curveAccum * 2;
    const parallaxXFar = playerWorldX * 0.25 + curveAccum;

    // Far layer
    this.drawMountainLayer(g, this.mountainsFar, W, horizonY, parallaxXFar, p.mountainFar, 0.8);

    // Near layer
    this.drawMountainLayer(g, this.mountainsNear, W, horizonY, parallaxX, p.mountain, 1);
  }

  drawMountainLayer(g, points, W, horizonY, offsetX, color, alpha) {
    const step = W / (points.length - 1);
    g.fillStyle(color, alpha);
    g.beginPath();
    g.moveTo(0, horizonY);

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const x = ((p.x - offsetX) % (W + step * 2) + (W + step * 2)) % (W + step * 2) - step;
      const y = horizonY + p.y;
      if (i === 0) {
        g.lineTo(x, y);
      } else {
        const prev = points[i - 1];
        const prevX = ((prev.x - offsetX) % (W + step * 2) + (W + step * 2)) % (W + step * 2) - step;
        // Draw jagged peak
        const midX = (prevX + x) / 2;
        const midY = Math.min(horizonY + prev.y, horizonY + p.y) - 10;
        g.lineTo(midX, midY);
        g.lineTo(x, y);
      }
    }

    g.lineTo(W, horizonY);
    g.closePath();
    g.fillPath();
  }

  update(time) {
    this.time = time;
  }
}

// Color lerp helper
function lerpColor(c1, c2, t) {
  const r1 = (c1 >> 16) & 0xff, g1 = (c1 >> 8) & 0xff, b1 = c1 & 0xff;
  const r2 = (c2 >> 16) & 0xff, g2 = (c2 >> 8) & 0xff, b2 = c2 & 0xff;
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return (r << 16) | (g << 8) | b;
}

export { SKY_PALETTES };