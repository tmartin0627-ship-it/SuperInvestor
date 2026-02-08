class BabyBear {
  constructor(x, y, patrolLeft, patrolRight) {
    this.x = x;
    this.y = y;
    this.width = CONFIG.BABY_BEAR_WIDTH;
    this.height = CONFIG.BABY_BEAR_HEIGHT;
    this.vx = CONFIG.BABY_BEAR_SPEED;
    this.vy = 0;
    this.patrolLeft = patrolLeft;
    this.patrolRight = patrolRight;
    this.alive = true;
    this.hp = 1;
    this.onGround = false;
    this.animTime = 0;
    this.deathTimer = 0;
    this.facingRight = true;
  }

  update(dt, solids) {
    if (!this.alive) {
      this.deathTimer += dt;
      return this.deathTimer < 0.4;
    }

    applyGravity(this, dt);

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Patrol boundaries
    if (this.x <= this.patrolLeft) {
      this.x = this.patrolLeft;
      this.vx = Math.abs(this.vx);
      this.facingRight = true;
    }
    if (this.x + this.width >= this.patrolRight) {
      this.x = this.patrolRight - this.width;
      this.vx = -Math.abs(this.vx);
      this.facingRight = false;
    }

    // Collision with solids
    resolveEntityCollisions(this, solids);

    this.animTime += dt;
    return true;
  }

  stomp() {
    this.hp--;
    if (this.hp <= 0) {
      this.alive = false;
      return true;
    }
    return false;
  }

  render(ctx, camera) {
    const sx = this.x - camera.x;
    const sy = this.y - camera.y;
    if (sx + this.width < -20 || sx > CONFIG.VIRTUAL_WIDTH + 20) return;

    const w = this.width;
    const h = this.height;

    ctx.save();

    if (!this.alive) {
      // Squish animation
      const squish = Math.max(0.1, 1 - (this.deathTimer / 0.3));
      ctx.translate(sx + w / 2, sy + h);
      ctx.scale(1.3, squish);
      ctx.translate(-w / 2, -h);
      this._drawBody(ctx, w, h);
      ctx.restore();
      return;
    }

    ctx.translate(sx, sy);

    // Flip if facing left
    if (!this.facingRight) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }

    const legSwing = Math.sin(this.animTime * 8) * 5;
    this._drawBody(ctx, w, h, legSwing);
    ctx.restore();
  }

  _drawBody(ctx, w, h, legSwing) {
    legSwing = legSwing || 0;

    // Legs
    ctx.fillStyle = CONFIG.COLORS.BEAR_DARK;
    ctx.fillRect(w * 0.15, h * 0.72 + legSwing, w * 0.2, h * 0.28 - Math.max(0, legSwing));
    ctx.fillRect(w * 0.65, h * 0.72 - legSwing, w * 0.2, h * 0.28 + Math.max(0, legSwing));

    // Body
    ctx.fillStyle = CONFIG.COLORS.BEAR_BROWN;
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.48, w * 0.44, h * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = CONFIG.COLORS.BEAR_BELLY;
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.52, w * 0.24, h * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = CONFIG.COLORS.BEAR_BROWN;
    ctx.beginPath();
    ctx.arc(w * 0.22, h * 0.14, w * 0.13, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.78, h * 0.14, w * 0.13, 0, Math.PI * 2);
    ctx.fill();

    // Inner ears
    ctx.fillStyle = CONFIG.COLORS.BEAR_BELLY;
    ctx.beginPath();
    ctx.arc(w * 0.22, h * 0.14, w * 0.07, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.78, h * 0.14, w * 0.07, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = CONFIG.COLORS.BLACK;
    ctx.beginPath();
    ctx.arc(w * 0.35, h * 0.32, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.65, h * 0.32, 3, 0, Math.PI * 2);
    ctx.fill();

    // Angry eyebrows
    ctx.strokeStyle = CONFIG.COLORS.BLACK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.22, h * 0.22);
    ctx.lineTo(w * 0.42, h * 0.28);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w * 0.78, h * 0.22);
    ctx.lineTo(w * 0.58, h * 0.28);
    ctx.stroke();

    // Nose
    ctx.fillStyle = CONFIG.COLORS.BEAR_DARK;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.42, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mouth (growl)
    ctx.strokeStyle = CONFIG.COLORS.BEAR_DARK;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.45, 5, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }
}

