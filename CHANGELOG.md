# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Design

- **Interface overhaul.** Reworked the visual language into a deliberate
  "algorithm workbench": Space Grotesk display headings and JetBrains Mono for
  code, labels, and numeric data; a slim product masthead in place of the
  marketing hero; a single Phosphor icon family across the navigation and
  controls; a refined navigation active state; solid hairline-bordered panels
  with a tinted elevation scale on a restrained plotting-grid backdrop; recessed
  technical stages for the visualizations; theme-aware graph rendering; and a
  soft staggered entrance with a smooth light/dark transition. All motion honors
  reduced-motion, and both themes meet contrast targets. No visualizer behaviour,
  playback, keyboard interaction, or persisted setting changed.

### Changed

- **Sorting swap animation.** Sorting steps now carry an element-identity array,
  and the bars are keyed by identity and positioned by index. A swap animates as
  the two bars sliding to exchange places — each bar keeps its own height and
  value throughout — instead of one bar growing while the other shrinks.
  Insertion sort was reworked into the adjacent-swap variant so it slides too,
  while merge sort keeps its copy-based height writes. The slide duration scales
  with the playback speed so a swap always finishes before the next step, the
  two swapping bars are lifted and layered so they pass cleanly without
  overlapping, and reduced-motion preferences disable the movement.

### Removed

- The committed `BUILD_REPORT.txt` console dump and the tracked local dev-server
  launch config.

## [2.0.0] — Interactive & portfolio overhaul

A sprint focused on making CS Visualizer feel like a polished, modern portfolio
project: a new marquee feature, full theming, richer playback, and a cleaner
architecture.

### Added

- **Pathfinding visualizer** — grid-based BFS, Dijkstra, and A\* search with a
  wall/weight brush (draw a maze by clicking and dragging), animated frontier,
  visited cells, current cell, and reconstructed shortest path. Backed by pure,
  tested step generators.
- **Light / dark theme** — follows the OS preference, persists an explicit
  choice to `localStorage`, and applies pre-paint to avoid a flash of the wrong
  theme. Accessible sun/moon toggle in the header.
- **Timeline scrubber** to jump to any step, plus an icon-based play / pause /
  replay bar.
- **Keyboard shortcuts** for playback (`Space`, `←/→`, `H/L`, `R`).
- **Loop mode** and colour-coded **status badges** for the current algorithm
  state.
- **Custom array input** for the sorting visualizer (parse, validate, clamp).
- **Persistence** of the last-opened visualizer.
- Reusable `SelectControl`, `SegmentedControl`, and `StatusBadge` components and
  a central **visualizer registry** (`features/visualizers.tsx`).
- New hooks: `useTheme`, `useReducedMotion`, `useKeyboardShortcuts`,
  `useLocalStorage`, and `useStepSequence`.
- Tests for the animation controller, `useLocalStorage`, shared utils,
  algorithm metadata, pathfinding search, and an App smoke test (92 tests total).

### Changed

- Redesigned the app shell into a branded hero with stat chips and a source
  link, and turned the sidebar into an icon-based visualizer card system.
- Introduced a semantic design-token layer (`panel`, `viz-card`, `surface-*`,
  `control-input`, `pill`, `canvas-surface`) so every visualizer renders cleanly
  in light and dark.
- Strengthened types with a shared `AlgorithmStep` base and a generic
  `StatusMap`.
- Consolidated the heap and linked-list state handling into `useStepSequence`.
- Hardened CI: lint, typecheck, test, and build across Node 20 and 22 with a
  build artifact and concurrency cancellation.

### Accessibility

- Honors `prefers-reduced-motion` in both CSS and JS.
- `aria-current`, `radiogroup`, and labelled controls throughout.

## [1.0.0] — Initial release

- Sorting, graph traversal, heap, linked-list, and state-machine visualizers.
- Shared animation controller, explanation and pseudocode panels.
- Vitest coverage for all pure algorithm logic.
