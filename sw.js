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
      repoPath + 'interval.js',
      repoPath + 'chords.js',
      repoPath + 'LICENSE',
      //piano sound
      repoPath + 'sounds/piano/1.mp3',
      repoPath + 'sounds/piano/2.mp3',
      repoPath + 'sounds/piano/3.mp3',
      repoPath + 'sounds/piano/4.mp3',
      repoPath + 'sounds/piano/5.mp3',
      repoPath + 'sounds/piano/6.mp3',
      repoPath + 'sounds/piano/7.mp3',
      repoPath + 'sounds/piano/8.mp3',
      repoPath + 'sounds/piano/9.mp3',
      repoPath + 'sounds/piano/10.mp3',
      repoPath + 'sounds/piano/11.mp3',
      repoPath + 'sounds/piano/12.mp3',
      repoPath + 'sounds/piano/13.mp3',
      repoPath + 'sounds/piano/14.mp3',
      repoPath + 'sounds/piano/15.mp3',
      repoPath + 'sounds/piano/16.mp3',
      repoPath + 'sounds/piano/17.mp3',
      repoPath + 'sounds/piano/18.mp3',
      repoPath + 'sounds/piano/19.mp3',
      repoPath + 'sounds/piano/20.mp3',
      repoPath + 'sounds/piano/21.mp3',
      repoPath + 'sounds/piano/22.mp3',
      repoPath + 'sounds/piano/23.mp3',
      repoPath + 'sounds/piano/24.mp3',
      repoPath + 'sounds/piano/25.mp3',
      repoPath + 'sounds/piano/26.mp3',
      repoPath + 'sounds/piano/27.mp3',
      repoPath + 'sounds/piano/28.mp3',
      repoPath + 'sounds/piano/29.mp3',
      repoPath + 'sounds/piano/30.mp3',
      repoPath + 'sounds/piano/31.mp3',
      repoPath + 'sounds/piano/32.mp3',
      repoPath + 'sounds/piano/33.mp3',
      repoPath + 'sounds/piano/34.mp3',
      repoPath + 'sounds/piano/35.mp3',
      repoPath + 'sounds/piano/36.mp3',
      repoPath + 'sounds/piano/37.mp3'
    ]);
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

      return new Response('Brak połączenia z internetem.', { status: 503 });
    }
  });
});
