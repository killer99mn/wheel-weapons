// اتصال WebSocket
const ws = new WebSocket("wss://wheel-weapons-server.onrender.com");

// HP بازیکن‌ها
let myHP = 100;
let enemyHP = 100;

// عناصر صفحه
const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spinBtn");
const log = document.getElementById("log");

// لیست سلاح‌ها (نسخه نظامی)
const weapons = [
  "Fire Gun",
  "Ice Blade",
  "Poison Arrow",
  "Shield Hammer",
  "Electric Staff",
  "Tactical Grenade"
];

// چرخش گردونه
spinBtn.onclick = () => {
  const degree = Math.floor(2000 + Math.random() * 2000);
  wheel.style.transform = rotate(${degree}deg);

  const index = Math.floor((degree % 360) / (360 / weapons.length));
  const weapon = weapons[index];

  // ارسال سلاح انتخاب‌شده به سرور
  setTimeout(() => {
    ws.send(JSON.stringify({ type: "weapon", weapon }));
    log.innerHTML = شما از <b>${weapon}</b> استفاده کردید;
  }, 4000);
};

// دریافت پیام از سرور
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "weapon") {
    applyWeapon(data.weapon);
  }
};

// اعمال اثر سلاح دشمن
function applyWeapon(weapon) {
  let dmg = 0;

  switch (weapon) {
    case "Fire Gun": dmg = 20; break;
    case "Ice Blade": dmg = 15; break;
    case "Poison Arrow": dmg = 10; break;
    case "Shield Hammer": dmg = -10; break; // دفاع
    case "Electric Staff": dmg = 25; break;
    case "Tactical Grenade": dmg = 30; break;
  }

  myHP -= dmg;
  if (myHP < 0) myHP = 0;

  document.getElementById("myHP").innerText = myHP;

  log.innerHTML = دشمن از <b>${weapon}</b> استفاده کرد;

  if (myHP <= 0) {
    log.innerHTML = "<b style='color:red'>شما باختید!</b>";
  }
}