import type { LiteraryGraph } from '../engine/graph';
import type { Field } from './field';
import type { Nodes } from './nodes';

/**
 * The opening: one lineage ruled across the whole page before the rest of the
 * map exists.
 *
 * Gilgamesh → Iliad → Aeneid → Divine Comedy → Paradise Lost → Moby-Dick →
 * Blood Meridian. Seven works, four thousand and eighty-five years, and every
 * link a real edge in the corpus — this is not a decorative animation over the
 * data, it is the data drawing its own thesis. If any link is ever removed the
 * sequence refuses to run rather than showing a chain that isn't there.
 *
 * It is skippable by any input, and never runs for a reader who has asked for
 * reduced motion.
 */
export const OPENING_CHAIN = [
  'gilgamesh',
  'iliad',
  'aeneid',
  'divine-comedy',
  'paradise-lost',
  'moby-dick',
  'blood-meridian',
] as const;

/** Milliseconds spent tracing each link, and holding the finished chain. */
const PER_LINK = 470;
const HOLD = 640;
/**
 * The release. Over this the traced lineage gives up its colour, the rest of
 * the map comes the rest of the way up, and the seven titles fade — all of it
 * converging on exactly what the ordinary map draws, so the handover at the
 * end is not a cut.
 */
const DISSOLVE = 1100;
/** Fraction of the trace before the other lines begin coming up behind. */
const VEIL_FROM = 0.68;
/** How far up the rest of the map has come by the time the trace ends. */
const VEIL_AT_HANDOVER = 0.45;

export interface IntroHandles {
  field: Field;
  nodes: Nodes;
  graph: LiteraryGraph;
  onDone: () => void;
}

export function runOpening({ field, nodes, graph, onDone }: IntroHandles): () => void {
  const cast = OPENING_CHAIN.filter((id) => graph.byId.has(id));
  const links: number[] = [];
  for (let i = 1; i < OPENING_CHAIN.length; i++) {
    const from = OPENING_CHAIN[i - 1]!;
    const to = OPENING_CHAIN[i]!;
    const index = graph.edges.findIndex((e) => e.from === from && e.to === to);
    if (index >= 0) links.push(index);
  }

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced || links.length !== OPENING_CHAIN.length - 1) {
    onDone();
    return () => {};
  }

  const traceTotal = links.length * PER_LINK + HOLD;
  let start = performance.now();
  let frame: number | null = null;
  let releasing = false;
  let ended = false;

  const arrived = new Set<string>([cast[0]!]);
  let lead = cast[0]!;
  nodes.setIntroCast(arrived, lead, true);

  /** Hand the map back. By now the intro is drawing what the map draws. */
  const end = () => {
    if (ended) return;
    ended = true;
    if (frame !== null) cancelAnimationFrame(frame);
    field.setIntro(null);
    nodes.setIntroCast(null, null, false);
  };

  /**
   * Enter the release. Called when the trace finishes on its own, and also
   * when the reader skips — a skip should resolve the picture, not cut it.
   */
  const release = () => {
    if (releasing || ended) return;
    releasing = true;
    // Everything is on screen and interactive from here; only the emphasis
    // is still coming off.
    nodes.setIntroCast(new Set(cast), null, false);
    nodes.setIntroExit();
    onDone();
  };

  const skip = () => {
    if (ended) return;
    if (!releasing) start = performance.now() - traceTotal;
    release();
  };

  const tick = (now: number) => {
    const elapsed = now - start;
    const drawn = new Map<number, number>();

    links.forEach((index, i) => {
      const progress = clamp01((elapsed - i * PER_LINK) / PER_LINK);
      if (progress > 0) drawn.set(index, ease(progress));
      // A work appears the moment the line reaches it, not before.
      if (progress >= 1) {
        arrived.add(cast[i + 1]!);
        lead = cast[i + 1]!;
      }
    });

    if (elapsed < traceTotal) {
      nodes.setIntroCast(arrived, lead, true);
      const up = clamp01((elapsed - traceTotal * VEIL_FROM) / (traceTotal * (1 - VEIL_FROM)));
      field.setIntro({ drawn, veil: up * VEIL_AT_HANDOVER, emphasis: 1 });
      frame = requestAnimationFrame(tick);
      return;
    }

    release();
    const d = clamp01((elapsed - traceTotal) / DISSOLVE);
    field.setIntro({
      drawn,
      veil: VEIL_AT_HANDOVER + (1 - VEIL_AT_HANDOVER) * ease(d),
      emphasis: 1 - ease(d),
    });

    if (d >= 1) end();
    else frame = requestAnimationFrame(tick);
  };

  frame = requestAnimationFrame(tick);
  return skip;
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

/** Ease out, so each link lands rather than stopping dead. */
function ease(t: number): number {
  return 1 - Math.pow(1 - t, 2.4);
}
