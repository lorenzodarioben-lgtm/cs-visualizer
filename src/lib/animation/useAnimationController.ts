import { useCallback, useEffect, useMemo, useState } from 'react';

export type AnimationController<T> = {
  currentStep: T | undefined;
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  loop: boolean;
  progress: number;
  canGoBack: boolean;
  canGoForward: boolean;
  play: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  next: () => void;
  previous: () => void;
  setStepIndex: (index: number) => void;
  toggleLoop: () => void;
};

export function useAnimationController<T>(steps: T[], speedMs: number): AnimationController<T> {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loop, setLoop] = useState(false);

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [steps]);

  const totalSteps = steps.length;
  const maxIndex = Math.max(0, totalSteps - 1);

  useEffect(() => {
    if (!isPlaying || totalSteps <= 1) return;

    const interval = window.setInterval(() => {
      setCurrentStepIndex((index) => {
        if (index >= maxIndex) {
          if (loop) return 0;
          window.clearInterval(interval);
          setIsPlaying(false);
          return index;
        }
        return index + 1;
      });
    }, Math.max(80, speedMs));

    return () => window.clearInterval(interval);
  }, [isPlaying, loop, maxIndex, speedMs, totalSteps]);

  const setStepIndex = useCallback(
    (index: number) => {
      setCurrentStepIndex(Math.min(maxIndex, Math.max(0, index)));
    },
    [maxIndex],
  );

  const play = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(totalSteps > 1);
  }, [totalSteps]);

  const pause = useCallback(() => setIsPlaying(false), []);
  const resume = useCallback(() => setIsPlaying(totalSteps > 1), [totalSteps]);
  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const next = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((index) => Math.min(maxIndex, index + 1));
  }, [maxIndex]);

  const previous = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((index) => Math.max(0, index - 1));
  }, []);

  const toggleLoop = useCallback(() => setLoop((value) => !value), []);

  return useMemo(
    () => ({
      currentStep: steps[currentStepIndex],
      currentStepIndex,
      totalSteps,
      isPlaying,
      loop,
      progress: maxIndex === 0 ? 0 : currentStepIndex / maxIndex,
      canGoBack: currentStepIndex > 0,
      canGoForward: currentStepIndex < maxIndex,
      play,
      pause,
      resume,
      reset,
      next,
      previous,
      setStepIndex,
      toggleLoop,
    }),
    [
      currentStepIndex,
      isPlaying,
      loop,
      maxIndex,
      next,
      pause,
      play,
      previous,
      reset,
      resume,
      setStepIndex,
      steps,
      toggleLoop,
      totalSteps,
    ],
  );
}

export function speedToDelayMs(speed: number): number {
  return Math.max(80, 1_080 - speed * 10);
}
