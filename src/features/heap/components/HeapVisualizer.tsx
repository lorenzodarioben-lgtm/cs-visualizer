import { useMemo, useState } from 'react';
import { ControlButton } from '../../../components/controls/ControlButton';
import { SliderControl } from '../../../components/controls/SliderControl';
import { SegmentedControl } from '../../../components/controls/SegmentedControl';
import { ExplanationPanel } from '../../../components/explanation/ExplanationPanel';
import { PseudocodePanel } from '../../../components/explanation/PseudocodePanel';
import { PlaybackControls } from '../../../components/layout/PlaybackControls';
import { Legend } from '../../../components/visualization/Legend';
import { speedToDelayMs } from '../../../lib/animation/useAnimationController';
import { useStepSequence } from '../../../lib/animation/useStepSequence';
import { parseNumberList } from '../../../lib/utils/arrays';
import { finalHeapFromSteps, heapExtractRootSteps, heapifySteps, heapInsertSteps, heapPeekSteps } from '../algorithms/minHeap';
import type { HeapOrder, HeapStep } from '../heapTypes';

const pseudocode = ['insert/extract/heapify operation', 'compare parent and child nodes', 'while heap property is violated', '  swap parent toward the root', 'finish with a valid heap'];

const INITIAL_ARRAY = [42, 15, 23, 8, 16, 4, 31];

