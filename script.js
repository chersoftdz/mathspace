// Global Variables
let currentLevel = null;
let currentLesson = null;
let currentExerciseIndex = 0;
let exercises = [];

// XP Helper (Safe call)
function awardXP(amount) {
    if (window.Dashboard && window.Dashboard.addXP) {
        window.Dashboard.addXP(amount);
    }
}

// Dynamic Curriculum Data Structure
let curriculum = {};

// Function to build the curriculum from extendedExercises
function buildCurriculum() {
    const levelTitles = {
        1: "السنة الأولى متوسط",
        2: "السنة الثانية متوسط",
        3: "السنة الثالثة متوسط",
        4: "السنة الرابعة متوسط"
    };

    for (let level in extendedExercises) {
        curriculum[level] = {
            title: levelTitles[level],
            lessons: {}
        };

        for (let lessonTitle in extendedExercises[level]) {
            curriculum[level].lessons[lessonTitle] = {
                title: lessonTitle,
                description: `تمارين في ${lessonTitle}`,
                exercises: extendedExercises[level][lessonTitle].exercises || []
            };
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    showMainMenu(); // Show main menu by default
});

function initializeApp() {
    try {
        // Build the curriculum dynamically
        buildCurriculum();

        // Add click listeners to level cards
        const levelCards = document.querySelectorAll('.level-card');
        levelCards.forEach(card => {
            card.addEventListener('click', function () {
                const level = parseInt(this.getAttribute('data-level'));
                if (curriculum[level]) {
                    selectLevel(level);
                } else {
                    console.error('Level not found in curriculum:', level);
                    alert('عذراً، حدث خطأ في تحميل المستوى. يرجى إعادة تحميل الصفحة.');
                }
            });
        });
    } catch (error) {
        console.error('Error initializing app:', error);
        alert('عذراً، حدث خطأ في تحميل التطبيق. يرجى إعادة تحميل الصفحة.');
    }

    // Add event listeners for exercise controls
    const showSolutionBtn = document.getElementById('showSolutionBtn');
    const nextExerciseBtn = document.getElementById('nextExerciseBtn');

    if (showSolutionBtn) {
        showSolutionBtn.addEventListener('click', toggleSolution);
    }

    if (nextExerciseBtn) {
        nextExerciseBtn.addEventListener('click', nextExercise);
    }

    // Add event listener for back to levels button
    const backToLevelsBtn = document.getElementById('backToLevels');
    if (backToLevelsBtn) {
        backToLevelsBtn.addEventListener('click', showLevelSelection);
    }

    // Initialize progress
    updateProgress(0);

    // Update total exercises count
    updateTotalExercises();
}

function selectLevel(level) {
    if (!curriculum[level]) {
        console.error('Level not found:', level);
        return;
    }

    currentLevel = level;
    currentLesson = null;
    currentExerciseIndex = 0;

    // Hide main menu, level selection and show lesson selection
    const mainMenu = document.getElementById('mainMenu');
    const levelSelection = document.getElementById('levelSelection');
    const lessonSelection = document.getElementById('lessonSelection');
    const exerciseSection = document.getElementById('exerciseSection');

    if (mainMenu && levelSelection && lessonSelection && exerciseSection) {
        mainMenu.style.display = 'none';
        levelSelection.style.display = 'none';
        lessonSelection.style.display = 'block';
        exerciseSection.style.display = 'none';
    }

    // Update lesson title
    document.getElementById('lessonTitle').textContent = `اختر الدرس - ${curriculum[level].title}`;

    // Populate lessons
    populateLessons(level);

    // Add animation
    document.getElementById('lessonSelection').classList.add('fade-in');
}

function populateLessons(level) {
    const lessonsGrid = document.getElementById('lessonsGrid');
    if (!lessonsGrid) {
        console.error('Lessons grid not found');
        return;
    }

    lessonsGrid.innerHTML = '';

    const lessons = curriculum[level].lessons;

    Object.keys(lessons).forEach(lessonKey => {
        const lesson = lessons[lessonKey];
        const lessonCard = document.createElement('div');
        lessonCard.className = 'lesson-card';
        lessonCard.setAttribute('data-lesson', lessonKey);

        lessonCard.innerHTML = `
            <h3>${lesson.title}</h3>
            <p>${lesson.description}</p>
            <small>${lesson.exercises.length} تمرين</small>
        `;

        lessonCard.addEventListener('click', function () {
            selectLesson(lessonKey);
        });

        lessonsGrid.appendChild(lessonCard);
    });
}

function selectLesson(lessonKey) {
    if (!curriculum[currentLevel] || !curriculum[currentLevel].lessons[lessonKey]) {
        console.error('Lesson not found:', lessonKey);
        return;
    }

    currentLesson = lessonKey;
    currentExerciseIndex = 0;

    // استعادة الهيكل الأساسي لقسم التمارين
    const exerciseContent = document.getElementById('exerciseContent');
    if (!exerciseContent) {
        console.error('Exercise content not found');
        return;
    }

    exerciseContent.innerHTML = `
        <div class="exercise-question" id="exerciseQuestion"></div>
        <div class="exercise-options" id="exerciseOptions"></div>
        <div class="exercise-solution" id="exerciseSolution" style="display: none;">
            <h3><i class="fas fa-check-circle"></i> الحل:</h3>
            <div id="solutionContent"></div>
        </div>
    `;

    // Get all exercises for the lesson and shuffle them
    let allExercises = curriculum[currentLevel].lessons[lessonKey].exercises;
    exercises = shuffleArray(allExercises);

    // Hide main menu, lesson selection and show exercise section
    const mainMenu = document.getElementById('mainMenu');
    const lessonSelection = document.getElementById('lessonSelection');
    const exerciseSection = document.getElementById('exerciseSection');

    if (mainMenu && lessonSelection && exerciseSection) {
        mainMenu.style.display = 'none';
        lessonSelection.style.display = 'none';
        exerciseSection.style.display = 'block';
    }

    // Load first exercise
    loadExercise();

    // Add animation
    document.getElementById('exerciseSection').classList.add('slide-in');
}

function loadExercise() {
    if (currentExerciseIndex >= exercises.length) {
        showCompletionMessage();
        return;
    }

    // Reset Khawarizmi State for new exercise
    if (typeof wrongAttemptsCount !== 'undefined') {
        wrongAttemptsCount = 0;
        const kWidget = document.getElementById('khawarizmi-widget');
        if (kWidget) kWidget.style.display = 'none';
        const kChatWindow = document.getElementById('k-chat-window');
        if (kChatWindow) kChatWindow.style.display = 'none';
        const kChatMessages = document.getElementById('k-chat-messages');
        if (kChatMessages) kChatMessages.innerHTML = '';
        kIsChatOpen = false;
    }

    const exercise = exercises[currentExerciseIndex];
    const optionsContainer = document.getElementById('exerciseOptions');
    const solutionDiv = document.getElementById('exerciseSolution');
    const exerciseTitle = document.getElementById('exerciseTitle');
    const exerciseQuestion = document.getElementById('exerciseQuestion');
    const nextBtn = document.getElementById('nextExerciseBtn');
    const showSolutionBtn = document.getElementById('showSolutionBtn');

    if (!optionsContainer || !solutionDiv || !exerciseTitle || !exerciseQuestion || !nextBtn || !showSolutionBtn) {
        console.error('Required exercise elements not found');
        return;
    }

    // Update exercise title
    exerciseTitle.textContent =
        `${curriculum[currentLevel].lessons[currentLesson].title} - التمرين ${currentExerciseIndex + 1}`;

    // Load question
    let difficultyBadge = '';
    if (exercise.difficulty) {
        let badgeClass = 'badge-medium'; // Default
        let badgeText = 'متوسط';

        if (exercise.difficulty === 'easy') {
            badgeClass = 'badge-easy';
            badgeText = 'سهل';
        } else if (exercise.difficulty === 'hard') {
            badgeClass = 'badge-hard';
            badgeText = 'صعب';
        }

        difficultyBadge = `<span class="badge ${badgeClass}">${badgeText}</span>`;
    }

    exerciseQuestion.innerHTML = `
        <h3><i class="fas fa-question-circle"></i> السؤال: ${difficultyBadge}</h3>
        <p dir="rtl" style="unicode-bidi:plaintext;">${formatTextWithMath(exercise.question)}</p>
    `;

    // Clear previous options and hide solution/feedback
    optionsContainer.innerHTML = '';
    solutionDiv.style.display = 'none';
    solutionDiv.innerHTML = '<h3><i class="fas fa-check-circle"></i> الحل:</h3><div id="solutionContent"></div>'; // Reset structure

    // Hide next button until an answer is chosen or solution is shown
    nextBtn.style.display = 'none';
    showSolutionBtn.style.display = 'inline-block';

    // Load options as buttons
    exercise.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn';

        // كشف ما إذا كان الخيار رياضياً صرفاً (لا يحتوي على نص عربي)
        const isArabic = /[\u0600-\u06FF]/.test(option);
        const hasMathContent = /[a-zA-Z\(\)\+\-\*\/=<>²³\d\/]/.test(option.replace(/<[^>]*>/g, ''));

        if (!isArabic && hasMathContent) {
            // خيار رياضي صرف: نضعه بالكامل داخل span LTR
            optionBtn.setAttribute('data-pure-math', 'true');
            const cleanOption = option.replace(/<[^>]*>/g, ''); // إزالة HTML القديم
            optionBtn.innerHTML = `<span dir="ltr" style="display:inline-block; font-family:'Courier New',monospace; font-weight:bold; unicode-bidi:isolate; font-size:1.05em;">${cleanOption}</span>`;
        } else {
            // خيار مختلط أو عربي: نستخدم formatTextWithMath
            optionBtn.innerHTML = formatTextWithMath(option);
        }

        optionBtn.addEventListener('click', () => checkAnswer(index, exercise.answer, optionBtn));
        optionsContainer.appendChild(optionBtn);
    });

    // Update progress based on the start of the exercise
    const progress = (currentExerciseIndex / exercises.length) * 100;
    updateProgress(progress);

    // Update final button text
    if (currentExerciseIndex === exercises.length - 1) {
        nextBtn.innerHTML = '<i class="fas fa-check"></i> إنهاء الدرس';
    } else {
        nextBtn.innerHTML = '<i class="fas fa-forward"></i> التمرين التالي';
    }
}

