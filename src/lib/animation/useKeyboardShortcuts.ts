import { useEffect } from 'react';
import type { AnimationController } from './useAnimationController';

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  // Allow range sliders to keep their native arrow behaviour handled separately.
  if (tag === 'INPUT' && (target as HTMLInputElement).type === 'range') return false;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

/**
 * Global keyboard shortcuts for stepping through an animation:
 *   Space      play / pause
 *   → or L     next step
 *   ← or H     previous step
 *   R          reset to the start
 * Shortcuts are ignored while the user is typing in a form field.
 */
export function useKeyboardShortcuts<T>(controller: AnimationController<T>, enabled = true): void {
  const { isPlaying, canGoForward } = controller;

  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      switch (event.key) {
        case ' ':
        case 'Spacebar':
          event.preventDefault();
          if (isPlaying) controller.pause();
          else if (canGoForward) controller.resume();
          else controller.play();
          break;
        case 'ArrowRight':
        case 'l':
        case 'L':
          event.preventDefault();
          controller.next();
          break;
        case 'ArrowLeft':
        case 'h':
        case 'H':
          event.preventDefault();
          controller.previous();
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          controller.reset();
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, isPlaying, canGoForward, controller]);
}
