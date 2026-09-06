// ==========================================
//     نظام العد التنازلي - نسخة مستقرة
// ==========================================

// ====== ١. إعدادات ثابتة ======
const TARGET_HOUR_SERVER = 18; // 6 مساءً
const TARGET_HOUR_SITE = 19;   // 7 مساءً
const MAX_HOURS = 13;          // 13 ساعة كحد أقصى

// ====== ٢. حساب الأهداف ======
function calculateTargets() {
    const now = new Date();
    
    // هدف السيرفر: اليوم الساعة 6 مساءً
    let serverTarget = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        TARGET_HOUR_SERVER,
        0, 0, 0
    ).getTime();
    
    // لو فات الوقت، نروح لليوم التالي
    if (Date.now() > serverTarget) {
        serverTarget += 24 * 3600 * 1000;
    }
    
    // هدف الموقع: بعد السيرفر بساعة
    let siteTarget = serverTarget + (1 * 3600 * 1000);
    
    return { serverTarget, siteTarget };
}

// ====== ٣. المتغيرات العامة ======
let targets = calculateTargets();
let serverTarget = targets.serverTarget;
let siteTarget = targets.siteTarget;
let serverTimeOffset = 0;
let timerInterval = null;

// ====== ٤. جلب الوقت من السيرفر ======
async function syncServerTime() {
    try {
        const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Africa/Cairo', {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        if (!response.ok) throw new Error('فشل الاتصال');
        
        const data = await response.json();
        const serverTime = new Date(data.dateTime).getTime();
        serverTimeOffset = serverTime - Date.now();
        
        console.log('✅ تم المزامنة، الفرق:', serverTimeOffset, 'مللي');
        
    } catch (error) {
        console.warn('⚠️ فشل المزامنة، نستخدم وقت الجهاز');
        serverTimeOffset = 0;
    }
    
    // تحديث فوري
    updateTimers();
}

// ====== ٥. تحديث العدادات (الجزء الأهم) ======
function updateTimers() {
    // الوقت الحقيقي
    const now = Date.now() + serverTimeOffset;
    
    // --- عداد السيرفر ---
    let serverLeft = Math.floor((serverTarget - now) / 1000);
    const serverTimerElem = document.getElementById('server-timer');
    const serverInfoBox = document.getElementById('server-info');
    
    if (serverLeft <= 0) {
        serverTimerElem.innerText = '00:00:00';
        serverTimerElem.classList.add('ended');
        if (serverInfoBox) serverInfoBox.classList.remove('hidden');
    } else {
        // الحد الأقصى 13 ساعة
        if (serverLeft > MAX_HOURS * 3600) serverLeft = MAX_HOURS * 3600;
        
        const h = String(Math.floor(serverLeft / 3600)).padStart(2, '0');
        const m = String(Math.floor((serverLeft % 3600) / 60)).padStart(2, '0');
        const s = String(serverLeft % 60).padStart(2, '0');
        serverTimerElem.innerText = `${h}:${m}:${s}`;
        serverTimerElem.classList.remove('ended');
        if (serverInfoBox) serverInfoBox.classList.add('hidden');
    }
    
    // --- عداد الموقع ---
    let siteLeft = Math.floor((siteTarget - now) / 1000);
    const siteTimerElem = document.getElementById('site-timer');
    
    if (siteLeft <= 0) {
        siteTimerElem.innerText = '00:00:00';
        siteTimerElem.classList.add('ended');
    } else {
        // الحد الأقصى 13 ساعة
        if (siteLeft > MAX_HOURS * 3600) siteLeft = MAX_HOURS * 3600;
        
        const h = String(Math.floor(siteLeft / 3600)).padStart(2, '0');
        const m = String(Math.floor((siteLeft % 3600) / 60)).padStart(2, '0');
        const s = String(siteLeft % 60).padStart(2, '0');
        siteTimerElem.innerText = `${h}:${m}:${s}`;
        siteTimerElem.classList.remove('ended');
    }
    
    // تأكيد أن التحديث شغال (للتأكد في الـ Console)
    console.log('🔄 تم التحديث:', new Date().toLocaleTimeString(), 'السيرفر:', serverTimerElem.innerText);
}

// ====== ٦. بدء التشغيل ======
async function init() {
    console.log('🚀 بدء التشغيل...');
    
    // أولاً: مزامنة الوقت
    await syncServerTime();
    
    // ثانياً: إيقاف أي مؤقت قديم
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // ثالثاً: تشغيل المؤقت الجديد
    timerInterval = setInterval(updateTimers, 1000);
    
    // رابعاً: تحديث كل 5 دقائق لإعادة المزامنة
    setInterval(syncServerTime, 300000);
    
    console.log('✅ النظام يعمل بنجاح');
}

// ====== ٧. تشغيل الكود ======
init();

// ====== ٨. وظيفة نسخ IP ======
function copyToClipboard(text, element) {
    if (!element) return;
    
    navigator.clipboard.writeText(text).then(() => {
        const hint = element.querySelector('.copy-hint');
        if (!hint) return;
        const originalText = hint.innerHTML;
        hint.innerHTML = '<i class="fa-solid fa-check"></i> تم النسخ!';
        hint.style.color = '#00ffcc';
        setTimeout(() => {
            hint.innerHTML = originalText;
            hint.style.color = '#8da4c4';
        }, 2000);
    }).catch(() => {
        // حل بديل
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        const hint = element.querySelector('.copy-hint');
        if (!hint) return;
        const originalText = hint.innerHTML;
        hint.innerHTML = '<i class="fa-solid fa-check"></i> تم النسخ!';
        hint.style.color = '#00ffcc';
        setTimeout(() => {
            hint.innerHTML = originalText;
            hint.style.color = '#8da4c4';
        }, 2000);
    });
}
