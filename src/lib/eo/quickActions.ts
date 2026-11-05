// Dashboard actions, split into two groups that never mix:
//  • NAV_SHORTCUTS open an existing page (they never run anything).
//  • QUICK_OPTIMIZE run their own single task in place on the Dashboard (they never navigate).
// Steps reuse operations that already exist elsewhere in the prototype (Auto Optimize tasks,
// Storage, Network, Backup). Pure data + rules — every run is simulated and changes nothing.
import { MAINT_TASKS } from "./autoOptimize";

export type QuickOutcome = "Completed" | "Skipped" | "Failed";

export interface QuickStep {
  t: string;
  detail: string;
  outcome: QuickOutcome;
  /** Why a step was skipped or failed. */
  reason?: string;
}

export interface QuickAction {
  id: string;
  cat: string;
  title: string;
  desc: string;
  /** Where the underlying operation exists in the prototype. */
  source: string;
  /** "restore-point" runs the shared System Protection → restore point workflow. */
  flow?: "restore-point";
  steps: QuickStep[];
}

export interface NavShortcut {
  id: string;
  title: string;
  desc: string;
  /** Registry slug of the destination page. */
  to: string;
}

const task = (id: string): QuickStep => {
  const t = MAINT_TASKS.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown maintenance task ${id}`);
  return { t: t.name, detail: t.sample, outcome: "Completed" };
};

export const NAV_SHORTCUTS: NavShortcut[] = [
  {
    id: "telemetry",
    title: "View Telemetry",
    desc: "Live charts and System Health Check",
    to: "system-info",
  },
  {
    id: "startup",
    title: "Startup Manager",
    desc: "Review apps that start with Windows",
    to: "startup-manager",
  },
  {
    id: "boost",
    title: "Boost Performance",
    desc: "Maximum Performance profile",
    to: "max-performance",
  },
  {
    id: "one-click",
    title: "One-Click Optimization",
    desc: "Analyze, review and confirm",
    to: "one-click",
  },
];

export const QUICK_OPTIMIZE: QuickAction[] = [
  {
    id: "temp",
    cat: "STORAGE",
    title: "Temporary File Cleanup",
    desc: "Windows and user temp folders, old crash reports",
    source: "Auto Optimize · Clean Temp Files / Storage",
    steps: [
      task("temp-windows"),
      task("temp-user"),
      task("temp-crash"),
      {
        t: "Files in use or modified in the last 24 h",
        detail: "Left in place",
        outcome: "Skipped",
        reason: "Locked and recent files are never forced",
      },
    ],
  },
  {
    id: "ram",
    cat: "MEMORY",
    title: "Memory Cleanup",
    desc: "Empty the standby list, release idle working sets",
    source: "Auto Optimize · Free Standby Memory",
    steps: [
      task("mem-standby"),
      { t: "Idle working-set refresh", detail: "Background processes only", outcome: "Completed" },
      {
        t: "Active app working sets",
        detail: "Not trimmed",
        outcome: "Skipped",
        reason: "Running apps are never trimmed",
      },
    ],
  },
  {
    id: "cache",
    cat: "CACHE",
    title: "Cache Cleanup",
    desc: "Browser caches and DirectX shader cache",
    source: "Auto Optimize · Browser cache / System caches",
    steps: [
      task("browser-chrome"),
      task("browser-edge"),
      task("browser-firefox"),
      task("sys-shader"),
      {
        t: "Passwords, cookies, logins and history",
        detail: "Not touched",
        outcome: "Skipped",
        reason: "Cache only — personal browser data is never cleaned",
      },
    ],
  },
  {
    id: "network",
    cat: "NETWORK",
    title: "Network Refresh",
    desc: "Flush DNS, remove multimedia throttling",
    source: "Network / Optimization catalog",
    steps: [
      task("sys-dns"),
      {
        t: "Disable Multimedia Network Throttling Index",
        detail: "Throttling removed",
        outcome: "Completed",
      },
      {
        t: "TCP Window Auto-Tuning Calibration (Normal)",
        detail: "Set to Normal",
        outcome: "Completed",
      },
    ],
  },
  {
    id: "restore",
    cat: "SAFETY",
    title: "Create Restore Point",
    desc: "Checks System Protection first",
    source: "Backup & Restore",
    flow: "restore-point",
    steps: [],
  },
];

/** A new quick action may start only when none is running (no duplicate or parallel runs). */
export const canStartQuick = (runningId: string | null) => runningId === null;

/** Index of the step shown as "current" for a 0–100 progress value. */
export function quickStepAt(a: QuickAction, progress: number): number {
  if (!a.steps.length) return -1;
  return Math.min(a.steps.length - 1, Math.floor((progress / 100) * a.steps.length));
}

export interface QuickResult {
  completed: number;
  skipped: number;
  failed: number;
  /** Always 0: the prototype never changes the computer. */
  realChanges: 0;
  status: "Completed" | "Skipped" | "Failed";
}

export function quickResult(a: QuickAction): QuickResult {
  const n = (o: QuickOutcome) => a.steps.filter((s) => s.outcome === o).length;
  const completed = n("Completed");
  const skipped = n("Skipped");
  const failed = n("Failed");
  return {
    completed,
    skipped,
    failed,
    realChanges: 0,
    status: failed ? "Failed" : completed ? "Completed" : "Skipped",
  };
}
