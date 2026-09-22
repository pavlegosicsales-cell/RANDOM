/* =========================================================
   BUILD — sklapa sajt iz izvornih fajlova + sadrzaja iz Sanityja.

   Pokrece ga Vercel pri svakom deployu (vidi vercel.json).
   Rezultat ide u dist/ i to je ono sto se servira.

   VAZNO: ako Sanity nije podesen ili ne odgovara, build NE puca —
   dist ostaje verna kopija repozitorijuma, tj. sajt kakav je sada.
   Nijedna greska u CMS-u ne sme da obori produkciju.
   ========================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'dist');
const SKIP = new Set(['dist', 'node_modules', 'studio', 'cms', '.git', '.vercel', '.gitignore', 'package.json', 'package-lock.json', 'vercel.json', 'CMS.md']);

const PROJECT = process.env.SANITY_PROJECT_ID;
const DATASET = process.env.SANITY_DATASET || 'production';

const log = (...a) => console.log('[cms]', ...a);

/* ---------- 1. KOPIJA IZVORA U dist/ ---------------------- */
function copyTree(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (from === ROOT && SKIP.has(entry.name)) continue;
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copyTree(src, dst);
    else fs.copyFileSync(src, dst);
  }
}
fs.rmSync(OUT, { recursive: true, force: true });
copyTree(ROOT, OUT);
log('izvor kopiran u dist/');

const rd = (f) => fs.readFileSync(path.join(OUT, f), 'utf8');
const wr = (f, s) => fs.writeFileSync(path.join(OUT, f), s, 'utf8');
const exists = (f) => fs.existsSync(path.join(OUT, f));

/* ---------- 2. SADRZAJ IZ SANITYJA ------------------------ */
const GROQ = `{
  "texts": *[_type == "textSection"]{section, items[]{key, sr, en}},
  "artists": *[_type == "artist"]|order(order asc){
    artistId, name, cat, styleSr, styleEn, ig, igUrl, calLink, leadSr, leadEn, descSr, descEn,
    portraitLocal, "portraitUrl": portrait.asset->url,
    works[]{alt, localPath, width, height,
            "url": image.asset->url,
            "dims": image.asset->metadata.dimensions}
  },
  "reviews": *[_type == "review"]|order(order asc){key, author, stars, sr, en},
  "posts": *[_type == "blogPost"]|order(order asc){
    slug, file, titleKey, titleSr, titleEn, order, publishedAt, readMinutes,
    metaTitle, metaDescription, coverAlt, coverLocal,
    "coverUrl": cover.asset->url, bodySr, bodyEn
  },
  "settings": *[_id == "settings"][0]{
    heroLocal, heroMobileLocal,
    "heroUrl": hero.asset->url, "heroMobileUrl": heroMobile.asset->url,
    "ogUrl": ogImage.asset->url
  }
}`;

