import { useCallback, useState } from 'react';
import { useAnimationController, type AnimationController } from './useAnimationController';

type UseStepSequenceParams<TStep, TData> = {
  initialData: TData;
  initialSteps: TStep[];
  /** Derives the resulting data structure from a completed step sequence. */
  deriveData: (steps: TStep[]) => TData;
  speedMs: number;
};

type StepSequence<TStep, TData> = {
  data: TData;
  setData: (data: TData) => void;
  steps: TStep[];
  controller: AnimationController<TStep>;
  /**
   * Play a freshly generated step sequence. By default the resulting data
   * structure is committed (`mutate: true`); pass `mutate: false` for
   * read-only operations such as search or peek.
   */
  run: (nextSteps: TStep[], options?: { mutate?: boolean }) => void;
};

/**
 * Shared state for operation-driven visualizers (heap, linked list): keeps the
 * live data structure, the current step timeline, and the playback controller
 * in sync, and exposes a single `run` entry point for triggering operations.
 */
export function useStepSequence<TStep, TData>({
  initialData,
  initialSteps,
  deriveData,
  speedMs,
}: UseStepSequenceParams<TStep, TData>): StepSequence<TStep, TData> {
  const [data, setData] = useState<TData>(initialData);
  const [steps, setSteps] = useState<TStep[]>(initialSteps);
  const controller = useAnimationController<TStep>(steps, speedMs);

  const run = useCallback(
    (nextSteps: TStep[], options?: { mutate?: boolean }) => {
      setSteps(nextSteps);
      if (options?.mutate ?? true) setData(deriveData(nextSteps));
    },
    [deriveData],
  );

  return { data, setData, steps, controller, run };
}
