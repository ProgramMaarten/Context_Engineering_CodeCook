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

### Tasks - Deadline (date+time) feature

Doel: Voeg een optionele deadline (datum + tijd) toe aan elk todo-item. De feature omvat: invoer (datetime-local), model-updates, weergave in de lijst, bewerken, verwijderen/clearen, visuele status (overdue / due-soon), en persistente opslag.

Taken (klein, testbaar, logisch geordend):


- ✅ Update `tasks.md` met date+time plan
  - Schrijf deze takenlijst in `todo-app/tasks.md`.
  - Files: `todo-app/tasks.md`
  - Acceptatiecriteria: de file bevat een "Deadline (date+time) feature" sectie met concrete taken.
  - Geschat: 0.25–0.5 uur

- ✅ Voeg datetime-local input toe aan HTML-formulier
  - Voeg een `<input type="datetime-local" id="todo-deadline">` toe aan het formulier voor nieuwe todos in `Versie 1.0/index.html` met label "Deadline".
  - Files: `todo-app/Versie 1.0/index.html`
  - Acceptatiecriteria:
    - Form bevat `<input type="datetime-local" id="todo-deadline">`.
    - Input is focusbaar en laat datum + tijd selecteren.
  - Geschat: 0.5–1 uur

- ✅ Breid todo-model uit met `deadline` (ISO datetime)
  - Pas `scripts/app.js` aan zodat elk todo-object optioneel een `deadline` property heeft (ISO 8601 string of `null`).
  - Files: `todo-app/Versie 1.0/scripts/app.js`
  - Acceptatiecriteria:
    - Todos kunnen `deadline` bevatten als ISO-string of `null`.
    - `getTodosFromStorage()` en `saveTodosToStorage()` blijven werken.
  - Geschat: 0.5–1 uur

- ✅ Lees deadline in bij toevoegen van nieuwe todo
  - Bij toevoegen: lees `#todo-deadline`, converteer/normaliseer naar ISO (inclusief tijd) of `null` en voeg toe aan het todo-object voordat opslaan en renderen.
  - Files: `todo-app/Versie 1.0/scripts.app.js`, `todo-app/Versie 1.0/index.html`
  - Acceptatiecriteria:
    - Toegevoegde todo met datetime blijft aanwezig na reload.
    - Stored object bevat `deadline` als ISO datetime of `null`.
  - Geschat: 0.5–1 uur


 - ✅ Render deadline (datum + tijd) in de DOM
  - Pas `renderTodo` aan om een `<span class="todo-deadline">` te tonen met menselijk geformatteerde datum + tijd (locale short). Als geen deadline, toon `--` of verborgen element.
  - Files: `todo-app/Versie 1.0/scripts/app.js`, `todo-app/Versie 1.0/styles/style.css`
  - Acceptatiecriteria:
    - Deadline zichtbaar en leesbaar bij todos met deadline.
    - Geen deadline toont placeholder `--`.
  - Geschat: 0.5–1 uur

 - ✅ Input-validatie voor datetime
  - Valideer dat `datetime-local` input produceert een geldige datetime; blokkeer toevoegen als invalid; toon inline foutmelding.
  - Files: `todo-app/Versie 1.0/scripts/app.js`, `todo-app/Versie 1.0/index.html`, `todo-app/Versie 1.0/styles/style.css`
  - Acceptatiecriteria:
    - Ongeldige of incomplete waarde wordt geweigerd met zichtbare foutmelding.
    - Geldige waarde laat toevoegen toe.
  - Geschat: 0.5–1 uur


 - ✅ Ondersteun deadline bewerken (edit mode)
  - In edit-mode: vervang deadline-text met `<input type="datetime-local">` en voorvul met huidige value. Opslaan update model+storage; annuleren herstelt oude value.
  - Files: `todo-app/Versie 1.0/scripts.app.js`, `todo-app/Versie 1.0/index.html`
  - Acceptatiecriteria:
    - Edit toont datetime-local input met bestaande waarde.
    - Opslaan persist de nieuwe waarde; annuleren behoudt oude.
  - Geschat: 1–2 uur

