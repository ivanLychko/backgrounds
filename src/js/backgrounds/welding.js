class WeldingBackground {
    constructor(container) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.breaks = [];
        this.weldZones = [];
        this.sparks = [];
        this.mouse = { x: 0, y: 0 };
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
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));

        this.createBreaks();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createBreaks();
    }

    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    handleClick(e) {
        this.startWeld(e.clientX, e.clientY);
    }

    handleMouseDown(e) {
        this.isWelding = true;
        this.startWeld(e.clientX, e.clientY);
    }

    handleMouseUp(e) {
        this.isWelding = false;
    }

    startWeld(x, y) {
        this.weldZones.push({
            x,
            y,
            radius: 0,
            maxRadius: 85,
            life: 1,
            progress: 0,
        });

        // Create sparks (меньше для аккуратности)
        for (let i = 0; i < 8; i++) {
            this.sparks.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                size: Math.random() * 3 + 1,
                life: 1,
                color: Math.random() > 0.5 ? '#ffaa00' : '#ffffff',
            });
        }
    }

    createBreaks() {
        this.breaks = [];
        const count = 8; // Меньше разрывов
        for (let i = 0; i < count; i++) {
            const startX = Math.random() * this.canvas.width;
            const startY = Math.random() * this.canvas.height;
            const points = [];
            let x = startX;
            let y = startY;
            const length = Math.random() * 80 + 60;
            // Основное направление (более прямое, как в инжекции трещин)
            const mainAngle = Math.random() * Math.PI * 0.5 + Math.PI * 0.25;

            const segments = Math.floor(Math.random() * 15 + 12);
            for (let j = 0; j < segments; j++) {
                points.push({ x, y, welded: false, weldProgress: 0 });
                // Небольшое отклонение от основного направления
                const angleVariation = (Math.random() - 0.5) * 0.5;
                const angle = mainAngle + angleVariation;
                const segmentLength = length / segments;
                x += Math.cos(angle) * segmentLength;
                y += Math.sin(angle) * segmentLength;
                if (x < 0 || x > this.canvas.width || y < 0 || y > this.canvas.height) break;
            }

            this.breaks.push({
                points,
                width: Math.random() * 2.5 + 1.5, // Более тонкие линии
            });
        }
    }

    animate() {
        if (!this.canvas) return;

        this.time += 0.01;

        // Metal background
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Metal texture (более аккуратно)
        this.ctx.fillStyle = '#333333';
        for (let i = 0; i < 50; i++) {
            const x = (i * 37) % this.canvas.width;
            const y = (i * 23) % this.canvas.height;
            this.ctx.fillRect(x, y, 1, 1);
        }

        // Update weld zones
        this.weldZones.forEach((zone, zIndex) => {
            zone.radius += 1.2;
            zone.progress += 0.025;
            zone.life -= 0.006;

            // Check which breaks are being welded
            this.breaks.forEach(breakLine => {
                breakLine.points.forEach(point => {
                    const dx = zone.x - point.x;
                    const dy = zone.y - point.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < zone.radius) {
                        point.weldProgress = Math.min(1, point.weldProgress + 0.06);
                        if (point.weldProgress >= 1) {
                            point.welded = true;
                        }
                    }
                });
            });

            if (zone.life <= 0 || zone.radius > zone.maxRadius) {
                this.weldZones.splice(zIndex, 1);
            }
        });

        // Update sparks
        this.sparks.forEach((spark, index) => {
            spark.x += spark.vx;
            spark.y += spark.vy;
            spark.vy += 0.1; // gravity
            spark.life -= 0.02;
            spark.vx *= 0.98;
            spark.vy *= 0.98;

            if (spark.life <= 0 || spark.x < 0 || spark.x > this.canvas.width ||
                spark.y < 0 || spark.y > this.canvas.height) {
                this.sparks.splice(index, 1);
            } else {
                // Draw spark
                this.ctx.fillStyle = spark.color;
                this.ctx.globalAlpha = spark.life;
                this.ctx.beginPath();
                this.ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.globalAlpha = 1;
            }
        });

        // Draw breaks
        this.breaks.forEach(breakLine => {
            // Draw unwelded parts
            this.ctx.strokeStyle = 'rgba(150, 150, 150, 0.8)';
            this.ctx.lineWidth = breakLine.width;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();

            breakLine.points.forEach((point, i) => {
                const dx = this.mouse.x - point.x;
                const dy = this.mouse.y - point.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                let x = point.x;
                let y = point.y;

                if (distance < 100 && !point.welded) {
                    const force = (100 - distance) / 100;
                    x += (dx / distance) * force * 4;
                    y += (dy / distance) * force * 4;
                }

                if (!point.welded) {
                    if (i === 0 || !breakLine.points[i - 1].welded) {
                        if (i === 0) {
                            this.ctx.moveTo(x, y);
                        } else {
                            this.ctx.lineTo(x, y);
                        }
                    } else {
                        this.ctx.moveTo(x, y);
                    }
                }
            });

            this.ctx.stroke();

            // Draw welding progress (bright orange/yellow)
            breakLine.points.forEach((point, i) => {
                if (point.weldProgress > 0 && point.weldProgress < 1 && i > 0) {
                    const prevPoint = breakLine.points[i - 1];
                    if (prevPoint.weldProgress > 0) {
                        const intensity = point.weldProgress;
                        this.ctx.strokeStyle = `rgba(255, ${150 + intensity * 105}, 0, ${intensity * 0.9})`;
                        this.ctx.lineWidth = breakLine.width * (1.5 + intensity * 0.5);
                        this.ctx.beginPath();
                        this.ctx.moveTo(prevPoint.x, prevPoint.y);
                        this.ctx.lineTo(point.x, point.y);
                        this.ctx.stroke();
                    }
                }
            });

            // Draw welded parts (metallic)
            this.ctx.strokeStyle = 'rgba(200, 200, 200, 0.6)';
            this.ctx.lineWidth = breakLine.width * 1.3;
            this.ctx.beginPath();

            let inWelded = false;
            breakLine.points.forEach((point, i) => {
                if (point.welded) {
                    if (!inWelded) {
                        this.ctx.moveTo(point.x, point.y);
                        inWelded = true;
                    } else {
                        this.ctx.lineTo(point.x, point.y);
                    }
                } else {
                    if (inWelded && i > 0 && breakLine.points[i - 1].welded) {
                        this.ctx.stroke();
                        this.ctx.beginPath();
                    }
                    inWelded = false;
                }
            });
            if (inWelded) {
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
        if (this.canvas) {
            this.canvas.removeEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.canvas.removeEventListener('click', (e) => this.handleClick(e));
            this.canvas.removeEventListener('mousedown', (e) => this.handleMouseDown(e));
            this.canvas.removeEventListener('mouseup', (e) => this.handleMouseUp(e));
        }
    }
}

export default WeldingBackground;

