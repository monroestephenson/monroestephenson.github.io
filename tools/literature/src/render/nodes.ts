import type { Form } from '../data/types';
import type { Layout, PlacedWork } from '../engine/layout';
import { sigilSvg, traditionInk } from './sigil';
import type { Transform } from './viewport';

/**
 * The DOM layer: one element per work, positioned every frame in screen space.
 *
 * Titles are set in type, not painted into the canvas, so they stay crisp,
 * selectable and reachable by assistive technology. They also keep a constant
 * size at every zoom — the map scales, the labels do not — which is what makes
 * zooming feel like moving closer rather than enlarging a picture.
 */

/** Zoom past which a node's plain glyph is replaced by its full sigil. */
export const SIGIL_ZOOM = 1.45;

/**
 * Zoom below which no titles are drawn at all. The map reads as a field of
 * marks until you have moved close enough that a name will land in clear
 * space and stay there — a title that appears only to be taken away again on
 * the next frame is worse than no title.
 */
const LABEL_ZOOM = 0.55;

/**
 * Label decluttering. Titles are claimed in order of weight: a pillar takes
 * the space it needs and anything that would collide with it stays a bare mark.
 *
 * Two properties make it stable. The occupancy grid is anchored to the world,
 * not the screen, so panning cannot change which titles are shown — only
 * moving closer can. And the zoom is quantised into discrete steps, so a
 * continuous pinch holds one set of labels until it crosses a step rather than
 * re-deciding on every frame.
 */
const CELL_W = 40;
const CELL_H = 13;
/** Steps per doubling of zoom. Three gives ~26% jumps between recomputations. */
const ZOOM_STEPS = 3;
/** Extra clearance demanded beyond the label's own box, in screen pixels. */
const CLEARANCE_X = 26;
const CLEARANCE_ABOVE = 16;
const CLEARANCE_BELOW = 24;
/** The glyph allowance baked into `PlacedWork.w` by the layout. */
const MARK_ALLOWANCE = 26;

/** Pack a signed grid coordinate pair into one integer for the occupancy set. */
function cell(row: number, col: number): number {
  return (row + 1024) * 8192 + (col + 1024);
}

export interface NodeCallbacks {
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

interface NodeView {
  placed: PlacedWork;
  el: HTMLButtonElement;
  mark: HTMLSpanElement;
  sigilLoaded: boolean;
  visible: boolean;
  labelled: boolean;
}

export class Nodes {
  private readonly container: HTMLElement;
  private readonly views: NodeView[] = [];
  /** Weight-first, so important titles claim their space before the rest. */
  private readonly labelOrder: NodeView[];
  private readonly byId = new Map<string, NodeView>();
  private readonly occupied = new Set<number>();
  private transform: Transform = { x: 0, y: 0, k: 1 };
  private selectedId: string | null = null;
  /** Quantised zoom the current label set was decided at. */
  private labelStep = Number.NaN;

  constructor(container: HTMLElement, layout: Layout, callbacks: NodeCallbacks) {
    this.container = container;
    const fragment = document.createDocumentFragment();

    for (const placed of layout.nodes) {
      const { work } = placed;
      const el = document.createElement('button');
      el.className = `node node--w${work.weight}`;
      el.type = 'button';
      el.dataset.id = work.id;
      el.tabIndex = work.weight === 3 ? 0 : -1;
      el.style.setProperty('--ink', traditionInk[work.tradition]);

      const mark = document.createElement('span');
      mark.className = 'node-mark';
      mark.innerHTML = formGlyph(work.form);

      const text = document.createElement('span');
      text.className = 'node-text';
      const title = document.createElement('span');
      title.className = 'node-title';
      title.textContent = work.title;
      text.append(title);
      if (work.author) {
        const author = document.createElement('span');
        author.className = 'node-author';
        author.textContent = work.author;
        text.append(author);
      }

      el.append(mark, text);
      el.addEventListener('pointerenter', () => callbacks.onHover(work.id));
      el.addEventListener('pointerleave', () => callbacks.onHover(null));
      el.addEventListener('focus', () => callbacks.onHover(work.id));
      el.addEventListener('blur', () => callbacks.onHover(null));
      el.addEventListener('click', (event) => {
        event.stopPropagation();
        callbacks.onSelect(work.id);
      });

      const view: NodeView = {
        placed,
        el,
        mark,
        sigilLoaded: false,
        visible: true,
        labelled: true,
      };
      this.views.push(view);
      this.byId.set(work.id, view);
      fragment.append(el);
    }

    this.labelOrder = [...this.views].sort(
      (a, b) => b.placed.work.weight - a.placed.work.weight || a.placed.x - b.placed.x,
    );
    container.append(fragment);
  }

