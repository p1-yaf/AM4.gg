const GUILD_NAME = "AM4 SMP";

/*
  لو عندك Server ID تقدر تحطه هنا لتسريع البحث.
  سيبها فاضية لو مش عارفه، والكود هيحاول يلاقي السيرفر بالاسم.
*/
const GUILD_ID = "";

/*
  حط IDs الرتب هنا لو عايز يظهر اسم الرتبة الحقيقي.
  مثال:
  "123456789012345678": "Owner",
  "987654321098765432": "Admin"
*/
const ROLE_NAMES = {
    // "ROLE_ID": "اسم الرتبة"
};

const NEWS = [
    {icon:"📢",title:"AM4 SMP جاهز ليك",text:"السيرفر فاتح ومستنيك تدخل تبدأ مغامرتك.",date:"06 سبتمبر 2026"},
    {icon:"🔥",title:"آخر أخبار AM4",text:"خليك متابع الصفحة دي عشان كل جديد هينزل هنا.",date:"06 سبتمبر 2026"},
    {icon:"⚡",title:"تحديثات مستمرة",text:"بنشتغل على السيرفر عشان التجربة تفضل أحسن كل يوم.",date:"قريباً"}
];

const token = localStorage.getItem("am4_token");
const savedUser = JSON.parse(localStorage.getItem("am4_user") || "null");

if(!token || !savedUser){
    location.href = "index.html";
}

function avatar(user){
    if(user.avatar) return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
    return `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator||0)%5}.png`;
}

function renderUser(user){
    const name = user.global_name || user.username || "لاعب";
    document.getElementById("welcome-name").textContent = name;
    document.getElementById("username").textContent = name;
    document.getElementById("discordname").textContent = user.username || "—";
    document.getElementById("userid").textContent = "ID: " + user.id;
    document.getElementById("avatar").src = avatar(user);
}

function renderNews(){
    document.getElementById("news-list").innerHTML = NEWS.map(n=>`
        <article class="news-card">
            <div class="news-icon">${n.icon}</div>
            <h3>${n.title}</h3>
            <p>${n.text}</p>
            <time>${n.date}</time>
        </article>
    `).join("");
}

async function api(path){
    const r = await fetch("https://discord.com/api/v10"+path,{
        headers:{Authorization:`Bearer ${token}`}
    });
    if(!r.ok) throw new Error(r.status);
    return r.json();
}

async function getMembership(user){
    const memberBox = document.getElementById("member-box");
    const role = document.getElementById("role");

    try{
        let guildId = GUILD_ID;

        if(!guildId){
            const guilds = await api("/users/@me/guilds");
            const found = guilds.find(g =>
                (g.name || "").toLowerCase() === GUILD_NAME.toLowerCase() ||
                (g.name || "").toLowerCase().includes("am4")
            );
            if(found) guildId = found.id;
        }

        if(!guildId){
            memberBox.className="member-box no";
            memberBox.textContent="مش لاقيين سيرفر AM4 في حسابك.";
            role.textContent="مش عضو";
            return;
        }

        const member = await api(`/users/@me/guilds/${guildId}/member`);

        memberBox.className="member-box ok";
        memberBox.textContent="أنت عضو في سيرفر AM4 ❤️";

        const ids = member.roles || [];
        const named = ids.map(id => ROLE_NAMES[id]).filter(Boolean);

        role.textContent = named.length ? named[0] : (ids.length ? "عضو في AM4" : "@everyone");

    }catch(e){
        console.error(e);
        memberBox.className="member-box no";
        memberBox.textContent="مش قادرين نجيب بيانات عضويتك دلوقتي. اتأكد إن الموقع واخد صلاحية قراءة عضويتك.";
        role.textContent="غير متاحة";
    }
}

document.getElementById("logout").addEventListener("click",()=>{
    localStorage.removeItem("am4_token");
    localStorage.removeItem("am4_user");
    location.href="index.html";
});

renderUser(savedUser);
renderNews();
getMembership(savedUser);
