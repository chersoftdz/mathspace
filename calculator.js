// Calculator Variables
let currentNumber = '0';
let previousNumber = null;
let operation = null;
let waitingForSecondNumber = false;
let displayHistory = '';

// DOM Elements
let displayCurrent, displayHistoryElement;

// Initialize Calculator
document.addEventListener('DOMContentLoaded', function () {
    displayCurrent = document.getElementById('displayCurrent');
    displayHistoryElement = document.getElementById('displayHistory');

    // Initialize tabs
    initializeTabs();

    // Initialize tables
    loadMultiplicationTable();

    // Initialize converters
    loadLengthConverter();

    // Initialize geometry
    loadSquareCalculator();

    // Initialize solvers
    loadPGCDSolver();

});

// Tab Management
function initializeTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Scientific Calculator Functions
function appendNumber(num) {
    if (waitingForSecondNumber) {
        currentNumber = num;
        waitingForSecondNumber = false;
    } else {
        currentNumber = currentNumber === '0' ? num : currentNumber + num;
    }
    updateDisplay();
}

function appendDecimal() {
    if (!currentNumber.includes('.')) {
        currentNumber += '.';
        updateDisplay();
    }
}

function setOperator(op) {
    if (operation && !waitingForSecondNumber) {
        calculate();
    }

    previousNumber = parseFloat(currentNumber);
    operation = op;
    waitingForSecondNumber = true;

    displayHistory = `${previousNumber} ${getOperatorSymbol(op)}`;
    updateDisplay();
}

function calculate() {
    if (operation === null || waitingForSecondNumber) {
        return;
    }

    const current = parseFloat(currentNumber);
    let result;

    switch (operation) {
        case '+':
            result = previousNumber + current;
            break;
        case '-':
            result = previousNumber - current;
            break;
        case '*':
            result = previousNumber * current;
            break;
        case '/':
            if (current === 0) {
                alert('لا يمكن القسمة على صفر!');
                return;
            }
            result = previousNumber / current;
            break;
    }

    displayHistory = `${previousNumber} ${getOperatorSymbol(operation)} ${current} =`;
    currentNumber = result.toString();
    operation = null;
    waitingForSecondNumber = false;

    updateDisplay();
}

