class GlitchBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.imageData = null;
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
    
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
  }

  animate() {
    if (!this.canvas) return;
    
    this.time += 0.05;
    const data = this.imageData.data;
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        // Glitch effect
        const glitchX = x + Math.sin(y * 0.1 + this.time) * 5;
        const glitchY = y + Math.cos(x * 0.1 + this.time) * 5;
        
        const v1 = Math.sin((glitchX * 0.01) + this.time);
        const v2 = Math.sin((glitchY * 0.01) + this.time);
        const v3 = Math.sin(((glitchX + glitchY) * 0.01) + this.time);
        
        const value = (v1 + v2 + v3) / 3;
        const hue = (value * 180 + this.time * 50) % 360;
        
        // RGB from hue
        const c = 0.5;
        const x_hue = hue / 60;
        const i = Math.floor(x_hue);
        const f = x_hue - i;
        let r, g, b;
        
        if (i === 0) { r = c; g = f * c; b = 0; }
        else if (i === 1) { r = (1 - f) * c; g = c; b = 0; }
        else if (i === 2) { r = 0; g = c; b = f * c; }
        else if (i === 3) { r = 0; g = (1 - f) * c; b = c; }
        else if (i === 4) { r = f * c; g = 0; b = c; }
        else { r = c; g = 0; b = (1 - f) * c; }
        
        data[index] = r * 255;
        data[index + 1] = g * 255;
        data[index + 2] = b * 255;
        data[index + 3] = 255;
      }
    }
    
    this.ctx.putImageData(this.imageData, 0, 0);
    
    // Add scanlines
    this.ctx.fillStyle = 'rgba(0, 255, 0, 0.05)';
    for (let y = 0; y < height; y += 4) {
      this.ctx.fillRect(0, y, width, 1);
    }
    
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    window.removeEventListener('resize', () => this.resize());
  }
}

export default GlitchBackground;


