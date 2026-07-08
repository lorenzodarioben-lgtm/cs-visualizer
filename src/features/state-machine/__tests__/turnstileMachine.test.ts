import { describe, expect, it } from 'vitest';
import { generateStateMachineSteps, triggerTurnstileInput } from '../algorithms/turnstileMachine';

describe('turnstile state machine', () => {
  it('valid transitions work', () => {
    expect(triggerTurnstileInput('Locked', 'coin').to).toBe('Unlocked');
    expect(triggerTurnstileInput('Unlocked', 'push').to).toBe('Locked');
  });

  it('invalid or no-op transitions are handled', () => {
    expect(triggerTurnstileInput('Locked', 'push').to).toBe('Locked');
    expect(triggerTurnstileInput('Locked', 'banana').to).toBe('Locked');
  });

  it('transition history records correctly', () => {
    const steps = generateStateMachineSteps('Locked', ['coin', 'push', 'push']);
    const final = steps.at(-1)!;
    expect(final.currentState).toBe('Locked');
    expect(final.history).toHaveLength(3);
    expect(final.history.map((item) => `${item.from}-${item.input}-${item.to}`)).toEqual([
      'Locked-coin-Unlocked',
      'Unlocked-push-Locked',
      'Locked-push-Locked',
    ]);
  });
});
