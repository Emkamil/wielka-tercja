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

/*
 * Service worker: aplikacja działa offline.
 *  - pliki aplikacji: najpierw sieć (zawsze świeża wersja), a bez sieci - kopia z pamięci podręcznej,
 *  - dźwięki: najpierw pamięć podręczna (duże pliki, nie zmieniają się).
 * Ścieżki liczone względem zakresu (scope) service workera, więc nie zależą od adresu strony.
 * Listę modułów ćwiczeń SW bierze z exercises/registry.json - dodając ćwiczenie nie trzeba tu nic zmieniać.
 */

const VERSION = '1.3';                      // zmień, aby wymusić odświeżenie pamięci podręcznej
const APP_CACHE = `wielka-tercja-app-v${VERSION}`;
const SOUND_CACHE = 'wielka-tercja-sounds';
const SOUND_SETS = ['piano'];               // instrumenty pobierane z góry (reszta - przy pierwszym użyciu)
const DURATIONS = [1, 2];
const NOTE_COUNT = 37;

const abs = (path) => new URL(path, self.registration.scope).href;

const SHELL = [
    '', 'index.html', 'exercise.html', 'manifest.json', 'icons/icon512.png', 'icons/icon.ico',
    'global/styles/tokens.css', 'global/styles/base.css', 'global/styles/home.css', 'global/styles/exercise.css',
    'global/scripts/theme-init.js', 'global/scripts/config.js', 'global/scripts/storage.js', 'global/scripts/settings.js',
    'global/scripts/registry.js', 'global/scripts/ui.js', 'global/scripts/audio.js', 'global/scripts/home.js',
    'global/scripts/exercise.js', 'exercises/registry.json',
];

async function precacheShell() {
    const cache = await caches.open(APP_CACHE);
    // pliki aplikacji: braki (np. brak ikon) nie mogą zablokować instalacji
    await Promise.allSettled(SHELL.map((p) => cache.add(abs(p))));

    try {
        const registry = await (await fetch(abs('exercises/registry.json'))).json();
        await Promise.allSettled(registry.exercises.map((e) => cache.add(abs(`exercises/${e.module}`))));
    } catch (e) { /* offline przy instalacji - moduły dojdą przy pierwszym użyciu */ }
}

async function precacheSounds() {
    const cache = await caches.open(SOUND_CACHE);
    const urls = [];
    for (const set of SOUND_SETS) {
        for (const d of DURATIONS) {
            for (let n = 1; n <= NOTE_COUNT; n++) urls.push(abs(`sounds/${set}/${d}s/${n}.mp3`));
        }
    }
    await Promise.allSettled(urls.map((u) => cache.match(u).then((hit) => hit || cache.add(u))));
}

self.addEventListener('install', (event) => {
    event.waitUntil(precacheShell().then(() => self.skipWaiting()));
    // dźwięki ładują się w tle - nie opóźniają instalacji
    precacheSounds();
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const names = await caches.keys();
        await Promise.all(names
            .filter((n) => n !== APP_CACHE && n !== SOUND_CACHE)
            .map((n) => caches.delete(n)));
        await self.clients.claim();
    })());
});

// Katalogi starej wersji (względem miejsca, gdzie leży sw.js), których service worker ma nie dotykać
const OLD_VERSION_DIRS = ['old/'];   // np. ['stara/', 'v1/']

const OLD_VERSION_PATHS = OLD_VERSION_DIRS.map((d) => new URL(d, self.registration.scope).pathname);

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    if (request.method !== 'GET' || url.origin !== self.location.origin) return;

    // stara wersja: bez cachowania, przeglądarka obsługuje ją po swojemu
    if (OLD_VERSION_PATHS.some((p) => url.pathname.startsWith(p))) return;

    if (url.pathname.includes('/sounds/')) {
        event.respondWith(cacheFirst(request));
    } else {
        event.respondWith(networkFirst(request));
    }
});

async function cacheFirst(request) {
    const cache = await caches.open(SOUND_CACHE);
    const hit = await cache.match(request);
    if (hit) return hit;
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
}

async function networkFirst(request) {
    const cache = await caches.open(APP_CACHE);
    try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
    } catch (error) {
        // exercise.html?type=... trzeba dopasować bez parametrów
        const hit = await cache.match(request, { ignoreSearch: true });
        if (hit) return hit;
        throw error;
    }
}
