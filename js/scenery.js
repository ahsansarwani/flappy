/* --------------------------------------------------------------
   Street Racer — Roadside Scenery
   Procedural low-poly trees, crystals, pylons, rocks, bushes
   Multi-layer with trunks, canopies, glow accents
   -------------------------------------------------------------- */

function drawTree(g, x, baseY, size, color, glow, variant, theme) {
  if (size < 1.2) {
    g.fillStyle(glow, 1);
    g.fillRect(x - 0.5, baseY - 1, 1, 1);
    return;
  }

  // Trunk
  const trunkH = size * 2.2;
  const trunkW = Math.max(1, size * 0.35);
  g.fillStyle(0x1a0e08, 1);
  g.fillRect(x - trunkW / 2, baseY - trunkH, trunkW, trunkH);

  // Canopy layers (bottom to top)
  const h = size * 4.5;
  const w = size * 2;

  // Bottom layer
  g.fillStyle(color, 1);
  g.beginPath();
  g.moveTo(x, baseY - h);
  g.lineTo(x - w, baseY - h * 0.32);
  g.lineTo(x + w, baseY - h * 0.32);
  g.closePath();
  g.fillPath();

  // Mid layer (if variant allows)
  if (variant > 0.35) {
    const midY = baseY - h * 0.35;
    const midH = h * 0.5;
    g.fillStyle(color, 0.9);
    g.beginPath();
    g.moveTo(x, midY - midH);
    g.lineTo(x - w * 0.75, midY);
    g.lineTo(x + w * 0.75, midY);
    g.closePath();
    g.fillPath();
  }

  // Top highlight layer
  const topY = baseY - h;
  g.fillStyle(glow, 0.5);
  g.beginPath();
  g.moveTo(x, topY);
  g.lineTo(x - w * 0.3, topY + h * 0.22);
  g.lineTo(x + w * 0.3, topY + h * 0.22);
  g.closePath();
  g.fillPath();

  // Trunk glow at base
  g.fillStyle(glow, 0.3);
  g.fillRect(x - trunkW * 0.7, baseY - 2, trunkW * 1.4, 2);
}

function drawPylon(g, x, baseY, size, color, glow, variant, theme) {
  if (size < 1.2) {
    g.fillStyle(glow, 1);
    g.fillRect(x - 0.5, baseY - 2, 1, 2);
    return;
  }

  const h = size * 8;
  const w = Math.max(1.5, size * 1.2);

  // Main body (tapered)
  g.fillStyle(color, 1);
  g.beginPath();
  g.moveTo(x - w * 0.4, baseY);
  g.lineTo(x - w * 0.6, baseY - h);
  g.lineTo(x + w * 0.6, baseY - h);
  g.lineTo(x + w * 0.4, baseY);
  g.closePath();
  g.fillPath();

  // Neon bands
  const bands = Math.max(2, Math.floor(h / 18));
  for (let i = 0; i < bands; i++) {
    const by = baseY - ((i + 0.5) / bands) * h;
    const flicker = 0.6 + 0.4 * Math.sin(i * 1.3);
    g.fillStyle(glow, (i % 2 === 0 ? 0.9 : 0.35) * flicker);
    g.fillRect(x - w * 0.55, by, w * 1.1, Math.max(1, size * 0.6));
  }

  // Top cap glow
  g.fillStyle(glow, 0.8);
  g.fillRect(x - w * 0.8, baseY - h, w * 1.6, Math.max(1, size * 0.8));

  // Side accent (if variant)
  if (variant > 0.5) {
    g.fillStyle(glow, 0.4);
    g.fillRect(x - w * 0.9, baseY - h * 0.7, w * 0.3, h * 0.7);
    g.fillRect(x + w * 0.6, baseY - h * 0.7, w * 0.3, h * 0.7);
  }
}

