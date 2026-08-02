/**
 * Dashboard Logic & User Data Management
 * Handles XP, Levels, Badges, and Persistence (localStorage + Firebase Firestore)
 */

const UserData = {
    key: 'MathApp_User',

    defaults: {
        name: "طالب مجتهد",
        xp: 0,
        level: 1,
        tasksCompleted: 0,
        examsCompleted: 0,
        streak: 1,
        lastLogin: new Date().toDateString(),
        badges: []
    },

    load() {
        const stored = localStorage.getItem(this.key);
        return stored ? { ...this.defaults, ...JSON.parse(stored) } : { ...this.defaults };
    },

    save(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
        // مزامنة مع Firestore إذا كان المستخدم مسجلاً
        this.syncToFirestore(data);
    },

    // ==============================
    // مزامنة مع Firebase Firestore
    // ==============================
    async syncToFirestore(data) {
        try {
            const auth = window.firebaseAuth;
            const db = window.firebaseDB;
            const setDoc = window.firebaseSetDoc;
            const doc = window.firebaseDoc;

            if (!auth || !db || !setDoc || !doc) return;
            const user = auth.currentUser;
            if (!user) return;

            await setDoc(doc(db, 'users_progress', user.uid), {
                xp: data.xp,
                level: data.level,
                tasksCompleted: data.tasksCompleted,
                examsCompleted: data.examsCompleted,
                streak: data.streak,
                badges: data.badges,
                lastUpdated: new Date().toISOString()
            }, { merge: true });

        } catch (e) {
            // فشل الاتصال → الحفظ المحلي يكفي
            console.warn('Firestore sync failed (offline?)', e.message);
        }
    },

    // تحميل بيانات المستخدم من Firestore عند تسجيل الدخول
    async loadFromFirestore(uid) {
        try {
            const db = window.firebaseDB;
            const getDoc = window.firebaseGetDoc;
            const doc = window.firebaseDoc;

            if (!db || !getDoc || !doc) return null;

            const docSnap = await getDoc(doc(db, 'users_progress', uid));
            if (docSnap.exists()) {
                const remote = docSnap.data();
                const local = this.load();

                // دمج البيانات: الأعلى قيمة يفوز
                const merged = {
                    ...local,
                    xp: Math.max(local.xp, remote.xp || 0),
                    level: Math.max(local.level, remote.level || 1),
                    tasksCompleted: Math.max(local.tasksCompleted, remote.tasksCompleted || 0),
                    examsCompleted: Math.max(local.examsCompleted, remote.examsCompleted || 0),
                    streak: Math.max(local.streak, remote.streak || 1),
                    badges: [...new Set([...(local.badges || []), ...(remote.badges || [])])]
                };

                this.save(merged);
                return merged;
            }
        } catch (e) {
            console.warn('Firestore load failed:', e.message);
        }
        return null;
    },

    addXP(amount) {
        const data = this.load();
        data.xp += amount;
        data.tasksCompleted++;

        // Level Up: كل 100 XP = مستوى جديد
        const calculatedLevel = Math.floor(data.xp / 100) + 1;
        if (calculatedLevel > data.level) {
            data.level = calculatedLevel;
            showLevelUpToast(data.level);
        }

        this.save(data);
        this.checkBadges();
    },

    checkBadges() {
        const data = this.load();
        const unlocked = new Set(data.badges);
        let newUnlock = false;

        BadgeDefinitions.forEach(badge => {
            if (!unlocked.has(badge.id) && badge.condition(data)) {
                unlocked.add(badge.id);
                showBadgeToast(badge);
                newUnlock = true;
            }
        });

        if (newUnlock) {
            data.badges = Array.from(unlocked);
            this.save(data);
        }
    }
};

// ===== Toast Notifications (بدل alert!) =====
function showLevelUpToast(level) {
    showToast(`🎉 مبروك! وصلت للمستوى ${level}!`, '#48bb78');
}

function showBadgeToast(badge) {
    showToast(`🏆 وسام جديد: ${badge.icon} ${badge.name}`, '#667eea');
}

function showToast(message, color = '#333') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
        background: ${color}; color: white; padding: 12px 24px;
        border-radius: 25px; font-size: 15px; font-weight: bold;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 99999;
        animation: fadeInUp 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

