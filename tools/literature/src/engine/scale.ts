/**
 * A monotonic, invertible year → position mapping.
 *
 * A linear axis is useless here: four thousand years separate Gilgamesh from
 * Septology, but nine tenths of the corpus falls in the last two centuries.
 * A pure log axis over-corrects and squashes antiquity into a smear.
 *
 * So the axis is piecewise linear over declared segments, each given a share
 * of the total width roughly proportional to how much happens inside it. The
 * compression is deliberately visible on the ruler — the changing tick spacing
 * is information, not an artefact.
 */

export interface Segment {
  /** Inclusive start year of the segment. */
  from: number;
  /** Share of total axis width. Relative; they need not sum to anything. */
  share: number;
}

export const DEFAULT_SEGMENTS: Segment[] = [
  { from: -2400, share: 5 },
  { from: -800, share: 9 },
  { from: 0, share: 4 },
  { from: 500, share: 6 },
  { from: 1300, share: 7 },
  { from: 1600, share: 6 },
  { from: 1750, share: 6 },
  { from: 1830, share: 8 },
  { from: 1880, share: 9 },
  { from: 1920, share: 11 },
  { from: 1950, share: 12 },
  { from: 1980, share: 10 },
  { from: 2005, share: 7 },
];

export const AXIS_END_YEAR = 2030;

interface Knot {
  year: number;
  /** Cumulative position in [0, 1]. */
  t: number;
}

export class TimeScale {
  private readonly knots: Knot[];
  readonly minYear: number;
  readonly maxYear: number;

  constructor(
    segments: Segment[] = DEFAULT_SEGMENTS,
    endYear: number = AXIS_END_YEAR,
  ) {
    const total = segments.reduce((sum, s) => sum + s.share, 0);
    const knots: Knot[] = [];
    let acc = 0;
    for (const segment of segments) {
      knots.push({ year: segment.from, t: acc / total });
      acc += segment.share;
    }
    knots.push({ year: endYear, t: 1 });
    this.knots = knots;
    this.minYear = knots[0]!.year;
    this.maxYear = endYear;
  }

  /** Year → normalised position in [0, 1]. Clamped at both ends. */
  normalise(year: number): number {
    const { knots } = this;
    if (year <= this.minYear) return 0;
    if (year >= this.maxYear) return 1;
    // Segment count is small enough that a scan beats a binary search.
    for (let i = 0; i < knots.length - 1; i++) {
      const a = knots[i]!;
      const b = knots[i + 1]!;
      if (year < b.year) {
        const f = (year - a.year) / (b.year - a.year);
        return a.t + f * (b.t - a.t);
      }
    }
    return 1;
  }

  /** The inverse, so the ruler can label whatever year sits under a pixel. */
  denormalise(t: number): number {
    const { knots } = this;
    const clamped = Math.min(1, Math.max(0, t));
    for (let i = 0; i < knots.length - 1; i++) {
      const a = knots[i]!;
      const b = knots[i + 1]!;
      if (clamped < b.t) {
        const f = (clamped - a.t) / (b.t - a.t);
        return a.year + f * (b.year - a.year);
      }
    }
    return this.maxYear;
  }

  /**
   * How many years one unit of normalised axis covers at this point — used to
   * decide whether to rule the axis by millennium, century or decade.
   */
  yearsPerUnitAt(year: number): number {
    const { knots } = this;
    for (let i = 0; i < knots.length - 1; i++) {
      const a = knots[i]!;
      const b = knots[i + 1]!;
      if (year < b.year || i === knots.length - 2) {
        return (b.year - a.year) / (b.t - a.t);
      }
    }
    return 1;
  }
}
