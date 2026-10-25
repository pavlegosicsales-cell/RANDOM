import { textSection, textItem } from './textSection.js';
import { artist, work } from './artist.js';
import { review } from './review.js';
import { blogPost } from './blogPost.js';
import { settings } from './settings.js';

export const schemaTypes = [
  textSection, textItem,
  artist, work,
  review,
  blogPost,
  settings
];
