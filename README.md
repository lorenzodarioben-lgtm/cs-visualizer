# CS Visualizer

`cs-visualizer` is an interactive data structures and algorithms visualizer built with Vite, React, TypeScript, Tailwind CSS, and Vitest. It is the showcase of the cumulative knowledge I have gained over several units and trimesters in Uni, aiming for High DIstinction. It is designed as a portfolio-ready educational project for computer science learners who want to understand algorithms by watching real state transitions instead of static diagrams.

## Features

### Sorting Visualizer

Implemented algorithms:

- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort

Capabilities:

- Generate random arrays
- Choose array size
- Adjust animation speed
- Start, pause, resume, reset, and step manually
- Highlight comparisons, swaps/writes, sorted regions, active ranges, and pivots
- Display live explanations and pseudocode line highlighting

### Graph Traversal Visualizer

Implemented traversals:

- Breadth-First Search
- Depth-First Search

Capabilities:

- Choose between predefined graph examples
- Select the start node
- Animate traversal order
- Show current node, visited nodes, completed nodes, frontier queue/stack, and output order
- Handles disconnected graphs and missing start nodes in pure logic tests

### Heap Operations Visualizer

Implemented structure:

- Min-heap

Operations:

- Insert
- Extract min
- Peek
- Heapify from array

Capabilities:

- Display heap as a tree and backing array
- Animate bubble-up and bubble-down comparisons/swaps
- Validate and display heap property status
- Handle empty heap operations safely

### Linked List Operations Visualizer

Implemented structure:

- Singly linked list

Operations:

- Insert at head
- Insert at tail
- Insert at index
- Delete by value
- Delete at index
- Search
- Reverse

Capabilities:

- Display nodes connected by arrows
- Show head/tail labels
- Animate pointer movement, previous/current/target nodes, and structural changes
- Handles empty lists, one-node lists, invalid indexes, and missing values

### State Machine Demo

Implemented machine:

- Turnstile finite state machine
- States: `Locked`, `Unlocked`
- Inputs: `coin`, `push`

Capabilities:

- Trigger inputs interactively
- Show current state
- Display transition history
- Include a transition table
- Explain no-op and invalid transitions in the pure logic

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Vitest
- React Testing Library
- ESLint
- Prettier

No paid APIs or external services are required.

## Screenshots

Add screenshots here after running the app locally.

```txt
docs/screenshots/sorting.png
docs/screenshots/graph.png
docs/screenshots/heap.png
docs/screenshots/linked-list.png
docs/screenshots/state-machine.png
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Vite will print a local URL, usually:

```txt
http://localhost:5173
```

### Run tests

```bash
npm test
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

```txt
cs-visualizer/
  README.md
  package.json
  vite.config.ts
  tsconfig.json
  src/
    main.tsx
    App.tsx
    index.css
    components/
      controls/
      explanation/
      layout/
      visualization/
    features/
      sorting/
        algorithms/
        components/
        __tests__/
      graph/
        algorithms/
        components/
        __tests__/
      heap/
        algorithms/
        components/
        __tests__/
      linked-list/
        algorithms/
        components/
        __tests__/
      state-machine/
        algorithms/
        components/
        __tests__/
    lib/
      animation/
      utils/
    test/
      setup.ts
```

## How Algorithm Step Generation Works

Each visualizer separates pure algorithm logic from React UI.

The pure functions are deterministic and return arrays of step objects. React components consume those steps through a reusable animation controller.

Example pattern:

```ts
type VisualizationStep = {
  id: string;
  description: string;
  codeLine?: number;
  state: unknown;
  highlights?: Record<string, unknown>;
};
```

In this project, each feature uses a more specific typed step shape:

- `SortStep`
- `TraversalStep`
- `HeapStep`
- `LinkedListStep`
- `StateMachineStep`

This makes the visualizations easier to test and easier to extend.

## Test Coverage

Tests cover the pure algorithm and state-generation logic.

Included coverage:

- Sorting correctness for all five sorting algorithms
- Sorting edge cases: empty arrays, one-item arrays, duplicates, negative numbers
- BFS and DFS traversal order on a known graph
- Disconnected graph traversal behavior
- Missing start node behavior
- Min-heap insert, extract, heapify, peek, and empty operations
- Linked list insert, delete, search, reverse, invalid indexes, and missing values
- Turnstile state machine valid transitions, no-op transitions, invalid input, and history

## Package Scripts

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest --watch",
  "lint": "eslint .",
  "format": "prettier --write ."
}
```

## GitHub Push Workflow

After downloading/extracting the project:

```bash
cd cs-visualizer
npm install
npm test
npm run build
git init
git add .
git commit -m "Initial cs visualizer project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cs-visualizer.git
git push -u origin main
```

## Future Improvements

- Add weighted graph algorithms such as Dijkstra and A*
- Add tree traversals and AVL/Red-Black tree rotations
- Add user-editable graph builder
- Add export-to-GIF or export-to-video for algorithm animations
- Add richer accessibility preferences, including reduced motion mode
- Add persistent saved arrays/graphs using localStorage
- Add more advanced pseudocode highlighting for recursive algorithms

## Known Limitations

- Graph examples are predefined rather than fully user-editable.
- Heap visualizer uses a min-heap only.
- Mobile layout is usable, but dense visualizations are best on tablet or desktop.
- Animations are intentionally implemented with React state and browser-native timers instead of a heavy visualization library.
