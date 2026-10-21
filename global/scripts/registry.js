/*
 * Wielka Tercja
 *
 * global/scripts/registry.js
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

import { url } from './config.js';

let cache = null;

/** Wczytuje listę ćwiczeń z exercises/registry.json (jedno źródło prawdy o tym, jakie ćwiczenia istnieją). */
export async function loadRegistry() {
    if (!cache) {
        cache = fetch(url('exercises/registry.json'))
            .then(r => {
                if (!r.ok) throw new Error(`registry.json: HTTP ${r.status}`);
                return r.json();
            })
            .then(data => data.exercises);
        cache.catch(() => { cache = null; }); // pozwól spróbować ponownie
    }
    return cache;
}

/** Ładuje moduł z logiką ćwiczenia. */
export async function loadExerciseModule(meta) {
    const mod = await import(url(`exercises/${meta.module}`));
    return mod.default;
}
