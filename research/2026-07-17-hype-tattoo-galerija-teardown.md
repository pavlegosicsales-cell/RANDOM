# Site Teardown: Hype Tattoo — Galerija (Portfolio)

**URL:** https://hype-tattoo.com/gallery-page/#portfolio
**Platform:** WordPress (tema `HYPE_studio`), WP Rocket keš, jQuery + GSAP
**Date analyzed:** 2026-07-17
**Svrha:** blueprint za rekreaciju galerije na Random Tattoo Studio sajtu (vanilla, naše boje)

---

## Kako galerija zapravo radi (ključni uvid)

`<ul class="gallery-list"></ul>` je **prazan u HTML-u**. Sve pločice pravi JS preko
WordPress AJAX-a (`action: load_all_pictures`), batch po batch. Zato izgled ne postoji u
HTML-u — sav layout je u CSS-u, a struktura pločice u JS-u.

Struktura koju JS sagradi po slici:
```
li.tile
├── img.img_view_animation        (+ klasa .visible kad se učita / na scroll)
└── div.master-name-overlay       → tekst "ARTIST — {ime}"
```

Napomene o njihovom kodu (ne kopirati):
- Galerija se učitava **dvaput** — inline `fetchImages()` i modul `loadImagesWithPagination()`. Ostatak refaktora.
- Naslov "PORTFOLIO" je **zakomentarisan** u HTML-u — grid počinje odmah ispod heroja.
- Komentari lažu ("12 slika", "3 slike"); stvarna provera za skrivanje dugmeta je `response.data.length < 6`.
- Postoji i `.gallery-control-panel` (filter dugmad, tirkizni active) u CSS-u, ali NIJE u HTML-u galerije → filteri nisu aktivni na ovoj stranici. Mi VEĆ imamo filtere na galerija.html.

---

## Tech Stack (potvrđeno iz izvora)

| Tehnologija | Dokaz | Namena |
|---|---|---|
| jQuery | `jquery.js`, `jQuery.post(...)` | AJAX učitavanje slika |
| GSAP + ScrollTrigger | `gsap.min.js`, `ScrollTrigger.min.js` | reveal na scroll, skew na scroll |
| vanilla-tilt | `vanilla-tilt.min.js` | tilt kartica (druge sekcije, ne galerija) |
| AOS | `aos.js` | fade-up animacije |
| Swiper | `swiper-bundle` | slajder na drugim stranicama, ne u galeriji |

Za nas: GSAP već imamo vendorovan. jQuery/AOS/Swiper **ne** uvodimo — sve radimo vanilla + IntersectionObserver.

---

## Design System (Hype — NE naše boje)

| Uloga | Vrednost |
|---|---|
| Akcent (tirkiz) | `rgba(0, 208, 210, 1)` = `#00D0D2` |
| Outline/tekst tamni | `rgba(21, 21, 21, 1)` = `#151515` |
| Pozadina stranice | belo |
| Font | Mona-Sans, weight 600–700 |

**Za Random mapiramo:** tirkiz → `--ember`, belo → `--soot`, tamni tekst → `--bone`, Mona-Sans → Inter. Layout/hover/modal 1:1, boje naše.

---

## Grid — tačne vrednosti (iz styles.css)

```css
.gallery-list {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 6.2vw;          /* razmak do "View more" */
}
.gallery-list li {               /* === .tile === */
  flex-basis: calc((100% - 2) / 3);  /* 3 kolone; "- 2" je bug (bez jedinice) → efektivno 33.3% */
  aspect-ratio: 1 / 1.2;         /* svaka pločica malo viša od kvadrata */
  overflow: hidden;              /* zoom na hover se seče na ivici pločice */
}
.portfolio-section { padding: 0 0 12vw 0; }
```

**3 kolone, bez gapa (slika do slike), aspect-ratio 1:1.2.** Slika puni pločicu preko `object-fit: cover`.

