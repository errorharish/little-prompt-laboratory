// Dashboard — premium control centre. Hierarchy (user-directed, see MISSING_REFERENCES):
// 1. Overall Optimization Score · 2. Auto Optimize maintenance panel · 3. compact system
// overview · 4. system information strip · 5. quick actions. Optimization Status was removed.
// The full System Performance Telemetry chart lives on the System Telemetry page.
import { memo, useState, type CSSProperties } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  HardDrive,
  HeartPulse,
  Info,
  Loader2,
  MemoryStick,
  MonitorCog,
  Play,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trash2,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  Badge,
  Bar,
  Btn,
  Card,
  DemoBadge,
  KV,
  Label,
  Modal,
  PageHeader,
  SectionTitle,
  SimNotice,
  simulate,
  useSimRun,
} from "../kit";
import { OpProgress } from "../RunModal";
import {
  QUICK_ACTIONS,
  canStartQuick,
  navigatesAway,
  quickResult,
  quickStepAt,
  type QuickAction,
} from "@/lib/eo/quickActions";
import { CountUp, ScoreRing } from "../controls";
import { AutoOptimizePanel } from "../AutoOptimizePanel";
import { HW } from "@/lib/eo/data";
import { SCORE_CATEGORIES, overallScore, scoreStatus } from "@/lib/eo/score";
import { cn } from "@/lib/utils";

const TILES = [
  {
    icon: Cpu,
    label: "CPU",
    value: 18,
    l1: "AMD Ryzen 7 7800X3D",
    l2: "8C / 16T · 42°C",
    foot: "OPTIMAL",
  },
  {
    icon: MemoryStick,
    label: "RAM",
    value: 38,
    l1: "12.2 / 32.0 GB",
    l2: "DDR5-6000 CL30 · EXPO I",
    foot: "LOW LATENCY",
  },
  {
    icon: MonitorCog,
    label: "GPU",
    value: 14,
    l1: "RTX 4080 Super",
    l2: "1.4 / 16 GB VRAM · 44°C",
    foot: "IDLE / SILENT",
  },
  {
    icon: HardDrive,
    label: "STORAGE",
    value: 46,
    l1: "920 GB / 2 TB",
    l2: "Samsung 990 PRO · Gen4",
    foot: "HEALTH 100%",
  },
];

const SYS_INFO: [string, string][] = [
  ["Operating system", HW.os],
  ["Performance profile", "V3 Normal"],
  ["Timer resolution", "0.5 ms (locked)"],
  ["Power plan", "Balanced"],
  ["Restore point", "None created"],
];

export function DashboardPage() {
  return (
    <div className="space-y-3.5">
      <PageHeader
        title="Dashboard"
        badges={<Badge tone="cyan">V3</Badge>}
        sub="System overview, optimization score and automatic maintenance"
        actions={
          <Btn onClick={() => simulate("Refresh sample values")}>
            <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" /> Refresh
          </Btn>
        }
      />

      {/* 1 + 2: score (left) and Auto Optimize maintenance engine (right) */}
      <div
        className="eo-dash-hero grid gap-3"
        style={{ gridTemplateColumns: "minmax(272px, 312px) minmax(0, 1fr)" }}
      >
        <ScoreCard />
        <AutoOptimizePanel />
      </div>

      <SystemOverview />
      <SystemInfo />
      <QuickActions />
      <SimNotice />
    </div>
  );
}

