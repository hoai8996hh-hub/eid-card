// ==================== INITIALIZATION ====================
let greetingHistory = JSON.parse(localStorage.getItem('eidGreetings') || '[]');
let currentGreeting = '';
let selectedTags = [];
let selectedLang = 'ar';
let greetingCount = parseInt(localStorage.getItem('greetingCount') || '0');

document.addEventListener('DOMContentLoaded', () => {
    createStars();
    createSheepParade();
    setupTags();
    setupLangTags();
    loadTemplates();
    loadGallery();
    updateHistory();
    updateCounters();
    setupScrollNav();
});

// ==================== STARS ====================
function createStars() {
    const container = document.getElementById('starsContainer');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3 + 1;
        star.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            --duration: ${Math.random() * 3 + 2}s;
            animation-delay: ${Math.random() * 3}s;
        `;
        container.appendChild(star);
    }
}

// ==================== SHEEP PARADE ====================
function createSheepParade() {
    const parade = document.getElementById('sheepParade');
    const sheepEmojis = ['🐑', '🐏', '🐐'];
    for (let i = 0; i < 5; i++) {
        const sheep = document.createElement('div');
        sheep.className = 'sheep';
        sheep.textContent = sheepEmojis[i % 3];
        sheep.style.cssText = `--speed: ${15 + Math.random() * 10}s; animation-delay: ${i * 3}s;`;
        parade.appendChild(sheep);
    }
}

// ==================== NAVIGATION ====================
function setupScrollNav() {
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navBar');
        if (window.scrollY > window.innerHeight * 0.5) {
            nav.classList.add('visible');
        } else {
            nav.classList.remove('visible');
        }
    });
}

// ==================== TAGS ====================
function setupTags() {
    document.querySelectorAll('.tag:not(.lang-tag)').forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('active');
            const tagValue = tag.dataset.tag;
            if (selectedTags.includes(tagValue)) {
                selectedTags = selectedTags.filter(t => t !== tagValue);
            } else {
                selectedTags.push(tagValue);
            }
        });
    });
}

function setupLangTags() {
    document.querySelectorAll('.lang-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            document.querySelectorAll('.lang-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            selectedLang = tag.dataset.lang;
        });
    });
}

// ==================== AI GREETING GENERATOR ====================
const greetingDatabase = {
    ar: {
        formal: {
            family: [
                "بمناسبة عيد الأضحى المبارك، أتقدم إليكم بأسمى آيات التهنئة والتبريكات.\nأعاده الله علينا وعليكم بالخير واليمن والبركات.\nتقبل الله منا ومنكم صالح الأعمال.\n\nكل عام وأنتم بألف خير 🌙🐑",
                "أزكى التهاني وأعطر التبريكات بمناسبة حلول عيد الأضحى المبارك.\nأسأل الله العلي القدير أن يعيده عليكم أعواماً عديدة وأنتم في أتم الصحة والعافية.\nكل عام وعائلتنا الكريمة بألف خير ✨🕌",
            ],
            friend: [
                "بمناسبة عيد الأضحى المبارك، يسعدني أن أتقدم إليك بأطيب التهاني والتبريكات.\nأسأل الله أن يتقبل منا ومنك صالح الأعمال.\nوأن يعيده علينا وعليك بالخير والبركات.\n\nكل عام وأنت بخير 🤝🌙",
            ],
            colleague: [
                "تهنئة خالصة بمناسبة عيد الأضحى المبارك.\nأتمنى لك ولعائلتك الكريمة عيداً سعيداً مليئاً بالفرح والسرور.\nتقبل الله منا ومنكم صالح الأعمال.\n\nكل عام وأنتم بخير 💼✨",
            ],
            general: [
                "بمناسبة عيد الأضحى المبارك، أتقدم بأحر التهاني وأجمل الأمنيات.\nجعله الله عيد خير وبركة على الأمة الإسلامية جمعاء.\nتقبل الله طاعاتكم وأعمالكم الصالحة.\n\nكل عام وأنتم بخير 🌍🕌",
            ],
            parents: [
                "إلى أغلى إنسان في الوجود...\nبمناسبة عيد الأضحى المبارك، أسأل الله أن يبارك في عمرك ويديم عليك الصحة والعافية.\nأنتم تاج رؤوسنا وفخر حياتنا.\nكل عام وأنتم بألف ألف خير 🏠💕",
            ],
            spouse: [
                "إلى شريك حياتي ورفيق دربي...\nكل عام وأنت نور حياتي وبهجة أيامي.\nأسأل الله أن يتقبل منا ومنك ويجمعنا دائماً على الخير.\nعيد أضحى مبارك يا أجمل هدية من الله 💕🌙",
            ],
            teacher: [
                "إلى معلمي الفاضل...\nبمناسبة عيد الأضحى المبارك، أتقدم بأسمى آيات الشكر والتقدير.\nجزاك الله خيراً على ما قدمت وعلمت.\nأعاد الله عليك هذا العيد بالخير والسعادة 📚✨",
            ],
            children: [
                "يا أحلى أطفال في الدنيا! 🎈🐑\nكل عام وأنتم فرحة حياتنا!\nعيد أضحى مبارك عليكم يا أغلى ما في الوجود.\nالله يحفظكم ويخليكم ويفرحنا فيكم دايماً 👶💖",
            ],
        },
        warm: {
            family: [
                "يا أغلى الناس على قلبي... 💖\nما أجمل العيد لما نكون مع بعض!\nكل لحظة معكم هي عيد بحد ذاتها.\nربي يخلّيكم لي ويجمعنا دايماً على خير.\n\nعيد أضحى مبارك يا أحلى عيلة بالدنيا! 🐑🌙",
                "كل عيد وأنتم معي يساوي الدنيا كلها 🌍💕\nالله يديم علينا نعمة الاجتماع والمحبة.\nوكل ضحكة منكم تساوي أضحية.\n\nأحبكم حب ما ينوصف! عيد مبارك 🥰🐑",
            ],
            friend: [
                "يا صاحبي يا غالي... 💛\nالعيد بدونك ما يكتمل!\nكل عام وصداقتنا أقوى وأجمل.\nالله يحفظك ويسعدك ويبارك فيك.\n\nعيدك مبارك وكل أيامك أعياد! 🤝🐑",
            ],
            parents: [
                "يا أمي... يا أبي... يا نبض قلبي 💓\nكل كلمات الدنيا ما تكفي أعبّر عن حبي لكم.\nربي يطوّل بعمركم ويخلّيكم تاج على رأسي.\nكل عيد وأنتم سعادتي الأبدية.\n\nعيد أضحى مبارك عليكم يا أغلى البشر 🏠🌙",
            ],
            spouse: [
                "يا نص ديني ونص دنيتي 💕\nكل عيد وأنت جنبي معناه إنّ الله أنعم عليّ بأجمل نعمة.\nأحبك حب يكبر مع كل عيد يمر.\nربي يديم الود والمحبة بيننا.\n\nعيد أضحى مبارك يا حياتي كلها 💑🐑",
            ],
            general: [
                "من القلب للقلب... 💖\nعيد أضحى مبارك عليك وعلى كل من تحب.\nربي يفرح قلبك ويحقق أحلامك.\nوكل عام وأنت بخير وصحة وسعادة.\n\nتقبل الله منا ومنكم 🌙🐑",
            ],
            colleague: [
                "زميلي الغالي... 🌟\nالعيد فرصة أقولك شكراً على كل لحظة حلوة بالعمل.\nربي يسعدك ويبارك فيك وبعيلتك.\n\nعيد أضحى مبارك! 💼🐑",
            ],
            teacher: [
                "معلمي الحبيب... يا من علمني الحياة قبل الحروف 📖\nكل عام وأنت بخير وسعادة.\nلك مني أجمل دعوة في يوم عرفة.\n\nعيد أضحى مبارك 🤲✨",
            ],
            children: [
                "يا قرة عيني وفلذة كبدي! 🧸💖\nأنتم أحلى عيدية في حياتي!\nالله يحفظكم من كل سوء ويكبّركم على طاعته.\nعيدكم مبارك يا أحلى أطفال! 🎈🐑",
            ],
        },
        funny: {
            family: [
                "⚠️ تنبيه عاجل ⚠️\nالخروف شافكم وهرب! 🐑💨\nبس لا تخافون... التهنئة ما هربت!\n\nكل عام وأنتم بخير يا أحلى عيلة!\nالعيد بدونكم مثل كبسة بدون لحم 😂\n\nعيد أضحى مبارك! 🎉",
                "تم تحويل مبلغ ١٠٠٠٠٠ دعوة حلوة إلى حسابكم! 💰\nالمرسل: قلب يحبكم\nالسبب: عيد الأضحى المبارك\n\nلا يمكن إرجاع المبلغ أبداً! 😂🐑\n\nكل عام وأنتم بخير!",
            ],
            friend: [
                "يا زين... المفروض أجيبلك خروف بس...\nالميزانية ما تسمح 😂💸\nفقررت أجيبلك تهنئة VIP بدل الخروف!\n\nكل عام وأنت بخير يا أغلى من خروف العيد! 🐑😂\n\nعيد مبارك!",
            ],
            general: [
                "🔔 إشعار من العيد:\nلقد تم إضافتك لقائمة الأشخاص الذين يستحقون أحلى عيد!\n\nالتفاصيل:\n📅 المناسبة: عيد الأضحى\n🎁 الهدية: دعوات من القلب\n🐑 الخروف: سيتم التوصيل لاحقاً 😂\n\nكل عام وأنت بخير!",
            ],
            spouse: [
                "أحبك أكثر من الخروف يحب العلف 🐑😂\nوأكثر من الناس تحب العيدية 💰\n\nكل عام وأنت أجمل عيدية في حياتي!\nعيد أضحى مبارك يا حبيبي/حبيبتي 💕😄",
            ],
            parents: [
                "ماما/بابا... أبيكم تعرفون إني أحبكم أكثر من الحلويات! 🍬\nوهذا يعني كثييييير! 😂\n\nكل عام وأنتم صحة وعافية يا أحلى أهل!\nعيد مبارك! 🐑🎉",
            ],
            colleague: [
                "زميلي العزيز...\nالعيد جاء يعني إجازة! 🎉🥳\nبس بعد الإجازة لا تنسى الحلويات! 😂🍪\n\nكل عام وأنت بخير!\nعيد أضحى مبارك 💼🐑",
            ],
            teacher: [
                "أستاذ/ة...\nأعرف إنك تبي تقول (لا تنسون الواجب) حتى بالعيد 😂📚\nبس خلنا نفرح شوي!\n\nكل عام وأنت بخير!\nعيد أضحى مبارك 🐑✏️",
            ],
            children: [
                "يا حلوين! 🎈\nالخروف يقول لكم: ماااء ماااء (يعني كل عام وأنتم بخير بلغة الخراف 😂🐑)\n\nعيدكم مبارك يا أطفال!\nوعساكم من عوّاده! 🎉🍬",
            ],
        },
        poetic: {
            family: [
                "كالنجوم في سماء العيد تزهرون 🌟\nوكالقمر في ليالي الأنس تسهرون\nأنتم الفرح الذي ما ينتهي\nوأنتم الحب الذي به نفتخرون\n\nكل عام وأنتم نور عيوني\nعيد أضحى مبارك يا أهلي الغاليين 🌙🐑",
            ],
            friend: [
                "يا صاحباً كالغيث في قلب السنين 💫\nيا رفقة كالنور في عتم الليالي\nعيدك مبارك يا أجمل القلوب\nوكل عام وأنت في أحلى حال\n\nتقبل الله منا ومنك الطاعات 🌙📜",
            ],
            general: [
                "هلّ العيد والفرح يملأ المكان 🌅\nوالتكبيرات تصدح في كل مكان\nالله أكبر... الله أكبر...\n\nيا رب تقبل من عبادك الدعوات\nواجعل عيدنا فرحة ما لها نهاية\n\nكل عام والأمة بخير 🕌🐑",
            ],
            spouse: [
                "أنتِ/أنتَ القصيدة التي لا تنتهي 📝💕\nأنتِ/أنتَ العيد في كل أيامي\nمعك الفرح له طعم ثاني\nومعك العمر يمشي بسلام\n\nكل عام وأنت حبي الأبدي\nعيد أضحى مبارك يا نبض فؤادي 🌙🐑",
            ],
            parents: [
                "يا من بدعائهم تُفتح أبواب السماء 🤲\nيا تاج العمر ونور الحياة\nكل حرف شكر قليل في حقكم\nفأنتم أجمل ما في الوجود\n\nعيد أضحى مبارك يا أعز الناس 🌙💖",
            ],
            colleague: [
                "زميلٌ كالنسيم في يوم صيفي 🌿\nيُخفف عنّا ثقل الأيام\nكل عام وأنت بخير وسلام\nعيد أضحى عليك مبارك وجميل 💼✨",
            ],
            teacher: [
                "يا من زرعت في العقول نوراً 📖✨\nوسقيت بالعلم أرواحنا\nكل عام وأنت شمعة تضيء دروبنا\nعيد أضحى مبارك يا معلمي الفاضل 🌙",
            ],
            children: [
                "يا زهور الحياة ويا ربيع العمر 🌸\nأنتم الفرح الذي لا يشيخ\nكل عيد وضحكاتكم تملأ الدار\nعيدكم مبارك يا أحلى الأطفال 🎈🐑",
            ],
        },
        religious: {
            family: [
                "بسم الله الرحمن الرحيم 🤲\n\nأسأل الله العظيم رب العرش العظيم\nأن يتقبل منا ومنكم صالح الأعمال\nوأن يجعلنا ممن صام وقام يوم عرفة\nوأن يبلغنا وإياكم الحج والعمرة\n\nاللهم اجعل عيدنا فرحة ومغفرة\nكل عام وأنتم بخير 🕌🐑",
            ],
            friend: [
                "أسأل الله الذي جمعنا على محبته\nأن يجمعنا في جنته 🤲\nوأن يتقبل منا ومنك\nويجعلنا من عتقاء يوم عرفة\n\nعيد أضحى مبارك\nتقبل الله طاعتك 🕌",
            ],
            general: [
                "الله أكبر الله أكبر الله أكبر\nلا إله إلا الله\nالله أكبر الله أكبر ولله الحمد 📿\n\nأسأل الله أن يتقبل من الحجاج حجهم\nومن الصائمين صيامهم\nومن القائمين قيامهم\n\nوكل عام وأنتم بخير\nعيد أضحى مبارك 🕋🐑",
            ],
            parents: [
                "اللهم بارك في والديّ 🤲\nوارزقهما الصحة والعافية\nوأطل في عمرهما على طاعتك\nواجعل هذا العيد فرحة لقلوبهم\n\nعيد أضحى مبارك يا أعز الناس\nتقبل الله منا ومنكم 🕌💖",
            ],
            spouse: [
                "الحمد لله الذي رزقني بك 🤲💕\nأسأل الله أن يبارك في حياتنا\nوأن يجعلنا من أهل الجنة\nوأن يجمعنا على طاعته دائماً\n\nعيد أضحى مبارك يا شريك حياتي 🕌",
            ],
            colleague: [
                "تقبل الله منا ومنكم صالح الأعمال 🤲\nوأعاد الله علينا هذا العيد بالخير والبركات\nاللهم اجعلنا من عتقاء هذا اليوم\n\nعيد أضحى مبارك 💼🕌",
            ],
            teacher: [
                "جزاك الله خيراً يا معلمي 🤲📚\nوجعل علمك في ميزان حسناتك\nأسأل الله أن يبارك فيك وفي أهلك\nوأن يتقبل منا ومنك\n\nعيد أضحى مبارك 🕌",
            ],
            children: [
                "يا أطفالنا الحلوين 🧒💖\nالله يحفظكم ويحمكم\nويكبّركم على طاعة الله\nويجعلكم من الصالحين\n\nعيد أضحى مبارك!\nلا تنسون التكبيرات: الله أكبر! 📿🐑",
            ],
        },
        short: {
            family: [
                "عيد أضحى مبارك يا أهلي! 🐑💖\nكل عام وأنتم بخير\nأحبكم! ❤️",
            ],
            friend: [
                "عيدك مبارك يا غالي! 🐑🤝\nتقبل الله منا ومنك! ✨",
            ],
            general: [
                "عيد أضحى مبارك! 🐑🌙\nتقبل الله منا ومنكم!\nكل عام وأنتم بخير ✨",
            ],
            parents: [
                "كل عام وأنتم سندي ونوري 💖🏠\nعيد أضحى مبارك يا أغلى الناس! 🐑",
            ],
            spouse: [
                "كل عام وأنت حبيبي/حبيبتي 💕\nعيد مبارك! 🐑✨",
            ],
            colleague: [
                "عيد مبارك يا زميلي! 💼🐑\nكل عام وأنت بخير!",
            ],
            teacher: [
                "عيد مبارك يا أستاذ/ة! 📚🐑\nجزاك الله خيراً!",
            ],
            children: [
                "عيد مبارك يا حلوين! 🎈🐑\nكل عام وأنتم فرحتنا! 💖",
            ],
        },
        modern: {
            family: [
                "Eid Vibes ON! 🔛🐑\nأحلى عيلة × أحلى عيد = سعادة ما لها حدود! 💯\n\nكل عام وأنتم الـ Best بلا منافس!\nعيد أضحى مبارك فاميلي! 👨‍👩‍👧‍👦❤️‍🔥",
            ],
            friend: [
                "Bestie Alert! 🚨\nعيد الأضحى وصل!\n\nأنت الفريند اللي العيد ما يكمل بدونه! 💯\nخلينا نحتفل! 🎉🐑\n\nعيد مبارك يا Legend! 👑",
            ],
            general: [
                "✅ New Achievement Unlocked:\n🐑 عيد الأضحى المبارك!\n\nLevel Up بالطاعات!\nXP: دعوات + تكبيرات + فرحة\n\nكل عام وأنتم بخير! 🎮🌙",
            ],
            spouse: [
                "My Person! 💕\nأنت الـ Plot Twist الحلو بحياتي!\n\nكل عيد وأنت معي يساوي ألف عيد! 💯\nعيد أضحى مبارك يا Love of my life! 🐑❤️‍🔥",
            ],
            parents: [
                "الأهل = WiFi الحياة 📶\nبدونهم الحياة Disconnected! 😂\n\nكل عام وأنتم الـ Signal القوي بحياتي!\nعيد أضحى مبارك! 💖🐑",
            ],
            colleague: [
                "Work Fam! 💼\nعيد مبارك يا Team!\nخلونا نرجع من الإجازة بطاقة إيجابية! 💯\n\nعيد أضحى سعيد! 🐑🎉",
            ],
            teacher: [
                "المعلم/ة = الـ Google الأصلي! 📚🔍\nكل عام وأنت المصدر الموثوق!\n\nعيد أضحى مبارك! 🐑✨\nشكراً على كل شي! 💯",
            ],
            children: [
                "يا أطفال! Level Up! 🎮\nالعيد وصل = Fun Mode ON! 🔛\n\nوقت الحلويات والألعاب! 🍬🎈\nعيد أضحى مبارك يا Champions! 🏆🐑",
            ],
        },
    },
    en: {
        formal: {
            general: [
                "On the blessed occasion of Eid Al-Adha,\nI extend my warmest greetings and heartfelt wishes.\nMay Allah accept our good deeds and prayers.\nMay this Eid bring peace, happiness, and prosperity.\n\nEid Mubarak! 叙🐑",
            ],
            family: [
                "Dear beloved family,\nWishing you a blessed and joyous Eid Al-Adha!\nMay Allah shower His blessings upon our family.\nMay we always be united in love and faith.\n\nEid Mubarak! 👨‍👩‍👧‍👦🌙",
            ],
            friend: [
                "Dear friend,\nMay this Eid Al-Adha bring you immense joy and blessings.\nMay Allah accept your prayers and good deeds.\nWishing you and your family a wonderful celebration!\n\nEid Mubarak! 🤝🐑",
            ],
        },
        warm: {
            general: [
                "Sending you the warmest hugs this Eid! 💖\nMay your heart be filled with joy and gratitude.\nMay every moment of this blessed day bring you happiness.\n\nEid Al-Adha Mubarak! 🐑🌙",
            ],
        },
        funny: {
            general: [
                "Breaking News! 📰\nEid Al-Adha has arrived and happiness levels are off the charts! 📈\n\nSide effects may include:\n✅ Excessive smiling\n✅ Overeating\n✅ Too much family time\n\nEid Mubarak! 😂🐑",
            ],
        },
    },
    fr: {
        formal: {
            general: [
                "À l'occasion bénie de l'Aïd Al-Adha,\nje vous adresse mes vœux les plus chaleureux.\nQu'Allah accepte nos bonnes actions et nos prières.\nQue cette fête apporte paix et bonheur.\n\nAïd Moubarak! 🕌🐑",
            ],
        },
        warm: {
            general: [
                "En ce jour béni de l'Aïd Al-Adha,\nje vous envoie tout mon amour et mes meilleurs vœux! 💖\nQue votre cœur soit rempli de joie et de gratitude.\n\nAïd Moubarak! 🐑🌙",
            ],
        },
    },
    ur: {
        formal: {
            general: [
                "عید الاضحیٰ کے مبارک موقع پر\nدلی مبارکباد اور نیک خواہشات!\nاللہ تعالیٰ ہماری اور آپ کی قربانیاں قبول فرمائے۔\nعید مبارک! 🕌🐑",
            ],
        },
        warm: {
            general: [
                "عید الاضحیٰ مبارک! 💖\nدعا ہے کہ اللہ آپ کی زندگی کو خوشیوں سے بھر دے۔\nآپ کے دل میں ہمیشہ سکون اور محبت رہے۔\n\nعید مبارک! 🐑🌙",
            ],
        },
    },
    tr: {
        formal: {
            general: [
                "Kurban Bayramınız mübarek olsun! 🕌\nAllah'ın rahmeti ve bereketi üzerinize olsun.\nHayırlı ve sağlıklı nice bayramlara!\n\nBayramınız kutlu olsun! 🐑🌙",
            ],
        },
        warm: {
            general: [
                "En içten duygularımla\nKurban Bayramınızı kutlarım! 💖\nSevdiklerinizle birlikte\nmutlu bir bayram geçirmenizi dilerim.\n\nBayramınız mübareك olsun! 🐑✨",
            ],
        },
    },
    ms: {
        formal: {
            general: [
                "Selamat Hari Raya Aidiladha! 🕌\nSemoga Allah menerima segala amalan baik kita.\nSemoga hari yang mulia ini membawa\nkebahagiaan dan keberkatan.\n\nMaaf Zahir dan Batin! 🐑🌙",
            ],
        },
        warm: {
            general: [
                "Dengan penuh kasih sayang,\nSaya mengucapkan Selamat Hari Raya Aidiladha! 💖\nSemoga kita sentiasa dalam rahmat Allah.\n\nSalam Aidiladha! 🐑✨",
            ],
        },
    },
};

function getGreeting(lang, style, relationship) {
    const langData = greetingDatabase[lang];
    if (!langData) return getGreeting('ar', style, relationship);

    const styleData = langData[style];
    if (!styleData) {
        const availableStyles = Object.keys(langData);
        const fallbackStyle = availableStyles[0];
        return getGreeting(lang, fallbackStyle, relationship);
    }

    let relData = styleData[relationship];
    if (!relData) {
        relData = styleData['general'] || styleData[Object.keys(styleData)[0]];
    }

    if (!relData || relData.length === 0) {
        return getGreeting('ar', 'formal', 'general');
    }

    return relData[Math.floor(Math.random() * relData.length)];
}

function personalizeGreeting(greeting, name, tags, customNote) {
    let personalized = greeting;

    if (name) {
        const nameInsertions = [
            `\n\n🎁 إلى الغالي/ة: ${name}`,
            `\n\nمع أطيب التمنيات لـ ${name}`,
        ];

        if (selectedLang === 'en') {
            personalized += `\n\n🎁 To dear: ${name}`;
        } else if (selectedLang === 'fr') {
            personalized += `\n\n🎁 À cher/chère: ${name}`;
        } else {
            personalized += nameInsertions[Math.floor(Math.random() * nameInsertions.length)];
        }
    }

    if (tags.length > 0 && selectedLang === 'ar') {
        const tagMessages = {
            'أضحية': '\n🐑 تقبل الله أضحيتك',
            'حج': '\n🕋 حج مبرور وذنب مغفور',
            'عرفة': '\n⛰️ اللهم اجعلنا من عتقاء يوم عرفة',
            'تكبيرات': '\n📿 الله أكبر الله أكبر ولله الحمد',
            'صلة رحم': '\n👨‍👩‍👧‍👦 وصل الله رحمنا جميعاً',
            'فرحة': '\n🎉 اللهم أدم علينا الفرحة',
            'دعاء': '\n🤲 لك مني أصدق الدعوات',
            'ذكريات': '\n📸 ذكرياتنا أجمل ما نملك',
        };

        tags.forEach(tag => {
            if (tagMessages[tag]) {
                personalized += tagMessages[tag];
            }
        });
    }

    if (customNote) {
        personalized += `\n\n💌 ${customNote}`;
    }

    return personalized;
}

async function generateGreeting() {
    const btn = document.getElementById('generateBtn');
    const name = document.getElementById('recipientName').value.trim();
    const relationship = document.getElementById('relationship').value || 'general';
    const style = document.getElementById('style').value || 'formal';
    const customNote = document.getElementById('customNote').value.trim();

    btn.classList.add('loading');
    btn.disabled = true;

    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

    let greeting = getGreeting(selectedLang, style, relationship);
    greeting = personalizeGreeting(greeting, name, selectedTags, customNote);

    currentGreeting = greeting;

    const resultContainer = document.getElementById('resultContainer');
    resultContainer.classList.add('show');

    await typeWriter(greeting, 'greetingText');

    document.getElementById('cardMessage').textContent = greeting;
    document.getElementById('cardFrom').textContent = name ? `إلى: ${name}` : '';

    saveToHistory(greeting, name, style);

    greetingCount++;
    localStorage.setItem('greetingCount', greetingCount);
    updateCounters();

    launchConfetti();

    btn.classList.remove('loading');
    btn.disabled = false;

    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function typeWriter(text, elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = '<span class="typing-cursor"></span>';
    let i = 0;

    return new Promise(resolve => {
        function type() {
            if (i < text.length) {
                const cursor = element.querySelector('.typing-cursor');
                const textNode = document.createTextNode(text.charAt(i));
                element.insertBefore(textNode, cursor);
                i++;
                setTimeout(type, 20);
            } else {
                const cursor = element.querySelector('.typing-cursor');
                if (cursor) cursor.remove();
                resolve();
            }
        }
        type();
    });
}

function regenerateGreeting() {
    generateGreeting();
}

// ==================== HISTORY ====================
function saveToHistory(greeting, name, style) {
    const entry = {
        text: greeting,
        name: name,
        style: style,
        time: new Date().toLocaleString('ar-EG'),
        timestamp: Date.now(),
    };
    greetingHistory.unshift(entry);
    if (greetingHistory.length > 20) greetingHistory.pop();
    localStorage.setItem('eidGreetings', JSON.stringify(greetingHistory));
    updateHistory();
}

function updateHistory() {
    const section = document.getElementById('historySection');
    const list = document.getElementById('historyList');

    if (greetingHistory.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    list.innerHTML = greetingHistory.slice(0, 5).map((item, index) => `
        <div class="history-item" onclick="loadHistory(${index})">
            <span class="history-text">${item.text.substring(0, 60)}...</span>
            <span class="history-time">${item.time}</span>
        </div>
    `).join('');
}

function loadHistory(index) {
    const item = greetingHistory[index];
    currentGreeting = item.text;
    document.getElementById('greetingText').textContent = item.text;
    document.getElementById('cardMessage').textContent = item.text;
    document.getElementById('resultContainer').classList.add('show');
    document.getElementById('resultContainer').scrollIntoView({ behavior: 'smooth' });
}

// ==================== COUNTERS ====================
function updateCounters() {
    animateCounter('counterGreetings', greetingCount);
    animateCounter('counterShares', Math.floor(greetingCount * 0.7));
}

function animateCounter(id, target) {
    const el = document.getElementById(id);
    let current = 0;
    const step = Math.max(1, Math.floor(target / 30));
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = current.toLocaleString();
    }, 50);
}

// ==================== CARD THEME ====================
function changeCardTheme(el, gradient) {
    document.querySelectorAll('.theme-option').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('previewCard').style.background = gradient;
}

// ==================== COPY & SHARE ====================
function copyGreeting() {
    if (!currentGreeting) return;
    navigator.clipboard.writeText(currentGreeting).then(() => {
        showToast('✅', 'تم نسخ التهنئة بنجاح!');
    }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = currentGreeting;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('✅', 'تم نسخ التهنئة بنجاح!');
    });
    closeShareModal();
}

function shareToWhatsApp() {
    const text = currentGreeting || 'عيد أضحى مبارك! 🐑🌙';
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    closeShareModal();
}

function shareToTwitter() {
    const text = currentGreeting || 'عيد أضحى مبارك! 🐑🌙';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text.substring(0, 280))}`, '_blank');
    closeShareModal();
}

function shareToFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(currentGreeting || 'عيد أضحى مبارك!')}`, '_blank');
    closeShareModal();
}

function shareToTelegram() {
    const text = currentGreeting || 'عيد أضحى مبارك! 🐑🌙';
    window.open(`https://t.me/share/url?text=${encodeURIComponent(text)}`, '_blank');
    closeShareModal();
}

function shareToEmail() {
    const subject = 'تهنئة عيد الأضحى المبارك 🐑';
    const body = currentGreeting || 'عيد أضحى مبارك!';
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    closeShareModal();
}

function openShareModal() {
    document.getElementById('shareModal').classList.add('show');
}

function closeShareModal() {
    document.getElementById('shareModal').classList.remove('show');
}

// ==================== DOWNLOAD CARD ====================
function downloadCard() {
    const card = document.getElementById('previewCard');
    showToast('📥', 'جاري تحضير البطاقة...');
    const text = currentGreeting || 'عيد أضحى مبارك!';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eid-greeting.txt';
    a.click();
    URL.revokeObjectURL(url);
    showToast('✅', 'تم تحميل التهنئة!');
}

// ==================== TOAST ====================
function showToast(icon, text) {
    const toast = document.getElementById('toast');
    document.getElementById('toastIcon').textContent = icon;
    document.getElementById('toastText').textContent = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==================== CONFETTI ====================
function launchConfetti() {
    const colors = ['#D4AF37', '#F5E6A3', '#0D6B3D', '#14A05E', '#FFFFFF', '#ff6b6b'];
    const emojis = ['🐑', '🌙', '✨', '🎉', '🕌', '⭐'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + 'vw';
            piece.style.top = '-20px';
            piece.style.fontSize = Math.random() * 20 + 10 + 'px';
            
            if (Math.random() > 0.5) {
                piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            } else {
                piece.style.width = '10px';
                piece.style.height = '10px';
                piece.style.background = colors[Math.floor(Math.random() * colors.length)];
                piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            }

            document.body.appendChild(piece);

            const fallDuration = Math.random() * 3 + 2;
            piece.animate([
                { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
                { transform: `translateY(100vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: fallDuration * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => piece.remove();
        }, i * 50);
    }
}

// ==================== TEMPLATES ====================
function loadTemplates() {
    const templates = [
        { name: 'الكلاسيكي الأخضر', desc: 'تصميم إسلامي تقليدي أنيق', style: 'style-1', emoji: '🕌', greeting: 'formal', relation: 'general' },
        { name: 'الليلة المباركة', desc: 'تصميم ليلي مع نجوم', style: 'style-2', emoji: '🌙', greeting: 'religious', relation: 'general' },
        { name: 'الأصالة العربية', desc: 'تصميم بألوان الصحراء', style: 'style-3', emoji: '🐪', greeting: 'poetic', relation: 'general' },
        { name: 'الدفء العائلي', desc: 'مثالي للعائلة والأحباب', style: 'style-4', emoji: '👨‍👩‍👧‍👦', greeting: 'warm', relation: 'family' },
        { name: 'النسيم الأخضر', desc: 'تصميم طبيعي منعش', style: 'style-5', emoji: '🌿', greeting: 'warm', relation: 'friend' },
        { name: 'العصري المميز', desc: 'تصميم شبابي حديث', style: 'style-6', emoji: '🎯', greeting: 'modern', relation: 'general' },
    ];

    const grid = document.getElementById('templatesGrid');
    grid.innerHTML = templates.map(t => `
        <div class="template-card">
            <div class="template-preview ${t.style}">
                <span>${t.emoji}</span>
            </div>
            <div class="template-info">
                <div class="template-name">${t.name}</div>
                <div class="template-desc">${t.desc}</div>
                <button class="template-use-btn" onclick="useTemplate('${t.greeting}', '${t.relation}')">استخدم هذا القالب ✨</button>
            </div>
        </div>
    `).join('');
}

function useTemplate(style, relation) {
    document.getElementById('style').value = style;
    document.getElementById('relationship').value = relation;
    document.getElementById('ai-section').scrollIntoView({ behavior: 'smooth' });
    showToast('🎨', 'تم تطبيق القالب! اضغط إنشاء');
}

// ==================== GALLERY ====================
function loadGallery() {
    const galleryItems = [
        { bg: 'linear-gradient(135deg, #0D6B3D, #14A05E)', emoji: '🐑🕌', text: 'عيد أضحى مبارك', overlay: 'تصميم كلاسيكي' },
        { bg: 'linear-gradient(135deg, #1a1a2e, #D4AF37)', emoji: '🌙✨', text: 'تقبل الله منا ومنكم', overlay: 'تصميم ليلي' },
        { bg: 'linear-gradient(135deg, #8B4513, #F5E6A3)', emoji: '🕋🤲', text: 'الله أكبر الله أكبر', overlay: 'تكبيرات العيد' },
        { bg: 'linear-gradient(135deg, #2D6A4F, #95D5B2)', emoji: '🎉👨‍👩‍👧‍👦', text: 'فرحة العيد مع العائلة', overlay: 'تصميم عائلي' },
        { bg: 'linear-gradient(135deg, #3d0c4f, #D4AF37)', emoji: '📿🐑', text: 'كل عام وأنتم بخير', overlay: 'تصميم أنيق' },
        { bg: 'linear-gradient(135deg, #1B4332, #F5E6A3)', emoji: '⛰️🌅', text: 'يوم عرفة المبارك', overlay: 'تصميم يوم عرفة' },
    ];

    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = galleryItems.map(item => `
        <div class="gallery-item" onclick="useGalleryItem('${item.text}')">
            <div class="gallery-bg" style="background: ${item.bg}">
                <div class="emoji">${item.emoji}</div>
                <div class="text">${item.text}</div>
            </div>
            <div class="gallery-overlay">
                <div class="overlay-text">${item.overlay} - اضغط للاستخدام</div>
            </div>
        </div>
    `).join('');
}

function useGalleryItem(text) {
    document.getElementById('customNote').value = text;
    document.getElementById('ai-section').scrollIntoView({ behavior: 'smooth' });
    showToast('🖼️', 'تم إضافة النص! اضغط إنشاء');
}

// ==================== MODAL CLOSE ON OUTSIDE CLICK ====================
document.getElementById('shareModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeShareModal();
});

// ==================== KEYBOARD SHORTCUT ====================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeShareModal();
    if (e.key === 'Enter' && e.ctrlKey) generateGreeting();
});