Mobilni (mobile.css, breakpoint ~≤1024/mobilni):
```css
.gallery-list li { flex-basis: calc((100% - 0.8vw) / 2); height: 62.13vw; }  /* 2 kolone */
.portfolio-section { padding: 0 0 25.8vw 0; }
```

---

## Hover efekat (ovo je srce galerije)

Dva sloja: zoom po poziciji kursora + ime umetnika koje izranja + gradijent na dnu.

**Zoom (iz inline JS, `setupTileHoverEffect`):**
```js
image.style.transition = "transform 0.5s ease-out";
image.addEventListener('mouseover', () => image.style.transform = 'scale(1.3)');
image.addEventListener('mouseout',  () => image.style.transform = 'scale(1)');
image.addEventListener('mousemove', (e) => {
  const r = image.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width) * 100;
  const y = ((e.clientY - r.top)  / r.height) * 100;
  image.style.transformOrigin = `${x}% ${y}%`;   // zumira TAČNO gde je miš
});
```
Reveal: `scale(1.3)`, `transform-origin` prati kursor u %. To je ceo trik — izgleda kao da lupa prati miš.

**Ime umetnika (CSS):**
```css
.master-name-overlay {
  position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
  width: 100%; text-align: center; color: #fff;
  font-size: 16px; font-style: italic; font-family: "Mona-Sans", sans-serif;
  opacity: 0; transition-duration: 0.5s; z-index: 10; pointer-events: none;
}
.tile:hover .master-name-overlay { bottom: 20px; opacity: 1; }   /* izranja + klizne gore */
```

**Gradijent na dnu (CSS ::before):**
```css
.tile:before {
  content: ""; position: absolute; bottom: 0; left: 0; width: 100%; height: 20%;
  z-index: 9; opacity: 0; transition-duration: 0.3s; pointer-events: none;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
}
.tile:hover:before { opacity: 1; }
```
Mobilni: overlay i gradijent su uvek vidljivi (`opacity: 1 !important`), gradijent viši (`height: 30%`).

---

## Reveal na scroll (GSAP → mi IntersectionObserver)

```js
gsap.utils.toArray(".img_view_animation").forEach(image => {
  gsap.to(image, { scrollTrigger: {
    trigger: image, start: "top 80%", end: "top 20%",
    toggleClass: { targets: image, className: "visible" }, once: true
  }});
});
```
Slika dobija `.visible` kad joj vrh uđe na 80% visine ekrana, jednom. Kod nas: naš `.reveal` / IntersectionObserver obrazac.

---

## "View more" dugme

```css
#see-more.join-link button { width: 92.7vw; height: 6.25vw; }
#see-more { margin: 2.9vw auto 0; }
```
Skoro pun ekran, tanko, sa uglovnim markerima (`.join-link .app` glyph dugme). Kod nas već imamo
`.btn__corner` marker sistem — koristimo njega, ne uvodimo glyph.css.

Ponašanje: klik učita sledeći batch; kad batch vrati < 6 slika, dugme se sakrije.

---

## Modal (fullscreen pregled)

```css
.image-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.7);
  display: none; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { position: relative; max-width: 90%; max-height: 90%; overflow: hidden; }
.close-modal { position: absolute; top: 10px; right: 30px; font-size: 60px; color: #fff; }
#modal-image { width: 100%; height: auto; }
.nav-button { position: absolute; top: 50%; transform: translateY(-50%);
  background: rgba(0,0,0,0.5); color: #fff; border: none; padding: 10px; }
#prev-image { left: 10px; } #next-image { right: 10px; }
```
Klik na sliku → modal, `prev`/`next` kruže kroz niz sa `% imagesArray.length`.
**Kod nas VEĆ postoji `.lightbox`** sa prev/next/esc/klik-van — verovatno koristimo naš postojeći lightbox umesto da pravimo novi modal.

---

