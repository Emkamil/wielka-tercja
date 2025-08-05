const menuButtons = document.querySelectorAll('.menu-button');
const modeSections = document.querySelectorAll('.mode-section');

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
        
        // przełączanie skecji
        const mode = button.dataset.mode;
        modeSections.forEach(section => {
            section.classList.remove('active-mode');
            if (section.id === mode) {
                section.classList.add('active-mode');
            }
        });
    });
});