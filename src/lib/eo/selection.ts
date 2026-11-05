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

/** Default selection after an analysis: protected items are never selected silently. */
export function recommendedSelection(items: readonly Selectable[]): Set<string> {
  return new Set(items.filter((i) => i.risk !== "PROTECTED").map((i) => i.id));
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
