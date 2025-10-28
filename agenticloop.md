 Je hebt nu context.md en tasks.md gemaakt (uit Exercise 1). Nu ga je ermee bouwen met de Agentic Loop : een 6-stappen workflow waarmee je snel en gecontroleerd code bouwt met AI. De AI gaat tasks.md en context.md automatisch updaten. Jij stuurt, reviewt, en keurt goed.
Vereisten voor deze opdracht

Voordat je aan deze opdracht begint, moet je:

    Exercise 1 afgerond hebben (je hebt context.md en tasks.md voor een todo app)
    Vue 3 basis kennen (ref, reactive, computed)
    TypeScript basis kennen
    GitHub Copilot of Claude Code geïnstalleerd hebben

De Agentic Coding Loop

De Agentic Loop is een 6-stappen workflow die je herhaalt voor elke taak. Het zorgt ervoor dat je snel bouwt, controle houdt, en continu leert.

De 6 stappen:

1. LEES        → Begrijp context, kies volgende taak uit tasks.md
2. PLAN        → AI maakt implementatieplan, jij reviewt aanpak
3. BOUW        → AI implementeert volgens goedgekeurd plan
4. VALIDEER    → Test + review code (iteratief, beide moeten goed)
5. REFLECTEER  → Waarom deze keuze? Welke patronen? Wat leerde je?
6. UPDATE      → AI update context.md (met keuzes!) + tasks.md

Stap 1: Lees

    Open context.md en refresh je geheugen over het project en de regels
    Open tasks.md en zoek de eerste 🔲 taak
    Controleer: is deze taak klein genoeg? Zo niet, split hem op

Stap 2: Plan

    Vraag de AI om een implementatieplan te maken voor deze taak
    De AI beschrijft HOE het de taak gaat aanpakken
    Jij reviewt: Is deze aanpak goed? Welke keuzes maakt de AI?
    Geef feedback als je het niet eens bent met de aanpak
    Pas door naar BOUW als je het plan goedkeurt

Waarom planning review essentieel is

De planning stap voorkomt dat je tijd verspilt aan verkeerde aanpakken:

    Je ziet wat de AI gaat doen voordat het gebeurt
    Je kunt bijsturen als de AI een verkeerde richting kiest
    Je leert anticiperen op AI-gedrag
    Je blijft in controle over de architectuur

Investeer 30 seconden in planning review, bespaar 10 minuten aan herschrijven.
Stap 3: Bouw

    De AI implementeert volgens het goedgekeurde plan
    Bij Copilot/Claude Code: code verschijnt automatisch in je files
    Bij ChatGPT/Claude.ai: kopieer de code handmatig naar je editor

Stap 4: Valideer

Nu valideer je of de implementatie goed is. Dit betekent zowel testen als code reviewen, in welke volgorde je maar wilt.

    Test: Draai de code in de browser, check of de functionaliteit werkt
    Review code: Types correct? Patterns volgens context.md? Code kwaliteit goed?
    Iteratief: Test → probleem → review → fix → test → klaar
    Beide moeten groen zijn: werkt + goede code

Vind je problemen? Klein probleem (typo, styling) → direct fixen met AI. Middelgroot (bug) → AI laten analyseren en fixen. Groot probleem (nieuwe feature nodig) → nieuwe taak maken, huidige afmaken. Vuistregel: fix > 30 min = nieuwe taak.
Wat als je problemen vindt tijdens valideren?

🟢 Klein probleem (typo, vergeten class, styling detail):

    "AI, voeg class 'delete-btn' toe aan de button"
    Test opnieuw
    ✅ Door naar reflectie

🟡 Middelgroot probleem (bug, verkeerde aanpak):

    "AI, waarom werkt de delete emit niet? Analyseer de code"
    AI geeft diagnose: "defineEmits ontbreekt"
    "Voeg defineEmits toe met TypeScript typing"
    Test opnieuw
    ✅ Door naar reflectie

🔴 Groot probleem (nieuwe feature, architectuur wijziging):

    Realisatie: "We hebben eigenlijk undo nodig"
    "AI, voeg nieuwe taak toe aan tasks.md: 'Implementeer undo voor delete'"
    Huidige taak afmaken zonder undo
    Undo komt later als aparte iteratie

Vuistregel: Als fix > 30 min = nieuwe taak. Anders: direct fixen.
Stap 5: Reflecteer

