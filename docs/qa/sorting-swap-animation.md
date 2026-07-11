# Sorting swap animation — verification

Manual, in-browser verification of the identity-based swap animation, using
computed geometry (element `left`, `style.height`, `zIndex`) rather than
screenshots.

## What was checked

- **Bars render on load** — 18 bars for the default array, every inner bar has a
  positive percentage height (28–350px in the 352px canvas).
- **A swap moves bars, not heights** — with the input `9, 1, 5, 3`, the value 9
  keeps its height and slides across positions 0 → 1 → 2 as it bubbles; the two
  bars in a swap keep their own values throughout.
- **Crossover stays clean** — at a swap step the incoming-from-left bar gets
  `z-index: 30` with a larger lift, the other gets `z-index: 20`; both carry the
  rose ring. Non-swapping bars have no transform.
- **Duration scales with speed** — the slide is 64ms at the fastest speed and is
  capped at 520ms at the slowest, always shorter than the step interval, so a
  swap settles before the next step.
- **Every algorithm sorts with no overlap** — bubble, selection, insertion,
  merge, and quick each end fully sorted with every bar at a distinct horizontal
  position (no two bars share a slot).
- **No console errors** on load or during a full autoplay run to completion.

## Notes

- Merge sort is copy-based, so its writes animate as a height change at a fixed
  slot rather than a positional slide; this is the honest representation of a
  copy. All swap/shift-based sorts (bubble, selection, insertion, quick) animate
  as positional slides.
- Because bars live in an `overflow-hidden` canvas, a very tall bar may clip a
  few pixels at the top of its brief lift during a swap; this is not visible at
  typical bar heights.
