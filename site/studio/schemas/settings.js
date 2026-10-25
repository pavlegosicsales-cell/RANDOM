import { defineType, defineField } from 'sanity';

export const settings = defineType({
  name: 'settings',
  title: 'Slike i podesavanja',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero slika (komp)',
      type: 'image',
      options: { hotspot: true },
      description: 'Velika slika iza naslova na pocetnoj. Ostavi prazno da zadrzis postojecu.'
    }),
    defineField({
      name: 'heroMobile',
      title: 'Hero slika (telefon)',
      type: 'image',
      options: { hotspot: true },
      description: 'Uspravna verzija. Ako je prazno, koristi se ista kao za komp.'
    }),
    defineField({ name: 'heroLocal', title: 'Postojeca hero slika', type: 'string', readOnly: true }),
    defineField({ name: 'heroMobileLocal', title: 'Postojeca hero slika (telefon)', type: 'string', readOnly: true }),
    defineField({
      name: 'ogImage',
      title: 'Slika za deljenje na mrezama',
      type: 'image',
      description: '1200x630. Prikazuje se kad neko podeli link sajta.'
    })
  ],
  preview: { prepare: () => ({ title: 'Slike i podesavanja' }) }
});
