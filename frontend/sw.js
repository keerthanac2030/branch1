const CACHE_NAME = 'todo-app-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/modules.css',
    '/js/app.js',
    '/js/modules/auth.js',
    '/js/modules/todos.js',
    '/js/modules/notes.js',
    '/js/modules/categories.js',
    '/js/modules/stats.js',
    '/js/modules/settings.js',
    '/js/offline.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache).catch(() => {
                console.log('Some files failed to cache');
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                const clonedResponse = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, clonedResponse);
                });
                return response;
            })
            .catch(() => {
                return caches.match(event.request)
                    .then(response => response || new Response('Offline - Resource not cached'));
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
