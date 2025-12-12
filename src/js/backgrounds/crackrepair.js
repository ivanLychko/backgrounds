class CrackRepairBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.cracks = [];
    this.repairs = [];
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
  }

  handleClick(e) {
    // Add repair at click point
    this.repairs.push({
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      maxRadius: 80,
      life: 1,
    });
  }

  createCracks() {
    this.cracks = [];
    const count = 6;
    for (let i = 0; i < count; i++) {
      const startX = Math.random() * this.canvas.width;
      const startY = Math.random() * this.canvas.height;
      const points = [];
      let x = startX;
      let y = startY;
      
      for (let j = 0; j < 15; j++) {
        points.push({ x, y });
        x += (Math.random() - 0.5) * 25;
        y += Math.random() * 15 + 5;
        if (y > this.canvas.height) break;
      }
      
      this.cracks.push({
        points,
        width: Math.random() * 2 + 1,
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
      this.ctx.strokeStyle = 'rgba(80, 80, 80, 0.6)';
      this.ctx.lineWidth = crack.width;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      
      crack.points.forEach((point, i) => {
        const dx = this.mouse.x - point.x;
        const dy = this.mouse.y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let x = point.x;
        let y = point.y;
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          x += (dx / distance) * force * 3;
          y += (dy / distance) * force * 3;
        }
        
        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      });
      this.ctx.stroke();
    });
    
    // Draw repairs (polyurethane filling cracks)
    this.repairs.forEach((repair, index) => {
      repair.radius += 1;
      repair.life -= 0.01;
      
      if (repair.life <= 0 || repair.radius > repair.maxRadius) {
        this.repairs.splice(index, 1);
      } else {
        const gradient = this.ctx.createRadialGradient(
          repair.x, repair.y, 0,
          repair.x, repair.y, repair.radius
        );
        gradient.addColorStop(0, `rgba(200, 180, 150, ${repair.life * 0.7})`);
        gradient.addColorStop(1, `rgba(180, 160, 130, 0)`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(repair.x, repair.y, repair.radius, 0, Math.PI * 2);
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

export default CrackRepairBackground;


