# Architecture

`cs-visualizer` is organized around one main idea: the algorithm logic should be separate from the React interface.

This keeps the project easier to test, easier to extend, and easier to explain as a portfolio project.

## Core design

Each visualizer has two layers:

1. Pure TypeScript logic
2. React UI components

The pure logic generates a list of visualization steps. The React components render those steps and let the user play, pause, reset, or step through them.

## Step generation

Instead of directly animating inside the algorithm, each algorithm returns structured step objects.

A step usually includes:

- the current data state
- what items are being compared
- what items are being swapped or visited
- a human-readable explanation
- optional pseudocode line information

This makes the animations deterministic and testable.

## Why this matters

For example, a sorting algorithm does not directly move bars on the screen. It produces a sequence of sorting states. The UI then displays those states.

This separation means:

- tests can verify algorithm correctness without a browser
- the UI can be redesigned without rewriting algorithms
- new visualizers can follow the same pattern
- debugging is easier because every animation frame is represented as data

## Shared animation controller

The visualizers use a reusable animation controller pattern for:

- play
- pause
- reset
- next step
- previous step
- speed control
- current step tracking

This avoids duplicating animation state logic across every feature.

## Feature folders

The `src/features` directory contains the main visualizer modules:

- `sorting`
- `graph`
- `heap`
- `linked-list`
- `state-machine`

Each feature keeps its own algorithms, types, components, and tests close together.

## Testing strategy

The tests focus on pure algorithm and state-generation logic.

This is intentional because pure functions are stable, deterministic, and easy to verify.

UI behavior is kept lightweight, while correctness is proven through algorithm tests.

## Extension strategy

To add a new visualizer:

1. Create a new feature folder.
2. Define the data types.
3. Write pure step-generation logic.
4. Add tests for correctness and edge cases.
5. Build React components that render the generated steps.
6. Add the feature to navigation.
