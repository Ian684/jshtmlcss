// ====== API ======
async function apiMe() {
  const res = await fetch('http://127.0.0.1:5000/api/me', { credentials: 'include' });
  return res.json();
}

async function apiLogout() {
  await fetch('http://127.0.0.1:5000/api/logout', { method: 'POST', credentials: 'include' });
}

// ====== Storage Keys ======
const KEY_CART = 'myapp_cart_v1';
const KEY_ORDERS = 'myapp_orders_v1';
const KEY_THEME = 'myapp_theme_v1';

// ====== Products (加價購清單：可自行擴充) ======
const PRODUCTS = [
  { id:'warranty_1y', name:'延長保固 1 年', price:299, cat:'service', tags:['安心','售後'] , desc:'延長保固一年，含非人為故障維修。' },
  { id:'warranty_2y', name:'延長保固 2 年', price:499, cat:'service', tags:['最划算','售後'] , desc:'延長保固兩年，長期使用更放心。' },
  { id:'ship_fast', name:'快速出貨', price:79, cat:'shipping', tags:['省時間'] , desc:'優先處理，24 小時內出貨（工作日）。' },
  { id:'ship_protect', name:'防撞加固包裝', price:49, cat:'shipping', tags:['保護','耐摔'] , desc:'加厚緩衝、防撞角保護。' },
  { id:'gift_box', name:'精裝禮盒', price:99, cat:'gift', tags:['送禮'] , desc:'質感禮盒+封條，送人更有面子。' },
  { id:'gift_card', name:'客製卡片', price:39, cat:'gift', tags:['加分'] , desc:'可留 50 字內祝福語（模擬）。' },
  { id:'member_plus', name:'會員 PLUS（30 天）', price:129, cat:'membership', tags:['特權'] , desc:'30 天內加購折扣與客服優先（模擬）。' },
];

