class MorphingBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.shapes = [];
    this.mouse = { x: 0.5, y: 0.5 };
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
    
    this.createShapes();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createShapes();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX / this.canvas.width;
    this.mouse.y = e.clientY / this.canvas.height;
  }

  createShapes() {
    this.shapes = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      this.shapes.push({
        points: [],
        color: `hsl(${i * 45}, 70%, 60%)`,
        centerX: Math.random() * this.canvas.width,
        centerY: Math.random() * this.canvas.height,
        radius: Math.random() * 100 + 50,
        pointCount: 6 + Math.floor(Math.random() * 4),
      });
    }
  }

  updateShape(shape) {
    shape.points = [];
    const angleStep = (Math.PI * 2) / shape.pointCount;
    
    for (let i = 0; i < shape.pointCount; i++) {
      const angle = angleStep * i + this.time * 0.5;
      const radius = shape.radius + Math.sin(this.time * 2 + i) * 20;
      const x = shape.centerX + Math.cos(angle) * radius;
      const y = shape.centerY + Math.sin(angle) * radius;
      
      // Mouse influence
      const dx = (this.mouse.x * this.canvas.width) - x;
      const dy = (this.mouse.y * this.canvas.height) - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 200) {
        const force = (200 - distance) / 200;
        shape.points.push({
          x: x + (dx / distance) * force * 30,
          y: y + (dy / distance) * force * 30,
        });
      } else {
        shape.points.push({ x, y });
      }
    }
  }

  animate() {
    if (!this.canvas) return;
    
    this.time += 0.01;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#0a0a14';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.shapes.forEach(shape => {
      this.updateShape(shape);
      
      this.ctx.beginPath();
      shape.points.forEach((point, i) => {
        if (i === 0) {
          this.ctx.moveTo(point.x, point.y);
        } else {
          this.ctx.lineTo(point.x, point.y);
        }
      });
      this.ctx.closePath();
      
      const gradient = this.ctx.createRadialGradient(
        shape.centerX, shape.centerY, 0,
        shape.centerX, shape.centerY, shape.radius * 2
      );
      gradient.addColorStop(0, shape.color.replace(')', ', 0.8)').replace('hsl', 'hsla'));
      gradient.addColorStop(1, shape.color.replace(')', ', 0)').replace('hsl', 'hsla'));
      
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      this.ctx.strokeStyle = shape.color.replace(')', ', 0.5)').replace('hsl', 'hsla');
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
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

export default MorphingBackground;


