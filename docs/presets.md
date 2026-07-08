# Visualizer Presets

`cs-visualizer` includes default examples so users can explore the app immediately without needing to create their own data first.

These presets are useful for demos, screenshots, testing, and portfolio walkthroughs.

## Sorting presets

The sorting visualizer can generate random arrays with different sizes.

Useful examples include:

- small arrays for beginner-friendly step-through mode
- medium arrays for normal animation playback
- arrays with duplicate values
- arrays with already sorted values
- arrays with reverse-sorted values

The current UI focuses on random generation, but the step-generation logic can support fixed examples in the future.

## Graph traversal presets

The graph traversal visualizer includes predefined graphs so BFS and DFS can be demonstrated quickly.

Good graph examples include:

- a simple connected graph
- a graph with branching paths
- a graph with disconnected nodes
- a graph where BFS and DFS produce visibly different orders

These examples help learners understand the difference between queue-based traversal and stack/recursive-style traversal.

## Heap presets

The heap visualizer uses number arrays to demonstrate min-heap operations.

Useful examples include:

- inserting a small value that bubbles to the root
- inserting a large value that stays near the bottom
- extracting the minimum value
- heapifying an unsorted array
- peeking at the root without changing the heap

The heap is shown as both a tree and a backing array to connect the visual structure with the real implementation.

## Linked list presets

The linked list visualizer starts with a simple list so users can test operations quickly.

Useful examples include:

- insert at head
- insert at tail
- insert at index
- delete an existing value
- delete a missing value
- search for a value
- reverse the list
- handle an empty list

These examples highlight how pointers and node connections change during operations.

## State machine preset

The state machine visualizer uses a turnstile example.

States:

- Locked
- Unlocked

Inputs:

- coin
- push

This is a common beginner-friendly finite state machine because every input has an easy real-world meaning.

Examples:

- inserting a coin unlocks the turnstile
- pushing while unlocked locks it again
- pushing while locked does not unlock it
- inserting another coin while already unlocked keeps it unlocked

## Why presets matter

Presets make the project easier to understand during a quick GitHub review.

A viewer can open the app, click through each section, and immediately see real data structures and algorithms working without extra setup.
