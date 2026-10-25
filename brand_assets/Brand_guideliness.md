# Random Tattoo Studio — Brand Guidelines

Verzija 1.0 · Beograd

---

## Sadržaj

1. [Boje](#boje)
2. [Tipografija](#tipografija)
3. [Prostor](#prostor)
4. [Kompozicija](#kompozicija)
5. [Logo](#logo)
6. [CSS](#css)

---

## Boje

| Ime | Hex | RGB | Upotreba |
|---|---|---|---|
| **Soot** | `#151110` | 21, 17, 16 | Primarna pozadina. Topla crna sa crvenim podtonom — nikad `#000000` |
| **Bone** | `#F4EEE7` | 244, 238, 231 | Naslovi, logo, primarni tekst. Toplo belo — nikad `#FFFFFF` |
| **Ash** | `#96877E` | 150, 135, 126 | Sekundarni tekst, labele, metapodaci |
| **Ember** | `#C0392B` | 192, 57, 43 | Akcent. Isključivo CTA i hover |
| **Clay** | `#34241F` | 52, 36, 31 | Razdelnici, ivice, retke kartice |

### Pravila

**Ember je jedina boja na sajtu.** Samo dugmad i hover stanja. Nikad naslovi, nikad ikonice, nikad dekoracija. Kad korisnik vidi crveno — tu se klikće.

**Zašto:** galerija je puna kože i mastila. Ako se crvena poseje po celom sajtu, tuče se sa radovima — a radovi prodaju, ne interfejs.

**Clay se koristi štedljivo.** Sekcije se razdvajaju **prostorom, ne karticama**. Čim počneš da stavljaš pozadine i okvire, gubiš ceo efekat.

### Ratio

```
70%  Soot
20%  Bone / Ash
 7%  Clay
 3%  Ember
```

### Kontrast

| Kombinacija | Ratio | Status |
|---|---|---|
| Bone na Soot | 15.2:1 | AAA |
| Bone na Clay | 12.4:1 | AAA |
| Ash na Soot | 5.8:1 | AA |
| Bone na Ember | 4.9:1 | AA |
| Ember na Soot | 4.1:1 | Samo 18px+ ili bold |

### Svetla varijanta

Za podstranice sa dužim tekstom (FAQ, About) invertuj: Bone pozadina, Soot tekst, Ash sekundarni. Ember ostaje akcent.

> Tamno za galeriju i hero. Svetlo za čitanje.

---

## Tipografija

Sajt se nosi tipografijom, ne dizajnom. Ovo je srce brenda.

### Archivo Black — naslovi

| Nivo | Veličina | Line-height | Letter-spacing |
|---|---|---|---|
| Display | `clamp(64px, 9vw, 140px)` | 0.95 | -0.02em |
| H1 | `clamp(48px, 6vw, 88px)` | 1.0 | -0.015em |
| H2 | `clamp(36px, 4vw, 56px)` | 1.1 | -0.01em |
| H3 | `24px` | 1.3 | 0 |

**Negativan letter-spacing je obavezan.** Archivo Black u velikim veličinama ima previše vazduha između slova — bez zbijanja izgleda razliveno.

**Line-height ispod 1.0 na displayu.** Redovi treba skoro da se dodiruju. To pravi blok, a blok je ono što udara.

Uppercase za sve naslove. Maksimalno 5 reči — ako ne staje, nije naslov nego telo teksta.

**Ne koristiti** za: telo teksta, dugmad, forme, bilo šta ispod 20px.

### Inter — sve ostalo

| Nivo | Veličina | Line-height | Težina | Napomena |
|---|---|---|---|---|
| Lead | `22px` | 1.6 | 400 | Uvodni pasus ispod naslova |
| Body | `17px` | 1.8 | 400 | |
| Small | `14px` | 1.6 | 400 | |
| Label | `12px` | — | 500 | Uppercase, letter-spacing 0.2em, Ash |
| Dugmad | `14px` | — | 500 | Uppercase, letter-spacing 0.08em |

**Line-height 1.8 na telu.** Veći od standardnog. Tekst mora da diše kao i sve ostalo.

**Širina teksta: max 60 karaktera.** Uža kolona nego obično — tera na kratke, jasne rečenice.

### Sekcijske labele

```
// GALERIJA
// ARTISTI
// PROCES
```

Inter 500 · 12px · uppercase · letter-spacing 0.2em · Ash. Dvostruka kosa crta je deo sistema.

### Pravilo

> Naslovi udaraju, telo diše. Nikad ne mešaj — Archivo Black nema regular težinu i ne može da nosi tekst.

---

## Prostor

Ovde se odlučuje da li izgleda kao galerija ili kao neuspeo sajt.

### Margine

| Breakpoint | Bočna margina |
|---|---|
| Desktop | `120px` (ili max-width 1400px, centrirano) |
| Tablet | `64px` |
| Mobile | `24px` |

Sadržaj **nikad ne dodiruje ivicu ekrana** — osim galerije slika.

### Vertikalni ritam

| Razmak | Vrednost |
|---|---|
| Između sekcija | `clamp(120px, 15vh, 200px)` |
| Unutar sekcije | `48px` |
| Naslov → telo | `32px` |
| Labela → naslov | `24px` |

**Razmak između sekcija je ogroman i to je namerno.** Skrol treba da ima pauze. Ako se sve vidi odjednom, izgubio si.

### Skala razmaka

Koristi samo ove vrednosti — ništa između:

```
8 · 16 · 24 · 32 · 48 · 64 · 96 · 120 · 160 · 200
```

### Grid

12 kolona, gap 32px. Ali **retko koristi svih 12.**

- Tekst → 5–7 kolona
- Naslovi → 8–10 kolona

Prazne kolone su deo kompozicije.

---

## Kompozicija

**Asimetrija umesto centriranja.** Naslovi levo poravnati. Centriran tekst na velikoj tipografiji izgleda kao prezentacija.

**Jedna ideja po ekranu.** Hero je samo naslov i jedno dugme. Ne gura se sve u prvi ekran.

**Slike idu edge-to-edge ili u uskoj koloni.** Ništa između — polovična širina izgleda neodlučno.

**Sekcijske labele lebde.** Stoje izolovano iznad naslova, 24px razmaka, Ash boja. Sitne, tihe, ali daju strukturu.

---

## Logo

- Bone na Soot. **Nikad Ember.**
- Minimalna veličina: `32px`
- Prazan prostor: **minimum dve visine logoa** sa svake strane
- Preko fotografije: obavezan Soot overlay na 60%

### Zabranjeno

- Rotiranje
- Rastezanje / deformacija
- Senke i efekti
- Uokvirivanje

---

## CSS

### Import

```html
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500&display=swap" rel="stylesheet">
```

### Varijable

```css
:root {
  /* Boje */
  --soot:  #151110;
  --bone:  #F4EEE7;
  --ash:   #96877E;
  --ember: #C0392B;
  --clay:  #34241F;

  --ember-hover: #A32F24;
  --clay-border: #3F2C26;

  /* Fontovi */
  --font-display: 'Archivo Black', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Tipografska skala */
  --display: clamp(64px, 9vw, 140px);
  --h1: clamp(48px, 6vw, 88px);
  --h2: clamp(36px, 4vw, 56px);
  --h3: 24px;

  /* Prostor */
  --margin: clamp(24px, 8vw, 120px);
  --section-gap: clamp(120px, 15vh, 200px);

  /* Ostalo */
  --radius: 4px;
}
```

**Radius 4px — i to samo na dugmadima.** Sve ostalo oštri uglovi. Prati geometriju logoa.