class Gradient2Background {
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

  animate() {
    if (!this.canvas) return;
    
    this.time += 0.01;
    
    // Multiple gradient layers
    const layers = [
      { hue: 240, speed: 0.5 },
      { hue: 300, speed: 0.3 },
      { hue: 0, speed: 0.4 },
      { hue: 60, speed: 0.6 },
    ];
    
    layers.forEach((layer, index) => {
      const offset = this.time * layer.speed + index * Math.PI / 2;
      const centerX = this.mouse.x * this.canvas.width;
      const centerY = this.mouse.y * this.canvas.height;
      const radius = Math.max(this.canvas.width, this.canvas.height) * 1.2;
      
      const hue = (layer.hue + Math.sin(offset) * 30) % 360;
      const gradient = this.ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      
      gradient.addColorStop(0, `hsla(${hue}, 100%, 60%, 0.6)`);
      gradient.addColorStop(0.5, `hsla(${(hue + 60) % 360}, 100%, 50%, 0.4)`);
      gradient.addColorStop(1, `hsla(${hue}, 80%, 40%, 0.2)`);
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    });
    
    // Add sparkles
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 30; i++) {
      const x = (Math.sin(this.time * 2 + i) * 0.5 + 0.5) * this.canvas.width;
      const y = (Math.cos(this.time * 1.5 + i) * 0.5 + 0.5) * this.canvas.height;
      const size = Math.sin(this.time + i) * 2 + 3;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
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
    }
  }
}

export default Gradient2Background;


