/*
* Wielka Tercja - Start Page
*
* app2.js
*
* Copyright (c) 2025 Kamil Machowski
*
* Ten projekt jest objęty licencją CC BY-ND 4.0
*
*/

console.log("app2.js loaded");

// Global state management
window.appState = {
    currentMode: 'interwaly',
    isInitialized: false,
    intervalStates: {},
    isFirstRun: false
};

// Custom alert function
window.showCustomAlert = function(message) {
    console.log("Showing custom alert:", message);
    const modal = document.getElementById('custom-alert-modal');
    const modalMessage = document.getElementById('custom-alert-message');
    const okButton = document.getElementById('custom-alert-ok-button');

    if (!modal || !modalMessage || !okButton) {
        console.error("Custom alert elements not found");
        return;
    }

    modalMessage.textContent = message;
    modal.style.display = 'flex';

    const hideModal = () => {
        console.log("Hiding custom alert");
        modal.style.display = 'none';
        modal.removeEventListener('click', hideOnOutsideClick);
        okButton.removeEventListener('click', hideModal);
    };

    const hideOnOutsideClick = (event) => {
        if (event.target === modal) {
            hideModal();
        }
    };

    okButton.addEventListener('click', hideModal);
    modal.addEventListener('click', hideOnOutsideClick);
};

// Score management
const scoreReset = () => {
    console.log("Resetting score");
    const correctCount = document.querySelector('#correct-count');
    const wrongCount = document.querySelector('#wrong-count');
    if (correctCount) correctCount.textContent = '0';
    if (wrongCount) wrongCount.textContent = '0';
};

// Theme management
const toggleTheme = (theme) => {
    console.log(`Changing theme to: ${theme}`);
    document.body.className = theme;
    localStorage.setItem('theme', theme);
    
    // Update theme selector in settings
    const themeSelector = document.getElementById('initial-theme');
    if (themeSelector) {
        themeSelector.value = theme;
    }
};

// Modal management
const openModal = (modal) => {
    console.log("Opening modal:", modal.id);
    modal.classList.add('visible');
};

const closeModal = (modal) => {
    console.log("Closing modal:", modal.id);
    modal.classList.remove('visible');
};

// Check if this is first run
const checkFirstRun = () => {
    const hasSettings = localStorage.getItem('theme') && 
                       localStorage.getItem('playingMode') && 
                       localStorage.getItem('playingDirection')&&
                       localStorage.getItem('instrument');
    
    window.appState.isFirstRun = !hasSettings;
    console.log("First run check:", window.appState.isFirstRun);
    
    return window.appState.isFirstRun;
};

// Initialize interval states
const initializeIntervalStates = () => {
    console.log("Initializing interval states");
    const toggleCheckboxes = document.querySelectorAll('.toggle-checkbox');
    
    toggleCheckboxes.forEach(checkbox => {
        const intervalName = checkbox.dataset.option;
        window.appState.intervalStates[intervalName] = checkbox.checked;
        
        const associatedButton = document.querySelector(`.option-button[data-option="${intervalName}"]`);
        if (associatedButton) {
            associatedButton.disabled = !window.appState.intervalStates[intervalName];
        }
    });
    
    console.log("Interval states initialized:", window.appState.intervalStates);
};

// Update interval lock status
const updateIntervalLockStatus = () => {
    console.log("Updating interval lock status");
    const toggleCheckboxes = document.querySelectorAll('.toggle-checkbox');
    
    toggleCheckboxes.forEach(checkbox => {
        const intervalName = checkbox.dataset.option;
        window.appState.intervalStates[intervalName] = checkbox.checked;
        
        const associatedButton = document.querySelector(`.option-button[data-option="${intervalName}"]`);
        if (associatedButton) {
            associatedButton.disabled = !checkbox.checked;
            console.log(`Interval ${intervalName} ${checkbox.checked ? 'enabled' : 'disabled'}`);
        }
    });
};

const checkAndShowTutorial = () => {
    const tutorialWatchedKey = 'firstTutorialWatched';
    if (localStorage.getItem(tutorialWatchedKey) === null) {
        console.log("Tutorial has not been watched. Displaying modal.");
        const tutorialModal = document.getElementById('tutorial-modal');
        if (tutorialModal) {
            openModal(tutorialModal);
            localStorage.setItem(tutorialWatchedKey, 'yes');
        }
    } else {
        console.log("Tutorial has already been watched.");
    }
};

// Settings management
const loadAndApplySettings = () => {
    console.log("Loading and applying settings");
    
    // Load theme
    let savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        toggleTheme(savedTheme);
    } else {
        // Set default theme
        toggleTheme('light-theme');
    }

    // Load playing mode
    let savedPlayingMode = localStorage.getItem('playingMode');
    if (savedPlayingMode) {
        const playingModeSelector = document.getElementById('initial-playing-mode');
        if (playingModeSelector) playingModeSelector.value = savedPlayingMode;
    }

    // Load playing direction
    let savedPlayingDirection = localStorage.getItem('playingDirection');
    if (savedPlayingDirection) {
        const playingDirectionSelector = document.getElementById('initial-playing-direction');
        if (playingDirectionSelector) playingDirectionSelector.value = savedPlayingDirection;
    }
};