function calculateFunction(func) {
    const num = parseFloat(currentNumber);
    let result;

    switch (func) {
        case 'sin':
            result = Math.sin(num * Math.PI / 180);
            break;
        case 'cos':
            result = Math.cos(num * Math.PI / 180);
            break;
        case 'tan':
            result = Math.tan(num * Math.PI / 180);
            break;
        case 'log':
            result = Math.log10(num);
            break;
        case 'ln':
            result = Math.log(num);
            break;
        case 'sqrt':
            result = Math.sqrt(num);
            break;
        case 'pow':
            result = num * num;
            break;
        case 'pow3':
            result = num * num * num;
            break;
        case 'factorial':
            result = factorial(num);
            break;
        case 'percent':
            result = num / 100;
            break;
        case 'inverse':
            result = 1 / num;
            break;
        case 'exp':
            result = Math.exp(num);
            break;
        case 'pi':
            result = Math.PI;
            break;
    }

    displayHistory = `${func}(${num}) =`;
    currentNumber = result.toString();
    updateDisplay();
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function getOperatorSymbol(op) {
    switch (op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        default: return op;
    }
}

function clearAll() {
    currentNumber = '0';
    previousNumber = null;
    operation = null;
    waitingForSecondNumber = false;
    displayHistory = '';
    updateDisplay();
}

function clearEntry() {
    currentNumber = '0';
    updateDisplay();
}

function backspace() {
    if (currentNumber.length === 1) {
        currentNumber = '0';
    } else {
        currentNumber = currentNumber.slice(0, -1);
    }
    updateDisplay();
}

function updateDisplay() {
    if (displayCurrent) {
        displayCurrent.textContent = currentNumber;
    }
    if (displayHistoryElement) {
        displayHistoryElement.textContent = displayHistory;
    }
}

// Tables Functions
function loadMultiplicationTable() {
    const content = document.getElementById('tableContent');
    if (!content) return;

    let html = '<div class="table-wrapper">';
    html += '<h3>جدول الضرب</h3>';
    html += '<table class="math-table">';

    // Header row
    html += '<tr><th>×</th>';
    for (let i = 1; i <= 12; i++) {
        html += `<th>${i}</th>`;
    }
    html += '</tr>';

    // Data rows
    for (let i = 1; i <= 12; i++) {
        html += '<tr>';
        html += `<th>${i}</th>`;
        for (let j = 1; j <= 12; j++) {
            html += `<td>${i * j}</td>`;
        }
        html += '</tr>';
    }

    html += '</table></div>';
    content.innerHTML = html;
}

// Converter Functions
function loadLengthConverter() {
    const content = document.getElementById('converterContent');
    if (!content) return;

    content.innerHTML = `
        <div class="converter-wrapper">
            <h3>محول الطول</h3>
            <div class="converter-inputs">
                <div class="input-group">
                    <input type="number" id="lengthInput" placeholder="أدخل القيمة" value="1">
                    <select id="lengthFrom">
                        <option value="mm">مليمتر (mm)</option>
                        <option value="cm">سنتيمتر (cm)</option>
                        <option value="m" selected>متر (m)</option>
                        <option value="km">كيلومتر (km)</option>
                        <option value="in">بوصة (in)</option>
                        <option value="ft">قدم (ft)</option>
                        <option value="yd">ياردة (yd)</option>
                        <option value="mi">ميل (mi)</option>
                    </select>
                </div>
                <div class="converter-arrow">
                    <i class="fas fa-exchange-alt"></i>
                </div>
                <div class="input-group">
                    <input type="number" id="lengthOutput" readonly>
                    <select id="lengthTo">
                        <option value="mm">مليمتر (mm)</option>
                        <option value="cm" selected>سنتيمتر (cm)</option>
                        <option value="m">متر (m)</option>
                        <option value="km">كيلومتر (km)</option>
                        <option value="in">بوصة (in)</option>
                        <option value="ft">قدم (ft)</option>
                        <option value="yd">ياردة (yd)</option>
                        <option value="mi">ميل (mi)</option>
                    </select>
                </div>
            </div>
            <button onclick="convertLength()" class="btn btn-primary">تحويل</button>
        </div>
    `;

    // Add event listeners
    document.getElementById('lengthInput').addEventListener('input', convertLength);
    document.getElementById('lengthFrom').addEventListener('change', convertLength);
    document.getElementById('lengthTo').addEventListener('change', convertLength);
}

function convertLength() {
    const input = parseFloat(document.getElementById('lengthInput').value);
    const fromUnit = document.getElementById('lengthFrom').value;
    const toUnit = document.getElementById('lengthTo').value;

    if (isNaN(input)) return;

    // Convert to meters first
    let meters = input * getLengthMultiplier(fromUnit);

    // Convert from meters to target unit
    let result = meters / getLengthMultiplier(toUnit);

    // Format result based on its size for better readability
    let formattedResult;
    if (result < 0.000001) {
        // For very small numbers, use scientific notation
        formattedResult = result.toExponential(6);
    } else if (result < 0.001) {
        // For small numbers, show more decimal places
        formattedResult = result.toFixed(12);
    } else if (result < 1) {
        // For numbers less than 1, show more decimal places
        formattedResult = result.toFixed(8);
    } else if (result < 1000) {
        // For normal numbers, show reasonable decimal places
        formattedResult = result.toFixed(6);
    } else {
        // For large numbers, show fewer decimal places
        formattedResult = result.toFixed(2);
    }

    document.getElementById('lengthOutput').value = formattedResult;

    // Add visual feedback for very small numbers
    const outputField = document.getElementById('lengthOutput');
    if (result < 0.000001) {
        outputField.style.color = '#fd7e14';
        outputField.style.fontWeight = '600';
        outputField.style.fontStyle = 'italic';
        outputField.title = 'النتيجة صغيرة جداً - تم عرضها بالتدوين العلمي';
    } else if (result < 0.001) {
        outputField.style.color = '#dc3545';
        outputField.style.fontWeight = '600';
        outputField.title = 'النتيجة صغيرة - تم عرضها بعدد أكبر من الأرقام العشرية';
    } else {
        outputField.style.color = '#495057';
        outputField.style.fontWeight = '500';
        outputField.style.fontStyle = 'normal';
        outputField.title = '';
    }
}

function getLengthMultiplier(unit) {
    const multipliers = {
        'mm': 0.001,
        'cm': 0.01,
        'm': 1,
        'km': 1000,
        'in': 0.0254,
        'ft': 0.3048,
        'yd': 0.9144,
        'mi': 1609.344
    };
    return multipliers[unit] || 1;
}

// Geometry Functions
function loadSquareCalculator() {
    const content = document.getElementById('geometryContent');
    if (!content) return;

    content.innerHTML = `
        <div class="geometry-wrapper">
            <h3>حاسبة المربع</h3>
            <div class="geometry-inputs">
                <div class="input-group">
                    <label>طول الضلع:</label>
                    <input type="number" id="squareSide" placeholder="أدخل طول الضلع" value="5">
                    <select id="squareUnit">
                        <option value="cm">سنتيمتر (cm)</option>
                        <option value="m">متر (m)</option>
                        <option value="mm">مليمتر (mm)</option>
                    </select>
                </div>
            </div>
            <button onclick="calculateSquare()" class="btn btn-primary">احسب</button>
            <div class="geometry-results" id="squareResults"></div>
        </div>
    `;

    // Add event listener
    document.getElementById('squareSide').addEventListener('input', calculateSquare);
}

function calculateSquare() {
    const side = parseFloat(document.getElementById('squareSide').value);
    const unit = document.getElementById('squareUnit').value;

    if (isNaN(side) || side <= 0) {
        document.getElementById('squareResults').innerHTML = '<p class="error">أدخل قيمة صحيحة للضلع</p>';
        return;
    }

    const perimeter = 4 * side;
    const area = side * side;
    const diagonal = side * Math.sqrt(2);

    const results = `
        <div class="result-item">
            <h4>نتائج الحساب:</h4>
            <p><strong>المحيط:</strong> ${perimeter} ${unit}</p>
            <p><strong>المساحة:</strong> ${area} ${unit}²</p>
            <p><strong>القطر:</strong> ${diagonal.toFixed(2)} ${unit}</p>
        </div>
    `;

    document.getElementById('squareResults').innerHTML = results;
}



















// Event Listeners for Table Buttons
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('table-btn')) {
        const tableType = e.target.getAttribute('data-table');
        loadTable(tableType);

        // Update active button
        document.querySelectorAll('.table-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
    }

    if (e.target.classList.contains('converter-btn')) {
        const converterType = e.target.getAttribute('data-converter');
        loadConverter(converterType);

        // Update active button
        document.querySelectorAll('.converter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
    }

    if (e.target.classList.contains('shape-btn')) {
        const shapeType = e.target.getAttribute('data-shape');
        loadShapeCalculator(shapeType);

        // Update active button
        document.querySelectorAll('.shape-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
    }
});

function loadTable(tableType) {
    const content = document.getElementById('tableContent');
    if (!content) return;

    switch (tableType) {
        case 'multiplication':
            loadMultiplicationTable();
            break;
        case 'powers':
            loadPowersTable();
            break;
        case 'roots':
            loadRootsTable();
            break;
        case 'trigonometry':
            loadTrigonometryTable();
            break;
    }
}

function loadPowersTable() {
    const content = document.getElementById('tableContent');
    if (!content) return;

    let html = '<div class="table-wrapper">';
    html += '<h3>قوى الأعداد</h3>';
    html += '<table class="math-table">';

    // Header row
    html += '<tr><th>العدد</th><th>التربيع</th><th>التكعيب</th><th>القوة الرابعة</th></tr>';

    // Data rows
    for (let i = 1; i <= 20; i++) {
        html += '<tr>';
        html += `<td>${i}</td>`;
        html += `<td>${i * i}</td>`;
        html += `<td>${i * i * i}</td>`;
        html += `<td>${i * i * i * i}</td>`;
        html += '</tr>';
    }

    html += '</table></div>';
    content.innerHTML = html;
}

function loadRootsTable() {
    const content = document.getElementById('tableContent');
    if (!content) return;

    let html = '<div class="table-wrapper">';
    html += '<h3>جذور الأعداد</h3>';
    html += '<table class="math-table">';

    // Header row
    html += '<tr><th>العدد</th><th>الجذر التربيعي</th><th>الجذر التكعيبي</th></tr>';

    // Data rows
    for (let i = 1; i <= 20; i++) {
        html += '<tr>';
        html += `<td>${i}</td>`;
        html += `<td>${Math.sqrt(i).toFixed(3)}</td>`;
        html += `<td>${Math.cbrt(i).toFixed(3)}</td>`;
        html += '</tr>';
    }

    html += '</table></div>';
    content.innerHTML = html;
}

function loadTrigonometryTable() {
    const content = document.getElementById('tableContent');
    if (!content) return;

    let html = '<div class="table-wrapper">';
    html += '<h3>القيم المثلثية</h3>';
    html += '<table class="math-table">';

    // Header row
    html += '<tr><th>الزاوية (درجة)</th><th>الجيب</th><th>جيب التمام</th><th>الظل</th></tr>';

    // Data rows
    for (let angle = 0; angle <= 90; angle += 15) {
        const radians = angle * Math.PI / 180;
        html += '<tr>';
        html += `<td>${angle}°</td>`;
        html += `<td>${Math.sin(radians).toFixed(4)}</td>`;
        html += `<td>${Math.cos(radians).toFixed(4)}</td>`;
        html += `<td>${Math.tan(radians).toFixed(4)}</td>`;
        html += '</tr>';
    }

    html += '</table></div>';
    content.innerHTML = html;
}

function loadConverter(converterType) {
    switch (converterType) {
        case 'length':
            loadLengthConverter();
            break;
        case 'area':
            loadAreaConverter();
            break;
        case 'volume':
            loadVolumeConverter();
            break;
        case 'weight':
            loadWeightConverter();
            break;
        case 'temperature':
            loadTemperatureConverter();
            break;
    }
}

function loadAreaConverter() {
    const content = document.getElementById('converterContent');
    if (!content) return;

    content.innerHTML = `
        <div class="converter-wrapper">
            <h3>محول المساحة</h3>
            <div class="converter-inputs">
                <div class="input-group">
                    <input type="number" id="areaInput" placeholder="أدخل القيمة" value="1">
                    <select id="areaFrom">
                        <option value="mm2">مليمتر مربع (mm²)</option>
                        <option value="cm2" selected>سنتيمتر مربع (cm²)</option>
                        <option value="m2">متر مربع (m²)</option>
                        <option value="km2">كيلومتر مربع (km²)</option>
                        <option value="in2">بوصة مربعة (in²)</option>
                        <option value="ft2">قدم مربع (ft²)</option>
                        <option value="acres">أكر (acres)</option>
                        <option value="hectares">هكتار (ha)</option>
                    </select>
                </div>
                <div class="converter-arrow">
                    <i class="fas fa-exchange-alt"></i>
                </div>
                <div class="input-group">
                    <input type="number" id="areaOutput" readonly>
                    <select id="areaTo">
                        <option value="mm2">مليمتر مربع (mm²)</option>
                        <option value="cm2">سنتيمتر مربع (cm²)</option>
                        <option value="m2" selected>متر مربع (m²)</option>
                        <option value="km2">كيلومتر مربع (km²)</option>
                        <option value="in2">بوصة مربعة (in²)</option>
                        <option value="ft2">قدم مربع (ft²)</option>
                        <option value="acres">أكر (acres)</option>
                        <option value="hectares">هكتار (ha)</option>
                    </select>
                </div>
            </div>
            <button onclick="convertArea()" class="btn btn-primary">تحويل</button>
        </div>
    `;

    // Add event listeners
    document.getElementById('areaInput').addEventListener('input', convertArea);
    document.getElementById('areaFrom').addEventListener('change', convertArea);
    document.getElementById('areaTo').addEventListener('change', convertArea);
}

function convertArea() {
    const input = parseFloat(document.getElementById('areaInput').value);
    const fromUnit = document.getElementById('areaFrom').value;
    const toUnit = document.getElementById('areaTo').value;

    if (isNaN(input)) return;

    // Convert to square meters first
    let squareMeters = input * getAreaMultiplier(fromUnit);

    // Convert from square meters to target unit
    let result = squareMeters / getAreaMultiplier(toUnit);

    // Format result based on its size for better readability
    let formattedResult;
    if (result < 0.000001) {
        // For very small numbers, use scientific notation
        formattedResult = result.toExponential(6);
    } else if (result < 0.001) {
        // For small numbers, show more decimal places
        formattedResult = result.toFixed(12);
    } else if (result < 1) {
        // For numbers less than 1, show more decimal places
        formattedResult = result.toFixed(8);
    } else if (result < 1000) {
        // For normal numbers, show reasonable decimal places
        formattedResult = result.toFixed(6);
    } else {
        // For large numbers, show fewer decimal places
        formattedResult = result.toFixed(2);
    }

    document.getElementById('areaOutput').value = formattedResult;

    // Add visual feedback for very small numbers
    const outputField = document.getElementById('areaOutput');
    if (result < 0.000001) {
        outputField.style.color = '#fd7e14';
        outputField.style.fontWeight = '600';
        outputField.style.fontStyle = 'italic';
        outputField.title = 'النتيجة صغيرة جداً - تم عرضها بالتدوين العلمي';
    } else if (result < 0.001) {
        outputField.style.color = '#dc3545';
        outputField.style.fontWeight = '600';
        outputField.title = 'النتيجة صغيرة - تم عرضها بعدد أكبر من الأرقام العشرية';
    } else {
        outputField.style.color = '#495057';
        outputField.style.fontWeight = '500';
        outputField.style.fontStyle = 'normal';
        outputField.title = '';
    }
}

function getAreaMultiplier(unit) {
    const multipliers = {
        'mm2': 0.000001,
        'cm2': 0.0001,
        'm2': 1,
        'km2': 1000000,
        'in2': 0.00064516,
        'ft2': 0.092903,
        'acres': 4046.86,
        'hectares': 10000
    };
    return multipliers[unit] || 1;
}

function loadWeightConverter() {
    const content = document.getElementById('converterContent');
    if (!content) return;

    content.innerHTML = `
        <div class="converter-wrapper">
            <h3>محول الوزن</h3>
            <div class="converter-inputs">
                <div class="input-group">
                    <input type="number" id="weightInput" placeholder="أدخل القيمة" value="1">
                    <select id="weightFrom">
                        <option value="mg">مليجرام (mg)</option>
                        <option value="g">جرام (g)</option>
                        <option value="kg" selected>كيلوجرام (kg)</option>
                        <option value="t">طن (t)</option>
                        <option value="oz">أونصة (oz)</option>
                        <option value="lb">باوند (lb)</option>
                    </select>
                </div>
                <div class="converter-arrow">
                    <i class="fas fa-exchange-alt"></i>
                </div>
                <div class="input-group">
                    <input type="number" id="weightOutput" readonly>
                    <select id="weightTo">
                        <option value="mg">مليجرام (mg)</option>
                        <option value="g" selected>جرام (g)</option>
                        <option value="kg">كيلوجرام (kg)</option>
                        <option value="t">طن (t)</option>
                        <option value="oz">أونصة (oz)</option>
                        <option value="lb">باوند (lb)</option>
                    </select>
                </div>
            </div>
            <button onclick="convertWeight()" class="btn btn-primary">تحويل</button>
        </div>
    `;

    // Add event listeners
    document.getElementById('weightInput').addEventListener('input', convertWeight);
    document.getElementById('weightFrom').addEventListener('change', convertWeight);
    document.getElementById('weightTo').addEventListener('change', convertWeight);
}

function convertWeight() {
    const input = parseFloat(document.getElementById('weightInput').value);
    const fromUnit = document.getElementById('weightFrom').value;
    const toUnit = document.getElementById('weightTo').value;

    if (isNaN(input)) return;

    // Convert to grams first
    let grams = input * getWeightMultiplier(fromUnit);

    // Convert from grams to target unit
    let result = grams / getWeightMultiplier(toUnit);

    // Format result based on its size for better readability
    let formattedResult;
    if (result < 0.000001) {
        // For very small numbers, use scientific notation
        formattedResult = result.toExponential(6);
    } else if (result < 0.001) {
        // For small numbers, show more decimal places
        formattedResult = result.toFixed(12);
    } else if (result < 1) {
        // For numbers less than 1, show more decimal places
        formattedResult = result.toFixed(8);
    } else if (result < 1000) {
        // For normal numbers, show reasonable decimal places
        formattedResult = result.toFixed(6);
    } else {
        // For large numbers, show fewer decimal places
        formattedResult = result.toFixed(2);
    }

    document.getElementById('weightOutput').value = formattedResult;

    // Add visual feedback for very small numbers
    const outputField = document.getElementById('weightOutput');
    if (result < 0.000001) {
        outputField.style.color = '#fd7e14';
        outputField.style.fontWeight = '600';
        outputField.style.fontStyle = 'italic';
        outputField.title = 'النتيجة صغيرة جداً - تم عرضها بالتدوين العلمي';
    } else if (result < 0.001) {
        outputField.style.color = '#dc3545';
        outputField.style.fontWeight = '600';
        outputField.title = 'النتيجة صغيرة - تم عرضها بعدد أكبر من الأرقام العشرية';
    } else {
        outputField.style.color = '#495057';
        outputField.style.fontWeight = '500';
        outputField.style.fontStyle = 'normal';
        outputField.title = '';
    }
}

function getWeightMultiplier(unit) {
    const multipliers = {
        'mg': 0.001,
        'g': 1,
        'kg': 1000,
        't': 1000000,
        'oz': 28.3495,
        'lb': 453.592
    };
    return multipliers[unit] || 1;
}

function loadTemperatureConverter() {
    const content = document.getElementById('converterContent');
    if (!content) return;

    content.innerHTML = `
        <div class="converter-wrapper">
            <h3>محول درجة الحرارة</h3>
            <div class="converter-inputs">
                <div class="input-group">
                    <input type="number" id="tempInput" placeholder="أدخل القيمة" value="0">
                    <select id="tempFrom">
                        <option value="celsius" selected>مئوية (°C)</option>
                        <option value="fahrenheit">فهرنهايت (°F)</option>
                        <option value="kelvin">كلفن (K)</option>
                    </select>
                </div>
                <div class="converter-arrow">
                    <i class="fas fa-exchange-alt"></i>
                </div>
                <div class="input-group">
                    <input type="number" id="tempOutput" readonly>
                    <select id="tempTo">
                        <option value="celsius">مئوية (°C)</option>
                        <option value="fahrenheit" selected>فهرنهايت (°F)</option>
                        <option value="kelvin">كلفن (K)</option>
                    </select>
                </div>
            </div>
            <button onclick="convertTemperature()" class="btn btn-primary">تحويل</button>
        </div>
    `;

    // Add event listeners
    document.getElementById('tempInput').addEventListener('input', convertTemperature);
    document.getElementById('tempFrom').addEventListener('change', convertTemperature);
    document.getElementById('tempTo').addEventListener('change', convertTemperature);
}

function convertTemperature() {
    const input = parseFloat(document.getElementById('tempInput').value);
    const fromUnit = document.getElementById('tempFrom').value;
    const toUnit = document.getElementById('tempTo').value;

    if (isNaN(input)) return;

    // Convert to Celsius first
    let celsius;
    switch (fromUnit) {
        case 'celsius':
            celsius = input;
            break;
        case 'fahrenheit':
            celsius = (input - 32) * 5 / 9;
            break;
        case 'kelvin':
            celsius = input - 273.15;
            break;
    }

    // Convert from Celsius to target unit
    let result;
    switch (toUnit) {
        case 'celsius':
            result = celsius;
            break;
        case 'fahrenheit':
            result = celsius * 9 / 5 + 32;
            break;
        case 'kelvin':
            result = celsius + 273.15;
            break;
    }

    document.getElementById('tempOutput').value = result.toFixed(2);
}

function loadVolumeConverter() {
    const content = document.getElementById('converterContent');
    if (!content) return;

    content.innerHTML = `
        <div class="converter-wrapper">
            <h3>محول الحجم</h3>
            <div class="converter-inputs">
                <div class="input-group">
                    <input type="number" id="volumeInput" placeholder="أدخل القيمة" value="1">
                    <select id="volumeFrom">
                        <option value="ml">مليلتر (ml)</option>
                        <option value="l" selected>لتر (l)</option>
                        <option value="m3">متر مكعب (m³)</option>
                        <option value="cm3">سنتيمتر مكعب (cm³)</option>
                        <option value="gal">جالون (gal)</option>
                        <option value="qt">كوارت (qt)</option>
                    </select>
                </div>
                <div class="converter-arrow">
                    <i class="fas fa-exchange-alt"></i>
                </div>
                <div class="input-group">
                    <input type="number" id="volumeOutput" readonly>
                    <select id="volumeTo">
                        <option value="ml">مليلتر (ml)</option>
                        <option value="l">لتر (l)</option>
                        <option value="m3" selected>متر مكعب (m³)</option>
                        <option value="cm3">سنتيمتر مكعب (cm³)</option>
                        <option value="gal">جالون (gal)</option>
                        <option value="qt">كوارت (qt)</option>
                    </select>
                </div>
            </div>
            <button onclick="convertVolume()" class="btn btn-primary">تحويل</button>
        </div>
    `;

    // Add event listeners
    document.getElementById('volumeInput').addEventListener('input', convertVolume);
    document.getElementById('volumeFrom').addEventListener('change', convertVolume);
    document.getElementById('volumeTo').addEventListener('change', convertVolume);
}

function convertVolume() {
    const input = parseFloat(document.getElementById('volumeInput').value);
    const fromUnit = document.getElementById('volumeFrom').value;
    const toUnit = document.getElementById('volumeTo').value;

    if (isNaN(input)) return;

    // Convert to liters first
    let liters = input * getVolumeMultiplier(fromUnit);

    // Convert from liters to target unit
    let result = liters / getVolumeMultiplier(toUnit);

    // Format result based on its size for better readability
    let formattedResult;
    if (result < 0.000001) {
        // For very small numbers, use scientific notation
        formattedResult = result.toExponential(6);
    } else if (result < 0.001) {
        // For small numbers, show more decimal places
        formattedResult = result.toFixed(12);
    } else if (result < 1) {
        // For numbers less than 1, show more decimal places
        formattedResult = result.toFixed(8);
    } else if (result < 1000) {
        // For normal numbers, show reasonable decimal places
        formattedResult = result.toFixed(6);
    } else {
        // For large numbers, show fewer decimal places
        formattedResult = result.toFixed(2);
    }

    document.getElementById('volumeOutput').value = formattedResult;

    // Add visual feedback for very small numbers
    const outputField = document.getElementById('volumeOutput');
    if (result < 0.000001) {
        outputField.style.color = '#fd7e14';
        outputField.style.fontWeight = '600';
        outputField.style.fontStyle = 'italic';
        outputField.title = 'النتيجة صغيرة جداً - تم عرضها بالتدوين العلمي';
    } else if (result < 0.001) {
        outputField.style.color = '#dc3545';
        outputField.style.fontWeight = '600';
        outputField.title = 'النتيجة صغيرة - تم عرضها بعدد أكبر من الأرقام العشرية';
    } else {
        outputField.style.color = '#495057';
        outputField.style.fontWeight = '500';
        outputField.style.fontStyle = 'normal';
        outputField.title = '';
    }
}

function getVolumeMultiplier(unit) {
    const multipliers = {
        'ml': 0.001,
        'l': 1,
        'm3': 1000,
        'cm3': 0.001,
        'gal': 3.78541,
        'qt': 0.946353
    };
    return multipliers[unit] || 1;
}

function loadShapeCalculator(shapeType) {
    switch (shapeType) {
        case 'square':
            loadSquareCalculator();
            break;
        case 'rectangle':
            loadRectangleCalculator();
            break;
        case 'triangle':
            loadTriangleCalculator();
            break;
        case 'circle':
            loadCircleCalculator();
            break;
        case 'trapezoid':
            loadTrapezoidCalculator();
            break;
    }
}

function loadRectangleCalculator() {
    const content = document.getElementById('geometryContent');
    if (!content) return;

    content.innerHTML = `
        <div class="geometry-wrapper">
            <h3>حاسبة المستطيل</h3>
            <div class="geometry-inputs">
                <div class="input-group">
                    <label>الطول:</label>
                    <input type="number" id="rectLength" placeholder="أدخل الطول" value="6">
                    <select id="rectUnit">
                        <option value="cm">سنتيمتر (cm)</option>
                        <option value="m">متر (m)</option>
                        <option value="mm">مليمتر (mm)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>العرض:</label>
                    <input type="number" id="rectWidth" placeholder="أدخل العرض" value="4">
                    <select id="rectUnit2">
                        <option value="cm">سنتيمتر (cm)</option>
                        <option value="m">متر (m)</option>
                        <option value="mm">مليمتر (mm)</option>
                    </select>
                </div>
            </div>
            <button onclick="calculateRectangle()" class="btn btn-primary">احسب</button>
            <div class="geometry-results" id="rectangleResults"></div>
        </div>
    `;

    // Add event listeners
    document.getElementById('rectLength').addEventListener('input', calculateRectangle);
    document.getElementById('rectWidth').addEventListener('input', calculateRectangle);
}

function calculateRectangle() {
    const length = parseFloat(document.getElementById('rectLength').value);
    const width = parseFloat(document.getElementById('rectWidth').value);

    if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
        document.getElementById('rectangleResults').innerHTML = '<p class="error">أدخل قيم صحيحة للطول والعرض</p>';
        return;
    }

    const perimeter = 2 * (length + width);
    const area = length * width;
    const diagonal = Math.sqrt(length * length + width * width);

    const results = `
        <div class="result-item">
            <h4>نتائج الحساب:</h4>
            <p><strong>المحيط:</strong> ${perimeter} cm</p>
            <p><strong>المساحة:</strong> ${area} cm²</p>
            <p><strong>القطر:</strong> ${diagonal.toFixed(2)} cm</p>
        </div>
    `;

    document.getElementById('rectangleResults').innerHTML = results;
}

