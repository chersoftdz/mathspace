// ملف الألعاب التعليمية للمنصة

// --- المتغيرات العامة --- //
let gameController;

const MazeMathTopics = {
    // 1. القوى ذات أسس صحيحة (موجبة وسالبة)
    'integerPowers': {
        getQuestion: () => {
            let base = Math.floor(Math.random() * 4) + 2; // 2 to 5
            let p1 = Math.floor(Math.random() * 11) - 5; // -5 to 5
            let p2 = Math.floor(Math.random() * 11) - 5;

            if (p1 === 0) p1 = 2;
            if (p2 === 0) p2 = -2;

            let question = `${base}<sup>${p1}</sup> × ${base}<sup>${p2}</sup>`;
            let correctExp = p1 + p2;
            let display = `${base}<sup>${correctExp}</sup>`;

            return { html: question, display: display, raw: correctExp, base: base };
        },
        getWrong: (correctRaw, context) => {
            let wrongExp = correctRaw + (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
            if (wrongExp === correctRaw) wrongExp += 1;
            return `${context.base}<sup>${wrongExp}</sup>`;
        }
    },

    // 2. سلسلة عمليات بدون أقواس (أولوية الضرب)
    'opsNoBrackets': {
        getQuestion: () => {
            let a = Math.floor(Math.random() * 9) + 2;
            let b = Math.floor(Math.random() * 5) + 2;
            let c = Math.floor(Math.random() * 5) + 2;
            let isPlus = Math.random() > 0.5;

            let symbol1 = isPlus ? '+' : '-';
            let question = `${a} ${symbol1} ${b} × ${c}`;
            let correctVal = isPlus ? a + (b * c) : a - (b * c);

            return { html: question, display: correctVal, raw: correctVal, wrongContext: { a, b, c, isPlus } };
        },
        getWrong: (correctRaw, ctx) => {
            let wrongVal = ctx.isPlus ? (ctx.a + ctx.b) * ctx.c : (ctx.a - ctx.b) * ctx.c;
            if (wrongVal === correctRaw) wrongVal = correctRaw + Math.floor(Math.random() * 4) + 2;
            return wrongVal;
        }
    },

    // 3. سلسلة عمليات بأقواس (أولوية الأقواس)
    'opsWithBrackets': {
        getQuestion: () => {
            let a = Math.floor(Math.random() * 9) + 2;
            let b = Math.floor(Math.random() * 5) + 2;
            let c = Math.floor(Math.random() * 4) + 2;
            let isPlus = Math.random() > 0.5;

            let symbol1 = isPlus ? '+' : '-';
            if (!isPlus && a < b) [a, b] = [b, a];

            let question = `(${a} ${symbol1} ${b}) × ${c}`;
            let correctVal = isPlus ? (a + b) * c : (a - b) * c;

            return { html: question, display: correctVal, raw: correctVal, wrongContext: { a, b, c, isPlus } };
        },
        getWrong: (correctRaw, ctx) => {
            let wrongVal = ctx.isPlus ? ctx.a + (ctx.b * ctx.c) : ctx.a - (ctx.b * ctx.c);
            if (wrongVal === correctRaw) wrongVal = correctRaw - Math.floor(Math.random() * 4) + 2;
            return wrongVal;
        }
    },

    // --- المواضيع القديمة ---
    'powers10': {
        getQuestion: () => {
            const op = Math.random() > 0.5 ? 'mul' : 'div';
            if (op === 'mul') {
                let a = Math.floor(Math.random() * 4) + 2;
                let b = Math.floor(Math.random() * 4) + 2;
                return { html: `10<sup>${a}</sup> × 10<sup>${b}</sup>`, display: `10<sup>${a + b}</sup>`, raw: a + b, base: 10 };
            } else {
                let a = Math.floor(Math.random() * 4) + 5;
                let b = Math.floor(Math.random() * 3) + 2;
                return { html: `10<sup>${a}</sup> ÷ 10<sup>${b}</sup>`, display: `10<sup>${a - b}</sup>`, raw: a - b, base: 10 };
            }
        },
        getWrong: (correctRaw, ctx) => {
            let wrong = correctRaw + Math.floor(Math.random() * 3) + 1;
            return `10<sup>${wrong}</sup>`;
        }
    },
    'multiplication': {
        getQuestion: () => {
            let a = Math.floor(Math.random() * 7) + 3;
            let b = Math.floor(Math.random() * 6) + 4;
            return { html: `${a} × ${b}`, display: a * b, raw: a * b };
        },
        getWrong: (correctRaw) => correctRaw + (Math.floor(Math.random() * 4) + 2) * (Math.random() < 0.5 ? 1 : -1)
    },
    'simpleMath': {
        getQuestion: () => {
            let isAdd = Math.random() > 0.5;
            let a = Math.floor(Math.random() * 46) + 15;
            let b = Math.floor(Math.random() * 16) + 5;
            if (isAdd) return { html: `${a} + ${b}`, display: a + b, raw: a + b };
            else return { html: `${a} - ${b}`, display: a - b, raw: a - b };
        },
        getWrong: (correctRaw) => correctRaw + Math.floor(Math.random() * 9) - 4 || correctRaw + 1
    },
    'roots': {
        getQuestion: () => {
            let roots = [16, 25, 36, 49, 64, 81, 100, 121, 144];
            let r = roots[Math.floor(Math.random() * roots.length)];
            return { html: `√${r}`, display: Math.sqrt(r), raw: Math.sqrt(r) };
        },
        getWrong: (correctRaw) => correctRaw + Math.floor(Math.random() * 3) + 1
    },
    'algebra': {
        getQuestion: () => {
            let x = Math.floor(Math.random() * 8) + 2;
            let a = Math.floor(Math.random() * 9) + 2;
            let b = x + a;
            return { html: `x + ${a} = ${b}`, display: `x = ${x}`, raw: x };
        },
        getWrong: (correctRaw) => `x = ${correctRaw + Math.floor(Math.random() * 3) + 1}`
    },
    'integers': {
        getQuestion: () => {
            let a = Math.floor(Math.random() * 19) - 9;
            let b = Math.floor(Math.random() * 19) - 9;
            if (b === 0) b = 1;
            return { html: `${a} - (${b})`, display: a - b, raw: a - b };
        },
        getWrong: (correctRaw) => correctRaw * -1
    },
    'fractions': {
        getQuestion: () => {
            let den = Math.floor(Math.random() * 8) + 2;
            let n1 = Math.floor(Math.random() * (den * 2)) + 1;
            let n2 = Math.floor(Math.random() * den) + 1;
            return { html: `${n1}/${den} + ${n2}/${den}`, display: `${n1 + n2}/${den}`, raw: 0 };
        },
        getWrong: (correctRaw) => "Err"
    },
    'pgcd': {
        getQuestion: () => {
            let a = Math.floor(Math.random() * 31) + 10;
            let b = Math.floor(Math.random() * 31) + 10;
            const findGCD = (x, y) => { x = Math.abs(x); y = Math.abs(y); while (y) { [x, y] = [y, x % y]; } return x; };
            let res = findGCD(a, b);
            if (res === 1) { a = 12; b = 18; res = 6; }
            return { html: `PGCD(${a}; ${b})`, display: res, raw: res };
        },
        getWrong: (correctRaw) => correctRaw + Math.floor(Math.random() * 2) + 1
    },
    'expandSimplify': {
        getQuestion: () => {
            let a = Math.floor(Math.random() * 4) + 2;
            let b = Math.floor(Math.random() * 3) + 2;
            return { html: `${a}(x + ${b})`, display: `${a}x + ${a * b}`, raw: 0 };
        },
        getWrong: () => `${Math.floor(Math.random() * 4) + 2}x + ${Math.floor(Math.random() * 9) + 2}`
    }
};

// --- إدارة النقاط --- //
class ScoreManager {
    constructor() {
        this.scoreKey = 'math_games_score';
        this.leaderboardKey = 'math_games_leaderboard';
    }

    saveScore(score, game) {
        this.updateLeaderboard(score, game);
    }

    updateLeaderboard(score, game) {
        let leaderboard = this.loadLeaderboard();
        const newEntry = {
            score: score,
            date: new Date().toISOString(),
            game: game || 'لعبة رياضيات'
        };

        leaderboard.push(newEntry);
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10);

        localStorage.setItem(this.leaderboardKey, JSON.stringify(leaderboard));
        this.displayLeaderboard();
    }

    loadLeaderboard() {
        const saved = localStorage.getItem(this.leaderboardKey);
        return saved ? JSON.parse(saved) : [];
    }

    displayLeaderboard() {
        const leaderboardElement = document.getElementById('leaderboard');
        if (!leaderboardElement) return;

        const leaderboard = this.loadLeaderboard();

        if (leaderboard.length === 0) {
            leaderboardElement.innerHTML = '<p>لا توجد نتائج بعد.</p>';
            return;
        }

        leaderboardElement.innerHTML = leaderboard.map((entry, index) => {
            const date = new Date(entry.date).toLocaleDateString('ar-SA');
            return `
                <div class="leaderboard-item">
                    <div class="rank">${index + 1}</div>
                    <div class="score">${entry.score} نقطة</div>
                    <div class="date">${date}</div>
                    <div class="game">${entry.game}</div>
                </div>
            `;
        }).join('');
    }
}

// --- إدارة الألعاب --- //
class GameController {
    constructor() {
        this.scoreManager = new ScoreManager();
        this.currentGame = null;
        this.gameTimer = null;
        this.gameInterval = null;

        // نظام المستويات
        this.currentLevel = 1;
        this.maxLevel = 5;
        this.levelProgress = this.loadLevelProgress();

        // Memory Game State
        this.memoryCards = [];
        this.memoryFlippedCards = [];
        this.memoryMatchedPairs = 0;
        this.memoryScore = 0;
        this.memoryIsChecking = false;
    }

    // إدارة المستويات
    loadLevelProgress() {
        const saved = localStorage.getItem('gameLevelProgress');
        return saved ? JSON.parse(saved) : {};
    }

    saveLevelProgress() {
        localStorage.setItem('gameLevelProgress', JSON.stringify(this.levelProgress));
    }

    getCurrentLevel(gameType) {
        return this.levelProgress[gameType] || 1;
    }

    increaseLevel(gameType) {
        if (!this.levelProgress[gameType]) {
            this.levelProgress[gameType] = 1;
        }

        if (this.levelProgress[gameType] < this.maxLevel) {
            this.levelProgress[gameType]++;
            this.saveLevelProgress();
            return this.levelProgress[gameType];
        }
        return this.levelProgress[gameType];
    }

    getDifficultyMultiplier(gameType) {
        const level = this.getCurrentLevel(gameType);
        return 1 + (level - 1) * 0.3; // زيادة الصعوبة بنسبة 30% لكل مستوى
    }

    // عرض رسالة المستوى الجديد
    showLevelUpMessage(newLevel) {
        const gameContent = document.getElementById('gameContent');
        const levelUpDiv = document.createElement('div');
        levelUpDiv.className = 'level-up-message';
        levelUpDiv.innerHTML = `
            <div class="level-up-content">
                <h3>🎉 مبروك! لقد وصلت للمستوى ${newLevel}!</h3>
                <p>ستجد اللعبة أكثر تحدياً الآن</p>
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">متابعة</button>
            </div>
        `;
        gameContent.appendChild(levelUpDiv);
    }

    // --- التحكم العام باللعبة --- //
    generateNewGame(gameType) {
        console.log(`Generating new game: ${gameType}`);
        this.currentGame = gameType;

        // إنشاء لعبة جديدة حسب النوع
        switch (gameType) {
            case 'الحساب السريع': this.generateQuickMathQuestion(); break;
            case 'ترتيب الأعداد': this.generateNumberSortQuestion(); break;
            case 'لعبة الذاكرة': this.generateMemoryGame(); break;
            case 'إكمال النمط': this.generatePatternGame(); break;
            case 'تخمين العدد': this.generateGuessTheNumberGame(); break;
            case 'تحدي العمليات': this.generateOperationsChallengeGame(); break;
            case 'موازنة المعادلات': this.generateBalancingEquationGame(); break;
            case 'المسائل الكلامية': this.generateWordProblemGame(); break;
            case 'مسائل معقدة': this.generateComplexProblemGame(); break;
            case 'تدريب جدول الضرب': this.generateMultiplicationGridGame(); break;
            case 'مساحة ومحيط': this.generateGeometryAreaPerimeterGame(); break;
            case 'لعبة الكسور': this.generateFractionsGame(); break;
            case 'لعبة قراءة الساعة': this.generateTimeGame(); break;
            case 'السودوكو': this.generateSudokuGame(); break;
            case 'المربعات السحرية': this.generateMagicSquareGame(); break;
            case 'لعبة المتاهة': this.generateMazeGame(); break;
        }
    }

