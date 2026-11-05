import { describe, expect, it } from "vitest";
import {
  NAV_SHORTCUTS,
  QUICK_OPTIMIZE,
  canStartQuick,
  quickResult,
  quickStepAt,
} from "@/lib/eo/quickActions";
import { PAGES } from "@/lib/eo/registry";

describe("Dashboard navigation shortcuts", () => {
  it("are exactly Telemetry, Startup, Boost Performance and One-Click", () => {
    expect(NAV_SHORTCUTS.map((n) => [n.title, n.to])).toEqual([
      ["View Telemetry", "system-info"],
      ["Startup Manager", "startup-manager"],
      ["Boost Performance", "max-performance"],
      ["One-Click Optimization", "one-click"],
    ]);
  });

  it("only point at pages that exist", () => {
    const slugs = new Set(PAGES.map((p) => p.slug));
    for (const n of NAV_SHORTCUTS) expect(slugs.has(n.to), n.to).toBe(true);
  });
});

describe("Dashboard quick optimize", () => {
  it("never mixes in a navigation shortcut", () => {
    const nav = new Set(NAV_SHORTCUTS.map((n) => n.title));
    for (const q of QUICK_OPTIMIZE) {
      expect(nav.has(q.title)).toBe(false);
      expect("to" in q).toBe(false);
    }
  });

  it("each action runs only its own steps", () => {
    for (const a of QUICK_OPTIMIZE.filter((x) => !x.flow)) {
      expect(a.steps.length, a.id).toBeGreaterThan(0);
    }
    const temp = QUICK_OPTIMIZE.find((a) => a.id === "temp")!;
    expect(temp.steps.some((s) => /standby|browser|shader/i.test(s.t))).toBe(false);
    const ram = QUICK_OPTIMIZE.find((a) => a.id === "ram")!;
    expect(ram.steps.some((s) => /temp/i.test(s.t))).toBe(false);
  });

  it("cache cleanup never cleans passwords, cookies, logins or history", () => {
    const cache = QUICK_OPTIMIZE.find((a) => a.id === "cache")!;
    const personal = cache.steps.find((s) => /passwords/i.test(s.t))!;
    expect(personal.outcome).toBe("Skipped");
  });

  it("restore point uses the System Protection workflow", () => {
    expect(QUICK_OPTIMIZE.find((a) => a.id === "restore")?.flow).toBe("restore-point");
  });

  it("refuses to start a second run while one is running", () => {
    expect(canStartQuick(null)).toBe(true);
    expect(canStartQuick("temp")).toBe(false);
  });

  it("reports skipped steps and zero real changes", () => {
    const r = quickResult(QUICK_OPTIMIZE.find((a) => a.id === "ram")!);
    expect(r.completed).toBe(2);
    expect(r.skipped).toBe(1);
    expect(r.realChanges).toBe(0);
  });

  it("walks through steps in order as progress advances", () => {
    const ram = QUICK_OPTIMIZE.find((a) => a.id === "ram")!;
    expect(quickStepAt(ram, 0)).toBe(0);
    expect(quickStepAt(ram, 50)).toBe(1);
    expect(quickStepAt(ram, 100)).toBe(2);
  });
});
