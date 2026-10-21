/*
 * Wielka Tercja
 *
 * global/scripts/config.js
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

/** Stałe i ustawienia wspólne dla całej aplikacji. */

/** Katalog główny aplikacji - liczony z położenia tego pliku, więc działa pod każdym adresem (GitHub Pages, localhost...). */
export const BASE = new URL('../../', import.meta.url);
export const url = (path) => new URL(path, BASE).href;

export const APP_VERSION_FALLBACK = '1.3';

/** Zakres numerów plików dźwiękowych: 1 = C3 ... 37 = C6. */
export const NOTE_RANGE = { min: 1, max: 37 };

/**
 * Dostępne instrumenty. Każdy wymaga plików:  sounds/<id>/<czas>s/<numer>.mp3
 * Aby dodać instrument, wgraj dźwięki i dopisz go tutaj.
 */
export const INSTRUMENTS = [
    { id: 'piano', label: '🎹 Fortepian' },
    // { id: 'guitar', label: '🎸 Gitara' },
];

/** Dostępne długości dźwięku w sekundach (odpowiadają katalogom 1s/, 2s/). */
export const DURATIONS = [1, 2];

/** Sposoby grania. Które z nich obsługuje dane ćwiczenie - patrz exercises/registry.json (playModes). */
export const PLAY_STYLES = {
    'harmonic': { label: 'Harmoniczny', icon: '⬆️' },
    'melodic-up': { label: 'Melodyczny w górę', icon: '↗️' },
    'melodic-down': { label: 'Melodyczny w dół', icon: '↘️' },
    'melodic-random': { label: 'Melodyczny losowo', icon: '🔃' },
};
