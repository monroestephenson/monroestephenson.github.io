import { formLabels, traditionLabels } from '../data';
import type { Work } from '../data/types';
import type { LiteraryGraph } from '../engine/graph';
import { sigilSvg, traditionInk } from './sigil';

/** The reading card. Opens on selection, and is the only place with prose. */
export class Panel {
  private readonly el: HTMLElement;
  private readonly body: HTMLElement;
  private readonly graph: LiteraryGraph;
  private readonly onNavigate: (id: string) => void;

  constructor(el: HTMLElement, graph: LiteraryGraph, onNavigate: (id: string) => void) {
    this.el = el;
    this.graph = graph;
    this.onNavigate = onNavigate;

    const close = document.createElement('button');
    close.className = 'panel-close';
    close.type = 'button';
    close.setAttribute('aria-label', 'Close');
    close.innerHTML = '<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
    close.addEventListener('click', () => this.close());

    this.body = document.createElement('div');
    this.body.className = 'panel-body';

    el.append(close, this.body);
    el.addEventListener('click', (event) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-goto]');
      if (target?.dataset.goto) this.onNavigate(target.dataset.goto);
    });
  }

  get isOpen(): boolean {
    return this.el.classList.contains('is-open');
  }

  close(): void {
    this.el.classList.remove('is-open');
    this.el.setAttribute('aria-hidden', 'true');
    this.el.dispatchEvent(new CustomEvent('panel:close', { bubbles: true }));
  }

  show(work: Work): void {
    const parents = (this.graph.parents.get(work.id) ?? [])
      .map((id) => this.graph.byId.get(id))
      .filter((w): w is Work => Boolean(w))
      .sort((a, b) => a.year - b.year);
    const children = (this.graph.children.get(work.id) ?? [])
      .map((id) => this.graph.byId.get(id))
      .filter((w): w is Work => Boolean(w))
      .sort((a, b) => a.year - b.year);

    this.el.style.setProperty('--ink', traditionInk[work.tradition]);
    this.body.innerHTML = `
      <div class="panel-sigil">${sigilSvg(work, 132)}</div>
      <p class="panel-date">${escape(work.date)}</p>
      <h2 class="panel-title">${escape(work.title)}</h2>
      ${work.author ? `<p class="panel-author">${escape(work.author)}</p>` : '<p class="panel-author panel-author--none">Anonymous</p>'}
      <p class="panel-tags">
        <span>${escape(formLabels[work.form] ?? work.form)}</span>
        <span class="panel-tags-sep">·</span>
        <span>${escape(traditionLabels[work.tradition] ?? work.tradition)}</span>
      </p>
      <p class="panel-note">${escape(work.note)}</p>
      ${this.renderDebts(work, parents)}
      ${renderList('Descends from', parents, 'up')}
      ${renderList('Gives rise to', children, 'down')}
    `;

    this.el.classList.add('is-open');
    this.el.setAttribute('aria-hidden', 'false');
    this.el.scrollTop = 0;
  }

  private renderDebts(work: Work, parents: Work[]): string {
    if (!work.debts) return '';
    const entries = parents
      .filter((parent) => work.debts?.[parent.id])
      .map(
        (parent) => `
          <li>
            <button class="panel-debt" type="button" data-goto="${escape(parent.id)}">
              <span class="panel-debt-source">${escape(parent.title)}</span>
              <span class="panel-debt-text">${escape(work.debts![parent.id]!)}</span>
            </button>
          </li>`,
      );
    if (!entries.length) return '';
    return `<ul class="panel-debts">${entries.join('')}</ul>`;
  }
}

function renderList(heading: string, works: Work[], direction: 'up' | 'down'): string {
  if (!works.length) return '';
  const items = works
    .map(
      (work) => `
        <li>
          <button class="panel-link" type="button" data-goto="${escape(work.id)}">
            <span class="panel-link-mark" style="--ink:${traditionInk[work.tradition]}"></span>
            <span class="panel-link-title">${escape(work.title)}</span>
            <span class="panel-link-year">${escape(shortDate(work))}</span>
          </button>
        </li>`,
    )
    .join('');
  return `
    <section class="panel-section panel-section--${direction}">
      <h3 class="panel-heading">${escape(heading)}</h3>
      <ul class="panel-list">${items}</ul>
    </section>`;
}

function shortDate(work: Work): string {
  if (work.year < 0) return `${Math.abs(work.year)} BCE`;
  if (work.year < 1000) return `${work.year} CE`;
  return String(work.year);
}

function escape(value: string): string {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
