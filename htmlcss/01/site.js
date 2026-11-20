const goBtn = document.getElementById('go-dashboard');

async function isLoggedIn() {
  try {
    const res = await fetch('http://127.0.0.1:5000/api/me', { credentials: 'include' });
    const data = await res.json();
    return !!data.success;
  } catch {
    return false;
  }
}

goBtn?.addEventListener('click', async () => {
  const ok = await isLoggedIn();
  window.location.href = ok ? './home.html' : './login.html';
});
