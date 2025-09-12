/*
* Wielka Tercja
*
 * app.js
 *
 * Copyright (c) 2025 Kamil Machowski
 *
 * Ten projekt jest objęty licencją CC BY-ND 4.0
 *
 */
console.log("app.js started");

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

// Save settings without resetting game
const saveSettings = () => {
    console.log("Saving settings");
    
    const selectedTheme = document.getElementById('initial-theme').value;
    toggleTheme(selectedTheme);

    const selectedPlayingMode = document.getElementById('initial-playing-mode').value;
    localStorage.setItem('playingMode', selectedPlayingMode);
    console.log(`Saved playing mode: ${selectedPlayingMode}`);

    const selectedPlayingDirection = document.getElementById('initial-playing-direction').value;
    localStorage.setItem('playingDirection', selectedPlayingDirection);
    console.log(`Saved playing direction: ${selectedPlayingDirection}`);

    // Remove active class from option buttons
    document.querySelectorAll('.option-button.active').forEach(button => {
        button.classList.remove('active');
    });
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

// Mode switching functionality
const switchMode = (newMode) => {
    console.log(`Switching mode from ${window.appState.currentMode} to ${newMode}`);
    
    // Update state
    window.appState.currentMode = newMode;
    
    // Update menu buttons
    document.querySelectorAll('.menu-button').forEach(button => {
        button.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`[data-mode="${newMode}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Update sections
    document.querySelectorAll('.mode-section').forEach(section => {
        section.classList.remove('active-mode');
    });
    
    const activeSection = document.getElementById(newMode);
    if (activeSection) {
        activeSection.classList.add('active-mode');
    }
    
    // Reset score when switching modes
    scoreReset();
    
    console.log(`Mode switched to: ${newMode}`);
};

// Check if this is first run
const checkFirstRun = () => {
    const hasSettings = localStorage.getItem('theme') && 
                       localStorage.getItem('playingMode') && 
                       localStorage.getItem('playingDirection');
    
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

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded - initializing app");
    
    // Check if this is first run and show initial settings modal
    if (checkFirstRun()) {
        console.log("First run detected, showing initial settings modal");
        const initialModal = document.getElementById('initial-settings-modal');
        if (initialModal) {
            openModal(initialModal);
        }
    } else {
        // If it's not the first run, check and show the tutorial
        checkAndShowTutorial();
    }
    
    // Get DOM elements
    const settingsModal = document.getElementById('settings-modal');
    const infoModal = document.getElementById('info-modal');
    const settingsButton = document.getElementById('settings-button');
    const infoButton = document.getElementById('info-button');
    const themeToggleButton = document.getElementById('theme-toggle');
    const acceptSettingsButton = document.getElementById('accept-settings-button');
    const closeModalButtons = document.querySelectorAll('.close-button');
    const acceptInitialSettingsButton = document.getElementById('accept-initial-settings-button');
    
    // Initialize interval states
    initializeIntervalStates();
    
    // Load and apply settings
    loadAndApplySettings();
    
    // Settings button event listener
    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            console.log("Settings button clicked");
            openModal(settingsModal);
        });
    }
    
    // Info button event listener
    if (infoButton) {
        infoButton.addEventListener('click', () => {
            console.log("Info button clicked");
            openModal(infoModal);
        });
    }
    
    // Theme toggle button event listener
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            console.log("Theme toggle button clicked");
            const currentTheme = document.body.className;
            const newTheme = currentTheme === 'dark-theme' ? 'light-theme' : 'dark-theme';
            toggleTheme(newTheme);
        });
    }
    
    // Accept settings button event listener
    if (acceptSettingsButton) {
        acceptSettingsButton.addEventListener('click', () => {
            console.log("Accept settings button clicked");
            saveSettings();
            
            // Close all settings modals
            closeModal(settingsModal);
            const initialModal = document.getElementById('initial-settings-modal');
            if (initialModal && initialModal.classList.contains('visible')) {
                closeModal(initialModal);
                window.appState.isFirstRun = false;
            }
        });
    }

    if (acceptInitialSettingsButton) {
        acceptInitialSettingsButton.addEventListener('click', () => {
            console.log("Accept initial settings button clicked");
            
            // Get values from first-time modal
            const selectedTheme = document.getElementById('first-initial-theme').value;
            const selectedPlayingMode = document.getElementById('first-initial-playing-mode').value;
            const selectedPlayingDirection = document.getElementById('first-initial-playing-direction').value;
            const selectedInstrument = document.getElementById('first-initial-instrument').value;
            
            // Save to localStorage
            toggleTheme(selectedTheme);
            localStorage.setItem('playingMode', selectedPlayingMode);
            localStorage.setItem('playingDirection', selectedPlayingDirection);
            localStorage.setItem('instrument', selectedInstrument);
            localStorage.setItem('theme', selectedTheme);
            
            console.log("Initial settings saved:", {
                theme: selectedTheme,
                playingMode: selectedPlayingMode,
                playingDirection: selectedPlayingDirection,
                instrument: selectedInstrument
            });
            
            // Update main settings modal selectors
            const mainThemeSelector = document.getElementById('initial-theme');
            const mainPlayingModeSelector = document.getElementById('initial-playing-mode');
            const mainPlayingDirectionSelector = document.getElementById('initial-playing-direction');
            const mainInstrumentSelector = document.getElementById('initial-instrument');
            
            if (mainThemeSelector) mainThemeSelector.value = selectedTheme;
            if (mainPlayingModeSelector) mainPlayingModeSelector.value = selectedPlayingMode;
            if (mainPlayingDirectionSelector) mainPlayingDirectionSelector.value = selectedPlayingDirection;
            if (mainInstrumentSelector) mainInstrumentSelector.value = selectedInstrument;

            if (mainPlayingModeSelector && mainPlayingDirectionSelector) {
                updateDirectionState(mainPlayingModeSelector, mainPlayingDirectionSelector);
            }
            
            // Close initial modal
            const initialModal = document.getElementById('initial-settings-modal');
            if (initialModal) {
                closeModal(initialModal);
                console.log("Initial settings modal closed");
            }            

            // Display tutorial after initial setup
            checkAndShowTutorial();

            window.appState.isFirstRun = false;
            console.log("First run completed");
        });
    }

    const tutorialNextButton = document.getElementById('tutorial-next-button');
    const tutorialPrevButton = document.getElementById('tutorial-prev-button');
    const closeTutorialButton = document.getElementById('close-tutorial-button');
    const tutorialSlides = document.querySelectorAll('.tutorial-slide');
    let currentSlide = 0;

    const showSlide = (n) => {
        tutorialSlides.forEach(slide => slide.style.display = 'none');
        if (tutorialSlides[n]) {
            tutorialSlides[n].style.display = 'block';
        }
        
        // Logic to show/hide navigation buttons
        tutorialPrevButton.style.display = n === 0 ? 'none' : 'inline-block';
        tutorialNextButton.style.display = n === tutorialSlides.length - 1 ? 'none' : 'inline-block';
        closeTutorialButton.style.display = n === tutorialSlides.length - 1 ? 'inline-block' : 'none';
    };

    if (tutorialNextButton) {
        tutorialNextButton.addEventListener('click', () => {
            currentSlide++;
            if (currentSlide < tutorialSlides.length) {
                showSlide(currentSlide);
            }
        });
    }

    if (tutorialPrevButton) {
        tutorialPrevButton.addEventListener('click', () => {
            currentSlide--;
            if (currentSlide >= 0) {
                showSlide(currentSlide);
            }
        });
    }
    
    if (closeTutorialButton) {
        closeTutorialButton.addEventListener('click', () => {
            const tutorialModal = document.getElementById('tutorial-modal');
            if (tutorialModal) {
                closeModal(tutorialModal);
            }
        });
    }

    // Call showSlide to set initial state
    showSlide(currentSlide);

    // Close button event listeners
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            // Don't allow closing settings modal or tutorial modal via close button
            if (modal && modal.id !== 'settings-modal' && modal.id !== 'initial-settings-modal' && modal.id !== 'tutorial-modal') {
                closeModal(modal);
            }
        });
    });
    
    // Window click event listener - only for certain modals
    window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        const modalId = e.target.id;
        // Don't allow closing settings modals or tutorial modal by clicking outside
        if (modalId !== 'settings-modal' && modalId !== 'initial-settings-modal' && modalId !== 'tutorial-modal') {
            closeModal(e.target);
        }
    }
    });
    
    // ESC key event listener
    window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const visibleModal = document.querySelector('.modal.visible');
        if (visibleModal) {
            const modalId = visibleModal.id;
            // Don't allow closing settings modals or tutorial modal with ESC
            if (modalId !== 'settings-modal' && modalId !== 'initial-settings-modal' && modalId !== 'tutorial-modal') {
                closeModal(visibleModal);
            }
        }
    }
});
    
    // Mode switching event listeners
    document.querySelectorAll('.menu-button').forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.dataset.mode;
            if (mode) {
                switchMode(mode);
            }
        });
    });
    
    // Toggle checkbox event listeners
    document.querySelectorAll('.toggle-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            console.log(`Checkbox ${event.target.dataset.option} changed to ${event.target.checked}`);
            updateIntervalLockStatus();
        });
    });

    // Dodaj to wewnątrz bloku document.addEventListener('DOMContentLoaded', ...);
    
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