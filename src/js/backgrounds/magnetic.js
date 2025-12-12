class MagneticBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.magnets = [];
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
    this.createMagnets();
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
    this.magnets.push({
      x: e.clientX,
      y: e.clientY,
      strength: 100,
      polarity: Math.random() > 0.5 ? 1 : -1,
    });
    
    if (this.magnets.length > 5) {
      this.magnets.shift();
    }
  }

  createParticles() {
    this.particles = [];
    const count = 150;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        charge: Math.random() > 0.5 ? 1 : -1,
      });
    }
  }

  createMagnets() {
    this.magnets = [
      { x: this.canvas.width * 0.25, y: this.canvas.height * 0.5, strength: 100, polarity: 1 },
      { x: this.canvas.width * 0.75, y: this.canvas.height * 0.5, strength: 100, polarity: -1 },
    ];
  }

  animate() {
    if (!this.canvas) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#0a0a14';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw magnets
    this.magnets.forEach(magnet => {
      this.ctx.fillStyle = magnet.polarity > 0 ? 'rgba(255, 100, 100, 0.3)' : 'rgba(100, 100, 255, 0.3)';
      this.ctx.beginPath();
      this.ctx.arc(magnet.x, magnet.y, 20, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    this.particles.forEach(particle => {
      // Magnetic forces
      this.magnets.forEach(magnet => {
        const dx = magnet.x - particle.x;
        const dy = magnet.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0 && distance < 200) {
          const force = (magnet.strength / (distance * distance)) * magnet.polarity * particle.charge;
          particle.vx += (dx / distance) * force * 0.01;
          particle.vy += (dy / distance) * force * 0.01;
        }
      });
      
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Boundary
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -0.8;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -0.8;
      
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      
      // Draw particle
      this.ctx.fillStyle = particle.charge > 0 ? 'rgba(255, 150, 150, 0.8)' : 'rgba(150, 150, 255, 0.8)';
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
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

export default MagneticBackground;


