// V4: MaxPerformanceView, EmulatorOptimizationPage, MsiAppPlayerPage, V4DashboardView, V4OptimizationView,
//     EmulatorDebloaterView (deployer), LowEndSteamPage
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
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
  BackLink,
  Badge,
  Bar,
  Btn,
  Card,
  CheckRow,
  Chips,
  Cols,
  EmptyState,
  SelectionBar,
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
import { Segmented } from "../controls";
import { usePersistedSelection } from "../useSelection";
import { EMU_PROFILES, setEmu, useEmu, type EmuProfile } from "../v4Store";

/* ───────── V4 MAXIMUM PERFORMANCE (cols=*,16,320) ─────────
 * One workspace: selectable scope → action, with a single engine rail.
 * Scope selection is persisted (first use: every eligible area selected). No live log. */
const MP_SCOPE = [
  {
    id: "background",
    icon: Layers,
    t: "Background reduction",
    d: "Reduce unnecessary background CPU overhead.",
    risk: "SAFE" as const,
  },
  {
    id: "priority",
    icon: Activity,
    t: "Priority balancing",
    d: "Balance foreground and background scheduling priority.",
    risk: "LOW" as const,
  },
  {
    id: "working-set",
    icon: MemoryStick,
    t: "Working-set refresh",
    d: "Release idle process working sets.",
    risk: "SAFE" as const,
  },
  {
    id: "system",
    icon: Gauge,
    t: "System optimizations",
    d: "Hardware-aware latency reduction for the host.",
    risk: "LOW" as const,
  },
];
const MP_SAFEGUARDS = [
  "Core Windows safeguarded",
  "Drivers & active apps shielded",
  "Reversible via rollback",
];

