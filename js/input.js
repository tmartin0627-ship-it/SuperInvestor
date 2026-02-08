class InputHandler {
  constructor() {
    this.keys = {};
    this.justPressed = {};

    // Touch state (set by TouchControls)
    this.touchState = { left: false, right: false, down: false };
    this.touchJustPressed = {};

    window.addEventListener('keydown', (e) => {
      if (!this.keys[e.code]) {
        this.justPressed[e.code] = true;
      }
      this.keys[e.code] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Reset keys when window loses focus
    window.addEventListener('blur', () => {
      this.keys = {};
      this.justPressed = {};
      this.touchState = { left: false, right: false, down: false };
      this.touchJustPressed = {};
    });
  }

  isHeld(code) { return !!this.keys[code]; }
  wasPressed(code) { return !!this.justPressed[code] || !!this.touchJustPressed[code]; }

  // Called by TouchControls for continuous hold actions (movement, crouch)
  setTouch(action, pressed) {
    this.touchState[action] = pressed;
  }

  // Called by TouchControls for one-frame actions (jump, enter)
  triggerTouch(action) {
    this.touchJustPressed[action] = true;
  }

  clearFrameState() {
    this.justPressed = {};
    this.touchJustPressed = {};
  }

  get left() { return this.isHeld('ArrowLeft') || this.isHeld('KeyA') || this.touchState.left; }
  get right() { return this.isHeld('ArrowRight') || this.isHeld('KeyD') || this.touchState.right; }
  get down() { return this.isHeld('ArrowDown') || this.isHeld('KeyS') || this.touchState.down; }
  get jump() { return this.wasPressed('Space') || this.wasPressed('ArrowUp') || this.wasPressed('KeyW'); }
  get enter() { return this.wasPressed('Enter') || this.wasPressed('Space'); }
}
