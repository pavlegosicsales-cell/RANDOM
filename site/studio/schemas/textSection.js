import { defineType, defineField } from 'sanity';

/* Jedna sekcija sajta = jedan dokument sa listom tekstova.
   Kljuc (npr. home.title1) je tehnicki i klijent ga ne dira —
   po njemu build zna gde tekst ide na sajtu. */
export const textItem = defineType({
  name: 'textItem',
  title: 'Tekst',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Sta je ovo',
      type: 'string',
      readOnly: true,
      description: 'Opis polja, samo za tvoju orijentaciju'
    }),
    defineField({
      name: 'sr',
      title: 'Srpski',
      type: 'text',
      rows: 2,
      validation: (r) => r.required().warning('Bez srpskog teksta sajt prikazuje prazno polje')
    }),
    defineField({
      name: 'en',
      title: 'Engleski',
      type: 'text',
      rows: 2,
      description: 'Ako ostavis prazno, prikazuje se srpski tekst'
    }),
    defineField({
      name: 'key',
      title: 'Tehnicki kljuc',
      type: 'string',
      readOnly: true,
      hidden: true
    })
  ],
  preview: {
    select: { title: 'label', subtitle: 'sr' },
    prepare: ({ title, subtitle }) => ({ title: title || '(bez opisa)', subtitle })
  }
});

export const textSection = defineType({
  name: 'textSection',
  title: 'Tekstovi sekcije',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Sekcija', type: 'string', readOnly: true }),
    defineField({ name: 'section', title: 'Oznaka sekcije', type: 'string', readOnly: true, hidden: true }),
    defineField({
      name: 'items',
      title: 'Tekstovi',
      type: 'array',
      of: [{ type: 'textItem' }],
      options: { sortable: false }
    })
  ],
  preview: {
    select: { title: 'title', items: 'items' },
    prepare: ({ title, items }) => ({
      title,
      subtitle: (items || []).length + ' tekstova'
    })
  }
});
