class ConcreteBackground {
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
    
    this.time += 0.005;
    const data = this.imageData.data;
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        // Concrete texture noise
        const noise1 = Math.sin(x * 0.02 + this.time) * Math.cos(y * 0.02 + this.time);
        const noise2 = Math.sin(x * 0.05) * Math.cos(y * 0.05);
        const noise3 = Math.sin(x * 0.1 + this.time * 0.5) * Math.cos(y * 0.1);
        
        const value = (noise1 + noise2 * 0.5 + noise3 * 0.3) / 3;
        const gray = 80 + value * 30; // Gray concrete color
        
        data[index] = gray;
        data[index + 1] = gray;
        data[index + 2] = gray;
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

export default ConcreteBackground;


