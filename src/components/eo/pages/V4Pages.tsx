// V4: MaxPerformanceView, EmulatorOptimizationPage, MsiAppPlayerPage, V4DashboardView, V4OptimizationView,
//     EmulatorDebloaterView (deployer), LowEndSteamPage
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, Cpu, Layers, Activity } from "lucide-react";
import { Badge, Bar, Btn, Card, Check, Chips, Cols, EmptyState, Label, Modal, PageHeader, RiskBadge, SectionTitle, SimNotice, StatTiles, Toggle, Details, simulate, useSimRun } from "../kit";
import { cn } from "@/lib/utils";
import { HW } from "@/lib/eo/data";

/* ───────── V4 MAXIMUM PERFORMANCE (cols=*,16,360) ───────── */
export function V4MaxPerformancePage() {
  const [log, setLog] = useState<string[]>([]);
  const [guide, setGuide] = useState(false);
  const [procs, setProcs] = useState(142);
  const r = useSimRun(3000);
  const [confirmRun, setConfirmRun] = useState(false);
  const run = () => r.start(() => { setProcs(118); setLog((l) => [`${new Date().toLocaleTimeString()} · Simulated workflow completed · sample process state updated`, ...l]); });
  return (
    <div className="eo-engine-layout grid gap-4" style={{ gridTemplateColumns: "minmax(0,1fr) 320px" }}>
      <div className="space-y-4">
        <Card className="flex items-center gap-3 border-warning/30 py-3"><span className="h-2 w-2 rounded-full bg-warning" /><div className="flex-1"><div className="text-[13px] font-bold">Optimization service is currently offline</div><div className="text-xs text-muted-foreground">Live system metrics and optimizations require the background service. Showing simulated values.</div></div><Btn size="sm" onClick={() => simulate("Retry service")}>Retry service</Btn></Card>
        <PageHeader title="Maximum Performance" sub="Hardware-aware system latency reduction, resource management, and workload protection." actions={<Btn variant="ghost" onClick={() => setGuide(true)}>Guide</Btn>} />
        <Card className="border-success/30"><div className="flex gap-3.5"><ShieldCheck className="h-6 w-6 shrink-0 text-success" /><div><div className="text-[13px] font-bold">Protected System Optimization · Simulated</div><p className="text-xs text-muted-foreground">Maximum Performance safely reduces unnecessary background CPU overhead without touching core Windows, drivers or your active apps.</p></div></div>
          <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-lg border border-border bg-window">{["Core Windows Safeguarded", "Drivers & Active Apps Shielded", "Reversible via Rollback"].map((x) => <div key={x} className="p-2.5 text-center text-[11.5px] font-semibold text-success">✓ {x}</div>)}</div></Card>
        <StatTiles items={[{ label: "BACKGROUND PROCESSES", value: procs, sub: "Active procs" }, { label: "SERVICE STATUS", value: "Sim", tone: "warning" }, { label: "CPU USAGE", value: "12%", sub: "Utilization" }, { label: "GPU USAGE", value: "9%" }, { label: "RAM USAGE", value: "36%", sub: "Physical memory" }]} />
        <Card glow><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><span className="text-lg font-bold">One-Click System Optimization</span><Badge tone="success">SAFE DEFAULTS</Badge></div><p className="mt-1 text-xs text-muted-foreground">Applies verified system optimizations, priority balancing, memory working-set refresh and background reduction.</p></div><Btn variant="ghost" onClick={() => simulate("Rollback")} title="Restore system configuration to the pre-optimization state">Rollback</Btn></div>
          {r.running && <Bar value={r.progress ?? 0} className="mt-4" />}
          <Btn variant="primary" size="lg" className="mt-4 w-full" disabled={r.running} onClick={() => setConfirmRun(true)}>{r.running ? `Optimizing… ${(r.progress ?? 0).toFixed(0)}%` : "Optimize now"}</Btn></Card>
        <SimNotice />
      </div>
      <Card className="eo-console flex h-fit flex-col"><div className="mb-3 flex items-center justify-between"><Label className="text-foreground">LIVE ACTIVITY</Label><Btn size="sm" variant="ghost" onClick={() => setLog([])}>Clear</Btn></div>
        {log.length ? <div className="space-y-1.5">{log.map((l) => <div key={l} className="rounded-md border border-border bg-window px-2.5 py-2 font-mono text-[11px] text-muted-foreground">{l}</div>)}</div> : <EmptyState title="No activity recorded yet." sub="Real-time optimization events, verifications, and progress will stream here." />}</Card>
      <Modal open={confirmRun} onClose={() => setConfirmRun(false)} title="Review Maximum Performance" sub="Simulated run · No Windows settings will be changed." footer={<><Btn variant="ghost" onClick={() => setConfirmRun(false)}>Cancel</Btn><Btn variant="primary" onClick={() => { setConfirmRun(false); run(); }}>Confirm simulated run</Btn></>}><p className="text-sm text-muted-foreground">Preview the background-workload, memory and scheduling workflow. Sample results do not establish actual performance gains or recovery guarantees.</p></Modal>
      <Modal open={guide} onClose={() => setGuide(false)} title="Maximum Performance guide" sub="Beginner-friendly guide to safe, non-destructive Windows performance optimization." footer={<Btn variant="primary" onClick={() => setGuide(false)}>Got it</Btn>}>
        {[["WHAT MAXIMUM PERFORMANCE OPTIMIZES", "Reduces background CPU contention, releases idle process working sets, and balances priorities."], ["WHAT REMAINS SAFEGUARDED (NEVER TOUCHED)", "Core Windows OS binaries, display drivers, audio engines, network controllers and your active apps."], ["REVERSIBILITY VIA LOCAL ROLLBACK JOURNAL", "Every applied modification is recorded in a transactional journal before execution."], ["BUILT FOR GAMING, EDITING, STREAMING & DAILY USE", "Designed for workload-specific review; no compatibility or performance tests run in this prototype."]].map(([a, b]) => <div key={a} className="mb-3"><Label className="text-cyan">{a}</Label><p className="mt-1 text-xs text-muted-foreground">{b}</p></div>)}
      </Modal>
    </div>
  );
}

