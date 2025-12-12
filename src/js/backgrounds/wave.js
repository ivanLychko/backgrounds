class WaveBackground {
  constructor(container, settings = {}) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.waves = [];
    this.mouse = { x: 0, y: 0 };
    this.time = 0;
    this.settings = {
      waveAmplitude: settings.waveAmplitude || 50,
      waveFrequency: settings.waveFrequency || 0.01,
      waveSpeed: settings.waveSpeed || 0.02,
      mouseInfluence: settings.mouseInfluence || 100,
    };
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
    
    this.createWaves();
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

  createWaves() {
    this.waves = [
      {
        amplitude: this.settings.waveAmplitude,
        frequency: this.settings.waveFrequency,
        speed: this.settings.waveSpeed,
        color: 'rgba(100, 150, 255, 0.6)',
        offset: 0,
      },
      {
        amplitude: this.settings.waveAmplitude * 0.8,
        frequency: this.settings.waveFrequency * 1.5,
        speed: this.settings.waveSpeed * 1.5,
        color: 'rgba(150, 100, 255, 0.5)',
        offset: Math.PI / 3,
      },
      {
        amplitude: this.settings.waveAmplitude * 1.2,
        frequency: this.settings.waveFrequency * 0.8,
        speed: this.settings.waveSpeed * 1.25,
        color: 'rgba(255, 100, 150, 0.4)',
        offset: Math.PI / 2,
      },
    ];
  }

  animate() {
    if (!this.canvas) return;
    
    this.time += 0.01;
    
    // Gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#0a0a1a');
    gradient.addColorStop(1, '#1a1a3a');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.waves.forEach((wave, index) => {
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.canvas.height / 2);
      
      const mouseInfluence = (this.mouse.x - 0.5) * this.settings.mouseInfluence;
      
      for (let x = 0; x < this.canvas.width; x += 2) {
        const mouseDistance = Math.abs(x / this.canvas.width - this.mouse.x);
        const mouseEffect = Math.max(0, 1 - mouseDistance * 3) * mouseInfluence;
        
        const y = this.canvas.height / 2 +
          Math.sin(x * wave.frequency + this.time * wave.speed + wave.offset) * wave.amplitude +
          mouseEffect * 0.5;
        
        this.ctx.lineTo(x, y);
      }
      
      this.ctx.lineTo(this.canvas.width, this.canvas.height);
      this.ctx.lineTo(0, this.canvas.height);
      this.ctx.closePath();
      
      this.ctx.fillStyle = wave.color;
      this.ctx.fill();
    });
    
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  updateSetting(key, value) {
    this.settings[key] = value;
    if (['waveAmplitude', 'waveFrequency', 'waveSpeed'].includes(key)) {
      this.createWaves();
    }
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

export default WaveBackground;

