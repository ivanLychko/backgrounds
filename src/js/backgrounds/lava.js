class LavaBackground {
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
    
    this.time += 0.02;
    const data = this.imageData.data;
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        const v1 = Math.sin((x * 0.01) + this.time);
        const v2 = Math.sin((y * 0.01) + this.time * 0.7);
        const v3 = Math.sin(((x + y) * 0.01) + this.time * 0.5);
        const v4 = Math.sin((Math.sqrt(x * x + y * y) * 0.02) + this.time);
        
        const value = (v1 + v2 + v3 + v4) / 4;
        
        // Lava colors (red to yellow)
        let r, g, b;
        if (value < 0) {
          r = Math.floor((value + 1) * 100);
          g = Math.floor((value + 1) * 50);
          b = 0;
        } else {
          r = 255;
          g = Math.floor(100 + value * 155);
          b = Math.floor(value * 50);
        }
        
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
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
  }
}

export default LavaBackground;


