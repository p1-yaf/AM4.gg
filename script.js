// تحديد وقت انتهاء العدائين بشكل ثابت للموقع كله (مثلاً بعد ساعة للـ سايت، وبعد نص ساعة للسيرفر من الآن)
// يتم حفظ وقت الانتهاء في المتصفح (localStorage) عشان لو حد عمل ريفرش الوقت يفضل ثابت وميبدأش من الأول!

const SITE_DURATION = 3600; // ساعة بالثواني
const SERVER_DURATION = 1800; // نص ساعة بالثواني

function getTargetTime(key, durationInSeconds) {
    let savedTime = localStorage.getItem(key);
    let now = Math.floor(Date.now() / 1000);
    
    if (!savedTime || savedTime < now) {
        let target = now + durationInSeconds;
        localStorage.setItem(key, target);
        return target;
    }
    return parseInt(savedTime, 10);
}

// وقت انتهاء السايت والسيرفر
const siteTarget = getTargetTime('am4_site_target', SITE_DURATION);
const serverTarget = getTargetTime('am4_server_target', SERVER_DURATION);

function updateTimers() {
    let now = Math.floor(Date.now() / 1000);

    // عداد الموقع
    let siteLeft = siteTarget - now;
    if (siteLeft <= 0) {
        document.getElementById("site-timer").innerText = "00:00:00";
    } else {
        let h = Math.floor(siteLeft / 3600);
        let m = Math.floor((siteLeft % 3600) / 60);
        let s = siteLeft % 60;
        document.getElementById("site-timer").innerText = 
            String(h).padStart(2, '0') + ":" + 
            String(m).padStart(2, '0') + ":" + 
            String(s).padStart(2, '0');
    }

    // عداد السيرفر
    let serverLeft = serverTarget - now;
    if (serverLeft <= 0) {
        document.getElementById("server-timer").innerText = "00:00:00";
        // إظهار معلومات السيرفر فقط عند انتهاء النص ساعة تماماً
        document.getElementById("server-info").classList.remove("hidden");
    } else {
        let h = Math.floor(serverLeft / 3600);
        let m = Math.floor((serverLeft % 3600) / 60);
        let s = serverLeft % 60;
        document.getElementById("server-timer").innerText = 
            String(h).padStart(2, '0') + ":" + 
            String(m).padStart(2, '0') + ":" + 
            String(s).padStart(2, '0');
        // التأكد من إخفائها لو الوقت لسه مخلصش
        document.getElementById("server-info").classList.add("hidden");
    }
}

// تحديث العداد كل ثانية
setInterval(updateTimers, 1000);
updateTimers();

// دالة نسخ الـ IP عند الضغط عليه
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
