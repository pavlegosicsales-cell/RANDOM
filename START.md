# Random Tattoo Studio — odakle da nastavis

Kloniraj repo i to je to. Sve sto treba za rad je unutra.

```bash
git clone https://github.com/pavlegosicsales-cell/RANDOM.git
cd RANDOM
```

Nista se ne instalira za obican rad na sajtu. Sajt je statican HTML, bez build
koraka u razvoju.

## Pokreni sajt lokalno

```bash
cd site
python -m http.server 8770
```

Pa otvori `http://localhost:8770`. To je jedini link koji se koristi za pregled.

Ako hoces da vidis kako sajt izgleda sa svezim sadrzajem iz CMS-a:

```bash
SANITY_PROJECT_ID=dmndew9n node site/cms/build.mjs
cd site/dist && python -m http.server 8771
```

## Sta je gde

| Folder | Sta je unutra |
|---|---|
| `site/` | sam sajt. HTML, styles.css, script.js, cal.js, i18n.js |
| `site/cms/` | build koji spaja Sanity sa sajtom; objasnjeno u `site/CMS.md` |
| `site/studio/` | Sanity Studio (seme sadrzaja) |
| `site/apps-script/` | backend forme, Google Apps Script + uputstvo |
| `assets/` | originalne fotke sa telefona, izvorni materijal |
| `brand_assets/` | logotipi, portreti umetnika, brend smernice |
| `context/` | brifing o klijentu i brend profil |
| `research/` | teardown analize drugih sajtova |

## Jedino sto repo ne nosi

`site/studio/.env` sa Sanity tokenima. Namerno, jer je repo javan.

**Treba ti samo ako menjas seme u Sanityju ili ponovo uvozis sadrzaj.** Za
obican rad na sajtu ne treba. Ako zatreba, napravi ga ovako:

```
SANITY_STUDIO_PROJECT_ID=dmndew9n
SANITY_STUDIO_DATASET=production
SANITY_AUTH_TOKEN=<Editor token sa sanity.io/manage>
SANITY_DEPLOY_TOKEN=<Deploy Studio token>
```

Tokeni se prave na `sanity.io/manage` → projekat → API → Tokens.

## Deploy

Push na `main` i Vercel sam gradi. Build komanda i izlazni folder stoje u
`vercel.json` u korenu, Vercelu se nista ne podesava rucno.

Klijentova objava u Sanityju takodje okida deploy, preko webhook-a.

## Sta je ziv sistem

| | |
|---|---|
| Sajt | https://randomtattoo.rs |
| CMS za klijenta | https://randomtattoo.sanity.studio |
| Zakazivanje | Cal nalog `randomtattoo`, tri termina po umetniku |
| Forma | salje u Google tabelu + mejl, preko Apps Script-a |

## Otvoreno, ne zaboravi

1. **Cal.eu se gasi 1. novembra 2026.** Nalog mora da predje na cal.com. Kad se
   to desi, menjaju se tri stvari: `origin` i adresa embed skripte u
   `site/cal.js`, polje `calLink` kod svakog umetnika u Sanityju, i `CAL` mapa
   u `site/apps-script/Code.gs`.
2. **Sajt je zatvoren za Google.** `noindex` na svih 13 strana i `Disallow: /` u
   `site/robots.txt`. Ceka prave recenzije od klijenta, jer su one cetiri na
   pocetnoj jos uvek izmisljene.
3. **Obavestenja sa forme idu Pavlu**, ne studiju. Kad se potvrdi da sve radi,
   `NOTIFY_TO` u Apps Script-u se menja na studijski mejl i pusta nova verzija.
4. **Klijent u Sanityju ima ulogu administratora.** Trebalo bi da bude Editor.