Dit is waar je leert. Stel jezelf deze vragen:

    Waarom? Waarom koos de AI deze aanpak?
    Keuzes? Welke architectuur of pattern keuzes zijn gemaakt?
    Patronen? Welk Vue 3 of TypeScript patroon zagen we hier?
    Leren? Is dit een nieuwe regel/patroon die de AI moet onthouden? Dan voeg je toe aan context.md. Zo niet, alleen tasks.md updaten. 

Stap 6: Update

    AI update tasks.md: Markeer taak als ✅, voeg notities toe (dit doe je altijd)
    AI update context.md: Voeg nieuwe keuzes, patronen of regels toe (niet altijd nodig!)
    Jij reviewt beide: Kloppen de updates?
    Approve of geef feedback

Belangrijke nuance: Je hoeft context.md niet altijd te updaten. In het begin van een project doe je dit vaker (context is nog onvolledig), later minder vaak (context is al uitgebreid). Vraag jezelf af: "Leerde ik een nieuwe regel/patroon/keuze die de AI moet onthouden?" Zo ja: update. Zo nee: alleen tasks.md.
Jouw rol vs AI rol

In de Agentic Loop hebben jij en de AI duidelijke rollen:

👤 Wat jij doet:

    Context geven (via context.md)
    Taken kiezen
    Plannen reviewen
    Code reviewen
    Testen in browser
    Feedback geven aan AI
    Keuzes maken (architectuur, patterns)
    Beslissingen nemen

🤖 Wat de AI doet:

    Plannen maken (hoe ga ik dit aanpakken?)
    Code schrijven
    Bestanden updaten (tasks.md + context.md!)
    Suggesties doen
    Uitleg geven
    Bugs oplossen

Kernpunt: Jij houdt de regie en maakt keuzes. De AI doet het repetitieve werk en update bestanden.
💡 Belangrijk: Prompts voor verschillende AI tools

Copilot / Claude Code (aanbevolen):

    Heeft automatisch toegang tot context.md en tasks.md
    Leest je hele codebase
    Prompt kan kort: "Maak een plan voor deze taak"
    Context hoeft niet herhaald te worden

ChatGPT / Claude.ai:

    Geen file access, kan context.md niet lezen
    Je moet context handmatig toevoegen
    Prompt: "Maak een plan voor deze taak. Context uit context.md: [plak hier]"
    Meer werk, maar werkt ook

Alle voorbeelden in deze opdracht zijn voor Copilot/Claude Code.

Gebruik je ChatGPT? Voeg dan de relevante delen van context.md toe aan je prompts.
Praktijkoefening: Doorloop de loop 3x

Nu ga je de 6-stappen loop oefenen door een delete feature toe te voegen aan de todo app uit Exercise 1.

Project: Vue 3 Todo Delete Feature

We gaan een delete button toevoegen waarmee gebruikers todo's kunnen verwijderen.

De taken (voorbeeld voor deze oefening):

# Tasks (voorbeeld voor deze oefening)
🔲 Voeg delete button toe aan TodoItem.vue template
🔲 Definieer delete emit in TodoItem.vue met TypeScript typing
🔲 Implementeer deleteTodo method in TodoApp.vue
🔲 Test: delete 3 todos, check of lijst correct update

Iteratie 1: Delete button toevoegen

Stap 1: LEES

    Context: Vue 3 Composition API, TypeScript, emit events
    Taak: "Voeg delete button toe aan TodoItem.vue template"
    Check: Klein genoeg? ✅ (alleen button toevoegen, geen logic)

Stap 2: PLAN

Vraag de AI om een plan:

Maak een plan voor deze taak:
"Voeg delete button toe aan TodoItem.vue template"

De AI geeft een plan:

Plan:
1. <button> element toevoegen in TodoItem template
2. Plaatsen na de todo tekst (rechts uitgelijnd)
3. Class "delete-btn" voor styling
4. Tekst: "×" symbool (universeel delete icoon)
5. Scoped CSS: position rechts, hover effect

Jij reviewt het plan:

    ✅ <button> element: goed
    ✅ × symbool: universeel, duidelijk
    ✅ Scoped CSS: volgens context.md regels
    Approve plan: "Implementeer dit plan" 

Stap 3: BOUW

De AI implementeert volgens het plan. Code verschijnt in TodoItem.vue.

Stap 4: VALIDEER

Test eerst:

    Open app in browser
    Check: verschijnt delete button? ✅
    Check: staat rechts van tekst? ❌ (staat links!)

