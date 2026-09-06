// ==========================================
//     نظام العد التنازلي الموحد للجميع
//         13 ساعة فقط لكل عداد
// ==========================================

// ====== ١. تحديد الأهداف بتوقيت UTC ======
function getTargets() {
    const now = new Date();
    
    // نجيب بداية اليوم بتوقيت UTC
    const todayUTC = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0, 0, 0, 0
    );
    
    // هدف السيرفر: 6 مساءً بتوقيت مصر = 16:00 UTC
    let serverTarget = todayUTC + (16 * 3600 * 1000);
    
    // لو فات الوقت، نروح لليوم التالي
    if (Date.now() > serverTarget) {
        serverTarget += 24 * 3600 * 1000;
    }
    
    // هدف الموقع: 7 مساءً بتوقيت مصر = 17:00 UTC
    let siteTarget = serverTarget + (1 * 3600 * 1000);
    
    return { serverTarget, siteTarget };
}

// ====== ٢. جلب الوقت الحقيقي من السيرفر ======
let serverTimeOffset = 0;
let targets = getTargets();
let serverTarget = targets.serverTarget;
let siteTarget = targets.siteTarget;

async function syncServerTime() {
    try {
        // جلب الوقت من ٣ سيرفرات مختلفة للدقة
        const urls = [
            'https://timeapi.io/api/Time/current/zone?timeZone=Africa/Cairo',
            'https://worldtimeapi.org/api/timezone/Africa/Cairo',
            'https://api.timezonedb.com/v2.1/get-time-zone?key=YOUR_API_KEY&format=json&by=zone&zone=Africa/Cairo'
        ];
        
        let serverTime = null;
        
        for (let url of urls) {
            try {
                const response = await fetch(url, {
                    cache: 'no-store', // منع الكاش
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache'
                    }
                });
                const data = await response.json();
                
                // استخراج الوقت من الـ API
                if (data.dateTime) {
                    serverTime = new Date(data.dateTime).getTime();
                    break;
                } else if (data.datetime) {
                    serverTime = new Date(data.datetime).getTime();
                    break;
                } else if (data.formatted) {
                    serverTime = new Date(data.formatted).getTime();
                    break;
                }
            } catch (e) {
                console.warn('فشل الاتصال بـ:', url);
                continue;
            }
        }
        
        if (serverTime) {
            // حساب الفرق بين وقت السيرفر ووقت الجهاز
            serverTimeOffset = serverTime - Date.now();
            console.log('✅ تم مزامنة الوقت، الفرق:', serverTimeOffset, 'مللي ثانية');
        } else {
            console.warn('⚠️ فشل جلب الوقت من جميع السيرفرات، نستخدم وقت الجهاز');
            serverTimeOffset = 0;
        }
        
    } catch (error) {
        console.error('❌ خطأ في المزامنة:', error);
        serverTimeOffset = 0;
    }
    
    // تحديث العدادات فوراً
    updateTimers();
}

// ====== ٣. تحديث العدادات ======
function updateTimers() {
    // الوقت الحقيقي المُصحح
    const now = Date.now() + serverTimeOffset;
    
    // --- عداد السيرفر (١٣ ساعة) ---
    let serverLeft = Math.floor((serverTarget - now) / 1000);
    const serverTimerElem = document.getElementById("server-timer");
    const serverInfoBox = document.getElementById("server-info");
    
    if (serverLeft <= 0) {
        serverTimerElem.innerText = "00:00:00";
        serverTimerElem.classList.add("ended");
        serverInfoBox.classList.remove("hidden");
    } else {
        // التأكد من أن الحد الأقصى ١٣ ساعة (46800 ثانية)
        if (serverLeft > 46800) serverLeft = 46800;
        
        const h = String(Math.floor(serverLeft / 3600)).padStart(2, '0');
        const m = String(Math.floor((serverLeft % 3600) / 60)).padStart(2, '0');
        const s = String(serverLeft % 60).padStart(2, '0');
        serverTimerElem.innerText = `${h}:${m}:${s}`;
        serverTimerElem.classList.remove("ended");
        serverInfoBox.classList.add("hidden");
    }
    
    // --- عداد الموقع (١٣ ساعة) ---
    let siteLeft = Math.floor((siteTarget - now) / 1000);
    const siteTimerElem = document.getElementById("site-timer");
    
    if (siteLeft <= 0) {
        siteTimerElem.innerText = "00:00:00";
        siteTimerElem.classList.add("ended");
    } else {
        // التأكد من أن الحد الأقصى ١٣ ساعة (46800 ثانية)
        if (siteLeft > 46800) siteLeft = 46800;
        
        const h = String(Math.floor(siteLeft / 3600)).padStart(2, '0');
        const m = String(Math.floor((siteLeft % 3600) / 60)).padStart(2, '0');
        const s = String(siteLeft % 60).padStart(2, '0');
        siteTimerElem.innerText = `${h}:${m}:${s}`;
        siteTimerElem.classList.remove("ended");
    }
}

// ====== ٤. بدء التشغيل ======
// مزامنة الوقت أولاً
syncServerTime();

// تحديث كل ثانية
setInterval(updateTimers, 1000);

// تحديث كل ٥ دقائق لإعادة المزامنة (للتأكد من الدقة)
setInterval(syncServerTime, 300000);

// ====== ٥. وظيفة نسخ IP ======
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        const hint = element.querySelector('.copy-hint');
        const originalText = hint.innerHTML;
        hint.innerHTML = '<i class="fa-solid fa-check"></i> تم النسخ!';
        hint.style.color = '#00ffcc';
        setTimeout(() => {
            hint.innerHTML = originalText;
            hint.style.color = '#8da4c4';
        }, 2000);
    }).catch(() => {
        // حل بديل للنسخ
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        const hint = element.querySelector('.copy-hint');
        const originalText = hint.innerHTML;
        hint.innerHTML = '<i class="fa-solid fa-check"></i> تم النسخ!';
        hint.style.color = '#00ffcc';
        setTimeout(() => {
            hint.innerHTML = originalText;
            hint.style.color = '#8da4c4';
        }, 2000);
    });
}
