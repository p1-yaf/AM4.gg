// ==========================================
// AM4 - Countdown Timer
// الموعد الموحد: الساعة 6:00 مساءً بتوقيت مصر
// السيرفر والموقع نفس العداد
// ==========================================


// ==========================================
// تحديد وقت النهاية
// ==========================================

function getFixedTargetTime() {

    const now = new Date();

    // توقيت مصر UTC+3
    const EGYPT_OFFSET = 3 * 60 * 60 * 1000;

    // الوقت الحالي بتوقيت مصر
    const egyptNow = new Date(
        now.getTime() + EGYPT_OFFSET
    );

    // تاريخ اليوم بتوقيت مصر
    const year = egyptNow.getUTCFullYear();
    const month = egyptNow.getUTCMonth();
    const day = egyptNow.getUTCDate();

    // الساعة 6:00 مساءً بتوقيت مصر
    let targetTime = Date.UTC(
        year,
        month,
        day,
        18,
        0,
        0
    ) - EGYPT_OFFSET;


    // لو الساعة 6 مساءً عدت
    // نخلي الموعد الساعة 6 مساءً في اليوم التالي

    if (Date.now() >= targetTime) {

        targetTime += 24 * 60 * 60 * 1000;

    }

    return targetTime;
}


// حفظ وقت النهاية
const targetTime = getFixedTargetTime();


// ==========================================
// تحويل الثواني إلى HH:MM:SS
// ==========================================

function formatTime(totalSeconds) {

    totalSeconds = Math.max(
        0,
        Math.floor(totalSeconds)
    );


    const hours = Math.floor(
        totalSeconds / 3600
    );

    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    );

    const seconds = totalSeconds % 60;


    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
    );
}


// ==========================================
// تحديث العدادات
// ==========================================

function updateTimers() {

    const now = Date.now();


    // الوقت المتبقي بالثواني
    const remainingSeconds = Math.max(
        0,
        Math.floor(
            (targetTime - now) / 1000
        )
    );


    // تحويل الوقت
    const timerText = formatTime(
        remainingSeconds
    );


    // ======================================
    // عداد الموقع
    // ======================================

    const siteTimer =
        document.getElementById("site-timer");


    if (siteTimer) {

        siteTimer.innerText = timerText;


        if (remainingSeconds <= 0) {

            siteTimer.classList.add("ended");

        } else {

            siteTimer.classList.remove("ended");

        }

    }


    // ======================================
    // عداد السيرفر
    // ======================================

    const serverTimer =
        document.getElementById("server-timer");


    if (serverTimer) {

        serverTimer.innerText = timerText;


        if (remainingSeconds <= 0) {

            serverTimer.classList.add("ended");

        } else {

            serverTimer.classList.remove("ended");

        }

    }


    // ======================================
    // معلومات السيرفر
    // ======================================

    const serverInfoBox =
        document.getElementById("server-info");


    if (serverInfoBox) {

        if (remainingSeconds <= 0) {

            // إظهار المعلومات
            serverInfoBox.classList.remove(
                "hidden"
            );

        } else {

            // إخفاء المعلومات
            serverInfoBox.classList.add(
                "hidden"
            );

        }

    }

}


// ==========================================
// تشغيل العداد فورًا
// ==========================================

updateTimers();


// ==========================================
// تحديث كل ثانية
// ==========================================

setInterval(
    updateTimers,
    1000
);


// ==========================================
// نسخ IP
// ==========================================

function copyToClipboard(text, element) {

    if (!navigator.clipboard) {

        return;

    }


    navigator.clipboard
        .writeText(text)
        .then(() => {

            if (!element) return;


            const hint =
                element.querySelector(
                    ".copy-hint"
                );


            if (!hint) return;


            const originalText =
                hint.innerHTML;


            hint.innerHTML =
                '<i class="fa-solid fa-check"></i> تم النسخ!';


            hint.style.color =
                "#00ffcc";


            setTimeout(() => {

                hint.innerHTML =
                    originalText;

                hint.style.color =
                    "#8da4c4";

            }, 2000);

        })

        .catch(() => {

            console.log(
                "تعذر نسخ النص"
            );

        });

}
