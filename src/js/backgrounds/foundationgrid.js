class FoundationGridBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
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
    
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  animate() {
    if (!this.canvas) return;
    
    // Concrete background
    this.ctx.fillStyle = '#3a3a3a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    const gridSize = 50;
    const cols = Math.ceil(this.canvas.width / gridSize);
    const rows = Math.ceil(this.canvas.height / gridSize);
    
    // Draw grid
    this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
    this.ctx.lineWidth = 1;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * gridSize;
        const y = row * gridSize;
        
        // Mouse interaction
        const dx = this.mouse.x - (x + gridSize / 2);
        const dy = this.mouse.y - (y + gridSize / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = distance < 150 ? (150 - distance) / 150 : 0;
        
        if (distance < 150) {
          const offsetX = (dx / distance) * force * 10;
          const offsetY = (dy / distance) * force * 10;
          
          this.ctx.strokeStyle = `rgba(150, 150, 150, ${0.5 + force * 0.5})`;
        } else {
          this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
        }
        
        this.ctx.beginPath();
        this.ctx.rect(x, y, gridSize, gridSize);
        this.ctx.stroke();
        
        // Draw connection to mouse
        if (distance < 150) {
          this.ctx.strokeStyle = `rgba(150, 150, 150, ${force * 0.3})`;
          this.ctx.beginPath();
          this.ctx.moveTo(x + gridSize / 2, y + gridSize / 2);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.stroke();
        }
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

export default FoundationGridBackground;

