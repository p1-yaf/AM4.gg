const CLIENT_ID = "1546040930509791282";
const REDIRECT_URI = "https://p1-yaf.github.io/AM4/";
const AUTH_URL =
    "https://discord.com/oauth2/authorize" +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    "&response_type=token" +
    "&scope=identify%20email%20guilds%20guilds.members.read";

const btn = document.getElementById("discord-btn");
const toast = document.getElementById("toast");

function showToast(text){
    toast.textContent = text;
    toast.classList.add("show");
    setTimeout(()=>toast.classList.remove("show"),3000);
}

function hasSession(){
    return !!localStorage.getItem("am4_token");
}

function goDashboard(){
    window.location.href = "dashboard.html";
}

async function validateToken(token){
    try{
        const r = await fetch("https://discord.com/api/users/@me",{
            headers:{Authorization:`Bearer ${token}`}
        });
        if(!r.ok) return null;
        return await r.json();
    }catch{return null}
}

async function start(){
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");

    if(token){
        const user = await validateToken(token);
        if(user){
            localStorage.setItem("am4_token",token);
            localStorage.setItem("am4_user",JSON.stringify(user));
            history.replaceState({},document.title,window.location.pathname);
            goDashboard();
            return;
        }
        history.replaceState({},document.title,window.location.pathname);
        showToast("حصلت مشكلة في تسجيل الدخول، جرب تاني.");
        return;
    }

    if(hasSession()){
        const user = await validateToken(localStorage.getItem("am4_token"));
        if(user){
            localStorage.setItem("am4_user",JSON.stringify(user));
            goDashboard();
        }else{
            localStorage.removeItem("am4_token");
            localStorage.removeItem("am4_user");
        }
    }
}

btn.addEventListener("click",()=>{
    btn.disabled=true;
    btn.querySelector("b").textContent="جاري فتح Discord...";
    location.href=AUTH_URL;
});

start();
