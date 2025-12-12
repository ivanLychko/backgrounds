class HexagonBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.hexagons = [];
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
    
    this.createHexagons();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createHexagons();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  createHexagons() {
    this.hexagons = [];
    const size = 40;
    const cols = Math.ceil(this.canvas.width / (size * 1.5)) + 1;
    const rows = Math.ceil(this.canvas.height / (size * Math.sqrt(3))) + 1;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * size * 1.5 + (row % 2) * size * 0.75;
        const y = row * size * Math.sqrt(3);
        
        this.hexagons.push({
          x,
          y,
          size,
          hue: (row + col) * 5,
        });
      }
    }
  }

  drawHexagon(hex) {
    const dx = this.mouse.x - hex.x;
    const dy = this.mouse.y - hex.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 150;
    
    const scale = distance < maxDist ? 1 + (1 - distance / maxDist) * 0.3 : 1;
    const brightness = distance < maxDist ? 50 + (1 - distance / maxDist) * 50 : 30;
    
    this.ctx.save();
    this.ctx.translate(hex.x, hex.y);
    this.ctx.scale(scale, scale);
    
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = Math.cos(angle) * hex.size;
      const y = Math.sin(angle) * hex.size;
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    
    this.ctx.fillStyle = `hsl(${hex.hue}, 70%, ${brightness}%)`;
    this.ctx.fill();
    this.ctx.strokeStyle = `hsl(${hex.hue}, 70%, ${brightness + 10}%)`;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    
    this.ctx.restore();
  }

  animate() {
    if (!this.canvas) return;
    
    this.ctx.fillStyle = '#0a0a1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.hexagons.forEach(hex => {
      this.drawHexagon(hex);
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

export default HexagonBackground;


