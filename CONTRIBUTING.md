# Contributing & development guide

Thanks for your interest in CS Visualizer! This guide covers the local setup,
the project conventions, and — most usefully — **how to add a new visualizer**.

## Prerequisites

- Node.js 20 or 22
- npm 10+

## Setup

```bash
npm install
npm run dev        # http://localhost:5173
```

## Before you push

Run the same checks CI runs:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

All four must pass. Prefer small, focused commits with
[Conventional Commit](https://www.conventionalcommits.org/) messages
(`feat:`, `fix:`, `style:`, `refactor:`, `test:`, `docs:`, `ci:`).

## Project conventions

- **Separate logic from UI.** Algorithms live in `features/<name>/algorithms/`
  as pure, deterministic functions that return an array of step objects. React
  components in `features/<name>/components/` only render those steps. This keeps
  the logic unit-testable without a DOM.
- **Every step type extends [`AlgorithmStep`](src/lib/animation/step.ts)**
  (`id`, `description`, optional `codeLine`).
- **Reuse the design system.** Use `panel`, `viz-card`, `surface-muted`,
  `control-input`, `pill`, and `canvas-surface` classes plus the shared
  `ControlButton`, `SelectControl`, `SegmentedControl`, `SliderControl`,
  `Legend`, `StatusBadge`, `ExplanationPanel`, and `PseudocodePanel` components
  instead of one-off markup. Everything must work in light **and** dark mode.
- **Respect motion preferences** via `useReducedMotion` for anything animated.

## Adding a new visualizer

1. **Create the feature folder** `src/features/<name>/` with:
   - `<name>Types.ts` — a step type extending `AlgorithmStep`.
   - `algorithms/<name>.ts` — a pure `generate…Steps(...)` function.
   - `components/<Name>Visualizer.tsx` — the UI, driven by
     `useAnimationController` (or `useStepSequence` for operation-based
     structures).
   - `__tests__/<name>.test.ts` — cover correctness and edge cases.
2. **Register it** in [`src/features/visualizers.tsx`](src/features/visualizers.tsx)
   — add a `VisualizerKey`, a catalogue entry (label, description, icon).
3. **Wire the component** in [`src/App.tsx`](src/App.tsx)'s switch.
4. Run the checks above and add a screenshot to `docs/screenshots/`.

Because the nav, persistence guard, and key type all derive from the registry,
those are the only places you touch.

## Testing tips

- Use `npm run test:watch` while iterating.
- Test the pure step generators directly — assert the final state and a few key
  intermediate steps rather than every frame.
- Hooks and components use React Testing Library (`renderHook`, `render`); see
  `src/lib/animation/__tests__` and `src/__tests__` for examples.

## Reporting issues

Use the templates under `.github/ISSUE_TEMPLATE/`. Include steps to reproduce,
the visualizer and algorithm involved, and your browser/OS.
