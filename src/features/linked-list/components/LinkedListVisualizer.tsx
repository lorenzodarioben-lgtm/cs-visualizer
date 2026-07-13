import { ArrowRight } from '@phosphor-icons/react';
import { useState } from 'react';
import { ControlButton } from '../../../components/controls/ControlButton';
import { SliderControl } from '../../../components/controls/SliderControl';
import { ExplanationPanel } from '../../../components/explanation/ExplanationPanel';
import { PseudocodePanel } from '../../../components/explanation/PseudocodePanel';
import { PlaybackControls } from '../../../components/layout/PlaybackControls';
import { speedToDelayMs } from '../../../lib/animation/useAnimationController';
import { useStepSequence } from '../../../lib/animation/useStepSequence';
import { deleteAtIndexSteps, deleteByValueSteps, finalListFromSteps, insertAtIndexSteps, insertHeadSteps, insertTailSteps, reverseSteps, searchSteps } from '../algorithms/linkedListOperations';
import type { LinkedListOperation, LinkedListStep } from '../linkedListTypes';

const pseudocode: Record<LinkedListOperation, string[]> = {
  'insert-head': ['new.next = head', 'head = new', 'if tail is null: tail = new'],
  'insert-tail': ['current = head', 'walk until current.next is null', 'current.next = new tail'],
  'insert-index': ['walk to previous node', 'new.next = previous.next', 'previous.next = new'],
  'delete-value': ['walk until value matches', 'track previous node', 'if missing: stop', 'previous.next = current.next'],
  'delete-index': ['walk to index', 'track previous node', 'unlink target node'],
  search: ['current = head', 'compare current.value', 'if match: return index', 'return -1'],
  reverse: ['previous = null', 'current = head', 'next = current.next; current.next = previous', 'advance pointers', 'head = previous'],
};

const INITIAL_LIST = [10, 25, 30, 45];

export function LinkedListVisualizer() {
  const [value, setValue] = useState(20);
  const [index, setIndex] = useState(2);
  const [speed, setSpeed] = useState(50);
  const { data: list, steps, controller, run } = useStepSequence<LinkedListStep, number[]>({
    initialData: INITIAL_LIST,
    initialSteps: searchSteps(INITIAL_LIST, 30),
    deriveData: finalListFromSteps,
    speedMs: speedToDelayMs(speed),
  });
  const current = controller.currentStep ?? steps[0];

  return (
    <section className="viz-section">
      <div className="viz-column">
        <div className="panel min-w-0 p-4">
          <div className="viz-header">
            <div className="min-w-0">
              <p className="control-label">Linked List Visualizer</p>
              <h2 className="mt-1 text-xl font-bold heading-strong">Pointer movement and structural updates</h2>
            </div>
            <PlaybackControls controller={controller} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl border border-slate-200/70 p-4 surface-muted dark:border-slate-800/80 sm:grid-cols-[8rem_8rem_minmax(0,1fr)]">
            <label className="grid gap-2">
              <span className="control-label">Value</span>
              <input className="control-input" type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} />
            </label>
            <label className="grid gap-2">
              <span className="control-label">Index</span>
              <input className="control-input" type="number" value={index} onChange={(event) => setIndex(Number(event.target.value))} />
            </label>
            <SliderControl label="Speed" min={1} max={100} suffix="%" value={speed} onChange={setSpeed} />
            <div className="flex flex-wrap gap-2 lg:col-span-3">
              <ControlButton variant="primary" onClick={() => run(insertHeadSteps(list, value))}>Insert head</ControlButton>
              <ControlButton onClick={() => run(insertTailSteps(list, value))}>Insert tail</ControlButton>
              <ControlButton onClick={() => run(insertAtIndexSteps(list, value, index))}>Insert at index</ControlButton>
              <ControlButton variant="danger" onClick={() => run(deleteByValueSteps(list, value))}>Delete value</ControlButton>
              <ControlButton variant="danger" onClick={() => run(deleteAtIndexSteps(list, index))}>Delete index</ControlButton>
              <ControlButton onClick={() => run(searchSteps(list, value), { mutate: false })}>Search</ControlButton>
              <ControlButton onClick={() => run(reverseSteps(list))}>Reverse</ControlButton>
              <ControlButton variant="ghost" onClick={() => run(insertTailSteps([], value))}>Clear + add</ControlButton>
            </div>
          </div>
        </div>

        <div className="panel min-w-0 p-4">
          <div className="mb-3 flex flex-wrap items-center gap-1.5 border-b border-slate-200/70 pb-3 dark:border-slate-800">
            <span className="pill">Head: {current.list[0] ?? 'null'}</span>
            <span className="pill">Tail: {current.list.at(-1) ?? 'null'}</span>
            <span className="pill">Length: {current.list.length}</span>
            {current.warning && <span className="inline-flex items-center rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">{current.warning}</span>}
          </div>
          <div
            role="img"
            aria-label={`Singly linked list with ${current.list.length} node${current.list.length === 1 ? '' : 's'}`}
            className="canvas-surface flex min-h-[14rem] items-center gap-0 overflow-x-auto px-5 py-10"
          >
            {current.list.length === 0 ? (
              <div className="w-full text-center text-sm font-semibold text-slate-500 dark:text-slate-400">Empty list</div>
            ) : (
              current.list.map((item, nodeIndex) => <ListNode key={`${item}-${nodeIndex}`} value={item} index={nodeIndex} step={current} />)
            )}
          </div>
        </div>
      </div>

      <ExplanationPanel
        content={{
          title: 'Singly linked list',
          currentStep: current.description,
          concept: 'A singly linked list stores values in nodes. Each node points to the next node, so inserting and deleting usually means carefully changing links.',
          timeComplexity: 'Search/delete by value O(n), insert head O(1), insert tail O(n) without tail pointer',
          spaceComplexity: 'O(1) extra for most operations',
          useCases: ['Queues and stacks', 'Frequent head insertions', 'Teaching pointer logic'],
          edgeCases: ['Empty list', 'One-node list', 'Invalid index', 'Missing value'],
        }}
      >
        <PseudocodePanel lines={pseudocode[current.operation]} activeLine={current.codeLine} />
        {current.result !== undefined && <div className="rounded-2xl surface-inset p-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Result: {String(current.result)}</div>}
      </ExplanationPanel>
    </section>
  );
}

function ListNode({ value, index, step }: { value: number; index: number; step: LinkedListStep }) {
  const active = step.currentIndex === index;
  const previous = step.previousIndex === index;
  const target = step.targetIndex === index;
  return (
    <div className="flex items-center">
      <div className={`relative flex h-20 w-24 shrink-0 flex-col items-center justify-center rounded-xl border-[3px] border-white shadow-md transition-colors duration-300 dark:border-slate-950 ${target ? 'bg-emerald-500 text-white' : active ? 'bg-indigo-600 text-white' : previous ? 'bg-amber-400 text-white' : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100'}`}>
        <span className="font-mono text-[0.65rem] font-medium uppercase tracking-wide opacity-70">idx {index}</span>
        <span className="font-mono text-2xl font-semibold tabular-nums">{value}</span>
        {index === 0 && <span className="absolute -top-6 rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-wider text-white dark:bg-slate-700">Head</span>}
        {index === step.list.length - 1 && <span className="absolute -bottom-6 rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-wider text-white dark:bg-slate-700">Tail</span>}
      </div>
      {index < step.list.length - 1 && (
        <ArrowRight size={22} weight="bold" className="mx-2 shrink-0 text-slate-400 dark:text-slate-600" aria-hidden="true" />
      )}
    </div>
  );
}
