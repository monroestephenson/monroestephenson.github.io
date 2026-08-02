import type { Work } from '../data/types';
import type { LiteraryGraph } from './graph';
import { TimeScale } from './scale';

export interface PlacedWork {
  work: Work;
  /** World coordinates. One world unit is one CSS pixel at zoom 1. */
  x: number;
  y: number;
  /** Approximate on-screen footprint at zoom 1, used for collision only. */
  w: number;
  h: number;
}

export interface Layout {
  nodes: PlacedWork[];
  byId: Map<string, PlacedWork>;
  width: number;
  height: number;
  scale: TimeScale;
  /** World x for a year. The single source of truth for horizontal position —
   *  the ruler and the era bands must ask this rather than recompute it. */
  xOf: (year: number) => number;
  /** The inverse, for reading a year off a position. */
  yearAt: (worldX: number) => number;
}

export interface LayoutOptions {
  width?: number;
  height?: number;
  padX?: number;
  padTop?: number;
  padBottom?: number;
  iterations?: number;
}

const DEFAULTS = {
  width: 4800,
  height: 2100,
  padX: 260,
  padTop: 100,
  padBottom: 170,
  iterations: 420,
} satisfies Required<LayoutOptions>;

/**
 * x is fixed by the date. y is solved for.
 *
 * Nothing here knows about any particular book: works are pulled towards the
 * things they descend from and pushed off anything they would otherwise sit
 * on top of, and the traditions separate out on their own. Adding a work
 * re-solves the whole field, which is the point — no coordinates are ever
 * written down by hand.
 */
export function layoutWorks(
  graph: LiteraryGraph,
  scale: TimeScale,
  options: LayoutOptions = {},
): Layout {
  const opts = { ...DEFAULTS, ...options };
  const { width, height, padX, padTop, padBottom, iterations } = opts;
  const usableWidth = width - padX * 2;
  const xOf = (year: number) => padX + scale.normalise(year) * usableWidth;
  const yearAt = (worldX: number) => scale.denormalise((worldX - padX) / usableWidth);
  const top = padTop;
  const bottom = height - padBottom;
  const midline = (top + bottom) / 2;

  const nodes: PlacedWork[] = graph.works.map((work) => ({
    work,
    x: xOf(work.year),
    // Seeded from the id so the map is identical on every load and every
    // machine — a layout that shuffles itself is impossible to remember.
    y: midline + (hash01(work.id) - 0.5) * (bottom - top) * 0.94,
    w: labelWidth(work),
    h: 34,
  }));

  const byId = new Map(nodes.map((n) => [n.work.id, n]));
  const order = [...nodes].sort((a, b) => a.x - b.x);

  const links = graph.edges
    .map((edge) => ({ a: byId.get(edge.from), b: byId.get(edge.to) }))
    .filter((l): l is { a: PlacedWork; b: PlacedWork } => Boolean(l.a && l.b));

  // Works with many descendants should sit near the middle of the field so
  // their lines fan out rather than hugging an edge.
  const pull = new Map<string, number>();
  for (const node of nodes) {
    const degree =
      (graph.children.get(node.work.id)?.length ?? 0) +
      (graph.parents.get(node.work.id)?.length ?? 0);
    pull.set(node.work.id, Math.min(1, degree / 12));
  }

  for (let step = 0; step < iterations; step++) {
    // Cool down so early passes untangle broadly and late ones only tidy.
    const heat = 1 - step / iterations;

    for (const { a, b } of links) {
      const dy = b.y - a.y;
      const force = dy * 0.045 * heat;
      a.y += force;
      b.y -= force;
    }

    for (const node of nodes) {
      const centring = pull.get(node.work.id)!;
      node.y += (midline - node.y) * 0.0035 * centring * heat;
    }

    separate(order, heat);

    for (const node of nodes) {
      if (node.y < top) node.y = top + (top - node.y) * 0.25;
      if (node.y > bottom) node.y = bottom - (node.y - bottom) * 0.25;
    }
  }

  // A few cold passes with collision only, so nothing ends up overlapping
  // just because the last attraction pass nudged it.
  for (let step = 0; step < 90; step++) separate(order, 0.35);
  for (const node of nodes) node.y = Math.min(bottom, Math.max(top, node.y));

  return { nodes, byId, width, height, scale, xOf, yearAt };
}

/** Push apart any two labels whose boxes would collide at zoom 1. */
function separate(order: PlacedWork[], heat: number): void {
  const gutterY = 56;
  const gutterX = 18;
  for (let i = 0; i < order.length; i++) {
    const a = order[i]!;
    for (let j = i + 1; j < order.length; j++) {
      const b = order[j]!;
      // Labels hang to the right of their point, and the list is sorted by x,
      // so once b starts past the end of a's title nothing further can clash.
      if (b.x > a.x + a.w + gutterX) break;
      const minY = (a.h + b.h) / 2 + gutterY;
      const dy = b.y - a.y;
      const overlap = minY - Math.abs(dy);
      if (overlap <= 0) continue;
      const push = (overlap / 2) * (0.35 + 0.4 * heat);
      const dir = dy === 0 ? (hash01(a.work.id) < 0.5 ? -1 : 1) : Math.sign(dy);
      a.y -= push * dir;
      b.y += push * dir;
    }
  }
}

/**
 * Labels are drawn at a constant size regardless of zoom, so their footprint
 * in world units is their footprint at zoom 1. Measuring in the DOM would be
 * more accurate but would make the layout depend on font loading; an estimate
 * with a generous cap behaves better and is stable.
 */
function labelWidth(work: Work): number {
  const glyph = 26;
  const chars = Math.min(work.title.length, 30);
  return glyph + chars * 6.6 + 18;
}

/** Deterministic 32-bit string hash, normalised to [0, 1). */
function hash01(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}
