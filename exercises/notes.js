/*
 * Wielka Tercja
 *
 * exercises/notes.js
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

/**
 * Ćwiczenie: nazwy dźwięków (bez względu na oktawę).
 * Nagrania zaczynają się od C (numer 1), więc klasa wysokości = (numer - 1) % 12.
 * Nazewnictwo polskie: B = b-flat, H = b-natural.
 */
const note = (id, label, title, pitchClass) => ({ id, label, title, pitchClass });

export default {
    prompt: 'Jaki to dźwięk?',
    answers: [
        note('c', 'C', 'C', 0),
        note('cis', 'Cis', 'Cis / Des', 1),
        note('d', 'D', 'D', 2),
        note('dis', 'Dis', 'Dis / Es', 3),
        note('e', 'E', 'E', 4),
        note('f', 'F', 'F', 5),
        note('fis', 'Fis', 'Fis / Ges', 6),
        note('g', 'G', 'G', 7),
        note('gis', 'Gis', 'Gis / As', 8),
        note('a', 'A', 'A', 9),
        note('b', 'B', 'B (Ais)', 10),
        note('h', 'H', 'H', 11),
    ],

    levels: [
        { id: 'bialy', label: 'Tylko białe klawisze', answers: ['c', 'd', 'e', 'f', 'g', 'a', 'h'] },
        { id: 'wszystkie', label: 'Wszystkie dźwięki', answers: ['c', 'cis', 'd', 'dis', 'e', 'f', 'fis', 'g', 'gis', 'a', 'b', 'h'] },
    ],

    /** Losuje oktawę spośród tych, w których dźwięk jest dostępny. */
    build(answer, { randInt, range }) {
        const candidates = [];
        for (let n = range.min; n <= range.max; n++) {
            if ((n - range.min) % 12 === answer.pitchClass) candidates.push(n);
        }
        return [candidates[randInt(0, candidates.length - 1)]];
    },
};
