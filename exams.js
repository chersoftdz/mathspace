// Exam Data (Mock Logic for now, scalable structure)
const examsData = [
    {
        id: "exam_1_term1",
        title: "فرض الفصل الأول - نموذج 1",
        level: 1,
        duration: 45, // Minutes
        questions: [
            {
                id: 1,
                text: "ما هو حاصل القسمة الإقليدية للعدد 145 على 12؟",
                options: ["12 والباقي 1", "11 والباقي 9", "12 والباقي 5", "10 والباقي 25"],
                correct: 0
            },
            {
                id: 2,
                text: "الكسر الذي يساوي 0.75 هو:",
                options: ["3/4", "4/3", "7/5", "1/4"],
                correct: 0
            },
            {
                id: 3,
                text: "أحسب العملية: 15 + 3 × 2",
                options: ["36", "21", "25", "18"],
                correct: 1 // Order of operations: 3x2=6, 15+6=21
            },
            {
                id: 4,
                text: "زاوية قيسها 90 درجة هي زاوية:",
                options: ["حادة", "منفرجة", "قائمة", "مستقيمة"],
                correct: 2
            },
            {
                id: 5,
                text: "العدد القابل للقسمة على 2 و 3 معاً هو:",
                options: ["14", "15", "18", "21"],
                correct: 2 // 18 even and sum is 9
            }
        ]
    },
    {
        id: "exam_2_term1",
        title: "فرض الفصل الأول - سنة 2 متوسط",
        level: 2,
        duration: 60,
        questions: [
            {
                id: 1,
                text: "أي من العبارات التالية صحيحة بالنسبة للأعداد النسبية؟",
                options: ["(-5) > (-2)", "(-2) > (-5)", "0 < (-10)", "(-5) = (+5)"],
                correct: 1
            },
            {
                id: 2,
                text: "حساب المجموع الجبري: S = (-15) + (+20) - (+5)",
                options: ["0", "10", "-10", "40"],
                correct: 0 // -15 + 20 - 5 = 5 - 5 = 0
            },
            {
                id: 3,
                text: "نظير الشكل بالنسبة لمستقيم يحافظ على:",
                options: ["المساحات فقط", "الأطوال فقط", "الأشكال والأبعاد", "لا شيء مما سبق"],
                correct: 2
            }
        ]
    },
    {
        id: "exam_3_term1",
        title: "اختبار الفصل الأول - سنة 3 متوسط",
        level: 3,
        duration: 90,
        questions: [
            {
                id: 1,
                text: "جداء عددين نسبيين إشارتهما مختلفة هو عدد:",
                options: ["موجب", "سالب", "معدوم", "غير معرف"],
                correct: 1
            },
            {
                id: 2,
                text: "العدد الناطق هو العدد الذي يمكن كتابته على شكل:",
                options: ["a + b", "a × b", "a / b", "a - b"],
                correct: 2
            },
            {
                id: 3,
                text: "مقلوب العدد  -4/5 هو:",
                options: ["4/5", "5/4", "-5/4", "-4/5"],
                correct: 2
            }
        ]
    },
    {
        id: "exam_4_bem_mock",
        title: "تجريبي شهادة التعليم المتوسط (BEM)",
        level: 4,
        duration: 120,
        questions: [
            {
                id: 1,
                text: "القاسم المشترك الأكبر (PGCD) للعددين 1053 و 832 هو:",
                options: ["13", "26", "19", "9"],
                correct: 0
            },
            {
                id: 2,
                text: "حل المعادلة 2x + 5 = 15 هو:",
                options: ["x = 5", "x = 10", "x = 2", "x = 4"],
                correct: 0
            },
            {
                id: 3,
                text: "نشر العبارة (x + 3)² هو:",
                options: ["x² + 9", "x² + 3x + 9", "x² + 6x + 9", "x² + 9x + 9"],
                correct: 2
            },
            {
                id: 4,
                text: "إذا كان cos(x) = 0.5 فإن الزاوية x تساوي:",
                options: ["30°", "45°", "60°", "90°"],
                correct: 2
            },
            {
                id: 5,
                text: "دالة تآلفية حيث f(2) = 5 و f(0) = 1، عبارتها:",
                options: ["f(x) = 2x + 1", "f(x) = x + 3", "f(x) = 2x + 5", "f(x) = 0.5x + 1"],
                correct: 0
            }
        ]
    },
    {
        id: "exam_1_term2",
        title: "اختبار الفصل الثاني - سنة 1 متوسط",
        level: 1,
        duration: 90,
        questions: [
            { id: 1, text: "مجموع زوايا المثلث يساوي:", options: ["90°", "180°", "360°", "100°"], correct: 1 },
            { id: 2, text: "العدد المجهول x في المعادلة 10 + x = 25 هو:", options: ["35", "15", "5", "10"], correct: 1 },
            { id: 3, text: "مساحة مستطيل طوله 8m وعرضه 5m هي:", options: ["40m²", "13m²", "26m²", "16m²"], correct: 0 }
        ]
    },
    {
        id: "exam_1_term3",
        title: "اختبار الفصل الثالث - سنة 1 متوسط",
        level: 1,
        duration: 90,
        questions: [
            { id: 1, text: "حجم متوازي المستطيلات أبعاده 2، 3، 4 هو:", options: ["24", "9", "12", "48"], correct: 0 },
            { id: 2, text: "النسبة المئوية 50% من 200 هي:", options: ["50", "100", "150", "20"], correct: 1 },
            { id: 3, text: "التناظر المركزي يحفظ:", options: ["الاستقامية فقط", "الأطوال فقط", "جميع الخواص الهندسية", "لا شيء مما سبق"], correct: 2 }
        ]
    },
    {
        id: "exam_2_term2",
        title: "اختبار الفصل الثاني - سنة 2 متوسط",
        level: 2,
        duration: 90,
        questions: [
            { id: 1, text: "قياس الزاوية المستقيمة هو:", options: ["90°", "360°", "180°", "45°"], correct: 2 },
            { id: 2, text: "قيمة x اذا كان 4x = 20 هي:", options: ["4", "5", "80", "16"], correct: 1 },
            { id: 3, text: "المسافة بين النقطتين A(+2) و B(-3) هي:", options: ["1", "-1", "5", "-5"], correct: 2 }
        ]
    },
    {
        id: "exam_2_term3",
        title: "اختبار الفصل الثالث - سنة 2 متوسط",
        level: 2,
        duration: 90,
        questions: [
            { id: 1, text: "حل المعادلة 3x - 2 = 10 هو:", options: ["3", "4", "5", "2"], correct: 1 },
            { id: 2, text: "مساحة قرص نصف قطره 3cm (π=3.14):", options: ["28.26", "18.84", "9.42", "31.4"], correct: 0 },
            { id: 3, text: "التكرار النسبي هو:", options: ["التكرار / الحصيص الكلي", "الحصيص الكلي / التكرار", "التكرار × 100", "غير ذلك"], correct: 0 }
        ]
    },
    {
        id: "exam_3_term2",
        title: "اختبار الفصل الثاني - سنة 3 متوسط",
        level: 3,
        duration: 90,
        questions: [
            { id: 1, text: "قوة العدد 10 أس 3 تساوي:", options: ["30", "100", "1000", "300"], correct: 2 },
            { id: 2, text: "خاصية فيثاغورس تطبق فقط على المثلث:", options: ["المتساوي الساقين", "القائم", "المقايس الأضلاع", "الكيفي"], correct: 1 },
            { id: 3, text: "الكتابة العلمية للعدد 0.005 هي:", options: ["5 × 10^-3", "5 × 10^3", "0.5 × 10^-2", "50 × 10^-4"], correct: 0 }
        ]
    },
    {
        id: "exam_3_term3",
        title: "اختبار الفصل الثالث - سنة 3 متوسط",
        level: 3,
        duration: 90,
        questions: [
            { id: 1, text: "حل جملة معادلتين:", options: ["يعتمد على التعويض", "يعتمد على الجمع", "كلاهما صحيح", "لا توجد طريقة"], correct: 2 },
            { id: 2, text: "حجم أسطوانة دوران نصف قطرها r وارتفاعها h:", options: ["πr²h", "2πrh", "πrh", "r²h"], correct: 0 },
            { id: 3, text: "الدالة الخطية تمر دائماً من:", options: ["المبدأ (0,0)", "النقطة (1,1)", "محور الفواصل", "محور التراتيب"], correct: 0 }
        ]
    },
    {
        id: "exam_4_term1",
        title: "فرض الفصل الأول - سنة 4 متوسط",
        level: 4,
        duration: 60,
        questions: [
            { id: 1, text: "العددان 14 و 15 هما عددان:", options: ["أوليان", "أوليان فيما بينهما", "زوجيان", "فرديان"], correct: 1 },
            { id: 2, text: "الجذر التربيعي للعدد 81 هو:", options: ["8", "9", "18", "40.5"], correct: 1 },
            { id: 3, text: "طول الضلع المقابل للزاوية 30° في مثلث قائم وتره 10cm هو:", options: ["10cm", "20cm", "5cm", "15cm"], correct: 2 }
        ]
    },

    {
        id: "exam_4_term2",
        title: "اختبار الفصل الثاني - سنة 4 متوسط",
        level: 4,
        duration: 120,
        questions: [
            { id: 1, text: "حل المتراجحة 2x < 10 هو:", options: ["x > 5", "x < 5", "x = 5", "x < 20"], correct: 1 },
            { id: 2, text: "صورة العدد 3 بالدالة f(x)=2x+1 هي:", options: ["2", "5", "7", "4"], correct: 2 },
            { id: 3, text: "شعاع الانسحاب الذي يحول A الى B هو:", options: ["AB", "BA", "AA", "BB"], correct: 0 }
        ]
    }
];

