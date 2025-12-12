class FoundationMeshBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.points = [];
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
    
    this.createPoints();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createPoints();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  createPoints() {
    this.points = [];
    const spacing = 50;
    const cols = Math.ceil(this.canvas.width / spacing);
    const rows = Math.ceil(this.canvas.height / spacing);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        this.points.push({
          x: col * spacing,
          y: row * spacing,
          originalX: col * spacing,
          originalY: row * spacing,
        });
      }
    }
  }

  animate() {
    if (!this.canvas) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#2d2d2d';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update points
    this.points.forEach(point => {
      const dx = this.mouse.x - point.originalX;
      const dy = this.mouse.y - point.originalY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 180;
      
      if (distance < maxDist) {
        const force = (maxDist - distance) / maxDist;
        point.x = point.originalX + (dx / distance) * force * 40;
        point.y = point.originalY + (dy / distance) * force * 40;
      } else {
        point.x += (point.originalX - point.x) * 0.1;
        point.y += (point.originalY - point.y) * 0.1;
      }
    });
    
    // Draw mesh connections
    this.points.forEach((point, i) => {
      const row = Math.floor(i / Math.ceil(this.canvas.width / 50));
      const col = i % Math.ceil(this.canvas.width / 50);
      
      // Connect to right
      if (col < Math.ceil(this.canvas.width / 50) - 1) {
        const right = this.points[i + 1];
        const dist = Math.sqrt((right.x - point.x) ** 2 + (right.y - point.y) ** 2);
        const opacity = Math.min(0.5, 50 / dist);
        this.ctx.strokeStyle = `rgba(130, 130, 130, ${opacity})`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(point.x, point.y);
        this.ctx.lineTo(right.x, right.y);
        this.ctx.stroke();
      }
      
      // Connect to bottom
      if (row < Math.ceil(this.canvas.height / 50) - 1) {
        const bottom = this.points[i + Math.ceil(this.canvas.width / 50)];
        const dist = Math.sqrt((bottom.x - point.x) ** 2 + (bottom.y - point.y) ** 2);
        const opacity = Math.min(0.5, 50 / dist);
        this.ctx.strokeStyle = `rgba(130, 130, 130, ${opacity})`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(point.x, point.y);
        this.ctx.lineTo(bottom.x, bottom.y);
        this.ctx.stroke();
      }
    });
    
    // Draw points
    this.points.forEach(point => {
      this.ctx.fillStyle = 'rgba(160, 160, 160, 0.8)';
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
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

export default FoundationMeshBackground;


