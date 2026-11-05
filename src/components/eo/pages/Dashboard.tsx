// DashboardView.xaml — section order and copy follow the XAML exactly.
import { memo, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cpu, MemoryStick, MonitorCog, HardDrive, HeartPulse, RefreshCw, ArrowUpRight, Play, Pause } from "lucide-react";
import { Badge, Bar, Btn, Card, Chips, DemoBadge, Label, PageHeader, SectionTitle, SimNotice, simulate, EmptyState } from "../kit";
import { cn } from "@/lib/utils";

const TILES = [
  { icon: Cpu, label: "CPU USAGE", value: 18, l1: "AMD Ryzen 7 7800X3D", l2: "3.8 GHz · 8C / 16T · 42°C", foot: "OPTIMAL · 42°C" },
  { icon: MemoryStick, label: "RAM USAGE", value: 38, l1: "12.2 GB / 32.0 GB", l2: "DDR5-6000 CL30 · EXPO I", foot: "LOW LATENCY" },
  { icon: MonitorCog, label: "GPU USAGE", value: 14, l1: "RTX 4080 Super", l2: "1.4 GB / 16 GB VRAM · 44°C", foot: "IDLE / SILENT" },
  { icon: HardDrive, label: "STORAGE USAGE", value: 46, l1: "920 GB / 2 TB", l2: "Samsung 990 PRO · Gen4", foot: "HEALTH 100%" },
];

const QUICK = [
  { cat: "FULL TUNE", title: "One-Click Optimize", desc: "Analyze recommendations, review your selection, and confirm a simulated run", tag: "REVIEW & CONFIRM", to: "one-click" },
  { cat: "STORAGE", title: "Clean Temporary Files", desc: "Purge Windows temp directories, Direct3D shader caches, and crash logs", tag: "REVIEW CLEANUP", to: "storage" },
  { cat: "POWER", title: "Boost Performance", desc: "Switch Windows power plan to Ultimate and lock high-priority thread quantum", tag: "POWER PROFILE", to: "max-performance" },
  { cat: "MEMORY", title: "RAM Cleanup", desc: "Trim inactive standby memory pages and flush fragmented working sets", tag: "REVIEW MEMORY", to: "process-reduction" },
  { cat: "BOOT", title: "Startup Manager", desc: "Review high-impact startup telemetry agents and delayed services", tag: "STARTUP APPS", to: "startup-manager" },
  { cat: "NETWORK", title: "Network Boost", desc: "Tune TCP Ack frequency, receive window scaling, and disable throttling", tag: "NETWORK DIAGNOSTICS", to: "network" },
  { cat: "DIAGNOSTICS", title: "View Telemetry", desc: "Inspect sample hardware information and diagnostic readings", tag: "DEMO TELEMETRY", to: "system-info" },
  { cat: "SAFETY", title: "Create Restore Point", desc: "Snapshot Windows registry hives and service configurations before tuning", tag: "BACKUP OPTIONS", to: "backup-restore" },
];

const LOGS = [
  ["10:42:01", "System dashboard initialized", "SYSTEM", "V3 telemetry engine started with low-overhead sampling node", "SUCCESS"],
  ["10:42:03", "Hardware status sample loaded", "AUDIT", "Identified Ryzen 7 7800X3D, RTX 4080 Super, 32GB DDR5-6000", "DEMO DATA"],
  ["10:42:08", "Performance profile status checked", "PROFILE", "V3 Normal profile active with conservative latency bias", "ACTIVE"],
  ["10:42:15", "Optimization readiness displayed", "READINESS", "Sample readiness entry · compatibility not assessed in prototype", "SAMPLE"],
  ["10:42:22", "Timer resolution benchmark simulated", "TIMING", "Global multimedia timer lock confirmed at 0.5 ms resolution", "0.5 ms LOCKED"],
];

const MODE_TEXT: Record<string, string> = {
  NORMAL: "Normal optimization applies conservative timing adjustments, DPC interrupt balancing and safe scheduler defaults.",
  ADVANCED: "Advanced applies deeper scheduler and timer tuning for power users.",
  "CONSERVATIVE GAMING": "Conservative gaming keeps anti-cheat-sensitive settings untouched while biasing foreground latency.",
};

function useSeries(n = 30, paused = false) {
  const [s, setS] = useState(() => Array.from({ length: n }, (_, i) => ({ cpu: 18 + Math.sin(i / 3) * 6, ram: 38 + Math.sin(i / 7) * 2, gpu: 14 + Math.cos(i / 4) * 5 })));
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setS((p) => [...p.slice(1), { cpu: 12 + Math.random() * 14, ram: 37 + Math.random() * 3, gpu: 9 + Math.random() * 12 }]), 1200);
    return () => clearInterval(id);
  }, [paused]);
  return s;
}

