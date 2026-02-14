/*
* Wielka Tercja - Akordy
*
* chords.js
*
* Copyright (c) 2025 Kamil Machowski
*
* Ten projekt jest objęty licencją CC BY-ND 4.0
*
*/

console.log("chords.js started");

window.gameState = {
    lastPlayedChordType: null,
    lastPlayedRootNote: null,
    lastPlayedNotes: null,
    isGameActive: false,
    areButtonsEnabled: true,
    audioContext: null
};

// DOM elements cache
let gameElements = {};

// Definicja typów akordów (interwały w półtonach względem fundamentu)
const chordTypes = {
    // Trójdźwięki
    '+': { intervals: [0, 4, 7], label: '+' },          // durowy (major)
    '+3': { intervals: [4, 7, 12], label: '+3' },       // durowy inv1
    '+5': { intervals: [7, 12, 16], label: '+5' },      // durowy inv2
    'o': { intervals: [0, 3, 7], label: 'o' },          // molowy (minor)
    'o3': { intervals: [3, 7, 12], label: 'o3' },       // molowy inv1
    'o5': { intervals: [7, 12, 15], label: 'o5' },      // molowy inv2
    '>': { intervals: [0, 3, 6], label: '>' },          // zmniejszony
    '>3': { intervals: [3, 6, 12], label: '>3' },       // zmniejszony inv1
    '>5': { intervals: [6, 12, 15], label: '>5' },      // zmniejszony inv2
    '<': { intervals: [0, 4, 8], label: '<' },          // zwiększony
    'D7': { intervals: [0, 4, 7, 10], label: 'D7' },    // dominanta sept zasadnicza
    'D7-3': { intervals: [4, 7, 10, 15], label: 'D7 I p.' },  // dominanta sept inv1
    'D7-5': { intervals: [7, 10, 15, 19], label: 'D7 II p.' }, // dominanta sept inv2
    'D7-7': { intervals: [10, 15, 19, 22], label: 'D7 III p.' }  // dominanta sept inv3
};

// Konfiguracja poziomów trudności
const CHORD_LEVELS = {
    latwy: [
        // Tylko podstawowe trójdźwięki
        { id: '+', label: '+' },
        { id: 'o', label: 'o' },
        { id: '>', label: '>' },
        { id: '<', label: '<' }
    ],
    sredni: [
        // Trójdźwięki + przewroty + V7
        { id: '+', label: '+' },
        { id: 'o', label: 'o' },
        { id: '+3', label: '+3' },
        { id: 'o3', label: 'o3' },
        { id: '+5', label: '+5' },
        { id: 'o5', label: 'o5' },
        { id: '>', label: '>' },
        { id: '<', label: '<' },
        { id: 'D7', label: 'D7' }
    ],
    trudny: [
        // Wszystko
        { id: '+', label: '+' },
        { id: 'o', label: 'o' },
        { id: '+3', label: '+3' },
        { id: 'o3', label: 'o3' },
        { id: '+5', label: '+5' },
        { id: 'o5', label: 'o5' },
        { id: '>', label: '>' },
        { id: '<', label: '<' },
        { id: '>3', label: '>3' },
        { id: '>5', label: '>5' },

        { id: 'D7', label: 'D7' },
        { id: 'D7-3', label: 'D7 I p.' },
        { id: 'D7-5', label: 'D7 IIp.' },
        { id: 'D7-7', label: 'D7 III p.' }
    ]
};

// Initialize audio context
const initializeAudio = () => {
    if (!window.gameState.audioContext) {
        window.gameState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log("Audio context initialized");
    }
    return window.gameState.audioContext;
};

// Cache DOM elements
const cacheElements = () => {
    gameElements = {
        startButton: document.getElementById('start-button'),
        nextButton: document.getElementById('next-button'),
        repeatButton: document.getElementById('repeat-button'),
        correctCount: document.querySelector('#correct-count'),
        wrongCount: document.querySelector('#wrong-count'),
        optionButtons: document.querySelectorAll('.option-button'),
        difficultySelect: document.getElementById('difficulty-level')
    };
    console.log("DOM elements cached");
};

// Get settings from localStorage with defaults
const getSettingsFromLocal = () => {
    const settings = {
        playingMode: localStorage.getItem('playingMode') || 'harmonic',
        instrument: localStorage.getItem('instrument') || 'piano',
        playingDirection: localStorage.getItem('playingDirection') || 'up',
        duration: localStorage.getItem('duration') || '2'
    };

    console.log("Settings loaded:", settings);
    return settings;
};

