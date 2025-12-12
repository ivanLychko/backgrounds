class VortexBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.mouse = { x: 0.5, y: 0.5 };
    this.time = 0;
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
    
    this.createParticles();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createParticles();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX / this.canvas.width;
    this.mouse.y = e.clientY / this.canvas.height;
  }

  createParticles() {
    this.particles = [];
    const count = 200;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * Math.min(this.canvas.width, this.canvas.height) * 0.4,
        speed: Math.random() * 0.02 + 0.01,
        size: Math.random() * 2 + 1,
        hue: Math.random() * 360,
      });
    }
  }

  animate() {
    if (!this.canvas) return;
    
    this.time += 0.01;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#0a0a14';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const mouseX = this.mouse.x * this.canvas.width;
    const mouseY = this.mouse.y * this.canvas.height;
    
    this.particles.forEach(particle => {
      // Vortex rotation
      particle.angle += particle.speed;
      particle.radius += 0.1;
      
      // Mouse influence
      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const mouseAngle = Math.atan2(dy, dx);
      const mouseDist = Math.sqrt(dx * dx + dy * dy);
      
      if (mouseDist > 0) {
        particle.angle += (mouseAngle - particle.angle) * 0.01;
      }
      
      if (particle.radius > Math.min(this.canvas.width, this.canvas.height) * 0.5) {
        particle.radius = 0;
        particle.angle = Math.random() * Math.PI * 2;
      }
      
      const x = centerX + Math.cos(particle.angle) * particle.radius;
      const y = centerY + Math.sin(particle.angle) * particle.radius;
      
      const hue = (particle.hue + this.time * 50) % 360;
      this.ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, particle.size, 0, Math.PI * 2);
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
    }
  }
}

export default VortexBackground;


