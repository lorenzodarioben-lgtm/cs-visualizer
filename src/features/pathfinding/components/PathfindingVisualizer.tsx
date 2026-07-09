import { useCallback, useMemo, useState } from 'react';
import { ControlButton } from '../../../components/controls/ControlButton';
import { SliderControl } from '../../../components/controls/SliderControl';
import { ExplanationPanel } from '../../../components/explanation/ExplanationPanel';
import { PseudocodePanel } from '../../../components/explanation/PseudocodePanel';
import { PlaybackControls } from '../../../components/layout/PlaybackControls';
import { Legend } from '../../../components/visualization/Legend';
import { StatusBadge, type StatusTone } from '../../../components/visualization/StatusBadge';
import { speedToDelayMs, useAnimationController } from '../../../lib/animation/useAnimationController';
import { cloneGrid, createGrid, HEAVY_WEIGHT, isSameCoord, randomObstacles } from '../algorithms/grid';
import { generatePathSteps } from '../algorithms/pathfinding';
import { PATH_INFO } from '../algorithms/pathInfo';
import { cellKey } from '../pathfindingTypes';
import type { Coord, Grid, PathAlgorithm, PathStep } from '../pathfindingTypes';

const ROWS = 13;
const COLS = 25;

type Brush = 'wall' | 'weight' | 'erase';

const algorithms: PathAlgorithm[] = ['bfs', 'dijkstra', 'astar'];

const ACTION_STATUS: Record<PathStep['action'], { tone: StatusTone; label: string }> = {
  init: { tone: 'neutral', label: 'Ready' },
  visit: { tone: 'visit', label: 'Expanding' },
  frontier: { tone: 'active', label: 'Discovering' },
  path: { tone: 'done', label: 'Tracing path' },
  done: { tone: 'done', label: 'Target reached' },
  'no-path': { tone: 'swap', label: 'No path' },
};

