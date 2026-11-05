// System Health Check — transparent, reproducible scoring (pure, no I/O).
//
// Inputs are SAMPLE readings (the browser cannot read hardware). Each metric maps to 0–100 with
// a fixed piecewise-linear curve; a category is the mean of its AVAILABLE metrics; the overall
// score is the weight-normalised mean of categories that have at least one reading.
// Missing readings are never treated as a perfect score: they are excluded, listed, and lower
// the coverage. Below MIN_COVERAGE the overall score is withheld instead of guessed.
//
// Utilization (load) and hardware health (temperature, drive health) are separate metric kinds:
// a high load lowers the score as "busy", never as "damaged".

export type MetricKind = "utilization" | "health" | "responsiveness";

export interface HealthMetric {
  key: string;
  label: string;
  kind: MetricKind;
  /** null = not available. */
  value: number | null;
  unit: string;
}

export interface HealthCategoryInput {
  key: string;
  label: string;
  weight: number;
  metrics: HealthMetric[];
}

/** Piecewise-linear curve: [x, score] points, clamped at both ends. */
type Curve = [number, number][];
export const CURVES: Record<string, Curve> = {
  "cpu-load": [[50, 100], [90, 60], [100, 40]],
  "cpu-temp": [[70, 100], [90, 50], [100, 30]],
  "mem-used": [[60, 100], [90, 50], [100, 30]],
  "mem-commit": [[60, 100], [90, 50], [100, 30]],
  "gpu-load": [[60, 100], [95, 60], [100, 50]],
  "gpu-temp": [[75, 100], [90, 50], [100, 30]],
  "disk-used": [[75, 100], [95, 40], [100, 20]],
  "disk-health": [[0, 0], [100, 100]],
  dpc: [[100, 100], [500, 50], [1000, 30]],
  "startup-heavy": [[0, 100], [5, 50], [10, 30]],
};

