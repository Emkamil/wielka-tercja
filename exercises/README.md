# Jak dodać nowe ćwiczenie

Nowe ćwiczenie to **jeden plik JS** i **jeden wpis w `registry.json`**. Strona startowa, strona ćwiczenia,
losowanie pytań, punktacja, poziomy trudności, zapamiętywanie włączonych odpowiedzi i działanie offline
dostajesz za darmo - nic więcej nie trzeba zmieniać.

## 1. Wpis w `exercises/registry.json`

```json
{
  "id": "rhythm",                       // unikalny identyfikator (adres: exercise.html?type=rhythm)
  "title": "Rytm",                      // nazwa na karcie i w nagłówku
  "description": "Krótki opis.",        // podpis na karcie wyboru
  "icon": "<path d=\"...\"/>",          // wnętrze SVG 24x24 (kontur lub wypełnienie)
  "color": "#3b5bdb",                   // pastelowy kolor ćwiczenia (karta i strona); ciemny tekst #2a2438 na nim musi mieć kontrast >= 4,5:1
  "module": "rhythm.js",                // plik w katalogu exercises/
  "playModes": ["harmonic", "melodic-up", "melodic-down", "melodic-random"]
}
```

`playModes` to sposoby gry, które ćwiczenie obsługuje - tylko one pokażą się na stronie startowej.
Pusta lista (`[]`) ukrywa wybór całkowicie (np. ćwiczenie z pojedynczymi dźwiękami).

## 2. Plik `exercises/<module>.js`

```js
export default {
    prompt: 'Jaki to rytm?',          // komunikat podczas pytania

    answers: [                        // wszystkie możliwe odpowiedzi
        { id: 'a', label: 'A', title: 'Pełna nazwa (podpowiedź i komunikat po odpowiedzi)', /* własne pola */ },
        { id: 'b', label: 'B', title: '...', enabled: false },   // enabled: false = domyślnie wyłączona z losowania
    ],

    levels: [                         // opcjonalnie: poziomy trudności (lista id odpowiedzi)
        { id: 'latwy', label: 'Łatwy', answers: ['a', 'b'] },
    ],

    melodicGap: 0.5,                  // opcjonalnie: odstęp między dźwiękami przy grze melodycznej [s]

    /** Zwraca numery dźwięków (1-37 = C3-C6) dla wylosowanej odpowiedzi. */
    build(answer, { randInt, range }) {
        const start = randInt(range.min, range.max - 7);
        return [start, start + 4, start + 7];
    },
};
```

Silnik sam wybiera odpowiedź (włączoną, inną niż poprzednia), wywołuje `build()`, ustawia kolejność
dźwięków wg wybranego sposobu gry (razem / w górę / w dół / losowo), odtwarza je i sprawdza odpowiedź.
Gotowe przykłady: `intervals.js` (najprostszy), `chords.js` (poziomy), `notes.js`, `scales.js`.

## Dźwięki

Pliki `sounds/<instrument>/<1|2>s/<numer>.mp3`, numer 1-37 (C3 = 1, C6 = 37). Nowy instrument:
wgraj dźwięki i dopisz go w `global/scripts/config.js` (`INSTRUMENTS`).

## Struktura

```
index.html, exercise.html     dwie strony (reszta jest generowana z rejestru)
sw.js                         tryb offline
global/styles/                tokens.css (kolory, rozmiary) · base.css · home.css · exercise.css
global/scripts/               config · storage · settings · registry · ui · audio · home · exercise
exercises/                    registry.json + po jednym pliku na ćwiczenie
```

Kolory i rozmiary zmienisz w jednym miejscu: `global/styles/tokens.css`.
