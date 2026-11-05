// V4: MaxPerformanceView, EmulatorOptimizationPage, MsiAppPlayerPage, V4DashboardView, V4OptimizationView,
//     EmulatorDebloaterView (deployer), LowEndSteamPage
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Cpu,
  Layers,
  Activity,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  CircleDashed,
  Gauge,
  Lock,
  MemoryStick,
  MonitorCog,
  RotateCcw,
  Zap,
} from "lucide-react";
import {
  Badge,
  Bar,
  Btn,
  Card,
  Check,
  Chips,
  Cols,
  EmptyState,
  Label,
  Modal,
  PageHeader,
  RiskBadge,
  SectionTitle,
  SimNotice,
  StatTiles,
  Toggle,
  Details,
  KV,
  simulate,
  useSimRun,
} from "../kit";
import { cn } from "@/lib/utils";
import { HW } from "@/lib/eo/data";

/* ───────── V4 MAXIMUM PERFORMANCE (cols=*,16,320) ─────────
 * Host workspace: configuration scope → status → action, with a status rail.
 * No live log: the rail shows engine state and the last simulated result instead. */
const MP_SCOPE = [
  { icon: Layers, t: "Background reduction", d: "Reduce unnecessary background CPU overhead." },
  {
    icon: Activity,
    t: "Priority balancing",
    d: "Balance foreground and background scheduling priority.",
  },
  { icon: MemoryStick, t: "Working-set refresh", d: "Release idle process working sets." },
  { icon: Gauge, t: "System optimizations", d: "Hardware-aware latency reduction for the host." },
];
const MP_SAFEGUARDS = [
  "Core Windows Safeguarded",
  "Drivers & Active Apps Shielded",
  "Reversible via Rollback",
];

