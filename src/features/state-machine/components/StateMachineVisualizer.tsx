import { useState } from 'react';
import { ControlButton } from '../../../components/controls/ControlButton';
import { ExplanationPanel } from '../../../components/explanation/ExplanationPanel';
import { PseudocodePanel } from '../../../components/explanation/PseudocodePanel';
import { generateStateMachineSteps, transitionTable } from '../algorithms/turnstileMachine';
import type { StateMachineStep, TurnstileInput, TurnstileState } from '../stateMachineTypes';

const pseudocode = ['state = Locked', 'on input', '  if transition changes state: move to next state', '  else stay in current state', 'record transition in history'];

export function StateMachineVisualizer() {
  const [inputs, setInputs] = useState<(TurnstileInput | string)[]>([]);
  const [initialState, setInitialState] = useState<TurnstileState>('Locked');
  const steps = generateStateMachineSteps(initialState, inputs);
  const current = steps.at(-1)!;

  function trigger(input: TurnstileInput) {
    setInputs((items) => [...items, input]);
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="grid gap-5">
        <div className="panel p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="control-label">Finite State Machine Demo</p>
              <h2 className="mt-1 text-2xl font-black heading-strong">Turnstile: Locked ↔ Unlocked</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <ControlButton variant="primary" onClick={() => trigger('coin')}>Input: coin</ControlButton>
              <ControlButton onClick={() => trigger('push')}>Input: push</ControlButton>
              <ControlButton variant="ghost" onClick={() => setInputs([])}>Reset history</ControlButton>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl surface-muted p-4">
            <span className="control-label">Initial state</span>
            <select className="control-input" value={initialState} onChange={(event) => { setInitialState(event.target.value as TurnstileState); setInputs([]); }}>
              <option value="Locked">Locked</option>
              <option value="Unlocked">Unlocked</option>
            </select>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-700">Current: {current.currentState}</span>
          </div>
        </div>

        <div className="panel p-5">
          <StateDiagram current={current} />
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <TransitionTable />
            <HistoryList step={current} />
          </div>
        </div>
      </div>

      <ExplanationPanel
        content={{
          title: 'Turnstile finite state machine',
          currentStep: current.description,
          concept: 'A finite state machine has a fixed set of states. Inputs trigger transitions, and each transition depends only on the current state and the input.',
          timeComplexity: 'O(1) per input',
          spaceComplexity: 'O(h) for displayed history',
          useCases: ['UI workflows', 'Protocol states', 'Game logic', 'Parsers'],
          edgeCases: ['No-op transitions', 'Invalid inputs', 'Repeated inputs'],
        }}
      >
        <PseudocodePanel lines={pseudocode} activeLine={current.codeLine} />
      </ExplanationPanel>
    </section>
  );
}

function StateDiagram({ current }: { current: StateMachineStep }) {
  const locked = current.currentState === 'Locked';
  return (
    <div className="relative flex min-h-[20rem] items-center justify-center canvas-surface p-5">
      <div className={`flex h-32 w-32 items-center justify-center rounded-full border-4 border-white text-xl font-black shadow-lg transition-colors duration-300 dark:border-slate-900 ${locked ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>Locked</div>
      <div className="mx-6 grid gap-3 text-center text-sm font-bold text-slate-500">
        <span>coin →</span>
        <span>← push</span>
      </div>
      <div className={`flex h-32 w-32 items-center justify-center rounded-full border-4 border-white text-xl font-black shadow-lg transition-colors duration-300 dark:border-slate-900 ${!locked ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>Unlocked</div>
    </div>
  );
}

function TransitionTable() {
  const rows = [transitionTable.Locked.coin, transitionTable.Locked.push, transitionTable.Unlocked.coin, transitionTable.Unlocked.push];
  return (
    <div className="viz-card overflow-hidden">
      <p className="control-label mb-3">Transition table</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-slate-500"><tr><th className="py-2">From</th><th>Input</th><th>To</th></tr></thead>
          <tbody>{rows.map((row) => <tr className="border-t border-slate-100 dark:border-slate-800" key={`${row.from}-${row.input}`}><td className="py-2 font-semibold">{row.from}</td><td>{row.input}</td><td>{row.to}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function HistoryList({ step }: { step: StateMachineStep }) {
  return (
    <div className="viz-card">
      <p className="control-label mb-3">Transition history</p>
      <div className="max-h-52 space-y-2 overflow-auto text-sm">
        {step.history.length === 0 ? <p className="text-slate-500">No inputs yet.</p> : step.history.map((item, index) => (
          <div className="rounded-xl surface-inset p-2" key={`${item.input}-${index}`}>
            <span className="font-bold text-slate-900 dark:text-slate-100">{item.from}</span> + <span className="font-bold text-indigo-700 dark:text-indigo-300">{item.input}</span> → <span className="font-bold text-slate-900 dark:text-slate-100">{item.to}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