function drawCrystal(g, x, baseY, size, color, glow, variant, theme) {
  if (size < 1.2) {
    g.fillStyle(glow, 1);
    g.fillRect(x - 0.5, baseY - 1, 1, 1);
    return;
  }

  const h = size * 6;
  const w = size * 1.6;

  // Main crystal
  g.fillStyle(color, 0.92);
  g.beginPath();
  g.moveTo(x, baseY - h);
  g.lineTo(x - w, baseY - h * 0.22);
  g.lineTo(x - w * 0.55, baseY);
  g.lineTo(x + w * 0.55, baseY);
  g.lineTo(x + w, baseY - h * 0.22);
  g.closePath();
  g.fillPath();

  // Right facet (brighter)
  g.fillStyle(glow, 0.65);
  g.beginPath();
  g.moveTo(x, baseY - h);
  g.lineTo(x, baseY);
  g.lineTo(x + w, baseY - h * 0.22);
  g.closePath();
  g.fillPath();

  // Left facet (dimmer)
  g.fillStyle(glow, 0.25);
  g.beginPath();
  g.moveTo(x, baseY - h);
  g.lineTo(x - w, baseY - h * 0.22);
  g.lineTo(x, baseY);
  g.closePath();
  g.fillPath();

  // Inner glow core
  g.fillStyle(0xffffff, 0.3);
  g.beginPath();
  g.moveTo(x, baseY - h * 0.85);
  g.lineTo(x - w * 0.15, baseY - h * 0.1);
  g.lineTo(x + w * 0.15, baseY - h * 0.1);
  g.closePath();
  g.fillPath();

  // Secondary crystal cluster (variant)
  if (variant > 0.45) {
    const h2 = h * 0.55;
    const w2 = w * 0.6;
    const x2 = x + w * 1.2;
    g.fillStyle(color, 0.85);
    g.beginPath();
    g.moveTo(x2, baseY - h2);
    g.lineTo(x2 - w2, baseY - h2 * 0.2);
    g.lineTo(x2 - w2 * 0.5, baseY);
    g.lineTo(x2 + w2 * 0.5, baseY);
    g.lineTo(x2 + w2, baseY - h2 * 0.2);
    g.closePath();
    g.fillPath();
    g.fillStyle(glow, 0.5);
    g.beginPath();
    g.moveTo(x2, baseY - h2);
    g.lineTo(x2, baseY);
    g.lineTo(x2 + w2, baseY - h2 * 0.2);
    g.closePath();
    g.fillPath();
  }

  // Tertiary tiny crystal
  if (variant > 0.7) {
    const h3 = h * 0.3;
    const w3 = w * 0.35;
    const x3 = x - w * 1.1;
    g.fillStyle(color, 0.8);
    g.beginPath();
    g.moveTo(x3, baseY - h3);
    g.lineTo(x3 - w3, baseY - h3 * 0.2);
    g.lineTo(x3 - w3 * 0.5, baseY);
    g.lineTo(x3 + w3 * 0.5, baseY);
    g.lineTo(x3 + w3, baseY - h3 * 0.2);
    g.closePath();
    g.fillPath();
  }
}

function drawRock(g, x, baseY, size, color, glow, variant) {
  if (size < 1.2) {
    g.fillStyle(color, 1);
    g.fillRect(x - 0.5, baseY - 1, 1, 1);
    return;
  }

  const w = size * 2.2;
  const h = size * 1.4;

  g.fillStyle(color, 1);
  g.beginPath();
  g.moveTo(x - w, baseY);
  g.lineTo(x - w * 0.7, baseY - h * 0.7);
  g.lineTo(x - w * 0.2, baseY - h);
  g.lineTo(x + w * 0.4, baseY - h * 0.85);
  g.lineTo(x + w * 0.8, baseY - h * 0.3);
  g.lineTo(x + w, baseY);
  g.closePath();
  g.fillPath();

  // Top facet highlight
  g.fillStyle(glow, 0.2);
  g.beginPath();
  g.moveTo(x - w * 0.2, baseY - h);
  g.lineTo(x + w * 0.4, baseY - h * 0.85);
  g.lineTo(x + w * 0.3, baseY - h * 0.5);
  g.lineTo(x - w * 0.1, baseY - h * 0.6);
  g.closePath();
  g.fillPath();
}

function drawBush(g, x, baseY, size, color, glow, variant) {
  if (size < 1.2) {
    g.fillStyle(glow, 0.8);
    g.fillRect(x - 0.5, baseY - 1, 1, 1);
    return;
  }

  const w = size * 2.5;
  const h = size * 1.8;

  // Clustered circles for bush shape
  const clusters = variant > 0.5 ? 3 : 2;
  for (let i = 0; i < clusters; i++) {
    const offset = (i - (clusters - 1) / 2) * w * 0.45;
    const r = w * (0.5 - i * 0.08);
    const cy = baseY - h * 0.35 - (i % 2) * h * 0.2;
    g.fillStyle(color, 0.9 - i * 0.1);
    g.fillCircle(x + offset, cy, r);
  }

  // Highlight
  g.fillStyle(glow, 0.3);
  g.fillCircle(x - w * 0.15, baseY - h * 0.6, w * 0.25);
}