    startGame(gameType) {
        console.log(`Starting game: ${gameType}`); // تتبع بدء اللعبة
        this.currentGame = gameType;
        this.showGameArea();

        switch (gameType) {
            case 'الحساب السريع': this.generateQuickMathQuestion(); break;
            case 'ترتيب الأعداد': this.generateNumberSortQuestion(); break;
            case 'لعبة الذاكرة': this.generateMemoryGame(); break;
            case 'إكمال النمط': this.generatePatternGame(); break;
            case 'تخمين العدد': this.generateGuessTheNumberGame(); break;
            case 'تحدي العمليات': this.generateOperationsChallengeGame(); break;
            case 'موازنة المعادلات': this.generateBalancingEquationGame(); break;
            case 'المسائل الكلامية': this.generateWordProblemGame(); break;
            case 'مسائل معقدة': this.generateComplexProblemGame(); break;
            case 'تدريب جدول الضرب': this.generateMultiplicationGridGame(); break;
            case 'مساحة ومحيط': this.generateGeometryAreaPerimeterGame(); break;
            case 'لعبة الكسور': this.generateFractionsGame(); break;
            case 'لعبة قراءة الساعة': this.generateTimeGame(); break;
            case 'السودوكو': this.generateSudokuGame(); break;
            case 'المربعات السحرية': this.generateMagicSquareGame(); break;
            case 'لعبة المتاهة': this.generateMazeGame(); break;
        }
    }

    showGameArea() {
        document.getElementById('gameArea').style.display = 'block';
        document.getElementById('scoreDisplay').style.display = 'block';
        document.querySelector('.game-section').style.display = 'none';
        document.getElementById('gameTitle').textContent = this.currentGame;
        document.getElementById('gameContent').innerHTML = ''; // Clear previous game
    }

    hideGameArea() {
        document.getElementById('gameArea').style.display = 'none';
        document.getElementById('scoreDisplay').style.display = 'none';
        document.querySelector('.game-section').style.display = 'block';
    }

    endGame(isWin, score) {
        this.scoreManager.saveScore(score, this.currentGame);
        this.showGameResult(`أحسنت! لقد أنهيت اللعبة بنتيجة ${score} نقطة.`, isWin);
    }

