// Shared state for the 1-Click / Auto Optimize workflow: Analyze → Review → Confirm → Result.
// Used by the dedicated 1-Click page and the Dashboard Auto Optimize panel so there is one
// workflow, not two. Selection and summaries go through src/lib/eo/selection.ts.
import { useMemo, useState } from "react";
import { useSimRun } from "./kit";
import { ONE_CLICK_ACTIONS } from "@/lib/eo/data";
import {
  recommendedSelection,
  summarizeSelection,
  toggleInSet,
  type SimulatedRunSummary,
} from "@/lib/eo/selection";

export type LastRun = SimulatedRunSummary & { at: string; titles: string[] };

export function useOptimizeWorkflow(scanMs = 1400) {
  const scan = useSimRun(scanMs);
  const [analyzed, setAnalyzed] = useState(false);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [lastRun, setLastRun] = useState<LastRun | null>(null);

  const summary = useMemo(() => summarizeSelection(ONE_CLICK_ACTIONS, sel), [sel]);
  const selectedItems = useMemo(() => ONE_CLICK_ACTIONS.filter((a) => sel.has(a.id)), [sel]);

  return {
    scan,
    analyzed,
    sel,
    setSel,
    summary,
    selectedItems,
    lastRun,
    toggle: (id: string) => setSel((s) => toggleInSet(s, id)),
    /** Loads the sample recommendations; protected items are never pre-selected. */
    analyze: (onDone?: () => void) =>
      scan.start(() => {
        setAnalyzed(true);
        setSel(recommendedSelection(ONE_CLICK_ACTIONS));
        onDone?.();
      }),
    selectRecommended: () => setSel(recommendedSelection(ONE_CLICK_ACTIONS)),
    clear: () => setSel(new Set()),
    complete: (s: SimulatedRunSummary) =>
      setLastRun({
        ...s,
        at: new Date().toLocaleTimeString(),
        titles: selectedItems.map((a) => a.title),
      }),
    dismissRun: () => setLastRun(null),
  };
}