/* ───────── EMULATOR OPTIMIZATION SUITE (cols=*,14,350) ───────── */
const ENGINES = [
  { n: "EMULATOR OPTIMIZATION", sub: "Host MMCSS multimedia scheduling, DirectComposition presentation latency and process priority.", tags: ["SCOPE: MMCSS & DIRECT3D", "TARGET: HD-PLAYER.EXE", "SAFE CORE PROFILE", "OFFLINE READY"], desc: "Safely tune MSI App Player for smoother Free Fire gameplay, better frame pacing and lower input delay.", pre: "Applies offline to host or in real-time when emulator is running.", needsAdb: false },
  { n: "EMULATOR DEEP DEBLOATER", sub: "Safe guest package debloat, telemetry suppression & background broadcast cleanup.", tags: ["SHIELDED: BOOT, INPUT & GRAPHICS", "PLAY STORE & FREE FIRE PROTECTED", "PM / APPOPS METHOD", "AUTOMATIC MANIFEST ROLLBACK"], desc: "Deep-clean verified unnecessary emulator apps, packages, and background services.", pre: "Prerequisite: MSI App Player running + Android Debug Bridge connected.", needsAdb: true },
  { n: "ADVANCED EMULATOR OPTIMIZATION", sub: "SurfaceFlinger latch unsignaled, HWUI render threads, Dalvik heap compaction.", tags: ["SURFACEFLINGER LATCH", "HWUI RENDER THREADS", "DALVIK HEAP: 128M / 512M", "CALIBRATED OVERRIDES"], desc: "Apply advanced, hardware-aware emulator tuning for improved rendering and memory behavior.", pre: "Prerequisite: MSI App Player running + Android Debug Bridge connected.", needsAdb: true },
];
const GUIDE_SECTIONS = [["1. Getting Started", "Architecture & sequence"], ["2. Maximum Performance", "Host Windows tuning suite"], ["3. Emulator Optimization", "Engine 1: MMCSS & 240Hz cap"], ["4. Deep Debloater", "Engine 2: Real ADB inventory"], ["5. Advanced Optimization", "Engine 3: SurfaceFlinger & Dalvik"], ["6. MSI & ADB Setup", "Port 5555 & authorization"], ["7. One-Time State", "Persistent store & idempotency"], ["8. Restore & Rollback", "Reversible operations & fixes"]];
export function EmulatorOptimizationPage() {
  const engineTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (engineTimer.current) clearInterval(engineTimer.current); }, []);
  const [pendingEngine, setPendingEngine] = useState<number | null>(null);
  const [adb, setAdb] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [guide, setGuide] = useState(false);
  const [gs, setGs] = useState(0);
  const [running, setRunning] = useState<number | null>(null);
  const [p, setP] = useState(0);
  const push = (s: string) => setLogs((l) => [`${new Date().toLocaleTimeString()}  ${s}`, ...l]);
  const runEngine = (i: number) => {
    setRunning(i); setP(0); push(`${ENGINES[i]?.n}: started (simulated)`);
    let v = 0; const id = setInterval(() => { v += 4; setP(v); if (v >= 100) { clearInterval(id); setRunning(null); push(`${ENGINES[i]?.n}: applied & verified (simulated)`); } }, 70); engineTimer.current = id;
  };
  return (
    <div className="eo-engine-layout grid gap-3.5" style={{ gridTemplateColumns: "minmax(0,1fr) 320px" }}>
      <div className="space-y-4">
        <PageHeader title="Emulator Optimization Suite" badges={<Badge tone="cyan">V4 COMMERCIAL ENGINE</Badge>} sub="Unified MSI App Player 5 & Free Fire performance engine: host scheduling, guest debloat and graphics pipeline." actions={<><Btn variant="ghost" onClick={() => setGuide(true)}>Guide</Btn><Btn variant="ghost" onClick={() => push("Restore all (simulated)")}>Restore all</Btn><Btn onClick={() => { setAdb(!adb); push(adb ? "ADB disconnected (simulated)" : "Sample connection enabled (simulated)"); }}>Recheck connection</Btn></>} />
        <Card className="flex flex-wrap items-center justify-between gap-3 py-3"><div className="flex gap-5 text-[12.5px]">{[["MSI App Player:", adb ? "Running" : "Not running"], ["Android Debug Bridge:", adb ? "Connected" : "Offline"], ["Guest Subsystem:", adb ? "Android 9 · x86_64" : "—"]].map(([k, v]) => <span key={k}>{k} <b className={adb ? "text-success" : "text-warning"}>{v}</b></span>)}</div><Btn size="sm" variant="ghost" onClick={() => setAdb(!adb)}>Recheck</Btn></Card>
        <Link to="/$page" params={{ page: "emulator-modules" }} className="block rounded-lg border border-border bg-window px-4 py-2.5 text-[11.5px] text-muted-foreground hover:border-cyan/40 hover:text-cyan">MSI App Player 5 · Open module hub →</Link>
        {ENGINES.map((e, i) => {
          const blocked = e.needsAdb && !adb;
          return (
            <Card key={e.n} className={cn(running === i && "eo-glow")}>
              <div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><Badge tone="cyan">ENGINE {i + 1}</Badge><h3 className="text-[15px] font-bold tracking-wide">{e.n}</h3></div><p className="mt-1 text-xs text-muted-foreground">{e.desc}</p></div></div>
              <div className="mt-3"><Details title="ENGINE TECHNICAL DETAILS"><p className="text-xs text-muted-foreground">{e.sub}</p><div className="mt-3 flex flex-wrap gap-1.5">{e.tags.map((t) => <Badge key={t}>{t}</Badge>)}</div></Details></div>
              <p className="mt-3 text-[13px]">{e.desc}</p>
              {i === 2 && <p className="mt-2 rounded-md border border-warning/30 bg-warning/5 p-2 text-[11px] text-warning">SurfaceFlinger latch overrides bypass buffer fence synchronization for lower latency. Calibrated per hardware tier.</p>}
              {running === i && <div className="mt-3"><Bar value={p} /><div className="mt-1 text-[10.5px] text-cyan">Applying… {p}%</div></div>}
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3"><span className={cn("text-[11px]", blocked ? "text-warning" : "text-subtle")}>{e.pre}</span><div className="flex gap-2"><Btn size="sm" variant="ghost" onClick={() => push(`${e.n}: restored (simulated)`)}>Restore</Btn><Btn size="sm" variant="primary" disabled={blocked || running !== null} onClick={() => setPendingEngine(i)}>{i === 1 ? "Scan & debloat" : "Apply"}</Btn></div></div>
            </Card>);
        })}
        <SimNotice>No emulator, ADB connection or Android guest is touched — connection state is a toggle for demonstration.</SimNotice>
      </div>
      <Card className="eo-console sticky top-0 flex h-fit max-h-[80vh] flex-col"><div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><Label className="text-foreground">LIVE LOGS</Label><Badge tone="success">ACTIVE</Badge></div><Btn size="sm" variant="ghost" onClick={() => setLogs([])}>Clear</Btn></div>
        <div className="space-y-1 overflow-y-auto">{logs.length ? logs.map((l) => <div key={l} className="rounded border border-border bg-background px-2 py-1.5 font-mono text-[10.5px] text-muted-foreground">{l}</div>) : <EmptyState title="No activity recorded yet." sub="Click 'RECHECK CONNECTION' or run an optimization." />}</div></Card>
      <Modal open={pendingEngine !== null} onClose={() => setPendingEngine(null)} title={pendingEngine !== null ? ENGINES[pendingEngine]?.n ?? "Engine review" : "Engine review"} sub="Simulated engine · No emulator settings or packages will be changed." footer={<><Btn variant="ghost" onClick={() => setPendingEngine(null)}>Cancel</Btn><Btn variant="primary" onClick={() => { if (pendingEngine !== null) runEngine(pendingEngine); setPendingEngine(null); }}>Confirm simulated run</Btn></>}><p className="text-sm text-muted-foreground">Review the engine scope and prerequisites before continuing. Verification and restore outcomes are illustrative.</p></Modal>
      <Modal open={guide} onClose={() => setGuide(false)} title="Error Optimizer V4 — Architecture & optimization guide" sub="Technical reference for host & guest optimization engines" width="max-w-5xl" footer={<><Btn variant="ghost" disabled={gs === 0} onClick={() => setGs(gs - 1)}>Previous section</Btn><Btn variant="ghost" disabled={gs === 7} onClick={() => setGs(gs + 1)}>Next section</Btn><Btn variant="primary" onClick={() => setGuide(false)}>Close guide</Btn></>}>
        <div className="grid gap-5" style={{ gridTemplateColumns: "240px 1fr" }}>
          <div className="space-y-1"><Label className="mb-2">GUIDE SECTIONS</Label>{GUIDE_SECTIONS.map(([t, s], i) => <button key={t} onClick={() => setGs(i)} className={cn("block w-full rounded-lg border-l-[3px] px-3 py-2 text-left", gs === i ? "border-cyan bg-cyan/10" : "border-transparent hover:bg-elevated")}><div className="text-[12.5px] font-semibold">{t}</div><div className="text-[10.5px] text-subtle">{s}</div></button>)}</div>
          <div className="rounded-xl border border-border bg-window p-5"><div className="text-lg font-bold">{GUIDE_SECTIONS[gs]?.[0]}</div><p className="mt-2 text-sm text-muted-foreground">{["Recommended sequence: 1) Host Maximum Performance, 2) Launch MSI App Player 5 & verify ADB, 3) Engine 1, 4) Engine 2, 5) Engine 3.", "Transforms the Windows host: MMCSS scheduling, 0.5 ms timer clamp, safe process intelligence with zero arbitrary killing, accurate process counting.", "Host process elevation (HD-Player.exe), frame-rate unlock and pre-launch vs live modes.", "Authentic guest discovery via ADB, ironclad essential component protection, safe disabling instead of deleting APKs.", "Latch-unsignaled rendering, HWUI render pipeline tuning and Dalvik heap compaction. Never edits emulator config files.", "Open MSI App Player Settings → Preferences → toggle Android Debug Bridge ON → authorize the USB debugging prompt.", "One-time optimization with preflight idempotency verification; card states NOT RUN / APPLIED / VERIFIED.", "Unified rollback from the header, per-engine restore and diagnostic troubleshooting."][gs]}</p></div>
        </div>
      </Modal>
    </div>
  );
}

