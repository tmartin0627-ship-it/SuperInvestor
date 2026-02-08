class Camera {
  constructor(viewportWidth, viewportHeight) {
    this.x = 0;
    this.y = 0;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.levelWidth = 0;
    this.levelHeight = 0;
  }

  follow(target, dt) {
    const lookahead = target.facingRight ? CONFIG.CAMERA_LOOKAHEAD : -CONFIG.CAMERA_LOOKAHEAD;
    const targetX = target.x + target.width / 2 - this.viewportWidth / 2 + lookahead;

    const dx = targetX - this.x;
    if (Math.abs(dx) > CONFIG.CAMERA_DEAD_ZONE_X) {
      this.x += dx * CONFIG.CAMERA_SMOOTHING;
    }

    const targetY = target.y + target.height / 2 - this.viewportHeight * 0.6;
    this.y += (targetY - this.y) * 0.05;

    // Clamp to level bounds
    this.x = Math.max(0, Math.min(this.x, this.levelWidth - this.viewportWidth));
    this.y = Math.max(0, Math.min(this.y, this.levelHeight - this.viewportHeight));
  }
}
