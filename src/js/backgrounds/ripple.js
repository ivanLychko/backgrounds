class RippleBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.ripples = [];
    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.innerHTML = '';
    this.container.appendChild(this.canvas);
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  handleClick(e) {
    this.ripples.push({
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      maxRadius: Math.max(this.canvas.width, this.canvas.height) * 0.8,
      life: 1,
    });
  }

  handleMouseMove(e) {
    if (Math.random() > 0.95) {
      this.ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 100,
        life: 1,
      });
    }
  }

  animate() {
    if (!this.canvas) return;
    
    // Gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw ripples
    this.ripples.forEach((ripple, index) => {
      ripple.radius += 2;
      ripple.life -= 0.01;
      
      if (ripple.life <= 0 || ripple.radius > ripple.maxRadius) {
        this.ripples.splice(index, 1);
      } else {
        this.ctx.strokeStyle = `rgba(100, 200, 255, ${ripple.life * 0.6})`;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Inner ring
        if (ripple.radius > 20) {
          this.ctx.strokeStyle = `rgba(150, 150, 255, ${ripple.life * 0.4})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.arc(ripple.x, ripple.y, ripple.radius - 20, 0, Math.PI * 2);
          this.ctx.stroke();
        }
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
      this.canvas.removeEventListener('click', (e) => this.handleClick(e));
      this.canvas.removeEventListener('mousemove', (e) => this.handleMouseMove(e));
    }
  }
}

export default RippleBackground;


