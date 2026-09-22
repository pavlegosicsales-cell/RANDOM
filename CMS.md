# CMS (Sanity) — kako radi i kako se pusta u rad

Sajt je i dalje obican statican HTML. Sanity mu je dodat sa strane: pri svakom
deployu Vercel pokrene `node cms/build.mjs`, koji povuce sadrzaj iz Sanityja i
upise ga u kopiju sajta u `dist/`. To `dist/` se servira.

**Ako Sanity nije podesen ili ne odgovara, build ne puca** — `dist/` ostane verna
kopija repozitorijuma, tj. sajt kakav je sada. Nijedna greska u CMS-u ne moze
da obori produkciju.

```
Sanity Studio  --(publish)-->  webhook  -->  Vercel deploy
                                               |
                          cms/build.mjs: izvor + sadrzaj  ->  dist/  -> sajt
```

## Fajlovi

| Fajl | Sta radi |
|---|---|
| `cms/build.mjs` | Deploy build. Kopira izvor u `dist/`, pa upise sadrzaj iz Sanityja. |
| `cms/extract.mjs` | Cita postojeci sajt i pravi `studio/seed.ndjson` (pocetni sadrzaj za Sanity). |
| `cms/patch-source.mjs` | Jednokratno. Vec je odradjen — ubacio je CMS markere u izvorne fajlove. |
| `cms/seed-to-fixture.mjs` | Pravi `studio/fixture.json` za lokalni test bez Sanityja. |
| `studio/` | Sanity Studio (sema + konfiguracija). Ne deployuje se na Vercel. |
| `vercel.json` | Govori Vercelu da pokrene build i servira `dist/`. |

Markeri u izvoru koje build trazi — **ne brisati ih**:

- `i18n.js`: `/* CMS:DICT:START */ ... /* CMS:DICT:END */` (recnik, 193 kljuca)
- `script.js`: `/* CMS:DATA:START */ ... /* CMS:DATA:END */` (umetnici + radovi)
- `styles.css`: `/* CMS:IMAGES */` (hero slika iz CMS-a se dopisuje na kraj)

## Pustanje u rad — koraci koji traze tvoj nalog

### 1. Napravi Sanity projekat

```bash
cd studio
npm install
npx sanity login          # otvara browser
npx sanity init --project-plan free
```

Zapisi `projectId` koji dobijes.

### 2. Postavi projectId lokalno

Napravi `studio/.env` (gitignore-ovan):

```
SANITY_STUDIO_PROJECT_ID=tvoj_project_id
SANITY_STUDIO_DATASET=production
```

### 3. Ubaci postojeci sadrzaj sajta u Sanity

`studio/seed.ndjson` je vec napravljen i sadrzi sve sto danas stoji na sajtu:
193 teksta u 18 sekcija, 3 umetnika sa 76 radova, 4 recenzije, 6 blog clanaka
sa punim tekstom na oba jezika.

```bash
cd studio
npx sanity dataset import seed.ndjson production --replace
```

Ako kasnije menjas sajt rucno pa hoces da osvezis seed: `node cms/extract.mjs`.

### 4. Otvori CORS za citanje (potrebno za build)

U `sanity.io/manage` → projekat → **API** → Dataset `production` mora da bude
**public** (build cita bez tokena). Ako radije zelis privatan dataset, treba
dodati token u `cms/build.mjs` — reci pa ubacim.

### 5. Objavi Studio klijentu

Za ovo treba token sa ulogom **Deploy Studio (Token only)** — Editor token nema
pravo da objavi panel:

```bash
cd studio
SANITY_AUTH_TOKEN=<deploy_token> npx sanity deploy
```

Hostname je globalan za ceo Sanity, `random` je zauzet, zato `randomtattoo`.

Zatim u `sanity.io/manage` → **Members** → pozovi klijenta mejlom.
Besplatan plan nosi 3 korisnika.

### 6. Poveži Vercel

U Vercel projektu `random` → Settings → Environment Variables:

```
SANITY_PROJECT_ID = tvoj_project_id
SANITY_DATASET    = production
```

Build Command i Output Directory se **ne diraju rucno** — `vercel.json` ih vec
postavlja (`node cms/build.mjs` → `dist`).

### 7. Webhook: objava u Sanityju okida deploy

1. Vercel → Settings → Git → **Deploy Hooks** → napravi hook za granu `main`,
   kopiraj URL.
2. `sanity.io/manage` → projekat → **API** → **Webhooks** → Create webhook:
   - URL: nalepljen deploy hook
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
   - HTTP method: POST

Od tog trenutka klijentov "Publish" znaci nov deploy za ~40 sekundi.

## Lokalni rad

```bash
# Studio na localhost:3333
cd studio && npx sanity dev

# Test build bez Sanityja (koristi fixture napravljen iz seeda)
node cms/seed-to-fixture.mjs
CMS_FIXTURE=studio/fixture.json node cms/build.mjs
npx serve dist            # ili: python -m http.server 8771 --directory dist

# Pravi build (kao na Vercelu)
SANITY_PROJECT_ID=xxx node cms/build.mjs
```

## Sta klijent moze da menja

- **Tekstovi po sekcijama** — sve sto je tekst na sajtu, srpski i engleski.
  Ako engleski ostavi prazan, prikazuje se srpski.
- **Umetnici** — ime, stil, Instagram, portret, uvodni tekst, lista radova
  (dodavanje, brisanje, redosled, zamena slike) i **link za zakazivanje**.
  Polje `calLink` je oblika `randomtattoo/konsultacija-mile` i odredjuje koji
  se kalendar otvara kad neko zakazuje kod tog umetnika. Menja se bez koda.
- **Recenzije** — ime, broj zvezdica, tekst.
- **Blog** — postojecih 6 clanaka i novi clanci. Nov clanak dobija svoju stranu
  automatski pri sledecem deployu.
- **Slike i podesavanja** — hero slika i slika za deljenje na mrezama.

Slike koje klijent ne dira ostaju postojece sa sajta (polje `localPath`), pa
Sanity ne mora da nosi svih 76 radova odmah.

## Kad dodajes novo polje na sajt

1. Dodaj tekst u `i18n.js` unutar CMS markera i `data-i18n="kljuc"` u HTML.
2. `node cms/extract.mjs` — seed se osvezi.
3. `cd studio && npx sanity dataset import seed.ndjson production --replace`

Uvoz sa `--replace` gazi ono sto je klijent u medjuvremenu promenio. Ako je
klijent vec poceo da radi, umesto toga dodaj polje rucno u Studiju.