async function fetchContent() {
  // Lokalni test bez Sanityja: CMS_FIXTURE=putanja/do.json node cms/build.mjs
  if (process.env.CMS_FIXTURE) {
    log('citam fixture: ' + process.env.CMS_FIXTURE);
    return JSON.parse(fs.readFileSync(process.env.CMS_FIXTURE, 'utf8'));
  }
  if (!PROJECT) {
    log('SANITY_PROJECT_ID nije postavljen — dist ostaje kopija repozitorijuma');
    return null;
  }
  // NAMERNO api, a ne apicdn: build ide odmah posle klijentovog "Publish" (webhook),
  // a kesirani apicdn ume da vrati stari tekst tih par sekundi. Build se vrti jednom
  // po deployu, pa nam kes ne treba — treba nam sveze stanje.
  const url = `https://${PROJECT}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(GROQ)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error('Sanity ' + res.status + ' ' + (await res.text()).slice(0, 200));
  const json = await res.json();
  return json.result;
}

/* ---------- 3. POMOCNE ------------------------------------ */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => esc(s).replace(/"/g, '&quot;');
/* i18n.js u browseru radi: v.indexOf('<br') > -1 ? innerHTML : textContent.
   Build mora da postuje isto pravilo, inace se <br class="br-m"> pretvori u tekst. */
const escText = (s) => (String(s).indexOf('<br') > -1 ? String(s) : esc(s));

function replaceBetween(src, startMark, endMark, content) {
  const a = src.indexOf(startMark);
  const b = src.indexOf(endMark, a);
  if (a < 0 || b < 0) { log('UPOZORENJE: ne nalazim markere ' + startMark); return src; }
  return src.slice(0, a) + startMark + '\n' + content + '\n  ' + src.slice(b);
}

/* Portable Text -> HTML (pasusi, podnaslovi, liste) */
function ptToHtml(blocks) {
  if (!Array.isArray(blocks)) return '';
  const out = [];
  let list = null;
  const textOf = (b) => (b.children || []).map((c) => esc(c.text || '')).join('');
  for (const b of blocks) {
    if (b._type !== 'block') continue;
    if (b.listItem) {
      if (!list) list = [];
      list.push('<li>' + textOf(b) + '</li>');
      continue;
    }
    if (list) { out.push('<ul>' + list.join('') + '</ul>'); list = null; }
    const t = textOf(b);
    if (!t) continue;
    out.push(b.style === 'h2' ? '<h2>' + t + '</h2>' : '<p>' + t + '</p>');
  }
  if (list) out.push('<ul>' + list.join('') + '</ul>');
  return out.map((l) => '        ' + l).join('\n');
}

/* Tekst iz recnika u HTML: element sa data-i18n koji nema ugnjezdene tagove */
function injectText(html, dict) {
  html = html.replace(
    /<([a-zA-Z0-9]+)((?:[^<>"']|"[^"]*"|'[^']*')*?\sdata-i18n="([^"]+)"(?:[^<>"']|"[^"]*"|'[^']*')*)>([^<]*)<\/\1>/g,
    (m, tag, attrs, key) => {
      const v = dict[key];
      if (!v || !v.sr) return m;
      return '<' + tag + attrs + '>' + escText(v.sr) + '</' + tag + '>';
    }
  );
  html = html.replace(/<([a-zA-Z0-9]+)((?:[^<>"']|"[^"]*"|'[^']*')*)>/g, (m, tag, attrs) => {
    const am = attrs.match(/data-i18n-attr="([^"]+)"/);
    if (!am) return m;
    let out = attrs;
    for (const pair of am[1].split(',')) {
      const [attr, key] = pair.split(':').map((s) => s.trim());
      const v = dict[key];
      if (!attr || !v || !v.sr) continue;
      const re = new RegExp('\\s' + attr + '="[^"]*"');
      out = re.test(out)
        ? out.replace(re, ' ' + attr + '="' + escAttr(v.sr) + '"')
        : out + ' ' + attr + '="' + escAttr(v.sr) + '"';
    }
    return '<' + tag + out + '>';
  });
  return html;
}

/* ---------- 4. PRIMENA ------------------------------------ */
async function main() {
  let data = null;
  try {
    data = await fetchContent();
  } catch (err) {
    log('GRESKA pri citanju Sanityja:', err.message);
    log('dist ostaje kopija repozitorijuma — sajt se ne menja');
    return;
  }
  if (!data) return;

  /* 4a. recnik */
  const dict = {};
  for (const sec of data.texts || []) {
    for (const it of sec.items || []) {
      if (it && it.key) dict[it.key] = { sr: it.sr || '', en: it.en || it.sr || '' };
    }
  }
  for (const r of data.reviews || []) {
    if (r.key) dict[r.key] = { sr: r.sr || '', en: r.en || r.sr || '' };
  }
  for (const p of data.posts || []) {
    if (p.titleKey) dict[p.titleKey] = { sr: p.titleSr || '', en: p.titleEn || p.titleSr || '' };
  }
  log('kljuceva u recniku: ' + Object.keys(dict).length);

  /* 4b. i18n.js */
  if (Object.keys(dict).length) {
    const body =
      '  var T = {\n' +
      Object.entries(dict)
        .map(([k, v]) => `    ${JSON.stringify(k)}: { sr: ${JSON.stringify(v.sr)}, en: ${JSON.stringify(v.en)} }`)
        .join(',\n') +
      '\n  };';
    wr('i18n.js', replaceBetween(rd('i18n.js'), '/* CMS:DICT:START', '/* CMS:DICT:END */', body)
      .replace('/* CMS:DICT:START\n', '/* CMS:DICT:START — sadrzaj iz Sanityja */\n'));
  }

  /* 4c. umetnici i radovi -> script.js */
  if ((data.artists || []).length) {
    const CAT_ALT = {
      realizam: 'Realistična crno-bela tetovaža',
      'fine-line': 'Fine line tetovaža tankih linija',
      blackwork: 'Blackwork / grafiti tetovaža'
    };
    const obj = {};
    for (const a of data.artists) {
      if (!a.artistId) continue;
      obj[a.artistId] = {
        name: a.name || '',
        cat: a.cat || 'realizam',
        style: { sr: a.styleSr || '', en: a.styleEn || a.styleSr || '' },
        ig: a.ig || '',
        igUrl: a.igUrl || '',
        calLink: a.calLink || 'randomtattoo/konsultacije',
        portrait: a.portraitUrl || a.portraitLocal || '',
        lead: { sr: a.leadSr || '', en: a.leadEn || a.leadSr || '' },
        desc: { sr: a.descSr || '', en: a.descEn || a.descSr || '' },
        works: (a.works || []).map((w, i) => ({
          src: w.url || w.localPath || '',
          cat: a.cat || 'realizam',
          w: (w.dims && w.dims.width) || w.width || 1170,
          h: (w.dims && w.dims.height) || w.height || 1463,
          alt: w.alt || (CAT_ALT[a.cat] || 'Tetovaža') + ', ' + (a.name || '') +
               ', Random Tattoo Studio Beograd (br. ' + (i + 1) + ')'
        })).filter((w) => w.src)
      };
    }
    const block = '  var ARTISTS = ' + JSON.stringify(obj, null, 2).replace(/\n/g, '\n  ') + ';';
    wr('script.js', replaceBetween(rd('script.js'), '/* CMS:DATA:START', '/* CMS:DATA:END */', block)
      .replace('/* CMS:DATA:START\n', '/* CMS:DATA:START — sadrzaj iz Sanityja */\n'));
    log('umetnika: ' + Object.keys(obj).length + ', radova: ' +
        Object.values(obj).reduce((n, a) => n + a.works.length, 0));
  }

  /* 4d. recenzije u index.html (ime i zvezdice; tekst ide preko recnika) */
  if ((data.reviews || []).length && exists('index.html')) {
    let html = rd('index.html');
    let i = 0;
    html = html.replace(/<blockquote class="review">([\s\S]*?)<\/blockquote>/g, (m, inner) => {
      const r = data.reviews[i++];
      if (!r) return m;
      const stars = '★'.repeat(Math.max(1, Math.min(5, r.stars || 5)));
      return '<blockquote class="review">' +
        inner
          .replace(/(class="review__who">)[^<]*/, '$1' + esc(r.author || ''))
          .replace(/(class="review__stars" aria-label=")[^"]*(">)[^<]*/, '$1' +
                   (r.stars || 5) + ' od 5$2' + stars) +
        '</blockquote>';
    });
    wr('index.html', html);
  }

  /* 4e. blog clanci */
  const posts = data.posts || [];
  const template = posts.find((p) => p.file && exists(p.file));
  for (const p of posts) {
    const file = p.file && exists(p.file) ? p.file : 'blog-' + p.slug + '.html';
    let html;
    if (exists(file)) {
      html = rd(file);
    } else if (template) {
      // nov clanak koji je klijent napisao: pravimo stranu po uzoru na postojecu
      html = rd(template.file)
        .replace(new RegExp('blog-' + template.slug + '\\.html', 'g'), 'blog-' + p.slug + '.html')
        .replace(/data-i18n="blog\.[a-z-]+\.(title|cat)"/g, (m2, kind) =>
          'data-i18n="blog.' + p.slug + '.' + kind + '"');
      log('nova strana: ' + file);
    } else continue;

    if (p.metaTitle) html = html.replace(/<title>[\s\S]*?<\/title>/, '<title>' + esc(p.metaTitle) + '</title>');
    if (p.metaDescription) {
      // og:description je cesto zasebno skracen tekst — menjamo ga samo ako je
      // do sada bio doslovno isti kao meta description, da ne pregazimo namernu razliku
      const oldDesc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
      const oldOg = (html.match(/og:description" content="([^"]*)"/) || [])[1];
      html = html.replace(/(<meta name="description" content=")[^"]*(">)/, '$1' + escAttr(p.metaDescription) + '$2');
      if (oldOg != null && oldOg === oldDesc) {
        html = html.replace(/(og:description" content=")[^"]*(")/, '$1' + escAttr(p.metaDescription) + '$2');
      }
    }
    if (p.readMinutes) html = html.replace(/(<p class="post-meta">)\d+/, '$1' + p.readMinutes);
    const cover = p.coverUrl || p.coverLocal;
    if (cover) {
      html = html.replace(/(<div class="post-cover wrap"><img src=")[^"]*(")/, '$1' + escAttr(cover) + '$2');
      if (p.coverAlt) html = html.replace(/(<div class="post-cover wrap"><img src="[^"]*"[^>]*alt=")[^"]*(")/, '$1' + escAttr(p.coverAlt) + '$2');
    }
    if (p.publishedAt) {
      html = html.replace(/("datePublished":\s*")[^"]*(")/, '$1' + p.publishedAt + '$2');
      html = html.replace(/("dateModified":\s*")[^"]*(")/, '$1' + p.publishedAt + '$2');
    }
    if (p.titleSr) html = html.replace(/("headline":\s*")[^"]*(")/, '$1' + escAttr(p.titleSr) + '$2');

    const srHtml = ptToHtml(p.bodySr);
    const enHtml = ptToHtml(p.bodyEn && p.bodyEn.length ? p.bodyEn : p.bodySr);
    if (srHtml) {
      html = html.replace(/(<div class="post-body wrap reveal" lang="sr">)[\s\S]*?(<\/div>)/,
        '$1\n' + srHtml + '\n      $2');
    }
    if (enHtml) {
      html = html.replace(/(<div class="post-body wrap reveal" lang="en">)[\s\S]*?(<\/div>)/,
        '$1\n' + enHtml + '\n      $2');
    }
    wr(file, html);
  }
  log('blog clanaka obradjeno: ' + posts.length);

  /* 4f. slike iz podesavanja -> CSS */
  const s = data.settings || {};
  if (s.heroUrl || s.heroMobileUrl) {
    let css = rd('styles.css');
    const grad = "linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.44) 9%, rgba(0,0,0,0.24) 20%, rgba(0,0,0,0.24) 60%, rgba(0,0,0,0.55) 86%, var(--soot) 100%)";
    let block = '\n/* CMS: slike iz Sanityja */\n';
    if (s.heroUrl) {
      block += `.hero::before { background-image: ${grad}, url('${s.heroUrl}'); }\n`;
    }
    const mob = s.heroMobileUrl || s.heroUrl;
    if (mob) {
      block += `@media (max-width: 711px) { .hero::before { background-image: ${grad}, url('${mob}'); } }\n`;
    }
    css += block;
    wr('styles.css', css);
    log('hero slika iz CMS-a primenjena');
  }

  /* 4g. tekstovi u sve HTML strane (na kraju, da pokupi i nove strane) */
  let pages = 0;
  for (const f of fs.readdirSync(OUT)) {
    if (!f.endsWith('.html')) continue;
    wr(f, injectText(rd(f), dict));
    pages++;
  }
  log('HTML strana osvezeno: ' + pages);
}

main().catch((err) => {
  log('NEOCEKIVANA GRESKA:', err && err.stack ? err.stack : err);
  log('dist ostaje kopija repozitorijuma');
});
