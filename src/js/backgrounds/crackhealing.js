class CrackHealingBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.cracks = [];
    this.healing = [];
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
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    
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
    
    // Continuous healing while moving
    if (this.isHealing) {
      this.addHealingPoint(e.clientX, e.clientY);
    }
  }

  handleClick(e) {
    this.addHealingPoint(e.clientX, e.clientY);
  }

  handleMouseDown(e) {
    this.isHealing = true;
    this.addHealingPoint(e.clientX, e.clientY);
  }

  handleMouseUp(e) {
    this.isHealing = false;
  }

  addHealingPoint(x, y) {
    this.healing.push({
      x,
      y,
      radius: 0,
      maxRadius: 60,
      life: 1,
      speed: 2,
    });
  }

  createCracks() {
    this.cracks = [];
    const count = 10;
    for (let i = 0; i < count; i++) {
      const startX = Math.random() * this.canvas.width;
      const startY = Math.random() * this.canvas.height;
      const points = [];
      let x = startX;
      let y = startY;
      
      for (let j = 0; j < 20; j++) {
        points.push({ x, y, healed: false });
        x += (Math.random() - 0.5) * 30;
        y += Math.random() * 20 + 5;
        if (y > this.canvas.height) break;
      }
      
      this.cracks.push({
        points,
        width: Math.random() * 3 + 1,
        color: `rgba(${80 + Math.random() * 40}, ${80 + Math.random() * 40}, ${80 + Math.random() * 40}, 0.8)`,
      });
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
      this.ctx.strokeStyle = crack.color;
      this.ctx.lineWidth = crack.width;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      
      let allHealed = true;
      
      crack.points.forEach((point, i) => {
        // Check if point is being healed
        let isHealed = false;
        this.healing.forEach(heal => {
          const dx = heal.x - point.x;
          const dy = heal.y - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < heal.radius) {
            isHealed = true;
            point.healed = true;
          }
        });
        
        if (!point.healed) allHealed = false;
        
        // Mouse interaction
        const dx = this.mouse.x - point.x;
        const dy = this.mouse.y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let x = point.x;
        let y = point.y;
        
        if (distance < 80 && !isHealed) {
          const force = (80 - distance) / 80;
          x += (dx / distance) * force * 5;
          y += (dy / distance) * force * 5;
        }
        
        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          if (!point.healed && !crack.points[i - 1].healed) {
            this.ctx.lineTo(x, y);
          } else {
            this.ctx.moveTo(x, y);
          }
        }
      });
      
      if (!allHealed) {
        this.ctx.stroke();
      }
    });
    
    // Update and draw healing
    this.healing.forEach((heal, index) => {
      heal.radius += heal.speed;
      heal.life -= 0.01;
      
      if (heal.life <= 0 || heal.radius > heal.maxRadius) {
        this.healing.splice(index, 1);
      } else {
        // Draw healing effect (polyurethane expanding)
        const gradient = this.ctx.createRadialGradient(
          heal.x, heal.y, 0,
          heal.x, heal.y, heal.radius
        );
        gradient.addColorStop(0, `rgba(200, 180, 150, ${heal.life * 0.9})`);
        gradient.addColorStop(0.5, `rgba(180, 160, 130, ${heal.life * 0.7})`);
        gradient.addColorStop(1, `rgba(150, 130, 100, 0)`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(heal.x, heal.y, heal.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Healing center
        this.ctx.fillStyle = `rgba(200, 180, 150, ${heal.life})`;
        this.ctx.beginPath();
        this.ctx.arc(heal.x, heal.y, 4, 0, Math.PI * 2);
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
      this.canvas.removeEventListener('mousedown', (e) => this.handleMouseDown(e));
      this.canvas.removeEventListener('mouseup', (e) => this.handleMouseUp(e));
    }
  }
}

export default CrackHealingBackground;


