# Visualizer layout & rendering audit

Baseline audit captured before the layout/rendering fix sprint. Measurements
were taken in-browser via the dev server (`npm run dev`) using computed
geometry (`getBoundingClientRect` / `getComputedStyle`), not screenshots alone.

## Root cause 1 — blank sorting visualization

The sorting bars render at **0px height** even though each bar has an explicit
`style="height: NN%"`.

| Element | `height` (computed) | Notes |
| --- | --- | --- |
| `.canvas-surface` row | `352px` | definite height (`h-[22rem]`) ✅ |
| `.group` bar column | **`0px`** | `flex flex-1 items-end` — **no explicit height** ❌ |
| bar `div` | **`0px`** | `height: NN%` resolves against a 0-height parent ❌ |

**Why:** the row is `display:flex; align-items:flex-end`. Because the cross-axis
alignment is `flex-end` (not the default `stretch`), the `.group` column items
are **not** stretched to the row height; they size to content. Their only child
is a bar whose height is a *percentage*, which resolves against the column's
(indefinite) height → `0`. The result is a circular dependency that collapses
every bar to `0px`.

**Fix direction:** give the bar column a definite height (`h-full`) so the
percentage bar heights resolve against the 352px row.

## Root cause 2 — overlapping / clipped panels

At laptop widths the centre visualizer column and the explanation panel overlap.

At **1280px** the page section resolves to `grid-template-columns: 489px 384px`.
The centre column's `.panel` blocks report a right edge of **1004px**, i.e.
**175px past their 489px track**, painting *underneath* the explanation panel
(which starts at x≈849).

**Why:** the centre track is `minmax(0, 1fr)` (can shrink to 0), but its grid/flex
descendants default to `min-width: auto` (= min-content) and refuse to shrink, so
their intrinsic width overflows the track to the right.

**Fix direction:**

1. Add `min-width: 0` to the grid/flex children that must shrink (panels,
   headers, control groups, playback bar).
2. Move the explanation panel **below** the visualizer until there is genuinely
   room for it side by side (raise the split to the `2xl` breakpoint), instead of
   squeezing the centre column at common laptop widths.

## Test viewport matrix

| Width | Layout expectation |
| --- | --- |
| 1536 | nav + visualizer + explanation side by side |
| 1440 | explanation stacks below the visualizer (full width) |
| 1280 | explanation stacks below; controls wrap to fewer columns |
| 1024 | nav still beside; single visualizer column |
| 768  | nav stacks; controls wrap |
| 390  | fully stacked, no horizontal overflow |

## Per-visualizer checklist

- [ ] Sorting — bars visible on load; controls not cramped; all 5 algorithms.
- [ ] Graph — traversal/start-node controls separated; canvas keeps usable height.
- [ ] Pathfinding — algorithm + speed controls coexist; grid stays square/visible.
- [ ] Heap — explanation not overlapping the console; tree + array not clipped.
- [ ] Linked list — nodes/arrows not clipped; horizontal scroll only when needed.
- [ ] State machine — states/arrows within bounds; long labels wrap.
- [ ] No unintended horizontal page overflow at any tested width.
