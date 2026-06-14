const API_URL = 'http://localhost:8080/api';

function switchAuthTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));

    event.target.classList.add('active');
    document.getElementById(tab + 'Form').classList.add('active');
}

async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    try {
        const response = await fetch(`${API_URL}/users.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'login', email, password })
        });

        const data = await response.json();

        if (data.success) {
            currentUser = { user_id: data.user_id, name: data.name };
            currentUserId = data.user_id;
            localStorage.setItem('user', JSON.stringify(currentUser));
            showMainApp();
            loadDashboard();
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        alert('Login error: ' + error.message);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const firstName = form.querySelector('input[type="text"]:nth-of-type(1)').value;
    const lastName = form.querySelector('input[type="text"]:nth-of-type(2)').value;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    try {
        const response = await fetch(`${API_URL}/users.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'register', first_name: firstName, last_name: lastName, email, password })
        });

        const data = await response.json();

        if (data.success) {
            alert('Registration successful! Please log in.');
            switchAuthTab('login');
            form.reset();
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (error) {
        alert('Registration error: ' + error.message);
    }
}

function handleLogout() {
    localStorage.removeItem('user');
    currentUser = null;
    currentUserId = null;
    showAuthPage();
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
}
