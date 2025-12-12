class WaterproofBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.layers = [];
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
    
    // Concrete foundation
    this.ctx.fillStyle = '#3a3a3a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Waterproof membrane layers
    for (let layer = 0; layer < 3; layer++) {
      const offset = layer * 0.2;
      const yBase = this.canvas.height * (0.3 + offset * 0.2);
      const mouseY = this.mouse.y * this.canvas.height;
      const y = yBase + (mouseY - yBase) * 0.1;
      
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      
      for (let x = 0; x < this.canvas.width; x += 2) {
        const wave = Math.sin(x * 0.008 + this.time + offset) * 15;
        const mouseWave = (this.mouse.x - x / this.canvas.width) * 20;
        const height = wave + mouseWave;
        
        this.ctx.lineTo(x, y + height);
      }
      
      this.ctx.lineTo(this.canvas.width, this.canvas.height);
      this.ctx.lineTo(0, this.canvas.height);
      this.ctx.closePath();
      
      // Waterproof membrane color (blue-gray gradient)
      const gradient = this.ctx.createLinearGradient(0, y, 0, this.canvas.height);
      gradient.addColorStop(0, `rgba(60, 90, 120, ${0.7 - layer * 0.2})`);
      gradient.addColorStop(1, `rgba(40, 70, 100, ${0.5 - layer * 0.15})`);
      
      this.ctx.fillStyle = gradient;
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

export default WaterproofBackground;