export function curveScore(curve: Curve, x: number): number {
  const first = curve[0]!;
  const last = curve[curve.length - 1]!;
  if (x <= first[0]) return first[1];
  if (x >= last[0]) return last[1];
  for (let i = 1; i < curve.length; i++) {
    const [x1, y1] = curve[i]!;
    const [x0, y0] = curve[i - 1]!;
    if (x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  return last[1];
}

export const MIN_COVERAGE = 0.6;

export interface MetricResult extends HealthMetric {
  score: number | null;
}
export interface CategoryResult {
  key: string;
  label: string;
  weight: number;
  score: number | null;
  metrics: MetricResult[];
  /** Some metrics in this category had no reading. */
  partial: boolean;
}
export interface Attention {
  category: string;
  metric: string;
  kind: MetricKind | "missing";
  text: string;
  /** Registry slug of a page that explains more (never runs anything). */
  page?: string;
}
export interface HealthResult {
  overall: number | null;
  status: "Good" | "Fair" | "Needs attention" | "Not enough data";
  /** Share of total weight that had at least one reading (0–1). */
  coverage: number;
  categories: CategoryResult[];
  attention: Attention[];
  missing: string[];
}

/** Same thresholds as the Overall Optimization Score: 85+ good, 70–84 fair. */
export function healthStatus(score: number | null): HealthResult["status"] {
  if (score === null) return "Not enough data";
  return score >= 85 ? "Good" : score >= 70 ? "Fair" : "Needs attention";
}

const ATTENTION_BELOW = 80;

const ADVICE: Record<string, { text: string; page?: string }> = {
  "cpu-load": {
    text: "CPU is busy. High load is normal during heavy work and is not a hardware fault.",
    page: "process-reduction",
  },
  "cpu-temp": {
    text: "CPU peak temperature is high. Check cooling and airflow; heat under load is not proof of damage.",
  },
  "mem-used": { text: "Memory is nearly full. Close unused apps.", page: "process-reduction" },
  "mem-commit": {
    text: "Commit charge is high — apps have reserved most memory. Review large apps or set a RAM limit.",
    page: "ai-optimization",
  },
  "gpu-load": { text: "GPU is busy. Normal while gaming or rendering." },
  "gpu-temp": { text: "GPU temperature is high. Check case airflow and fan curves." },
  "disk-used": { text: "Drive is getting full. Free space with Storage Optimizer.", page: "storage" },
  "disk-health": { text: "Drive health reports a problem. Back up your files." },
  dpc: { text: "Driver latency is high. A driver may be delaying the system." },
  "startup-heavy": {
    text: "Several high-impact apps start with Windows. Review them in Startup Manager.",
    page: "startup-manager",
  },
};

export function computeHealth(input: HealthCategoryInput[]): HealthResult {
  const totalWeight = input.reduce((a, c) => a + c.weight, 0) || 1;
  const attention: Attention[] = [];
  const missing: string[] = [];
  const categories: CategoryResult[] = input.map((c) => {
    const metrics: MetricResult[] = c.metrics.map((m) => {
      const curve = CURVES[m.key];
      const score = m.value === null || !curve ? null : Math.round(curveScore(curve, m.value));
      if (score === null) {
        missing.push(`${c.label} · ${m.label}`);
        attention.push({
          category: c.label,
          metric: m.label,
          kind: "missing",
          text: `${m.label} is not available — excluded from the score, not counted as healthy.`,
        });
      } else if (score < ATTENTION_BELOW) {
        const a = ADVICE[m.key];
        attention.push({
          category: c.label,
          metric: m.label,
          kind: m.kind,
          text: a?.text ?? `${m.label} is outside the healthy range.`,
          ...(a?.page ? { page: a.page } : {}),
        });
      }
      return { ...m, score };
    });
    const avail = metrics.filter((m) => m.score !== null);
    const score = avail.length
      ? Math.round(avail.reduce((a, m) => a + (m.score ?? 0), 0) / avail.length)
      : null;
    return {
      key: c.key,
      label: c.label,
      weight: c.weight,
      score,
      metrics,
      partial: avail.length < metrics.length,
    };
  });
  const scored = categories.filter((c) => c.score !== null);
  const coveredWeight = scored.reduce((a, c) => a + c.weight, 0);
  const coverage = coveredWeight / totalWeight;
  const overall =
    coverage >= MIN_COVERAGE && coveredWeight > 0
      ? Math.round(scored.reduce((a, c) => a + (c.score ?? 0) * c.weight, 0) / coveredWeight)
      : null;
  return { overall, status: healthStatus(overall), coverage, categories, attention, missing };
}

/** Sample readings for the prototype — consistent with the rest of the demo data. */
export const SAMPLE_HEALTH_INPUT: HealthCategoryInput[] = [
  {
    key: "cpu",
    label: "CPU",
    weight: 0.25,
    metrics: [
      { key: "cpu-load", label: "Utilization", kind: "utilization", value: 18, unit: "%" },
      { key: "cpu-temp", label: "Peak temperature", kind: "health", value: 84, unit: "°C" },
    ],
  },
  {
    key: "memory",
    label: "Memory",
    weight: 0.2,
    metrics: [
      { key: "mem-used", label: "In use", kind: "utilization", value: 38, unit: "%" },
      { key: "mem-commit", label: "Commit charge", kind: "utilization", value: 78, unit: "%" },
    ],
  },
  {
    key: "gpu",
    label: "GPU",
    weight: 0.15,
    metrics: [
      { key: "gpu-load", label: "Utilization", kind: "utilization", value: 14, unit: "%" },
      { key: "gpu-temp", label: "Temperature", kind: "health", value: 44, unit: "°C" },
    ],
  },
  {
    key: "storage",
    label: "Storage",
    weight: 0.2,
    metrics: [
      { key: "disk-used", label: "C: used", kind: "utilization", value: 46, unit: "%" },
      { key: "disk-health", label: "Drive health (SMART)", kind: "health", value: null, unit: "%" },
    ],
  },
  {
    key: "responsiveness",
    label: "Responsiveness",
    weight: 0.2,
    metrics: [
      { key: "dpc", label: "DPC latency", kind: "responsiveness", value: 22, unit: "µs" },
      {
        key: "startup-heavy",
        label: "High-impact startup apps",
        kind: "responsiveness",
        value: 3,
        unit: "",
      },
    ],
  },
];
