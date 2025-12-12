class LightningBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.bolts = [];
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
    
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createBolt(x1, y1, x2, y2, depth) {
    if (depth > 8) return [{ x: x2, y: y2 }];
    
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const offsetX = (Math.random() - 0.5) * 30;
    const offsetY = (Math.random() - 0.5) * 30;
    
    const points1 = this.createBolt(x1, y1, midX + offsetX, midY + offsetY, depth + 1);
    const points2 = this.createBolt(midX + offsetX, midY + offsetY, x2, y2, depth + 1);
    
    return [{ x: x1, y: y1 }, ...points1, ...points2];
  }

  animate() {
    if (!this.canvas) return;
    
    this.time += 0.01;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#0a0a1e';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Create new bolts occasionally
    if (Math.random() > 0.95 || this.bolts.length === 0) {
      const x = Math.random() * this.canvas.width;
      this.bolts.push({
        points: this.createBolt(x, 0, x + (Math.random() - 0.5) * 200, this.canvas.height, 0),
        life: 1,
        color: `hsl(${Math.random() * 60 + 200}, 100%, 70%)`,
      });
    }
    
    // Update and draw bolts
    this.bolts.forEach((bolt, index) => {
      bolt.life -= 0.02;
      
      if (bolt.life <= 0) {
        this.bolts.splice(index, 1);
      } else {
        this.ctx.strokeStyle = bolt.color.replace(')', `, ${bolt.life})`).replace('hsl', 'hsla');
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        bolt.points.forEach((point, i) => {
          if (i === 0) {
            this.ctx.moveTo(point.x, point.y);
          } else {
            this.ctx.lineTo(point.x, point.y);
          }
        });
        
        this.ctx.stroke();
        
        // Glow effect
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = bolt.color;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
      }
    });
    
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    window.removeEventListener('resize', () => this.resize());
  }
}

export default LightningBackground;


