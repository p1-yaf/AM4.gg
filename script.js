// تحديد وقت نهاية ثابت وموحد للجميع (الساعة 6:00 مساءً للسيرفر، و7:00 مساءً للموقع)
function getFixedTargetTimes() {
    let now = new Date();
    
    // بنحدد تاريخ اليوم ولكن بنثبت الساعة 6:00 مساءً (18:00:00) للسيرفر
    let serverTarget = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0).getTime();
    
    // لو الوقت بتاع الساعة 6 ده عدى خلاص، بنخليه يزود يوم كمان تلقائياً عشان يفضل العد مظبوط لليوم التالي
    if (Date.now() > serverTarget) {
        serverTarget += 24 * 60 * 60 * 1000; 
    }

    // الموقع يفتح بعد السيرفر بساعة (الساعة 7:00 مساءً 19:00:00)
    let siteTarget = serverTarget + 3600 * 1000; 

    return { siteTarget, serverTarget };
}

const targets = getFixedTargetTimes();
const siteTarget = targets.siteTarget;
const serverTarget = targets.serverTarget;

function updateTimers() {
    let now = Date.now();

    // --- عداد الموقع ---
    let siteLeft = Math.floor((siteTarget - now) / 1000);
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
    let serverLeft = Math.floor((serverTarget - now) / 1000);
    let serverTimerElem = document.getElementById("server-timer");
    let serverInfoBox = document.getElementById("server-info");

    if (serverLeft <= 0) {
        serverTimerElem.innerText = "00:00:00";
        serverTimerElem.classList.add("ended"); // أنيميشن أحمر
        serverInfoBox.classList.remove("hidden"); // إظهار معلومات السيرفر للكل
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

// تحديث مستمر كل ثانية
setInterval(updateTimers, 1000);
updateTimers();

// وظيفة نسخ الـ IP
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
