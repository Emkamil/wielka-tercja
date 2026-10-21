/*
 * Wielka Tercja
 *
 * global/scripts/exercise.js
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

import { url, NOTE_RANGE, PLAY_STYLES } from './config.js';
import { getSettings, resolvePlayStyle } from './settings.js';
import { loadRegistry, loadExerciseModule } from './registry.js';
import { storage } from './storage.js';
import { AudioEngine } from './audio.js';
import { mountHeader, registerServiceWorker, showAlert, ICONS } from './ui.js';

const FEEDBACK_DELAY = { correct: 1000, wrong: 2000, skip: 1000 }; // ms do kolejnego pytania

const $ = (selector) => document.querySelector(selector);
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function shuffle(array) {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
        const j = randInt(0, i);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/** Kolejność dźwięków przy odtwarzaniu zależy od wybranego sposobu gry. */
function orderNotes(notes, playStyle) {
    const ascending = [...notes].sort((a, b) => a - b);
    if (playStyle === 'melodic-down') return ascending.reverse();
    if (playStyle === 'melodic-random') return shuffle(ascending);
    return ascending;
}

// ------------------------------------------------------------------ strona ćwiczenia

class ExercisePage {
    constructor(meta, definition) {
        this.meta = meta;
        this.def = definition;
        this.audio = new AudioEngine();
        this.settings = getSettings();
        this.playStyle = resolvePlayStyle(meta.playModes, this.settings.playStyle);

        this.phase = 'idle';          // idle | loading | asking | feedback
        this.current = null;          // { answer, order }
        this.lastAnswerId = null;
        this.score = { correct: 0, wrong: 0 };
        this.turn = 0;                // unieważnia spóźnione wyniki async po restarcie
        this.timer = null;

        this.levelId = this.#initialLevel();
        this.#render();
        this.#bind();
        this.#renderAnswers();
        this.#setPhase('idle');
    }

    // ---------------------------------------------------------- dane

