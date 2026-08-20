const wikiData = [
    // === الأعداد والحساب (Numbers & Arithmetic) ===
    {
        id: 1, term: "العدد الطبيعي", category: "numbers",
        definition: "هو كل عدد صحيح موجب (مثل 0، 1، 2، 3...). تستخدم الأعداد الطبيعية للعد والترتيب.",
        example: "مجموعة الأعداد الطبيعية N = {0, 1, 2, 3, ...}"
    },
    {
        id: 2, term: "العدد الصحيح النسبي", category: "numbers",
        definition: "يشمل الأعداد الطبيعية (الموجبة) والأعداد السالبة والصفر.",
        example: "مجموعة الأعداد Z = {..., -3, -2, -1, 0, 1, 2, 3, ...}"
    },
    {
        id: 3, term: "العدد العشري", category: "numbers",
        definition: "هو عدد يحتوي على فاصلة عشرية، ويمثل جزءاً من عدد صحيح زائد جزء كسري.",
        example: "العدد 3.14 هو عدد عشري يتكون من 3 (جزء صحيح) و 14 (جزء عشري)."
    },
    {
        id: 4, term: "العدد الناطق (النسبي)", category: "numbers",
        definition: "هو كل عدد يمكن كتابته على شكل كسر a/b حيث a و b عددان صحيحان نسبيان و b لا يساوي الصفر.",
        example: "-5/4، 3/1، 0.5 كلها أعداد ناطقة."
    },
    {
        id: 5, term: "العدد الأصم", category: "numbers",
        definition: "هو عدد حقيقي لا يمكن كتابته على شكل كسر، وجزؤه العشري غير منتهٍ وغير دوري.",
        example: "العدد π (بي) والجذر التربيعي لـ 2 (√2) هما أعداد صماء."
    },
    {
        id: 6, term: "الكسر", category: "numbers",
        definition: "هو تعبير عن جزء من كل، ويتكون من بسط (العدد العلوي) ومقام (العدد السفلي).",
        example: "3/4 (ثلاثة أرباع) كسر بسطه 3 ومقامه 4."
    },
    {
        id: 7, term: "العدد الأولي", category: "numbers",
        definition: "هو عدد طبيعي أكبر من 1، لا يقبل القسمة إلا على نفسه وعلى الواحد.",
        example: "الأعداد 2، 3، 5، 7، 11، 13 هي أعداد أولية."
    },
    {
        id: 8, term: "القاسم المشترك الأكبر (PGCD)", category: "numbers",
        definition: "هو أكبر عدد طبيعي يقسم عددين أو أكثر في نفس الوقت بدون باقٍ.",
        example: "القاسم المشترك الأكبر للعددين 12 و 18 هو 6."
    },
    {
        id: 9, term: "المضاعف المشترك الأصغر (PPCM)", category: "numbers",
        definition: "هو أصغر عدد طبيعي (غير معدوم) يكون مضاعفاً لعددين أو أكثر.",
        example: "المضاعف المشترك الأصغر للعددين 4 و 6 هو 12."
    },
    {
        id: 10, term: "القوة (الأس)", category: "numbers",
        definition: "تعبّر عن ضرب العدد في نفسه عدة مرات. يُكتب كـ aⁿ حيث a هو الأساس و n هو الأس.",
        example: "2³ = 2 × 2 × 2 = 8."
    },
    {
        id: 11, term: "الكتابة العلمية", category: "numbers",
        definition: "هي طريقة لكتابة الأعداد الكبيرة جداً أو الصغيرة جداً باستخدام قوى العدد 10، على الشكل a × 10ⁿ حيث a عدد عشري (1 ≤ a < 10).",
        example: "الكتابة العلمية للعدد 4500 هي 4.5 × 10³."
    },

    // === الهندسة (Geometry) ===
    {
        id: 12, term: "الزاوية القائمة", category: "geometry",
        definition: "هي زاوية قياسها 90 درجة بالضبط، وتنشأ من تعامد مستقيمين.",
        example: "زوايا المستطيل كلها قائمة."
    },
    {
        id: 13, term: "الزاوية الحادة", category: "geometry",
        definition: "هي زاوية قياسها أكبر من 0 وأصغر من 90 درجة.",
        example: "زاوية قياسها 45 درجة هي زاوية حادة."
    },
    {
        id: 14, term: "الزاوية المنفرجة", category: "geometry",
        definition: "هي زاوية قياسها أكبر من 90 وأصغر من 180 درجة.",
        example: "زاوية قياسها 120 درجة هي زاوية منفرجة."
    },
    {
        id: 15, term: "المستقيمان المتوازيان", category: "geometry",
        definition: "هما مستقيمان يقعان في نفس المستوي ولا يتقاطعان أبداً مهما امتدا.",
        example: "حافتا المسطرة تمثلان مستقيمين متوازيين."
    },
    {
        id: 16, term: "المستقيمان المتعامدان", category: "geometry",
        definition: "هما مستقيمان يتقاطعان مشكلين أربع زوايا قائمة (90 درجة).",
        example: "محورا المعلم المتعامد والمتجانس."
    },
    {
        id: 17, term: "المثلث متساوي الساقين", category: "geometry",
        definition: "هو مثلث فيه ضلعان متقايسان، وزاويتا قاعدته متقايستان.",
        example: "مثلث أضلاعه 5سم، 5سم، 3سم."
    },
    {
        id: 18, term: "المثلث المتقايس الأضلاع", category: "geometry",
        definition: "هو مثلث جميع أضلاعه متساوية الطول، وجميع زواياه قياسها 60 درجة.",
        example: "مثلث أطوال أضلاعه 4سم، 4سم، 4سم."
    },
    {
        id: 19, term: "نظريّة فيثاغورس", category: "geometry",
        definition: "في المثلث القائم، مربع طول الوتر يساوي مجموع مربعي طولي الضلعين القائمين (a² + b² = c²).",
        example: "إذا كان الضلعان القائمان 3 و 4، فإن الوتر² = 9 + 16 = 25، إذن الوتر = 5."
    },
    {
        id: 20, term: "نظريّة طالس", category: "geometry",
        definition: "إذا قطع مستقيمان متوازيان مستقيمين متقاطعين، فإنهما يحددان على هذين المستقيمين أطوالاً متناسبة.",
        example: "في مثلث ABC، إذا رسمنا مستقيماً يوازي BC ويقطع الضلعين الآخرين في M و N، فإن AM/AB = AN/AC = MN/BC."
    },
    {
        id: 21, term: "محور التناظر", category: "geometry",
        definition: "هو مستقيم يقسم الشكل إلى نصفين متطابقين تماماً يحلان محل بعضهما بالطي.",
        example: "للمستطيل محورا تناظر (الطول والعرض)."
    },
    {
        id: 22, term: "مركز التناظر", category: "geometry",
        definition: "تكون نقطة O مركز تناظر لشكل إذا كان كل نصف للشكل هو نظير النصف الآخر بالنسبة إلى O.",
        example: "نقطة تقاطع قطري متوازي الأضلاع هي مركز تناظره."
    },
    {
        id: 23, term: "الدائرة المحيطة بمثلث", category: "geometry",
        definition: "هي الدائرة التي تشمل جميع رؤوس المثلث. مركزها هو نقطة تقاطع محاور أضلاع المثلث.",
        example: "في المثلث القائم، مركز الدائرة المحيطة هو منتصف الوتر."
    },

    // === الجبر والتناسب (Algebra) ===
    {
        id: 24, term: "المعادلة", category: "algebra",
        definition: "هي مساواة جبرية تحتوي على مجهول واحد أو أكثر (مثل x). حل المعادلة يعني إيجاد قيمة المجهول.",
        example: "في المعادلة 2x + 4 = 10، المجهول هو x وقيمته 3."
    },
    {
        id: 25, term: "المتراجحة", category: "algebra",
        definition: "هي متباينة رياضية تحتوي على مجهول، وتستخدم رموز التباين (>, <, ≥, ≤).",
        example: "المتراجحة x + 2 > 5 يعني أن الحلول هي كل الأعداد الأكبر تماماً من 3."
    },
    {
        id: 26, term: "النشر", category: "algebra",
        definition: "في الجبر، هو تحويل جداء (ضرب) عبارات إلى مجموع أو فرق (إزالة الأقواس).",
        example: "نشر العبارة a(b + c) يعطي ab + ac."
    },
    {
        id: 27, term: "التحليل", category: "algebra",
        definition: "هو عكس النشر؛ أي تحويل مجموع أو فرق إلى جداء عوامل.",
        example: "تحليل العبارة ab + ac يعطي العبارة a(b + c)، حيث a هو العامل المشترك."
    },
    {
        id: 28, term: "التناسبية", category: "algebra",
        definition: "يكون مقداران متناسبين إذا كان ضرب أحدهما في عدد يؤدي إلى ضرب الآخر في نفس العدد. النسبة بينهما تبقى ثابتة.",
        example: "إذا كان ثمن قلمين 10 دج، فإن ثمن 4 أقلام هو 20 دج."
    },
    {
        id: 29, term: "معامل التوجيه", category: "algebra",
        definition: "يعبر عن ميل المستقيم في معلم متجانس، وهو العدد a في معادلة المستقيم y = ax + b.",
        example: "في الدالة الخطية f(x) = 3x، المنحنى له معامل توجيه يساوي 3."
    },

    // === إحصاء ودوال (Statistics & Functions) ===
    {
        id: 30, term: "الدالة الخطية", category: "stats",
        definition: "هي علاقة رياضية تربط كل عدد x بعدد ax، وتُكتب f(x) = ax. تمثيلها البياني هو مستقيم يمر بالمبدأ.",
        example: "الدالة f(x) = 2x هي دالة خطية."
    },
    {
        id: 31, term: "الدالة التآلفية", category: "stats",
        definition: "هي علاقة تربط كل عدد x بعدد ax+b، وتُكتب f(x) = ax + b. تمثيلها البياني مستقيم لا يمر بالمبدأ (إلا إذا كان b=0).",
        example: "الدالة f(x) = -3x + 5 هي دالة تآلفية."
    },
    {
        id: 32, term: "المنوال", category: "stats",
        definition: "في الإحصاء، المنوال هو القيمة التي لها أكبر تكرار في سلسلة إحصائية.",
        example: "في السلسلة (2، 5، 5، 7، 8) المنوال هو 5 لأنه الأكثر تكراراً."
    },
    {
        id: 33, term: "التواتر (التكرار النسبي)", category: "stats",
        definition: "هو نسبة تكرار قيمة معينة إلى إجمالي عدد التكرارات في السلسلة الإحصائية.",
        example: "إذا كان تكرار العلامة 10 هو 5 من أصل 20 تلميذا، فالتواتر هو 5/20 = 0.25."
    },
    {
        id: 34, term: "المتوسط الحسابي", category: "stats",
        definition: "هو مجموع قيم السلسلة الإحصائية مقسوماً على عددها الكلي.",
        example: "متوسط الأعداد 4، 6، 8 هو (4+6+8)/3 = 6."
    }
];

