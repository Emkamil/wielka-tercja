document.getElementById('intervalButton').addEventListener('click', function() {
    showSection('intervalSection', this);
});

document.getElementById('chordButton').addEventListener('click', function() {
    showSection('chordSection', this);
});

document.getElementById('infoButton').addEventListener('click', function() {
    showSection('infoSection', this);
});

function showSection(sectionId, button) {
    document.querySelectorAll('section').forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');

    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

// Ustaw początkową sekcję
showSection('intervalSection', document.getElementById('intervalButton'));

infoButton.addEventListener('click', function() {
    showSection('infoSection', this);
});