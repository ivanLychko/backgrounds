class FractalBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
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
    
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX / this.canvas.width;
    this.mouse.y = e.clientY / this.canvas.height;
  }

  drawFractal(x, y, size, depth, maxDepth) {
    if (depth > maxDepth) return;
    
    const mouseX = this.mouse.x * this.canvas.width;
    const mouseY = this.mouse.y * this.canvas.height;
    const dx = mouseX - x;
    const dy = mouseY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const hue = (this.time * 50 + depth * 30) % 360;
    const alpha = 1 - depth / maxDepth;
    const scale = distance < 200 ? 1 + (1 - distance / 200) * 0.2 : 1;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.scale(scale, scale);
    this.ctx.rotate(this.time + depth);
    
    this.ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${alpha})`;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const px = Math.cos(angle) * size;
      const py = Math.sin(angle) * size;
      if (i === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
    }
    this.ctx.closePath();
    this.ctx.stroke();
    
    this.ctx.restore();
    
    // Recursive calls
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const newX = x + Math.cos(angle) * size * 0.6;
      const newY = y + Math.sin(angle) * size * 0.6;
      this.drawFractal(newX, newY, size * 0.5, depth + 1, maxDepth);
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
    const size = Math.min(this.canvas.width, this.canvas.height) * 0.2;
    
    this.drawFractal(centerX, centerY, size, 0, 4);
    
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

export default FractalBackground;


