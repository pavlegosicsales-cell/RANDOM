/* =========================================================
   EXTRACT — cita postojeci sajt i pravi seed za Sanity.

   Cilj: klijent u Studiju zatekne SVE tekstove, umetnike, recenzije
   i blog clanke onako kako danas stoje na sajtu. Nista se ne kuca rucno.

   Pokretanje:  node cms/extract.mjs
   Rezultat:    studio/seed.ndjson  (uvozi se sa `sanity dataset import`)
   ========================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

/* ---------- 1. RECNIK (i18n.js) ---------------------------
   Objekat `var T = { ... };` vadimo kao tekst pa ga ozivimo kroz
   new Function — nema parsiranja regexom, nema gresaka sa navodnicima. */
function readDict() {
  const src = read('i18n.js');
  const start = src.indexOf('var T = {');
  const end = src.indexOf('\n  };', start);
  if (start < 0 || end < 0) throw new Error('Ne nalazim recnik T u i18n.js');
  const body = src.slice(start + 'var T = '.length, end + '\n  }'.length);
  return new Function('return ' + body)();
}

/* ---------- 2. UMETNICI I DIMENZIJE (script.js) ---------- */
function readJsObject(src, name) {
  const start = src.indexOf('var ' + name + ' = {');
  if (start < 0) throw new Error('Ne nalazim ' + name + ' u script.js');
  // trazimo zatvaranje na istoj indentaciji: "\n  };"
  const end = src.indexOf('\n  };', start);
  const body = src.slice(start + ('var ' + name + ' = ').length, end + '\n  }'.length);
  return new Function('return ' + body)();
}

/* ---------- 3. SEKCIJE ------------------------------------
   Kljuc 'home.gal.title' -> sekcija 'home'. Klijent u Studiju vidi
   nekoliko dokumenata po celinama umesto 187 razbacanih polja. */
const SECTION_TITLES = {
  nav:     'Navigacija',
  common:  'Zajednicki tekstovi',
  home:    'Pocetna strana',
  gal:     'Galerija',
  art:     'Umetnici (sekcija)',
  artist:  'Umetnik (pojedinacna strana)',
  proc:    'Proces',
  rev:     'Recenzije',
  stat:    'Brojke',
  faq:     'Cesta pitanja',
  contact: 'Kontakt',
  consult: 'Konsultacija',
  form:    'Obrazac',
  footer:  'Podnozje',
  blog:    'Blog',
  tag:     'Oznake',
  lmap:    'Lokacija / mapa',
  lang:    'Prekidac jezika',
  cal:     'Zakazivanje (izbor umetnika)'
};

/* Ljudske etikete za polja koja klijent stvarno dira. Sve ostalo dobija
   etiketu iz samog kljuca — i dalje citljivo, samo manje doterano. */
const LABELS = {
  'home.title1':   'Hero naslov, prvi red',
  'home.title2':   'Hero naslov, drugi red',
  'home.lead':     'Hero podnaslov',
  'home.status':   'Status traka (npr. Primamo nove klijente)',
  'home.gal.title':'Galerija, naslov',
  'home.gal.lead': 'Galerija, uvodni tekst',
  'home.rev.title':'Recenzije, naslov',
  'home.rev.lead': 'Recenzije, uvodni tekst',
  'nav.cta':       'Tekst glavnog dugmeta',
  'contact.phone': 'Telefon',
  'contact.email': 'Email',
  'contact.address':'Adresa',
  'contact.hours': 'Radno vreme'
};

function labelFor(key, sr) {
  if (LABELS[key]) return LABELS[key];
  const short = (sr || '').replace(/\s+/g, ' ').trim();
  return short.length > 42 ? short.slice(0, 42) + '…' : (short || key);
}

/* ---------- 4. RECENZIJE (index.html) --------------------- */
function readReviews(dict) {
  const html = read('index.html');
  const out = [];
  const re = /<blockquote class="review">([\s\S]*?)<\/blockquote>/g;
  let m, i = 0;
  while ((m = re.exec(html))) {
    i++;
    const block = m[1];
    const who = (block.match(/class="review__who">([^<]*)</) || [])[1] || '';
    const stars = ((block.match(/class="review__stars"[^>]*>([^<]*)</) || [])[1] || '').trim().length;
    const key = 'rev.' + i + '.text';
    out.push({
      _id: 'review-' + i,
      _type: 'review',
      order: i,
      author: who.trim(),
      stars: stars || 5,
      key,
      sr: (dict[key] && dict[key].sr) || '',
      en: (dict[key] && dict[key].en) || ''
    });
  }
  return out;
}

/* ---------- 5. BLOG CLANCI -------------------------------- */
function paragraphsToPortableText(htmlChunk, lang) {
  const paras = [...htmlChunk.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  ).filter(Boolean);
  return paras.map((text, i) => ({
    _type: 'block',
    _key: lang + '-p' + i,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: lang + '-s' + i, text, marks: [] }]
  }));
}