class GrizzlyBear {
  constructor(x, y, patrolLeft, patrolRight) {
    this.x = x;
    this.y = y;
    this.width = CONFIG.GRIZZLY_WIDTH;
    this.height = CONFIG.GRIZZLY_HEIGHT;
    this.vx = CONFIG.GRIZZLY_SPEED;
    this.vy = 0;
    this.patrolLeft = patrolLeft;
    this.patrolRight = patrolRight;
    this.alive = true;
    this.hp = CONFIG.GRIZZLY_HP;
    this.onGround = false;
    this.charging = false;
    this.animTime = 0;
    this.deathTimer = 0;
    this.stompFlashTimer = 0;
    this.facingRight = true;
  }

  update(dt, solids, playerX) {
    if (!this.alive) {
      this.deathTimer += dt;
      return this.deathTimer < 0.4;
    }

    // Charge detection
    const dist = Math.abs(playerX - (this.x + this.width / 2));
    if (dist < CONFIG.GRIZZLY_DETECT_RANGE) {
      this.charging = true;
      const dir = playerX > this.x + this.width / 2 ? 1 : -1;
      this.vx = CONFIG.GRIZZLY_CHARGE_SPEED * dir;
      this.facingRight = dir > 0;
    } else if (this.charging) {
      this.charging = false;
      this.vx = CONFIG.GRIZZLY_SPEED * (this.facingRight ? 1 : -1);
    }

    applyGravity(this, dt);

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Patrol boundaries
    if (this.x <= this.patrolLeft) {
      this.x = this.patrolLeft;
      this.vx = Math.abs(this.vx);
      this.facingRight = true;
    }
    if (this.x + this.width >= this.patrolRight) {
      this.x = this.patrolRight - this.width;
      this.vx = -Math.abs(this.vx);
      this.facingRight = false;
    }

    resolveEntityCollisions(this, solids);

    if (this.stompFlashTimer > 0) this.stompFlashTimer -= dt;
    this.animTime += dt;
    return true;
  }

  stomp() {
    this.hp--;
    if (this.hp <= 0) {
      this.alive = false;
      return true;
    }
    this.stompFlashTimer = 0.3;
    return false;
  }

  render(ctx, camera) {
    const sx = this.x - camera.x;
    const sy = this.y - camera.y;
    if (sx + this.width < -20 || sx > CONFIG.VIRTUAL_WIDTH + 20) return;

    const w = this.width;
    const h = this.height;

    ctx.save();

    if (!this.alive) {
      const squish = Math.max(0.1, 1 - (this.deathTimer / 0.3));
      ctx.translate(sx + w / 2, sy + h);
      ctx.scale(1.3, squish);
      ctx.translate(-w / 2, -h);
      this._drawBody(ctx, w, h);
      ctx.restore();
      return;
    }

    ctx.translate(sx, sy);

    if (!this.facingRight) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }

    const legSwing = Math.sin(this.animTime * (this.charging ? 14 : 8)) * (this.charging ? 8 : 5);
    this._drawBody(ctx, w, h, legSwing);

    // Damage flash
    if (this.stompFlashTimer > 0) {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }

    // Armor shield indicator (stomp-immune)
    if (!this.charging) {
      ctx.globalAlpha = 0.3 + Math.sin(this.animTime * 3) * 0.1;
      ctx.strokeStyle = '#88AACC';
      ctx.lineWidth = 2;
      // Shield diamond on chest
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.3);
      ctx.lineTo(w * 0.65, h * 0.45);
      ctx.lineTo(w * 0.5, h * 0.6);
      ctx.lineTo(w * 0.35, h * 0.45);
      ctx.closePath();
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Charge indicator
    if (this.charging) {
      ctx.fillStyle = '#FF4444';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('!!!', w / 2, -8);
    }