/* ───────── MSI APP PLAYER 5 MODULE HUB (MsiAppPlayerPage) ───────── */
const MODULES = [
  { k: "EMULATOR OPTIMIZATION", n: "Emulator Optimization", tag: "SUPPORTED", sub: "Hardware-aware performance tuning & scheduling", suit: "Universal (All PCs · Balanced & Performance)", list: ["Windows MMCSS multimedia gaming scheduler", "Guest process CPU priority & affinity balance", "Direct3D 11 / Vulkan render pipeline synchronization", "Reversible configuration discovery with full rollback"], foot: "Zero binary patches · No anti-cheat circumvention · Protected configs" },
  { k: "DEEP DEBLOATER", n: "Emulator Deep Debloater", tag: "CLEANUP", sub: "Package, telemetry & background bloat cleanup", suit: "Recommended for all systems needing disk & RAM relief", list: ["Scans packages, background services & temporary caches", "Distinguishes safe findings from system-essential services", "Disables analytics, promotional services & ad components", "One-click restore reverses all disabled packages safely"], foot: "Read-only protection for emulator config files · No destructive deletion" },
  { k: "LOW-END EXTREME", n: "Low-End Extreme", tag: "ENTRY-LEVEL", sub: "Low-spec resource relief & memory compaction", suit: "Dual/Quad-Core CPUs · 4–8 GB RAM · Integrated GPUs", list: ["SurfaceFlinger latch: latches buffers immediately", "Dalvik heap growth limit: relieves guest memory pressure", "Trims non-essential background guest threads and memory", "Reversible guest-level properties with instant undo"], foot: "Hardware-aware estimates · No guaranteed FPS claims · Unprivileged & safe" },
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
  if (!mod) return (
    <div className="space-y-4">
      <PageHeader title="Emulator Optimization" sub="Hardware-aware performance tuning, component debloater, and low-end hardware relief for MSI App Player 5." actions={<Btn variant="ghost" onClick={() => setGuide(true)}>Guide</Btn>} />
      <Card className="flex items-center gap-3 py-3"><Badge tone="cyan">MSI APP PLAYER 5</Badge><span className="text-xs text-muted-foreground">Select a module below to inspect findings, customize settings, and apply changes.</span></Card>
      <div className="grid grid-cols-3 gap-3">{MODULES.map((m, i) => <Card key={m.k} className="flex flex-col"><div className="flex items-center justify-between"><Label className="flex items-center gap-2 text-cyan"><Layers className="h-4 w-4" />MODULE 0{i + 1}</Label><Badge tone="success">{m.tag}</Badge></div><h3 className="mt-2 text-lg font-bold">{m.n}</h3><p className="text-xs text-muted-foreground">{m.sub}</p><div className="mt-3 text-[11.5px]"><span className="text-subtle">Suitability:</span> {m.suit}</div><Label className="mt-4 mb-1.5">{i === 1 ? "WHAT THIS MODULE CLEANS:" : "WHAT THIS MODULE TUNES:"}</Label><ul className="flex-1 space-y-1 text-[12px] text-muted-foreground">{m.list.map((l) => <li key={l}>• {l}</li>)}</ul><p className="mt-3 text-[10.5px] text-success">{m.foot}</p><Btn variant="primary" className="mt-4 w-full" onClick={() => setMod(m.k)}>Open {m.n}</Btn></Card>)}</div>
      <Card className="flex items-center justify-between py-3"><span className="text-xs text-success">SIMULATED MODULES · Recovery depends on operation support; emulator configuration files are not touched.</span><span className="text-[10px] font-bold tracking-widest text-subtle">ERROR OPTIMIZER V4 · EMULATOR SUITE</span></Card>
      <SimNotice />
      <Modal open={guide} onClose={() => setGuide(false)} title="Emulator optimization guide" sub="How ERROR OPTIMIZER accelerates MSI App Player 5 safely" footer={<Btn variant="primary" onClick={() => setGuide(false)}>Got it</Btn>}>{[["1. THREE DEDICATED MODULES", "Emulator Optimization for balanced daily tuning, Deep Debloater for cleanup, Low-End Extreme for weak hardware."], ["2. REVIEW BEFORE APPLYING", "Click 'Review Changes' to see every planned change."], ["3. APPLY SAFELY", "Click 'Apply Optimizations' to execute the profile; core config files stay untouched."], ["4. REVERSIBILITY & ROLLBACK", "Every applied change can be rolled back at any time."]].map(([a, b]) => <div key={a} className="mb-3"><Label className="text-cyan">{a}</Label><p className="text-xs text-muted-foreground">{b}</p></div>)}</Modal>
    </div>
  );
  return (
    <div className="space-y-4 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3"><Btn variant="ghost" onClick={() => setMod(null)}>← Back to overview</Btn><Chips options={MODULES.map((m) => m.k)} value={mod} onChange={setMod} /><Btn size="sm" onClick={() => simulate("Rescan")}>Rescan</Btn></div>
      <Card className="flex items-center justify-between py-3"><div className="flex items-center gap-3"><Badge tone="cyan">MSI APP PLAYER 5</Badge><span className="text-xs text-muted-foreground">Tuning applies supported Win32 MMCSS multimedia scheduling and thread priority.</span></div><span className="text-[11.5px]">ADB: <b className="text-warning">Offline (simulated)</b></span></Card>
      {mod === "EMULATOR OPTIMIZATION" && (<>
        <div className="flex justify-end gap-2"><Btn size="sm" onClick={() => setProfile("BALANCED PROFILE")}>Use recommended</Btn><Btn size="sm" onClick={() => setReview(true)}>Review changes</Btn></div>
        <Cols cols="1fr 1fr">{[["BALANCED PROFILE", "Universal configuration for everyday smooth gaming", "A conservative, stable starting point focused on compatibility and consistent frame pacing.", "Universal (All PCs, 4GB+ RAM)"], ["PERFORMANCE PROFILE", "Maximum responsiveness for capable gaming PCs", "Aggressive MMCSS priority scheduling and dedicated core affinity.", "Mid to High-End (8GB+ RAM, Dedicated GPU)"]].map(([n, a, b, t]) => <button key={n} onClick={() => setProfile(n ?? "")} className={cn("eo-card p-5 text-left transition-all", profile === n && "border-cyan/60 eo-glow")}><div className="flex items-center justify-between"><span className="eo-label text-foreground">{n}</span><span className="flex gap-1.5">{n === "BALANCED PROFILE" && <Badge tone="cyan">★ RECOMMENDED</Badge>}<RiskBadge risk="LOW" /></span></div><div className="mt-2 text-sm font-bold">{a}</div><p className="mt-1 text-xs text-muted-foreground">{b}</p><div className="mt-3 flex justify-between text-[11px]"><span className="text-subtle">Target: {t}</span><span className="text-cyan">View details →</span></div></button>)}</Cols>
        <Cols cols="1fr 1fr"><Card><div className="mb-3 flex items-center justify-between"><Label className="text-foreground">PERFORMANCE ASSESSMENT</Label><Badge tone="warning">MODEL ESTIMATE — NOT A BENCHMARK</Badge></div><div className="grid grid-cols-2 gap-3 text-[12.5px]">{[["HARDWARE TIER", "High-end"], ["SUITABILITY", "Optimal for Balanced & Performance"], ["CONFIDENCE", "Sample value"], ["RECOMMENDED PROFILE", "Balanced"]].map(([k, v]) => <div key={k}><Label className="text-[9px]">{k}</Label><div className="font-semibold">{v}</div></div>)}</div><p className="mt-3 text-[11px] text-subtle">Hardware assessment is an offline diagnostic calculation.</p><Btn size="sm" className="mt-3" onClick={() => setBench(true)}>High-FPS runtime test</Btn></Card>
          <Card><Label className="mb-2 text-foreground">PLANNED OPTIMIZATIONS FOR PROFILE</Label><div className="space-y-1.5">{["MMCSS Games task priority", "HD-Player process priority", "Core affinity balance", "Presentation latency"].map((x) => <div key={x} className="rounded-md border border-border bg-window px-3 py-2 text-[12px]">{x}</div>)}</div></Card></Cols>
        <StatTiles items={[{ label: "SCANNED", value: 12 }, { label: "SAFE ITEMS", value: 9, tone: "success" }, { label: "APPLIED", value: 0 }, { label: "ROLLED BACK", value: 0 }, { label: "HEALTH STATUS", value: "HEALTHY", sub: "(Sample)", tone: "success" }]} />
      </>)}
      {mod === "DEEP DEBLOATER" && (<Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><Btn variant="primary" onClick={() => scan.start(() => setScanned(true))}>Scan emulator</Btn><div className="flex gap-1.5"><Btn size="sm" onClick={() => setSelected(new Set(["Promotional app center", "Analytics broadcast receiver", "Ad SDK service"]))}>Select all safe</Btn><Btn size="sm" onClick={() => setSelected(new Set(["Promotional app center", "Analytics broadcast receiver"]))}>Select recommended</Btn><Btn size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear selection</Btn></div></div>
        <p className="mb-3 text-[11px] text-success">100% Read-Only Protected Configs · Reversible package disabling</p>
        {scan.running && <><Bar value={scan.progress ?? 0} /><p className="mt-1 text-[11px] text-cyan">Scanning full emulator stack…</p></>}
        {!scanned && !scan.running && <EmptyState title="NO EMULATOR COMPONENTS SCANNED YET" sub="Click 'Scan Emulator' to inspect installed packages, services, caches and telemetry." action={<Btn onClick={() => scan.start(() => setScanned(true))}>Scan emulator components</Btn>} />}
        {scanned && <div className="space-y-1.5">{[["Promotional app center", "SAFE"], ["Analytics broadcast receiver", "SAFE"], ["Ad SDK service", "SAFE"], ["Google Play Store", "PROTECTED"], ["Free Fire", "PROTECTED"], ["Input method service", "PROTECTED"]].map(([n, r]) => <div key={n} className="flex items-center gap-3 rounded-lg border border-border bg-window px-3 py-2.5 text-[12.5px]">{r !== "PROTECTED" ? <Check label={`Select ${n}`} on={selected.has(n ?? "")} onChange={(v) => setSelected((current) => { const next = new Set(current); if (v) next.add(n ?? ""); else next.delete(n ?? ""); return next; })} /> : <span className="w-4" />}<span className="flex-1">{n}</span><RiskBadge risk={r as "SAFE"} /></div>)}</div>}
      </Card>)}
      {mod === "LOW-END EXTREME" && (<>
        <Card><div className="flex items-start justify-between"><div><Label className="text-foreground">LOW-END EXTREME HARDWARE TARGETING</Label><p className="mt-1 text-xs text-muted-foreground">Calibrated for Dual-Core / Quad-Core CPUs, Intel HD/UHD integrated graphics and 4–8 GB RAM.</p></div><Badge tone="success">UNPRIVILEGED (SAFE)</Badge></div></Card>
        <Cols cols="1fr 1fr"><Card><Label className="text-cyan">SURFACEFLINGER LATCH TWEAK</Label><p className="mt-1 text-xs text-muted-foreground">Instructs the Android compositor to latch graphics buffers immediately without waiting for fences.</p></Card><Card><Label className="text-cyan">DALVIK HEAP COMPACTION</Label><p className="mt-1 text-xs text-muted-foreground">Tightens Android heap boundaries and triggers active page trimming to relieve memory pressure.</p></Card></Cols>
        <Card><div className="mb-3 flex items-center justify-between"><Btn onClick={() => scan.start(() => setScanned(true))}>Scan candidates</Btn><label className="flex items-center gap-2 text-xs"><Toggle on={risky} onChange={setRisky} />Allow Advanced Risky Tweaks (Disabled by default)</label></div>
          {scan.running && <Bar value={scan.progress ?? 0} />}
          <div className="space-y-1.5">{[["Compositor buffer timing", "LOW"], ["Guest memory growth limit", "LOW"], ["Background guest thread trim", "LOW"], ["Aggressive HWUI render override", "HIGH"]].filter((x) => risky || x[1] !== "HIGH").map(([n, r]) => <div key={n} className="flex items-center gap-3 rounded-lg border border-border bg-window px-3 py-2.5 font-mono text-[12px]"><Check label={`Select ${n}`} on={selected.has(n ?? "")} onChange={(v) => setSelected((current) => { const next = new Set(current); if (v) next.add(n ?? ""); else next.delete(n ?? ""); return next; })} /><span className="flex-1">{n}</span><RiskBadge risk={r as "LOW"} /></div>)}</div></Card>
      </>)}
      <div className="sticky bottom-0 -mx-6 flex items-center justify-between border-t border-border bg-window/95 px-6 py-3 backdrop-blur"><span className="text-xs text-muted-foreground">Active Module: <b className="text-foreground">{mod}</b> · Ready to optimize emulator</span>
        <div className="flex gap-2">{mod === "EMULATOR OPTIMIZATION" ? <><Btn onClick={() => setReview(true)}>Review changes</Btn><Btn variant="primary" onClick={() => simulate("Apply optimizations")}>Apply optimizations</Btn><Btn variant="ghost" onClick={() => simulate("Rollback")}>Rollback</Btn></> : mod === "DEEP DEBLOATER" ? <><Btn variant="primary" disabled={!scanned || !selected.size} onClick={() => simulate(`Apply ${selected.size} selected sample debloat items`)}>Apply selected debloat</Btn><Btn variant="ghost" onClick={() => simulate("Restore debloat")}>Restore debloat</Btn></> : <><Btn variant="primary" disabled={!selected.size} onClick={() => simulate(`Apply ${selected.size} selected sample low-end items`)}>Apply low-end changes</Btn><Btn variant="ghost" onClick={() => simulate("Undo changes")}>Undo changes</Btn></>}</div></div>
      <Modal open={review} onClose={() => setReview(false)} title="Review planned optimizations" footer={<><Btn variant="ghost" onClick={() => setReview(false)}>Cancel</Btn><Btn variant="primary" onClick={() => { setReview(false); simulate("Apply these changes"); }}>Apply these changes</Btn></>}><div className="space-y-1.5">{["MMCSS Games task priority", "HD-Player process priority", "Core affinity balance", "Presentation latency"].map((x) => <div key={x} className="flex justify-between rounded-md border border-border bg-window px-3 py-2 text-[12.5px]"><span>{x}</span><RiskBadge risk="LOW" /></div>)}</div><p className="mt-3 text-[11px] text-muted-foreground">All planned changes are verified safe and reversible before execution.</p></Modal>
      <Modal open={bench} onClose={() => setBench(false)} title="High-FPS runtime test & A/B benchmark" sub="30-second real runtime capture (simulated)" footer={<Btn onClick={() => setBench(false)}>Close</Btn>}><div className="grid grid-cols-3 gap-2">{[["GAMETRUTH FPS", "—"], ["1% LOW FPS", "—"], ["HOST PRESENTED", "—"]].map(([k, v]) => <div key={k} className="rounded-lg border border-border bg-window p-3 text-center"><div className="text-xl font-bold">{v}</div><div className="text-[9px] font-bold tracking-widest text-subtle">{k}</div></div>)}</div><Btn variant="primary" className="mt-4" onClick={() => simulate("Run benchmark (30s)")}>Run benchmark (30s)</Btn><p className="mt-3 text-[11px] text-success">Safety verified: instance files and emulator configuration files remain untouched.</p></Modal>
    </div>
  );
}

