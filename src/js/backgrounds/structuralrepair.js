class StructuralRepairBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.elements = [];
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
    
    this.createElements();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createElements();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  createElements() {
    this.elements = [];
    const count = 20;
    for (let i = 0; i < count; i++) {
      this.elements.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 40 + 20,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        type: Math.random() > 0.5 ? 'beam' : 'joint',
      });
    }
  }

  animate() {
    if (!this.canvas) return;
    
    this.time += 0.01;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#282828';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.elements.forEach(element => {
      element.rotation += element.rotationSpeed;
      
      const dx = this.mouse.x - element.x;
      const dy = this.mouse.y - element.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      let scale = 1;
      if (distance < 150) {
        scale = 1 + (1 - distance / 150) * 0.3;
      }
      
      this.ctx.save();
      this.ctx.translate(element.x, element.y);
      this.ctx.rotate(element.rotation);
      this.ctx.scale(scale, scale);
      
      if (element.type === 'beam') {
        // Draw structural beam
        this.ctx.fillStyle = 'rgba(120, 120, 120, 0.6)';
        this.ctx.fillRect(-element.size / 2, -element.size / 8, element.size, element.size / 4);
        this.ctx.strokeStyle = 'rgba(150, 150, 150, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-element.size / 2, -element.size / 8, element.size, element.size / 4);
      } else {
        // Draw joint
        this.ctx.fillStyle = 'rgba(150, 150, 200, 0.6)';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, element.size / 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(180, 180, 220, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }
      
      this.ctx.restore();
    });
    
    // Draw connections
    this.elements.forEach((element, i) => {
      this.elements.slice(i + 1).forEach(other => {
        const dx = other.x - element.x;
        const dy = other.y - element.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200) {
          this.ctx.strokeStyle = `rgba(100, 100, 100, ${0.3 * (1 - dist / 200)})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(element.x, element.y);
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

export default StructuralRepairBackground;


