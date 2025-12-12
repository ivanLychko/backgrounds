class Parallax2Background {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.layers = [];
    this.mouse = { x: 0.5, y: 0.5 };
    this.targetMouse = { x: 0.5, y: 0.5 };
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
    
    this.createLayers();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createLayers();
  }

  handleMouseMove(e) {
    this.targetMouse.x = e.clientX / this.canvas.width;
    this.targetMouse.y = e.clientY / this.canvas.height;
  }

  createLayers() {
    const gridSize = 40;
    const cols = Math.ceil(this.canvas.width / gridSize) + 2;
    const rows = Math.ceil(this.canvas.height / gridSize) + 2;
    
    this.layers = [
      {
        cells: [],
        depth: 0.1,
        color: 'rgba(100, 150, 255, 0.2)',
        gridSize,
        cols,
        rows,
      },
      {
        cells: [],
        depth: 0.3,
        color: 'rgba(150, 100, 255, 0.3)',
        gridSize,
        cols,
        rows,
      },
      {
        cells: [],
        depth: 0.6,
        color: 'rgba(255, 150, 100, 0.4)',
        gridSize,
        cols,
        rows,
      },
      {
        cells: [],
        depth: 0.9,
        color: 'rgba(255, 200, 100, 0.5)',
        gridSize,
        cols,
        rows,
      },
    ];
    
    this.layers.forEach(layer => {
      layer.cells = [];
      for (let row = 0; row < layer.rows; row++) {
        for (let col = 0; col < layer.cols; col++) {
          layer.cells.push({
            x: col * layer.gridSize,
            y: row * layer.gridSize,
            originalX: col * layer.gridSize,
            originalY: row * layer.gridSize,
          });
        }
      }
    });
  }

  drawLayer(layer) {
    this.ctx.strokeStyle = layer.color;
    this.ctx.lineWidth = 1;
    
    layer.cells.forEach(cell => {
      const offsetX = (this.mouse.x - 0.5) * layer.depth * 150;
      const offsetY = (this.mouse.y - 0.5) * layer.depth * 150;
      
      const x = cell.originalX + offsetX;
      const y = cell.originalY + offsetY;
      
      // Draw grid cell
      this.ctx.beginPath();
      this.ctx.rect(x, y, layer.gridSize, layer.gridSize);
      this.ctx.stroke();
      
      // Draw connection to mouse
      const centerX = x + layer.gridSize / 2;
      const centerY = y + layer.gridSize / 2;
      const mouseX = this.mouse.x * this.canvas.width;
      const mouseY = this.mouse.y * this.canvas.height;
      
      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 250 * (1 + layer.depth)) {
        const opacity = (1 - distance / (250 * (1 + layer.depth))) * 0.4;
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(mouseX, mouseY);
        this.ctx.stroke();
        this.ctx.strokeStyle = layer.color;
      }
      
      // Draw dot
      this.ctx.fillStyle = layer.color;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  animate() {
    if (!this.canvas) return;
    
    // Smooth mouse movement
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.1;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.1;
    
    this.ctx.fillStyle = '#0a0a1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw layers from back to front
    this.layers.forEach(layer => {
      this.drawLayer(layer);
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

export default Parallax2Background;


