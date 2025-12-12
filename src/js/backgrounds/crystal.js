class CrystalBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.crystals = [];
    this.mouse = { x: 0, y: 0 };
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
    
    this.createCrystals();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createCrystals();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  createCrystals() {
    this.crystals = [];
    const count = 20;
    for (let i = 0; i < count; i++) {
      this.crystals.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 40 + 20,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        hue: Math.random() * 360,
        sides: 3 + Math.floor(Math.random() * 4),
      });
    }
  }

  drawCrystal(crystal) {
    this.ctx.save();
    this.ctx.translate(crystal.x, crystal.y);
    this.ctx.rotate(crystal.rotation);
    
    // Mouse interaction
    const dx = this.mouse.x - crystal.x;
    const dy = this.mouse.y - crystal.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const scale = distance < 150 ? 1 + (1 - distance / 150) * 0.3 : 1;
    this.ctx.scale(scale, scale);
    
    // Draw crystal
    this.ctx.beginPath();
    for (let i = 0; i < crystal.sides; i++) {
      const angle = (Math.PI * 2 / crystal.sides) * i;
      const x = Math.cos(angle) * crystal.size;
      const y = Math.sin(angle) * crystal.size;
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, crystal.size);
    gradient.addColorStop(0, `hsla(${crystal.hue}, 70%, 70%, 0.8)`);
    gradient.addColorStop(1, `hsla(${crystal.hue}, 70%, 50%, 0.4)`);
    
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.strokeStyle = `hsla(${crystal.hue}, 70%, 80%, 0.8)`;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    this.ctx.restore();
  }

  animate() {
    if (!this.canvas) return;
    
    this.time += 0.01;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#0a0a14';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.crystals.forEach(crystal => {
      crystal.rotation += crystal.rotationSpeed;
      crystal.hue = (crystal.hue + 0.5) % 360;
      this.drawCrystal(crystal);
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

export default CrystalBackground;


