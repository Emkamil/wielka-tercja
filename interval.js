/*
* interval.js
*
* Copyright (c) 2025 Kamil Machowski
*
* Ten projekt jest objęty licencją  CC BY-ND 4.0
*
*/
console.log("interval.js start");

const startButton = document.getElementById('start-button');
const nextButton = document.getElementById('next-button');
const resetButton = document.getElementById('reset-button');

resetButton.addEventListener('click', () => {
    scoreReset();
    console.log("xd");
});

nextButton.addEventListener('click', () => {
    const wrongCount = document.querySelector('#wrong-count');
    const stringValue = wrongCount.textContent;
    const intValue = parseInt(stringValue, 10);
    const result = intValue + 1;
    wrongCount.textContent = result;
});

startButton.addEventListener('click', () => {
    scoreReset();
    console.log("odtwarzanie interwału nie działa");
});
