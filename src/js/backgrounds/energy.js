class EnergyBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.beams = [];
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
    
    this.createBeams();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createBeams();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX / this.canvas.width;
    this.mouse.y = e.clientY / this.canvas.height;
  }

  createBeams() {
    this.beams = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      this.beams.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        angle: Math.random() * Math.PI * 2,
        length: Math.random() * 200 + 100,
        speed: Math.random() * 0.02 + 0.01,
        hue: i * 45,
      });
    }
  }

  animate() {
    if (!this.canvas) return;
    
    this.time += 0.01;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.beams.forEach(beam => {
      beam.angle += beam.speed;
      
      // Mouse influence
      const mouseX = this.mouse.x * this.canvas.width;
      const mouseY = this.mouse.y * this.canvas.height;
      const dx = mouseX - beam.x;
      const dy = mouseY - beam.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 200) {
        const targetAngle = Math.atan2(dy, dx);
        beam.angle += (targetAngle - beam.angle) * 0.1;
      }
      
      const endX = beam.x + Math.cos(beam.angle) * beam.length;
      const endY = beam.y + Math.sin(beam.angle) * beam.length;
      
      // Draw beam
      const gradient = this.ctx.createLinearGradient(beam.x, beam.y, endX, endY);
      gradient.addColorStop(0, `hsla(${beam.hue}, 100%, 60%, 1)`);
      gradient.addColorStop(0.5, `hsla(${beam.hue + 30}, 100%, 60%, 0.8)`);
      gradient.addColorStop(1, `hsla(${beam.hue}, 100%, 60%, 0)`);
      
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(beam.x, beam.y);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();
      
      // Glow
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = `hsl(${beam.hue}, 100%, 60%)`;
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;
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

export default EnergyBackground;