// ===== معالجة النصوص الرياضية المختلطة =====
// المشكلة: المتصفح يعيد ترتيب الرموز اللاتينية والأرقام منفردةً في سياق RTL
// الحل: لف كل كتلة غير عربية كاملةً في <bdi dir="ltr"> لعزلها تماماً
function formatTextWithMath(text) {
    if (typeof text !== 'string') return text;

    // إذا كان النص يحتوي بالفعل على HTML جاهز (div لاتجاه أو SVG) → نعيده كما هو
    if (text.includes('<div') || text.includes('<svg')) return text;

    // إذا كان محتوى HTML موجوداً فيه bdi أو span بـ dir → نعيده كما هو
    if (/<(?:span|bdi)[^>]*dir/.test(text)) return text;

    // لا يوجد محتوى رياضي → نعيد النص كما هو
    if (!/[a-zA-Z0-9]/.test(text)) return text;

    // نطاق الحروف العربية (بما فيها علامات الترقيم العربية ، ؛ ؟)
    // U+0600–U+06FF : حروف عربية أساسية
    // U+FB50–U+FDFF : أشكال العرض A
    // U+FE70–U+FEFF : أشكال العرض B
    const ARABIC_REGEX = /[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

    // نقسم النص إلى كتل: عربية وغير عربية
    // كل تسلسل متواصل من الحروف غير العربية يُعامَل ككتلة واحدة
    const result = text.replace(
        /([^\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]+)/g,
        (nonArabicBlock) => {
            // هل الكتلة تحتوي على رموز رياضية فعلية (حروف لاتينية أو أرقام)؟
            if (!/[a-zA-Z0-9²³⁴⁵⁶⁷⁸⁹⁰]/.test(nonArabicBlock)) {
                // مسافات أو علامات ترقيم غربية فقط → نتركها كما هي
                return nonArabicBlock;
            }

            // نحتفظ بالمسافات/الفراغات الأولى والأخيرة خارج الـ bdi
            const leading = nonArabicBlock.match(/^(\s*)/)[0];
            const trailing = nonArabicBlock.match(/(\s*)$/)[0];
            const core = nonArabicBlock.trim();

            if (!core) return nonArabicBlock;

            // نلف الصيغة الرياضية في bdi dir="ltr" مع عزل كامل
            return leading +
                `<bdi dir="ltr" style="` +
                `font-family:'Courier New',monospace;` +
                `font-weight:bold;` +
                `white-space:nowrap;` +
                `unicode-bidi:isolate;` +
                `">${core}</bdi>` +
                trailing;
        }
    );

    return result;
}

function checkAnswer(selectedOptionIndex, correctAnswer, btnElement) {
    const optionsContainer = document.getElementById('exerciseOptions');
    const optionBtns = optionsContainer.querySelectorAll('.option-btn');
    const exercise = exercises[currentExerciseIndex];
    const selectedOptionText = exercise.options[selectedOptionIndex];

    const isCorrect = selectedOptionText.trim() === correctAnswer.trim();
    const correctOptionIndex = exercise.options.findIndex(opt => opt.trim() === correctAnswer.trim());

    if (!isCorrect) {
        // الإجابة خاطئة
        btnElement.classList.add('incorrect');
        btnElement.disabled = true; // تعطيل الزر الخاطئ فقط لتفادي تخمينه مجدداً

        // استدعاء خوارزمي للتوجيه بناءً على المحاولة الفاشلة
        if (typeof triggerKhawarizmiWrongAnswer === 'function') {
            triggerKhawarizmiWrongAnswer();
        }

        // منع إكمال العملية حتى لا يتم كشف الجواب ولا يظهر زر المتابعة
        return;
    }

    // الإجابة صحيحة
    // تعطيل جميع الأزرار وإظهار الإجابة الصحيحة
    optionBtns.forEach((btn, index) => {
        btn.disabled = true;
        if (index === correctOptionIndex) {
            btn.classList.add('correct');
        }
    });

    // مؤثر صوتي وإضافة نقاط الخبرة XP
    playCorrectSound();
    awardXP(10);

    // تجهيز زر المتابعة للسؤال التالي
    const nextBtn = document.getElementById('nextExerciseBtn');
    const showSolutionBtn = document.getElementById('showSolutionBtn');

    if (nextBtn && showSolutionBtn) {
        nextBtn.style.display = 'inline-block';
        showSolutionBtn.style.display = 'none';
    }

    // تحديث شريط التقدم
    const progress = ((currentExerciseIndex + 1) / exercises.length) * 100;
    updateProgress(progress);
}

function playCorrectSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Pleasant "Ding" (High C)
        osc.frequency.value = 1046.50; // C6
        osc.type = 'sine'; // Pure tone

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
        console.error("Sound playback failed", e);
    }
}

