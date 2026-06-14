async function loadSettings() {
    try {
        const response = await fetch(`${API_URL}/settings.php?user_id=${currentUserId}`);
        const settings = await response.json();
        if (settings.id) {
            document.getElementById('themeSelect').value = settings.theme || 'light';
            document.getElementById('languageSelect').value = settings.language || 'en';
            document.getElementById('timezoneSelect').value = settings.timezone || 'UTC';
            document.getElementById('notificationsEnabled').checked = settings.notifications_enabled;
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

async function handleSaveSettings(event) {
    event.preventDefault();
    const theme = document.getElementById('themeSelect').value;
    const language = document.getElementById('languageSelect').value;
    const timezone = document.getElementById('timezoneSelect').value;
    const notificationsEnabled = document.getElementById('notificationsEnabled').checked ? 1 : 0;

    try {
        const response = await fetch(`${API_URL}/settings.php?user_id=${currentUserId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ theme, language, timezone, notifications_enabled: notificationsEnabled })
        });
        const data = await response.json();
        if (data.success) {
            alert('Settings saved successfully!');
            applyTheme(theme);
        }
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'dark') {
        html.style.filter = 'invert(1)';
    } else {
        html.style.filter = 'invert(0)';
    }
}
