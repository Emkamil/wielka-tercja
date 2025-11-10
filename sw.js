/*
* Wielka Tercja
*
* sw.js
*
* Copyright (c) 2025 Kamil Machowski
*
* Ten projekt jest objęty licencją  CC BY-ND 4.0
*
*/

const CACHE_NAME = `Wielka_tercja`;
const repoPath = '/wielka-tercja/';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
      repoPath,
      repoPath + 'exercises/intervals/index.html',
      repoPath + 'exercises/intervals/interval.js',
      repoPath + 'exercises/intervals/media.css',
      repoPath + 'exercises/intervals/modal.css',
      repoPath + 'global/scripts/app2.js',
      repoPath + 'global/styles/style_2.css',

//main tree
      repoPath + 'index.html',
      repoPath + 'startpage.js',
      repoPath + 'startpage.css',
      repoPath + 'sw.js',
      repoPath + 'manifest.json',
      repoPath + 'icons/icon512.png',
      repoPath + 'icons/icon.ico',
      repoPath + 'LICENSE',
      //piano sound
      ...Array.from({ length: 37 }, (_, i) => `/sounds/piano/1s/${(i + 1)}.mp3`),
      ...Array.from({ length: 37 }, (_, i) => `/sounds/piano/2s/${(i + 1)}.mp3`)
  ])
})());
});

self.addEventListener('fetch', event => {
  event.respondWith(async () => {
    try {
      const networkResponse = await fetch(event.request);
      
      const cache = await caches.open(CACHE_NAME);
      cache.put(event.request, networkResponse.clone());
      return networkResponse;
    } catch (error) {

      const cachedResponse = await caches.match(event.request);

      if (cachedResponse) {
        return cachedResponse;
      }

      //return new Response('Brak połączenia z internetem.', { status: 503 });
    }
  });
});
