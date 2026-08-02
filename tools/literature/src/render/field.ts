import type { Era } from '../data/types';
import type { LiteraryGraph } from '../engine/graph';
import type { Layout, PlacedWork } from '../engine/layout';
import type { Transform } from './viewport';
import { traditionInk } from './sigil';

/**
 * The canvas layer: era washes and the influence lines themselves.
 *
 * Text and interaction live in the DOM layer above this; everything drawn here
 * is decoration and connective tissue, redrawn whole on every frame. At this
 * corpus size that is a few hundred béziers a frame, which is nothing.
 */

export interface FieldFocus {
  /** Edges belonging to the hovered or selected work's lineage. */
  edges: Set<number>;
  /** Whether anything at all is focused — controls the dimming of the rest. */
  active: boolean;
}

/**
 * The opening sequence draws one lineage before the rest of the map exists.
 *
 * `drawn` maps an edge index to how much of it has been traced, 0–1. `veil` is
 * how far the remaining lines have come up behind it. `emphasis` is how much
 * of its bold colour the traced lineage still holds — at 0 the intro renders
 * pixel-identically to the ordinary map, so handing back is invisible rather
 * than a cut.
 */
export interface FieldIntro {
  drawn: Map<number, number>;
  veil: number;
  emphasis: number;
}

const EMPTY_FOCUS: FieldFocus = { edges: new Set(), active: false };

export class Field {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly canvas: HTMLCanvasElement;
  private readonly layout: Layout;
  private readonly graph: LiteraryGraph;
  private readonly eras: Era[];
  private transform: Transform = { x: 0, y: 0, k: 1 };
  private focus: FieldFocus = EMPTY_FOCUS;
  private intro: FieldIntro | null = null;
  private dpr = 1;
  private phase = 0;
  private frame: number | null = null;
  /** Arc lengths of the intro's curves, measured once so the trace is even. */
  private readonly lengths = new Map<number, number>();

