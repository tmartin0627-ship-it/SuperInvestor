// ==========================================
//  Touch Controls for Mobile Browser Play
// ==========================================
// Left half: movement (left/right based on touch position)
// Right half: tap = jump, hold = crouch, release after hold = super jump

class TouchControls {
  constructor(canvas, input) {
    this.canvas = canvas;
    this.input = input;
    this.active = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (!this.active) return;

    // Track active touches by identifier
    this.touches = {};  // id -> { x, y, startX, startY, startTime, zone: 'left'|'right' }

    // State
    this.rightHoldStart = 0;   // timestamp when right zone touch began
    this.rightTouchId = null;  // active right-zone touch id
    this.leftTouchId = null;   // active left-zone touch id
    this.rightCrouchActivated = false;  // true once hold exceeds 150ms
    this.currentGameState = GameState.TITLE;

    // Visual hint fade
    this.hintAlpha = 1.0;
    this.gameplayTime = 0;
    this.hintFadeDuration = 6; // seconds until hints fully fade
    this.showingHints = true;

    // Glow feedback
    this.leftGlow = 0;
    this.rightGlow = 0;

    // Bind events
    const opts = { passive: false };
    canvas.addEventListener('touchstart', (e) => this._onTouchStart(e), opts);
    canvas.addEventListener('touchmove', (e) => this._onTouchMove(e), opts);
    canvas.addEventListener('touchend', (e) => this._onTouchEnd(e), opts);
    canvas.addEventListener('touchcancel', (e) => this._onTouchEnd(e), opts);
  }

  _getZone(x) {
    return x < this.canvas.width * 0.5 ? 'left' : 'right';
  }

  _onTouchStart(e) {
    e.preventDefault();

    // On menu screens, any tap = Enter
    if (this.currentGameState !== GameState.PLAYING) {
      // For character select, tap left/right half to pick character
      if (this.currentGameState === GameState.TITLE) {
        const touch = e.changedTouches[0];
        const zone = this._getZone(touch.clientX);
        if (zone === 'left') {
          this.input.triggerTouch('ArrowLeft');
        } else {
          this.input.triggerTouch('ArrowRight');
        }
      }
      this.input.triggerTouch('Enter');
      this.input.triggerTouch('Space');
      return;
    }

    for (const touch of e.changedTouches) {
      const zone = this._getZone(touch.clientX);
      this.touches[touch.identifier] = {
        x: touch.clientX,
        y: touch.clientY,
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: performance.now(),
        zone: zone
      };

      if (zone === 'left') {
        this.leftTouchId = touch.identifier;
        this._updateMovement(touch.clientX);
        this.leftGlow = 0.5;
      } else {
        this.rightTouchId = touch.identifier;
        this.rightHoldStart = performance.now();
        this.rightCrouchActivated = false;
        // Don't crouch immediately — wait a bit so quick taps feel like pure jumps
        // Crouch activates after 150ms (see update method)
        this.rightGlow = 0.5;
      }
    }
  }

  _onTouchMove(e) {
    e.preventDefault();

    for (const touch of e.changedTouches) {
      const t = this.touches[touch.identifier];
      if (!t) continue;

      t.x = touch.clientX;
      t.y = touch.clientY;

      // Only update movement for left-zone touches
      if (t.zone === 'left' && touch.identifier === this.leftTouchId) {
        this._updateMovement(touch.clientX);
      }
    }
  }

  _onTouchEnd(e) {
    e.preventDefault();

    for (const touch of e.changedTouches) {
      const t = this.touches[touch.identifier];
      if (!t) continue;

      if (t.zone === 'left' && touch.identifier === this.leftTouchId) {
        this.input.setTouch('left', false);
        this.input.setTouch('right', false);
        this.leftTouchId = null;
      } else if (t.zone === 'right' && touch.identifier === this.rightTouchId) {
        const holdDuration = performance.now() - this.rightHoldStart;

        // Release crouch if it was activated
        if (this.rightCrouchActivated) {
          this.input.setTouch('down', false);
        }

        // Always trigger jump on release — the game decides normal vs super
        // Quick tap (< 150ms) = never crouched, so normal jump
        // Long hold = was crouching, superJumpReady may be set, so super jump
        this.input.triggerTouch('Space');

        this.rightTouchId = null;
        this.rightCrouchActivated = false;
      }

      delete this.touches[touch.identifier];
    }
  }

  _updateMovement(touchX) {
    const screenWidth = this.canvas.width;
    // Left half is the movement zone (0 to 50%)
    // Within that: left quarter (0-25%) = move left, right quarter (25-50%) = move right
    const midpoint = screenWidth * 0.25;

    if (touchX < midpoint) {
      this.input.setTouch('left', true);
      this.input.setTouch('right', false);
    } else {
      this.input.setTouch('left', false);
      this.input.setTouch('right', true);
    }
  }