// Load and decode audio file
async function loadAndDecodeAudio(url) {
    try {
        console.log(`Loading audio: ${url}`);
        const audioContext = initializeAudio();
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const decodedAudio = await audioContext.decodeAudioData(arrayBuffer);
        console.log(`Audio decoded successfully: ${url}`);
        return decodedAudio;
    } catch (error) {
        console.error(`Error loading audio ${url}:`, error);
        throw error;
    }
}

// Get random chord type from available options
function getRandomChord() {
    console.log("Getting random chord type");

    const availableChordTypes = [];
    document.querySelectorAll('.toggle-checkbox:checked').forEach(checkbox => {
        const chordTypeId = checkbox.getAttribute('data-option');
        availableChordTypes.push(chordTypeId);
    });

    console.log(`Available chord types: ${availableChordTypes.length}`, availableChordTypes);

    if (availableChordTypes.length < 1) {
        showCustomAlert("Brak dostępnych typów akordów, odblokuj minimum 1.");
        return null;
    }

    if (availableChordTypes.length < 2) {
        showCustomAlert("Odblokuj więcej typów akordów, aby móc wylosować ćwiczenie.");
        return null;
    }

    // Prevent repetition of last chord type
    let filteredChordTypes = availableChordTypes;
    if (window.gameState.lastPlayedChordType !== null && availableChordTypes.length > 1) {
        filteredChordTypes = availableChordTypes.filter(type => type !== window.gameState.lastPlayedChordType);
        console.log(`Filtered out last played type: ${window.gameState.lastPlayedChordType}`);

        if (filteredChordTypes.length === 0) {
            console.warn("No types left after filtering, using all available");
            filteredChordTypes = availableChordTypes;
        }
    }

    const randomIndex = Math.floor(Math.random() * filteredChordTypes.length);
    const randomChordTypeId = filteredChordTypes[randomIndex];

    console.log(`Selected chord type: ${randomChordTypeId}`);

    const chordTypeData = chordTypes[randomChordTypeId];
    if (!chordTypeData) {
        console.error(`Chord type not found: ${randomChordTypeId}`);
        return null;
    }

    // Random root note - ensure notes stay within available audio range (0-36)
    const minRootNote = 0;
    const maxInterval = Math.max(...chordTypeData.intervals);
    const maxAllowedRoot = Math.max(minRootNote, 36 - maxInterval);
    const randomRootNote = Math.floor(Math.random() * (maxAllowedRoot - minRootNote + 1)) + minRootNote;

    console.log(`Selected root note: ${randomRootNote} (maxInterval: ${maxInterval}, maxAllowedRoot: ${maxAllowedRoot})`);

    return {
        chordTypeId: randomChordTypeId,
        chordType: chordTypeData,
        rootNote: randomRootNote
    };
}

// Enable/disable option buttons
const setButtonsEnabled = (enabled) => {
    window.gameState.areButtonsEnabled = enabled;
    console.log(`Buttons ${enabled ? 'enabled' : 'disabled'}`);

    gameElements.optionButtons.forEach(btn => {
        if (!btn.disabled) {
            btn.style.pointerEvents = enabled ? 'auto' : 'none';
            btn.style.opacity = enabled ? '1' : '0.7';
        }
    });
};

// Reset button states
const resetButtonStates = () => {
    console.log("Resetting button states");
    gameElements.optionButtons.forEach(btn => {
        btn.classList.remove('correct', 'wrong');
    });
};

