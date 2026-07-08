# Testing Strategy

`cs-visualizer` uses tests to verify the pure algorithm and state-generation logic behind each visualizer.

The goal is to prove that the visualizers are backed by real logic, not static mockups.

## Why test pure logic?

The app separates algorithm logic from React components.

Pure logic is easier to test because it:

- does not depend on the DOM
- does not depend on timers
- does not depend on React rendering
- returns deterministic data
- is easier to debug when something fails

## What the tests cover

The test suite focuses on correctness and edge cases for each visualizer.

## Sorting tests

Sorting tests verify:

- bubble sort
- selection sort
- insertion sort
- merge sort
- quick sort
- empty arrays
- one-item arrays
- duplicate numbers
- negative numbers

## Graph traversal tests

Graph tests verify:

- BFS on a known graph
- DFS on a known graph
- disconnected nodes
- missing start nodes

## Heap tests

Heap tests verify:

- insert
- extract min
- heapify from array
- peek without mutation
- empty heap behavior

## Linked list tests

Linked list tests verify:

- insert at head
- insert at tail
- insert at index
- delete by value
- delete at index
- search
- reverse
- invalid indexes
- missing values

## State machine tests

State machine tests verify:

- valid transitions
- no-op transitions
- transition history recording

## Commands

Run all tests:

npm test

Run tests once:

npm test -- --run

Run linting:

npm run lint

Run the production build:

npm run build

## Testing philosophy

The tests are designed to prove that the app has real algorithm behavior behind the UI.

If the UI changes later, the algorithm tests should still pass as long as the underlying behavior stays correct.
