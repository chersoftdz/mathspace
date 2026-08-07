/**
 * محرك الامتحان التوليدي - Generative Exam Engine
 * يقوم بتوليد أسئلة حسابية عشوائياً مع إجاباتها وخيارات خاطئة ذكية.
 */

window.ExamGenerator = {
    // المحاور المتوفرة
    Topics: {
        'equations': { id: 'equations', name: 'معادلات الدرجة الأولى', icon: '⚖️', color: 'text-blue-600 bg-blue-50 border-blue-200' },
        'fractions': { id: 'fractions', name: 'الكسور والحساب', icon: '⅟', color: 'text-amber-600 bg-amber-50 border-amber-200' },
        'arithmetic': { id: 'arithmetic', name: 'الحساب الذهني', icon: '⚡', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
    },

    // دالة لتوليد رقم عشوائي
    rand: function (min, max, exclude = []) {
        let num;
        do {
            num = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (exclude.includes(num));
        return num;
    },

    // خلط مصفوفة
    shuffle: function (array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    },

    generate: function (topic, difficulty, count) {
        const exam = [];
        for (let i = 0; i < count; i++) {
            let questionData;
            switch (topic) {
                case 'equations': questionData = this.generateEquation(difficulty); break;
                case 'fractions': questionData = this.generateFraction(difficulty); break;
                case 'arithmetic': questionData = this.generateArithmetic(difficulty); break;
                default: questionData = this.generateArithmetic(difficulty);
            }
            exam.push({ id: `q_${Date.now()}_${i}`, ...questionData });
        }
        return exam;
    },

    generateEquation: function (difficulty) {
        // Easy: x + a = b
        // Medium: ax + b = c
        // Hard: ax + b = cx + d

        let latex = "";
        let correctVal = 0;
        let options = [];

        if (difficulty === 'easy') {
            // x + a = b => x = b - a
            let a = this.rand(2, 20);
            let b = this.rand(a + 1, 50);
            correctVal = b - a;
            latex = `x + ${a} = ${b}`;
            options = [correctVal, correctVal + 1, correctVal - 1, correctVal + 10];
        }
        else if (difficulty === 'medium') {
            // a*x + b = c => ax = c - b => x = (c-b)/a. We ensure integer solution!
            let a = this.rand(2, 6);
            let x = this.rand(2, 12);
            let b = this.rand(2, 20);
            let c = a * x + b;
            correctVal = x;
            latex = `${a}x + ${b} = ${c}`;
            options = [correctVal, correctVal + 1, correctVal - 1, correctVal * 2];
        }
        else {
            // ax + b = cx + d => (a-c)x = d-b
            let a = this.rand(4, 10);
            let c = this.rand(2, a - 1);
            let x = this.rand(2, 10);
            let b = this.rand(2, 15);
            let d = (a - c) * x + b;
            correctVal = x;
            latex = `${a}x + ${b} = ${c}x + ${d}`;
            options = [correctVal, correctVal + 1, correctVal - 1, correctVal + 2];
        }

        // Generate choices format: x = val
        let formattedOptions = options.map(val => `x = ${val}`);
        let correctDisplay = `x = ${correctVal}`;
        return {
            latex: latex,
            options: this.shuffle(formattedOptions),
            correct: correctDisplay
        };
    },

    generateFraction: function (difficulty) {
        // Easy: Same denom -> a/c + b/c
        // Medium: Different denom, direct multiple -> a/2c + b/c

        let latex = "";
        let correctDisplay = "";
        let options = [];

        if (difficulty === 'easy') {
            let denom = this.rand(3, 9);
            let a = this.rand(1, denom * 2);
            let b = this.rand(1, denom * 2);
            let numSum = a + b;
            latex = `\\frac{${a}}{${denom}} + \\frac{${b}}{${denom}}`;
            correctDisplay = `\\frac{${numSum}}{${denom}}`;
            options = [
                correctDisplay,
                `\\frac{${numSum}}{${denom * 2}}`,
                `\\frac{${a * b}}{${denom}}`,
                `\\frac{${numSum + 1}}{${denom}}`
            ];
        } else {
            // Medium: a/d1 + b/d2 where d1 is multiple of d2
            let d2 = this.rand(2, 5);
            let mult = this.rand(2, 4);
            let d1 = d2 * mult; // e.g. 6 and 2
            let a = this.rand(1, 10);
            let b = this.rand(1, 10);
            let numSum = a + (b * mult);
            latex = `\\frac{${a}}{${d1}} + \\frac{${b}}{${d2}}`;
            correctDisplay = `\\frac{${numSum}}{${d1}}`;
            options = [
                correctDisplay,
                `\\frac{${a + b}}{${d1 + d2}}`, // Comman student mistake
                `\\frac{${numSum}}{${d2}}`,
                `\\frac{${a + b}}{${d1}}`
            ];
        }

        return {
            latex: latex,
            options: this.shuffle([...new Set(options)]), // Ensure unique
            correct: correctDisplay
        };
    },

    generateArithmetic: function (difficulty) {
        let latex = "";
        let correctVal = 0;
        let options = [];

        if (difficulty === 'easy') {
            let a = this.rand(10, 99);
            let b = this.rand(10, 99);
            let op = this.rand(0, 1) === 0 ? '+' : '-';
            correctVal = op === '+' ? a + b : a - b;
            latex = `${a} ${op} ${b}`;
            options = [correctVal, correctVal + 10, correctVal - 10, correctVal + 1];
        } else {
            let a = this.rand(11, 99);
            let b = this.rand(2, 9);
            let op = this.rand(0, 1) === 0 ? '\\times' : '\\div';
            if (op === '\\div') {
                let r = a * b;
                latex = `${r} \\div ${b}`;
                correctVal = a;
            } else {
                correctVal = a * b;
                latex = `${a} \\times ${b}`;
            }
            options = [correctVal, correctVal + 10, correctVal - 1, correctVal + 2];
        }

        let formattedOptions = options.map(val => `${val}`);
        return {
            latex: latex,
            options: this.shuffle(formattedOptions),
            correct: `${correctVal}`
        };
    }
};
