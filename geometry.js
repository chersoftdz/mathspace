/**
 * Geometry Lab Engine
 * Handles interactive construction of geometric shapes.
 */

class GeoPoint {
    constructor(x, y, label = '') {
        this.x = x;
        this.y = y;
        this.label = label;
        this.selected = false;
        this.hovered = false;
        this.radius = 6;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        if (this.selected) {
            ctx.fillStyle = '#ebf8ff';
            ctx.strokeStyle = '#3182ce';
            ctx.lineWidth = 2;
        } else if (this.hovered) {
            ctx.fillStyle = '#edf2f7';
            ctx.strokeStyle = '#4a5568';
            ctx.lineWidth = 2;
        } else {
            ctx.fillStyle = '#4a5568';
            ctx.strokeStyle = 'transparent';
        }

        ctx.fill();
        ctx.stroke();

        if (this.label) {
            ctx.fillStyle = '#2d3748';
            ctx.font = 'bold 14px Cairo';
            ctx.fillText(this.label, this.x + 10, this.y - 10);
        }
    }

    isHit(mx, my) {
        const dx = this.x - mx;
        const dy = this.y - my;
        return (dx * dx + dy * dy) <= (this.radius + 5) ** 2; // Hitbox slightly larger
    }
}

class GeoSegment {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.selected = false;
        this.hovered = false;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);

        ctx.lineCap = 'round';
        if (this.selected) {
            ctx.strokeStyle = '#3182ce';
            ctx.lineWidth = 4;
        } else if (this.hovered) {
            ctx.strokeStyle = '#718096';
            ctx.lineWidth = 3;
        } else {
            ctx.strokeStyle = '#2d3748';
            ctx.lineWidth = 2;
        }

        ctx.stroke();
    }

    isHit(mx, my) {
        // Distance from point to line segment
        const A = mx - this.p1.x;
        const B = my - this.p1.y;
        const C = this.p2.x - this.p1.x;
        const D = this.p2.y - this.p1.y;

        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;

        if (len_sq !== 0) param = dot / len_sq;

        let xx, yy;

        if (param < 0) {
            xx = this.p1.x;
            yy = this.p1.y;
        } else if (param > 1) {
            xx = this.p2.x;
            yy = this.p2.y;
        } else {
            xx = this.p1.x + param * C;
            yy = this.p1.y + param * D;
        }

        const dx = mx - xx;
        const dy = my - yy;
        return (dx * dx + dy * dy) < 25; // 5px tolerance squared
    }

    getLength() {
        const dx = this.p2.x - this.p1.x;
        const dy = this.p2.y - this.p1.y;
        // Assume 1 unit = 40px (grid size is 20px)
        const pixels = Math.sqrt(dx * dx + dy * dy);
        return (pixels / 40).toFixed(2);
    }
}

class GeoCircle {
    constructor(center, edgePoint) {
        this.center = center;
        this.edgePoint = edgePoint;
        this.selected = false;
        this.hovered = false;
    }

    draw(ctx) {
        const radius = Math.sqrt(
            Math.pow(this.edgePoint.x - this.center.x, 2) +
            Math.pow(this.edgePoint.y - this.center.y, 2)
        );

        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, radius, 0, Math.PI * 2);

        if (this.selected) {
            ctx.strokeStyle = '#3182ce';
            ctx.lineWidth = 3;
        } else if (this.hovered) {
            ctx.strokeStyle = '#718096';
            ctx.lineWidth = 2;
        } else {
            ctx.strokeStyle = '#2d3748';
            ctx.lineWidth = 1.5;
        }

        ctx.stroke();
    }

    isHit(mx, my) {
        const radius = Math.sqrt(
            Math.pow(this.edgePoint.x - this.center.x, 2) +
            Math.pow(this.edgePoint.y - this.center.y, 2)
        );
        const distToCenter = Math.sqrt(
            Math.pow(mx - this.center.x, 2) +
            Math.pow(my - this.center.y, 2)
        );

        return Math.abs(distToCenter - radius) < 5; // 5px tolerance
    }

    getRadius() {
        const radiusPx = Math.sqrt(
            Math.pow(this.edgePoint.x - this.center.x, 2) +
            Math.pow(this.edgePoint.y - this.center.y, 2)
        );
        return (radiusPx / 40).toFixed(2);
    }
}

