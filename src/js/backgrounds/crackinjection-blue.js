class CrackInjectionBlueBackground {
  constructor(container, settings = {}) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.cracks = [];
    this.injections = [];
    this.mouse = { x: 0, y: 0 };
    this.time = 0;
    this.lastCrackTime = 0;
    this.settings = {
      crackInterval: settings.crackInterval || 2000,
      crackCount: settings.crackCount || 30,
      injectionRadius: settings.injectionRadius || 80,
      injectionSpeed: settings.injectionSpeed || 1.5,
      scrollSensitivity: settings.scrollSensitivity || 0.7,
    };
    this.scrollY = 0;
    this.lastScrollY = 0;
    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.innerHTML = '';
    this.container.appendChild(this.canvas);

    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('scroll', () => this.handleScroll());
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));

    this.createCracks();
    this.animate();
  }

  handleScroll() {
    const currentScrollY = window.scrollY || window.pageYOffset;
    const scrollDelta = Math.abs(currentScrollY - this.lastScrollY);

    if (scrollDelta > 10) {
      if (Math.random() > (1 - this.settings.scrollSensitivity)) {
        this.createRandomCrack();
      }
    }

    this.lastScrollY = currentScrollY;
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createCracks();
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;

    if (this.isInjecting) {
      this.addInjection(e.clientX, e.clientY);
    }
  }

  handleClick(e) {
    this.addInjection(e.clientX, e.clientY);
  }

  handleMouseDown(e) {
    this.isInjecting = true;
    this.addInjection(e.clientX, e.clientY);
  }

  handleMouseUp(e) {
    this.isInjecting = false;
  }

  addInjection(x, y) {
    this.injections.push({
      x,
      y,
      radius: 0,
      maxRadius: this.settings.injectionRadius,
      life: 1,
      speed: this.settings.injectionSpeed,
      particles: [],
    });

    for (let i = 0; i < 5; i++) {
      this.injections[this.injections.length - 1].particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: 0,
        maxDistance: Math.random() * 40 + 20,
        speed: Math.random() * 1 + 0.5,
        size: Math.random() * 3 + 1,
      });
    }
  }

  createCracks() {
    this.cracks = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      this.createRandomCrack();
    }
  }

  createRandomCrack() {
    const startX = Math.random() * this.canvas.width;
    const startY = Math.random() * this.canvas.height;
    const points = [];
    let x = startX;
    let y = startY;

    const segments = Math.floor(Math.random() * 20) + 15;
    const mainAngle = Math.random() * Math.PI * 0.5 + Math.PI * 0.25;

    for (let j = 0; j < segments; j++) {
      points.push({ x, y, filled: false });
      const angleVariation = (Math.random() - 0.5) * 0.6;
      const angle = mainAngle + angleVariation;
      const length = Math.random() * 20 + 12;
      x += Math.cos(angle) * length;
      y += Math.sin(angle) * length;

      if (y > this.canvas.height || y < 0 || x < 0 || x > this.canvas.width) {
        break;
      }
    }

    this.cracks.push({
      points,
      width: Math.random() * 3 + 1,
      age: 0,
    });

    if (this.cracks.length > this.settings.crackCount) {
      this.cracks.shift();
    }
  }

  animate() {
    if (!this.canvas) return;

    this.time += 0.01;
    const currentTime = Date.now();

    const baseInterval = this.settings.crackInterval;
    const randomInterval = baseInterval + (Math.random() - 0.5) * baseInterval * 0.5;
    if (currentTime - this.lastCrackTime > randomInterval) {
      if (Math.random() > 0.3) {
        this.createRandomCrack();
      }
      this.lastCrackTime = currentTime;
    }

    // Синий фон
    this.ctx.fillStyle = '#1a2a3a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw injections
    this.injections.forEach((injection, injIndex) => {
      injection.radius += injection.speed;
      injection.life -= 0.008;
      injection.maxRadius = this.settings.injectionRadius;

      injection.particles.forEach(particle => {
        particle.distance += particle.speed;
      });

      this.cracks.forEach(crack => {
        crack.points.forEach(point => {
          const dx = injection.x - point.x;
          const dy = injection.y - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < injection.radius) {
            point.filled = true;
          }
        });
      });

      if (injection.life <= 0 || injection.radius > injection.maxRadius) {
        this.injections.splice(injIndex, 1);
      } else {
        // Синий/голубой градиент инжекции
        const gradient = this.ctx.createRadialGradient(
          injection.x, injection.y, 0,
          injection.x, injection.y, injection.radius
        );
        gradient.addColorStop(0, `rgba(100, 180, 255, ${injection.life * 0.8})`);
        gradient.addColorStop(0.6, `rgba(80, 160, 240, ${injection.life * 0.6})`);
        gradient.addColorStop(1, `rgba(60, 140, 220, 0)`);

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(injection.x, injection.y, injection.radius, 0, Math.PI * 2);
        this.ctx.fill();

        injection.particles.forEach(particle => {
          if (particle.distance < particle.maxDistance) {
            const px = injection.x + Math.cos(particle.angle) * particle.distance;
            const py = injection.y + Math.sin(particle.angle) * particle.distance;

            this.ctx.fillStyle = `rgba(100, 180, 255, ${injection.life * 0.7})`;
            this.ctx.beginPath();
            this.ctx.arc(px, py, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
          }
        });
      }
    });

    // Draw cracks
    this.cracks.forEach(crack => {
      crack.age += 0.02;
      const appearProgress = Math.min(1, crack.age);

      // Синие трещины
      this.ctx.strokeStyle = `rgba(80, 120, 180, ${0.6 * appearProgress})`;
      this.ctx.lineWidth = crack.width;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();

      crack.points.forEach((point, i) => {
        const dx = this.mouse.x - point.x;
        const dy = this.mouse.y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let x = point.x;
        let y = point.y;

        if (distance < 100) {
          const force = (100 - distance) / 100;
          x += (dx / distance) * force * 4;
          y += (dy / distance) * force * 4;
        }

        const pointProgress = Math.min(1, (i / crack.points.length) * appearProgress * 1.2);
        if (pointProgress > 0.1) {
          if (i === 0) {
            this.ctx.moveTo(x, y);
          } else {
            if (!point.filled && !crack.points[i - 1].filled) {
              this.ctx.lineTo(x, y);
            } else {
              this.ctx.moveTo(x, y);
            }
          }
        }
      });

      this.ctx.stroke();

      // Заполненные части - яркий голубой
      this.ctx.strokeStyle = 'rgba(120, 200, 255, 0.5)';
      this.ctx.lineWidth = crack.width * 1.5;
      this.ctx.beginPath();

      let inFilled = false;
      crack.points.forEach((point, i) => {
        if (point.filled) {
          if (!inFilled) {
            this.ctx.moveTo(point.x, point.y);
            inFilled = true;
          } else {
            this.ctx.lineTo(point.x, point.y);
          }
        } else {
          if (inFilled && i > 0 && crack.points[i - 1].filled) {
            this.ctx.stroke();
            this.ctx.beginPath();
          }
          inFilled = false;
        }
      });
      if (inFilled) {
        this.ctx.stroke();
      }
    });

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    window.removeEventListener('resize', () => this.resize());
    window.removeEventListener('scroll', () => this.handleScroll());
    if (this.canvas) {
      this.canvas.removeEventListener('mousemove', (e) => this.handleMouseMove(e));
      this.canvas.removeEventListener('click', (e) => this.handleClick(e));
      this.canvas.removeEventListener('mousedown', (e) => this.handleMouseDown(e));
      this.canvas.removeEventListener('mouseup', (e) => this.handleMouseUp(e));
    }
  }

  updateSetting(key, value) {
    this.settings[key] = value;

    if (key === 'crackCount') {
      while (this.cracks.length > this.settings.crackCount) {
        this.cracks.shift();
      }
    } else if (key === 'injectionRadius' || key === 'injectionSpeed') {
      this.injections.forEach(injection => {
        injection.maxRadius = this.settings.injectionRadius;
        injection.speed = this.settings.injectionSpeed;
      });
    }
  }
}

export default CrackInjectionBlueBackground;


