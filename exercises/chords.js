/*
 * Wielka Tercja
 *
 * exercises/chords.js
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
 * Ćwiczenie: akordy (trójdźwięki, przewroty, D7) w trzech poziomach trudności.
 * Wzór (pattern) to odległości kolejnych dźwięków od podstawy akordu w półtonach.
 */
const chord = (id, label, title, pattern) => ({ id, label, title, pattern });

export default {
    prompt: 'Jaki to akord?',
    answers: [
        chord('+', '+', 'Trójdźwięk durowy', [0, 4, 7]),
        chord('+3', '+3', 'Trójdźwięk durowy, I przewrót', [4, 7, 12]),
        chord('+5', '+5', 'Trójdźwięk durowy, II przewrót', [7, 12, 16]),
        chord('o', 'o', 'Trójdźwięk molowy', [0, 3, 7]),
        chord('o3', 'o3', 'Trójdźwięk molowy, I przewrót', [3, 7, 12]),
        chord('o5', 'o5', 'Trójdźwięk molowy, II przewrót', [7, 12, 15]),
        chord('>', '>', 'Trójdźwięk zmniejszony', [0, 3, 6]),
        chord('>3', '>3', 'Trójdźwięk zmniejszony, I przewrót', [3, 6, 12]),
        chord('>5', '>5', 'Trójdźwięk zmniejszony, II przewrót', [6, 12, 15]),
        chord('<', '<', 'Trójdźwięk zwiększony', [0, 4, 8]),
        chord('D7', 'D7', 'Dominanta septymowa', [0, 4, 7, 10]),
        chord('D7-3', 'D7 I p.', 'Dominanta septymowa, I przewrót', [4, 7, 10, 15]),
        chord('D7-5', 'D7 II p.', 'Dominanta septymowa, II przewrót', [7, 10, 15, 19]),
        chord('D7-7', 'D7 III p.', 'Dominanta septymowa, III przewrót', [10, 15, 19, 22]),
    ],

    levels: [
        { id: 'latwy', label: 'Łatwy', answers: ['+', 'o', '>', '<'] },
        { id: 'sredni', label: 'Średni', answers: ['+', 'o', '+3', 'o3', '+5', 'o5', '>', '<', 'D7'] },
        { id: 'trudny', label: 'Trudny', answers: ['+', 'o', '+3', 'o3', '+5', 'o5', '>', '<', '>3', '>5', 'D7', 'D7-3', 'D7-5', 'D7-7'] },
    ],

    build(answer, { randInt, range }) {
        const top = answer.pattern[answer.pattern.length - 1];
        const root = randInt(range.min, range.max - top);
        return answer.pattern.map(step => root + step);
    },
};
