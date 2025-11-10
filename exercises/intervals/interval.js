/*
* Wielka Tercja
*
 * interval.js
 *
 * Copyright (c) 2025 Kamil Machowski
 *
 * Ten projekt jest objęty licencją CC BY-ND 4.0
 *
 */

console.log("interval.js started");

window.gameState = {
    lastPlayedInterval: null,
    lastPlayedFirstNote: null,
    lastPlayedSecondNote: null,
    isGameActive: false,
    areButtonsEnabled: true,
    audioContext: null
};

// DOM elements cache
let gameElements = {};

// Interval semitones mapping
const intervalSemitonesMap = {
    'pryma-czysta': 0,
    'sekunda-mala': 1,
    'sekunda-wielka': 2,
    'tercja-mala': 3,
    'tercja-wielka': 4,
    'kwarta-czysta': 5,
    'tryton': 6,
    'kwinta-czysta': 7,
    'seksta-mala': 8,
    'seksta-wielka': 9,
    'septyma-mala': 10,
    'septyma-wielka': 11,
    'oktawa-czysta': 12
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
        optionButtons: document.querySelectorAll('.option-button')
    };
    console.log("DOM elements cached");
};

// Get settings from localStorage with defaults
const getSettingsFromLocal = () => {
    const settings = {
        playingMode: localStorage.getItem('playingMode') || 'melodic',
        instrument: localStorage.getItem('instrument') || 'piano',
        playingDirection: localStorage.getItem('playingDirection') || 'mix-direction',
        duration: localStorage.getItem('duration') || '2'
    };
    
    // Set defaults if not present
    if (!localStorage.getItem('playingMode')) {
        localStorage.setItem('playingMode', settings.playingMode);
    }
    if (!localStorage.getItem('instrument')) {
        localStorage.setItem('instrument', settings.instrument);
    }
    if (!localStorage.getItem('playingDirection')) {
        localStorage.setItem('playingDirection', settings.playingDirection);
    }
    if (!localStorage.getItem('duration')) {
        localStorage.setItem('duration', settings.duration);
    }
    
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

// Get random starting note for interval
function getRandomStartingNote(intervalInSemitones, direction) {
    console.log(`Getting random starting note for interval: ${intervalInSemitones}, direction: ${direction}`);
    
    const minNote = 1; // C3
    const maxNote = 37; // C6
    let possibleStartNotes = [];

    if (direction === 'up' || direction === 'mix-direction') {
        const maxStartingNoteUp = maxNote - intervalInSemitones;
        for (let i = minNote; i <= maxStartingNoteUp; i++) {
            possibleStartNotes.push({ note: i, direction: 'up' });
        }
    }

    if (direction === 'down' || direction === 'mix-direction') {
        const minStartingNoteDown = minNote + intervalInSemitones;
        for (let i = minStartingNoteDown; i <= maxNote; i++) {
            possibleStartNotes.push({ note: i, direction: 'down' });
        }
    }
    
    if (possibleStartNotes.length === 0) {
        console.warn("No possible starting notes for selected interval and direction");
        return null;
    }
    
    const randomIndex = Math.floor(Math.random() * possibleStartNotes.length);
    const selected = possibleStartNotes[randomIndex];
    console.log(`Selected starting note: ${selected.note}, direction: ${selected.direction}`);
    return selected;
}

// Get random interval from available options
function getRandomInterval() {
    console.log("Getting random interval");
    
    const availableIntervals = [];
    document.querySelectorAll('.toggle-checkbox:checked').forEach(checkbox => {
        const intervalName = checkbox.getAttribute('data-option');
        availableIntervals.push(intervalName);
    });

    console.log(`Available intervals: ${availableIntervals.length}`, availableIntervals);

    if (availableIntervals.length < 1) {
        showCustomAlert("Brak dostępnych interwałów, odblokuj minimum 1 interwał.");
        return null;
    }

    if (availableIntervals.length < 2) {
        showCustomAlert("Odblokuj więcej interwałów, aby móc wylosować ćwiczenie.");
        return null;
    }

    // NOWY FRAGMENT - Zapobiega powtórzeniu tego samego interwału
    let filteredIntervals = availableIntervals;
    if (window.gameState.lastPlayedInterval !== null && availableIntervals.length > 1) {
        // Usuń ostatnio grany interwał z dostępnych opcji
        filteredIntervals = availableIntervals.filter(interval => interval !== window.gameState.lastPlayedInterval);
        console.log(`Filtered out last played interval: ${window.gameState.lastPlayedInterval}`);
        console.log(`Remaining intervals: ${filteredIntervals.length}`, filteredIntervals);
        
        // Jeśli po filtrowaniu nie ma opcji (nie powinno się zdarzyć), użyj wszystkich
        if (filteredIntervals.length === 0) {
            console.warn("No intervals left after filtering, using all available");
            filteredIntervals = availableIntervals;
        }
    }
    // KONIEC NOWEGO FRAGMENTU

    const randomIndex = Math.floor(Math.random() * filteredIntervals.length);
    const randomIntervalName = filteredIntervals[randomIndex];
    
    console.log(`Selected interval: ${randomIntervalName} (avoiding repetition)`);

    const intervalInSemitones = intervalSemitonesMap[randomIntervalName];
    const direction = getSettingsFromLocal().playingDirection;
    const startNoteObject = getRandomStartingNote(intervalInSemitones, direction);

    if (!startNoteObject) {
        console.error("Could not generate starting note");
        return null;
    }

    return {
        name: randomIntervalName,
        semitones: intervalInSemitones,
        startNote: startNoteObject.note,
        direction: startNoteObject.direction
    };
}

// Enable/disable option buttons
const setButtonsEnabled = (enabled) => {
    window.gameState.areButtonsEnabled = enabled;
    console.log(`Buttons ${enabled ? 'enabled' : 'disabled'}`);
    
    gameElements.optionButtons.forEach(btn => {
        if (!btn.disabled) { // Only modify buttons that aren't permanently disabled
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

// Play interval audio
async function playInterval(intervalObject) {
    console.log("Starting interval playback", intervalObject);
    
    if (!intervalObject) {
        console.error("No interval object provided");
        return;
    }

    try {
        let direction = intervalObject.direction;
        const intervalSemitones = intervalObject.semitones;
        const intervalName = intervalObject.name;

        let firstNoteNumber, secondNoteNumber;

        if (intervalObject.replaying) {
            // Use previously played notes
            firstNoteNumber = window.gameState.lastPlayedFirstNote;
            secondNoteNumber = window.gameState.lastPlayedSecondNote;
            console.log("Replaying previous interval");
        } else {
            // Generate new notes
            const startNoteInfo = getRandomStartingNote(intervalSemitones, direction);
            if (!startNoteInfo) {
                showCustomAlert("Brak możliwych nut startowych dla wybranego interwału i kierunku. Zmień ustawienia lub wybierz inne interwały.");
                return;
            }

            const startNoteNumber = startNoteInfo.note;
            if (direction === 'mix-direction') {
                direction = startNoteInfo.direction;
            }

            if (direction === 'up') {
                firstNoteNumber = startNoteNumber;
                secondNoteNumber = startNoteNumber + intervalSemitones;
            } else {
                firstNoteNumber = startNoteNumber;
                secondNoteNumber = startNoteNumber - intervalSemitones;
            }
            
            // Store for replay
            window.gameState.lastPlayedInterval = intervalName;
            window.gameState.lastPlayedFirstNote = firstNoteNumber;
            window.gameState.lastPlayedSecondNote = secondNoteNumber;
        }
        
        console.log(`Playing notes: ${firstNoteNumber} -> ${secondNoteNumber}`);

        const settings = getSettingsFromLocal();
        const audioDir = `/sounds/${settings.instrument}/${settings.duration}s/`;

        let sourceDuration = parseFloat(settings.duration) + 0.2;
        console.log(sourceDuration)

        if(settings.duration == 1){
            sourceDuration = parseFloat(1);
        }
        if(settings.duration == 2){
            sourceDuration = parseFloat(2);
        }
        /*if(settings.duration == 3){
            sourceDuration = parseFloat(2);
        }*/

        const note1Url = `${audioDir}${firstNoteNumber}.mp3`;
        const note2Url = `${audioDir}${secondNoteNumber}.mp3`;

        // Load both audio files
        const [buffer1, buffer2] = await Promise.all([
            loadAndDecodeAudio(note1Url),
            loadAndDecodeAudio(note2Url)
        ]);

        const audioContext = initializeAudio();
        
        // Create audio sources
        const source1 = audioContext.createBufferSource();
        source1.buffer = buffer1;
        source1.connect(audioContext.destination);

        const source2 = audioContext.createBufferSource();
        source2.buffer = buffer2;
        source2.connect(audioContext.destination);

        // Play according to mode
        if (settings.playingMode === 'harmonic') {
            console.log("Playing harmonic interval");
            source1.start(0);
            source2.start(0);
        } else { // melodic
            console.log("Playing melodic interval");
            source1.start(0);
            source2.start(audioContext.currentTime + sourceDuration);
        }

        console.log(`Interval played successfully. Correct answer: ${window.gameState.lastPlayedInterval}`);
        
        // Enable buttons after audio starts
        setTimeout(() => {
            setButtonsEnabled(true);
        }, 100);

    } catch (error) {
        console.error(`Error playing interval:`, error);
        showCustomAlert("Wystąpił błąd podczas ładowania dźwięków. Sprawdź połączenie internetowe lub spróbuj ponownie.");
        setButtonsEnabled(true); // Re-enable buttons even on error
    }
}

// Handle answer selection
const handleAnswerClick = (selectedInterval) => {
    console.log(`Answer selected: ${selectedInterval}`);
    
    if (!window.gameState.areButtonsEnabled) {
        console.log("Buttons are disabled, ignoring click");
        return;
    }
    
    if (!window.gameState.lastPlayedInterval) {
        console.warn("No interval has been played yet");
        showCustomAlert("Najpierw naciśnij START, aby zagrać pierwszy interwał!");
        return;
    }
    
    // Disable buttons immediately
    setButtonsEnabled(false);
    
    const clickedButton = document.querySelector(`.option-button[data-option="${selectedInterval}"]`);
    const isCorrect = selectedInterval === window.gameState.lastPlayedInterval;
    
    console.log(`Answer is ${isCorrect ? 'correct' : 'incorrect'}`);
    
    if (isCorrect) {
        // Correct answer
        const correctCount = parseInt(gameElements.correctCount.textContent, 10) + 1;
        gameElements.correctCount.textContent = correctCount;
        clickedButton.classList.add('correct');
    } else {
        // Wrong answer
        const wrongCount = parseInt(gameElements.wrongCount.textContent, 10) + 1;
        gameElements.wrongCount.textContent = wrongCount;
        clickedButton.classList.add('wrong');
        
        // Highlight correct answer
        const correctButton = document.querySelector(`.option-button[data-option="${window.gameState.lastPlayedInterval}"]`);
        if (correctButton) {
            correctButton.classList.add('correct');
        }
    }
    
    // Auto-play next interval after delay
    setTimeout(() => {
        resetButtonStates();
        playNextInterval();
    }, 1500);
};

// Play next interval
const playNextInterval = () => {
    console.log("Playing next interval");
    const intervalToPlay = getRandomInterval();
    if (intervalToPlay) {
        playInterval(intervalToPlay);
    } else {
        showCustomAlert("Błąd generowania interwału")
        console.warn("Could not generate next interval");
        setButtonsEnabled(true);
    }
};

// Start new game
const startNewGame = () => {
    console.log("Starting new game");
    
    // Reset game state
    window.gameState.lastPlayedInterval = null;
    window.gameState.lastPlayedFirstNote = null;
    window.gameState.lastPlayedSecondNote = null;
    window.gameState.isGameActive = true;
    
    // Reset score
    gameElements.correctCount.textContent = '0';
    gameElements.wrongCount.textContent = '0';
    
    // Reset button states
    resetButtonStates();
    
    // Play first interval
    playNextInterval();
};

// Repeat current interval
const repeatCurrentInterval = () => {
    console.log("Repeating current interval");
    
    if (!window.gameState.lastPlayedInterval) {
        console.warn("No interval to repeat");
        showCustomAlert("Najpierw naciśnij START, aby zagrać pierwszy interwał!");
        return;
    }
    
    const intervalToPlay = {
        name: window.gameState.lastPlayedInterval,
        semitones: intervalSemitonesMap[window.gameState.lastPlayedInterval],
        replaying: true
    };
    
    setButtonsEnabled(false);
    playInterval(intervalToPlay);
};

// Initialize game
const initializeGame = () => {
    console.log("Initializing interval game");
    
    // Cache DOM elements
    cacheElements();
    
    // Get settings
    getSettingsFromLocal();
    
    // Set up event listeners for control buttons
    if (gameElements.startButton) {
        gameElements.startButton.addEventListener('click', () => {
            console.log("START button clicked");
            startNewGame();
        });
    }
    
    if (gameElements.nextButton) {
        gameElements.nextButton.addEventListener('click', () => {
            console.log("NEXT button clicked");
            if (window.gameState.isGameActive && window.gameState.lastPlayedInterval) {
                // Pokaż poprawną odpowiedź na krótko
                const correctButton = document.querySelector(`.option-button[data-option="${window.gameState.lastPlayedInterval}"]`);
                if (correctButton) {
                    correctButton.classList.add('correct');
                    setTimeout(() => {
                        correctButton.classList.remove('correct');
                    }, 1000);
                }
                
                // Zwiększ licznik błędnych odpowiedzi
                const wrongCount = parseInt(gameElements.wrongCount.textContent, 10) + 1;
                gameElements.wrongCount.textContent = wrongCount;
                console.log("Answer skipped - marked as wrong, correct was:", window.gameState.lastPlayedInterval);
                
                // Przejdź do następnego po krótkiej pauzie
                setTimeout(() => {
                    resetButtonStates();
                    playNextInterval();
                }, 1000);
            } else if (!window.gameState.isGameActive) {
                showCustomAlert("Najpierw naciśnij START, aby rozpocząć ćwiczenie!");
            } else {
                showCustomAlert("Brak aktywnego interwału do pominięcia!");
            }
        });
    }
    
    if (gameElements.repeatButton) {
        gameElements.repeatButton.addEventListener('click', () => {
            console.log("REPEAT button clicked");
            repeatCurrentInterval();
        });
    }
    
    // Set up event listeners for option buttons
    gameElements.optionButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedInterval = event.currentTarget.dataset.option;
            if (selectedInterval) {
                handleAnswerClick(selectedInterval);
            }
        });
    });
    
    console.log("Interval game initialized");
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM ready - initializing interval game");
    
    // Wait a bit to ensure app.js has finished initialization
    setTimeout(() => {
        if (window.appState && window.appState.isInitialized) {
            initializeGame();
        } else {
            console.log("App not ready, retrying...");
            setTimeout(initializeGame, 500);
        }
    }, 100);
});