// بيانات الفروض والاختبارات — المنهج الجزائري للتعليم المتوسط
const examsData = [

    /* ===================== السنة الأولى متوسط ===================== */
    {
        id: "s1_t1", title: "فرض الفصل الأول — سنة 1 متوسط", level: 1, duration: 45,
        questions: [
            { id: 1, text: "أي من الأعداد التالية هو عدد أوّلي؟", options: ["9", "15", "17", "21"], correct: 2 },
            { id: 2, text: "القاسم المشترك الأكبر للعددين 24 و 36 هو:", options: ["6", "12", "18", "8"], correct: 1 },
            { id: 3, text: "المضاعف المشترك الأصغر للعددين 4 و 6 هو:", options: ["12", "24", "8", "16"], correct: 0 },
            { id: 4, text: "أحسب: 345 ÷ 15 =", options: ["23", "21", "25", "22"], correct: 0 },
            { id: 5, text: "أيّ الأعداد التالية يقبل القسمة على 3؟", options: ["124", "251", "312", "415"], correct: 2 },
            { id: 6, text: "ناتج العملية: 5 × 8 − 10 ÷ 2 =", options: ["35", "15", "30", "25"], correct: 0 },
            { id: 7, text: "الكسر 18/24 مختزلاً إلى أبسط صورة:", options: ["2/3", "3/4", "4/6", "6/8"], correct: 1 },
            { id: 8, text: "أحسب: 3/4 + 1/4 =", options: ["4/8", "1", "4/4", "2"], correct: 1 },
            { id: 9, text: "العدد الصحيح الذي يمثّل خسارة 50 دج هو:", options: ["+50", "−50", "50", "100"], correct: 1 },
            { id: 10, text: "مساحة مستطيل طوله 9 م وعرضه 4 م:", options: ["13 م²", "36 م²", "26 م²", "40 م²"], correct: 1 }
        ]
    },
    {
        id: "s1_t2", title: "فرض الفصل الثاني — سنة 1 متوسط", level: 1, duration: 45,
        questions: [
            { id: 1, text: "محيط مربع ضلعه 7 سم هو:", options: ["14 سم", "21 سم", "28 سم", "49 سم"], correct: 2 },
            { id: 2, text: "مجموع زوايا المثلث يساوي:", options: ["90°", "360°", "180°", "270°"], correct: 2 },
            { id: 3, text: "الزاوية التي قيسها 130° هي زاوية:", options: ["حادة", "قائمة", "منفرجة", "مستقيمة"], correct: 2 },
            { id: 4, text: "محيط دائرة نصف قطرها 5 سم (π ≈ 3.14):", options: ["15.7 سم", "31.4 سم", "78.5 سم", "25 سم"], correct: 1 },
            { id: 5, text: "المثلث الذي أضلاعه 5، 5، 5 هو مثلث:", options: ["قائم", "متساوي الساقين", "متساوي الأضلاع", "مختلف الأضلاع"], correct: 2 },
            { id: 6, text: "التناظر المركزي يحفظ:", options: ["الإشارة فقط", "الأطوال فقط", "جميع الخواص الهندسية", "الزوايا فقط"], correct: 2 },
            { id: 7, text: "أحسب x إذا كان: x + 15 = 40", options: ["55", "25", "35", "20"], correct: 1 },
            { id: 8, text: "النسبة المئوية لـ 15 من 60 هي:", options: ["15%", "20%", "25%", "30%"], correct: 2 },
            { id: 9, text: "55% من 200 تساوي:", options: ["55", "110", "100", "120"], correct: 1 },
            { id: 10, text: "حجم متوازي مستطيلات أبعاده 3، 4، 5:", options: ["12", "20", "60", "47"], correct: 2 }
        ]
    },
    {
        id: "s1_t3", title: "اختبار نهاية السنة — سنة 1 متوسط", level: 1, duration: 60,
        questions: [
            { id: 1, text: "أصغر عدد أوّلي زوجي هو:", options: ["1", "2", "3", "4"], correct: 1 },
            { id: 2, text: "أحسب: 7/8 − 3/8 =", options: ["1/2", "10/8", "4/0", "3/4"], correct: 0 },
            { id: 3, text: "حنان اشترت بضاعة بـ500 دج وباعتها بـ620 دج. الربح هو:", options: ["120 دج", "1120 دج", "500 دج", "80 دج"], correct: 0 },
            { id: 4, text: "أي من التعبيرات التالية هو مربع عدد؟", options: ["48", "50", "36", "30"], correct: 2 },
            { id: 5, text: "الزاوية التكميلية للزاوية التي قيسها 35° هي:", options: ["55°", "145°", "65°", "45°"], correct: 0 },
            { id: 6, text: "مساحة دائرة نصف قطرها 7 سم (π ≈ 3.14):", options: ["43.96 سم²", "153.86 سم²", "21.98 سم²", "78.5 سم²"], correct: 1 },
            { id: 7, text: "على محور الأعداد، المسافة بين +3 و −5 هي:", options: ["2", "8", "15", "-2"], correct: 1 },
            { id: 8, text: "أي الكسور التالية يساوي 0.6؟", options: ["1/6", "3/5", "2/3", "6/5"], correct: 1 },
            { id: 9, text: "تصنيف البيانات في جدول يساعد على:", options: ["تعقيد المعطيات", "قراءة المعطيات وتحليلها", "حذف المعطيات", "لا شيء مما سبق"], correct: 1 },
            { id: 10, text: "إذا كانت نسبة التلاميذ الناجحين 80% من صف مؤلّف من 25 تلميذاً، فعدد الناجحين:", options: ["15", "20", "16", "18"], correct: 1 }
        ]
    },

    /* ===================== السنة الثانية متوسط ===================== */
    {
        id: "s2_t1", title: "فرض الفصل الأول — سنة 2 متوسط", level: 2, duration: 45,
        questions: [
            { id: 1, text: "ما هي نظير العدد −7؟", options: ["7", "1/7", "−1/7", "0"], correct: 0 },
            { id: 2, text: "أحسب: (−8) + (+13) =", options: ["+5", "−5", "−21", "21"], correct: 0 },
            { id: 3, text: "أحسب: (−6) × (−5) =", options: ["−30", "+30", "11", "−11"], correct: 1 },
            { id: 4, text: "أحسب: (−24) ÷ (+6) =", options: ["−4", "4", "−18", "18"], correct: 0 },
            { id: 5, text: "قيمة العبارة: 3 − (−5) =", options: ["−2", "2", "8", "−8"], correct: 2 },
            { id: 6, text: "المسافة بين النقطتين A(+4) و B(−2) على محور هي:", options: ["2", "6", "−6", "8"], correct: 1 },
            { id: 7, text: "خاصية التوزيع تعني: a×(b+c) =", options: ["ab+ac", "a+bc", "(a+b)(a+c)", "ab×ac"], correct: 0 },
            { id: 8, text: "أبسط صورة للكسر −18/24:", options: ["-2/3", "-3/4", "3/4", "9/12"], correct: 1 },
            { id: 9, text: "نظير الشكل الهندسي بالنسبة لمستقيم يحفظ:", options: ["الألوان", "الأوزان", "الأطوال والزوايا", "المواضع"], correct: 2 },
            { id: 10, text: "زاوية الانعكاس تساوي زاوية:", options: ["السقوط", "الانكسار", "الدوران", "الانتشار"], correct: 0 }
        ]
    },
    {
        id: "s2_t2", title: "فرض الفصل الثاني — سنة 2 متوسط", level: 2, duration: 45,
        questions: [
            { id: 1, text: "حل معادلة: 5x = 35 هو:", options: ["x=5", "x=7", "x=30", "x=40"], correct: 1 },
            { id: 2, text: "حل معادلة: 3x − 9 = 0 هو:", options: ["x=0", "x=3", "x=9", "x=−3"], correct: 1 },
            { id: 3, text: "حل معادلة: 2x + 7 = 19 هو:", options: ["x=6", "x=13", "x=5", "x=12"], correct: 0 },
            { id: 4, text: "التناسبية: إذا كان 3/4 = x/16، فـ x يساوي:", options: ["12", "8", "4", "20"], correct: 0 },
            { id: 5, text: "معدّل: مجموع درجات 4 طلاب هو 56. المعدّل:", options: ["14", "12", "15", "13"], correct: 0 },
            { id: 6, text: "محيط مثلث أضلاعه 6، 8، 10 سم:", options: ["48 سم", "24 سم", "80 سم", "18 سم"], correct: 1 },
            { id: 7, text: "حجم مكعب ضلعه 4 سم:", options: ["12 سم³", "16 سم³", "48 سم³", "64 سم³"], correct: 3 },
            { id: 8, text: "ترتيباً تصاعدياً: −3، +1، −5، 0، +2", options: ["0،-3،-5،+1،+2", "-5،-3،0،+1،+2", "-3،-5،0،+1،+2", "0،+1،+2،-3،-5"], correct: 1 },
            { id: 9, text: "التكرار النسبي = ؟", options: ["التكرار × الحصيص", "التكرار ÷ العينة الكلية", "العينة ÷ التكرار", "التكرار + العينة"], correct: 1 },
            { id: 10, text: "قياس الزاوية المستقيمة:", options: ["90°", "45°", "180°", "360°"], correct: 2 }
        ]
    },
    {
        id: "s2_t3", title: "اختبار نهاية السنة — سنة 2 متوسط", level: 2, duration: 60,
        questions: [
            { id: 1, text: "حل المتراجحة: x + 3 > 7:", options: ["x>4", "x>10", "x<4", "x>−4"], correct: 0 },
            { id: 2, text: "ناتج: (−3)² =", options: ["−9", "9", "6", "−6"], correct: 1 },
            { id: 3, text: "أبسط صورة للنسبة 45:60:", options: ["3:4", "9:12", "4:5", "5:6"], correct: 0 },
            { id: 4, text: "قواعد الأولويات: 4 + 2 × 3 − 1 =", options: ["17", "9", "13", "15"], correct: 1 },
            { id: 5, text: "حساب: 3/5 × 10/9 =", options: ["30/45", "6/9", "2/3", "5/6"], correct: 2 },
            { id: 6, text: "مساحة مثلث قاعدته 10 سم وارتفاعه 6 سم:", options: ["60 سم²", "30 سم²", "16 سم²", "120 سم²"], correct: 1 },
            { id: 7, text: "إذا كانت f(x) = 2x + 1، فـ f(3) =", options: ["7", "5", "9", "6"], correct: 0 },
            { id: 8, text: "وكيل أضاف 20% ربحاً على سعر 500 دج. سعر البيع:", options: ["520", "600", "100", "550"], correct: 1 },
            { id: 9, text: "انعكاس نقطة A(2,3) بالنسبة لمحور الفواصل:", options: ["(-2,3)", "(2,-3)", "(-2,-3)", "(3,2)"], correct: 1 },
            { id: 10, text: "الدائرة التي مركزها O ونصف قطرها r: جميع نقاطها تبعد عن O مسافة:", options: ["أكبر من r", "أصغر من r", "تساوي r", "r²"], correct: 2 }
        ]
    },

    /* ===================== السنة الثالثة متوسط ===================== */
    {
        id: "s3_t1", title: "فرض الفصل الأول — سنة 3 متوسط", level: 3, duration: 60,
        questions: [
            { id: 1, text: "الكتابة العلمية للعدد 0.00045:", options: ["4.5×10⁻⁴", "45×10⁻⁵", "4.5×10⁴", "0.45×10⁻³"], correct: 0 },
            { id: 2, text: "ناتج: 3² × 3³ =", options: ["3⁵", "3⁶", "9⁵", "6⁵"], correct: 0 },
            { id: 3, text: "تبسيط: (5³)² =", options: ["5⁵", "5⁶", "5¹", "10³"], correct: 1 },
            { id: 4, text: "الجذر التربيعي لـ 169 هو:", options: ["11", "12", "13", "14"], correct: 2 },
            { id: 5, text: "هل 3 √5 = √45؟", options: ["نعم", "لا", "أحياناً", "غير ممكن التحقق"], correct: 0 },
            { id: 6, text: "فيثاغورس في مثلث قائم: أطوال الساقين 3 و 4. الوتر:", options: ["5", "6", "7", "25"], correct: 0 },
            { id: 7, text: "أحسب: √(36 + 64) =", options: ["10", "√100", "كلاهما صحيح", "14"], correct: 2 },
            { id: 8, text: "تعريف العدد الناطق: عدد يُكتب على شكل:", options: ["a+b", "a/b (b≠0)", "√a", "aⁿ"], correct: 1 },
            { id: 9, text: "جداء عددين نسبيين متعاكسَي الإشارة:", options: ["موجب", "سالب", "معدوم", "غير معرّف"], correct: 1 },
            { id: 10, text: "خاصية الإسناد الرياضي: لكل x∈ℝ، x² ≥:", options: ["1", "x", "0", "−x"], correct: 2 }
        ]
    },
    {
        id: "s3_t2", title: "فرض الفصل الثاني — سنة 3 متوسط", level: 3, duration: 60,
        questions: [
            { id: 1, text: "حل المعادلة: 4x − 3 = 2x + 7:", options: ["x=5", "x=2", "x=10", "x=−5"], correct: 0 },
            { id: 2, text: "نشر: (x + 3)(x − 3) =", options: ["x²−9", "x²+9", "x²−6x+9", "x²+6x+9"], correct: 0 },
            { id: 3, text: "تحليل: x² − 25 =", options: ["(x−5)²", "(x+5)(x−5)", "(x+5)²", "x(x−25)"], correct: 1 },
            { id: 4, text: "نشر: (2x + 1)² =", options: ["4x²+1", "4x²+4x+1", "2x²+1", "4x²+2x+1"], correct: 1 },
            { id: 5, text: "حل جملة المعادلتين: x+y=5 و x−y=1 ⟹", options: ["x=3,y=2", "x=2,y=3", "x=4,y=1", "x=5,y=0"], correct: 0 },
            { id: 6, text: "الدالة الخطية f(x)=3x تمر دائماً من النقطة:", options: ["(0,3)", "(1,3)", "(0,0)", "(3,0)"], correct: 2 },
            { id: 7, text: "معامل التناسب في الدالة f(x)=−2x هو:", options: ["2", "−2", "0", "x"], correct: 1 },
            { id: 8, text: "حجم أسطوانة دوران نصف قطرها 3 وارتفاعها 5 (π≈3.14):", options: ["141.3", "47.1", "94.2", "45"], correct: 0 },
            { id: 9, text: "مساحة جانبية أسطوانة 2πrh إذا r=2, h=7 (π≈3.14):", options: ["43.96", "87.92", "25.12", "131.88"], correct: 1 },
            { id: 10, text: "الانسحاب الذي يُحوّل A(1,2) إلى B(4,5) هو شعاع:", options: ["(3,3)", "(5,7)", "(-3,-3)", "(2,3)"], correct: 0 }
        ]
    },
    {
        id: "s3_t3", title: "اختبار نهاية السنة — سنة 3 متوسط", level: 3, duration: 90,
        questions: [
            { id: 1, text: "لتحليل: 3x² − 12 = 3(x+2)(x−2). هل هذا صحيح؟", options: ["نعم", "لا", "أحياناً", "يتوقف على x"], correct: 0 },
            { id: 2, text: "حل: |x − 3| = 5 ⟹", options: ["x=8", "x=−2", "x=8 أو x=−2", "x=2 أو x=−8"], correct: 2 },
            { id: 3, text: "إذا كان tan(α)=1، فـ α=", options: ["30°", "45°", "60°", "90°"], correct: 1 },
            { id: 4, text: "في مثلث قائم، sin(30°)=", options: ["1/2", "√3/2", "1", "√2/2"], correct: 0 },
            { id: 5, text: "تقطع الدالة f(x)=2x−4 محور الفواصل عند x=", options: ["2", "4", "−4", "−2"], correct: 0 },
            { id: 6, text: "معادلة مستقيم ميله 3 ويمر من الأصل:", options: ["y=x+3", "y=3", "y=3x", "y=3x+1"], correct: 2 },
            { id: 7, text: "إذا كان PGCD(a,b)=6 و PPCM(a,b)=60 وa=12، فـ b=", options: ["30", "10", "24", "5"], correct: 0 },
            { id: 8, text: "البيانات: 3،5،7،5،10. الوسيط هو:", options: ["3", "5", "7", "6"], correct: 1 },
            { id: 9, text: "الاحتمال أن تظهر وجه الصورة عند رمي قطعة نقود هو:", options: ["1", "0", "1/2", "1/4"], correct: 2 },
            { id: 10, text: "تريد شراء قميص ب400 دج بعد تخفيض 25%. السعر الأصلي:", options: ["300 دج", "500 دج", "533 دج", "475 دج"], correct: 2 }
        ]
    },

    /* ===================== السنة الرابعة متوسط (بيام) ===================== */
    {
        id: "s4_t1", title: "فرض الفصل الأول — سنة 4 متوسط", level: 4, duration: 60,
        questions: [
            { id: 1, text: "الأعداد 14 و 15 هما عددان:", options: ["أوليان", "أوليّان فيما بينهما", "مضاعفان", "أعداد تربيعية"], correct: 1 },
            { id: 2, text: "الجذر التربيعي للعدد 225:", options: ["13", "14", "15", "16"], correct: 2 },
            { id: 3, text: "كتابة علمية: 3650000 =", options: ["3.65×10⁶", "36.5×10⁵", "3.65×10⁻⁶", "365×10⁴"], correct: 0 },
            { id: 4, text: "تحليل عاملي: x²−10x+25 =", options: ["(x−5)²", "(x+5)²", "(x−5)(x+5)", "x(x−10)+25"], correct: 0 },
            { id: 5, text: "في مثلث قائم: cos(α) = ضلع مجاور / ؟", options: ["ضلع مقابل", "قاعدة", "وتر", "محيط"], correct: 2 },
            { id: 6, text: "tan(60°) =", options: ["1/2", "√3/2", "1", "√3"], correct: 3 },
            { id: 7, text: "حل: 3x + 5 > 14:", options: ["x>3", "x>−3", "x<3", "x>19/3"], correct: 0 },
            { id: 8, text: "الدالة التآلفية f(x)=2x+3: للمقطع y=؟", options: ["2", "3", "−3/2", "0"], correct: 1 },
            { id: 9, text: "معادلة المستقيم العمودي على محور y:", options: ["x=ثابت", "y=ثابت", "y=x", "y=−x"], correct: 0 },
            { id: 10, text: "منشور أساسه مثلث قائم ساقاه 3و4 وارتفاعه 10. الحجم:", options: ["60", "120", "30", "240"], correct: 0 }
        ]
    },
    {
        id: "s4_t2", title: "تجريبي شهادة التعليم المتوسط — نموذج 1", level: 4, duration: 120,
        questions: [
            { id: 1, text: "PGCD(180, 252) =", options: ["18", "36", "9", "12"], correct: 1 },
            { id: 2, text: "اختزال: (3x²−12) ÷ (x−2) عندما x=3 =", options: ["9", "15", "3", "21"], correct: 1 },
            { id: 3, text: "نشر: (x+4)² =", options: ["x²+8x+16", "x²+16", "x²+4x+16", "2x+8"], correct: 0 },
            { id: 4, text: "حل: 2(x−1)=3x+4 ⟹ x=", options: ["−6", "6", "2", "−2"], correct: 0 },
            { id: 5, text: "مستقيم ميله −2 ومقطعه +5: f(x)=", options: ["5x−2", "−2x+5", "2x+5", "−5x+2"], correct: 1 },
            { id: 6, text: "إذا كان f(x)=3x−1 وf(a)=8، فـ a=", options: ["3", "7/3", "3/7", "9"], correct: 0 },
            { id: 7, text: "توافق دالتين عند x=2: g(x)=x+1 وh(x)=3. هل g(2)=h(2)؟", options: ["نعم", "لا", "أحياناً", "مجهول"], correct: 1 },
            { id: 8, text: "في مثلث قائم الزاوية A=40°، فـ B=", options: ["50°", "40°", "90°", "140°"], correct: 0 },
            { id: 9, text: "مساحة جانبية مخروط نصف قطره 3 مولّده 5 (π≈3.14):", options: ["47.1", "15.7", "94.2", "28.26"], correct: 0 },
            { id: 10, text: "رُمي حجر النرد مرة. احتمال ظهور عدد زوجي:", options: ["1/6", "1/3", "1/2", "2/3"], correct: 2 }
        ]
    },
    {
        id: "s4_t3", title: "تجريبي شهادة التعليم المتوسط — نموذج 2", level: 4, duration: 120,
        questions: [
            { id: 1, text: "ناتج: (√6)² =", options: ["3", "√36", "6", "36"], correct: 2 },
            { id: 2, text: "تبسيط: √50 =", options: ["5√2", "10√5", "25√2", "5√5"], correct: 0 },
            { id: 3, text: "حل جملة: 2x+y=7 و x−y=2 ⟹", options: ["(3,1)", "(1,5)", "(2,3)", "(4,1)"], correct: 0 },
            { id: 4, text: "تحليل: 4x²−20x+25 =", options: ["(2x−5)²", "(2x+5)²", "(4x−5)(x−5)", "(2x−5)(2x+5)"], correct: 0 },
            { id: 5, text: "اشترى محمد سيارة بـ800000 دج بتخفيض 20%. الثمن الأصلي:", options: ["960000", "1000000", "640000", "150000"], correct: 1 },
            { id: 6, text: "قياس sin(60°):", options: ["1/2", "√3/2", "1", "√2/2"], correct: 1 },
            { id: 7, text: "الزاوية التي sin = cos = √2/2 هي:", options: ["30°", "45°", "60°", "90°"], correct: 1 },
            { id: 8, text: "سرعة سيارة قطعت 240كم في ساعتين:", options: ["60 كم/س", "120 كم/س", "480 كم/س", "80 كم/س"], correct: 1 },
            { id: 9, text: "حجم كرة نصف قطرها 3 سم (π≈3.14): V=(4/3)πr³=", options: ["37.68 سم³", "113.04 سم³", "28.26 سم³", "75.36 سم³"], correct: 1 },
            { id: 10, text: "عيّنة: 12،8،15،10،10. المتوسط الحسابي:", options: ["10", "11", "12", "10.5"], correct: 1 }
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
        this.timerEl = document.getElementById('timerBadge');
        this.examQHeader = document.getElementById('examQHeader');

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
        const icons = ['📋', '📖', '✏️', '📐', '🧮', '📊', '🔢', '🏆'];
        const levelNames = { 1: 'السنة الأولى', 2: 'السنة الثانية', 3: 'السنة الثالثة', 4: 'السنة الرابعة' };
        this.grid.innerHTML = '';
        examsData.forEach((exam, i) => {
            const card = document.createElement('div');
            card.className = 'exam-card';
            card.dataset.level = exam.level;
            card.innerHTML = `
                <div class="card-top">
                    <div class="card-icon">${icons[i % icons.length]}</div>
                    <span class="card-level-badge">${levelNames[exam.level] || 'متوسط'}</span>
                </div>
                <div class="card-title">${exam.title}</div>
                <div class="card-desc">${exam.questions.length} سؤال متعدد الاختيارات في ظروف امتحان حقيقية</div>
                <div class="card-meta">
                    <div class="meta-item">⏱️ ${exam.duration} دقيقة</div>
                    <div class="meta-item">❓ ${exam.questions.length} سؤال</div>
                </div>
                <button class="btn-start">▶ بدء الاختبار</button>
            `;
            card.querySelector('.btn-start').addEventListener('click', (e) => { e.stopPropagation(); this.startExam(exam); });
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
        this.examQHeader.style.display = 'flex';

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
                    <label class="option-label" onclick="app.selectOption(this, ${index}, ${optIdx})">
                        <input type="radio" name="q_${index}" value="${optIdx}">
                        <div class="option-dot"></div>
                        <span style="flex-grow:1">${this.formatMath(opt)}</span>
                    </label>
                `;
            });

            qDiv.innerHTML = `
                <span class="q-number">السؤال ${index + 1}</span>
                <div class="q-text">${this.formatMath(q.text)}</div>
                <div class="options-list">${optionsHtml}</div>
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

    selectOption(label, qIndex, optIndex) {
        const allLabels = label.closest('.options-list').querySelectorAll('.option-label');
        allLabels.forEach(l => l.classList.remove('selected'));
        label.classList.add('selected');
        this.userAnswers[qIndex] = optIndex;
    }

    startTimer() {
        clearInterval(this.timerInterval);
        this.updateTimerDisplay();

        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();

            if (this.timeRemaining <= 300) {
                document.getElementById('timerBadge').classList.add('warning');
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

            const userAnsText = userAns !== undefined ? q.options[userAns] : 'لم تجب';
            const correctAnsText = q.options[q.correct];

            reviewHtml += `
            <div class="review-item ${isCorrect ? 'correct' : 'wrong'}">
                <span class="ri">س${idx + 1}: ${q.text}</span>
                <span class="ra">إجابتك: ${userAnsText}</span>
                ${!isCorrect ? `<br><span style="color:#6ee7b7;font-weight:700;">الصحيحة: ${correctAnsText}</span>` : ''}
            </div>`;
        });

        const score20 = Math.round((correctCount / totalQuestions) * 20);
        const scoreEl = document.getElementById('scoreDisplay');
        scoreEl.innerText = `${score20}/20`;
        scoreEl.className = 'result-score ' + (score20 >= 18 ? 'excellent' : score20 >= 14 ? 'good' : score20 >= 10 ? 'average' : 'fail');
        document.getElementById('correctCount').innerText = `${correctCount}/${totalQuestions}`;
        document.getElementById('reviewSection').innerHTML = '<div class="review-title">📋 مراجعة الإجابات</div>' + reviewHtml;

        const timeTakenSec = (this.currentExam.duration * 60) - this.timeRemaining;
        const mm = Math.floor(timeTakenSec / 60);
        const ss = timeTakenSec % 60;
        document.getElementById('timeTaken').innerText = `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;

        const gradeEl = document.getElementById('gradeDisplay');
        const emojiEl = document.getElementById('resultEmoji');
        if (score20 >= 18) { gradeEl.innerText = 'ممتاز 🏆'; emojiEl.innerText = '🏆'; }
        else if (score20 >= 14) { gradeEl.innerText = 'جيد جداً 🌟'; emojiEl.innerText = '🌟'; }
        else if (score20 >= 10) { gradeEl.innerText = 'متوسط 👍'; emojiEl.innerText = '👍'; }
        else { gradeEl.innerText = 'تحتاج للمراجعة 📚'; emojiEl.innerText = '📚'; }

        if (window.Dashboard && window.Dashboard.completeExam) window.Dashboard.completeExam();

        const modal = document.getElementById('resultsModal');
        modal.style.display = 'flex';
        modal.classList.add('show');
    }
}

// Instantiate
const app = new ExamApp();
