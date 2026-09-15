import { defineType, defineField } from 'sanity';

/* Rad u galeriji. Slika moze da bude uploadovana u Sanity ili da ostane
   postojeca sa sajta (localPath). Build uzima upload ako postoji. */
export const work = defineType({
  name: 'work',
  title: 'Rad',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Slika',
      type: 'image',
      options: { hotspot: true },
      description: 'Ostavi prazno da zadrzis postojecu sliku sa sajta'
    }),
    defineField({
      name: 'alt',
      title: 'Opis slike (alt)',
      type: 'string',
      description: 'Za Google i citace ekrana. Ostavi prazno za automatski opis.'
    }),
    defineField({ name: 'localPath', title: 'Postojeca slika', type: 'string', readOnly: true }),
    defineField({ name: 'width', title: 'Sirina', type: 'number', hidden: true }),
    defineField({ name: 'height', title: 'Visina', type: 'number', hidden: true })
  ],
  preview: {
    select: { media: 'image', title: 'localPath', alt: 'alt' },
    prepare: ({ media, title, alt }) => ({ title: alt || title || 'Rad', media })
  }
});

export const artist = defineType({
  name: 'artist',
  title: 'Umetnik',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Ime', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'order', title: 'Redosled na sajtu', type: 'number' }),
    defineField({
      name: 'artistId',
      title: 'Tehnicka oznaka',
      type: 'string',
      readOnly: true,
      description: 'Koristi se u adresi strane (artist.html?id=...)'
    }),
    defineField({
      name: 'cat',
      title: 'Kategorija u galeriji',
      type: 'string',
      options: { list: [
        { title: 'Realizam', value: 'realizam' },
        { title: 'Fine line', value: 'fine-line' },
        { title: 'Blackwork', value: 'blackwork' }
      ] }
    }),
    defineField({ name: 'styleSr', title: 'Stil (srpski)', type: 'string', description: 'Npr. REALIZAM · APSTRAKTNE BOJE' }),
    defineField({ name: 'styleEn', title: 'Stil (engleski)', type: 'string' }),
    defineField({ name: 'ig', title: 'Instagram korisnicko ime', type: 'string' }),
    defineField({ name: 'igUrl', title: 'Instagram adresa', type: 'url' }),
    defineField({
      name: 'portrait',
      title: 'Portret',
      type: 'image',
      options: { hotspot: true },
      description: 'Ostavi prazno da zadrzis postojeci portret'
    }),
    defineField({ name: 'portraitLocal', title: 'Postojeci portret', type: 'string', readOnly: true }),
    defineField({ name: 'leadSr', title: 'Uvodni tekst (srpski)', type: 'text', rows: 4 }),
    defineField({ name: 'leadEn', title: 'Uvodni tekst (engleski)', type: 'text', rows: 4 }),
    defineField({ name: 'descSr', title: 'Zakljucna recenica (srpski)', type: 'text', rows: 2 }),
    defineField({ name: 'descEn', title: 'Zakljucna recenica (engleski)', type: 'text', rows: 2 }),
    defineField({
      name: 'works',
      title: 'Radovi u galeriji',
      type: 'array',
      of: [{ type: 'work' }],
      description: 'Prevlacenjem menjas redosled. Brisanjem sklanjas rad sa sajta.'
    })
  ],
  orderings: [{ title: 'Redosled', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'styleSr', media: 'portrait', works: 'works' },
    prepare: ({ title, subtitle, media, works }) => ({
      title,
      subtitle: (subtitle || '') + ' · ' + (works || []).length + ' radova',
      media
    })
  }
});
