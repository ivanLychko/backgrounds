class DotsBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.dots = [];
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
    
    this.createDots();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createDots();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  createDots() {
    this.dots = [];
    const spacing = 40;
    const cols = Math.ceil(this.canvas.width / spacing);
    const rows = Math.ceil(this.canvas.height / spacing);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        this.dots.push({
          x: col * spacing,
          y: row * spacing,
          size: Math.random() * 3 + 2,
          hue: (row + col) * 5,
        });
      }
    }
  }

  animate() {
    if (!this.canvas) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#0a0a14';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.dots.forEach(dot => {
      const dx = this.mouse.x - dot.x;
      const dy = this.mouse.y - dot.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 150;
      
      let size = dot.size;
      let brightness = 50;
      
      if (distance < maxDist) {
        const factor = 1 - distance / maxDist;
        size += factor * 5;
        brightness += factor * 50;
      }
      
      this.ctx.fillStyle = `hsl(${dot.hue}, 70%, ${brightness}%)`;
      this.ctx.beginPath();
      this.ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
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

export default DotsBackground;