// Play chord audio
async function playChord(chordObject) {
    console.log("Starting chord playback", chordObject);

    if (!chordObject) {
        console.error("No chord object provided");
        return;
    }

    try {
        setButtonsEnabled(false);

        const settings = getSettingsFromLocal();
        const audioDir = `/wielka-tercja/sounds/piano/${settings.duration}s/`;

        let notes;

        if (chordObject.replaying) {
            // Replay stored notes
            console.log("Replaying previous chord");
            notes = window.gameState.lastPlayedNotes;
        } else {
            // Calculate notes from root note + intervals
            console.log(`Building chord from type: ${chordObject.chordTypeId}, root: ${chordObject.rootNote}`);
            const intervals = chordObject.chordType.intervals;
            notes = intervals.map(interval => chordObject.rootNote + interval);

            console.log(`Calculated notes: ${notes.join(', ')}`);

            // Store for replay
            window.gameState.lastPlayedChordType = chordObject.chordTypeId;
            window.gameState.lastPlayedRootNote = chordObject.rootNote;
            window.gameState.lastPlayedNotes = notes;
        }

        // Load all audio files
        // Note: Our chord map uses indices 0-36, but audio files are numbered 1-37
        const audioPromises = notes.map(noteIndex => {
            const noteFileNumber = noteIndex + 1; // Convert 0-36 to 1-37
            const noteUrl = `${audioDir}${noteFileNumber}.mp3`;
            return loadAndDecodeAudio(noteUrl);
        });

        const audioBuffers = await Promise.all(audioPromises);

        // Determine playback mode and schedule notes accordingly
        const audioContext = initializeAudio();
        const playingMode = settings.playingMode || 'harmonic';
        const playingDirection = settings.playingDirection || 'up';

        // Determine source duration from settings (inspired by intervals.js)
        let sourceDuration = parseFloat(settings.duration) + 0.2;
        if (settings.duration == 1) {
            sourceDuration = 1;
        }
        if (settings.duration == 2) {
            sourceDuration = 2;
        }

        // Helper: shuffle indices
        const shuffleArray = (arr) => {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        };

        if (playingMode === 'harmonic' || audioBuffers.length <= 1) {
            // Play simultaneously (chord)
            audioBuffers.forEach((buffer) => {
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);
                source.start(audioContext.currentTime);
            });

            // Re-enable buttons after source duration
            setTimeout(() => {
                setButtonsEnabled(true);
            }, sourceDuration * 1000);
        } else {
            // Melodic playback - play notes sequentially
            let indices = audioBuffers.map((_, i) => i);

            if (playingDirection === 'up') {
                indices.sort((a, b) => a - b);
            } else if (playingDirection === 'down') {
                indices.sort((a, b) => b - a);
            } else if (playingDirection === 'random' || playingDirection === 'mix-direction') {
                indices = shuffleArray(indices);
            }

            const interval = sourceDuration; // seconds between sequential notes
            indices.forEach((bufIndex, i) => {
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffers[bufIndex];
                source.connect(audioContext.destination);
                source.start(audioContext.currentTime + i * interval);
            });
            const totalTime = interval * indices.length + 0.5;
            setTimeout(() => {
                setButtonsEnabled(true);
            }, totalTime * 1000);
        }

    } catch (error) {
        console.error("Error playing chord:", error);
        setButtonsEnabled(true);
        showCustomAlert("Błąd podczas odtwarzania akordu");
    }
}

// Handle answer click
const handleAnswerClick = (selectedChordTypeId) => {
    console.log(`Answer clicked: ${selectedChordTypeId}, correct: ${window.gameState.lastPlayedChordType}`);

    if (!window.gameState.areButtonsEnabled || !window.gameState.isGameActive) {
        return;
    }

    setButtonsEnabled(false);

    const selectedButton = document.querySelector(`.option-button[data-option="${selectedChordTypeId}"]`);
    const correctButton = document.querySelector(`.option-button[data-option="${window.gameState.lastPlayedChordType}"]`);

    if (selectedChordTypeId === window.gameState.lastPlayedChordType) {
        console.log("Correct answer!");
        selectedButton.classList.add('correct');
        const correctCount = parseInt(gameElements.correctCount.textContent, 10) + 1;
        gameElements.correctCount.textContent = correctCount;

        setTimeout(() => {
            resetButtonStates();
            playNextChord();
        }, 1000);
    } else {
        console.log("Wrong answer!");
        selectedButton.classList.add('wrong');
        correctButton.classList.add('correct');
        const wrongCount = parseInt(gameElements.wrongCount.textContent, 10) + 1;
        gameElements.wrongCount.textContent = wrongCount;

        setTimeout(() => {
            resetButtonStates();
            playNextChord();
        }, 2000);
    }
};

// Play next chord
const playNextChord = () => {
    const chordToPlay = getRandomChord();
    if (chordToPlay) {
        playChord(chordToPlay);
    } else {
        window.gameState.isGameActive = false;
        setButtonsEnabled(true);
    }
};

// Start new game
const startNewGame = () => {
    console.log("Starting new game");

    window.gameState.lastPlayedChordType = null;
    window.gameState.lastPlayedNotes = null;
    window.gameState.isGameActive = true;

    gameElements.correctCount.textContent = '0';
    gameElements.wrongCount.textContent = '0';

    resetButtonStates();

    playNextChord();
};

// Repeat current chord
const repeatCurrentChord = () => {
    console.log("Repeating current chord");

    if (!window.gameState.lastPlayedChordType || !window.gameState.lastPlayedNotes) {
        console.warn("No chord to repeat");
        showCustomAlert("Najpierw naciśnij START, aby zagrać pierwszy akord!");
        return;
    }

    const chordToPlay = {
        replaying: true
    };

    setButtonsEnabled(false);
    playChord(chordToPlay);
};

