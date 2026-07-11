import { useMemo, useState } from 'react';
import { SliderControl } from '../../../components/controls/SliderControl';
import { SelectControl } from '../../../components/controls/SelectControl';
import { ControlButton } from '../../../components/controls/ControlButton';
import { ExplanationPanel } from '../../../components/explanation/ExplanationPanel';
import { PseudocodePanel } from '../../../components/explanation/PseudocodePanel';
import { Legend } from '../../../components/visualization/Legend';
import { StatusBadge, type StatusMap } from '../../../components/visualization/StatusBadge';
import { PlaybackControls } from '../../../components/layout/PlaybackControls';
import { speedToDelayMs, useAnimationController } from '../../../lib/animation/useAnimationController';
import { useReducedMotion } from '../../../lib/animation/useReducedMotion';
import { clampNumber, parseNumberList } from '../../../lib/utils/arrays';
import { generateSortSteps, randomArray } from '../algorithms/sortingAlgorithms';
import { SORT_INFO } from '../algorithms/sortInfo';
import type { SortAlgorithm, SortHighlights, SortStep } from '../sortingTypes';

/**
 * Keep the slide a little shorter than the gap between steps so a swap always
 * finishes before the next step begins, and cap it so slow speeds are not
 * sluggish.
 */
function slideDurationMs(stepDelayMs: number): number {
  return Math.round(Math.min(520, Math.max(60, stepDelayMs * 0.8)));
}

const algorithms: SortAlgorithm[] = ['bubble', 'selection', 'insertion', 'merge', 'quick'];

const ACTION_STATUS: StatusMap<SortStep['action']> = {
  initial: { tone: 'neutral', label: 'Ready' },
  compare: { tone: 'compare', label: 'Comparing' },
  swap: { tone: 'swap', label: 'Swapping' },
  overwrite: { tone: 'active', label: 'Writing' },
  'mark-sorted': { tone: 'done', label: 'Locked in' },
  pivot: { tone: 'pivot', label: 'Pivot' },
  partition: { tone: 'active', label: 'Partitioning' },
  complete: { tone: 'done', label: 'Sorted' },
};

