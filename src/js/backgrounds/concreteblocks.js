class ConcreteBlocksBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.blocks = [];
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
    
    this.createBlocks();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createBlocks();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  createBlocks() {
    this.blocks = [];
    const blockSize = 80;
    const cols = Math.ceil(this.canvas.width / blockSize);
    const rows = Math.ceil(this.canvas.height / blockSize);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        this.blocks.push({
          x: col * blockSize,
          y: row * blockSize,
          size: blockSize,
          shade: Math.random() * 20 + 60,
        });
      }
    }
  }

  animate() {
    if (!this.canvas) return;
    
    this.ctx.fillStyle = '#2a2a2a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.blocks.forEach(block => {
      const centerX = block.x + block.size / 2;
      const centerY = block.y + block.size / 2;
      
      const dx = this.mouse.x - centerX;
      const dy = this.mouse.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      let shade = block.shade;
      let offsetX = 0;
      let offsetY = 0;
      
      if (distance < 150) {
        const force = (150 - distance) / 150;
        shade += force * 30;
        offsetX = (dx / distance) * force * 5;
        offsetY = (dy / distance) * force * 5;
      }
      
      // Draw concrete block
      this.ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
      this.ctx.fillRect(block.x + offsetX, block.y + offsetY, block.size, block.size);
      
      // Block border
      this.ctx.strokeStyle = `rgba(${shade - 20}, ${shade - 20}, ${shade - 20}, 0.5)`;
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(block.x + offsetX, block.y + offsetY, block.size, block.size);
      
      // Highlight
      this.ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
      this.ctx.fillRect(block.x + offsetX, block.y + offsetY, block.size, block.size * 0.2);
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

export default ConcreteBlocksBackground;


