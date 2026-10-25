import { defineType, defineField } from 'sanity';

/* Blog clanak. Postojecih 6 clanaka ima svoju HTML stranu na sajtu
   (blog-<slug>.html) i build im menja sadrzaj. Novi clanak koji klijent
   napravi ovde dobija svoju stranu automatski pri sledecem deployu. */
export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog clanak',
  type: 'document',
  fields: [
    defineField({
      name: 'titleSr',
      title: 'Naslov (srpski)',
      type: 'string',
      validation: (r) => r.required()
    }),
    defineField({ name: 'titleEn', title: 'Naslov (engleski)', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Adresa strane',
      type: 'string',
      description: 'Samo mala slova i crtice. Menja adresu clanka, ne diraj kod postojecih.',
      validation: (r) => r.required().regex(/^[a-z0-9-]+$/, { name: 'mala slova i crtice' })
    }),
    defineField({ name: 'order', title: 'Redosled na blog strani', type: 'number' }),
    defineField({
      name: 'publishedAt',
      title: 'Datum objave',
      type: 'date',
      description: 'Ide u Google kao datum clanka'
    }),
    defineField({ name: 'readMinutes', title: 'Minuta citanja', type: 'number', initialValue: 4 }),
    defineField({
      name: 'cover',
      title: 'Naslovna slika',
      type: 'image',
      options: { hotspot: true },
      description: 'Ostavi prazno da zadrzis postojecu'
    }),
    defineField({ name: 'coverAlt', title: 'Opis naslovne slike', type: 'string' }),
    defineField({ name: 'coverLocal', title: 'Postojeca slika', type: 'string', readOnly: true }),
    defineField({
      name: 'bodySr',
      title: 'Tekst clanka (srpski)',
      type: 'array',
      of: [{ type: 'block', styles: [
        { title: 'Pasus', value: 'normal' },
        { title: 'Podnaslov', value: 'h2' }
      ], lists: [{ title: 'Lista', value: 'bullet' }] }]
    }),
    defineField({
      name: 'bodyEn',
      title: 'Tekst clanka (engleski)',
      type: 'array',
      of: [{ type: 'block', styles: [
        { title: 'Pasus', value: 'normal' },
        { title: 'Podnaslov', value: 'h2' }
      ], lists: [{ title: 'Lista', value: 'bullet' }] }]
    }),
    defineField({
      name: 'metaTitle',
      title: 'Google naslov',
      type: 'string',
      description: 'Do 60 znakova. Format: Tema | Random Tattoo Beograd',
      validation: (r) => r.max(60).warning('Duze od 60 znakova Google secka')
    }),
    defineField({
      name: 'metaDescription',
      title: 'Google opis',
      type: 'text',
      rows: 3,
      description: '140-155 znakova',
      validation: (r) => r.min(140).max(155).warning('Van raspona 140-155 znakova')
    }),
    defineField({ name: 'titleKey', title: 'Tehnicki kljuc', type: 'string', readOnly: true, hidden: true }),
    defineField({ name: 'file', title: 'HTML fajl', type: 'string', readOnly: true, hidden: true })
  ],
  orderings: [{ title: 'Redosled', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'titleSr', subtitle: 'slug', media: 'cover' }
  }
});
