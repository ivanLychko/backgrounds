class RadarBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.blips = [];
    this.angle = 0;
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
    
    this.createBlips();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createBlips();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  createBlips() {
    this.blips = [];
    const count = 20;
    for (let i = 0; i < count; i++) {
      this.blips.push({
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * Math.min(this.canvas.width, this.canvas.height) * 0.4,
        size: Math.random() * 3 + 2,
      });
    }
  }

  animate() {
    if (!this.canvas) return;
    
    this.angle += 0.02;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#001400';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const maxRadius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
    
    // Draw circles
    for (let i = 1; i <= 5; i++) {
      this.ctx.strokeStyle = `rgba(0, 255, 0, ${0.3 / i})`;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, (maxRadius / 5) * i, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    
    // Draw sweep line
    this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY);
    this.ctx.lineTo(
      centerX + Math.cos(this.angle) * maxRadius,
      centerY + Math.sin(this.angle) * maxRadius
    );
    this.ctx.stroke();
    
    // Draw fade trail
    const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
    gradient.addColorStop(0, 'rgba(0, 255, 0, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Draw blips
    this.blips.forEach(blip => {
      const x = centerX + Math.cos(blip.angle) * blip.distance;
      const y = centerY + Math.sin(blip.angle) * blip.distance;
      
      // Check if sweep line detects blip
      const sweepAngle = this.angle % (Math.PI * 2);
      const blipAngle = blip.angle % (Math.PI * 2);
      const angleDiff = Math.abs(sweepAngle - blipAngle);
      const detected = angleDiff < 0.1 || angleDiff > Math.PI * 2 - 0.1;
      
      if (detected) {
        this.ctx.fillStyle = 'rgba(0, 255, 0, 1)';
        this.ctx.beginPath();
        this.ctx.arc(x, y, blip.size * 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        this.ctx.beginPath();
        this.ctx.arc(x, y, blip.size, 0, Math.PI * 2);
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
    }
  }
}

export default RadarBackground;


