class GoldBull {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.width = CONFIG.BULL_WIDTH;
    this.height = CONFIG.BULL_HEIGHT;
    this.collected = false;
    this.animTime = Math.random() * Math.PI * 2;
    this.type = 'bull';
  }

  update(dt) {
    if (this.collected) return;
    this.animTime += dt;
    this.y = this.baseY + Math.sin(this.animTime * CONFIG.BULL_BOB_SPEED) * CONFIG.BULL_BOB_AMPLITUDE;
  }

  render(ctx, camera) {
    if (this.collected) return;
    const sx = this.x - camera.x;
    const sy = this.y - camera.y;
    if (sx + this.width < -10 || sx > CONFIG.VIRTUAL_WIDTH + 10) return;

    const w = this.width;
    const h = this.height;

    // Glow effect
    ctx.globalAlpha = 0.2 + Math.sin(this.animTime * 5) * 0.1;
    ctx.fillStyle = CONFIG.COLORS.BULL_GOLD;
    ctx.beginPath();
    ctx.arc(sx + w / 2, sy + h / 2, w * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Body
    ctx.fillStyle = CONFIG.COLORS.BULL_BODY;
    ctx.beginPath();
    ctx.ellipse(sx + w * 0.4, sy + h * 0.55, w * 0.35, h * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = CONFIG.COLORS.BULL_DARK;
    ctx.beginPath();
    ctx.ellipse(sx + w * 0.75, sy + h * 0.45, w * 0.18, h * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Horns
    ctx.fillStyle = CONFIG.COLORS.BULL_GOLD;
    ctx.beginPath();
    ctx.moveTo(sx + w * 0.68, sy + h * 0.3);
    ctx.lineTo(sx + w * 0.58, sy + h * 0.05);
    ctx.lineTo(sx + w * 0.72, sy + h * 0.25);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(sx + w * 0.82, sy + h * 0.3);
    ctx.lineTo(sx + w * 0.92, sy + h * 0.05);
    ctx.lineTo(sx + w * 0.85, sy + h * 0.25);
    ctx.fill();

    // Legs
    ctx.fillStyle = CONFIG.COLORS.BULL_DARK;
    ctx.fillRect(sx + w * 0.15, sy + h * 0.78, w * 0.1, h * 0.22);
    ctx.fillRect(sx + w * 0.3, sy + h * 0.78, w * 0.1, h * 0.22);
    ctx.fillRect(sx + w * 0.5, sy + h * 0.78, w * 0.1, h * 0.22);
    ctx.fillRect(sx + w * 0.65, sy + h * 0.78, w * 0.1, h * 0.22);

    // Eye
    ctx.fillStyle = CONFIG.COLORS.WHITE;
    ctx.fillRect(sx + w * 0.78, sy + h * 0.38, 3, 3);

    // Tail
    ctx.strokeStyle = CONFIG.COLORS.BULL_DARK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx + w * 0.08, sy + h * 0.5);
    ctx.quadraticCurveTo(sx - 4, sy + h * 0.3, sx + w * 0.05, sy + h * 0.2);
    ctx.stroke();
  }
}

class GreenCandle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.width = 24;
    this.height = 40;
    this.collected = false;
    this.animTime = Math.random() * Math.PI * 2;
    this.type = 'greenCandle';
  }

  update(dt) {
    if (this.collected) return;
    this.animTime += dt;
    this.y = this.baseY + Math.sin(this.animTime * 2.5) * 4;
  }

  render(ctx, camera) {
    if (this.collected) return;
    const sx = this.x - camera.x;
    const sy = this.y - camera.y;
    if (sx + this.width < -10 || sx > CONFIG.VIRTUAL_WIDTH + 10) return;

    // Glow
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = CONFIG.COLORS.GREEN_CANDLE;
    ctx.beginPath();
    ctx.arc(sx + 12, sy + 20, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Candle body (stock chart candle shape)
    ctx.fillStyle = CONFIG.COLORS.GREEN_CANDLE;
    ctx.fillRect(sx + 4, sy + 10, 16, 24);

    // Upper wick
    ctx.fillStyle = CONFIG.COLORS.GREEN_CANDLE_DARK;
    ctx.fillRect(sx + 10, sy + 2, 4, 10);

    // Lower wick
    ctx.fillRect(sx + 10, sy + 32, 4, 6);

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(sx + 6, sy + 12, 4, 18);

    // Up arrow indicator
    ctx.fillStyle = CONFIG.COLORS.GREEN_CANDLE;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    const bounce = Math.sin(this.animTime * 4) * 3;
    ctx.fillText('\u25B2', sx + 12, sy - 2 + bounce);
  }
}