function loadTriangleCalculator() {
    const content = document.getElementById('geometryContent');
    if (!content) return;

    content.innerHTML = `
        <div class="geometry-wrapper">
            <h3>حاسبة المثلث</h3>
            <div class="geometry-inputs">
                <div class="input-group">
                    <label>القاعدة:</label>
                    <input type="number" id="triBase" placeholder="أدخل القاعدة" value="6">
                    <select id="triUnit">
                        <option value="cm">سنتيمتر (cm)</option>
                        <option value="m">متر (m)</option>
                        <option value="mm">مليمتر (mm)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>الارتفاع:</label>
                    <input type="number" id="triHeight" placeholder="أدخل الارتفاع" value="4">
                    <select id="triUnit2">
                        <option value="cm">سنتيمتر (cm)</option>
                        <option value="m">متر (m)</option>
                        <option value="mm">مليمتر (mm)</option>
                    </select>
                </div>
            </div>
            <button onclick="calculateTriangle()" class="btn btn-primary">احسب</button>
            <div class="geometry-results" id="triangleResults"></div>
        </div>
    `;

    // Add event listeners
    document.getElementById('triBase').addEventListener('input', calculateTriangle);
    document.getElementById('triHeight').addEventListener('input', calculateTriangle);
}

function calculateTriangle() {
    const base = parseFloat(document.getElementById('triBase').value);
    const height = parseFloat(document.getElementById('triHeight').value);

    if (isNaN(base) || isNaN(height) || base <= 0 || height <= 0) {
        document.getElementById('triangleResults').innerHTML = '<p class="error">أدخل قيم صحيحة للقاعدة والارتفاع</p>';
        return;
    }

    const area = 0.5 * base * height;
    const hypotenuse = Math.sqrt(base * base + height * height);

    const results = `
        <div class="result-item">
            <h4>نتائج الحساب:</h4>
            <p><strong>المساحة:</strong> ${area} cm²</p>
            <p><strong>الوتر:</strong> ${hypotenuse.toFixed(2)} cm</p>
        </div>
    `;

    document.getElementById('triangleResults').innerHTML = results;
}

