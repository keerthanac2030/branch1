// Global Variables
let currentUser = null;
let currentUserId = null;

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        currentUserId = currentUser.user_id;
        showMainApp();
        loadDashboard();
    } else {
        showAuthPage();
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.log('Service Worker registration failed:', err);
        });
    }

    // Monitor online status
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
});

// Navigation
function navigateTo(moduleName) {
    // Hide all modules
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === moduleName) {
            btn.classList.add('active');
        }
    });

    // Show selected module
    const module = document.getElementById(moduleName);
    if (module) {
        module.classList.add('active');

        // Load module data
        if (moduleName === 'dashboard') {
            loadDashboard();
        } else if (moduleName === 'todos') {
            loadTodos();
        } else if (moduleName === 'notes') {
            loadNotes();
        } else if (moduleName === 'categories') {
            loadCategories();
        } else if (moduleName === 'statistics') {
            loadStatistics();
        } else if (moduleName === 'settings') {
            loadSettings();
        }
    }
}

// Show/Hide Pages
function showAuthPage() {
    document.getElementById('authPage').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
}

function showMainApp() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';
    document.getElementById('userName').textContent = currentUser.name;
}

// Toggle User Menu
function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.classList.toggle('active');
}

function updateOnlineStatus() {
    const indicator = document.getElementById('statusIndicator');
    if (navigator.onLine) {
        indicator.textContent = '🟢';
        indicator.title = 'Online';
    } else {
        indicator.textContent = '🔴';
        indicator.title = 'Offline';
    }
}
