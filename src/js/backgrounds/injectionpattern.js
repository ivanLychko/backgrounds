class InjectionPatternBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.injections = [];
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
    
    this.createInjections();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createInjections();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  handleClick(e) {
    // Add injection point
    this.injections.push({
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      maxRadius: 100,
      life: 1,
    });
  }

  createInjections() {
    this.injections = [];
    const count = 5;
    for (let i = 0; i < count; i++) {
      this.injections.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 50,
        maxRadius: Math.random() * 100 + 50,
        life: Math.random() * 0.5 + 0.5,
      });
    }
  }

  animate() {
    if (!this.canvas) return;
    
    // Concrete background
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#323232';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.injections.forEach((injection, index) => {
      injection.radius += 0.5;
      injection.life -= 0.005;
      
      // Mouse interaction
      const dx = this.mouse.x - injection.x;
      const dy = this.mouse.y - injection.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const force = (150 - distance) / 150;
        injection.radius += force * 2;
      }
      
      if (injection.life <= 0 || injection.radius > injection.maxRadius) {
        if (injection.life <= 0) {
          this.injections.splice(index, 1);
        } else {
          injection.radius = 0;
          injection.life = 1;
        }
      } else {
        // Draw injection pattern (polyurethane expanding)
        const gradient = this.ctx.createRadialGradient(
          injection.x, injection.y, 0,
          injection.x, injection.y, injection.radius
        );
        gradient.addColorStop(0, `rgba(200, 180, 150, ${injection.life * 0.8})`);
        gradient.addColorStop(0.5, `rgba(180, 160, 130, ${injection.life * 0.6})`);
        gradient.addColorStop(1, `rgba(150, 130, 100, 0)`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(injection.x, injection.y, injection.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Injection point
        this.ctx.fillStyle = `rgba(200, 180, 150, ${injection.life})`;
        this.ctx.beginPath();
        this.ctx.arc(injection.x, injection.y, 3, 0, Math.PI * 2);
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

export default InjectionPatternBackground;


