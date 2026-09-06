// وقت الموقع (ساعة = 3600 ثانية) وقت السيرفر (نصف ساعة = 1800 ثانية)
const SITE_DURATION = 3600;
const SERVER_DURATION = 1800;

function getTargetTime(key, durationInSeconds) {
    let savedTime = localStorage.getItem(key);
    let now = Math.floor(Date.now() / 1000);
    
    // لو مفيش وقت محفوظ أو الوقت القديم خلص، بنعمل وقت جديد يبدأ من دلوقتي
    if (!savedTime || parseInt(savedTime, 10) < now) {
        let target = now + durationInSeconds;
        localStorage.setItem(key, target);
        return target;
    }
    return parseInt(savedTime, 10);
}

const siteTarget = getTargetTime('am4_site_target_v2', SITE_DURATION);
const serverTarget = getTargetTime('am4_server_target_v2', SERVER_DURATION);

function updateTimers() {
    let now = Math.floor(Date.now() / 1000);

    // --- عداد الموقع ---
    let siteLeft = siteTarget - now;
    let siteTimerElem = document.getElementById("site-timer");
    
    if (siteLeft <= 0) {
        siteTimerElem.innerText = "00:00:00";
        siteTimerElem.classList.add("ended"); // تشغيل الأنيميشن الأحمر
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
    let serverLeft = serverTarget - now;
    let serverTimerElem = document.getElementById("server-timer");
    let serverInfoBox = document.getElementById("server-info");

    if (serverLeft <= 0) {
        serverTimerElem.innerText = "00:00:00";
        serverTimerElem.classList.add("ended"); // تشغيل الأنيميشن الأحمر للأرقام
        serverInfoBox.classList.remove("hidden"); // إظهار معلومات السيرفر
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
