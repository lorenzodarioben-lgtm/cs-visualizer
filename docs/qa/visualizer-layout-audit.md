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

- [x] Sorting — bars visible on load; controls not cramped; all 5 algorithms.
- [x] Graph — traversal/start-node controls separated; canvas keeps usable height.
- [x] Pathfinding — algorithm + speed controls coexist; grid stays square/visible.
- [x] Heap — explanation not overlapping the console; tree + array not clipped.
- [x] Linked list — nodes/arrows not clipped; horizontal scroll only when needed.
- [x] State machine — states/arrows within bounds; long labels wrap.
- [x] No unintended horizontal page overflow at any tested width.

## Verification results

Re-measured in-browser after the fixes. Values are computed geometry, not
screenshots (the sorting-height bug is invisible to a screenshot assertion, so
it is also covered by unit tests in `SortingVisualizer.test.tsx`).

**Sorting bars** — now render on first load: 18 bars, heights 25–318px inside a
352px canvas (was 0px). Bars persist across algorithm, size, speed, and step
changes.

**Layout sweep** — for every visualizer at 1536 / 1440 / 1280 / 1024 / 768 /
390px: no horizontal page overflow and no content spilling out of its column
(overlap = 0px). The explanation panel sits beside the visualizer at 1536 and
stacks below it at 1440 and narrower, so the centre column is never squeezed.
Content that is legitimately wider than its box (a deep heap tree, a long linked
list) scrolls inside an `overflow-x-auto` container instead of overlapping
neighbours.

**Heap** — renders as a valid heap in both min and max modes; a 15-node heap
scrolls its tree horizontally with no page overflow.

**Console** — no React, SVG, ResizeObserver, or key warnings at any width.

## Root-cause fixes (summary)

| Issue | Fix |
| --- | --- |
| Sorting bars 0px | `h-full` on the bar column so percentage heights resolve |
| Panels overflow track | `min-width: 0` on section/column/panel/header + shared `viz-*` classes |
| Explanation squeeze/overlap | split moved to `2xl`; stacks below at laptop widths |
| Cramped control trays | responsive `1 → 2 → 4` column grids; label/badge `min-w-0` + truncate |
| Graph node clipping | padded viewBox + `preserveAspectRatio` |
| Heap tree/list clipping | `overflow-x-auto` scroll containers |
| State nodes overflow | diagram stacks (`flex-col → sm:flex-row`) |