function toggleSolution() {
    const solutionDiv = document.getElementById('exerciseSolution');
    const solutionContent = document.getElementById('solutionContent');
    const exercise = exercises[currentExerciseIndex];

    if (!solutionDiv || !solutionContent || !exercise) {
        console.error('Required elements not found for solution');
        return;
    }

    // Populate and show the solution
    if (currentLesson === "مقارنة وترتيب الأعداد العشرية") {
        // For ordering questions that contain '|', add specific styling
        if (exercise.answer.includes('|')) {
            solutionContent.innerHTML = `<div dir="ltr" style="text-align: left; font-family: 'Courier New', monospace; letter-spacing: 2px;">${exercise.answer}</div>`;
        } else {
            // For comparison questions
            solutionContent.innerHTML = `<div style="text-align: left; direction: ltr; font-family: 'Courier New', monospace;">${exercise.answer}</div>`;
        }
    } else {
        // Check if exercise has a solution property
        if (exercise.solution) {
            solutionContent.innerHTML = `<div style="text-align: right; direction: rtl; font-family: 'Cairo', sans-serif; background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">${formatTextWithMath(exercise.solution)}</div>`;
        } else {
            solutionContent.innerHTML = formatTextWithMath(exercise.answer);
        }
    }

    solutionDiv.style.display = 'block';

    // Highlight the correct option button using index-based comparison
    const optionBtns = document.querySelectorAll('.option-btn');
    const correctOptionIndex = exercise.options.findIndex(opt => opt.trim() === exercise.answer.trim());

    optionBtns.forEach((btn, index) => {
        btn.disabled = true;
        if (index === correctOptionIndex) {
            btn.classList.add('correct');
        }
    });

    // Show next button and hide solution button
    const nextBtn = document.getElementById('nextExerciseBtn');
    const showSolutionBtn = document.getElementById('showSolutionBtn');

    if (nextBtn && showSolutionBtn) {
        nextBtn.style.display = 'inline-block';
        showSolutionBtn.style.display = 'none';
    }

    // Update progress as if the question was answered
    const progress = ((currentExerciseIndex + 1) / exercises.length) * 100;
    updateProgress(progress);
}

