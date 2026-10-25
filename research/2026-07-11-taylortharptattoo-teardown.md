# Site Teardown: Taylor Tharp Tattoo  (CODE-ACCURATE v2)

**URL:** https://www.taylortharptattoo.com/
**Built by:** Neptune Studio · **Platform:** Framer (generator `Framer 6d165e2`)
**Date analyzed:** 2026-07-11
**Source of truth:** FULL code pulled directly via curl → `assets/inspo1/code/`
- `taylor.html` (605 KB, complete — all CSS is inline in 3 `<style>` blocks)
- `js/` — 26 ES modules (2.1 MB); site logic in `script_main` (948 KB)
This replaces the earlier screenshot-only teardown with facts confirmed from source.

## Tech Stack (confirmed from JS modules)
| Tech | Module | Purpose |
|---|---|---|
| Framer runtime + React | `framer.*.mjs`, `react.*.mjs`, `rolldown-runtime` | SSR page framework |
| **Framer Motion** | `motion.*.mjs` (17 refs in script_main) | All animations, incl. stat count-up |
| **Lenis smooth scroll** | `SmoothScroll_Prod.*.mjs` (`Lenis`) | Page-wide smooth scrolling |
| **Ticker (marquee)** | `Ticker.*.mjs` / `JHsR….mjs` | Auto-scrolling rows (recent works, reviews) |
| **Live clock** | `script_main` uses `Intl.DateTimeFormat` | Nav "PHOENIX 6:54 AM" real local time |
| Substack embed | `Substack.*.mjs` | VIP email capture (the only orange = Substack's own widget) |
| Material | `Material.*.mjs` | Google map embed |

## Design System (from inline CSS tokens)
### Colors — monochrome, no brand accent
| Usage | Value |
|---|---|
| Background | `#000` / `#050505` |
| Surfaces | `#0d0d0d`, `#0f0f0f`, `#161616`, `#292929` |
| Text | `#fff`; secondary `#b5b5b5`, `#666`, `rgba(255,255,255,.6)`, `.8` |
| Border/hairline | `rgba(255,255,255,.1)` (#ffffff1a) |
| Accent | none (a token `#007aff` exists but unused; only green status dot + gold review stars) |

### Type (all @font-face loaded from framerusercontent)
- **Inter** 400/700/900, **Inter Display** 400/500/700 — headings (heavy 900) + body
- **Fragment Mono** 400 — mono labels (nav clock, tags, section numbers `01 //`)
- **Clash Display** 500/600/700 + **Switzer** — loaded (alt display)

### Corners — the real site is ROUNDED
`border-radius` counts in CSS: `12px` ×6 (images/cards), `50px`/`100px` ×7 (pills), `20px` ×1, `0px` ×14 (Framer default).
→ NOTE for our build: Random brand keeps **sharp** corners (client's explicit choice); this is the main intentional deviation from the reference.

### Layout / breakpoints
- Framer breakpoints: **≥1200px** desktop, **712–1199px** tablet, **≤711px** mobile.
- Centered, max content ~1200–1440px; big vertical rhythm; subtle grain over black.
- 33 unique images loaded (gallery works, portraits, section backgrounds).

## Full Section Order + real copy (from HTML)
1. **Nav (fixed):** monogram logo + live clock "PHOENIX H:MM AM"; links GALLERY / CONTACT / ABOUT / VIP CLIENTS + "BOOK EXPERIENCE" pill.
2. **Hero:** status pill "● Accepting New Bookings"; H1 "Taylor Tharp Phoenix Tattoo Artist"; sub "Known for black and grey realism…"; buttons BOOK EXPERIENCE + VIEW GALLERY; "Scroll down to see gallery".
3. **Gallery mosaic** (rounded 12px works) + "View Full Gallery".
4. **01 // ABOUT · Since 2020 — MEET TAYLOR:** bio paragraph + tag pills (BLACK & GREY TATTOOS, REALISM, CUSTOM DESIGN, FULL SLEEVES, SELECTIVE COVER UPS, HIGH DETAIL SHADING).
5. **RECENT WORKS:** Ticker marquee row.
6. **Join the VIP List:** Substack email card.
7. **02 // PROCESS · Three Steps:** big image + 3 steps — [01] Share your vision, [02] Book your session, [03] Tattoo session (each with 3 bullets).
8. **03 // REVIEWS · VOICES — Client Reviews:** intro + image; Ticker marquee of Google review cards (Bo Bielby, Dennis Rolston, Nano Ortiz, Gabriel Randolf yap, Ryan Zapata, Kortnee Thompson — all 5.0, gold stars, "G").
9. **04 // STATS · FUN FACTS:** count-up from 0 → "Custom Tattoos +", "Client Satisfaction %", "Years of Experience +" (Framer Motion animates the numbers).
10. **05 // FAQ · Concerns:** 7 questions (aftercare, restrictions, session length, healing, prep, pain, choosing design).
11. **06 // SOCIAL · Instagram:** grid + "Text me".
12. **ARTIST AT:** Monarch Studios, 8801 N Central Ave Unit 101, Phoenix AZ 85020 + Get Directions + grayscale Google map.
13. **Footer:** columns Discover / Social Media / Contact ((480) 389-5059, EMAIL, INSTAGRAM) → giant "TAYLORTHARP" wordmark → "site by neptune studio" + "Back To Home".

## Effects — implementation (confirmed)
| Effect | How (from code) | Cloneable in vanilla |
|---|---|---|
| Smooth scroll | Lenis (`SmoothScroll_Prod`) | Yes — Lenis or CSS `scroll-behavior` |
| Recent-works / reviews auto-scroll | Framer **Ticker** (infinite marquee) | Yes — CSS keyframe translateX loop or JS |
| Live nav clock | `Intl.DateTimeFormat` per second | Yes — already built in our site |
| Stat count-up 0→N | Framer Motion `animate` on inView | Yes — IntersectionObserver + rAF counter |
| Status pill pulsing dot | CSS keyframe | Yes — already have |
| Hero faded portrait behind text | abs-positioned img, low opacity + mask | Yes — already have |
| Rounded mosaic + pills | border-radius 12/50/100px | We keep SHARP per brand |
| Giant footer wordmark | one line, clamp huge, overflow hidden | Yes — already have |

## Gaps vs. our current Random build (what to add next)
- ✅ already added in v2: live clock, status pill, mosaic, recent-works scroller, VIP list, process w/ image+steps, reviews split+cards, stats row, IG grid, giant footer.
- ⛔ intentionally different: sharp corners (not rounded), Ember accent kept, warm Soot black, Serbian content.
- ➕ could still add for closer feel: Lenis-style smooth scroll, true **marquee auto-scroll** on recent works & reviews (currently manual scroll), **count-up** on stats, "Meet" bio + tag-pill row, "Scroll down to see gallery" cue.
