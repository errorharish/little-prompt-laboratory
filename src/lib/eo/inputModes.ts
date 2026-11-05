// Input Optimizer modes — pure rules.
//  • NORMAL and ADVANCED are recommendation-driven: their selection is always every applicable +
//    recommended item of that mode (src/lib/eo/selection.ts) and cannot be edited.
//  • CUSTOM is the only mode where the user edits the selection; it is saved separately.
// Sample data only: nothing here reads or changes real input settings.
import type { Risk } from "./data";
import { eligibleSelection, type SelectionCandidate } from "./selection";

export type InputMode = "NORMAL" | "ADVANCED" | "CUSTOM";
export const INPUT_MODES: InputMode[] = ["NORMAL", "ADVANCED", "CUSTOM"];

export interface InputOption extends SelectionCandidate<string> {
  id: string;
  tier: "normal" | "advanced";
  name: string;
  desc: string;
  risk: Risk;
  restart?: boolean;
  /** Compatibility note shown for advanced items. */
  compat?: string;
  /** Why the item is excluded from the defaults, when it is. */
  note?: string;
}

export const INPUT_OPTIONS: InputOption[] = [
  {
    id: "mouse-accel",
    tier: "normal",
    name: "Disable mouse acceleration (1:1 raw pointer)",
    desc: "Turns off Enhance Pointer Precision so movement maps 1:1.",
    risk: "LOW",
    done: true,
    note: "Already applied on the sample PC",
  },
  {
    id: "kb-repeat-rate",
    tier: "normal",
    name: "Keyboard repeat rate maximization",
    desc: "Fastest standard key repeat rate.",
    risk: "LOW",
  },
  {
    id: "kb-repeat-delay",
    tier: "normal",
    name: "Keyboard repeat delay minimum",
    desc: "Shortest standard delay before a held key repeats.",
    risk: "LOW",
  },
  {
    id: "hover-time",
    tier: "normal",
    name: "Mouse hover time reduction",
    desc: "Tooltips and hover menus open sooner.",
    risk: "SAFE",
  },
  {
    id: "mouse-queue",
    tier: "advanced",
    name: "Mouse data queue size",
    desc: "MouseDataQueueSize in the mouclass driver parameters.",
    risk: "LOW",
    restart: true,
    compat: "PS/2 and USB HID mice",
    done: true,
    note: "Already applied on the sample PC",
  },
  {
    id: "kb-queue",
    tier: "advanced",
    name: "Keyboard data queue size",
    desc: "KeyboardDataQueueSize in the kbdclass driver parameters.",
    risk: "LOW",
    restart: true,
    compat: "PS/2 and USB HID keyboards",
  },
  {
    id: "timer-request",
    tier: "advanced",
    name: "High-precision timer request",
    desc: "Lets foreground games keep a 0.5 ms timer resolution request.",
    risk: "MEDIUM",
    compat: "Windows 10 2004 or later",
  },
  {
    id: "usb-suspend",
    tier: "advanced",
    name: "USB selective suspend (input devices)",
    desc: "Stops Windows putting USB input devices to sleep.",
    risk: "LOW",
    compat: "Desktop on AC power",
  },
  {
    id: "timer-lock",
    tier: "advanced",
    name: "Global timer resolution lock",
    desc: "Forces 0.5 ms system-wide, including idle — raises power use.",
    risk: "HIGH",
    compat: "Not recommended on laptops",
    recommended: false,
    note: "High risk — never pre-selected",
  },
  {
    id: "pen-feedback",
    tier: "advanced",
    name: "Pen and touch feedback timing",
    desc: "Shortens pen and touch visual feedback.",
    risk: "LOW",
    compat: "Needs a pen or touch screen",
    incompatible: true,
    note: "No pen or touch device on the sample PC",
  },
];

/** Options shown for a mode: Normal → normal only; Advanced and Custom → normal + advanced. */
export function optionsFor(mode: InputMode): InputOption[] {
  return mode === "NORMAL" ? INPUT_OPTIONS.filter((o) => o.tier === "normal") : INPUT_OPTIONS;
}

/** Recommendation-driven selection for Normal / Advanced (also Custom's reset target). */
export function recommendedFor(mode: InputMode): Set<string> {
  return eligibleSelection(optionsFor(mode));
}

/** Whether a mode lets the user change individual items. */
export const isEditableMode = (mode: InputMode) => mode === "CUSTOM";

export function parseMode(v: string | null | undefined): InputMode {
  return (INPUT_MODES as string[]).includes(v ?? "") ? (v as InputMode) : "NORMAL";
}