function loadCircleCalculator() {
    const content = document.getElementById('geometryContent');
    if (!content) return;

    content.innerHTML = `
        <div class="geometry-wrapper">
            <h3>حاسبة الدائرة</h3>
            <div class="geometry-inputs">
                <div class="input-group">
                    <label>نصف القطر:</label>
                    <input type="number" id="circleRadius" placeholder="أدخل نصف القطر" value="5">
                    <select id="circleUnit">
                        <option value="cm">سنتيمتر (cm)</option>
                        <option value="m">متر (m)</option>
                        <option value="mm">مليمتر (mm)</option>
                    </select>
                </div>
            </div>
            <button onclick="calculateCircle()" class="btn btn-primary">احسب</button>
            <div class="geometry-results" id="circleResults"></div>
        </div>
    `;

    // Add event listeners
    document.getElementById('circleRadius').addEventListener('input', calculateCircle);
}

function calculateCircle() {
    const radius = parseFloat(document.getElementById('circleRadius').value);

    if (isNaN(radius) || radius <= 0) {
        document.getElementById('circleResults').innerHTML = '<p class="error">أدخل قيمة صحيحة لنصف القطر</p>';
        return;
    }

    const circumference = 2 * Math.PI * radius;
    const area = Math.PI * radius * radius;
    const diameter = 2 * radius;

    const results = `
        <div class="result-item">
            <h4>نتائج الحساب:</h4>
            <p><strong>المحيط:</strong> ${circumference.toFixed(2)} cm</p>
            <p><strong>المساحة:</strong> ${area.toFixed(2)} cm²</p>
            <p><strong>القطر:</strong> ${diameter} cm</p>
        </div>
    `;

    document.getElementById('circleResults').innerHTML = results;
}

