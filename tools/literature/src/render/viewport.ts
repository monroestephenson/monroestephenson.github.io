/**
 * Pan and zoom over a fixed world rectangle.
 *
 * Deliberately hand-rolled and dependency-free: the whole contract is a
 * transform {x, y, k} plus a change callback, which both the canvas layer and
 * the DOM layer read. Nothing else in the app touches wheel or pointer events.
 */

export interface Transform {
  x: number;
  y: number;
  k: number;
}

export interface ViewportOptions {
  minZoom?: number;
  maxZoom?: number;
  worldWidth: number;
  worldHeight: number;
  onChange: (transform: Transform) => void;
}

export class Viewport {
  transform: Transform = { x: 0, y: 0, k: 1 };
  /** Writable: the floor depends on the viewport, which can change. */
  minZoom: number;
  private readonly el: HTMLElement;
  private readonly opts: Required<Omit<ViewportOptions, 'onChange'>> & {
    onChange: (t: Transform) => void;
  };
  private pointers = new Map<number, { x: number; y: number }>();
  private pinchDistance = 0;
  private dragged = false;
  private animation: number | null = null;

  constructor(el: HTMLElement, options: ViewportOptions) {
    this.el = el;
    this.opts = { minZoom: 0.18, maxZoom: 4.5, ...options };
    this.minZoom = this.opts.minZoom;

    el.addEventListener('wheel', this.onWheel, { passive: false });
    el.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
  }

  /** True if the last pointer sequence moved far enough to count as a drag. */
  get wasDragged(): boolean {
    return this.dragged;
  }

  private emit(): void {
    this.opts.onChange(this.transform);
  }

  private clampZoom(k: number): number {
    return Math.min(this.opts.maxZoom, Math.max(this.minZoom, k));
  }

  /** Keep at least a screenful of world in view at all times. */
  private clampPan(t: Transform): Transform {
    const rect = this.el.getBoundingClientRect();
    const w = this.opts.worldWidth * t.k;
    const h = this.opts.worldHeight * t.k;
    const slackX = Math.max(rect.width * 0.4, rect.width - w);
    const slackY = Math.max(rect.height * 0.35, rect.height - h);
    t.x = Math.min(slackX, Math.max(Math.min(0, rect.width - w) - slackX * 0, t.x));
    t.x = Math.min(slackX, Math.max(rect.width - w - slackX, t.x));
    t.y = Math.min(slackY, Math.max(rect.height - h - slackY, t.y));
    return t;
  }

  zoomAt(clientX: number, clientY: number, factor: number): void {
    const rect = this.el.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    const t = this.transform;
    const k = this.clampZoom(t.k * factor);
    const ratio = k / t.k;
    this.transform = this.clampPan({
      x: px - (px - t.x) * ratio,
      y: py - (py - t.y) * ratio,
      k,
    });
    this.emit();
  }

  panBy(dx: number, dy: number): void {
    this.transform = this.clampPan({ ...this.transform, x: this.transform.x + dx, y: this.transform.y + dy });
    this.emit();
  }

  /** Centre a world point, optionally changing zoom, with an easing. */
  moveTo(worldX: number, worldY: number, zoom?: number, animate = true): void {
    const rect = this.el.getBoundingClientRect();
    const k = this.clampZoom(zoom ?? this.transform.k);
    const target = this.clampPan({
      x: rect.width / 2 - worldX * k,
      y: rect.height / 2 - worldY * k,
      k,
    });
    if (animate) this.animateTo(target);
    else {
      this.transform = target;
      this.emit();
    }
  }

  /** Fit a world rectangle into the viewport with a margin. */
  fit(x0: number, y0: number, x1: number, y1: number, margin = 60, animate = false): void {
    const rect = this.el.getBoundingClientRect();
    const k = this.clampZoom(
      Math.min((rect.width - margin * 2) / (x1 - x0), (rect.height - margin * 2) / (y1 - y0)),
    );
    const target = this.clampPan({
      x: rect.width / 2 - ((x0 + x1) / 2) * k,
      y: rect.height / 2 - ((y0 + y1) / 2) * k,
      k,
    });
    if (animate) this.animateTo(target);
    else {
      this.transform = target;
      this.emit();
    }
  }

  private animateTo(target: Transform, duration = 620): void {
    if (this.animation !== null) cancelAnimationFrame(this.animation);
    const start = { ...this.transform };
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      this.transform = {
        x: start.x + (target.x - start.x) * e,
        y: start.y + (target.y - start.y) * e,
        k: start.k + (target.k - start.k) * e,
      };
      this.emit();
      if (p < 1) this.animation = requestAnimationFrame(step);
      else this.animation = null;
    };
    this.animation = requestAnimationFrame(step);
  }

  private stopAnimation(): void {
    if (this.animation !== null) {
      cancelAnimationFrame(this.animation);
      this.animation = null;
    }
  }

  private onWheel = (event: WheelEvent): void => {
    event.preventDefault();
    this.stopAnimation();
    // Trackpads send small deltas continuously; mice send large discrete ones.
    // ctrlKey is the pinch-to-zoom gesture browsers synthesise.
    if (event.ctrlKey || Math.abs(event.deltaY) > Math.abs(event.deltaX) * 1.4) {
      const intensity = event.ctrlKey ? 0.012 : 0.0022;
      this.zoomAt(event.clientX, event.clientY, Math.exp(-event.deltaY * intensity));
    } else {
      this.panBy(-event.deltaX, -event.deltaY);
    }
  };

  private onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) return;
    this.stopAnimation();
    this.dragged = false;
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (this.pointers.size === 2) this.pinchDistance = this.spread();
    this.el.classList.add('is-grabbing');
  };

  private onPointerMove = (event: PointerEvent): void => {
    const previous = this.pointers.get(event.pointerId);
    if (!previous) return;
    const next = { x: event.clientX, y: event.clientY };
    this.pointers.set(event.pointerId, next);

    if (this.pointers.size >= 2) {
      const distance = this.spread();
      if (this.pinchDistance > 0) {
        const centre = this.centroid();
        this.zoomAt(centre.x, centre.y, distance / this.pinchDistance);
      }
      this.pinchDistance = distance;
      this.dragged = true;
      return;
    }

    const dx = next.x - previous.x;
    const dy = next.y - previous.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) this.dragged = true;
    this.panBy(dx, dy);
  };

  private onPointerUp = (event: PointerEvent): void => {
    this.pointers.delete(event.pointerId);
    if (this.pointers.size < 2) this.pinchDistance = 0;
    if (this.pointers.size === 0) this.el.classList.remove('is-grabbing');
  };

  private spread(): number {
    const [a, b] = [...this.pointers.values()];
    if (!a || !b) return 0;
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  private centroid(): { x: number; y: number } {
    const points = [...this.pointers.values()];
    const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
    return { x: sum.x / points.length, y: sum.y / points.length };
  }
}
