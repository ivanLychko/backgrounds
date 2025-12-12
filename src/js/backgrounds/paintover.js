class PaintOverBackground {
    constructor(container) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.damagedAreas = [];
        this.paintZones = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        this.isPainting = false;
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
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseUp(e));

        this.createDamagedAreas();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createDamagedAreas();
    }

    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        if (this.isPainting) {
            this.addPaintZone(e.clientX, e.clientY);
        }
    }

    handleMouseDown(e) {
        this.isPainting = true;
        this.addPaintZone(e.clientX, e.clientY);
    }

    handleMouseUp(e) {
        this.isPainting = false;
    }

    addPaintZone(x, y) {
        this.paintZones.push({
            x,
            y,
            radius: 0,
            maxRadius: 70,
            life: 1,
            age: 0,
        });
    }

    createDamagedAreas() {
        this.damagedAreas = [];
        const count = 12; // Меньше участков
        for (let i = 0; i < count; i++) {
            const points = [];
            const centerX = Math.random() * this.canvas.width;
            const centerY = Math.random() * this.canvas.height;
            const numPoints = Math.floor(Math.random() * 4 + 5); // 5-8 точек для более аккуратной формы
            const baseRadius = Math.random() * 18 + 15; // Меньший размер

            for (let j = 0; j < numPoints; j++) {
                const angle = (j / numPoints) * Math.PI * 2;
                const radius = baseRadius + (Math.random() - 0.5) * 8; // Меньшее отклонение
                points.push({
                    x: centerX + Math.cos(angle) * radius,
                    y: centerY + Math.sin(angle) * radius,
                    painted: false,
                    paintProgress: 0,
                });
            }

            this.damagedAreas.push({
                points,
                centerX,
                centerY,
                baseRadius,
            });
        }
    }

    animate() {
        if (!this.canvas) return;

        this.time += 0.01;

        // Wall background
        this.ctx.fillStyle = '#e8e8e8';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Wall texture (более аккуратно)
        this.ctx.fillStyle = '#d0d0d0';
        for (let i = 0; i < 60; i++) {
            const x = (i * 31) % this.canvas.width;
            const y = (i * 23) % this.canvas.height;
            this.ctx.fillRect(x, y, 1, 1);
        }

        // Update paint zones
        this.paintZones.forEach((zone, zIndex) => {
            zone.radius += 2;
            zone.age += 0.02;
            zone.life -= 0.01;

            // Check which damaged areas are being painted
            this.damagedAreas.forEach(area => {
                const dx = zone.x - area.centerX;
                const dy = zone.y - area.centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < zone.radius + area.baseRadius) {
                    area.points.forEach(point => {
                        const pointDx = zone.x - point.x;
                        const pointDy = zone.y - point.y;
                        const pointDistance = Math.sqrt(pointDx * pointDx + pointDy * pointDy);

                        if (pointDistance < zone.radius) {
                            point.paintProgress = Math.min(1, point.paintProgress + 0.1);
                            if (point.paintProgress >= 1) {
                                point.painted = true;
                            }
                        }
                    });
                }
            });

            if (zone.life <= 0 || zone.radius > zone.maxRadius) {
                this.paintZones.splice(zIndex, 1);
            }
        });

        // Draw damaged areas
        this.damagedAreas.forEach(area => {
            const dx = this.mouse.x - area.centerX;
            const dy = this.mouse.y - area.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            let scale = 1;
            if (distance < 120 && area.points.some(p => !p.painted)) {
                scale = 1 + (120 - distance) / 120 * 0.2;
            }

            // Draw unpainted damaged areas
            this.ctx.fillStyle = 'rgba(200, 150, 100, 0.6)';
            this.ctx.beginPath();
            area.points.forEach((point, i) => {
                const x = area.centerX + (point.x - area.centerX) * scale;
                const y = area.centerY + (point.y - area.centerY) * scale;
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            });
            this.ctx.closePath();
            this.ctx.fill();

            // Draw edges of damaged areas
            this.ctx.strokeStyle = 'rgba(150, 100, 50, 0.8)';
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            area.points.forEach((point, i) => {
                const x = area.centerX + (point.x - area.centerX) * scale;
                const y = area.centerY + (point.y - area.centerY) * scale;
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            });
            this.ctx.closePath();
            this.ctx.stroke();

            // Draw painting progress
            const paintedPoints = area.points.filter(p => p.painted || p.paintProgress > 0);
            if (paintedPoints.length > 0) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                this.ctx.beginPath();
                paintedPoints.forEach((point, i) => {
                    const x = area.centerX + (point.x - area.centerX) * scale;
                    const y = area.centerY + (point.y - area.centerY) * scale;
                    if (i === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                });
                this.ctx.closePath();
                this.ctx.fill();
            }
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
            this.canvas.removeEventListener('mousedown', (e) => this.handleMouseDown(e));
            this.canvas.removeEventListener('mouseup', (e) => this.handleMouseUp(e));
            this.canvas.removeEventListener('mouseleave', (e) => this.handleMouseUp(e));
        }
    }
}

export default PaintOverBackground;