function loadTrapezoidCalculator() {
    const content = document.getElementById('geometryContent');
    if (!content) return;

    content.innerHTML = `
        <div class="geometry-wrapper">
            <h3>حاسبة شبه المنحرف</h3>
            <div class="geometry-inputs">
                <div class="input-group">
                    <label>القاعدة الأولى:</label>
                    <input type="number" id="trapBase1" placeholder="أدخل القاعدة الأولى" value="8">
                    <select id="trapUnit">
                        <option value="cm">سنتيمتر (cm)</option>
                        <option value="m">متر (m)</option>
                        <option value="mm">مليمتر (mm)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>القاعدة الثانية:</label>
                    <input type="number" id="trapBase2" placeholder="أدخل القاعدة الثانية" value="4">
                    <select id="trapUnit2">
                        <option value="cm">سنتيمتر (cm)</option>
                        <option value="m">متر (m)</option>
                        <option value="mm">مليمتر (mm)</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>الارتفاع:</label>
                    <input type="number" id="trapHeight" placeholder="أدخل الارتفاع" value="5">
                    <select id="trapUnit3">
                        <option value="cm">سنتيمتر (cm)</option>
                        <option value="m">متر (m)</option>
                        <option value="mm">مليمتر (mm)</option>
                    </select>
                </div>
            </div>
            <button onclick="calculateTrapezoid()" class="btn btn-primary">احسب</button>
            <div class="geometry-results" id="trapezoidResults"></div>
        </div>
    `;

    // Add event listeners
    document.getElementById('trapBase1').addEventListener('input', calculateTrapezoid);
    document.getElementById('trapBase2').addEventListener('input', calculateTrapezoid);
    document.getElementById('trapHeight').addEventListener('input', calculateTrapezoid);
}