export function V4MaxPerformancePage() {
  const [guide, setGuide] = useState(false);
  const [procs, setProcs] = useState(142);
  const [last, setLast] = useState<{ at: string; before: number; after: number } | null>(null);
  const r = useSimRun(3000);
  const [confirmRun, setConfirmRun] = useState(false);
  const run = () =>
    r.start(() => {
      setProcs(118);
      setLast({ at: new Date().toLocaleTimeString(), before: 142, after: 118 });
    });
  const pct = r.progress ?? 0;
  const stage = r.running ? Math.min(MP_SCOPE.length - 1, Math.floor(pct / 25)) : -1;
  return (
    <div className="space-y-4">
      <PageHeader
        title="Maximum Performance"
        badges={
          <>
            <Badge tone="cyan">V4 HOST ENGINE</Badge>
            <Badge tone="warning">SIMULATED</Badge>
          </>
        }
        sub="Simulated host scheduling, memory refresh and background reduction."
        actions={
          <Btn variant="ghost" onClick={() => setGuide(true)}>
            Guide
          </Btn>
        }
      />
      <div className="eo-v4-banner flex flex-wrap items-center gap-3" role="status">
        <span aria-hidden="true" className="eo-pulse-dot h-2 w-2 rounded-full bg-warning" />
        <div className="min-w-0 flex-1 text-[12px]">
          <span className="font-bold">Optimization service offline</span>
          <span className="text-muted-foreground">
            {" "}
            · showing sample metrics and simulated actions
          </span>
        </div>
        <Btn size="sm" onClick={() => simulate("Retry service")}>
          Retry service
        </Btn>
      </div>

      <StatTiles
        items={[
          { label: "BACKGROUND PROCESSES", value: procs, sub: "Sample" },
          { label: "SERVICE · SIMULATED", value: "Offline", tone: "warning" },
          { label: "CPU USAGE", value: "12%", sub: "Sample" },
          { label: "GPU USAGE", value: "9%", sub: "Sample" },
          { label: "RAM USAGE", value: "36%", sub: "Sample" },
        ]}
      />

      <div
        className="eo-engine-layout grid items-start gap-3.5"
        style={{ gridTemplateColumns: "minmax(0,1fr) 300px" }}
      >
        <div className="eo-stagger space-y-3.5">
          {/* Primary action workspace */}
          <Card className="eo-hero eo-v4-hero">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <Label className="text-cyan">ONE-CLICK SYSTEM OPTIMIZATION</Label>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black uppercase">Host latency workflow</h2>
                  <Badge tone="success">SAFE DEFAULTS</Badge>
                </div>
                <p className="mt-1 max-w-xl text-xs text-muted-foreground">
                  Simulates system optimizations, priority balancing, memory working-set refresh and
                  background reduction.
                </p>
              </div>
              <Btn
                variant="ghost"
                onClick={() => simulate("Rollback")}
                title="Restore system configuration to the pre-optimization state"
              >
                <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
                Rollback
              </Btn>
            </div>

            <ol aria-label="Workflow scope" className="mt-3.5 grid grid-cols-2 gap-2">
              {MP_SCOPE.map((s, i) => {
                const state = !r.running
                  ? last
                    ? "done"
                    : undefined
                  : i < stage
                    ? "done"
                    : i === stage
                      ? "active"
                      : undefined;
                return (
                  <li key={s.t} className="eo-v4-scope" data-state={state}>
                    <span className="eo-v4-scope-icon" aria-hidden="true">
                      {state === "done" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <s.icon className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-bold">{s.t}</div>
                      <div className="text-[11px] text-muted-foreground">{s.d}</div>
                    </div>
                    <span className="ml-auto text-[9.5px] font-bold">
                      {state === "active" ? (
                        <span className="text-cyan">RUNNING</span>
                      ) : state === "done" ? (
                        <span className="text-success">SIMULATED</span>
                      ) : (
                        <span className="text-subtle">READY</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>

            <ul aria-label="Protection" className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {MP_SAFEGUARDS.map((x) => (
                <li
                  key={x}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-success"
                >
                  <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  {x}
                </li>
              ))}
            </ul>

            <div className="mt-3.5 flex flex-wrap items-center gap-3 border-t border-border pt-3.5">
              <div className="min-w-0 flex-1" aria-live="polite">
                {r.running ? (
                  <>
                    <div className="mb-1 flex justify-between text-[10.5px] font-bold text-cyan">
                      <span>{MP_SCOPE[stage]?.t.toUpperCase()} · SIMULATED</span>
                      <span className="font-mono">{pct.toFixed(0)}%</span>
                    </div>
                    <Bar value={pct} active />
                  </>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    {last
                      ? `Last simulated run at ${last.at}. Nothing on this PC changed.`
                      : "Review the scope, then confirm a simulated run."}
                  </p>
                )}
              </div>
              <Btn
                variant="primary"
                size="lg"
                className="eo-v4-cta"
                disabled={r.running}
                onClick={() => setConfirmRun(true)}
              >
                <Zap aria-hidden="true" className="h-4 w-4" />
                {r.running ? `Optimizing… ${pct.toFixed(0)}%` : "Optimize now"}
              </Btn>
            </div>
          </Card>

          <SimNotice />
        </div>

        {/* Status rail */}
        <aside aria-label="Engine status" className="eo-stagger space-y-3">
          <Card className="eo-v4-rail">
            <Label as="h2" className="mb-2 text-foreground">
              ENGINE STATUS
            </Label>
            <KV k="Service" v={<span className="text-warning">Offline · simulated</span>} />
            <KV k="Profile" v="Maximum Performance" />
            <KV k="Last run" v={last ? last.at : "Not run"} />
          </Card>
          <Card className="eo-v4-rail">
            <Label as="h2" className="mb-2 text-foreground">
              HARDWARE PROFILE · SAMPLE
            </Label>
            <ul className="space-y-2 text-[12px]">
              {(
                [
                  [Cpu, HW.cpu, HW.cpuSub],
                  [MonitorCog, HW.gpu, HW.gpuSub],
                  [MemoryStick, HW.ram, HW.ramSub],
                ] as const
              ).map(([Icon, a, b]) => (
                <li key={a} className="flex gap-2">
                  <Icon aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan" />
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{a}</div>
                    <div className="truncate text-[10.5px] text-subtle">{b}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          {last ? (
            <Card className="eo-result">
              <Label as="h2" className="text-success">
                LAST SIMULATED RUN · {last.at}
              </Label>
              <div className="mt-2 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg border border-border bg-window p-2">
                  <div className="text-lg font-bold tabular-nums">
                    {last.before} → {last.after}
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground">
                    SAMPLE PROCESSES
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-window p-2">
                  <div className="text-lg font-bold tabular-nums">0</div>
                  <div className="text-[10px] font-bold text-muted-foreground">
                    CHANGES ON THIS PC
                  </div>
                </div>
              </div>
            </Card>
          ) : null}
        </aside>
      </div>

      <Modal
        open={confirmRun}
        onClose={() => setConfirmRun(false)}
        title="Review Maximum Performance"
        sub="Simulated run · No Windows settings will be changed."
        footer={
          <>
            <Btn variant="ghost" onClick={() => setConfirmRun(false)}>
              Cancel
            </Btn>
            <Btn
              variant="primary"
              onClick={() => {
                setConfirmRun(false);
                run();
              }}
            >
              Confirm simulated run
            </Btn>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Preview the background-workload, memory and scheduling workflow. Sample results do not
          establish actual performance gains or recovery guarantees.
        </p>
        <ul className="mt-3 space-y-1.5">
          {MP_SCOPE.map((s) => (
            <li
              key={s.t}
              className="flex items-center justify-between rounded-lg border border-border bg-window px-3 py-2 text-[12.5px]"
            >
              {s.t}
              <Badge tone="cyan">SIMULATED</Badge>
            </li>
          ))}
        </ul>
      </Modal>
      <Modal
        open={guide}
        onClose={() => setGuide(false)}
        title="Maximum Performance guide"
        sub="Beginner-friendly guide to safe, non-destructive Windows performance optimization."
        footer={
          <Btn variant="primary" onClick={() => setGuide(false)}>
            Got it
          </Btn>
        }
      >
        {[
          [
            "WHAT MAXIMUM PERFORMANCE OPTIMIZES",
            "Reduces background CPU contention, releases idle process working sets, and balances priorities.",
          ],
          [
            "WHAT REMAINS SAFEGUARDED (NEVER TOUCHED)",
            "Core Windows OS binaries, display drivers, audio engines, network controllers and your active apps.",
          ],
          [
            "REVERSIBILITY VIA LOCAL ROLLBACK JOURNAL",
            "Every applied modification is recorded in a transactional journal before execution.",
          ],
          [
            "BUILT FOR GAMING, EDITING, STREAMING & DAILY USE",
            "Designed for workload-specific review; no compatibility or performance tests run in this prototype.",
          ],
        ].map(([a, b]) => (
          <div key={a} className="mb-3">
            <Label className="text-cyan">{a}</Label>
            <p className="mt-1 text-xs text-muted-foreground">{b}</p>
          </div>
        ))}
      </Modal>
    </div>
  );
}

/* ───────── EMULATOR OPTIMIZATION SUITE (cols=*,14,320) ─────────
 * Guest workspace: connection → three-engine pipeline → session rail. No live log panel. */
const ENGINES = [
  {
    n: "EMULATOR OPTIMIZATION",
    sub: "Host MMCSS multimedia scheduling, DirectComposition presentation latency and process priority.",
    tags: [
      "SCOPE: MMCSS & DIRECT3D",
      "TARGET: HD-PLAYER.EXE",
      "SAFE CORE PROFILE",
      "OFFLINE READY",
    ],
    desc: "Safely tune MSI App Player for smoother Free Fire gameplay, better frame pacing and lower input delay.",
    pre: "Applies offline to host or in real-time when emulator is running.",
    needsAdb: false,
  },
  {
    n: "EMULATOR DEEP DEBLOATER",
    sub: "Safe guest package debloat, telemetry suppression & background broadcast cleanup.",
    tags: [
      "SHIELDED: BOOT, INPUT & GRAPHICS",
      "PLAY STORE & FREE FIRE PROTECTED",
      "PM / APPOPS METHOD",
      "AUTOMATIC MANIFEST ROLLBACK",
    ],
    desc: "Simulate a deep clean of unnecessary emulator apps, packages, and background services.",
    pre: "Prerequisite: MSI App Player running + Android Debug Bridge connected.",
    needsAdb: true,
  },
  {
    n: "ADVANCED EMULATOR OPTIMIZATION",
    sub: "SurfaceFlinger latch unsignaled, HWUI render threads, Dalvik heap compaction.",
    tags: [
      "SURFACEFLINGER LATCH",
      "HWUI RENDER THREADS",
      "DALVIK HEAP: 128M / 512M",
      "CALIBRATED OVERRIDES",
    ],
    desc: "Apply advanced, hardware-aware emulator tuning for improved rendering and memory behavior.",
    pre: "Prerequisite: MSI App Player running + Android Debug Bridge connected.",
    needsAdb: true,
  },
];
const GUIDE_SECTIONS = [
  ["1. Getting Started", "Architecture & sequence"],
  ["2. Maximum Performance", "Host Windows tuning suite"],
  ["3. Emulator Optimization", "Engine 1: MMCSS & 240Hz cap"],
  ["4. Deep Debloater", "Engine 2: Real ADB inventory"],
  ["5. Advanced Optimization", "Engine 3: SurfaceFlinger & Dalvik"],
  ["6. MSI & ADB Setup", "Port 5555 & authorization"],
  ["7. One-Time State", "Persistent store & idempotency"],
  ["8. Restore & Rollback", "Reversible operations & fixes"],
];
type EngineState = "NOT RUN" | "APPLYING" | "APPLIED" | "NEEDS ADB";

export function EmulatorOptimizationPage() {
  const engineTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(
    () => () => {
      if (engineTimer.current) clearInterval(engineTimer.current);
    },
    [],
  );
  const [pendingEngine, setPendingEngine] = useState<number | null>(null);
  const [adb, setAdb] = useState(false);
  const [applied, setApplied] = useState<Set<number>>(new Set());
  const [guide, setGuide] = useState(false);
  const [gs, setGs] = useState(0);
  const [running, setRunning] = useState<number | null>(null);
  const [p, setP] = useState(0);
  const runEngine = (i: number) => {
    setRunning(i);
    setP(0);
    let v = 0;
    const id = setInterval(() => {
      v += 4;
      setP(v);
      if (v >= 100) {
        clearInterval(id);
        engineTimer.current = null;
        setRunning(null);
        setApplied((s) => new Set(s).add(i));
        simulate(`${ENGINES[i]?.n} applied`);
      }
    }, 70);
    engineTimer.current = id;
  };
  const restore = (i: number) => {
    setApplied((s) => {
      const n = new Set(s);
      n.delete(i);
      return n;
    });
    simulate(`${ENGINES[i]?.n} restored`);
  };
  const recheck = () => {
    setAdb(!adb);
    simulate(adb ? "ADB disconnected" : "Sample connection enabled");
  };
  const stateOf = (i: number): EngineState =>
    running === i
      ? "APPLYING"
      : applied.has(i)
        ? "APPLIED"
        : ENGINES[i]?.needsAdb && !adb
          ? "NEEDS ADB"
          : "NOT RUN";
  const counts = ENGINES.reduce(
    (c, _, i) => {
      const s = stateOf(i);
      if (s === "APPLIED") c.applied += 1;
      else if (s === "NEEDS ADB") c.blocked += 1;
      else c.ready += 1;
      return c;
    },
    { applied: 0, ready: 0, blocked: 0 },
  );
  const connection = [
    { k: "MSI App Player", v: adb ? "Running" : "Not running", ok: adb },
    { k: "Android Debug Bridge", v: adb ? "Connected" : "Offline", ok: adb },
    { k: "Guest subsystem", v: adb ? "Android 9 · x86_64" : "—", ok: adb },
  ];
  const sequence: { t: string; done: boolean; to?: string }[] = [
    { t: "Host Maximum Performance", done: false, to: "v4-max-performance" },
    { t: "Launch MSI App Player 5 & verify ADB", done: adb },
    ...ENGINES.map((e, i) => ({
      t: `Engine ${i + 1} · ${e.n.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}`,
      done: applied.has(i),
    })),
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Emulator Optimization Suite"
        badges={
          <>
            <Badge tone="cyan">V4 COMMERCIAL ENGINE</Badge>
            <Badge tone="warning">SIMULATED</Badge>
          </>
        }
        sub="Simulated host scheduling, guest debloat and graphics tuning for MSI App Player 5."
        actions={
          <>
            <Btn variant="ghost" onClick={() => setGuide(true)}>
              Guide
            </Btn>
            <Btn
              variant="ghost"
              disabled={!applied.size}
              onClick={() => {
                setApplied(new Set());
                simulate("Restore all engines");
              }}
            >
              Restore all
            </Btn>
            <Btn onClick={recheck}>Recheck connection</Btn>
          </>
        }
      />

      {/* Connection strip */}
      <Card
        className="eo-v4-conn grid items-center gap-3 py-3"
        style={{ gridTemplateColumns: "repeat(3, minmax(0,1fr)) auto" }}
      >
        {connection.map((c) => (
          <div key={c.k} className="flex items-center gap-2.5">
            <span aria-hidden="true" className="eo-v4-dot" data-ok={c.ok ? "true" : undefined} />
            <div className="min-w-0">
              <Label className="text-[10px]">{c.k}</Label>
              <div
                className={cn(
                  "truncate text-[12.5px] font-bold",
                  c.ok ? "text-success" : "text-warning",
                )}
              >
                {c.v}
              </div>
            </div>
          </div>
        ))}
        <Link
          to="/$page"
          params={{ page: "emulator-modules" }}
          className="eo-v4-hub inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[10.5px] font-bold uppercase text-muted-foreground"
        >
          <Boxes aria-hidden="true" className="h-3.5 w-3.5" />
          Module hub
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      </Card>

      <div
        className="eo-engine-layout grid items-start gap-3.5"
        style={{ gridTemplateColumns: "minmax(0,1fr) 320px" }}
      >
        <ol aria-label="Engine pipeline" className="eo-pipeline eo-stagger space-y-3">
          {ENGINES.map((e, i) => {
            const st = stateOf(i);
            const blocked = st === "NEEDS ADB";
            return (
              <li key={e.n} className="eo-pipeline-step" data-state={st}>
                <span className="eo-pipeline-node" aria-hidden="true">
                  {st === "APPLIED" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : blocked ? (
                    <Lock className="h-3.5 w-3.5" />
                  ) : (
                    i + 1
                  )}
                </span>
                <Card className={cn("eo-v4-engine", running === i && "eo-glow")}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="cyan">ENGINE {i + 1}</Badge>
                        <h2 className="text-[14.5px] font-bold">{e.n}</h2>
                      </div>
                      <p className="mt-1 text-[12px] text-muted-foreground">{e.desc}</p>
                    </div>
                    <Badge
                      tone={
                        st === "APPLIED"
                          ? "success"
                          : st === "APPLYING"
                            ? "cyan"
                            : blocked
                              ? "warning"
                              : "muted"
                      }
                    >
                      {st === "APPLIED" ? "APPLIED · SIMULATED" : st}
                    </Badge>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {e.tags.slice(0, 2).map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                  {i === 2 && (
                    <p className="mt-2.5 rounded-md border border-warning/30 bg-warning/5 p-2 text-[11px] text-warning">
                      SurfaceFlinger latch overrides bypass buffer fence synchronization for lower
                      latency. Calibrated per hardware tier.
                    </p>
                  )}
                  {running === i && (
                    <div className="mt-3" aria-live="polite">
                      <div className="mb-1 flex justify-between text-[10.5px] font-bold text-cyan">
                        <span>APPLYING · SIMULATED</span>
                        <span className="font-mono">{p}%</span>
                      </div>
                      <Bar value={p} active />
                    </div>
                  )}
                  <div className="mt-3">
                    <Details title="ENGINE TECHNICAL DETAILS">
                      <p className="text-xs text-muted-foreground">{e.sub}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {e.tags.map((t) => (
                          <Badge key={t}>{t}</Badge>
                        ))}
                      </div>
                    </Details>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                    <span className={cn("text-[11px]", blocked ? "text-warning" : "text-subtle")}>
                      {e.pre}
                    </span>
                    <div className="flex gap-2">
                      <Btn
                        size="sm"
                        variant="ghost"
                        disabled={!applied.has(i) || running === i}
                        onClick={() => restore(i)}
                      >
                        Restore
                      </Btn>
                      <Btn
                        size="sm"
                        variant="primary"
                        disabled={blocked || running !== null}
                        onClick={() => setPendingEngine(i)}
                      >
                        {i === 1 ? "Scan & debloat" : "Apply"}
                      </Btn>
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ol>

        {/* Session rail */}
        <aside aria-label="Session overview" className="eo-stagger space-y-3">
          <Card className="eo-v4-rail">
            <Label as="h2" className="mb-2 text-foreground">
              SESSION OVERVIEW
            </Label>
            <div className="grid grid-cols-3 gap-2 text-center">
              {(
                [
                  ["APPLIED", counts.applied, "text-success"],
                  ["READY", counts.ready, "text-cyan"],
                  ["NEEDS ADB", counts.blocked, "text-warning"],
                ] as const
              ).map(([k, v, c]) => (
                <div key={k} className="rounded-lg border border-border bg-window py-2">
                  <div className={cn("text-lg font-bold tabular-nums", c)}>{v}</div>
                  <div className="text-[10px] font-bold text-muted-foreground">{k}</div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10.5px] text-subtle">
              Engine states are simulated for this session only.
            </p>
          </Card>
          <Card className="eo-v4-rail">
            <Label as="h2" className="mb-2 text-foreground">
              PREREQUISITES
            </Label>
            <ul className="space-y-1.5 text-[12px]">
              {[
                ["MSI App Player running", adb],
                ["Android Debug Bridge connected", adb],
              ].map(([t, ok]) => (
                <li key={t as string} className="flex items-center gap-2">
                  {ok ? (
                    <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <CircleDashed aria-hidden="true" className="h-3.5 w-3.5 text-warning" />
                  )}
                  <span className={ok ? "" : "text-muted-foreground"}>{t}</span>
                  <span className="sr-only">{ok ? "(met)" : "(not met)"}</span>
                </li>
              ))}
            </ul>
            <Btn size="sm" className="mt-3 w-full" onClick={recheck}>
              Recheck connection
            </Btn>
          </Card>
          <Card className="eo-v4-rail">
            <Label as="h2" className="mb-2 text-foreground">
              RECOMMENDED SEQUENCE
            </Label>
            <ol className="eo-v4-seq space-y-1.5 text-[11.5px]">
              {sequence.map((s, i) => (
                <li key={s.t} data-done={s.done ? "true" : undefined}>
                  <span aria-hidden="true">{s.done ? "✓" : i + 1}</span>
                  {s.to ? (
                    <Link to="/$page" params={{ page: s.to }} className="hover:text-cyan">
                      {s.t}
                    </Link>
                  ) : (
                    <span>{s.t}</span>
                  )}
                </li>
              ))}
            </ol>
          </Card>
          <SimNotice>
            No emulator, ADB connection or Android guest is touched — connection state is a toggle
            for demonstration.
          </SimNotice>
        </aside>
      </div>

      <Modal
        open={pendingEngine !== null}
        onClose={() => setPendingEngine(null)}
        title={
          pendingEngine !== null ? (ENGINES[pendingEngine]?.n ?? "Engine review") : "Engine review"
        }
        sub="Simulated engine · No emulator settings or packages will be changed."
        footer={
          <>
            <Btn variant="ghost" onClick={() => setPendingEngine(null)}>
              Cancel
            </Btn>
            <Btn
              variant="primary"
              onClick={() => {
                if (pendingEngine !== null) runEngine(pendingEngine);
                setPendingEngine(null);
              }}
            >
              Confirm simulated run
            </Btn>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Review the engine scope and prerequisites before continuing. Verification and restore
          outcomes are illustrative.
        </p>
        {pendingEngine !== null && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {ENGINES[pendingEngine]?.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        )}
      </Modal>
      <Modal
        open={guide}
        onClose={() => setGuide(false)}
        title="Error Optimizer V4 — Architecture & optimization guide"
        sub="Technical reference for host & guest optimization engines"
        width="max-w-5xl"
        footer={
          <>
            <Btn variant="ghost" disabled={gs === 0} onClick={() => setGs(gs - 1)}>
              Previous section
            </Btn>
            <Btn variant="ghost" disabled={gs === 7} onClick={() => setGs(gs + 1)}>
              Next section
            </Btn>
            <Btn variant="primary" onClick={() => setGuide(false)}>
              Close guide
            </Btn>
          </>
        }
      >
        <div className="grid gap-5" style={{ gridTemplateColumns: "240px 1fr" }}>
          <div className="space-y-1">
            <Label className="mb-2">GUIDE SECTIONS</Label>
            {GUIDE_SECTIONS.map(([t, s], i) => (
              <button
                key={t}
                onClick={() => setGs(i)}
                className={cn(
                  "block w-full rounded-lg border-l-[3px] px-3 py-2 text-left",
                  gs === i ? "border-cyan bg-cyan/10" : "border-transparent hover:bg-elevated",
                )}
              >
                <div className="text-[12.5px] font-semibold">{t}</div>
                <div className="text-[10.5px] text-subtle">{s}</div>
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-border bg-window p-5">
            <div className="text-lg font-bold">{GUIDE_SECTIONS[gs]?.[0]}</div>
            <p className="mt-2 text-sm text-muted-foreground">
              {
                [
                  "Recommended sequence: 1) Host Maximum Performance, 2) Launch MSI App Player 5 & verify ADB, 3) Engine 1, 4) Engine 2, 5) Engine 3.",
                  "Transforms the Windows host: MMCSS scheduling, 0.5 ms timer clamp, safe process intelligence with zero arbitrary killing, accurate process counting.",
                  "Host process elevation (HD-Player.exe), frame-rate unlock and pre-launch vs live modes.",
                  "Authentic guest discovery via ADB, ironclad essential component protection, safe disabling instead of deleting APKs.",
                  "Latch-unsignaled rendering, HWUI render pipeline tuning and Dalvik heap compaction. Never edits emulator config files.",
                  "Open MSI App Player Settings → Preferences → toggle Android Debug Bridge ON → authorize the USB debugging prompt.",
                  "One-time optimization with preflight idempotency verification; card states NOT RUN / APPLIED / VERIFIED.",
                  "Unified rollback from the header, per-engine restore and diagnostic troubleshooting.",
                ][gs]
              }
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ───────── MSI APP PLAYER 5 MODULE HUB (MsiAppPlayerPage) ───────── */
const MODULES = [
  {
    k: "EMULATOR OPTIMIZATION",
    n: "Emulator Optimization",
    tag: "SUPPORTED",
    sub: "Hardware-aware performance tuning & scheduling",
    suit: "Universal (All PCs · Balanced & Performance)",
    list: [
      "Windows MMCSS multimedia gaming scheduler",
      "Guest process CPU priority & affinity balance",
      "Direct3D 11 / Vulkan render pipeline synchronization",
      "Reversible configuration discovery with full rollback",
    ],
    foot: "Zero binary patches · No anti-cheat circumvention · Protected configs",
  },
  {
    k: "DEEP DEBLOATER",
    n: "Emulator Deep Debloater",
    tag: "CLEANUP",
    sub: "Package, telemetry & background bloat cleanup",
    suit: "Recommended for all systems needing disk & RAM relief",
    list: [
      "Scans packages, background services & temporary caches",
      "Distinguishes safe findings from system-essential services",
      "Disables analytics, promotional services & ad components",
      "One-click restore reverses all disabled packages safely",
    ],
    foot: "Read-only protection for emulator config files · No destructive deletion",
  },
  {
    k: "LOW-END EXTREME",
    n: "Low-End Extreme",
    tag: "ENTRY-LEVEL",
    sub: "Low-spec resource relief & memory compaction",
    suit: "Dual/Quad-Core CPUs · 4–8 GB RAM · Integrated GPUs",
    list: [
      "SurfaceFlinger latch: latches buffers immediately",
      "Dalvik heap growth limit: relieves guest memory pressure",
      "Trims non-essential background guest threads and memory",
      "Reversible guest-level properties with instant undo",
    ],
    foot: "Hardware-aware estimates · No guaranteed FPS claims · Unprivileged & safe",
  },
];
export function EmulatorModulesPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [mod, setMod] = useState<string | null>(null);
  const [profile, setProfile] = useState("BALANCED PROFILE");
  const [scanned, setScanned] = useState(false);
  const [risky, setRisky] = useState(false);
  const [review, setReview] = useState(false);
  const [bench, setBench] = useState(false);
  const [guide, setGuide] = useState(false);
  const scan = useSimRun(2000);
  if (!mod)
    return (
      <div className="space-y-4">
        <PageHeader
          title="Emulator Optimization"
          sub="Simulated MSI App Player 5 tuning, component cleanup and low-spec profiles."
          actions={
            <Btn variant="ghost" onClick={() => setGuide(true)}>
              Guide
            </Btn>
          }
        />
        <Card className="flex items-center gap-3 py-3">
          <Badge tone="cyan">MSI APP PLAYER 5</Badge>
          <span className="text-xs text-muted-foreground">
            Select a module below to inspect findings, customize settings, and apply changes.
          </span>
        </Card>
        <div className="grid grid-cols-3 gap-3">
          {MODULES.map((m, i) => (
            <Card key={m.k} className="flex flex-col">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-cyan">
                  <Layers className="h-4 w-4" />
                  MODULE 0{i + 1}
                </Label>
                <Badge tone="success">{m.tag}</Badge>
              </div>
              <h2 className="mt-2 text-lg font-bold">{m.n}</h2>
              <p className="text-xs text-muted-foreground">{m.sub}</p>
              <div className="mt-3 text-[11.5px]">
                <span className="text-subtle">Suitability:</span> {m.suit}
              </div>
              <Label className="mt-4 mb-1.5">
                {i === 1 ? "WHAT THIS MODULE CLEANS:" : "WHAT THIS MODULE TUNES:"}
              </Label>
              <ul className="flex-1 space-y-1 text-[12px] text-muted-foreground">
                {m.list.map((l) => (
                  <li key={l}>• {l}</li>
                ))}
              </ul>
              <p className="mt-3 text-[10.5px] text-success">{m.foot}</p>
              <Btn variant="primary" className="mt-4 w-full" onClick={() => setMod(m.k)}>
                Open {m.n}
              </Btn>
            </Card>
          ))}
        </div>
        <Card className="flex items-center justify-between py-3">
          <span className="text-xs text-success">
            SIMULATED MODULES · Recovery depends on operation support; emulator configuration files
            are not touched.
          </span>
          <span className="text-[10px] font-bold tracking-widest text-subtle">
            ERROR OPTIMIZER V4 · EMULATOR SUITE
          </span>
        </Card>
        <SimNotice />
        <Modal
          open={guide}
          onClose={() => setGuide(false)}
          title="Emulator optimization guide"
          sub="How ERROR OPTIMIZER accelerates MSI App Player 5 safely"
          footer={
            <Btn variant="primary" onClick={() => setGuide(false)}>
              Got it
            </Btn>
          }
        >
          {[
            [
              "1. THREE DEDICATED MODULES",
              "Emulator Optimization for balanced daily tuning, Deep Debloater for cleanup, Low-End Extreme for weak hardware.",
            ],
            ["2. REVIEW BEFORE APPLYING", "Click 'Review Changes' to see every planned change."],
            [
              "3. APPLY SAFELY",
              "Click 'Apply Optimizations' to execute the profile; core config files stay untouched.",
            ],
            ["4. REVERSIBILITY & ROLLBACK", "Every applied change can be rolled back at any time."],
          ].map(([a, b]) => (
            <div key={a} className="mb-3">
              <Label className="text-cyan">{a}</Label>
              <p className="text-xs text-muted-foreground">{b}</p>
            </div>
          ))}
        </Modal>
      </div>
    );
  return (
    <div className="space-y-4 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Btn variant="ghost" onClick={() => setMod(null)}>
          ← Back to overview
        </Btn>
        <Chips options={MODULES.map((m) => m.k)} value={mod} onChange={setMod} />
        <Btn size="sm" onClick={() => simulate("Rescan")}>
          Rescan
        </Btn>
      </div>
      <Card className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Badge tone="cyan">MSI APP PLAYER 5</Badge>
          <span className="text-xs text-muted-foreground">
            Tuning applies supported Win32 MMCSS multimedia scheduling and thread priority.
          </span>
        </div>
        <span className="text-[11.5px]">
          ADB: <b className="text-warning">Offline (simulated)</b>
        </span>
      </Card>
      {mod === "EMULATOR OPTIMIZATION" && (
        <>
          <div className="flex justify-end gap-2">
            <Btn size="sm" onClick={() => setProfile("BALANCED PROFILE")}>
              Use recommended
            </Btn>
            <Btn size="sm" onClick={() => setReview(true)}>
              Review changes
            </Btn>
          </div>
          <Cols cols="1fr 1fr">
            {[
              [
                "BALANCED PROFILE",
                "Universal configuration for everyday smooth gaming",
                "A conservative, stable starting point focused on compatibility and consistent frame pacing.",
                "Universal (All PCs, 4GB+ RAM)",
              ],
              [
                "PERFORMANCE PROFILE",
                "Maximum responsiveness for capable gaming PCs",
                "Aggressive MMCSS priority scheduling and dedicated core affinity.",
                "Mid to High-End (8GB+ RAM, Dedicated GPU)",
              ],
            ].map(([n, a, b, t]) => (
              <button
                key={n}
                onClick={() => setProfile(n ?? "")}
                className={cn(
                  "eo-card p-5 text-left transition-all",
                  profile === n && "border-cyan/60 eo-glow",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="eo-label text-foreground">{n}</span>
                  <span className="flex gap-1.5">
                    {n === "BALANCED PROFILE" && <Badge tone="cyan">★ RECOMMENDED</Badge>}
                    <RiskBadge risk="LOW" />
                  </span>
                </div>
                <div className="mt-2 text-sm font-bold">{a}</div>
                <p className="mt-1 text-xs text-muted-foreground">{b}</p>
                <div className="mt-3 flex justify-between text-[11px]">
                  <span className="text-subtle">Target: {t}</span>
                  <span className="text-cyan">View details →</span>
                </div>
              </button>
            ))}
          </Cols>
          <Cols cols="1fr 1fr">
            <Card>
              <div className="mb-3 flex items-center justify-between">
                <Label className="text-foreground">PERFORMANCE ASSESSMENT</Label>
                <Badge tone="warning">MODEL ESTIMATE — NOT A BENCHMARK</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[12.5px]">
                {[
                  ["HARDWARE TIER", "High-end"],
                  ["SUITABILITY", "Optimal for Balanced & Performance"],
                  ["CONFIDENCE", "Sample value"],
                  ["RECOMMENDED PROFILE", "Balanced"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <Label className="text-[10px]">{k}</Label>
                    <div className="font-semibold">{v}</div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-subtle">
                Hardware assessment is an offline diagnostic calculation.
              </p>
              <Btn size="sm" className="mt-3" onClick={() => setBench(true)}>
                High-FPS runtime test
              </Btn>
            </Card>
            <Card>
              <Label className="mb-2 text-foreground">PLANNED OPTIMIZATIONS FOR PROFILE</Label>
              <div className="space-y-1.5">
                {[
                  "MMCSS Games task priority",
                  "HD-Player process priority",
                  "Core affinity balance",
                  "Presentation latency",
                ].map((x) => (
                  <div
                    key={x}
                    className="rounded-md border border-border bg-window px-3 py-2 text-[12px]"
                  >
                    {x}
                  </div>
                ))}
              </div>
            </Card>
          </Cols>
          <StatTiles
            items={[
              { label: "SCANNED", value: 12 },
              { label: "SAFE ITEMS", value: 9, tone: "success" },
              { label: "APPLIED", value: 0 },
              { label: "ROLLED BACK", value: 0 },
              { label: "HEALTH STATUS", value: "HEALTHY", sub: "(Sample)", tone: "success" },
            ]}
          />
        </>
      )}
      {mod === "DEEP DEBLOATER" && (
        <Card>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <Btn variant="primary" onClick={() => scan.start(() => setScanned(true))}>
              Scan emulator
            </Btn>
            <div className="flex gap-1.5">
              <Btn
                size="sm"
                onClick={() =>
                  setSelected(
                    new Set([
                      "Promotional app center",
                      "Analytics broadcast receiver",
                      "Ad SDK service",
                    ]),
                  )
                }
              >
                Select all safe
              </Btn>
              <Btn
                size="sm"
                onClick={() =>
                  setSelected(new Set(["Promotional app center", "Analytics broadcast receiver"]))
                }
              >
                Select recommended
              </Btn>
              <Btn size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
                Clear selection
              </Btn>
            </div>
          </div>
          <p className="mb-3 text-[11px] text-success">
            100% Read-Only Protected Configs · Reversible package disabling
          </p>
          {scan.running && (
            <>
              <Bar value={scan.progress ?? 0} />
              <p className="mt-1 text-[11px] text-cyan">Scanning full emulator stack…</p>
            </>
          )}
          {!scanned && !scan.running && (
            <EmptyState
              title="NO EMULATOR COMPONENTS SCANNED YET"
              sub="Click 'Scan Emulator' to inspect installed packages, services, caches and telemetry."
              action={
                <Btn onClick={() => scan.start(() => setScanned(true))}>
                  Scan emulator components
                </Btn>
              }
            />
          )}
          {scanned && (
            <div className="space-y-1.5">
              {[
                ["Promotional app center", "SAFE"],
                ["Analytics broadcast receiver", "SAFE"],
                ["Ad SDK service", "SAFE"],
                ["Google Play Store", "PROTECTED"],
                ["Free Fire", "PROTECTED"],
                ["Input method service", "PROTECTED"],
              ].map(([n, r]) => (
                <div
                  key={n}
                  className="flex items-center gap-3 rounded-lg border border-border bg-window px-3 py-2.5 text-[12.5px]"
                >
                  {r !== "PROTECTED" ? (
                    <Check
                      label={`Select ${n}`}
                      on={selected.has(n ?? "")}
                      onChange={(v) =>
                        setSelected((current) => {
                          const next = new Set(current);
                          if (v) next.add(n ?? "");
                          else next.delete(n ?? "");
                          return next;
                        })
                      }
                    />
                  ) : (
                    <span className="w-4" />
                  )}
                  <span className="flex-1">{n}</span>
                  <RiskBadge risk={r as "SAFE"} />
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
      {mod === "LOW-END EXTREME" && (
        <>
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <Label className="text-foreground">LOW-END EXTREME HARDWARE TARGETING</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Calibrated for Dual-Core / Quad-Core CPUs, Intel HD/UHD integrated graphics and
                  4–8 GB RAM.
                </p>
              </div>
              <Badge tone="success">UNPRIVILEGED (SAFE)</Badge>
            </div>
          </Card>
          <Cols cols="1fr 1fr">
            <Card>
              <Label className="text-cyan">SURFACEFLINGER LATCH TWEAK</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Instructs the Android compositor to latch graphics buffers immediately without
                waiting for fences.
              </p>
            </Card>
            <Card>
              <Label className="text-cyan">DALVIK HEAP COMPACTION</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Tightens Android heap boundaries and triggers active page trimming to relieve memory
                pressure.
              </p>
            </Card>
          </Cols>
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <Btn onClick={() => scan.start(() => setScanned(true))}>Scan candidates</Btn>
              <label className="flex items-center gap-2 text-xs">
                <Toggle on={risky} onChange={setRisky} />
                Allow Advanced Risky Tweaks (Disabled by default)
              </label>
            </div>
            {scan.running && <Bar value={scan.progress ?? 0} />}
            <div className="space-y-1.5">
              {[
                ["Compositor buffer timing", "LOW"],
                ["Guest memory growth limit", "LOW"],
                ["Background guest thread trim", "LOW"],
                ["Aggressive HWUI render override", "HIGH"],
              ]
                .filter((x) => risky || x[1] !== "HIGH")
                .map(([n, r]) => (
                  <div
                    key={n}
                    className="flex items-center gap-3 rounded-lg border border-border bg-window px-3 py-2.5 font-mono text-[12px]"
                  >
                    <Check
                      label={`Select ${n}`}
                      on={selected.has(n ?? "")}
                      onChange={(v) =>
                        setSelected((current) => {
                          const next = new Set(current);
                          if (v) next.add(n ?? "");
                          else next.delete(n ?? "");
                          return next;
                        })
                      }
                    />
                    <span className="flex-1">{n}</span>
                    <RiskBadge risk={r as "LOW"} />
                  </div>
                ))}
            </div>
          </Card>
        </>
      )}
      <div className="sticky bottom-0 flex items-center justify-between border-t border-border">
        <span className="text-xs text-muted-foreground">
          Active Module: <b className="text-foreground">{mod}</b> · Ready to optimize emulator
        </span>
        <div className="flex gap-2">
          {mod === "EMULATOR OPTIMIZATION" ? (
            <>
              <Btn onClick={() => setReview(true)}>Review changes</Btn>
              <Btn variant="primary" onClick={() => simulate("Apply optimizations")}>
                Apply optimizations
              </Btn>
              <Btn variant="ghost" onClick={() => simulate("Rollback")}>
                Rollback
              </Btn>
            </>
          ) : mod === "DEEP DEBLOATER" ? (
            <>
              <Btn
                variant="primary"
                disabled={!scanned || !selected.size}
                onClick={() => simulate(`Apply ${selected.size} selected sample debloat items`)}
              >
                Apply selected debloat
              </Btn>
              <Btn variant="ghost" onClick={() => simulate("Restore debloat")}>
                Restore debloat
              </Btn>
            </>
          ) : (
            <>
              <Btn
                variant="primary"
                disabled={!selected.size}
                onClick={() => simulate(`Apply ${selected.size} selected sample low-end items`)}
              >
                Apply low-end changes
              </Btn>
              <Btn variant="ghost" onClick={() => simulate("Undo changes")}>
                Undo changes
              </Btn>
            </>
          )}
        </div>
      </div>
      <Modal
        open={review}
        onClose={() => setReview(false)}
        title="Review planned optimizations"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setReview(false)}>
              Cancel
            </Btn>
            <Btn
              variant="primary"
              onClick={() => {
                setReview(false);
                simulate("Apply these changes");
              }}
            >
              Apply these changes
            </Btn>
          </>
        }
      >
        <div className="space-y-1.5">
          {[
            "MMCSS Games task priority",
            "HD-Player process priority",
            "Core affinity balance",
            "Presentation latency",
          ].map((x) => (
            <div
              key={x}
              className="flex justify-between rounded-md border border-border bg-window px-3 py-2 text-[12.5px]"
            >
              <span>{x}</span>
              <RiskBadge risk="LOW" />
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          All planned changes are shown for review before the simulated run. Nothing is executed on
          this PC.
        </p>
      </Modal>
      <Modal
        open={bench}
        onClose={() => setBench(false)}
        title="High-FPS runtime test & A/B benchmark"
        sub="30-second real runtime capture (simulated)"
        footer={<Btn onClick={() => setBench(false)}>Close</Btn>}
      >
        <div className="grid grid-cols-3 gap-2">
          {[
            ["GAMETRUTH FPS", "—"],
            ["1% LOW FPS", "—"],
            ["HOST PRESENTED", "—"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-border bg-window p-3 text-center">
              <div className="text-xl font-bold">{v}</div>
              <div className="text-[10px] font-bold tracking-widest text-subtle">{k}</div>
            </div>
          ))}
        </div>
        <Btn variant="primary" className="mt-4" onClick={() => simulate("Run benchmark (30s)")}>
          Run benchmark (30s)
        </Btn>
        <p className="mt-3 text-[11px] text-success">
          Simulation only: instance files and emulator configuration files are not touched.
        </p>
      </Modal>
    </div>
  );
}

/* ───────── V4 DASHBOARD (V4DashboardView — not reachable from V4 top nav) ───────── */
export function V4DashboardPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="V4 Suite"
        actions={
          <Btn variant="ghost" onClick={() => simulate("Refresh")}>
            Refresh
          </Btn>
        }
      />
      <div className="grid grid-cols-3 gap-3">
        {[
          [
            "MAXIMUM PERFORMANCE",
            "Safely reduce unnecessary background workload and optimize Windows for gaming, editing and streaming.",
            "v4-max-performance",
          ],
          [
            "PERFORMANCE TUNING",
            "Optional CPU and GPU performance tuning for supported hardware.",
            "performance-tuning",
          ],
          [
            "EMULATOR OPTIMIZATION",
            "Optimize MSI App Player 5 for higher and smoother performance (sample profile).",
            "emulator-optimization",
          ],
        ].map(([t, d, s]) => (
          <Card key={t} className="flex flex-col">
            <Cpu className="mb-4 h-7 w-7 text-cyan" />
            <div className="eo-label text-foreground">{t}</div>
            <p className="mt-2 flex-1 text-xs text-muted-foreground">{d}</p>
            <Link to="/$page" params={{ page: s ?? "" }} className="mt-4">
              <Btn variant="primary" className="w-full">
                Open
              </Btn>
            </Link>
          </Card>
        ))}
      </div>
      <Card
        className="grid items-center gap-4"
        style={{ gridTemplateColumns: "1fr auto 1fr auto 1fr" } as React.CSSProperties}
      >
        <div>
          <Label>PROCESSOR</Label>
          <div className="text-sm font-semibold">{HW.cpu}</div>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <Label>GRAPHICS</Label>
          <div className="text-sm font-semibold">{HW.gpu}</div>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <Label>SYSTEM MEMORY</Label>
          <div className="text-sm font-semibold">{HW.ram}</div>
        </div>
      </Card>
    </div>
  );
}

/* ───────── V4 CORE OPTIMIZER (V4OptimizationView) ───────── */
export function V4CoreOptimizerPage() {
  const r = useSimRun(2500);
  const [done, setDone] = useState(false);
  return (
    <div className="space-y-4">
      <PageHeader
        title="V4 Core Optimizer"
        badges={<Badge tone="cyan">MAXIMUM PERFORMANCE</Badge>}
        sub="Simulated background reduction with Windows and active workloads preserved."
        actions={<Btn onClick={() => simulate("Scan")}>Scan</Btn>}
      />
      <Card glow>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-bold">Maximum Performance Optimizer</div>
            <p className="text-xs text-muted-foreground">
              Iteratively converges background footprint to a safe minimum while shielding Windows,
              games and editing tools.
            </p>
            <div className="mt-3 flex gap-1.5">
              <Badge tone="success">Windows Protected</Badge>
              <Badge tone="success">Gaming Protected</Badge>
              <Badge tone="success">Editing Protected</Badge>
            </div>
          </div>
          <Btn
            variant="primary"
            size="lg"
            disabled={r.running}
            onClick={() => r.start(() => setDone(true))}
          >
            Maximum optimize
          </Btn>
        </div>
        {r.running && <Bar value={r.progress ?? 0} className="mt-4" />}
      </Card>
      <Cols cols="1fr 1fr" gap={16}>
        <Card>
          <Label className="text-foreground">Target Band</Label>
          <div className="mt-2 text-xs text-muted-foreground">TARGET BACKGROUND FOOTPRINT</div>
          <Bar value={55} className="mt-2" />
        </Card>
        <Card>
          <Label className="text-foreground">Live Process Count</Label>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{done ? 118 : 142}</span>
            <span className="text-xs text-muted-foreground">SYSTEM WORKLOAD</span>
            {done && <Badge tone="success">↓ -24 OPTIMIZED</Badge>}
          </div>
          <Bar value={done ? 45 : 70} tone={done ? "success" : "warning"} className="mt-2" />
          <div className="mt-1 text-[11px] text-subtle">Optimal safe base</div>
        </Card>
      </Cols>
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-foreground">Actions Applied</Label>
          <span className="text-xs text-cyan">View Details</span>
        </div>
        <div className="overflow-hidden rounded-lg border border-border">
          <div
            className="grid bg-window px-3 py-2 eo-label text-[10px] text-subtle"
            style={{ gridTemplateColumns: "2fr 2fr 1.5fr 1.5fr" }}
          >
            <span>PROCESS / SERVICE</span>
            <span>ACTION TAKEN</span>
            <span>STATE</span>
            <span>TIMESTAMP</span>
          </div>
          {done &&
            [
              ["OneDrive.exe", "Priority lowered", "Simulated"],
              ["SearchIndexer", "Deferred", "Simulated"],
            ].map((r) => (
              <div
                key={r[0]}
                className="grid border-t border-border px-3 py-2 text-[12px]"
                style={{ gridTemplateColumns: "2fr 2fr 1.5fr 1.5fr" }}
              >
                <span>{r[0]}</span>
                <span>{r[1]}</span>
                <Badge tone="success">{r[2]}</Badge>
                <span className="font-mono text-subtle">now</span>
              </div>
            ))}
        </div>
      </Card>
      <SimNotice />
    </div>
  );
}

/* ───────── EMULATOR DEPLOYER & DEBLOATER (EmulatorDebloaterView) ───────── */
export function EmulatorDeployerPage() {
  const [preview, setPreview] = useState(false);
  const [safety, setSafety] = useState("All");
  return (
    <div className="space-y-4">
      <PageHeader
        title="Emulator Deployer & Debloater"
        badges={<Badge tone="success">PROTECTED CORE SAFEGUARDED</Badge>}
        sub="Whole-stack emulator deployer & component debloater."
        actions={
          <>
            <Btn variant="ghost" onClick={() => setPreview(true)}>
              Preview
            </Btn>
            <Btn variant="ghost" onClick={() => simulate("Verify")}>
              Verify
            </Btn>
            <Btn variant="ghost" onClick={() => simulate("Restore")}>
              Restore
            </Btn>
            <Btn onClick={() => simulate("Scan emulator")}>Scan emulator</Btn>
          </>
        }
      />
      <Card className="py-3 text-[12.5px]">
        STATUS: <b className="text-warning">Idle (simulated)</b>
      </Card>
      <StatTiles
        items={[
          { label: "TOTAL SCANNED", value: 48, sub: "Components analyzed" },
          { label: "PROTECTED", value: 14, sub: "Locked & preserved", tone: "cyan" },
          { label: "SAFE REMOVABLE", value: 21, sub: "Zero risk candidates", tone: "success" },
          { label: "AGGRESSIVE OPT.", value: 6, sub: "Advanced optional", tone: "warning" },
          { label: "EST. RECLAIM", value: "1.2 GB", sub: "Sample inventory estimate" },
        ]}
      />
      <Card>
        <div className="mb-3 flex flex-wrap items-center gap-4 text-[11px]">
          {["CATEGORY:", "TARGET:", "SAFETY:"].map((k) => (
            <label key={k} className="flex items-center gap-2">
              <Label>{k}</Label>
              <select
                aria-label={k}
                value={k === "SAFETY:" ? safety : "All"}
                onChange={(e) =>
                  k === "SAFETY:" ? setSafety(e.target.value) : simulate("Sample inventory scope")
                }
                className="h-8 rounded-md border border-border bg-window px-2 text-xs"
              >
                <option>All</option>
                {k === "SAFETY:" && (
                  <>
                    <option>SAFE</option>
                    <option>PROTECTED</option>
                  </>
                )}
              </select>
            </label>
          ))}
          <span className="ml-auto">
            ELIGIBLE: <b>27</b> · BLOCKED / PROTECTED: <b>14</b>
          </span>
        </div>
        <div className="space-y-1.5">
          {[
            ["Promotional launcher", "SAFE"],
            ["Telemetry agent", "SAFE"],
            ["Play Store", "PROTECTED"],
          ]
            .filter((x) => safety === "All" || x[1] === safety)
            .map(([n, r]) => (
              <div
                key={n}
                className="flex justify-between rounded-lg border border-border bg-window px-3 py-2.5 text-[12.5px]"
              >
                <span>{n}</span>
                <RiskBadge risk={r as "SAFE"} />
              </div>
            ))}
        </div>
      </Card>
      <Card className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-semibold">Ready to deploy and debloat emulator</div>
          <p className="text-xs text-muted-foreground">
            Protected components are strictly preserved. Reversible registry, service and package
            changes only.
          </p>
        </div>
        <Btn variant="primary" onClick={() => simulate("Deploy & debloat")}>
          Deploy & debloat
        </Btn>
      </Card>
      <SimNotice />
      <Modal
        open={preview}
        onClose={() => setPreview(false)}
        title="Debloat preview audit"
        footer={<Btn onClick={() => setPreview(false)}>Close preview</Btn>}
      >
        <pre className="rounded-lg bg-background p-3 font-mono text-[11px] text-muted-foreground">
          [preview] 21 safe candidates{"\n"}[preview] 14 protected (skipped){"\n"}[preview] no files
          will be deleted
        </pre>
      </Modal>
    </div>
  );
}

/* ───────── LOW END STEAM (LowEndSteamPage) ───────── */
export function LowEndSteamPage() {
  const [guide, setGuide] = useState(false);
  const [subsystem, setSubsystem] = useState("All");
  const [risky, setRisky] = useState(false);
  return (
    <div className="space-y-4">
      <PageHeader
        title="Low End Steam"
        badges={<Badge tone="cyan">LOW-SPEC HARDWARE CALIBRATED</Badge>}
        sub="Simulated emulator tuning for dual-core, quad-core and integrated graphics."
        actions={
          <>
            <Btn variant="ghost" onClick={() => setGuide(true)}>
              Guide
            </Btn>
            <Btn onClick={() => simulate("Scan candidates")}>Scan candidates</Btn>
          </>
        }
      />
      <Card className="flex items-center justify-between py-3">
        <span className="text-[12.5px]">
          ADB: <b className="text-warning">Offline (simulated)</b>
        </span>
        <span className="text-xs text-muted-foreground">
          Calibrated for Dual-Core / Quad-Core CPUs and Intel Integrated GPUs.
        </span>
        <Badge tone="success">UNPRIVILEGED (SAFE)</Badge>
      </Card>
      <Card>
        <div className="mb-3 flex items-center gap-4">
          <Label>SUBSYSTEM:</Label>
          <select
            aria-label="Subsystem"
            value={subsystem}
            onChange={(e) => setSubsystem(e.target.value)}
            className="h-8 rounded-md border border-border bg-window px-2 text-xs"
          >
            <option>All</option>
            <option>SurfaceFlinger</option>
            <option>Dalvik</option>
          </select>
          <label className="ml-auto flex items-center gap-2 text-xs">
            <Toggle on={risky} onChange={setRisky} />
            Allow Advanced Risky Tweaks (Disabled by default)
          </label>
        </div>
        <div className="space-y-1.5">
          {["SurfaceFlinger latch", "Dalvik heap growth limit", "Guest background thread trim"]
            .filter((n) => subsystem === "All" || n.startsWith(subsystem))
            .map((n) => (
              <div
                key={n}
                className="flex justify-between rounded-lg border border-border bg-window px-3 py-2.5 text-[12.5px]"
              >
                <span>{n}</span>
                <RiskBadge risk="LOW" />
              </div>
            ))}
        </div>
        <p className="mt-3 text-[11px] text-warning">
          SurfaceFlinger and Dalvik tweaks strictly require ADB connection.
        </p>
      </Card>
      <Card className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Ready to optimize emulator · ELIGIBLE: 3 · BLOCKED: 0
        </span>
        <div className="flex gap-2">
          <Btn variant="primary" onClick={() => simulate("Optimize")}>
            Optimize
          </Btn>
          <Btn variant="ghost" onClick={() => simulate("Restore")}>
            Restore
          </Btn>
        </div>
      </Card>
      <SimNotice />
      <Modal
        open={guide}
        onClose={() => setGuide(false)}
        title="Low End Steam guide"
        sub="Simulated low-spec emulator review."
        footer={<Btn onClick={() => setGuide(false)}>Close</Btn>}
      >
        <p className="text-sm text-muted-foreground">
          Review compositor timing and guest memory options. The original operations require an
          emulator connection; this prototype does not connect or measure performance.
        </p>
      </Modal>
    </div>
  );
}
