import { useMemo, useState } from 'react';
import { ControlButton } from '../../../components/controls/ControlButton';
import { SliderControl } from '../../../components/controls/SliderControl';
import { ExplanationPanel } from '../../../components/explanation/ExplanationPanel';
import { PseudocodePanel } from '../../../components/explanation/PseudocodePanel';
import { PlaybackControls } from '../../../components/layout/PlaybackControls';
import { Legend } from '../../../components/visualization/Legend';
import { speedToDelayMs, useAnimationController } from '../../../lib/animation/useAnimationController';
import { finalHeapFromSteps, heapExtractMinSteps, heapifySteps, heapInsertSteps, heapPeekSteps } from '../algorithms/minHeap';
import type { HeapStep } from '../heapTypes';

const pseudocode = ['insert/extract/heapify operation', 'compare parent and child nodes', 'while heap property is violated', '  swap parent with smaller child', 'finish with a valid min-heap'];

export function HeapVisualizer() {
  const [heap, setHeap] = useState<number[]>(() => finalHeapFromSteps(heapifySteps([42, 15, 23, 8, 16, 4, 31])));
  const [value, setValue] = useState(12);
  const [rawArray, setRawArray] = useState('42, 15, 23, 8, 16, 4, 31');
  const [speed, setSpeed] = useState(52);
  const [steps, setSteps] = useState<HeapStep[]>(() => heapifySteps([42, 15, 23, 8, 16, 4, 31]));
  const controller = useAnimationController<HeapStep>(steps, speedToDelayMs(speed));
  const current = controller.currentStep ?? steps[0];

  const displayHeap = current.heap;
  const levels = useMemo(() => heapLevels(displayHeap), [displayHeap]);

  function run(nextSteps: HeapStep[]) {
    setSteps(nextSteps);
    setHeap(finalHeapFromSteps(nextSteps));
  }

  function parseRawArray(): number[] {
    return rawArray.split(',').map((item) => Number(item.trim())).filter((item) => Number.isFinite(item));
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="grid gap-5">
        <div className="panel p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="control-label">Heap Operations Visualizer</p>
              <h2 className="mt-1 text-2xl font-black heading-strong">Min-heap tree and backing array</h2>
            </div>
            <PlaybackControls controller={controller} />
          </div>

          <div className="mt-5 grid gap-4 rounded-2xl surface-muted p-4 lg:grid-cols-[1fr_1fr_1fr]">
            <label className="grid gap-2">
              <span className="control-label">Value</span>
              <input className="control-input" type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} />
            </label>
            <SliderControl label="Speed" min={1} max={100} suffix="%" value={speed} onChange={setSpeed} />
            <div className="flex flex-wrap items-end gap-2">
              <ControlButton variant="primary" onClick={() => run(heapInsertSteps(heap, value))}>Insert</ControlButton>
              <ControlButton onClick={() => run(heapExtractMinSteps(heap))}>Extract min</ControlButton>
              <ControlButton onClick={() => setSteps(heapPeekSteps(heap))}>Peek</ControlButton>
            </div>
            <label className="grid gap-2 lg:col-span-2">
              <span className="control-label">Heapify from array</span>
              <input className="control-input" value={rawArray} onChange={(event) => setRawArray(event.target.value)} />
            </label>
            <div className="flex items-end">
              <ControlButton className="w-full" onClick={() => run(heapifySteps(parseRawArray()))}>Heapify</ControlButton>
            </div>
          </div>
        </div>

        <div className="panel p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Legend items={[{ label: 'Compared', className: 'bg-amber-400' }, { label: 'Swapped', className: 'bg-rose-500' }, { label: 'Normal', className: 'bg-indigo-500' }]} />
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${current.valid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{current.valid ? 'Valid min-heap' : 'Temporarily fixing heap'}</span>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
            <div className="canvas-surface p-5">
              <div className="grid gap-5">
                {levels.map((level, levelIndex) => (
                  <div className="flex justify-center gap-4" key={levelIndex}>
                    {level.map(({ value: nodeValue, index }) => <HeapNode key={index} value={nodeValue} index={index} step={current} />)}
                  </div>
                ))}
              </div>
            </div>
            <div className="viz-card">
              <p className="control-label mb-3">Backing array</p>
              <div className="grid grid-cols-4 gap-2">
                {displayHeap.map((item, index) => <HeapArrayCell key={`${item}-${index}`} value={item} index={index} step={current} />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ExplanationPanel
        content={{
          title: 'Min-heap',
          currentStep: current.description,
          concept: 'A min-heap is a complete binary tree where every parent is less than or equal to its children. The smallest value is always at the root.',
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
  return <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-white text-lg font-black text-white shadow-lg ${swapped ? 'bg-rose-500' : active ? 'bg-amber-400' : 'bg-indigo-500'}`} title={`Index ${index}`}>{value}</div>;
}

function HeapArrayCell({ value, index, step }: { value: number; index: number; step: HeapStep }) {
  const active = step.comparedIndices?.includes(index);
  const swapped = step.swappedIndices?.includes(index);
  return (
    <div className={`rounded-xl p-2 text-center text-sm font-bold ${swapped ? 'bg-rose-100 text-rose-700' : active ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
      <span className="block text-[0.65rem] text-slate-400 dark:text-slate-500">{index}</span>{value}
    </div>
  );
}
