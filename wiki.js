const wikiData = [
    // Numbers & Arithmetic
    {
        id: 1,
        term: "العدد الطبيعي",
        category: "numbers",
        definition: "هو كل عدد صحيح موجب (مثل 0، 1، 2، 3...). تستخدم الأعداد الطبيعية للعد والترتيب.",
        example: "مجموعة الأعداد الطبيعية N = {0, 1, 2, 3, ...}"
    },
    {
        id: 2,
        term: "الكسر",
        category: "numbers",
        definition: "هو تعبير عن جزء من كل، ويتكون من بسط (العدد العلوي) ومقام (العدد السفلي).",
        example: "3/4 (ثلاثة أرباع) هو كسر بسطه 3 ومقامه 4."
    },
    {
        id: 3,
        term: "العدد الأولي",
        category: "numbers",
        definition: "هو عدد طبيعي أكبر من 1، لا يقبل القسمة إلا على نفسه وعلى الواحد.",
        example: "الأعداد 2، 3، 5، 7، 11 هي أعداد أولية."
    },
    {
        id: 4,
        term: "القاسم المشترك الأكبر (PGCD)",
        category: "numbers",
        definition: "هو أكبر عدد يقسم عددين أو أكثر في نفس الوقت بدون باقٍ.",
        example: "القاسم المشترك الأكبر للعددين 12 و 18 هو 6."
    },

    // Geometry
    {
        id: 5,
        term: "الزاوية القائمة",
        category: "geometry",
        definition: "هي زاوية قياسها 90 درجة بالضبط. تتشكل عند تعامد مستقيمين.",
        example: "زوايا المربع والمستطيل كلها زوايا قائمة."
    },
    {
        id: 6,
        term: "المثلث متساوي الساقين",
        category: "geometry",
        definition: "هو مثلث فيه ضلعان متساويان في الطول، وزاويتا القاعدة متساويتان أيضاً.",
        example: "مثلث أطوال أضلاعه 5سم، 5سم، 3سم."
    },
    {
        id: 7,
        term: "محور التناظر",
        category: "geometry",
        definition: "هو مستقيم يقسم الشكل إلى نصفين متطابقين تماماً ينطبقان على بعضهما عند الطي.",
        example: "المستطيل له محورا تناظر."
    },
    {
        id: 8,
        term: "نظريّة فيثاغورس",
        category: "geometry",
        definition: "في المثلث القائم، مربع طول الوتر يساوي مجموع مربعي طولي الضلعين القائمين.",
        example: "إذا كان الضلعان القائمان 3سم و 4سم، فإن الوتر² = 3² + 4² = 9 + 16 = 25، إذن الوتر = 5سم."
    },

    // Algebra
    {
        id: 9,
        term: "المعادلة",
        category: "algebra",
        definition: "مساواة بين طرفين تتضمن مجهولاً واحداً أو أكثر (غالباً يرمز له بـ x).",
        example: "2x + 5 = 15 هي معادلة من الدرجة الأولى."
    },
    {
        id: 10,
        term: "التناسب",
        category: "algebra",
        definition: "هو تساوي نسبتين أو أكثر. نقول أن الكميتين متناسبتان إذا كانت النسبة بينهما ثابتة.",
        example: "إذا كان ثمن قلمين 10 دنانير، وثمن 4 أقلام 20 ديناراً، فهذا تناسب."
    },

    // Statistics
    {
        id: 11,
        term: "المنوال",
        category: "stats",
        definition: "هو القيمة الأكثر تكراراً في مجموعة من البيانات.",
        example: "في السلسلة: 2, 5, 2, 7, 2, 8. المنوال هو 2."
    },
    {
        id: 12,
        term: "التكرار",
        category: "stats",
        definition: "هو عدد مرات ظهور قيمة معينة في سلسلة إحصائية.",
        example: "إذا حصل 5 تلاميذ على العلامة 10، فإن تكرار العلامة 10 هو 5."
    }
];

const searchInput = document.getElementById('searchInput');
const termsGrid = document.getElementById('termsGrid');
const catBtns = document.querySelectorAll('.cat-btn');

let currentCategory = 'all';

function renderTerms(filterText = '') {
    termsGrid.innerHTML = '';

    const filtered = wikiData.filter(item => {
        const matchesSearch = item.term.includes(filterText) || item.definition.includes(filterText);
        const matchesCat = currentCategory === 'all' || item.category === currentCategory;
        return matchesSearch && matchesCat;
    });

    if (filtered.length === 0) {
        termsGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: #a0aec0;">لا توجد نتائج مطابقة</p>';
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'term-card';
        card.onclick = () => openModal(item);

        card.innerHTML = `
            <div class="term-title">
                ${item.term}
                <span class="term-category">${getCategoryName(item.category)}</span>
            </div>
            <p class="term-def">${item.definition.substring(0, 80)}...</p>
        `;
        termsGrid.appendChild(card);
    });
}

function getCategoryName(cat) {
    const map = {
        'numbers': 'أعداد',
        'geometry': 'هندسة',
        'algebra': 'جبر',
        'stats': 'إحصاء'
    };
    return map[cat] || cat;
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
    renderTerms(e.target.value);
});

catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Active Class
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter
        currentCategory = btn.dataset.cat;
        renderTerms(searchInput.value);
    });
});

// Modal Logic
const modal = document.getElementById('termModal');

function openModal(item) {
    document.getElementById('modalTitle').textContent = item.term;
    document.getElementById('modalCategory').textContent = getCategoryName(item.category);
    document.getElementById('modalDef').textContent = item.definition;

    const exampleBox = document.getElementById('modalExample');
    if (item.example) {
        exampleBox.style.display = 'block';
        document.getElementById('exampleText').textContent = item.example;
    } else {
        exampleBox.style.display = 'none';
    }

    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

// Close on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Initial Render
renderTerms();
