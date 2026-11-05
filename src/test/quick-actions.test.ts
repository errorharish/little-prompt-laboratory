import { describe, expect, it } from "vitest";
import {
  QUICK_ACTIONS,
  canStartQuick,
  navigatesAway,
  quickResult,
  quickStepAt,
} from "@/lib/eo/quickActions";

describe("Dashboard quick actions", () => {
  it("only One-Click navigates to its own page", () => {
    const away = QUICK_ACTIONS.filter(navigatesAway).map((a) => a.id);
    expect(away).toEqual(["one-click"]);
  });

  it("keeps the eight existing quick actions", () => {
    expect(QUICK_ACTIONS.map((a) => a.title)).toEqual([
      "One-Click Optimize",
      "Clean Temporary Files",
      "Boost Performance",
      "RAM Cleanup",
      "Startup Manager",
      "Network Boost",
      "View Telemetry",
      "Create Restore Point",
    ]);
  });

  it("every in-place action runs its own steps only", () => {
    for (const a of QUICK_ACTIONS.filter((x) => !navigatesAway(x))) {
      expect(a.steps.length).toBeGreaterThan(0);
    }
    const temp = QUICK_ACTIONS.find((a) => a.id === "temp")!;
    expect(temp.steps.some((s) => /standby/i.test(s.t))).toBe(false);
  });

  it("refuses to start a second run while one is running", () => {
    expect(canStartQuick(null)).toBe(true);
    expect(canStartQuick("temp")).toBe(false);
  });

  it("skips protected startup entries and reports zero real changes", () => {
    const r = quickResult(QUICK_ACTIONS.find((a) => a.id === "startup")!);
    expect(r.skipped).toBe(1);
    expect(r.completed).toBe(3);
    expect(r.realChanges).toBe(0);
    expect(r.status).toBe("Completed");
  });

  it("walks through steps in order as progress advances", () => {
    const ram = QUICK_ACTIONS.find((a) => a.id === "ram")!;
    expect(quickStepAt(ram, 0)).toBe(0);
    expect(quickStepAt(ram, 50)).toBe(1);
    expect(quickStepAt(ram, 100)).toBe(2);
  });
});
