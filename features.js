// ملف الميزات المتقدمة للمنصة

// إدارة التقدم المحلي
class ProgressManager {
    constructor() {
        this.storageKey = 'math_platform_progress';
        this.statsKey = 'math_platform_stats';
    }

    // حفظ التقدم
    saveProgress(level, lesson, exerciseIndex) {
        const progress = {
            level: level,
            lesson: lesson,
            exerciseIndex: exerciseIndex,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(this.storageKey, JSON.stringify(progress));
    }

    // استرجاع التقدم
    loadProgress() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : null;
    }

    // حفظ الإحصائيات
    saveStats(level, lesson, completed) {
        let stats = this.loadStats();
        
        if (!stats[level]) {
            stats[level] = {};
        }
        if (!stats[level][lesson]) {
            stats[level][lesson] = {
                completed: 0,
                total: 0,
                lastCompleted: null
            };
        }
        
        stats[level][lesson].completed = completed;
        stats[level][lesson].total = curriculum[level].lessons[lesson].exercises.length;
        stats[level][lesson].lastCompleted = new Date().toISOString();
        
        localStorage.setItem(this.statsKey, JSON.stringify(stats));
    }

    // استرجاع الإحصائيات
    loadStats() {
        const saved = localStorage.getItem(this.statsKey);
        return saved ? JSON.parse(saved) : {};
    }

    // حساب النسبة المئوية الإجمالية
    calculateOverallProgress() {
        const stats = this.loadStats();
        let totalCompleted = 0;
        let totalExercises = 0;

        for (let level in stats) {
            for (let lesson in stats[level]) {
                totalCompleted += stats[level][lesson].completed;
                totalExercises += stats[level][lesson].total;
            }
        }

        return totalExercises > 0 ? (totalCompleted / totalExercises) * 100 : 0;
    }
}

// إدارة الإشعارات
class NotificationManager {
    constructor() {
        this.notifications = [];
    }

    // إضافة إشعار
    addNotification(message, type = 'info') {
        const notification = {
            id: Date.now(),
            message: message,
            type: type,
            timestamp: new Date()
        };
        
        this.notifications.push(notification);
        this.showNotification(notification);
    }

    // عرض الإشعار
    showNotification(notification) {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `notification notification-${notification.type}`;
        notificationDiv.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${notification.message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // إضافة الإشعار للصفحة
        document.body.appendChild(notificationDiv);

        // إزالة الإشعار تلقائياً بعد 5 ثوان
        setTimeout(() => {
            if (notificationDiv.parentElement) {
                notificationDiv.remove();
            }
        }, 5000);
    }

    // إشعار النجاح
    success(message) {
        this.addNotification(message, 'success');
    }

    // إشعار التحذير
    warning(message) {
        this.addNotification(message, 'warning');
    }

    // إشعار الخطأ
    error(message) {
        this.addNotification(message, 'error');
    }
}

// إدارة المفضلة
class FavoritesManager {
    constructor() {
        this.favoritesKey = 'math_platform_favorites';
    }

    // إضافة تمرين للمفضلة
    addToFavorites(level, lesson, exerciseIndex) {
        let favorites = this.loadFavorites();
        const key = `${level}-${lesson}-${exerciseIndex}`;
        
        if (!favorites.includes(key)) {
            favorites.push(key);
            this.saveFavorites(favorites);
            return true;
        }
        return false;
    }

    // إزالة تمرين من المفضلة
    removeFromFavorites(level, lesson, exerciseIndex) {
        let favorites = this.loadFavorites();
        const key = `${level}-${lesson}-${exerciseIndex}`;
        
        const index = favorites.indexOf(key);
        if (index > -1) {
            favorites.splice(index, 1);
            this.saveFavorites(favorites);
            return true;
        }
        return false;
    }

    // التحقق من وجود تمرين في المفضلة
    isFavorite(level, lesson, exerciseIndex) {
        const favorites = this.loadFavorites();
        const key = `${level}-${lesson}-${exerciseIndex}`;
        return favorites.includes(key);
    }

    // حفظ المفضلة
    saveFavorites(favorites) {
        localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
    }

