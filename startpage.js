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

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded - initializing start page");

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
    let selectedMode = 'intervals';

    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedMode = button.getAttribute('data-mode');
            console.log(`Wybrano tryb: ${selectedMode}`);
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

        // 1. POBIERZ AKTUALNY MOTYW
        // Motyw jest przechowywany w localStorage (domyślnie 'light', jeśli nic nie ma)
        const currentTheme = localStorage.getItem('theme') || 'light'; 
        // SPOSOB GRY
        const selectedDirection = document.getElementById('direction-select').value;

        console.log(`Rozpoczynanie ćwiczenia: Tryb=${selectedMode}, Instrument=${instrument}, Czas=${selectedDuration}s, Motyw=${currentTheme}`);

        let baseUrl, queryString;
        switch (selectedMode) {
            case "intervals":
                // Użyj poprawnej ścieżki (zgodnie z poprzednimi ustaleniami)
                baseUrl = "wielka-tercja/exercises/intervals/index.html"; 
                break;
            case "chords":
                baseUrl = "wielka-tercja/exercises/chords/index.html";
                break;
            default:
                // Użyj poprawnej ścieżki (zgodnie z poprzednimi ustaleniami)
                baseUrl = "wielka-tercja/exercises/intervals/index.html"; 
        }
        
        // 2. DODAJ MOTYW DO CIĄGU ZAPYTAŃ
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

    // Funkcja otwierająca modal
    const openModal = (modal) => {
        console.log("Opening modal:", modal.id);
        modal.classList.add('visible');
    };

    // Funkcja zamykająca modal
    const closeModal = (modal) => {
        console.log("Closing modal:", modal.id);
        modal.classList.remove('visible');
    };

    // Kliknięcie przycisku info otwiera modal
    if (infoButton && infoModal) {
        infoButton.addEventListener('click', () => {
            openModal(infoModal);
        });
    }

    // Kliknięcie przycisku zamykania (x)
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal && modal.classList.contains('visible')) {
                closeModal(modal);
            }
        });
    });

    // Kliknięcie poza modalem zamyka go
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal') && e.target.classList.contains('visible')) {
            closeModal(e.target);
        }
    });

    // ESC zamyka modal
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
