class RingsBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.rings = [];
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
    
    this.createRings();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createRings();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX / this.canvas.width;
    this.mouse.y = e.clientY / this.canvas.height;
  }

  createRings() {
    this.rings = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      this.rings.push({
        radius: (i + 1) * 50,
        speed: (i + 1) * 0.01,
        hue: i * 45,
        pulse: Math.random() * Math.PI * 2,
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
    
    // Mouse offset
    const offsetX = (mouseX - centerX) * 0.3;
    const offsetY = (mouseY - centerY) * 0.3;
    
    this.rings.forEach(ring => {
      ring.pulse += ring.speed;
      const radius = ring.radius + Math.sin(ring.pulse) * 10;
      const hue = (ring.hue + this.time * 50) % 360;
      
      this.ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(centerX + offsetX, centerY + offsetY, radius, 0, Math.PI * 2);
      this.ctx.stroke();
      
      // Inner glow
      this.ctx.strokeStyle = `hsla(${hue}, 70%, 70%, 0.3)`;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.arc(centerX + offsetX, centerY + offsetY, radius - 5, 0, Math.PI * 2);
      this.ctx.stroke();
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

export default RingsBackground;


