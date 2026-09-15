import { defineType, defineField } from 'sanity';

export const review = defineType({
  name: 'review',
  title: 'Recenzija',
  type: 'document',
  fields: [
    defineField({ name: 'author', title: 'Ime (npr. Marko J.)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'order', title: 'Redosled', type: 'number' }),
    defineField({
      name: 'stars',
      title: 'Broj zvezdica',
      type: 'number',
      initialValue: 5,
      validation: (r) => r.min(1).max(5).integer()
    }),
    defineField({ name: 'sr', title: 'Tekst (srpski)', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'en', title: 'Tekst (engleski)', type: 'text', rows: 4 }),
    defineField({ name: 'key', title: 'Tehnicki kljuc', type: 'string', readOnly: true, hidden: true })
  ],
  orderings: [{ title: 'Redosled', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'author', subtitle: 'sr', stars: 'stars' },
    prepare: ({ title, subtitle, stars }) => ({
      title: title + ' · ' + '★'.repeat(stars || 5),
      subtitle
    })
  }
});