- ✅ Clear deadline in edit mode
  - Voeg tijdens edit een 'Clear deadline' knop/checkbox die de deadline op `null` zet en persist.
  - Files: `todo-app/Versie 1.0/scripts/app.js`, `todo-app/Versie 1.0/index.html`, `todo-app/Versie 1.0/styles/style.css`
  - Acceptatiecriteria:
    - Gebruiker kan deadline verwijderen; na opslaan is deadline `null` in storage en DOM.
  - Geschat: 0.5–1 uur

- ✅ Visuele status: overdue / due-soon / none (met tijd)
  - Implementeer logica die deadlines vergelijkt met huidige tijd (locale) en items labelt: `.overdue` (in verleden), `.due-soon` (binnen 48 uur), `.no-deadline`.
  - Files: `todo-app/Versie 1.0/scripts/app.js`, `todo-app/Versie 1.0/styles/style.css`
  - Acceptatiecriteria:
    - Overdue items krijgen `.overdue` styling.
    - Items binnen 48 uur `.due-soon`.
    - Items zonder deadline `.no-deadline`.
  - Geschat: 1–2 uur

- ✅ Persistente opslag en compatibiliteit (save after changes)
  - Zorg dat add/edit/clear/reorder/save alle `saveTodosToStorage()` aanroepen en `renderTodos()` refresht; behoud compatibiliteit met drag/drop en edit/delete features.
  - Files: `todo-app/Versie 1.0/scripts/app.js`
  - Acceptatiecriteria:
    - Wijzigingen blijven na reload.
    - Reorder/drag-drop werkt nog.
  - Geschat: 0.5–1 uur

- ✅ Optioneel: sorteer/filtreer op deadline (view-only)
  - Voeg toggle voor 'Sorteer op deadline' of filter 'Toon overdue' die een transient view sorteert (overschrijft de onderliggende array niet tenzij bevestigd).
  - Files: `todo-app/Versie 1.0/index.html`, `todo-app/Versie 1.0/scripts/app.js`, `todo-app/Versie 1.0/styles/style.css`
  - Acceptatiecriteria:
    - Toggle sorteert items op deadline; uitschakelen herstelt originele volgorde.
  - Geschat: 1–3 uur

- [-] Update README en `tasks.md` met voorbeelden en tests
- [-] Update README en `tasks.md` met voorbeelden en tests
  - Documenteer modelwijziging (voorbeeld JSON met `deadline`) en QA-stappen in `Versie 1.0/README.md` en `todo-app/tasks.md`.
  - Files: `todo-app/Versie 1.0/README.md`, `todo-app/tasks.md`
  - Acceptatiecriteria:
    - Documentatie bevat voorbeeld JSON en korte testinstructies (add/edit/clear/reload).
  - Geschat: 0.5–1 uur

- 🔲 Handmatige QA: testplan uitvoeren
- 🔲 Handmatige QA: testplan uitvoeren

- ✅ Default time for deadline: 23:59
  - Wanneer gebruiker een datum invoert zonder tijd (of tijd is 00:00) wordt 23:59 gebruikt als default tijd.
  - Files: `todo-app/Versie 1.0/scripts/app.js`, `todo-app/Versie 1.0/index.html`
  - Acceptatiecriteria:
    - Een ingevoerde datum zonder tijd (bijv. "2025-10-21") wordt opgeslagen met tijd 23:59.
    - Een ingevoerde datetime met tijd 00:00 wordt vervangen door 23:59 op opslaan.
    - Visual states en sortering werken correct met ge-normaliseerde deadlines.

- ✅ Default date for deadline: tomorrow
  - Wanneer gebruiker geen datum invult, wordt morgendaag gebruikt met tijd 23:59.
  - Files: `todo-app/Versie 1.0/scripts/app.js`, `todo-app/Versie 1.0/index.html`
  - Acceptatiecriteria:
    - Als het deadlineveld leeg is bij toevoegen, wordt een deadline voor morgen 23:59 ingesteld en persistent opgeslagen.
    - Het formulier toont morgendaagse 23:59 als default voor de volgende invoer.
  - Voer tests uit: add met/zonder deadlines, edit deadline, clear, check overdue/due-soon, reorder, delete, reload. Noteer regressies.
  - Files: manual
  - Acceptatiecriteria:
    - Alle kernflows werken zonder regressie.
  - Geschat: 1–2 uur
