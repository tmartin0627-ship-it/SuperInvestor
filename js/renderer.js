class BackgroundRenderer {
  constructor() {
    // Pre-generate building data for 3 parallax layers
    this.layers = [
      this._generateBuildings(15, 0.1, 0.5),   // Far - small, dark
      this._generateBuildings(12, 0.3, 0.7),   // Mid
      this._generateBuildings(10, 0.5, 0.9),   // Near - tall, visible
    ];

    // Star positions
    this.stars = [];
    for (let i = 0; i < 80; i++) {
      this.stars.push({
        x: Math.random() * 2000,
        y: Math.random() * 300,
        size: Math.random() * 2 + 0.5,
        twinkle: Math.random() * Math.PI * 2
      });
    }
  }

  _generateBuildings(count, parallax, alpha) {
    const buildings = [];
    let x = -100;
    for (let i = 0; i < count; i++) {
      const w = 60 + Math.random() * 100;
      const h = 120 + Math.random() * 280;
      const windowCols = Math.floor(w / 18);
      const windowRows = Math.floor(h / 18);
      const windows = [];
      for (let r = 0; r < windowRows; r++) {
        for (let c = 0; c < windowCols; c++) {
          windows.push(Math.random() > 0.35);
        }
      }
      buildings.push({
        x: x, w: w, h: h,
        color: [CONFIG.COLORS.BUILDING_1, CONFIG.COLORS.BUILDING_2,
                CONFIG.COLORS.BUILDING_3, CONFIG.COLORS.BUILDING_4][i % 4],
        windowCols: windowCols,
        windowRows: windowRows,
        windows: windows,
        hasAntenna: Math.random() > 0.6,
        antennaHeight: 20 + Math.random() * 30
      });
      x += w + 15 + Math.random() * 40;
    }
    return { buildings: buildings, parallax: parallax, alpha: alpha, totalWidth: x };
  }

  render(ctx, camera, canvasWidth, canvasHeight, time) {
    // Sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    grad.addColorStop(0, CONFIG.COLORS.SKY_TOP);
    grad.addColorStop(0.5, CONFIG.COLORS.SKY_MID);
    grad.addColorStop(1, CONFIG.COLORS.SKY_BOTTOM);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Moon
    ctx.fillStyle = '#FFFFEE';
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(canvasWidth * 0.82 - camera.x * 0.02, 60, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.arc(canvasWidth * 0.82 - camera.x * 0.02, 60, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Stars
    for (const star of this.stars) {
      const sx = ((star.x - camera.x * 0.03) % (canvasWidth + 100));
      const twinkle = Math.sin(time * 2 + star.twinkle) * 0.3 + 0.7;
      ctx.globalAlpha = twinkle * 0.8;
      ctx.fillStyle = CONFIG.COLORS.WHITE;
      ctx.fillRect(sx, star.y, star.size, star.size);
    }
    ctx.globalAlpha = 1;

    // Building layers (back to front)
    for (const layer of this.layers) {
      this._renderBuildingLayer(ctx, camera, canvasWidth, canvasHeight, layer, time);
    }
  }

  _renderBuildingLayer(ctx, camera, canvasWidth, canvasHeight, layer, time) {
    ctx.globalAlpha = layer.alpha;
    const offsetX = camera.x * layer.parallax;

    for (const b of layer.buildings) {
      // Repeat buildings seamlessly
      const repeatW = layer.totalWidth;
      let drawX = ((b.x - offsetX) % repeatW);
      if (drawX > canvasWidth + 200) drawX -= repeatW;
      if (drawX + b.w < -200) drawX += repeatW;

      // Still off-screen? try one more wrap
      if (drawX > canvasWidth + 200) continue;
      if (drawX + b.w < -200) continue;

      const by = canvasHeight - b.h;

      // Building body
      ctx.fillStyle = b.color;
      ctx.fillRect(drawX, by, b.w, b.h);

      // Roof edge
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(drawX, by, b.w, 3);

      // Antenna
      if (b.hasAntenna) {
        ctx.fillStyle = '#555';
        ctx.fillRect(drawX + b.w / 2 - 1, by - b.antennaHeight, 3, b.antennaHeight);
        // Blinking light
        const blink = Math.sin(time * 3 + b.x) > 0.5;
        if (blink) {
          ctx.fillStyle = '#FF0000';
          ctx.beginPath();
          ctx.arc(drawX + b.w / 2, by - b.antennaHeight, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Windows
      const wSize = 8;
      const wGap = 14;
      const startX = drawX + 8;
      const startY = by + 12;
      for (let r = 0; r < b.windowRows; r++) {
        for (let c = 0; c < b.windowCols; c++) {
          const idx = r * b.windowCols + c;
          const lit = b.windows[idx];
          if (lit) {
            // Occasionally flicker
            const flicker = Math.sin(time * 0.5 + idx * 7.3) > -0.95;
            ctx.fillStyle = flicker ?
              (idx % 3 === 0 ? CONFIG.COLORS.WINDOW_LIT_2 : CONFIG.COLORS.WINDOW_LIT) :
              CONFIG.COLORS.WINDOW_DARK;
          } else {
            ctx.fillStyle = CONFIG.COLORS.WINDOW_DARK;
          }
          ctx.fillRect(startX + c * wGap, startY + r * wGap, wSize, wSize);
        }
      }
    }
    ctx.globalAlpha = 1;
  }
}

function renderGoldenBriefcase(ctx, camera, pos, time) {
  const sx = pos.x - camera.x;
  const sy = pos.y - camera.y;

  // Glow pulse
  const glowSize = 40 + Math.sin(time * 3) * 8;
  ctx.globalAlpha = 0.2 + Math.sin(time * 3) * 0.1;
  ctx.fillStyle = CONFIG.COLORS.BULL_GOLD;
  ctx.beginPath();
  ctx.arc(sx + 24, sy + 20, glowSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Rays of light
  ctx.strokeStyle = 'rgba(255,215,0,0.3)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const angle = time * 0.5 + i * Math.PI / 4;
    const innerR = 30;
    const outerR = 50 + Math.sin(time * 2 + i) * 10;
    ctx.beginPath();
    ctx.moveTo(sx + 24 + Math.cos(angle) * innerR, sy + 20 + Math.sin(angle) * innerR);
    ctx.lineTo(sx + 24 + Math.cos(angle) * outerR, sy + 20 + Math.sin(angle) * outerR);
    ctx.stroke();
  }

  // Briefcase body
  ctx.fillStyle = CONFIG.COLORS.BULL_GOLD;
  ctx.fillRect(sx + 2, sy + 10, 44, 28);

  // Briefcase top edge
  ctx.fillStyle = '#FFE44D';
  ctx.fillRect(sx + 2, sy + 10, 44, 4);

  // Handle
  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(sx + 24, sy + 10, 10, Math.PI, 0);
  ctx.stroke();

  // Clasp
  ctx.fillStyle = CONFIG.COLORS.WHITE;
  ctx.fillRect(sx + 20, sy + 24, 8, 4);

  // Dollar sign
  ctx.fillStyle = '#B8860B';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('$', sx + 24, sy + 28);

  // Floating sparkles
  for (let i = 0; i < 4; i++) {
    const angle = time * 1.5 + i * Math.PI / 2;
    const dist = 35;
    const px = sx + 24 + Math.cos(angle) * dist;
    const py = sy + 20 + Math.sin(angle) * dist * 0.7;
    ctx.globalAlpha = 0.5 + Math.sin(time * 4 + i) * 0.3;
    ctx.fillStyle = CONFIG.COLORS.WHITE;
    // Star shape
    ctx.beginPath();
    ctx.moveTo(px, py - 3);
    ctx.lineTo(px + 1, py - 1);
    ctx.lineTo(px + 3, py);
    ctx.lineTo(px + 1, py + 1);
    ctx.lineTo(px, py + 3);
    ctx.lineTo(px - 1, py + 1);
    ctx.lineTo(px - 3, py);
    ctx.lineTo(px - 1, py - 1);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
