class Platform {
  constructor(x, y, width, height, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type; // 'desk', 'ledge', 'taxi', 'ground'
  }

  render(ctx, camera) {
    const sx = this.x - camera.x;
    const sy = this.y - camera.y;

    // Skip if off screen
    if (sx + this.width < -50 || sx > CONFIG.VIRTUAL_WIDTH + 50) return;
    if (sy + this.height < -50 || sy > CONFIG.VIRTUAL_HEIGHT + 50) return;

    switch (this.type) {
      case 'desk':
        // Wooden desk surface
        ctx.fillStyle = CONFIG.COLORS.PLATFORM_DESK_TOP;
        ctx.fillRect(sx, sy, this.width, 6);
        ctx.fillStyle = CONFIG.COLORS.PLATFORM_DESK;
        ctx.fillRect(sx, sy + 6, this.width, this.height - 6);
        // Desk legs
        ctx.fillStyle = '#6B4914';
        ctx.fillRect(sx + 4, sy + this.height, 6, 14);
        ctx.fillRect(sx + this.width - 10, sy + this.height, 6, 14);
        break;

      case 'ledge':
        // Building ledge
        ctx.fillStyle = CONFIG.COLORS.PLATFORM_LEDGE;
        ctx.fillRect(sx, sy, this.width, this.height);
        // Ledge lip at top
        ctx.fillStyle = '#6a6a8a';
        ctx.fillRect(sx - 2, sy, this.width + 4, 4);
        break;

      case 'taxi':
        // Yellow taxi cab roof
        ctx.fillStyle = CONFIG.COLORS.PLATFORM_TAXI;
        ctx.fillRect(sx, sy, this.width, this.height);
        ctx.fillStyle = CONFIG.COLORS.PLATFORM_TAXI_DARK;
        ctx.fillRect(sx, sy + this.height - 4, this.width, 4);
        // Taxi light
        ctx.fillStyle = '#FFF';
        ctx.fillRect(sx + this.width / 2 - 8, sy - 8, 16, 8);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(sx + this.width / 2 - 6, sy - 6, 12, 4);
        break;

      case 'ground':
        // Sidewalk/ground
        ctx.fillStyle = CONFIG.COLORS.GROUND_TOP;
        ctx.fillRect(sx, sy, this.width, 4);
        ctx.fillStyle = CONFIG.COLORS.GROUND;
        ctx.fillRect(sx, sy + 4, this.width, this.height - 4);
        // Sidewalk cracks
        ctx.strokeStyle = '#3d3d5e';
        ctx.lineWidth = 1;
        for (let i = CONFIG.TILE_SIZE; i < this.width; i += CONFIG.TILE_SIZE) {
          ctx.beginPath();
          ctx.moveTo(sx + i, sy);
          ctx.lineTo(sx + i, sy + this.height);
          ctx.stroke();
        }
        break;
    }
  }
}

class QuestionBlock {
  constructor(x, y, contents) {
    this.x = x;
    this.y = y;
    this.width = CONFIG.BLOCK_SIZE;
    this.height = CONFIG.BLOCK_SIZE;
    this.contents = contents; // 'bull', 'greenCandle', 'chargingBull'
    this.used = false;
    this.bumpOffset = 0;
    this.bumpTimer = 0;
    this.animTime = Math.random() * Math.PI * 2;
    this._hitCallback = null;
  }

  setHitCallback(cb) {
    this._hitCallback = cb;
  }

  onHitFromBelow() {
    if (this.used) return;
    this.used = true;
    this.bumpTimer = CONFIG.BLOCK_BUMP_DURATION;
    if (this._hitCallback) {
      this._hitCallback(this.contents, this.x + this.width / 2 - 15, this.y - 36);
    }
  }

  update(dt) {
    this.animTime += dt;
    if (this.bumpTimer > 0) {
      this.bumpTimer -= dt;
      const t = 1 - (this.bumpTimer / CONFIG.BLOCK_BUMP_DURATION);
      this.bumpOffset = -CONFIG.BLOCK_BUMP_HEIGHT * Math.sin(t * Math.PI);
    } else {
      this.bumpOffset = 0;
    }
  }

