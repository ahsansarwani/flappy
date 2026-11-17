/* --------------------------------------------------------------
   Street Racer — Car Model Generator
   Mid-engine supercar silhouette (nose left), drawn on Canvas
   No external assets — all geometry drawn procedurally
   -------------------------------------------------------------- */

function shadeColor(color, percent) {
  const f = parseInt(color.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = percent < 0 ? percent * -1 : 0 - percent;
  const R = f >> 16;
  const G = (f >> 8) & 0x00ff;
  const B = f & 0xff;
  return `rgb(${Math.round((t - R) * p) + R},${Math.round((t - G) * p) + G},${Math.round((t - B) * p) + B})`;
}

function lightenColor(color, percent) {
  return shadeColor(color, -percent);
}

export function generateCarModel(ctx, color, w, h) {
  ctx.clearRect(0, 0, w, h);

  const cLighter = lightenColor(color, 0.35);
  const cDarker = shadeColor(color, 0.45);
  const cDarkest = shadeColor(color, 0.65);

  const g = h - 8;
  const r = Math.max(7, Math.round(h * 0.115));


  const wy = g - r;
  const H = h * 0.44;
  const yv = (f) => g - f * H;

  const noseX = 6;
  const tailX = w - 6;
  const L = tailX - noseX;
  const xv = (f) => noseX + f * L;
  const cx = w / 2;

  const fwX = xv(0.2);
  const rwX = xv(0.78);
  const cowlX = xv(0.42);
  const roofX1 = xv(0.55);
  const roofX2 = xv(0.68);
  const deckX = xv(0.85);
  const tailX2 = xv(0.96);

  const sillY = yv(0.12);
  const noseTopY = yv(0.28);
  const cowlY = yv(0.6);
  const roofY = yv(1);
  const deckY = yv(0.66);
  const tailTopY = yv(0.575);

  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(cx, g + 2, L * 0.45, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  const bodyGrad = ctx.createLinearGradient(0, roofY, 0, sillY);
  bodyGrad.addColorStop(0, shadeColor(color, -0.18));
  bodyGrad.addColorStop(1, color);
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(xv(0.045), sillY);
  ctx.lineTo(xv(0.035), noseTopY + 3);
  ctx.quadraticCurveTo(xv(0.03), noseTopY, xv(0.08), noseTopY - 1);
  ctx.bezierCurveTo(xv(0.135), yv(0.42), xv(0.16), yv(0.545), xv(0.2), yv(0.555));
  ctx.quadraticCurveTo(xv(0.245), yv(0.52), xv(0.28), yv(0.545));
  ctx.quadraticCurveTo(xv(0.35), yv(0.585), cowlX, yv(0.615));
  ctx.lineTo(roofX1, roofY);
  ctx.quadraticCurveTo(xv(0.615), roofY - 1.5, roofX2, roofY - 1);
  ctx.bezierCurveTo(xv(0.7), yv(0.82), xv(0.84), yv(0.68), tailX2, tailTopY);
  ctx.lineTo(xv(0.935), sillY);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = cDarker;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = 'rgba(5, 5, 10, 0.9)';
  ctx.beginPath();
  ctx.arc(fwX, wy, r + 1, Math.PI, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(rwX, wy, r + 2, Math.PI, Math.PI * 2);
  ctx.closePath();
  ctx.fill();

  const beltFrontY = yv(0.6);
  const beltRearY = yv(0.615);
  const glassRearX = xv(0.66);
  ctx.fillStyle = 'rgba(8, 10, 18, 0.88)';
  ctx.beginPath();
  ctx.moveTo(cowlX + 5, yv(0.585));
  ctx.lineTo(roofX1 + 3, roofY + 3);
  ctx.lineTo(roofX2 + 1, roofY + 3);
  ctx.lineTo(glassRearX, yv(0.615));
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = 'rgba(0, 243, 255, 0.16)';
  ctx.beginPath();
  ctx.moveTo(cowlX + 5, yv(0.585));
  ctx.lineTo(roofX1 + 3, roofY + 3);
  ctx.lineTo(roofX2 + 1, roofY + 3);
  ctx.lineTo(glassRearX, yv(0.615));
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cowlX + 5, yv(0.585));
  ctx.lineTo(roofX1 + 3, roofY + 3);
  ctx.lineTo(roofX1 + 9, roofY + 3);
  ctx.lineTo(cowlX + 11, yv(0.585));
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(roofX1 + 9, roofY + 3);
  ctx.lineTo(cowlX + 11, yv(0.585));
  ctx.stroke();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.moveTo(glassRearX, beltRearY);
  ctx.lineTo(roofX2 + 1, roofY + 4);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(roofX1 + 3, roofY + 1.5);
  ctx.lineTo(roofX2, roofY + 1.5);
  ctx.stroke();

  ctx.globalAlpha = 0.6;
  ctx.strokeStyle = cLighter;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cowlX + 2, beltFrontY);
  ctx.lineTo(xv(0.84), beltRearY);
  ctx.stroke();
  ctx.globalAlpha = 1;

  const sx1 = xv(0.7);
  const sx2 = xv(0.775);
  ctx.fillStyle = 'rgba(5, 5, 10, 0.55)';
  ctx.beginPath();
  ctx.moveTo(sx1, beltRearY + 2);
  ctx.lineTo(sx1 + L * 0.025, beltRearY + 4);
  ctx.lineTo(sx2, sillY - 8);
  ctx.lineTo(sx1 + L * 0.03, sillY - 6);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.strokeStyle = cDarker;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(xv(0.44), beltFrontY);
  ctx.lineTo(xv(0.42), sillY - 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(glassRearX + 3, beltRearY);
  ctx.lineTo(glassRearX + 1, sillY - 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(5, 5, 10, 0.55)';
  ctx.beginPath();
  ctx.moveTo(xv(0.29), sillY - 18);
  ctx.lineTo(xv(0.3), sillY - 18);
  ctx.lineTo(xv(0.315), sillY - 5);
  ctx.lineTo(xv(0.3), sillY - 5);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.fillRect(xv(0.13), sillY - 4, L * 0.74, 3);

  ctx.fillStyle = '#ffd23f';
  ctx.fillRect(xv(0.24), yv(0.5) + 2, 4, 3);

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(xv(0.085), noseTopY + 1);
  ctx.lineTo(xv(0.14), yv(0.4));
  ctx.lineTo(xv(0.135), yv(0.415));
  ctx.lineTo(xv(0.09), noseTopY + 3);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(0, 243, 255, 0.6)';
  ctx.fillRect(xv(0.095), noseTopY + 0.5, L * 0.035, 1);

  ctx.fillStyle = cDarkest;
  ctx.beginPath();
  ctx.moveTo(xv(0.05), sillY);
  ctx.lineTo(xv(0.095), sillY);
  ctx.lineTo(xv(0.085), yv(0.24));
  ctx.lineTo(xv(0.055), yv(0.26));
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ff3366';
  ctx.shadowColor = '#ff3366';
  ctx.shadowBlur = 6;
  ctx.fillRect(tailX2 - 11, tailTopY + 3, 8, 3);
  ctx.beginPath();
  ctx.arc(tailX2 - 7, tailTopY + 10, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = cDarkest;
  ctx.fillRect(xv(0.87), sillY - 6, L * 0.09, 6);

  ctx.fillStyle = '#9aa3b2';
  ctx.beginPath();
  ctx.arc(xv(0.93), sillY - 4, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = cDarkest;
  ctx.beginPath();
  ctx.moveTo(xv(0.035), sillY - 3);
  ctx.lineTo(xv(0.1), sillY);
  ctx.lineTo(xv(0.1), sillY - 2);
  ctx.lineTo(xv(0.05), sillY - 5);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(fwX + 12, sillY - 1);
  ctx.lineTo(rwX - 14, sillY - 1);
  ctx.stroke();
  ctx.shadowBlur = 0;

  const drawWheel = (x, rad) => {
    ctx.fillStyle = '#05050a';
    ctx.beginPath();
    ctx.arc(x, wy, rad, 0, Math.PI * 2);
    ctx.fill();
    const rimR = rad * 0.58;
    ctx.strokeStyle = cLighter;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, wy, rimR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5 + Math.PI / 5;
      ctx.beginPath();
      ctx.moveTo(x, wy);
      ctx.lineTo(x + Math.cos(a) * rimR, wy + Math.sin(a) * rimR);
      ctx.stroke();
    }
    ctx.fillStyle = cLighter;
    ctx.beginPath();
    ctx.arc(x, wy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  };
  drawWheel(fwX, r);
  drawWheel(rwX, r + 1);

  ctx.strokeStyle = cDarker;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(fwX, wy, r + 2, Math.PI * 1.08, Math.PI * 1.92);
  ctx.stroke();
  ctx.globalAlpha = 0.6;
  ctx.strokeStyle = cLighter;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(rwX, wy, r + 4, Math.PI * 1.08, Math.PI * 1.92);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

export function generateCarModelTexture(scene, color, w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const cx = canvas.getContext('2d');
  generateCarModel(cx, color, w, h);
  scene.textures.addCanvas('carModel_' + color.replace('#', ''), canvas);
  return 'carModel_' + color.replace('#', '');
}
