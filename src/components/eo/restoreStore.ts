// Simulated restore-point device + history, shared by Backup & Restore, the Dashboard and every
// run dialog. Prototype only: the "device" is a demo scenario and no restore point is ever
// created on this computer. Persisted in this browser's localStorage.
import { useSyncExternalStore } from "react";
import { RP_DEFAULT_DEVICE, type RpDevice } from "@/lib/eo/restorePoint";

export interface SimRestorePoint {
  name: string;
  drive: string;
  at: number;
}

export interface RestoreState {
  device: RpDevice;
  points: SimRestorePoint[];
}

const KEY = "eo-restore-sim:v1";
const SERVER: RestoreState = { device: RP_DEFAULT_DEVICE, points: [] };
let state: RestoreState = SERVER;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) ?? "null") as RestoreState | null;
    if (raw && raw.device && Array.isArray(raw.points)) {
      state = { device: { ...RP_DEFAULT_DEVICE, ...raw.device }, points: raw.points.slice(0, 10) };
    }
  } catch {
    /* ignore corrupt storage */
  }
}

function commit(next: RestoreState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function getRestore(): RestoreState {
  hydrate();
  return state;
}

export function setDevice(patch: Partial<RpDevice>) {
  hydrate();
  commit({ ...state, device: { ...state.device, ...patch } });
}

export function addRestorePoint(p: SimRestorePoint) {
  hydrate();
  commit({ ...state, points: [p, ...state.points].slice(0, 10) });
}

/** Back to the sample device: protection off, no simulated points. */
export function resetRestoreSim() {
  hydrate();
  commit(SERVER);
}

export function useRestore(): RestoreState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    getRestore,
    () => SERVER,
  );
}
