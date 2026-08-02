/**
 * Dashboard Logic & User Data Management
 * Handles XP, Levels, Badges, and Persistence
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
        badges: [] // IDs of unlocked badges
    },

    load() {
        const stored = localStorage.getItem(this.key);
        return stored ? { ...this.defaults, ...JSON.parse(stored) } : this.defaults;
    },

    save(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    },

    addXP(amount) {
        const data = this.load();
        data.xp += amount;
        data.tasksCompleted++;

        // Level Up Logic (Simple: Every 100 XP is a level)
        const calculatedLevel = Math.floor(data.xp / 100) + 1;
        if (calculatedLevel > data.level) {
            data.level = calculatedLevel;
            alert(`🎉 مبروك! لقد وصلت للمستوى ${data.level}`);
        }

        this.save(data);
        this.checkBadges(); // Check if new badges unlocked
    },

    checkBadges() {
        const data = this.load();
        const unlocked = new Set(data.badges);
        let newUnlock = false;

        BadgeDefinitions.forEach(badge => {
            if (!unlocked.has(badge.id)) {
                if (badge.condition(data)) {
                    unlocked.add(badge.id);
                    alert(`🏆 وسام جديد: ${badge.name}\n${badge.description}`);
                    newUnlock = true;
                }
            }
        });

        if (newUnlock) {
            data.badges = Array.from(unlocked);
            this.save(data);
        }
    }
};

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
    }
];

const DashboardData = {
    init() {
        // Here we could handle streak logic on load
        // For now, simpler implementation
    }
};

const DashboardUI = {
    render() {
        const data = UserData.load();

        // Update Profile
        document.getElementById('userName').innerText = data.name;
        document.getElementById('userLevel').innerText = `المستوى ${data.level}`;

        // Update XP Bar
        const currentLevelStart = (data.level - 1) * 100;
        const nextLevelStart = data.level * 100;
        const progress = ((data.xp - currentLevelStart) / 100) * 100;

        document.getElementById('xpProgress').style.width = `${progress}%`;
        document.getElementById('currentXP').innerText = `${data.xp} XP`;
        document.getElementById('nextLevelXP').innerText = `${nextLevelStart} XP`;

        // Update Stats
        document.getElementById('totalXP').innerText = data.xp;
        document.getElementById('completedTasks').innerText = data.tasksCompleted;
        document.getElementById('streakDays').innerText = data.streak;

        // Render Badges
        const grid = document.getElementById('badgesGrid');
        grid.innerHTML = '';

        BadgeDefinitions.forEach(badge => {
            const isUnlocked = data.badges.includes(badge.id);
            const div = document.createElement('div');
            div.className = `badge-item ${isUnlocked ? 'unlocked' : ''}`;
            div.innerHTML = `
                <span class="badge-icon">${badge.icon}</span>
                <p style="font-weight: bold; font-size: 0.9rem; margin: 5px 0;">${badge.name}</p>
                <p style="font-size: 0.7rem; color: #718096;">${badge.description}</p>
            `;
            grid.appendChild(div);
        });
    }
};

// Global accessor for other scripts
window.Dashboard = {
    addXP: (amount) => UserData.addXP(amount),
    completeExam: () => {
        const data = UserData.load();
        data.examsCompleted++;
        UserData.save(data);
        UserData.addXP(50); // Exams give 50 XP
    }
};
