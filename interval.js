/*
* interval.js
*
* Copyright (c) 2025 Kamil Machowski
*
* Ten projekt jest objęty licencją  CC BY-ND 4.0
*
*/
console.log("start");
const scoreReset = () => {
    const correctCount = document.querySelector('#correct-count');
    correctCount.textContent = '0';
    const wrongCount = document.querySelector('#wrong-count');
    wrongCount.textContent = '0';
};

const startButton = document.getElementById('start-button');
const nextButton = document.getElementById('next-button');
const resetButton = document.getElementById('reset-button');

resetButton.addEventListener('click', () => {
    scoreReset();
    console.log("xd");
});

nextButton.addEventListener('click', () => {
    const wrongCount = document.querySelector('#wrong-count');
    console.log( parseInt(wrongCount) + 1);
});