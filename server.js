// ==========================================
// حماية صفحة معلومات السيرفر
// ==========================================

const token = localStorage.getItem("am4_token");

if (!token) {
    window.location.replace("index.html");
}


// ==========================================
// Burger Menu
// ==========================================

const menuBtn = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeMenu");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");


menuBtn.addEventListener("click", () => {

    sideMenu.classList.add("active");
    overlay.classList.add("active");

});


closeMenu.addEventListener("click", () => {

    sideMenu.classList.remove("active");
    overlay.classList.remove("active");

});


overlay.addEventListener("click", () => {

    sideMenu.classList.remove("active");
    overlay.classList.remove("active");

});


// ==========================================
// نسخ IP / PORT
// ==========================================

async function copyText(id, button) {

    const element = document.getElementById(id);

    if (!element) return;

    const text = element.textContent.trim();

    try {

        await navigator.clipboard.writeText(text);

        const oldText = button.textContent;

        button.textContent = "تم ✓";

        setTimeout(() => {

            button.textContent = oldText;

        }, 1500);

    } catch (error) {

        console.error(error);

    }

}