/* ───────── V4 DASHBOARD (V4DashboardView — not reachable from V4 top nav) ───────── */
export function V4DashboardPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="V4 Suite" actions={<Btn variant="ghost" onClick={() => simulate("Refresh")}>Refresh</Btn>} />
      <div className="grid grid-cols-3 gap-3">{[["MAXIMUM PERFORMANCE", "Safely reduce unnecessary background workload and optimize Windows for gaming, editing and streaming.", "v4-max-performance"], ["PERFORMANCE TUNING", "Optional CPU and GPU performance tuning for supported hardware.", "performance-tuning"], ["EMULATOR OPTIMIZATION", "Optimize MSI App Player 5 for higher and smoother verified performance.", "emulator-optimization"]].map(([t, d, s]) => <Card key={t} className="flex flex-col"><Cpu className="mb-4 h-7 w-7 text-cyan" /><div className="eo-label text-foreground">{t}</div><p className="mt-2 flex-1 text-xs text-muted-foreground">{d}</p><Link to="/$page" params={{ page: s ?? "" }} className="mt-4"><Btn variant="primary" className="w-full">Open</Btn></Link></Card>)}</div>
      <Card className="grid items-center gap-4" style={{ gridTemplateColumns: "1fr auto 1fr auto 1fr" } as React.CSSProperties}><div><Label>PROCESSOR</Label><div className="text-sm font-semibold">{HW.cpu}</div></div><div className="h-8 w-px bg-border" /><div><Label>GRAPHICS</Label><div className="text-sm font-semibold">{HW.gpu}</div></div><div className="h-8 w-px bg-border" /><div><Label>SYSTEM MEMORY</Label><div className="text-sm font-semibold">{HW.ram}</div></div></Card>
    </div>
  );
}

