// عداد الموقع (ساعة كاملة = 3600 ثانية)
let siteTime = 3600;
// عداد السيرفر (نص ساعة = 1800 ثانية)
let serverTime = 1800;

// عداد الموقع
const siteInterval = setInterval(() => {
    if (siteTime <= 0) {
        clearInterval(siteInterval);
        document.getElementById("site-countdown").innerText = "تم فتح الموقع!";
    } else {
        siteTime--;
        let hours = Math.floor(siteTime / 3600);
        let minutes = Math.floor((siteTime % 3600) / 60);
        let seconds = siteTime % 60;
        document.getElementById("site-countdown").innerText = 
            String(hours).padStart(2, '0') + ":" + 
            String(minutes).padStart(2, '0') + ":" + 
            String(seconds).padStart(2, '0');
    }
}, 1000);

// عداد السيرفر (نص ساعة)
const serverInterval = setInterval(() => {
    if (serverTime <= 0) {
        clearInterval(serverInterval);
        document.getElementById("server-countdown").innerText = "تم فتح السيرفر!";
        // إظهار معلومات الدخول لما الوقت يخلص
        document.getElementById("server-info").classList.remove("hidden");
    } else {
        serverTime--;
        let hours = Math.floor(serverTime / 3600);
        let minutes = Math.floor((serverTime % 3600) / 60);
        let seconds = serverTime % 60;
        document.getElementById("server-countdown").innerText = 
            String(hours).padStart(2, '0') + ":" + 
            String(minutes).padStart(2, '0') + ":" + 
            String(seconds).padStart(2, '0');
    }
}, 1000);

// وظيفة نسخ النصوص عند الضغط عليها
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("تم نسخ: " + text);
    });
}
