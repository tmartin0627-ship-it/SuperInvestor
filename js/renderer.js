class BackgroundRenderer {
  constructor(theme) {
    this.theme = theme || 'nightCity';

    if (this.theme === 'nightCity') {
      this._initNightCity();
    } else if (this.theme === 'tradingFloor') {
      this._initTradingFloor();
    } else if (this.theme === 'cryptoMines') {
      this._initCryptoMines();
    }
  }

  // ==============================
  //  Night City (Level 1) - init
  // ==============================
  _initNightCity() {
    this.layers = [
      this._generateBuildings(15, 0.1, 0.5),
      this._generateBuildings(12, 0.3, 0.7),
      this._generateBuildings(10, 0.5, 0.9),
    ];
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

  // ==============================
  //  Trading Floor (Level 2) - init
  // ==============================
  _initTradingFloor() {
    this.layers = [
      this._generateTerminals(18, 0.1, 0.4),
      this._generateTerminals(14, 0.3, 0.6),
      this._generateTerminals(10, 0.5, 0.85),
    ];
    // No stars — indoor
    this.stars = [];
  }

  _generateTerminals(count, parallax, alpha) {
    const terminals = [];
    let x = -80;
    for (let i = 0; i < count; i++) {
      const w = 40 + Math.random() * 80;
      const h = 80 + Math.random() * 200;
      const screenCount = Math.floor(h / 30);
      const screens = [];
      for (let s = 0; s < screenCount; s++) {
        screens.push({
          isGreen: Math.random() > 0.4,
          barCount: 3 + Math.floor(Math.random() * 5),
          hasNumber: Math.random() > 0.5,
        });
      }
      terminals.push({
        x: x, w: w, h: h,
        color: ['#2a2018', '#332818', '#2e2418', '#261e14'][i % 4],
        screenCount: screenCount,
        screens: screens,
        isColumn: Math.random() > 0.7,
        columnColor: ['#4a4a5a', '#555565', '#504a5a'][i % 3],
      });
      x += w + 10 + Math.random() * 30;
    }
    return { buildings: terminals, parallax: parallax, alpha: alpha, totalWidth: x };
  }

  // ==============================
  //  Crypto Mines (Level 3) - init
  // ==============================
  _initCryptoMines() {
    this.layers = [
      this._generateServerRacks(18, 0.1, 0.4),
      this._generateServerRacks(14, 0.3, 0.65),
      this._generateServerRacks(10, 0.5, 0.85),
    ];
    // Floating crypto symbols instead of stars
    this.cryptoSymbols = [];
    const symbols = ['BTC', 'ETH', 'DOGE', 'SOL', 'XRP', 'ADA', 'DOT', 'LTC'];
    for (let i = 0; i < 40; i++) {
      this.cryptoSymbols.push({
        x: Math.random() * 2000,
        y: Math.random() * 280,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        speed: 5 + Math.random() * 15,
        phase: Math.random() * Math.PI * 2,
        size: 8 + Math.random() * 4,
      });
    }
    // Matrix falling characters
    this.matrixColumns = [];
    for (let i = 0; i < 60; i++) {
      this.matrixColumns.push({
        x: Math.random() * 2000,
        chars: [],
        speed: 30 + Math.random() * 60,
        phase: Math.random() * 500,
        charCount: 5 + Math.floor(Math.random() * 10),
      });
      for (let j = 0; j < this.matrixColumns[i].charCount; j++) {
        this.matrixColumns[i].chars.push(String.fromCharCode(0x30 + Math.floor(Math.random() * 10)));
      }
    }
    // Stalactites from top
    this.stalactites = [];
    for (let i = 0; i < 30; i++) {
      this.stalactites.push({
        x: Math.random() * 2000,
        length: 20 + Math.random() * 60,
        width: 4 + Math.random() * 12,
      });
    }
    this.stars = [];
  }

  _generateServerRacks(count, parallax, alpha) {
    const racks = [];
    let x = -80;
    for (let i = 0; i < count; i++) {
      const w = 30 + Math.random() * 60;
      const h = 100 + Math.random() * 250;
      const ledCount = Math.floor(h / 12);
      const leds = [];
      for (let l = 0; l < ledCount; l++) {
        leds.push({
          color: Math.random() > 0.5 ? '#00FFCC' : '#FF00FF',
          blink: Math.random() > 0.3,
          phase: Math.random() * Math.PI * 2,
        });
      }
      racks.push({
        x: x, w: w, h: h,
        color: ['#0a0a1a', '#0e0e22', '#0c0c1e', '#08081a'][i % 4],
        ledCount: ledCount,
        leds: leds,
        hasNode: Math.random() > 0.6,
        nodeColor: Math.random() > 0.5 ? '#00CCFF' : '#AA44FF',
      });
      x += w + 8 + Math.random() * 25;
    }
    return { buildings: racks, parallax: parallax, alpha: alpha, totalWidth: x };
  }

  // ==============================
  //  Main render dispatcher
  // ==============================
  render(ctx, camera, canvasWidth, canvasHeight, time) {
    if (this.theme === 'nightCity') {
      this._renderNightCity(ctx, camera, canvasWidth, canvasHeight, time);
    } else if (this.theme === 'tradingFloor') {
      this._renderTradingFloor(ctx, camera, canvasWidth, canvasHeight, time);
    } else if (this.theme === 'cryptoMines') {
      this._renderCryptoMines(ctx, camera, canvasWidth, canvasHeight, time);
    }
  }

  // ==============================
  //  Night City rendering
  // ==============================
  _renderNightCity(ctx, camera, canvasWidth, canvasHeight, time) {
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

    // Building layers
    for (const layer of this.layers) {
      this._renderBuildingLayer(ctx, camera, canvasWidth, canvasHeight, layer, time);
    }
  }

  _renderBuildingLayer(ctx, camera, canvasWidth, canvasHeight, layer, time) {
    ctx.globalAlpha = layer.alpha;
    const offsetX = camera.x * layer.parallax;

    for (const b of layer.buildings) {
      const repeatW = layer.totalWidth;
      let drawX = ((b.x - offsetX) % repeatW);
      if (drawX > canvasWidth + 200) drawX -= repeatW;
      if (drawX + b.w < -200) drawX += repeatW;
      if (drawX > canvasWidth + 200) continue;
      if (drawX + b.w < -200) continue;

      const by = canvasHeight - b.h;

      ctx.fillStyle = b.color;
      ctx.fillRect(drawX, by, b.w, b.h);

      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(drawX, by, b.w, 3);

      if (b.hasAntenna) {
        ctx.fillStyle = '#555';
        ctx.fillRect(drawX + b.w / 2 - 1, by - b.antennaHeight, 3, b.antennaHeight);
        const blink = Math.sin(time * 3 + b.x) > 0.5;
        if (blink) {
          ctx.fillStyle = '#FF0000';
          ctx.beginPath();
          ctx.arc(drawX + b.w / 2, by - b.antennaHeight, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const wSize = 8;
      const wGap = 14;
      const startX = drawX + 8;
      const startY = by + 12;
      for (let r = 0; r < b.windowRows; r++) {
        for (let c = 0; c < b.windowCols; c++) {
          const idx = r * b.windowCols + c;
          const lit = b.windows[idx];
          if (lit) {
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

  // ==============================
  //  Trading Floor rendering
  // ==============================
  _renderTradingFloor(ctx, camera, canvasWidth, canvasHeight, time) {
    // Warm amber sky gradient (indoor ceiling)
    const grad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    grad.addColorStop(0, '#2a1a00');
    grad.addColorStop(0.5, '#3a2a10');
    grad.addColorStop(1, '#4a3a20');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Warm ambient glow from ceiling
    ctx.globalAlpha = 0.15;
    const ceilGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight * 0.4);
    ceilGrad.addColorStop(0, '#FF8800');
    ceilGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = ceilGrad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight * 0.4);
    ctx.globalAlpha = 1;

    // Ceiling light fixtures
    for (let i = 0; i < 6; i++) {
      const lx = ((i * 180 - camera.x * 0.05) % (canvasWidth + 200));
      const pulse = 0.3 + Math.sin(time * 1.5 + i * 1.7) * 0.1;
      ctx.globalAlpha = pulse;
      ctx.fillStyle = '#FFAA44';
      ctx.fillRect(lx, 0, 60, 4);
      // Light cone
      ctx.beginPath();
      ctx.moveTo(lx, 4);
      ctx.lineTo(lx - 20, 80);
      ctx.lineTo(lx + 80, 80);
      ctx.lineTo(lx + 60, 4);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,170,68,0.04)';
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Terminal/column layers
    for (const layer of this.layers) {
      this._renderTerminalLayer(ctx, camera, canvasWidth, canvasHeight, layer, time);
    }
  }

  _renderTerminalLayer(ctx, camera, canvasWidth, canvasHeight, layer, time) {
    ctx.globalAlpha = layer.alpha;
    const offsetX = camera.x * layer.parallax;

    for (const t of layer.buildings) {
      const repeatW = layer.totalWidth;
      let drawX = ((t.x - offsetX) % repeatW);
      if (drawX > canvasWidth + 200) drawX -= repeatW;
      if (drawX + t.w < -200) drawX += repeatW;
      if (drawX > canvasWidth + 200) continue;
      if (drawX + t.w < -200) continue;

      const by = canvasHeight - t.h;

      if (t.isColumn) {
        // Stone column
        ctx.fillStyle = t.columnColor;
        ctx.fillRect(drawX + t.w * 0.2, by, t.w * 0.6, t.h);
        // Column cap
        ctx.fillStyle = '#6a6a7a';
        ctx.fillRect(drawX, by, t.w, 6);
        ctx.fillRect(drawX + 2, by + 6, t.w - 4, 4);
      } else {
        // Terminal desk body
        ctx.fillStyle = t.color;
        ctx.fillRect(drawX, by, t.w, t.h);

        // Top edge
        ctx.fillStyle = 'rgba(255,200,100,0.08)';
        ctx.fillRect(drawX, by, t.w, 3);

        // Screens on terminals
        const screenH = 18;
        const screenGap = 26;
        for (let s = 0; s < t.screenCount; s++) {
          const sy = by + 10 + s * screenGap;
          if (sy + screenH > canvasHeight) break;
          const screen = t.screens[s];

          // Screen background
          ctx.fillStyle = '#0a1a0a';
          ctx.fillRect(drawX + 4, sy, t.w - 8, screenH);

          // Stock chart bars
          const barW = Math.max(2, (t.w - 16) / screen.barCount);
          for (let b = 0; b < screen.barCount; b++) {
            const barH = 4 + Math.abs(Math.sin(time * 0.8 + s * 3 + b * 2.1)) * (screenH - 6);
            const isGreen = Math.sin(time * 0.3 + s + b * 1.7) > 0;
            ctx.fillStyle = isGreen ? '#00CC66' : '#CC3333';
            ctx.fillRect(drawX + 6 + b * barW, sy + screenH - barH - 1, barW - 1, barH);
          }

          // Screen glow edge
          ctx.strokeStyle = screen.isGreen ? 'rgba(0,204,102,0.2)' : 'rgba(204,51,51,0.2)';
          ctx.lineWidth = 1;
          ctx.strokeRect(drawX + 4, sy, t.w - 8, screenH);
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  // ==============================
  //  Crypto Mines rendering
  // ==============================
  _renderCryptoMines(ctx, camera, canvasWidth, canvasHeight, time) {
    // Deep purple underground gradient
    const grad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    grad.addColorStop(0, '#0a0020');
    grad.addColorStop(0.5, '#150030');
    grad.addColorStop(1, '#0a0a2a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Matrix falling characters (far background)
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    for (const col of this.matrixColumns) {
      const mx = ((col.x - camera.x * 0.05) % (canvasWidth + 100));
      for (let j = 0; j < col.charCount; j++) {
        const my = ((col.phase + time * col.speed + j * 14) % (canvasHeight + 50)) - 20;
        const fade = j === 0 ? 0.5 : 0.12 + (col.charCount - j) / col.charCount * 0.15;
        ctx.globalAlpha = fade;
        ctx.fillStyle = j === 0 ? '#44FF88' : '#00AA44';
        ctx.fillText(col.chars[j], mx, my);
      }
    }
    ctx.globalAlpha = 1;

    // Stalactites from ceiling
    for (const stal of this.stalactites) {
      const sx = ((stal.x - camera.x * 0.08) % (canvasWidth + 200));
      ctx.fillStyle = '#1a1040';
      ctx.beginPath();
      ctx.moveTo(sx - stal.width / 2, 0);
      ctx.lineTo(sx + stal.width / 2, 0);
      ctx.lineTo(sx, stal.length);
      ctx.closePath();
      ctx.fill();
      // Glow tip
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#6622AA';
      ctx.beginPath();
      ctx.arc(sx, stal.length, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Floating crypto symbols
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const cs of this.cryptoSymbols) {
      const cx = ((cs.x - camera.x * 0.04) % (canvasWidth + 100));
      const cy = cs.y + Math.sin(time * 0.5 + cs.phase) * 10;
      const pulse = 0.15 + Math.sin(time * 1.5 + cs.phase) * 0.1;
      ctx.globalAlpha = pulse;
      ctx.fillStyle = cs.symbol === 'BTC' ? '#FF9900' :
                      cs.symbol === 'ETH' ? '#627EEA' :
                      cs.symbol === 'DOGE' ? '#C3A634' :
                      '#00CCFF';
      ctx.fillText(cs.symbol, cx, cy);
    }
    ctx.globalAlpha = 1;

    // Server rack layers
    for (const layer of this.layers) {
      this._renderServerLayer(ctx, camera, canvasWidth, canvasHeight, layer, time);
    }
  }

  _renderServerLayer(ctx, camera, canvasWidth, canvasHeight, layer, time) {
    ctx.globalAlpha = layer.alpha;
    const offsetX = camera.x * layer.parallax;

    for (const r of layer.buildings) {
      const repeatW = layer.totalWidth;
      let drawX = ((r.x - offsetX) % repeatW);
      if (drawX > canvasWidth + 200) drawX -= repeatW;
      if (drawX + r.w < -200) drawX += repeatW;
      if (drawX > canvasWidth + 200) continue;
      if (drawX + r.w < -200) continue;

      const by = canvasHeight - r.h;

      // Server rack body
      ctx.fillStyle = r.color;
      ctx.fillRect(drawX, by, r.w, r.h);

      // Top edge with neon glow
      ctx.fillStyle = 'rgba(0,200,255,0.1)';
      ctx.fillRect(drawX, by, r.w, 2);

      // Side glow
      ctx.fillStyle = 'rgba(170,68,255,0.05)';
      ctx.fillRect(drawX - 1, by, 2, r.h);
      ctx.fillRect(drawX + r.w - 1, by, 2, r.h);

      // LED strips
      const ledGap = 10;
      for (let l = 0; l < r.ledCount; l++) {
        const ly = by + 6 + l * ledGap;
        if (ly > canvasHeight) break;
        const led = r.leds[l];
        if (led.blink && Math.sin(time * 3 + led.phase) < 0) continue;
        ctx.fillStyle = led.color;
        ctx.globalAlpha = layer.alpha * 0.8;
        ctx.fillRect(drawX + 4, ly, 3, 2);
        ctx.fillRect(drawX + r.w - 7, ly, 3, 2);
        // LED glow
        ctx.globalAlpha = layer.alpha * 0.15;
        ctx.fillRect(drawX + 2, ly - 1, 7, 4);
      }
      ctx.globalAlpha = layer.alpha;

      // Blockchain node indicator
      if (r.hasNode) {
        const nx = drawX + r.w / 2;
        const ny = by + 20;
        ctx.globalAlpha = layer.alpha * (0.4 + Math.sin(time * 2 + r.x) * 0.2);
        ctx.strokeStyle = r.nodeColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(nx, ny, 6, 0, Math.PI * 2);
        ctx.stroke();
        // Inner dot
        ctx.fillStyle = r.nodeColor;
        ctx.beginPath();
        ctx.arc(nx, ny, 2, 0, Math.PI * 2);
        ctx.fill();
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
