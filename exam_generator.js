/**
 * محرك الامتحان التوليدي - Generative Exam Engine
 * يقوم بتوليد أسئلة حسابية عشوائياً مع إجاباتها وخيارات خاطئة ذكية.
 */

window.ExamGenerator = {
    // المحاور المتوفرة
    Topics: {
        'arithmetic': { id: 'arithmetic', name: 'الحساب الذهني', icon: '⚡', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
        'equations': { id: 'equations', name: 'معادلات الدرجة الأولى', icon: '⚖️', color: 'text-blue-600 bg-blue-50 border-blue-200' },
        'fractions': { id: 'fractions', name: 'الكسور والحساب', icon: '⅟', color: 'text-amber-600 bg-amber-50 border-amber-200' },
        'integers': { id: 'integers', name: 'الأعداد الصحيحة النسبية', icon: '±', color: 'text-violet-600 bg-violet-50 border-violet-200' },
        'proportions': { id: 'proportions', name: 'النسبة والتناسب', icon: '📐', color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
        'geometry': { id: 'geometry', name: 'المحيط والمساحة', icon: '📏', color: 'text-pink-600 bg-pink-50 border-pink-200' },
        'powers': { id: 'powers', name: 'القوى والأسس', icon: 'xⁿ', color: 'text-orange-600 bg-orange-50 border-orange-200' },
        'sqrt': { id: 'sqrt', name: 'الجذر التربيعي', icon: '√', color: 'text-teal-600 bg-teal-50 border-teal-200' },
        'percentages': { id: 'percentages', name: 'النسبة المئوية', icon: '%', color: 'text-rose-600 bg-rose-50 border-rose-200' },
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
                case 'integers': questionData = this.generateIntegers(difficulty); break;
                case 'proportions': questionData = this.generateProportions(difficulty); break;
                case 'geometry': questionData = this.generateGeometry(difficulty); break;
                case 'powers': questionData = this.generatePowers(difficulty); break;
                case 'sqrt': questionData = this.generateSqrt(difficulty); break;
                case 'percentages': questionData = this.generatePercentages(difficulty); break;
                default: questionData = this.generateArithmetic(difficulty);
            }
            exam.push({ id: `q_${Date.now()}_${i}`, ...questionData });
        }
        return exam;
    },

    generateEquation: function (difficulty) {
        let latex = "";
        let correctVal = 0;
        let options = [];

        if (difficulty === 'easy') {
            // تنويع الأشكال: x+a=b, a+x=b, x-a=b, a-x=b, ax=b
            let form = this.rand(1, 5);
            if (form <= 2) {
                // الجمع: x + a = b أو a + x = b
                let a = this.rand(2, 20);
                let b = this.rand(a + 1, 50);
                correctVal = b - a;
                latex = form === 1 ? `x + ${a} = ${b}` : `${a} + x = ${b}`;
            } else if (form === 3) {
                // الطرح: x - a = b
                let a = this.rand(2, 20);
                let b = this.rand(2, 30);
                correctVal = b + a;
                latex = `x - ${a} = ${b}`;
            } else if (form === 4) {
                // الطرح المعكوس: a - x = b
                let b = this.rand(2, 20);
                let a = this.rand(b + 1, 50);
                correctVal = a - b;
                latex = `${a} - x = ${b}`;
            } else {
                // الضرب البسيط: a * x = b
                let a = this.rand(2, 12);
                let x = this.rand(2, 12);
                correctVal = x;
                let b = a * x;
                latex = `${a}x = ${b}`;
            }
            options = [correctVal, correctVal + 1, correctVal - 1, correctVal + 2];
        }
        else if (difficulty === 'medium') {
            // تنويع الأشكال: ax+b=c, ax-b=c, b-ax=c, a(x+b)=c
            let form = this.rand(1, 4);
            let a = this.rand(2, 9);
            let x = this.rand(2, 15);
            let b = this.rand(2, 20);

            correctVal = x;
            if (form === 1) {
                let c = a * x + b;
                latex = `${a}x + ${b} = ${c}`;
            } else if (form === 2) {
                let c = a * x - b;
                latex = `${a}x - ${b} = ${c}`;
            } else if (form === 3) {
                let c = b - a * x;
                latex = `${b} - ${a}x = ${c}`;
            } else {
                // a(x + b) = c
                let c = a * (x + b);
                latex = `${a}(x + ${b}) = ${c}`;
            }
            options = [correctVal, correctVal + 1, correctVal - 1, correctVal * 2];
        }
        else {
            // تنويع الصعب: ax+b=cx+d, ax-d=cx-b, a(x+b)=cx+d
            let form = this.rand(1, 4);
            let x = this.rand(2, 12);
            correctVal = x;
            if (form <= 2) {
                // ax + b = cx + d
                let a = this.rand(4, 10);
                let c = this.rand(2, a - 1);
                let b = this.rand(2, 15);
                let d = (a - c) * x + b;
                latex = form === 1 ? `${a}x + ${b} = ${c}x + ${d}` : `${a}x - ${d} = ${c}x - ${b}`;
            } else if (form === 3) {
                // a(x + b) = cx + d
                let a = this.rand(2, 5);
                let b = this.rand(2, 8);
                let c = this.rand(6, 12);
                let d = (a - c) * x + (a * b);
                latex = `${a}(x + ${b}) = ${c}x + ${d}`;
            } else {
                // ax = cx + d
                let a = this.rand(5, 10);
                let c = this.rand(2, a - 1);
                let d = (a - c) * x;
                latex = `${a}x = ${c}x + ${d}`;
            }
            options = [correctVal, correctVal + 1, correctVal - 1, correctVal + 2];
        }

        let o = new Set();
        o.add(correctVal);
        while (o.size < 4) {
            let offset = this.rand(-5, 5, [0]);
            let newVal = correctVal + offset;
            if (newVal > 0) o.add(newVal);
            // Avoid infinite loop if possible numbers are small, though -5 to 5 with positive check is safe enough
        }

        let formattedOptions = Array.from(o).map(val => `x = ${val}`);

        return {
            latex: latex,
            options: this.shuffle(formattedOptions),
            correct: `x = ${correctVal}`
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
    },

    // ===== الأعداد الصحيحة النسبية =====
    generateIntegers: function (difficulty) {
        const a = this.rand(-20, 20, [0]);
        const b = this.rand(-20, 20, [0]);
        const ops = ['+', '-', '\\times'];
        let op, correctVal, latex;
        if (difficulty === 'easy') {
            op = ops[this.rand(0, 1)];
            correctVal = op === '+' ? a + b : a - b;
            latex = `(${a}) ${op} (${b})`;
        } else {
            op = '\\times';
            correctVal = a * b;
            latex = `(${a}) \\times (${b})`;
        }
        const opts = new Set([correctVal]);
        while (opts.size < 4) opts.add(correctVal + this.rand(-5, 5, [0]));
        return {
            latex,
            options: this.shuffle(Array.from(opts).map(v => `${v}`)),
            correct: `${correctVal}`
        };
    },

    // ===== النسبة والتناسب =====
    generateProportions: function (difficulty) {
        // a/b = ?/d  =>  ? = a*d/b
        const b = this.rand(2, 8);
        const d = b * this.rand(2, 5);
        const a = this.rand(1, 10);
        const correctVal = a * (d / b);
        const latex = `\\frac{${a}}{${b}} = \\frac{?}{${d}}`;
        const opts = new Set([correctVal]);
        while (opts.size < 4) opts.add(correctVal + this.rand(-5, 5, [0]));
        return {
            latex,
            options: this.shuffle(Array.from(opts).map(v => `${v}`)),
            correct: `${correctVal}`
        };
    },

    // ===== المحيط والمساحة =====
    generateGeometry: function (difficulty) {
        const shapes = [
            { name: 'مربع', fn: (a, b) => { const p = 2 * (a + b), s = a * b; return { p, s, latex: `مستطيل \ (${a} \\times ${b})`, question: difficulty === 'easy' ? `محيط مستطيل \ (${a} \\times ${b})` : `مساحة مستطيل \ (${a} \\times ${b})`, correct: difficulty === 'easy' ? p : s }; } },
            { name: 'مربع', fn: (a) => { const p = 4 * a, s = a * a; return { p, s, latex: `مربع \ (${a})`, question: difficulty === 'easy' ? `محيط مربع \ (${a})` : `مساحة مربع \ (${a})`, correct: difficulty === 'easy' ? p : s }; } }
        ];
        const a = this.rand(2, 15);
        const b = this.rand(2, 15);
        const shape = this.rand(0, 1);
        const res = shape === 0 ? shapes[0].fn(a, b) : shapes[1].fn(a);
        const correctVal = res.correct;
        const opts = new Set([correctVal]);
        while (opts.size < 4) opts.add(correctVal + this.rand(-8, 8, [0]));
        return {
            latex: res.question,
            options: this.shuffle(Array.from(opts).map(v => `${v}`)),
            correct: `${correctVal}`
        };
    },

    // ===== القوى والأسس =====
    generatePowers: function (difficulty) {
        if (difficulty === 'easy') {
            const base = this.rand(2, 9);
            const exp = this.rand(2, 4);
            const correctVal = Math.pow(base, exp);
            const latex = `${base}^{${exp}}`;
            const opts = new Set([correctVal]);
            while (opts.size < 4) opts.add(correctVal + this.rand(-20, 20, [0]));
            return { latex, options: this.shuffle(Array.from(opts).map(v => `${v}`)), correct: `${correctVal}` };
        } else {
            // a^m * a^n = a^(m+n)
            const base = this.rand(2, 5);
            const m = this.rand(1, 4);
            const n = this.rand(1, 4);
            const correctExp = m + n;
            const latex = `${base}^{${m}} \\times ${base}^{${n}} = ${base}^{?}`;
            const opts = new Set([correctExp]);
            while (opts.size < 4) opts.add(correctExp + this.rand(-3, 3, [0]));
            return { latex, options: this.shuffle(Array.from(opts).map(v => `${v}`)), correct: `${correctExp}` };
        }
    },

    // ===== الجذر التربيعي =====
    generateSqrt: function (difficulty) {
        const perfectSquares = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
        if (difficulty === 'easy') {
            const idx = this.rand(0, 9);
            const n = perfectSquares[idx];
            const correctVal = Math.sqrt(n);
            const latex = `\\sqrt{${n}}`;
            const opts = new Set([correctVal]);
            while (opts.size < 4) opts.add(correctVal + this.rand(-3, 5, [0]));
            return { latex, options: this.shuffle(Array.from(opts).map(v => `${v}`)), correct: `${correctVal}` };
        } else {
            // sqrt(a) * sqrt(b) = sqrt(a*b)
            const a = perfectSquares[this.rand(1, 6)];
            const b = perfectSquares[this.rand(1, 6)];
            const correctVal = Math.sqrt(a * b);
            const latex = `\\sqrt{${a}} \\times \\sqrt{${b}}`;
            const opts = new Set([correctVal]);
            while (opts.size < 4) opts.add(correctVal + this.rand(-4, 4, [0]));
            return { latex, options: this.shuffle(Array.from(opts).map(v => `${v}`)), correct: `${correctVal}` };
        }
    },

    // ===== النسبة المئوية =====
    generatePercentages: function (difficulty) {
        if (difficulty === 'easy') {
            // p% of N
            const percents = [10, 20, 25, 50, 75];
            const p = percents[this.rand(0, percents.length - 1)];
            const N = this.rand(2, 20) * 10;
            const correctVal = (p * N) / 100;
            const latex = `${p}\\% \ \\text{من} \ ${N}`;
            const opts = new Set([correctVal]);
            while (opts.size < 4) opts.add(correctVal + this.rand(-10, 10, [0]));
            return { latex, options: this.shuffle(Array.from(opts).map(v => `${v}`)), correct: `${correctVal}` };
        } else {
            // تحويل كسر إلى نسبة مئوية
            const num = this.rand(1, 9);
            const dens = [4, 5, 8, 10, 20, 25];
            const den = dens[this.rand(0, dens.length - 1)];
            const correctVal = Math.round((num / den) * 100);
            const latex = `\\frac{${num}}{${den}} = \ ?\\%`;
            const opts = new Set([correctVal]);
            while (opts.size < 4) opts.add(correctVal + this.rand(-10, 10, [0]));
            return { latex, options: this.shuffle(Array.from(opts).map(v => `${v}%`)), correct: `${correctVal}%` };
        }
    }
};