/*odczytanie ustawień z URL*/
function urlSplit() {
  const params = new URLSearchParams(window.location.search);
  const argumenty = {};
  
  params.forEach((wartosc, klucz) => {
    argumenty[klucz] = wartosc;
  });
  
  return argumenty;
}

// Użycie:
const argumentsURL = urlSplit();

console.log(argumentsURL);

const kluczeUstawien = ['instrument', 'duration', 'theme', 'playingMode'];

// Sprawdź, czy URL zawiera jakieś parametry (argumenty)
if (Object.keys(argumentsURL).length > 0) {
    console.log("Znaleziono argumenty w URL. Zapisywanie i aplikowanie ustawień...");
    
    // 1. Zapisz ustawienia z URL do localStorage
    kluczeUstawien.forEach(klucz => {
        const wartosc = argumentsURL[klucz];
        
        if (wartosc) {
            localStorage.setItem(klucz, wartosc);
            console.log(`[Ustawienie URL] ${klucz}: ${wartosc} => zapisano.`);
        }
    });

    // 2. NATYCHMIAST ZAŁADUJ I ZASTOSUJ USTAWIENIA NA STRONIE
    // Wywołujemy istniejącą w app.js funkcję:
    loadAndApplySettings();
    console.log("Ustawienia załadowane i zastosowane ze zmienionych wartości localStorage.");

    // 3. Wyczyść URL po zapisaniu ustawień (zalecane)
    window.history.replaceState(null, '', window.location.pathname);
    console.log("Parametry URL zostały usunięte z paska adresu.");
}
/*koniec wczytywania z URL */

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded - initializing start page");

    // Check if this is first run and show initial settings modal
    /*if (checkFirstRun()) {
        console.log("First run detected, showing initial settings modal");
        const initialModal = document.getElementById('initial-settings-modal');
        if (initialModal) {
            openModal(initialModal);
        }
    } else {
        // If it's not the first run, check and show the tutorial
        checkAndShowTutorial();
    }*/

    const settingsModal = document.getElementById('settings-modal');
    const infoModal = document.getElementById('info-modal');
    const settingsButton = document.getElementById('settings-button');
    const infoButton = document.getElementById('info-button');
    const themeToggleButton = document.getElementById('theme-toggle');
    const acceptSettingsButton = document.getElementById('accept-settings-button');
    const closeModalButtons = document.querySelectorAll('.close-button');
    const acceptInitialSettingsButton = document.getElementById('accept-initial-settings-button');
    const tutorialButton = document.getElementById('tutorial-button');

    initializeIntervalStates();
    
    // Load and apply settings
    loadAndApplySettings();

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

    // Toggle checkbox event listeners
    document.querySelectorAll('.toggle-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            console.log(`Checkbox ${event.target.dataset.option} changed to ${event.target.checked}`);
            updateIntervalLockStatus();
        });
    });

    // Obsługa interakcji między polami wyboru - upewnij się, że ten blok jest wewnątrz DOMContentLoaded
    const playingModeSelector = document.getElementById('initial-playing-mode');
    const playingDirectionSelector = document.getElementById('initial-playing-direction');
    const firstPlayingModeSelector = document.getElementById('first-initial-playing-mode');
    const firstPlayingDirectionSelector = document.getElementById('first-initial-playing-direction');

    const updateDirectionState = (modeSelector, directionSelector) => {
        const isHarmonic = modeSelector.value === 'harmonic';
        directionSelector.disabled = isHarmonic;
        directionSelector.classList.toggle('disabled', isHarmonic);
    };
    
    // Ważne: Zastosuj logikę do obu zestawów pól wyboru
    if (playingModeSelector && playingDirectionSelector) {
        // Nasłuchiwanie zmian dla głównego ustawienia
        playingModeSelector.addEventListener('change', () => {
            updateDirectionState(playingModeSelector, playingDirectionSelector);
        });
        // Ustawienie początkowego stanu przy ładowaniu strony
        updateDirectionState(playingModeSelector, playingDirectionSelector);
    }
    
    if (firstPlayingModeSelector && firstPlayingDirectionSelector) {
        // Nasłuchiwanie zmian dla pierwszego uruchomienia
        firstPlayingModeSelector.addEventListener('change', () => {
            updateDirectionState(firstPlayingModeSelector, firstPlayingDirectionSelector);
        });
        // Ustawienie początkowego stanu przy ładowaniu modalnego okna pierwszych ustawień
        updateDirectionState(firstPlayingModeSelector, firstPlayingDirectionSelector);
    }
    // Mark app as initialized
    window.appState.isInitialized = true;
    console.log("App initialization complete");
});