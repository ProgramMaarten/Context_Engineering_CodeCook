# Todo App — Versie 1.0

Korte instructies om deze statische Todo-app lokaal te draaien en ontwikkelen.

Belangrijk: de app gebruikt localStorage en werkt het meest betrouwbaar wanneer de bestanden via HTTP geserveerd worden (niet `file://`).

Snelle opties:

- Python 3 ingebouwd HTTP-server:

```powershell
# vanuit deze map (Versie 1.0)
py -3 -m http.server 8000
# of
python -m http.server 8000
```

- Node.js (npx) met http-server:

```powershell
npx http-server -p 8080
# of
npx serve -s . -l 5000
```

- VS Code: gebruik de Live Server-extensie en kies `index.html` → Open with Live Server.

Startpagina: http://localhost:8000 (of het door je gekozen poortnummer).

Developer convenience:
- Er is een minimal `package.json` aanwezig. Na `npm install` kun je `npm run start` gebruiken als shortcut.

Deployment:
- Dit is een puur statische site. Je kunt de inhoud van deze map direct hosten op GitHub Pages, Netlify, Vercel of S3.

Problemen?
- Als localStorage niet lijkt te werken, zorg dat je een HTTP server gebruikt en controleer de browserconsole voor fouten.

Nieuwe features (deadline support):
- Elk todo-item kan optioneel een `deadline` bevatten als ISO 8601 string (UTC). De UI gebruikt `datetime-local` inputs en deadlines worden als locale tekst weergegeven in de lijst.
- Visual states: items met een deadline krijgen visuele klassen:
	- `.overdue` — deadline in het verleden
	- `.due-soon` — deadline binnen 48 uur
	- `.no-deadline` — geen deadline
- Sorteer-toggle: in de add-form is een checkbox toegevoegd "Sorteer op deadline" die een tijdelijk (view-only) sorteerresultaat toont zonder de opgeslagen volgorde te wijzigen.

Model voorbeeld:

```json
{
	"id": 1697780000000,
	"text": "Afmaken rapport",
	"completed": false,
	"createdAt": "2025-10-20T08:00:00.000Z",
	"deadline": "2025-10-22T12:30:00.000Z"
}
```

Manual QA checklist (snel te doorlopen locally):

1. Start de app via een eenvoudige HTTP-server (zie boven).
2. Add → zonder deadline: laat het deadlineveld leeg en voeg een taak toe.
   - Verwacht: de taak wordt toegevoegd en krijgt als deadline morgendaag 23:59 (stored als ISO).
3. Add → datum zonder tijd: typ of selecteer alleen een datum (sommige browsers laten tijd leeg); voeg toe.
   - Verwacht: de datum wordt opgeslagen met default tijd 23:59.
4. Add → datetime met tijd 00:00: voer `YYYY-MM-DDT00:00` in en voeg toe.
   - Verwacht: tijd wordt genormaliseerd naar 23:59 voor dezelfde dag.
5. Edit → wijzig deadline: open edit-mode, wijzig deadline en sla op; controleer storage.
6. Clear → gebruik clear-deadline in edit-mode en sla op; controleer dat `deadline` `null` is in storage.
7. Reorder → sleep een item naar een andere positie; refresh de pagina en verifieer dat volgorde persistent is.
8. Sort view → vink "Sorteer op deadline" aan en controleer dat items transient gesorteerd zijn op deadline (zonder opslagvolgorde te veranderen).
9. Visual states → maak test-cases: overdue (datum in verleden), due-soon (binnen 48 uur) en geen deadline; verifieer CSS styling.

Notes:
- De app slaat deadlines op als ISO UTC strings. Local display gebruikt de browser locale formatting.
- Default tijd en datum gedrag:
  - Als geen datum wordt opgegeven: morgen 23:59 wordt gebruikt.
  - Als datum wel opgegeven is maar tijd leeg of 00:00: dan wordt 23:59 gebruikt.

If you want, I can now run the manual QA (step-by-step) and record the exact results in `todo-app/tasks.md` and `Versie 1.0/README.md`.
