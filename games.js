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
        levelUpDiv.className = 'level-up-overlay';
        levelUpDiv.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: 9999;';
        levelUpDiv.innerHTML = `
            <style>
                @keyframes bounceInGlass { 
                    0% { transform: scale(0.8); opacity: 0; } 
                    50% { transform: scale(1.05); opacity: 1; } 
                    100% { transform: scale(1); opacity: 1; } 
                }
            </style>
            <div class="level-up-content" style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 24px; padding: 40px; box-shadow: 0 15px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1); width: 90%; max-width: 450px; text-align: center; position: relative; overflow: hidden; animation: bounceInGlass 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                
                <div style="position: absolute; top: -50px; left: -50px; width: 150px; height: 150px; background: rgba(168, 85, 247, 0.4); filter: blur(40px); border-radius: 50%; z-index: 0;"></div>
                <div style="position: absolute; bottom: -50px; right: -50px; width: 150px; height: 150px; background: rgba(234, 179, 8, 0.3); filter: blur(40px); border-radius: 50%; z-index: 0;"></div>

                <div style="position: relative; z-index: 1;">
                    <div style="font-size: 4rem; margin-bottom: 15px;">🎉</div>
                    <h3 style="font-size: 1.8rem; color: #fff; margin-bottom: 15px; font-weight: 900; background: linear-gradient(135deg, #fde047, #f59e0b); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">مبروك! لقد وصلت للمستوى ${newLevel}!</h3>
                    <p style="font-size: 1.2rem; color: #bae6fd; margin-bottom: 25px; line-height: 1.5;">ستجد اللعبة أكثر تحدياً الآن، استعد جيداً! 🚀</p>
                    <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()" style="padding: 12px 35px; border-radius: 12px; font-size: 1.2rem; font-weight: bold; background: linear-gradient(135deg, #a855f7, #3b82f6); border: none; box-shadow: 0 5px 15px rgba(168, 85, 247, 0.4); color: white; cursor: pointer; transition: all 0.3s;">متابعة</button>
                </div>
            </div>
        `;
        document.body.appendChild(levelUpDiv);
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
        const gameOverlay = document.getElementById('gameOverlay');
        if (gameOverlay) {
            gameOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.getElementById('overlayTitle').textContent = this.currentGame;
        } else {
            // احتياط في حال لم يتم التحديث لسبب ما
            const ga = document.getElementById('gameArea');
            if (ga) ga.style.display = 'block';
        }

        const scoreDisplay = document.getElementById('scoreDisplay');
        if (scoreDisplay) scoreDisplay.style.display = 'block';

        const mainContent = document.getElementById('mainContent');
        if (mainContent) mainContent.style.display = 'none';

        const oldGameSec = document.querySelector('.game-section');
        if (oldGameSec) oldGameSec.style.display = 'none';

        const title = document.getElementById('gameTitle');
        if (title) title.textContent = this.currentGame;

        document.getElementById('gameContent').innerHTML = ''; // Clear previous game
    }

    hideGameArea() {
        const gameOverlay = document.getElementById('gameOverlay');
        if (gameOverlay) {
            gameOverlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            const ga = document.getElementById('gameArea');
            if (ga) ga.style.display = 'none';
        }

        const scoreDisplay = document.getElementById('scoreDisplay');
        if (scoreDisplay) scoreDisplay.style.display = 'none';

        const mainContent = document.getElementById('mainContent');
        if (mainContent) mainContent.style.display = 'block';

        const oldGameSec = document.querySelector('.game-section');
        if (oldGameSec) oldGameSec.style.display = 'block';
    }

    endGame(isWin, score) {
        this.scoreManager.saveScore(score, this.currentGame);
        this.showGameResult(`أحسنت! لقد أنهيت اللعبة بنتيجة ${score} نقطة.`, isWin);
    }

    showGameResult(message, isSuccess) {
        const gameContent = document.getElementById('gameContent');
        const currentGame = this.currentGame; // حفظ اللعبة الحالية

        gameContent.innerHTML = `
            <style>
                @keyframes popInGlass { 
                    0% { transform: scale(0.9); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            </style>
            <div style="display:flex; justify-content:center; align-items:center; width:100%; height:100%; padding: 20px; box-sizing: border-box;">
                <div class="operations-card game-result-glass ${isSuccess ? 'success-glass' : 'error-glass'}" style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid ${isSuccess ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}; border-radius: 24px; padding: 40px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); width: 100%; max-width: 500px; text-align: center; position: relative; overflow: hidden; animation: popInGlass 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                    <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: ${isSuccess ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; filter: blur(40px); border-radius: 50%; z-index: 0;"></div>
                    <div style="position: absolute; bottom: -50px; left: -50px; width: 150px; height: 150px; background: ${isSuccess ? 'rgba(59, 130, 246, 0.2)' : 'rgba(249, 115, 22, 0.2)'}; filter: blur(40px); border-radius: 50%; z-index: 0;"></div>
                    
                    <div style="position: relative; z-index: 1;">
                        <div style="font-size: 3.5rem; margin-bottom: 15px; text-shadow: 0 5px 15px rgba(0,0,0,0.3);">${isSuccess ? '🏆' : '💔'}</div>
                        <h3 style="font-size: 1.6rem; color: #fff; margin-bottom: 30px; line-height: 1.6; font-weight: 800;">${message}</h3>
                        
                        <div class="result-buttons" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                            <button class="btn btn-primary" id="restartGameBtn" style="padding: 12px 25px; border-radius: 12px; font-weight: 900; background: linear-gradient(135deg, ${isSuccess ? '#22c55e, #16a34a' : '#ef4444, #dc2626'}); border: none; font-size: 1.1rem; color: white; cursor: pointer; box-shadow: 0 5px 15px ${isSuccess ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}; transition: all 0.3s;">إعادة اللعب</button>
                            <button class="btn btn-secondary" id="backToMenuBtn" style="padding: 12px 25px; border-radius: 12px; font-weight: bold; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); font-size: 1.1rem; color: white; cursor: pointer; transition: all 0.3s;">العودة للقائمة</button>
                        </div>
                    </div>
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
        const usedAnswers = new Set(); // نستخدم مجموعة للإجابات لمنع تكرار نفس النتيجة
        while (pairs.length < 8) {
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            const question = `${num1} + ${num2}`;
            const answer = num1 + num2;
            if (!usedAnswers.has(answer)) {
                pairs.push({ question, answer: answer.toString() });
                usedAnswers.add(answer);
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
            <div class="memory-game" style="display:flex; justify-content:center; align-items:flex-start; width: 100%; height: 100%; padding: 10px; box-sizing: border-box; overflow-y: auto;">
                <div class="operations-card" style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 25px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); width: 100%; max-width: 500px; text-align: center; position: relative; overflow: hidden; margin-top: 10px; margin-bottom: 20px;">
                    
                    <div style="position: absolute; top: -40px; right: -40px; width: 120px; height: 120px; background: rgba(59, 130, 246, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>
                    <div style="position: absolute; bottom: -40px; left: -40px; width: 120px; height: 120px; background: rgba(236, 72, 153, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>

                    <div style="position: relative; z-index: 1;">
                        <h2 style="font-size: 1.6rem; color: #fff; margin-bottom: 20px; font-weight: 900; background: linear-gradient(135deg, #3b82f6, #ec4899); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">🧠 لعبة الذاكرة</h2>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; font-size: 1.1rem; color: #cbd5e1; font-weight: 800; background: rgba(0,0,0,0.25); padding: 12px 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
                            <div>طابق <span style="color: #60a5fa; margin-right: 5px;">8 أزواج</span></div>
                            <div>النقاط <span style="color: #34d399; margin-right: 5px;" id="memoryScoreDisplay">0</span></div>
                        </div>

                        <div class="memory-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 10px; perspective: 1000px;" dir="ltr"></div>
                    </div>
                </div>
            </div>
        `;

        const memoryGrid = gameContent.querySelector('.memory-grid');
        this.memoryCards.forEach((cardData, index) => {
            const card = document.createElement('div');
            card.classList.add('memory-card-modern');
            card.style.cssText = `position: relative; width: 100%; aspect-ratio: 1; cursor: pointer; transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);`;
            card.dataset.index = index;

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-front-modern');
            cardFront.style.cssText = `position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #fff; background: rgba(59,130,246,0.15); border: 2px solid rgba(59,130,246,0.3); border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: all 0.3s;`;
            cardFront.innerHTML = '<i class="fas fa-question" style="color: #60a5fa; text-shadow: 0 0 10px rgba(96,165,250,0.5);"></i>';

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-back-modern');
            // Add word-break nicely
            cardBack.style.cssText = `position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: bold; color: #fff; background: rgba(236,72,153,0.15); border: 2px solid rgba(236,72,153,0.4); border-radius: 12px; transform: rotateY(180deg); box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: all 0.3s; text-align: center; line-height: 1.2; word-break: break-word; overflow-wrap: break-word; padding: 4px; box-sizing: border-box; text-shadow: 0 2px 4px rgba(0,0,0,0.5);`;

            cardBack.innerHTML = cardData.value; // Fixes the raw html string crash by assigning html instead of text

            card.appendChild(cardFront);
            card.appendChild(cardBack);

            // Hover effects
            cardFront.addEventListener('mouseenter', () => {
                if (!card.classList.contains('flipped') && !card.classList.contains('matched')) {
                    cardFront.style.background = 'rgba(59,130,246,0.25)';
                    cardFront.style.transform = 'scale(1.05)';
                }
            });
            cardFront.addEventListener('mouseleave', () => {
                cardFront.style.background = 'rgba(59,130,246,0.15)';
                cardFront.style.transform = 'scale(1)';
            });

            card.addEventListener('click', () => this.flipMemoryCard(card));
            memoryGrid.appendChild(card);
        });
    }

    flipMemoryCard(card) {
        if (this.memoryIsChecking || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        card.classList.add('flipped');
        card.style.transform = 'rotateY(180deg)'; // Apply rotation

        // Remove hover scale slightly when turned
        card.querySelector('.card-front-modern').style.transform = 'scale(1)';

        this.memoryFlippedCards.push(card);

        if (this.memoryFlippedCards.length === 2) {
            this.memoryIsChecking = true;
            setTimeout(() => this.checkMemoryMatch(), 800); // reduced delay for better feeling
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

            // Success indication
            [card1, card2].forEach(c => {
                const back = c.querySelector('.card-back-modern');
                back.style.background = 'rgba(16, 185, 129, 0.2)';
                back.style.borderColor = '#10b981';
                back.style.boxShadow = '0 0 15px rgba(16,185,129,0.4)';
                c.style.transform = 'rotateY(180deg) scale(1.1)';
            });

            setTimeout(() => {
                card1.style.transform = 'rotateY(180deg) scale(1)';
                card2.style.transform = 'rotateY(180deg) scale(1)';
            }, 300);

            this.memoryMatchedPairs++;
        } else {
            this.memoryScore = Math.max(0, this.memoryScore - 2);

            // Error indication
            [card1, card2].forEach(c => {
                const back = c.querySelector('.card-back-modern');
                back.style.background = 'rgba(239, 68, 68, 0.2)';
                back.style.borderColor = '#ef4444';
            });

            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.style.transform = 'rotateY(0deg)';
                card2.style.transform = 'rotateY(0deg)';

                // Clear error styling
                [card1, card2].forEach(c => {
                    const back = c.querySelector('.card-back-modern');
                    back.style.background = 'rgba(236,72,153,0.15)';
                    back.style.borderColor = 'rgba(236,72,153,0.4)';
                });
            }, 600);
        }

        document.getElementById('memoryScoreDisplay').textContent = this.memoryScore;
        this.memoryFlippedCards = [];
        this.memoryIsChecking = false;

        if (this.memoryMatchedPairs === 8) {
            setTimeout(() => {
                this.endGame(true, this.memoryScore);
            }, 500);
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
            <div class="quick-math-wrapper" style="display:flex; justify-content:center; align-items:flex-start; width: 100%; height: 100%; padding: 10px; box-sizing: border-box; overflow-y: auto;">
                <div class="operations-card" style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 25px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); width: 100%; max-width: 450px; text-align: center; position: relative; overflow: hidden; margin-top: 10px; margin-bottom: 20px;">
                    
                    <!-- الزخرفات الخلفية -->
                    <div style="position: absolute; top: -40px; right: -40px; width: 120px; height: 120px; background: rgba(52, 211, 153, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>
                    <div style="position: absolute; bottom: -40px; left: -40px; width: 120px; height: 120px; background: rgba(59, 130, 246, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>

                    <div style="position: relative; z-index: 1;">
                        <!-- العنوان -->
                        <h2 style="font-size: 1.6rem; color: #fff; margin-bottom: 20px; font-weight: 900; background: linear-gradient(135deg, #10b981, #3b82f6); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">🧮 الحساب السريع</h2>
                        
                        <!-- الإحصائيات مع المؤقت -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; font-size: 1.1rem; color: #cbd5e1; font-weight: 800; background: rgba(0,0,0,0.25); padding: 12px 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
                            <div>المستوى <span style="color: #60a5fa; margin-right: 5px;">${level}</span></div>
                            <div style="display: flex; align-items: center; gap: 5px; background: rgba(245, 158, 11, 0.1); padding: 5px 12px; border-radius: 12px; border: 1px solid rgba(245, 158, 11, 0.2);">
                                <i class="fas fa-hourglass-half" style="color: #f59e0b; margin-left: 5px;"></i>
                                <span id="quickMathTimerDisplay" style="color: #fcd34d; font-size: 1.3rem;">${timeLimit}</span>s
                            </div>
                        </div>
                        
                        <!-- السؤال -->
                        <div id="quickMathQuestionBox" style="font-size: 3.5rem; color: #fff; font-weight: 900; letter-spacing: 2px; margin: 25px 0; text-shadow: 0 0 20px rgba(52,211,153,0.5); transition: all 0.3s;" dir="ltr">
                            ${num1} + ${num2}
                        </div>
                        
                        <!-- الإدخال والتحقق -->
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <input type="number" id="quickMathAnswer" style="width: 100%; box-sizing: border-box; padding: 14px 20px; border-radius: 16px; border: 2px solid rgba(255,255,255,0.15); background: rgba(0,0,0,0.4); color: #fff; font-size: 1.6rem; font-weight: 800; text-align: center; outline: none; transition: all 0.3s; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);" placeholder="أدخل الناتج" autofocus autocomplete="off">
                            <button id="checkQuickMathBtn" style="width: 100%; padding: 14px; border-radius: 16px; background: linear-gradient(135deg, #10b981, #059669); border: none; color: white; font-size: 1.2rem; font-weight: 900; cursor: pointer; transition: all 0.2s; box-shadow: 0 8px 15px rgba(16,185,129,0.3); letter-spacing: 1px;">
                                تأكيد سريع
                            </button>
                        </div>
                        <p style="margin-top: 12px; margin-bottom: 0px; font-size: 0.8rem; color: rgba(255,255,255,0.4); font-weight: bold;">(اضغط Enter لكسب الوقت)</p>
                    </div>
                </div>
            </div>
        `;

        const btn = document.getElementById('checkQuickMathBtn');
        const input = document.getElementById('quickMathAnswer');

        btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-2px)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0)');
        input.addEventListener('focus', () => {
            input.style.borderColor = '#10b981';
            input.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.3), inset 0 2px 5px rgba(0,0,0,0.2)';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = 'rgba(255,255,255,0.15)';
            input.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.2)';
        });

        btn.addEventListener('click', () => this.checkQuickMathAnswer(correctAnswer, level));
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.checkQuickMathAnswer(correctAnswer, level);
        });

        let timeLeft = timeLimit;
        const timerElement = document.getElementById('quickMathTimerDisplay');

        // Timer Animation CSS (Injecting dynamically safely if not exists)
        if (!document.getElementById('pulseAnimStyle')) {
            const style = document.createElement('style');
            style.id = 'pulseAnimStyle';
            style.innerHTML = `@keyframes dangerPulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } }`;
            document.head.appendChild(style);
        }

        this.gameInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            if (timeLeft <= 3) {
                timerElement.style.color = '#ef4444';
                timerElement.style.animation = 'dangerPulse 0.5s infinite';
                timerElement.parentElement.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                timerElement.parentElement.style.background = 'rgba(239, 68, 68, 0.1)';
            }
            if (timeLeft <= 0) {
                clearInterval(this.gameInterval);
                input.disabled = true;
                btn.disabled = true;
                this.showGameResult('⏰ لقد انتهى الوقت!', false);
            }
        }, 1000);
    }

    checkQuickMathAnswer(correctAnswer, level) {
        if (this.gameInterval) clearInterval(this.gameInterval);
        const input = document.getElementById('quickMathAnswer');
        const btn = document.getElementById('checkQuickMathBtn');
        const questionBox = document.getElementById('quickMathQuestionBox');

        if (input.disabled) return;

        const userAnswer = parseInt(input.value);
        input.disabled = true;
        btn.disabled = true;

        if (userAnswer === correctAnswer) {
            input.style.background = 'rgba(16, 185, 129, 0.2)';
            input.style.borderColor = '#10b981';
            input.style.color = '#10b981';
            questionBox.style.transform = 'scale(1.1)';
            questionBox.style.color = '#34d399';
            questionBox.style.textShadow = '0 0 30px rgba(16,185,129,0.7)';

            const baseScore = 20;
            const levelBonus = level * 5;
            const timeBonus = 10; // مكافأة إضافية للإجابة السريعة
            const totalScore = baseScore + levelBonus + timeBonus;

            // زيادة المستوى
            const newLevel = this.increaseLevel('الحساب السريع');

            setTimeout(() => {
                this.showGameResult(`🎉 إجابة سريعة وصحيحة! +${totalScore} نقطة`, true);
                this.endGame(true, totalScore);

                // عرض رسالة المستوى الجديد
                if (newLevel > level) {
                    setTimeout(() => {
                        this.showLevelUpMessage(newLevel);
                    }, 1000);
                }
            }, 600);

        } else {
            input.style.background = 'rgba(239, 68, 68, 0.2)';
            input.style.borderColor = '#ef4444';
            input.style.color = '#ef4444';
            questionBox.style.color = '#ef4444';

            document.querySelector('.operations-card').animate([
                { transform: 'translateX(0)' }, { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' },
                { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(0)' }
            ], { duration: 400 });

            setTimeout(() => {
                this.showGameResult(`❌ إجابة خاطئة. الصحيح هو: ${correctAnswer}`, false);
            }, 800);
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
            <div class="sort-wrapper" style="display:flex; justify-content:center; align-items:flex-start; width: 100%; height: 100%; padding: 10px; box-sizing: border-box; overflow-y: auto;">
                <div class="operations-card" style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 25px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); width: 100%; max-width: 450px; text-align: center; position: relative; overflow: hidden; margin-top: 10px; margin-bottom: 20px;">
                    
                    <!-- الزخرفات الخلفية -->
                    <div style="position: absolute; top: -40px; right: -40px; width: 120px; height: 120px; background: rgba(249, 115, 22, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>
                    <div style="position: absolute; bottom: -40px; left: -40px; width: 120px; height: 120px; background: rgba(168, 85, 247, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>

                    <div style="position: relative; z-index: 1;">
                        <h2 style="font-size: 1.6rem; color: #fff; margin-bottom: 20px; font-weight: 900; background: linear-gradient(135deg, #f97316, #a855f7); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">🔢 ترتيب الأعداد</h2>
                        
                        <p style="color: #cbd5e1; font-size: 1.1rem; margin-bottom: 20px; font-weight: bold;">رتب الأعداد التالية من <span style="color: #f97316">الأصغر</span> إلى <span style="color: #a855f7">الأكبر</span>:</p>
                        
                        <div id="numbersDisplayBox" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-bottom: 30px; transition: transform 0.3s;" dir="ltr">
                            ${numbers.map(n => `<div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); padding: 12px 18px; border-radius: 12px; color: #fff; font-size: 1.6rem; font-weight: 900; box-shadow: 0 4px 10px rgba(0,0,0,0.2); text-shadow: 0 2px 5px rgba(0,0,0,0.5);">${n}</div>`).join('')}
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <input type="text" id="numberSortInput" style="width: 100%; box-sizing: border-box; padding: 14px 20px; border-radius: 16px; border: 2px solid rgba(255,255,255,0.15); background: rgba(0,0,0,0.4); color: #fff; font-size: 1.4rem; font-weight: 800; text-align: center; outline: none; transition: all 0.3s; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);" placeholder="مثال: 12, 45, 89" autofocus autocomplete="off" dir="ltr">
                            <button id="checkNumberSortBtn" style="width: 100%; padding: 14px; border-radius: 16px; background: linear-gradient(135deg, #f97316, #a855f7); border: none; color: white; font-size: 1.2rem; font-weight: 900; cursor: pointer; transition: all 0.2s; box-shadow: 0 8px 15px rgba(249, 115, 22, 0.3); letter-spacing: 1px;">
                                تحقق من الترتيب
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const btn = document.getElementById('checkNumberSortBtn');
        const input = document.getElementById('numberSortInput');

        btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-2px)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0)');
        input.addEventListener('focus', () => {
            input.style.borderColor = '#f97316';
            input.style.boxShadow = '0 0 15px rgba(249, 115, 22, 0.3), inset 0 2px 5px rgba(0,0,0,0.2)';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = 'rgba(255,255,255,0.15)';
            input.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.2)';
        });

        btn.addEventListener('click', () => this.checkNumberSortAnswer(sortedNumbers));
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.checkNumberSortAnswer(sortedNumbers);
        });
    }

    checkNumberSortAnswer(sortedNumbers) {
        const input = document.getElementById('numberSortInput');
        const btn = document.getElementById('checkNumberSortBtn');
        const displayBox = document.getElementById('numbersDisplayBox');

        if (input.disabled) return;

        const userInput = input.value;
        // تقبل الفواصل العادية والعربية والمسافات للتسهيل
        const userArray = userInput.split(/[,،\s]+/).map(s => parseInt(s.trim())).filter(n => !isNaN(n));

        input.disabled = true;
        btn.disabled = true;

        if (JSON.stringify(userArray) === JSON.stringify(sortedNumbers)) {
            input.style.background = 'rgba(16, 185, 129, 0.2)';
            input.style.borderColor = '#10b981';
            input.style.color = '#10b981';
            displayBox.style.transform = 'scale(1.05)';

            // تلوين الأرقام كإجابة صحيحة
            Array.from(displayBox.children).forEach(child => {
                child.style.background = 'rgba(16, 185, 129, 0.4)';
                child.style.borderColor = '#10b981';
                child.style.boxShadow = '0 0 15px rgba(16,185,129,0.5)';
            });

            setTimeout(() => {
                this.showGameResult('🎉 ترتيب صحيح! أحسنت! +30 نقطة', true);
                this.endGame(true, 30);
            }, 600);
        } else {
            input.style.background = 'rgba(239, 68, 68, 0.2)';
            input.style.borderColor = '#ef4444';
            input.style.color = '#ef4444';

            document.querySelector('.operations-card').animate([
                { transform: 'translateX(0)' }, { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' },
                { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(0)' }
            ], { duration: 400 });

            setTimeout(() => {
                this.showGameResult(`❌ ترتيب خاطئ. الصحيح هو: ${sortedNumbers.join(', ')}`, false);
            }, 800);
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
            <div class="pattern-wrapper" style="display:flex; justify-content:center; align-items:flex-start; width: 100%; height: 100%; padding: 10px; box-sizing: border-box; overflow-y: auto;">
                <div class="operations-card" style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 25px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); width: 100%; max-width: 450px; text-align: center; position: relative; overflow: hidden; margin-top: 10px; margin-bottom: 20px;">
                    
                    <div style="position: absolute; top: -40px; right: -40px; width: 120px; height: 120px; background: rgba(14, 165, 233, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>
                    <div style="position: absolute; bottom: -40px; left: -40px; width: 120px; height: 120px; background: rgba(139, 92, 246, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>

                    <div style="position: relative; z-index: 1;">
                        <h2 style="font-size: 1.6rem; color: #fff; margin-bottom: 25px; font-weight: 900; background: linear-gradient(135deg, #0ea5e9, #8b5cf6); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">🧩 إكمال النمط</h2>
                        
                        <p style="color: #cbd5e1; font-size: 1.1rem; margin-bottom: 25px; font-weight: bold;">اكتشف النمط وأكمل التسلسل التالي:</p>
                        
                        <div id="patternSequenceBox" style="display: flex; justify-content: center; align-items: center; gap: 8px; margin-bottom: 35px; transition: transform 0.3s; flex-wrap: wrap;" dir="ltr">
                            ${sequence.map(n => `<div class="pattern-item" style="background: ${n === '?' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.08)'}; border: ${n === '?' ? '2px dashed #f59e0b' : '1px solid rgba(255,255,255,0.2)'}; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 12px; color: ${n === '?' ? '#fcd34d' : '#fff'}; font-size: 1.4rem; font-weight: 900; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">${n}</div>`).join(`
                                <div style="color: rgba(255,255,255,0.3); font-size: 1rem;"><i class="fas fa-arrow-right"></i></div>
                            `)}
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <input type="number" id="patternAnswer" style="width: 100%; box-sizing: border-box; padding: 14px 20px; border-radius: 16px; border: 2px solid rgba(255,255,255,0.15); background: rgba(0,0,0,0.4); color: #fff; font-size: 1.6rem; font-weight: 800; text-align: center; outline: none; transition: all 0.3s; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);" placeholder="أدخل الرقم المفقود" autofocus autocomplete="off">
                            <button id="checkPatternBtn" style="width: 100%; padding: 14px; border-radius: 16px; background: linear-gradient(135deg, #0ea5e9, #8b5cf6); border: none; color: white; font-size: 1.2rem; font-weight: 900; cursor: pointer; transition: all 0.2s; box-shadow: 0 8px 15px rgba(14, 165, 233, 0.3); letter-spacing: 1px;">
                                تحقق من النمط
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const btn = document.getElementById('checkPatternBtn');
        const input = document.getElementById('patternAnswer');

        btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-2px)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0)');
        input.addEventListener('focus', () => {
            input.style.borderColor = '#0ea5e9';
            input.style.boxShadow = '0 0 15px rgba(14, 165, 233, 0.3), inset 0 2px 5px rgba(0,0,0,0.2)';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = 'rgba(255,255,255,0.15)';
            input.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.2)';
        });

        btn.addEventListener('click', () => this.checkPatternAnswer(correctAnswer));
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.checkPatternAnswer(correctAnswer);
        });
    }

    checkPatternAnswer(correctAnswer) {
        const input = document.getElementById('patternAnswer');
        const btn = document.getElementById('checkPatternBtn');
        const displayBox = document.getElementById('patternSequenceBox');

        if (input.disabled) return;

        const userAnswer = parseInt(input.value);

        input.disabled = true;
        btn.disabled = true;

        if (userAnswer === correctAnswer) {
            input.style.background = 'rgba(16, 185, 129, 0.2)';
            input.style.borderColor = '#10b981';
            input.style.color = '#10b981';
            displayBox.style.transform = 'scale(1.05)';

            // Highlight the missing box with correct answer
            Array.from(displayBox.querySelectorAll('.pattern-item')).forEach(child => {
                if (child.innerText === '?') {
                    child.innerHTML = correctAnswer;
                    child.style.background = 'rgba(16, 185, 129, 0.4)';
                    child.style.borderColor = '#10b981';
                    child.style.color = '#fff';
                    child.style.boxShadow = '0 0 15px rgba(16,185,129,0.5)';
                }
            });

            setTimeout(() => {
                this.showGameResult('🎉 نمط صحيح! عمل رائع! +10 نقاط', true);
                this.endGame(true, 10);
            }, 600);
        } else {
            input.style.background = 'rgba(239, 68, 68, 0.2)';
            input.style.borderColor = '#ef4444';
            input.style.color = '#ef4444';

            document.querySelector('.operations-card').animate([
                { transform: 'translateX(0)' }, { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' },
                { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(0)' }
            ], { duration: 400 });

            setTimeout(() => {
                this.showGameResult(`❌ إجابة خاطئة. الرقم الصحيح هو: ${correctAnswer}`, false);
            }, 800);
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
        this.challengeTotalQuestions = 10; // زيادة عدد الأسئلة لتحدي أكبر
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

        const levelMultiplier = 1 + (this.challengeCurrentQuestion * 0.1);

        switch (operation) {
            case '+':
                num1 = Math.floor(Math.random() * 50 * levelMultiplier) + 10;
                num2 = Math.floor(Math.random() * 50 * levelMultiplier) + 10;
                answer = num1 + num2;
                question = `${num1} + ${num2}`;
                break;
            case '-':
                num1 = Math.floor(Math.random() * 50 * levelMultiplier) + 20;
                num2 = Math.floor(Math.random() * 20 * levelMultiplier) + 1;
                if (num1 < num2) [num1, num2] = [num2, num1]; // Ensure positive
                answer = num1 - num2;
                question = `${num1} - ${num2}`;
                break;
            case '*':
                num1 = Math.floor(Math.random() * 12) + 2;
                num2 = Math.floor(Math.random() * 10 * levelMultiplier) + 2;
                answer = num1 * num2;
                question = `${num1} × ${num2}`;
                break;
            case '/':
                answer = Math.floor(Math.random() * 12) + 2;
                num2 = Math.floor(Math.random() * 10) + 2;
                num1 = answer * num2;
                question = `${num1} ÷ ${num2}`;
                break;
        }

        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="operations-wrapper" style="display:flex; justify-content:center; align-items:flex-start; width: 100%; height: 100%; padding: 10px; box-sizing: border-box; overflow-y: auto;">
                <div class="operations-card" style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 25px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); width: 100%; max-width: 450px; text-align: center; position: relative; overflow: hidden; margin-top: 10px; margin-bottom: 20px;">
                    
                    <!-- الزخرفات الخلفية -->
                    <div style="position: absolute; top: -40px; left: -40px; width: 120px; height: 120px; background: rgba(244, 114, 182, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>
                    <div style="position: absolute; bottom: -40px; right: -40px; width: 120px; height: 120px; background: rgba(129, 140, 248, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>

                    <div style="position: relative; z-index: 1;">
                        <!-- العنوان -->
                        <h2 style="font-size: 1.6rem; color: #fff; margin-bottom: 20px; font-weight: 900; background: linear-gradient(135deg, #f472b6, #818cf8); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">تحدي العمليات ⚡</h2>
                        
                        <!-- الإحصائيات -->
                        <div style="display: flex; justify-content: space-between; margin-bottom: 25px; font-size: 1.1rem; color: #cbd5e1; font-weight: 800; background: rgba(0,0,0,0.25); padding: 12px 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
                            <div>السؤال <span style="color: #60a5fa; margin-right: 5px;">${this.challengeCurrentQuestion}/${this.challengeTotalQuestions}</span></div>
                            <div>النقاط <span style="color: #34d399; margin-right: 5px;" id="operScoreDisplay">${this.challengeScore}</span></div>
                        </div>
                        
                        <!-- السؤال -->
                        <div id="operationQuestionBox" style="font-size: 3rem; color: #fff; font-weight: 900; letter-spacing: 2px; margin: 25px 0; text-shadow: 0 0 20px rgba(96,165,250,0.6); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);" dir="ltr">
                            ${question}
                        </div>
                        
                        <!-- الإدخال والتحقق -->
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <input type="number" id="challengeAnswer" style="width: 100%; box-sizing: border-box; padding: 14px 20px; border-radius: 16px; border: 2px solid rgba(255,255,255,0.15); background: rgba(0,0,0,0.4); color: #fff; font-size: 1.6rem; font-weight: 800; text-align: center; outline: none; transition: all 0.3s; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);" placeholder="?" autofocus autocomplete="off">
                            
                            <button id="checkChallengeBtn" style="width: 100%; padding: 14px; border-radius: 16px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border: none; color: white; font-size: 1.2rem; font-weight: 900; cursor: pointer; transition: all 0.2s; box-shadow: 0 8px 15px rgba(59,130,246,0.3); letter-spacing: 1px;">
                                تحقق
                            </button>
                        </div>
                        
                        <!-- تلميح للإدخال -->
                        <p style="margin-top: 12px; margin-bottom: 0px; font-size: 0.8rem; color: rgba(255,255,255,0.4); font-weight: bold;">اضغط على Enter للتحقق بسرعة</p>
                    </div>
                </div>
            </div>
        `;

        const btn = document.getElementById('checkChallengeBtn');
        const input = document.getElementById('challengeAnswer');

        // تأثيرات Hover للزر
        btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-2px)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0)');
        input.addEventListener('focus', () => {
            input.style.borderColor = '#818cf8';
            input.style.boxShadow = '0 0 15px rgba(129, 140, 248, 0.3), inset 0 2px 5px rgba(0,0,0,0.2)';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = 'rgba(255,255,255,0.15)';
            input.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.2)';
        });

        // ربط الأحداث
        btn.addEventListener('click', () => this.checkChallengeAnswer(answer));
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.checkChallengeAnswer(answer);
        });
    }

    checkChallengeAnswer(correctAnswer) {
        const input = document.getElementById('challengeAnswer');
        const btn = document.getElementById('checkChallengeBtn');
        const questionBox = document.getElementById('operationQuestionBox');

        // منع الضغط المتكرر
        if (input.disabled) return;

        const userAnswer = parseInt(input.value);
        input.disabled = true;
        btn.disabled = true;

        if (userAnswer === correctAnswer) {
            // إجابة صحيحة
            this.challengeScore += 10;
            document.getElementById('operScoreDisplay').textContent = this.challengeScore;

            input.style.background = 'rgba(16, 185, 129, 0.2)'; // أخضر
            input.style.borderColor = '#10b981';
            input.style.color = '#10b981';
            questionBox.style.transform = 'scale(1.1)';
            questionBox.style.color = '#34d399';
            questionBox.style.textShadow = '0 0 30px rgba(16,185,129,0.7)';

            setTimeout(() => {
                this.generateChallengeQuestion();
            }, 600);

        } else {
            // إجابة خاطئة
            input.style.background = 'rgba(239, 68, 68, 0.2)'; // أحمر
            input.style.borderColor = '#ef4444';
            input.style.color = '#ef4444';

            // اهتزاز للنافذة (Shake)
            document.querySelector('.operations-card').animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(0)' }
            ], { duration: 400 });

            setTimeout(() => {
                input.value = '';
                input.style.background = 'rgba(0,0,0,0.4)';
                input.style.borderColor = 'rgba(255,255,255,0.15)';
                input.style.color = '#fff';
                input.disabled = false;
                btn.disabled = false;
                input.focus();
            }, 800);
        }
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
            <div class="pattern-wrapper" style="display:flex; justify-content:center; align-items:flex-start; width: 100%; height: 100%; padding: 10px; box-sizing: border-box; overflow-y: auto;">
                <div class="operations-card" style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 25px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); width: 100%; max-width: 480px; text-align: center; position: relative; overflow: hidden; margin-top: 10px; margin-bottom: 20px;">
                    
                    <div style="position: absolute; top: -40px; right: -40px; width: 120px; height: 120px; background: rgba(244, 63, 94, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>
                    <div style="position: absolute; bottom: -40px; left: -40px; width: 120px; height: 120px; background: rgba(217, 70, 239, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>

                    <div style="position: relative; z-index: 1;">
                        <h2 style="font-size: 1.6rem; color: #fff; margin-bottom: 25px; font-weight: 900; background: linear-gradient(135deg, #f43f5e, #d946ef); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">⚖️ موازنة المعادلات</h2>
                        
                        <p style="color: #cbd5e1; font-size: 1.1rem; margin-bottom: 25px; font-weight: bold;">أوجد قيمة <span style="color: #f43f5e; font-size: 1.3rem;">X</span> لتحقيق توازن المعادلة:</p>
                        
                        <div id="equationDisplayBox" style="display: flex; justify-content: space-evenly; align-items: center; margin-bottom: 35px; background: rgba(0,0,0,0.25); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); transition: transform 0.3s;" dir="ltr">
                            <div style="flex: 1;text-align: center; color: #fff; font-size: 2.2rem; font-weight: 900; text-shadow: 0 0 15px rgba(244,63,94,0.5);">${formatTextWithMath(equation.left)}</div>
                            <div style="flex: 0; color: #d946ef; font-size: 2.5rem; font-weight: 900; margin: 0 15px;">=</div>
                            <div style="flex: 1;text-align: center; color: #fff; font-size: 2.2rem; font-weight: 900; text-shadow: 0 0 15px rgba(217,70,239,0.5);">${formatTextWithMath(equation.right)}</div>
                        </div>
                        
                        <div style="display: flex; gap: 12px; margin-bottom: 15px; justify-content: center; align-items: stretch;" dir="ltr">
                            <div style="background: rgba(244,63,94,0.2); border: 1px solid rgba(244,63,94,0.4); border-radius: 12px; display: flex; align-items: center; justify-content: center; padding: 0 20px; color: #fff; font-size: 1.5rem; font-weight: 900;">X =</div>
                            <input type="number" id="balanceAnswer" style="flex: 1; min-width: 0; box-sizing: border-box; padding: 14px 20px; border-radius: 12px; border: 2px solid rgba(255,255,255,0.15); background: rgba(0,0,0,0.4); color: #fff; font-size: 1.6rem; font-weight: 800; text-align: center; outline: none; transition: all 0.3s; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);" placeholder="?" autofocus autocomplete="off">
                        </div>

                        <button id="checkBalanceBtn" style="width: 100%; padding: 14px; border-radius: 16px; background: linear-gradient(135deg, #f43f5e, #d946ef); border: none; color: white; font-size: 1.2rem; font-weight: 900; cursor: pointer; transition: all 0.2s; box-shadow: 0 8px 15px rgba(244, 63, 94, 0.3); letter-spacing: 1px;">
                            تحقق من المعادلة
                        </button>
                    </div>
                </div>
            </div>
        `;

        const btn = document.getElementById('checkBalanceBtn');
        const input = document.getElementById('balanceAnswer');

        btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-2px)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0)');
        input.addEventListener('focus', () => {
            input.style.borderColor = '#f43f5e';
            input.style.boxShadow = '0 0 15px rgba(244, 63, 94, 0.3), inset 0 2px 5px rgba(0,0,0,0.2)';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = 'rgba(255,255,255,0.15)';
            input.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.2)';
        });

        btn.addEventListener('click', () => this.checkBalancingEquationAnswer(equation.answer));
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.checkBalancingEquationAnswer(equation.answer);
        });
    }

    checkBalancingEquationAnswer(correctAnswer) {
        const input = document.getElementById('balanceAnswer');
        const btn = document.getElementById('checkBalanceBtn');
        const displayBox = document.getElementById('equationDisplayBox');

        if (input.disabled) return;

        const userAnswer = parseInt(input.value);

        input.disabled = true;
        btn.disabled = true;

        if (userAnswer === correctAnswer) {
            input.style.background = 'rgba(16, 185, 129, 0.2)';
            input.style.borderColor = '#10b981';
            input.style.color = '#10b981';
            displayBox.style.transform = 'scale(1.05)';

            displayBox.style.background = 'rgba(16, 185, 129, 0.2)';
            displayBox.style.borderColor = '#10b981';
            displayBox.style.boxShadow = '0 0 20px rgba(16,185,129,0.3)';

            setTimeout(() => {
                this.showGameResult('🎉 إجابة صحيحة! لقد وازنت المعادلة بنجاح. +25 نقطة', true);
                this.endGame(true, 25);
            }, 600);
        } else {
            input.style.background = 'rgba(239, 68, 68, 0.2)';
            input.style.borderColor = '#ef4444';
            input.style.color = '#ef4444';

            document.querySelector('.operations-card').animate([
                { transform: 'translateX(0)' }, { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' },
                { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(0)' }
            ], { duration: 400 });

            setTimeout(() => {
                this.showGameResult(`❌ إجابة خاطئة. القيمة الصحيحة لـ X هي ${correctAnswer}.`, false);
            }, 800);
        }
    }

    // --- لعبة المسائل الكلامية (Word Problems) --- //
    generateWordProblemGame() {
        const problems = [
            { question: "اشترت فاطمة 3 دفاتر بسعر 50 دينارًا جزائريًا للدفتر الواحد. كم المبلغ الإجمالي الذي دفعته؟", answer: 150 },
            { question: "يوجد في حافلة 45 راكبًا. نزل منهم 18 راكبًا في المحطة الأولى. كم راكبًا بقي في الحافلة؟", answer: 27 },
            { question: "يقرأ كريم 15 صفحة من كتاب كل يوم. كم صفحة سيقرأ في 7 أيام؟", answer: 105 },
            { question: "إذا كان سعر تذكرة حديقة الحيوانات 200 دينار جزائري للطفل، فما هو سعر التذاكر لـ 4 أطفال؟", answer: 800 },
            { question: "عمر الأب 42 سنة، وعمر ابنه سُبع (1/7) عمره. كم عمر الابن؟", answer: 6 },
            { question: "اشترى علي كتابًا بسعر 450 دينارًا ومجموعة أقلام بسعر 150 دينارًا. إذا أعطى للبائع 1000 دينار، كم سيعيد له البائع؟", answer: 400 },
            { question: "تريد معلمة توزيع 96 قلمًا بالتساوي على 8 تلاميذ. كم قلمًا سيحصل عليه كل تلميذ؟", answer: 12 },
            { question: "في مزرعة 15 خروفًا و ضعف هذا العدد من الدجاج. كم دجاجة في المزرعة؟", answer: 30 },
            { question: "كيس من الدقيق يزن 25 كغ. استهلك الخباز منه 14 كغ. كم كيلوغرامًا بقي في الكيس؟", answer: 11 },
            { question: "ادخر سمير 300 دينار كل شهر لمدة 5 أشهر، كم ديناراً جمع سمير إجمالاً؟", answer: 1500 }
        ];

        // نظام منع تكرار المسائل قبل استكمالها
        if (!this.unseenWordProblems || this.unseenWordProblems.length === 0) {
            this.unseenWordProblems = [...problems];
        }

        const problemIndex = Math.floor(Math.random() * this.unseenWordProblems.length);
        const problem = this.unseenWordProblems.splice(problemIndex, 1)[0];

        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <style>
                .word-problem-input {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 15px;
                    margin-top: 30px;
                }
                .answer-input {
                    padding: 15px 20px;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: white;
                    background: rgba(0, 0, 0, 0.3);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    outline: none;
                    text-align: center;
                    width: 200px;
                    transition: all 0.3s;
                    font-family: inherit;
                    box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);
                }
                .answer-input:focus {
                    border-color: #8b5cf6;
                    box-shadow: 0 0 15px rgba(139, 92, 246, 0.5), inset 0 2px 10px rgba(0,0,0,0.2);
                    background: rgba(139, 92, 246, 0.1);
                }
            </style>
            <div style="display:flex; justify-content:center; align-items:center; width: 100%; height: 100%; padding: 20px; box-sizing: border-box;">
                <div class="operations-card" style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 40px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); width: 100%; max-width: 750px; text-align: center; position: relative; overflow: hidden;">
                    
                    <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(59, 130, 246, 0.2); filter: blur(40px); border-radius: 50%; z-index: 0;"></div>
                    <div style="position: absolute; bottom: -50px; left: -50px; width: 150px; height: 150px; background: rgba(139, 92, 246, 0.2); filter: blur(40px); border-radius: 50%; z-index: 0;"></div>

                    <div style="position: relative; z-index: 1;">
                        <h2 style="font-size: 1.8rem; color: #fff; margin-bottom: 25px; font-weight: 900; background: linear-gradient(135deg, #60a5fa, #c084fc); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">📝 المسائل الكلامية</h2>
                        
                        <div style="background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 30px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);">
                            <h3 style="color: #93c5fd; font-size: 1.2rem; margin-bottom: 20px;">حل المسألة التالية:</h3>
                            <p class="problem-text" style="font-size: 1.4rem; color: #f8fafc; line-height: 1.8; text-shadow: 0 2px 5px rgba(0,0,0,0.5); font-weight: bold;">${formatTextWithMath(problem.question)}</p>
                            
                            <div class="word-problem-input">
                                <input type="number" id="wordProblemAnswer" class="answer-input" placeholder="النتيجة" autofocus>
                                <button id="checkWordProblemBtn" class="btn btn-primary" style="padding: 15px 30px; border-radius: 16px; font-size: 1.2rem; font-weight: 900; background: linear-gradient(135deg, #8b5cf6, #3b82f6); border: none; color: white; cursor: pointer; transition: all 0.3s; box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);">تحقق من الإجابة</button>
                            </div>
                        </div>

                    </div>
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
            { question: "اشترى أحمد 3 كتب بسعر 250 دينارًا للكتاب الواحد، و 5 أقلام بسعر 30 دينارًا للقلم. كم دفع أحمد إجمالًا؟", answer: 900 },
            { question: "كان مع سارة 2000 دينار. اشترت فستانًا بسعر 1200 دينار وحقيبة بنصف سعر الفستان. كم بقي معها؟", answer: 200 },
            { question: "يوزع فلاح 120 بيضة في أطباق، كل طبق يتسع لـ 6 بيضات. إذا باع كل طبق بسعر 150 دينارًا، فكم سيجني من بيع كل البيض؟", answer: 3000 },
            { question: "خزان مياه سعته 500 لتر، ممتلئ إلى نصفه. استُهلك منه 120 لتراً. كم لتراً يجب إضافتها ليمتلئ الخزان بالكامل من جديد؟", answer: 370 },
            { question: "تنتج آلة 45 قطعة في الساعة. كم قطعة ستُنتج في 8 ساعات عمل إذا توقفت عن العمل لمدة ساعتين للصيانة؟", answer: 270 },
            { question: "اشترى تاجر 20 صندوقاً من التفاح، يحتوي كل صندوق على 15 تفاحة. وجد 5 صناديق فاسدة فرمى ما فيها. كم تفاحة صالحة بقيت للبيع؟", answer: 225 },
            { question: "تتقاضى ليلى 1500 دينار يومياً. إذا عملت 20 يوماً وصرفت ثلث ما كسبته، فكم ديناراً بقي لها؟", answer: 20000 },
            { question: "يقطع قطار مسافة 400 كم في رحلة، ثم يتوقف. إذا كرر هذه الرحلة 4 مرات في الأسبوع، كم كيلومتراً سيقطع في شهر واحد (4 أسابيع)؟", answer: 6400 }
        ];

        if (!this.unseenComplexProblems || this.unseenComplexProblems.length === 0) {
            this.unseenComplexProblems = [...problems];
        }

        const problemIndex = Math.floor(Math.random() * this.unseenComplexProblems.length);
        const problem = this.unseenComplexProblems.splice(problemIndex, 1)[0];

        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="complex-problem-wrapper" style="display:flex; justify-content:center; align-items:flex-start; width: 100%; height: 100%; padding: 10px; box-sizing: border-box; overflow-y: auto;">
                <div class="operations-card" style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 25px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); width: 100%; max-width: 550px; text-align: center; position: relative; overflow: hidden; margin-top: 10px; margin-bottom: 20px;">
                    
                    <div style="position: absolute; top: -40px; right: -40px; width: 120px; height: 120px; background: rgba(234, 179, 8, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>
                    <div style="position: absolute; bottom: -40px; left: -40px; width: 120px; height: 120px; background: rgba(239, 68, 68, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>

                    <div style="position: relative; z-index: 1;">
                        <h2 style="font-size: 1.6rem; color: #fff; margin-bottom: 25px; font-weight: 900; background: linear-gradient(135deg, #eab308, #ef4444); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">🧩 المسائل المعقدة</h2>
                        
                        <div id="complexProblemBox" style="background: rgba(0, 0, 0, 0.25); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 20px; margin-bottom: 30px; text-align: right; box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);">
                            <p style="color: #cbd5e1; font-size: 1.3rem; line-height: 1.6; margin: 0; font-weight: bold; text-shadow: 0 2px 5px rgba(0,0,0,0.5);">${formatTextWithMath(problem.question)}</p>
                        </div>
                        
                        <div style="display: flex; gap: 12px; margin-bottom: 15px; justify-content: center; align-items: stretch;" dir="ltr">
                            <input type="number" id="complexProblemAnswer" style="flex: 1; box-sizing: border-box; padding: 14px 20px; border-radius: 12px; border: 2px solid rgba(255,255,255,0.15); background: rgba(0,0,0,0.4); color: #fff; font-size: 1.6rem; font-weight: 800; text-align: center; outline: none; transition: all 0.3s; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);" placeholder="أدخل الجواب النهائي" autofocus autocomplete="off">
                        </div>

                        <button id="checkComplexProblemBtn" style="width: 100%; padding: 14px; border-radius: 16px; background: linear-gradient(135deg, #eab308, #ef4444); border: none; color: white; font-size: 1.2rem; font-weight: 900; cursor: pointer; transition: all 0.2s; box-shadow: 0 8px 15px rgba(234, 179, 8, 0.3); letter-spacing: 1px;">
                            تحقق من الإجابة
                        </button>
                    </div>
                </div>
            </div>
        `;

        const btn = document.getElementById('checkComplexProblemBtn');
        const input = document.getElementById('complexProblemAnswer');

        btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-2px)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0)');
        input.addEventListener('focus', () => {
            input.style.borderColor = '#eab308';
            input.style.boxShadow = '0 0 15px rgba(234, 179, 8, 0.3), inset 0 2px 5px rgba(0,0,0,0.2)';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = 'rgba(255,255,255,0.15)';
            input.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.2)';
        });

        btn.addEventListener('click', () => this.checkComplexProblemAnswer(problem.answer));
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.checkComplexProblemAnswer(problem.answer);
        });
    }

    checkComplexProblemAnswer(correctAnswer) {
        const input = document.getElementById('complexProblemAnswer');
        const btn = document.getElementById('checkComplexProblemBtn');
        const displayBox = document.getElementById('complexProblemBox');

        if (input.disabled) return;
        const userAnswer = parseInt(input.value);

        input.disabled = true;
        btn.disabled = true;

        if (userAnswer === correctAnswer) {
            input.style.background = 'rgba(16, 185, 129, 0.2)';
            input.style.borderColor = '#10b981';
            input.style.color = '#10b981';

            displayBox.style.background = 'rgba(16, 185, 129, 0.2)';
            displayBox.style.borderColor = '#10b981';
            displayBox.style.boxShadow = '0 0 20px rgba(16,185,129,0.3)';

            setTimeout(() => {
                this.showGameResult('🎉 إجابة صحيحة! ممتاز. +50 نقطة', true);
                this.endGame(true, 50);
            }, 600);
        } else {
            input.style.background = 'rgba(239, 68, 68, 0.2)';
            input.style.borderColor = '#ef4444';
            input.style.color = '#ef4444';

            document.querySelector('.operations-card').animate([
                { transform: 'translateX(0)' }, { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' },
                { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(0)' }
            ], { duration: 400 });

            setTimeout(() => {
                this.showGameResult(`❌ إجابة خاطئة. الجواب الصحيح هو ${correctAnswer}.`, false);
            }, 800);
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
        const shapes = ['rectangle', 'rightTriangle', 'circle'];
        let data = {};
        let safetyCounter = 0; // للحماية من الحلقات اللا نهائية

        // حلقة لضمان عدم تكرار نفس المسألة على التوالي
        do {
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            let questionType = Math.random() < 0.5 ? 'area' : 'perimeter';

            if (shape === 'rectangle') {
                const w = Math.floor(Math.random() * 15) + 3; // 3..17
                const h = Math.floor(Math.random() * 15) + 3; // 3..17
                const area = w * h;
                const perimeter = 2 * (w + h);
                data = { shape, w, h, questionType, correct: questionType === 'area' ? area : perimeter, uniqueId: `rect-${w}-${h}-${questionType}` };
            } else if (shape === 'rightTriangle') {
                // مثلث قائم الزاوية باستخدام ثلاثيات فيثاغورس وفروق التكبير
                const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [12, 16, 20]];
                const t = triples[Math.floor(Math.random() * triples.length)];
                const k = Math.floor(Math.random() * 3) + 1; // تكبير بين 1 و 3
                const a = t[0] * k, b = t[1] * k, c = t[2] * k;
                const area = (a * b) / 2;
                const perimeter = a + b + c;
                data = { shape, a, b, c, questionType, correct: questionType === 'area' ? area : perimeter, uniqueId: `tri-${a}-${b}-${questionType}` };
            } else {
                // Circle / Disk
                const r = Math.floor(Math.random() * 10) + 2; // 2..11
                // We use 3.14 as PI since it's common for school levels
                const area = 3.14 * r * r;
                const perimeter = 2 * 3.14 * r;
                data = { shape, r, questionType, correct: questionType === 'area' ? area : perimeter, uniqueId: `circ-${r}-${questionType}` };
            }
            safetyCounter++;
        } while (this.lastGeometryData && this.lastGeometryData === data.uniqueId && safetyCounter < 10);

        this.lastGeometryData = data.uniqueId;
        this.geoAP = data;

        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="geo-ap-wrapper" style="display:flex; justify-content:center; align-items:flex-start; width: 100%; height: 100%; padding: 10px; box-sizing: border-box; overflow-y: auto;">
                <div class="operations-card" style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 25px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); width: 100%; max-width: 500px; text-align: center; position: relative; overflow: hidden; margin-top: 10px; margin-bottom: 20px;">
                    
                    <div style="position: absolute; top: -40px; right: -40px; width: 120px; height: 120px; background: rgba(34, 197, 94, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>
                    <div style="position: absolute; bottom: -40px; left: -40px; width: 120px; height: 120px; background: rgba(59, 130, 246, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>

                    <div style="position: relative; z-index: 1;">
                        <h2 style="font-size: 1.6rem; color: #fff; margin-bottom: 25px; font-weight: 900; background: linear-gradient(135deg, #22c55e, #3b82f6); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">📏 مساحة ومحيط الأشكال</h2>
                        
                        <div style="background: rgba(255, 255, 255, 0.8); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 16px; padding: 10px; margin-bottom: 20px; text-align: center; box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);">
                            <canvas id="geoApCanvas" width="300" height="200" aria-label="رسم هندسي" style="max-width: 100%; height: auto; border-radius: 12px; filter: drop-shadow(0 0 10px rgba(0,0,0,0.1));"></canvas>
                        </div>
                        
                        <p class="geo-ap-question" id="geoApQuestion" style="color: #cbd5e1; font-size: 1.2rem; line-height: 1.6; margin-bottom: 20px; font-weight: bold; text-shadow: 0 2px 5px rgba(0,0,0,0.5);"></p>

                        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 15px;" dir="ltr">
                            <input type="number" id="geoApAnswer" style="width: 100%; box-sizing: border-box; padding: 14px 20px; border-radius: 16px; border: 2px solid rgba(255,255,255,0.15); background: rgba(0,0,0,0.4); color: #fff; font-size: 1.6rem; font-weight: 800; text-align: center; outline: none; transition: all 0.3s; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);" placeholder="أدخل الإجابة هنا" autofocus autocomplete="off">
                            <button id="geoApCheck" style="width: 100%; padding: 14px; border-radius: 16px; background: linear-gradient(135deg, #22c55e, #3b82f6); border: none; color: white; font-size: 1.2rem; font-weight: 900; cursor: pointer; transition: all 0.2s; box-shadow: 0 8px 15px rgba(34, 197, 94, 0.3); letter-spacing: 1px;">
                                تحقق من الإجابة
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // كتابة نص السؤال
        const qEl = document.getElementById('geoApQuestion');
        if (data.shape === 'rectangle') {
            qEl.textContent = data.questionType === 'area' ?
                `أوجد مساحة المستطيل (الطول = ${data.h}، العرض = ${data.w}).` :
                `أوجد محيط المستطيل (الطول = ${data.h}، العرض = ${data.w}).`;
        } else if (data.shape === 'rightTriangle') {
            qEl.textContent = data.questionType === 'area' ?
                `أوجد مساحة مثلث قائم (ضلعا القائمة: ${data.a} و ${data.b}).` :
                `أوجد محيط مثلث قائم (الأضلاع: ${data.a}، ${data.b}، ${data.c}).`;
        } else {
            qEl.textContent = data.questionType === 'area' ?
                `أوجد مساحة القرص (نصف القطر r = ${data.r}). (نعتبر π = 3.14)` :
                `أوجد محيط الدائرة (نصف القطر r = ${data.r}). (نعتبر π = 3.14)`;
        }

        // رسم الشكل
        this.drawGeoAPShape();

        // ربط الزر
        const btn = document.getElementById('geoApCheck');
        const input = document.getElementById('geoApAnswer');

        btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-2px)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0)');
        input.addEventListener('focus', () => {
            input.style.borderColor = '#22c55e';
            input.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.3), inset 0 2px 5px rgba(0,0,0,0.2)';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = 'rgba(255,255,255,0.15)';
            input.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.2)';
        });

        btn.addEventListener('click', () => this.checkGeometryAreaPerimeterAnswer());
        input.addEventListener('keyup', (e) => { if (e.key === 'Enter') this.checkGeometryAreaPerimeterAnswer(); });
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
        } else if (d.shape === 'rightTriangle') {
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
        } else {
            // Circle
            const rScaled = 60; // Fixed radius for drawing
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            ctx.beginPath();
            ctx.arc(cx, cy, rScaled, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();

            // Draw radius line
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + rScaled, cy);
            ctx.strokeStyle = '#e53e3e';
            ctx.stroke();

            // Point at center
            ctx.beginPath();
            ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
            ctx.fillStyle = '#e53e3e';
            ctx.fill();

            // Labels
            ctx.fillStyle = '#4a5568';
            ctx.fillText(`r = ${d.r}`, cx + rScaled / 2, cy - 8);
        }
    }

    checkGeometryAreaPerimeterAnswer() {
        const d = this.geoAP;
        const input = document.getElementById('geoApAnswer');
        const btn = document.getElementById('geoApCheck');
        const val = parseFloat(input.value);

        if (input.disabled) return;
        if (isNaN(val)) return;

        input.disabled = true;
        btn.disabled = true;

        if (Math.abs(val - d.correct) < 0.05) {
            input.style.background = 'rgba(16, 185, 129, 0.2)';
            input.style.borderColor = '#10b981';
            input.style.color = '#10b981';

            setTimeout(() => {
                this.showGameResult('🎉 إجابة صحيحة! أحسنت عملاً. +35 نقطة', true);
                this.endGame(true, 35);
            }, 600);
        } else {
            input.style.background = 'rgba(239, 68, 68, 0.2)';
            input.style.borderColor = '#ef4444';
            input.style.color = '#ef4444';

            document.querySelector('.operations-card').animate([
                { transform: 'translateX(0)' }, { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' },
                { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(0)' }
            ], { duration: 400 });

            setTimeout(() => {
                this.showGameResult(`❌ إجابة خاطئة. الإجابة الصحيحة هي ${d.correct}.`, false);
            }, 800);
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
            <div class="fractions-wrapper" style="display:flex; justify-content:center; align-items:flex-start; width: 100%; height: 100%; padding: 10px; box-sizing: border-box; overflow-y: auto;">
                <div class="operations-card" style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 25px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); width: 100%; max-width: 480px; text-align: center; position: relative; overflow: hidden; margin-top: 10px; margin-bottom: 20px;">
                    
                    <div style="position: absolute; top: -40px; right: -40px; width: 120px; height: 120px; background: rgba(234, 179, 8, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>
                    <div style="position: absolute; bottom: -40px; left: -40px; width: 120px; height: 120px; background: rgba(249, 115, 22, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>

                    <div style="position: relative; z-index: 1;">
                        <h2 style="font-size: 1.6rem; color: #fff; margin-bottom: 25px; font-weight: 900; background: linear-gradient(135deg, #eab308, #f97316); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">➗ لعبة الكسور</h2>
                        
                        <p style="color: #cbd5e1; font-size: 1.2rem; margin-bottom: 30px; font-weight: bold;">اضغط على الكسر الأكبر قيمة:</p>
                        
                        <div style="display: flex; justify-content: space-evenly; align-items: stretch; gap: 20px; margin-bottom: 25px;" dir="ltr">
                            <div class="fraction-option glass-box" data-value="${fraction1.value}" style="flex:1; padding: 20px; border-radius: 16px; background: rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.1); cursor: pointer; transition: all 0.3s; box-shadow: inset 0 2px 10px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; font-size: 2.2rem; color: #fff; font-weight: 900;">
                                ${fraction1.display}
                            </div>
                            <div class="fraction-option glass-box" data-value="${fraction2.value}" style="flex:1; padding: 20px; border-radius: 16px; background: rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.1); cursor: pointer; transition: all 0.3s; box-shadow: inset 0 2px 10px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; font-size: 2.2rem; color: #fff; font-weight: 900;">
                                ${fraction2.display}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;

        document.querySelectorAll('.fraction-option').forEach(el => {
            el.addEventListener('mouseenter', () => { el.style.background = 'rgba(234,179,8,0.15)'; el.style.borderColor = '#eab308'; el.style.transform = 'translateY(-3px)'; });
            el.addEventListener('mouseleave', () => { el.style.background = 'rgba(0,0,0,0.3)'; el.style.borderColor = 'rgba(255,255,255,0.1)'; el.style.transform = 'translateY(0)'; });
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
        if (selectedElement.style.pointerEvents === 'none') return;

        const selectedValue = parseFloat(selectedElement.dataset.value);
        const { fraction1, fraction2 } = this.fractionsData;
        const correctAnswer = Math.max(fraction1.value, fraction2.value);

        document.querySelectorAll('.fraction-option').forEach(el => {
            el.style.pointerEvents = 'none';
        });

        if (selectedValue === correctAnswer) {
            selectedElement.style.background = 'rgba(16, 185, 129, 0.2)';
            selectedElement.style.borderColor = '#10b981';
            selectedElement.style.color = '#10b981';

            setTimeout(() => {
                this.showGameResult('🎉 إجابة صحيحة! أحسنت. +20 نقطة', true);
                this.endGame(true, 20);
            }, 600);
        } else {
            selectedElement.style.background = 'rgba(239, 68, 68, 0.2)';
            selectedElement.style.borderColor = '#ef4444';
            selectedElement.style.color = '#ef4444';

            document.querySelector('.operations-card').animate([
                { transform: 'translateX(0)' }, { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' },
                { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(0)' }
            ], { duration: 400 });

            setTimeout(() => {
                this.showGameResult(`❌ إجابة خاطئة. الكسر الأكبر هو ${correctAnswer === fraction1.value ? fraction1.display : fraction2.display}`, false);
            }, 800);
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
            <style>
                .magic-square-board {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 20px;
                    border-radius: 20px;
                    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    margin: auto;
                }

                .magic-square-cell {
                    width: 70px;
                    height: 70px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    color: #fff;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                }

                .magic-square-cell:hover {
                    background: rgba(255, 255, 255, 0.15);
                    transform: translateY(-2px);
                    border-color: rgba(255,255,255,0.4);
                }

                .magic-square-cell.selected {
                    background: rgba(168, 85, 247, 0.2);
                    color: white;
                    border-color: #a855f7;
                    transform: scale(1.05);
                    box-shadow: 0 6px 20px rgba(168, 85, 247, 0.4);
                    z-index: 2;
                }

                .magic-square-cell.given {
                    background: rgba(59, 130, 246, 0.2);
                    color: #93c5fd;
                    border-color: rgba(59, 130, 246, 0.5);
                    cursor: not-allowed;
                }

                .magic-square-cell.user {
                    background: rgba(234, 179, 8, 0.2);
                    color: #fde047;
                    border-color: rgba(234, 179, 8, 0.5);
                }

                .magic-square-keypad {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                }

                .magic-square-key {
                    background: rgba(0, 0, 0, 0.3);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    font-size: 1.5rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                    padding: 15px;
                }

                .magic-square-key:hover {
                    transform: translateY(-3px);
                    background: rgba(168, 85, 247, 0.2);
                    border-color: #a855f7;
                    box-shadow: 0 6px 15px rgba(168, 85, 247, 0.3);
                }
                
                .magic-square-key.erase {
                    background: rgba(239, 68, 68, 0.2);
                    color: #fca5a5;
                    border-color: rgba(239, 68, 68, 0.4);
                    grid-column: span 3;
                }

                .magic-square-key.erase:hover {
                    background: rgba(239, 68, 68, 0.4);
                    box-shadow: 0 8px 15px rgba(239, 68, 68, 0.3);
                }
            </style>
            <div class="magic-square-wrapper" style="display:flex; justify-content:center; align-items:flex-start; width: 100%; height: 100%; padding: 10px; box-sizing: border-box; overflow-y: auto;">
                <div class="operations-card" style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 25px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); width: 100%; max-width: 800px; text-align: center; position: relative; overflow: hidden; margin-top: 10px; margin-bottom: 20px;">
                    
                    <div style="position: absolute; top: -40px; right: -40px; width: 120px; height: 120px; background: rgba(168, 85, 247, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>
                    <div style="position: absolute; bottom: -40px; left: -40px; width: 120px; height: 120px; background: rgba(59, 130, 246, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>

                    <div style="position: relative; z-index: 1;">
                        <h2 style="font-size: 1.6rem; color: #fff; margin-bottom: 10px; font-weight: 900; background: linear-gradient(135deg, #a855f7, #3b82f6); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">🔮 المربعات السحرية</h2>
                        
                        <div class="level-info" style="margin-bottom: 25px;">
                            <span class="level-badge" style="background: rgba(168, 85, 247, 0.2); padding: 5px 12px; border-radius: 12px; font-size: 0.9rem; color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.4);">المستوى ${level}</span>
                            <span class="difficulty-indicator" style="background: rgba(59, 130, 246, 0.2); padding: 5px 12px; border-radius: 12px; font-size: 0.9rem; color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.4);">صعوبة: ${Math.round(difficulty * 100)}%</span>
                        </div>
                        
                        <div class="magic-square-instructions" style="background: rgba(0, 0, 0, 0.3); border-radius: 16px; padding: 15px; margin-bottom: 25px;">
                            <p style="margin: 0 0 10px 0; color: #e2e8f0; font-size: 0.95rem;"><strong>تعليمات:</strong> املأ الشبكة بالأرقام بحيث يكون مجموع كل صف وعمود وقطر متساوياً</p>
                            <p style="margin: 0; color: #fff; font-size: 1.1rem;"><strong>المجموع المطلوب:</strong> <span id="magicSum" style="color: #fde047; font-weight: 900; font-size: 1.3rem; text-shadow: 0 0 10px rgba(253, 224, 71, 0.5);">15</span></p>
                        </div>
                        
                        <div class="magic-square-container" style="display: flex; gap: 30px; justify-content: center; align-items: flex-start; flex-wrap: wrap;">
                            <div class="magic-square-board" id="magicSquareBoard"></div>
                            
                            <div class="magic-square-sidebar" style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 20px;">
                                <div class="magic-square-keypad" id="magicSquareKeypad" style="margin-bottom: 20px;"></div>
                                <div class="magic-square-controls" style="display: flex; flex-direction: column; gap: 10px;">
                                    <button id="checkMagicSquareBtn" style="padding: 12px; border-radius: 12px; background: linear-gradient(135deg, #a855f7, #3b82f6); border: none; color: white; font-weight: 900; cursor: pointer; transition: all 0.2s;">تحقق من الحل</button>
                                    <button id="newMagicSquareBtn" style="padding: 10px; border-radius: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; cursor: pointer; transition: all 0.2s;">لعبة جديدة</button>
                                    <button id="resetMagicSquareBtn" style="padding: 10px; border-radius: 12px; background: rgba(249, 115, 22, 0.2); border: 1px solid rgba(249, 115, 22, 0.4); color: white; cursor: pointer; transition: all 0.2s;">إعادة تعيين</button>
                                    <button id="hintMagicSquareBtn" style="padding: 10px; border-radius: 12px; background: rgba(14, 165, 233, 0.2); border: 1px solid rgba(14, 165, 233, 0.4); color: white; cursor: pointer; transition: all 0.2s;">تلميح</button>
                                </div>
                                <div class="magic-square-status" id="magicSquareStatus" style="margin-top: 15px; font-weight: bold; color: #a855f7; padding: 10px; background: rgba(168, 85, 247, 0.1); border-radius: 12px; border: 1px solid rgba(168, 85, 247, 0.3);">اختر خانة ثم اضغط رقمًا</div>
                                <div class="magic-square-hint" id="magicSquareHint" style="display: none; margin-top: 15px; font-weight: bold; color: #eab308; padding: 10px; background: rgba(234, 179, 8, 0.1); border-radius: 12px; border: 1px solid rgba(234, 179, 8, 0.3);"></div>
                            </div>
                        </div>
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
            <style>
                .sudoku-board {
                    display: grid;
                    grid-template-columns: repeat(9, 1fr);
                    grid-template-rows: repeat(9, 1fr);
                    gap: 1px;
                    width: 450px;
                    height: 450px;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    overflow: hidden;
                    position: relative;
                    background: rgba(0, 0, 0, 0.4);
                    box-sizing: border-box;
                    box-shadow: inset 0 2px 10px rgba(0,0,0,0.3);
                    background-clip: content-box;
                    background-image:
                        linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px);
                    background-size: calc(100% / 9) calc(100% / 9);
                    background-position: 0 0;
                    margin: auto;
                }
                @media (max-width: 600px) {
                    .sudoku-board {
                        width: 300px;
                        height: 300px;
                    }
                }

                .sudoku-board::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background-image:
                        linear-gradient(to right,
                            transparent 33.3333%, rgba(255,255,255,0.4) 33.3333%, rgba(255,255,255,0.4) 33.9%, transparent 33.9%,
                            transparent 66.6666%, rgba(255,255,255,0.4) 66.6666%, rgba(255,255,255,0.4) 67.2666%, transparent 67.2666%),
                        linear-gradient(to bottom,
                            transparent 33.3333%, rgba(255,255,255,0.4) 33.3333%, rgba(255,255,255,0.4) 33.9%, transparent 33.9%,
                            transparent 66.6666%, rgba(255,255,255,0.4) 66.6666%, rgba(255,255,255,0.4) 67.2666%, transparent 67.2666%);
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    z-index: 3;
                }

                .sudoku-cell {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 20px;
                    background: rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                    user-select: none;
                    position: relative;
                    z-index: 1;
                    color: #fff;
                    transition: all 0.3s ease;
                    aspect-ratio: 1;
                    box-sizing: border-box;
                    border: 1px solid transparent;
                }

                .sudoku-cell:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: scale(1.05);
                }

                .sudoku-cell.given {
                    color: #fff;
                    font-weight: 900;
                }

                .sudoku-cell.user {
                    color: #eab308;
                    text-shadow: 0 0 10px rgba(234,179,8, 0.5);
                }

                .sudoku-cell.selected {
                    outline: 2px solid rgba(59, 130, 246, 0.8);
                    background: rgba(59, 130, 246, 0.2);
                    box-shadow: inset 0 0 15px rgba(59, 130, 246, 0.4);
                    transform: scale(1.1);
                    z-index: 2;
                }

                .sudoku-keypad {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                }

                .sudoku-key {
                    padding: 15px;
                    border-radius: 12px;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    font-weight: 800;
                    cursor: pointer;
                    color: #fff;
                    font-size: 18px;
                    transition: all 0.3s ease;
                }

                .sudoku-key:hover {
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 0 8px 15px rgba(234, 179, 8, 0.2);
                    background: rgba(234, 179, 8, 0.2);
                    border-color: #eab308;
                }
                
                .sudoku-key.erase {
                    background: rgba(239, 68, 68, 0.2);
                    color: #fca5a5;
                    border-color: rgba(239, 68, 68, 0.4);
                }
                
                .sudoku-key.erase:hover {
                    background: rgba(239, 68, 68, 0.4);
                    box-shadow: 0 8px 15px rgba(239, 68, 68, 0.3);
                }
            </style>
            <div class="sudoku-wrapper" style="display:flex; justify-content:center; align-items:flex-start; width: 100%; height: 100%; padding: 10px; box-sizing: border-box; overflow-y: auto;">
                <div class="operations-card" style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 25px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); width: 100%; max-width: 800px; text-align: center; position: relative; overflow: hidden; margin-top: 10px; margin-bottom: 20px;">
                    
                    <div style="position: absolute; top: -40px; right: -40px; width: 120px; height: 120px; background: rgba(59, 130, 246, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>
                    <div style="position: absolute; bottom: -40px; left: -40px; width: 120px; height: 120px; background: rgba(139, 92, 246, 0.2); filter: blur(35px); border-radius: 50%; z-index: 0;"></div>

                    <div style="position: relative; z-index: 1;">
                        <h2 style="font-size: 1.6rem; color: #fff; margin-bottom: 10px; font-weight: 900; background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">🧩 السودوكو</h2>
                        
                        <div class="level-info" style="margin-bottom: 25px;">
                            <span class="level-badge" style="background: rgba(59, 130, 246, 0.2); padding: 5px 12px; border-radius: 12px; font-size: 0.9rem; color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.4);">المستوى ${level}</span>
                            <span class="difficulty-indicator" style="background: rgba(139, 92, 246, 0.2); padding: 5px 12px; border-radius: 12px; font-size: 0.9rem; color: #c4b5fd; border: 1px solid rgba(139, 92, 246, 0.4);">صعوبة: ${Math.round(difficulty * 100)}%</span>
                        </div>
                        
                        <div class="difficulty-selection" style="background: rgba(0, 0, 0, 0.25); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 20px; text-align: center; box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);">
                            <h4 style="color: #cbd5e1; margin-bottom: 20px; text-shadow: 0 2px 5px rgba(0,0,0,0.5);">اختر مستوى الصعوبة:</h4>
                            <div class="difficulty-buttons" style="display: flex; gap: 15px; flex-wrap: wrap; justify-content: center;">
                                <button class="difficulty-btn easy" data-difficulty="easy" style="background: rgba(34, 197, 94, 0.2); border: 1px solid rgba(34, 197, 94, 0.4); color: #fff; border-radius: 12px; padding: 10px 15px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 5px; flex: 1; min-width: 120px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                                    <span class="difficulty-icon" style="font-size: 1.5rem;">😊</span>
                                    <span class="difficulty-text" style="font-weight: bold;">سهل</span>
                                    <span class="difficulty-desc" style="font-size: 0.75rem; color: #86efac;">أرقام كثيرة معطاة</span>
                                </button>
                                <button class="difficulty-btn medium" data-difficulty="medium" style="background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); color: #fff; border-radius: 12px; padding: 10px 15px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 5px; flex: 1; min-width: 120px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                                    <span class="difficulty-icon" style="font-size: 1.5rem;">😐</span>
                                    <span class="difficulty-text" style="font-weight: bold;">متوسط</span>
                                    <span class="difficulty-desc" style="font-size: 0.75rem; color: #93c5fd;">صعوبة متوازنة</span>
                                </button>
                                <button class="difficulty-btn hard" data-difficulty="hard" style="background: rgba(249, 115, 22, 0.2); border: 1px solid rgba(249, 115, 22, 0.4); color: #fff; border-radius: 12px; padding: 10px 15px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 5px; flex: 1; min-width: 120px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                                    <span class="difficulty-icon" style="font-size: 1.5rem;">😰</span>
                                    <span class="difficulty-text" style="font-weight: bold;">صعب</span>
                                    <span class="difficulty-desc" style="font-size: 0.75rem; color: #fdba74;">أرقام قليلة معطاة</span>
                                </button>
                                <button class="difficulty-btn expert" data-difficulty="expert" style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); color: #fff; border-radius: 12px; padding: 10px 15px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 5px; flex: 1; min-width: 120px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                                    <span class="difficulty-icon" style="font-size: 1.5rem;">😱</span>
                                    <span class="difficulty-text" style="font-weight: bold;">خبير</span>
                                    <span class="difficulty-desc" style="font-size: 0.75rem; color: #fca5a5;">تحدي كبير</span>
                                </button>
                            </div>
                        </div>
                        
                        <div class="sudoku-game-area" style="display: none; align-items: center; justify-content: center; flex-direction: column;">
                            <div class="sudoku-instructions" style="background: rgba(0, 0, 0, 0.3); border-radius: 12px; padding: 10px; margin-bottom: 20px; width: 100%;">
                                <p style="margin: 0; color: #e2e8f0; font-size: 0.9rem;"><strong>تعليمات:</strong> املأ الخلايا الفارغة بالأرقام من 1 إلى 9 بحيث لا يتكرر الرقم في نفس الصف أو العمود أو المربع 3×3</p>
                            </div>
                            
                            <div class="sudoku-container" style="display: flex; gap: 30px; justify-content: center; align-items: flex-start; flex-wrap: wrap;">
                                <div class="sudoku-board" id="sudokuBoard"></div>
                                
                                <div class="sudoku-sidebar" style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 15px;">
                                    <div class="sudoku-keypad" id="sudokuKeypad" style="margin-bottom: 15px;"></div>
                                    <div class="sudoku-controls" style="display: flex; flex-direction: column; gap: 10px;">
                                        <button id="checkSudokuBtn" style="padding: 12px; border-radius: 12px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border: none; color: white; font-weight: 900; cursor: pointer;">تحقق من الحل</button>
                                        <button id="newSudokuBtn" style="padding: 10px; border-radius: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; cursor: pointer;">لعبة جديدة</button>
                                        <button id="resetSudokuBtn" style="padding: 10px; border-radius: 12px; background: rgba(249, 115, 22, 0.2); border: 1px solid rgba(249, 115, 22, 0.4); color: white; cursor: pointer;">إعادة تعيين</button>
                                        <button id="changeDifficultyBtn" style="padding: 10px; border-radius: 12px; background: rgba(148, 163, 184, 0.2); border: 1px solid rgba(148, 163, 184, 0.4); color: white; cursor: pointer;">تغيير الصعوبة</button>
                                    </div>
                                </div>
                            </div>
                            <div class="sudoku-status" id="sudokuStatus" style="margin-top: 20px; font-weight: bold; color: #8b5cf6; padding: 10px 20px; background: rgba(139, 92, 246, 0.1); border-radius: 12px; border: 1px solid rgba(139, 92, 246, 0.3); width: 100%; box-sizing: border-box;">اختر خانة ثم اضغط رقمًا</div>
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
            <style>
                .maze-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                    overflow-x: auto;
                    padding-bottom: 20px;
                }
                .maze-controls {
                    background: rgba(0,0,0,0.3);
                    padding: 15px 25px;
                    border-radius: 16px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 40px;
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                }
                .maze-controls select {
                    background: rgba(255,255,255,0.1);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.2);
                    padding: 10px 15px;
                    border-radius: 12px;
                    font-family: inherit;
                    font-weight: bold;
                    outline: none;
                }
                .maze-controls select option {
                    background: #1a1e36;
                    color: white;
                }
                .maze-grid {
                    position: relative;
                    display: grid;
                    grid-template-columns: repeat(3, 130px);
                    grid-template-rows: repeat(4, 130px);
                    gap: 60px;
                    direction: ltr; /* VERY IMPORTANT: JS math relies on left: px */
                    margin: 0 auto;
                }
                .maze-box {
                    width: 130px;
                    height: 130px;
                    background: rgba(255,255,255,0.05);
                    backdrop-filter: blur(5px);
                    border: 2px solid rgba(255,255,255,0.15);
                    border-radius: 18px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    font-size: 1.3rem;
                    font-weight: 800;
                    text-align: center;
                    padding: 10px;
                    box-sizing: border-box;
                    z-index: 5;
                }
                .maze-box:hover {
                    border-color: rgba(255,255,255,0.4);
                    transform: scale(1.05);
                }
                .maze-box.start {
                    background: rgba(34, 197, 94, 0.2);
                    border-color: #22c55e;
                    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
                }
                .maze-box.end {
                    background: rgba(239, 68, 68, 0.2);
                    border-color: #ef4444;
                    box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
                }
                .maze-box.active {
                    box-shadow: 0 0 25px rgba(59, 130, 246, 0.8);
                    border-color: #3b82f6;
                    background: rgba(59, 130, 246, 0.4);
                    transform: scale(1.1);
                    z-index: 6;
                }
                .maze-connector {
                    position: absolute;
                    cursor: pointer;
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .maze-connector-line {
                    position: absolute;
                    background: rgba(255,255,255,0.15);
                    z-index: 1;
                    transition: all 0.3s;
                    border-radius: 5px;
                }
                .maze-connector:hover .maze-connector-line {
                    background: rgba(255,255,255,0.7);
                    box-shadow: 0 0 10px rgba(255,255,255,0.8);
                }
                .maze-connector.correct-path .maze-connector-line {
                    background: #22c55e;
                    box-shadow: 0 0 20px #22c55e;
                }
                .maze-connector-label {
                    position: relative;
                    z-index: 2;
                    background: linear-gradient(135deg, #1e293b, #0f172a);
                    color: #fff;
                    padding: 8px 14px;
                    border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.2);
                    font-size: 1rem;
                    font-weight: border;
                    font-family: inherit;
                    transition: all 0.3s;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
                }
                .maze-connector:hover .maze-connector-label {
                    border-color: #fff;
                    transform: scale(1.15);
                    background: linear-gradient(135deg, #3b82f6, #1e293b);
                }
                .maze-label-text {
                    font-size: 0.85rem;
                    color: #86efac;
                    display: block;
                    margin-bottom: 5px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                }
                .maze-math-text {
                    display: block;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                }
            </style>
            
            <div style="display:flex; justify-content:center; align-items:flex-start; width: 100%; height: 100%; padding: 10px; box-sizing: border-box; overflow-y: auto;">
                <div class="operations-card" style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 30px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); width: 100%; max-width: 900px; position: relative; overflow: hidden; margin-top: 10px; margin-bottom: 20px;">
                    
                    <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(34, 197, 94, 0.2); filter: blur(40px); border-radius: 50%; z-index: 0;"></div>
                    <div style="position: absolute; bottom: -50px; left: -50px; width: 150px; height: 150px; background: rgba(14, 165, 233, 0.2); filter: blur(40px); border-radius: 50%; z-index: 0;"></div>

                    <div style="position: relative; z-index: 1;">
                        <h2 style="font-size: 1.8rem; color: #fff; margin-bottom: 25px; text-align: center; font-weight: 900; background: linear-gradient(135deg, #4ade80, #3b82f6); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">🗺️ متاهة الرياضيات</h2>
                        
                        <div class="maze-wrapper">
                            <div class="maze-controls">
                                <label for="mazeTopic" style="font-weight: bold; font-size: 1.1rem; color: #bae6fd;">اختر الموضوع:</label>
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
                                <button class="btn btn-primary" id="btnGenMaze" style="background: linear-gradient(135deg, #22c55e, #16a34a); border: none; border-radius: 12px; padding: 10px 20px; font-weight: 900; font-size: 1rem;">🔄 توليد متاهة</button>
                                <button class="btn btn-secondary" id="btnPrintMaze" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; padding: 10px 20px; font-weight: bold; font-size: 1rem;">🖨️ طباعة</button>
                            </div>
                            
                            <!-- حاوية المتاهة ستمتلئ عبر JS -->
                            <div id="mazeContainer"></div>
                        </div>
                    </div>
                </div>
            </div>
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

        // ربط جميع الأزرار
        const games = [
            ['startQuickMath', 'الحساب السريع'],
            ['startNumberSort', 'ترتيب الأعداد'],
            ['startMemoryGame', 'لعبة الذاكرة'],
            ['startPatternGame', 'إكمال النمط'],
            ['startOperationsChallenge', 'تحدي العمليات'],
            ['startBalancingEquation', 'موازنة المعادلات'],
            ['startWordProblems', 'المسائل الكلامية'],
            ['startComplexProblems', 'مسائل معقدة'],
            ['startGeometryAP', 'مساحة ومحيط'],
            ['startFractionsGame', 'لعبة الكسور'],
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

