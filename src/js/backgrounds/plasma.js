class PlasmaBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.imageData = null;
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
    this.imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX / this.canvas.width;
    this.mouse.y = e.clientY / this.canvas.height;
  }

  animate() {
    if (!this.canvas) return;
    
    this.time += 0.02;
    const data = this.imageData.data;
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        const mx = x / width;
        const my = y / height;
        
        const v1 = Math.sin((x * 0.01) + this.time);
        const v2 = Math.sin((y * 0.01) + this.time);
        const v3 = Math.sin(((x + y) * 0.01) + this.time);
        const v4 = Math.sin((Math.sqrt(x * x + y * y) * 0.1) + this.time);
        
        // Mouse influence
        const dx = mx - this.mouse.x;
        const dy = my - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseEffect = Math.sin(dist * 20 - this.time * 2) * 0.5 + 0.5;
        
        const value = (v1 + v2 + v3 + v4 + mouseEffect) / 5;
        const hue = (value * 360 + this.time * 50) % 360;
        
        // Convert HSL to RGB
        const c = 0.5;
        const x_hue = hue / 60;
        const i = Math.floor(x_hue);
        const f = x_hue - i;
        const p = 0;
        const q = c * (1 - f);
        const t = c * f;
        
        let r, g, b;
        if (i === 0) { r = c; g = t; b = p; }
        else if (i === 1) { r = q; g = c; b = p; }
        else if (i === 2) { r = p; g = c; b = t; }
        else if (i === 3) { r = p; g = q; b = c; }
        else if (i === 4) { r = t; g = p; b = c; }
        else { r = c; g = p; b = q; }
        
        data[index] = r * 255;
        data[index + 1] = g * 255;
        data[index + 2] = b * 255;
        data[index + 3] = 255;
      }
    }
    
    this.ctx.putImageData(this.imageData, 0, 0);
    
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

export default PlasmaBackground;