export function V4MaxPerformancePage() {
  const [guide, setGuide] = useState(false);
  const [procs, setProcs] = useState(142);
  const [last, setLast] = useState<{ at: string; before: number; after: number; n: number } | null>(
    null,
  );
  const r = useSimRun(3000);
  const [confirmRun, setConfirmRun] = useState(false);
  const scope = usePersistedSelection("v4-max-performance", MP_SCOPE);
  const [runIds, setRunIds] = useState<string[]>([]);
  const picked = MP_SCOPE.filter((s) => scope.sel.has(s.id));
  const pct = r.progress ?? 0;
  const stage = r.running
    ? Math.min(runIds.length - 1, Math.floor((pct / 100) * runIds.length))
    : -1;
  const run = () => {
    const ids = picked.map((s) => s.id);
    setRunIds(ids);
    r.start(() => {
      const after = 142 - ids.length * 6;
      setProcs(after);
      setLast({ at: new Date().toLocaleTimeString(), before: 142, after, n: ids.length });
    });
  };
  const stateOf = (id: string): "active" | "done" | undefined => {
    const k = runIds.indexOf(id);
    if (k < 0) return undefined;
    if (r.running) return k < stage ? "done" : k === stage ? "active" : undefined;
    return last ? "done" : undefined;
  };
  return (
    <div className="space-y-4">
      <PageHeader
        title="Maximum Performance"
        badges={<Badge tone="cyan">V4 HOST ENGINE</Badge>}
        sub="Host latency reduction for gaming and focused work — simulated."
        actions={
          <>
            <Btn variant="ghost" onClick={() => setGuide(true)}>
              Guide
            </Btn>
            <Btn
              variant="ghost"
              disabled={!last || r.running}
              onClick={() => {
                setProcs(142);
                setLast(null);
                setRunIds([]);
                simulate("Rollback");
              }}
              title="Restore the pre-optimization state (simulated)"
            >
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
              Rollback
            </Btn>
          </>
        }
      />

      <StatTiles
        items={[
          { label: "SERVICE", value: "Offline", sub: "Simulated", tone: "warning" },
          { label: "BACKGROUND PROCESSES", value: procs, sub: "Sample" },
          { label: "CPU USAGE", value: "12%", sub: "Sample" },
          { label: "GPU USAGE", value: "9%", sub: "Sample" },
          { label: "RAM USAGE", value: "36%", sub: "Sample" },
        ]}
      />

      <div
        className="eo-engine-layout grid items-start gap-3.5"
        style={{ gridTemplateColumns: "minmax(0,1fr) 300px" }}
      >
        <Card className="eo-hero eo-v4-hero">
          <div className="eo-v4-head">
            <div className="min-w-0">
              <Label className="text-cyan">OPTIMIZATION SCOPE</Label>
              <h2 className="mt-0.5 text-[15px] font-bold">Host latency workflow</h2>
            </div>
            <SelectionBar
              count={scope.sel.size}
              total={scope.eligibleCount}
              onAll={scope.selectAll}
              onClear={scope.clear}
            />
          </div>

          <div role="group" aria-label="Workflow scope" className="eo-v4-scope-grid">
            {MP_SCOPE.map((s) => {
              const st = stateOf(s.id);
              return (
                <CheckRow
                  key={s.id}
                  on={scope.sel.has(s.id)}
                  onChange={() => !r.running && scope.toggle(s.id)}
                  state={st}
                  icon={
                    st === "done" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <s.icon className="h-4 w-4" />
                    )
                  }
                  title={s.t}
                  desc={s.d}
                  right={
                    st === "active" ? (
                      <span className="text-[9.5px] font-bold text-cyan">RUNNING</span>
                    ) : st === "done" ? (
                      <span className="text-[9.5px] font-bold text-success">SIMULATED</span>
                    ) : (
                      <RiskBadge risk={s.risk} />
                    )
                  }
                />
              );
            })}
          </div>

          <div className="eo-v4-action">
            <div className="min-w-0 flex-1" aria-live="polite">
              {r.running ? (
                <>
                  <div className="mb-1 flex justify-between text-[10.5px] font-bold text-cyan">
                    <span>
                      {MP_SCOPE.find((s) => s.id === runIds[stage])?.t.toUpperCase()} · SIMULATED
                    </span>
                    <span className="font-mono">{pct.toFixed(0)}%</span>
                  </div>
                  <Bar value={pct} active />
                </>
              ) : (
                <p className="text-[11.5px] text-muted-foreground">
                  {last
                    ? `Last simulated run at ${last.at} · ${last.n} areas · 0 changes on this PC.`
                    : picked.length
                      ? `${picked.length} of ${MP_SCOPE.length} areas will run. Review before confirming.`
                      : "Select at least one area to optimize."}
                </p>
              )}
            </div>
            <Btn
              variant="primary"
              size="lg"
              className="eo-v4-cta"
              disabled={r.running || !picked.length}
              onClick={() => setConfirmRun(true)}
            >
              <Zap aria-hidden="true" className="h-4 w-4" />
              {r.running
                ? `Optimizing… ${pct.toFixed(0)}%`
                : `Optimize selected (${picked.length})`}
            </Btn>
          </div>
        </Card>

        <aside aria-label="Engine status" className="eo-stagger space-y-3">
          <Card className="eo-v4-rail">
            <div className="flex items-center justify-between gap-2">
              <Label as="h2" className="text-foreground">
                ENGINE
              </Label>
              <Btn size="sm" variant="ghost" onClick={() => simulate("Retry service")}>
                Retry service
              </Btn>
            </div>
            <div className="mt-1.5">
              <KV k="Service" v={<span className="text-warning">Offline · simulated</span>} />
              <KV k="Profile" v="Maximum Performance" />
              <KV
                k="Last run"
                v={last ? `${last.at} · ${last.before} → ${last.after} processes` : "Not run"}
              />
            </div>
            <div className="eo-rail-sep" />
            <Label className="mb-1.5 text-[10px]">HARDWARE · SAMPLE</Label>
            <ul className="space-y-1.5 text-[12px]">
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
            <div className="eo-rail-sep" />
            <ul aria-label="Protection" className="space-y-1">
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
          </Card>
        </aside>
      </div>

      <SimNotice />

      <Modal
        open={confirmRun}
        onClose={() => setConfirmRun(false)}
        title="Review Maximum Performance"
        sub="Simulated run · No Windows settings will be changed."
        icon={<Zap className="h-4 w-4" />}
        footer={
          <>
            <Btn variant="ghost" onClick={() => setConfirmRun(false)}>
              Cancel
            </Btn>
            <Btn
              variant="primary"
              disabled={!picked.length}
              onClick={() => {
                setConfirmRun(false);
                run();
              }}
            >
              Confirm simulated run ({picked.length})
            </Btn>
          </>
        }
      >
        <p className="text-[12.5px] text-muted-foreground">
          Only the selected areas run. Sample results do not establish real performance gains.
        </p>
        <ul className="mt-3 space-y-1.5">
          {picked.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-lg border border-border bg-window px-3 py-2 text-[12.5px]"
            >
              {s.t}
              <RiskBadge risk={s.risk} />
            </li>
          ))}
        </ul>
      </Modal>
      <Modal
        open={guide}
        onClose={() => setGuide(false)}
        title="Maximum Performance guide"
        sub="Safe, non-destructive Windows performance optimization."
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
 * Default V4 emulator view: connection → three-engine pipeline → session rail.
 * Session state lives in v4Store so the Module Hub round-trip never resets it. */
