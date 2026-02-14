/*
* Wielka Tercja - Start Page
*
* startpage.js
*
* Copyright (c) 2025 Kamil Machowski
*
* Ten projekt jest objęty licencją CC BY-ND 4.0
*
*/

console.log("startpage.js loaded");

async function loadVersion() {
    try {
        const response = await fetch('/wielka-tercja/manifest.json');
        if (!response.ok) throw new Error('Błąd ładowania pliku');

        const data = await response.json();
        const versionElement = document.getElementById('app-version');

        if (versionElement) {
            versionElement.textContent = data.version;
        }
    } catch (error) {
        console.error('Nie udało się pobrać wersji:', error);
        const versionElement = document.getElementById('app-version');
        if (versionElement) versionElement.textContent = '1.2';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded - initializing start page");
    loadVersion();
    // ------------------------------------------------------------------
    // 1. FUNKCJONALNOŚĆ PRZEŁĄCZNIKA MOTYWÓW (JASNY/CIEMNY)
    // ------------------------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const sunIcon = themeToggle.querySelector('.sun');
    const moonIcon = themeToggle.querySelector('.moon');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        body.classList.remove('dark-mode');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
            localStorage.setItem('theme', 'dark');
        } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
            localStorage.setItem('theme', 'light');
        }
    });

    // ------------------------------------------------------------------
    // 2. FUNKCJONALNOŚĆ WYBORU TRYBU (INTERWAŁY/AKORDY)
    // ------------------------------------------------------------------
    const modeButtons = document.querySelectorAll('.mode-btn');
    const directionSelect = document.getElementById('direction-select'); // Dodany selektor
    let selectedMode = 'intervals';

    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedMode = button.getAttribute('data-mode');
            console.log(`Wybrano tryb: ${selectedMode}`);

            // Logika blokowania opcji "Melodyczny losowo"
            const melodicRandomOption = directionSelect.querySelector('option[value="melodic-random"]');

            if (selectedMode === 'chords') {
                melodicRandomOption.disabled = true;
                // Jeśli opcja była wybrana, przestawiamy na "Harmoniczny"
                if (directionSelect.value === 'melodic-random') {
                    directionSelect.value = 'harmonic';
                }
            } else {
                melodicRandomOption.disabled = false;
            }
        });
    });

    // ------------------------------------------------------------------
    // 3. FUNKCJONALNOŚĆ WYBORU CZASU TRWANIA
    // ------------------------------------------------------------------
    const durationButtons = document.querySelectorAll('.duration-btn');
    let selectedDuration = 1;

    durationButtons.forEach(button => {
        button.addEventListener('click', () => {
            durationButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedDuration = parseInt(button.getAttribute('data-duration'));
            console.log(`Wybrano czas trwania: ${selectedDuration}s`);
        });
    });

    // ------------------------------------------------------------------
    // 4. PRZEKIEROWANIE DO ĆWICZEŃ - ZAKTUALIZOWANA WERSJA
    // ------------------------------------------------------------------
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', () => {
        const instrument = document.getElementById('instrument-select').value;

        const currentTheme = localStorage.getItem('theme') || 'light';
        const selectedDirection = document.getElementById('direction-select').value;

        console.log(`Rozpoczynanie ćwiczenia: Tryb=${selectedMode}, Instrument=${instrument}, Czas=${selectedDuration}s, Motyw=${currentTheme}`);

        let baseUrl, queryString;
        switch (selectedMode) {
            case "intervals":

                baseUrl = "exercises/intervals/index.html";
                break;
            case "chords":
                baseUrl = "exercises/chords/index.html";
                break;
            default:

                baseUrl = "exercises/intervals/index.html";
        }


        queryString = `?instrument=${encodeURIComponent(instrument)}&duration=${encodeURIComponent(selectedDuration)}&theme=${encodeURIComponent(currentTheme)}&playingDirection=${encodeURIComponent(selectedDirection)}`;
        localStorage.setItem('instrument', instrument);
        localStorage.setItem('duration', selectedDuration);
        switch (selectedDirection) {
            case 'harmonic':
                localStorage.setItem('playingMode', 'harmonic');
                localStorage.setItem('playingDirection', 'up');
                break;
            case 'melodic-up':
                localStorage.setItem('playingMode', 'melodic');
                localStorage.setItem('playingDirection', 'up');
                break;
            case 'melodic-down':
                localStorage.setItem('playingMode', 'melodic');
                localStorage.setItem('playingDirection', 'down');
                break;
            case 'melodic-random':
                localStorage.setItem('playingMode', 'melodic');
                localStorage.setItem('playingDirection', 'mix-direction');
                break;
            case 'random':
                localStorage.setItem('playingMode', 'random');
                localStorage.setItem('playingDirection', 'random');
                break;

        }
        window.location.href = baseUrl + queryString;
    });
    // ------------------------------------------------------------------
    // 5. OBSŁUGA MODALA INFORMACYJNEGO
    // ------------------------------------------------------------------
    const infoModal = document.getElementById('info-modal');
    const infoButton = document.getElementById('info-button');
    const closeModalButtons = document.querySelectorAll('.close-button');

    const openModal = (modal) => {
        console.log("Opening modal:", modal.id);
        modal.classList.add('visible');
    };

    const closeModal = (modal) => {
        console.log("Closing modal:", modal.id);
        modal.classList.remove('visible');
    };

    if (infoButton && infoModal) {
        infoButton.addEventListener('click', () => {
            openModal(infoModal);
        });
    }

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal && modal.classList.contains('visible')) {
                closeModal(modal);
            }
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal') && e.target.classList.contains('visible')) {
            closeModal(e.target);
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const visibleModal = document.querySelector('.modal.visible');
            if (visibleModal) {
                closeModal(visibleModal);
            }
        }
    });

    console.log("Start page initialized successfully");
});

