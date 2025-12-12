class ConcreteSurfaceBackground {
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
    
    this.time += 0.005;
    
    // Base concrete color
    this.ctx.fillStyle = '#4a4a4a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw concrete surface texture
    for (let y = 0; y < this.canvas.height; y += 2) {
      for (let x = 0; x < this.canvas.width; x += 2) {
        const noise = Math.sin(x * 0.05 + this.time) * Math.cos(y * 0.05 + this.time);
        const shade = 70 + noise * 15;
        
        // Mouse influence
        const dx = (this.mouse.x * this.canvas.width) - x;
        const dy = (this.mouse.y * this.canvas.height) - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let finalShade = shade;
        if (distance < 100) {
          finalShade += (100 - distance) / 100 * 20;
        }
        
        this.ctx.fillStyle = `rgb(${finalShade}, ${finalShade}, ${finalShade})`;
        this.ctx.fillRect(x, y, 2, 2);
      }
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

export default ConcreteSurfaceBackground;