function path(vals: number[], w: number, h: number) {
  const step = w / (vals.length - 1);
  return vals.map((v, i) => `${i ? "L" : "M"}${(i * step).toFixed(1)},${(h - (v / 100) * h).toFixed(1)}`).join(" ");
}

type Sample = { cpu: number; ram: number; gpu: number };
const liveValue = (label: string, last: Sample, fallback: number) => (label === "CPU USAGE" ? last.cpu : label === "RAM USAGE" ? last.ram : label === "GPU USAGE" ? last.gpu : fallback);
const area = (vals: number[], w: number, h: number) => `${path(vals, w, h)} L${w},${h} L0,${h} Z`;

export function DashboardPage() {
  const [paused, setPaused] = useState(false);
  const [logs, setLogs] = useState(LOGS);
  const [refreshKey, setRefreshKey] = useState(0);
  const s = useSeries(30, paused);
  const [win, setWin] = useState("30 SEC");
  const [mode, setMode] = useState("NORMAL");
  const last = s.at(-1) ?? { cpu: 18, ram: 38, gpu: 14 };
  const series = win === "30 SEC" ? s : win === "1 MIN" ? s.filter((_, i) => i % 2 === 0) : s.filter((_, i) => i % 3 === 0);
  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        badges={<Badge tone="cyan">V3</Badge>}
        sub="System overview and optimization status"
        actions={<>
          <Link to="/$page" params={{ page: "one-click" }}><Btn variant="primary"><Play className="h-3.5 w-3.5" />1-Click Optimize</Btn></Link>
          <Badge tone="success">{mode} MODE · CONFIGURATION ACTIVE</Badge>
          <Badge tone="muted">TIMER: 0.5 ms (LOCKED)</Badge>
          <Btn onClick={() => { setRefreshKey((k) => k + 1); setLogs((l) => [[new Date().toLocaleTimeString([], { hour12: false }), "Sample dashboard refreshed", "SYSTEM", "Sample telemetry redrawn · no hardware was read", "SAMPLE"], ...(l.length ? l : LOGS)]); simulate("Refresh sample scan"); }}><RefreshCw className="h-3.5 w-3.5" /> Refresh</Btn>
        </>}
      />

      {/* 5-tile telemetry row: cols=*,10,*,10,*,10,*,10,* */}
      <div className="eo-telemetry-tiles grid grid-cols-5 gap-2.5">
        {TILES.map((t) => (
          <Card key={t.label} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-cyan"><t.icon className="h-3.5 w-3.5" /></span><Label>{t.label}</Label></div>
              <DemoBadge />
            </div>
            <div className="mt-3 text-3xl font-bold tabular-nums">{liveValue(t.label, last, t.value).toFixed(0)}<span className="text-lg text-muted-foreground">%</span></div>
            <div className="mt-1 truncate text-[12.5px] font-semibold">{t.l1}</div>
            <div className="truncate text-[11px] text-subtle">{t.l2}</div>
            <Bar value={liveValue(t.label, last, t.value)} className="mt-3" />
            <div className="mt-2 flex justify-between text-[9.5px] font-bold tracking-widest"><span className="text-success">{t.foot}</span><span className="text-muted-foreground">{liveValue(t.label, last, t.value).toFixed(0)}%</span></div>
          </Card>
        ))}
        <Card className="p-4">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-md bg-success/15 text-success"><HeartPulse className="h-3.5 w-3.5" /></span><Label>SYSTEM HEALTH</Label></div><DemoBadge /></div>
          <div className="mt-3 text-3xl font-bold text-success">98.4</div>
          <div className="mt-1 text-[12.5px] font-semibold">Optimal Responsiveness</div>
          <div className="text-[11px] text-subtle">DPC: &lt; 22 µs · Timer: 0.5 ms</div>
          <Bar value={98.4} tone="success" className="mt-3" />
          <div className="mt-2 flex justify-between text-[9.5px] font-bold tracking-widest"><span className="text-success">V3 PROFILE · SAMPLE</span><span className="text-muted-foreground">98.4%</span></div>
        </Card>
      </div>

      {/* Telemetry chart + Optimization status: cols=58*,12,42* */}
      <div className="eo-telemetry-split grid gap-3" style={{ gridTemplateColumns: "58fr 42fr" }}>
        <Card>
          <SectionTitle title="SYSTEM PERFORMANCE TELEMETRY" badge={<DemoBadge label="DEMO DATA" />} sub="Illustrative CPU, memory and graphics utilization"
            right={<><Btn size="sm" variant="ghost" title={paused ? "Resume sample telemetry" : "Pause sample telemetry"} pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play aria-hidden="true" className="h-3 w-3" /> : <Pause aria-hidden="true" className="h-3 w-3" />}</Btn><Chips label="Telemetry window" options={["30 SEC", "1 MIN", "5 MIN"]} value={win} onChange={setWin} /></>} />
          <div className="mb-2 flex gap-4 text-[11px] font-semibold">
            <span className="text-chart-1">● CPU: {last.cpu.toFixed(0)}%</span><span className="text-chart-2">● RAM: {last.ram.toFixed(0)}%</span><span className="text-chart-3">● GPU: {last.gpu.toFixed(0)}%</span>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "32px 1fr" }}>
            <div className="flex h-44 flex-col justify-between text-[9.5px] text-subtle">{["100%", "75%", "50%", "25%", "0%"].map((x) => <span key={x}>{x}</span>)}</div>
            <svg key={refreshKey} role="img" aria-label="Simulated CPU, RAM and GPU utilization chart" viewBox="0 0 600 176" className="eo-chart h-44 w-full" preserveAspectRatio="none">
              <defs><linearGradient id="eo-cpu-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--chart-1)" /><stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0" /></linearGradient></defs>
              {[0, 44, 88, 132, 176].map((y) => <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="var(--border)" strokeDasharray="3 4" />)}
              <path className="eo-chart-area" d={area(series.map((v) => v.cpu), 600, 176)} fill="url(#eo-cpu-fill)" />
              <path pathLength={1} d={path(series.map((v) => v.ram), 600, 176)} fill="none" stroke="var(--chart-2)" strokeWidth="2" />
              <path pathLength={1} d={path(series.map((v) => v.gpu), 600, 176)} fill="none" stroke="var(--chart-3)" strokeWidth="2" />
              <path pathLength={1} d={path(series.map((v) => v.cpu), 600, 176)} fill="none" stroke="var(--chart-1)" strokeWidth="2" />
            </svg>
          </div>
          <div className="mt-1 ml-8 flex justify-between text-[9.5px] text-subtle">{[win === "30 SEC" ? "−30s" : win === "1 MIN" ? "−60s" : "−5m", "", "", "", "", "", "NOW"].map((x, i) => <span key={i}>{x}</span>)}</div>
          <div className="mt-3 flex justify-between text-[9.5px] font-bold tracking-widest text-subtle"><span>SIMULATED TELEMETRY · NOT A MEASUREMENT</span><span>WINDOW: {win === "30 SEC" ? "30 SECONDS" : win}</span></div>
        </Card>
        <Card>
          <SectionTitle title="OPTIMIZATION STATUS" sub="Current system tuning profile & kernel health" badge={<Badge tone="cyan">V3 ENGINE</Badge>} />
          <Chips label="Optimization mode" options={["NORMAL", "ADVANCED", "CONSERVATIVE GAMING"]} value={mode} onChange={setMode} />
          <p className="mt-3 text-[12.5px] text-muted-foreground">{MODE_TEXT[mode]}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[["Timer Resolution:", "0.5 ms (Lock)"], ["DPC Latency:", "< 22 µs"], ["Core Parking:", "Disabled"], ["Compatibility:", "Not assessed"]].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-border bg-window p-3"><div className="text-[11px] text-muted-foreground">{k}</div><div className="text-sm font-bold">{v}</div></div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between"><Badge tone="success">{mode} MODE · CONFIGURATION ACTIVE</Badge><span className="text-[10px] font-bold tracking-widest text-success">HEALTH 98.4%</span></div>
          <div className="mt-3"><SimNotice /></div>
        </Card>
      </div>

      <HardwareInfo />
      <QuickActions />

      {/* Recent activity: rows cols=Auto,*,Auto */}
      <Card>
        <SectionTitle title="RECENT ACTIVITY" badge={<DemoBadge label="SAMPLE ACTIVITY" />} sub="Initialization logs and system readiness audit entries" right={<Btn size="sm" variant="ghost" onClick={() => setLogs([])}>Clear logs</Btn>} />
        <div className="divide-y divide-border">
          {!logs.length && <EmptyState title="No sample activity" sub="Activity appears after refreshing the sample dashboard." />}
          {logs.slice(0, 8).map((l, i) => (
            <div key={`${logs.length - i}-${l[0]}`} className="grid items-center gap-4 py-2.5" style={{ gridTemplateColumns: "auto 1fr auto" }}>
              <span className="font-mono text-[11px] text-subtle">{l[0]}</span>
              <div><div className="flex items-center gap-2 text-[13px] font-semibold">{l[1]}<Badge tone="muted">{l[2]}</Badge></div><div className="text-[11.5px] text-muted-foreground">{l[3]}</div></div>
              <Badge tone={l[4] === "DEMO DATA" ? "warning" : "success"}>{l[4]}</Badge>
            </div>
          ))}
        </div>
        <div className={cn("mt-2 flex justify-between text-[9.5px] font-bold tracking-widest text-subtle")}><span>ALL LOG ENTRIES REPRESENT DEMO INITIALIZATION STATE</span><span>SAMPLE STATE</span></div>
      </Card>
    </div>
  );
}

