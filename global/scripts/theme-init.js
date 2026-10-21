/*
 * Wielka Tercja
 *
 * global/scripts/theme-init.js
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
 * Ładowany synchronicznie w <head> (zwykły skrypt, nie moduł), żeby motyw
 * był ustawiony przed pierwszym renderem i strona nie "błyskała".
 * Reguła: zapisany wybór użytkownika, a jeśli go nie ma - ustawienie systemu.
 */
(function () {
    var theme = null;
    try { theme = localStorage.getItem('theme'); } catch (e) { /* tryb prywatny */ }
    // wartości z dawnych wersji: 'dark-theme' / 'light-theme'
    if (theme === 'dark-theme') theme = 'dark';
    if (theme === 'light-theme') theme = 'light';
    if (theme !== 'dark' && theme !== 'light') {
        theme = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.dataset.theme = theme;
})();
