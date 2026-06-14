// Service Worker registration and offline support
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(registration => console.log('Service Worker registered'))
        .catch(error => console.log('Service Worker registration failed:', error));
}

// Sync data when back online
window.addEventListener('online', () => {
    console.log('Back online - syncing data');
    if (currentUserId) {
        loadTodos();
        loadNotes();
        loadCategories();
        loadDashboard();
    }
});
