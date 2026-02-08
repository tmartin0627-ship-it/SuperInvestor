class Particle {
  constructor() {
    this.active = false;
  }

  init(x, y, vx, vy, color, life, size) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.life = life;
    this.maxLife = life;
    this.size = size;
    this.active = true;
  }

  update(dt) {
    if (!this.active) return;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += 400 * dt;
    this.life -= dt;
    if (this.life <= 0) this.active = false;
  }

  render(ctx, camera) {
    if (!this.active) return;
    const alpha = this.life / this.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    const sx = this.x - camera.x;
    const sy = this.y - camera.y;
    ctx.fillRect(sx - this.size / 2, sy - this.size / 2, this.size, this.size);
    ctx.globalAlpha = 1;
  }
}

class ParticleSystem {
  constructor(poolSize) {
    poolSize = poolSize || 300;
    this.particles = [];
    for (let i = 0; i < poolSize; i++) {
      this.particles.push(new Particle());
    }
  }

  emit(x, y, count, config) {
    let emitted = 0;
    for (const p of this.particles) {
      if (!p.active && emitted < count) {
        const angle = Math.random() * Math.PI * 2;
        const speed = config.speed * (0.5 + Math.random() * 0.5);
        const upBias = config.upwardBias || 0;
        p.init(
          x + (Math.random() - 0.5) * 10,
          y + (Math.random() - 0.5) * 10,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed - upBias,
          config.colors[Math.floor(Math.random() * config.colors.length)],
          config.life * (0.7 + Math.random() * 0.3),
          config.size * (0.5 + Math.random() * 0.5)
        );
        emitted++;
      }
    }
  }

  bearDeath(x, y) {
    this.emit(x, y, 18, {
      speed: 220,
      upwardBias: 180,
      colors: [CONFIG.COLORS.PARTICLE_RED, '#FF6633', '#CC0000', CONFIG.COLORS.PARTICLE_BEAR],
      life: 0.7,
      size: 8
    });
  }

  bullCollect(x, y) {
    this.emit(x, y, 10, {
      speed: 140,
      upwardBias: 120,
      colors: [CONFIG.COLORS.BULL_GOLD, '#FFF', '#FFE4B5', '#FFAA00'],
      life: 0.5,
      size: 5
    });
  }

  powerUp(x, y, color) {
    this.emit(x, y, 20, {
      speed: 180,
      upwardBias: 150,
      colors: [color, '#FFF', '#FFE4B5'],
      life: 0.8,
      size: 6
    });
  }

  update(dt) {
    for (const p of this.particles) {
      if (p.active) p.update(dt);
    }
  }

  render(ctx, camera) {
    for (const p of this.particles) {
      if (p.active) p.render(ctx, camera);
    }
  }
}

class FloatingText {
  constructor() {
    this.texts = [];
  }

  spawn(x, y, text, color, size, duration) {
    size = size || 20;
    duration = duration || 1.0;
    this.texts.push({
      x: x, y: y, text: text, color: color,
      size: size, duration: duration, maxDuration: duration,
      vy: -80, scale: 1.5
    });
  }

  update(dt) {
    for (const t of this.texts) {
      t.y += t.vy * dt;
      t.duration -= dt;
      t.scale = Math.max(1.0, t.scale - dt * 2);
    }
    this.texts = this.texts.filter(t => t.duration > 0);
  }

  render(ctx, camera) {
    for (const t of this.texts) {
      const alpha = Math.min(1, t.duration / (t.maxDuration * 0.3));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = t.color;
      ctx.font = 'bold ' + Math.round(t.size * t.scale) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillText(t.text, t.x - camera.x + 2, t.y - camera.y + 2);

      ctx.fillStyle = t.color;
      ctx.fillText(t.text, t.x - camera.x, t.y - camera.y);
    }
    ctx.globalAlpha = 1;
  }
}