const ENGINES = [
  {
    n: "Emulator Optimization",
    sub: "Host MMCSS multimedia scheduling, DirectComposition presentation latency and process priority.",
    tags: [
      "SCOPE: MMCSS & DIRECT3D",
      "TARGET: HD-PLAYER.EXE",
      "SAFE CORE PROFILE",
      "OFFLINE READY",
    ],
    desc: "Smoother Free Fire frame pacing and lower input delay for MSI App Player.",
    pre: "Applies offline to the host, or live while the emulator runs.",
    needsAdb: false,
  },
  {
    n: "Emulator Deep Debloater",
    sub: "Safe guest package debloat, telemetry suppression & background broadcast cleanup.",
    tags: [
      "SHIELDED: BOOT, INPUT & GRAPHICS",
      "PLAY STORE & FREE FIRE PROTECTED",
      "PM / APPOPS METHOD",
      "AUTOMATIC MANIFEST ROLLBACK",
    ],
    desc: "Clean unnecessary emulator apps, packages and background services.",
    pre: "Needs MSI App Player running + Android Debug Bridge connected.",
    needsAdb: true,
  },
  {
    n: "Advanced Emulator Optimization",
    sub: "SurfaceFlinger latch unsignaled, HWUI render threads, Dalvik heap compaction.",
    tags: [
      "SURFACEFLINGER LATCH",
      "HWUI RENDER THREADS",
      "DALVIK HEAP: 128M / 512M",
      "CALIBRATED OVERRIDES",
    ],
    desc: "Hardware-aware rendering and memory tuning for the Android guest.",
    pre: "Needs MSI App Player running + Android Debug Bridge connected.",
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
  const navigate = useNavigate();
  const emu = useEmu();
  const engineTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(
    () => () => {
      if (engineTimer.current) clearInterval(engineTimer.current);
    },
    [],
  );
  const [pendingEngine, setPendingEngine] = useState<number | null>(null);
  const { adb } = emu;
  const applied = new Set(emu.applied);
  const [guide, setGuide] = useState(false);
  const [gs, setGs] = useState(0);
  const [running, setRunning] = useState<number | null>(null);
  const [p, setP] = useState(0);
  const runEngine = (i: number) => {
    if (running !== null) return;
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
        setEmu({ applied: [...new Set([...emu.applied, i])] });
        simulate(`${ENGINES[i]?.n} applied`);
      }
    }, 70);
    engineTimer.current = id;
  };
  const restore = (i: number) => {
    setEmu({ applied: emu.applied.filter((x) => x !== i) });
    simulate(`${ENGINES[i]?.n} restored`);
  };
  const recheck = () => {
    setEmu({ adb: !adb });
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
    ...ENGINES.map((e, i) => ({ t: `Engine ${i + 1} · ${e.n}`, done: applied.has(i) })),
  ];
  const openHub = () => navigate({ to: "/$page", params: { page: "emulator-modules" } });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Emulator Optimization"
        badges={<Badge tone="cyan">V4 GUEST ENGINE</Badge>}
        sub="MSI App Player 5 scheduling, guest debloat and graphics tuning — simulated."
        actions={
          <>
            <Btn variant="ghost" onClick={() => setGuide(true)}>
              Guide
            </Btn>
            <Btn
              variant="ghost"
              disabled={!applied.size || running !== null}
              onClick={() => {
                setEmu({ applied: [] });
                simulate("Restore all engines");
              }}
            >
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
              Restore all
            </Btn>
            <Btn variant="primary" onClick={openHub}>
              <Boxes aria-hidden="true" className="h-3.5 w-3.5" />
              Module Hub
            </Btn>
          </>
        }
      />

      {/* Connection strip (also the prerequisite check for engines 2 and 3) */}
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
        <Btn size="sm" onClick={recheck}>
          Recheck connection
        </Btn>
      </Card>

      <div
        className="eo-engine-layout grid items-start gap-3.5"
        style={{ gridTemplateColumns: "minmax(0,1fr) 300px" }}
      >
        <ol aria-label="Engine pipeline" className="eo-pipeline eo-stagger space-y-2.5">
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
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Label className="text-cyan">ENGINE {i + 1}</Label>
                        <h2 className="text-[14px] font-bold">{e.n}</h2>
                      </div>
                      <p className="mt-0.5 text-[12px] text-muted-foreground">{e.desc}</p>
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
                  {i === 2 && (
                    <p className="mt-2 rounded-md border border-warning/30 bg-warning/5 px-2.5 py-1.5 text-[11px] text-warning">
                      Latch overrides bypass buffer fence sync for lower latency; calibrated per
                      hardware tier.
                    </p>
                  )}
                  {running === i && (
                    <div className="mt-2.5" aria-live="polite">
                      <div className="mb-1 flex justify-between text-[10.5px] font-bold text-cyan">
                        <span>APPLYING · SIMULATED</span>
                        <span className="font-mono">{p}%</span>
                      </div>
                      <Bar value={p} active />
                    </div>
                  )}
                  <div className="eo-v4-engine-foot">
                    <span className={cn("text-[11px]", blocked ? "text-warning" : "text-subtle")}>
                      {e.pre}
                    </span>
                    <div className="flex items-center gap-2">
                      <Details inline title="Details">
                        <p className="text-xs text-muted-foreground">{e.sub}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {e.tags.map((t) => (
                            <Badge key={t}>{t}</Badge>
                          ))}
                        </div>
                      </Details>
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

        <aside aria-label="Session overview" className="eo-stagger space-y-3">
          <Card className="eo-v4-rail">
            <Label as="h2" className="mb-2 text-foreground">
              SESSION
            </Label>
            <div className="eo-v4-counts">
              {(
                [
                  ["APPLIED", counts.applied, "text-success"],
                  ["READY", counts.ready, "text-cyan"],
                  ["NEEDS ADB", counts.blocked, "text-warning"],
                ] as const
              ).map(([k, v, c]) => (
                <div key={k}>
                  <div className={cn("text-lg font-bold tabular-nums", c)}>{v}</div>
                  <div className="text-[9.5px] font-bold text-muted-foreground">{k}</div>
                </div>
              ))}
            </div>
            <div className="eo-rail-sep" />
            <Label className="mb-1.5 text-[10px]">RECOMMENDED SEQUENCE</Label>
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
          <button type="button" onClick={openHub} className="eo-v4-hub-card">
            <span className="eo-row-icon">
              <Boxes className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block text-[12.5px] font-bold">Module Hub</span>
              <span className="block truncate text-[11px] text-muted-foreground">
                Profiles, deep debloater and low-end modules
              </span>
            </span>
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
          </button>
        </aside>
      </div>

      <SimNotice>
        No emulator, ADB connection or Android guest is touched — the connection is a demo toggle.
      </SimNotice>

      <Modal
        open={pendingEngine !== null}
        onClose={() => setPendingEngine(null)}
        title={
          pendingEngine !== null ? (ENGINES[pendingEngine]?.n ?? "Engine review") : "Engine review"
        }
        sub="Simulated engine · No emulator settings or packages will be changed."
        icon={<Gauge className="h-4 w-4" />}
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
        <p className="text-[12.5px] text-muted-foreground">
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