  constructor(canvas: HTMLCanvasElement, layout: Layout, graph: LiteraryGraph, eras: Era[]) {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new Error('canvas 2d context unavailable');
    this.canvas = canvas;
    this.ctx = ctx;
    this.layout = layout;
    this.graph = graph;
    this.eras = eras;
    this.resize();
  }

  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.round(rect.width * this.dpr);
    this.canvas.height = Math.round(rect.height * this.dpr);
    this.draw();
  }

  setTransform(transform: Transform): void {
    this.transform = transform;
    this.draw();
  }

  setIntro(intro: FieldIntro | null): void {
    this.intro = intro;
    this.draw();
  }

  setFocus(focus: FieldFocus | null): void {
    const next = focus ?? EMPTY_FOCUS;
    const wasActive = this.focus.active;
    this.focus = next;
    if (next.active && !wasActive) this.startFlow();
    if (!next.active && wasActive) this.stopFlow();
    this.draw();
  }

  /** Lit lineages get a slow travelling dash, ancestor to descendant. */
  private startFlow(): void {
    if (this.frame !== null) return;
    const tick = () => {
      this.phase = (this.phase + 0.55) % 1000;
      this.draw();
      this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }

  private stopFlow(): void {
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.frame = null;
  }

  draw(): void {
    const { ctx, canvas, dpr } = this;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const { x, y, k } = this.transform;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(k, k);

    this.drawEraBands(height);
    this.drawEdges(k);

    ctx.restore();
  }

  private drawEraBands(screenHeight: number): void {
    const { ctx, layout } = this;
    const top = -screenHeight / this.transform.k;
    const span = layout.height + (screenHeight * 2) / this.transform.k;

    // A hairline at each era boundary, and nothing else: the ruler already
    // names the eras, so tinting the bands as well would say it a third time.
    ctx.strokeStyle = 'rgba(120, 96, 62, 0.14)';
    ctx.lineWidth = 1 / this.transform.k;
    for (const era of this.eras) {
      const x0 = layout.xOf(era.from);
      ctx.beginPath();
      ctx.moveTo(x0, top);
      ctx.lineTo(x0, top + span);
      ctx.stroke();
    }
  }

  private drawEdges(k: number): void {
    const { ctx, graph, layout, focus, intro } = this;
    const dim = focus.active;

    ctx.lineCap = 'round';

    if (intro) {
      // Everything but the traced lineage is still coming up out of the paper.
      ctx.globalAlpha = intro.veil;
      graph.edges.forEach((edge, index) => {
        if (intro.drawn.has(index)) return;
        const a = layout.byId.get(edge.from);
        const b = layout.byId.get(edge.to);
        if (a && b) this.strokeEdge(a, b, false, false, k);
      });
      ctx.globalAlpha = 1;

      for (const [index, progress] of intro.drawn) {
        const edge = graph.edges[index];
        const a = edge && layout.byId.get(edge.from);
        const b = edge && layout.byId.get(edge.to);
        if (!a || !b) continue;
        // Underneath the trace, the same curve as the ordinary map draws it.
        // As emphasis falls the coloured stroke fades off this, leaving the
        // quiet line already in place.
        if (intro.emphasis < 1) {
          ctx.globalAlpha = intro.veil;
          this.strokeEdge(a, b, false, false, k);
          ctx.globalAlpha = 1;
        }
        this.traceEdge(a, b, index, progress, intro.emphasis, k);
      }
      ctx.setLineDash([]);
      return;
    }

    // Two passes so lit lines always sit above the quiet ones.
    for (const pass of [0, 1]) {
      graph.edges.forEach((edge, index) => {
        const lit = focus.edges.has(index);
        if (pass === 0 ? lit : !lit) return;
        const a = layout.byId.get(edge.from);
        const b = layout.byId.get(edge.to);
        if (!a || !b) return;
        this.strokeEdge(a, b, lit, dim, k);
      });
    }
    ctx.setLineDash([]);
  }

  /** Draw the leading fraction of one curve, as if it were being ruled. */
  private traceEdge(
    a: PlacedWork,
    b: PlacedWork,
    index: number,
    progress: number,
    emphasis: number,
    k: number,
  ): void {
    if (progress <= 0 || emphasis <= 0) return;
    const { ctx } = this;
    const bend = Math.max(30, Math.abs(b.x - a.x) * 0.42);

    let length = this.lengths.get(index);
    if (length === undefined) {
      length = curveLength(a.x, a.y, a.x + bend, a.y, b.x - bend, b.y, b.x, b.y);
      this.lengths.set(index, length);
    }

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.bezierCurveTo(a.x + bend, a.y, b.x - bend, b.y, b.x, b.y);

    const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    gradient.addColorStop(0, traditionInk[a.work.tradition]);
    gradient.addColorStop(1, traditionInk[b.work.tradition]);
    ctx.strokeStyle = gradient;
    // A dash of [drawn, everything] reveals exactly the leading fraction.
    ctx.setLineDash([length * progress, length]);
    ctx.lineDashOffset = 0;

    // Both the halo and the line thin out as the emphasis goes, so the stroke
    // settles onto the quiet line beneath it rather than switching off.
    ctx.globalAlpha = 0.3 * emphasis;
    ctx.lineWidth = (7 * emphasis) / k;
    ctx.stroke();
    ctx.globalAlpha = emphasis;
    ctx.lineWidth = (0.9 + 1.7 * emphasis) / k;
    ctx.stroke();
  }

  private strokeEdge(
    a: PlacedWork,
    b: PlacedWork,
    lit: boolean,
    dim: boolean,
    k: number,
  ): void {
    const { ctx } = this;
    const x0 = a.x;
    const y0 = a.y;
    const x1 = b.x;
    const y1 = b.y;
    const bend = Math.max(30, Math.abs(x1 - x0) * 0.42);

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.bezierCurveTo(x0 + bend, y0, x1 - bend, y1, x1, y1);

    if (lit) {
      const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
      gradient.addColorStop(0, traditionInk[a.work.tradition]);
      gradient.addColorStop(1, traditionInk[b.work.tradition]);
      ctx.strokeStyle = gradient;
      ctx.globalAlpha = 0.72;
      ctx.lineWidth = 1.5 / k;
      // Mostly solid with a small travelling break: enough to read the
      // direction of descent without turning a dense lineage into hatching.
      const dash = 15 / k;
      ctx.setLineDash([dash * 2.4, dash * 0.55]);
      ctx.lineDashOffset = -this.phase / k;
      ctx.stroke();

      // A soft, undashed underlay keeps the curve continuous to the eye.
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.14;
      ctx.lineWidth = 3.2 / k;
      ctx.stroke();
    } else {
      ctx.setLineDash([]);
      ctx.strokeStyle = '#6b5636';
      ctx.globalAlpha = dim ? 0.05 : 0.15;
      ctx.lineWidth = 0.9 / k;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}

/** Arc length of a cubic bézier, by sampling. Accurate enough to trace by. */
function curveLength(
  x0: number, y0: number,
  cx1: number, cy1: number,
  cx2: number, cy2: number,
  x1: number, y1: number,
): number {
  const steps = 24;
  let length = 0;
  let px = x0;
  let py = y0;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    const x = u * u * u * x0 + 3 * u * u * t * cx1 + 3 * u * t * t * cx2 + t * t * t * x1;
    const y = u * u * u * y0 + 3 * u * u * t * cy1 + 3 * u * t * t * cy2 + t * t * t * y1;
    length += Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }
  return length;
}