function nextExercise() {
    currentExerciseIndex++;

    if (currentExerciseIndex >= exercises.length) {
        // All exercises completed
        showCompletionMessage();
    } else {
        loadExercise();
    }
}

function showCompletionMessage() {
    const exerciseContent = document.querySelector('.exercise-content');
    if (!exerciseContent) {
        console.error('Exercise content not found for completion message');
        return;
    }

    exerciseContent.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <i class="fas fa-trophy" style="font-size: 4rem; color: #ffd700; margin-bottom: 20px;"></i>
            <h2 style="color: #48bb78; margin-bottom: 20px;">أحسنت! 🎉</h2>
            <p style="font-size: 1.2rem; color: #4a5568; margin-bottom: 30px;">
                لقد أكملت جميع تمارين درس "${curriculum[currentLevel].lessons[currentLesson].title}"
            </p>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button onclick="showLessonSelection()" class="btn btn-primary">
                    <i class="fas fa-arrow-right"></i> العودة لاختيار الدرس
                </button>
                <button onclick="showLevelSelection()" class="btn btn-success">
                    <i class="fas fa-star"></i> العودة لاختيار المستوى
                </button>
                <button onclick="showMainMenu()" class="btn btn-info">
                    <i class="fas fa-home"></i> العودة للقائمة الرئيسية
                </button>
            </div>
        </div>
    `;

    updateProgress(100);
}

function showMainMenu() {
    const mainMenu = document.getElementById('mainMenu');
    const levelSelection = document.getElementById('levelSelection');
    const lessonSelection = document.getElementById('lessonSelection');
    const exerciseSection = document.getElementById('exerciseSection');

    if (mainMenu && levelSelection && lessonSelection && exerciseSection) {
        mainMenu.style.display = 'block';
        levelSelection.style.display = 'none';
        lessonSelection.style.display = 'none';
        exerciseSection.style.display = 'none';
    }

    // Reset variables
    currentLevel = null;
    currentLesson = null;
    currentExerciseIndex = 0;
    exercises = [];

    updateProgress(0);
}

function showGames() {
    window.location.href = 'games.html';
}

function showSituations() {
    window.location.href = 'situations.html';
}

function showLevelSelection() {
    const mainMenu = document.getElementById('mainMenu');
    const levelSelection = document.getElementById('levelSelection');
    const lessonSelection = document.getElementById('lessonSelection');
    const exerciseSection = document.getElementById('exerciseSection');

    if (mainMenu && levelSelection && lessonSelection && exerciseSection) {
        mainMenu.style.display = 'none';
        levelSelection.style.display = 'block';
        lessonSelection.style.display = 'none';
        exerciseSection.style.display = 'none';
    }

    // Reset variables
    currentLevel = null;
    currentLesson = null;
    currentExerciseIndex = 0;
    exercises = [];

    updateProgress(0);
}

function showLessonSelection() {
    if (currentLevel) {
        const mainMenu = document.getElementById('mainMenu');
        const levelSelection = document.getElementById('levelSelection');
        const lessonSelection = document.getElementById('lessonSelection');
        const exerciseSection = document.getElementById('exerciseSection');

        if (mainMenu && levelSelection && lessonSelection && exerciseSection) {
            mainMenu.style.display = 'none';
            levelSelection.style.display = 'none';
            lessonSelection.style.display = 'block';
            exerciseSection.style.display = 'none';
        }

        // Reset exercise variables
        currentLesson = null;
        currentExerciseIndex = 0;
        exercises = [];

        updateProgress(0);
    }
}

function updateProgress(percentage) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    if (progressFill && progressText) {
        progressFill.style.width = percentage + '%';
        progressText.textContent = Math.round(percentage) + '%';
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function (event) {
    // تجاهل الاختصارات إذا كان المستخدم يكتب داخل حقل نصي (مثل دردشة خوارزمي)
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

    if (event.key === 'ArrowRight' || event.key === ' ') {
        // Next exercise or show solution
        const exerciseSection = document.getElementById('exerciseSection');
        if (exerciseSection && exerciseSection.style.display !== 'none') {
            const solutionDiv = document.getElementById('exerciseSolution');
            if (solutionDiv && solutionDiv.style.display === 'none') {
                toggleSolution();
            } else {
                nextExercise();
            }
        }
    }

    if (event.key === 'Escape') {
        // Go back
        const exerciseSection = document.getElementById('exerciseSection');
        const lessonSelection = document.getElementById('lessonSelection');
        const levelSelection = document.getElementById('levelSelection');

        if (exerciseSection && exerciseSection.style.display !== 'none') {
            showLessonSelection();
        } else if (lessonSelection && lessonSelection.style.display !== 'none') {
            showLevelSelection();
        } else if (levelSelection && levelSelection.style.display !== 'none') {
            showMainMenu();
        }
    }

    if (event.key === 'Home') {
        // Go to main menu
        showMainMenu();
    }
});

// Add loading animation for better UX
function showLoading(element) {
    element.innerHTML = '<div class="loading"></div>';
}

function hideLoading(element) {
    element.innerHTML = '';
}

// Function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

// Function to update total exercises count
function updateTotalExercises() {
    let total = 0;

    for (let level in curriculum) {
        for (let lesson in curriculum[level].lessons) {
            total += curriculum[level].lessons[lesson].exercises.length;
        }
    }

    const totalExercisesElement = document.getElementById('totalExercises');
    if (totalExercisesElement) {
        totalExercisesElement.textContent = total;
    }
}

// Function to show level selection
function showLevelSelection() {
    const mainMenu = document.getElementById('mainMenu');
    const levelSelection = document.getElementById('levelSelection');
    const lessonSelection = document.getElementById('lessonSelection');
    const exerciseSection = document.getElementById('exerciseSection');

    if (mainMenu && levelSelection && lessonSelection && exerciseSection) {
        mainMenu.style.display = 'none';
        levelSelection.style.display = 'block';
        lessonSelection.style.display = 'none';
        exerciseSection.style.display = 'none';
    }
}

// Function to show games
function showGames() {
    window.location.href = 'games.html';
}

// Function to show situations
function showSituations() {
    window.location.href = 'situations.html';
}

// Function to show calculator
function showCalculator() {
    window.location.href = 'calculator.html';
}

// Graphing functions removed - handled inline in index.html

// Function to show lesson selection
function showLessonSelection() {
    const mainMenu = document.getElementById('mainMenu');
    const levelSelection = document.getElementById('levelSelection');
    const lessonSelection = document.getElementById('lessonSelection');
    const exerciseSection = document.getElementById('exerciseSection');

    if (mainMenu && levelSelection && lessonSelection && exerciseSection) {
        mainMenu.style.display = 'none';
        levelSelection.style.display = 'none';
        lessonSelection.style.display = 'block';
        exerciseSection.style.display = 'none';
    }
}

// ============================================
// منطق المساعد الذكي "خوارزمي" (AI Tutor)
// ============================================
let wrongAttemptsCount = 0;
let kIsChatOpen = false;

function triggerKhawarizmiWrongAnswer() {
    wrongAttemptsCount++;
    const kWidget = document.getElementById('khawarizmi-widget');
    if (!kWidget) return;

    if (wrongAttemptsCount === 1 || wrongAttemptsCount % 2 === 0) {
        // Show icon
        kWidget.style.display = 'flex';
        // Add pulse animation
        const kIcon = document.getElementById('k-icon');
        if (kIcon) kIcon.classList.add('k-pulse');
        // Show badge
        const kBadge = document.getElementById('k-badge');
        if (kBadge) kBadge.style.display = 'flex';

        // Auto-open chat on 2nd wrong attempt
        if (wrongAttemptsCount === 2 && !kIsChatOpen) {
            toggleKhawarizmiChat();
        }
    }
}

function toggleKhawarizmiChat() {
    const chatWindow = document.getElementById('k-chat-window');
    const badge = document.getElementById('k-badge');
    const kIcon = document.getElementById('k-icon');

    if (!chatWindow) return;

    kIsChatOpen = !kIsChatOpen;

    if (kIsChatOpen) {
        chatWindow.style.display = 'flex';
        if (badge) badge.style.display = 'none';
        if (kIcon) kIcon.classList.remove('k-pulse');

        // Initial greeting if empty
        const messages = document.getElementById('k-chat-messages');
        if (messages && messages.children.length === 0) {
            addKhawarizmiMessage("مرحباً بك! 👋 أنا خوارزمي. لاحظت أنك تواجه بعض الصعوبة في هذا التمرين. هل ترغب في أن أقدم لك تلميحاً؟", false);
        }
    } else {
        chatWindow.style.display = 'none';
    }
}

function sendKhawarizmiMessage() {
    const input = document.getElementById('k-chat-input');
    if (!input) return;

    const msg = input.value.trim();
    if (!msg) return;

    addKhawarizmiMessage(msg, true);
    input.value = '';

    showKhawarizmiTyping();

    setTimeout(() => {
        removeKhawarizmiTyping();
        simulateKhawarizmiResponse(msg);
    }, 1500);
}

function addKhawarizmiMessage(text, isUser) {
    const messages = document.getElementById('k-chat-messages');
    if (!messages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `k-msg ${isUser ? 'k-msg-user' : 'k-msg-ai'}`;

    if (isUser) {
        msgDiv.textContent = text;
    } else {
        msgDiv.innerHTML = formatTextWithMath(text);
    }

    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
}

function showKhawarizmiTyping() {
    const messages = document.getElementById('k-chat-messages');
    if (!messages) return;

    const typeDiv = document.createElement('div');
    typeDiv.className = 'k-typing';
    typeDiv.id = 'k-typing-indicator';
    typeDiv.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(typeDiv);
    messages.scrollTop = messages.scrollHeight;
}

function removeKhawarizmiTyping() {
    const indicator = document.getElementById('k-typing-indicator');
    if (indicator) indicator.remove();
}

async function simulateKhawarizmiResponse(userMsg) {
    if (!exercises || !exercises[currentExerciseIndex]) return;

    const exercise = exercises[currentExerciseIndex];

    if (typeof AI_CONFIG !== 'undefined' && AI_CONFIG.API_KEY && AI_CONFIG.API_KEY.length > 10 && !AI_CONFIG.USE_SIMULATION) {
        try {
            const prompt = `أنت المساعد الذكي "خوارزمي" لمعلمة الرياضيات لطلاب التعليم المتوسط في الجزائر.
مهمتك: توجيه التلميذ للحل دون إعطائه الإجابة النهائية الجاهزة.
التمرين الحالي: ${exercise.question} 
الإجابة الصحيحة: ${exercise.answer}
إذا كان هناك خطوات للحل اعتمد عليها في التلميح: ${exercise.solution || 'لا توجد'}
استفسار التلميذ: "${userMsg}"
قواعد:
1- كن مرحاً وداعماً.
2- استخرج تلميحاً من الإجابة الصحيحة.
3- لا تعط الحل أبداً بل دعه يكتشفه (مثلاً: "تذكر أن مجموع..." أو "جرب تقسيم...").
4- الرد قصير باللغة العربية (سطرين كحد أقصى).`;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': AI_CONFIG.API_KEY.trim()
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (!response.ok) throw new Error("API Connection failed");

            const data = await response.json();

            if (data.candidates && data.candidates.length > 0) {
                const aiText = data.candidates[0].content.parts[0].text;
                addKhawarizmiMessage(aiText, false);
                return;
            }
        } catch (error) {
            console.error("AI API Error:", error);
            // Fallthrough to fallback
        }
    }

    // Fallback if API fails or simulation is forced
    localKhawarizmiEngine(userMsg, exercise);
}

// ============================================================
// محرك المحاكاة الذكية المحلية لخوارزمي (بدون API خارجي)
// ============================================================
function localKhawarizmiEngine(userMsg, exercise) {
    const msg = userMsg.trim().toLowerCase();

    // --- ردود الشكر والتحية ---
    if (/شكرا|شكراً|مرسي|عاشت|والله|فهمت|ممتاز/.test(msg)) {
        const encouragements = [
            "العفو! لقد أبليت حسناً. 🌟 ثق بنفسك وحاول مجدداً!",
            "أشجعك على المحاولة دائماً! 💪 المخطئ الوحيد هو من لا يحاول.",
            "بالتوفيق! العقول الذكية لا تيأس أبداً. 🚀"
        ];
        addKhawarizmiMessage(encouragements[Math.floor(Math.random() * encouragements.length)], false);
        return;
    }

    // --- ردود السلام والتحية ---
    if (/مرحبا|أهلا|السلام|صباح|مساء/.test(msg)) {
        addKhawarizmiMessage("أهلاً بك! 😊 أنا هنا لمساعدتك في حل هذا التمرين. هل تريد تلميحاً للبداية؟", false);
        return;
    }

    // --- استخراج سياق الدرس من بيانات التمرين ---
    const question = exercise.question ? exercise.question.replace(/<[^>]*>/g, '') : '';
    const answer = exercise.answer || '';
    const solution = exercise.solution ? exercise.solution.replace(/<[^>]*>/g, '') : '';
    const options = exercise.options || [];

    // --- توليد تلميح مرحلي ذكي ---
    const hint = generateSmartHint(question, answer, solution, options, msg);
    addKhawarizmiMessage(hint, false);
}

function generateSmartHint(question, answer, solution, options, userMsg) {
    // تحليل نوع السؤال من الكلمات المفتاحية
    const q = question.toLowerCase();
    const a = answer.toString().toLowerCase();

    // --- طلب شرح صريح ---
    const wantsExplanation = /تلميح|اشرح|ساعد|مساعدة|لا أفهم|لا أعرف|صعب|كيف|نعم/.test(userMsg);
    const wantsRule = /قاعدة|قانون|نظرية|تعريف|ماذا يعني|ما هو|ما هي/.test(userMsg);
    const wantsStep = /خطوة|خطوات|كيف أحل|طريقة/.test(userMsg);

    // --- إذا كان هناك solution مفصّل → استعمله أساساً للتلميح ---
    if (solution && solution.length > 10) {
        if (wantsStep) {
            // إخفاء جزء من الحل وإعطاء نصفه الأول فقط
            const solParts = solution.split('.');
            const hint = solParts.slice(0, Math.ceil(solParts.length / 2)).join('.');
            return `🔍 إليك بداية طريقة الحل: ${hint}... الآن حاول إكمال الباقي بنفسك! 💡`;
        }
        if (wantsExplanation) {
            // استخراج أول جملة مفيدة من الحل
            const firstSentence = solution.split(/\.|،/)[0];
            return `💡 تلميح: ${firstSentence}. انطلق من هذه الفكرة وستجد الإجابة!`;
        }
    }

    // --- تحليل نوع السؤال وتوليد تلميح مناسب ---

    // أسئلة المقارنة
    if (/أكبر|أصغر|مقارنة|ترتيب|>|</.test(q)) {
        const hints = [
            "💡 فكّر: الرقم الأكبر على خط الأعداد يكون دائماً على اليمين.",
            "🔢 قارن الأعداد خانة خانة من اليسار: الآحاد، ثم العشرات، ثم المئات...",
            "📏 الرقم الأكبر هو الذي يحتاج لفراغ أكبر على خط الأعداد."
        ];
        return hints[Math.floor(Math.random() * hints.length)];
    }

    // أسئلة الضرب
    if (/ضرب|×|حاصل ضرب/.test(q)) {
        return `✖️ تذكّر: الضرب هو جمع متكرر. مثلاً 3×4 يعني 3+3+3+3. جرّب تطبيق هذه الفكرة على السؤال!`;
    }

    // أسئلة القسمة
    if (/قسمة|قسّم|حاصل القسمة/.test(q)) {
        return `➗ تأكد أنك تقسم الرقم الأكبر على الأصغر. والباقي يجب أن يكون أصغر من المقسوم عليه دائماً!`;
    }

    // أسئلة الجمع والطرح
    if (/مجموع|جمع|أضف|طرح|الفرق|ناقص/.test(q)) {
        return `➕ راجع خانات الآحاد أولاً، ثم العشرات، ثم المئات. لا تنسَ الاحتفاظ إن وُجد!`;
    }

    // أسئلة الكسور
    if (/كسر|بسط|مقام|نسبة/.test(q)) {
        return `🍕 تخيّل الكسر كقطعة من البيتزا: البسط هو عدد القطع التي تأخذها، والمقام هو عدد القطع الكلي. ما القطعة الأكبر؟`;
    }

    // أسئلة الهندسة
    if (/مثلث|مستطيل|مربع|دائرة|محيط|مساحة|زاوية/.test(q)) {
        const geoHints = [
            "📐 محيط الشكل = مجموع أطوال جميع أضلاعه.",
            "📏 مساحة المستطيل = الطول × العرض.",
            "🔺 مجموع زوايا أي مثلث = 180 درجة دائماً!"
        ];
        return geoHints[Math.floor(Math.random() * geoHints.length)];
    }

    // أسئلة المعادلات
    if (/معادلة|x =|y =|أوجد|حل المعادلة/.test(q)) {
        return `⚖️ تذكّر مبدأ التوازن: ما تفعله على طرف المعادلة، اصنع نفسه على الطرف الآخر!`;
    }

    // أسئلة الأعداد النسبية
    if (/سالب|موجب|نسبي|أعداد نسبية/.test(q)) {
        return `🌡️ تخيّل درجات الحرارة: درجات تحت الصفر هي أعداد سالبة، وفوقه موجبة. وكلما ابتعدنا عن الصفر ازداد العدد!`;
    }

    // --- رد عام ذكي إذا لم يُعرَف نوع السؤال ---
    const generalHints = [
        `🤔 تأمّل في السؤال مجدداً: "${question.substring(0, 60)}..."، هل لاحظت الكلمة المفتاحية؟`,
        `📚 راجع درسك في هذا الموضوع. الإجابة الصحيحة موجودة في القاعدة الأساسية!`,
        `💪 أنت قادر! جرّب كل الخيارات المتبقية واحداً واحداً وفكّر أيها منطقي أكثر.`
    ];
    return generalHints[Math.floor(Math.random() * generalHints.length)];
}
