import { useMemo, useState } from 'react';
import { SliderControl } from '../../../components/controls/SliderControl';
import { ControlButton } from '../../../components/controls/ControlButton';
import { ExplanationPanel } from '../../../components/explanation/ExplanationPanel';
import { PseudocodePanel } from '../../../components/explanation/PseudocodePanel';
import { Legend } from '../../../components/visualization/Legend';
import { PlaybackControls } from '../../../components/layout/PlaybackControls';
import { speedToDelayMs, useAnimationController } from '../../../lib/animation/useAnimationController';
import { generateSortSteps, randomArray } from '../algorithms/sortingAlgorithms';
import { SORT_INFO } from '../algorithms/sortInfo';
import type { SortAlgorithm, SortStep } from '../sortingTypes';

const algorithms: SortAlgorithm[] = ['bubble', 'selection', 'insertion', 'merge', 'quick'];

export function SortingVisualizer() {
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>('bubble');
  const [arraySize, setArraySize] = useState(18);
  const [speed, setSpeed] = useState(55);
  const [array, setArray] = useState(() => randomArray(18));

  const steps = useMemo(() => generateSortSteps(algorithm, array), [algorithm, array]);
  const controller = useAnimationController<SortStep>(steps, speedToDelayMs(speed));
  const current = controller.currentStep ?? steps[0];
  const info = SORT_INFO[algorithm];
  const maxValue = Math.max(1, ...current.array);

  function generateNewArray(size = arraySize) {
    setArray(randomArray(size));
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="grid gap-5">
        <div className="panel p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="control-label">Sorting Visualizer</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">Compare, swap, partition, merge</h2>
            </div>
            <PlaybackControls controller={controller} />
          </div>

          <div className="mt-5 grid gap-4 rounded-2xl bg-slate-50 p-4 lg:grid-cols-4">
            <label className="grid gap-2">
              <span className="control-label">Algorithm</span>
              <select
                className="focus-ring rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                value={algorithm}
                onChange={(event) => setAlgorithm(event.target.value as SortAlgorithm)}
              >
                {algorithms.map((item) => (
                  <option key={item} value={item}>{SORT_INFO[item].label}</option>
                ))}
              </select>
            </label>
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
        </div>

        <div className="panel p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Legend
              items={[
                { label: 'Comparing', className: 'bg-amber-400' },
                { label: 'Swapping / writing', className: 'bg-rose-500' },
                { label: 'Pivot', className: 'bg-violet-500' },
                { label: 'Sorted', className: 'bg-emerald-500' },
              ]}
            />
            <span className="text-xs font-semibold text-slate-500">Current action: {current.action}</span>
          </div>
          <div className="flex h-[22rem] items-end gap-1 rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-100 p-4">
            {current.array.map((value, index) => (
              <Bar key={`${index}-${value}`} step={current} value={value} index={index} maxValue={maxValue} />
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

function Bar({ step, value, index, maxValue }: { step: SortStep; value: number; index: number; maxValue: number }) {
  const { highlights } = step;
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
            : 'bg-slate-400';

  return (
    <div className="group relative flex flex-1 items-end justify-center">
      <div
        className={`w-full rounded-t-lg transition-all duration-200 ${color}`}
        style={{ height }}
        title={`Index ${index}: ${value}`}
      />
      <span className="absolute -bottom-6 hidden rounded bg-slate-900 px-1.5 py-0.5 text-[0.65rem] text-white group-hover:block">
        {value}
      </span>
    </div>
  );
}