/* ───────── MSI APP PLAYER 5 MODULE HUB (MsiAppPlayerPage) ─────────
 * Secondary destination under Emulator Optimization. "Back to Emulator Optimization" returns to
 * the default emulator view; the open module, profile and selections are kept (v4Store +
 * persisted selections), so the round-trip never resets anything. */
const MODULES = [
  {
    k: "EMULATOR OPTIMIZATION",
    n: "Emulator Optimization",
    tag: "SUPPORTED",
    sub: "Hardware-aware performance tuning & scheduling",
    suit: "All PCs · Balanced & Performance",
    list: [
      "Windows MMCSS multimedia gaming scheduler",
      "Guest process CPU priority & affinity balance",
      "Direct3D 11 / Vulkan render pipeline synchronization",
      "Reversible configuration discovery with full rollback",
    ],
    foot: "Zero binary patches · No anti-cheat circumvention",
  },
  {
    k: "DEEP DEBLOATER",
    n: "Emulator Deep Debloater",
    tag: "CLEANUP",
    sub: "Package, telemetry & background bloat cleanup",
    suit: "Systems needing disk & RAM relief",
    list: [
      "Scans packages, background services & temporary caches",
      "Distinguishes safe findings from system-essential services",
      "Disables analytics, promotional services & ad components",
      "One-click restore reverses all disabled packages safely",
    ],
    foot: "Emulator config files read-only · No destructive deletion",
  },
  {
    k: "LOW-END EXTREME",
    n: "Low-End Extreme",
    tag: "ENTRY-LEVEL",
    sub: "Low-spec resource relief & memory compaction",
    suit: "Dual/Quad-core CPUs · 4–8 GB RAM · iGPU",
    list: [
      "SurfaceFlinger latch: latches buffers immediately",
      "Dalvik heap growth limit: relieves guest memory pressure",
      "Trims non-essential background guest threads and memory",
      "Reversible guest-level properties with instant undo",
    ],
    foot: "Hardware-aware estimates · No guaranteed FPS claims",
  },
];
const PROFILE_INFO: Record<EmuProfile, { a: string; b: string; t: string }> = {
  "BALANCED PROFILE": {
    a: "Everyday smooth gaming",
    b: "Conservative, stable starting point focused on compatibility and frame pacing.",
    t: "All PCs, 4 GB+ RAM",
  },
  "PERFORMANCE PROFILE": {
    a: "Maximum responsiveness",
    b: "Aggressive MMCSS priority scheduling and dedicated core affinity.",
    t: "Mid to high-end, 8 GB+ RAM, dedicated GPU",
  },
};
const PLANNED: Record<EmuProfile, { id: string; t: string; risk: "SAFE" | "LOW" | "MEDIUM" }[]> = {
  "BALANCED PROFILE": [
    { id: "mmcss", t: "MMCSS Games task priority", risk: "LOW" },
    { id: "hd-player", t: "HD-Player process priority", risk: "LOW" },
    { id: "affinity", t: "Core affinity balance", risk: "LOW" },
    { id: "presentation", t: "Presentation latency", risk: "LOW" },
  ],
  "PERFORMANCE PROFILE": [
    { id: "mmcss", t: "MMCSS Games task priority", risk: "LOW" },
    { id: "hd-player", t: "HD-Player process priority", risk: "LOW" },
    { id: "affinity", t: "Dedicated core affinity", risk: "MEDIUM" },
    { id: "presentation", t: "Presentation latency", risk: "LOW" },
  ],
};
const DEBLOAT = [
  { id: "Promotional app center", risk: "SAFE" as const },
  { id: "Analytics broadcast receiver", risk: "SAFE" as const },
  { id: "Ad SDK service", risk: "SAFE" as const },
  { id: "Google Play Store", risk: "PROTECTED" as const },
  { id: "Free Fire", risk: "PROTECTED" as const },
  { id: "Input method service", risk: "PROTECTED" as const },
];
const LOW_END = [
  { id: "Compositor buffer timing", risk: "LOW" as const },
  { id: "Guest memory growth limit", risk: "LOW" as const },
  { id: "Background guest thread trim", risk: "LOW" as const },
  { id: "Aggressive HWUI render override", risk: "HIGH" as const },
];
const HUB_VIEWS = ["OVERVIEW", ...MODULES.map((m) => m.k)];

