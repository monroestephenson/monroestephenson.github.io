import type { Form, Tradition, Work } from '../data/types';
import { authoredSigils } from './sigils/authored';

/**
 * Every work gets an abstract mark rather than a cover.
 *
 * The figure is generated, not drawn: the *form* picks the underlying gesture
 * (an epic radiates, a novel winds, an argument builds a lattice, verse stacks
 * into lines), the *tradition* picks the accent, and a hash of the id supplies
 * every count, angle and radius. So the mark is stable across reloads, unique
 * to the work, and legible as a family — and a new book gets one for free.
 */

const VIEW = 100;

/**
 * Every mark, drawn or generated, is underlined by the same short rule in the
 * colour of its tradition. Keeping the position fixed turns the colour into a
 * key you can read across the map rather than decoration scattered at random.
 */
const PROVENANCE_RULE = 'M40 92 H60';

export const traditionInk: Record<Tradition, string> = {
  'near-east': '#a2612f',
  greek: '#2c6a68',
  roman: '#8d3a35',
  'south-asia': '#a87c22',
  'east-asia': '#4c6b3c',
  islamic: '#2d5885',
  germanic: '#59497a',
  romance: '#9a5626',
  english: '#3c5b4c',
  russian: '#7c3d51',
  american: '#b0742b',
  'latin-american': '#a94f3d',
  african: '#7e6a1f',
  nordic: '#456580',
};

/**
 * Returns a complete, self-contained <svg> string.
 *
 * `strokePx` is the intended weight *on screen*, not in the viewBox — the same
 * generator therefore reads correctly at 26px in the map and at 132px in the
 * panel without either one going spidery or clotted.
 */
export function sigilSvg(work: Work, size: number, strokePx = 1.7): string {
  const rand = seeded(work.id);
  const accent = traditionInk[work.tradition];
  const authored = authoredSigils[work.id];
  const figure = authored ?? FIGURES[work.form](rand);
  const stroke = (strokePx * VIEW) / size;

  return [
    `<svg class="sigil" viewBox="0 0 ${VIEW} ${VIEW}" width="${size}" height="${size}"`,
    ` role="img" aria-label="Abstract mark for ${escapeAttr(work.title)}" focusable="false">`,
    `<path class="sigil-figure" d="${figure}" fill="none" stroke="currentColor"`,
    ` stroke-width="${f(stroke)}" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<path class="sigil-accent" d="${PROVENANCE_RULE}" fill="none" stroke="${accent}"`,
    ` stroke-width="${f(stroke * 1.6)}" stroke-linecap="round"/>`,
    `</svg>`,
  ].join('');
}

type Rand = () => number;
type Figure = (rand: Rand) => string;

