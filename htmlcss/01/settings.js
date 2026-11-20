async function apiMe() {
  const res = await fetch('http://127.0.0.1:5000/api/me', { credentials: 'include' });
  return res.json();
}
async function apiLogout() {
  await fetch('http://127.0.0.1:5000/api/logout', { method: 'POST', credentials: 'include' });
}

const KEY_CART = 'myapp_cart_v1';
const KEY_ORDERS = 'myapp_orders_v1';
const KEY_THEME = 'myapp_theme_v1';
const KEY_PREF = 'myapp_pref_v1';

function readJSON(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch{ return fallback; } }
function writeJSON(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

function toast(text){
  const el = document.getElementById('toast');
  el.textContent = text;
  el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'), 1200);
}

function cartCount(){
  const c = readJSON(KEY_CART, {});
  return Object.values(c).reduce((a,b)=>a+b,0);
}

function dataState(){
  const orders = readJSON(KEY_ORDERS, []);
  return `cart:${cartCount()} / orders:${orders.length}`;
}

function applyThemeLabel(){
  const t = localStorage.getItem(KEY_THEME) || 'dark';
  document.getElementById('theme-label').textContent = t;
}

function loadPref(){
  const pref = readJSON(KEY_PREF, { theme:'dark', notify:false, ship:'standard' });
  document.getElementById('theme').value = pref.theme;
  document.getElementById('notify').checked = !!pref.notify;
  document.getElementById('ship').value = pref.ship || 'standard';
}

function savePref(){
  const pref = {
    theme: document.getElementById('theme').value,
    notify: document.getElementById('notify').checked,
    ship: document.getElementById('ship').value,
  };
  writeJSON(KEY_PREF, pref);
  localStorage.setItem(KEY_THEME, pref.theme);
  applyThemeLabel();
  document.getElementById('data-state').textContent = dataState();
  toast('偏好已儲存');
}

function resetPref(){
  writeJSON(KEY_PREF, { theme:'dark', notify:false, ship:'standard' });
  localStorage.setItem(KEY_THEME, 'dark');
  loadPref();
  applyThemeLabel();
  toast('已重置偏好');
}

async function boot(){
  const me = await apiMe().catch(()=>({success:false}));
  if (!me.success) { window.location.href = './login.html'; return; }

  document.getElementById('username').textContent = me.username;
  document.getElementById('data-state').textContent = dataState();

  applyThemeLabel();
  loadPref();

  document.getElementById('logout-btn').addEventListener('click', async ()=>{
    await apiLogout();
    window.location.href = './login.html';
  });

  document.getElementById('logout-all').addEventListener('click', async ()=>{
    await apiLogout();
    window.location.href = './login.html';
  });

  document.getElementById('apply-theme').addEventListener('click', ()=>{
    const t = document.getElementById('theme').value;
    localStorage.setItem(KEY_THEME, t);
    applyThemeLabel();
    toast('已套用主題（示範）');
  });

  document.getElementById('save-pref').addEventListener('click', savePref);
  document.getElementById('reset-pref').addEventListener('click', resetPref);

  document.getElementById('clear-cart').addEventListener('click', ()=>{
    writeJSON(KEY_CART, {});
    document.getElementById('data-state').textContent = dataState();
    toast('已清空購物車');
  });

  document.getElementById('clear-orders').addEventListener('click', ()=>{
    writeJSON(KEY_ORDERS, []);
    document.getElementById('data-state').textContent = dataState();
    toast('已清空訂單');
  });

  document.getElementById('export-all').addEventListener('click', ()=>{
    const payload = {
      pref: readJSON(KEY_PREF, {}),
      theme: localStorage.getItem(KEY_THEME),
      cart: readJSON(KEY_CART, {}),
      orders: readJSON(KEY_ORDERS, []),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'myapp_export.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('已匯出 myapp_export.json');
  });
}

boot();
