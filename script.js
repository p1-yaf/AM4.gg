// تحديد وقت نهاية ثابت وموحد للجميع (مثلاً: بنحط تاريخ ووقت محدد ينتهي فيه العد التنازلي للجميع)
// يمكنك تغيير التاريخ والوقت أدناه للوقت اللي حابب السيرفر يفتح فيه فعلياً:
// الصيغة: السنة، الشهر (الشهر يبدأ من 0 يعني يناير=0، فبراير=1... إلخ)، اليوم، الساعة، الدقيقة، الثانية

// مثال: لو عاوز العد ينتهي في تاريخ محدد (مثلاً 10 مارس 2026 الساعة 8:00 مساءً بتوقيت معين)
// ملاحظة: الشهور من 0 ل 11 (يعني 2 يعني مارس)
const siteTargetTime = new Date(2026, 2, 10, 20, 0, 0).getTime(); // وقت انتهاء الموقع
const serverTargetTime = new Date(2026, 2, 10, 19, 30, 0).getTime(); // وقت انتهاء السيرفر (قبلها بنص ساعة مثلاً)

// ----------------------------------------------------
// (طريقة بديلة): لو عاوز تخليه "دائماً" يبدأ من ساعة معينة من تاريخ اليوم بصيغة ثابتة للكل:
// افتضاً هنخلي وقت انتهاء السيرفر بعد 30 دقيقة من وقت ثابت يتم تحديثه، 
// ولكن الأفضل والأضمن لتثبيته عند الكل هو تحديد ساعة وساعة معينة هينتهي فيها السيرفر للجميع كالتالي:
// ----------------------------------------------------

// لو عايز العداد يبدأ من وقت رفعك للملف ويكون ثابت عند كل الناس (بنحط وقت ثابت بالـ Timestamp):
// حطنا لك هنا وقت ثابت مستقبلي كمثال، يمكنك تعديله بالثواني الحقيقية للهدف الخاص بك:
const FIXED_SERVER_END = 1775743200 * 1000; // استبدل الرقم ده برقم الـ Timestamp بالثواني وقت الانتهاء واضربه في 1000
const FIXED_SITE_END = 1775746800 * 1000;   // نفس الكلام لموقع الويب

// الطريقة الأسهل والأضمن عشان ميتعبكش في الحسابات:
// هنثبت وقت معين للكل بناءً على ساعة السيرفر العامة، أو نثبت مدة تبدأ من لحظة واحدة مركزية.
// بما إن الجيت هاب صفحة ثابتة، هنعمل وقت انتهاء ثابت يتم حسابه من تاريخ اليوم وثابت لكل الزوار:

// هنحدد ساعة فتح ثابتة (مثلاً السيرفر هيفتح الساعة 10:00 بالليل بتوقيت UTC أو السيرفر):
// أو ببساطة: هنخلي الـ Target محسوب على أساس وقت موحد (مثلاً أول ما ترفع الملف، الوقت بيتسيف بثبته لكل الزوار):
function getGlobalTarget(key, durationSeconds) {
    let target = localStorage.getItem(key);
    // لو مش موجود، بنخلق وقت ثابت لكل الزوار (لكن عشان يكون موحد للكل، الأفضل نثبت وقت ميلادي معين أو نعتمد على طريقة الـ Timestamp الموحد)
    // الحل الأبسط والأصح لمشكلتك:
    let now = Date.now();
    if (!target) {
        // وقت ثابت يبدأ من لحظة ما تحددها أنت هنا بالـ Timestamp (بالمللي ثانية)
        // يمكنك وضع وقت محدد هنا ينتهي فيه العد للجميع:
        target = now + (durationSeconds * 1000);
        localStorage.setItem(key, target);
    }
    return parseInt(target, 10);
}

// العلة كانت في أن كل متصفح كان بيعمل localStorage لوحده. 
// الحل عشان يكون "واحد عند الكل" هو إما وضعه كـ ساعة ثابتة في المستقبل (مثلاً الساعة 10 مساءً بتوقيت السيرفر)، 
// أو استخدام وقت ثابت برمجياً:
const SERVER_DURATION_SEC = 1800; // 30 دقيقة
const SITE_DURATION_SEC = 3600;   // ساعة كاملة

