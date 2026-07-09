/**
 * Common shape shared by every visualizer's step objects. Each feature extends
 * this with its own state and highlight fields, but the animation controller,
 * playback controls, and pseudocode panel only rely on this base contract.
 */
export interface AlgorithmStep {
  /** Stable unique id for React keys and debugging. */
  id: string;
  /** Human-readable description of what happens at this step. */
  description: string;
  /** 1-based pseudocode line to highlight, if any. */
  codeLine?: number;
}
