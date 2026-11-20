async function apiMe() {
  const res = await fetch('http://127.0.0.1:5000/api/me', { credentials: 'include' });
  return res.json();
}
async function apiLogout() {
  await fetch('http://127.0.0.1:5000/api/logout', { method: 'POST', credentials: 'include' });
}

const KEY_CART = 'myapp_cart_v1';
const KEY_ORDERS = 'myapp_orders_v1';

function readJSON(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch{ return fallback; } }
function writeJSON(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function money(n){ return `$${Number(n).toLocaleString('zh-Hant-TW')}`; }

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

function renderOrders(){
  const orders = readJSON(KEY_ORDERS, []);
  document.getElementById('order-count').textContent = String(orders.length);

  const root = document.getElementById('orders');
  if (!orders.length) {
    root.innerHTML = `<div class="muted">目前沒有訂單。去 Dashboard 加價購結帳一下就會出現。</div>`;
    return;
  }

  root.innerHTML = orders.map(o => {
    const dt = new Date(o.createdAt);
    return `
      <div class="order">
        <div class="top">
          <div>
            <div style="font-weight:900;">${o.orderId}</div>
            <div class="muted tiny">時間：${dt.toLocaleString('zh-Hant-TW')}</div>
          </div>
          <div style="font-weight:900;">總計：<span class="mono">${money(o.total)}</span></div>
        </div>

        <div class="items">
          ${o.items.map(it => `
            <div class="item-row">
              <span class="muted">${it.name} × <span class="mono">${it.qty}</span></span>
              <span class="mono">${money(it.price * it.qty)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

async function boot(){
  const me = await apiMe().catch(()=>({success:false}));
  if (!me.success) { window.location.href = './login.html'; return; }

  document.getElementById('username').textContent = me.username;
  document.getElementById('cart-count').textContent = String(cartCount());

  renderOrders();

  document.getElementById('logout-btn').addEventListener('click', async ()=>{
    await apiLogout();
    window.location.href = './login.html';
  });

  document.getElementById('clear-cart').addEventListener('click', ()=>{
    writeJSON(KEY_CART, {});
    document.getElementById('cart-count').textContent = '0';
    toast('已清空購物車');
  });

  document.getElementById('clear-orders').addEventListener('click', ()=>{
    writeJSON(KEY_ORDERS, []);
    renderOrders();
    toast('已清空訂單');
  });

  document.getElementById('export-btn').addEventListener('click', ()=>{
    const orders = readJSON(KEY_ORDERS, []);
    const blob = new Blob([JSON.stringify(orders, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('已匯出 orders.json');
  });
}

boot();