    #initialLevel() {
        if (!this.def.levels) return null;
        const saved = storage.get(`level:${this.meta.id}`);
        return this.def.levels.some(l => l.id === saved) ? saved : this.def.levels[0].id;
    }

    /** Odpowiedzi widoczne na tym poziomie, w kolejności zdefiniowanej przez poziom. */
    get visibleAnswers() {
        if (!this.levelId) return this.def.answers;
        const level = this.def.levels.find(l => l.id === this.levelId);
        return level.answers.map(id => this.def.answers.find(a => a.id === id));
    }

    get enabledKey() { return `enabled:${this.meta.id}:${this.levelId || 'all'}`; }

    #loadEnabled() {
        const saved = storage.getJSON(this.enabledKey);
        const ids = this.visibleAnswers.map(a => a.id);
        if (Array.isArray(saved)) return new Set(saved.filter(id => ids.includes(id)));
        return new Set(this.visibleAnswers.filter(a => a.enabled !== false).map(a => a.id));
    }

    // ---------------------------------------------------------- widok

    #render() {
        document.title = `Wielka Tercja – ${this.meta.title}`;
        if (this.meta.color) document.documentElement.style.setProperty('--accent', this.meta.color);
        const hasLevels = Boolean(this.def.levels);
        const style = this.playStyle ? PLAY_STYLES[this.playStyle].label.toLowerCase() : null;
        const summary = [this.settings.instrument === 'piano' ? 'fortepian' : this.settings.instrument, style, `${this.settings.duration} s`]
            .filter(Boolean).join(', ');

        $('#app').innerHTML = `
        <div class="ex">
            <div class="ex__side">
                <section class="ex__intro">
                    <h1 class="ex__title"></h1>
                    <p class="ex__summary">Ustawienia: ${summary}. <a href="${url('')}">Zmień</a></p>
                    ${hasLevels ? `
                    <div class="field">
                        <label for="level-select">Poziom</label>
                        <select id="level-select">
                            ${this.def.levels.map(l => `<option value="${l.id}">${l.label}</option>`).join('')}
                        </select>
                    </div>` : ''}
                </section>
                <section class="ex__dock" aria-label="Sterowanie">
                    <p class="feedback" id="feedback" role="status" aria-live="polite"></p>
                    <div class="controls">
                        <button class="btn btn--primary" id="start-button" type="button" aria-keyshortcuts="S">Start</button>
                        <button class="btn btn--secondary" id="next-button" type="button" aria-keyshortcuts="N">Następny</button>
                        <button class="btn btn--secondary" id="repeat-button" type="button" aria-keyshortcuts="R">Powtórz</button>
                    </div>
                    <div class="score" aria-label="Wynik">
                        <span class="score__item score__item--correct" title="Poprawne"><span class="score__icon">${ICONS.check}</span><output id="correct-count">0</output></span>
                        <span class="score__item score__item--wrong" title="Błędne"><span class="score__icon">${ICONS.ban}</span><output id="wrong-count">0</output></span>
                    </div>
                </section>
            </div>
            <section class="ex__answers">
                <div class="answers" id="answers" role="group" aria-label="Możliwe odpowiedzi"></div>
                <p class="ex__hint">Znacznik obok odpowiedzi włącza ją lub wyłącza z losowania.</p>
            </section>
        </div>`;
        $('.ex__title').textContent = this.meta.title;
        if (hasLevels) $('#level-select').value = this.levelId;
    }

    #renderAnswers() {
        const enabled = this.#loadEnabled();
        const host = $('#answers');
        host.innerHTML = '';
        this.visibleAnswers.forEach((answer) => {
            const item = document.createElement('div');
            item.className = 'answer';
            item.dataset.id = answer.id;
            item.dataset.enabled = enabled.has(answer.id);
            item.dataset.long = answer.label.length > 9;
            item.innerHTML = `
                <label class="answer__toggle">
                    <input type="checkbox" class="answer__check" ${enabled.has(answer.id) ? 'checked' : ''}>
                    <span class="answer__mark"><span class="answer__on">${ICONS.check}</span><span class="answer__off">${ICONS.ban}</span></span>
                </label>
                <button class="answer__btn" type="button"><span class="answer__label"></span></button>`;
            item.querySelector('.answer__label').textContent = answer.label;
            item.querySelector('.answer__btn').title = answer.title;
            item.querySelector('.answer__btn').disabled = !enabled.has(answer.id);
            item.querySelector('.answer__check').setAttribute('aria-label', `Losuj: ${answer.title}`);
            item.querySelector('.answer__btn').setAttribute('aria-label', answer.title);
            host.appendChild(item);
        });
    }

    #answerEl(id) { return $(`.answer[data-id="${CSS.escape(id)}"]`); }

    #setFeedback(text, kind = '') {
        const el = $('#feedback');
        el.textContent = text;
        el.dataset.kind = kind;
    }

    #setPhase(phase) {
        this.phase = phase;
        const started = phase !== 'idle';
        $('#next-button').disabled = !started;
        $('#repeat-button').disabled = !started;
        $('#answers').dataset.locked = (phase === 'loading' || phase === 'feedback');
        if (phase === 'idle') this.#setFeedback('Naciśnij START, aby zagrać pierwsze pytanie.');
        if (phase === 'loading') this.#setFeedback('Wczytywanie dźwięku…');
        if (phase === 'asking') this.#setFeedback(this.def.prompt || 'Co słyszysz?');
    }

    #updateScore() {
        $('#correct-count').textContent = this.score.correct;
        $('#wrong-count').textContent = this.score.wrong;
    }

    #clearMarks() {
        document.querySelectorAll('.answer__btn.correct, .answer__btn.wrong')
            .forEach(b => b.classList.remove('correct', 'wrong'));
    }

    // ---------------------------------------------------------- zdarzenia

    #bind() {
        $('#start-button').addEventListener('click', () => this.start());
        $('#next-button').addEventListener('click', () => this.skip());
        $('#repeat-button').addEventListener('click', () => this.repeat());

        $('#answers').addEventListener('click', (e) => {
            const btn = e.target.closest('.answer__btn');
            if (btn) this.answer(btn.closest('.answer').dataset.id);
        });
        $('#answers').addEventListener('change', (e) => {
            if (!e.target.matches('.answer__check')) return;
            const item = e.target.closest('.answer');
            item.dataset.enabled = e.target.checked;
            item.querySelector('.answer__btn').disabled = !e.target.checked;
            const enabled = [...document.querySelectorAll('.answer__check:checked')].map(c => c.closest('.answer').dataset.id);
            storage.setJSON(this.enabledKey, enabled);
        });

        const level = $('#level-select');
        if (level) level.addEventListener('change', () => this.changeLevel(level.value));

        // skróty klawiszowe (komputer): S - start, N - następny, R - powtórz
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey || e.altKey || e.target.closest('input, select, textarea, dialog')) return;
            const key = e.key.toLowerCase();
            if (key === 's') this.start();
            else if (key === 'n' && this.phase !== 'idle') this.skip();
            else if (key === 'r' && this.phase !== 'idle') this.repeat();
        });
    }

    // ---------------------------------------------------------- przebieg ćwiczenia

    /** Wybiera kolejne pytanie: losowa włączona odpowiedź, inna niż poprzednia. */
    #pickQuestion() {
        const enabled = new Set([...document.querySelectorAll('.answer__check:checked')].map(c => c.closest('.answer').dataset.id));
        const pool = this.visibleAnswers.filter(a => enabled.has(a.id));
        if (pool.length < 2) return null;
        const candidates = pool.filter(a => a.id !== this.lastAnswerId);
        const answer = candidates[randInt(0, candidates.length - 1)];
        const notes = this.def.build(answer, { randInt, range: NOTE_RANGE, settings: this.settings });
        return { answer, order: orderNotes(notes, this.playStyle) };
    }

    #play(order) {
        return this.audio.play(order, {
            instrument: this.settings.instrument,
            duration: this.settings.duration,
            harmonic: this.playStyle === null || this.playStyle === 'harmonic',
            gap: this.def.melodicGap,
        });
    }

    async #askNext() {
        clearTimeout(this.timer);
        const turn = ++this.turn;
        this.#clearMarks();

        const question = this.#pickQuestion();
        if (!question) {
            this.current = null;
            this.#setPhase('idle');
            showAlert('Włącz co najmniej dwie odpowiedzi (znacznik obok nich), aby można było wylosować pytanie.');
            return;
        }
        this.#setPhase('loading');
        try {
            await this.#play(question.order);
        } catch (error) {
            console.error(error);
            if (turn !== this.turn) return;
            this.current = null;
            this.#setPhase('idle');
            showAlert('Nie udało się wczytać dźwięków. Sprawdź połączenie z internetem i spróbuj ponownie.');
            return;
        }
        if (turn !== this.turn) return;
        this.current = question;
        this.lastAnswerId = question.answer.id;
        this.#setPhase('asking');
    }

    start() {
        this.score = { correct: 0, wrong: 0 };
        this.#updateScore();
        this.lastAnswerId = null;
        this.#askNext();
    }

    answer(id) {
        if (this.phase === 'idle') { this.#setFeedback('Najpierw naciśnij START.'); return; }
        if (this.phase !== 'asking') return;

        const correct = id === this.current.answer.id;
        const title = this.current.answer.title;
        this.#answerEl(id).querySelector('.answer__btn').classList.add(correct ? 'correct' : 'wrong');
        if (correct) {
            this.score.correct++;
            this.#setFeedback(`Dobrze! ${title}`, 'correct');
        } else {
            this.score.wrong++;
            this.#answerEl(this.current.answer.id)?.querySelector('.answer__btn').classList.add('correct');
            this.#setFeedback(`To było: ${title}`, 'wrong');
        }
        this.#updateScore();
        this.#afterFeedback(correct ? FEEDBACK_DELAY.correct : FEEDBACK_DELAY.wrong);
    }

    /** NASTĘPNY: odpowiedź liczona jako błędna, pokazuje poprawną i przechodzi dalej. */
    skip() {
        if (this.phase !== 'asking') return;
        const { answer } = this.current;
        this.score.wrong++;
        this.#updateScore();
        this.#answerEl(answer.id)?.querySelector('.answer__btn').classList.add('correct');
        this.#setFeedback(`Pominięto. To było: ${answer.title}`, 'wrong');
        this.#afterFeedback(FEEDBACK_DELAY.skip);
    }

    #afterFeedback(delay) {
        this.#setPhase('feedback'); // ta faza nie nadpisuje komunikatu o wyniku
        this.timer = setTimeout(() => this.#askNext(), delay);
    }

    async repeat() {
        if (!this.current) return;
        try {
            await this.#play(this.current.order);
        } catch (error) {
            console.error(error);
            showAlert('Nie udało się wczytać dźwięków. Sprawdź połączenie z internetem i spróbuj ponownie.');
        }
    }

    changeLevel(levelId) {
        clearTimeout(this.timer);
        this.turn++;
        this.audio.stopAll();
        this.levelId = levelId;
        storage.set(`level:${this.meta.id}`, levelId);
        this.current = null;
        this.lastAnswerId = null;
        this.score = { correct: 0, wrong: 0 };
        this.#updateScore();
        this.#renderAnswers();
        this.#setPhase('idle');
    }
}

// ------------------------------------------------------------------ start

async function init() {
    mountHeader({ showHome: true });
    registerServiceWorker();

    const type = new URLSearchParams(location.search).get('type');
    try {
        const exercises = await loadRegistry();
        const meta = exercises.find(e => e.id === type);
        if (!meta) throw new Error(`Nieznane ćwiczenie: ${type}`);
        new ExercisePage(meta, await loadExerciseModule(meta));
    } catch (error) {
        console.error(error);
        $('#app').innerHTML = `
            <div class="notice notice--page">
                <h1>Nie znaleziono ćwiczenia</h1>
                <p>Wybierz ćwiczenie ze strony głównej.</p>
                <a class="btn btn--primary" href="${url('')}">Wróć na stronę główną</a>
            </div>`;
    }
}

init();
