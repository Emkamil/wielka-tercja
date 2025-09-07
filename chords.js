/*
* Wielka Tercja
*
 * chords.js
 *
 * Copyright (c) 2025 Kamil Machowski
 *
 * Ten projekt jest objęty licencją CC BY-ND 4.0
 *
 */

console.log("chords.js loaded (placeholder)");

// Chord game state management
window.chordGameState = {
    lastPlayedChord: null,
    isChordGameActive: false,
    availableChords: []
};

// Chord definitions (for future implementation)
const chordDefinitions = {
    'major-triad': [0, 4, 7],           // Major triad
    'minor-triad': [0, 3, 7],           // Minor triad
    'diminished-triad': [0, 3, 6],      // Diminished triad
    'augmented-triad': [0, 4, 8],       // Augmented triad
    'major-seventh': [0, 4, 7, 11],     // Major 7th
    'minor-seventh': [0, 3, 7, 10],     // Minor 7th
    'dominant-seventh': [0, 4, 7, 10]   // Dominant 7th
};