  setTransform(transform: Transform): void {
    this.transform = transform;
    this.position();
  }

  /**
   * `null` clears the highlight; a set dims everything outside it. Passing an
   * empty set is meaningful — it means "nothing qualifies", i.e. dim all.
   */
  setHighlight(ids: Set<string> | null): void {
    this.container.classList.toggle('is-focused', ids !== null);
    for (const view of this.views) {
      const lit = ids === null || ids.has(view.placed.work.id);
      view.el.classList.toggle('is-lit', ids !== null && lit);
      view.el.classList.toggle('is-dim', ids !== null && !lit);
    }
  }

  /**
   * State for the opening sequence.
   *
   * `arrived` are the works the traced line has already reached — they keep
   * their titles regardless of decluttering. `lead` is the one it has just
   * reached, held at a display size so the emphasis travels along the line
   * instead of seven titles piling up at once. `mute` hides everything else,
   * and is released before the cast settles so the constellation can come up
   * around them. Passing null for `arrived` hands the map back to the normal
   * rules entirely.
   */
  setIntroCast(arrived: Set<string> | null, lead: string | null, mute: boolean): void {
    this.container.classList.toggle('is-intro', arrived !== null);
    if (arrived === null) this.container.classList.remove('is-intro-exit');
    for (const view of this.views) {
      const id = view.placed.work.id;
      const cast = arrived !== null && arrived.has(id);
      view.el.classList.toggle('is-intro-cast', cast);
      view.el.classList.toggle('is-intro-lead', cast && id === lead);
      view.el.classList.toggle('is-intro-mute', mute && !cast);
    }
  }

  /**
   * Begin releasing the cast's titles. The seven are named at a zoom where the
   * decluttering rules would show nothing, so simply dropping the classes made
   * them vanish between two frames; this fades them instead, and only the ones
   * that would not have been labelled anyway.
   */
  setIntroExit(): void {
    this.container.classList.add('is-intro-exit');
  }

  setSelected(id: string | null): void {
    if (this.selectedId) this.byId.get(this.selectedId)?.el.classList.remove('is-selected');
    this.selectedId = id;
    if (id) this.byId.get(id)?.el.classList.add('is-selected');
  }

  positionOf(id: string): PlacedWork | undefined {
    return this.byId.get(id)?.placed;
  }

  focusNode(id: string): void {
    this.byId.get(id)?.el.focus({ preventScroll: true });
  }