// Static sections are memoized so the 1.2 s sample-telemetry tick does not re-render them.
const HardwareInfo = memo(function HardwareInfo() {
  return (
    <>
      {/* Hardware information table: cols=190,270,*,130 */}
      <Card>
        <SectionTitle title="HARDWARE INFORMATION" badge={<DemoBadge label="DEMO DATA" />} sub="Sample system specifications — no hardware detection" right={<Link to="/$page" params={{ page: "system-info" }}><Btn size="sm">View specs</Btn></Link>} />
        <div className="eo-data-table rounded-lg border border-border">
          <div className="grid bg-window px-4 py-2 eo-label text-[9.5px] text-subtle" style={{ gridTemplateColumns: "190px 270px 1fr 130px" }}><span>COMPONENT</span><span>HARDWARE SPECIFICATION</span><span>ATTRIBUTES</span><span>STATUS</span></div>
          {[
            ["PROCESSOR", "AMD Ryzen 7 7800X3D", "8 Cores / 16 Threads · 4.2 GHz · 96 MB L3", "OPTIMAL (42°C)"],
            ["GRAPHICS PROCESSOR", "NVIDIA GeForce RTX 4080 Super", "16 GB GDDR6X · PCIe 4.0", "READY (44°C)"],
            ["INSTALLED RAM", "32 GB DDR5-6000", "2x 16GB · 6000 MT/s CL30-36-36 · AMD EXPO I · Latency: 58.4 ns", "EXPO ACTIVE"],
            ["PRIMARY STORAGE", "Samsung 990 PRO 2TB", "PCIe Gen 4.0 x4 · Read 7,450 MB/s · Write 6,900 MB/s · DirectStorage Ready", "TRIM ENABLED"],
          ].map((r) => (
            <div key={r[0]} className="grid items-center border-t border-border px-4 py-2.5 text-[12.5px]" style={{ gridTemplateColumns: "190px 270px 1fr 130px" }}>
              <span className="eo-label text-[10px] text-cyan">{r[0]}</span><span className="font-semibold">{r[1]}</span><span className="text-muted-foreground">{r[2]}</span><Badge tone="success">{r[3]}</Badge>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[9.5px] font-bold tracking-widest text-subtle"><span>ALL SPECIFICATIONS ARE SAMPLE PROTOTYPE VALUES</span><span className="text-success">DIRECTSTORAGE READY</span></div>
      </Card>

    </>
  );
});

const QuickActions = memo(function QuickActions() {
  return (
    <>
      {/* Quick actions: 4x2, cols=*,10,*,10,*,10,* */}
      <section className="py-2">
        <SectionTitle title="QUICK ACTIONS" badge={<Badge tone="cyan">8 TOOLS</Badge>} sub="One-click system optimization tools (Prototype Simulation)" right={<Badge tone="warning">ALL ACTIONS SIMULATED</Badge>} />
        <div className="grid grid-cols-4 gap-2.5">
          {QUICK.map((q) => (
            <Link key={q.title} to="/$page" params={{ page: q.to }} className="eo-quick-link group rounded-xl border border-border bg-window p-4 transition-all hover:-translate-y-0.5 hover:border-cyan/50 hover:shadow-[var(--shadow-glow)]">
              <Label className="text-cyan">{q.cat}</Label>
              <div className="mt-1.5 flex items-start justify-between gap-2 text-sm font-bold">{q.title}<ArrowUpRight className="h-4 w-4 shrink-0 text-cyan" /></div>
              <p className="mt-1 text-[11.5px] leading-snug text-muted-foreground">{q.desc}</p>
              <div className="mt-3"><Badge tone="success">{q.tag}</Badge></div>
            </Link>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-[9.5px] font-bold tracking-widest text-subtle"><span>PROTOTYPE INTERACTIONS DO NOT ALTER REAL SYSTEM CONFIGURATIONS</span><span>CLICK ANY ACTION TO OPEN ITS PAGE</span></div>
      </section>

    </>
  );
});
