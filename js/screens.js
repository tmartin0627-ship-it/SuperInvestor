class TitleScreen {
  constructor() {
    this.animTime = 0;
    this.selectedCharacter = null;
    this.phase = 'title'; // 'title' -> 'select'
    this.hoverIndex = 0;  // 0=chad, 1=diana
    this.tipIndex = 0;
    this.tips = [
      "Past performance is not indicative of future results",
      "This is not financial advice",
      "Buy low, sell high. Or don't.",
      "Diamond hands are just hands that haven't sold yet",
      "Bears make money, bulls make money, pigs get slaughtered",
      "In this economy?!",
      "Time in the market beats timing the market... unless you fall in a pit",
      "Sir, this is a Wendy's",
      "Stonks only go up (and sometimes down, into pits)",
      "HODL for 5 seconds for a surprise"
    ];
  }

  update(dt, input) {
    this.animTime += dt;
    this.tipIndex = Math.floor(this.animTime / 4) % this.tips.length;

    if (this.phase === 'title') {
      if (input.wasPressed('Enter') || input.wasPressed('Space')) {
        this.phase = 'select';
        this.selectDebounce = 0.3; // prevent instant confirmation on touch
      }
    } else {
      // Debounce prevents the same tap that entered select phase from also confirming
      if (this.selectDebounce > 0) {
        this.selectDebounce -= dt;
        return null;
      }

      if (input.wasPressed('ArrowLeft') || input.wasPressed('KeyA')) {
        this.hoverIndex = 0;
      }
      if (input.wasPressed('ArrowRight') || input.wasPressed('KeyD')) {
        this.hoverIndex = 1;
      }
      if (input.wasPressed('Digit1')) {
        this.hoverIndex = 0;
      }
      if (input.wasPressed('Digit2')) {
        this.hoverIndex = 1;
      }
      if (input.wasPressed('Enter') || input.wasPressed('Space')) {
        this.selectedCharacter = this.hoverIndex === 0 ? 'chad' : 'diana';
        return 'start';
      }
    }
    return null;
  }

  render(ctx, w, h) {
    // Dark background
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#050515');
    grad.addColorStop(0.5, '#0a0a25');
    grad.addColorStop(1, '#151535');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // City silhouette at bottom
    ctx.fillStyle = '#0a0a1a';
    const buildings = [
      { x: 20, bw: 60, bh: 140 }, { x: 90, bw: 40, bh: 100 },
      { x: 140, bw: 80, bh: 200 }, { x: 230, bw: 50, bh: 120 },
      { x: 290, bw: 70, bh: 180 }, { x: 370, bw: 90, bh: 160 },
      { x: 470, bw: 45, bh: 130 }, { x: 525, bw: 75, bh: 220 },
      { x: 610, bw: 55, bh: 150 }, { x: 675, bw: 85, bh: 190 },
      { x: 770, bw: 60, bh: 140 }, { x: 840, bw: 100, bh: 210 },
    ];
    for (const b of buildings) {
      ctx.fillRect(b.x, h - b.bh, b.bw, b.bh);
      // Scattered windows
      ctx.fillStyle = 'rgba(255,228,181,0.3)';
      for (let r = 0; r < b.bh / 16; r++) {
        for (let c = 0; c < b.bw / 14; c++) {
          if (Math.sin(b.x + r * 7 + c * 13) > 0.2) {
            ctx.fillRect(b.x + 4 + c * 14, h - b.bh + 8 + r * 16, 6, 8);
          }
        }
      }
      ctx.fillStyle = '#0a0a1a';
    }

    // Title: "BULL RUN"
    const titleBounce = Math.sin(this.animTime * 2) * 6;
    const titleY = h * 0.2 + titleBounce;

    // Title shadow
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.font = 'bold 72px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BULL RUN', w / 2 + 3, titleY + 3);

    // Title gold gradient
    const titleGrad = ctx.createLinearGradient(w / 2 - 150, titleY - 30, w / 2 + 150, titleY + 30);
    titleGrad.addColorStop(0, '#FFD700');
    titleGrad.addColorStop(0.5, '#FFEE88');
    titleGrad.addColorStop(1, '#FFD700');
    ctx.fillStyle = titleGrad;
    ctx.fillText('BULL RUN', w / 2, titleY);

    // Subtitle
    ctx.fillStyle = '#888';
    ctx.font = '18px sans-serif';
    ctx.fillText('A Wall Street Adventure', w / 2, h * 0.3);

    // Bull horns decoration
    ctx.strokeStyle = CONFIG.COLORS.BULL_GOLD;
    ctx.lineWidth = 3;
    // Left horn
    ctx.beginPath();
    ctx.moveTo(w / 2 - 160, titleY);
    ctx.quadraticCurveTo(w / 2 - 180, titleY - 40, w / 2 - 150, titleY - 50);
    ctx.stroke();
    // Right horn
    ctx.beginPath();
    ctx.moveTo(w / 2 + 160, titleY);
    ctx.quadraticCurveTo(w / 2 + 180, titleY - 40, w / 2 + 150, titleY - 50);
    ctx.stroke();

    if (this.phase === 'title') {
      // Blinking prompt
      if (Math.floor(this.animTime * 2) % 2 === 0) {
        ctx.fillStyle = CONFIG.COLORS.WHITE;
        ctx.font = '22px sans-serif';
        const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        ctx.fillText(isMobile ? 'Tap to Start' : 'Press ENTER to Start', w / 2, h * 0.55);
      }

      // Controls hint
      ctx.fillStyle = '#555';
      ctx.font = '14px sans-serif';
      const isMobile2 = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      if (isMobile2) {
        ctx.fillText('Left side = Move  |  Right side: Tap = Jump, Hold = Crouch + Super Jump', w / 2, h * 0.65);
      } else {
        ctx.fillText('Arrow Keys / WASD to move  |  Space to jump  |  Down to crouch + super jump', w / 2, h * 0.65);
      }
    } else {
      // Character select
      ctx.fillStyle = CONFIG.COLORS.WHITE;
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('SELECT YOUR INVESTOR', w / 2, h * 0.4);

      // Chad (left)
      const chadX = w * 0.3;
      const dianaX = w * 0.7;
      const charY = h * 0.58;

      // Selection highlight
      const selectedX = this.hoverIndex === 0 ? chadX : dianaX;
      ctx.strokeStyle = CONFIG.COLORS.BULL_GOLD;
      ctx.lineWidth = 3;
      ctx.strokeRect(selectedX - 55, charY - 50, 110, 120);
      ctx.fillStyle = 'rgba(255,215,0,0.08)';
      ctx.fillRect(selectedX - 55, charY - 50, 110, 120);

      // Draw mini characters
      this._drawMiniChad(ctx, chadX - 18, charY - 30);
      this._drawMiniDiana(ctx, dianaX - 18, charY - 30);

      // Names
      ctx.fillStyle = this.hoverIndex === 0 ? CONFIG.COLORS.BULL_GOLD : '#AAA';
      ctx.font = '16px sans-serif';
      ctx.fillText('Chad Stocksworth', chadX, charY + 50);
      ctx.fillStyle = '#777';
      ctx.font = '12px sans-serif';
      ctx.fillText('[1] or LEFT', chadX, charY + 68);

      ctx.fillStyle = this.hoverIndex === 1 ? CONFIG.COLORS.BULL_GOLD : '#AAA';
      ctx.font = '16px sans-serif';
      ctx.fillText('Diana Dividend', dianaX, charY + 50);
      ctx.fillStyle = '#777';
      ctx.font = '12px sans-serif';
      ctx.fillText('[2] or RIGHT', dianaX, charY + 68);

      // Instruction
      ctx.fillStyle = CONFIG.COLORS.WHITE;
      ctx.font = '16px sans-serif';
      const isMobileSelect = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      ctx.fillText(isMobileSelect ? 'Tap to confirm' : 'Press ENTER to confirm', w / 2, h * 0.88);
    }

    // Loading tip at bottom
    ctx.fillStyle = '#444';
    ctx.font = 'italic 13px sans-serif';
    ctx.fillText('"' + this.tips[this.tipIndex] + '"', w / 2, h * 0.95);
  }

  _drawMiniChad(ctx, x, y) {
    // Simplified chad at 36x54 scale
    ctx.fillStyle = CONFIG.COLORS.PLAYER_SUIT;
    ctx.fillRect(x + 4, y + 18, 28, 22);
    ctx.fillStyle = CONFIG.COLORS.PLAYER_SHIRT;
    ctx.beginPath();
    ctx.moveTo(x + 13, y + 18);
    ctx.lineTo(x + 18, y + 30);
    ctx.lineTo(x + 23, y + 18);
    ctx.fill();
    ctx.fillStyle = CONFIG.COLORS.PLAYER_TIE;
    ctx.fillRect(x + 16, y + 20, 4, 14);
    ctx.fillStyle = CONFIG.COLORS.PLAYER_SKIN;
    ctx.beginPath();
    ctx.ellipse(x + 18, y + 10, 10, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = CONFIG.COLORS.PLAYER_HAIR_MALE;
    ctx.fillRect(x + 8, y + 2, 20, 5);
    ctx.fillStyle = '#1a1a3a';
    ctx.fillRect(x + 8, y + 40, 8, 14);
    ctx.fillRect(x + 20, y + 40, 8, 14);
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(x + 28, y + 34, 10, 8);
  }

  _drawMiniDiana(ctx, x, y) {
    ctx.fillStyle = CONFIG.COLORS.PLAYER_BLAZER;
    ctx.fillRect(x + 4, y + 18, 28, 22);
    ctx.fillStyle = '#E8E0D0';
    ctx.beginPath();
    ctx.moveTo(x + 14, y + 18);
    ctx.lineTo(x + 18, y + 28);
    ctx.lineTo(x + 22, y + 18);
    ctx.fill();
    ctx.fillStyle = CONFIG.COLORS.PLAYER_SKIN;
    ctx.beginPath();
    ctx.ellipse(x + 18, y + 10, 9, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = CONFIG.COLORS.PLAYER_HAIR_FEMALE;
    ctx.fillRect(x + 7, y + 2, 22, 6);
    ctx.fillRect(x + 6, y + 6, 6, 12);
    ctx.fillRect(x + 24, y + 6, 6, 12);
    ctx.fillStyle = '#1a1a3a';
    ctx.fillRect(x + 10, y + 40, 7, 14);
    ctx.fillRect(x + 20, y + 40, 7, 14);
    ctx.fillStyle = '#222';
    ctx.fillRect(x + 28, y + 30, 10, 8);
    ctx.fillStyle = '#4488FF';
    ctx.fillRect(x + 29, y + 31, 8, 5);
  }
}

class GameOverScreen {
  constructor() {
    this.animTime = 0;
    this.finalScore = 0;
    this.bullsCollected = 0;
    this.leaderboardData = null;
    this.playerRank = null;
    this.playerTotal = null;
    this.leaderboardStatus = null; // 'pending'|'submitting'|'done'|'error'|'skipped'
  }

  update(dt) {
    this.animTime += dt;
  }

  render(ctx, w, h) {
    // Dark red overlay
    ctx.fillStyle = 'rgba(30, 0, 0, 0.9)';
    ctx.fillRect(0, 0, w, h);

    // Red candlestick chart going down in background
    ctx.strokeStyle = 'rgba(255,50,50,0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.2);
    for (let x = 0; x < w; x += 20) {
      const y = h * 0.2 + (x / w) * h * 0.5 + Math.sin(x * 0.05) * 30;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Animated crash effect
    const shake = this.animTime < 0.5 ? Math.sin(this.animTime * 40) * 5 : 0;

    ctx.fillStyle = CONFIG.COLORS.TICKER_RED;
    ctx.font = 'bold 40px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('YOUR PORTFOLIO HAS BEEN', w / 2 + shake, h * 0.28);

    ctx.font = 'bold 56px sans-serif';
    ctx.fillText('LIQUIDATED', w / 2 + shake, h * 0.38);

    // Sad chart icon
    ctx.fillStyle = CONFIG.COLORS.TICKER_RED;
    ctx.font = '60px sans-serif';
    ctx.fillText('\u25BC', w / 2, h * 0.5);

    // Score
    ctx.fillStyle = CONFIG.COLORS.WHITE;
    ctx.font = '22px sans-serif';
    ctx.fillText('Final Portfolio: $' + this.finalScore.toLocaleString(), w / 2, h * 0.62);
    ctx.fillText('Bulls Collected: ' + this.bullsCollected, w / 2, h * 0.68);

    // Leaderboard
    renderLeaderboardSection(ctx, w, h, 0.74, this);

    // Continue prompt
    if (this.leaderboardStatus !== 'pending' && Math.floor(this.animTime * 1.5) % 2 === 0) {
      ctx.fillStyle = '#AAA';
      ctx.font = '20px sans-serif';
      const isMobileGO = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      ctx.fillText(isMobileGO ? 'Tap to try again' : 'Press ENTER to try again', w / 2, h * 0.82);
    }

    // Disclaimer
    ctx.fillStyle = '#444';
    ctx.font = 'italic 12px sans-serif';
    ctx.fillText('Past performance is not indicative of future results', w / 2, h * 0.92);
  }
}

class LevelCompleteScreen {
  constructor() {
    this.animTime = 0;
    this.finalScore = 0;
    this.bullsCollected = 0;
    this.timeTaken = 0;
    this.timeBonus = 0;
    this.leaderboardData = null;
    this.playerRank = null;
    this.playerTotal = null;
    this.leaderboardStatus = null;
  }

  update(dt) {
    this.animTime += dt;
  }

  render(ctx, w, h) {
    // Dark green overlay
    ctx.fillStyle = 'rgba(0, 20, 0, 0.9)';
    ctx.fillRect(0, 0, w, h);

    // Green chart going up in background
    ctx.strokeStyle = 'rgba(0,255,136,0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.8);
    for (let x = 0; x < w; x += 20) {
      const y = h * 0.8 - (x / w) * h * 0.5 + Math.sin(x * 0.04) * 25;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = CONFIG.COLORS.TICKER_GREEN;
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MARKET CLOSE', w / 2, h * 0.18);

    ctx.fillStyle = CONFIG.COLORS.BULL_GOLD;
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('YOUR PORTFOLIO IS UP!', w / 2, h * 0.3);

    // Up arrow
    ctx.fillStyle = CONFIG.COLORS.TICKER_GREEN;
    ctx.font = '50px sans-serif';
    ctx.fillText('\u25B2', w / 2, h * 0.42);

    // Stats with animation
    const showDelay = 0.5;
    ctx.font = '22px sans-serif';

    if (this.animTime > showDelay) {
      ctx.fillStyle = CONFIG.COLORS.WHITE;
      ctx.fillText('Portfolio Value: $' + this.finalScore.toLocaleString(), w / 2, h * 0.54);
    }
    if (this.animTime > showDelay + 0.3) {
      ctx.fillStyle = CONFIG.COLORS.BULL_GOLD;
      ctx.fillText('Bulls Collected: ' + this.bullsCollected, w / 2, h * 0.61);
    }
    if (this.animTime > showDelay + 0.6) {
      ctx.fillStyle = CONFIG.COLORS.WHITE;
      ctx.fillText('Time: ' + this.timeTaken.toFixed(1) + 's', w / 2, h * 0.68);
    }
    if (this.animTime > showDelay + 0.9) {
      ctx.fillStyle = this.timeBonus > 0 ? CONFIG.COLORS.TICKER_GREEN : '#888';
      ctx.fillText('Time Bonus: +$' + this.timeBonus.toLocaleString(), w / 2, h * 0.74);
    }

    // Leaderboard
    if (this.animTime > showDelay + 1.2) {
      renderLeaderboardSection(ctx, w, h, 0.80, this);
    }

    if (this.animTime > 2.5 && this.leaderboardStatus !== 'pending') {
      if (Math.floor(this.animTime * 1.5) % 2 === 0) {
        ctx.fillStyle = '#AAA';
        ctx.font = '20px sans-serif';
        const isMobileLC = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        ctx.fillText(isMobileLC ? 'Tap to continue' : 'Press ENTER to continue', w / 2, h * 0.93);
      }
    }

    // Celebratory text
    ctx.fillStyle = '#555';
    ctx.font = 'italic 13px sans-serif';
    ctx.fillText('Congratulations! You survived the bear market.', w / 2, h * 0.97);
  }
}

// ==========================================
//  Shared Leaderboard Rendering
// ==========================================
function renderLeaderboardSection(ctx, w, h, startY, screen) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (screen.leaderboardStatus === 'submitting' || screen.leaderboardStatus === 'pending') {
    ctx.fillStyle = '#888';
    ctx.font = '14px sans-serif';
    ctx.fillText('Submitting score...', w / 2, h * startY);
    return;
  }

  if (screen.leaderboardStatus === 'error') {
    ctx.fillStyle = '#666';
    ctx.font = '14px sans-serif';
    ctx.fillText('Leaderboard unavailable', w / 2, h * startY);
    return;
  }

  if (screen.leaderboardStatus !== 'done' || !screen.leaderboardData) return;

  // Player rank
  if (screen.playerRank != null) {
    ctx.fillStyle = CONFIG.COLORS.BULL_GOLD;
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Your Rank: #' + screen.playerRank + ' of ' + screen.playerTotal, w / 2, h * startY);
  }

  // Top scores header
  const tableTop = h * startY + 22;
  ctx.fillStyle = '#999';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('--- TOP 10 ---', w / 2, tableTop);

  // Leaderboard rows — two columns: 1-5 left, 6-10 right
  const rowH = 14;
  const data = screen.leaderboardData.slice(0, 10);
  const colOffset = 160; // half-width of each column

  for (let i = 0; i < data.length; i++) {
    const entry = data[i];
    const col = i < 5 ? 0 : 1;
    const row = i < 5 ? i : i - 5;
    const colCenter = col === 0 ? w / 2 - colOffset / 2 - 10 : w / 2 + colOffset / 2 + 10;
    const y = tableTop + 16 + row * rowH;
    const rank = (i + 1) + '.';
    const name = entry.player_name.substring(0, 10);
    const score = '$' + entry.score.toLocaleString();

    ctx.fillStyle = i === 0 ? CONFIG.COLORS.BULL_GOLD : '#CCC';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(rank, colCenter - 65, y);
    ctx.textAlign = 'left';
    ctx.fillText(name, colCenter - 56, y);
    ctx.textAlign = 'right';
    ctx.fillText(score, colCenter + 80, y);
    ctx.textAlign = 'center';
  }
}