/* ── 4. Important system information — one compact strip, sample values ── */
const SystemInfo = memo(function SystemInfo() {
  return (
    <section aria-labelledby="eo-sysinfo-title" className="eo-card eo-sysinfo px-4 py-2.5">
      <h2 id="eo-sysinfo-title" className="sr-only">
        System information
      </h2>
      <dl className="eo-sysinfo-list">
        {SYS_INFO.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <DemoBadge label="SAMPLE" />
    </section>
  );
});

/* ── 1. Overall Optimization Score (illustrative — no scoring engine exists in the source) ── */
const ScoreCard = memo(function ScoreCard() {
  const [open, setOpen] = useState(false);
  const score = overallScore(SCORE_CATEGORIES);
  const status = scoreStatus(score);
  const tone = status === "Excellent" ? "success" : status === "Good" ? "cyan" : "warning";
  return (
    <Card className="eo-hero eo-score-card flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <Label as="h2" className="text-foreground">
          OVERALL OPTIMIZATION SCORE
        </Label>
        <DemoBadge label="ILLUSTRATIVE" />
      </div>
      <div className="mt-2 flex justify-center">
        <ScoreRing
          value={score}
          label={`Overall optimization score ${score} out of 100, ${status}. Illustrative demo data.`}
        >
          <CountUp value={score} className="text-[40px] leading-none font-black" />
          <span className="mt-0.5 text-[10.5px] font-bold text-subtle">/ 100</span>
        </ScoreRing>
      </div>
      <div className="mt-1.5 flex justify-center">
        <Badge tone={tone} className="text-[10px]">
          {status}
        </Badge>
      </div>
      <ul className="mt-3 space-y-1.5" aria-label="Score categories">
        {SCORE_CATEGORIES.map((c, i) => (
          <li
            key={c.key}
            className="grid items-center gap-2 text-[11px]"
            style={{ gridTemplateColumns: "92px minmax(0,1fr) 26px" }}
          >
            <span className="truncate font-semibold text-muted-foreground">{c.label}</span>
            <span
              className="eo-score-bar"
              style={{ "--v": `${c.value}%`, "--i": i } as CSSProperties}
            />
            <span className="text-right font-bold tabular-nums">{c.value}</span>
          </li>
        ))}
      </ul>
      <Btn size="sm" variant="ghost" className="mt-3 w-full" onClick={() => setOpen(true)}>
        <Info aria-hidden="true" className="h-3.5 w-3.5" />
        What makes up this score
      </Btn>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Overall Optimization Score"
        sub="Illustrative demo data — not a measurement of this computer."
        footer={
          <Btn variant="primary" onClick={() => setOpen(false)}>
            Got it
          </Btn>
        }
      >
        <div className="space-y-3">
          <p className="text-[12.5px] text-muted-foreground">
            The score is a weighted average of four categories. The original project has no scoring
            engine, so each value stands for the sample readings below. Simulated runs never change
            it.
          </p>
          {SCORE_CATEGORIES.map((c) => (
            <div key={c.key} className="rounded-lg border border-border bg-window p-3">
              <div className="flex items-center justify-between text-[13px] font-bold">
                {c.label}
                <span className="tabular-nums">
                  {c.value}{" "}
                  <span className="text-[10.5px] text-subtle">
                    · weight {Math.round(c.weight * 100)}%
                  </span>
                </span>
              </div>
              <Bar value={c.value} className="mt-2" />
              <p className="mt-1.5 text-[11.5px] text-muted-foreground">{c.basis}</p>
            </div>
          ))}
          <KV k="Excellent" v="85 – 100" />
          <KV k="Good" v="70 – 84" />
          <KV k="Needs Attention" v="Below 70" />
        </div>
      </Modal>
    </Card>
  );
});

/* ── 3. Compact system overview (static sample values; live charts are on System Telemetry) ── */
const SystemOverview = memo(function SystemOverview() {
  return (
    <section aria-labelledby="eo-overview-title">
      <SectionTitle
        id="eo-overview-title"
        title="SYSTEM OVERVIEW"
        badge={<DemoBadge label="DEMO DATA" />}
        sub="Sample hardware readings — no hardware detection"
        right={
          <Link to="/$page" params={{ page: "system-info" }}>
            <Btn size="sm">
              Open System Telemetry
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Btn>
          </Link>
        }
      />
      <div className="eo-telemetry-tiles grid grid-cols-5 gap-2.5">
        {TILES.map((t) => (
          <div key={t.label} className="eo-card eo-stat px-3 py-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <t.icon aria-hidden="true" className="h-3.5 w-3.5 text-cyan" />
                <Label className="text-[9.5px]">{t.label}</Label>
              </span>
              <span className="text-[17px] font-bold tabular-nums">
                {t.value}
                <span className="text-[11px] text-muted-foreground">%</span>
              </span>
            </div>
            <div className="mt-1.5 truncate text-[12px] font-semibold">{t.l1}</div>
            <div className="truncate text-[10.5px] text-subtle">{t.l2}</div>
            <Bar value={t.value} className="mt-2" />
            <div className="mt-1.5 text-[9px] font-bold text-success">{t.foot}</div>
          </div>
        ))}
        <div className="eo-card eo-stat px-3 py-2.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <HeartPulse aria-hidden="true" className="h-3.5 w-3.5 text-success" />
              <Label className="text-[9.5px]">HEALTH</Label>
            </span>
            <span className="text-[17px] font-bold text-success tabular-nums">98.4</span>
          </div>
          <div className="mt-1.5 truncate text-[12px] font-semibold">Optimal responsiveness</div>
          <div className="truncate text-[10.5px] text-subtle">DPC &lt; 22 µs · Timer 0.5 ms</div>
          <Bar value={98.4} tone="success" className="mt-2" />
          <div className="mt-1.5 text-[9px] font-bold text-success">V3 PROFILE · SAMPLE</div>
        </div>
      </div>
    </section>
  );
});

/* ── 5. Quick actions — One-Click opens its page; every other action runs in place ── */
const QUICK_ICONS: Record<string, LucideIcon> = {
  "one-click": Sparkles,
  temp: Trash2,
  boost: Zap,
  ram: MemoryStick,
  startup: Rocket,
  network: Wifi,
  telemetry: Activity,
  restore: ShieldCheck,
};

const QuickActions = memo(function QuickActions() {
  const navigate = useNavigate();
  const sim = useSimRun(2600);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const runningId = sim.running ? activeId : null;
  const action = QUICK_ACTIONS.find((a) => a.id === activeId) ?? null;
  const progress = sim.progress ?? 0;
  const stepIdx = action && sim.running ? quickStepAt(action, progress) : -1;
  const phase = sim.running ? "running" : action && doneId === action.id ? "done" : "idle";

  const trigger = (a: QuickAction) => {
    if (navigatesAway(a)) {
      navigate({ to: "/$page", params: { page: a.to ?? "" } });
      return;
    }
    // Same action already running → just show its progress again.
    if (runningId === a.id) {
      setOpen(true);
      return;
    }
    if (!canStartQuick(runningId)) return;
    setActiveId(a.id);
    setDoneId(null);
    setOpen(true);
    sim.start(() => setDoneId(a.id));
  };

  const result = action && phase === "done" ? quickResult(action) : null;
  const ActionIcon = action ? (QUICK_ICONS[action.id] ?? Zap) : Zap;

  return (
    <section aria-labelledby="eo-quick-title">
      <SectionTitle
        id="eo-quick-title"
        title="QUICK ACTIONS"
        sub="Run a single optimization right here — One-Click opens its review page"
        right={<Badge tone="warning">SIMULATED</Badge>}
      />
      <div className="eo-quick-grid grid grid-cols-4 gap-2.5">
        {QUICK_ACTIONS.map((q) => {
          const Icon = QUICK_ICONS[q.id] ?? Zap;
          const away = navigatesAway(q);
          const isRunning = runningId === q.id;
          const blocked = runningId !== null && !isRunning && !away;
          const isDone = doneId === q.id && !sim.running;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => trigger(q)}
              aria-disabled={blocked || undefined}
              aria-describedby={blocked ? "eo-quick-busy" : undefined}
              data-state={isRunning ? "running" : isDone ? "done" : undefined}
              data-primary={away ? "true" : undefined}
              className="eo-quick"
            >
              <span className="flex items-start justify-between gap-2">
                <span className="eo-quick-icon" aria-hidden="true">
                  <Icon className="h-4 w-4" />
                </span>
                {away ? (
                  <ArrowUpRight aria-hidden="true" className="eo-quick-arrow h-4 w-4 text-cyan" />
                ) : isRunning ? (
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin text-cyan" />
                ) : isDone ? (
                  <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-success" />
                ) : (
                  <Play aria-hidden="true" className="eo-quick-arrow h-3.5 w-3.5 text-subtle" />
                )}
              </span>
              <Label className="mt-2 text-[9.5px] text-cyan">{q.cat}</Label>
              <span className="mt-0.5 block text-[13px] font-bold">{q.title}</span>
              <span className="mt-0.5 block flex-1 text-[11px] leading-snug text-muted-foreground">
                {q.desc}
              </span>
              <span className="eo-quick-foot">
                {isRunning ? (
                  <>
                    <span className="eo-quick-progress" aria-hidden="true">
                      <span style={{ width: `${progress}%` }} />
                    </span>
                    <span className="text-cyan tabular-nums">{Math.round(progress)}%</span>
                  </>
                ) : isDone ? (
                  <span className="text-success">Done · simulated</span>
                ) : away ? (
                  <span className="text-cyan">Review &amp; confirm</span>
                ) : (
                  <span>Run now</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      <p id="eo-quick-busy" className="sr-only">
        Another quick action is running. Wait for it to finish.
      </p>

      <Modal
        open={open && action !== null}
        onClose={() => setOpen(false)}
        title={action?.title ?? "Quick action"}
        sub={
          phase === "running"
            ? "Running on the Dashboard · simulated"
            : "Quick action finished · simulated, nothing on this PC changed"
        }
        width="max-w-md"
        icon={<ActionIcon className="h-4 w-4" />}
        tone={result?.status === "Failed" ? "danger" : result ? "success" : "cyan"}
        footer={
          phase === "running" ? (
            <Btn variant="ghost" onClick={() => setOpen(false)}>
              Keep running in background
            </Btn>
          ) : (
            <Btn variant="primary" onClick={() => setOpen(false)}>
              Done
            </Btn>
          )
        }
      >
        {action && (
          <div className="space-y-3">
            {phase === "running" && (
              <OpProgress
                value={progress}
                title={action.steps[stepIdx]?.t ?? action.title}
                detail={`Step ${stepIdx + 1} of ${action.steps.length}`}
                active
              />
            )}
            {result && (
              <div className="eo-quick-summary" role="status">
                <span>
                  <b className="text-success">{result.completed}</b> completed
                </span>
                <span>
                  <b className="text-warning">{result.skipped}</b> skipped
                </span>
                {result.failed > 0 && (
                  <span>
                    <b className="text-danger">{result.failed}</b> failed
                  </span>
                )}
                <span>
                  <b>0</b> changes on this PC
                </span>
              </div>
            )}
            <ol className="space-y-1.5" aria-label="Steps">
              {action.steps.map((st, i) => {
                const state =
                  phase === "done"
                    ? st.outcome
                    : i < stepIdx
                      ? "Completed"
                      : i === stepIdx
                        ? "Running"
                        : "Pending";
                return (
                  <li key={st.t} className="eo-quick-step" data-state={state}>
                    <span className="eo-quick-step-dot" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-semibold">{st.t}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {phase === "done" && st.reason ? st.reason : st.detail}
                      </span>
                    </span>
                    <span className="eo-quick-step-state">{state}</span>
                  </li>
                );
              })}
            </ol>
            <p className="text-[10.5px] text-subtle">Source: {action.source}</p>
          </div>
        )}
      </Modal>
    </section>
  );
});