    showGameResult(message, isSuccess) {
        const gameContent = document.getElementById('gameContent');
        const currentGame = this.currentGame; // حفظ اللعبة الحالية

        gameContent.innerHTML = `
            <div class="game-result ${isSuccess ? 'success' : 'error'}">
                <h3>${message}</h3>
                <div class="result-buttons">
                    <button class="btn btn-primary" id="restartGameBtn">إعادة اللعب</button>
                    <button class="btn btn-secondary" id="backToMenuBtn">العودة للقائمة</button>
                </div>
            </div>
        `;

        // ربط الأحداث بعد إنشاء العناصر
        const restartBtn = document.getElementById('restartGameBtn');
        const backBtn = document.getElementById('backToMenuBtn');

        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                if (currentGame) {
                    // إنشاء لعبة جديدة بدلاً من إعادة تشغيل نفس اللعبة
                    this.generateNewGame(currentGame);
                } else {
                    console.error('لا توجد لعبة حالية لإعادة تشغيلها');
                }
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.hideGameArea();
            });
        }
    }

    // --- لعبة الذاكرة (Memory Game) --- //
    generateMemoryGame() {
        const pairs = [];
        const usedPairs = new Set();
        while (pairs.length < 8) {
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            const question = `${num1} + ${num2}`;
            const answer = num1 + num2;
            if (!usedPairs.has(question)) {
                pairs.push({ question, answer: answer.toString() });
                usedPairs.add(question);
            }
        }

        this.memoryCards = [];
        pairs.forEach(pair => {
            this.memoryCards.push({ type: 'question', value: formatTextWithMath(pair.question), pairId: pair.question });
            this.memoryCards.push({ type: 'answer', value: formatTextWithMath(pair.answer), pairId: pair.question });
        });

        for (let i = this.memoryCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.memoryCards[i], this.memoryCards[j]] = [this.memoryCards[j], this.memoryCards[i]];
        }

        this.memoryFlippedCards = [];
        this.memoryMatchedPairs = 0;
        this.memoryScore = 0;
        this.memoryIsChecking = false;

        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="memory-game">
                <h3>طابق بين المسألة ونتيجتها!</h3>
                <div class="memory-grid"></div>
                <div class="memory-stats">
                    <span>النقاط: <span id="memoryScore">0</span></span>
                </div>
            </div>
        `;

        const memoryGrid = gameContent.querySelector('.memory-grid');
        this.memoryCards.forEach((cardData, index) => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.index = index;

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-front');
            cardFront.textContent = '?';

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-back');
            cardBack.textContent = cardData.value;

            card.appendChild(cardFront);
            card.appendChild(cardBack);

            card.addEventListener('click', () => this.flipMemoryCard(card));
            memoryGrid.appendChild(card);
        });
    }

    flipMemoryCard(card) {
        if (this.memoryIsChecking || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        card.classList.add('flipped');
        this.memoryFlippedCards.push(card);

        if (this.memoryFlippedCards.length === 2) {
            this.memoryIsChecking = true;
            setTimeout(() => this.checkMemoryMatch(), 1000);
        }
    }

    checkMemoryMatch() {
        const [card1, card2] = this.memoryFlippedCards;
        const data1 = this.memoryCards[card1.dataset.index];
        const data2 = this.memoryCards[card2.dataset.index];

        if (data1.pairId === data2.pairId && data1.type !== data2.type) {
            this.memoryScore += 15;
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.memoryMatchedPairs++;
        } else {
            this.memoryScore = Math.max(0, this.memoryScore - 2);
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }

        document.getElementById('memoryScore').textContent = this.memoryScore;
        this.memoryFlippedCards = [];
        this.memoryIsChecking = false;

        if (this.memoryMatchedPairs === 8) {
            this.endGame(true, this.memoryScore);
        }
    }

    // --- لعبة الحساب السريع (Quick Math) --- //
    generateQuickMathQuestion() {
        if (this.gameTimer) clearTimeout(this.gameTimer);
        if (this.gameInterval) clearInterval(this.gameInterval);

        const level = this.getCurrentLevel('الحساب السريع');
        const difficulty = this.getDifficultyMultiplier('الحساب السريع');

        // زيادة الصعوبة حسب المستوى
        const maxNum1 = Math.floor(20 + (level - 1) * 10);
        const maxNum2 = Math.floor(10 + (level - 1) * 5);
        const timeLimit = Math.max(15 - (level - 1) * 2, 8); // تقليل الوقت مع زيادة المستوى

        const num1 = Math.floor(Math.random() * maxNum1) + 1;
        const num2 = Math.floor(Math.random() * maxNum2) + 1;
        const correctAnswer = num1 + num2;

        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="quick-math-game">
                <div class="game-header-info">
                    <h3>🧮 الحساب السريع</h3>
                    <div class="level-info">
                        <span class="level-badge">المستوى ${level}</span>
                        <span class="difficulty-indicator">صعوبة: ${Math.round(difficulty * 100)}%</span>
                    </div>
                </div>
                <h3>ما هو ناتج العملية التالية؟</h3>
                <div class="question">
                    <span class="number" dir="ltr">${num1}</span>
                    <span class="operator">+</span>
                    <span class="number" dir="ltr">${num2}</span>
                    <span class="equals">=</span>
                    <input type="number" id="quickMathAnswer" class="answer-input" placeholder="?" autofocus>
                </div>
                <button id="checkQuickMathBtn" class="btn btn-primary">تحقق</button>
                <div class="timer" id="quickMathTimer">${timeLimit}</div>
            </div>
        `;

        document.getElementById('checkQuickMathBtn').addEventListener('click', () => this.checkQuickMathAnswer(correctAnswer, level));
        document.getElementById('quickMathAnswer').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.checkQuickMathAnswer(correctAnswer, level);
        });

        let timeLeft = timeLimit;
        const timerElement = document.getElementById('quickMathTimer');
        this.gameInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(this.gameInterval);
                this.showGameResult('انتهى الوقت!', false);
            }
        }, 1000);
    }

    checkQuickMathAnswer(correctAnswer, level) {
        if (this.gameInterval) clearInterval(this.gameInterval);
        const userAnswer = parseInt(document.getElementById('quickMathAnswer').value);

        if (userAnswer === correctAnswer) {
            // حساب النقاط حسب المستوى
            const baseScore = 20;
            const levelBonus = level * 5;
            const timeBonus = 10; // مكافأة إضافية للإجابة السريعة
            const totalScore = baseScore + levelBonus + timeBonus;

            // زيادة المستوى
            const newLevel = this.increaseLevel('الحساب السريع');

            this.showGameResult(`🎉 أحسنت! إجابة صحيحة! +${totalScore} نقطة`, true);
            this.endGame(true, totalScore);

            // عرض رسالة المستوى الجديد
            if (newLevel > level) {
                setTimeout(() => {
                    this.showLevelUpMessage(newLevel);
                }, 1000);
            }
        } else {
            this.showGameResult(`❌ إجابة خاطئة. الصحيح هو: ${correctAnswer}`, false);
        }
    }

    // --- لعبة ترتيب الأعداد (Number Sort) --- //
    generateNumberSortQuestion() {
        const numbers = [];
        for (let i = 0; i < 6; i++) {
            numbers.push(Math.floor(Math.random() * 100));
        }
        const sortedNumbers = [...numbers].sort((a, b) => a - b);

        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="number-sort-game">
                <h3>رتب الأعداد التالية من الأصغر إلى الأكبر:</h3>
                <div class="numbers-display">
                    ${numbers.map(n => `<div class="number-item">${n}</div>`).join('')}
                </div>
                <div class="sort-input">
                    <input type="text" id="numberSortInput" class="sort-input-field" placeholder="أدخل الأرقام مرتبة، مفصولة بفاصلة">
                </div>
                <button id="checkNumberSortBtn" class="btn btn-primary">تحقق من الترتيب</button>
            </div>
        `;

        document.getElementById('checkNumberSortBtn').addEventListener('click', () => this.checkNumberSortAnswer(sortedNumbers));
        document.getElementById('numberSortInput').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.checkNumberSortAnswer(sortedNumbers);
        });
    }

    checkNumberSortAnswer(sortedNumbers) {
        const userInput = document.getElementById('numberSortInput').value;
        const userArray = userInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

        if (JSON.stringify(userArray) === JSON.stringify(sortedNumbers)) {
            this.showGameResult('ترتيب صحيح! أحسنت!', true);
        } else {
            this.showGameResult(`ترتيب خاطئ. الترتيب الصحيح هو: ${sortedNumbers.join(', ')}`, false);
        }
    }

    // --- لعبة إكمال النمط (Pattern Game) --- //
    generatePatternGame() {
        const start = Math.floor(Math.random() * 10) + 1;
        const step = Math.floor(Math.random() * 5) + 2; // Step between 2 and 6
        const sequence = [];
        for (let i = 0; i < 5; i++) {
            sequence.push(start + i * step);
        }

        const missingIndex = Math.floor(Math.random() * 3) + 1; // hide index 1, 2, or 3
        const correctAnswer = sequence[missingIndex];
        sequence[missingIndex] = '?';

        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="pattern-game">
                <h3>اكتشف النمط وأكمل التسلسل التالي:</h3>
                <div class="pattern-sequence">
                    ${sequence.map(n => `<div class="pattern-number ${n === '?' ? 'question-mark' : ''}">${n}</div>`).join('')}
                </div>
                <div class="pattern-input">
                    <input type="number" id="patternAnswer" class="pattern-input-field" placeholder="أدخل الرقم المفقود">
                </div>
                <button id="checkPatternBtn" class="btn btn-primary">تحقق من النمط</button>
            </div>
        `;

        document.getElementById('checkPatternBtn').addEventListener('click', () => this.checkPatternAnswer(correctAnswer));
        document.getElementById('patternAnswer').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.checkPatternAnswer(correctAnswer);
        });
    }

    checkPatternAnswer(correctAnswer) {
        const userAnswer = parseInt(document.getElementById('patternAnswer').value);
        if (userAnswer === correctAnswer) {
            this.showGameResult('نمط صحيح! عمل رائع!', true);
        } else {
            this.showGameResult(`إجابة خاطئة. الرقم الصحيح هو: ${correctAnswer}`, false);
        }
    }

    // --- لعبة تخمين العدد (Guess The Number) --- //
    generateGuessTheNumberGame() {
        this.targetNumber = Math.floor(Math.random() * 100) + 1;
        this.attempts = 0;
        this.maxAttempts = 7;

        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="guess-number-game">
                <h3>لقد اخترت عددًا بين 1 و 100. هل يمكنك تخمينه؟</h3>
                <p>لديك ${this.maxAttempts} محاولات.</p>
                <div class="guess-input">
                    <input type="number" id="guessInput" class="answer-input" placeholder="أدخل تخمينك" autofocus>
                    <button id="checkGuessBtn" class="btn btn-primary">خمن</button>
                </div>
                <div id="guessFeedback" class="feedback"></div>
                <div id="hintArea" class="hint"></div>
                <div id="attemptsTracker">المحاولات: 0 / ${this.maxAttempts}</div>
                <button id="hintBtn" class="btn btn-secondary">اطلب تلميحًا</button>
            </div>
        `;

        document.getElementById('checkGuessBtn').addEventListener('click', () => this.checkGuess());
        document.getElementById('guessInput').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.checkGuess();
        });
        document.getElementById('hintBtn').addEventListener('click', () => this.giveHint());
    }

    giveHint() {
        const hintArea = document.getElementById('hintArea');
        let hintText = '';
        const puzzleType = Math.floor(Math.random() * 3);

        switch (puzzleType) {
            // لغز الضرب: العدد * A = B
            case 0: {
                const multiplier = Math.floor(Math.random() * 5) + 2; // عدد بين 2 و 6
                const result = this.targetNumber * multiplier;
                hintText = `إذا ضربت العدد في <b>${multiplier}</b>، سيكون الناتج <b>${result}</b>.`;
                break;
            }
            // لغز الجمع: العدد + A = B
            case 1: {
                const adder = Math.floor(Math.random() * 20) + 5; // عدد بين 5 و 24
                const result = this.targetNumber + adder;
                hintText = `إذا أضفت <b>${adder}</b> إلى العدد، سيكون الناتج <b>${result}</b>.`;
                break;
            }
            // لغز القسمة: B / العدد = C
            case 2: {
                const divisor = Math.floor(Math.random() * 5) + 2; // عدد بين 2 و 6
                const dividend = this.targetNumber * divisor;
                hintText = `إذا قسمت العدد <b>${dividend}</b> على العدد الذي اخترته، سيكون الناتج <b>${divisor}</b>.`;
                break;
            }
        }

        hintArea.innerHTML = `<i class="fas fa-lightbulb"></i> تلميح: ${hintText}`;
    }

    checkGuess() {
        const userInput = document.getElementById('guessInput');
        const userGuess = parseInt(userInput.value);
        const feedback = document.getElementById('guessFeedback');
        const attemptsTracker = document.getElementById('attemptsTracker');

        if (isNaN(userGuess)) {
            feedback.textContent = 'الرجاء إدخال رقم صحيح.';
            feedback.className = 'feedback error';
            return;
        }

        this.attempts++;
        attemptsTracker.textContent = `المحاولات: ${this.attempts} / ${this.maxAttempts}`;
        userInput.value = '';
        userInput.focus();

        if (userGuess === this.targetNumber) {
            const score = Math.max(100 - (this.attempts * 10), 10);
            this.showGameResult(`صحيح! العدد هو ${this.targetNumber}. لقد فزت!`, true);
            this.endGame(true, score);
        } else if (this.attempts >= this.maxAttempts) {
            this.showGameResult(`لقد استنفدت محاولاتك. العدد الصحيح كان ${this.targetNumber}.`, false);
        } else if (userGuess < this.targetNumber) {
            feedback.textContent = 'أعلى! حاول مرة أخرى.';
            feedback.className = 'feedback info';
        } else {
            feedback.textContent = 'أقل! حاول مرة أخرى.';
            feedback.className = 'feedback info';
        }
    }

    // --- لعبة تحدي العمليات (Operations Challenge) --- //
    generateOperationsChallengeGame() {
        this.challengeScore = 0;
        this.challengeCurrentQuestion = 0;
        this.challengeTotalQuestions = 5;
        this.generateChallengeQuestion();
    }

    generateChallengeQuestion() {
        this.challengeCurrentQuestion++;
        if (this.challengeCurrentQuestion > this.challengeTotalQuestions) {
            this.showGameResult(`أنهيت التحدي! نتيجتك النهائية هي ${this.challengeScore} نقطة.`, true);
            this.endGame(true, this.challengeScore);
            return;
        }

        const operations = ['+', '-', '*', '/'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let num1, num2, question, answer;

        switch (operation) {
            case '+':
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                answer = num1 + num2;
                question = `${num1} + ${num2}`;
                break;
            case '-':
                num1 = Math.floor(Math.random() * 50) + 20;
                num2 = Math.floor(Math.random() * 20) + 1;
                answer = num1 - num2;
                question = `${num1} - ${num2}`;
                break;
            case '*':
                num1 = Math.floor(Math.random() * 10) + 2;
                num2 = Math.floor(Math.random() * 10) + 2;
                answer = num1 * num2;
                question = `${num1} × ${num2}`;
                break;
            case '/':
                answer = Math.floor(Math.random() * 10) + 2;
                num2 = Math.floor(Math.random() * 10) + 2;
                num1 = answer * num2;
                question = `${num1} ÷ ${num2}`;
                break;
        }

        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="operations-challenge-game">
                <h3>تحدي العمليات (${this.challengeCurrentQuestion}/${this.challengeTotalQuestions})</h3>
                <div class="challenge-stats">
                    <span>النقاط: <span id="challengeScoreDisplay">${this.challengeScore}</span></span>
                </div>
                <div class="question">${formatTextWithMath(question)} = ?</div>
                <div class="challenge-input">
                    <input type="number" id="challengeAnswer" class="answer-input" autofocus>
                    <button id="checkChallengeBtn" class="btn btn-primary">تحقق</button>
                </div>
            </div>
        `;

        document.getElementById('checkChallengeBtn').addEventListener('click', () => this.checkChallengeAnswer(answer));
        document.getElementById('challengeAnswer').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.checkChallengeAnswer(answer);
        });
    }

    checkChallengeAnswer(correctAnswer) {
        const userAnswer = parseInt(document.getElementById('challengeAnswer').value);
        if (userAnswer === correctAnswer) {
            this.challengeScore += 10;
            // Correct feedback can be added here if desired
        } else {
            // Incorrect feedback can be added here
        }
        this.generateChallengeQuestion();
    }

    // --- لعبة موازنة المعادلات (Balancing Equation) --- //
    generateBalancingEquationGame() {
        let equation = {};
        const type = Math.floor(Math.random() * 4); // 4 أنواع من المعادلات

        switch (type) {
            // النوع 0: X + a = b
            case 0: {
                const a = Math.floor(Math.random() * 20) + 1;
                const x = Math.floor(Math.random() * 20) + 1;
                const b = x + a;
                equation = { left: `X + ${a}`, right: `${b}`, answer: x };
                break;
            }
            // النوع 1: X - a = b
            case 1: {
                const a = Math.floor(Math.random() * 15) + 1;
                const b = Math.floor(Math.random() * 15) + 1;
                const x = a + b;
                equation = { left: `X - ${a}`, right: `${b}`, answer: x };
                break;
            }
            // النوع 2: a * X = b
            case 2: {
                const a = Math.floor(Math.random() * 10) + 2;
                const x = Math.floor(Math.random() * 10) + 2;
                const b = a * x;
                equation = { left: `${a}X`, right: `${b}`, answer: x };
                break;
            }
            // النوع 3: X / a = b
            case 3: {
                const a = Math.floor(Math.random() * 10) + 2;
                const b = Math.floor(Math.random() * 10) + 2;
                const x = a * b;
                equation = { left: `X / ${a}`, right: `${b}`, answer: x };
                break;
            }
        }

        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="balancing-equation-game">
                <h3>أوجد قيمة X لتحقيق توازن المعادلة:</h3>
                <div class="equation-display">
                    <div class="side left-side">${formatTextWithMath(equation.left)}</div>
                    <div class="equals">=</div>
                    <div class="side right-side">${formatTextWithMath(equation.right)}</div>
                </div>
                <div class="balance-input">
                    <span>X = </span>
                    <input type="number" id="balanceAnswer" class="answer-input" autofocus>
                    <button id="checkBalanceBtn" class="btn btn-primary">تحقق</button>
                </div>
            </div>
        `;

        document.getElementById('checkBalanceBtn').addEventListener('click', () => this.checkBalancingEquationAnswer(equation.answer));
        document.getElementById('balanceAnswer').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.checkBalancingEquationAnswer(equation.answer);
        });
    }

    checkBalancingEquationAnswer(correctAnswer) {
        const userAnswer = parseInt(document.getElementById('balanceAnswer').value);
        if (userAnswer === correctAnswer) {
            this.showGameResult('إجابة صحيحة! لقد وازنت المعادلة بنجاح.', true);
            this.endGame(true, 25); // نقاط ثابتة لهذه اللعبة حاليًا
        } else {
            this.showGameResult(`إجابة خاطئة. القيمة الصحيحة لـ X هي ${correctAnswer}.`, false);
        }
    }

    // --- لعبة المسائل الكلامية (Word Problems) --- //
    generateWordProblemGame() {
        const problems = [
            {
                question: "اشترت فاطمة 3 دفاتر بسعر 50 دينارًا جزائريًا للدفتر الواحد. كم المبلغ الإجمالي الذي دفعته؟",
                answer: 150
            },
            {
                question: "يوجد في حافلة 45 راكبًا. نزل منهم 18 راكبًا في المحطة الأولى. كم راكبًا بقي في الحافلة؟",
                answer: 27
            },
            {
                question: "يقرأ كريم 15 صفحة من كتاب كل يوم. كم صفحة سيقرأ في 7 أيام؟",
                answer: 105
            },
            {
                question: "إذا كان سعر تذكرة حديقة الحيوانات 200 دينار جزائري للطفل، فما هو سعر التذاكر لـ 4 أطفال؟",
                answer: 800
            },
            {
                question: "عمر الأب 42 سنة، وعمر ابنه سُبع (1/7) عمره. كم عمر الابن؟",
                answer: 6
            },
            {
                question: "اشترى علي كتابًا بسعر 450 دينارًا ومجموعة أقلام بسعر 150 دينارًا. إذا أعطى للبائع 1000 دينار، كم سيعيد له البائع؟",
                answer: 400
            },
            {
                question: "تريد معلمة توزيع 96 قلمًا بالتساوي على 8 تلاميذ. كم قلمًا سيحصل عليه كل تلميذ؟",
                answer: 12
            },
            {
                question: "في مزرعة 15 خروفًا و ضعف هذا العدد من الدجاج. كم دجاجة في المزرعة؟",
                answer: 30
            }
        ];

        const problem = problems[Math.floor(Math.random() * problems.length)];

        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="word-problem-game">
                <h3>حل المسألة التالية:</h3>
                <p class="problem-text">${formatTextWithMath(problem.question)}</p>
                <div class="word-problem-input">
                    <input type="number" id="wordProblemAnswer" class="answer-input" autofocus>
                    <button id="checkWordProblemBtn" class="btn btn-primary">تحقق</button>
                </div>
            </div>
        `;

        document.getElementById('checkWordProblemBtn').addEventListener('click', () => this.checkWordProblemAnswer(problem.answer));
        document.getElementById('wordProblemAnswer').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.checkWordProblemAnswer(problem.answer);
        });
    }

    checkWordProblemAnswer(correctAnswer) {
        const userAnswer = parseInt(document.getElementById('wordProblemAnswer').value);
        if (userAnswer === correctAnswer) {
            this.showGameResult('إجابة صحيحة! أحسنت.', true);
            this.endGame(true, 30);
        } else {
            this.showGameResult(`إجابة خاطئة. الجواب الصحيح هو ${correctAnswer}.`, false);
        }
    }

    // --- لعبة المسائل المعقدة (Complex Problems) --- //
    generateComplexProblemGame() {
        const problems = [
            {
                question: "اشترى أحمد 3 كتب بسعر 250 دينارًا للكتاب الواحد، و 5 أقلام بسعر 30 دينارًا للقلم. كم دفع أحمد إجمالًا؟",
                answer: 900 // (3 * 250) + (5 * 30) = 750 + 150
            },
            {
                question: "كان مع سارة 2000 دينار. اشترت فستانًا بسعر 1200 دينار وحقيبة بنصف سعر الفستان. كم بقي معها؟",
                answer: 200 // 2000 - 1200 - (1200 / 2) = 800 - 600
            },
            {
                question: "يوزع فلاح 120 بيضة في أطباق، كل طبق يتسع لـ 6 بيضات. إذا باع كل طبق بسعر 150 دينارًا، فكم سيجني من بيع كل البيض؟",
                answer: 3000 // (120 / 6) * 150 = 20 * 150
            }
        ];

        const problem = problems[Math.floor(Math.random() * problems.length)];

        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="complex-problem-game">
                <h3>حل المسألة المعقدة التالية:</h3>
                <p class="problem-text">${problem.question}</p>
                <div class="complex-problem-input">
                    <input type="number" id="complexProblemAnswer" class="answer-input" autofocus>
                    <button id="checkComplexProblemBtn" class="btn btn-primary">تحقق</button>
                </div>
            </div>
        `;

        document.getElementById('checkComplexProblemBtn').addEventListener('click', () => this.checkComplexProblemAnswer(problem.answer));
        document.getElementById('complexProblemAnswer').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.checkComplexProblemAnswer(problem.answer);
        });
    }

    checkComplexProblemAnswer(correctAnswer) {
        const userAnswer = parseInt(document.getElementById('complexProblemAnswer').value);
        if (userAnswer === correctAnswer) {
            this.showGameResult('إجابة صحيحة! ممتاز.', true);
            this.endGame(true, 50); // نقاط أعلى للمسائل المعقدة
        } else {
            this.showGameResult(`إجابة خاطئة. الجواب الصحيح هو ${correctAnswer}.`, false);
        }
    }

    // --- لعبة تدريب جدول الضرب (Multiplication Grid) --- //
    generateMultiplicationGridGame() {
        const size = 6;
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="multiplication-grid-game">
                <h3>أكمل خلايا جدول الضرب</h3>
                <div id="multGrid" class="mult-grid" role="grid" aria-label="شبكة تدريب جدول الضرب"></div>
                <div class="grid-controls">
                    <button id="checkMultGridBtn" class="btn btn-primary">تحقق</button>
                    <button id="newMultGridBtn" class="btn btn-secondary">لعبة جديدة</button>
                </div>
                <div id="multFeedback" class="feedback"></div>
            </div>
        `;
        const grid = document.getElementById('multGrid');
        // الصف العلوي: رأس فارغ + ر��وس الأعمدة
        const makeHeader = (text) => {
            const d = document.createElement('div');
            d.className = 'mult-header';
            d.textContent = text;
            return d;
        };
        grid.appendChild(makeHeader('×'));
        for (let c = 1; c <= size; c++) grid.appendChild(makeHeader(String(c)));
        for (let r = 1; r <= size; r++) {
            grid.appendChild(makeHeader(String(r)));
            for (let c = 1; c <= size; c++) {
                const cell = document.createElement('div');
                cell.className = 'mult-cell';
                const product = r * c;
                if (Math.random() < 0.6) {
                    cell.textContent = String(product);
                } else {
                    const inp = document.createElement('input');
                    inp.type = 'number';
                    inp.min = '1';
                    inp.max = '100';
                    inp.className = 'mult-input';
                    inp.setAttribute('data-correct', String(product));
                    cell.appendChild(inp);
                }
                grid.appendChild(cell);
            }
        }
        const firstInput = grid.querySelector('.mult-input');
        if (firstInput) firstInput.focus();
        document.getElementById('checkMultGridBtn').addEventListener('click', () => this.checkMultiplicationGrid());
        document.getElementById('newMultGridBtn').addEventListener('click', () => this.generateMultiplicationGridGame());
    }

    checkMultiplicationGrid() {
        const gameContent = document.getElementById('gameContent');
        const inputs = gameContent.querySelectorAll('.mult-input');
        let mistakes = 0, correctCount = 0;
        inputs.forEach(inp => {
            const val = parseInt(inp.value, 10);
            const correct = parseInt(inp.getAttribute('data-correct'), 10);
            inp.classList.remove('correct', 'incorrect');
            if (!isNaN(val) && val === correct) {
                inp.classList.add('correct');
                correctCount++;
            } else {
                inp.classList.add('incorrect');
                mistakes++;
            }
        });
        const fb = document.getElementById('multFeedback');
        if (mistakes === 0) {
            fb.textContent = 'تهانينا! جميع الإجابات صحيحة.';
            this.endGame(true, Math.max(10, correctCount));
        } else {
            fb.textContent = `هناك ${mistakes} خلية غير صحيحة، صححها وحاول مرة أخرى.`;
        }
    }

    // --- لعبة مساحة ومحيط (Geometry Area & Perimeter) --- //
    generateGeometryAreaPerimeterGame() {
        // اختيار شكل وسؤال
        const shapes = ['rectangle', 'rightTriangle'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        let questionType = 'area';
        if (shape === 'rectangle') {
            questionType = Math.random() < 0.5 ? 'area' : 'perimeter';
        } else {
            // في المثلث القائم: نستخدم أزواج فيثاغورية لضمان محيط صحيح صحيح القيمة
            questionType = Math.random() < 0.6 ? 'area' : 'perimeter';
        }

        // إنشاء معطيات المسألة
        let data = {};
        if (shape === 'rectangle') {
            const w = Math.floor(Math.random() * 10) + 3; // 3..12
            const h = Math.floor(Math.random() * 10) + 3; // 3..12
            const area = w * h;
            const perimeter = 2 * (w + h);
            data = { shape, w, h, questionType, correct: questionType === 'area' ? area : perimeter };
        } else {
            // مثلث قائم الزاوية باستخدام ثلاثيات فيثاغورس
            const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10]];
            const t = triples[Math.floor(Math.random() * triples.length)];
            const k = Math.random() < 0.5 ? 1 : 2; // تكبير اختياري
            const a = t[0] * k, b = t[1] * k, c = t[2] * k;
            const area = (a * b) / 2;
            const perimeter = a + b + c;
            data = { shape, a, b, c, questionType, correct: questionType === 'area' ? area : perimeter };
        }
        this.geoAP = data;

        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="geo-ap-game">
                <h3>مساحة ومحيط الأشكال</h3>
                <canvas id="geoApCanvas" width="300" height="200" aria-label="رسم هندسي"></canvas>
                <p class="geo-ap-question" id="geoApQuestion"></p>
                <div class="geo-ap-input">
                    <input type="number" id="geoApAnswer" class="answer-input" placeholder="أدخل الإجابة" autofocus>
                    <button id="geoApCheck" class="btn btn-primary">تحقق</button>
                </div>
                <div id="geoApFeedback" class="feedback"></div>
            </div>
        `;

        // كتابة نص السؤال
        const qEl = document.getElementById('geoApQuestion');
        if (data.shape === 'rectangle') {
            qEl.textContent = data.questionType === 'area' ?
                `أوجد مساحة المستطيل (الطول = ${data.h}، العرض = ${data.w}).` :
                `أوجد محيط المستطيل (الطول = ${data.h}، العرض = ${data.w}).`;
        } else {
            qEl.textContent = data.questionType === 'area' ?
                `أوجد مساحة مثلث قائم (ضلعا القائمة: ${data.a} و ${data.b}).` :
                `أوجد محيط مثلث قائم (الأضلاع: ${data.a}، ${data.b}، ${data.c}).`;
        }

        // رسم الشكل
        this.drawGeoAPShape();

        // ربط الزر
        document.getElementById('geoApCheck').addEventListener('click', () => this.checkGeometryAreaPerimeterAnswer());
        const ans = document.getElementById('geoApAnswer');
        ans.addEventListener('keyup', (e) => { if (e.key === 'Enter') this.checkGeometryAreaPerimeterAnswer(); });
    }

    drawGeoAPShape() {
        const d = this.geoAP;
        const canvas = document.getElementById('geoApCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#2d3748';
        ctx.fillStyle = '#edf2f7';
        ctx.font = "14px Cairo, sans-serif";
        ctx.textAlign = 'center';

        if (d.shape === 'rectangle') {
            // قياس الرسم بحسب القيم
            const maxSide = Math.max(d.w, d.h);
            const scale = 140 / maxSide; // ليظهر داخل اللوحة
            const rw = d.w * scale;
            const rh = d.h * scale;
            const x = (canvas.width - rw) / 2;
            const y = (canvas.height - rh) / 2;
            ctx.fillRect(x, y, rw, rh);
            ctx.strokeRect(x, y, rw, rh);
            // وسوم الأبعاد
            ctx.fillStyle = '#4a5568';
            ctx.fillText(`عرض = ${d.w}`, x + rw / 2, y - 6);
            ctx.fillText(`طول = ${d.h}`, x - 28, y + rh / 2);
        } else {
            // مثلث قائم: ارسم قائمًا عند الزاوية اليسرى السفلية
            const maxSide = Math.max(d.a, d.b);
            const scale = 140 / maxSide;
            const ax = 60, ay = canvas.height - 40;
            const bx = ax + d.a * scale, by = ay;
            const cx = ax, cy = ay - d.b * scale;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.lineTo(cx, cy);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // علامة الزاوية القائمة
            ctx.beginPath();
            ctx.moveTo(ax + 12, ay);
            ctx.lineTo(ax + 12, ay - 12);
            ctx.lineTo(ax, ay - 12);
            ctx.stroke();
            // وسوم الأبعاد
            ctx.fillStyle = '#4a5568';
            ctx.fillText(`a = ${d.a}`, (ax + bx) / 2, by + 16);
            ctx.fillText(`b = ${d.b}`, ax - 20, (ay + cy) / 2);
        }
    }

    checkGeometryAreaPerimeterAnswer() {
        const d = this.geoAP;
        const val = parseFloat(document.getElementById('geoApAnswer').value);
        const fb = document.getElementById('geoApFeedback');
        if (isNaN(val)) { fb.textContent = 'الرجاء إدخال قيمة رقمية.'; return; }
        if (Math.abs(val - d.correct) < 1e-6) {
            fb.textContent = 'إجابة صحيحة! أحسنت.';
            this.endGame(true, 35);
        } else {
            fb.textContent = `إجابة غير صحيحة. حاول مرة أخرى.`;
        }
    }

    // --- لعبة الكسور (Fractions Game) --- //
    generateFractionsGame() {
        const gameContent = document.getElementById('gameContent');
        const fraction1 = this.generateFraction();
        const fraction2 = this.generateFraction();

        // Ensure fractions are not equal for comparison
        while (fraction1.value === fraction2.value) {
            fraction2 = this.generateFraction();
        }

        this.fractionsData = { fraction1, fraction2 };

        gameContent.innerHTML = `
            <div class="fractions-game">
                <h3>أي كسر هو الأكبر؟</h3>
                <div class="fractions-container">
                    <div class="fraction-option" data-value="${fraction1.value}">${fraction1.display}</div>
                    <div class="fraction-option" data-value="${fraction2.value}">${fraction2.display}</div>
                </div>
                <div id="fractions-feedback" class="feedback"></div>
            </div>
        `;

        document.querySelectorAll('.fraction-option').forEach(el => {
            el.addEventListener('click', () => this.checkFractionsAnswer(el));
        });
    }

    generateFraction() {
        let numerator = Math.floor(Math.random() * 9) + 1;
        let denominator = Math.floor(Math.random() * 9) + 1;

        // Ensure denominator is not smaller than numerator to keep it simple for now
        if (denominator < numerator) {
            [numerator, denominator] = [denominator, numerator];
        }
        if (denominator === 0) denominator = 1;

        return {
            display: `<span class="frac"><sup>${numerator}</sup>&frasl;<sub>${denominator}</sub></span>`,
            value: numerator / denominator,
            num: numerator,
            den: denominator
        };
    }

    checkFractionsAnswer(selectedElement) {
        const selectedValue = parseFloat(selectedElement.dataset.value);
        const { fraction1, fraction2 } = this.fractionsData;
        const correctAnswer = Math.max(fraction1.value, fraction2.value);

        if (selectedValue === correctAnswer) {
            this.showGameResult('إجابة صحيحة! أحسنت.', true);
            this.endGame(true, 20);
        } else {
            this.showGameResult(`إجابة خاطئة. الكسر الأكبر هو ${correctAnswer === fraction1.value ? fraction1.display : fraction2.display}`, false);
        }
    }

    // --- لعبة قراءة الساعة (Time Game) --- //
    generateTimeGame() {
        const gameContent = document.getElementById('gameContent');
        const hour = Math.floor(Math.random() * 12) + 1;
        const minute = Math.floor(Math.random() * 12) * 5;
        this.timeData = { hour, minute };

        gameContent.innerHTML = `
            <div class="time-game">
                <h3>كم الساعة؟</h3>
                <canvas id="clockCanvas" width="300" height="300"></canvas>
                <div class="time-input">
                    <input type="number" id="hourInput" placeholder="ساعة" min="1" max="12">
                    <span>:</span>
                    <input type="number" id="minuteInput" placeholder="دقيقة" min="0" max="59">
                    <button id="checkTimeBtn" class="btn btn-primary">تحقق</button>
                </div>
                <div id="time-feedback" class="feedback"></div>
            </div>
        `;

        this.drawClock(hour, minute);

        document.getElementById('checkTimeBtn').addEventListener('click', () => this.checkTimeAnswer());
    }

    drawClock(hour, minute) {
        const canvas = document.getElementById('clockCanvas');
        const ctx = canvas.getContext('2d');
        const radius = canvas.height / 2;
        ctx.translate(radius, radius);

        // Draw clock face
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.9, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = radius * 0.05;
        ctx.stroke();

        // Draw center point
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();

        // Draw numbers
        ctx.font = radius * 0.15 + "px cairo";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        for (let num = 1; num <= 12; num++) {
            let ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.75);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.75);
            ctx.rotate(-ang);
        }

        // Draw hour hand
        const hourAngle = (hour % 12 + minute / 60) * Math.PI / 6;
        this.drawHand(ctx, hourAngle, radius * 0.5, radius * 0.07);

        // Draw minute hand
        const minuteAngle = (minute / 60) * 2 * Math.PI;
        this.drawHand(ctx, minuteAngle, radius * 0.8, radius * 0.05);
    }

    drawHand(ctx, pos, length, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }

    checkTimeAnswer() {
        const hourInput = document.getElementById('hourInput').value;
        const minuteInput = document.getElementById('minuteInput').value;
        const { hour, minute } = this.timeData;

        if (parseInt(hourInput) === hour && parseInt(minuteInput) === minute) {
            this.showGameResult('إجابة صحيحة! أحسنت.', true);
            this.endGame(true, 25);
        } else {
            this.showGameResult(`إجابة خاطئة. الوقت الصحيح هو ${hour}:${minute < 10 ? '0' + minute : minute}`, false);
        }
    }

    // --- لعبة المربعات السحرية (Magic Square) --- //
    generateMagicSquareGame() {
        const level = this.getCurrentLevel('المربعات السحرية');
        const difficulty = this.getDifficultyMultiplier('المربعات السحرية');

        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="magic-square-game">
                <div class="game-header-info">
                    <h3>🔮 المربعات السحرية</h3>
                    <div class="level-info">
                        <span class="level-badge">المستوى ${level}</span>
                        <span class="difficulty-indicator">صعوبة: ${Math.round(difficulty * 100)}%</span>
                    </div>
                </div>
                
                <div class="magic-square-instructions">
                    <p><strong>تعليمات:</strong> املأ الشبكة بالأرقام بحيث يكون مجموع كل صف وعمود وقطر متساوياً</p>
                    <p><strong>المجموع المطلوب:</strong> <span id="magicSum" class="magic-sum">15</span></p>
                </div>
                
                <div class="magic-square-container">
                    <div class="magic-square-board" id="magicSquareBoard"></div>
                    
                    <div class="magic-square-sidebar">
                        <div class="magic-square-keypad" id="magicSquareKeypad"></div>
                        <div class="magic-square-controls">
                            <button id="checkMagicSquareBtn" class="btn btn-primary">تحقق من الحل</button>
                            <button id="newMagicSquareBtn" class="btn btn-secondary">لعبة جديدة</button>
                            <button id="resetMagicSquareBtn" class="btn btn-warning">إعادة تعيين</button>
                            <button id="hintMagicSquareBtn" class="btn btn-info">تلميح</button>
                        </div>
                        <div class="magic-square-status" id="magicSquareStatus">اختر خانة ثم اضغط رقمًا</div>
                        <div class="magic-square-hint" id="magicSquareHint" style="display: none;"></div>
                    </div>
                </div>
            </div>
        `;

        // تهيئة اللعبة
        this.initializeMagicSquareGame();

        // ربط الأحداث
        this.bindMagicSquareEvents();
    }

    // --- لعبة الرياضيات المتقاطعة (Crossmath) --- //
    generateCrossmathGame() {
        const level = this.getCurrentLevel('الرياضيات المتقاطعة');
        const difficulty = this.getDifficultyMultiplier('الرياضيات المتقاطعة');

        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="crossmath-game">
                <div class="game-header-info">
                    <h3>🧩 الرياضيات المتقاطعة</h3>
                    <div class="level-info">
                        <span class="level-badge">المستوى ${level}</span>
                        <span class="difficulty-indicator">صعوبة: ${Math.round(difficulty * 100)}%</span>
                    </div>
                </div>
                
                <div class="crossmath-instructions">
                    <p><strong>تعليمات:</strong> املأ الخلايا الفارغة بالأرقام المتاحة لحل جميع المعادلات</p>
                </div>
                
                <div class="crossmath-grid">
                    <div class="crossmath-row">
                        <input type="number" class="crossmath-cell input-cell" id="cell1" placeholder="?" min="1" max="9">
                        <span class="crossmath-operator">-</span>
                        <span class="crossmath-number">1</span>
                        <span class="crossmath-equals">=</span>
                        <input type="number" class="crossmath-cell input-cell" id="cell2" placeholder="?" min="1" max="9">
                    </div>
                    <div class="crossmath-row">
                        <input type="number" class="crossmath-cell input-cell" id="cell3" placeholder="?" min="1" max="9">
                        <span class="crossmath-equals">=</span>
                        <span class="crossmath-number">3</span>
                        <span class="crossmath-operator">+</span>
                        <input type="number" class="crossmath-cell input-cell" id="cell4" placeholder="?" min="1" max="9">
                    </div>
                    <div class="crossmath-row">
                        <span class="crossmath-number">18</span>
                        <span class="crossmath-equals">=</span>
                        <input type="number" class="crossmath-cell input-cell" id="cell5" placeholder="?" min="1" max="9">
                        <span class="crossmath-operator">+</span>
                        <span class="crossmath-number">9</span>
                    </div>
                </div>
                
                <div class="crossmath-controls">
                    <div class="number-pool">
                        <h4>الأرقام المتاحة:</h4>
                        <div class="number-buttons">
                            <button class="number-btn" data-number="1">1</button>
                            <button class="number-btn" data-number="2">2</button>
                            <button class="number-btn" data-number="3">3</button>
                            <button class="number-btn" data-number="4">4</button>
                            <button class="number-btn" data-number="5">5</button>
                            <button class="number-btn" data-number="6">6</button>
                            <button class="number-btn" data-number="7">7</button>
                            <button class="number-btn" data-number="8">8</button>
                            <button class="number-btn" data-number="9">9</button>
                        </div>
                    </div>
                    
                    <div class="game-controls">
                        <button id="checkCrossmathBtn" class="btn btn-primary">تحقق من الحل</button>
                        <button id="resetCrossmathBtn" class="btn btn-warning">إعادة تعيين</button>
                    </div>
                </div>
                
                <div class="crossmath-hint">
                    <p><strong>تلميح:</strong> المعادلة الأولى: _ - 1 = _</p>
                    <p><strong>تلميح:</strong> المعادلة الثانية: _ = 3 + _</p>
                    <p><strong>تلميح:</strong> المعادلة الثالثة: 18 = _ + 9</p>
                </div>
            </div>
        `;

        // ربط الأحداث
        this.bindCrossmathEvents();
    }

    bindCrossmathEvents() {
        // ربط أزرار الأرقام
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const number = btn.dataset.number;
                const activeInput = document.querySelector('.crossmath-cell.input-cell:focus');
                if (activeInput) {
                    activeInput.value = number;
                    activeInput.style.backgroundColor = '#e8f5e8';
                    setTimeout(() => {
                        activeInput.style.backgroundColor = '';
                    }, 500);
                }
            });
        });

        // ربط زر التحقق
        document.getElementById('checkCrossmathBtn').addEventListener('click', () => {
            this.checkCrossmathAnswer();
        });

        // ربط زر إعادة التعيين
        document.getElementById('resetCrossmathBtn').addEventListener('click', () => {
            this.resetCrossmathGame();
        });

        // ربط الخلايا لإدخال الأرقام
        document.querySelectorAll('.crossmath-cell.input-cell').forEach(input => {
            input.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                if (value < 1 || value > 9) {
                    e.target.value = '';
                }
            });
        });
    }

    checkCrossmathAnswer() {
        const cell1 = parseInt(document.getElementById('cell1').value) || 0;
        const cell2 = parseInt(document.getElementById('cell2').value) || 0;
        const cell3 = parseInt(document.getElementById('cell3').value) || 0;
        const cell4 = parseInt(document.getElementById('cell4').value) || 0;
        const cell5 = parseInt(document.getElementById('cell5').value) || 0;

        // التحقق من المعادلات
        const equation1 = cell1 - 1 === cell2; // _ - 1 = _
        const equation2 = cell3 === 3 + cell4; // _ = 3 + _
        const equation3 = 18 === cell5 + 9;    // 18 = _ + 9

        if (equation1 && equation2 && equation3) {
            const level = this.getCurrentLevel('الرياضيات المتقاطعة');
            const baseScore = 50;
            const levelBonus = level * 10;
            const totalScore = baseScore + levelBonus;

            // زيادة المستوى
            const newLevel = this.increaseLevel('الرياضيات المتقاطعة');

            this.showGameResult(`🎉 أحسنت! لقد حللت اللغز بنجاح! +${totalScore} نقطة`, true);
            this.endGame(true, totalScore);

            // عرض رسالة المستوى الجديد
            if (newLevel > level) {
                setTimeout(() => {
                    this.showLevelUpMessage(newLevel);
                }, 1000);
            }
        } else {
            let errorMessage = '❌ الحل غير صحيح. الأخطاء:';
            if (!equation1) errorMessage += '\n• المعادلة الأولى: _ - 1 = _';
            if (!equation2) errorMessage += '\n• المعادلة الثانية: _ = 3 + _';
            if (!equation3) errorMessage += '\n• المعادلة الثالثة: 18 = _ + 9';

            this.showGameResult(errorMessage, false);
        }
    }

    resetCrossmathGame() {
        document.querySelectorAll('.crossmath-cell.input-cell').forEach(input => {
            input.value = '';
        });
    }

    // --- لعبة السودوكو (Sudoku) --- //
    generateSudokuGame() {
        const level = this.getCurrentLevel('السودوكو');
        const difficulty = this.getDifficultyMultiplier('السودوكو');

        // لغز السودوكو (يمكن تغييره أو توليده لاحقًا)
        const puzzle = [
            [0, 0, 0, 5, 3, 0, 1, 0, 2],
            [0, 1, 0, 9, 0, 7, 0, 0, 0],
            [6, 4, 0, 0, 0, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 4, 0, 2],
            [7, 5, 6, 0, 0, 0, 0, 1, 0],
            [4, 0, 0, 0, 9, 0, 7, 0, 0],
            [2, 0, 1, 8, 0, 0, 0, 3, 0],
            [5, 3, 0, 0, 0, 0, 0, 6, 7],
            [8, 0, 0, 5, 0, 3, 2, 0, 0]
        ];

        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="sudoku-game">
                <div class="game-header-info">
                    <h3>🧩 السودوكو</h3>
                    <div class="level-info">
                        <span class="level-badge">المستوى ${level}</span>
                        <span class="difficulty-indicator">صعوبة: ${Math.round(difficulty * 100)}%</span>
                    </div>
                </div>
                
                <div class="difficulty-selection">
                    <h4>اختر مستوى الصعوبة:</h4>
                    <div class="difficulty-buttons">
                        <button class="difficulty-btn easy" data-difficulty="easy">
                            <span class="difficulty-icon">😊</span>
                            <span class="difficulty-text">سهل</span>
                            <span class="difficulty-desc">أرقام كثيرة معطاة</span>
                        </button>
                        <button class="difficulty-btn medium" data-difficulty="medium">
                            <span class="difficulty-icon">😐</span>
                            <span class="difficulty-text">متوسط</span>
                            <span class="difficulty-desc">صعوبة متوازنة</span>
                        </button>
                        <button class="difficulty-btn hard" data-difficulty="hard">
                            <span class="difficulty-icon">😰</span>
                            <span class="difficulty-text">صعب</span>
                            <span class="difficulty-desc">أرقام قليلة معطاة</span>
                        </button>
                        <button class="difficulty-btn expert" data-difficulty="expert">
                            <span class="difficulty-icon">😱</span>
                            <span class="difficulty-text">خبير</span>
                            <span class="difficulty-desc">تحدي كبير</span>
                        </button>
                    </div>
                </div>
                
                <div class="sudoku-game-area" style="display: none;">
                    <div class="sudoku-instructions">
                        <p><strong>تعليمات:</strong> املأ الخلايا الفارغة بالأرقام من 1 إلى 9 بحيث لا يتكرر الرقم في نفس الصف أو العمود أو المربع 3×3</p>
                    </div>
                    
                    <div class="sudoku-container">
                        <div class="sudoku-board" id="sudokuBoard"></div>
                        
                        <div class="sudoku-sidebar">
                            <div class="sudoku-keypad" id="sudokuKeypad"></div>
                            <div class="sudoku-controls">
                                <button id="checkSudokuBtn" class="btn btn-primary">تحقق من الحل</button>
                                <button id="newSudokuBtn" class="btn btn-secondary">لعبة جديدة</button>
                                <button id="resetSudokuBtn" class="btn btn-warning">إعادة تعيين</button>
                                <button id="changeDifficultyBtn" class="btn btn-info">تغيير الصعوبة</button>
                            </div>
                            <div class="sudoku-status" id="sudokuStatus">اختر خانة ثم اضغط رقمًا</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // ربط أحداث اختيار الصعوبة
        this.bindDifficultySelectionEvents();
    }

    bindDifficultySelectionEvents() {
        const difficultyButtons = document.querySelectorAll('.difficulty-btn');
        const gameArea = document.querySelector('.sudoku-game-area');
        const difficultySelection = document.querySelector('.difficulty-selection');

        difficultyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const difficulty = btn.dataset.difficulty;
                this.startSudokuWithDifficulty(difficulty);

                // إخفاء اختيار الصعوبة وإظهار اللعبة
                difficultySelection.style.display = 'none';
                gameArea.style.display = 'block';
            });
        });
    }

    startSudokuWithDifficulty(difficulty) {
        // لغز السودوكو حسب مستوى الصعوبة
        const puzzles = {
            easy: [
                [5, 3, 0, 0, 7, 0, 0, 0, 0],
                [6, 0, 0, 1, 9, 5, 0, 0, 0],
                [0, 9, 8, 0, 0, 0, 0, 6, 0],
                [8, 0, 0, 0, 6, 0, 0, 0, 3],
                [4, 0, 0, 8, 0, 3, 0, 0, 1],
                [7, 0, 0, 0, 2, 0, 0, 0, 6],
                [0, 6, 0, 0, 0, 0, 2, 8, 0],
                [0, 0, 0, 4, 1, 9, 0, 0, 5],
                [0, 0, 0, 0, 8, 0, 0, 7, 9]
            ],
            medium: [
                [0, 0, 0, 5, 3, 0, 1, 0, 2],
                [0, 1, 0, 9, 0, 7, 0, 0, 0],
                [6, 4, 0, 0, 0, 2, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 4, 0, 2],
                [7, 5, 6, 0, 0, 0, 0, 1, 0],
                [4, 0, 0, 0, 9, 0, 7, 0, 0],
                [2, 0, 1, 8, 0, 0, 0, 3, 0],
                [5, 3, 0, 0, 0, 0, 0, 6, 7],
                [8, 0, 0, 5, 0, 3, 2, 0, 0]
            ],
            hard: [
                [0, 0, 0, 0, 0, 0, 0, 1, 2],
                [0, 0, 0, 0, 3, 5, 0, 0, 0],
                [0, 0, 2, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ],
            expert: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        };

        const puzzle = puzzles[difficulty];
        this.currentDifficulty = difficulty;

        // تهيئة اللعبة
        this.initializeSudokuGame(puzzle);

        // ربط الأحداث
        this.bindSudokuEvents();

        // تحديث النص حسب الصعوبة
        const statusEl = document.getElementById('sudokuStatus');
        const difficultyNames = {
            easy: 'سهل',
            medium: 'متوسط',
            hard: 'صعب',
            expert: 'خبير'
        };
        statusEl.textContent = `تم اختيار مستوى ${difficultyNames[difficulty]} - اختر خانة ثم اضغط رقمًا`;
    }

    initializeSudokuGame(puzzle) {
        this.sudokuPuzzle = puzzle;
        this.sudokuGrid = JSON.parse(JSON.stringify(puzzle));
        this.sudokuGiven = Array.from({ length: 9 }, () => Array(9).fill(false));
        this.sudokuSelected = null;

        this.buildSudokuBoard();
        this.buildSudokuKeypad();
    }

    buildSudokuBoard() {
        const boardEl = document.getElementById('sudokuBoard');
        boardEl.innerHTML = '';

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.className = 'sudoku-cell';
                cell.dataset.r = r;
                cell.dataset.c = c;

                if (this.sudokuPuzzle[r][c] !== 0) {
                    cell.textContent = this.sudokuPuzzle[r][c];
                    cell.classList.add('given');
                    this.sudokuGiven[r][c] = true;
                } else {
                    cell.textContent = this.sudokuGrid[r][c] || '';
                    this.sudokuGiven[r][c] = false;
                }

                cell.addEventListener('click', () => this.selectSudokuCell(r, c));
                boardEl.appendChild(cell);
            }
        }
    }

    buildSudokuKeypad() {
        const keypadEl = document.getElementById('sudokuKeypad');
        keypadEl.innerHTML = '';

        for (let n = 1; n <= 9; n++) {
            const btn = document.createElement('button');
            btn.className = 'sudoku-key';
            btn.textContent = n;
            btn.addEventListener('click', () => this.handleSudokuNumber(n));
            keypadEl.appendChild(btn);
        }

        const eraseBtn = document.createElement('button');
        eraseBtn.className = 'sudoku-key erase';
        eraseBtn.textContent = 'مسح';
        eraseBtn.addEventListener('click', () => this.handleSudokuErase());
        keypadEl.appendChild(eraseBtn);
    }

    selectSudokuCell(r, c) {
        this.sudokuSelected = { r, c };

        // إزالة التحديد السابق
        document.querySelectorAll('.sudoku-cell').forEach(el => el.classList.remove('selected'));

        // تحديد الخانة الجديدة
        const idx = r * 9 + c;
        const cell = document.getElementById('sudokuBoard').children[idx];
        cell.classList.add('selected');

        const statusEl = document.getElementById('sudokuStatus');
        if (this.sudokuGiven[r][c]) {
            statusEl.textContent = 'خانة مُعطاة (ثابتة) — لا يمكن تعديلها.';
        } else {
            statusEl.textContent = `الخانة (${r + 1},${c + 1}) محددة — اختر رقمًا.`;
        }
    }

    handleSudokuNumber(n) {
        if (!this.sudokuSelected) {
            document.getElementById('sudokuStatus').textContent = 'اختر خانة أولاً.';
            return;
        }

        const { r, c } = this.sudokuSelected;
        if (this.sudokuGiven[r][c]) {
            document.getElementById('sudokuStatus').textContent = 'لا يمكن تعديل خانة مُعطاة.';
            return;
        }

        this.sudokuGrid[r][c] = n;
        const idx = r * 9 + c;
        const el = document.getElementById('sudokuBoard').children[idx];
        el.textContent = n;
        el.classList.add('user');

        document.getElementById('sudokuStatus').textContent = `وضعت ${n} في الخانة (${r + 1},${c + 1}).`;
    }

    handleSudokuErase() {
        if (!this.sudokuSelected) {
            document.getElementById('sudokuStatus').textContent = 'اختر خانة أولاً.';
            return;
        }

        const { r, c } = this.sudokuSelected;
        if (this.sudokuGiven[r][c]) {
            document.getElementById('sudokuStatus').textContent = 'لا يمكن مسح خانة مُعطاة.';
            return;
        }

        this.sudokuGrid[r][c] = 0;
        const idx = r * 9 + c;
        const el = document.getElementById('sudokuBoard').children[idx];
        el.textContent = '';
        el.classList.remove('user');

        document.getElementById('sudokuStatus').textContent = `مُسِحت الخانة (${r + 1},${c + 1}).`;
    }

    bindSudokuEvents() {
        // ربط أزرار التحكم
        document.getElementById('checkSudokuBtn').addEventListener('click', () => this.checkSudokuSolution());
        document.getElementById('newSudokuBtn').addEventListener('click', () => this.newSudokuGame());
        document.getElementById('resetSudokuBtn').addEventListener('click', () => this.resetSudokuGame());
        document.getElementById('changeDifficultyBtn').addEventListener('click', () => this.showDifficultySelection());

        // ربط لوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '9') {
                this.handleSudokuNumber(parseInt(e.key, 10));
            }
            if (e.key === 'Backspace' || e.key === 'Delete') {
                this.handleSudokuErase();
            }

            // أسهم للتنقل
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                if (!this.sudokuSelected) {
                    this.selectSudokuCell(0, 0);
                    return;
                }

                let { r, c } = this.sudokuSelected;
                if (e.key === 'ArrowUp') r = Math.max(0, r - 1);
                if (e.key === 'ArrowDown') r = Math.min(8, r + 1);
                if (e.key === 'ArrowLeft') c = Math.max(0, c - 1);
                if (e.key === 'ArrowRight') c = Math.min(8, c + 1);

                this.selectSudokuCell(r, c);
            }
        });
    }

    showDifficultySelection() {
        const gameArea = document.querySelector('.sudoku-game-area');
        const difficultySelection = document.querySelector('.difficulty-selection');

        // إظهار اختيار الصعوبة وإخفاء اللعبة
        gameArea.style.display = 'none';
        difficultySelection.style.display = 'block';

        // إعادة تعيين اللعبة
        this.sudokuGrid = null;
        this.sudokuSelected = null;
    }

    checkSudokuSolution() {
        // التحقق من اكتمال اللعبة
        let isComplete = true;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.sudokuGrid[r][c] === 0) {
                    isComplete = false;
                    break;
                }
            }
            if (!isComplete) break;
        }

        if (!isComplete) {
            document.getElementById('sudokuStatus').textContent = 'لم تكتمل اللعبة بعد. املأ جميع الخلايا الفارغة.';
            return;
        }

        // التحقق من صحة الحل
        if (this.isValidSudokuSolution()) {
            const level = this.getCurrentLevel('السودوكو');
            const baseScore = 100;
            const levelBonus = level * 20;
            const totalScore = baseScore + levelBonus;

            const newLevel = this.increaseLevel('السودوكو');

            this.showGameResult(`🎉 أحسنت! حل صحيح! +${totalScore} نقطة`, true);
            this.endGame(true, totalScore);

            if (newLevel > level) {
                setTimeout(() => {
                    this.showLevelUpMessage(newLevel);
                }, 1000);
            }
        } else {
            document.getElementById('sudokuStatus').textContent = 'الحل غير صحيح. تحقق من الأرقام.';
        }
    }

    isValidSudokuSolution() {
        // التحقق من الصفوف
        for (let r = 0; r < 9; r++) {
            const row = new Set();
            for (let c = 0; c < 9; c++) {
                if (row.has(this.sudokuGrid[r][c])) return false;
                row.add(this.sudokuGrid[r][c]);
            }
        }

        // التحقق من الأعمدة
        for (let c = 0; c < 9; c++) {
            const col = new Set();
            for (let r = 0; r < 9; r++) {
                if (col.has(this.sudokuGrid[r][c])) return false;
                col.add(this.sudokuGrid[r][c]);
            }
        }

        // التحقق من المربعات 3×3
        for (let boxR = 0; boxR < 9; boxR += 3) {
            for (let boxC = 0; boxC < 9; boxC += 3) {
                const box = new Set();
                for (let r = boxR; r < boxR + 3; r++) {
                    for (let c = boxC; c < boxC + 3; c++) {
                        if (box.has(this.sudokuGrid[r][c])) return false;
                        box.add(this.sudokuGrid[r][c]);
                    }
                }
            }
        }

        return true;
    }

    newSudokuGame() {
        // توليد لغز جديد حسب الصعوبة الحالية
        const puzzles = {
            easy: [
                [5, 3, 0, 0, 7, 0, 0, 0, 0],
                [6, 0, 0, 1, 9, 5, 0, 0, 0],
                [0, 9, 8, 0, 0, 0, 0, 6, 0],
                [8, 0, 0, 0, 6, 0, 0, 0, 3],
                [4, 0, 0, 8, 0, 3, 0, 0, 1],
                [7, 0, 0, 0, 2, 0, 0, 0, 6],
                [0, 6, 0, 0, 0, 0, 2, 8, 0],
                [0, 0, 0, 4, 1, 9, 0, 0, 5],
                [0, 0, 0, 0, 8, 0, 0, 7, 9]
            ],
            medium: [
                [0, 0, 0, 5, 3, 0, 1, 0, 2],
                [0, 1, 0, 9, 0, 7, 0, 0, 0],
                [6, 4, 0, 0, 0, 2, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 4, 0, 2],
                [7, 5, 6, 0, 0, 0, 0, 1, 0],
                [4, 0, 0, 0, 9, 0, 7, 0, 0],
                [2, 0, 1, 8, 0, 0, 0, 3, 0],
                [5, 3, 0, 0, 0, 0, 0, 6, 7],
                [8, 0, 0, 5, 0, 3, 2, 0, 0]
            ],
            hard: [
                [0, 0, 0, 0, 0, 0, 0, 1, 2],
                [0, 0, 0, 0, 3, 5, 0, 0, 0],
                [0, 0, 2, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ],
            expert: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        };

        // استخدام الصعوبة الحالية أو المتوسطة كافتراضي
        const difficulty = this.currentDifficulty || 'medium';
        this.sudokuPuzzle = JSON.parse(JSON.stringify(puzzles[difficulty]));

        // إعادة تعيين الشبكة
        this.sudokuGrid = JSON.parse(JSON.stringify(this.sudokuPuzzle));
        this.sudokuSelected = null;
        this.sudokuGiven = Array.from({ length: 9 }, () => Array(9).fill(false));

        // تحديث الشبكة
        this.buildSudokuBoard();
        document.getElementById('sudokuStatus').textContent = `لعبة جديدة (${difficulty === 'easy' ? 'سهل' : difficulty === 'medium' ? 'متوسط' : difficulty === 'hard' ? 'صعب' : 'خبير'}) — اختر خانة.`;
    }

    resetSudokuGame() {
        this.sudokuGrid = JSON.parse(JSON.stringify(this.sudokuPuzzle));
        this.sudokuSelected = null;

        this.buildSudokuBoard();
        document.getElementById('sudokuStatus').textContent = 'تم إعادة تعيين اللعبة.';
    }

    // --- دوال المربعات السحرية --- //
    initializeMagicSquareGame() {
        // إنشاء مربع سحري 3×3
        this.magicSquareSize = 3;
        this.magicSum = 15; // مجموع كل صف وعمود وقطر
        this.magicSquareGrid = Array(this.magicSquareSize).fill().map(() => Array(this.magicSquareSize).fill(0));
        this.magicSquareSelected = null;
        this.magicSquareGiven = Array(this.magicSquareSize).fill().map(() => Array(this.magicSquareSize).fill(false));

        // وضع بعض الأرقام كتلميحات
        this.magicSquareGrid[0][0] = 8;
        this.magicSquareGrid[1][1] = 5;
        this.magicSquareGrid[2][2] = 2;
        this.magicSquareGiven[0][0] = true;
        this.magicSquareGiven[1][1] = true;
        this.magicSquareGiven[2][2] = true;

        this.buildMagicSquareBoard();
        this.buildMagicSquareKeypad();

        // تحديث المجموع المطلوب
        document.getElementById('magicSum').textContent = this.magicSum;
    }

    buildMagicSquareBoard() {
        const boardEl = document.getElementById('magicSquareBoard');
        boardEl.innerHTML = '';

        for (let r = 0; r < this.magicSquareSize; r++) {
            for (let c = 0; c < this.magicSquareSize; c++) {
                const cell = document.createElement('div');
                cell.className = 'magic-square-cell';
                cell.dataset.r = r;
                cell.dataset.c = c;

                if (this.magicSquareGiven[r][c]) {
                    cell.textContent = this.magicSquareGrid[r][c];
                    cell.classList.add('given');
                } else {
                    cell.textContent = this.magicSquareGrid[r][c] || '';
                }

                cell.addEventListener('click', () => this.selectMagicSquareCell(r, c));
                boardEl.appendChild(cell);
            }
        }
    }

    buildMagicSquareKeypad() {
        const keypadEl = document.getElementById('magicSquareKeypad');
        keypadEl.innerHTML = '';

        for (let n = 1; n <= 9; n++) {
            const btn = document.createElement('button');
            btn.className = 'magic-square-key';
            btn.textContent = n;
            btn.addEventListener('click', () => this.handleMagicSquareNumber(n));
            keypadEl.appendChild(btn);
        }

        const eraseBtn = document.createElement('button');
        eraseBtn.className = 'magic-square-key erase';
        eraseBtn.textContent = 'مسح';
        eraseBtn.addEventListener('click', () => this.handleMagicSquareErase());
        keypadEl.appendChild(eraseBtn);
    }

    selectMagicSquareCell(r, c) {
        if (this.magicSquareGiven[r][c]) {
            document.getElementById('magicSquareStatus').textContent = 'خانة مُعطاة (ثابتة) — لا يمكن تعديلها.';
            return;
        }

        this.magicSquareSelected = { r, c };

        // إزالة التحديد السابق
        document.querySelectorAll('.magic-square-cell').forEach(el => el.classList.remove('selected'));

        // تحديد الخانة الجديدة
        const cell = document.querySelector(`[data-r="${r}"][data-c="${c}"]`);
        cell.classList.add('selected');

        document.getElementById('magicSquareStatus').textContent = `الخانة (${r + 1},${c + 1}) محددة — اختر رقمًا.`;
    }

    handleMagicSquareNumber(n) {
        if (!this.magicSquareSelected) {
            document.getElementById('magicSquareStatus').textContent = 'اختر خانة أولاً.';
            return;
        }

        const { r, c } = this.magicSquareSelected;
        if (this.magicSquareGiven[r][c]) {
            document.getElementById('magicSquareStatus').textContent = 'لا يمكن تعديل خانة مُعطاة.';
            return;
        }

        this.magicSquareGrid[r][c] = n;
        const cell = document.querySelector(`[data-r="${r}"][data-c="${c}"]`);
        cell.textContent = n;
        cell.classList.add('user');

        document.getElementById('magicSquareStatus').textContent = `وضعت ${n} في الخانة (${r + 1},${c + 1}).`;
    }

    handleMagicSquareErase() {
        if (!this.magicSquareSelected) {
            document.getElementById('magicSquareStatus').textContent = 'اختر خانة أولاً.';
            return;
        }

        const { r, c } = this.magicSquareSelected;
        if (this.magicSquareGiven[r][c]) {
            document.getElementById('magicSquareStatus').textContent = 'لا يمكن مسح خانة مُعطاة.';
            return;
        }

        this.magicSquareGrid[r][c] = 0;
        const cell = document.querySelector(`[data-r="${r}"][data-c="${c}"]`);
        cell.textContent = '';
        cell.classList.remove('user');

        document.getElementById('magicSquareStatus').textContent = `مُسِحت الخانة (${r + 1},${c + 1}).`;
    }

    bindMagicSquareEvents() {
        // ربط أزرار التحكم
        document.getElementById('checkMagicSquareBtn').addEventListener('click', () => this.checkMagicSquareSolution());
        document.getElementById('newMagicSquareBtn').addEventListener('click', () => this.newMagicSquareGame());
        document.getElementById('resetMagicSquareBtn').addEventListener('click', () => this.resetMagicSquareGame());
        document.getElementById('hintMagicSquareBtn').addEventListener('click', () => this.showMagicSquareHint());

        // ربط لوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '9') {
                this.handleMagicSquareNumber(parseInt(e.key, 10));
            }
            if (e.key === 'Backspace' || e.key === 'Delete') {
                this.handleMagicSquareErase();
            }
        });
    }

    checkMagicSquareSolution() {
        // التحقق من اكتمال اللعبة
        let isComplete = true;
        for (let r = 0; r < this.magicSquareSize; r++) {
            for (let c = 0; c < this.magicSquareSize; c++) {
                if (this.magicSquareGrid[r][c] === 0) {
                    isComplete = false;
                    break;
                }
            }
            if (!isComplete) break;
        }

        if (!isComplete) {
            document.getElementById('magicSquareStatus').textContent = 'لم تكتمل اللعبة بعد. املأ جميع الخلايا الفارغة.';
            return;
        }

        // التحقق من صحة الحل
        if (this.isValidMagicSquare()) {
            const level = this.getCurrentLevel('المربعات السحرية');
            const baseScore = 80;
            const levelBonus = level * 15;
            const totalScore = baseScore + levelBonus;

            const newLevel = this.increaseLevel('المربعات السحرية');

            this.showGameResult(`🎉 أحسنت! مربع سحري صحيح! +${totalScore} نقطة`, true);
            this.endGame(true, totalScore);

            if (newLevel > level) {
                setTimeout(() => {
                    this.showLevelUpMessage(newLevel);
                }, 1000);
            }
        } else {
            document.getElementById('magicSquareStatus').textContent = 'الحل غير صحيح. تحقق من الأرقام.';
        }
    }

    isValidMagicSquare() {
        // التحقق من الصفوف
        for (let r = 0; r < this.magicSquareSize; r++) {
            let sum = 0;
            for (let c = 0; c < this.magicSquareSize; c++) {
                sum += this.magicSquareGrid[r][c];
            }
            if (sum !== this.magicSum) return false;
        }

        // التحقق من الأعمدة
        for (let c = 0; c < this.magicSquareSize; c++) {
            let sum = 0;
            for (let r = 0; r < this.magicSquareSize; r++) {
                sum += this.magicSquareGrid[r][c];
            }
            if (sum !== this.magicSum) return false;
        }

        // التحقق من القطر الرئيسي
        let diagonalSum = 0;
        for (let i = 0; i < this.magicSquareSize; i++) {
            diagonalSum += this.magicSquareGrid[i][i];
        }
        if (diagonalSum !== this.magicSum) return false;

        // التحقق من القطر الثانوي
        diagonalSum = 0;
        for (let i = 0; i < this.magicSquareSize; i++) {
            diagonalSum += this.magicSquareGrid[i][this.magicSquareSize - 1 - i];
        }
        if (diagonalSum !== this.magicSum) return false;

        return true;
    }

    newMagicSquareGame() {
        // إنشاء مربع سحري جديد مع لغز مختلف
        this.generateNewMagicSquarePuzzle();
        document.getElementById('magicSquareStatus').textContent = 'لعبة جديدة — اختر خانة.';
        document.getElementById('magicSquareHint').style.display = 'none';
    }

    generateNewMagicSquarePuzzle() {
        // لغز جديد مختلف
        const newPuzzle = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];

        // وضع أرقام مختلفة كتلميحات
        const hints = [
            { r: 0, c: 0, value: Math.floor(Math.random() * 9) + 1 },
            { r: 1, c: 1, value: Math.floor(Math.random() * 9) + 1 },
            { r: 2, c: 2, value: Math.floor(Math.random() * 9) + 1 }
        ];

        // تطبيق التلميحات
        hints.forEach(hint => {
            newPuzzle[hint.r][hint.c] = hint.value;
        });

        // تحديث الشبكة
        this.magicSquarePuzzle = newPuzzle;
        this.magicSquareGrid = JSON.parse(JSON.stringify(newPuzzle));
        this.magicSquareSelected = null;
        this.magicSquareGiven = Array(this.magicSquareSize).fill().map(() => Array(this.magicSquareSize).fill(false));

        // تحديث التلميحات
        hints.forEach(hint => {
            this.magicSquareGiven[hint.r][hint.c] = true;
        });

        // إعادة بناء الشبكة
        this.buildMagicSquareBoard();

        // تحديث المجموع المطلوب (قد يتغير حسب التلميحات)
        this.calculateMagicSum();
        document.getElementById('magicSum').textContent = this.magicSum;
    }

    calculateMagicSum() {
        // حساب المجموع المطلوب بناءً على التلميحات
        let total = 0;
        let count = 0;

        for (let r = 0; r < this.magicSquareSize; r++) {
            for (let c = 0; c < this.magicSquareSize; c++) {
                if (this.magicSquareGrid[r][c] !== 0) {
                    total += this.magicSquareGrid[r][c];
                    count++;
                }
            }
        }

        // إذا كان هناك تلميحات كافية، احسب المجموع المطلوب
        if (count >= 2) {
            this.magicSum = Math.ceil(total / count) * 3; // تقريب للمجموع المطلوب
        } else {
            this.magicSum = 15; // افتراضي
        }
    }

    resetMagicSquareGame() {
        // إعادة تعيين اللعبة
        this.initializeMagicSquareGame();
        document.getElementById('magicSquareStatus').textContent = 'تم إعادة تعيين اللعبة.';
        document.getElementById('magicSquareHint').style.display = 'none';
    }

    showMagicSquareHint() {
        const hintEl = document.getElementById('magicSquareHint');
        hintEl.style.display = 'block';
        hintEl.innerHTML = `
            <h4>💡 تلميح:</h4>
            <p>• مجموع كل صف وعمود وقطر يجب أن يكون ${this.magicSum}</p>
            <p>• استخدم الأرقام من 1 إلى 9 فقط</p>
            <p>• لا يمكن تكرار رقم في نفس الصف أو العمود</p>
            <p>• الأرقام المعطاة مسبقاً ثابتة</p>
        `;
    }

    // --- Maze Game (لعبة المتاهة) ---
    generateMazeGame() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="maze-controls">
                <label for="mazeTopic">اختر الموضوع:</label>
                <select id="mazeTopic">
                    <option value="integerPowers">القوى ذات أسس صحيحة</option>
                    <option value="opsNoBrackets">سلسلة عمليات بدون أقواس</option>
                    <option value="opsWithBrackets">سلسلة عمليات بأقواس</option>
                    <option value="powers10">قوى العدد 10</option>
                    <option value="multiplication">الضرب</option>
                    <option value="simpleMath">جمع وطرح</option>
                    <option value="roots">الجذور التربيعية</option>
                    <option value="algebra">حل المعادلات</option>
                    <option value="integers">الأعداد النسبية</option>
                    <option value="fractions">الكسور</option>
                    <option value="pgcd">القاسم المشترك الأكبر (PGCD)</option>
                    <option value="expandSimplify">النشر والتبسيط</option>
                </select>
                <button class="btn btn-primary" id="btnGenMaze">🔄 توليد متاهة</button>
                <button class="btn btn-secondary" id="btnPrintMaze">🖨️ طباعة</button>
            </div>
            <div class="maze-wrapper" id="mazeContainer"></div>
        `;

        document.getElementById('btnGenMaze').addEventListener('click', () => this.initMaze());
        document.getElementById('btnPrintMaze').addEventListener('click', () => {
            const style = document.createElement('style');
            style.innerHTML = '@media print { body * { visibility: hidden; } .maze-wrapper, .maze-wrapper * { visibility: visible; } .maze-wrapper { position: absolute; left: 0; top: 0; width: 100%; margin: 0; box-shadow: none; border: none; transform: scale(0.9); } }';
            document.head.appendChild(style);
            window.print();
            document.head.removeChild(style);
        });

        this.initMaze();
    }

    initMaze() {
        const container = document.getElementById('mazeContainer');
        const topicKey = document.getElementById('mazeTopic').value;
        const Strategy = MazeMathTopics[topicKey];
        const ROWS = 4;
        const COLS = 3;

        // Reset Player Position
        this.mazePlayerPos = { r: 0, c: 0 };

        container.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = 'maze-grid';
        container.appendChild(grid);

        let path = [{ r: 0, c: 0 }];
        let curr = { r: 0, c: 0 };

        while (curr.r < ROWS - 1 || curr.c < COLS - 1) {
            let moves = [];
            if (curr.c < COLS - 1) moves.push({ r: curr.r, c: curr.c + 1, dir: 'right' });
            if (curr.r < ROWS - 1) moves.push({ r: curr.r + 1, c: curr.c, dir: 'down' });
            if (moves.length === 0) break;
            let move = moves[Math.floor(Math.random() * moves.length)];
            curr = { r: move.r, c: move.c };
            path.push(curr);
            path[path.length - 2].nextDir = move.dir;
        }

        let cellsData = [];
        for (let r = 0; r < ROWS; r++) {
            cellsData[r] = [];
            for (let c = 0; c < COLS; c++) {
                let cellDiv = document.createElement('div');
                cellDiv.className = 'maze-box';
                cellDiv.style.gridRow = r + 1;
                cellDiv.style.gridColumn = c + 1;

                let qData = Strategy.getQuestion();
                let innerContent = "";

                if (r === 0 && c === 0) {
                    cellDiv.classList.add('start', 'active'); // Active start cell
                    cellDiv.id = `maze-cell-0-0`;
                    innerContent = `<span class="maze-label-text">البداية</span><span class="maze-math-text">${qData.html}</span>`;
                } else if (r === ROWS - 1 && c === COLS - 1) {
                    cellDiv.classList.add('end');
                    cellDiv.id = `maze-cell-${ROWS - 1}-${COLS - 1}`;
                    innerContent = "النهاية";
                } else {
                    cellDiv.id = `maze-cell-${r}-${c}`;
                    innerContent = `<span class="maze-math-text">${qData.html}</span>`;
                }

                cellDiv.innerHTML = innerContent;
                cellsData[r][c] = qData;
                grid.appendChild(cellDiv);
            }
        }

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                let stepIndex = path.findIndex(p => p.r === r && p.c === c);
                let isOnPath = (stepIndex !== -1);
                let correctDir = isOnPath ? path[stepIndex].nextDir : null;

                if (c < COLS - 1) {
                    let isCorrect = (isOnPath && correctDir === 'right');
                    this.drawMazeConnector(r, c, 'right', grid, cellsData[r][c], isCorrect, Strategy);
                }
                if (r < ROWS - 1) {
                    let isCorrect = (isOnPath && correctDir === 'down');
                    this.drawMazeConnector(r, c, 'down', grid, cellsData[r][c], isCorrect, Strategy);
                }
            }
        }
    }

    drawMazeConnector(r, c, dir, container, cellData, isCorrect, Strategy) {
        let text = isCorrect ? cellData.display : Strategy.getWrong(cellData.raw, cellData.wrongContext || cellData);

        if (text === "Err" || text === undefined) text = Math.floor(Math.random() * 20) + 1;

        let connector = document.createElement('div');
        connector.className = 'maze-connector';

        let line = document.createElement('div');
        line.className = 'maze-connector-line';
        let label = document.createElement('div');
        label.className = 'maze-connector-label';
        label.innerHTML = text;

        const boxSize = 130;
        const gapSize = 60;

        if (dir === 'right') {
            let leftPos = (c + 1) * boxSize + (c * gapSize);
            let topPos = (r * (boxSize + gapSize)) + (boxSize / 2);

            connector.style.left = leftPos + 'px';
            connector.style.top = (topPos - 20) + 'px';
            connector.style.width = gapSize + 'px';
            connector.style.height = '40px';

            line.style.width = '100%';
            line.style.height = '3px';
            line.style.top = '20px';
        } else {
            let leftPos = (c * (boxSize + gapSize)) + (boxSize / 2);
            let topPos = (r + 1) * boxSize + (r * gapSize);

            connector.style.left = (leftPos - 30) + 'px';
            connector.style.top = topPos + 'px';
            connector.style.width = '60px';
            connector.style.height = gapSize + 'px';

            line.style.height = '100%';
            line.style.width = '3px';
            line.style.left = '50%';
            line.style.transform = 'translateX(-50%)';
        }
        connector.appendChild(line);
        connector.appendChild(label);

        // Interactive Logic
        connector.dataset.r = r;
        connector.dataset.c = c;
        connector.dataset.dir = dir;
        connector.dataset.isCorrect = isCorrect;

        connector.addEventListener('click', (e) => {
            e.stopPropagation();

            // Check if connector is reachable from current position
            let canMove = false;
            let nextPos = { r: r, c: c }; // Default

            if (dir === 'right') {
                // If moving right from (r, c) -> (r, c+1)
                if (this.mazePlayerPos.r === r && this.mazePlayerPos.c === c) {
                    canMove = true;
                    nextPos = { r: r, c: c + 1 };
                }
                // Bi-directional check (optional, but typical maze implies flow)
                // For simplicity, we stick to the generated path flow or just adjacency
            } else if (dir === 'down') {
                // If moving down from (r, c) -> (r+1, c)
                if (this.mazePlayerPos.r === r && this.mazePlayerPos.c === c) {
                    canMove = true;
                    nextPos = { r: r + 1, c: c };
                }
            }

            if (!canMove) {
                // Try reverse direction check if needed, or just ignore non-adjacent
                // Actually the loop generates connections from (r,c).
                // So if player is at (r,c), they can take this connector.
                // Correct.
            }

            // Verify adjacency
            if (this.mazePlayerPos.r !== r || this.mazePlayerPos.c !== c) {
                // Not at the starting cell of this connector
                // Allow clicking? No, must be adjacent.
                return;
            }

            if (isCorrect) {
                // Determine new position
                let newR = (dir === 'down') ? r + 1 : r;
                let newC = (dir === 'right') ? c + 1 : c;

                // Move Player
                document.getElementById(`maze-cell-${this.mazePlayerPos.r}-${this.mazePlayerPos.c}`).classList.remove('active');
                this.mazePlayerPos = { r: newR, c: newC };
                document.getElementById(`maze-cell-${newR}-${newC}`).classList.add('active');

                // Mark path visual
                connector.classList.add('correct-path');

                // Check Win
                if (newR === 3 && newC === 2) { // ROWS-1, COLS-1
                    setTimeout(() => {
                        this.showGameResult("أحسنت! لقد وصلت للنهاية بنجاح! 🎉", true);
                        this.playVictorySound();
                    }, 300);
                }

            } else {
                // Wrong Answer
                connector.classList.add('wrong-shake');
                setTimeout(() => connector.classList.remove('wrong-shake'), 500);
            }
        });

        container.appendChild(connector);
    }


    playVictorySound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();

            // 1. "Ta-da" Fanfare (Major Triad Arpeggio)
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            const start = ctx.currentTime;

            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.frequency.value = freq;
                osc.type = 'triangle'; // Brighter than sine, less harsh than square, reliable "game" tone

                gain.gain.setValueAtTime(0, start + i * 0.08);
                gain.gain.linearRampToValueAtTime(0.15, start + i * 0.08 + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, start + i * 0.08 + 0.4);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(start + i * 0.08);
                osc.stop(start + i * 0.08 + 0.4);
            });

            // 2. Simulated Applause (Filtered Noise)
            const bufferSize = ctx.sampleRate * 2.5; // 2.5 seconds
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1); // White noise
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const noiseGain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            // Filter to make it sound like clapping ("dull" noise)
            filter.type = 'lowpass';
            filter.frequency.value = 1200;
            filter.Q.value = 1;

            // Envelope for applause (Swell and Fade)
            noiseGain.gain.setValueAtTime(0, start + 0.3);
            noiseGain.gain.linearRampToValueAtTime(0.25, start + 0.8); // Swell
            noiseGain.gain.exponentialRampToValueAtTime(0.001, start + 2.5); // Decay

            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(ctx.destination);

            noise.start(start + 0.3);
            noise.stop(start + 2.5);

        } catch (e) {
            console.error("Audio playback failed", e);
        }
    }
}

