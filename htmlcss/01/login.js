const form = document.getElementById('login');
const btn = document.getElementById('login-btn');
const msg = document.getElementById('msg');
const toggle = document.getElementById('pw-toggle');
const demoBtn = document.getElementById('demo-btn');

function setMsg(text, type) {
  msg.className = 'msg' + (type ? ` ${type}` : '');
  msg.textContent = text || '';
}

function setLoading(isLoading) {
  btn.disabled = isLoading;
  btn.querySelector('.spinner').style.display = isLoading ? 'inline-block' : 'none';
  btn.querySelector('.btn-text').textContent = isLoading ? 'Logging in...' : 'Login';
}

toggle.addEventListener('click', () => {
  const pw = document.getElementById('password');
  pw.type = pw.type === 'password' ? 'text' : 'password';
  toggle.textContent = pw.type === 'password' ? '👁' : '🙈';
});

demoBtn.addEventListener('click', () => {
  document.getElementById('username').value = 'admin';
  document.getElementById('password').value = 'admin';
  setMsg('Demo filled. Hit Login.', '');
});

window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('remember_username');
  if (saved) document.getElementById('username').value = saved;
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  setMsg('', '');

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const remember = document.getElementById('remember').checked;

  if (username.length < 3 || password.length < 3) {
    setMsg('Username / Password 至少 3 個字元', 'error');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('http://127.0.0.1:5000/api/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (result.success) {
      setMsg('✅ 登入成功，正在跳轉…', 'ok');

      if (remember) localStorage.setItem('remember_username', username);
      else localStorage.removeItem('remember_username');

      window.location.href = './home.html';
    } else {
      setMsg(`❌ ${result.message || 'Login failed'}`, 'error');
    }
  } catch (err) {
    setMsg(`⚠️ 連線失敗：${err}`, 'error');
    console.error(err);
  } finally {
    setLoading(false);
  }
});
