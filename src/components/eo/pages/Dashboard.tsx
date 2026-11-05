// Dashboard — premium control centre. Hierarchy (user-directed, see MISSING_REFERENCES):
// 1. Overall Optimization Score · 2. Auto Optimize panel · 3. compact system overview ·
// 4. optimization status + recent activity · 5. quick actions.
// The full System Performance Telemetry chart lives on the System Telemetry page.
import { memo, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { Cpu, MemoryStick, MonitorCog, HardDrive, HeartPulse, RefreshCw, ArrowUpRight, Info } from "lucide-react";
import { Badge, Bar, Btn, Card, DemoBadge, EmptyState, KV, Label, Modal, PageHeader, SectionTitle, SimNotice, simulate } from "../kit";
import { CountUp, ScoreRing } from "../controls";
import { AutoOptimizePanel, MODE_TEXT } from "../AutoOptimizePanel";
import { SCORE_CATEGORIES, overallScore, scoreStatus } from "@/lib/eo/score";
import { cn } from "@/lib/utils";

const TILES = [
  { icon: Cpu, label: "CPU", value: 18, l1: "AMD Ryzen 7 7800X3D", l2: "8C / 16T · 42°C", foot: "OPTIMAL" },
  { icon: MemoryStick, label: "RAM", value: 38, l1: "12.2 / 32.0 GB", l2: "DDR5-6000 CL30 · EXPO I", foot: "LOW LATENCY" },
  { icon: MonitorCog, label: "GPU", value: 14, l1: "RTX 4080 Super", l2: "1.4 / 16 GB VRAM · 44°C", foot: "IDLE / SILENT" },
  { icon: HardDrive, label: "STORAGE", value: 46, l1: "920 GB / 2 TB", l2: "Samsung 990 PRO · Gen4", foot: "HEALTH 100%" },
];

const QUICK = [
  { cat: "FULL TUNE", title: "One-Click Optimize", desc: "Analyze recommendations, review your selection, and confirm a simulated run", tag: "REVIEW & CONFIRM", to: "one-click" },
  { cat: "STORAGE", title: "Clean Temporary Files", desc: "Purge Windows temp directories, Direct3D shader caches, and crash logs", tag: "REVIEW CLEANUP", to: "storage" },
  { cat: "POWER", title: "Boost Performance", desc: "Switch Windows power plan to Ultimate and lock high-priority thread quantum", tag: "POWER PROFILE", to: "max-performance" },
  { cat: "MEMORY", title: "RAM Cleanup", desc: "Trim inactive standby memory pages and flush fragmented working sets", tag: "REVIEW MEMORY", to: "process-reduction" },
  { cat: "BOOT", title: "Startup Manager", desc: "Review high-impact startup telemetry agents and delayed services", tag: "STARTUP APPS", to: "startup-manager" },
  { cat: "NETWORK", title: "Network Boost", desc: "Tune TCP Ack frequency, receive window scaling, and disable throttling", tag: "NETWORK DIAGNOSTICS", to: "network" },
  { cat: "DIAGNOSTICS", title: "View Telemetry", desc: "Open the simulated CPU, RAM and GPU telemetry console", tag: "DEMO TELEMETRY", to: "system-info" },
  { cat: "SAFETY", title: "Create Restore Point", desc: "Snapshot Windows registry hives and service configurations before tuning", tag: "BACKUP OPTIONS", to: "backup-restore" },
];

type Log = [time: string, title: string, cat: string, detail: string, status: string];
const LOGS: Log[] = [
  ["10:42:01", "System dashboard initialized", "SYSTEM", "V3 telemetry engine started with low-overhead sampling node", "SUCCESS"],
  ["10:42:03", "Hardware status sample loaded", "AUDIT", "Identified Ryzen 7 7800X3D, RTX 4080 Super, 32GB DDR5-6000", "DEMO DATA"],
  ["10:42:08", "Performance profile status checked", "PROFILE", "V3 Normal profile active with conservative latency bias", "ACTIVE"],
  ["10:42:15", "Optimization readiness displayed", "READINESS", "Sample readiness entry · compatibility not assessed in prototype", "SAMPLE"],
  ["10:42:22", "Timer resolution benchmark simulated", "TIMING", "Global multimedia timer lock confirmed at 0.5 ms resolution", "0.5 ms LOCKED"],
];

export function DashboardPage() {
  const [logs, setLogs] = useState(LOGS);
  const [mode, setMode] = useState("NORMAL");
  return (
    <div className="space-y-3.5">
      <PageHeader
        title="Dashboard"
        badges={<Badge tone="cyan">V3</Badge>}
        sub="System overview and optimization status"
        actions={
          <>
            <Badge tone="success">{mode} MODE · CONFIGURATION ACTIVE</Badge>
            <Badge tone="muted">TIMER: 0.5 ms (LOCKED)</Badge>
            <Btn
              onClick={() => {
                setLogs((l) => [
                  [
                    new Date().toLocaleTimeString([], { hour12: false }),
                    "Sample dashboard refreshed",
                    "SYSTEM",
                    "Sample values redrawn · no hardware was read",
                    "SAMPLE",
                  ],
                  ...(l.length ? l : LOGS),
                ]);
                simulate("Refresh sample scan");
              }}
            >
              <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" /> Refresh
            </Btn>
          </>
        }
      />

      {/* 1 + 2: score (left) and Auto Optimize (right) carry the strongest emphasis */}
      <div className="eo-dash-hero grid gap-3" style={{ gridTemplateColumns: "minmax(272px, 312px) minmax(0, 1fr)" }}>
        <ScoreCard />
        <AutoOptimizePanel mode={mode} onMode={setMode} />
      </div>

      <SystemOverview />

      {/* 4: status + activity */}
      <div className="eo-telemetry-split grid gap-3" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }}>
        <Card>
          <SectionTitle
            title="OPTIMIZATION STATUS"
            sub="Current system tuning profile & kernel health"
            badge={<Badge tone="cyan">V3 ENGINE</Badge>}
          />
          <p className="text-[12px] text-muted-foreground">{MODE_TEXT[mode]}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              ["Timer Resolution", "0.5 ms (Lock)"],
              ["DPC Latency", "< 22 µs"],
              ["Core Parking", "Disabled"],
              ["Compatibility", "Not assessed"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-border bg-window px-3 py-2">
                <div className="text-[10.5px] text-muted-foreground">{k}</div>
                <div className="text-[13px] font-bold">{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Badge tone="success">{mode} MODE · CONFIGURATION ACTIVE</Badge>
            <span className="text-[10px] font-bold text-success">HEALTH 98.4% · SAMPLE</span>
          </div>
        </Card>
        <Card>
          <SectionTitle
            title="RECENT ACTIVITY"
            badge={<DemoBadge label="SAMPLE ACTIVITY" />}
            sub="Initialization and readiness entries"
            right={
              <Btn size="sm" variant="ghost" disabled={!logs.length} onClick={() => setLogs([])}>
                Clear
              </Btn>
            }
          />
          <div className="eo-activity divide-y divide-border">
            {!logs.length && (
              <EmptyState title="No sample activity" sub="Activity appears after refreshing the sample dashboard." />
            )}
            {logs.slice(0, 8).map((l, i) => (
              <div key={`${logs.length - i}-${l[0]}`} className="grid items-center gap-3 py-2" style={{ gridTemplateColumns: "auto minmax(0,1fr) auto" }}>
                <span className="font-mono text-[10.5px] text-subtle">{l[0]}</span>
                <div className="min-w-0">
                  <div className="truncate text-[12.5px] font-semibold">{l[1]}</div>
                  <div className="truncate text-[11px] text-muted-foreground">{l[3]}</div>
                </div>
                <Badge tone={l[4] === "DEMO DATA" ? "warning" : "success"}>{l[4]}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <QuickActions />
      <SimNotice />
    </div>
  );
}

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
        <ScoreRing value={score} label={`Overall optimization score ${score} out of 100, ${status}. Illustrative demo data.`}>
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
          <li key={c.key} className="grid items-center gap-2 text-[11px]" style={{ gridTemplateColumns: "92px minmax(0,1fr) 26px" }}>
            <span className="truncate font-semibold text-muted-foreground">{c.label}</span>
            <span className="eo-score-bar" style={{ "--v": `${c.value}%`, "--i": i } as CSSProperties} />
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
                  {c.value} <span className="text-[10.5px] text-subtle">· weight {Math.round(c.weight * 100)}%</span>
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

/* ── 5. Quick actions ── */
const QuickActions = memo(function QuickActions() {
  return (
    <section aria-labelledby="eo-quick-title">
      <SectionTitle
        id="eo-quick-title"
        title="QUICK ACTIONS"
        badge={<Badge tone="cyan">8 TOOLS</Badge>}
        sub="Open a tool page — every action there is a prototype simulation"
        right={<Badge tone="warning">ALL ACTIONS SIMULATED</Badge>}
      />
      <div className="grid grid-cols-4 gap-2.5">
        {QUICK.map((q) => (
          <Link
            key={q.title}
            to="/$page"
            params={{ page: q.to }}
            className={cn("eo-quick-link group rounded-xl border border-border bg-window p-3.5")}
          >
            <Label className="text-[9.5px] text-cyan">{q.cat}</Label>
            <div className="mt-1 flex items-start justify-between gap-2 text-[13px] font-bold">
              {q.title}
              <ArrowUpRight aria-hidden="true" className="eo-quick-arrow h-4 w-4 shrink-0 text-cyan" />
            </div>
            <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{q.desc}</p>
            <div className="mt-2">
              <Badge tone="success">{q.tag}</Badge>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
);