## Šta preslikavamo na Random (plan)

Naša galerija sada: `galerija.html` ima `.masonry[data-gallery]` (mozaik) + filtere (Svi/Realizam/Fine line/Blackwork) + naš `.lightbox`. Na index.html je pinovana kružna galerija.

Odluke za sledeći korak (potvrditi sa klijentom):
1. **Grid:** zameniti mozaik Hype stilom — 3 kolone, bez gapa, `aspect-ratio: 1/1.2`, `object-fit: cover`. Mobilni 2 kolone.
2. **Hover:** dodati `scale(1.3)` + `transform-origin` prati kursor + ime umetnika izranja + donji gradijent. Boje naše (ime u `--bone`).
3. **Overlay tekst:** "ARTIST — Lemson/Anja/Enco" (već imamo `cat`/`name` u ARTISTS).
4. **Reveal:** naš IntersectionObserver, `.visible` klasa, jednom.
5. **View more:** naš `.btn` sa `.btn__corner`, batch po batch (imamo 29 radova lokalno — nema AJAX, samo isecamo niz).
6. **Modal:** koristiti postojeći `.lightbox`, ne praviti novi.
7. **Boje:** tirkiz → `--ember`, sve u brend tokenima. SHARP uglovi (Hype ima border-radius na nekim mestima — mi ne).

Otvoreno pitanje za klijenta: da li ovo menja galerija.html (cela stranica) ili i galeriju na početnoj, i da li zadržavamo filtere (Hype ih nema aktivne).

---

## JS izvor — gde je šta (potvrđeno)

Povučena su 4 custom fajla teme + inline skripta iz HTML-a. Nalaz:

| Fajl | Sadržaj | Relevantno za galeriju? |
|---|---|---|
| **inline `<script>` u HTML-u** | `fetchImages()`, `setupTileHoverEffect()`, modal (open/close/prev/next) | **DA — ovo JE galerija.** Ceo grid, hover, modal, paginacija. |
| `main.js` (36 KB) | cursor canvas, meni overlay, FAQ akordeon, journey, custom paginacija | NE — grep za gallery/tile/see-more/img_view_animation = ništa |
| `pictures_reload.js` (7.6 KB) | Swiper **coverflow** slajder + VanillaTilt za DRUGU portfolio sekciju (`.portfolio-swiper-container`) | NE — to je slajder, ne grid |
| `interactive-cards.js` (3.9 KB) | rotirajuće kartice (`.why-card-list`, druga sekcija) | NE |
| `glyph-button/glyph.js` (3.5 KB) | scramble/glyph efekat na `.app` dugmadima | delimično — mi imamo svoj scramble na `.btn-primary` |

**Zaključak:** sav galerijski JS je u inline skripti koju je klijent već poslao (i koju sam
iščitao). Ništa bitno ne fali. GSAP reveal (`.img_view_animation` → `.visible`) stoji u
inline `<script>` na dnu HTML-a, ne u modulima.

Kod nas prevodimo:
- `fetchImages` (AJAX batch) → lokalni niz `WORKS` isečen po batch-u (nema backenda)
- `setupTileHoverEffect` → isti mousemove/transform-origin obrazac, vanilla
- GSAP ScrollTrigger reveal → naš IntersectionObserver + `.visible`
- modal → naš postojeći `.lightbox`

## Assets

Nema novih — koristimo naših 29 radova iz `assets/works/`. Nema fontova (Inter već učitan).
Nema slika za dugmad/ikonice (SVG strelica već postoji u projektu).

## Fajlovi izvora (u .tmp/, disposable)

- `hype_styles_styles.css` (66 KB) — glavni
- `hype_styles_mobile.css` (34 KB) — mobilni
- `hype_styles_interactive-cards.css` (1 KB) — kartice drugih sekcija, ne galerija
- `hype_glyph-button_glyph.css` (15 KB) — glyph dugme, ne koristimo
