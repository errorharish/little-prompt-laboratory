// Persisted per-page / per-profile optimization selections.
// First use → every eligible item selected (src/lib/eo/selection.ts rules). Once the user changes
// a selection it is saved under its own key, so profiles never share or overwrite each other.
// Prototype storage only: localStorage in this browser, nothing touches the computer.
import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  clampSelection,
  eligibleSelection,
  restoreSelection,
  type SelectionCandidate,
} from "@/lib/eo/selection";

const STORAGE_KEY = "eo-selections:v1";
type Saved = Record<string, string[]>;

let saved: Saved | null = null;
const listeners = new Set<() => void>();

function read(): Saved {
  if (saved) return saved;
  try {
    const raw: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    saved = raw && typeof raw === "object" ? (raw as Saved) : {};
  } catch {
    saved = {};
  }
  return saved;
}

function write(key: string, ids: string[] | undefined) {
  const next = { ...read() };
  if (ids) next[key] = ids;
  else delete next[key];
  saved = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage full / disabled — keep the in-memory copy */
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Test/reset helper: forgets every saved selection. */
export function resetSavedSelections() {
  saved = {};
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export interface PersistedSelection<T extends string | number> {
  sel: Set<T>;
  setSel: (next: Set<T> | ((cur: Set<T>) => Set<T>)) => void;
  toggle: (id: T) => void;
  /** Select every applicable + recommended item (never protected / high-risk / destructive). */
  selectAll: () => void;
  clear: () => void;
  /** Forget the saved customization and return to the first-use default. */
  reset: () => void;
  /** True once the user changed this selection. */
  customized: boolean;
  eligibleCount: number;
}

/**
 * @param key   Unique per page and per profile, e.g. `tier:tier-pro` or `emu-opt:BALANCED`.
 * @param items Every row the page can show (protected rows included — they are filtered out).
 */
export function usePersistedSelection<T extends string | number>(
  key: string,
  items: readonly SelectionCandidate<T>[],
): PersistedSelection<T> {
  const raw = useSyncExternalStore(
    subscribe,
    () => read()[key],
    () => undefined,
  );
  // Items are usually inline literals; key the memo on their identity-relevant fields.
  const sig = items
    .map(
      (i) =>
        `${String(i.id)}:${i.risk ?? ""}:${i.done ? 1 : 0}:${i.unsupported ? 1 : 0}:${i.destructive ? 1 : 0}:${i.incompatible ? 1 : 0}:${i.recommended === false ? 0 : 1}`,
    )
    .join("|");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stable = useMemo(() => items, [sig]);
  const defaults = useMemo(() => eligibleSelection(stable), [stable]);
  const sel = useMemo(
    () => (raw ? restoreSelection(raw, stable) : defaults),
    [raw, stable, defaults],
  );

  const setSel = useCallback<PersistedSelection<T>["setSel"]>(
    (next) => {
      const current = read()[key];
      const cur = current ? restoreSelection(current, stable) : eligibleSelection(stable);
      const value = typeof next === "function" ? next(cur) : next;
      write(
        key,
        [...clampSelection(value, stable)].map((id) => String(id)),
      );
    },
    [key, stable],
  );

  return {
    sel,
    setSel,
    toggle: (id) =>
      setSel((cur) => {
        const n = new Set(cur);
        if (n.has(id)) n.delete(id);
        else n.add(id);
        return n;
      }),
    selectAll: () => setSel(eligibleSelection(stable)),
    clear: () => setSel(new Set()),
    reset: () => write(key, undefined),
    customized: raw !== undefined,
    eligibleCount: defaults.size,
  };
}
