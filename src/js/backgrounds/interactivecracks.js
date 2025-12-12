class InteractiveCracksBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.cracks = [];
    this.particles = [];
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
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    
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
    
    // Add particles at mouse position
    if (Math.random() > 0.8) {
      this.particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 2,
        life: 1,
        color: 'rgba(200, 180, 150, 0.8)',
      });
    }
  }

  handleClick(e) {
    // Create new crack from click point
    const points = [];
    let x = e.clientX;
    let y = e.clientY;
    
    for (let i = 0; i < 15; i++) {
      points.push({ x, y });
      x += (Math.random() - 0.5) * 40;
      y += Math.random() * 25 + 5;
      if (y > this.canvas.height || x < 0 || x > this.canvas.width) break;
    }
    
    this.cracks.push({
      points,
      width: Math.random() * 3 + 1,
      color: `rgba(${100 + Math.random() * 50}, ${100 + Math.random() * 50}, ${100 + Math.random() * 50}, 0.7)`,
    });
  }

  createCracks() {
    this.cracks = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const startX = Math.random() * this.canvas.width;
      const startY = Math.random() * this.canvas.height;
      const points = [];
      let x = startX;
      let y = startY;
      
      for (let j = 0; j < 18; j++) {
        points.push({ x, y });
        x += (Math.random() - 0.5) * 35;
        y += Math.random() * 22 + 5;
        if (y > this.canvas.height) break;
      }
      
      this.cracks.push({
        points,
        width: Math.random() * 3 + 1,
        color: `rgba(${90 + Math.random() * 40}, ${90 + Math.random() * 40}, ${90 + Math.random() * 40}, 0.7)`,
      });
    }
  }

  animate() {
    if (!this.canvas) return;
    
    this.time += 0.01;
    
    // Concrete background with texture
    this.ctx.fillStyle = '#4a4a4a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw cracks with mouse interaction
    this.cracks.forEach(crack => {
      this.ctx.strokeStyle = crack.color;
      this.ctx.lineWidth = crack.width;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.beginPath();
      
      crack.points.forEach((point, i) => {
        const dx = this.mouse.x - point.x;
        const dy = this.mouse.y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let x = point.x;
        let y = point.y;
        
        if (distance < 120) {
          const force = (120 - distance) / 120;
          x += (dx / distance) * force * 8;
          y += (dy / distance) * force * 8;
          
          // Make crack wider near mouse
          if (i === 0) {
            this.ctx.moveTo(x, y);
          } else {
            this.ctx.lineTo(x, y);
          }
        } else {
          if (i === 0) {
            this.ctx.moveTo(x, y);
          } else {
            this.ctx.lineTo(x, y);
          }
        }
      });
      
      this.ctx.stroke();
    });
    
    // Update and draw particles
    this.particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.02;
      particle.vx *= 0.98;
      particle.vy *= 0.98;
      
      if (particle.life <= 0) {
        this.particles.splice(index, 1);
      } else {
        this.ctx.fillStyle = particle.color.replace(')', `, ${particle.life})`).replace('rgba', 'rgba');
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
    
    // Limit particles
    if (this.particles.length > 100) {
      this.particles.shift();
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
      this.canvas.removeEventListener('click', (e) => this.handleClick(e));
    }
  }
}

export default InteractiveCracksBackground;


