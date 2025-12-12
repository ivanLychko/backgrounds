class ConcreteTexture2Background {
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
    
    this.time += 0.003;
    const data = this.imageData.data;
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        // More detailed concrete texture
        const noise1 = Math.sin(x * 0.03 + this.time) * Math.cos(y * 0.03 + this.time);
        const noise2 = Math.sin(x * 0.08) * Math.cos(y * 0.08);
        const noise3 = Math.sin(x * 0.15 + this.time * 0.5) * Math.cos(y * 0.15);
        const noise4 = Math.sin(x * 0.25) * Math.cos(y * 0.25 + this.time);
        
        const value = (noise1 + noise2 * 0.6 + noise3 * 0.4 + noise4 * 0.2) / 4;
        const gray = 70 + value * 25; // Darker concrete
        
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

export default ConcreteTexture2Background;


