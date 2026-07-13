import { useState } from 'react';
import { ControlButton } from '../../../components/controls/ControlButton';
import { SelectControl } from '../../../components/controls/SelectControl';
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
    <section className="viz-section">
      <div className="viz-column">
        <div className="panel min-w-0 p-4">
          <div className="viz-header">
            <div className="min-w-0">
              <p className="control-label">Finite State Machine Demo</p>
              <h2 className="mt-1 text-xl font-bold heading-strong">Turnstile: Locked and Unlocked</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <ControlButton variant="primary" onClick={() => trigger('coin')}>Input: coin</ControlButton>
              <ControlButton onClick={() => trigger('push')}>Input: push</ControlButton>
              <ControlButton variant="ghost" onClick={() => setInputs([])}>Reset history</ControlButton>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200/70 p-4 surface-muted dark:border-slate-800/80">
            <SelectControl
              label="Initial state"
              value={initialState}
              onChange={(state) => {
                setInitialState(state);
                setInputs([]);
              }}
              options={[
                { value: 'Locked', label: 'Locked' },
                { value: 'Unlocked', label: 'Unlocked' },
              ]}
            />
            <span className="inline-flex items-center gap-1.5 rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
              Current: {current.currentState}
            </span>
          </div>
        </div>

        <div className="panel min-w-0 p-4">
          <StateDiagram current={current} />
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
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
    <div className="canvas-surface relative flex min-h-[16rem] flex-col flex-wrap items-center justify-center gap-4 p-5 sm:min-h-[20rem] sm:flex-row sm:gap-2">
      <div className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[3px] border-white font-display text-lg font-semibold shadow-md transition-colors duration-300 dark:border-slate-950 sm:h-32 sm:w-32 sm:text-xl ${locked ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200'}`}>Locked</div>
      <div className="grid shrink-0 gap-1.5 px-2 text-center font-mono text-xs font-medium text-slate-500 dark:text-slate-400 sm:mx-4">
        <span>coin &rarr;</span>
        <span>&larr; push</span>
      </div>
      <div className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[3px] border-white font-display text-lg font-semibold shadow-md transition-colors duration-300 dark:border-slate-950 sm:h-32 sm:w-32 sm:text-xl ${!locked ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200'}`}>Unlocked</div>
    </div>
  );
}

function TransitionTable() {
  const rows = [transitionTable.Locked.coin, transitionTable.Locked.push, transitionTable.Unlocked.coin, transitionTable.Unlocked.push];
  return (
    <div className="viz-card overflow-hidden">
      <p className="control-label mb-3">Transition table</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-sm">
          <thead className="control-label"><tr><th className="pb-1 font-medium">From</th><th className="font-medium">Input</th><th className="font-medium">To</th></tr></thead>
          <tbody className="text-slate-700 dark:text-slate-200">{rows.map((row) => <tr className="border-t border-slate-200/70 dark:border-slate-800" key={`${row.from}-${row.input}`}><td className="py-1.5 font-medium">{row.from}</td><td>{row.input}</td><td>{row.to}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function HistoryList({ step }: { step: StateMachineStep }) {
  return (
    <div className="viz-card">
      <p className="control-label mb-3">Transition history</p>
      <div className="max-h-52 space-y-1.5 overflow-auto">
        {step.history.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No inputs yet. Trigger coin or push.</p>
        ) : (
          step.history.map((item, index) => (
            <div className="rounded-md surface-inset px-2.5 py-1.5 font-mono text-xs" key={`${item.input}-${index}`}>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{item.from}</span>
              <span className="text-slate-400"> + </span>
              <span className="font-semibold text-indigo-700 dark:text-indigo-300">{item.input}</span>
              <span className="text-slate-400"> &rarr; </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{item.to}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
