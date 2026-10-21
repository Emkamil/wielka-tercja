/*
 * Wielka Tercja
 *
 * exercises/intervals.js
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
 * Ćwiczenie: interwały.
 * Opis formatu definicji ćwiczenia: exercises/README.md
 */
const interval = (id, label, title, semitones, enabled = true) => ({ id, label, title, semitones, enabled });

export default {
    prompt: 'Jaki to interwał?',
    answers: [
        interval('pryma-czysta', '1', 'Pryma czysta', 0, false),
        interval('sekunda-mala', '2>', 'Sekunda mała', 1),
        interval('sekunda-wielka', '2', 'Sekunda wielka', 2),
        interval('tercja-mala', '3>', 'Tercja mała', 3),
        interval('tercja-wielka', '3', 'Tercja wielka', 4),
        interval('kwarta-czysta', '4', 'Kwarta czysta', 5),
        interval('tryton', '4< / 5>', 'Tryton (kwarta zwiększona / kwinta zmniejszona)', 6),
        interval('kwinta-czysta', '5', 'Kwinta czysta', 7),
        interval('seksta-mala', '6>', 'Seksta mała', 8),
        interval('seksta-wielka', '6', 'Seksta wielka', 9),
        interval('septyma-mala', '7', 'Septyma mała', 10),
        interval('septyma-wielka', '7<', 'Septyma wielka', 11),
        interval('oktawa-czysta', '8', 'Oktawa czysta', 12),
    ],

    /** Dolny dźwięk losowo, tak by górny mieścił się w zakresie dostępnych nagrań. */
    build(answer, { randInt, range }) {
        const low = randInt(range.min, range.max - answer.semitones);
        return [low, low + answer.semitones];
    },
};
