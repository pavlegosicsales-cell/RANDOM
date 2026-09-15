/* =========================================================
   PATCH-SOURCE — jednokratna priprema izvornih fajlova.

   Ubacuje CMS markere i prevodi podatke o umetnicima iz "count + DIMS"
   u eksplicitnu listu radova, da build moze da zameni ceo blok jednim
   rezom umesto da pogadja regexom.

   Posle ovoga sajt radi POTPUNO ISTO i bez CMS-a — blok u fajlu je
   trenutni sadrzaj. Pokrece se jednom:  node cms/patch-source.mjs
   ========================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rd = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const wr = (f, s) => fs.writeFileSync(path.join(ROOT, f), s, 'utf8');

/* ---------- i18n.js: markeri oko recnika ---------- */
{
  let src = rd('i18n.js');
  if (src.includes('CMS:DICT:START')) {
    console.log('i18n.js vec ima markere, preskacem');
  } else {
    const start = src.indexOf('  var T = {');
    const end = src.indexOf('\n  };', start) + '\n  };'.length;
    if (start < 0 || end < 0) throw new Error('Ne nalazim recnik u i18n.js');
    src = src.slice(0, start) +
      '  /* CMS:DICT:START — sadrzaj iz Sanityja; ne menjati rucno posle povezivanja CMS-a */\n' +
      src.slice(start, end) +
      '\n  /* CMS:DICT:END */' +
      src.slice(end);
    wr('i18n.js', src);
    console.log('i18n.js: markeri dodati');
  }
}

/* ---------- script.js: eksplicitna lista radova + markeri ---------- */
{
  let src = rd('script.js');
  if (src.includes('CMS:DATA:START')) {
    console.log('script.js vec ima markere, preskacem');
  } else {
    const evalObj = (name) => {
      const s = src.indexOf('var ' + name + ' = {');
      const e = src.indexOf('\n  };', s);
      return new Function('return ' + src.slice(s + ('var ' + name + ' = ').length, e + '\n  }'.length))();
    };
    const ARTISTS = evalObj('ARTISTS');
    const DIMS = evalObj('DIMS');
    const CAT_ALT = {
      'realizam': 'Realistična crno-bela tetovaža',
      'fine-line': 'Fine line tetovaža tankih linija',
      'blackwork': 'Blackwork / grafiti tetovaža'
    };

    // ARTISTS dobija works: [] — tacno ono sto je worksFor() do sada racunao
    for (const [id, a] of Object.entries(ARTISTS)) {
      a.works = [];
      for (let i = 1; i <= a.count; i++) {
        const k = id + '-' + i, d = DIMS[k] || [1170, 1463];
        a.works.push({
          src: 'assets/works/' + k + '.jpg',
          cat: a.cat,
          w: d[0], h: d[1],
          alt: CAT_ALT[a.cat] + ', ' + a.name + ', Random Tattoo Studio Beograd (br. ' + i + ')'
        });
      }
      delete a.count;
    }

    const block =
      '  /* CMS:DATA:START — sadrzaj iz Sanityja; ne menjati rucno posle povezivanja CMS-a */\n' +
      '  var ARTISTS = ' + JSON.stringify(ARTISTS, null, 2).replace(/\n/g, '\n  ') + ';\n' +
      '  /* CMS:DATA:END */\n\n' +
      '  // Radovi po umetniku; galerija ih mesa da ne idu redom po umetniku\n' +
      '  function worksFor(id) { return (ARTISTS[id] && ARTISTS[id].works || []).slice(); }\n' +
      '  function shuffle(arr) {\n' +
      '    var a = arr.slice();\n' +
      '    for (var i = a.length - 1; i > 0; i--) {\n' +
      '      var j = Math.floor(Math.random() * (i + 1));\n' +
      '      var t = a[i]; a[i] = a[j]; a[j] = t;\n' +
      '    }\n' +
      '    return a;\n' +
      '  }\n' +
      "  var WORKS = shuffle(worksFor('lemson').concat(worksFor('anja'), worksFor('enco')));\n";

    const from = src.indexOf('  var ARTISTS = {');
    const to = src.indexOf("var WORKS = shuffle(worksFor('lemson')");
    const toEnd = src.indexOf('\n', to) + 1;
    if (from < 0 || to < 0) throw new Error('Ne nalazim blok podataka u script.js');
    src = src.slice(0, from) + block + src.slice(toEnd);
    wr('script.js', src);
    console.log('script.js: podaci prevedeni u eksplicitnu listu + markeri dodati');
  }
}

/* ---------- styles.css: marker za slike iz CMS-a ---------- */
{
  let src = rd('styles.css');
  if (src.includes('CMS:IMAGES')) {
    console.log('styles.css vec ima marker, preskacem');
  } else {
    src += '\n/* CMS:IMAGES — build ovde upisuje slike iz Sanityja (hero i sl.) */\n';
    wr('styles.css', src);
    console.log('styles.css: marker dodat');
  }
}
