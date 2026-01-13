[![RoddelPraat Quiz](logo.png)](https://nalassa.github.io/Roddelpraat-Quiz/)

# RoddelPraat Quiz

Een strakke, snelle **single-page quiz website** (HTML/CSS/JS) met een startscherm, vragen met optionele afbeeldingen, directe feedback per vraag en een eindscore + overzicht.

➡️ Live: https://nalassa.github.io/Roddelpraat-Quiz/

---

## Features

- ✅ Startscherm + quizflow + resultatenpagina
- ✅ **Antwoorden worden per vraag willekeurig gehusseld**
- ✅ In je data is **`antwoorden[0]` altijd het juiste antwoord**
- ✅ Feedback met “Juiste antwoord” + optionele uitleg
- ✅ Resultatenoverzicht + filter “Alleen fout”
- ✅ Mobielvriendelijk ontwerp

---

## Structuur

```

/
├─ index.html
├─ style.css
├─ app.js
├─ logo.png
├─ discord.png
└─ img/
├─ dennis-jan.jpg
├─ mark.jpg
└─ ...

````

---

## Vragen toevoegen

Open `app.js` en voeg een nieuw object toe aan `QUESTIONS`.

Belangrijk:
- **De eerste entry in `antwoorden` is altijd correct** (`antwoorden[0]`)
- De weergave wordt automatisch gehusseld (dus niet altijd bovenaan)

Voorbeeld:

```js
{
  vraag: "Jouw nieuwe vraag hier?",
  image: "img/jouwfoto.jpg",   // optioneel (laat weg of zet "" als je geen image wil)
  antwoorden: [
    "DIT IS ALTIJD HET JUISTE ANTWOORD",
    "Fout antwoord 1",
    "Fout antwoord 2",
    "Fout antwoord 3"
  ],
  uitleg: "Optioneel: korte uitleg waarom dit klopt."
},
````

**Geen afbeelding?**

* Verwijder `image:` of zet `image: ""`.

---

## Lokaal draaien

Omdat dit een statische site is, kun je het simpel openen, maar een lokale server is vaak netter (i.v.m. paden).

### Optie 1 — VS Code Live Server

* Installeer **Live Server**
* Rechtsklik `index.html` → **Open with Live Server**

### Optie 2 — Python

```bash
python -m http.server 5500
```

Ga daarna naar: `http://localhost:5500`

---

## Deploy (GitHub Pages)

1. Push je code naar GitHub
2. Repo → **Settings** → **Pages**
3. Source: **Deploy from a branch**
4. Branch: `main` (of `master`) + `/root`
5. Opslaan → je site staat live op GitHub Pages

---

## Credits / Disclaimer

* Fan-project / quiz-project.
* Afbeeldingen en namen kunnen rechten hebben van de oorspronkelijke makers/eigenaren. Gebruik materiaal waar je toestemming voor hebt of dat rechtenvrij is.

```
