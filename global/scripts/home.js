/*
 * Wielka Tercja
 *
 * global/scripts/home.js
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

import { url, INSTRUMENTS, DURATIONS, PLAY_STYLES } from './config.js';
import { getSettings, saveSetting, resolvePlayStyle } from './settings.js';
import { loadRegistry } from './registry.js';
import { storage } from './storage.js';
import { mountHeader, registerServiceWorker } from './ui.js';

const $ = (selector) => document.querySelector(selector);

let exercises = [];
let selectedId = null;

function renderExercises() {
    const list = $('#exercise-list');
    list.innerHTML = '';
    exercises.forEach((ex) => {
        const label = document.createElement('label');
        label.className = 'exercise-card';
        if (ex.color) label.style.setProperty('--c', ex.color);
        label.innerHTML = `
            <input class="exercise-card__input" type="radio" name="exercise" value="${ex.id}">
            <span class="exercise-card__icon"><svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0" aria-hidden="true">${ex.icon}</svg></span>
            <span class="exercise-card__text">
                <span class="exercise-card__title"></span>
                <span class="exercise-card__desc"></span>
            </span>`;
        label.querySelector('.exercise-card__title').textContent = ex.title;
        label.querySelector('.exercise-card__desc').textContent = ex.description;
        label.querySelector('input').addEventListener('change', () => selectExercise(ex.id));
        list.appendChild(label);
    });
}

function renderInstrument(settings) {
    const select = $('#instrument-select');
    select.innerHTML = INSTRUMENTS.map(i => `<option value="${i.id}">${i.label}</option>`).join('');
    select.value = settings.instrument;
    select.addEventListener('change', () => saveSetting('instrument', select.value));
    // jeden instrument = nie ma z czego wybierać
    $('#instrument-field').hidden = INSTRUMENTS.length < 2;
}

function renderDurations(settings) {
    const group = $('#duration-group');
    group.innerHTML = DURATIONS.map(d => `
        <label class="segmented__item">
            <input type="radio" name="duration" value="${d}" ${d === settings.duration ? 'checked' : ''}>
            <span>${d} s</span>
        </label>`).join('');
    group.addEventListener('change', (e) => saveSetting('duration', e.target.value));
}

/** Lista sposobów gry zależy od wybranego ćwiczenia (np. gamy nie mają wersji harmonicznej). */
function renderPlayStyles() {
    const exercise = exercises.find(e => e.id === selectedId);
    const field = $('#style-field');
    const modes = exercise.playModes || [];
    field.hidden = modes.length === 0;
    if (modes.length === 0) return;

    const select = $('#style-select');
    const current = resolvePlayStyle(modes, getSettings().playStyle);
    select.innerHTML = modes.map(m => `<option value="${m}">${PLAY_STYLES[m].icon} ${PLAY_STYLES[m].label}</option>`).join('');
    select.value = current;
    saveSetting('playStyle', current);
}

function selectExercise(id) {
    selectedId = id;
    storage.set('lastExercise', id);
    const exercise = exercises.find(e => e.id === id);
    $('#exercise-list').querySelector(`input[value="${id}"]`).checked = true;
    $('#start-button').href = url(`exercise.html?type=${encodeURIComponent(id)}`);
    $('#start-button').setAttribute('aria-label', `Rozpocznij ćwiczenie: ${exercise.title}`);
    // przycisk startu przyjmuje kolor wybranego ćwiczenia
    if (exercise.color) document.documentElement.style.setProperty('--accent', exercise.color);
    renderPlayStyles();
}

async function init() {
    mountHeader({ showBanner: true });
    registerServiceWorker();

    try {
        exercises = await loadRegistry();
    } catch (error) {
        console.error(error);
        $('#exercise-list').innerHTML = '<p class="notice">Nie udało się wczytać listy ćwiczeń. Sprawdź połączenie i odśwież stronę.</p>';
        $('#start-button').hidden = true;
        return;
    }

    const settings = getSettings();
    renderExercises();
    renderInstrument(settings);
    renderDurations(settings);
    $('#style-select').addEventListener('change', (e) => saveSetting('playStyle', e.target.value));

    const last = storage.get('lastExercise');
    selectExercise(exercises.some(e => e.id === last) ? last : exercises[0].id);
}

init();
