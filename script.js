// ====== تحديد وقت الهدف الثابت ======
// هنحدد وقت الهدف بالنسبة لتوقيت UTC عشان يكون موحد للكل
// السيرفر الساعة 6 مساءً بتوقيت مصر (UTC+2) = 16:00 UTC
// الموقع الساعة 7 مساءً بتوقيت مصر (UTC+2) = 17:00 UTC

function getTargetTimesUTC() {
    let now = new Date();
    // نجيب تاريخ اليوم بتوقيت UTC
    let todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0);
    
    // هدف السيرفر: 16:00 UTC (6 مساءً بتوقيت مصر)
    let serverTarget = todayUTC + (16 * 3600 * 1000);
    
    // لو الساعة 6 مساءً عدت، نزود يوم
    if (Date.now() > serverTarget) {
        serverTarget += 24 * 3600 * 1000;
    }
    
    // الموقع بعد السيرفر بساعة: 17:00 UTC (7 مساءً بتوقيت مصر)
    let siteTarget = serverTarget + (1 * 3600 * 1000);
    
    return { serverTarget, siteTarget };
}

// ====== متغيرات عامة ======
let serverTarget, siteTarget;

// ====== جلب التوقيت من سيرفر موثوق ======
async function fetchServerTime() {
    try {
        // جلب التوقيت من API مجاني (timeapi.io)
        let response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Africa/Cairo');
        let data = await response.json();
        
        // تحويل الوقت المستلم إلى milliseconds
        let serverTime = new Date(data.dateTime).getTime();
        
        // حساب الفرق بين وقت السيرفر ووقت الجهاز
        let diff = serverTime - Date.now();
        
        // حساب الأهداف بناءً على وقت السيرفر الحقيقي
        let now = new Date(serverTime);
        let todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0);
        
        serverTarget = todayUTC + (16 * 3600 * 1000); // 6 مساءً
        if (serverTime > serverTarget) {
            serverTarget += 24 * 3600 * 1000;
        }
        siteTarget = serverTarget + (1 * 3600 * 1000); // 7 مساءً
        
        // حفظ الفرق لاستخدامه في التحديثات
        window.timeDiff = diff;
        
        // بدء التحديث
        updateTimers();
        setInterval(updateTimers, 1000);
        
    } catch (error) {
        console.warn('فشل في جلب التوقيت، نستخدم وقت الجهاز مع تعويض:', error);
        // في حالة فشل API، نستخدم وقت الجهاز مع تعويض بسيط
        let targets = getTargetTimesUTC();
        serverTarget = targets.serverTarget;
        siteTarget = targets.siteTarget;
        window.timeDiff = 0;
        updateTimers();
        setInterval(updateTimers, 1000);
    }
}

// ====== تحديث العدادات ======
function updateTimers() {
    // نستخدم وقت السيرفر المُصحح (بدلاً من وقت الجهاز)
    let now = Date.now() + (window.timeDiff || 0);
    
    // --- عداد الموقع ---
    let siteLeft = Math.max(0, Math.floor((siteTarget - now) / 1000));
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
    
    // --- عداد السيرفر ---
    let serverLeft = Math.max(0, Math.floor((serverTarget - now) / 1000));
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

// ====== تشغيل الكود ======
fetchServerTime();

// ====== وظيفة نسخ IP (نفسها) ======
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
