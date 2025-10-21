# Context: Todo App

## Goal
Een simpele todo-lijst webapplicatie waar gebruikers persoonlijke taken kunnen beheren.

## Core Functionaliteiten
- ✅ Taken toevoegen (tekst invoeren + enter/klik)
- ✅ Taken afvinken (compleet/incompleet toggle) 
- ✅ Taken verwijderen (delete/remove button)
- ✅ Taken persistent opslaan (blijven staan na herladen)
- ✅ Taken weergeven in een overzichtelijke lijst
- ✅ Taken beweken (edit button)
- 🔲 Deadline toevoegen aan een taak


## Technical Stack
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript (ES6+)
- **Storage**: Browser LocalStorage
- **Data Format**: JSON
- **No external frameworks** - pure web standards

## Bestandsstructuur
todo-app/
├── index.html # Hoofd HTML bestand
├── styles/
│ └── style.css # Alle styling
├── scripts/
│ └── app.js # Hoofd JavaScript logica
├── assets/
│ └── icons/ # Eventuele icoontjes
└── README.md # Documentatie
## Data Structuur
```javascript
// Opgeslagen in LocalStorage onder key "todoApp"
[
  {
    id: Date.now(), // Unieke identifier
    text: "Boodschappen doen", // Taak beschrijving
    completed: false, // Status
    createdAt: new Date().toISOString() // Aanmaakdatum
  }
]
``` 
## Output Format
- Toon complete, werkende code
- Geef uitleg bij complexe delen
- Houd code simpel en leesbaar

## Code style rules (prevent file bloat)

- Prefer kleine, herbruikbare helperfuncties (single responsibility). Splits bij >200 LOC per functie/file.
- Vermijd duplicatie: centraliseer DOM-selectors en formatter helpers in één plek.
- Keep UI rendering separate from data logic: small render functions that accept data and return DOM nodes.
- Favour in-place edits over full-file rewrites when making incremental improvements.
- Add short unit tests or smoke checks for critical helpers (normalization, parsing, formatting).
- Document any non-obvious default behavior (e.g., default time 23:59) in comments and README.
- When refactoring, make small commits/pulls and run the QA checklist after each step.

- Limit maximum line length to improve readability. Use 100 characters as the project standard
  for source code files (JS, CSS, HTML). When a line would exceed the limit prefer:
  - Breaking expressions across multiple indented lines.
  - Assigning sub-expressions to well-named temporaries.
  - Using template strings or helper functions to keep templates readable.
  This limit helps editors with side-by-side diffs and keeps code accessible on narrower
  screens. Formatter tools (Prettier/ESLint) may be configured to enforce or autofix this.