function calculateTrapezoid() {
    const base1 = parseFloat(document.getElementById('trapBase1').value);
    const base2 = parseFloat(document.getElementById('trapBase2').value);
    const height = parseFloat(document.getElementById('trapHeight').value);

    if (isNaN(base1) || isNaN(base2) || isNaN(height) || base1 <= 0 || base2 <= 0 || height <= 0) {
        document.getElementById('trapezoidResults').innerHTML = '<p class="error">أدخل قيم صحيحة لجميع الأبعاد</p>';
        return;
    }

    const area = 0.5 * (base1 + base2) * height;
    const perimeter = base1 + base2 + 2 * Math.sqrt(Math.pow((base1 - base2) / 2, 2) + height * height);

    const results = `
        <div class="result-item">
            <h4>نتائج الحساب:</h4>
            <p><strong>المساحة:</strong> ${area} cm²</p>
            <p><strong>المحيط:</strong> ${perimeter.toFixed(2)} cm</p>
        </div>
    `;

    document.getElementById('trapezoidResults').innerHTML = results;
}

// Solvers Management
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('solver-btn')) {
        const solverType = e.target.getAttribute('data-solver');
        loadSolver(solverType);

        document.querySelectorAll('.solver-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
    }
});

function loadSolver(type) {
    switch (type) {
        case 'pgcd': loadPGCDSolver(); break;
        case 'linear-system': loadLinearSystemSolver(); break;
        case 'fractions': loadFractionsSolver(); break;
        case 'pythagoras': loadPythagorasSolver(); break;
    }
}

