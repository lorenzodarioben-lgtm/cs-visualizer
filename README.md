<div align="center">

# CS Visualizer

**An interactive playground for data structures and algorithms.**
Watch real state transitions unfold step by step — with deterministic playback, live explanations, and pseudocode you can follow along.

![CI](https://github.com/lorenzodarioben-lgtm/cs-visualizer/actions/workflows/ci.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)
![React](https://img.shields.io/badge/React-19-149eca)
![Tests](https://img.shields.io/badge/tests-121%20passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

</div>

---

## Why this project

Most algorithm demos are static diagrams or opaque animations. CS Visualizer takes a different approach: **every visualizer is driven by a pure, deterministic step generator** that returns a typed timeline of state transitions. The UI is just a renderer for that timeline, so you can scrub, step, replay, and read exactly what the algorithm is doing at each moment — and the same logic is unit-tested in isolation.

It doubles as a portfolio piece: a clean feature-sliced architecture, a small reusable design system, full light/dark theming, keyboard-driven playback, accessibility considerations, and CI.

> This project is a showcase of the cumulative knowledge I have gained over several units and trimesters at university, aiming for a High Distinction.

## Features

### 6 visualizers

| Visualizer | What you can explore |
| --- | --- |
| **Sorting** | Bubble, Selection, Insertion, Merge, Quick — with comparisons, sorted regions, a custom-array editor, and swaps animated as bars sliding to exchange positions. |
| **Graph traversal** | BFS vs DFS on predefined graphs, showing the frontier queue/stack, visited/completed nodes, and output order. |
| **Pathfinding**  | Grid-based **BFS, Dijkstra, and A\*** with a wall/weight brush — draw a maze and compare how each algorithm explores it. |
| **Heap** | Min-heap insert / extract-min / peek / heapify as both a tree and a backing array, with bubble-up/down highlighting. |
| **Linked list** | Singly linked list insert / delete / search / reverse with animated pointer movement. |
| **State machine** | A turnstile finite automaton with a live transition table and history. |

### Playback & interaction

- Play / pause / replay, step forward & back, and a **draggable timeline scrubber**.
- **Keyboard shortcuts** — `Space` play/pause, `←/→` (or `H/L`) step, `R` reset.
- **Loop** mode and an adjustable **speed** control.
- Colour-coded **status badges** ("comparing", "swapping", "visited", "path found", …).

### Design & accessibility

-  **Light / dark theme** that follows your OS preference and persists your choice (no flash on load).
-  Respects `prefers-reduced-motion` in both CSS and JS.
-  Responsive layout from mobile to widescreen.
-  Remembers the visualizer you last opened.

## Screenshots

> Capture these locally with `npm run dev` and drop them in `docs/screenshots/` — see [docs/screenshots.md](docs/screenshots.md).

```txt
docs/screenshots/pathfinding.png
docs/screenshots/sorting.png
docs/screenshots/graph.png
```

## Tech stack

Vite · React 19 · TypeScript (strict) · Tailwind CSS · Phosphor Icons · Space Grotesk and JetBrains Mono (self-hosted) · Vitest · React Testing Library · ESLint · Prettier. No paid APIs or external services.

## Getting started

```bash
npm install       # install dependencies
npm run dev       # start the dev server (http://localhost:5173)
npm test          # run the test suite
npm run build     # type-check and build for production
```

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server. |
| `npm run build` | Type-check (`tsc -b`) and build for production. |
| `npm run preview` | Preview the production build. |
| `npm test` | Run the Vitest suite once. |
| `npm run test:watch` | Run tests in watch mode. |
| `npm run typecheck` | Type-check without emitting. |
| `npm run lint` | Lint with ESLint. |
| `npm run format` | Format with Prettier. |

## Architecture

Each feature is self-contained and separates **pure logic** from **React UI**:

```txt
src/
  App.tsx                     # visualizer switch (registry-driven)
  components/                 # shared design system
    controls/                 # Button, Slider, Select, Segmented
    explanation/              # Explanation + pseudocode panels
    layout/                   # AppShell, PlaybackControls, ThemeToggle
    visualization/            # Legend, StatusBadge
  features/
    visualizers.tsx           # single source of truth for the catalogue
    sorting/ graph/ pathfinding/ heap/ linked-list/ state-machine/
      algorithms/             # pure, tested step generators
      components/             # the visualizer UI
      __tests__/              # logic tests
  lib/
    animation/                # useAnimationController, useStepSequence, hooks
    theme/                    # useTheme
    utils/                    # arrays, ids, useLocalStorage
```

Every step generator returns an array of objects extending a shared
[`AlgorithmStep`](src/lib/animation/step.ts) contract (`id`, `description`,
`codeLine`). A reusable [`useAnimationController`](src/lib/animation/useAnimationController.ts)
turns any such timeline into play/pause/step/scrub/loop behaviour, so all six
visualizers share the exact same playback engine.

See [docs/architecture.md](docs/architecture.md) for a deeper tour.

## Testing

121 tests across 14 files cover:

- Sorting correctness and edge cases for all five algorithms.
- Sorting element-identity invariants that back the positional swap animation.
- BFS/DFS traversal order, disconnected graphs, and missing start nodes.
- Pathfinding shortest paths for BFS/Dijkstra/A\*, no-path and weighted-detour cases.
- Min-heap and linked-list operations, including edge cases.
- The animation controller, `useLocalStorage`, shared utils, and algorithm metadata.
- An App smoke test that renders the shell and switches visualizers.

## Roadmap

See [docs/roadmap.md](docs/roadmap.md). Highlights: diagonal movement and a maze
generator for pathfinding, tree rotations, and export-to-GIF.

## License

MIT — see [LICENSE](LICENSE).
