export type TurnstileState = 'Locked' | 'Unlocked';
export type TurnstileInput = 'coin' | 'push';

export type StateTransition = {
  from: TurnstileState;
  input: TurnstileInput | string;
  to: TurnstileState;
  explanation: string;
  changed: boolean;
};

export type StateMachineStep = {
  id: string;
  description: string;
  currentState: TurnstileState;
  input?: TurnstileInput | string;
  transition?: StateTransition;
  history: StateTransition[];
  codeLine?: number;
};