export function PathfindingVisualizer() {
  const [algorithm, setAlgorithm] = useState<PathAlgorithm>('astar');
  const [brush, setBrush] = useState<Brush>('wall');
  const [speed, setSpeed] = useState(72);
  const [grid, setGrid] = useState<Grid>(() => randomObstacles(createGrid(ROWS, COLS), 7));
  const [painting, setPainting] = useState(false);

  const steps = useMemo(() => generatePathSteps(grid, algorithm), [grid, algorithm]);
  const controller = useAnimationController<PathStep>(steps, speedToDelayMs(speed));
  const current = controller.currentStep ?? steps[0];
  const info = PATH_INFO[algorithm];

  const visited = useMemo(() => new Set(current.visited), [current.visited]);
  const frontier = useMemo(() => new Set(current.frontier), [current.frontier]);
  const path = useMemo(() => new Set(current.path), [current.path]);

  const paintCell = useCallback(
    (coord: Coord) => {
      setGrid((prev) => {
        if (isSameCoord(coord, prev.start) || isSameCoord(coord, prev.end)) return prev;
        const cell = prev.cells[coord.row][coord.col];
        const nextWall = brush === 'wall';
        const nextWeight = brush === 'weight' ? HEAVY_WEIGHT : 1;
        if (cell.wall === nextWall && cell.weight === nextWeight) return prev;
        const next = cloneGrid(prev);
        next.cells[coord.row][coord.col] = {
          ...cell,
          wall: brush === 'wall',
          weight: brush === 'weight' ? HEAVY_WEIGHT : 1,
        };
        return next;
      });
    },
    [brush],
  );

  function resetGrid() {
    setGrid(createGrid(ROWS, COLS));
  }

  function clearWalls() {
    setGrid((prev) => {
      const next = cloneGrid(prev);
      for (const row of next.cells) for (const cell of row) {
        cell.wall = false;
        cell.weight = 1;
      }
      return next;
    });
  }

  const status = ACTION_STATUS[current.action];

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="grid gap-5">
        <div className="panel p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="control-label">Pathfinding Visualizer</p>
              <h2 className="mt-1 text-2xl font-black heading-strong">Grid search on walls and weights</h2>
            </div>
            <PlaybackControls controller={controller} />
          </div>

          <div className="mt-5 grid gap-4 rounded-2xl surface-muted p-4 lg:grid-cols-4">
            <label className="grid gap-2">
              <span className="control-label">Algorithm</span>
              <select
                className="control-input"
                value={algorithm}
                onChange={(event) => setAlgorithm(event.target.value as PathAlgorithm)}
              >
                {algorithms.map((item) => (
                  <option key={item} value={item}>
                    {PATH_INFO[item].label}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-2">
              <span className="control-label">Brush</span>
              <div className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
                {(['wall', 'weight', 'erase'] as Brush[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setBrush(item)}
                    aria-pressed={brush === item}
                    className={`focus-ring flex-1 rounded-lg px-2 py-1.5 text-xs font-bold capitalize transition ${
                      brush === item
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <SliderControl label="Speed" min={1} max={100} suffix="%" value={speed} onChange={setSpeed} />
            <div className="flex flex-wrap items-end gap-2">
              <ControlButton onClick={() => setGrid(randomObstacles(createGrid(ROWS, COLS), Date.now() % 997))}>
                Random maze
              </ControlButton>
              <ControlButton variant="ghost" onClick={clearWalls}>
                Clear
              </ControlButton>
              <ControlButton variant="ghost" onClick={resetGrid}>
                Reset grid
              </ControlButton>
            </div>
          </div>
        </div>

        <div className="panel p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Legend
              items={[
                { label: 'Start', className: 'bg-emerald-500' },
                { label: 'Target', className: 'bg-rose-500' },
                { label: 'Frontier', className: 'bg-sky-400' },
                { label: 'Visited', className: 'bg-indigo-400' },
                { label: 'Path', className: 'bg-amber-400' },
                { label: 'Heavy', className: 'bg-orange-300' },
              ]}
            />
            <div className="flex items-center gap-2">
              <StatusBadge tone={status.tone} label={status.label} />
              <span className="pill text-xs font-semibold">Visited: {current.visitedCount}</span>
            </div>
          </div>

          <div
            className="canvas-surface select-none p-2"
            onMouseLeave={() => setPainting(false)}
            onMouseUp={() => setPainting(false)}
          >
            <div
              className="grid gap-[2px]"
              style={{ gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))` }}
              role="grid"
              aria-label="Pathfinding grid — click and drag to draw walls"
            >
              {grid.cells.map((row) =>
                row.map((cell) => {
                  const key = cellKey(cell.row, cell.col);
                  const isStart = isSameCoord(cell, grid.start);
                  const isEnd = isSameCoord(cell, grid.end);
                  return (
                    <GridCellView
                      key={key}
                      isStart={isStart}
                      isEnd={isEnd}
                      isWall={cell.wall}
                      isHeavy={cell.weight > 1}
                      isPath={path.has(key)}
                      isCurrent={current.current === key}
                      isVisited={visited.has(key)}
                      isFrontier={frontier.has(key)}
                      onPaintStart={() => {
                        setPainting(true);
                        paintCell({ row: cell.row, col: cell.col });
                      }}
                      onPaintEnter={() => {
                        if (painting) paintCell({ row: cell.row, col: cell.col });
                      }}
                    />
                  );
                }),
              )}
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Tip: pick a brush, then click and drag on the grid to draw walls or heavy terrain. Compare
            how BFS, Dijkstra, and A* explore the same maze.
          </p>
        </div>
      </div>

      <ExplanationPanel
        content={{
          title: info.label,
          currentStep: current.description,
          concept: info.concept,
          timeComplexity: info.timeComplexity,
          spaceComplexity: info.spaceComplexity,
          useCases: [info.optimal, info.weighted ? 'Respects terrain weights' : 'Unweighted grids'],
          edgeCases: ['Walled-off targets', 'Start equals end', 'Fully open grids'],
        }}
      >
        <PseudocodePanel lines={info.pseudocode} activeLine={current.codeLine} />
      </ExplanationPanel>
    </section>
  );
}

type GridCellViewProps = {
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isHeavy: boolean;
  isPath: boolean;
  isCurrent: boolean;
  isVisited: boolean;
  isFrontier: boolean;
  onPaintStart: () => void;
  onPaintEnter: () => void;
};

function cellClass(props: GridCellViewProps): string {
  if (props.isStart) return 'bg-emerald-500';
  if (props.isEnd) return 'bg-rose-500';
  if (props.isWall) return 'bg-slate-700 dark:bg-slate-950';
  if (props.isPath) return 'bg-amber-400';
  if (props.isCurrent) return 'bg-fuchsia-500';
  if (props.isFrontier) return 'bg-sky-400/80';
  if (props.isVisited) return 'bg-indigo-400/70';
  if (props.isHeavy) return 'bg-orange-200 dark:bg-orange-400/30';
  return 'bg-white/70 dark:bg-slate-800/60';
}

function GridCellView(props: GridCellViewProps) {
  return (
    <div
      role="gridcell"
      onMouseDown={(event) => {
        event.preventDefault();
        props.onPaintStart();
      }}
      onMouseEnter={props.onPaintEnter}
      className={`aspect-square rounded-[3px] transition-colors duration-150 ${cellClass(props)}`}
    />
  );
}
