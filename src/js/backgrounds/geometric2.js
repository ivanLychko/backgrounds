class Geometric2Background {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.shapes = [];
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
    
    this.createShapes();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createShapes();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  handleClick(e) {
    this.shapes.push({
      x: e.clientX,
      y: e.clientY,
      size: 0,
      maxSize: Math.random() * 100 + 50,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      sides: 3 + Math.floor(Math.random() * 5),
      life: 1,
    });
  }

  createShapes() {
    this.shapes = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      this.shapes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 60 + 30,
        maxSize: Math.random() * 100 + 50,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        sides: 3 + Math.floor(Math.random() * 5),
        life: 1,
      });
    }
  }

  drawShape(shape) {
    this.ctx.save();
    this.ctx.translate(shape.x, shape.y);
    this.ctx.rotate(shape.rotation);
    
    // Mouse interaction
    const dx = this.mouse.x - shape.x;
    const dy = this.mouse.y - shape.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const scale = distance < 150 ? 1 + (1 - distance / 150) * 0.5 : 1;
    this.ctx.scale(scale, scale);
    
    this.ctx.beginPath();
    for (let i = 0; i < shape.sides; i++) {
      const angle = (Math.PI * 2 / shape.sides) * i;
      const x = Math.cos(angle) * shape.size;
      const y = Math.sin(angle) * shape.size;
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    
    this.ctx.globalAlpha = shape.life;
    this.ctx.fillStyle = shape.color;
    this.ctx.fill();
    this.ctx.strokeStyle = shape.color.replace(')', ', 0.8)').replace('hsl', 'hsla');
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.globalAlpha = 1;
    
    this.ctx.restore();
  }

  animate() {
    if (!this.canvas) return;
    
    this.time += 0.01;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#0a0a14';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.shapes.forEach((shape, index) => {
      shape.rotation += shape.rotationSpeed;
      
      if (shape.size < shape.maxSize) {
        shape.size += 2;
      } else {
        shape.life -= 0.01;
      }
      
      if (shape.life <= 0) {
        this.shapes.splice(index, 1);
      } else {
        this.drawShape(shape);
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

export default Geometric2Background;


