// Globalny obiekt do przechowywania stanu aktywności każdej opcji
const optionStates = {};

document.addEventListener('DOMContentLoaded', () => {
    // Przełączanie trybów
    const menuButtons = document.querySelectorAll('.menu-button');
    const modeSections = document.querySelectorAll('.mode-section');
    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            menuButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const mode = button.dataset.mode;
            modeSections.forEach(section => {
                section.classList.remove('active-mode');
                if (section.id === mode) {
                    section.classList.add('active-mode');
                }
            });
        });
    });

    // Inicjalizacja stanów checkboxów i przycisków
    const toggleCheckboxes = document.querySelectorAll('.toggle-checkbox');
    toggleCheckboxes.forEach(checkbox => {
        const optionName = checkbox.dataset.option;
        optionStates[optionName] = checkbox.checked;
        
        const associatedButton = document.querySelector(`.option-button[data-option="${optionName}"]`);
        if (associatedButton) {
            associatedButton.disabled = !checkbox.checked;
        }

        checkbox.addEventListener('change', (event) => {
            const changedOptionName = event.target.dataset.option;
            optionStates[changedOptionName] = event.target.checked;
            
            const associatedButton = document.querySelector(`.option-button[data-option="${changedOptionName}"]`);
            if (associatedButton) {
                associatedButton.disabled = !event.target.checked;
            }
        });
    });

    // Funkcja resetująca wynik
    const scoreReset = () => {
        const correctCount = document.getElementById('correct-count');
        const wrongCount = document.getElementById('wrong-count');
        if (correctCount) correctCount.textContent = '0';
        if (wrongCount) wrongCount.textContent = '0';
    };

    // Obsługa przycisku RESET
    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', scoreReset);
    }

    // Przełącznik ciemnego motywu
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
        });
    }
});
