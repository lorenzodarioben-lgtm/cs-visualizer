import { useState } from 'react';
import { ControlButton } from '../../../components/controls/ControlButton';
import { SliderControl } from '../../../components/controls/SliderControl';
import { ExplanationPanel } from '../../../components/explanation/ExplanationPanel';
import { PseudocodePanel } from '../../../components/explanation/PseudocodePanel';
import { PlaybackControls } from '../../../components/layout/PlaybackControls';
import { speedToDelayMs, useAnimationController } from '../../../lib/animation/useAnimationController';
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

export function LinkedListVisualizer() {
  const [list, setList] = useState([10, 25, 30, 45]);
  const [value, setValue] = useState(20);
  const [index, setIndex] = useState(2);
  const [speed, setSpeed] = useState(50);
  const [steps, setSteps] = useState<LinkedListStep[]>(() => searchSteps([10, 25, 30, 45], 30));
  const controller = useAnimationController<LinkedListStep>(steps, speedToDelayMs(speed));
  const current = controller.currentStep ?? steps[0];

  function run(nextSteps: LinkedListStep[], mutate = true) {
    setSteps(nextSteps);
    if (mutate) setList(finalListFromSteps(nextSteps));
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="grid gap-5">
        <div className="panel p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="control-label">Linked List Visualizer</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">Pointer movement and structural updates</h2>
            </div>
            <PlaybackControls controller={controller} />
          </div>
          <div className="mt-5 grid gap-4 rounded-2xl bg-slate-50 p-4 lg:grid-cols-[8rem_8rem_1fr]">
            <label className="grid gap-2">
              <span className="control-label">Value</span>
              <input className="focus-ring rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold" type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} />
            </label>
            <label className="grid gap-2">
              <span className="control-label">Index</span>
              <input className="focus-ring rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold" type="number" value={index} onChange={(event) => setIndex(Number(event.target.value))} />
            </label>
            <SliderControl label="Speed" min={1} max={100} suffix="%" value={speed} onChange={setSpeed} />
            <div className="flex flex-wrap gap-2 lg:col-span-3">
              <ControlButton variant="primary" onClick={() => run(insertHeadSteps(list, value))}>Insert head</ControlButton>
              <ControlButton onClick={() => run(insertTailSteps(list, value))}>Insert tail</ControlButton>
              <ControlButton onClick={() => run(insertAtIndexSteps(list, value, index))}>Insert at index</ControlButton>
              <ControlButton variant="danger" onClick={() => run(deleteByValueSteps(list, value))}>Delete value</ControlButton>
              <ControlButton variant="danger" onClick={() => run(deleteAtIndexSteps(list, index))}>Delete index</ControlButton>
              <ControlButton onClick={() => run(searchSteps(list, value), false)}>Search</ControlButton>
              <ControlButton onClick={() => run(reverseSteps(list))}>Reverse</ControlButton>
              <ControlButton variant="ghost" onClick={() => run(insertTailSteps([], value))}>Clear + add</ControlButton>
            </div>
          </div>
        </div>

        <div className="panel min-h-[22rem] p-5">
          <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">Head: {current.list[0] ?? 'null'}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">Tail: {current.list.at(-1) ?? 'null'}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">Length: {current.list.length}</span>
            {current.warning && <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700">{current.warning}</span>}
          </div>
          <div className="flex min-h-[13rem] items-center overflow-x-auto rounded-3xl border border-slate-200 bg-gradient-to-r from-white to-slate-100 p-5">
            {current.list.length === 0 ? <div className="text-sm font-semibold text-slate-500">Empty list</div> : current.list.map((item, nodeIndex) => <ListNode key={`${item}-${nodeIndex}`} value={item} index={nodeIndex} step={current} />)}
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
        {current.result !== undefined && <div className="rounded-2xl bg-slate-100 p-3 text-sm font-semibold text-slate-700">Result: {String(current.result)}</div>}
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
      <div className={`relative flex h-20 w-24 shrink-0 flex-col items-center justify-center rounded-2xl border-4 border-white shadow-lg ${target ? 'bg-emerald-500 text-white' : active ? 'bg-indigo-600 text-white' : previous ? 'bg-amber-400 text-white' : 'bg-slate-200 text-slate-800'}`}>
        <span className="text-xs font-bold opacity-70">idx {index}</span>
        <span className="text-2xl font-black">{value}</span>
        {index === 0 && <span className="absolute -top-7 rounded-full bg-slate-950 px-2 py-1 text-[0.65rem] font-bold text-white">HEAD</span>}
        {index === step.list.length - 1 && <span className="absolute -bottom-7 rounded-full bg-slate-950 px-2 py-1 text-[0.65rem] font-bold text-white">TAIL</span>}
      </div>
      {index < step.list.length - 1 && <div className="mx-3 text-3xl font-black text-slate-400">→</div>}
    </div>
  );
}
