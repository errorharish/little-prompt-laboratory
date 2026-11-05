// Pure selection + simulated-run helpers shared by every selectable list and run flow.
// Nothing here touches a real system: results only describe what the prototype simulated.
import type { Risk } from "./data";

/** Returns a new Set with `id` toggled (immutable, safe for React state). */
export function toggleInSet<T>(set: Set<T>, id: T): Set<T> {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

interface Selectable {
  id: string;
  risk: Risk;
}

/** Anything that may appear as a selectable row. Flags mark items that must never be
 *  selected automatically even though the user may still pick some of them by hand. */
export interface SelectionCandidate<T extends string | number = string> {
  id: T;
  risk?: Risk | undefined;
  /** Already applied on the sample system — nothing to do. */
  done?: boolean | undefined;
  /** Not applicable to the sample hardware / unsupported. Never selectable. */
  unsupported?: boolean | undefined;
  /** Irreversible or data-deleting — needs an explicit, confirmed user choice. */
  destructive?: boolean | undefined;
}

/** May the user select this item at all? Protected and unsupported items never. */
export function isSelectable(i: SelectionCandidate<string | number>): boolean {
  return i.risk !== "PROTECTED" && !i.unsupported;
}

/** Is this item part of the first-use default selection ("all eligible")?
 *  Excludes protected, high-risk, destructive, already-applied and unsupported items. */
export function isDefaultEligible(i: SelectionCandidate<string | number>): boolean {
  return isSelectable(i) && i.risk !== "HIGH" && !i.destructive && !i.done;
}

/** First-use default: every eligible item selected. */
export function eligibleSelection<T extends string | number>(
  items: readonly SelectionCandidate<T>[],
): Set<T> {
  return new Set(items.filter(isDefaultEligible).map((i) => i.id));
}

/** Restores a saved selection: unknown, protected or unsupported ids are dropped, so a stale
 *  or tampered save can never make a protected item executable. */
export function restoreSelection<T extends string | number>(
  saved: readonly string[],
  items: readonly SelectionCandidate<T>[],
): Set<T> {
  const keep = new Set(saved);
  return new Set(items.filter((i) => isSelectable(i) && keep.has(String(i.id))).map((i) => i.id));
}

/** Clamps any requested selection to selectable items (Select all, toggles, restores). */
export function clampSelection<T extends string | number>(
  requested: Iterable<T>,
  items: readonly SelectionCandidate<T>[],
): Set<T> {
  const want = new Set(requested);
  return new Set(items.filter((i) => isSelectable(i) && want.has(i.id)).map((i) => i.id));
}

/** Default selection after an analysis: protected items are never selected silently. */
export function recommendedSelection(items: readonly Selectable[]): Set<string> {
  return eligibleSelection(items);
}

export interface SelectionSummary {
  total: number;
  restart: number;
  byRisk: Record<Risk, number>;
}

export function summarizeSelection(
  items: readonly (Selectable & { restart?: boolean })[],
  selected: Set<string>,
): SelectionSummary {
  const picked = items.filter((i) => selected.has(i.id));
  const byRisk: Record<Risk, number> = { SAFE: 0, LOW: 0, MEDIUM: 0, HIGH: 0, PROTECTED: 0 };
  for (const i of picked) byRisk[i.risk] += 1;
  return { total: picked.length, restart: picked.filter((i) => i.restart).length, byRisk };
}

export interface SimulatedRunSummary {
  selected: number;
  simulatedSteps: number;
  restartNoted: number;
  /** Always 0: the browser prototype never changes the computer. */
  realChanges: 0;
  verification: "Not performed (prototype)";
  elapsedMs: number;
}

export function simulatedRunSummary(
  selected: number,
  restartNoted: number,
  elapsedMs: number,
): SimulatedRunSummary {
  return {
    selected,
    simulatedSteps: selected,
    restartNoted,
    realChanges: 0,
    verification: "Not performed (prototype)",
    elapsedMs,
  };
}
