import type { Era, Work } from './types';
import { antiquity } from './works/antiquity';
import { medieval } from './works/medieval';
import { earlyModern } from './works/earlyModern';
import { nineteenth } from './works/nineteenth';
import { modernism } from './works/modernism';
import { postwar } from './works/postwar';
import { contemporary } from './works/contemporary';

/**
 * The corpus. Files are split by period purely for the sake of editing; the
 * timeline sorts by year and does not care which file a work came from, so a
 * new entry can go wherever it reads best.
 */
export const works: Work[] = [
  ...antiquity,
  ...medieval,
  ...earlyModern,
  ...nineteenth,
  ...modernism,
  ...postwar,
  ...contemporary,
].sort((a, b) => a.year - b.year || a.title.localeCompare(b.title));

export const eras: Era[] = [
  { id: 'bronze', label: 'The Tablets', from: -2400, to: -800 },
  { id: 'classical', label: 'Classical', from: -800, to: 500 },
  { id: 'manuscript', label: 'The Manuscript Age', from: 500, to: 1500 },
  { id: 'print', label: 'Print', from: 1500, to: 1800 },
  { id: 'novel', label: 'The Century of the Novel', from: 1800, to: 1900 },
  { id: 'modern', label: 'Modernism', from: 1900, to: 1945 },
  { id: 'postwar', label: 'Post-war', from: 1945, to: 1980 },
  { id: 'now', label: 'The Present', from: 1980, to: 2030 },
];

/** Human-readable labels for the enum values, kept next to the data. */
export const formLabels: Record<string, string> = {
  epic: 'Epic',
  drama: 'Drama',
  poetry: 'Poetry',
  novel: 'Novel',
  'short-fiction': 'Short fiction',
  philosophy: 'Philosophy',
  scripture: 'Scripture',
  prose: 'Prose',
};

export const traditionLabels: Record<string, string> = {
  'near-east': 'Ancient Near East',
  greek: 'Greek',
  roman: 'Latin',
  'south-asia': 'South Asian',
  'east-asia': 'East Asian',
  islamic: 'Persian & Arabic',
  germanic: 'German & Central European',
  romance: 'French, Italian & Iberian',
  english: 'British & Irish',
  russian: 'Russian',
  american: 'American',
  'latin-american': 'Latin American',
  african: 'African',
  nordic: 'Nordic',
};
