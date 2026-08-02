import type { Work } from '../data/types';

export interface Edge {
  from: string;
  to: string;
  /** Set when the descendant records a specific gloss on this debt. */
  gloss?: string;
}

export interface LiteraryGraph {
  works: Work[];
  byId: Map<string, Work>;
  edges: Edge[];
  /** Ancestors: works this one descends from. */
  parents: Map<string, string[]>;
  /** Descendants: works that name this one. */
  children: Map<string, string[]>;
}

export function buildGraph(works: Work[]): LiteraryGraph {
  const byId = new Map(works.map((w) => [w.id, w]));
  const edges: Edge[] = [];
  const parents = new Map<string, string[]>();
  const children = new Map<string, string[]>();

  for (const work of works) {
    parents.set(work.id, []);
    if (!children.has(work.id)) children.set(work.id, []);
  }

  for (const work of works) {
    for (const ancestorId of work.after ?? []) {
      if (!byId.has(ancestorId)) {
        // A dangling reference is a data bug, not a runtime one: name it loudly
        // in development and carry on rendering the rest of the map.
        console.warn(`[corpus] "${work.id}" descends from unknown work "${ancestorId}"`);
        continue;
      }
      edges.push({ from: ancestorId, to: work.id, gloss: work.debts?.[ancestorId] });
      parents.get(work.id)!.push(ancestorId);
      children.get(ancestorId)!.push(work.id);
    }
  }

  return { works, byId, edges, parents, children };
}

/** Everything upstream or downstream of a work, to any depth. */
export function lineage(
  graph: LiteraryGraph,
  id: string,
): { ancestors: Set<string>; descendants: Set<string> } {
  return {
    ancestors: walk(graph.parents, id),
    descendants: walk(graph.children, id),
  };
}

function walk(adjacency: Map<string, string[]>, start: string): Set<string> {
  const seen = new Set<string>();
  const stack = [...(adjacency.get(start) ?? [])];
  while (stack.length) {
    const id = stack.pop()!;
    if (seen.has(id)) continue;
    seen.add(id);
    stack.push(...(adjacency.get(id) ?? []));
  }
  return seen;
}

/** The set of edges lying entirely within a lineage — what we light up. */
export function lineageEdges(graph: LiteraryGraph, id: string): Set<number> {
  const { ancestors, descendants } = lineage(graph, id);
  const up = new Set([...ancestors, id]);
  const down = new Set([...descendants, id]);
  const hit = new Set<number>();
  graph.edges.forEach((edge, i) => {
    if (up.has(edge.from) && up.has(edge.to)) hit.add(i);
    else if (down.has(edge.from) && down.has(edge.to)) hit.add(i);
  });
  return hit;
}
