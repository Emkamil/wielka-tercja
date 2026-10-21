/*
 * Wielka Tercja
 *
 * global/scripts/settings.js
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

import { storage } from './storage.js';
import { INSTRUMENTS, DURATIONS, PLAY_STYLES } from './config.js';

/**
 * Ustawienia użytkownika wspólne dla wszystkich ćwiczeń.
 * Klucze localStorage zostały takie same jak we wcześniejszych wersjach ('instrument', 'duration', 'theme').
 */
export function getSettings() {
    const instrument = storage.get('instrument', INSTRUMENTS[0].id);
    const duration = Number(storage.get('duration', DURATIONS[DURATIONS.length - 1]));
    const playStyle = storage.get('playStyle', 'harmonic');
    return {
        instrument: INSTRUMENTS.some(i => i.id === instrument) ? instrument : INSTRUMENTS[0].id,
        duration: DURATIONS.includes(duration) ? duration : DURATIONS[0],
        playStyle: playStyle in PLAY_STYLES ? playStyle : 'harmonic',
    };
}

export function saveSetting(key, value) {
    storage.set(key, value);
}

/** Zwraca styl grania dozwolony dla ćwiczenia (lub null, gdy ćwiczenie nie ma wariantów). */
export function resolvePlayStyle(playModes, wanted) {
    if (!playModes || playModes.length === 0) return null;
    return playModes.includes(wanted) ? wanted : playModes[0];
}