    ctx.restore();
  }

  _drawBody(ctx, w, h, legSwing) {
    legSwing = legSwing || 0;

    // Arms (behind body)
    ctx.fillStyle = CONFIG.COLORS.BEAR_BROWN;
    ctx.save();
    ctx.translate(w * 0.85, h * 0.35);
    ctx.rotate(0.3 + (this.charging ? 0.4 : 0));
    ctx.fillRect(0, 0, w * 0.12, h * 0.3);
    ctx.restore();

    // Legs
    ctx.fillStyle = CONFIG.COLORS.BEAR_DARK;
    ctx.fillRect(w * 0.15, h * 0.7 + legSwing, w * 0.18, h * 0.3 - Math.max(0, legSwing));
    ctx.fillRect(w * 0.62, h * 0.7 - legSwing, w * 0.18, h * 0.3 + Math.max(0, legSwing));

    // Body (larger)
    ctx.fillStyle = CONFIG.COLORS.BEAR_BROWN;
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.45, w * 0.46, h * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = CONFIG.COLORS.BEAR_BELLY;
    ctx.beginPath();
    ctx.ellipse(w * 0.48, h * 0.5, w * 0.22, h * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head (slightly forward when charging)
    const headOffset = this.charging ? w * 0.06 : 0;
    ctx.fillStyle = CONFIG.COLORS.BEAR_BROWN;
    ctx.beginPath();
    ctx.ellipse(w * 0.5 + headOffset, h * 0.18, w * 0.28, h * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.arc(w * 0.28 + headOffset, h * 0.04, w * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.72 + headOffset, h * 0.04, w * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Inner ears
    ctx.fillStyle = CONFIG.COLORS.BEAR_BELLY;
    ctx.beginPath();
    ctx.arc(w * 0.28 + headOffset, h * 0.04, w * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.72 + headOffset, h * 0.04, w * 0.05, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (angrier for grizzly, red when charging)
    ctx.fillStyle = this.charging ? '#FF0000' : CONFIG.COLORS.BLACK;
    ctx.beginPath();
    ctx.arc(w * 0.38 + headOffset, h * 0.15, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.62 + headOffset, h * 0.15, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Very angry eyebrows
    ctx.strokeStyle = CONFIG.COLORS.BLACK;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(w * 0.24 + headOffset, h * 0.06);
    ctx.lineTo(w * 0.44 + headOffset, h * 0.12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w * 0.76 + headOffset, h * 0.06);
    ctx.lineTo(w * 0.56 + headOffset, h * 0.12);
    ctx.stroke();

    // Snout
    ctx.fillStyle = CONFIG.COLORS.BEAR_BELLY;
    ctx.beginPath();
    ctx.ellipse(w * 0.52 + headOffset, h * 0.24, w * 0.1, h * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = CONFIG.COLORS.BLACK;
    ctx.beginPath();
    ctx.ellipse(w * 0.52 + headOffset, h * 0.22, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Open mouth when charging
    if (this.charging) {
      ctx.fillStyle = '#8B0000';
      ctx.beginPath();
      ctx.ellipse(w * 0.52 + headOffset, h * 0.29, 6, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      // Teeth
      ctx.fillStyle = CONFIG.COLORS.WHITE;
      ctx.fillRect(w * 0.47 + headOffset, h * 0.27, 3, 3);
      ctx.fillRect(w * 0.54 + headOffset, h * 0.27, 3, 3);
    }

    // Scar (distinguishing mark for grizzly)
    ctx.strokeStyle = '#6B3310';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(w * 0.3 + headOffset, h * 0.1);
    ctx.lineTo(w * 0.38 + headOffset, h * 0.2);
    ctx.stroke();
  }
}
