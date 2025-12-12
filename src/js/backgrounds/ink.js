class InkBackground {
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
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    
    if (Math.random() > 0.7) {
      this.drops.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 30 + 20,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        life: 1,
      });
    }
  }

  handleClick(e) {
    for (let i = 0; i < 5; i++) {
      this.drops.push({
        x: e.clientX + (Math.random() - 0.5) * 50,
        y: e.clientY + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        size: Math.random() * 40 + 30,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        life: 1,
      });
    }
  }

  animate() {
    if (!this.canvas) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drops.forEach((drop, index) => {
      drop.x += drop.vx;
      drop.y += drop.vy;
      drop.vx *= 0.98;
      drop.vy *= 0.98;
      drop.size *= 0.99;
      drop.life -= 0.01;
      
      if (drop.life <= 0 || drop.size < 1) {
        this.drops.splice(index, 1);
      } else {
        // Draw ink blob
        const gradient = this.ctx.createRadialGradient(
          drop.x, drop.y, 0,
          drop.x, drop.y, drop.size
        );
        gradient.addColorStop(0, drop.color.replace(')', ', 0.8)').replace('hsl', 'hsla'));
        gradient.addColorStop(0.5, drop.color.replace(')', ', 0.4)').replace('hsl', 'hsla'));
        gradient.addColorStop(1, drop.color.replace(')', ', 0)').replace('hsl', 'hsla'));
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
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
      this.canvas.removeEventListener('click', (e) => this.handleClick(e));
    }
  }
}

export default InkBackground;


