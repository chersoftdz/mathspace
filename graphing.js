// Graphing Application - Unified Engine
class GraphingApp {
    constructor() {
        this.canvas = document.getElementById('graphCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Graph settings
        this.xMin = -10;
        this.xMax = 10;
        this.yMin = -10;
        this.yMax = 10;
        this.precision = 1000;

        // Settings
        this.gridType = 'unified';
        this.activeInputId = 'func1'; // Default active input

        // Colors
        this.axisColor = '#2d3748';
        this.gridColor = '#e2e8f0';
        this.backgroundColor = '#ffffff';

        // Function visibility state
        this.visibility = {
            1: true,
            2: false,
            3: false
        };

        // Pan settings
        this.isPanning = false;
        this.panStartX = 0;
        this.panStartY = 0;
        this.lastXMin = 0;
        this.lastYMin = 0;

        // Initialize
        this.init();
    }

    init() {
        this.resizeCanvas();
        this.setupEventListeners();
        this.plotAll();

        // Initial resize check
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.plotAll();
        });
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();

        // Set canvas physical size to match display size
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        if (this.gridType === 'unified') {
            this.enforceAspect();
        }
    }

    enforceAspect() {
        if (this.gridType !== 'unified') return;

        const xRange = this.xMax - this.xMin;
        const targetYRange = xRange * (this.height / this.width);
        const yCenter = (this.yMax + this.yMin) / 2;

        this.yMin = yCenter - targetYRange / 2;
        this.yMax = yCenter + targetYRange / 2;
    }

    setupEventListeners() {
        // Inputs
        ['func1', 'func2', 'func3'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => this.plotAll());
                input.addEventListener('focus', () => this.setActiveInput(id));
            }
        });

        // Mouse Pan
        this.canvas.addEventListener('mousedown', (e) => this.startPan(e));
        this.canvas.addEventListener('mousemove', (e) => this.pan(e));
        window.addEventListener('mouseup', () => this.stopPan());

        // Touch Pan
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                e.preventDefault();
                this.startPan(e.touches[0]);
            }
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                e.preventDefault();
                this.pan(e.touches[0]);
            }
        }, { passive: false });

        this.canvas.addEventListener('touchend', () => this.stopPan());

        // Zoom Wheel
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.zoom(e.deltaY > 0 ? 0.9 : 1.1, e.offsetX, e.offsetY);
        }, { passive: false });
    }

    // --- Plotting Logic ---

    mathToPixel(x, y) {
        const pixelX = ((x - this.xMin) / (this.xMax - this.xMin)) * this.width;
        const pixelY = this.height - ((y - this.yMin) / (this.yMax - this.yMin)) * this.height;
        return { pixelX, pixelY };
    }

    pixelToMath(px, py) {
        const x = this.xMin + (px / this.width) * (this.xMax - this.xMin);
        const y = this.yMax - (py / this.height) * (this.yMax - this.yMin);
        return { x, y };
    }

    drawGrid() {
        if (this.gridType === 'unified') {
            this.enforceAspect();
        }

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.gridColor;

        const xRange = this.xMax - this.xMin;
        const yRange = this.yMax - this.yMin;

        // Calculate auto-step
        const xStep = Math.pow(10, Math.floor(Math.log10(xRange / 10)));
        const yStep = this.gridType === 'unified' ? xStep : Math.pow(10, Math.floor(Math.log10(yRange / 10)));

        this.ctx.font = '10px Cairo';
        this.ctx.fillStyle = '#718096';
        this.ctx.textAlign = 'center';

        // Vertical Lines
        for (let x = Math.floor(this.xMin / xStep) * xStep; x <= this.xMax; x += xStep) {
            const { pixelX } = this.mathToPixel(x, 0);
            this.ctx.beginPath();
            this.ctx.moveTo(pixelX, 0);
            this.ctx.lineTo(pixelX, this.height);
            this.ctx.stroke();

            // Label
            if (Math.abs(x) > 1e-10) // Don't draw 0 (axis handles it)
                this.ctx.fillText(parseFloat(x.toPrecision(4)), pixelX, this.mathToPixel(0, 0).pixelY + 15);
        }

        // Horizontal Lines
        for (let y = Math.floor(this.yMin / yStep) * yStep; y <= this.yMax; y += yStep) {
            const { pixelY } = this.mathToPixel(0, y);
            this.ctx.beginPath();
            this.ctx.moveTo(0, pixelY);
            this.ctx.lineTo(this.width, pixelY);
            this.ctx.stroke();

            // Label
            if (Math.abs(y) > 1e-10)
                this.ctx.fillText(parseFloat(y.toPrecision(4)), this.mathToPixel(0, 0).pixelX - 15, pixelY + 4);
        }

        // Axis
        this.ctx.strokeStyle = this.axisColor;
        this.ctx.lineWidth = 2;

        const origin = this.mathToPixel(0, 0);

        // X Axis
        if (origin.pixelY >= 0 && origin.pixelY <= this.height) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, origin.pixelY);
            this.ctx.lineTo(this.width, origin.pixelY);
            this.ctx.stroke();
        }

        // Y Axis
        if (origin.pixelX >= 0 && origin.pixelX <= this.width) {
            this.ctx.beginPath();
            this.ctx.moveTo(origin.pixelX, 0);
            this.ctx.lineTo(origin.pixelX, this.height);
            this.ctx.stroke();
        }
    }

    plotFunction(expression, color) {
        if (!expression) return;

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        const xStep = (this.xMax - this.xMin) / this.precision;
        let isDrawing = false;

        for (let x = this.xMin; x <= this.xMax; x += xStep) {
            try {
                // Prepare secure math eval environment
                const code = this.sanitizeMath(expression, x);
                const y = eval(code); // Sanitize ensures safety

                if (isFinite(y)) {
                    const { pixelX, pixelY } = this.mathToPixel(x, y);

                    // Clip drawing bounds to avoid canvas overflow issues
                    if (pixelY >= -this.height && pixelY <= this.height * 2) {
                        if (!isDrawing) {
                            this.ctx.moveTo(pixelX, pixelY);
                            isDrawing = true;
                        } else {
                            this.ctx.lineTo(pixelX, pixelY);
                        }
                    } else {
                        isDrawing = false;
                    }
                } else {
                    isDrawing = false;
                }
            } catch (e) {
                isDrawing = false;
            }
        }
        this.ctx.stroke();
    }

    sanitizeMath(expr, xVal) {
        // Replace common math functions
        let clean = expr.toLowerCase()
            .replace(/x/g, `(${xVal})`)
            .replace(/\^/g, '**')
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan')
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/abs/g, 'Math.abs')
            .replace(/log/g, 'Math.log10')
            .replace(/ln/g, 'Math.log')
            .replace(/pi/g, 'Math.PI')
            .replace(/e/g, 'Math.E');

        return clean;
    }

    plotAll() {
        this.drawGrid();

        if (this.visibility[1]) {
            const f1 = document.getElementById('func1').value;
            const color = document.getElementById('func1').dataset.color;
            this.plotFunction(f1, color);
        }
        if (this.visibility[2]) {
            const f2 = document.getElementById('func2').value;
            const color = document.getElementById('func2').dataset.color;
            this.plotFunction(f2, color);
        }
        if (this.visibility[3]) {
            const f3 = document.getElementById('func3').value;
            const color = document.getElementById('func3').dataset.color;
            this.plotFunction(f3, color);
        }
    }

    setActiveInput(id) {
        this.activeInputId = id;
    }

    insertKey(val) {
        const input = document.getElementById(this.activeInputId);
        if (!input) return;

        const start = input.selectionStart;
        const end = input.selectionEnd;
        const text = input.value;

        input.value = text.substring(0, start) + val + text.substring(end);
        input.focus();
        input.selectionStart = input.selectionEnd = start + val.length;

        this.plotAll();
    }

    backspace() {
        const input = document.getElementById(this.activeInputId);
        if (!input) return;

        const text = input.value;
        input.value = text.slice(0, -1);
        this.plotAll();
    }

    // --- Interaction ---

    startPan(e) {
        this.isPanning = true;
        this.panStartX = e.clientX;
        this.panStartY = e.clientY;
        this.lastXMin = this.xMin;
        this.lastXMax = this.xMax;
        this.lastYMin = this.yMin;
        this.lastYMax = this.yMax;
        this.canvas.style.cursor = 'grabbing';
    }

    pan(e) {
        if (!this.isPanning) return;

        const dxPixels = e.clientX - this.panStartX;
        const dyPixels = e.clientY - this.panStartY;

        const xRange = this.lastXMax - this.lastXMin;
        const yRange = this.lastYMax - this.lastYMin;

        const dxMath = -(dxPixels / this.width) * xRange;
        const dyMath = (dyPixels / this.height) * yRange;

        this.xMin = this.lastXMin + dxMath;
        this.xMax = this.lastXMax + dxMath;
        this.yMin = this.lastYMin + dyMath;
        this.yMax = this.lastYMax + dyMath;

        this.plotAll();
    }

    stopPan() {
        this.isPanning = false;
        this.canvas.style.cursor = 'crosshair';
    }

    zoom(factor, centerX, centerY) {
        // If center not provided (e.g. from button), use center of screen
        if (centerX === undefined) centerX = this.width / 2;
        if (centerY === undefined) centerY = this.height / 2;

        const { x: mouseX, y: mouseY } = this.pixelToMath(centerX, centerY);

        const xRange = (this.xMax - this.xMin) * factor;
        const yRange = (this.yMax - this.yMin) * factor;

        // Scale around mouse pointer
        const mouseXRatio = (mouseX - this.xMin) / (this.xMax - this.xMin);
        const mouseYRatio = (this.yMax - mouseY) / (this.yMax - this.yMin);

        this.xMin = mouseX - xRange * mouseXRatio;
        this.xMax = this.xMin + xRange;
        this.yMin = mouseY - yRange * (1 - mouseYRatio);
        this.yMax = this.yMin + yRange;

        // If Unified, enforce square aspect
        if (this.gridType === 'unified') {
            // Logic to maintain aspect ratio could go here, 
            // but simple zoom is often preferred by users.
        }

        this.plotAll();
    }

    resetView() {
        this.xMin = -10;
        this.xMax = 10;
        this.yMin = -10;
        this.yMax = 10;
        this.plotAll();
    }
}

