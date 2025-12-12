class StructuralMeshBackground {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.nodes = [];
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
    
    this.createNodes();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createNodes();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  createNodes() {
    this.nodes = [];
    const spacing = 60;
    const cols = Math.ceil(this.canvas.width / spacing);
    const rows = Math.ceil(this.canvas.height / spacing);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        this.nodes.push({
          x: col * spacing,
          y: row * spacing,
          originalX: col * spacing,
          originalY: row * spacing,
        });
      }
    }
  }

  animate() {
    if (!this.canvas) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#282828';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update nodes
    this.nodes.forEach(node => {
      const dx = this.mouse.x - node.originalX;
      const dy = this.mouse.y - node.originalY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 200;
      
      if (distance < maxDist) {
        const force = (maxDist - distance) / maxDist;
        node.x = node.originalX + (dx / distance) * force * 30;
        node.y = node.originalY + (dy / distance) * force * 30;
      } else {
        node.x += (node.originalX - node.x) * 0.1;
        node.y += (node.originalY - node.y) * 0.1;
      }
    });
    
    // Draw connections (structural mesh)
    this.nodes.forEach((node, i) => {
      const row = Math.floor(i / Math.ceil(this.canvas.width / 60));
      const col = i % Math.ceil(this.canvas.width / 60);
      
      // Connect to right
      if (col < Math.ceil(this.canvas.width / 60) - 1) {
        const right = this.nodes[i + 1];
        this.ctx.strokeStyle = 'rgba(120, 120, 120, 0.4)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(node.x, node.y);
        this.ctx.lineTo(right.x, right.y);
        this.ctx.stroke();
      }
      
      // Connect to bottom
      if (row < Math.ceil(this.canvas.height / 60) - 1) {
        const bottom = this.nodes[i + Math.ceil(this.canvas.width / 60)];
        this.ctx.strokeStyle = 'rgba(120, 120, 120, 0.4)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(node.x, node.y);
        this.ctx.lineTo(bottom.x, bottom.y);
        this.ctx.stroke();
      }
    });
    
    // Draw nodes
    this.nodes.forEach(node => {
      this.ctx.fillStyle = 'rgba(150, 150, 150, 0.8)';
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
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

export default StructuralMeshBackground;