  render(ctx, camera) {
    const sx = this.x - camera.x;
    const sy = this.y - camera.y + this.bumpOffset;
    const s = CONFIG.BLOCK_SIZE;

    if (sx + s < -10 || sx > CONFIG.VIRTUAL_WIDTH + 10) return;

    if (this.used) {
      ctx.fillStyle = CONFIG.COLORS.QUESTION_BLOCK_USED;
      ctx.fillRect(sx, sy, s, s);
      ctx.strokeStyle = '#6B5B3A';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx + 2, sy + 2, s - 4, s - 4);
    } else {
      // Golden block
      ctx.fillStyle = CONFIG.COLORS.QUESTION_BLOCK;
      ctx.fillRect(sx, sy, s, s);

      // Border
      ctx.strokeStyle = CONFIG.COLORS.QUESTION_BLOCK_BORDER;
      ctx.lineWidth = 3;
      ctx.strokeRect(sx + 3, sy + 3, s - 6, s - 6);

      // Inner border highlight
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(sx + 6, sy + 6, s - 12, s - 12);

      // Question mark
      ctx.fillStyle = CONFIG.COLORS.QUESTION_BLOCK_BORDER;
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const qBounce = Math.sin(this.animTime * 4) * 2;
      ctx.fillText('?', sx + s / 2, sy + s / 2 + qBounce);

      // Shimmer highlight
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(sx + 5, sy + 5, s * 0.35, s * 0.25);
    }
  }
}

class ShortSqueezePad {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 48;
    this.height = 16;
    this.animTime = 0;
    this.cooldown = 0;
    this.activated = false;
    this.activateTimer = 0;
  }

  update(dt) {
    this.animTime += dt;
    if (this.cooldown > 0) this.cooldown -= dt;
    if (this.activateTimer > 0) {
      this.activateTimer -= dt;
      if (this.activateTimer <= 0) this.activated = false;
    }
  }

  tryLaunch(player) {
    if (this.cooldown > 0) return false;
    if (player.onGround &&
        player.x + player.width > this.x &&
        player.x < this.x + this.width &&
        Math.abs((player.y + player.height) - this.y) < 8) {
      player.vy = CONFIG.PLAYER_SUPER_JUMP_VELOCITY * 1.3;
      player.onGround = false;
      this.cooldown = 0.5;
      this.activated = true;
      this.activateTimer = 0.4;
      return true;
    }
    return false;
  }

  render(ctx, camera) {
    const sx = this.x - camera.x;
    const sy = this.y - camera.y;
    if (sx + this.width < -10 || sx > CONFIG.VIRTUAL_WIDTH + 10) return;

    const w = this.width;
    const h = this.height;

    // Pad base
    const glow = this.activated ? 1 : 0.6 + Math.sin(this.animTime * 4) * 0.2;
    ctx.globalAlpha = glow;
    ctx.fillStyle = '#00CC66';
    ctx.fillRect(sx, sy, w, h);

    // Border
    ctx.strokeStyle = '#009944';
    ctx.lineWidth = 2;
    ctx.strokeRect(sx + 1, sy + 1, w - 2, h - 2);

    // Up arrow
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(sx + w / 2, sy + 2);
    ctx.lineTo(sx + w / 2 + 8, sy + h - 2);
    ctx.lineTo(sx + w / 2 - 8, sy + h - 2);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // Activation burst
    if (this.activated) {
      ctx.globalAlpha = this.activateTimer;
      ctx.fillStyle = '#00FF88';
      for (let i = 0; i < 3; i++) {
        const by = sy - 10 - i * 12 - (0.4 - this.activateTimer) * 60;
        ctx.fillRect(sx + w / 2 - 2 + (i - 1) * 8, by, 4, 8);
      }
      ctx.globalAlpha = 1;
    }
  }
}
