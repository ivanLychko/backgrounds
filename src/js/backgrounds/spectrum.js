class SpectrumBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.bars = [];
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
    
    this.createBars();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createBars();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX / this.canvas.width;
    this.mouse.y = e.clientY / this.canvas.height;
  }

  createBars() {
    this.bars = [];
    const count = 50;
    const barWidth = this.canvas.width / count;
    
    for (let i = 0; i < count; i++) {
      this.bars.push({
        x: i * barWidth,
        width: barWidth,
        height: 0,
        targetHeight: Math.random() * this.canvas.height * 0.8,
        hue: (i / count) * 360,
      });
    }
  }

  animate() {
    if (!this.canvas) return;
    
    this.time += 0.01;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.bars.forEach((bar, i) => {
      // Animate height
      bar.targetHeight = (Math.sin(this.time * 2 + i * 0.1) * 0.5 + 0.5) * this.canvas.height * 0.8;
      bar.height += (bar.targetHeight - bar.height) * 0.1;
      
      // Mouse influence
      const mouseX = this.mouse.x * this.canvas.width;
      const barCenter = bar.x + bar.width / 2;
      const distance = Math.abs(mouseX - barCenter);
      
      if (distance < 100) {
        const influence = (100 - distance) / 100;
        bar.height += influence * this.canvas.height * 0.3;
      }
      
      // Draw bar
      const gradient = this.ctx.createLinearGradient(bar.x, this.canvas.height, bar.x, this.canvas.height - bar.height);
      gradient.addColorStop(0, `hsl(${bar.hue}, 100%, 50%)`);
      gradient.addColorStop(1, `hsl(${bar.hue}, 100%, 70%)`);
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(bar.x, this.canvas.height - bar.height, bar.width, bar.height);
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

export default SpectrumBackground;


