// Dashboard Quick Actions. One-Click is the only action that opens its own page; every other
// action runs its own, single task in place on the Dashboard. Steps reuse operations that
// already exist elsewhere in the prototype (Auto Optimize tasks, Storage, Startup Manager,
// Network, Backup). Pure data + rules — the run itself is simulated and changes nothing.
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
  /** Only One-Click navigates. */
  to?: string;
  /** Where the underlying operation exists in the prototype. */
  source: string;
  steps: QuickStep[];
}

const task = (id: string): QuickStep => {
  const t = MAINT_TASKS.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown maintenance task ${id}`);
  return { t: t.name, detail: t.sample, outcome: "Completed" };
};

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "one-click",
    cat: "FULL TUNE",
    title: "One-Click Optimize",
    desc: "Analyze recommendations, review your selection and confirm a simulated run",
    to: "one-click",
    source: "1-Click Optimization",
    steps: [],
  },
  {
    id: "temp",
    cat: "STORAGE",
    title: "Clean Temporary Files",
    desc: "Clear Windows and user temp folders and old crash reports",
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
    id: "boost",
    cat: "POWER",
    title: "Boost Performance",
    desc: "Switch to the Ultimate Performance plan and disable power throttling",
    source: "Power Profiles / Optimization catalog",
    steps: [
      { t: "Ultimate Performance power plan", detail: "Plan activated", outcome: "Completed" },
      {
        t: "Disable Execution Power Throttling",
        detail: "Foreground apps keep full clocks",
        outcome: "Completed",
      },
    ],
  },
  {
    id: "ram",
    cat: "MEMORY",
    title: "RAM Cleanup",
    desc: "Empty the standby list and release idle working sets",
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
    id: "startup",
    cat: "BOOT",
    title: "Startup Manager",
    desc: "Disable high-impact third-party startup apps",
    source: "Startup Manager",
    steps: [
      { t: "Steam Client Bootstrapper", detail: "Startup disabled · HIGH impact", outcome: "Completed" },
      { t: "Discord", detail: "Startup disabled · HIGH impact", outcome: "Completed" },
      { t: "Adobe Creative Cloud", detail: "Startup disabled · HIGH impact", outcome: "Completed" },
      {
        t: "System startup entries",
        detail: "NVIDIA Display Container, Realtek Audio Console",
        outcome: "Skipped",
        reason: "Protected system entries",
      },
    ],
  },
  {
    id: "network",
    cat: "NETWORK",
    title: "Network Boost",
    desc: "Remove multimedia network throttling and calibrate TCP auto-tuning",
    source: "Network / Optimization catalog",
    steps: [
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
      task("sys-dns"),
    ],
  },
  {
    id: "telemetry",
    cat: "DIAGNOSTICS",
    title: "View Telemetry",
    desc: "Take a quick CPU, RAM and GPU snapshot without leaving the Dashboard",
    source: "System Telemetry",
    steps: [
      { t: "CPU", detail: "18% · 42°C (sample)", outcome: "Completed" },
      { t: "Memory", detail: "12.2 / 32 GB in use (sample)", outcome: "Completed" },
      { t: "GPU", detail: "14% · 44°C (sample)", outcome: "Completed" },
    ],
  },
  {
    id: "restore",
    cat: "SAFETY",
    title: "Create Restore Point",
    desc: "Snapshot registry hives and service configuration before tuning",
    source: "Backup & Restore",
    steps: [
      { t: "Registry hives snapshot", detail: "HKLM\\SYSTEM, HKLM\\SOFTWARE", outcome: "Completed" },
      { t: "Service configuration snapshot", detail: "Startup types saved", outcome: "Completed" },
      {
        t: "Register restore point",
        detail: "“Before quick optimization”",
        outcome: "Completed",
      },
    ],
  },
];

/** Only One-Click leaves the Dashboard. */
export const navigatesAway = (a: QuickAction) => Boolean(a.to);

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
