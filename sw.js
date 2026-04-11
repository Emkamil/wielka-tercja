/*
 * Wielka Tercja
 *
 * sw.js
 *
 * Copyright (c) 2025-2026 Kamil Machowski
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
      repoPath + 'exercises/chords/index.html',
      repoPath + 'exercises/chords/chord.js',
      repoPath + 'global/scripts/app2.js',
      repoPath + 'global/styles/style_2.css',
      repoPath + 'global/styles/media.css',
      repoPath + 'global/styles/modal.css',
      repoPath + 'global/fonts/NotoSans-VariableFont.ttf',

      repoPath + 'icons/icon512.png',
      repoPath + 'icons/icon.ico',
      //main tree
      repoPath + 'index.html',
      repoPath + 'startpage.js',
      repoPath + 'startpage.css',
      repoPath + 'sw.js',
      repoPath + 'manifest.json',

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
