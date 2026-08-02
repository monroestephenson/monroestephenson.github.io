import type { Era } from '../data/types';
import type { Layout } from '../engine/layout';
import type { Transform } from './viewport';

/**
 * The bottom ruler. Pinned to the viewport and driven only by the horizontal
 * part of the transform, so it reads as a fixed instrument the map slides past.
 *
 * Tick spacing is chosen locally rather than globally: because the axis is
 * piecewise, one screen can hold both millennia and decades, and the ruler
 * simply asks at each point what the largest step is that still leaves room.
 */

const STEPS = [2000, 1000, 500, 250, 100, 50, 25, 10, 5, 1];
const MIN_TICK_GAP = 86;

export class Ruler {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly canvas: HTMLCanvasElement;
  private readonly layout: Layout;
  private readonly eras: Era[];
  private transform: Transform = { x: 0, y: 0, k: 1 };
  private dpr = 1;

  constructor(canvas: HTMLCanvasElement, layout: Layout, eras: Era[]) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas 2d context unavailable');
    this.canvas = canvas;
    this.ctx = ctx;
    this.layout = layout;
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

  private screenX(year: number): number {
    return this.layout.xOf(year) * this.transform.k + this.transform.x;
  }

  draw(): void {
    const { ctx, canvas, dpr } = this;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const baseline = 40.5;
    const ink = 'rgba(58, 45, 30, ';

    // The instrument declares its own distortion, on the instrument.
    ctx.font = '500 9px "Archivo Narrow", "Helvetica Neue", Arial, sans-serif';
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.fillStyle = `${ink}0.42)`;
    drawTracked(ctx, 'COMPRESSED SCALE — EACH ERA SIZED BY WHAT HAPPENS IN IT', 26, 15, 1.5);

    ctx.strokeStyle = `${ink}0.35)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, baseline);
    ctx.lineTo(width, baseline);
    ctx.stroke();

    // Era spans, with labels that stay put while any of the era is on screen.
    ctx.font = '600 10px "Archivo Narrow", "Helvetica Neue", Arial, sans-serif';
    for (const era of this.eras) {
      const x0 = this.screenX(era.from);
      const x1 = this.screenX(era.to);
      if (x1 < -40 || x0 > width + 40) continue;

      ctx.strokeStyle = `${ink}0.28)`;
      ctx.beginPath();
      ctx.moveTo(x0, baseline - 7);
      ctx.lineTo(x0, baseline + 7);
      ctx.stroke();

      const label = era.label.toUpperCase();
      const textWidth = ctx.measureText(label).width * 1.5;
      const clampedStart = Math.max(x0 + 11, 11);
      const clampedEnd = Math.min(x1 - 10, width - 10);
      if (clampedEnd - clampedStart > textWidth) {
        ctx.fillStyle = `${ink}0.55)`;
        ctx.textAlign = 'left';
        drawTracked(ctx, label, clampedStart, baseline + 19, 1.5);
      }
    }

    // Year ticks at locally chosen intervals, in the books' own face.
    const startYear = this.yearAtScreen(-60);
    const endYear = this.yearAtScreen(width + 60);
    ctx.font = '400 12px "Fraunces", Palatino, Georgia, serif';
    ctx.textAlign = 'center';

    let year = startYear;
    let guard = 0;
    while (year < endYear && guard++ < 400) {
      const step = this.stepAt(year);
      const tick = Math.ceil(year / step) * step;
      const x = this.screenX(tick);
      if (x > -40 && x < width + 40) {
        ctx.strokeStyle = `${ink}0.3)`;
        ctx.beginPath();
        ctx.moveTo(x, baseline - 5);
        ctx.lineTo(x, baseline);
        ctx.stroke();
        ctx.fillStyle = `${ink}0.72)`;
        ctx.fillText(formatYear(tick), x, baseline - 10);
      }
      year = tick + step * 0.5;
    }

    // A hairline at the far right marking the present.
    const now = this.screenX(new Date().getFullYear());
    if (now > 0 && now < width) {
      ctx.strokeStyle = 'rgba(140, 60, 40, 0.4)';
      ctx.beginPath();
      ctx.moveTo(now, baseline - 9);
      ctx.lineTo(now, baseline + 4);
      ctx.stroke();
    }
  }

  private yearAtScreen(px: number): number {
    return this.layout.yearAt((px - this.transform.x) / this.transform.k);
  }

  /**
   * Largest step whose neighbouring ticks are still far enough apart here.
   * If even the coarsest is too tight — which happens when the whole span is
   * squeezed onto a phone — keep the coarsest rather than falling through to
   * the finest, which would stack every year label on the same few pixels.
   */
  private stepAt(year: number): number {
    for (const step of STEPS) {
      const gap = Math.abs(this.screenX(year + step) - this.screenX(year));
      if (gap >= MIN_TICK_GAP) return step;
    }
    return STEPS[0]!;
  }
}

function formatYear(year: number): string {
  if (year === 0) return '1 CE';
  if (year < 0) return `${Math.abs(year)} BCE`;
  return String(year);
}

/** Canvas has no letter-spacing, so tracked small caps are drawn by hand. */
function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
): void {
  let cursor = x;
  for (const char of text) {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + tracking;
  }
}
