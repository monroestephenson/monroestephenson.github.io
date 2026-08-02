import './styles/main.css';
import { eras, formLabels, works } from './data';
import { FORMS, type Form, type Work } from './data/types';
import { buildGraph, lineage, lineageEdges } from './engine/graph';
import { layoutWorks } from './engine/layout';
import { TimeScale } from './engine/scale';
import { Field } from './render/field';
import { runOpening } from './render/intro';
import { formGlyph, Nodes, SIGIL_ZOOM } from './render/nodes';
import { Panel } from './render/panel';
import { Ruler } from './render/ruler';
import { Viewport, type Transform } from './render/viewport';

const stage = must<HTMLElement>('#stage');
const canvas = must<HTMLCanvasElement>('#field');
const rulerCanvas = must<HTMLCanvasElement>('#ruler');
const nodeLayer = must<HTMLElement>('#nodes');
const panelEl = must<HTMLElement>('#panel');
const searchInput = must<HTMLInputElement>('#search');
const resultsEl = must<HTMLElement>('#results');
const legendEl = must<HTMLElement>('#legend');
const counterEl = must<HTMLElement>('#counter');

const scale = new TimeScale();
const graph = buildGraph(works);
const layout = layoutWorks(graph, scale);

const field = new Field(canvas, layout, graph, eras);
const ruler = new Ruler(rulerCanvas, layout, eras);

let selectedId: string | null = null;
let hoveredId: string | null = null;
let formFilter: Form | null = null;

/** The rectangle the works actually occupy, which is what "the whole span" means. */
const bounds = {
  x0: Math.min(...layout.nodes.map((n) => n.x)) - 40,
  y0: Math.min(...layout.nodes.map((n) => n.y)) - 40,
  x1: Math.max(...layout.nodes.map((n) => n.x)) + 260,
  y1: Math.max(...layout.nodes.map((n) => n.y)) + 40,
};
const FIT_MARGIN = 70;

/**
 * The zoom at which everything is on screen. On a phone this is far below the
 * desktop floor, and clamping it there would make "the whole span" a lie — so
 * the floor is whichever is lower.
 */
function fitZoom(): number {
  const rect = stage.getBoundingClientRect();
  return Math.min(
    (rect.width - FIT_MARGIN * 2) / (bounds.x1 - bounds.x0),
    (rect.height - FIT_MARGIN * 2) / (bounds.y1 - bounds.y0),
  );
}

const viewport = new Viewport(stage, {
  minZoom: Math.min(0.2, fitZoom() * 0.96),
  maxZoom: 2.2,
  worldWidth: layout.width,
  worldHeight: layout.height,
  onChange: onTransform,
});

const nodes = new Nodes(nodeLayer, layout, {
  onHover: (id) => {
    hoveredId = id;
    applyFocus();
  },
  onSelect: (id) => {
    if (viewport.wasDragged) return;
    select(id, { fly: false });
  },
});

const panel = new Panel(panelEl, graph, (id) => select(id, { fly: true }));
panelEl.addEventListener('panel:close', () => {
  selectedId = null;
  nodes.setSelected(null);
  history.replaceState(null, '', location.pathname + location.search);
  applyFocus();
});

/**
 * Which titles are shown is decided continuously by the decluttering pass in
 * render/nodes.ts. Only the two ends of the range need a name: far out, the
 * glyphs collapse to points and the map reads as a constellation; close in,
 * every work shows the sigil drawn for it.
 */
function zoomTier(k: number): 'far' | 'near' | 'close' {
  if (k >= SIGIL_ZOOM) return 'close';
  if (k < 0.34) return 'far';
  return 'near';
}

function onTransform(transform: Transform): void {
  field.setTransform(transform);
  ruler.setTransform(transform);
  nodes.setTransform(transform);
  document.body.dataset.zoom = zoomTier(transform.k);
}

/** Hover takes precedence over selection, so the map stays explorable. */
function applyFocus(): void {
  const id = hoveredId ?? selectedId;
  if (!id) {
    field.setFocus(null);
    nodes.setHighlight(formFilter ? formMatches(formFilter) : null);
    return;
  }
  const { ancestors, descendants } = lineage(graph, id);
  const lit = new Set([...ancestors, ...descendants, id]);
  field.setFocus({ edges: lineageEdges(graph, id), active: true });
  nodes.setHighlight(lit);
}

