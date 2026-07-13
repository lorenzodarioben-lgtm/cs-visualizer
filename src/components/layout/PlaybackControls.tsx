import { ArrowCounterClockwise, Pause, Play, Repeat, SkipBack, SkipForward } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { ControlButton } from '../controls/ControlButton';
import type { AnimationController } from '../../lib/animation/useAnimationController';
import { useKeyboardShortcuts } from '../../lib/animation/useKeyboardShortcuts';

type PlaybackControlsProps<T> = {
  controller: AnimationController<T>;
};

export function PlaybackControls<T>({ controller }: PlaybackControlsProps<T>) {
  const { totalSteps, currentStepIndex, isPlaying } = controller;
  useKeyboardShortcuts(controller);
  const atEnd = !controller.canGoForward;
  const stepNumber = totalSteps === 0 ? 0 : currentStepIndex + 1;

  function handlePlayPause() {
    if (isPlaying) {
      controller.pause();
    } else if (atEnd) {
      controller.play();
    } else {
      controller.resume();
    }
  }

  return (
    <div className="grid min-w-0 gap-2.5 lg:w-80 lg:shrink-0">
      <div className="flex flex-wrap items-center gap-1.5">
        <ControlButton
          variant="primary"
          onClick={handlePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="min-w-[6.25rem]"
        >
          {isPlaying ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}
          {isPlaying ? 'Pause' : atEnd ? 'Replay' : 'Play'}
        </ControlButton>
        <ControlButton onClick={controller.previous} disabled={!controller.canGoBack} aria-label="Previous step">
          <SkipBack size={14} weight="fill" /> Prev
        </ControlButton>
        <ControlButton onClick={controller.next} disabled={!controller.canGoForward} aria-label="Next step">
          Next <SkipForward size={14} weight="fill" />
        </ControlButton>
        <ControlButton variant="ghost" onClick={controller.reset} aria-label="Reset to start">
          <ArrowCounterClockwise size={14} weight="bold" /> Reset
        </ControlButton>
        <ControlButton
          variant={controller.loop ? 'primary' : 'ghost'}
          onClick={controller.toggleLoop}
          aria-pressed={controller.loop}
          aria-label="Toggle loop playback"
          title="Loop playback"
        >
          <Repeat size={14} weight="bold" /> Loop
        </ControlButton>
        <span className="pill ml-auto">
          Step {stepNumber} / {totalSteps}
        </span>
      </div>
      <label className="flex items-center">
        <span className="sr-only">Timeline scrubber</span>
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(event) => controller.setStepIndex(Number(event.target.value))}
          disabled={totalSteps <= 1}
          aria-label="Jump to step"
          className="focus-ring h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600 transition-colors hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:hover:bg-slate-700"
        />
      </label>
      <p className="hidden flex-wrap items-center gap-1.5 text-[0.7rem] text-slate-400 dark:text-slate-500 sm:flex">
        <Kbd>Space</Kbd> play/pause
        <Kbd>←</Kbd>
        <Kbd>→</Kbd> step
        <Kbd>R</Kbd> reset
      </p>
    </div>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[0.65rem] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
      {children}
    </kbd>
  );
}
