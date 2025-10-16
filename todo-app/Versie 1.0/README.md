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
