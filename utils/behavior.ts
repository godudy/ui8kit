/**
 * BehaviorMode is the opt-in client behavior channel for bricks that support
 * the @ui8kit/aria hook layer. The empty string means "no behavior hook":
 * the brick renders only static ARIA; the consuming app wires its own client
 * layer. `"ui8kit"` emits `data-ui8kit-*` hook attributes so the registered
 * `@ui8kit/aria` runtime can drive focus and keyboard routing.
 *
 * Spec `api` enums use `["", "ui8kit"]` from this single source. Keep this
 * list in sync with `utils/behavior.go`.
 */
export type BehaviorMode = "" | "ui8kit";

export const BEHAVIOR_MODE_OFF: BehaviorMode = "";
export const BEHAVIOR_MODE_UI8KIT: BehaviorMode = "ui8kit";

export const BEHAVIOR_MODES: readonly BehaviorMode[] = ["", "ui8kit"];

export function isValidBehaviorMode(v: unknown): v is BehaviorMode {
  return v === "" || v === "ui8kit";
}

export function normalizeBehaviorMode(v: unknown): BehaviorMode {
  return isValidBehaviorMode(v) ? v : "";
}
