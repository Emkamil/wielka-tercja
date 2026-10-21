/*
 * Wielka Tercja
 *
 * global/scripts/storage.js
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

/** Bezpieczny dostęp do localStorage (w trybie prywatnym lub przy zablokowanych danych może rzucać wyjątki). */

export const storage = {
    get(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : value;
        } catch { return fallback; }
    },
    set(key, value) {
        try { localStorage.setItem(key, String(value)); } catch { /* ignoruj */ }
    },
    getJSON(key, fallback = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw === null ? fallback : JSON.parse(raw);
        } catch { return fallback; }
    },
    setJSON(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignoruj */ }
    },
};