class ChargingBull {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.width = 40;
    this.height = 34;
    this.collected = false;
    this.animTime = Math.random() * Math.PI * 2;
    this.type = 'chargingBull';
  }

  update(dt) {
    if (this.collected) return;
    this.animTime += dt;
    this.y = this.baseY + Math.sin(this.animTime * 3) * 5;
  }

  render(ctx, camera) {
    if (this.collected) return;
    const sx = this.x - camera.x;
    const sy = this.y - camera.y;
    if (sx + this.width < -10 || sx > CONFIG.VIRTUAL_WIDTH + 10) return;

    const w = this.width;
    const h = this.height;

    // Intense glow
    ctx.globalAlpha = 0.3 + Math.sin(this.animTime * 6) * 0.15;
    ctx.fillStyle = CONFIG.COLORS.CHARGING_BULL;
    ctx.beginPath();
    ctx.arc(sx + w / 2, sy + h / 2, w * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Body (larger, more muscular bull)
    ctx.fillStyle = CONFIG.COLORS.BULL_GOLD;
    ctx.beginPath();
    ctx.ellipse(sx + w * 0.45, sy + h * 0.55, w * 0.38, h * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = CONFIG.COLORS.BULL_BODY;
    ctx.beginPath();
    ctx.ellipse(sx + w * 0.82, sy + h * 0.42, w * 0.18, h * 0.24, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Horns (bigger)
    ctx.fillStyle = CONFIG.COLORS.WHITE;
    ctx.beginPath();
    ctx.moveTo(sx + w * 0.75, sy + h * 0.25);
    ctx.lineTo(sx + w * 0.6, sy - h * 0.1);
    ctx.lineTo(sx + w * 0.78, sy + h * 0.2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(sx + w * 0.88, sy + h * 0.25);
    ctx.lineTo(sx + w * 1.05, sy - h * 0.1);
    ctx.lineTo(sx + w * 0.92, sy + h * 0.2);
    ctx.fill();

    // Legs
    ctx.fillStyle = CONFIG.COLORS.BULL_BODY;
    ctx.fillRect(sx + w * 0.15, sy + h * 0.8, w * 0.1, h * 0.2);
    ctx.fillRect(sx + w * 0.32, sy + h * 0.8, w * 0.1, h * 0.2);
    ctx.fillRect(sx + w * 0.55, sy + h * 0.8, w * 0.1, h * 0.2);
    ctx.fillRect(sx + w * 0.72, sy + h * 0.8, w * 0.1, h * 0.2);

    // Motion lines
    ctx.strokeStyle = 'rgba(255,215,0,0.5)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const ly = sy + h * 0.3 + i * 8;
      const lx = sx - 10 - i * 5;
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx - 15, ly);
      ctx.stroke();
    }

    // Sparkle stars
    ctx.fillStyle = CONFIG.COLORS.WHITE;
    const sparkleAngle = this.animTime * 3;
    for (let i = 0; i < 3; i++) {
      const angle = sparkleAngle + i * (Math.PI * 2 / 3);
      const dist = w * 0.55;
      const px = sx + w / 2 + Math.cos(angle) * dist;
      const py = sy + h / 2 + Math.sin(angle) * dist * 0.6;
      ctx.globalAlpha = 0.6 + Math.sin(this.animTime * 8 + i) * 0.4;
      ctx.fillRect(px - 2, py - 2, 4, 4);
    }
    ctx.globalAlpha = 1;
  }
}
