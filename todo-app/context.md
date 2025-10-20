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