    // استرجاع المفضلة
    loadFavorites() {
        const saved = localStorage.getItem(this.favoritesKey);
        return saved ? JSON.parse(saved) : [];
    }
}

// إدارة البحث
class SearchManager {
    constructor() {
        this.searchResults = [];
    }

    // البحث في التمارين
    searchExercises(query) {
        this.searchResults = [];
        query = query.toLowerCase().trim();

        if (query.length < 2) return [];

        for (let level in curriculum) {
            for (let lesson in curriculum[level].lessons) {
                const exercises = curriculum[level].lessons[lesson].exercises;
                
                exercises.forEach((exercise, index) => {
                    if (exercise.question.toLowerCase().includes(query) ||
                        exercise.solution.toLowerCase().includes(query) ||
                        lesson.toLowerCase().includes(query)) {
                        
                        this.searchResults.push({
                            level: parseInt(level),
                            lesson: lesson,
                            exerciseIndex: index,
                            question: exercise.question,
                            match: this.highlightMatch(exercise.question, query)
                        });
                    }
                });
            }
        }

        return this.searchResults;
    }

    // تمييز النص المطابق
    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
}

// إدارة الطباعة
class PrintManager {
    constructor() {
        this.printStyles = `
            @media print {
                body { font-size: 12pt; }
                .header, .back-button, .exercise-controls, .progress-container { display: none !important; }
                .exercise-content { border: none; box-shadow: none; }
                .exercise-question, .exercise-solution { page-break-inside: avoid; }
            }
        `;
    }

    // طباعة التمرين الحالي
    printCurrentExercise() {
        const exerciseContent = document.querySelector('.exercise-content');
        if (!exerciseContent) return;

        // إنشاء نافذة طباعة جديدة
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>تمرين رياضيات</title>
                <style>
                    body { font-family: 'Cairo', sans-serif; margin: 20px; }
                    ${this.printStyles}
                </style>
            </head>
            <body>
                ${exerciseContent.outerHTML}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    }

    // تصدير التمارين كملف PDF
    exportToPDF(level, lesson) {
        // هذه الميزة تتطلب مكتبة خارجية مثل jsPDF
        console.log('تصدير PDF - يتطلب مكتبة إضافية');
    }
}

// إدارة الألعاب التعليمية
class GameManager {
    constructor() {
        this.currentGame = null;
        this.score = 0;
    }

    // لعبة حساب سريع
    startQuickMath() {
        const num1 = Math.floor(Math.random() * 20) + 1;
        const num2 = Math.floor(Math.random() * 20) + 1;
        const operators = ['+', '-', '×', '÷'];
        const operator = operators[Math.floor(Math.random() * operators.length)];
        
        let correctAnswer;
        switch(operator) {
            case '+': correctAnswer = num1 + num2; break;
            case '-': correctAnswer = num1 - num2; break;
            case '×': correctAnswer = num1 * num2; break;
            case '÷': 
                correctAnswer = num1 / num2;
                if (!Number.isInteger(correctAnswer)) {
                    return this.startQuickMath(); // إعادة المحاولة للحصول على عدد صحيح
                }
                break;
        }

        const userAnswer = prompt(`احسب: ${num1} ${operator} ${num2} = ?`);
        
        if (parseInt(userAnswer) === correctAnswer) {
            this.score += 10;
            notificationManager.success('أحسنت! إجابة صحيحة');
        } else {
            notificationManager.error(`خطأ! الإجابة الصحيحة هي: ${correctAnswer}`);
        }

        return this.score;
    }

