/*
* sw.js
*
* Copyright (c) 2025 Kamil Machowski
*
* Ten projekt jest objęty licencją  CC BY-ND 4.0
*
*/

const CACHE_NAME = `Wielka_tercja`;
const repoPath = '/wielka-tercja/';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
      repoPath, // główna ścieżka
      repoPath + 'index.html',
      repoPath + 'app.js',
      repoPath + 'style.css',
      repoPath + 'sw.js',
      repoPath + 'manifest.json',
      repoPath + 'icons/icon512.png',
      repoPath + 'icons/icon.ico',
      repoPath + 'footer.css',
      repoPath + 'media.css',
      repoPath + 'modal.css',
      repoPath + 'interval.js'
    ]);
  })());
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    } else {
        try {
          const fetchResponse = await fetch(event.request);
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        } catch (e) {
            // offline
        }
    }
  })());
});