/* ───────── V4 CORE OPTIMIZER (V4OptimizationView) ───────── */
export function V4CoreOptimizerPage() {
  const r = useSimRun(2500);
  const [done, setDone] = useState(false);
  return (
    <div className="space-y-4">
      <PageHeader title="V4 Core Optimizer" badges={<Badge tone="cyan">MAXIMUM PERFORMANCE</Badge>} sub="Automated safe background reduction and gaming & editing performance tuning." actions={<Btn onClick={() => simulate("Scan")}>Scan</Btn>} />
      <Card glow><div className="flex items-start justify-between gap-4"><div><div className="text-lg font-bold">Maximum Performance Optimizer</div><p className="text-xs text-muted-foreground">Iteratively converges background footprint to a safe minimum while shielding Windows, games and editing tools.</p><div className="mt-3 flex gap-1.5"><Badge tone="success">Windows Protected</Badge><Badge tone="success">Gaming Protected</Badge><Badge tone="success">Editing Protected</Badge></div></div><Btn variant="primary" size="lg" disabled={r.running} onClick={() => r.start(() => setDone(true))}>Maximum optimize</Btn></div>{r.running && <Bar value={r.progress ?? 0} className="mt-4" />}</Card>
      <Cols cols="1fr 1fr" gap={16}><Card><Label className="text-foreground">Target Band</Label><div className="mt-2 text-xs text-muted-foreground">TARGET BACKGROUND FOOTPRINT</div><Bar value={55} className="mt-2" /></Card><Card><Label className="text-foreground">Live Process Count</Label><div className="mt-2 flex items-baseline gap-3"><span className="text-3xl font-bold">{done ? 118 : 142}</span><span className="text-xs text-muted-foreground">SYSTEM WORKLOAD</span>{done && <Badge tone="success">↓ -24 OPTIMIZED</Badge>}</div><Bar value={done ? 45 : 70} tone={done ? "success" : "warning"} className="mt-2" /><div className="mt-1 text-[11px] text-subtle">Optimal safe base</div></Card></Cols>
      <Card><div className="mb-3 flex items-center justify-between"><Label className="text-foreground">Actions Applied</Label><span className="text-xs text-cyan">View Details</span></div><div className="overflow-hidden rounded-lg border border-border"><div className="grid bg-window px-3 py-2 eo-label text-[9px] text-subtle" style={{ gridTemplateColumns: "2fr 2fr 1.5fr 1.5fr" }}><span>PROCESS / SERVICE</span><span>ACTION TAKEN</span><span>STATE</span><span>TIMESTAMP</span></div>{done && [["OneDrive.exe", "Priority lowered", "Verified"], ["SearchIndexer", "Deferred", "Verified"]].map((r) => <div key={r[0]} className="grid border-t border-border px-3 py-2 text-[12px]" style={{ gridTemplateColumns: "2fr 2fr 1.5fr 1.5fr" }}><span>{r[0]}</span><span>{r[1]}</span><Badge tone="success">{r[2]}</Badge><span className="font-mono text-subtle">now</span></div>)}</div></Card>
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
      <PageHeader title="Emulator Deployer & Debloater" badges={<Badge tone="success">PROTECTED CORE SAFEGUARDED</Badge>} sub="Whole-stack emulator deployer & component debloater." actions={<><Btn variant="ghost" onClick={() => setPreview(true)}>Preview</Btn><Btn variant="ghost" onClick={() => simulate("Verify")}>Verify</Btn><Btn variant="ghost" onClick={() => simulate("Restore")}>Restore</Btn><Btn onClick={() => simulate("Scan emulator")}>Scan emulator</Btn></>} />
      <Card className="py-3 text-[12.5px]">STATUS: <b className="text-warning">Idle (simulated)</b></Card>
      <StatTiles items={[{ label: "TOTAL SCANNED", value: 48, sub: "Components analyzed" }, { label: "PROTECTED", value: 14, sub: "Locked & preserved", tone: "cyan" }, { label: "SAFE REMOVABLE", value: 21, sub: "Zero risk candidates", tone: "success" }, { label: "AGGRESSIVE OPT.", value: 6, sub: "Advanced optional", tone: "warning" }, { label: "EST. RECLAIM", value: "1.2 GB", sub: "Sample inventory estimate" }]} />
      <Card><div className="mb-3 flex flex-wrap items-center gap-4 text-[11px]">{["CATEGORY:", "TARGET:", "SAFETY:"].map((k) => <label key={k} className="flex items-center gap-2"><Label>{k}</Label><select aria-label={k} value={k === "SAFETY:" ? safety : "All"} onChange={(e) => k === "SAFETY:" ? setSafety(e.target.value) : simulate("Sample inventory scope")} className="h-8 rounded-md border border-border bg-window px-2 text-xs"><option>All</option>{k === "SAFETY:" && <><option>SAFE</option><option>PROTECTED</option></>}</select></label>)}<span className="ml-auto">ELIGIBLE: <b>27</b> · BLOCKED / PROTECTED: <b>14</b></span></div>
        <div className="space-y-1.5">{[["Promotional launcher", "SAFE"], ["Telemetry agent", "SAFE"], ["Play Store", "PROTECTED"]].filter((x) => safety === "All" || x[1] === safety).map(([n, r]) => <div key={n} className="flex justify-between rounded-lg border border-border bg-window px-3 py-2.5 text-[12.5px]"><span>{n}</span><RiskBadge risk={r as "SAFE"} /></div>)}</div></Card>
      <Card className="flex items-center justify-between"><div><div className="text-[13px] font-semibold">Ready to deploy and debloat emulator</div><p className="text-xs text-muted-foreground">Protected components are strictly preserved. Reversible registry, service and package changes only.</p></div><Btn variant="primary" onClick={() => simulate("Deploy & debloat")}>Deploy & debloat</Btn></Card>
      <SimNotice />
      <Modal open={preview} onClose={() => setPreview(false)} title="Debloat preview audit" footer={<Btn onClick={() => setPreview(false)}>Close preview</Btn>}><pre className="rounded-lg bg-background p-3 font-mono text-[11px] text-muted-foreground">[preview] 21 safe candidates{"\n"}[preview] 14 protected (skipped){"\n"}[preview] no files will be deleted</pre></Modal>
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
      <PageHeader title="Low End Steam" badges={<Badge tone="cyan">LOW-SPEC HARDWARE CALIBRATED</Badge>} sub="Conservative, hardware-calibrated emulator optimizations for Dual-Core and Quad-Core systems." actions={<><Btn variant="ghost" onClick={() => setGuide(true)}>Guide</Btn><Btn onClick={() => simulate("Scan candidates")}>Scan candidates</Btn></>} />
      <Card className="flex items-center justify-between py-3"><span className="text-[12.5px]">ADB: <b className="text-warning">Offline (simulated)</b></span><span className="text-xs text-muted-foreground">Calibrated for Dual-Core / Quad-Core CPUs and Intel Integrated GPUs.</span><Badge tone="success">UNPRIVILEGED (SAFE)</Badge></Card>
      <Card><div className="mb-3 flex items-center gap-4"><Label>SUBSYSTEM:</Label><select aria-label="Subsystem" value={subsystem} onChange={(e) => setSubsystem(e.target.value)} className="h-8 rounded-md border border-border bg-window px-2 text-xs"><option>All</option><option>SurfaceFlinger</option><option>Dalvik</option></select><label className="ml-auto flex items-center gap-2 text-xs"><Toggle on={risky} onChange={setRisky} />Allow Advanced Risky Tweaks (Disabled by default)</label></div>
        <div className="space-y-1.5">{["SurfaceFlinger latch", "Dalvik heap growth limit", "Guest background thread trim"].filter((n) => subsystem === "All" || n.startsWith(subsystem)).map((n) => <div key={n} className="flex justify-between rounded-lg border border-border bg-window px-3 py-2.5 text-[12.5px]"><span>{n}</span><RiskBadge risk="LOW" /></div>)}</div>
        <p className="mt-3 text-[11px] text-warning">SurfaceFlinger and Dalvik tweaks strictly require ADB connection.</p></Card>
      <Card className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Ready to optimize emulator · ELIGIBLE: 3 · BLOCKED: 0</span><div className="flex gap-2"><Btn variant="primary" onClick={() => simulate("Optimize")}>Optimize</Btn><Btn variant="ghost" onClick={() => simulate("Restore")}>Restore</Btn></div></Card>
      <SimNotice />
      <Modal open={guide} onClose={() => setGuide(false)} title="Low End Steam guide" sub="Simulated low-spec emulator review." footer={<Btn onClick={() => setGuide(false)}>Close</Btn>}><p className="text-sm text-muted-foreground">Review compositor timing and guest memory options. The original operations require an emulator connection; this prototype does not connect or measure performance.</p></Modal>
    </div>
  );
}