const FIGURES: Record<Form, Figure> = {
  /** Radiating arcs over a horizon: the voyage out, the wave, the shield. */
  epic(rand) {
    const cy = 58 + rand() * 30;
    const cx = 50 + (rand() - 0.5) * 16;
    const rings = 3 + Math.floor(rand() * 5);
    const spread = 0.3 + rand() * 0.85;
    const skew = (rand() - 0.5) * 0.7;
    const inner = 8 + rand() * 18;
    const outer = inner + 32 + rand() * 34;
    const parts: string[] = [];
    for (let i = 0; i < rings; i++) {
      const r = inner + ((outer - inner) * i) / Math.max(1, rings - 1);
      const half = (Math.PI * spread) / 2 - i * (0.02 + rand() * 0.08);
      parts.push(arc(cx, cy, r, -Math.PI / 2 - half + skew, -Math.PI / 2 + half + skew));
    }
    const rays = Math.floor(rand() * 3);
    for (let i = 0; i < rays; i++) {
      const a = -Math.PI / 2 + skew + (rand() - 0.5) * Math.PI * spread;
      parts.push(line(cx, cy, cx + Math.cos(a) * outer, cy + Math.sin(a) * outer));
    }
    if (rand() > 0.35) parts.push(line(cx - outer * 0.9, cy, cx + outer * 0.9, cy));
    return parts.join(' ');
  },

  /** A spine, and lobes answering it from alternating sides. */
  drama(rand) {
    const top = 10 + rand() * 8;
    const bottom = 90 - rand() * 8;
    const axis = 50 + (rand() - 0.5) * 12;
    const parts = [line(axis, top, axis, bottom)];
    const beats = 2 + Math.floor(rand() * 4);
    const symmetric = rand() > 0.55;
    for (let i = 0; i < beats; i++) {
      const y = top + ((bottom - top) * (i + 0.5)) / beats + (rand() - 0.5) * 6;
      const drop = (bottom - top) / beats / (1.1 + rand());
      const reach = 12 + rand() * 24;
      const sides = symmetric ? [-1, 1] : [i % 2 === 0 ? -1 : 1];
      for (const side of sides) {
        const dx = axis + side * reach;
        parts.push(
          `M${f(axis)} ${f(y - drop)} C ${f(dx)} ${f(y - drop)} ${f(dx)} ${f(y + drop)} ${f(axis)} ${f(y + drop)}`,
        );
      }
    }
    return parts.join(' ');
  },

  /** Stacked measures with a caesura: the shape of a poem on the page. */
  poetry(rand) {
    const count = 4 + Math.floor(rand() * 9);
    const top = 16 + rand() * 10;
    const gap = (74 - top) / Math.max(1, count - 1);
    const breaks = new Set([1 + Math.floor(rand() * (count - 2))]);
    if (count > 7 && rand() > 0.5) breaks.add(3 + Math.floor(rand() * (count - 4)));
    // Left-aligned like verse, centred like an inscription, or ragged.
    const style = Math.floor(rand() * 3);
    const block = 30 + rand() * 44;
    const parts: string[] = [];
    for (let i = 0; i < count; i++) {
      const y = top + i * gap;
      const len = breaks.has(i) ? block * (0.14 + rand() * 0.16) : block * (0.55 + rand() * 0.45);
      const x0 =
        style === 0
          ? 50 - block / 2
          : style === 1
            ? 50 - len / 2
            : 50 - block / 2 + rand() * (block - len);
      parts.push(line(x0, y, x0 + len, y));
    }
    return parts.join(' ');
  },

  /**
   * One continuous thread. Novels are two thirds of the corpus, so a single
   * parameterised gesture is not enough to keep them apart — the thread takes
   * one of four routes through the frame, and only then varies within it.
   */
  novel(rand) {
    const route = Math.floor(rand() * 4);
    const pts: Array<[number, number]> = [];

    if (route < 2) {
      // A serpentine, laid down the frame or across it, with an amplitude
      // envelope that opens out, closes in, or swells at the middle.
      const turns = 3 + Math.floor(rand() * 7);
      const envelope = Math.floor(rand() * 3);
      const base = 9 + rand() * 12;
      const swing = 10 + rand() * 18;
      const start = 12 + rand() * 8;
      const run = 92 - start - rand() * 10;
      for (let i = 0; i <= turns; i++) {
        const t = i / turns;
        const shape = envelope === 0 ? t : envelope === 1 ? 1 - t : 1 - Math.abs(t - 0.5) * 2;
        const off = (i % 2 === 0 ? -1 : 1) * (base + swing * shape);
        pts.push(route === 0 ? [50 + off, start + t * run] : [start + t * run, 50 + off]);
      }
    } else if (route === 2) {
      // A loose circuit that comes back to where it began.
      const lobes = 4 + Math.floor(rand() * 4);
      const phase = rand() * Math.PI * 2;
      for (let i = 0; i <= lobes; i++) {
        const a = phase + (i / lobes) * Math.PI * 2;
        const r = 18 + rand() * 20;
        pts.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r * (0.7 + rand() * 0.5)]);
      }
      pts.push(pts[0]!);
    } else {
      // A wandering line that crosses itself and does not close.
      const steps = 5 + Math.floor(rand() * 4);
      let a = rand() * Math.PI * 2;
      let x = 50;
      let y = 50;
      for (let i = 0; i <= steps; i++) {
        pts.push([x, y]);
        a += (rand() - 0.5) * 2.8;
        const len = 16 + rand() * 22;
        x += Math.cos(a) * len;
        y += Math.sin(a) * len;
      }
    }

    // Routes that wander or loop are re-fitted to the frame afterwards rather
    // than clamped as they go, so a short walk still makes a full-size mark.
    const shaped = route >= 2 ? fitToFrame(pts) : pts;
    return [spline(shaped), dot(shaped[0]!, 2.6), dot(shaped[shaped.length - 1]!, 2.6)].join(' ');
  },

  /** Discrete marks, separately placed: a gathering, not a whole. */
  'short-fiction'(rand) {
    const count = 5 + Math.floor(rand() * 7);
    const cols = 2 + Math.floor(rand() * 2);
    const jitter = 6 + rand() * 10;
    const parts: string[] = [];
    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = 50 - ((cols - 1) * 26) / 2 + col * 26 + (rand() - 0.5) * jitter;
      const cy = 22 + row * (56 / Math.max(1, Math.ceil(count / cols) - 1 || 1)) + (rand() - 0.5) * jitter;
      const a = rand() * Math.PI;
      const len = 4 + rand() * 12;
      parts.push(
        line(
          cx - Math.cos(a) * len,
          cy - Math.sin(a) * len,
          cx + Math.cos(a) * len,
          cy + Math.sin(a) * len,
        ),
      );
    }
    return parts.join(' ');
  },

  /** A lattice of propositions, some of them load-bearing. */
  philosophy(rand) {
    const n = 4 + Math.floor(rand() * 6);
    const nodes: Array<[number, number]> = [];
    const phase = rand() * Math.PI * 2;
    const squash = 0.62 + rand() * 0.5;
    for (let i = 0; i < n; i++) {
      const a = phase + (i / n) * Math.PI * 2 + (rand() - 0.5) * 0.5;
      const r = 16 + rand() * 24;
      nodes.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r * squash]);
    }
    const chordiness = 0.12 + rand() * 0.4;
    const parts: string[] = [];
    for (let i = 0; i < n; i++) {
      const a = nodes[i]!;
      parts.push(line(a[0], a[1], nodes[(i + 1) % n]![0], nodes[(i + 1) % n]![1]));
      for (let j = i + 2; j < n; j++) {
        if (rand() < chordiness) parts.push(line(a[0], a[1], nodes[j]![0], nodes[j]![1]));
      }
    }
    for (const node of nodes) parts.push(dot(node, 1.9));
    return parts.join(' ');
  },

  /** A ruled column: the tablet, the pillar, the copied text. */
  scripture(rand) {
    const w = 26 + rand() * 22;
    const x0 = 50 - w / 2;
    const x1 = 50 + w / 2;
    const top = 14 + rand() * 12;
    const arch = 4 + rand() * 18;
    const parts = [
      `M${f(x0)} 88 L${f(x0)} ${f(top + arch)} Q50 ${f(top - arch * 0.5)} ${f(x1)} ${f(top + arch)} L${f(x1)} 88`,
    ];
    const rules = 3 + Math.floor(rand() * 5);
    const from = top + arch + 8;
    for (let i = 0; i < rules; i++) {
      const y = from + ((84 - from) * i) / rules;
      const inset = 3 + rand() * (w * 0.28);
      parts.push(line(x0 + inset, y, x1 - inset, y));
    }
    return parts.join(' ');
  },

  /** A coil that never quite closes: the essay, thought turning. */
  prose(rand) {
    const turns = 1.4 + rand() * 3.4;
    const steps = 160;
    const start = 2 + rand() * 12;
    const growth = 20 + rand() * 20;
    const tilt = rand() * Math.PI * 2;
    const winding = rand() > 0.5 ? 1 : -1;
    const squash = 0.7 + rand() * 0.55;
    const pts: Array<[number, number]> = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const a = tilt + winding * t * turns * Math.PI * 2;
      const r = start + t * growth;
      pts.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r * squash]);
    }
    return polyline(pts);
  },
};

