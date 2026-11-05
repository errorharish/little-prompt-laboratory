import { describe, expect, it } from "vitest";
import {
  protectionAfter,
  rpCreated,
  rpNext,
  type RpDevice,
  type RpEvent,
  type RpPhase,
} from "@/lib/eo/restorePoint";

const on: RpDevice = { drive: "C:", protectionOn: true, outcome: "success" };
const off: RpDevice = { drive: "C:", protectionOn: false, outcome: "success" };

function walk(device: RpDevice, events: RpEvent[]): RpPhase[] {
  let p: RpPhase = "idle";
  let d = device;
  const seen: RpPhase[] = [];
  for (const e of events) {
    if (e === "done") d = { ...d, protectionOn: protectionAfter(p, d) };
    p = rpNext(p, e, d);
    seen.push(p);
  }
  return seen;
}

describe("Restore point workflow", () => {
  it("Scenario A: protection on → creates and verifies", () => {
    expect(walk(on, ["start", "done", "done", "done"])).toEqual([
      "checking",
      "creating",
      "verifying-point",
      "created",
    ]);
  });

  it("Scenario B: protection off shows the System Protection dialog, not a failure", () => {
    expect(walk(off, ["start", "done"]).at(-1)).toBe("protection-off");
  });

  it("Cancel from the dialog creates nothing and leaves protection off", () => {
    const phases = walk(off, ["start", "done", "cancel"]);
    expect(phases.at(-1)).toBe("cancelled");
    expect(phases.some(rpCreated)).toBe(false);
  });

  it("Enable needs an explicit confirmation step before anything changes", () => {
    expect(rpNext("protection-off", "enable", off)).toBe("confirm-enable");
    expect(rpNext("protection-off", "done", off)).toBe("protection-off");
    expect(protectionAfter("confirm-enable", off)).toBe(false);
    expect(rpNext("confirm-enable", "back", off)).toBe("protection-off");
  });

  it("creates the point only after protection is verified on", () => {
    const phases = walk(off, [
      "start",
      "done",
      "enable",
      "confirm",
      "done",
      "done",
      "done",
      "done",
    ]);
    expect(phases).toEqual([
      "checking",
      "protection-off",
      "confirm-enable",
      "enabling",
      "verifying-protection",
      "creating",
      "verifying-point",
      "created",
    ]);
  });

  it("a failed enable never reaches creation and offers retry", () => {
    const failing: RpDevice = { ...off, outcome: "enable-fails" };
    const phases = walk(failing, ["start", "done", "enable", "confirm", "done"]);
    expect(phases.at(-1)).toBe("enable-failed");
    expect(phases).not.toContain("creating");
    expect(rpNext("enable-failed", "retry", failing)).toBe("confirm-enable");
  });

  it("verification refuses to continue if protection is still off", () => {
    expect(rpNext("verifying-protection", "done", off)).toBe("enable-failed");
  });

  it("never reports success when Windows skips the point", () => {
    const skipped: RpDevice = { ...on, outcome: "creation-skipped" };
    const phases = walk(skipped, ["start", "done", "done", "done"]);
    expect(phases.at(-1)).toBe("create-failed");
    expect(phases.some(rpCreated)).toBe(false);
  });
});