// App Components
class ExamApp {
    constructor() {
        this.currentExam = null;
        this.userAnswers = {}; // { qIndex: optionIndex }
        this.currentQuestionIndex = 0;
        this.timeRemaining = 0;
        this.timerInterval = null;

        // DOM Elements
        this.grid = document.getElementById('examsGrid');
        this.examSection = document.getElementById('activeExam');
        this.selectionSection = document.getElementById('examSelection');
        this.questionsContainer = document.getElementById('questionsContainer');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.submitBtn = document.getElementById('submitExamBtn');
        this.timerDisplay = document.getElementById('timeDisplay');
        this.timerEl = document.getElementById('examTimer');

        this.init();
    }

    init() {
        this.renderExamList();

        // Event Listeners for Nav
        this.prevBtn.addEventListener('click', () => this.navigate(-1));
        this.nextBtn.addEventListener('click', () => this.navigate(1));
        this.submitBtn.addEventListener('click', () => this.finishExam());
    }

    renderExamList() {
        this.grid.innerHTML = '';
        examsData.forEach(exam => {
            const card = document.createElement('div');
            card.className = 'menu-card exam-card';
            card.dataset.level = exam.level;
            card.innerHTML = `
                <div class="menu-icon" style="background: rgba(229, 62, 62, 0.1); color: #e53e3e;">
                    <i class="fas fa-file-alt"></i>
                </div>
                <h3>${exam.title}</h3>
                <div class="menu-features">
                    <span><i class="fas fa-clock"></i> ${exam.duration} دقيقة</span>
                    <span><i class="fas fa-list"></i> ${exam.questions.length} سؤال</span>
                    <span><i class="fas fa-layer-group"></i> السنة ${exam.level}</span>
                </div>
                <div class="menu-action">
                    <i class="fas fa-play"></i> بدء الاختبار
                </div>
            `;
            card.addEventListener('click', () => this.startExam(exam));
            this.grid.appendChild(card);
        });
    }

