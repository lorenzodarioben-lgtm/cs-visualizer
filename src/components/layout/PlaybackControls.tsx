import { ControlButton } from '../controls/ControlButton';
import type { AnimationController } from '../../lib/animation/useAnimationController';

type PlaybackControlsProps<T> = {
  controller: AnimationController<T>;
};

export function PlaybackControls<T>({ controller }: PlaybackControlsProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ControlButton variant="primary" onClick={controller.play}>Start</ControlButton>
      {controller.isPlaying ? (
        <ControlButton onClick={controller.pause}>Pause</ControlButton>
      ) : (
        <ControlButton onClick={controller.resume}>Resume</ControlButton>
      )}
      <ControlButton onClick={controller.previous} disabled={!controller.canGoBack}>Previous</ControlButton>
      <ControlButton onClick={controller.next} disabled={!controller.canGoForward}>Next step</ControlButton>
      <ControlButton variant="ghost" onClick={controller.reset}>Reset</ControlButton>
      <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
        Step {controller.totalSteps === 0 ? 0 : controller.currentStepIndex + 1} / {controller.totalSteps}
      </span>
    </div>
  );
}
