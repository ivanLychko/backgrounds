class TunnelBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
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
    
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX / this.canvas.width;
    this.mouse.y = e.clientY / this.canvas.height;
  }

  animate() {
    if (!this.canvas) return;
    
    this.time += 0.02;
    
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const maxRadius = Math.max(this.canvas.width, this.canvas.height) * 0.8;
    
    // Mouse offset
    const offsetX = (this.mouse.x - 0.5) * 50;
    const offsetY = (this.mouse.y - 0.5) * 50;
    
    // Draw tunnel rings
    for (let i = 0; i < 50; i++) {
      const progress = i / 50;
      const radius = progress * maxRadius;
      const z = 1 - progress;
      const scale = 1 / z;
      
      const x = centerX + offsetX * (1 - progress);
      const y = centerY + offsetY * (1 - progress);
      
      const hue = (this.time * 50 + i * 10) % 360;
      const alpha = z * 0.8;
      
      this.ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${alpha})`;
      this.ctx.lineWidth = 2 * scale;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius * scale, 0, Math.PI * 2);
      this.ctx.stroke();
      
      // Add segments
      const segments = 8;
      for (let s = 0; s < segments; s++) {
        const angle = (Math.PI * 2 / segments) * s + this.time;
        const sx = x + Math.cos(angle) * radius * scale;
        const sy = y + Math.sin(angle) * radius * scale;
        
        this.ctx.fillStyle = `hsla(${hue + s * 30}, 70%, 60%, ${alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(sx, sy, 3 * scale, 0, Math.PI * 2);
        this.ctx.fill();
      }
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
    }
  }
}

export default TunnelBackground;


