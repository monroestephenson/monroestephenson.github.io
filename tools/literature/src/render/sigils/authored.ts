/**
 * Hand-drawn marks for the works that have an image of their own.
 *
 * The generator in `../sigil.ts` gives every work a mark derived from its form
 * — enough to read as a family, and enough that nothing is ever missing. But a
 * procedure cannot know that Gilgamesh is about a wall and a friend who stops,
 * or that the Tractatus is a ladder you throw away. Where that image exists,
 * it is drawn here and overrides the generated one.
 *
 * Path data only, in the same 100×100 viewBox, stroked not filled. Adding one
 * is a matter of adding a key: nothing else needs to change.
 */
export const authoredSigils: Record<string, string> = {
  // A wall, and two figures on it — one of whom stops.
  gilgamesh:
    'M14 78 H86 M24 78 V68 M38 78 V72 M52 78 V66 M66 78 V72 M78 78 V68 M40 62 V20 M60 62 V38',

  // The shield of Achilles: the world in rings, with the war cut into it.
  iliad:
    'M16 50 A34 34 0 1 1 84 50 A34 34 0 1 1 16 50 M26 50 A24 24 0 1 1 74 50 A24 24 0 1 1 26 50 M36 50 A14 14 0 1 1 64 50 A14 14 0 1 1 36 50 M50 16 V36 M74 74 L60 60',

  // A wandering line that ends exactly where it started.
  odyssey:
    'M50 78 C10 78 6 30 34 20 C62 10 92 30 84 52 C78 70 56 66 50 78 M47.4 78 a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0',

  // The torch handed on: one line stops, another takes it up further along.
  aeneid:
    'M10 84 C24 78 34 66 40 52 M60 44 C66 30 76 20 90 14 M46 48 L50 34 L54 48 M46 48 Q50 55 54 48',

  // The funnel narrowing, and the stars you come out to see again.
  'divine-comedy':
    'M20 42 A30 9 0 1 1 80 42 A30 9 0 1 1 20 42 M28 60 A22 7 0 1 1 72 60 A22 7 0 1 1 28 60 M36 76 A14 5 0 1 1 64 76 A14 5 0 1 1 36 76 M20 42 L36 76 M80 42 L64 76 M46 16 A4 4 0 1 1 54 16 A4 4 0 1 1 46 16',

  // Four sails, and the lance going through them.
  'don-quixote':
    'M50 50 L26 26 M50 50 L74 26 M50 50 L74 74 M50 50 L26 74 M45 50 A5 5 0 1 1 55 50 A5 5 0 1 1 45 50 M12 84 L76 32',

  // A self facing itself, and the line between them broken.
  hamlet:
    'M44 18 C24 32 24 68 44 82 M56 18 C76 32 76 68 56 82 M50 18 V40 M50 60 V82',

  // A circle come apart, with nothing left at the centre.
  'king-lear':
    'M55.9 16.5 A34 34 0 0 1 81.9 61.6 M76 71.9 A34 34 0 0 1 23.9 71.9 M18 38.4 A34 34 0 0 1 44.1 16.5',

  // The fall, the counter-rising, the ground under both.
  'paradise-lost':
    'M12 18 C34 22 46 40 56 84 M64 86 C74 76 79 62 85 42 M8 88 H92',

  // The wake, and the line laid across it.
  'moby-dick':
    'M50 50 C50 44 58 44 58 50 C58 60 44 60 44 50 C44 36 62 36 62 50 C62 68 38 68 38 50 C38 30 68 30 68 50 M14 84 L86 22',

  // One day, marked off in hours, with a single one struck.
  ulysses:
    'M18 50 A32 32 0 1 1 82 50 A32 32 0 1 1 18 50 M82 50 H77 M72.6 72.6 L69.1 69.1 M50 82 V77 M27.4 72.6 L30.9 69.1 M18 50 H23 M27.4 27.4 L30.9 30.9 M50 18 V23 M72.6 27.4 L69.1 30.9 M50 50 L30.9 69.1',

  // A line that runs its whole length and closes on where it began.
  'in-search-of-lost-time':
    'M22 22 H72 A10 10 0 0 1 72 42 H30 A10 10 0 0 0 30 62 H72 A10 10 0 0 1 72 82 H26 C14 82 14 32 22 23',

  // Doorways inside doorways, none of them the last.
  trial: 'M16 84 V18 H84 V84 M26 84 V26 H74 V84 M36 84 V34 H64 V84 M46 84 V42 H54 V84',

  // Fragments shored, on a broken ground.
  'waste-land':
    'M20 30 V58 M34 20 V44 M34 52 V70 M50 26 V50 M64 34 V62 M78 22 V40 M78 48 V66 M14 82 H40 M50 82 H70 M78 82 H90',

  // The mountain, and time closing up as you climb it.
  'magic-mountain':
    'M14 84 L50 20 L86 84 M26 74 H74 M32 63 H68 M37 54 H63 M41 47 H59 M44 41 H56 M46.5 36 H53.5',

  // The tower, and the ten years that pass in brackets across the middle.
  'to-the-lighthouse':
    'M44 86 L47 26 H53 L56 86 M40 20 H60 M12 52 H88 M12 58 H88',

  // Four tellings, thinning towards clarity.
  'sound-and-fury':
    'M18 22 V78 M22 30 V70 M26 24 V74 M30 34 V64 M42 22 V78 M48 28 V72 M62 22 V78 M82 22 V78',

  // Three brothers, one question.
  'brothers-karamazov':
    'M22 18 L50 82 M50 18 V82 M78 18 L50 82 M18 14 H82 M47 82 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0',

  // The multitude, and the single wave it makes.
  'war-and-peace':
    'M10 58 C24 38 34 38 46 54 C58 70 70 70 90 42 M16 72 V78 M24 74 V80 M32 71 V77 M40 76 V82 M48 73 V79 M56 77 V83 M64 72 V78 M72 75 V81 M80 70 V76',

  // A closed room, and the route out that comes back in.
  'madame-bovary':
    'M50 26 C74 26 84 42 84 52 C84 66 68 78 50 78 C32 78 16 66 16 52 C16 42 26 26 50 26 M50 26 C50 40 62 44 62 52 C62 62 50 64 50 78',

  // One self, containing multitudes.
  'leaves-of-grass':
    'M50 84 L20 40 M50 84 L30 24 M50 84 L44 14 M50 84 L56 16 M50 84 L70 28 M50 84 L84 44 M50 84 L12 62 M50 84 L88 64 M50 84 L50 28',

  // Inward, and inward, to a point.
  'notes-underground':
    'M88 50 C88 72 72 88 50 88 C28 88 12 72 12 50 C12 30 28 16 48 16 C64 16 76 28 76 44 C76 56 66 66 54 66 C46 66 39 60 39 52 C39 46 44 41 50 42 M47.5 50 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0',

  // Eliot's own figure for the book: a web, and every thread pulling.
  middlemarch:
    'M80 50 L71.2 71.2 L50 80 L28.8 71.2 L20 50 L28.8 28.8 L50 20 L71.2 28.8 Z M80 50 L20 50 M71.2 71.2 L28.8 28.8 M50 80 V20 M28.8 71.2 L71.2 28.8',

  // The river narrowing, and the thing at the end of it.
  'heart-of-darkness':
    'M8 30 C30 38 46 46 56 50 M8 70 C30 62 46 54 56 50 M62 50 A6 6 0 1 1 74 50 A6 6 0 1 1 62 50 M56 50 A12 12 0 1 1 80 50 A12 12 0 1 1 56 50 M50 50 A18 18 0 1 1 86 50 A18 18 0 1 1 50 50',

  // The dashes, which the editors kept trying to remove.
  dickinson:
    'M20 24 H34 M42 24 H50 M58 24 H74 M20 38 H30 M38 38 H58 M20 52 H26 M34 52 H44 M52 52 H72 M20 66 H40 M48 66 H56 M64 66 H76 M20 80 H32 M40 80 H46',

  // Coming down the mountain, under a wheel that comes round again.
  zarathustra:
    'M10 86 L40 38 L58 62 L90 86 M40 38 L52 86 M56 22 A14 14 0 1 1 84 22 A14 14 0 1 1 56 22',

  // Striving: the line that will not stay inside the circle.
  faust:
    'M24 54 A26 26 0 1 1 76 54 A26 26 0 1 1 24 54 M32 86 L72 12',

  // Two that occupy the same ground.
  'wuthering-heights':
    'M20 50 A24 24 0 1 1 68 50 A24 24 0 1 1 20 50 M32 50 A24 24 0 1 1 80 50 A24 24 0 1 1 32 50 M50 26 V74',

  // Three tellings wrapped round a thing that cannot speak for itself.
  frankenstein:
    'M74 14 A40 40 0 1 0 74 86 M70 23 A31 31 0 1 0 70 77 M66 32 A22 22 0 1 0 66 68 M50 38 V47 M50 53 V62',

  // Two approaches, mirrored, arriving at the same point.
  'pride-prejudice':
    'M14 20 C40 28 46 42 50 58 M86 20 C60 28 54 42 50 58 M47 58 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M20 78 H80',

  // The river, and the thing floating down it.
  'huckleberry-finn':
    'M8 30 C28 26 24 50 42 52 C62 54 54 74 78 72 C86 71.5 89 69 92 64 M8 42 C26 39 22 60 42 62 C60 64 52 82 78 81',

  // A light on the other side of the water.
  'great-gatsby':
    'M74 28 A5 5 0 1 1 84 28 A5 5 0 1 1 74 28 M18 26 V74 M14 48 C26 44 38 52 50 48 C62 44 70 52 82 48 M14 58 C26 54 38 62 50 58 C62 54 70 62 82 58 M14 68 C26 64 38 72 50 68 C62 64 70 72 82 68',

  // The horizon, the sun that does not set, and the tally.
  'blood-meridian':
    'M8 54 H92 M42 54 A8 8 0 1 1 58 54 A8 8 0 1 1 42 54 M16 60 V76 M22 60 V70 M28 60 V78 M34 60 V68 M40 60 V76 M46 60 V70 M52 60 V78 M58 60 V68 M64 60 V76 M70 60 V70 M76 60 V78 M82 60 V68',

  // A screaming comes across the sky, and the descent is not shown whole.
  'gravitys-rainbow':
    'M8 86 C24 24 40 14 52 14 C62 14 72 30 78 46 M80 52 L82 58 M84 64 L86 70 M88 76 L90 84 M8 86 V70',

  // Less, and less, and a voice that has not stopped.
  'beckett-trilogy':
    'M16 28 H84 M28 48 H72 M44 66 H56 M47 82 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0',

  // The library, which is also the labyrinth.
  'borges-ficciones':
    'M84 16 H16 V84 H76 V26 H26 V74 H68 V34 H34 V66 H60 V42 H42 V58 H52',

  // Seven turns of the same family, arriving back at the start.
  'hundred-years-solitude':
    'M50 50 A6 6 0 0 1 62 50 A12 12 0 0 1 38 50 A18 18 0 0 1 74 50 A24 24 0 0 1 26 50 A30 30 0 0 1 86 50 M62 46 V54 M38 46 V54 M74 46 V54 M26 46 V54 M86 46 V54',

  // Five parts, and the one in the middle that is only a list.
  '2666':
    'M14 16 V84 M32 16 V84 M68 16 V84 M86 16 V84 M40 22 H60 M40 29 H60 M40 36 H60 M40 43 H60 M40 50 H60 M40 57 H60 M40 64 H60 M40 71 H60 M40 78 H60',

  // A loop inside a loop, and the thing at the crossing.
  'infinite-jest':
    'M50 50 C30 30 14 40 14 50 C14 60 30 70 50 50 C70 30 86 40 86 50 C86 60 70 70 50 50 M50 50 C42 42 34 46 34 50 C34 54 42 58 50 50 C58 42 66 46 66 50 C66 54 58 58 50 50 M47 50 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0',

  // Seven parts, one sentence, and the pen never lifted.
  septology:
    'M18 18 H82 C88 18 88 28 82 28 H18 C12 28 12 38 18 38 H82 C88 38 88 48 82 48 H18 C12 48 12 58 18 58 H82 C88 58 88 68 82 68 H18 C12 68 12 78 18 78 H82',

  // A circle that will not close, and what is standing in the gap.
  beloved:
    'M62 21 A32 32 0 1 1 38 21 M40 34 A10 10 0 1 1 60 34 A10 10 0 1 1 40 34',

  // The ladder, with nothing to stand on at the top.
  tractatus:
    'M36 86 V16 M64 86 V16 M36 78 H64 M36 68 H64 M36 58 H64 M36 48 H64 M36 38 H64 M36 28 H64',

  // Propositions, and the one thing left outside them.
  'wittgensteins-mistress':
    'M18 26 H44 M18 40 H32 M18 54 H50 M18 68 H28 M76 36 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0',

  // The end running past the beginning.
  'finnegans-wake': 'M50 16 A34 34 0 1 1 38 18 M38 18 A28 28 0 0 1 64 27',

  // The ring, coming apart at four places at once.
  'things-fall-apart':
    'M53 17 A34 34 0 0 1 84 48 M86 56 A34 34 0 0 1 56 86 M44 84 A34 34 0 0 1 14 54 M16 44 A34 34 0 0 1 46 14',

  // Downward, in stages, with something broken at each one.
  'journey-end-of-night':
    'M10 18 L26 30 L21 35 L38 46 L33 51 L50 60 L45 65 L62 74 L57 79 L76 86 L92 88',

  // Loose leaves in a trunk, in no order at all.
  'book-of-disquiet':
    'M18 22 H38 M48 26 H70 M22 34 H36 M44 38 H58 M66 34 H82 M18 48 H30 M40 46 H52 M62 50 H78 M24 60 H44 M54 58 H64 M20 72 H34 M44 74 H68 M74 68 H86',

  // A company on the road, all talking at different heights.
  'canterbury-tales':
    'M12 78 H88 M18 78 V56 M26 78 V48 M34 78 V60 M42 78 V44 M50 78 V54 M58 78 V46 M66 78 V58 M74 78 V50 M82 78 V62 M23 22 H29 M39 22 H45',

  // The wheel: what is here is found elsewhere, what is not here is nowhere.
  mahabharata:
    'M16 50 A34 34 0 1 1 84 50 A34 34 0 1 1 16 50 M50 50 L84 50 M50 50 L79.4 67 M50 50 L67 79.4 M50 50 V84 M50 50 L33 79.4 M50 50 L20.6 67 M50 50 H16 M50 50 L20.6 33 M50 50 L33 20.6 M50 50 V16 M50 50 L67 20.6 M50 50 L79.4 33 M44 50 A6 6 0 1 1 56 50 A6 6 0 1 1 44 50',

  // Screens, and a season passing behind them.
  'tale-of-genji':
    'M20 24 V80 M32 18 V74 M44 24 V80 M56 18 V74 M68 24 V80 M80 18 V74 M12 46 C34 34 66 62 88 48',

  // Everything on one side of the line, and one act on the other.
  'crime-punishment':
    'M50 10 V90 M20 24 H46 M26 32 H46 M18 40 H46 M28 48 H46 M22 56 H46 M30 64 H46 M20 72 H46 M54 50 H82',

  // Two lines running level, until one of them stops.
  'anna-karenina':
    'M10 40 C34 40 60 44 90 44 M10 58 C34 58 60 53 90 53 M16 41 V57 M28 41 V57 M40 42 V56 M52 43 V55 M64 44 V54 M76 38 V60',
};
