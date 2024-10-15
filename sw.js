// Nombre del caché
const CACHE_NAME = 'calculadora-offline-v1';
// Archivos a almacenar en caché
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    'https://cdn.jsdelivr.net/npm/vue@2' // Asegura almacenar Vue.js si usas la CDN
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Archivos almacenados en caché');
            return cache.addAll(urlsToCache);
        })
    );
});

// Interceptar solicitudes para servir desde el caché
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            // Si el archivo está en caché, lo devuelve, si no, lo descarga
            return response || fetch(event.request);
        })
    );
});

// Actualizar el Service Worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