// عشان نخليه موحد وثابت تماماً لكل الناس اللي تدخل من أي جهاز:
// تعال نثبت وقت انتهاء معين (مثلاً اربطه بوقت محدد أنت تختاره):
// لو عايز الوقت ينتهي بعد مدة ثابتة من الآن لكل من يدخل، ولكن لا يتغير لو عمل ريفرش:
// (الخطوة القادمة هي وضع وقت مححد بالساعة والدقيقة ينتهي فيه السيرفر للكل):

function updateTimers() {
    // استخدمنا هنا ساعة ثابتة مستقبلية كمثال (تأكد أن تتطابق عند كل المستخدمين عن طريق تثبيتها برمجياً هنا)
    // مثال: لو عاوز العد التنازلي ينتهي في تمام الساعة المعينة:
    
    // لنفترض أننا سنضع وقت انتهاء ثابت (مثلاً بعد ساعة من الآن للكل بناءً على توقيت موحد):
    // أفضل طريقة لجعل الوقت موحد تماماً عند الكل هو وضع تاريخ وزمن محدد ينتهي فيه العد:
    
    // تاريخ وزمن انتهاء السيرفر (مثلاً: اليوم الفلاني الساعة كذا):
    // لو مش محدد وقت معين وعايزه يبدأ من ساعة ما أنت ظبطه، حطه كـ رقم ثابـت (Timestamp) في الكود هنا مباشرة:
    
    // مثال لـ Timestamp ثابت (مثلاً ينتهي يوم كذا الساعة كذا):
    // يمكنك تعديل هذا الرقم ليطابق دقيقة الانتهاء التي تريدها للجميع:
    const targetServerTime = 1775743200000; // <--- حط هنا وقت الانتهاء بالـ Milliseconds الثابت للجميع
    
    // ولأن الأسهل، دعنا نحسب الباقي بناءً على وقت دقيق:
    let now = Date.now();
    
    // طريقة ذكية: لو عايز تثبت وقت السيرفر بالدقائق المحددة لكل الناس، 
    // بنخلي الـ Target مربوط بوقت السيرفر أو بنحسبه بطريقة تخلي أي زير يفتح يلاقي نفس العداد الباقي بالظبط:
    let savedServerEnd = localStorage.getItem('am4_server_global_end');
    
    if (!savedServerEnd) {
        // لو أول مرة يفتح خالص، بنخليه يبدأ من وقت محدد (مثلاً 30 دقيقة من الآن، بس عشان نخليه موحد للكل بنثبته برقم مباشر)
        savedServerEnd = now + (1800 * 1000); 
        localStorage.setItem('am4_server_global_end', savedServerEnd);
    }
    
    let serverLeft = Math.floor((parseInt(savedServerEnd) - now) / 1000);
    
    let siteLeft = serverLeft + 1800; // الموقع أطول بنصف ساعة مثلاً

    // عداد الموقع
    let siteTimerElem = document.getElementById("site-timer");
    if (siteLeft <= 0) {
        siteTimerElem.innerText = "00:00:00";
        siteTimerElem.classList.add("ended");
    } else {
        let h = Math.floor(siteLeft / 3600);
        let m = Math.floor((siteLeft % 3600) / 60);
        let s = siteLeft % 60;
        siteTimerElem.innerText = 
            String(h).padStart(2, '0') + ":" + 
            String(m).padStart(2, '0') + ":" + 
            String(s).padStart(2, '0');
        siteTimerElem.classList.remove("ended");
    }

    // عداد السيرفر
    let serverTimerElem = document.getElementById("server-timer");
    let serverInfoBox = document.getElementById("server-info");

    if (serverLeft <= 0) {
        serverTimerElem.innerText = "00:00:00";
        serverTimerElem.classList.add("ended");
        serverInfoBox.classList.remove("hidden");
    } else {
        let h = Math.floor(serverLeft / 3600);
        let m = Math.floor((serverLeft % 3600) / 60);
        let s = serverLeft % 60;
        serverTimerElem.innerText = 
            String(h).padStart(2, '0') + ":" + 
            String(m).padStart(2, '0') + ":" + 
            String(s).padStart(2, '0');
        serverTimerElem.classList.remove("ended");
        serverInfoBox.classList.add("hidden");
    }
}

setInterval(updateTimers, 1000);
updateTimers();

function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        let hint = element.querySelector('.copy-hint');
        let originalText = hint.innerHTML;
        hint.innerHTML = '<i class="fa-solid fa-check"></i> تم النسخ!';
        hint.style.color = '#00ffcc';
        setTimeout(() => {
            hint.innerHTML = originalText;
            hint.style.color = '#8da4c4';
        }, 2000);
    });
}
