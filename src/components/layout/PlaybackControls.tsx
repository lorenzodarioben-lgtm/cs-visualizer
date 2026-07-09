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
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <ControlButton
          variant="primary"
          onClick={handlePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="min-w-[6.5rem] gap-2"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
          {isPlaying ? 'Pause' : atEnd ? 'Replay' : 'Play'}
        </ControlButton>
        <ControlButton
          onClick={controller.previous}
          disabled={!controller.canGoBack}
          aria-label="Previous step"
          className="gap-1.5"
        >
          <StepBackIcon /> Prev
        </ControlButton>
        <ControlButton
          onClick={controller.next}
          disabled={!controller.canGoForward}
          aria-label="Next step"
          className="gap-1.5"
        >
          Next <StepForwardIcon />
        </ControlButton>
        <ControlButton variant="ghost" onClick={controller.reset} aria-label="Reset to start" className="gap-1.5">
          <ResetIcon /> Reset
        </ControlButton>
        <ControlButton
          variant={controller.loop ? 'primary' : 'ghost'}
          onClick={controller.toggleLoop}
          aria-pressed={controller.loop}
          aria-label="Toggle loop playback"
          title="Loop playback"
          className="gap-1.5"
        >
          <LoopIcon /> Loop
        </ControlButton>
        <span className="ml-auto rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold tabular-nums text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          Step {stepNumber} / {totalSteps}
        </span>
      </div>
      <label className="flex items-center gap-3">
        <span className="sr-only">Timeline scrubber</span>
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(event) => controller.setStepIndex(Number(event.target.value))}
          disabled={totalSteps <= 1}
          aria-label="Jump to step"
          className="focus-ring h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700"
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

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function StepBackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 5h2v14H6zM20 5v14l-10-7z" />
    </svg>
  );
}

function StepForwardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 5h2v14h-2zM4 5v14l10-7z" />
    </svg>
  );
}

function LoopIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
