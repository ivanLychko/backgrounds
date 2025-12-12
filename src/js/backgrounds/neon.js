class NeonBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.lines = [];
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
    
    this.createLines();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createLines();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  createLines() {
    this.lines = [];
    const count = 50;
    for (let i = 0; i < count; i++) {
      this.lines.push({
        x1: Math.random() * this.canvas.width,
        y1: Math.random() * this.canvas.height,
        x2: Math.random() * this.canvas.width,
        y2: Math.random() * this.canvas.height,
        hue: Math.random() * 360,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  animate() {
    if (!this.canvas) return;
    
    this.time += 0.01;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.lines.forEach(line => {
      line.pulse += 0.02;
      
      // Mouse interaction
      const dx1 = this.mouse.x - line.x1;
      const dy1 = this.mouse.y - line.y1;
      const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
      
      if (dist1 < 150 && dist1 > 0) {
        const force = (150 - dist1) / 150;
        line.x1 += (dx1 / dist1) * force * 2;
        line.y1 += (dy1 / dist1) * force * 2;
      }
      
      const dx2 = this.mouse.x - line.x2;
      const dy2 = this.mouse.y - line.y2;
      const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
      
      if (dist2 < 150 && dist2 > 0) {
        const force = (150 - dist2) / 150;
        line.x2 += (dx2 / dist2) * force * 2;
        line.y2 += (dy2 / dist2) * force * 2;
      }
      
      const brightness = Math.sin(line.pulse) * 30 + 70;
      const hue = (line.hue + this.time * 20) % 360;
      
      this.ctx.strokeStyle = `hsl(${hue}, 100%, ${brightness}%)`;
      this.ctx.lineWidth = 2;
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = `hsl(${hue}, 100%, ${brightness}%)`;
      this.ctx.beginPath();
      this.ctx.moveTo(line.x1, line.y1);
      this.ctx.lineTo(line.x2, line.y2);
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;
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

export default NeonBackground;


