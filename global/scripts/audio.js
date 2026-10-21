/*
 * Wielka Tercja
 *
 * global/scripts/audio.js
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

/**
 * Odtwarzanie dźwięków: jeden AudioContext, cache zdekodowanych próbek
 * (powtórzenie pytania nie pobiera plików drugi raz) i możliwość ucięcia poprzedniego dźwięku.
 */
export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.buffers = new Map();   // url -> Promise<AudioBuffer>
        this.active = new Set();    // aktualnie grające źródła { source, gain }
    }

    #context() {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        return this.ctx;
    }

    noteUrl(instrument, duration, note) {
        return url(`sounds/${instrument}/${duration}s/${note}.mp3`);
    }

    #load(src) {
        if (!this.buffers.has(src)) {
            const promise = fetch(src)
                .then(r => {
                    if (!r.ok) throw new Error(`HTTP ${r.status} dla ${src}`);
                    return r.arrayBuffer();
                })
                .then(data => this.#context().decodeAudioData(data));
            promise.catch(() => this.buffers.delete(src)); // nie zapamiętuj błędu
            this.buffers.set(src, promise);
        }
        return this.buffers.get(src);
    }

    /** Płynnie ucina wszystko, co jeszcze gra (np. przy przejściu do kolejnego pytania). */
    stopAll() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        for (const { source, gain } of this.active) {
            try {
                gain.gain.cancelScheduledValues(now);
                gain.gain.setValueAtTime(gain.gain.value, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.06);
                source.stop(now + 0.07);
            } catch { /* źródło mogło już się zakończyć */ }
        }
        this.active.clear();
    }

    /**
     * @param {number[]} notes - numery dźwięków w kolejności odtwarzania
     * @param {{instrument: string, duration: number, harmonic: boolean, gap?: number}} opts
     *        gap - odstęp między dźwiękami przy grze melodycznej (domyślnie = duration)
     * @returns {Promise<number>} czas trwania całości w sekundach
     */
    async play(notes, { instrument, duration, harmonic, gap }) {
        const ctx = this.#context();
        const buffers = await Promise.all(notes.map(n => this.#load(this.noteUrl(instrument, duration, n))));
        if (ctx.state === 'suspended') await ctx.resume();

        this.stopAll();
        const step = harmonic ? 0 : (gap ?? duration);
        const start = ctx.currentTime + 0.03;

        buffers.forEach((buffer, i) => {
            const source = ctx.createBufferSource();
            const gain = ctx.createGain();
            source.buffer = buffer;
            source.connect(gain).connect(ctx.destination);
            const entry = { source, gain };
            this.active.add(entry);
            source.onended = () => this.active.delete(entry);
            source.start(start + i * step);
        });
        return step * (notes.length - 1) + Math.min(...buffers.map(b => b.duration));
    }
}
