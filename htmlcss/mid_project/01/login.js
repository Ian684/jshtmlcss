const form = document.getElementById('login');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    try {
        const response = await fetch('http://127.0.0.1:5000/api/login_user' , {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });
        const result = await response.json();
        if (result.success) {
            alert('Login successful');
            window.location.href = '';// next page
        } else {
            alert(`Login failed ${result.message || 'Unknown error'}`);
        } 
    }catch (error) {
        alert(`web failed to load ${error}`);
        console.error(error);
    }
});