class PolyurethaneFlowBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.drops = [];
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
    
    this.createDrops();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createDrops();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  createDrops() {
    this.drops = [];
    const count = 80;
    for (let i = 0; i < count; i++) {
      this.drops.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: Math.random() * 0.5 + 0.2,
        size: Math.random() * 4 + 2,
        life: Math.random(),
      });
    }
  }

  animate() {
    if (!this.canvas) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#323232';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drops.forEach((drop, i) => {
      // Mouse interaction - injection point
      const dx = this.mouse.x - drop.x;
      const dy = this.mouse.y - drop.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 120) {
        const force = (120 - distance) / 120;
        drop.vx += (dx / distance) * force * 0.08;
        drop.vy += (dy / distance) * force * 0.08;
      }
      
      drop.x += drop.vx;
      drop.y += drop.vy;
      drop.life += 0.005;
      
      if (drop.y > this.canvas.height) {
        drop.y = -drop.size;
        drop.x = Math.random() * this.canvas.width;
      }
      
      if (drop.x < 0 || drop.x > this.canvas.width) {
        drop.vx *= -0.8;
      }
      
      drop.vx *= 0.99;
      drop.vy *= 0.99;
      
      // Draw polyurethane drop (beige/cream color)
      const alpha = Math.sin(drop.life) * 0.2 + 0.7;
      this.ctx.fillStyle = `rgba(200, 180, 150, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Connections (expanding foam effect)
      this.drops.slice(i + 1).forEach(other => {
        const dx = other.x - drop.x;
        const dy = other.y - drop.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 70) {
          this.ctx.strokeStyle = `rgba(200, 180, 150, ${0.2 * (1 - dist / 70)})`;
          this.ctx.lineWidth = 1.5;
          this.ctx.beginPath();
          this.ctx.moveTo(drop.x, drop.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.stroke();
        }
      });
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

export default PolyurethaneFlowBackground;