function readBlogPosts(dict) {
  const files = fs.readdirSync(ROOT).filter((f) => /^blog-[a-z-]+\.html$/.test(f) && f !== 'blog-post.html');
  return files.map((file, idx) => {
    const html = read(file);
    const slug = file.replace(/^blog-|\.html$/g, '');
    const titleKey = (html.match(/class="post-title" data-i18n="([^"]+)"/) || [])[1] || '';
    const cover = (html.match(/<div class="post-cover wrap"><img src="([^"]+)"[^>]*alt="([^"]*)"[^>]*width="(\d+)" height="(\d+)"/) || []);
    const bodies = [...html.matchAll(/<div class="post-body wrap reveal" lang="(sr|en)">([\s\S]*?)<\/div>/g)];
    const bodySr = bodies.find((b) => b[1] === 'sr');
    const bodyEn = bodies.find((b) => b[1] === 'en');
    return {
      _id: 'post-' + slug,
      _type: 'blogPost',
      slug,
      file,
      order: idx + 1,
      titleKey,
      titleSr: (dict[titleKey] && dict[titleKey].sr) || '',
      titleEn: (dict[titleKey] && dict[titleKey].en) || '',
      metaTitle: (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '',
      metaDescription: (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '',
      readMinutes: parseInt((html.match(/<p class="post-meta">(\d+)/) || [])[1] || '4', 10),
      coverLocal: cover[1] || '',
      coverAlt: cover[2] || '',
      coverW: parseInt(cover[3] || '1600', 10),
      coverH: parseInt(cover[4] || '900', 10),
      bodySr: bodySr ? paragraphsToPortableText(bodySr[2], 'sr') : [],
      bodyEn: bodyEn ? paragraphsToPortableText(bodyEn[2], 'en') : []
    };
  });
}

/* ---------- 6. SKLAPANJE SEED-a --------------------------- */
const dict = readDict();
const script = read('script.js');
const ARTISTS = readJsObject(script, 'ARTISTS');

const docs = [];

// 6a. tekstovi po sekcijama
const sections = {};
for (const [key, val] of Object.entries(dict)) {
  const sec = key.split('.')[0];
  (sections[sec] ||= []).push({
    _type: 'textItem',
    _key: key.replace(/\./g, '_'),
    key,
    label: labelFor(key, val.sr),
    sr: val.sr || '',
    en: val.en || ''
  });
}
for (const [sec, items] of Object.entries(sections)) {
  docs.push({
    _id: 'text-' + sec,
    _type: 'textSection',
    section: sec,
    title: SECTION_TITLES[sec] || sec,
    items
  });
}

// 6b. umetnici + njihovi radovi (lokalne putanje; klijent moze da zameni uploadom)
let artistOrder = 0;
for (const [id, a] of Object.entries(ARTISTS)) {
  artistOrder++;
  // Radovi su u script.js eksplicitna lista (posle cms/patch-source.mjs)
  const works = (a.works || []).map((w, i) => ({
    _type: 'work',
    _key: (w.src || '').replace(/^.*\/|\.jpg$/g, '') || (id + '-' + (i + 1)),
    localPath: w.src,
    alt: w.alt || '',
    width: w.w,
    height: w.h
  }));
  docs.push({
    _id: 'artist-' + id,
    _type: 'artist',
    artistId: id,
    order: artistOrder,
    name: a.name,
    cat: a.cat,
    styleSr: a.style.sr, styleEn: a.style.en,
    ig: a.ig, igUrl: a.igUrl, calLink: a.calLink || 'randomtattoo/konsultacije',
    portraitLocal: a.portrait,
    leadSr: a.lead.sr, leadEn: a.lead.en,
    descSr: a.desc.sr, descEn: a.desc.en,
    works
  });
}

// 6c. recenzije
docs.push(...readReviews(dict));

// 6d. blog
docs.push(...readBlogPosts(dict));

// 6e. podesavanja (slike koje nisu u sadrzaju, a klijent ih menja)
docs.push({
  _id: 'settings',
  _type: 'settings',
  heroLocal: 'assets/hero-collage.jpg',
  heroMobileLocal: 'assets/hero-collage.jpg',
  ogImage: 'https://randomtattoo.rs/assets/og-image.jpg'
});

const out = docs.map((d) => JSON.stringify(d)).join('\n') + '\n';
fs.mkdirSync(path.join(ROOT, 'studio'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'studio/seed.ndjson'), out, 'utf8');

const counts = docs.reduce((acc, d) => ((acc[d._type] = (acc[d._type] || 0) + 1), acc), {});
console.log('studio/seed.ndjson zapisan');
console.log(Object.entries(counts).map(([t, n]) => '  ' + t + ': ' + n).join('\n'));
console.log('  ukupno tekstualnih kljuceva: ' + Object.keys(dict).length);