// 1. PGCD Solver
function loadPGCDSolver() {
    const content = document.getElementById('solverContent');
    if (!content) return;
    content.innerHTML = `
        <div class="solver-wrapper">
             <h3>حاسبة القاسم المشترك الأكبر (PGCD)</h3>
             <div class="solver-inputs">
                <p>أدخل عددين صحيحين لحساب القاسم المشترك الأكبر:</p>
                <div class="input-group math-ltr">
                    <input type="number" id="pgcdA" placeholder="a" class="form-input">
                    <input type="number" id="pgcdB" placeholder="b" class="form-input">
                </div>
             </div>
             <button onclick="calculatePGCD()" class="btn btn-primary">احسب (Calculer)</button>
             <div id="pgcdResults" class="solver-results math-ltr"></div>
        </div>
    `;
}

function calculatePGCD() {
    let a = parseInt(document.getElementById('pgcdA').value);
    let b = parseInt(document.getElementById('pgcdB').value);

    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
        document.getElementById('pgcdResults').innerHTML = '<p class="error" style="direction:rtl; text-align:right">الرجاء إدخال أعداد صحيحة موجبة.</p>';
        return;
    }

    let steps = '<div class="steps-container"><h4>Algorithm Steps:</h4><ul>';
    let originalA = a, originalB = b;

    // Euclidean Algorithm
    while (b !== 0) {
        let remainder = a % b;
        // Format: Dividend = Divisor x Quotient + Remainder
        steps += `<li class="math-step">${a} = ${b} × ${Math.floor(a / b)} + ${remainder}</li>`;
        a = b;
        b = remainder;
    }

    steps += '</ul></div>';

    document.getElementById('pgcdResults').innerHTML = `
        <div class="result-box">
            <h4>Result:</h4>
            <p class="final-result">PGCD(${originalA}; ${originalB}) = ${a}</p>
            ${steps}
        </div>
    `;
}

// 2. Linear System Solver
function loadLinearSystemSolver() {
    const content = document.getElementById('solverContent');
    if (!content) return;
    content.innerHTML = `
        <div class="solver-wrapper">
             <h3>حل جملة معادلتين (Système d'équations)</h3>
             <p style="direction: ltr; text-align: center;">ax + by = c <br> dx + ey = f</p>
             <div class="solver-inputs system-inputs math-ltr">
                <div class="equation-row">
                    <input type="number" id="sysA" placeholder="a"> x + 
                    <input type="number" id="sysB" placeholder="b"> y = 
                    <input type="number" id="sysC" placeholder="c">
                </div>
                <div class="equation-row">
                    <input type="number" id="sysD" placeholder="d"> x + 
                    <input type="number" id="sysE" placeholder="e"> y = 
                    <input type="number" id="sysF" placeholder="f">
                </div>
             </div>
             <button onclick="calculateLinearSystem()" class="btn btn-primary">حل (Résoudre)</button>
             <div id="sysResults" class="solver-results math-ltr"></div>
        </div>
    `;
}

function calculateLinearSystem() {
    const a = parseFloat(document.getElementById('sysA').value);
    const b = parseFloat(document.getElementById('sysB').value);
    const c = parseFloat(document.getElementById('sysC').value);
    const d = parseFloat(document.getElementById('sysD').value);
    const e = parseFloat(document.getElementById('sysE').value);
    const f = parseFloat(document.getElementById('sysF').value);

    const det = a * e - b * d;

    let resultHTML = '';

    if (det === 0) {
        resultHTML = '<p class="error" style="direction:rtl; text-align:right">الجملة ليس لها حل وحيد (المحدد معدوم).</p>';
    } else {
        const x = (c * e - b * f) / det;
        const y = (a * f - c * d) / det;

        resultHTML = `
            <div class="result-box">
                <h4>Solution:</h4>
                <p class="final-result">x = ${x}</p>
                <p class="final-result">y = ${y}</p>
                <div class="steps-container">
                    <h4>Cramer's Rule:</h4>
                    <p>Δ = (${a})×(${e}) - (${b})×(${d}) = ${det}</p>
                    <p>Δx = (${c})×(${e}) - (${b})×(${f}) = ${c * e - b * f}</p>
                    <p>Δy = (${a})×(${f}) - (${c})×(${d}) = ${a * f - c * d}</p>
                    <p>x = Δx / Δ = ${x}</p>
                    <p>y = Δy / Δ = ${y}</p>
                </div>
            </div>
        `;
    }

    document.getElementById('sysResults').innerHTML = resultHTML;
}