export function SortingVisualizer() {
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>('bubble');
  const [arraySize, setArraySize] = useState(18);
  const [speed, setSpeed] = useState(55);
  const [array, setArray] = useState(() => randomArray(18));
  const [customInput, setCustomInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const steps = useMemo(() => generateSortSteps(algorithm, array), [algorithm, array]);
  const stepDelayMs = speedToDelayMs(speed);
  const controller = useAnimationController<SortStep>(steps, stepDelayMs);
  const current = controller.currentStep ?? steps[0];
  const info = SORT_INFO[algorithm];
  const maxValue = Math.max(1, ...current.array);
  const reducedMotion = useReducedMotion();
  const durationMs = slideDurationMs(stepDelayMs);

  function generateNewArray(size = arraySize) {
    setArray(randomArray(size));
    setInputError(null);
  }

  function applyCustomArray() {
    const values = parseNumberList(customInput).map((value) => clampNumber(Math.round(value), 1, 100));
    if (values.length < 2) {
      setInputError('Enter at least two numbers (1–100), separated by commas.');
      return;
    }
    const trimmed = values.slice(0, 42);
    setArray(trimmed);
    setArraySize(trimmed.length);
    setInputError(null);
  }

  return (
    <section className="viz-section">
      <div className="viz-column">
        <div className="panel min-w-0 p-5">
          <div className="viz-header">
            <div className="min-w-0">
              <p className="control-label">Sorting Visualizer</p>
              <h2 className="mt-1 text-2xl font-black heading-strong">Compare, swap, partition, merge</h2>
            </div>
            <PlaybackControls controller={controller} />
          </div>

          <div className="control-tray sm:grid-cols-2 xl:grid-cols-4">
            <SelectControl
              label="Algorithm"
              value={algorithm}
              onChange={setAlgorithm}
              options={algorithms.map((item) => ({ value: item, label: SORT_INFO[item].label }))}
            />
            <SliderControl
              label="Array size"
              min={4}
              max={42}
              value={arraySize}
              onChange={(value) => {
                setArraySize(value);
                generateNewArray(value);
              }}
            />
            <SliderControl label="Speed" min={1} max={100} suffix="%" value={speed} onChange={setSpeed} />
            <div className="flex items-end">
              <ControlButton className="w-full" onClick={() => generateNewArray()}>Random array</ControlButton>
            </div>
          </div>

          <form
            className="mt-4 grid gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              applyCustomArray();
            }}
          >
            <span className="control-label">Custom array</span>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                className="control-input flex-1"
                value={customInput}
                placeholder="e.g. 42, 8, 15, 4, 23, 16"
                aria-label="Custom array values"
                aria-invalid={inputError !== null}
                onChange={(event) => setCustomInput(event.target.value)}
              />
              <ControlButton type="submit" variant="secondary">Use my array</ControlButton>
              <ControlButton
                type="button"
                variant="ghost"
                onClick={() => setCustomInput(array.join(', '))}
              >
                Copy current
              </ControlButton>
            </div>
            {inputError ? (
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{inputError}</p>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Values are rounded and clamped to 1–100 (up to 42 items).
              </p>
            )}
          </form>
        </div>

        <div className="panel min-w-0 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Legend
              items={[
                { label: 'Comparing', className: 'bg-amber-400' },
                { label: 'Swapping / writing', className: 'bg-rose-500' },
                { label: 'Pivot', className: 'bg-violet-500' },
                { label: 'Sorted', className: 'bg-emerald-500' },
              ]}
            />
            <StatusBadge tone={ACTION_STATUS[current.action].tone} label={ACTION_STATUS[current.action].label} />
          </div>
          <div className="canvas-surface relative h-56 overflow-hidden p-3 sm:h-72 sm:p-4 xl:h-[22rem]">
            {current.ids.map((id, index) => (
              <Bar
                key={id}
                value={current.array[index]}
                index={index}
                count={current.array.length}
                maxValue={maxValue}
                highlights={current.highlights}
                durationMs={durationMs}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </div>
      </div>

      <ExplanationPanel
        content={{
          title: info.label,
          currentStep: current.description,
          concept: info.concept,
          timeComplexity: info.timeComplexity,
          spaceComplexity: info.spaceComplexity,
          useCases: info.useCases,
          edgeCases: info.edgeCases,
        }}
      >
        <PseudocodePanel lines={info.pseudocode} activeLine={current.codeLine} />
      </ExplanationPanel>
    </section>
  );
}

type BarProps = {
  value: number;
  index: number;
  count: number;
  maxValue: number;
  highlights: SortHighlights;
  durationMs: number;
  reducedMotion: boolean;
};

function Bar({ value, index, count, maxValue, highlights, durationMs, reducedMotion }: BarProps) {
  const isSorted = highlights.sorted?.includes(index);
  const isComparing = highlights.comparing?.includes(index);
  const isSwapping = highlights.swapping?.includes(index);
  const isPivot = highlights.pivot === index;
  const isActive = highlights.activeRange ? index >= highlights.activeRange[0] && index <= highlights.activeRange[1] : false;
  const height = `${Math.max(8, (value / maxValue) * 100)}%`;
  const color = isSorted
    ? 'bg-emerald-500'
    : isPivot
      ? 'bg-violet-500'
      : isSwapping
        ? 'bg-rose-500'
        : isComparing
          ? 'bg-amber-400'
          : isActive
            ? 'bg-sky-500'
            : 'bg-slate-400 dark:bg-slate-500';

  // Each bar owns a full-height column and is placed by its index. When a swap
  // moves an element to a new index, only `left` changes, so the bar slides
  // sideways while keeping its own height.
  const slide = reducedMotion ? undefined : `left ${durationMs}ms cubic-bezier(0.4, 0, 0.2, 1)`;
  const grow = reducedMotion ? undefined : `height ${durationMs}ms ease`;

  return (
    <div
      className="group absolute inset-y-0 flex items-end justify-center px-[1px] sm:px-[2px]"
      style={{ left: `${(index / count) * 100}%`, width: `${100 / count}%`, transition: slide }}
    >
      <div
        className={`w-full rounded-t ${color}`}
        style={{ height, transition: grow }}
        title={`Value ${value}`}
      />
      <span className="pointer-events-none absolute top-1 z-10 hidden rounded bg-slate-900 px-1.5 py-0.5 text-[0.65rem] text-white shadow group-hover:block dark:bg-slate-700">
        {value}
      </span>
    </div>
  );
}
