import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas/index.js';

/* Random Tattoo Studio — CMS
   Klijent ovde menja tekstove, slike, recenzije i blog.
   Svaka objava (Publish) okida novi deploy sajta preko webhook-a. */
export default defineConfig({
  name: 'random',
  title: 'Random Tattoo Studio',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Sadrzaj sajta')
          .items([
            S.listItem()
              .title('Tekstovi po sekcijama')
              .child(S.documentTypeList('textSection').title('Tekstovi po sekcijama')),
            S.divider(),
            S.listItem()
              .title('Umetnici i njihovi radovi')
              .child(S.documentTypeList('artist').title('Umetnici')),
            S.listItem()
              .title('Recenzije')
              .child(S.documentTypeList('review').title('Recenzije')),
            S.listItem()
              .title('Blog')
              .child(S.documentTypeList('blogPost').title('Blog clanci')),
            S.divider(),
            S.listItem()
              .title('Slike i podesavanja')
              .child(S.document().schemaType('settings').documentId('settings'))
          ])
    }),
    visionTool()
  ],
  schema: { types: schemaTypes }
});
