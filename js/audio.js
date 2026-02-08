class AudioManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      this.enabled = false;
    }
  }

  _playTone(frequency, duration, type, volume, delay) {
    if (!this.ctx || !this.enabled) return;
    type = type || 'square';
    volume = volume || 0.12;
    delay = delay || 0;

    const startTime = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, startTime);
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  playJump() {
    this._playTone(350, 0.08, 'square', 0.1);
    this._playTone(520, 0.1, 'square', 0.08, 0.04);
  }

  playCollect() {
    this._playTone(880, 0.06, 'sine', 0.12);
    this._playTone(1320, 0.1, 'sine', 0.08, 0.05);
  }

  playStomp() {
    this._playTone(180, 0.12, 'sawtooth', 0.15);
    this._playTone(90, 0.15, 'square', 0.08, 0.05);
  }

  playDamage() {
    this._playTone(200, 0.2, 'sawtooth', 0.15);
    this._playTone(120, 0.25, 'sawtooth', 0.1, 0.08);
  }

  playDeath() {
    const notes = [400, 350, 300, 250, 200, 150, 100];
    notes.forEach((freq, i) => {
      this._playTone(freq, 0.18, 'square', 0.12, i * 0.1);
    });
  }

  playPowerUp() {
    const notes = [400, 500, 600, 700, 800, 1000, 1200];
    notes.forEach((freq, i) => {
      this._playTone(freq, 0.08, 'sine', 0.1, i * 0.05);
    });
  }

  playExtraLife() {
    const notes = [523, 659, 784, 1047, 784, 1047];
    notes.forEach((freq, i) => {
      this._playTone(freq, 0.15, 'sine', 0.12, i * 0.1);
    });
  }

  playLevelComplete() {
    const notes = [523, 587, 659, 784, 880, 1047];
    notes.forEach((freq, i) => {
      this._playTone(freq, 0.25, 'sine', 0.12, i * 0.12);
    });
    // Triumphant chord
    this._playTone(523, 0.5, 'sine', 0.06, 0.8);
    this._playTone(659, 0.5, 'sine', 0.06, 0.8);
    this._playTone(784, 0.5, 'sine', 0.06, 0.8);
    this._playTone(1047, 0.5, 'sine', 0.06, 0.8);
  }

  playBlockHit() {
    this._playTone(600, 0.06, 'square', 0.08);
    this._playTone(800, 0.06, 'square', 0.06, 0.03);
  }

  playHodl() {
    this._playTone(440, 0.3, 'sine', 0.08);
    this._playTone(550, 0.3, 'sine', 0.06, 0.15);
    this._playTone(660, 0.4, 'sine', 0.08, 0.3);
  }

  playSuperJump() {
    this._playTone(300, 0.06, 'square', 0.1);
    this._playTone(500, 0.06, 'square', 0.08, 0.03);
    this._playTone(700, 0.08, 'square', 0.08, 0.06);
    this._playTone(900, 0.12, 'sine', 0.1, 0.09);
  }

  playMarginCall() {
    this._playTone(300, 0.15, 'sawtooth', 0.12);
    this._playTone(200, 0.2, 'sawtooth', 0.15, 0.1);
    this._playTone(100, 0.4, 'sawtooth', 0.12, 0.2);
  }
}
