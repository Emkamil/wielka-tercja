/*
* app.js
*
* Copyright (c) 2025 Kamil Machowski
*
* Ten projekt jest objęty licencją  CC BY-ND 4.0
*
*/
const scoreReset = () => {
    const correctCount = document.querySelector('#correct-count');
    correctCount.textContent = '0'
    const wrongCount = document.querySelector('#wrong-count');
    wrongCount.textContent = '0'
};

document.addEventListener('DOMContentLoaded', () => {
    const initialSettingsModal = document.getElementById('initial-settings-modal');
    const acceptButton = document.getElementById('accept-settings-button');

    const instrumentSelect = document.getElementById('initial-instrument');
    const playingModeSelect = document.getElementById('initial-playing-mode');
    const themeSelect = document.getElementById('initial-theme');
    
    // sprawdzanie i ładowania ustawień
    function loadSettings() {
        const savedInstrument = localStorage.getItem('instrument');
        const savedPlayingMode = localStorage.getItem('playingMode');
        const savedTheme = localStorage.getItem('theme');
        
        if (!savedInstrument || !savedPlayingMode || !savedTheme) {
            // wymaganie zgody jeśli nie ma ustawień
            initialSettingsModal.classList.add('visible');
        } else {
            // załaduj zapisane ustawienia
            
            console.log("Ustawienia załadowane z pamięci: ", savedInstrument, savedPlayingMode, savedTheme);
            document.body.classList.add(savedTheme);
        }
    }

    // Funkcja do zapisywania ustawień i zamykania modala
    function saveAndCloseModal() {
        const selectedInstrument = instrumentSelect.value;
        const selectedPlayingMode = playingModeSelect.value;
        const selectedTheme = themeSelect.value;

        // Zapisz ustawienia w localStorage
        localStorage.setItem('instrument', selectedInstrument);
        localStorage.setItem('playingMode', selectedPlayingMode);
        localStorage.setItem('theme', selectedTheme);
        
        // Zastosuj motyw od razu
        document.body.classList.add(selectedTheme);
        
        // Zamknij modal
        initialSettingsModal.classList.remove('visible');
        
        console.log("Ustawienia zostały zapisane.");
    }

    // Uruchomienie ładowania ustawień
    loadSettings();

    // Dodanie nasłuchiwania na przycisk akceptacji
    acceptButton.addEventListener('click', saveAndCloseModal);
});

const menuButtons = document.querySelectorAll('.menu-button');
const modeSections = document.querySelectorAll('.mode-section');

// obiekt do przechowywania stanu aktywności każdego interwału
const intervalStates = {};

menuButtons.forEach(button => {
    button.addEventListener('click', () => {
        menuButtons.forEach(btn => {
            btn.classList.remove('active', 'inactive', 'start_color');
        });
        button.classList.add('active');
        menuButtons.forEach(btn => {
            if (!btn.classList.contains('active')) {
                btn.classList.add('inactive');
            }
        });
        
        // przełączanie sekcji
        const mode = button.dataset.mode;
        modeSections.forEach(section => {
            section.classList.remove('active-mode');
            if (section.id === mode) {
                section.classList.add('active-mode');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------
    // Logika przełączania motywu
    // ----------------------

    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // czy motyw jest zapisany w pamięci podręcznej przeglądarki
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-theme');

        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });


    const toggleCheckboxes = document.querySelectorAll('.toggle-checkbox');
    const intervalButtons = document.querySelectorAll('.option-button');

    toggleCheckboxes.forEach(checkbox => {
        const intervalName = checkbox.dataset.interval;
        intervalStates[intervalName] = checkbox.checked;

        // ustawienie początkowego stanu przycisku
        const associatedButton = document.querySelector(`.option-button[data-interval="${intervalName}"]`);
        if (associatedButton) {
            associatedButton.disabled = !intervalStates[intervalName];
        }
    });

    toggleCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const intervalName = event.target.dataset.interval;
            intervalStates[intervalName] = event.target.checked;
            
            // zmiana stanu przycisku po kliknięciu
            const associatedButton = document.querySelector(`.option-button[data-interval="${intervalName}"]`);
            if (associatedButton) {
                associatedButton.disabled = !intervalStates[intervalName];
            }
        });
    });
});



const intervalButton = document.getElementById('interval-mode');
    const chordButton = document.getElementById('chords-mode');

    chordButton.addEventListener('click', () => {
        scoreReset();
    });

    intervalButton.addEventListener('click', () => {
        scoreReset();
    });

document.addEventListener('DOMContentLoaded', () => {
    const settingsButton = document.getElementById('settings-button');
    const infoButton = document.getElementById('info-button');
    const settingsModal = document.getElementById('settings-modal');
    const infoModal = document.getElementById('info-modal');

    function openModal(modal) {
        modal.classList.add('visible');
    }

    function closeModal(modal) {
        modal.classList.remove('visible');
    }

    settingsButton.addEventListener('click', () => {
        openModal(settingsModal);
    });

    infoButton.addEventListener('click', () => {
        openModal(infoModal);
    });

    const closeButtons = document.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            closeModal(e.target.closest('.modal'));
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal') && e.target.id !== 'initial-settings-modal') {
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
});