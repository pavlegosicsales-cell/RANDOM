import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production'
  },
  deployment: { appId: 'e0cfglre50gmer2uos2zslk9' },
  studioHost: 'randomtattoo'   // -> https://randomtattoo.sanity.studio ('random' je zauzet, hostname je globalan za ceo Sanity)
});
