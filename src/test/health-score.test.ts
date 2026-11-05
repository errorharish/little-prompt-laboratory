import { describe, expect, it } from "vitest";
import {
  SAMPLE_HEALTH_INPUT,
  computeHealth,
  curveScore,
  CURVES,
  healthStatus,
  type HealthCategoryInput,
} from "@/lib/eo/health";

describe("System Health score", () => {
  it("scores the sample readings to 90 (Good), the same every time", () => {
    const a = computeHealth(SAMPLE_HEALTH_INPUT);
    const b = computeHealth(SAMPLE_HEALTH_INPUT);
    expect(a.overall).toBe(90);
    expect(a.status).toBe("Good");
    expect(b).toEqual(a);
  });

  it("uses the documented curves", () => {
    expect(curveScore(CURVES["cpu-load"]!, 50)).toBe(100);
    expect(curveScore(CURVES["cpu-load"]!, 90)).toBe(60);
    expect(curveScore(CURVES["cpu-temp"]!, 90)).toBe(50);
    expect(curveScore(CURVES["cpu-temp"]!, 84)).toBe(65);
  });

  it("never counts a missing reading as healthy", () => {
    const r = computeHealth(SAMPLE_HEALTH_INPUT);
    const storage = r.categories.find((c) => c.key === "storage")!;
    expect(storage.partial).toBe(true);
    expect(r.missing).toContain("Storage · Drive health (SMART)");
    expect(r.attention.some((x) => x.kind === "missing")).toBe(true);
  });

  it("excludes a category with no readings and lowers coverage", () => {
    const input: HealthCategoryInput[] = SAMPLE_HEALTH_INPUT.map((c) =>
      c.key === "gpu" ? { ...c, metrics: c.metrics.map((m) => ({ ...m, value: null })) } : c,
    );
    const r = computeHealth(input);
    expect(r.categories.find((c) => c.key === "gpu")!.score).toBeNull();
    expect(r.coverage).toBeCloseTo(0.85);
    expect(r.overall).not.toBeNull();
  });

  it("withholds the overall score when too little data is available", () => {
    const input = SAMPLE_HEALTH_INPUT.map((c) =>
      c.key === "cpu" ? c : { ...c, metrics: c.metrics.map((m) => ({ ...m, value: null })) },
    );
    const r = computeHealth(input);
    expect(r.overall).toBeNull();
    expect(r.status).toBe("Not enough data");
  });

  it("treats high CPU load as busy, not as a hardware problem", () => {
    const input = SAMPLE_HEALTH_INPUT.map((c) =>
      c.key === "cpu"
        ? {
            ...c,
            metrics: c.metrics.map((m) => (m.key === "cpu-load" ? { ...m, value: 97 } : m)),
          }
        : c,
    );
    const load = computeHealth(input).attention.find((a) => a.metric === "Utilization")!;
    expect(load.kind).toBe("utilization");
    expect(load.text).toMatch(/not a hardware fault/i);
  });

  it("uses the 85 / 70 thresholds", () => {
    expect(healthStatus(85)).toBe("Good");
    expect(healthStatus(84)).toBe("Fair");
    expect(healthStatus(69)).toBe("Needs attention");
  });
});
