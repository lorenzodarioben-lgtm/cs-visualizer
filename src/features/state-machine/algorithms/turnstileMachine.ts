import { nextStepId, resetStepIdCounter } from '../../../lib/utils/id';
import type { StateMachineStep, StateTransition, TurnstileInput, TurnstileState } from '../stateMachineTypes';

export const transitionTable: Record<TurnstileState, Record<TurnstileInput, StateTransition>> = {
  Locked: {
    coin: { from: 'Locked', input: 'coin', to: 'Unlocked', changed: true, explanation: 'A coin unlocks the turnstile.' },
    push: { from: 'Locked', input: 'push', to: 'Locked', changed: false, explanation: 'Pushing while locked does not open the turnstile.' },
  },
  Unlocked: {
    coin: { from: 'Unlocked', input: 'coin', to: 'Unlocked', changed: false, explanation: 'An extra coin is accepted, but the state stays unlocked.' },
    push: { from: 'Unlocked', input: 'push', to: 'Locked', changed: true, explanation: 'A push lets the person through and locks the turnstile again.' },
  },
};

function step(description: string, currentState: TurnstileState, history: StateTransition[], extra: Partial<StateMachineStep> = {}): StateMachineStep {
  return {
    id: nextStepId('fsm'),
    description,
    currentState,
    history: [...history],
    ...extra,
  };
}

export function triggerTurnstileInput(state: TurnstileState, input: TurnstileInput | string): StateTransition {
  if (input !== 'coin' && input !== 'push') {
    return { from: state, input, to: state, changed: false, explanation: `Input ${input} is not part of this machine, so the state is unchanged.` };
  }
  return transitionTable[state][input];
}

export function generateStateMachineSteps(initialState: TurnstileState, inputs: (TurnstileInput | string)[]): StateMachineStep[] {
  resetStepIdCounter();
  let state = initialState;
  const history: StateTransition[] = [];
  const steps: StateMachineStep[] = [step(`Machine starts in ${initialState}.`, state, history, { codeLine: 1 })];

  for (const input of inputs) {
    const transition = triggerTurnstileInput(state, input);
    history.push(transition);
    state = transition.to;
    steps.push(step(transition.explanation, state, history, { input, transition, codeLine: transition.changed ? 3 : 4 }));
  }
  return steps;
}
