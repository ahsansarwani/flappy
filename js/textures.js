/* --------------------------------------------------------------
   Street Racer — Texture Generation
   Procedural car textures (no external assets)
   -------------------------------------------------------------- */
import { CARS } from './config.js';

function shadeColor(color, percent) {
  const f = parseInt(color.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = percent < 0 ? percent * -1 : percent;
  const R = f >> 16;
  const G = (f >> 8) & 0x00ff;
  const B = f & 0x00ff;
  return `rgb(${Math.round((t - R) * p) + R},${Math.round((t - G) * p) + G},${Math.round((t - B) * p) + B})`;
}

export function generateCarTexture(ctx, color, w, h) {
  ctx.clearRect(0, 0, w, h);

  // body
  ctx.fillStyle = color;
  ctx.fillRect(10, 10, 80, 40);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(12, 14, 76, 20);
  // cockpit
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(20, 16, 60, 12);
  // wheels
  ctx.fillStyle = '#111';
  ctx.fillRect(8, 8, 10, 20);
  ctx.fillRect(82, 8, 10, 20);
  ctx.fillRect(8, 32, 10, 20);
  ctx.fillRect(82, 32, 10, 20);
  // neon outline
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, 80, 40);
}

// Top-down rear-view supercar (nose points up/forward into the screen)
export function generateSupercarTexture(ctx, color, w, h) {
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const bodyW = w * 0.72;
  const bodyL = h * 0.88;
  const topY = (h - bodyL) / 2;
  const botY = topY + bodyL;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(cx, botY + 2, bodyW * 0.45, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- MAIN BODY (tapered: wide at rear, narrow at front) ---
  const bodyGrad = ctx.createLinearGradient(0, topY, 0, botY);
  bodyGrad.addColorStop(0, shadeColor(color, -0.15));
  bodyGrad.addColorStop(0.5, color);
  bodyGrad.addColorStop(1, shadeColor(color, -0.3));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  // rear (bottom, wide)
  ctx.moveTo(cx - bodyW * 0.5, botY - 4);
  ctx.lineTo(cx + bodyW * 0.5, botY - 4);
  // right side tapering up
  ctx.lineTo(cx + bodyW * 0.42, topY + bodyL * 0.35);
  ctx.lineTo(cx + bodyW * 0.22, topY + 2);
  // nose (top, narrow)
  ctx.lineTo(cx - bodyW * 0.22, topY + 2);
  // left side tapering down
  ctx.lineTo(cx - bodyW * 0.42, topY + bodyL * 0.35);
  ctx.closePath();
  ctx.fill();

  // Body outline
  ctx.strokeStyle = shadeColor(color, -0.4);
  ctx.lineWidth = 1;
  ctx.stroke();

  // --- REAR BUMPER / DIFFUSER (bottom) ---
  ctx.fillStyle = shadeColor(color, -0.5);
  ctx.fillRect(cx - bodyW * 0.48, botY - 8, bodyW * 0.96, 6);
  // Diffuser fins
  ctx.fillStyle = shadeColor(color, -0.6);
  for (let i = -2; i <= 2; i++) {
    ctx.fillRect(cx + i * bodyW * 0.16 - 1, botY - 7, 2, 4);
  }

  // --- TAILLIGHTS (rear, left + right) ---
  ctx.fillStyle = '#ff3366';
  ctx.shadowColor = '#ff3366';
  ctx.shadowBlur = 6;
  ctx.fillRect(cx - bodyW * 0.42, botY - 12, bodyW * 0.2, 3);
  ctx.fillRect(cx + bodyW * 0.22, botY - 12, bodyW * 0.2, 3);
  ctx.shadowBlur = 0;

  // --- ENGINE COVER / REAR WINDOW (dark, center-lower) ---
  ctx.fillStyle = 'rgba(8, 10, 18, 0.92)';
  ctx.beginPath();
  ctx.moveTo(cx - bodyW * 0.3, botY - 14);
  ctx.lineTo(cx + bodyW * 0.3, botY - 14);
  ctx.lineTo(cx + bodyW * 0.26, botY - 28);
  ctx.lineTo(cx - bodyW * 0.26, botY - 28);
  ctx.closePath();
  ctx.fill();

  // Engine vents (slats on rear window)
  ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    const vy = botY - 17 - i * 4;
    ctx.beginPath();
    ctx.moveTo(cx - bodyW * 0.22, vy);
    ctx.lineTo(cx + bodyW * 0.22, vy);
    ctx.stroke();
  }

  // --- ROOF / CABIN (center) ---
  ctx.fillStyle = 'rgba(15, 18, 28, 0.95)';
  ctx.beginPath();
  ctx.moveTo(cx - bodyW * 0.28, botY - 28);
  ctx.lineTo(cx + bodyW * 0.28, botY - 28);
  ctx.lineTo(cx + bodyW * 0.24, topY + bodyL * 0.4);
  ctx.lineTo(cx - bodyW * 0.24, topY + bodyL * 0.4);
  ctx.closePath();
  ctx.fill();

  // Roof highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(cx - bodyW * 0.2, topY + bodyL * 0.42, bodyW * 0.4, 2);

  // --- WINDSHIELD (tinted, upper-center) ---
  const glassGrad = ctx.createLinearGradient(0, topY + bodyL * 0.25, 0, topY + bodyL * 0.42);
  glassGrad.addColorStop(0, 'rgba(0, 243, 255, 0.12)');
  glassGrad.addColorStop(1, 'rgba(0, 243, 255, 0.28)');
  ctx.fillStyle = glassGrad;
  ctx.beginPath();
  ctx.moveTo(cx - bodyW * 0.24, topY + bodyL * 0.4);
  ctx.lineTo(cx + bodyW * 0.24, topY + bodyL * 0.4);
  ctx.lineTo(cx + bodyW * 0.2, topY + bodyL * 0.25);
  ctx.lineTo(cx - bodyW * 0.2, topY + bodyL * 0.25);
  ctx.closePath();
  ctx.fill();

  // Windshield reflection streak
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - bodyW * 0.14, topY + bodyL * 0.28);
  ctx.lineTo(cx + bodyW * 0.08, topY + bodyL * 0.38);
  ctx.stroke();

  // --- HOOD (upper body, between windshield and nose) ---
  ctx.fillStyle = shadeColor(color, -0.08);
  ctx.beginPath();
  ctx.moveTo(cx - bodyW * 0.2, topY + bodyL * 0.25);
  ctx.lineTo(cx + bodyW * 0.2, topY + bodyL * 0.25);
  ctx.lineTo(cx + bodyW * 0.16, topY + 4);
  ctx.lineTo(cx - bodyW * 0.16, topY + 4);
  ctx.closePath();
  ctx.fill();

  // Hood center line
  ctx.strokeStyle = shadeColor(color, -0.3);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, topY + bodyL * 0.25);
  ctx.lineTo(cx, topY + 4);
  ctx.stroke();

  // --- HEADLIGHTS (front, left + right) ---
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.moveTo(cx - bodyW * 0.2, topY + 5);
  ctx.lineTo(cx - bodyW * 0.08, topY + 3);
  ctx.lineTo(cx - bodyW * 0.08, topY + 7);
  ctx.lineTo(cx - bodyW * 0.18, topY + 8);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + bodyW * 0.2, topY + 5);
  ctx.lineTo(cx + bodyW * 0.08, topY + 3);
  ctx.lineTo(cx + bodyW * 0.08, topY + 7);
  ctx.lineTo(cx + bodyW * 0.18, topY + 8);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;

  // --- FRONT SPLITTER (nose tip) ---
  ctx.fillStyle = shadeColor(color, -0.5);
  ctx.beginPath();
  ctx.moveTo(cx - bodyW * 0.16, topY + 4);
  ctx.lineTo(cx + bodyW * 0.16, topY + 4);
  ctx.lineTo(cx + bodyW * 0.12, topY);
  ctx.lineTo(cx - bodyW * 0.12, topY);
  ctx.closePath();
  ctx.fill();

  // --- WHEELS (4, on the sides) ---
  const wheelW = Math.max(4, bodyW * 0.1);
  const wheelH = Math.max(6, bodyL * 0.16);
  const wheelY1 = topY + bodyL * 0.22; // front
  const wheelY2 = botY - bodyL * 0.2;  // rear

  // Front left
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(cx - bodyW * 0.52, wheelY1, wheelW, wheelH);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(cx - bodyW * 0.52, wheelY1, wheelW, wheelH);
  // Front right
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(cx + bodyW * 0.42, wheelY1, wheelW, wheelH);
  ctx.strokeRect(cx + bodyW * 0.42, wheelY1, wheelW, wheelH);
  // Rear left
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(cx - bodyW * 0.52, wheelY2, wheelW, wheelH);
  ctx.strokeRect(cx - bodyW * 0.52, wheelY2, wheelW, wheelH);
  // Rear right
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(cx + bodyW * 0.42, wheelY2, wheelW, wheelH);
  ctx.strokeRect(cx + bodyW * 0.42, wheelY2, wheelW, wheelH);

  // --- NEON SIDE ACCENT STRIPS ---
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  // Left strip
  ctx.beginPath();
  ctx.moveTo(cx - bodyW * 0.48, botY - 10);
  ctx.lineTo(cx - bodyW * 0.38, topY + bodyL * 0.3);
  ctx.stroke();
  // Right strip
  ctx.beginPath();
  ctx.moveTo(cx + bodyW * 0.48, botY - 10);
  ctx.lineTo(cx + bodyW * 0.38, topY + bodyL * 0.3);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // --- SIDE SKIRT (darker strip along bottom edge) ---
  ctx.fillStyle = shadeColor(color, -0.4);
  ctx.fillRect(cx - bodyW * 0.48, botY - 10, bodyW * 0.12, 4);
  ctx.fillRect(cx + bodyW * 0.36, botY - 10, bodyW * 0.12, 4);
}

export function generateTextures(scene) {
  const tex = scene.textures;
  const carSpecs = Object.values(CARS);

  carSpecs.forEach((spec) => {
    const texW = (spec.spriteW || 100) * 4;
    const texH = (spec.spriteH || 60) * 4;
    const canvas = document.createElement('canvas');
    canvas.width = texW;
    canvas.height = texH;
    const cx = canvas.getContext('2d');
    // All cars use the detailed supercar texture (matches homepage car model quality)
    generateSupercarTexture(cx, spec.color, texW, texH);
    tex.addCanvas(spec.id, canvas);
  });

  // particle texture (glow dot)
  const pcanvas = document.createElement('canvas');
  pcanvas.width = 16;
  pcanvas.height = 16;
  const pctx = pcanvas.getContext('2d');
  const grad = pctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  pctx.fillStyle = grad;
  pctx.fillRect(0, 0, 16, 16);
  tex.addCanvas('particle', pcanvas);
}