const searchInput = document.getElementById('searchInput');
const termsGrid = document.getElementById('termsGrid');
const catBtns = document.querySelectorAll('.cat-btn');

let currentCategory = 'all';

function renderTerms(filterText = '') {
    termsGrid.innerHTML = '';

    const lowerFilter = filterText.toLowerCase();

    const filtered = wikiData.filter(item => {
        const matchesSearch = item.term.toLowerCase().includes(lowerFilter) || item.definition.toLowerCase().includes(lowerFilter);
        const matchesCat = currentCategory === 'all' || item.category === currentCategory;
        return matchesSearch && matchesCat;
    });

    if (filtered.length === 0) {
        termsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-lightbulb" style="font-size: 3rem; margin-bottom: 1rem; color: #fbbf24;"></i>
                <h3 style="color: #94a3b8; font-size: 1.25rem;">شكراً على مساهمتك!</h3>
                <p style="margin-top: 0.5rem;">لقد تم تسجيل هذا المصطلح، وسنقوم بإضافته إلى القاموس قريباً جداً لإثراء المنصة بفضلك.</p>
            </div>
        `;

        const trimmedTerm = filterText.trim();
        if (trimmedTerm.length > 2) {
            clearTimeout(window.missingTermTimeout);
            window.missingTermTimeout = setTimeout(async () => {
                if (window.db && window.addDoc && window.collection) {
                    try {
                        await window.addDoc(window.collection(window.db, 'missing_terms'), {
                            term: trimmedTerm,
                            timestamp: Date.now()
                        });
                        console.log("Term saved for admin review:", trimmedTerm);
                    } catch (e) {
                        console.error("Failed to save missing term", e);
                    }
                }
            }, 2500); // Wait 2.5 seconds before recording to avoid partial words
        }
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'term-card';
        card.onclick = () => openModal(item);

        // Highlight matching text if searching
        let highlightedTerm = item.term;
        if (filterText.trim() !== '') {
            const regex = new RegExp(`(${filterText})`, 'gi');
            highlightedTerm = item.term.replace(regex, '<span class="highlight">$1</span>');
        }

        card.innerHTML = `
            <div class="term-title">
                ${highlightedTerm}
                <span class="term-category">${getCategoryIcon(item.category)} ${getCategoryName(item.category)}</span>
            </div>
            <p class="term-def">${item.definition}</p>
        `;
        termsGrid.appendChild(card);
    });
}

function getCategoryName(cat) {
    const map = {
        'numbers': 'أعداد وحساب',
        'geometry': 'هندسة',
        'algebra': 'جبر وتناسب',
        'stats': 'إحصاء ودوال'
    };
    return map[cat] || cat;
}

function getCategoryIcon(cat) {
    const map = {
        'numbers': '<i class="fas fa-hashtag"></i>',
        'geometry': '<i class="fas fa-shapes"></i>',
        'algebra': '<i class="fas fa-subscript"></i>',
        'stats': '<i class="fas fa-chart-bar"></i>'
    };
    return map[cat] || '';
}

// Function to format math text with LTR boxes (similar to situations)
function formatMathText(text) {
    // Basic regex to find math expressions (numbers, simple fractions, equations like 2x, etc.)
    const mathPattern = /((?:[a-zA-Z]\s*=\s*)?[+\-]?\d+(?:[.,]\d+)?(?:\s*[\/]\s*\d+)?(?:[a-zA-Z²³]+)?)/g;
    // For wiki we'll wrap specific words manually or keep it simple.
    // The previous implementation was robust enough.
    return text.replace(/([a-zA-Z0-9\+\-\=\.\/\²\³\√\π\≥\≤\<\>\(\)\{\}\,]+(?:[ ]+[a-zA-Z0-9\+\-\=\.\/\²\³\√\π\≥\≤\<\>\(\)\{\}\,]+)*)/g, function (match) {
        // Exclude pure arabic text using a quick heuristic (if it has arabic letters, skip)
        if (/[\u0600-\u06FF]/.test(match)) return match;
        // Trim spaces to avoid wrapping pure whitespace
        if (match.trim().length === 0) return match;
        return `<span class="math-ltr">${match.trim()}</span>`;
    });
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
    renderTerms(e.target.value);
});

catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentCategory = btn.dataset.cat;
        renderTerms(searchInput.value);
    });
});

// Modal Logic
const modal = document.getElementById('termModal');

function openModal(item) {
    document.getElementById('modalTitle').textContent = item.term;
    document.getElementById('modalCategory').innerHTML = `${getCategoryIcon(item.category)} ${getCategoryName(item.category)}`;

    // We optionally format math in the definition
    document.getElementById('modalDef').innerHTML = formatMathText(item.definition);

    const exampleBox = document.getElementById('modalExample');
    if (item.example) {
        exampleBox.style.display = 'block';
        document.getElementById('exampleText').innerHTML = formatMathText(item.example);
    } else {
        exampleBox.style.display = 'none';
    }

    // Add animation class
    modal.style.display = 'flex';
    // tiny timeout to trigger transition
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function closeModal() {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); // match transition duration
}

// Close on outside click or Esc key
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Initial Render
renderTerms();