// Guardrail post (small roadside marker) — exported wrapper
export function drawGuardPost(g, x, baseY, scale, side) {
  const size = scale * 30;
  const glow = side < 0 ? 0x00f3ff : 0xff00ff;
  drawGuardPostInner(g, x, baseY, size, glow);
}

function drawGuardPostInner(g, x, baseY, size, glow) {
  if (size < 0.8) {
    g.fillStyle(glow, 0.8);
    g.fillRect(x - 0.5, baseY - 1, 1, 1);
    return;
  }
  const h = size * 3;
  const w = Math.max(1, size * 0.6);
  g.fillStyle(0x2a2a3a, 1);
  g.fillRect(x - w / 2, baseY - h, w, h);
  g.fillStyle(glow, 0.9);
  g.fillRect(x - w / 2, baseY - h, w, Math.max(1, size * 0.4));
}

const SCENERY_DRAWERS = {
  tree: drawTree,
  pylon: drawPylon,
  crystal: drawCrystal,
  rock: drawRock,
  bush: drawBush,
};

export function drawSceneryItem(g, item, cx, baseY, scale, horizonY, H) {
  if (!item || scale < 0.01 || baseY < horizonY - H * 0.25) return;

  const size = scale * 55;
  const drawer = SCENERY_DRAWERS[item.type] || drawTree;
  const color = item.type === 'crystal' ? 0x1c0f2e : item.type === 'rock' ? 0x1a1a24 : 0x0c1a10;
  const glow =
    item.type === 'pylon' ? 0xff00ff :
    item.type === 'crystal' ? 0x00f3ff :
    item.type === 'rock' ? 0x4a4a6a :
    item.type === 'bush' ? 0x2a8a4a :
    0x39ff88;

  drawer(g, cx, baseY, size, color, glow, item.variant, item.type);
}

// On-road obstacle tree with lean/fall animation
export function drawObstacleTree(g, x, baseY, scale, lean, alpha) {
  const size = scale * 60;
  if (size < 1) {
    g.fillStyle(0x39ff88, alpha);
    g.fillRect(x - 0.5, baseY - 1, 1, 1);
    return;
  }

  const h = size * 4.6;
  const w = size * 2;
  const topX = x + lean * h * 0.55;

  // Ground shadow
  g.fillStyle(0x000000, 0.3 * alpha);
  g.fillEllipse(x, baseY + 2, w * 1.6, Math.max(2, size * 0.5));

  // Trunk (leaning quad)
  const trunkW = Math.max(1, size * 0.4);
  g.fillStyle(0x1a0e08, alpha);
  g.beginPath();
  g.moveTo(x - trunkW / 2, baseY);
  g.lineTo(x + trunkW / 2, baseY);
  g.lineTo(topX + trunkW * 0.3, baseY - h * 0.55);
  g.lineTo(topX - trunkW * 0.3, baseY - h * 0.55);
  g.closePath();
  g.fillPath();

  // Canopy layers (bottom to top), offset along the lean
  const layers = 3;
  for (let i = 0; i < layers; i++) {
    const t = i / layers;
    const cy = baseY - h * (0.35 + t * 0.6);
    const cx = x + (topX - x) * (0.35 + t * 0.6);
    const lw = w * (1 - t * 0.45);
    g.fillStyle(i === layers - 1 ? 0x2adf7a : 0x0c1a10, alpha);
    g.beginPath();
    g.moveTo(cx, cy - h * 0.22);
    g.lineTo(cx - lw, cy);
    g.lineTo(cx + lw, cy);
    g.closePath();
    g.fillPath();
    // Neon rim on the top canopy layer
    if (i === layers - 1) {
      g.fillStyle(0x39ff88, 0.35 * alpha);
      g.beginPath();
      g.moveTo(cx, cy - h * 0.22);
      g.lineTo(cx - lw * 0.4, cy - h * 0.05);
      g.lineTo(cx + lw * 0.4, cy - h * 0.05);
      g.closePath();
      g.fillPath();
    }
  }
}