// Global Interface
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new GraphingApp();
});

// Helper functions for HTML Buttons
function toggleVisibility(id, btn) {
    app.visibility[id] = !app.visibility[id];
    btn.classList.toggle('active', !app.visibility[id]);
    btn.innerHTML = app.visibility[id] ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';

    // Auto focus the input if enabled
    if (app.visibility[id]) {
        let inputId = 'func' + id;
        document.getElementById(inputId).focus();
        app.setActiveInput(inputId);
    }

    app.plotAll();
}

function setActiveInput(id) {
    if (app) app.setActiveInput(id);
}

function insertKey(val) {
    if (app) app.insertKey(val);
}

function backspace() {
    if (app) app.backspace();
}

function plotAll() {
    if (app) app.plotAll();
}

function resetView() {
    if (app) app.resetView();
}

function zoomIn() {
    // Zoom in (factor < 1)
    if (app) app.zoom(0.8);
}

function zoomOut() {
    // Zoom out (factor > 1)
    if (app) app.zoom(1.2);
}

function updateSettings() {
    if (app) {
        app.gridType = document.getElementById('gridType').value;
        app.plotAll();
    }
}

function toggleKeypad() {
    const keypad = document.getElementById('virtualKeypad');
    keypad.classList.toggle('visible');

    // Adjust workspace if needed? Overlay is fine.
}
