class HUD {
  constructor(tickerStocks) {
    this.tickerStocks = tickerStocks;
    this.tickerOffset = 0;
    this.tickerSpeed = 100;
    this.tickerItemWidth = 220;
  }

  update(dt) {
    this.tickerOffset += this.tickerSpeed * dt;
    const totalWidth = this.tickerStocks.length * this.tickerItemWidth;
    if (this.tickerOffset > totalWidth) {
      this.tickerOffset -= totalWidth;
    }
  }

  render(ctx, player, canvasWidth) {
    // Stock ticker bar at very top
    ctx.fillStyle = CONFIG.COLORS.TICKER_BG;
    ctx.fillRect(0, 0, canvasWidth, 24);

    // Ticker border
    ctx.fillStyle = 'rgba(255,215,0,0.3)';
    ctx.fillRect(0, 23, canvasWidth, 1);

    ctx.font = 'bold 13px monospace';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';

    const totalWidth = this.tickerStocks.length * this.tickerItemWidth;

    // Draw ticker items (doubled for seamless loop)
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < this.tickerStocks.length; i++) {
        const stock = this.tickerStocks[i];
        let xPos = canvasWidth - this.tickerOffset + i * this.tickerItemWidth + pass * totalWidth;

        if (xPos > canvasWidth + 20 || xPos + this.tickerItemWidth < -20) continue;

        const isUp = stock.change >= 0;
        const arrow = isUp ? '\u25B2' : '\u25BC';

        // Symbol
        ctx.fillStyle = CONFIG.COLORS.WHITE;
        ctx.fillText(stock.symbol, xPos, 12);

        // Price and change
        ctx.fillStyle = isUp ? CONFIG.COLORS.TICKER_GREEN : CONFIG.COLORS.TICKER_RED;
        const priceText = '$' + stock.price.toFixed(2) + ' ' + arrow + Math.abs(stock.change).toFixed(1) + '%';
        ctx.fillText(priceText, xPos + 55, 12);

        // Separator dot
        ctx.fillStyle = '#444';
        ctx.fillText('\u2022', xPos + this.tickerItemWidth - 20, 12);
      }
    }

    // HUD panel - score and stats
    const panelX = 10;
    const panelY = 32;
    const panelW = 200;
    const panelH = 68;

    ctx.fillStyle = CONFIG.COLORS.HUD_BG;
    ctx.fillRect(panelX, panelY, panelW, panelH);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(panelX, panelY, panelW, panelH);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Score
    ctx.fillStyle = CONFIG.COLORS.BULL_GOLD;
    ctx.font = 'bold 15px monospace';
    ctx.fillText('$' + player.score.toLocaleString(), panelX + 8, panelY + 6);

    // Lives
    ctx.fillStyle = CONFIG.COLORS.WHITE;
    ctx.font = '13px monospace';
    let livesText = 'LIVES: ';
    for (let i = 0; i < player.lives; i++) {
      livesText += '\u2665 ';
    }
    ctx.fillText(livesText, panelX + 8, panelY + 26);

    // Bull counter
    ctx.fillStyle = CONFIG.COLORS.BULL_GOLD;
    ctx.font = '13px monospace';
    const bullBar = '\u25A0'.repeat(player.bullsCollected) +
                    '\u25A1'.repeat(CONFIG.BULLS_FOR_EXTRA_LIFE - player.bullsCollected);
    ctx.fillText('BULLS: ' + bullBar, panelX + 8, panelY + 46);

    // Power-up indicators (right side)
    if (player.powered) {
      ctx.fillStyle = CONFIG.COLORS.GREEN_CANDLE;
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('\u25B2 POWERED UP', canvasWidth - 12, panelY + 6);
    }
    if (player.invincible && !player.hodlActive) {
      ctx.fillStyle = CONFIG.COLORS.CHARGING_BULL;
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'right';
      const timeLeft = player.invincibleTimer === Infinity ? '' : ' ' + Math.ceil(player.invincibleTimer) + 's';
      ctx.fillText('\u2605 BULL MODE' + timeLeft, canvasWidth - 12, panelY + 24);
    }
  }
}