// ── primitives ──────────────────────────────────────────────────────────────

function line(x0: number, y0: number, x1: number, y1: number): string {
  return `M${f(x0)} ${f(y0)} L${f(x1)} ${f(y1)}`;
}

function dot([x, y]: [number, number], r = 2.2): string {
  return `M${f(x - r)} ${f(y)} a${f(r)} ${f(r)} 0 1 0 ${f(r * 2)} 0 a${f(r)} ${f(r)} 0 1 0 ${f(-r * 2)} 0`;
}

function arc(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const x0 = cx + Math.cos(a0) * r;
  const y0 = cy + Math.sin(a0) * r;
  const x1 = cx + Math.cos(a1) * r;
  const y1 = cy + Math.sin(a1) * r;
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  return `M${f(x0)} ${f(y0)} A${f(r)} ${f(r)} 0 ${large} 1 ${f(x1)} ${f(y1)}`;
}

function polyline(pts: Array<[number, number]>): string {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${f(p[0])} ${f(p[1])}`).join(' ');
}

/** Catmull–Rom through the points, emitted as cubic béziers. */
function spline(pts: Array<[number, number]>): string {
  if (pts.length < 2) return '';
  const out = [`M${f(pts[0]![0])} ${f(pts[0]![1])}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[Math.min(pts.length - 1, i + 2)]!;
    out.push(
      `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)}` +
        ` ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)}` +
        ` ${f(p2[0])} ${f(p2[1])}`,
    );
  }
  return out.join(' ');
}

/** Scale and centre a point set into the drawable frame, keeping its aspect. */
function fitToFrame(pts: Array<[number, number]>, inset = 15): Array<[number, number]> {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const span = VIEW - inset * 2;
  const k = Math.min(span / Math.max(1, maxX - minX), span / Math.max(1, maxY - minY));
  const dx = inset + (span - (maxX - minX) * k) / 2 - minX * k;
  const dy = inset + (span - (maxY - minY) * k) / 2 - minY * k;
  return pts.map(([x, y]) => [x * k + dx, y * k + dy]);
}

function f(n: number): string {
  return (Math.round(n * 100) / 100).toString();
}

function escapeAttr(value: string): string {
  return value.replace(/[<>&"]/g, (c) => `&#${c.charCodeAt(0)};`);
}

/** mulberry32, seeded by an FNV-1a hash of the id. */
function seeded(id: string): Rand {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