function formMatches(form: Form): Set<string> {
  return new Set(works.filter((w) => w.form === form).map((w) => w.id));
}

function select(id: string, { fly }: { fly: boolean }): void {
  const work = graph.byId.get(id);
  const placed = nodes.positionOf(id);
  if (!work || !placed) return;

  selectedId = id;
  nodes.setSelected(id);
  panel.show(work);
  applyFocus();
  history.replaceState(null, '', `#${id}`);

  if (fly) {
    viewport.moveTo(placed.x, placed.y, Math.max(viewport.transform.k, 1.15));
  } else {
    ensureVisible(placed.x, placed.y);
  }
}

/**
 * Nudge the view only if the selected work would sit under the panel or off
 * the edge. The panel docks to the right on wide screens and to the bottom on
 * narrow ones, so which axis it eats depends on the layout.
 */
function ensureVisible(worldX: number, worldY: number): void {
  const { x, y, k } = viewport.transform;
  const sx = worldX * k + x;
  const sy = worldY * k + y;
  const panel = panelEl.getBoundingClientRect();
  const dockedRight = panel.width < window.innerWidth * 0.9;

  const right = dockedRight ? window.innerWidth - panel.width - 80 : window.innerWidth - 80;
  const bottom = dockedRight ? window.innerHeight - 140 : panel.top - 60;

  const dx = sx > right ? right - sx : sx < 80 ? 80 - sx : 0;
  const dy = sy > bottom ? bottom - sy : sy < 90 ? 90 - sy : 0;
  if (dx || dy) viewport.moveTo(worldX - dx / k, worldY - dy / k, k);
}

// ── search ──────────────────────────────────────────────────────────────────

let searchIndex = -1;

function runSearch(query: string): void {
  const q = query.trim().toLowerCase();
  if (q.length < 2) {
    resultsEl.innerHTML = '';
    resultsEl.hidden = true;
    return;
  }
  const matches = works
    .filter(
      (w) =>
        w.title.toLowerCase().includes(q) || (w.author ?? '').toLowerCase().includes(q),
    )
    .sort((a, b) => rank(a, q) - rank(b, q) || b.weight - a.weight)
    .slice(0, 8);

  resultsEl.innerHTML = matches
    .map(
      (w, i) => `
        <li>
          <button type="button" data-id="${w.id}" class="${i === 0 ? 'is-active' : ''}">
            <span class="result-title">${escapeHtml(w.title)}</span>
            <span class="result-meta">${escapeHtml(w.author ?? 'Anonymous')} · ${escapeHtml(w.date)}</span>
          </button>
        </li>`,
    )
    .join('');
  resultsEl.hidden = matches.length === 0;
  searchIndex = matches.length ? 0 : -1;
}

function rank(work: Work, q: string): number {
  const title = work.title.toLowerCase();
  if (title.startsWith(q)) return 0;
  if (title.includes(q)) return 1;
  return 2;
}

searchInput.addEventListener('input', () => runSearch(searchInput.value));
searchInput.addEventListener('keydown', (event) => {
  const buttons = [...resultsEl.querySelectorAll<HTMLButtonElement>('button')];
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    if (!buttons.length) return;
    searchIndex = (searchIndex + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
    buttons.forEach((b, i) => b.classList.toggle('is-active', i === searchIndex));
  } else if (event.key === 'Enter') {
    const button = buttons[searchIndex] ?? buttons[0];
    if (button?.dataset.id) {
      select(button.dataset.id, { fly: true });
      resultsEl.hidden = true;
      searchInput.value = '';
      // Hand focus to the work itself, so the map is where the keyboard is.
      nodes.focusNode(button.dataset.id);
    }
  } else if (event.key === 'Escape') {
    searchInput.value = '';
    resultsEl.hidden = true;
    searchInput.blur();
  }
});

