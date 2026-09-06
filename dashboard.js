const API = "https://discord.com/api/v10";

const token = localStorage.getItem("am4_token");


// ==========================================
// حماية الصفحة
// ==========================================

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

function openMenu() {
    sideMenu.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeSideMenu() {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
}

menuBtn.addEventListener("click", openMenu);
closeMenu.addEventListener("click", closeSideMenu);
overlay.addEventListener("click", closeSideMenu);


// قفل القائمة لما يضغط على رابط

document.querySelectorAll(".menu-links a").forEach(link => {
    link.addEventListener("click", closeSideMenu);
});


// ==========================================
// بيانات الأخبار
// ==========================================

const NEWS = [
    {
        date: "AM4 SMP",
        title: "نورت AM4 ❤️",
        text: "أهلاً بيك في سيرفر AM4 SMP. استمتع باللعب وابدأ مغامرتك."
    },

    {
        date: "Server",
        title: "السيرفر شغال 🔥",
        text: "ادخل السيرفر مع أصحابك وابدأ تبني عالمك."
    },

    {
        date: "Updates",
        title: "تحديثات مستمرة ⚡",
        text: "تابع الموقع عشان تعرف كل الأخبار والتحديثات الجديدة."
    }
];


// ==========================================
// التحقق من تسجيل الدخول
// ==========================================

async function checkLogin() {

    if (!token) return;

    try {

        const response = await fetch(`${API}/users/@me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });


        // Token غير صالح

        if (!response.ok) {

            localStorage.removeItem("am4_token");
            localStorage.removeItem("am4_user");

            window.location.replace("index.html");

            return;
        }


        const user = await response.json();

        loadUser(user);
        loadNews();

        checkGuild();

    } catch (error) {

        console.error(error);

        localStorage.removeItem("am4_token");
        localStorage.removeItem("am4_user");

        window.location.replace("index.html");
    }
}


// ==========================================
// بيانات المستخدم
// ==========================================

function loadUser(user) {

    const name =
        user.global_name ||
        user.username ||
        "Player";


    const welcomeName =
        document.getElementById("welcomeName");

    const displayName =
        document.getElementById("displayName");

    const username =
        document.getElementById("username");

    const userId =
        document.getElementById("userId");

    const avatar =
        document.getElementById("avatar");


    if (welcomeName) {
        welcomeName.textContent =
            `أهلاً بيك يا ${name} 👋`;
    }


    if (displayName) {
        displayName.textContent = name;
    }


    if (username) {
        username.textContent =
            `@${user.username}`;
    }


    if (userId) {
        userId.textContent = user.id;
    }


    if (avatar) {

        if (user.avatar) {

            avatar.src =
                `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;

        } else {

            avatar.src =
                "https://cdn.discordapp.com/embed/avatars/0.png";

        }
    }
}


// ==========================================
// التحقق من سيرفر AM4
// ==========================================

async function checkGuild() {

    try {

        const response = await fetch(
            `${API}/users/@me/guilds`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        if (!response.ok) {
            showNotMember();
            return;
        }


        const guilds = await response.json();


        const am4 = guilds.find(guild =>
            guild.name.toLowerCase().includes("am4")
        );


        if (am4) {

            showMember();

        } else {

            showNotMember();

        }

    } catch (error) {

        console.error(error);

        showNotMember();
    }
}


function showMember() {

    const status =
        document.getElementById("membershipStatus");

    const role =
        document.getElementById("membershipRole");


    if (status) {
        status.textContent =
            "أنت عضو في سيرفر AM4 ❤️";
    }

    if (role) {
        role.textContent =
            "عضو في مجتمع AM4 SMP";
    }
}


function showNotMember() {

    const status =
        document.getElementById("membershipStatus");

    const role =
        document.getElementById("membershipRole");


    if (status) {
        status.textContent =
            "مش موجود في سيرفر AM4";
    }

    if (role) {
        role.textContent =
            "تقدر تدخل السيرفر وتبدأ لعبك مع باقي اللاعبين.";
    }
}


// ==========================================
// الأخبار
// ==========================================

function loadNews() {

    const container =
        document.getElementById("newsContainer");


    if (!container) return;


    container.innerHTML = "";


    NEWS.forEach(news => {

        const card =
            document.createElement("div");

        card.className = "news-card";


        card.innerHTML = `
            <span>${news.date}</span>
            <h3>${news.title}</h3>
            <p>${news.text}</p>
        `;


        container.appendChild(card);

    });
}


// ==========================================
// نسخ IP / Port
// ==========================================

async function copyText(elementId, button) {

    const element =
        document.getElementById(elementId);


    if (!element) return;


    const text =
        element.textContent.trim();


    try {

        await navigator.clipboard.writeText(text);

        const oldText =
            button.textContent;

        button.textContent =
            "تم ✓";


        setTimeout(() => {
            button.textContent = oldText;
        }, 1500);


    } catch (error) {

        console.error(error);

    }
}


// ==========================================
// تشغيل
// ==========================================

checkLogin();