// ====== Utils ======
function money(n){ return `$${Number(n).toLocaleString('zh-Hant-TW')}`; }
function readJSON(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch{ return fallback; } }
function writeJSON(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function uid(){ return Math.random().toString(16).slice(2) + Date.now().toString(16); }

function toast(text){
  const el = document.getElementById('toast');
  el.textContent = text;
  el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'), 1200);
}

// ====== Cart ======
function getCart(){ return readJSON(KEY_CART, {}); } // {productId: qty}
function setCart(c){ writeJSON(KEY_CART, c); }
function cartCount(){
  const c = getCart();
  return Object.values(c).reduce((a,b)=>a+b,0);
}
function cartTotal(){
  const c = getCart();
  let total = 0;
  for (const [pid, qty] of Object.entries(c)) {
    const p = PRODUCTS.find(x=>x.id===pid);
    if (p) total += p.price * qty;
  }
  return total;
}

function addToCart(pid, qty=1){
  const c = getCart();
  c[pid] = (c[pid] || 0) + qty;
  if (c[pid] <= 0) delete c[pid];
  setCart(c);
  renderCartBadge();
  renderStats();
  renderDrawer();
}

function clearCart(){
  setCart({});
  renderCartBadge();
  renderStats();
  renderDrawer();
  toast('已清空購物車');
}

// ====== Orders (模擬結帳) ======
function getOrders(){ return readJSON(KEY_ORDERS, []); }
function setOrders(o){ writeJSON(KEY_ORDERS, o); }

function checkout(username){
  const c = getCart();
  const items = Object.entries(c).map(([pid, qty]) => {
    const p = PRODUCTS.find(x=>x.id===pid);
    return p ? { id: p.id, name: p.name, price: p.price, qty } : null;
  }).filter(Boolean);

  if (items.length === 0) { toast('購物車是空的'); return; }

  const order = {
    orderId: 'ORD-' + uid().slice(0, 8).toUpperCase(),
    username,
    createdAt: new Date().toISOString(),
    items,
    total: items.reduce((s, it)=> s + it.price * it.qty, 0)
  };

  const orders = getOrders();
  orders.unshift(order);
  setOrders(orders);
  clearCart();
  toast(`已建立訂單：${order.orderId}`);
}

// ====== UI Render ======
function renderCartBadge(){
  document.getElementById('cart-count').textContent = String(cartCount());
}

function renderStats(){
  document.getElementById('stat-cart').textContent = String(cartCount());
  const orders = getOrders();
  document.getElementById('stat-orders').textContent = String(Math.min(orders.length, 99));
  const theme = localStorage.getItem(KEY_THEME) || 'dark';
  document.getElementById('stat-theme').textContent = theme;
}

function renderProducts(){
  const q = document.getElementById('q').value.trim().toLowerCase();
  const cat = document.getElementById('cat').value;

  const list = PRODUCTS.filter(p => {
    const hitQ = !q || (p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.tags.join(' ').toLowerCase().includes(q));
    const hitC = cat === 'all' || p.cat === cat;
    return hitQ && hitC;
  });

  const root = document.getElementById('products');
  root.innerHTML = list.map(p => `
    <div class="product">
      <div class="tag-row">
        <span class="tag">${p.cat}</span>
        ${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}
      </div>
      <div>
        <div style="font-weight:900; font-size:16px;">${p.name}</div>
        <div class="muted" style="margin-top:6px; font-size:13px;">${p.desc}</div>
      </div>
      <div class="row">
        <div class="price">${money(p.price)}</div>
        <button class="btn" data-add="${p.id}">加入</button>
      </div>
    </div>
  `).join('') || `<div class="muted">找不到符合條件的加價購。</div>`;

  root.querySelectorAll('[data-add]').forEach(btn=>{
    btn.addEventListener('click', () => {
      addToCart(btn.dataset.add, 1);
      toast('已加入購物車');
    });
  });
}

function renderDrawer(){
  const c = getCart();
  const items = Object.entries(c).map(([pid, qty]) => {
    const p = PRODUCTS.find(x=>x.id===pid);
    if (!p) return '';
    return `
      <div class="cart-item">
        <div class="top">
          <div>
            <div style="font-weight:900;">${p.name}</div>
            <div class="muted tiny">${money(p.price)} / 件</div>
          </div>
          <button class="qty-btn" data-remove="${pid}" title="移除">🗑</button>
        </div>

        <div class="qty-row">
          <button class="qty-btn" data-dec="${pid}">−</button>
          <span class="mono">${qty}</span>
          <button class="qty-btn" data-inc="${pid}">＋</button>

          <span class="muted" style="margin-left:auto;">
            小計 <span class="mono">${money(p.price * qty)}</span>
          </span>
        </div>
      </div>
    `;
  }).join('');

  const root = document.getElementById('cart-items');
  root.innerHTML = items || `<div class="muted">購物車是空的。</div>`;

  document.getElementById('cart-total').textContent = money(cartTotal());

  root.querySelectorAll('[data-inc]').forEach(b=>b.addEventListener('click', ()=>addToCart(b.dataset.inc, 1)));
  root.querySelectorAll('[data-dec]').forEach(b=>b.addEventListener('click', ()=>addToCart(b.dataset.dec, -1)));
  root.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click', ()=>{ addToCart(b.dataset.remove, -9999); toast('已移除'); }));
}

// Drawer controls
function openDrawer(){
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawer-backdrop').classList.add('open');
}
function closeDrawer(){
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawer-backdrop').classList.remove('open');
}

// ====== Boot ======
let currentUser = null;

async function boot(){
  // Auth gate
  const me = await apiMe().catch(()=>({success:false}));
  if (!me.success) { window.location.href = './login.html'; return; }

  currentUser = me.username;
  document.getElementById('welcome').textContent = `Welcome, ${me.username}`;
  document.getElementById('whoami').textContent = me.username;

  renderCartBadge();
  renderStats();
  renderProducts();
  renderDrawer();
}

document.getElementById('q').addEventListener('input', renderProducts);
document.getElementById('cat').addEventListener('change', renderProducts);

document.getElementById('cart-btn').addEventListener('click', () => { renderDrawer(); openDrawer(); });
document.getElementById('close-drawer').addEventListener('click', closeDrawer);
document.getElementById('drawer-backdrop').addEventListener('click', closeDrawer);

document.getElementById('clear-cart').addEventListener('click', clearCart);

document.getElementById('bundle-1').addEventListener('click', ()=>{
  addToCart('warranty_1y', 1);
  addToCart('ship_fast', 1);
  toast('已加入：新手安心包');
});
document.getElementById('bundle-2').addEventListener('click', ()=>{
  addToCart('gift_box', 1);
  addToCart('gift_card', 1);
  addToCart('ship_protect', 1);
  toast('已加入：送禮包');
});

document.getElementById('checkout-btn').addEventListener('click', ()=>{
  checkout(currentUser);
  renderStats();
});

document.getElementById('logout-btn').addEventListener('click', async ()=>{
  await apiLogout();
  window.location.href = './login.html';
});

boot();
