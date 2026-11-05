// V4 emulator session state shared by Emulator Optimization and its Module Hub, so moving
// between the two never resets engine states, the open module or the active profile.
// Simulated only: the "connection" is a demo toggle and engines never touch an emulator.
import { useSyncExternalStore } from "react";

export const EMU_PROFILES = ["BALANCED PROFILE", "PERFORMANCE PROFILE"] as const;
export type EmuProfile = (typeof EMU_PROFILES)[number];

export interface EmuState {
  /** Demo connection toggle (MSI App Player + ADB). */
  adb: boolean;
  /** Engines applied this session (indexes). */
  applied: number[];
  /** Module open inside the Module Hub; null = hub overview. */
  mod: string | null;
  profile: EmuProfile;
}

const PROFILE_KEY = "eo-emu-profile";
let state: EmuState = { adb: false, applied: [], mod: null, profile: "BALANCED PROFILE" };
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const p = window.localStorage.getItem(PROFILE_KEY);
  if (p && (EMU_PROFILES as readonly string[]).includes(p)) {
    state = { ...state, profile: p as EmuProfile };
  }
}

export function setEmu(patch: Partial<EmuState>) {
  hydrate();
  state = { ...state, ...patch };
  if (patch.profile) {
    try {
      window.localStorage.setItem(PROFILE_KEY, patch.profile);
    } catch {
      /* ignore */
    }
  }
  listeners.forEach((l) => l());
}

const SERVER: EmuState = { adb: false, applied: [], mod: null, profile: "BALANCED PROFILE" };

export function useEmu(): EmuState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => {
      hydrate();
      return state;
    },
    () => SERVER,
  );
}
