// anigames/sw.js

const CACHE = 'anigames-v6';
const ASSETS = [
  './', './index.html', './style.css', './hub.js',
  './manifest.json', './icon-192.svg', './icon-512.svg',
  './games/shared.css',
  './games/2048/index.html','./games/2048/style.css',
  './games/2048/game.js','./games/2048/sounds.js','./games/2048/themes.js',
  './games/snake/index.html',
  './games/tetris/index.html',
  './games/wordle/index.html',
  './games/minesweeper/index.html',
  './games/ludo/index.html',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (!url.protocol.startsWith('http')) return;

  // Google Fonts — network first, cache fallback
  if (url.hostname==='fonts.googleapis.com'||url.hostname==='fonts.gstatic.com') {
    e.respondWith(
      fetch(e.request)
        .then(r => { const cl=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cl)); return r; })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Everything else — cache first, network fallback
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(r => {
        const cl=r.clone();
        caches.open(CACHE).then(c=>c.put(e.request,cl));
        return r;
      })
    )
  );
});
