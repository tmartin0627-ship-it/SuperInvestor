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
    this.crashSpeedMult = 1.0;
  }

  update(dt, solids) {
    if (!this.alive) {
      this.deathTimer += dt;
      return this.deathTimer < 0.4;
    }

    applyGravity(this, dt);

    this.x += this.vx * this.crashSpeedMult * dt;
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
    this.stunned = false;
    this.stunnedTimer = 0;
    this.crashSpeedMult = 1.0;
  }

  update(dt, solids, playerX) {
    if (!this.alive) {
      this.deathTimer += dt;
      return this.deathTimer < 0.4;
    }

    // Stunned state: slower movement, no charging
    if (this.stunned) {
      this.stunnedTimer += dt;
    }

    // Charge detection (disabled when stunned)
    const dist = Math.abs(playerX - (this.x + this.width / 2));
    if (!this.stunned && dist < CONFIG.GRIZZLY_DETECT_RANGE) {
      this.charging = true;
      const dir = playerX > this.x + this.width / 2 ? 1 : -1;
      this.vx = CONFIG.GRIZZLY_CHARGE_SPEED * dir;
      this.facingRight = dir > 0;
    } else if (this.charging) {
      this.charging = false;
      this.vx = CONFIG.GRIZZLY_SPEED * (this.facingRight ? 1 : -1);
    }

    // Stunned grizzlies move at half speed
    const speedMult = this.stunned ? 0.4 : 1.0;

    applyGravity(this, dt);

    this.x += this.vx * speedMult * this.crashSpeedMult * dt;
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

    // Armor shield indicator — only when at full HP
    if (!this.charging && this.hp >= CONFIG.GRIZZLY_HP) {
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

    // Stunned indicator — circling stars when HP < max
    if (this.stunned) {
      ctx.globalAlpha = 0.8;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      for (let s = 0; s < 3; s++) {
        const angle = this.stunnedTimer * 4 + s * (Math.PI * 2 / 3);
        const starX = w / 2 + Math.cos(angle) * 16;
        const starY = -6 + Math.sin(angle) * 6;
        ctx.fillStyle = '#FFD700';
        ctx.fillText('\u2605', starX, starY);
      }
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

class WhaleBoss {
  constructor(x, y, arenaLeft, arenaRight) {
    this.x = x;
    this.y = y;
    this.width = 120;
    this.height = 90;
    this.alive = true;
    this.hp = 9;
    this.maxHp = 9;
    this.phase = 1; // 1, 2, 3
    this.arenaLeft = arenaLeft;
    this.arenaRight = arenaRight;
    this.vx = 150; // charge speed
    this.vy = 0;
    this.onGround = true;
    this.facingRight = false;
    this.animTime = 0;
    this.stompFlashTimer = 0;
    this.deathTimer = 0;
    this.crashSpeedMult = 1.0;
    this.stunned = false;
    this.stunTimer = 0;
    this.attackTimer = 0;
    this.jumpTimer = 0;
    this.projectileTimer = 0;
    this.shockwaves = []; // active shockwave objects
    this.projectiles = []; // red candle projectiles in phase 3
    this.activated = false; // only starts when player enters arena
  }

  update(dt, solids, playerX) {
    if (!this.alive) {
      this.deathTimer += dt;
      return this.deathTimer < 1.5;
    }

    this.animTime += dt;

    // Activate when player is near
    if (!this.activated) {
      if (Math.abs(playerX - this.x) < 400) {
        this.activated = true;
      } else {
        return true;
      }
    }

    // Stunned state
    if (this.stunned) {
      this.stunTimer -= dt;
      if (this.stunTimer <= 0) {
        this.stunned = false;
      }
      // Update shockwaves and projectiles even while stunned
      this._updateShockwaves(dt);
      this._updateProjectiles(dt);
      return true;
    }

    // Gravity
    this.vy += CONFIG.GRAVITY * dt;
    if (this.vy > CONFIG.MAX_FALL_SPEED) this.vy = CONFIG.MAX_FALL_SPEED;
    this.y += this.vy * dt;

    // Ground collision
    const groundY = 432;
    if (this.y + this.height >= groundY) {
      // Landing — spawn shockwave in phase 2+
      if (!this.onGround && this.phase >= 2) {
        this.shockwaves.push({
          x: this.x + this.width / 2,
          y: groundY,
          radius: 0,
          maxRadius: 80,
          speed: 200
        });
      }
      this.y = groundY - this.height;
      this.vy = 0;
      this.onGround = true;
    }

    // Charge movement
    const speed = this.vx * this.crashSpeedMult;
    if (this.facingRight) {
      this.x += speed * dt;
    } else {
      this.x -= speed * dt;
    }

    // Bounce off arena walls
    if (this.x <= this.arenaLeft) {
      this.x = this.arenaLeft;
      this.facingRight = true;
    }
    if (this.x + this.width >= this.arenaRight) {
      this.x = this.arenaRight - this.width;
      this.facingRight = false;
    }

    // Phase 2: Periodic jumping
    if (this.phase >= 2) {
      this.jumpTimer += dt;
      if (this.jumpTimer >= 2.5 && this.onGround) {
        this.vy = -600;
        this.onGround = false;
        this.jumpTimer = 0;
      }
    }

    // Phase 3: Periodic red candle projectiles
    if (this.phase >= 3) {
      this.projectileTimer += dt;
      if (this.projectileTimer >= 1.8) {
        this.projectileTimer = 0;
        // Spawn 3 projectiles above the arena
        for (let i = 0; i < 3; i++) {
          const px = this.arenaLeft + 50 + Math.random() * (this.arenaRight - this.arenaLeft - 100);
          this.projectiles.push({
            x: px,
            y: 50 + Math.random() * 50,
            vy: 200,
            width: 16,
            height: 24,
          });
        }
      }
    }

    // Update shockwaves
    this._updateShockwaves(dt);
    // Update projectiles
    this._updateProjectiles(dt);

    if (this.stompFlashTimer > 0) this.stompFlashTimer -= dt;

    return true;
  }

  _updateShockwaves(dt) {
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed * dt;
      if (sw.radius > sw.maxRadius) {
        this.shockwaves.splice(i, 1);
      }
    }
  }

  _updateProjectiles(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.y += p.vy * dt;
      if (p.y > CONFIG.VIRTUAL_HEIGHT + 100) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  stomp() {
    this.hp--;
    this.stunned = true;
    this.stunTimer = 0.5;
    this.stompFlashTimer = 0.3;

    if (this.hp === 6) {
      this.phase = 2;
      this.vx = 180;
    }
    if (this.hp === 3) {
      this.phase = 3;
      this.vx = 200;
    }
    if (this.hp <= 0) {
      this.alive = false;
      return true;
    }
    return false;
  }

  render(ctx, camera) {
    const sx = this.x - camera.x;
    const sy = this.y - camera.y;
    if (sx + this.width < -50 || sx > CONFIG.VIRTUAL_WIDTH + 50) return;

    const w = this.width;
    const h = this.height;

    ctx.save();

    if (!this.alive) {
      // Death animation — flash and shrink
      const deathPulse = Math.sin(this.deathTimer * 20) > 0;
      ctx.globalAlpha = Math.max(0, 1 - this.deathTimer / 1.5);
      const shrink = Math.max(0.1, 1 - this.deathTimer / 1.2);
      ctx.translate(sx + w / 2, sy + h);
      ctx.scale(shrink, shrink);
      ctx.translate(-w / 2, -h);
      if (deathPulse) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h);
      } else {
        this._drawWhaleBody(ctx, w, h);
      }
      ctx.restore();
      return;
    }

    ctx.translate(sx, sy);

    // Flip based on direction
    if (!this.facingRight) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }

    this._drawWhaleBody(ctx, w, h);

    // Stomp flash
    if (this.stompFlashTimer > 0) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }

    // Stunned stars
    if (this.stunned) {
      ctx.globalAlpha = 0.8;
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      for (let s = 0; s < 4; s++) {
        const angle = this.animTime * 5 + s * (Math.PI * 2 / 4);
        const starX = w / 2 + Math.cos(angle) * 30;
        const starY = -10 + Math.sin(angle) * 8;
        ctx.fillStyle = '#FFD700';
        ctx.fillText('\u2605', starX, starY);
      }
      ctx.globalAlpha = 1;
    }

    ctx.restore();

    // Boss name above (screen space, not flipped)
    if (this.alive) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('THE WHALE', sx + w / 2, sy - 14);
    }

    // Render shockwaves
    for (const sw of this.shockwaves) {
      const swx = sw.x - camera.x;
      const swy = sw.y - camera.y;
      const opacity = Math.max(0, 1 - sw.radius / sw.maxRadius);
      ctx.globalAlpha = opacity * 0.6;
      ctx.strokeStyle = this.phase === 3 ? '#FF4444' : '#FFAA00';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(swx, swy, sw.radius, Math.PI, 0);
      ctx.stroke();
      // Second ring
      ctx.globalAlpha = opacity * 0.3;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(swx, swy, sw.radius * 0.7, Math.PI, 0);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Render projectiles
    for (const p of this.projectiles) {
      const px = p.x - camera.x;
      const py = p.y - camera.y;
      // Warning glow
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.arc(px + p.width / 2, py + p.height / 2, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      // Candle body
      ctx.fillStyle = '#CC0000';
      ctx.fillRect(px + 2, py + 6, p.width - 4, p.height - 8);
      // Wick
      ctx.fillStyle = '#990000';
      ctx.fillRect(px + p.width / 2 - 2, py, 4, 8);
      ctx.fillRect(px + p.width / 2 - 2, py + p.height - 4, 4, 6);
      // Down arrow
      ctx.fillStyle = '#FF4444';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('\u25BC', px + p.width / 2, py + p.height + 8);
    }
  }

  _drawWhaleBody(ctx, w, h) {
    // Body color changes by phase
    let bodyColor, bellyColor, eyeColor;
    if (this.phase === 1) {
      bodyColor = '#2a3a5a';
      bellyColor = '#8a9aaa';
      eyeColor = '#FFFFFF';
    } else if (this.phase === 2) {
      bodyColor = '#5a2a2a';
      bellyColor = '#aa7a7a';
      eyeColor = '#FF4444';
    } else {
      bodyColor = '#6a1a1a';
      bellyColor = '#cc6666';
      eyeColor = '#FF0000';
    }

    // Phase 3 particle trail
    if (this.phase === 3) {
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 5; i++) {
        const trailX = -10 - i * 12 + Math.sin(this.animTime * 8 + i) * 4;
        const trailY = h * 0.5 + Math.cos(this.animTime * 6 + i * 2) * 10;
        ctx.fillStyle = i % 2 === 0 ? '#FF4444' : '#FF8800';
        ctx.beginPath();
        ctx.arc(trailX, trailY, 4 - i * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Large oval body
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.55, w * 0.48, h * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();

    // Light belly
    ctx.fillStyle = bellyColor;
    ctx.beginPath();
    ctx.ellipse(w * 0.48, h * 0.65, w * 0.32, h * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flipper-like arms
    ctx.fillStyle = bodyColor;
    // Top flipper
    ctx.beginPath();
    ctx.ellipse(w * 0.3, h * 0.3, w * 0.12, h * 0.2, -0.6, 0, Math.PI * 2);
    ctx.fill();
    // Bottom flipper
    ctx.beginPath();
    ctx.ellipse(w * 0.25, h * 0.7, w * 0.1, h * 0.08, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Tail fin
    ctx.beginPath();
    ctx.moveTo(w * 0.02, h * 0.45);
    ctx.quadraticCurveTo(-w * 0.08, h * 0.2, -w * 0.04, h * 0.15);
    ctx.quadraticCurveTo(w * 0.02, h * 0.35, w * 0.05, h * 0.45);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(w * 0.02, h * 0.55);
    ctx.quadraticCurveTo(-w * 0.08, h * 0.8, -w * 0.04, h * 0.85);
    ctx.quadraticCurveTo(w * 0.02, h * 0.65, w * 0.05, h * 0.55);
    ctx.fill();

    // Head shape (front of the whale)
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(w * 0.78, h * 0.5, w * 0.22, h * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = eyeColor;
    ctx.beginPath();
    ctx.arc(w * 0.82, h * 0.38, 6, 0, Math.PI * 2);
    ctx.fill();
    // Eye pupil
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(w * 0.83, h * 0.38, 3, 0, Math.PI * 2);
    ctx.fill();
    // Phase 2/3: glowing eye ring
    if (this.phase >= 2) {
      ctx.globalAlpha = 0.5 + Math.sin(this.animTime * 6) * 0.3;
      ctx.strokeStyle = eyeColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(w * 0.82, h * 0.38, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Open mouth when not stunned
    if (!this.stunned) {
      ctx.fillStyle = '#1a0000';
      ctx.beginPath();
      ctx.ellipse(w * 0.92, h * 0.58, w * 0.08, h * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      // Teeth
      ctx.fillStyle = '#FFFFFF';
      for (let t = 0; t < 3; t++) {
        ctx.fillRect(w * 0.87 + t * 6, h * 0.52, 3, 5);
        ctx.fillRect(w * 0.87 + t * 6, h * 0.62, 3, 5);
      }
    }

    // Bear-like ears (whale-bear hybrid)
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(w * 0.72, h * 0.18, w * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.88, h * 0.18, w * 0.06, 0, Math.PI * 2);
    ctx.fill();
    // Inner ears
    ctx.fillStyle = bellyColor;
    ctx.beginPath();
    ctx.arc(w * 0.72, h * 0.18, w * 0.03, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.88, h * 0.18, w * 0.03, 0, Math.PI * 2);
    ctx.fill();

    // Angry eyebrows
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.74, h * 0.28);
    ctx.lineTo(w * 0.84, h * 0.32);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w * 0.92, h * 0.28);
    ctx.lineTo(w * 0.85, h * 0.32);
    ctx.stroke();
  }
}