// 3. Fraction Solver
function loadFractionsSolver() {
    const content = document.getElementById('solverContent');
    if (!content) return;
    content.innerHTML = `
        <div class="solver-wrapper">
             <h3>العمليات على الكسور (Fractions)</h3>
             <div class="solver-inputs fraction-inputs math-ltr">
                <div class="fraction-group">
                    <input type="number" id="frac1Num" placeholder="Num 1">
                    <hr>
                    <input type="number" id="frac1Den" placeholder="Den 1">
                </div>
                <select id="fracOp">
                    <option value="+">+</option>
                    <option value="-">−</option>
                    <option value="*">×</option>
                    <option value="/">÷</option>
                </select>
                <div class="fraction-group">
                    <input type="number" id="frac2Num" placeholder="Num 2">
                    <hr>
                    <input type="number" id="frac2Den" placeholder="Den 2">
                </div>
             </div>
             <button onclick="calculateFraction()" class="btn btn-primary">احسب (Calculer)</button>
             <div id="fracResults" class="solver-results math-ltr"></div>
        </div>
    `;
}

function getGCD(a, b) {
    return b === 0 ? a : getGCD(b, a % b);
}

function calculateFraction() {
    const n1 = parseInt(document.getElementById('frac1Num').value);
    const d1 = parseInt(document.getElementById('frac1Den').value);
    const op = document.getElementById('fracOp').value;
    const n2 = parseInt(document.getElementById('frac2Num').value);
    const d2 = parseInt(document.getElementById('frac2Den').value);

    if (d1 === 0 || d2 === 0) {
        document.getElementById('fracResults').innerHTML = '<p class="error" style="direction:rtl; text-align:right">المقام لا يمكن أن يكون صفراً.</p>';
        return;
    }

    let resN, resD, steps = '';

    switch (op) {
        case '+':
            resN = n1 * d2 + n2 * d1;
            resD = d1 * d2;
            steps = `<p>Steps: (${n1}×${d2} + ${n2}×${d1}) / (${d1}×${d2})</p>`;
            break;
        case '-':
            resN = n1 * d2 - n2 * d1;
            resD = d1 * d2;
            steps = `<p>Steps: (${n1}×${d2} - ${n2}×${d1}) / (${d1}×${d2})</p>`;
            break;
        case '*':
            resN = n1 * n2;
            resD = d1 * d2;
            steps = `<p>Steps: (${n1}×${n2}) / (${d1}×${d2})</p>`;
            break;
        case '/':
            resN = n1 * d2;
            resD = d1 * n2;
            steps = `<p>Steps: (${n1}/${d1}) × (${d2}/${n2})</p>`;
            break;
    }

    const common = getGCD(Math.abs(resN), Math.abs(resD));
    const simpleN = resN / common;
    const simpleD = resD / common;

    document.getElementById('fracResults').innerHTML = `
        <div class="result-box">
            <h4>Result:</h4>
            ${steps}
            <p>Initial: ${resN} / ${resD}</p>
            <p class="final-result">Simplified: <strong>${simpleN} / ${simpleD}</strong></p>
        </div>
    `;
}

// 4. Pythagoras Solver
function loadPythagorasSolver() {
    const content = document.getElementById('solverContent');
    if (!content) return;
    content.innerHTML = `
        <div class="solver-wrapper">
             <h3>فيثاغورس (Pythagore)</h3>
             <select id="pythType" onchange="updatePythInputs()">
                <option value="hypotenuse">حساب الوتر (Hypoténuse)</option>
                <option value="side">حساب ضلع قائم (Côté)</option>
             </select>
             <div class="solver-inputs math-ltr" id="pythInputs">
                 <!-- Injected by JS -->
             </div>
             <button onclick="calculatePythagoras()" class="btn btn-primary">احسب (Calculer)</button>
             <div id="pythResults" class="solver-results math-ltr"></div>
        </div>
    `;
    updatePythInputs();
}

function updatePythInputs() {
    const type = document.getElementById('pythType').value;
    const container = document.getElementById('pythInputs');
    if (type === 'hypotenuse') {
        container.innerHTML = `
            <input type="number" id="sideA" placeholder="A (Côté 1)" class="form-input">
            <input type="number" id="sideB" placeholder="B (Côté 2)" class="form-input">
        `;
    } else {
        container.innerHTML = `
            <input type="number" id="hyp" placeholder="H (Hypoténuse)" class="form-input">
            <input type="number" id="side" placeholder="A (Côté)" class="form-input">
        `;
    }
}

function calculatePythagoras() {
    const type = document.getElementById('pythType').value;
    let result = 0, steps = '';

    if (type === 'hypotenuse') {
        const a = parseFloat(document.getElementById('sideA').value);
        const b = parseFloat(document.getElementById('sideB').value);
        result = Math.sqrt(a * a + b * b);
        steps = `<p>H² = A² + B² = ${a}² + ${b}² = ${a * a + b * b}</p>`;
    } else {
        const h = parseFloat(document.getElementById('hyp').value);
        const s = parseFloat(document.getElementById('side').value);
        if (s >= h) {
            document.getElementById('pythResults').innerHTML = '<p class="error" style="direction:rtl; text-align:right">الوتر يجب أن يكون أطول من الضلع القائم.</p>';
            return;
        }
        result = Math.sqrt(h * h - s * s);
        steps = `<p>A² = H² - B² = ${h}² - ${s}² = ${h * h - s * s}</p>`;
    }

    document.getElementById('pythResults').innerHTML = `
        <div class="result-box">
            <h4>Result:</h4>
            ${steps}
            <p class="final-result">Length = ${result.toFixed(2)}</p>
        </div>
    `;
}