resultsEl.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-id]');
  if (!button?.dataset.id) return;
  select(button.dataset.id, { fly: true });
  resultsEl.hidden = true;
  searchInput.value = '';
});

// ── legend, doubling as a filter ────────────────────────────────────────────

legendEl.innerHTML = FORMS.map(
  (form) => `
    <button type="button" class="legend-item" data-form="${form}">
      <span class="legend-glyph">${formGlyph(form)}</span>
      <span class="legend-label">${escapeHtml(formLabels[form] ?? form)}</span>
    </button>`,
).join('');

legendEl.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-form]');
  const form = button?.dataset.form as Form | undefined;
  if (!form) return;
  formFilter = formFilter === form ? null : form;
  legendEl.querySelectorAll('.legend-item').forEach((item) => {
    item.classList.toggle('is-on', (item as HTMLElement).dataset.form === formFilter);
  });
  legendEl.classList.toggle('is-filtering', formFilter !== null);
  applyFocus();
});

counterEl.textContent = `${works.length} works · ${graph.edges.length} lines of descent`;

// ── global input ────────────────────────────────────────────────────────────

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (panel.isOpen) panel.close();
    return;
  }
  if (event.target instanceof HTMLInputElement) return;
  if (event.key === '/') {
    event.preventDefault();
    searchInput.focus();
  } else if (event.key === '+' || event.key === '=') {
    viewport.zoomAt(window.innerWidth / 2, window.innerHeight / 2, 1.3);
  } else if (event.key === '-' || event.key === '_') {
    viewport.zoomAt(window.innerWidth / 2, window.innerHeight / 2, 1 / 1.3);
  } else if (event.key === '0') {
    fitAll(true);
  }
});

stage.addEventListener('click', () => {
  if (!viewport.wasDragged && panel.isOpen) panel.close();
});

window.addEventListener('resize', () => {
  field.resize();
  ruler.resize();
  nodes.setTransform(viewport.transform);
});

// ── start ───────────────────────────────────────────────────────────────────

/**
 * Below this the marks are too small to be worth looking at, and "the whole
 * span" stops being a useful thing to show.
 */
const LEGIBLE_ZOOM = 0.19;

function fitAll(animate = false): void {
  const fit = fitZoom();
  viewport.minZoom = Math.min(0.2, fit * 0.96);

  if (fit >= LEGIBLE_ZOOM) {
    viewport.fit(bounds.x0, bounds.y0, bounds.x1, bounds.y1, FIT_MARGIN, animate);
    return;
  }
  // A phone cannot hold four thousand years at a readable size. Rather than
  // show an illegible smudge of the whole thing, open at the beginning — at
  // Gilgamesh — and let the reader travel forward through it.
  viewport.minZoom = LEGIBLE_ZOOM;
  const rect = stage.getBoundingClientRect();
  viewport.moveTo(
    bounds.x0 + rect.width / 2 / LEGIBLE_ZOOM - FIT_MARGIN,
    (bounds.y0 + bounds.y1) / 2,
    LEGIBLE_ZOOM,
    animate,
  );
}

function start(): void {
  fitAll();
  requestAnimationFrame(() => document.body.classList.add('is-ready'));

  const hash = location.hash.slice(1);
  if (hash && graph.byId.has(hash)) {
    // Arriving at a specific work is a request to see that work, not a tour.
    setTimeout(() => select(hash, { fly: true }), 400);
    return;
  }

  // The opening rules a line across the whole span. On a screen that cannot
  // hold the whole span it would trace mostly off-frame, so it does not run.
  if (fitZoom() < LEGIBLE_ZOOM) return;

  const skip = runOpening({
    field,
    nodes,
    graph,
    onDone: () => {
      document.body.classList.remove('is-opening');
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('keydown', skip);
    },
  });
  document.body.classList.add('is-opening');
  // Any intent to explore outranks the introduction.
  window.addEventListener('pointerdown', skip, { once: true });
  window.addEventListener('wheel', skip, { once: true, passive: true });
  window.addEventListener('keydown', skip, { once: true });
}

document.fonts?.ready.then(start).catch(start);

function must<T extends Element>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`missing required element: ${selector}`);
  return el;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
