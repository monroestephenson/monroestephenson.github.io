/**
 * The whole corpus is described by this one shape. Everything downstream —
 * layout, colour, filtering, the influence graph — is derived from it, so
 * adding a work is a matter of appending one object to one array.
 */
export interface Work {
  /** Stable slug. Referenced by `after`, and used in the URL hash. */
  id: string;
  title: string;
  /** Omitted for anonymous or collectively authored works. */
  author?: string;
  /** Numeric year for placement. Negative is BCE. Approximations are fine. */
  year: number;
  /** How the date is written for a reader: "c. 2100 BCE", "1922", "1913–27". */
  date: string;
  form: Form;
  tradition: Tradition;
  /**
   * Label priority, 1–3. 3 = a load-bearing pillar of the canon that stays
   * legible at every zoom level; 1 = detail that only appears close up.
   */
  weight: 1 | 2 | 3;
  /** One or two sentences. Earn the space. */
  note: string;
  /** Works this one descends from. The edges of the influence graph. */
  after?: string[];
  /** Optional gloss on a specific debt, keyed by the ancestor's id. */
  debts?: Record<string, string>;
}

export const FORMS = [
  'epic',
  'drama',
  'poetry',
  'novel',
  'short-fiction',
  'philosophy',
  'scripture',
  'prose',
] as const;

export type Form = (typeof FORMS)[number];

export const TRADITIONS = [
  'near-east',
  'greek',
  'roman',
  'south-asia',
  'east-asia',
  'islamic',
  'germanic',
  'romance',
  'english',
  'russian',
  'american',
  'latin-american',
  'african',
  'nordic',
] as const;

export type Tradition = (typeof TRADITIONS)[number];

export interface Era {
  id: string;
  label: string;
  /** Inclusive start year, exclusive end year. */
  from: number;
  to: number;
}
