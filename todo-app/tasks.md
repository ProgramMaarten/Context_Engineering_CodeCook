# Tasks
✅ Project structuur aanmaken (index.html, styles/, scripts/)
✅ Basis HTML layout met inputveld en lege todo-lijst
✅ CSS styling voor todo items en layout
✅ JavaScript: LocalStorage helper functies (get/save)
✅ JavaScript: Nieuwe todo toevoegen aan DOM en opslaan
✅ JavaScript: Todo afvinken functionaliteit
✅ JavaScript: Todo verwijderen functionaliteit
✅ JavaScript: Todos inladen bij paginaload

# Tasks - Edit Functionaliteit

## Fase 1: UI Structuur & Styling (2 uur)
✅ Edit knop toevoegen in renderTodo functie
✅ CSS styling voor edit knop (inclusief positionering)
✅ Edit mode CSS styling (background, borders)
✅ Hover states, active states en transitions

## Fase 2: Edit Mode Basis (2.5 uur)
✅ Event listener voor edit knop klikken
✅ DOM transformatie: text → input field met huidige waarde
✅ Opslaan/Annuleren knoppen tonen, edit knop verbergen
✅ Auto-focus en text selection in edit mode

## Fase 3: Core Logic - Happy Path (2.5 uur)
✅ Opslaan: nieuwe tekst ophalen en DOM updaten
✅ Opslaan: data model en LocalStorage bijwerken
✅ Annuleren: edit mode sluiten zonder wijzigingen
✅ Disable checkbox en delete knop tijdens edit

## Fase 4: Validation & UX Enhancements (2 uur)
✅ Input validation: lege todo's voorkomen
✅ Keyboard support (Enter opslaan, Escape annuleren)
✅ Error handling: LocalStorage errors afvangen
✅ Edge cases testen (lange tekst)

## Fase 5: Testing & Polish (1 uur)
✅ Test: complete flow (add → edit → save → reload)
✅ Integration test met bestaande features
✅ Code review en documentatie



## Fase 6: Kleine UX tweaks (15 min)

- ✅ Verwijderen: verwijder de bevestigingsprompt (confirm()) bij het verwijderen van een todo

Acceptance criteria:
- Klik op de verwijder-knop verwijdert direct het item zonder een browser prompt
- De todo wordt uit localStorage verwijderd en de DOM wordt correct geüpdatet
- De teller (`todoCount`) reflecteert de wijziging direct
- Basis test: add → delete → reload (item moet weg blijven)

Implementation notes:
- Verwijder of comment out de `confirm()` check in `deleteTodo` in `scripts/app.js` en zorg dat `saveTodosToStorage()` en `updateTodoCount()` nog steeds worden aangeroepen.

## Fase 7: Verslepen / Ordenen (drag & drop) (medium, ~3 uur)

Doel: Gebruikers kunnen todo-items slepen om de volgorde te bepalen. Volgorde wordt persistent opgeslagen in localStorage.

Taken (kort, testbaar en onafhankelijk):
- ✅ UI: voeg drag-handle toe in renderTodo
  - Actie: voeg een klein icoon/span met class "drag-handle" toe aan elk todo-item.
  - Acceptatie: handle zichtbaar in elk item; geen functieverandering.
  - Geschat: 0.5 uur

- ✅ DOM: maak todo-items draggable
  - Actie: zet attribute draggable="true" op het li-element en zorg voor data-id op elk item.
  - Acceptatie: draggable attribute aanwezig in DOM voor elk item.
  - Geschat: 0.25 uur

- ✅ Event: voeg dragstart handler toe
  - Actie: bij dragstart zet je het draggedId in een tijdelijke variabele (of DataTransfer) en voeg visuele klasse "dragging" toe.
  - Acceptatie: bij dragstart is draggedId bekend en visuele "dragging" klasse wordt toegevoegd.
  - Geschat: 0.5 uur

- ✅ Event: implementeer dragover + drop target visuals
  - Actie: voorkom default in dragover en voeg placeholder/klasse "drag-over" toe op hovered items.
  - Acceptatie: tijdens slepen verschijnt visuele indicator op mogelijke drop-positie.
  - Geschat: 0.5 uur

- ✅ Event: implementeer drop handler en indexbepaling
  - Actie: bereken target index op drop (boven/onder midden), roep een functie aan die model-updates uitvoert.
  - Acceptatie: drop oproep bevat draggedId en targetIndex; array-volgorde wijzigt overeenkomstig.
  - Geschat: 0.5 uur

- ✅ Logica: werk this.todos bij (splice & insert)
  - Actie: verwijder het item uit oude positie en voeg in nieuwe positie; behoud overige properties.
  - Acceptatie: array-volgorde reflecteert visuele volgorde na drop.
  - Geschat: 0.5 uur

- ✅ Persistentie: saveTodosToStorage() na reordering
  - Actie: sla bijgewerkte this.todos op direct na model-update.
  - Acceptatie: herladen van pagina behoudt nieuwe volgorde.
  - Geschat: 0.25 uur

- ✅ Rendering: zorg renderTodos respecteert array-volgorde
  - Actie: verwijder of conditioneel overschrijven van bestaande automatische sortering (onvoltooide eerst) wanneer handmatige volgorde aanwezig is.
  - Acceptatie: render volgt exact array volgorde; handmatige volgorde overschrijft default sortering.
  - Geschat: 0.5 uur

- 🔲 QA: handmatige testcases en regressietests
  - Actie: test slepen, checkbox, edit, delete na reorder en page reload; test ook mobiel/touch (indien mogelijk).
  - Acceptatie: geen regressies, volgorde persistent, UI geen glitches.
  - Geschat: 0.75 uur

Optioneel / later:
- Accessibility: keyboard reordering of move up/down knoppen (separate taak, ~1 uur)
- Touch: verbeterde touch-ondersteuning of gebruik kleine lib (separate taak, ~1–2 uur)

Implementation notes:
- Gebruik tijdelijke variabele (this.draggedId / this.draggedIndex) of DataTransfer.setData('text/plain', id).
- Bij drop: compute targetIndex en splicen: const [item] = todos.splice(from, 1); todos.splice(to, 0, item);
- Sla meteen op en render opnieuw.
- Houd bestaande features (checkbox/edit/delete) operationeel na reorder — reattach event listeners of renderTodo opnieuw.

Geschatte totaal tijd: ~3 uur.

## Output Requirements
- Toon code voor elke task
- Code moet direct uitvoerbaar zijn
- Behoud consistentie tussen stappen

## structuur tasks.md
tasks met ✅ ervoor zijn al  uitgevoerd.
tasks met 🔲 ervoor nog niet.