class GeometryApp {
    constructor() {
        this.canvas = document.getElementById('geoCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.container = document.getElementById('canvasContainer');
        this.propPanel = document.getElementById('propPanel');
        this.propContent = document.getElementById('propContent');

        this.points = [];
        this.segments = [];
        this.circles = [];
        this.selectedObject = null;
        this.hoveredObject = null;

        this.currentTool = 'select'; // select, point, segment, circle
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.constructionStartPoint = null;

        this.resize();
        this.setupEvents();
        this.setupToolbar();
        this.drawLoop();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        this.draw();
    }

    setupToolbar() {
        const tools = ['select', 'point', 'segment', 'circle'];
        tools.forEach(tool => {
            document.getElementById(`tool-${tool}`).addEventListener('click', (e) => {
                this.setTool(tool);
                // UI update
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        document.getElementById('tool-clear').addEventListener('click', () => {
            if (confirm('هل أنت متأكد من مسح السبورة؟')) {
                this.points = [];
                this.segments = [];
                this.circles = [];
                this.selectedObject = null;
                this.propPanel.style.display = 'none';
            }
        });

        document.getElementById('tool-trash').addEventListener('click', () => {
            this.deleteSelected();
        });
    }

    setTool(tool) {
        this.currentTool = tool;
        this.selectedObject = null;
        this.constructionStartPoint = null;
        this.propPanel.style.display = 'none';
        this.canvas.style.cursor = tool === 'select' ? 'default' : 'crosshair';
    }

    setupEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));

        // Touch events (simple mapping)
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent("mousemove", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchend', (e) => {
            const mouseEvent = new MouseEvent("mouseup", {});
            this.canvas.dispatchEvent(mouseEvent);
        });
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    findObjectAt(x, y) {
        // Priority: Points > Lines > Circles
        for (let p of this.points) {
            if (p.isHit(x, y)) return p;
        }
        for (let s of this.segments) {
            if (s.isHit(x, y)) return s;
        }
        for (let c of this.circles) {
            if (c.isHit(x, y)) return c;
        }
        return null;
    }

    // Snap to existing point if close
    getSnapPoint(x, y, exclude = null) {
        for (let p of this.points) {
            if (p !== exclude && p.isHit(x, y)) return p;
        }
        return null;
    }

    onMouseDown(e) {
        const pos = this.getMousePos(e);

        if (this.currentTool === 'select') {
            const obj = this.findObjectAt(pos.x, pos.y);
            this.selectedObject = obj;

            if (obj) {
                this.isDragging = true;
                if (obj instanceof GeoPoint) {
                    this.dragOffset = { x: obj.x - pos.x, y: obj.y - pos.y };
                }
                this.showProperties(obj);
            } else {
                this.propPanel.style.display = 'none';
            }
        }
        else if (this.currentTool === 'point') {
            const p = new GeoPoint(pos.x, pos.y, this.getNextLabel());
            this.points.push(p);
        }
        else if (this.currentTool === 'segment' || this.currentTool === 'circle') {
            const snap = this.getSnapPoint(pos.x, pos.y);
            if (snap) {
                this.constructionStartPoint = snap;
            } else {
                // Create new point on the fly
                const p = new GeoPoint(pos.x, pos.y, this.getNextLabel());
                this.points.push(p);
                this.constructionStartPoint = p;
            }
        }
    }

    onMouseMove(e) {
        const pos = this.getMousePos(e);

        // Hover effect
        const obj = this.findObjectAt(pos.x, pos.y);
        if (this.hoveredObject && this.hoveredObject !== obj) {
            this.hoveredObject.hovered = false;
        }
        this.hoveredObject = obj;
        if (obj) obj.hovered = true;

        // Dragging
        if (this.isDragging && this.selectedObject instanceof GeoPoint) {
            this.selectedObject.x = pos.x + this.dragOffset.x;
            this.selectedObject.y = pos.y + this.dragOffset.y;
            this.updateProperties(this.selectedObject);
        }

        // Construction Preview (Rubber banding)
        // (Could be added for better UX)
    }

    onMouseUp(e) {
        if (this.currentTool === 'select') {
            this.isDragging = false;
        }
        else if (this.constructionStartPoint) {
            const pos = this.getMousePos(e);
            let endPoint = this.getSnapPoint(pos.x, pos.y, this.constructionStartPoint);

            if (!endPoint) {
                // Determine if we dragged enough to create a point, or just clicked
                // For simplicity, always create a point at release if not snapped
                endPoint = new GeoPoint(pos.x, pos.y, this.getNextLabel());
                this.points.push(endPoint);
            }

            if (this.currentTool === 'segment') {
                if (endPoint !== this.constructionStartPoint) {
                    this.segments.push(new GeoSegment(this.constructionStartPoint, endPoint));
                }
            } else if (this.currentTool === 'circle') {
                if (endPoint !== this.constructionStartPoint) {
                    this.circles.push(new GeoCircle(this.constructionStartPoint, endPoint));
                }
            }

            this.constructionStartPoint = null;
        }
    }

    deleteSelected() {
        if (!this.selectedObject) return;

        if (this.selectedObject instanceof GeoSegment) {
            this.segments = this.segments.filter(s => s !== this.selectedObject);
        } else if (this.selectedObject instanceof GeoCircle) {
            this.circles = this.circles.filter(c => c !== this.selectedObject);
        } else if (this.selectedObject instanceof GeoPoint) {
            // Cascade delete: delete any segment/circle using this point
            const p = this.selectedObject;
            this.segments = this.segments.filter(s => s.p1 !== p && s.p2 !== p);
            this.circles = this.circles.filter(c => c.center !== p && c.edgePoint !== p);
            this.points = this.points.filter(pt => pt !== p);
        }

        this.selectedObject = null;
        this.propPanel.style.display = 'none';
    }

    getNextLabel() {
        const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return labels[this.points.length % labels.length];
    }

    showProperties(obj) {
        this.propPanel.style.display = 'block';
        let html = '';

        if (obj instanceof GeoPoint) {
            html += `<div class="prop-row"><span>الاسم</span><span class="prop-value">${obj.label}</span></div>`;
            html += `<div class="prop-row"><span>X</span><span class="prop-value">${Math.round(obj.x)}</span></div>`;
            html += `<div class="prop-row"><span>Y</span><span class="prop-value">${Math.round(obj.y)}</span></div>`;
        } else if (obj instanceof GeoSegment) {
            html += `<div class="prop-row"><span>النوع</span><span class="prop-value">قطعة مستقيمة</span></div>`;
            html += `<div class="prop-row"><span>الطول</span><span class="prop-value">${obj.getLength()} u</span></div>`;
        } else if (obj instanceof GeoCircle) {
            html += `<div class="prop-row"><span>النوع</span><span class="prop-value">دائرة</span></div>`;
            html += `<div class="prop-row"><span>نصف القطر</span><span class="prop-value">${obj.getRadius()} u</span></div>`;
        }

        this.propContent.innerHTML = html;
    }

    updateProperties(obj) {
        if (this.propPanel.style.display !== 'none' && this.selectedObject === obj) {
            this.showProperties(obj);
        }
    }

    draw() {
        // Clear background
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw circles
        this.circles.forEach(c => {
            // Highlight if selected
            c.selected = (c === this.selectedObject);
            c.draw(this.ctx);
        });

        // Draw segments
        this.segments.forEach(s => {
            s.selected = (s === this.selectedObject);
            s.draw(this.ctx);
        });

        // Draw points (on top)
        this.points.forEach(p => {
            p.selected = (p === this.selectedObject);
            p.draw(this.ctx);
        });

        // Draw Construction Line (Rubber band)
        // TODO: Implement cleaner preview
    }

    drawLoop() {
        this.draw();
        requestAnimationFrame(() => this.drawLoop());
    }
}

// Init
const app = new GeometryApp();