// Update difficulty level and regenerate options
function updateDifficultyLevel() {
    const selectElement = document.getElementById('difficulty-level');
    const container = document.getElementById('dynamic-options-container');

    if (!selectElement || !container) return;

    const selectedLevel = selectElement.value;
    const chords = CHORD_LEVELS[selectedLevel];

    console.log(`Zmieniono poziom na: ${selectedLevel}. Załadowano ${chords.length} akordów.`);

    container.innerHTML = '';

    chords.forEach(chord => {
        const group = document.createElement('div');
        group.className = 'option-group';

        group.innerHTML = `
            <input type="checkbox" class="toggle-checkbox" data-option="${chord.id}" id="checkbox-${chord.id}" checked/>
            <div class="combined-element">
                <label for="checkbox-${chord.id}" class="toggle-button">
                    <svg class="icon-disable" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                    </svg>
                    <svg class="icon-enable" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>    
                </label>
                <button class="option-button" data-option="${chord.id}">
                    <span class="option-label">${chord.label}</span>
                </button>
            </div>
        `;
        container.appendChild(group);
    });

    // Re-cache DOM elements and attach listeners
    cacheElements();
    attachOptionButtonListeners();

    console.log("Options updated successfully");
}

// Attach listeners to option buttons
function attachOptionButtonListeners() {
    gameElements.optionButtons.forEach(button => {
        button.removeEventListener('click', handleOptionButtonClick);
        button.addEventListener('click', handleOptionButtonClick);
    });
}

function handleOptionButtonClick(event) {
    const selectedChord = event.currentTarget.dataset.option;
    if (selectedChord) {
        handleAnswerClick(selectedChord);
    }
}

// Initialize game
const initializeGame = () => {
    console.log("Initializing chord game");

    cacheElements();
    getSettingsFromLocal();

    // Initial difficulty level update
    updateDifficultyLevel();

    // Setup control buttons
    if (gameElements.startButton) {
        gameElements.startButton.addEventListener('click', () => {
            console.log("START button clicked");
            startNewGame();
        });
    }

    if (gameElements.nextButton) {
        gameElements.nextButton.addEventListener('click', () => {
            console.log("NEXT button clicked");
            if (window.gameState.isGameActive && window.gameState.lastPlayedChordType) {
                const correctButton = document.querySelector(`.option-button[data-option="${window.gameState.lastPlayedChordType}"]`);
                if (correctButton) {
                    correctButton.classList.add('correct');
                    setTimeout(() => {
                        correctButton.classList.remove('correct');
                    }, 1000);
                }

                const wrongCount = parseInt(gameElements.wrongCount.textContent, 10) + 1;
                gameElements.wrongCount.textContent = wrongCount;
                console.log("Chord skipped - marked as wrong");

                setTimeout(() => {
                    resetButtonStates();
                    playNextChord();
                }, 1000);
            } else if (!window.gameState.isGameActive) {
                showCustomAlert("Najpierw naciśnij START, aby rozpocząć ćwiczenie!");
            }
        });
    }

    if (gameElements.repeatButton) {
        gameElements.repeatButton.addEventListener('click', () => {
            console.log("REPEAT button clicked");
            repeatCurrentChord();
        });
    }

    // Setup difficulty level change listener
    if (gameElements.difficultySelect) {
        gameElements.difficultySelect.addEventListener('change', () => {
            console.log("Difficulty level changed");
            // Stop any currently playing audio by closing the audio context
            if (window.gameState.audioContext) {
                try {
                    window.gameState.audioContext.close();
                    console.log("Audio context closed due to difficulty change");
                } catch (e) {
                    console.warn("Error closing audio context:", e);
                }
                window.gameState.audioContext = null;
            }

            // Reset game state and UI
            window.gameState.isGameActive = false;
            window.gameState.lastPlayedChordType = null;
            window.gameState.lastPlayedRootNote = null;
            window.gameState.lastPlayedNotes = null;
            resetButtonStates();
            if (gameElements.correctCount) gameElements.correctCount.textContent = '0';
            if (gameElements.wrongCount) gameElements.wrongCount.textContent = '0';

            updateDifficultyLevel();
        });
    }

    console.log("Chord game initialized successfully");
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM ready - initializing chord game");

    setTimeout(() => {
        if (window.appState && window.appState.isInitialized) {
            initializeGame();
        } else {
            console.log("App not ready, retrying...");
            setTimeout(initializeGame, 500);
        }
    }, 100);
});