    startExam(exam) {
        this.currentExam = exam;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.timeRemaining = exam.duration * 60; // Seconds

        // UI Switch
        this.selectionSection.style.display = 'none';
        this.examSection.style.display = 'block';
        this.timerEl.style.display = 'block';

        // Initialize display
        this.renderQuestions();
        this.showQuestion(0);
        this.startTimer();
    }

    renderQuestions() {
        this.questionsContainer.innerHTML = '';
        this.currentExam.questions.forEach((q, index) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'question-card';
            qDiv.dataset.index = index;

            let optionsHtml = '';
            q.options.forEach((opt, optIdx) => {
                optionsHtml += `
                    <label class="option-label">
                        <input type="radio" name="q_${index}" value="${optIdx}" onchange="app.saveAnswer(${index}, ${optIdx})">
                        <span style="flex-grow:1; margin-right: 10px;">${this.formatMath(opt)}</span>
                        <div class="status-icon"></div>
                    </label>
                `;
            });

            qDiv.innerHTML = `
                <div class="question-header">
                    <span class="question-badge">السؤال ${index + 1}</span>
                    <span style="color: #718096;">5 نقاط</span>
                </div>
                <h3 style="margin-bottom: 25px; line-height: 1.6;">${this.formatMath(q.text)}</h3>
                <div class="options-list">
                    ${optionsHtml}
                </div>
            `;
            this.questionsContainer.appendChild(qDiv);
        });
    }

    formatMath(text) {
        // Basic LTR logic for math segments (similar to script.js logic)
        // Wraps numbers and math expressions in LTR spans
        return text.replace(/([0-9x+\-=×÷^().,/]+)/g, '<span dir="ltr" style="display:inline-block; font-family: monospace;">$1</span>');
    }

    showQuestion(index) {
        // Toggle visibility
        const cards = document.querySelectorAll('.question-card');
        cards.forEach(c => c.classList.remove('active'));
        cards[index].classList.add('active');

        // Update Nav Buttons
        this.prevBtn.disabled = index === 0;

        if (index === this.currentExam.questions.length - 1) {
            this.nextBtn.style.display = 'none';
            this.submitBtn.style.display = 'flex';
        } else {
            this.nextBtn.style.display = 'flex';
            this.submitBtn.style.display = 'none';
        }

        // Update Progress
        const percent = ((index + 1) / this.currentExam.questions.length) * 100;
        document.getElementById('examProgress').style.width = `${percent}%`;
        document.getElementById('questionCounter').innerText = `السؤال ${index + 1} / ${this.currentExam.questions.length}`;

        this.currentQuestionIndex = index;
    }

    navigate(dir) {
        this.showQuestion(this.currentQuestionIndex + dir);
    }

    saveAnswer(qIndex, optIndex) {
        this.userAnswers[qIndex] = optIndex;
    }

    startTimer() {
        clearInterval(this.timerInterval);
        this.updateTimerDisplay();

        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();

            if (this.timeRemaining <= 300) { // Last 5 mins
                this.timerEl.classList.add('warning');
            }

            if (this.timeRemaining <= 0) {
                this.finishExam();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const mins = Math.floor(this.timeRemaining / 60);
        const secs = this.timeRemaining % 60;
        this.timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    finishExam() {
        clearInterval(this.timerInterval);

        // Calculate Score
        let correctCount = 0;
        let totalQuestions = this.currentExam.questions.length;
        let reviewHtml = '';

        this.currentExam.questions.forEach((q, idx) => {
            const userAns = this.userAnswers[idx];
            const isCorrect = userAns === q.correct;

            if (isCorrect) correctCount++;

            // Build Review HTML
            const userAnsText = userAns !== undefined ? q.options[userAns] : "لم تجب";
            const correctAnsText = q.options[q.correct];
            const color = isCorrect ? '#48bb78' : '#f56565';

            reviewHtml += `
            <div style="background: white; border-right: 4px solid ${color}; padding: 15px; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); text-align: right;">
                <p style="font-weight: bold; margin-bottom: 5px;">س${idx + 1}: ${q.text}</p>
                <div style="font-size: 0.9rem;">
                    <span style="color: ${color}">إجابتك: ${userAnsText}</span>
                    ${!isCorrect ? `<br><span style="color: #48bb78">الإجابة الصحيحة: ${correctAnsText}</span>` : ''}
                </div>
            </div>`;
        });

        // Show Results
        const score20 = Math.round((correctCount / totalQuestions) * 20);
        document.getElementById('scoreDisplay').innerText = `${score20}/20`;
        document.getElementById('correctCount').innerText = `${correctCount}/${totalQuestions}`;
        document.getElementById('reviewSection').innerHTML = reviewHtml;

        const timeTakenSec = (this.currentExam.duration * 60) - this.timeRemaining;
        const mm = Math.floor(timeTakenSec / 60);
        const ss = timeTakenSec % 60;
        document.getElementById('timeTaken').innerText = `${mm}:${ss}`;

        // Grade Badge
        const gradeEl = document.getElementById('gradeDisplay');
        const emojiEl = document.getElementById('resultEmoji');
        if (score20 >= 18) { gradeEl.innerText = "ممتاز"; gradeEl.style.color = "#48bb78"; emojiEl.innerText = "🏆"; }
        else if (score20 >= 14) { gradeEl.innerText = "جيد جداً"; gradeEl.style.color = "#38b2ac"; emojiEl.innerText = "🌟"; }
        else if (score20 >= 10) { gradeEl.innerText = "متوسط"; gradeEl.style.color = "#ed8936"; emojiEl.innerText = "👍"; }
        else { gradeEl.innerText = "تحتاج للمراجعة"; gradeEl.style.color = "#e53e3e"; emojiEl.innerText = "📚"; }

        if (window.Dashboard && window.Dashboard.completeExam) {
            window.Dashboard.completeExam();
        }

        document.getElementById('resultsModal').style.display = 'flex';
    }
}

// Instantiate
const app = new ExamApp();