// --- تهيئة الصفحة --- //
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== بدء تحميل الصفحة ===');

    try {
        // 1. إنشاء GameController
        console.log('1. إنشاء GameController...');

        if (typeof GameController === 'undefined') {
            throw new Error('GameController class غير معرف');
        }

        const gameController = new GameController();
        console.log('✅ GameController تم إنشاؤه بنجاح');

        // 2. عرض لوحة النتائج
        if (gameController.scoreManager) {
            gameController.scoreManager.displayLeaderboard();
            console.log('✅ لوحة النتائج تم عرضها بنجاح');
        }

        // 3. ربط الأزرار بطريقة مباشرة
        console.log('2. ربط الأزرار...');

        // دالة بسيطة لربط الأزرار
        function bindGameButton(buttonId, gameName) {
            const button = document.getElementById(buttonId);
            if (button) {
                // إزالة أي event listeners سابقة
                button.replaceWith(button.cloneNode(true));
                const newButton = document.getElementById(buttonId);

                // إضافة event listener جديد
                newButton.onclick = function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    console.log(`🎮 زر ${buttonId} تم الضغط عليه`);
                    console.log(`🎯 بدء لعبة: ${gameName}`);

                    try {
                        // إضافة تأثير بصري
                        this.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            this.style.transform = 'scale(1)';
                        }, 150);

                        // بدء اللعبة
                        if (gameController && typeof gameController.startGame === 'function') {
                            gameController.startGame(gameName);
                            console.log('✅ اللعبة بدأت بنجاح');
                        } else {
                            throw new Error('gameController.startGame غير متوفر');
                        }
                    } catch (error) {
                        console.error('❌ خطأ في بدء اللعبة:', error);
                        alert(`خطأ في بدء اللعبة: ${gameName}\n${error.message}`);
                    }
                };

                console.log(`✅ ${buttonId} تم ربطه بـ ${gameName}`);
                return true;
            } else {
                console.error(`❌ زر ${buttonId} غير موجود`);
                return false;
            }
        }

        // ربط جميع الأزرار (15 لعبة)
        const games = [
            ['startQuickMath', 'الحساب السريع'],
            ['startNumberSort', 'ترتيب الأعداد'],
            ['startMemoryGame', 'لعبة الذاكرة'],
            ['startPatternGame', 'إكمال النمط'],
            ['startGuessTheNumber', 'تخمين العدد'],
            ['startOperationsChallenge', 'تحدي العمليات'],
            ['startBalancingEquation', 'موازنة المعادلات'],
            ['startWordProblems', 'المسائل الكلامية'],
            ['startComplexProblems', 'مسائل معقدة'],
            ['startMultiplicationGrid', 'تدريب جدول الضرب'],
            ['startGeometryAP', 'مساحة ومحيط'],
            ['startFractionsGame', 'لعبة الكسور'],
            ['startTimeGame', 'لعبة قراءة الساعة'],
            ['startSudokuGame', 'السودوكو'],
            ['startMagicSquareGame', 'المربعات السحرية'],
            ['startMazeGame', 'لعبة المتاهة']
        ];

        let successCount = 0;
        games.forEach(([id, name]) => {
            if (bindGameButton(id, name)) {
                successCount++;
            }
        });

        console.log(`🎯 تم ربط ${successCount}/${games.length} زر بنجاح`);

        // 4. ربط زر إنهاء اللعبة
        const endGameBtn = document.getElementById('endGameBtn');
        if (endGameBtn) {
            endGameBtn.onclick = function (e) {
                e.preventDefault();
                console.log('🔚 زر إنهاء اللعبة تم الضغط عليه');
                try {
                    if (gameController && typeof gameController.hideGameArea === 'function') {
                        gameController.hideGameArea();
                    } else {
                        throw new Error('gameController.hideGameArea غير متوفر');
                    }
                } catch (error) {
                    console.error('❌ خطأ في إخفاء منطقة اللعبة:', error);
                }
            };
            console.log('✅ زر إنهاء اللعبة تم ربطه');
        }

        // 5. اختبار الأزرار
        console.log('3. اختبار الأزرار...');
        const allButtons = document.querySelectorAll('.game-btn');
        console.log(`🔍 تم العثور على ${allButtons.length} زر في الصفحة`);

        // إضافة تأثيرات بصرية
        allButtons.forEach(button => {
            button.style.cursor = 'pointer';
            button.style.transition = 'all 0.2s ease';

            // تأثير عند الضغط
            button.addEventListener('mousedown', () => {
                button.style.transform = 'scale(0.95)';
            });

            button.addEventListener('mouseup', () => {
                button.style.transform = 'scale(1)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
            });
        });

        console.log('🎉 === تم تحميل الصفحة بنجاح ===');
        console.log('💡 يمكنك الآن الضغط على أي زر لعبة');

        // 6. إضافة رسالة نجاح للمستخدم
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            z-index: 9999;
            font-family: 'Cairo', sans-serif;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        successMsg.innerHTML = '✅ تم تحميل 15 لعبة تعليمية بنجاح!';
        document.body.appendChild(successMsg);

        // إزالة الرسالة بعد 3 ثوان
        setTimeout(() => {
            if (successMsg.parentNode) {
                successMsg.parentNode.removeChild(successMsg);
            }
        }, 3000);

    } catch (error) {
        console.error('❌ خطأ في تهيئة الصفحة:', error);
        console.error('Stack trace:', error.stack);

        // عرض رسالة خطأ للمستخدم
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 9999;
            font-family: 'Cairo', sans-serif;
            max-width: 300px;
        `;
        errorDiv.innerHTML = `
            <h4>⚠️ خطأ في تحميل الصفحة</h4>
            <p>يرجى تحديث الصفحة أو الاتصال بالمطور</p>
            <small>${error.message}</small>
        `;
        document.body.appendChild(errorDiv);

        // إزالة رسالة الخطأ بعد 10 ثوان
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 10000);
    }
});

// Function to detect and format math/numbers to LTR
function formatTextWithMath(text) {
    if (typeof text !== 'string') return text;

    // Regex to find numbers, signed numbers, fractions, and equations within text
    const mathPattern = /((?:[a-zA-Z]\s*=\s*)?[+\-]?\d+(?:[.,]\d+)?(?:\s*[\/]\s*\d+)?)(?![^<]*>)/g;

    return text.replace(mathPattern, function (match) {
        return `<span dir="ltr" style="display:inline-block; font-family: 'Courier New', monospace; font-weight: bold;">${match}</span>`;
    });
}

