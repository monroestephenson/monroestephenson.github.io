# The Long Inheritance

An interactive map of literary descent — 302 works from the Epic of Gilgamesh to
Septology, and the 565 lines of influence between them. Static, dependency-free
at runtime, and built to be dropped onto any host.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
```

The build uses `base: './'`, so `dist/` works unchanged from any sub-path —
copy it to `yoursite.com/literature/` and nothing needs reconfiguring.

## Adding a work

Everything is derived from one array. Append an object to whichever file in
`src/data/works/` covers the period — the files are split for the sake of
editing and the timeline sorts by year regardless of which one an entry is in.

```ts
{
  id: 'the-waves',                    // slug; also the URL hash
  title: 'The Waves',
  author: 'Virginia Woolf',
  year: 1931,                         // negative is BCE; approximations are fine
  date: '1931',                       // how the date is written for a reader
  form: 'novel',
  tradition: 'english',
  weight: 2,                          // 3 = pillar, always legible; 1 = detail
  note: 'Six voices speaking in formal, unspoken soliloquy…',
  after: ['to-the-lighthouse'],       // the works it descends from
  debts: {                            // optional gloss on a specific debt
    'to-the-lighthouse': 'Pushes the interlude sections of Lighthouse…',
  },
}
```

That is the whole change. The layout re-solves, the influence lines appear, the
work gets a generated sigil, and it becomes searchable and linkable at
`#the-waves`. Nothing is positioned by hand — there are no coordinates anywhere
in the data.

A dangling `after` id logs a warning to the console and is otherwise skipped, so
a typo degrades rather than breaks. `npm run check` type-checks the corpus.

## How it fits together

**`src/data/`** — the corpus and its types. The only file that knows about
particular books.

**`src/engine/scale.ts`** — year → position. The axis is piecewise linear over
declared segments, each given a share of the width roughly proportional to how
much happens inside it. A linear axis would be useless (four thousand years,
nine tenths of them empty); a log axis over-corrects and smears antiquity. The
compression is deliberately visible in the ruler's changing tick spacing.

**`src/engine/layout.ts`** — x is fixed by the date; y is solved for. Works are
pulled towards what they descend from and pushed off anything they would sit on
top of. The traditions separate out on their own. Seeded from work ids, so the
map is identical on every load.

**`src/engine/graph.ts`** — the influence graph and ancestry/descendant walks.

**`src/render/sigil.ts`** — every work's abstract mark. The *form* picks the
underlying gesture (an epic radiates, a novel winds, an argument builds a
lattice, verse stacks into lines), the *tradition* picks the colour of the rule
beneath it, and a hash of the id supplies every count, angle and radius. Fifty-
odd works whose image is specific enough to draw have a hand-authored path in
`src/render/sigils/authored.ts`, which overrides the generated one — add a key
there and nothing else changes.

**`src/render/nodes.ts`** — one DOM element per work, positioned in screen space
each frame. Titles stay a constant size at every zoom, and a decluttering pass
claims label space in order of weight.

Three rules keep that from flickering, which matters more than it sounds:
the occupancy grid is anchored to the world rather than the screen, so panning
can never change which titles are shown; the zoom is quantised into steps, so a
continuous pinch holds one set of labels until it crosses a step; and below
`LABEL_ZOOM` no titles are drawn at all. The map opens as a field of marks and
threads, and names appear only once you are close enough that they will land in
clear space and stay. An unnamed mark still gives up its title on hover, on
focus, and when selected.

**`src/render/intro.ts`** — the opening. One lineage is ruled across the whole
page before the rest of the map exists: Gilgamesh → Iliad → Aeneid → Divine
Comedy → Paradise Lost → Moby-Dick → Blood Meridian, seven works and four
thousand and eighty-five years, each link a real edge in the corpus. It is not
an animation laid over the data; it is the data drawing the page's own thesis,
and if any link is ever removed the sequence refuses to run rather than show a
chain that isn't there. Any input skips it, it never runs under
`prefers-reduced-motion`, it is skipped on a deep link to a specific work, and
it is skipped on screens too narrow to hold the span it would trace.

**`src/render/field.ts`** — canvas: era hairlines and the influence curves.

**`src/render/ruler.ts`**, **`panel.ts`**, **`viewport.ts`** — the axis, the
reading card, and pan/zoom.

## Sources

The modern end of the corpus is weighted by four community canons —
[r/TrueLit's Top 100](https://www.goodreads.com/list/show/166184._r_TrueLit_s_Top_100_Books),
[TrueLit 2023](https://www.goodreads.com/list/show/221547.TrueLit_Top_100_2023),
[TrueLit's 100 Best of the Quarter Century](https://www.goodreads.com/list/show/218989.Truelit_s_100_Best_Books_of_the_Quarter_Century),
and the [aggregated /lit/ top 100](https://www.goodreads.com/list/show/165697.Ultimate_lit_4Chan_Greatest_Books_of_All_Time)
— extended backwards through the older canon and outwards to the traditions
those lists under-serve.

Influence edges are editorial. Some are documented beyond argument (Virgil on
Dante, Markson on Wallace); others are a reading. They are meant to be argued
with, which is easier than usual here: they are all in one place, in plain text.

## Type

Two voices, one rule. **Fraunces** speaks for the books and their dates; its
optical-size axis means the 14px map label and the 33px panel title are
genuinely different drawings of the face rather than one scaled, and its WONK
axis swaps in the quirky old-style forms that suit a page whose left edge is a
clay tablet. Its wonk is switched off for the panel's prose, where quirk at
paragraph length is a distraction. **Archivo Narrow**, tracked and uppercase,
speaks for the instrument: era labels, the form key, counts, hints. Nothing on
the page is set in a face that does not belong to one of those two jobs.

## Notes

- Keyboard: `/` search, `0` fit, `+`/`-` zoom, `Esc` close. Tab reaches the
  pillars; everything else is reachable through search or the panel's links.
- Respects `prefers-reduced-motion`.
- Fraunces and Archivo Narrow load from Google Fonts, with a serif and a
  grotesque stack behind them; the page is fully functional if that fails.