export function HeapVisualizer() {
  const [order, setOrder] = useState<HeapOrder>('min');
  const [value, setValue] = useState(12);
  const [rawArray, setRawArray] = useState('42, 15, 23, 8, 16, 4, 31');
  const [speed, setSpeed] = useState(52);
  const { data: heap, steps, controller, run } = useStepSequence<HeapStep, number[]>({
    initialData: finalHeapFromSteps(heapifySteps(INITIAL_ARRAY)),
    initialSteps: heapifySteps(INITIAL_ARRAY),
    deriveData: finalHeapFromSteps,
    speedMs: speedToDelayMs(speed),
  });
  const current = controller.currentStep ?? steps[0];

  function changeOrder(next: HeapOrder) {
    setOrder(next);
    // Re-heapify the current values under the new ordering so the view stays valid.
    run(heapifySteps(heap, next));
  }

  const displayHeap = current.heap;
  const levels = useMemo(() => heapLevels(displayHeap), [displayHeap]);

  return (
    <section className="viz-section">
      <div className="viz-column">
        <div className="panel min-w-0 p-5">
          <div className="viz-header">
            <div className="min-w-0">
              <p className="control-label">Heap Operations Visualizer</p>
              <h2 className="mt-1 text-2xl font-black heading-strong">{order === 'min' ? 'Min' : 'Max'}-heap tree and backing array</h2>
            </div>
            <PlaybackControls controller={controller} />
          </div>

          <div className="control-tray sm:grid-cols-2 lg:grid-cols-3">
            <SegmentedControl
              label="Heap order"
              value={order}
              onChange={changeOrder}
              options={[
                { value: 'min', label: 'Min-heap' },
                { value: 'max', label: 'Max-heap' },
              ]}
            />
            <label className="grid min-w-0 gap-2">
              <span className="control-label">Value</span>
              <input className="control-input" type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} />
            </label>
            <SliderControl label="Speed" min={1} max={100} suffix="%" value={speed} onChange={setSpeed} />
            <div className="flex flex-wrap items-end gap-2 sm:col-span-2 lg:col-span-3">
              <ControlButton variant="primary" onClick={() => run(heapInsertSteps(heap, value, order))}>Insert</ControlButton>
              <ControlButton onClick={() => run(heapExtractRootSteps(heap, order))}>Extract {order === 'min' ? 'min' : 'max'}</ControlButton>
              <ControlButton onClick={() => run(heapPeekSteps(heap, order), { mutate: false })}>Peek</ControlButton>
            </div>
            <label className="grid min-w-0 gap-2 sm:col-span-2 lg:col-span-2">
              <span className="control-label">Heapify from array</span>
              <input className="control-input" value={rawArray} onChange={(event) => setRawArray(event.target.value)} />
            </label>
            <div className="flex items-end">
              <ControlButton className="w-full" onClick={() => run(heapifySteps(parseNumberList(rawArray), order))}>Heapify</ControlButton>
            </div>
          </div>
        </div>

        <div className="panel min-w-0 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Legend items={[{ label: 'Compared', className: 'bg-amber-400' }, { label: 'Swapped', className: 'bg-rose-500' }, { label: 'Normal', className: 'bg-indigo-500' }]} />
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${current.valid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'}`}>{current.valid ? 'Valid heap' : 'Temporarily fixing heap'}</span>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
            <div
              role="img"
              aria-label={`${order === 'min' ? 'Min' : 'Max'}-heap binary tree with ${displayHeap.length} nodes`}
              className="canvas-surface flex min-h-[12rem] min-w-0 items-center justify-center overflow-x-auto p-5"
            >
              {displayHeap.length === 0 ? (
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">The heap is empty — insert a value or heapify an array.</p>
              ) : (
                <div className="grid min-w-max gap-5">
                  {levels.map((level, levelIndex) => (
                    <div className="flex justify-center gap-3 sm:gap-4" key={levelIndex}>
                      {level.map(({ value: nodeValue, index }) => <HeapNode key={index} value={nodeValue} index={index} step={current} />)}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="viz-card min-w-0">
              <p className="control-label mb-3">Backing array</p>
              {displayHeap.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">Empty</p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {displayHeap.map((item, index) => <HeapArrayCell key={`${item}-${index}`} value={item} index={index} step={current} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ExplanationPanel
        content={{
          title: order === 'min' ? 'Min-heap' : 'Max-heap',
          currentStep: current.description,
          concept:
            order === 'min'
              ? 'A min-heap is a complete binary tree where every parent is less than or equal to its children. The smallest value is always at the root.'
              : 'A max-heap is a complete binary tree where every parent is greater than or equal to its children. The largest value is always at the root.',
          timeComplexity: 'Insert/extract O(log n), peek O(1), heapify O(n)',
          spaceComplexity: 'O(1) extra for array operations',
          useCases: ['Priority queues', 'Schedulers', 'Dijkstra-style algorithms'],
          edgeCases: ['Empty heap', 'One-item heap', 'Duplicate priorities'],
        }}
      >
        <PseudocodePanel lines={pseudocode} activeLine={current.codeLine} />
        {current.result !== undefined && <div className="rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">Returned value: {current.result}</div>}
      </ExplanationPanel>
    </section>
  );
}

function heapLevels(heap: number[]) {
  const levels: { value: number; index: number }[][] = [];
  for (let i = 0; i < heap.length; i += 1) {
    const level = Math.floor(Math.log2(i + 1));
    levels[level] ??= [];
    levels[level].push({ value: heap[i], index: i });
  }
  return levels;
}

function HeapNode({ value, index, step }: { value: number; index: number; step: HeapStep }) {
  const active = step.comparedIndices?.includes(index);
  const swapped = step.swappedIndices?.includes(index);
  return <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-white text-lg font-black text-white shadow-lg transition-colors duration-300 dark:border-slate-900 ${swapped ? 'bg-rose-500' : active ? 'bg-amber-400' : 'bg-indigo-500'}`} title={`Index ${index}`}>{value}</div>;
}

function HeapArrayCell({ value, index, step }: { value: number; index: number; step: HeapStep }) {
  const active = step.comparedIndices?.includes(index);
  const swapped = step.swappedIndices?.includes(index);
  return (
    <div className={`rounded-xl p-2 text-center text-sm font-bold transition-colors duration-300 ${swapped ? 'bg-rose-100 text-rose-700' : active ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
      <span className="block text-[0.65rem] text-slate-400 dark:text-slate-500">{index}</span>{value}
    </div>
  );
}