    // لعبة ترتيب الأعداد
    startNumberSort() {
        const numbers = [];
        for (let i = 0; i < 5; i++) {
            numbers.push(Math.floor(Math.random() * 100) + 1);
        }
        
        const sortedNumbers = [...numbers].sort((a, b) => a - b);
        const userInput = prompt(`رتب الأعداد التالية من الأصغر إلى الأكبر:\n${numbers.join(', ')}`);
        
        const userNumbers = userInput.split(',').map(n => parseInt(n.trim()));
        
        if (JSON.stringify(userNumbers) === JSON.stringify(sortedNumbers)) {
            this.score += 15;
            notificationManager.success('أحسنت! ترتيب صحيح');
        } else {
            notificationManager.error(`خطأ! الترتيب الصحيح هو: ${sortedNumbers.join(', ')}`);
        }

        return this.score;
    }
}

// تهيئة المدراء
const progressManager = new ProgressManager();
const notificationManager = new NotificationManager();
const favoritesManager = new FavoritesManager();
const searchManager = new SearchManager();
const printManager = new PrintManager();
const gameManager = new GameManager();

// إضافة CSS للإشعارات
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    }

    .notification-content {
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .notification-message {
        flex: 1;
        margin-left: 10px;
    }

    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
        padding: 5px;
    }

    .notification-success {
        border-left: 4px solid #48bb78;
    }

    .notification-warning {
        border-left: 4px solid #ed8936;
    }

    .notification-error {
        border-left: 4px solid #e53e3e;
    }

    .notification-info {
        border-left: 4px solid #4299e1;
    }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;

// إضافة الأنماط للصفحة
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// دالة لاسترجاع التقدم عند تحميل الصفحة
function restoreProgress() {
    const progress = progressManager.loadProgress();
    if (progress) {
        const shouldRestore = confirm('وجدنا تقدم سابق. هل تريد استرجاعه؟');
        if (shouldRestore) {
            selectLevel(progress.level);
            setTimeout(() => {
                selectLesson(progress.lesson);
                currentExerciseIndex = progress.exerciseIndex;
                loadExercise();
            }, 100);
        }
    }
}

// دالة لعرض الإحصائيات
function showStats() {
    const stats = progressManager.loadStats();
    const overallProgress = progressManager.calculateOverallProgress();
    
    let statsHTML = `
        <div class="stats-modal">
            <h2>إحصائيات التقدم</h2>
            <div class="overall-progress">
                <h3>التقدم الإجمالي: ${Math.round(overallProgress)}%</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${overallProgress}%"></div>
                </div>
            </div>
            <div class="level-stats">
    `;

    for (let level in stats) {
        const levelName = curriculum[level].title;
        let levelProgress = 0;
        let totalExercises = 0;
        let completedExercises = 0;

        for (let lesson in stats[level]) {
            totalExercises += stats[level][lesson].total;
            completedExercises += stats[level][lesson].completed;
        }

        levelProgress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

        statsHTML += `
            <div class="level-stat">
                <h4>${levelName}</h4>
                <p>${completedExercises}/${totalExercises} تمرين مكتمل</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${levelProgress}%"></div>
                </div>
            </div>
        `;
    }

    statsHTML += `
            </div>
            <button onclick="this.parentElement.remove()" class="btn btn-primary">إغلاق</button>
        </div>
    `;

    // إضافة النافذة المنبثقة
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = statsHTML;
    document.body.appendChild(modal);
}

// إضافة أزرار إضافية للواجهة
function addAdvancedFeatures() {
    // إضافة زر الإحصائيات
    const statsButton = document.createElement('button');
    statsButton.className = 'btn btn-info stats-btn';
    statsButton.innerHTML = '<i class="fas fa-chart-bar"></i> الإحصائيات';
    statsButton.onclick = showStats;
    
    // إضافة زر الطباعة
    const printButton = document.createElement('button');
    printButton.className = 'btn btn-secondary print-btn';
    printButton.innerHTML = '<i class="fas fa-print"></i> طباعة';
    printButton.onclick = () => printManager.printCurrentExercise();
    
    // إضافة الأزرار للواجهة
    const header = document.querySelector('.header-content');
    if (header) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'header-buttons';
        buttonContainer.appendChild(statsButton);
        buttonContainer.appendChild(printButton);
        header.appendChild(buttonContainer);
    }
}

// تهيئة الميزات المتقدمة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    addAdvancedFeatures();
    restoreProgress();
    
    // إضافة إشعار ترحيب
    setTimeout(() => {
        notificationManager.success('مرحباً بك في منصة الرياضيات التفاعلية! 🎉');
    }, 1000);
});
