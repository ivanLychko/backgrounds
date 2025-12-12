class CirclesBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.circles = [];
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
    
    this.createCircles();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createCircles();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  handleClick(e) {
    this.circles.push({
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      maxRadius: Math.random() * 100 + 50,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      life: 1,
    });
  }

  createCircles() {
    this.circles = [];
    const count = 20;
    for (let i = 0; i < count; i++) {
      this.circles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 50 + 20,
        maxRadius: Math.random() * 100 + 50,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        life: Math.random(),
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }
  }

  animate() {
    if (!this.canvas) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#0a0a14';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.circles.forEach((circle, index) => {
      // Pulse animation
      circle.life += circle.pulseSpeed;
      if (circle.life > 1) circle.life = 0;
      
      const pulse = Math.sin(circle.life * Math.PI * 2) * 0.3 + 0.7;
      const radius = circle.radius * pulse;
      
      // Mouse interaction
      const dx = this.mouse.x - circle.x;
      const dy = this.mouse.y - circle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      let drawX = circle.x;
      let drawY = circle.y;
      
      if (distance < 200 && distance > 0) {
        const force = (200 - distance) / 200;
        drawX += (dx / distance) * force * 30;
        drawY += (dy / distance) * force * 30;
      }
      
      // Draw circle
      const gradient = this.ctx.createRadialGradient(
        drawX, drawY, 0,
        drawX, drawY, radius
      );
      gradient.addColorStop(0, circle.color.replace(')', ', 0.8)').replace('hsl', 'hsla'));
      gradient.addColorStop(1, circle.color.replace(')', ', 0)').replace('hsl', 'hsla'));
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Remove expanding circles
      if (circle.maxRadius && circle.radius >= circle.maxRadius) {
        this.circles.splice(index, 1);
      } else if (circle.maxRadius) {
        circle.radius += 1;
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

export default CirclesBackground;


