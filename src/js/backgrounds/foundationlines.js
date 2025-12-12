class FoundationLinesBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.lines = [];
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
    const count = 15;
    for (let i = 0; i < count; i++) {
      this.lines.push({
        x1: Math.random() * this.canvas.width,
        y1: Math.random() * this.canvas.height,
        x2: Math.random() * this.canvas.width,
        y2: Math.random() * this.canvas.height,
        width: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.2,
      });
    }
  }

  animate() {
    if (!this.canvas) return;
    
    // Concrete background
    this.ctx.fillStyle = '#3a3a3a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.lines.forEach(line => {
      // Mouse interaction
      const dx1 = this.mouse.x - line.x1;
      const dy1 = this.mouse.y - line.y1;
      const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
      
      if (dist1 < 100 && dist1 > 0) {
        const force = (100 - dist1) / 100;
        line.x1 += (dx1 / dist1) * force * 2;
        line.y1 += (dy1 / dist1) * force * 2;
      }
      
      const dx2 = this.mouse.x - line.x2;
      const dy2 = this.mouse.y - line.y2;
      const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
      
      if (dist2 < 100 && dist2 > 0) {
        const force = (100 - dist2) / 100;
        line.x2 += (dx2 / dist2) * force * 2;
        line.y2 += (dy2 / dist2) * force * 2;
      }
      
      // Draw foundation line
      this.ctx.strokeStyle = `rgba(150, 150, 150, ${line.opacity})`;
      this.ctx.lineWidth = line.width;
      this.ctx.beginPath();
      this.ctx.moveTo(line.x1, line.y1);
      this.ctx.lineTo(line.x2, line.y2);
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

export default FoundationLinesBackground;


