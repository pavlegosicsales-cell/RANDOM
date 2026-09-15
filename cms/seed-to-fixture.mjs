/* Pretvara studio/seed.ndjson u oblik kakav vraca Sanity GROQ upit.
   Sluzi za lokalni test build-a bez pravog Sanity projekta. */
import fs from 'node:fs';
const rows = fs.readFileSync(new URL('../studio/seed.ndjson', import.meta.url), 'utf8')
  .trim().split('\n').map((l) => JSON.parse(l));
const by = (t) => rows.filter((r) => r._type === t);
const out = {
  texts: by('textSection').map((d) => ({ section: d.section, items: d.items.map(({ key, sr, en }) => ({ key, sr, en })) })),
  artists: by('artist').sort((a, b) => a.order - b.order).map((a) => ({
    artistId: a.artistId, name: a.name, cat: a.cat, styleSr: a.styleSr, styleEn: a.styleEn,
    ig: a.ig, igUrl: a.igUrl, leadSr: a.leadSr, leadEn: a.leadEn, descSr: a.descSr, descEn: a.descEn,
    portraitLocal: a.portraitLocal, portraitUrl: null,
    works: a.works.map((w) => ({ alt: null, localPath: w.localPath, width: w.width, height: w.height, url: null, dims: null }))
  })),
  reviews: by('review').sort((a, b) => a.order - b.order),
  posts: by('blogPost').sort((a, b) => a.order - b.order).map((p) => ({ ...p, coverUrl: null, publishedAt: null })),
  settings: by('settings')[0] || {}
};
fs.writeFileSync(new URL('../studio/fixture.json', import.meta.url), JSON.stringify(out, null, 2));
console.log('studio/fixture.json zapisan');
