const menuButtons = document.querySelectorAll('.menu-button');
const modeSections = document.querySelectorAll('.mode-section');

// Obiekt do przechowywania stanu aktywności każdego interwału
const intervalStates = {};

menuButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Resetowanie stylów dla wszystkich przycisków
        menuButtons.forEach(btn => {
            btn.classList.remove('active', 'inactive', 'start_color');
        });
        // Ustawienie aktywnego stylu dla klikniętego przycisku
        button.classList.add('active');
        // Ustawienie nieaktywnego stylu dla pozostałych przycisków
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

    // Sprawdzanie, czy motyw jest zapisany w pamięci podręcznej przeglądarki
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    }

    // Dodanie nasłuchiwania na kliknięcie przycisku
    themeToggleBtn.addEventListener('click', () => {
        // Przełączanie klasy 'dark-theme' na elemencie body
        body.classList.toggle('dark-theme');

        // Zapisywanie preferencji w pamięci podręcznej
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // ----------------------
    // Logika przełączania interwałów (istniejący kod)
    // ----------------------
    const toggleCheckboxes = document.querySelectorAll('.toggle-checkbox');
    const intervalButtons = document.querySelectorAll('.option-button');

    // inicjalizacja stanów
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

//resetowanie wyniku po zmianie trybów
const scoreReset = () => {
    const correctCount = document.querySelector('#correct-count');
    correctCount.textContent = '0'
    const wrongCount = document.querySelector('#wrong-count');
    wrongCount.textContent = '0'
};

const startButton = document.getElementById('start-button');
const nextButton = document.getElementById('next-button');
const resetButton = document.getElementById('reset-button');

resetButton.addEventListener('click', () => {
    scoreReset();
});
