class GeometricBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.shapes = [];
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
    
    this.createInitialShapes();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createInitialShapes();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  handleClick(e) {
    const x = e.clientX;
    const y = e.clientY;
    
    // Create new shape at click position
    const shapeType = Math.random() > 0.5 ? 'circle' : 'triangle';
    const size = Math.random() * 80 + 40;
    const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    
    this.shapes.push({
      type: shapeType,
      x,
      y,
      size,
      color,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      scale: 1,
      scaleSpeed: Math.random() * 0.02 + 0.01,
      life: 1,
      lifeSpeed: 0.005,
    });
    
    // Limit shapes count
    if (this.shapes.length > 50) {
      this.shapes.shift();
    }
  }

  createInitialShapes() {
    this.shapes = [];
    const count = 15;
    
    for (let i = 0; i < count; i++) {
      this.shapes.push({
        type: Math.random() > 0.5 ? 'circle' : 'triangle',
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 60 + 30,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        scale: Math.random() * 0.5 + 0.5,
        scaleSpeed: Math.random() * 0.01 + 0.005,
        life: Math.random(),
        lifeSpeed: 0.002,
      });
    }
  }

  drawShape(shape) {
    this.ctx.save();
    this.ctx.translate(shape.x, shape.y);
    this.ctx.rotate(shape.rotation);
    this.ctx.scale(shape.scale, shape.scale);
    
    this.ctx.globalAlpha = shape.life;
    this.ctx.fillStyle = shape.color;
    this.ctx.strokeStyle = shape.color;
    this.ctx.lineWidth = 2;
    
    if (shape.type === 'circle') {
      this.ctx.beginPath();
      this.ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    } else {
      // Triangle
      this.ctx.beginPath();
      this.ctx.moveTo(0, -shape.size / 2);
      this.ctx.lineTo(-shape.size / 2, shape.size / 2);
      this.ctx.lineTo(shape.size / 2, shape.size / 2);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }

  animate() {
    if (!this.canvas) return;
    
    // Fade effect
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#0a0a14';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw shapes
    this.shapes.forEach((shape, index) => {
      shape.rotation += shape.rotationSpeed;
      shape.scale += shape.scaleSpeed;
      shape.life -= shape.lifeSpeed;
      
      // Mouse interaction
      const dx = this.mouse.x - shape.x;
      const dy = this.mouse.y - shape.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 200) {
        const force = (200 - distance) / 200;
        shape.x += (dx / distance) * force * 2;
        shape.y += (dy / distance) * force * 2;
      }
      
      // Remove dead shapes
      if (shape.life <= 0) {
        this.shapes.splice(index, 1);
      } else {
        this.drawShape(shape);
      }
    });
    
    // Add new random shapes occasionally
    if (Math.random() < 0.02 && this.shapes.length < 20) {
      this.shapes.push({
        type: Math.random() > 0.5 ? 'circle' : 'triangle',
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 60 + 30,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        scale: 0.3,
        scaleSpeed: Math.random() * 0.01 + 0.005,
        life: 1,
        lifeSpeed: 0.002,
      });
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

export default GeometricBackground;


