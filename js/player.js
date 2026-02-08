class Player {
  constructor(x, y, characterType) {
    this.x = x;
    this.y = y;
    this.width = CONFIG.PLAYER_WIDTH;
    this.height = CONFIG.PLAYER_HEIGHT;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.facingRight = true;

    this.characterType = characterType; // 'chad' or 'diana'

    this.lives = CONFIG.PLAYER_MAX_LIVES;
    this.score = 0;
    this.bullsCollected = 0;
    this.totalBullsCollected = 0;
    this.powered = false;
    this.invincible = false;
    this.invincibleTimer = 0;
    this.damageInvTimer = 0;
    this.alive = true;
    this.hodlTimer = 0;
    this.hodlActive = false;

    // Crouch state
    this.crouching = false;
    this.crouchTimer = 0;       // how long we've been crouching
    this.superJumpReady = false; // true when crouch is charged

    this.animTime = 0;
    this.state = 'idle';

    this.spawnX = x;
    this.spawnY = y;
    this.deathAnimTimer = 0;
    this.deathAnimating = false;

    // Jump event flags (read and cleared by main.js each frame)
    this.jumpedThisFrame = false;
    this.superJumpedThisFrame = false;
  }

  _getStandingHeight() {
    return this.powered ? CONFIG.PLAYER_POWERED_HEIGHT : CONFIG.PLAYER_HEIGHT;
  }

  _getCrouchHeight() {
    return this.powered ? CONFIG.PLAYER_POWERED_CROUCH_HEIGHT : CONFIG.PLAYER_CROUCH_HEIGHT;
  }

  update(dt, input, solids) {
    if (this.deathAnimating) {
      this.deathAnimTimer += dt;
      this.vy += CONFIG.GRAVITY * dt * 0.5;
      this.y += this.vy * dt;
      return;
    }

    // === JUMP (check BEFORE crouch so releasing down + jumping on same frame still works) ===
    this.jumpedThisFrame = false;
    this.superJumpedThisFrame = false;
    if (input.jump && this.onGround && !this.hodlActive) {
      if (this.superJumpReady) {
        // SUPER JUMP from crouch!
        this.vy = CONFIG.PLAYER_SUPER_JUMP_VELOCITY;
        // Restore standing height for the jump
        if (this.crouching) {
          const standHeight = this._getStandingHeight();
          this.y -= (standHeight - this.height);
          this.height = standHeight;
        }
        this.superJumpedThisFrame = true;
      } else {
        this.vy = CONFIG.PLAYER_JUMP_VELOCITY;
        if (this.crouching) {
          const standHeight = this._getStandingHeight();
          this.y -= (standHeight - this.height);
          this.height = standHeight;
        }
        this.jumpedThisFrame = true;
      }
      this.crouching = false;
      this.crouchTimer = 0;
      this.superJumpReady = false;
      this.onGround = false;
      this.hodlTimer = 0;
    }

    // === CROUCH ===
    if (!this.crouching && !this.superJumpReady) {
      const wantsCrouch = input.down && this.onGround && !this.hodlActive;
      if (wantsCrouch) {
        // Start crouching — shrink hitbox, keep feet on the ground
        this.crouching = true;
        this.crouchTimer = 0;
        this.superJumpReady = false;
        const oldHeight = this.height;
        this.height = this._getCrouchHeight();
        this.y += (oldHeight - this.height); // keep feet planted
      }
    } else if (this.crouching) {
      this.crouchTimer += dt;
      if (this.crouchTimer >= CONFIG.PLAYER_CROUCH_TIME) {
        this.superJumpReady = true;
      }
      // Stand up when down is released
      if (!input.down) {
        this._standUp(solids);
      }
    }

    // Cancel crouch if not on ground
    if (!this.onGround && this.crouching) {
      this._standUp(solids);
    }

    // === HORIZONTAL MOVEMENT ===
    // Slower when crouching
    const accel = this.crouching ? CONFIG.PLAYER_ACCELERATION * 0.3 : CONFIG.PLAYER_ACCELERATION;
    const maxSpeed = this.invincible ? CONFIG.PLAYER_RUN_SPEED * 1.4
                   : this.crouching ? CONFIG.PLAYER_RUN_SPEED * 0.3
                   : CONFIG.PLAYER_RUN_SPEED;

    if (input.left && !this.hodlActive) {
      this.vx -= accel * dt;
      this.facingRight = false;
      this.hodlTimer = 0;
    } else if (input.right && !this.hodlActive) {
      this.vx += accel * dt;
      this.facingRight = true;
      this.hodlTimer = 0;
    } else {
      this.vx *= CONFIG.GROUND_FRICTION;
      if (Math.abs(this.vx) < 5) this.vx = 0;
    }

    this.vx = Math.clamp(this.vx, -maxSpeed, maxSpeed);

    // === HODL Easter egg ===
    if (this.vx === 0 && this.onGround && !input.left && !input.right && !input.jump && !input.down) {
      this.hodlTimer += dt;
      if (this.hodlTimer >= 5.0 && !this.hodlActive && !this.invincible) {
        this.hodlActive = true;
        this.invincible = true;
        this.invincibleTimer = Infinity;
      }
    }
    if (this.hodlActive && (input.left || input.right || input.jump)) {
      this.hodlActive = false;
      if (this.invincibleTimer === Infinity) {
        this.invincible = false;
        this.invincibleTimer = 0;
      }
      this.hodlTimer = 0;
    }

    // === PHYSICS ===
    applyGravity(this, dt);
    moveAndCollide(this, solids, dt);

    // Clamp to left edge of level
    if (this.x < 0) {
      this.x = 0;
      this.vx = 0;
    }

    // Update invincibility timers
    if (this.invincibleTimer > 0 && this.invincibleTimer !== Infinity) {
      this.invincibleTimer -= dt;
      if (this.invincibleTimer <= 0) {
        this.invincible = false;
        this.invincibleTimer = 0;
      }
    }
    if (this.damageInvTimer > 0) {
      this.damageInvTimer -= dt;
    }

    // === ANIMATION STATE ===
    this.animTime += dt;
    if (!this.onGround) {
      this.state = this.vy < 0 ? 'jumping' : 'falling';
    } else if (this.crouching) {
      this.state = this.superJumpReady ? 'crouch_ready' : 'crouching';
    } else if (Math.abs(this.vx) > 10) {
      this.state = 'running';
    } else if (this.hodlActive) {
      this.state = 'hodl';
    } else {
      this.state = 'idle';
    }
  }

  _standUp(solids) {
    if (!this.crouching) return;
    const standHeight = this._getStandingHeight();
    const heightDiff = standHeight - this.height;
    // Check if there's room to stand up
    const testY = this.y - heightDiff;
    const testEntity = { x: this.x, y: testY, width: this.width, height: standHeight };
    let blocked = false;
    for (const solid of solids) {
      if (aabbOverlap(testEntity, solid)) {
        blocked = true;
        break;
      }
    }
    if (!blocked) {
      this.y -= heightDiff;
      this.height = standHeight;
      this.crouching = false;
      this.crouchTimer = 0;
      this.superJumpReady = false;
    }
    // If blocked, stay crouched
  }

  takeDamage() {
    if (this.invincible || this.damageInvTimer > 0) return false;
    if (this.powered) {
      this.powered = false;
      this.width = CONFIG.PLAYER_WIDTH;
      this.height = this.crouching ? CONFIG.PLAYER_CROUCH_HEIGHT : CONFIG.PLAYER_HEIGHT;
      this.damageInvTimer = CONFIG.PLAYER_INVINCIBILITY_TIME;
      return false;
    }
    return true;
  }

  die() {
    this.lives--;
    this.deathAnimating = true;
    this.deathAnimTimer = 0;
    this.vy = -400;
    this.vx = 0;
    this.crouching = false;
    this.crouchTimer = 0;
    this.superJumpReady = false;
  }

  respawn() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.vx = 0;
    this.vy = 0;
    this.deathAnimating = false;
    this.deathAnimTimer = 0;
    this.damageInvTimer = CONFIG.PLAYER_INVINCIBILITY_TIME;
    this.onGround = false;
    this.crouching = false;
    this.crouchTimer = 0;
    this.superJumpReady = false;
    this.width = CONFIG.PLAYER_WIDTH;
    this.height = CONFIG.PLAYER_HEIGHT;
  }

  collectBull() {
    this.bullsCollected++;
    this.totalBullsCollected++;
    this.score += CONFIG.BULL_SCORE;
    if (this.bullsCollected >= CONFIG.BULLS_FOR_EXTRA_LIFE) {
      this.bullsCollected -= CONFIG.BULLS_FOR_EXTRA_LIFE;
      this.lives++;
      return true;
    }
    return false;
  }

  applyPowerUp(type) {
    if (type === 'greenCandle') {
      if (!this.powered) {
        this.powered = true;
        const newHeight = this.crouching ? CONFIG.PLAYER_POWERED_CROUCH_HEIGHT : CONFIG.PLAYER_POWERED_HEIGHT;
        this.y -= (newHeight - this.height);
        this.width = CONFIG.PLAYER_POWERED_WIDTH;
        this.height = newHeight;
      }
    } else if (type === 'chargingBull') {
      this.invincible = true;
      this.invincibleTimer = CONFIG.INVINCIBILITY_DURATION;
      this.hodlActive = false;
    }
  }

  render(ctx, camera) {
    if (this.damageInvTimer > 0 && Math.floor(this.damageInvTimer * 10) % 2 === 0 && !this.deathAnimating) {
      return;
    }

    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;

    ctx.save();

    // Invincibility glow
    if (this.invincible) {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = CONFIG.COLORS.BULL_GOLD;
      ctx.beginPath();
      ctx.arc(screenX + this.width / 2, screenY + this.height / 2, this.width * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      const hue = (this.animTime * 200) % 360;
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = 'hsl(' + hue + ', 100%, 60%)';
      ctx.fillRect(screenX - 2, screenY - 2, this.width + 4, this.height + 4);
      ctx.globalAlpha = 1;
    }

    // HODL mode visual
    if (this.hodlActive) {
      ctx.fillStyle = 'rgba(0,255,136,0.2)';
      ctx.beginPath();
      ctx.arc(screenX + this.width / 2, screenY + this.height / 2, this.width, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = CONFIG.COLORS.TICKER_GREEN;
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('HODL', screenX + this.width / 2, screenY - 12);
    }

    // Super jump ready indicator
    if (this.superJumpReady && this.crouching) {
      // Pulsing glow under feet
      const pulse = 0.3 + Math.sin(this.animTime * 10) * 0.2;
      ctx.globalAlpha = pulse;
      ctx.fillStyle = CONFIG.COLORS.BULL_GOLD;
      ctx.beginPath();
      ctx.ellipse(screenX + this.width / 2, screenY + this.height, this.width * 0.7, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Arrow indicator
      ctx.fillStyle = CONFIG.COLORS.BULL_GOLD;
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      const bounce = Math.sin(this.animTime * 8) * 3;
      ctx.fillText('\u25B2', screenX + this.width / 2, screenY - 8 + bounce);
    }

    if (!this.facingRight) {
      ctx.translate(screenX + this.width, screenY);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(screenX, screenY);
    }

    // When crouching, squash the character drawing
    if (this.crouching) {
      const standH = this._getStandingHeight();
      const squashRatio = this.height / standH;
      // Scale vertically to squash, keep bottom aligned
      ctx.translate(0, this.height);
      ctx.scale(1.15, squashRatio); // slightly wider when crouching
      ctx.translate(-this.width * 0.075, -standH); // offset for wider scale
      // Draw at standing dimensions — the scale will squash it
      if (this.characterType === 'chad') {
        this._renderChad(ctx, this.width / 1.15, standH);
      } else {
        this._renderDiana(ctx, this.width / 1.15, standH);
      }
    } else {
      if (this.characterType === 'chad') {
        this._renderChad(ctx, this.width, this.height);
      } else {
        this._renderDiana(ctx, this.width, this.height);
      }
    }

    ctx.restore();
  }

  _renderChad(ctx, w, h) {
    const legSwing = this.state === 'running' ? Math.sin(this.animTime * 12) * 8 : 0;
    const armSwing = this.state === 'running' ? Math.sin(this.animTime * 12) * 15 : 0;

    // Legs
    ctx.fillStyle = '#1a1a3a';
    ctx.save();
    ctx.translate(w * 0.25, h * 0.68);
    ctx.rotate(legSwing * Math.PI / 180);
    ctx.fillRect(-w * 0.09, 0, w * 0.18, h * 0.32);
    ctx.fillStyle = '#111';
    ctx.fillRect(-w * 0.09, h * 0.28, w * 0.22, h * 0.06);
    ctx.restore();

    ctx.fillStyle = '#1a1a3a';
    ctx.save();
    ctx.translate(w * 0.7, h * 0.68);
    ctx.rotate(-legSwing * Math.PI / 180);
    ctx.fillRect(-w * 0.09, 0, w * 0.18, h * 0.32);
    ctx.fillStyle = '#111';
    ctx.fillRect(-w * 0.09, h * 0.28, w * 0.22, h * 0.06);
    ctx.restore();

    // Body (suit jacket)
    ctx.fillStyle = CONFIG.COLORS.PLAYER_SUIT;
    ctx.fillRect(w * 0.1, h * 0.3, w * 0.8, h * 0.4);

    // Shirt collar / V-neck
    ctx.fillStyle = CONFIG.COLORS.PLAYER_SHIRT;
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h * 0.3);
    ctx.lineTo(w * 0.5, h * 0.5);
    ctx.lineTo(w * 0.65, h * 0.3);
    ctx.fill();

    // Tie
    ctx.fillStyle = CONFIG.COLORS.PLAYER_TIE;
    ctx.beginPath();
    ctx.moveTo(w * 0.45, h * 0.32);
    ctx.lineTo(w * 0.55, h * 0.32);
    ctx.lineTo(w * 0.52, h * 0.58);
    ctx.lineTo(w * 0.5, h * 0.62);
    ctx.lineTo(w * 0.48, h * 0.58);
    ctx.closePath();
    ctx.fill();

    // Left arm
    ctx.fillStyle = CONFIG.COLORS.PLAYER_SUIT;
    ctx.save();
    ctx.translate(w * 0.08, h * 0.32);
    ctx.rotate(-armSwing * Math.PI / 180 * 0.5);
    ctx.fillRect(0, 0, w * 0.14, h * 0.3);
    ctx.fillStyle = CONFIG.COLORS.PLAYER_SKIN;
    ctx.fillRect(0, h * 0.27, w * 0.12, h * 0.06);
    ctx.restore();

    // Right arm + briefcase
    ctx.fillStyle = CONFIG.COLORS.PLAYER_SUIT;
    ctx.save();
    ctx.translate(w * 0.78, h * 0.32);
    ctx.rotate(armSwing * Math.PI / 180 * 0.5);
    ctx.fillRect(0, 0, w * 0.14, h * 0.3);
    ctx.fillStyle = CONFIG.COLORS.PLAYER_SKIN;
    ctx.fillRect(0, h * 0.27, w * 0.12, h * 0.06);
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(-w * 0.02, h * 0.3, w * 0.28, h * 0.18);
    ctx.fillStyle = '#A07818';
    ctx.fillRect(-w * 0.02, h * 0.3, w * 0.28, h * 0.04);
    ctx.fillStyle = CONFIG.COLORS.BULL_GOLD;
    ctx.fillRect(w * 0.08, h * 0.34, w * 0.08, h * 0.03);
    ctx.restore();

    // Head
    ctx.fillStyle = CONFIG.COLORS.PLAYER_SKIN;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.18, w * 0.28, h * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair (slicked back)
    ctx.fillStyle = CONFIG.COLORS.PLAYER_HAIR_MALE;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.1, w * 0.3, h * 0.1, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w * 0.2, h * 0.08, w * 0.6, h * 0.06);

    // Eyes
    ctx.fillStyle = CONFIG.COLORS.BLACK;
    ctx.fillRect(w * 0.35, h * 0.16, 3, 4);
    ctx.fillRect(w * 0.58, h * 0.16, 3, 4);

    // Confident smile
    ctx.strokeStyle = CONFIG.COLORS.BLACK;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.22, 5, 0.1, Math.PI - 0.1);
    ctx.stroke();

    if (this.powered) {
      ctx.fillStyle = 'rgba(0,204,102,0.15)';
      ctx.fillRect(0, 0, w, h);
    }
  }

  _renderDiana(ctx, w, h) {
    const legSwing = this.state === 'running' ? Math.sin(this.animTime * 12) * 8 : 0;
    const armSwing = this.state === 'running' ? Math.sin(this.animTime * 12) * 12 : 0;

    // Legs
    ctx.fillStyle = '#1a1a3a';
    ctx.save();
    ctx.translate(w * 0.28, h * 0.68);
    ctx.rotate(legSwing * Math.PI / 180);
    ctx.fillRect(-w * 0.08, 0, w * 0.16, h * 0.3);
    ctx.fillStyle = '#333';
    ctx.fillRect(-w * 0.08, h * 0.26, w * 0.2, h * 0.06);
    ctx.restore();

    ctx.fillStyle = '#1a1a3a';
    ctx.save();
    ctx.translate(w * 0.68, h * 0.68);
    ctx.rotate(-legSwing * Math.PI / 180);
    ctx.fillRect(-w * 0.08, 0, w * 0.16, h * 0.3);
    ctx.fillStyle = '#333';
    ctx.fillRect(-w * 0.08, h * 0.26, w * 0.2, h * 0.06);
    ctx.restore();

    // Body (power blazer)
    ctx.fillStyle = CONFIG.COLORS.PLAYER_BLAZER;
    ctx.fillRect(w * 0.1, h * 0.3, w * 0.8, h * 0.4);

    // Blazer lapels
    ctx.fillStyle = CONFIG.COLORS.PLAYER_BLAZER_LIGHT;
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h * 0.3);
    ctx.lineTo(w * 0.5, h * 0.45);
    ctx.lineTo(w * 0.65, h * 0.3);
    ctx.lineTo(w * 0.6, h * 0.3);
    ctx.lineTo(w * 0.5, h * 0.4);
    ctx.lineTo(w * 0.4, h * 0.3);
    ctx.fill();

    // Blouse
    ctx.fillStyle = '#E8E0D0';
    ctx.beginPath();
    ctx.moveTo(w * 0.4, h * 0.3);
    ctx.lineTo(w * 0.5, h * 0.42);
    ctx.lineTo(w * 0.6, h * 0.3);
    ctx.fill();

    // Left arm
    ctx.fillStyle = CONFIG.COLORS.PLAYER_BLAZER;
    ctx.save();
    ctx.translate(w * 0.08, h * 0.32);
    ctx.rotate(-armSwing * Math.PI / 180 * 0.4);
    ctx.fillRect(0, 0, w * 0.14, h * 0.28);
    ctx.fillStyle = CONFIG.COLORS.PLAYER_SKIN;
    ctx.fillRect(0, h * 0.25, w * 0.12, h * 0.06);
    ctx.restore();

    // Right arm + tablet
    ctx.fillStyle = CONFIG.COLORS.PLAYER_BLAZER;
    ctx.save();
    ctx.translate(w * 0.78, h * 0.32);
    ctx.rotate(armSwing * Math.PI / 180 * 0.4);
    ctx.fillRect(0, 0, w * 0.14, h * 0.28);
    ctx.fillStyle = CONFIG.COLORS.PLAYER_SKIN;
    ctx.fillRect(0, h * 0.25, w * 0.12, h * 0.06);
    ctx.fillStyle = '#222';
    ctx.fillRect(-w * 0.06, h * 0.28, w * 0.3, h * 0.2);
    ctx.fillStyle = '#4488FF';
    ctx.fillRect(-w * 0.04, h * 0.3, w * 0.26, h * 0.14);
    ctx.strokeStyle = CONFIG.COLORS.TICKER_GREEN;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-w * 0.02, h * 0.4);
    ctx.lineTo(w * 0.04, h * 0.36);
    ctx.lineTo(w * 0.1, h * 0.38);
    ctx.lineTo(w * 0.16, h * 0.33);
    ctx.lineTo(w * 0.2, h * 0.34);
    ctx.stroke();
    ctx.restore();

    // Head
    ctx.fillStyle = CONFIG.COLORS.PLAYER_SKIN;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.18, w * 0.26, h * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = CONFIG.COLORS.PLAYER_HAIR_FEMALE;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.1, w * 0.3, h * 0.12, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w * 0.2, h * 0.06, w * 0.6, h * 0.08);
    ctx.fillRect(w * 0.15, h * 0.1, w * 0.14, h * 0.22);
    ctx.fillRect(w * 0.71, h * 0.1, w * 0.14, h * 0.22);
    ctx.beginPath();
    ctx.arc(w * 0.22, h * 0.32, w * 0.07, 0, Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.78, h * 0.32, w * 0.07, 0, Math.PI);
    ctx.fill();

    // Eyes
    ctx.fillStyle = CONFIG.COLORS.BLACK;
    ctx.fillRect(w * 0.36, h * 0.16, 3, 4);
    ctx.fillRect(w * 0.58, h * 0.16, 3, 4);

    // Eyelashes
    ctx.strokeStyle = CONFIG.COLORS.BLACK;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w * 0.34, h * 0.15);
    ctx.lineTo(w * 0.42, h * 0.15);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w * 0.56, h * 0.15);
    ctx.lineTo(w * 0.64, h * 0.15);
    ctx.stroke();

    // Smile
    ctx.strokeStyle = '#CC6666';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.22, 4, 0.1, Math.PI - 0.1);
    ctx.stroke();

    if (this.powered) {
      ctx.fillStyle = 'rgba(0,204,102,0.15)';
      ctx.fillRect(0, 0, w, h);
    }
  }
}
