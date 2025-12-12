class RepairParticlesBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.innerHTML = '';
    this.container.appendChild(this.canvas);

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('click', (e) => this.handleClick(e));

    this.createParticles();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createParticles();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  handleClick(e) {
    // Add repair particles at click point
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x: e.clientX + (Math.random() - 0.5) * 20,
        y: e.clientY + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 2,
        life: 1,
        color: Math.random() > 0.5 ? 'rgba(200, 180, 150, 0.8)' : 'rgba(150, 150, 200, 0.8)',
      });
    }
  }

  createParticles() {
    this.particles = [];
    const count = 50;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        life: Math.random(),
        color: Math.random() > 0.5 ? 'rgba(200, 180, 150, 0.6)' : 'rgba(150, 150, 200, 0.6)',
      });
    }
  }

  animate() {
    if (!this.canvas) return;

    // Полная очистка canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#282828';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle, index) => {
      // Mouse attraction (repair injection point)
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150 && distance > 0) {
        const force = (150 - distance) / 150;
        particle.vx += (dx / distance) * force * 0.1;
        particle.vy += (dy / distance) * force * 0.1;
      }

      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.005;

      // Boundary
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -0.8;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -0.8;

      particle.vx *= 0.98;
      particle.vy *= 0.98;

      if (particle.life <= 0) {
        this.particles.splice(index, 1);
      } else {
        // Draw repair particle
        this.ctx.fillStyle = particle.color.replace(')', `, ${particle.life})`).replace('rgba', 'rgba');
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });

    // Add new particles occasionally
    if (Math.random() < 0.02 && this.particles.length < 100) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        life: 1,
        color: Math.random() > 0.5 ? 'rgba(200, 180, 150, 0.6)' : 'rgba(150, 150, 200, 0.6)',
      });
    }

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    window.removeEventListener('resize', () => this.resize());
    if (this.canvas) {
      this.canvas.removeEventListener('mousemove', (e) => this.handleMouseMove(e));
      this.canvas.removeEventListener('click', (e) => this.handleClick(e));
    }
  }
}

export default RepairParticlesBackground;


