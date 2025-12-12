class CrackPatternBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.cracks = [];
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
    
    this.createCracks();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createCracks();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  createCracks() {
    this.cracks = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      this.cracks.push({
        startX: Math.random() * this.canvas.width,
        startY: Math.random() * this.canvas.height,
        points: [],
        width: Math.random() * 2 + 1,
      });
      
      // Generate crack path
      let x = this.cracks[i].startX;
      let y = this.cracks[i].startY;
      const segments = 20;
      
      for (let j = 0; j < segments; j++) {
        this.cracks[i].points.push({ x, y });
        x += (Math.random() - 0.5) * 30;
        y += Math.random() * 20 + 5;
        if (y > this.canvas.height) break;
      }
    }
  }

  animate() {
    if (!this.canvas) return;
    
    this.time += 0.01;
    
    // Concrete background
    this.ctx.fillStyle = '#4a4a4a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw cracks
    this.cracks.forEach(crack => {
      this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.6)';
      this.ctx.lineWidth = crack.width;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      
      this.ctx.beginPath();
      crack.points.forEach((point, i) => {
        // Mouse interaction
        const dx = this.mouse.x - point.x;
        const dy = this.mouse.y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let x = point.x;
        let y = point.y;
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          x += (dx / distance) * force * 5;
          y += (dy / distance) * force * 5;
        }
        
        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      });
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

export default CrackPatternBackground;


