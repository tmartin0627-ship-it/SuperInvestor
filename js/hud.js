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
    // Update flash timers for real-time price updates
    for (const stock of this.tickerStocks) {
      if (stock._flashTimer > 0) {
        stock._flashTimer -= dt;
      }
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

        // Price and change — flash on real-time update
        if (stock._flashTimer > 0) {
          const pulse = Math.sin(stock._flashTimer * 10) > 0 ? 1 : 0.6;
          ctx.fillStyle = stock._flash === 'green'
            ? 'rgba(0, 255, 136, ' + pulse + ')'
            : 'rgba(255, 68, 68, ' + pulse + ')';
        } else {
          ctx.fillStyle = isUp ? CONFIG.COLORS.TICKER_GREEN : CONFIG.COLORS.TICKER_RED;
        }
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

    // Bull counter — progress toward Diamond Hands (20 bulls)
    ctx.fillStyle = CONFIG.COLORS.BULL_GOLD;
    ctx.font = '13px monospace';
    const target = CONFIG.BULLS_FOR_DIAMOND_HANDS;
    const barLen = 10;
    const filled = Math.round((player.bullsCollected / target) * barLen);
    const bullBar = '\u25A0'.repeat(filled) + '\u25A1'.repeat(barLen - filled);
    ctx.fillText(bullBar + ' ' + player.bullsCollected + '/' + target, panelX + 8, panelY + 46);

    // Power-up indicators (right side)
    let indicatorY = panelY + 6;

    if (player.hasHeadband) {
      ctx.fillStyle = '#FF4444';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('\u2660 HODL HEADBAND', canvasWidth - 12, indicatorY);
      indicatorY += 18;
    }

    if (player.powered) {
      ctx.fillStyle = CONFIG.COLORS.GREEN_CANDLE;
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('\u25B2 POWERED UP', canvasWidth - 12, indicatorY);
      indicatorY += 18;
    }

    if (player.diamondHands) {
      ctx.fillStyle = '#88DDFF';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'right';
      const timeLeft = ' ' + Math.ceil(player.invincibleTimer) + 's';
      ctx.fillText('\u25C6 DIAMOND HANDS' + timeLeft, canvasWidth - 12, indicatorY);
    }
  }

  renderBossHealth(ctx, canvasWidth, boss) {
    if (!boss || !boss.alive) return;
    const barW = 200;
    const barH = 12;
    const barX = (canvasWidth - barW) / 2;
    const barY = 28;

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(barX - 2, barY - 2, barW + 4, barH + 4);

    // Health bar
    const healthPct = boss.hp / boss.maxHp;
    const barColor = boss.phase === 3 ? '#FF2222' : boss.phase === 2 ? '#FF8800' : '#FF4444';
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = barColor;
    ctx.fillRect(barX, barY, barW * healthPct, barH);

    // Border
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);

    // Label
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('THE WHALE', canvasWidth / 2, barY + barH / 2);
  }
}