Probleem gevonden! Klein probleem (styling):

    "AI, waarom staat de button links? Zet hem rechts met CSS"
    AI voegt float: right toe (of flexbox)
    Test opnieuw: staat rechts? ✅
    × symbool zichtbaar? ✅

Dan review code:

    HTML structuur correct? ✅
    Class "delete-btn" aanwezig? ✅
    Scoped CSS gebruikt? ✅
    Float/flexbox correct toegepast? ✅

Beide groen → door naar reflectie

Stap 5: REFLECTEER

    Waarom? Waarom koos AI × symbool? (universeel, klein, duidelijk)
    Keuze? Button rechts plaatsen (UX conventie)
    Patroon? Scoped CSS voor component styling
    Leren? × is standaard voor delete buttons → voeg toe aan context.md 

Stap 6: UPDATE

Vraag de AI om beide bestanden te updaten:

Markeer de taak als voltooid in tasks.md met notitie.

Update ook context.md met nieuwe regel:
"UI Conventions: Gebruik × symbool voor delete buttons (universeel herkenbaar)"

Beide bestanden updaten!

AI update tasks.md:

✅ Voeg delete button toe aan TodoItem.vue template
   → Gebruikt × symbool, scoped CSS, rechts geplaatst
🔲 Definieer delete emit in TodoItem.vue met TypeScript typing

AI update context.md:

Key Rules:
...
- UI Conventions: Gebruik × symbool voor delete buttons

Jij reviewt beide:

    ✅ Task correct gemarkeerd?
    ✅ Context.md regel toegevoegd?
    ✅ Regel is duidelijk en herbruikbaar?

Approve: "Perfect, ga door naar volgende taak"
AI commando voorbeelden

✅ Goede commando's (met context.md update!):

    "Markeer taak als done. Update context.md: 'Gebruik TypeScript generics voor type-safe emits'"
    "Taak voltooid. Voeg aan context.md toe: 'Gebruik computed() voor afgeleide state (reactive updates)'"
    "Update beide: task done, context.md krijgt: 'localStorage vereist JSON.stringify voor objects'"

❌ Te vage commando's:

    "Update tasks"
    "Taak af"
    "Fix het bestand"

Nu jij: Iteratie 2 en 3

Je kent nu de 6 stappen. Tijd om zelfstandig door de loop te gaan!

Iteratie 2: Definieer delete emit in TodoItem.vue

Taak uit tasks.md: "Definieer delete emit in TodoItem.vue met TypeScript typing"

Doorloop de 6 stappen: Lees → Plan → Bouw → Valideer → Reflecteer → Update

Iteratie 3: Implementeer deleteTodo method in parent

Taak uit tasks.md: "Implementeer deleteTodo method in TodoApp.vue (filter todos array)"

Doorloop de 6 stappen: Lees → Plan → Bouw → Valideer → Reflecteer → Update

Leermoment na deze iteraties:

    Je hebt nu zelfstandig door de Agentic Loop gewerkt
    Kleine taken → werkende features (delete button volledig functioneel)
    Context.md groeide met patronen en keuzes (type-safe emits, immutability)
    Je leerde AI plannen te reviewen en bij te sturen waar nodig
    Elke stap was testbaar en controleerbaar

🚀 Doorloop de resterende taken

De tasks.md heeft nog meer taken staan (input field, add functionality, styling). Doorloop deze zelfstandig met de 6-stappen loop. Dit helpt om de workflow echt eigen te maken!
Samenvatting & Wat nu?

Kernpunten:

    ✅ De loop: Lees → Plan → Bouw → Valideer → Reflecteer → Update (6 stappen)
    ✅ AI maakt plannen, jij reviewt en keurt goed
    ✅ AI update tasks.md EN context.md
    ✅ Context.md groeit met keuzes en patronen, niet alleen regels
    ✅ Kleine iteraties, planning review, beide bestanden up-to-date

🎯 Transitie naar Exercise 3

Je beheerst nu de volledige Agentic Loop met planning en context groei. In de volgende opdracht (Clicker Game) ga je een volledig project bouwen met deze workflow vanaf het begin.

AI genereert context.md, tasks.md, en alle code. Jij focust op architectuur keuzes, planning review, en kwaliteitsbewaking.

Dit is hoe professionals werken: plannen reviewen, keuzes maken, patronen bewaren.