  update(dt, gameState) {
    if (!this.active) return;
    this.currentGameState = gameState;

    // Track gameplay time for hint fading
    if (gameState === GameState.PLAYING) {
      this.gameplayTime += dt;
      if (this.gameplayTime > this.hintFadeDuration) {
        this.hintAlpha = Math.max(0, 1.0 - (this.gameplayTime - this.hintFadeDuration) / 2);
      }
    } else {
      // Reset hints when not playing (so they show again on new game)
      this.gameplayTime = 0;
      this.hintAlpha = 1.0;
    }

    // Activate crouch after 150ms of holding right side (so quick taps don't crouch)
    if (this.rightTouchId !== null && !this.rightCrouchActivated) {
      const holdTime = performance.now() - this.rightHoldStart;
      if (holdTime >= 150) {
        this.rightCrouchActivated = true;
        this.input.setTouch('down', true);
      }
    }

    // Fade glow
    this.leftGlow = Math.max(0, this.leftGlow - dt * 2);
    this.rightGlow = Math.max(0, this.rightGlow - dt * 2);
  }

  render(ctx, screenW, screenH, gameState) {
    if (!this.active) return;

    // Always show hints on menus, fade during gameplay
    const alpha = gameState === GameState.PLAYING ? this.hintAlpha : 0.7;
    if (alpha <= 0.01) return; // fully faded, skip rendering

    ctx.save();

    // Zone divider line
    ctx.strokeStyle = 'rgba(255, 255, 255, ' + (alpha * 0.15) + ')';
    ctx.lineWidth = 1;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(screenW * 0.5, screenH * 0.3);
    ctx.lineTo(screenW * 0.5, screenH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Active zone glow
    if (this.leftGlow > 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, ' + (this.leftGlow * 0.08) + ')';
      ctx.fillRect(0, 0, screenW * 0.5, screenH);
    }
    if (this.rightGlow > 0) {
      ctx.fillStyle = 'rgba(255, 215, 0, ' + (this.rightGlow * 0.08) + ')';
      ctx.fillRect(screenW * 0.5, 0, screenW * 0.5, screenH);
    }

    // Hint text and arrows
    const fontSize = Math.max(12, Math.min(16, screenW * 0.025));
    ctx.font = fontSize + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Left side hints
    const leftCenterX = screenW * 0.25;
    const hintY = screenH * 0.85;

    // Left arrow
    ctx.fillStyle = 'rgba(255, 255, 255, ' + (alpha * 0.4) + ')';
    const arrowSize = Math.max(20, screenW * 0.035);
    this._drawArrow(ctx, screenW * 0.12, hintY, arrowSize, 'left', alpha * 0.4);

    // Right arrow
    this._drawArrow(ctx, screenW * 0.38, hintY, arrowSize, 'right', alpha * 0.4);

    // "MOVE" label
    ctx.fillStyle = 'rgba(255, 255, 255, ' + (alpha * 0.3) + ')';
    ctx.fillText('MOVE', leftCenterX, hintY + arrowSize + 8);

    // Right side hints
    const rightCenterX = screenW * 0.75;

    // Jump icon (up arrow)
    this._drawArrow(ctx, rightCenterX - arrowSize * 1.2, hintY, arrowSize, 'up', alpha * 0.4);

    // Crouch icon (down arrow)
    this._drawArrow(ctx, rightCenterX + arrowSize * 1.2, hintY, arrowSize * 0.8, 'down', alpha * 0.3);

    // Labels
    ctx.fillStyle = 'rgba(255, 255, 255, ' + (alpha * 0.3) + ')';
    ctx.fillText('TAP = JUMP', rightCenterX, hintY + arrowSize + 8);

    const smallFont = Math.max(10, fontSize * 0.8);
    ctx.font = smallFont + 'px sans-serif';
    ctx.fillStyle = 'rgba(255, 215, 0, ' + (alpha * 0.3) + ')';
    ctx.fillText('HOLD = CROUCH + SUPER JUMP', rightCenterX, hintY + arrowSize + 8 + smallFont + 4);

    // Show active touch indicators
    if (this.leftTouchId !== null && this.touches[this.leftTouchId]) {
      const t = this.touches[this.leftTouchId];
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.arc(t.x, t.y, 40, 0, Math.PI * 2);
      ctx.fill();
    }
    if (this.rightTouchId !== null && this.touches[this.rightTouchId]) {
      const t = this.touches[this.rightTouchId];
      const holdTime = performance.now() - this.rightHoldStart;
      const color = holdTime > 250 ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.15)';
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 40, 0, Math.PI * 2);
      ctx.fill();

      // Charging indicator ring
      if (holdTime > 100) {
        const charge = Math.min(1, holdTime / 250);
        ctx.strokeStyle = 'rgba(255, 215, 0, ' + (charge * 0.5) + ')';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 45, -Math.PI / 2, -Math.PI / 2 + charge * Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  _drawArrow(ctx, x, y, size, direction, alpha) {
    ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
    ctx.beginPath();
    const hs = size / 2;
    switch (direction) {
      case 'left':
        ctx.moveTo(x - hs, y);
        ctx.lineTo(x + hs, y - hs);
        ctx.lineTo(x + hs, y + hs);
        break;
      case 'right':
        ctx.moveTo(x + hs, y);
        ctx.lineTo(x - hs, y - hs);
        ctx.lineTo(x - hs, y + hs);
        break;
      case 'up':
        ctx.moveTo(x, y - hs);
        ctx.lineTo(x - hs, y + hs);
        ctx.lineTo(x + hs, y + hs);
        break;
      case 'down':
        ctx.moveTo(x, y + hs);
        ctx.lineTo(x - hs, y - hs);
        ctx.lineTo(x + hs, y - hs);
        break;
    }
    ctx.closePath();
    ctx.fill();
  }
}
