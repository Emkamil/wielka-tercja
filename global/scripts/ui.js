/*
 * Wielka Tercja
 *
 * global/scripts/ui.js
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

import { url, APP_VERSION_FALLBACK } from './config.js';
import { storage } from './storage.js';

const SVG = (inner) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

export const ICONS = {
    sun: SVG('<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>'),
    moon: SVG('<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'),
    info: SVG('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'),
    home: SVG('<path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5z"/>'),
    check: SVG('<polyline points="20 6 9 17 4 12"/>'),
    ban: SVG('<circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/>'),
};

const GITHUB_PATH = 'M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z';

// ---------------------------------------------------------------- okna dialogowe

/** Tworzy natywny <dialog>: focus trap, Esc i warstwa tła działają bez dodatkowego kodu. */
function createDialog(className, html) {
    const dialog = document.createElement('dialog');
    dialog.className = `dialog ${className}`;
    dialog.innerHTML = html;
    // kliknięcie w tło (poza treścią) zamyka okno
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) dialog.close(); });
    document.body.appendChild(dialog);
    return dialog;
}

/** Zastępuje dawne window.showCustomAlert. Zwraca obietnicę rozwiązywaną po zamknięciu okna. */
export function showAlert(message) {
    return new Promise((resolve) => {
        const dialog = createDialog('dialog--alert', `
            <p class="dialog__message"></p>
            <div class="dialog__actions"><button class="btn btn--primary" data-close autofocus>OK</button></div>`);
        dialog.querySelector('.dialog__message').textContent = message;
        dialog.addEventListener('close', () => { dialog.remove(); resolve(); });
        dialog.showModal();
    });
}

let infoDialog = null;

async function loadVersion(target) {
    try {
        const response = await fetch(url('manifest.json'));
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        target.textContent = (await response.json()).version || APP_VERSION_FALLBACK;
    } catch {
        target.textContent = APP_VERSION_FALLBACK;
    }
}

function openInfo() {
    if (!infoDialog) {
        infoDialog = createDialog('dialog--info', `
            <button class="dialog__close" data-close aria-label="Zamknij">&times;</button>
            <h2>Wielka Tercja</h2>
            <p><strong>Wersja aplikacji:</strong> <span id="app-version">…</span></p>
            <p>Projekt otwartoźródłowy, stworzony w celach edukacyjnych, aby pomagać uczniom w ćwiczeniu słuchu
               muzycznego. Ustawienia zapisują się w pamięci przeglądarki.</p>
            <h3>Autor</h3>
            <p><strong>Kamil Machowski</strong> – uczeń I LO im. M. Kromera w Gorlicach oraz ZPSM w Gorlicach</p>
            <h3>Licencja</h3>
            <p>Aplikacja jest objęta licencją
               <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener noreferrer">GNU GPLv3</a>.</p>
            <div class="dialog__actions">
                <a class="btn btn--dark" href="https://github.com/Emkamil/" target="_blank" rel="noopener noreferrer">
                    <svg class="btn__icon" viewBox="0 0 96 98" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" d="${GITHUB_PATH}"/></svg>
                    Przejdź na GitHub
                </a>
            </div>`);
        loadVersion(infoDialog.querySelector('#app-version'));
    }
    infoDialog.showModal();
}

// ---------------------------------------------------------------- nagłówek

/**
 * Wstawia wspólny nagłówek do <header id="site-header">.
 * @param {{ showHome?: boolean }} options - showHome: przycisk powrotu na stronę główną (strony ćwiczeń)
 */
export function mountHeader({ showHome = false, showBanner = false} = {}) {
    const host = document.getElementById('site-header');
    const home = url('');
    host.className = 'site-header';
    host.innerHTML = `
        <div class="site-header__inner">
            <a class="brand" href="${home}">
                <img class="brand__logo" src="${url('icons/icon512.png')}" alt="" width="40" height="40">
                <span class="brand__name">Wielka tercja</span>
            </a>
            <div class="toolbar">
                ${showHome ? `<a class="icon-btn" href="${home}" aria-label="Strona główna" title="Strona główna">${ICONS.home}</a>` : ''}
                <button class="icon-btn" id="theme-toggle" type="button" aria-label="Przełącz motyw" title="Przełącz motyw">
                    <span class="icon-sun">${ICONS.sun}</span><span class="icon-moon">${ICONS.moon}</span>
                </button>
                <button class="icon-btn" id="info-button" type="button" aria-label="Informacje" title="Informacje">${ICONS.info}</button>
            </div>
        </div>
        ${showBanner ? `
        <div class="legacy-banner" role="status">
            <p>Wróć do poprzedniej wersji serwisu: <a href="/wielka-tercja/old/index.html">LINK DO STAREJ WERSJI</a></p>
            <button type="button" class="legacy-banner__close" aria-label="Zamknij powiadomienie">&times;</button>
        </div>` : ''}`;

        host.querySelector('.legacy-banner__close')?.addEventListener('click', () => {
            host.querySelector('.legacy-banner').remove();
        });

    host.querySelector('#theme-toggle').addEventListener('click', () => {
        const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        storage.set('theme', next);
    });
    host.querySelector('#info-button').addEventListener('click', openInfo);
}

/** Rejestruje service worker względem położenia aplikacji (nie na sztywno '/'). */
export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(url('sw.js'), { scope: url('') }).catch((e) => console.warn('SW:', e));
    }
}
