// Restore point workflow with a System Protection check — pure rules, no timers, no I/O.
// The browser prototype only walks through the phases; it never reads or changes Windows.
//
//   start → checking ─ protection on ──────────────────────────────→ creating → verifying-point → created
//                    └ protection off → protection-off ─ Enable → confirm-enable ─ Confirm → enabling
//                                       └ Cancel → cancelled         └ Back / Cancel        │
//                      enabling ─ fails → enable-failed (manual steps, retry)               │
//                               └ ok → verifying-protection ─ verified on → creating ───────┘
//                                                           └ still off → enable-failed
//   verifying-point ─ Windows skipped it (frequency limit) → create-failed (never "created")

export type RpPhase =
  | "idle"
  | "checking"
  | "protection-off"
  | "confirm-enable"
  | "enabling"
  | "verifying-protection"
  | "creating"
  | "verifying-point"
  | "created"
  | "enable-failed"
  | "create-failed"
  | "cancelled";

export type RpEvent = "start" | "done" | "enable" | "confirm" | "back" | "cancel" | "retry";

/** Simulated outcome of the enable / create steps, chosen on the Backup & Restore page. */
export type RpOutcome = "success" | "enable-fails" | "creation-skipped";

export interface RpDevice {
  /** System drive the restore point protects. */
  drive: string;
  /** System Protection state of that drive on the sample device. */
  protectionOn: boolean;
  outcome: RpOutcome;
}

export const RP_DEFAULT_DEVICE: RpDevice = { drive: "C:", protectionOn: false, outcome: "success" };

/** Phases that advance on their own after a simulated delay (ms). */
export const RP_TIMED: Partial<Record<RpPhase, number>> = {
  checking: 900,
  enabling: 1400,
  "verifying-protection": 900,
  creating: 1600,
  "verifying-point": 900,
};

export const isRpBusy = (p: RpPhase) => p in RP_TIMED;
export const isRpFinal = (p: RpPhase) =>
  p === "created" || p === "enable-failed" || p === "create-failed" || p === "cancelled";

export function rpNext(phase: RpPhase, event: RpEvent, device: RpDevice): RpPhase {
  if (event === "start") return isRpBusy(phase) ? phase : "checking";
  switch (phase) {
    case "checking":
      return event === "done" ? (device.protectionOn ? "creating" : "protection-off") : phase;
    case "protection-off":
      if (event === "enable") return "confirm-enable";
      if (event === "cancel") return "cancelled";
      return phase;
    case "confirm-enable":
      if (event === "confirm") return "enabling";
      if (event === "back") return "protection-off";
      if (event === "cancel") return "cancelled";
      return phase;
    case "enabling":
      if (event !== "done") return phase;
      return device.outcome === "enable-fails" ? "enable-failed" : "verifying-protection";
    case "verifying-protection":
      // Creation continues only when the drive really reports protection on.
      if (event !== "done") return phase;
      return device.protectionOn ? "creating" : "enable-failed";
    case "creating":
      return event === "done" ? "verifying-point" : phase;
    case "verifying-point":
      if (event !== "done") return phase;
      return device.outcome === "creation-skipped" ? "create-failed" : "created";
    case "enable-failed":
      if (event === "retry") return "confirm-enable";
      if (event === "cancel") return "cancelled";
      return phase;
    case "create-failed":
      if (event === "retry") return "checking";
      if (event === "cancel") return "cancelled";
      return phase;
    default:
      return phase;
  }
}

/** Protection is switched on only by a confirmed, successful enable step — never silently. */
export function protectionAfter(phase: RpPhase, device: RpDevice): boolean {
  return phase === "enabling" && device.outcome !== "enable-fails" ? true : device.protectionOn;
}

/** A restore point may be reported as created only after its verification step. */
export const rpCreated = (phase: RpPhase) => phase === "created";

export const RP_MANUAL_STEPS = [
  "Open Start, type “Create a restore point” and open it.",
  "On the System Protection tab, select the system drive and choose Configure.",
  "Choose “Turn on system protection”, set disk space usage, then OK. Administrator approval is required.",
  "Return to ERROR OPTIMIZER and choose Try again.",
];
