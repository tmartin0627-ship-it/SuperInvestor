class InputHandler {
  constructor() {
    this.keys = {};
    this.justPressed = {};

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
    });
  }

  isHeld(code) { return !!this.keys[code]; }
  wasPressed(code) { return !!this.justPressed[code]; }
  clearFrameState() { this.justPressed = {}; }

  get left() { return this.isHeld('ArrowLeft') || this.isHeld('KeyA'); }
  get right() { return this.isHeld('ArrowRight') || this.isHeld('KeyD'); }
  get down() { return this.isHeld('ArrowDown') || this.isHeld('KeyS'); }
  get jump() { return this.wasPressed('Space') || this.wasPressed('ArrowUp') || this.wasPressed('KeyW'); }
  get enter() { return this.wasPressed('Enter') || this.wasPressed('Space'); }
}