  private position(): void {
    const { x, y, k } = this.transform;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const showSigils = k >= SIGIL_ZOOM;

    for (const view of this.views) {
      const sx = view.placed.x * k + x;
      const sy = view.placed.y * k + y;

      const onScreen = sx > -320 && sx < width + 60 && sy > -80 && sy < height + 80;

      if (onScreen !== view.visible) {
        view.visible = onScreen;
        view.el.classList.toggle('is-hidden', !onScreen);
      }
      if (!onScreen) continue;

      view.el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0)`;

      if (showSigils !== view.sigilLoaded) {
        view.mark.innerHTML = showSigils
          ? sigilSvg(view.placed.work, 28, 1.1)
          : formGlyph(view.placed.work.form);
        view.mark.classList.toggle('node-mark--sigil', showSigils);
        view.sigilLoaded = showSigils;
      }
    }

    // Quantise the zoom and only re-decide when the step actually changes;
    // panning and small zoom adjustments leave the label set alone.
    const step = Math.round(Math.log2(k) * ZOOM_STEPS);
    if (step !== this.labelStep) {
      this.labelStep = step;
      this.declutter(2 ** (step / ZOOM_STEPS));
    }
  }

  /**
   * Decide which titles are drawn, most important first. A title is drawn only
   * if every grid cell its box — plus a margin of clearance — would cover is
   * still free.
   *
   * Positions here are world coordinates multiplied by the zoom but *not*
   * offset by the pan, which is what makes the result independent of where the
   * viewport happens to be. For the same reason every work is considered, not
   * just the ones currently on screen.
   */
  private declutter(k: number): void {
    this.occupied.clear();

    if (k < LABEL_ZOOM) {
      for (const view of this.views) {
        if (view.labelled) this.setLabelled(view, false);
      }
      return;
    }

    const markSize = k >= SIGIL_ZOOM ? 28 : 22;

    for (const view of this.labelOrder) {
      const px = view.placed.x * k;
      const py = view.placed.y * k;
      const left = px - markSize / 2;
      // `w` is the layout's estimate of mark plus title; reuse it verbatim so
      // the two never disagree about how much room a work needs.
      const right = left + markSize + view.placed.w - MARK_ALLOWANCE + CLEARANCE_X;
      const c0 = Math.floor(left / CELL_W);
      const c1 = Math.floor(right / CELL_W);
      // The box is asymmetric because the author line hangs below the title.
      const r0 = Math.floor((py - CLEARANCE_ABOVE) / CELL_H);
      const r1 = Math.floor((py + CLEARANCE_BELOW) / CELL_H);

      let free = true;
      for (let r = r0; r <= r1 && free; r++) {
        for (let c = c0; c <= c1; c++) {
          if (this.occupied.has(cell(r, c))) {
            free = false;
            break;
          }
        }
      }

      if (free) {
        for (let r = r0; r <= r1; r++) {
          for (let c = c0; c <= c1; c++) this.occupied.add(cell(r, c));
        }
      } else {
        // Even a bare mark holds its own cell, so no later title runs over it.
        this.occupied.add(cell(Math.floor(py / CELL_H), Math.floor(px / CELL_W)));
      }
      if (free !== view.labelled) this.setLabelled(view, free);
    }
  }

  private setLabelled(view: NodeView, on: boolean): void {
    view.labelled = on;
    view.el.classList.toggle('is-unlabelled', !on);
  }
}

/**
 * The small mark carried at every zoom: a reduction of the same idea the full
 * sigil elaborates, kept simple enough to read at eight pixels.
 */
export function formGlyph(form: Form): string {
  const open = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round">';
  const close = '</g></svg>';
  const shapes: Record<Form, string> = {
    epic: '<path d="M2.5 11.5h11"/><path d="M4.5 11.5a3.5 3.5 0 0 1 7 0"/><path d="M8 4.2v3"/>',
    drama: '<path d="M8 3v10"/><path d="M8 6c-2.6 0-3.4 4-0 4"/><path d="M8 6c2.6 0 3.4 4 0 4"/>',
    poetry: '<path d="M4 5h8"/><path d="M4 8h4.5"/><path d="M4 11h7"/>',
    novel: '<path d="M3 11c2.5 0 2-6 5-6s2.5 6 5 6"/>',
    'short-fiction': '<path d="M4 5.5h2.6"/><path d="M9.4 5.5H12"/><path d="M4 10.5h2.6"/><path d="M9.4 10.5H12"/>',
    philosophy: '<path d="M8 3.2 13 8l-5 4.8L3 8Z"/>',
    scripture: '<path d="M5 13V5.5A3 3 0 0 1 11 5.5V13"/><path d="M6 8.5h4"/>',
    prose: '<path d="M10.6 6.2a3.2 3.2 0 1 0 1 3.6"/>',
  };
  return open + shapes[form] + close;
}