const BadgeDefinitions = [
    {
        id: 'first_step',
        name: "البداية القوية",
        description: "أكمل تمرينك الأول",
        icon: "🚀",
        condition: (data) => data.tasksCompleted >= 1
    },
    {
        id: 'dedicated',
        name: "المثابر",
        description: "اجمع 100 نقطة خبرة",
        icon: "💪",
        condition: (data) => data.xp >= 100
    },
    {
        id: 'scholar',
        name: "المتفوق",
        description: "وصل للمستوى 5",
        icon: "🎓",
        condition: (data) => data.level >= 5
    },
    {
        id: 'exam_master',
        name: "بطل الامتحانات",
        description: "أكمل امتحانك الأول",
        icon: "📝",
        condition: (data) => data.examsCompleted >= 1
    },
    {
        id: 'streak_king',
        name: "ملك الالتزام",
        description: "واظب على الدخول 3 أيام",
        icon: "🔥",
        condition: (data) => data.streak >= 3
    },
    {
        id: 'lesson_master',
        name: "سيد الدروس",
        description: "أكمل 5 دروس كاملة",
        icon: "📚",
        condition: (data) => data.tasksCompleted >= 5
    },
    {
        id: 'centurion',
        name: "المئوي",
        description: "أكمل 100 تمرين",
        icon: "💯",
        condition: (data) => data.tasksCompleted >= 100
    }
];

const DashboardUI = {
    render() {
        const data = UserData.load();

        if (document.getElementById('userName'))
            document.getElementById('userName').innerText = data.name;
        if (document.getElementById('userLevel'))
            document.getElementById('userLevel').innerText = `المستوى ${data.level}`;

        const currentLevelStart = (data.level - 1) * 100;
        const nextLevelStart = data.level * 100;
        const progress = ((data.xp - currentLevelStart) / 100) * 100;

        if (document.getElementById('xpProgress'))
            document.getElementById('xpProgress').style.width = `${Math.min(progress, 100)}%`;
        if (document.getElementById('currentXP'))
            document.getElementById('currentXP').innerText = `${data.xp} XP`;
        if (document.getElementById('nextLevelXP'))
            document.getElementById('nextLevelXP').innerText = `${nextLevelStart} XP`;
        if (document.getElementById('totalXP'))
            document.getElementById('totalXP').innerText = data.xp;
        if (document.getElementById('completedTasks'))
            document.getElementById('completedTasks').innerText = data.tasksCompleted;
        if (document.getElementById('streakDays'))
            document.getElementById('streakDays').innerText = data.streak;

        const grid = document.getElementById('badgesGrid');
        if (!grid) return;
        grid.innerHTML = '';

        BadgeDefinitions.forEach(badge => {
            const isUnlocked = data.badges.includes(badge.id);
            const div = document.createElement('div');
            div.className = `badge-item ${isUnlocked ? 'unlocked' : ''}`;
            div.innerHTML = `
                <span class="badge-icon">${badge.icon}</span>
                <p style="font-weight: bold; font-size: 0.9rem; margin: 5px 0;">${badge.name}</p>
                <p style="font-size: 0.7rem; color: #718096;">${badge.description}</p>
                ${isUnlocked ? '<span style="font-size:10px;color:#48bb78;">✅ مفتوح</span>' : '<span style="font-size:10px;color:#a0aec0;">🔒 مقفل</span>'}
            `;
            grid.appendChild(div);
        });
    }
};

// تحميل البيانات من Firestore عند تسجيل دخول المستخدم
window.addEventListener('load', () => {
    // ننتظر تهيئة Firebase
    setTimeout(() => {
        const onAuth = window.firebaseOnAuthStateChanged;
        const auth = window.firebaseAuth;
        if (onAuth && auth) {
            onAuth(auth, async (user) => {
                if (user) {
                    await UserData.loadFromFirestore(user.uid);
                    if (typeof DashboardUI !== 'undefined') DashboardUI.render();
                }
            });
        }
    }, 1000);
});

// Global accessor for other scripts
window.Dashboard = {
    addXP: (amount) => UserData.addXP(amount),
    completeExam: () => {
        const data = UserData.load();
        data.examsCompleted++;
        UserData.save(data);
        UserData.addXP(50);
    }
};