export function EmulatorModulesPage() {
  const navigate = useNavigate();
  const { mod, profile } = useEmu();
  const planned = PLANNED[profile];
  const opt = usePersistedSelection(`emu-opt:${profile}`, planned);
  const debloat = usePersistedSelection("emu-debloat", DEBLOAT);
  const lowEnd = usePersistedSelection("emu-lowend", LOW_END);
  const [scanned, setScanned] = useState(false);
  const [risky, setRisky] = useState(false);
  const [review, setReview] = useState(false);
  const [bench, setBench] = useState(false);
  const [guide, setGuide] = useState(false);
  const scan = useSimRun(2000);
  const setMod = (m: string | null) => setEmu({ mod: m });
  const active = MODULES.find((m) => m.k === mod);
  const plannedSel = planned.filter((x) => opt.sel.has(x.id));
  const lowEndVisible = LOW_END.filter((x) => risky || x.risk !== "HIGH");
  // Hidden high-risk rows never count toward an apply.
  const lowEndSel = lowEndVisible.filter((x) => lowEnd.sel.has(x.id));

  return (
    <div className={cn("space-y-4", active && "pb-16")}>
      <PageHeader
        back={
          <BackLink
            label="Back to Emulator Optimization"
            onClick={() => navigate({ to: "/$page", params: { page: "emulator-optimization" } })}
          />
        }
        title="Module Hub"
        badges={<Badge tone="cyan">MSI APP PLAYER 5</Badge>}
        sub={
          active ? active.sub : "Choose a module to review findings and apply simulated changes."
        }
        actions={
          <>
            <Btn variant="ghost" onClick={() => setGuide(true)}>
              Guide
            </Btn>
            {active && (
              <Btn size="sm" onClick={() => simulate("Rescan")}>
                Rescan
              </Btn>
            )}
          </>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="Module Hub view"
          options={HUB_VIEWS}
          value={mod ?? "OVERVIEW"}
          onChange={(v) => setMod(v === "OVERVIEW" ? null : v)}
        />
        <span className="text-[11.5px] text-muted-foreground">
          ADB: <b className="text-warning">Offline (simulated)</b>
        </span>
      </div>

      {!active && (
        <div className="eo-module-grid grid grid-cols-3 gap-3">
          {MODULES.map((m, i) => (
            <Card key={m.k} className="eo-module-card flex flex-col">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-cyan">
                  <Layers aria-hidden="true" className="h-3.5 w-3.5" />
                  MODULE 0{i + 1}
                </Label>
                <Badge tone="success">{m.tag}</Badge>
              </div>
              <h2 className="mt-2 text-[15px] font-bold">{m.n}</h2>
              <p className="text-[12px] text-muted-foreground">{m.sub}</p>
              <div className="mt-2 text-[11px] text-subtle">{m.suit}</div>
              <ul className="mt-3 flex-1 space-y-1 text-[11.5px] text-muted-foreground">
                {m.list.map((l) => (
                  <li key={l} className="flex gap-1.5">
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-3 w-3 shrink-0 text-cyan"
                    />
                    {l}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[10.5px] text-success">{m.foot}</p>
              <Btn variant="primary" className="mt-3 w-full" onClick={() => setMod(m.k)}>
                Open module
              </Btn>
            </Card>
          ))}
        </div>
      )}

      {mod === "EMULATOR OPTIMIZATION" && (
        <>
          <div role="radiogroup" aria-label="Optimization profile" className="eo-profile-pick">
            {EMU_PROFILES.map((n) => {
              const info = PROFILE_INFO[n];
              const on = profile === n;
              return (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setEmu({ profile: n })}
                  className="eo-profile-option"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="eo-label text-foreground">{n}</span>
                    {n === "BALANCED PROFILE" && <Badge tone="cyan">RECOMMENDED</Badge>}
                  </span>
                  <span className="mt-1 block text-[13px] font-bold">{info.a}</span>
                  <span className="mt-0.5 block text-[11.5px] text-muted-foreground">{info.b}</span>
                  <span className="mt-2 block text-[10.5px] text-subtle">Target: {info.t}</span>
                </button>
              );
            })}
          </div>
          <Card>
            <div className="eo-v4-head">
              <div className="min-w-0">
                <Label className="text-cyan">PLANNED OPTIMIZATIONS</Label>
                <h2 className="mt-0.5 text-[14px] font-bold">
                  {profile
                    .replace(" PROFILE", "")
                    .toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase())}{" "}
                  profile
                </h2>
              </div>
              <SelectionBar
                count={opt.sel.size}
                total={opt.eligibleCount}
                onAll={opt.selectAll}
                onClear={opt.clear}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {planned.map((x) => (
                <CheckRow
                  key={x.id}
                  on={opt.sel.has(x.id)}
                  onChange={() => opt.toggle(x.id)}
                  title={x.t}
                  right={<RiskBadge risk={x.risk} />}
                />
              ))}
            </div>
            <div className="mt-3">
              <Details
                inline
                title="Performance assessment"
                hint="Model estimate — not a benchmark"
              >
                <div className="grid grid-cols-4 gap-3 text-[12px]">
                  {[
                    ["HARDWARE TIER", "High-end"],
                    ["SUITABILITY", "Balanced & Performance"],
                    ["CONFIDENCE", "Sample value"],
                    ["RECOMMENDED", "Balanced"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <Label className="text-[9.5px]">{k}</Label>
                      <div className="font-semibold">{v}</div>
                    </div>
                  ))}
                </div>
                <Btn size="sm" className="mt-3" onClick={() => setBench(true)}>
                  High-FPS runtime test
                </Btn>
              </Details>
            </div>
          </Card>
        </>
      )}

      {mod === "DEEP DEBLOATER" && (
        <Card>
          <div className="eo-v4-head">
            <div className="min-w-0">
              <Label className="text-cyan">EMULATOR COMPONENTS</Label>
              <p className="mt-0.5 text-[11px] text-success">
                Read-only protected configs · reversible package disabling
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {scanned && (
                <SelectionBar
                  count={debloat.sel.size}
                  total={debloat.eligibleCount}
                  onAll={debloat.selectAll}
                  onClear={debloat.clear}
                  allLabel="Select all safe"
                />
              )}
              <Btn
                variant="primary"
                size="sm"
                disabled={scan.running}
                onClick={() => scan.start(() => setScanned(true))}
              >
                {scanned ? "Rescan" : "Scan emulator"}
              </Btn>
            </div>
          </div>
          {scan.running && (
            <div className="mb-3" aria-live="polite">
              <Bar value={scan.progress ?? 0} active />
              <p className="mt-1 text-[11px] text-cyan">Scanning emulator stack… (simulated)</p>
            </div>
          )}
          {!scanned && !scan.running && (
            <EmptyState
              title="NO COMPONENTS SCANNED YET"
              sub="Scan to list packages, services and telemetry. Safe items are pre-selected; protected ones never are."
            />
          )}
          {scanned && (
            <div className="grid grid-cols-2 gap-2">
              {DEBLOAT.map((x) => (
                <CheckRow
                  key={x.id}
                  on={debloat.sel.has(x.id)}
                  onChange={() => debloat.toggle(x.id)}
                  locked={x.risk === "PROTECTED" ? "Protected — never selectable" : undefined}
                  title={x.id}
                  right={<RiskBadge risk={x.risk} />}
                />
              ))}
            </div>
          )}
        </Card>
      )}

      {mod === "LOW-END EXTREME" && (
        <Card>
          <div className="eo-v4-head">
            <div className="min-w-0">
              <Label className="text-cyan">LOW-END EXTREME TARGETING</Label>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Dual/quad-core CPUs, Intel HD/UHD graphics, 4–8 GB RAM · unprivileged
              </p>
            </div>
            <SelectionBar
              count={lowEndSel.length}
              total={lowEnd.eligibleCount}
              onAll={lowEnd.selectAll}
              onClear={lowEnd.clear}
            />
          </div>
          <div className="mb-3 grid grid-cols-2 gap-2">
            {[
              [
                "SurfaceFlinger latch",
                "Latches graphics buffers immediately without waiting for fences.",
              ],
              ["Dalvik heap compaction", "Tightens heap boundaries to relieve memory pressure."],
            ].map(([a, b]) => (
              <div key={a} className="rounded-lg border border-border bg-window px-3 py-2">
                <div className="text-[12px] font-bold">{a}</div>
                <div className="text-[11px] text-muted-foreground">{b}</div>
              </div>
            ))}
          </div>
          {scan.running && <Bar value={scan.progress ?? 0} active className="mb-2" />}
          <div className="grid grid-cols-2 gap-2">
            {lowEndVisible.map((x) => (
              <CheckRow
                key={x.id}
                on={lowEnd.sel.has(x.id)}
                onChange={() => lowEnd.toggle(x.id)}
                title={x.id}
                desc={x.risk === "HIGH" ? "Advanced — never selected automatically" : undefined}
                right={<RiskBadge risk={x.risk} />}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
            <label className="flex items-center gap-2 text-[11.5px]">
              <Toggle label="Show advanced risky tweaks" on={risky} onChange={setRisky} />
              Show advanced risky tweaks
            </label>
            <Btn size="sm" onClick={() => scan.start()}>
              Scan candidates
            </Btn>
          </div>
        </Card>
      )}

      {active && (
        <div className="eo-action-bar">
          <span className="text-[11.5px] text-muted-foreground">
            <b className="text-foreground">{active.n}</b> ·{" "}
            {mod === "EMULATOR OPTIMIZATION"
              ? `${plannedSel.length} selected`
              : mod === "DEEP DEBLOATER"
                ? scanned
                  ? `${debloat.sel.size} selected`
                  : "Scan first"
                : `${lowEndSel.length} selected`}
          </span>
          <div className="flex gap-2">
            {mod === "EMULATOR OPTIMIZATION" ? (
              <>
                <Btn variant="ghost" onClick={() => simulate("Rollback")}>
                  Rollback
                </Btn>
                <Btn
                  variant="primary"
                  disabled={!plannedSel.length}
                  onClick={() => setReview(true)}
                >
                  Review & apply ({plannedSel.length})
                </Btn>
              </>
            ) : mod === "DEEP DEBLOATER" ? (
              <>
                <Btn variant="ghost" onClick={() => simulate("Restore debloat")}>
                  Restore debloat
                </Btn>
                <Btn
                  variant="primary"
                  disabled={!scanned || !debloat.sel.size}
                  onClick={() =>
                    simulate(`Apply ${debloat.sel.size} selected sample debloat items`)
                  }
                >
                  Apply selected debloat
                </Btn>
              </>
            ) : (
              <>
                <Btn variant="ghost" onClick={() => simulate("Undo changes")}>
                  Undo changes
                </Btn>
                <Btn
                  variant="primary"
                  disabled={!lowEndSel.length}
                  onClick={() =>
                    simulate(`Apply ${lowEndSel.length} selected sample low-end items`)
                  }
                >
                  Apply low-end changes
                </Btn>
              </>
            )}
          </div>
        </div>
      )}

      <SimNotice>Simulated modules · emulator configuration files are never touched.</SimNotice>

      <Modal
        open={review}
        onClose={() => setReview(false)}
        title="Review planned optimizations"
        sub={`${profile.replace(" PROFILE", "")} profile · simulated run`}
        icon={<Gauge className="h-4 w-4" />}
        footer={
          <>
            <Btn variant="ghost" onClick={() => setReview(false)}>
              Cancel
            </Btn>
            <Btn
              variant="primary"
              disabled={!plannedSel.length}
              onClick={() => {
                setReview(false);
                simulate(`Apply ${plannedSel.length} planned optimizations`);
              }}
            >
              Apply these changes ({plannedSel.length})
            </Btn>
          </>
        }
      >
        <div className="space-y-1.5">
          {plannedSel.map((x) => (
            <div
              key={x.id}
              className="flex justify-between rounded-md border border-border bg-window px-3 py-2 text-[12.5px]"
            >
              <span>{x.t}</span>
              <RiskBadge risk={x.risk} />
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Only the selected optimizations are listed. Nothing is executed on this PC.
        </p>
      </Modal>
      <Modal
        open={bench}
        onClose={() => setBench(false)}
        title="High-FPS runtime test & A/B benchmark"
        sub="30-second runtime capture (simulated)"
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
      <Modal
        open={guide}
        onClose={() => setGuide(false)}
        title="Module Hub guide"
        sub="How ERROR OPTIMIZER tunes MSI App Player 5 safely"
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
          [
            "2. EVERYTHING ELIGIBLE IS PRE-SELECTED",
            "Protected packages and advanced risky tweaks are never selected for you. Each profile keeps its own selection.",
          ],
          ["3. REVIEW BEFORE APPLYING", "Review & apply lists exactly the selected changes."],
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
