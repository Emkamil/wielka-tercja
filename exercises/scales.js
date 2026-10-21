/*
 * Wielka Tercja
 *
 * exercises/scales.js
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
 * Ćwiczenie: gamy. Wzór to numery półtonów kolejnych stopni od toniki (8 dźwięków, z oktawą).
 * Gamy gra się melodycznie - w górę lub w dół (patrz playModes w registry.json).
 */
const scale = (id, label, title, pattern) => ({ id, label, title, pattern });

export default {
    prompt: 'Jaka to gama?',
    /** Odstęp między dźwiękami gamy w sekundach (domyślnie = długość dźwięku). */
    melodicGap: 0.5,

    answers: [
        scale('dur', 'Dur', 'Gama durowa', [0, 2, 4, 5, 7, 9, 11, 12]),
        scale('moll-naturalny', 'Moll eolska', 'Gama molowa naturalna', [0, 2, 3, 5, 7, 8, 10, 12]),
        scale('moll-harmoniczny', 'Moll harm.', 'Gama molowa harmoniczna', [0, 2, 3, 5, 7, 8, 11, 12]),
        scale('dorycka', 'Dorycka', 'Skala dorycka', [0, 2, 3, 5, 7, 9, 10, 12]),
        scale('frygijska', 'Frygijska', 'Skala frygijska', [0, 1, 3, 5, 7, 8, 10, 12]),
        scale('lidyjska', 'Lidyjska', 'Skala lidyjska', [0, 2, 4, 6, 7, 9, 11, 12]),
        scale('miksolidyjska', 'Miksolidyjska', 'Skala miksolidyjska', [0, 2, 4, 5, 7, 9, 10, 12]),
        //scale('lokrycka', 'Lokrycka', 'Skala lokrycka', [0, 1, 3, 5, 6, 8, 10, 12]),
    ],

    levels: [
        { id: 'podstawowy', label: 'Dur i moll', answers: ['dur', 'moll-naturalny', 'moll-harmoniczny'] },
        { id: 'rozszerzony', label: '+Modalne', answers: ['dur', 'dorycka', 'frygijska', 'lidyjska', 'miksolidyjska', 'moll-naturalny', 'moll-harmoniczny'] },
    ],

    build(answer, { randInt, range }) {
        const root = randInt(range.min, range.max - 12);
        return answer.pattern.map(step => root + step);
    },
};
