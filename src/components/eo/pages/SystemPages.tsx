// InputOptimizerView, SystemInfoView, RegistryTweakView, RegistryValuesView, RegistryValuesRamView, GpuRegistryValuesView
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Badge, Bar, Btn, Card, Check, Chips, Cols, Details, KV, Label, Modal, PageHeader, RiskBadge, SearchBox, SectionTitle, SimNotice, StatTiles, simulate, useSimRun } from "../kit";
import { RunModal } from "../RunModal";
import { toggleInSet } from "@/lib/eo/selection";
import { CATALOG, HW } from "@/lib/eo/data";
import { cn } from "@/lib/utils";

/* ───────── INPUT OPTIMIZER ───────── */
const NORMAL_INPUT = ["Disable mouse acceleration (1:1 raw pointer)", "Keyboard repeat rate maximization", "Keyboard repeat delay minimum", "Mouse hover time reduction"];
const ADV_INPUT = ["Mouse data queue size", "Keyboard data queue size", "High-precision timer request", "USB selective suspend (input devices)"];
export function InputOptimizerPage() {
  const [mode, setMode] = useState("NORMAL");
  const [sel, setSel] = useState<Set<string>>(new Set());
  const test = useSimRun(2500);
  const [run, setRun] = useState(false);
  const [tested, setTested] = useState(false);
  const List = ({ title, sub, items }: { title: string; sub: string; items: string[] }) => (
    <Card>
      <div className="mb-3 flex items-start justify-between"><div><Label className="text-foreground">{title}</Label><p className="mt-1 text-xs text-muted-foreground">{sub}</p></div>
        <div className="flex items-center gap-1.5"><Badge>Applicable: {items.length}</Badge><Badge tone="success">Optimized: 1</Badge><Badge tone="warning">Pending: {items.length - 1}</Badge></div></div>
      {mode === "CUSTOM" && <div className="mb-2 flex gap-1.5"><Btn size="sm" onClick={() => setSel((s) => new Set([...s, ...items]))}>Select all</Btn><Btn size="sm" variant="ghost" onClick={() => setSel((s) => new Set([...s].filter((x) => !items.includes(x))))}>Deselect all</Btn></div>}
      <div className="space-y-1.5">{items.map((i, n) => <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-window px-3 py-2.5 text-[12.5px]">{mode === "CUSTOM" && <Check on={sel.has(i)} onChange={() => setSel((s) => { return toggleInSet(s, i); })} />}<span className="flex-1">{i}</span>{n === 0 ? <Badge tone="success">OPTIMIZED</Badge> : <Badge tone="warning">PENDING</Badge>}</div>)}</div>
    </Card>
  );
  return (
    <div className="space-y-4">
      <PageHeader title="Input Optimizer" badges={<Badge tone="cyan">LATENCY REDUCTION ENGINE</Badge>} sub="Hardware-level pointer precision, repeat rates, timer resolution, and input jitter optimization." actions={<><Btn variant="ghost" onClick={() => simulate("Refresh")}>Refresh</Btn><Btn variant="ghost" onClick={() => simulate("Restore defaults")}>Restore defaults</Btn></>} />
      <div className="grid grid-cols-4 gap-3">{[["MOUSE", "Acceleration & Curves", "1:1 LINEAR"], ["KEYBOARD", "Repeat Rate & Buffer", "31 / 0"], ["TIMER RES", "Kernel Clock Interval", "0.5 ms"], ["STABILITY", "Measured Jitter Variance", "0.08 ms"]].map(([a, b, c]) => <Card key={a} className="p-4"><Label className="text-cyan">{a}</Label><div className="mt-2 text-xl font-bold">{c}</div><div className="text-[11px] text-subtle">{b}</div></Card>)}</div>
      <Card className="flex items-center justify-between gap-4"><div><Label className="text-foreground">AIM-SHAKE DIAGNOSIS</Label><p className="mt-1 text-xs text-muted-foreground">Evaluates 1:1 MarkC linear curves, zero acceleration thresholds, and frame-time jitter.</p></div><Badge tone="success">NO AIM-SHAKE DETECTED</Badge></Card>
      <Card className="flex items-center justify-between gap-4"><p className="text-xs text-muted-foreground">Select between automatic safe tuning (Normal) or granular itemized control (Custom).</p><Chips options={["NORMAL", "CUSTOM"]} value={mode} onChange={setMode} /></Card>
      <Cols cols="1fr 1fr">
        <List title="NORMAL INPUT OPTIMIZATION" sub="Safe, policy-approved input tuning available for this system." items={NORMAL_INPUT} />
        <List title="ADVANCED INPUT OPTIMIZATION" sub="Deeper system-level input tuning for users who want fine-grained control." items={ADV_INPUT} />
      </Cols>
      <Card><SectionTitle title="REAL INPUT TEST & JITTER MEASUREMENT" sub="Sample input-test flow — no physical input measurements are captured." right={["5 SEC TEST", "10 SEC TEST", "30 SEC TEST"].map((x) => <Btn key={x} size="sm" disabled={test.running} onClick={() => test.start(() => setTested(true))}>{x}</Btn>)} />
        {test.running && <Bar value={test.progress ?? 0} className="mb-3" />}
        <StatTiles items={[{ label: "SAMPLES", value: "—" }, { label: "AVG INTERVAL", value: "—" }, { label: "FREQUENCY", value: "—" }, { label: "JITTER", value: "—", tone: "success" }, { label: "TIMER RES", value: "0.5 ms" }]} />
        <p className="mt-2 text-[10.5px] text-warning">{tested ? "Simulated test finished. No measurements were collected." : "Run the simulated test to preview its progress; real results require the native app."}</p>
      </Card>
      <Card><SectionTitle title="ILLUSTRATIVE BEFORE / AFTER STATES" sub="Demo values only — not benchmark results or evidence of an improvement." />
        <Cols cols="1fr 40px 1fr"><div className="rounded-lg border border-border bg-window p-3"><Label className="mb-2">BEFORE OPTIMIZATION</Label><KV k="Polling Rate:" v="500 Hz" /><KV k="Timer Resolution:" v="15.6 ms" /><KV k="Measured Jitter:" v="0.42 ms" /></div><div className="flex items-center justify-center text-cyan">→</div><div className="rounded-lg border border-success/30 bg-window p-3"><Label className="mb-2 text-success">AFTER OPTIMIZATION</Label><KV k="Polling Rate:" v="1000 Hz" /><KV k="Timer Resolution:" v="0.5 ms" /><KV k="Measured Jitter:" v="0.08 ms" /></div></Cols>
      </Card>
      <div className="flex justify-end"><Btn variant="primary" disabled={mode === "CUSTOM" && !sel.size} onClick={() => setRun(true)}>Review input settings</Btn></div>
      <RunModal open={run} onClose={() => setRun(false)} profile="Input Optimizer" count={mode === "NORMAL" ? NORMAL_INPUT.length : sel.size} />
      <Details title="VIEW TECHNICAL DETAILS — DIAGNOSTIC TELEMETRY BREAKDOWN"><p className="text-xs text-muted-foreground">Per-item diagnostic readback (registry location, current vs target value) is listed here in the native app. Hidden by default.</p></Details>
      <SimNotice />
    </div>
  );
}

/* ───────── SYSTEM TELEMETRY ───────── */
export function SystemInfoPage() {
  const [f, setF] = useState("ALL");
  const [open, setOpen] = useState(false);
  const findings = [["PASS", "HARDWARE", "CPU thermals within envelope"], ["PASS", "SECURITY", "UEFI Secure Boot enabled"], ["WARNINGS", "SECURITY", "Core Isolation (HVCI) is off"], ["PASS", "HARDWARE", "Memory running at EXPO speed"], ["WARNINGS", "HARDWARE", "Primary drive 46% used"]];
  return (
    <div className="space-y-4">
      <PageHeader title="System Telemetry" badges={<Badge tone="cyan">HARDWARE & DIAGNOSTICS</Badge>} sub="Sample hardware, Windows architecture, and system health diagnostics." actions={<Btn onClick={() => simulate("Refresh telemetry")}>Refresh</Btn>} />
      <Card className="flex flex-wrap items-center gap-4 py-3">{["Hardware: OK", "Windows: OK", "Security: 1 warning", "Storage: OK", "Performance: OK", "Drivers: OK"].map((x) => <span key={x} className="text-[12px] font-semibold"><span className={x.includes("warning") ? "text-warning" : "text-success"}>●</span> {x}</span>)}<Btn size="sm" className="ml-auto" onClick={() => setOpen(true)}>System health analysis</Btn></Card>
      <SectionTitle title="ESSENTIAL HARDWARE OVERVIEW" />
      <div className="grid grid-cols-3 gap-3">{[["PROCESSOR (CPU)", HW.cpu, HW.cpuSub], ["GRAPHICS (GPU)", HW.gpu, HW.gpuSub], ["SYSTEM MEMORY", HW.ram, HW.ramSub], ["PRIMARY STORAGE", HW.storage, HW.storageSub], ["WINDOWS OS", HW.os, "Build 26100 · x64"], ["POWER & CHASSIS", "Desktop · AC power", "Ultimate Performance plan"]].map(([a, b, c]) => <Card key={a} className="p-4"><Label className="text-cyan">{a}</Label><div className="mt-2 text-sm font-bold">{b}</div><div className="text-[11.5px] text-muted-foreground">{c}</div></Card>)}</div>
      <Details title="ADVANCED TECHNICAL DETAILS — deep hardware specifications, multi-GPU adapters, cache architecture">
        <Cols cols="1fr 1fr" gap={20}>
          <div><Label className="mb-2 text-cyan">PROCESSOR (CPU) ARCHITECTURE</Label><KV k="Physical Cores / Threads:" v="8 Cores / 16 Threads" /><KV k="Base / Max Frequency:" v="4.2 / 5.0 GHz" /><KV k="Level 3 (L3) Cache:" v="96 MB" /><KV k="Virtualization (VT-x / AMD-V):" v="Enabled" /></div>
          <div><Label className="mb-2 text-cyan">SYSTEM MEMORY (RAM)</Label><Bar value={38} className="mb-2" /><KV k="Memory Speed & Type:" v="DDR5-6000" /><KV k="Channel Mode:" v="Dual" /><KV k="Available Free RAM:" v="19.8 GB" /><KV k="Virtual Memory Headroom:" v="Ample" /></div>
          <div><Label className="mb-2 text-cyan">MOTHERBOARD & FIRMWARE</Label><KV k="Manufacturer & Model:" v="Sample X670E" /><KV k="BIOS Version & Vendor:" v="F12 · AMI" /><KV k="Firmware Architecture:" v="UEFI" /><KV k="TPM Hardware Security:" v="2.0" /></div>
          <div><Label className="mb-2 text-cyan">SECURITY & SYSTEM INTEGRITY</Label><KV k="UEFI Secure Boot:" v="On" /><KV k="TPM 2.0 Cryptography:" v="Ready" /><KV k="Microsoft Defender:" v="Active" /><KV k="Core Isolation (HVCI):" v="Off" /></div>
          <div><Label className="mb-2 text-cyan">POWER & CHASSIS</Label><KV k="Power Source:" v="AC" /><KV k="Battery Charge & Health:" v="N/A" /><KV k="Active Power Plan:" v="Ultimate Performance" /></div>
          <div><Label className="mb-2 text-cyan">NETWORK & CONNECTIVITY</Label><KV k="Active Interface:" v="Ethernet" /><KV k="Connection Type / Speed:" v="2.5 Gbps" /><KV k="IPv4 Address:" v="192.168.1.24" /></div>
        </Cols>
      </Details>
      <SimNotice />
      <Modal open={open} onClose={() => setOpen(false)} title="System health analysis" footer={<Btn onClick={() => setOpen(false)}>Done / Close</Btn>}>
        <Bar value={92} tone="success" className="mb-3" /><Chips options={["ALL", "WARNINGS", "PASS", "HARDWARE", "SECURITY"]} value={f} onChange={setF} />
        <div className="mt-3 space-y-1.5">{findings.filter((x) => f === "ALL" || x[0] === f || x[1] === f).map((x) => <div key={x[2]} className="flex items-center justify-between rounded-lg border border-border bg-window px-3 py-2 text-[12.5px]"><span>{x[2]}</span><Badge tone={x[0] === "PASS" ? "success" : "warning"}>{x[0]}</Badge></div>)}</div>
      </Modal>
    </div>
  );
}

/* ───────── REGISTRY INTELLIGENCE ───────── */
const REG_CATS = ["ALL", "RECOMMENDED", "OPTIMIZED", "NOT APPLICABLE", "CPU", "MEMORY", "NETWORK", "GAMING", "GPU", "PRIVACY", "TELEMETRY", "INPUT", "POWER", "NTFS", "SYSTEM"];
export function RegistryTweakPage() {
  const [mode, setMode] = useState("NORMAL");
  const [cat, setCat] = useState("ALL");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<(typeof CATALOG)[number] | null>(null);
  const [run, setRun] = useState(false);
  const list = CATALOG.map((c, i) => ({ ...c, state: i % 5 === 0 ? "OPTIMIZED" : i % 7 === 0 ? "NOT APPLICABLE" : "PENDING" }));
  const vis = list.filter((i) => (cat === "ALL" || i.cat === cat || i.state === cat || (cat === "RECOMMENDED" && i.state === "PENDING" && i.risk === "LOW")) && i.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <PageHeader title="Registry Intelligence" badges={<><Badge tone="cyan">LOW LATENCY & SCHEDULING</Badge><Badge tone="success">SAFE & REVERSIBLE</Badge></>} sub="Advanced Windows registry optimization categorized by CPU scheduling, gaming, memory, network and privacy." />
      <Card className="flex flex-wrap items-center justify-between gap-3 py-3"><div className="flex gap-2"><Btn size="sm" variant="ghost" onClick={() => simulate("Refresh")}>Refresh</Btn><Chips options={["NORMAL", "CUSTOM"]} value={mode} onChange={setMode} /></div><p className="text-[11.5px] text-muted-foreground"><b className="text-cyan">PRO TIP</b> · Recommended registry settings are detected automatically and verified after every write.</p></Card>
      {mode === "NORMAL" ? (<>
        <Card><div className="grid gap-5" style={{ gridTemplateColumns: "auto 1px 1fr" }}><div><Label className="text-foreground">REGISTRY HEALTH</Label><p className="text-xs text-muted-foreground">Real-time configuration scan</p><div className="mt-2 text-3xl font-bold text-success">86%</div></div><div className="bg-border" /><StatTiles items={[{ label: "Total", value: list.length }, { label: "Applicable", value: list.length - 3, tone: "cyan" }, { label: "Optimized", value: 6, tone: "success" }, { label: "Pending", value: list.length - 9, tone: "warning" }, { label: "Not Applicable", value: 3 }, { label: "Failed", value: 0, tone: "danger" }]} /></div></Card>
        <Card><SectionTitle title="RECOMMENDED OPTIMIZATIONS" right={<Btn variant="primary" onClick={() => setRun(true)}>Apply recommended</Btn>} />
          <div className="grid grid-cols-2 gap-2">{list.filter((i) => i.state === "PENDING").slice(0, 8).map((i) => <button key={i.id} onClick={() => setDetail(i)} className="flex items-center justify-between rounded-lg border border-border bg-window px-3 py-2.5 text-left text-[12.5px] hover:border-cyan/40"><span>{i.name}</span><RiskBadge risk={i.risk} /></button>)}</div></Card>
        <Card><SectionTitle title="WHAT NORMAL MODE OPTIMIZES" /><div className="grid grid-cols-3 gap-3">{[["⚡ CPU & Scheduling", "Unparks CPU cores and tunes thread quantum prioritization for foreground apps."], ["🎮 Gaming & MMCSS", "Disables network throttling and reduces background multimedia reservation."], ["💾 Memory & System", "Enforces paging executive in RAM and optimizes SvcHost process thresholds."]].map(([a, b]) => <div key={a} className="rounded-xl border border-border bg-window p-4"><div className="text-sm font-bold">{a}</div><p className="mt-1 text-xs text-muted-foreground">{b}</p></div>)}</div></Card>
      </>) : (<>
        <StatTiles items={[{ label: "TOTAL", value: list.length, sub: "Catalog tweaks" }, { label: "APPLICABLE", value: list.length - 3, sub: "Supported on PC", tone: "cyan" }, { label: "SELECTED", value: sel.size, sub: "Manual selection", tone: "primary" }, { label: "OPTIMIZED", value: 6, sub: "Verified optimal", tone: "success" }, { label: "NOT APPLICABLE", value: 3, sub: "Unsupported/Absent" }, { label: "FAILED", value: 0, sub: "Attempt errors", tone: "danger" }]} />
        <Card><div className="mb-3"><SearchBox placeholder="🔍 Search registry optimizations..." value={q} onChange={setQ} /></div><Chips options={REG_CATS} value={cat} onChange={setCat} />
          <div className="mt-3 flex justify-end gap-1.5"><Btn size="sm" variant="ghost" onClick={() => setSel(new Set())}>Deselect all</Btn><Btn size="sm" onClick={() => simulate("Scan")}>↻ Scan</Btn><Btn size="sm" onClick={() => simulate("Save profile")}>💾 Save profile</Btn><Btn size="sm" variant="primary" disabled={!sel.size} onClick={() => setRun(true)}>Apply selected</Btn></div></Card>
        <Cols cols="1fr 320px"><Card><Label className="mb-3 text-foreground">REGISTRY OPTIMIZATION TARGETS</Label><div className="space-y-1.5">{vis.map((i) => <div key={i.id} className="flex items-center gap-3 rounded-lg border border-border bg-window px-3 py-2.5 text-[12.5px]"><Check label={`Select ${i.name}`} on={sel.has(i.id)} onChange={() => setSel((s) => { return toggleInSet(s, i.id); })} /><button className="flex-1 text-left hover:text-cyan" onClick={() => setDetail(i)}>{i.name}</button><Badge>{i.cat}</Badge><Badge tone={i.state === "OPTIMIZED" ? "success" : i.state === "PENDING" ? "warning" : "muted"}>{i.state}</Badge></div>)}</div></Card>
          <Card><Label className="mb-3 text-foreground">ACTIVITY LOG</Label><div className="space-y-1 font-mono text-[11px] text-muted-foreground"><div>[sim] registry scan complete</div><div>[sim] {list.length} targets evaluated</div></div></Card></Cols>
      </>)}
      <SimNotice />
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Optimization transparency details" sub={detail?.name} footer={<Btn onClick={() => setDetail(null)}>Close</Btn>}>
        {detail && <div className="space-y-3"><KV k="Purpose & Description:" v={detail.name} /><KV k="Risk:" v={<RiskBadge risk={detail.risk} />} /><Details title="TECHNICAL REGISTRY LOCATION"><p className="font-mono text-[11px] text-muted-foreground">Optimization ID: {detail.id}<br />Exact key path is resolved at runtime by the native engine.</p></Details><Cols cols="1fr 1fr"><div className="rounded-lg border border-border bg-window p-3"><Label>Current State (sample)</Label><div className="mt-1 text-sm">Runtime value</div></div><div className="rounded-lg border border-success/30 bg-window p-3"><Label className="text-success">Optimization Target</Label><div className="mt-1 text-sm">Optimized value</div></div></Cols></div>}
      </Modal>
      <RunModal open={run} onClose={() => setRun(false)} profile="Registry Intelligence" count={sel.size || 8} />
    </div>
  );
}

/* ───────── REGISTRY VALUES (tab host: RAM | GPU) ───────── */
export function RegistryValuesPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Registry Values" sub="Hardware-aware Windows registry value configuration, live readback and verification." />
      <div className="grid grid-cols-2 gap-3">
        <Link to="/$page" params={{ page: "registry-values-ram" }} className="eo-card eo-depth p-6 transition-all hover:border-cyan/50 hover:shadow-[var(--shadow-glow)]"><Badge tone="cyan">RAM</Badge><div className="mt-3 text-lg font-bold">RAM REGISTRY VALUES</div><p className="mt-1 text-xs text-muted-foreground">Service Host (svchost) split threshold configuration based on installed RAM.</p></Link>
        <Link to="/$page" params={{ page: "gpu-registry-values" }} className="eo-card eo-depth p-6 transition-all hover:border-cyan/50 hover:shadow-[var(--shadow-glow)]"><Badge tone="cyan">GPU</Badge><div className="mt-3 text-lg font-bold">GPU REGISTRY VALUES</div><p className="mt-1 text-xs text-muted-foreground">Universal, NVIDIA and AMD hardware-aware GPU registry groups.</p></Link>
      </div>
    </div>
  );
}

const RAM_SIZES = [4, 8, 12, 16, 24, 32, 48, 64, 128];
export function RegistryValuesRamPage() {
  const [ram, setRam] = useState(32);
  const [open, setOpen] = useState(false);
  const kb = ram * 1024 * 1024;
  return (
    <div className="space-y-4">
      <PageHeader title="RAM Registry Values" sub="Hardware-aware RAM Service Host (svchost) split threshold configuration." actions={<><Link to="/$page" params={{ page: "registry-values" }}><Btn size="sm" variant="ghost">← Registry Values</Btn></Link><Btn onClick={() => simulate("Rescan registry")}>Rescan registry</Btn></>} />
      <Card className="flex items-center justify-between"><div><Label>TARGET VALUE</Label><div className="mt-1 text-sm font-semibold">Service Host split threshold</div></div><Btn size="sm" variant="ghost" onClick={() => setOpen(true)}>Details</Btn></Card>
      <Cols cols="1fr 1fr" gap={14}>
        <Card><Label className="text-foreground">CHOOSE YOUR RAM SIZE</Label><p className="mt-1 mb-3 text-xs text-muted-foreground">Select the physical RAM installed in your system.</p>
          <div className="flex items-center gap-3"><select value={ram} onChange={(e) => setRam(+e.target.value)} className="h-9 flex-1 rounded-lg border border-border bg-window px-3 text-sm">{RAM_SIZES.map((r) => <option key={r} value={r}>{r} GB</option>)}</select><Badge tone="cyan">Demo: 32 GB</Badge></div>
          {ram !== 32 && <p className="mt-2 text-[11.5px] text-warning">⚠️ Selected RAM differs from sample hardware. Verify before applying.</p>}
          <div className="mt-4 rounded-lg border border-border bg-window p-3"><Label className="mb-1">TARGET CONFIGURATION</Label><KV k="Hex Value:" v={`0x${kb.toString(16).toUpperCase()}`} mono /><KV k="Decimal KB:" v={kb.toLocaleString()} mono /><KV k="Formula:" v={`${ram} GB × 1024 × 1024`} mono /></div></Card>
        <Card><Label className="text-foreground">CURRENT REGISTRY STATE</Label><p className="mt-1 mb-3 text-xs text-muted-foreground">Live value read from Windows Registry (simulated).</p>
          <div className="rounded-lg border border-border bg-window p-3"><Label className="mb-1">READBACK VALUE</Label><KV k="Hex Value:" v="0x380000" mono /><KV k="Decimal KB:" v="3,670,016" mono /></div>
          <div className="mt-3 grid grid-cols-2 gap-2"><div className="rounded-lg border border-border bg-window p-3 text-center"><div className="text-xl font-bold">74</div><Label className="text-[9px]">Svchost Instances</Label></div><div className="rounded-lg border border-border bg-window p-3 text-center"><div className="text-xl font-bold">1.1 GB</div><Label className="text-[9px]">Svchost RAM Usage</Label></div></div></Card>
      </Cols>
      <Card className="flex flex-wrap items-center justify-between gap-2"><div className="flex gap-2"><Btn variant="primary" onClick={() => simulate("Apply value")}>Apply value</Btn><Btn onClick={() => simulate("Restore previous")}>Restore previous</Btn><Btn variant="ghost" onClick={() => setRam(32)}>Reset selection</Btn></div><Btn variant="ghost" onClick={() => simulate("Schedule restart")}>Schedule restart</Btn></Card>
      <SimNotice />
      <Modal open={open} onClose={() => setOpen(false)} title="Technical value specification" footer={<Btn onClick={() => setOpen(false)}>Close details</Btn>}>
        {[["Registry Path", "HKLM\\SYSTEM\\CurrentControlSet\\Control"], ["Value Name", "SvcHostSplitThresholdInKB"], ["Value Type", "REG_DWORD"], ["What It Controls", "Changes the configured Service Host split threshold."], ["Selected RAM Mapping", `${ram} GB`], ["Target Value", kb.toLocaleString() + " KB"], ["Backup State", "Automatic snapshot created prior to registry write."], ["Restart Requirement", "Requires Windows restart for full system effect."], ["Verification State", "Immediate readback verification required on write."]].map(([k, v]) => <div key={k} className="grid border-b border-border py-2 text-[12.5px]" style={{ gridTemplateColumns: "160px 1fr" }}><span className="text-muted-foreground">{k}</span><span className="font-mono text-[11.5px]">{v}</span></div>)}
      </Modal>
    </div>
  );
}

export function GpuRegistryValuesPage() {
  const [policy, setPolicy] = useState("Recommended");
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<string | null>(null);
  const groups = [
    { name: "UNIVERSAL GPU", tag: "SYSTEM-WIDE", detected: true, items: ["Hardware-Accelerated GPU Scheduling (HAGS)", "GPU priority for games (MMCSS)", "TDR delay calibration"] },
    { name: "NVIDIA GPU", tag: "GEFORCE / RTX", detected: true, items: ["NVIDIA PowerMizer Maximum Performance Mode", "Disable NVIDIA telemetry container"] },
    { name: "AMD GPU", tag: "RADEON / ADRENALIN", detected: false, items: ["AMD Radeon ULPS Disable", "AMD shader cache mode"] },
  ];
  return (
    <div className="space-y-4">
      <PageHeader title="GPU Registry Values" sub="Hardware-aware GPU registry configuration, optimization and verification." actions={<><Link to="/$page" params={{ page: "registry-values" }}><Btn size="sm" variant="ghost">← Registry Values</Btn></Link><Btn onClick={() => simulate("Rescan GPU")}>Rescan GPU</Btn><Btn variant="primary" onClick={() => simulate("Apply all recommended")}>Apply all recommended</Btn></>} />
      <Card><Label className="mb-3 text-foreground">SAMPLE GRAPHICS HARDWARE</Label><div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1.1fr 1.1fr 1.8fr" }}>{[["GPU Vendor", "NVIDIA"], ["Driver Version & Date", "566.36 · 2026-10"], ["WDDM Architecture", "WDDM 3.2"], ["OS Environment", HW.os]].map(([k, v]) => <div key={k}><Label className="text-[9px]">{k}</Label><div className="mt-0.5 text-sm font-semibold">{v}</div></div>)}</div><div className="mt-3"><Badge tone="success">Sample hardware profile</Badge></div></Card>
      <Card className="flex items-center gap-3 py-3"><Label>PROFILE POLICY:</Label><select value={policy} onChange={(e) => setPolicy(e.target.value)} className="h-8 rounded-lg border border-border bg-window px-2 text-sm">{["Recommended", "Performance", "Conservative"].map((p) => <option key={p}>{p}</option>)}</select></Card>
      <SectionTitle title="HARDWARE-AWARE OPTIMIZATION GROUPS" right={<><Btn size="sm" onClick={() => setSel(new Set(groups.filter((g) => g.detected).flatMap((g) => g.items)))}>Select all applicable</Btn><Btn size="sm" variant="ghost" onClick={() => setSel(new Set())}>Clear selection</Btn><Btn size="sm" variant="primary" disabled={!sel.size} onClick={() => simulate("Apply selected")}>Apply selected</Btn></>} />
      {groups.map((g) => (
        <Card key={g.name} className={cn(!g.detected && "opacity-60")}><div className="mb-3 flex items-center gap-2"><Label className="text-foreground">{g.name}</Label><Badge tone="cyan">{g.tag}</Badge>{!g.detected && <Badge>NOT IN SAMPLE</Badge>}</div>
          {!g.detected ? <p className="text-xs text-muted-foreground">{g.name.split(" ")[0]} GPU is not part of the sample hardware. All {g.name.split(" ")[0]}-specific registry settings are skipped.</p> :
            <div className="space-y-1.5">{g.items.map((i) => <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-window px-3 py-2.5 text-[12.5px]"><Check on={sel.has(i)} onChange={() => setSel((s) => { return toggleInSet(s, i); })} /><span className="flex-1">{i}</span><RiskBadge risk="MEDIUM" /><Btn size="sm" variant="ghost" onClick={() => setDetail(i)}>Details</Btn></div>)}</div>}
        </Card>))}
      <Details title="GPU DIAGNOSTIC CONFIGURATION (DIAGNOSTIC ONLY)"><p className="text-xs text-muted-foreground">Read-only diagnostic values. Never written.</p></Details>
      <SimNotice />
      <Modal open={!!detail} onClose={() => setDetail(null)} title="GPU registry optimization" sub={detail ?? ""} footer={<><Btn variant="primary" onClick={() => simulate("Apply")}>Apply</Btn><Btn onClick={() => simulate("Restore")}>Restore</Btn><Btn variant="ghost" onClick={() => setDetail(null)}>Close</Btn></>}>
        <Label className="mb-1 text-cyan">TECHNICAL SPECIFICATION</Label><KV k="Optimization ID:" v="GPU.*" mono /><KV k="Registry Path:" v="Resolved at runtime" /><KV k="Hardware & Driver:" v="NVIDIA · 566.36" />
        <Label className="mt-4 mb-1 text-cyan">VALUE STATES</Label><Cols cols="1fr 1fr"><div className="rounded-lg border border-border bg-window p-3 text-sm">Current Value: runtime</div><div className="rounded-lg border border-success/30 bg-window p-3 text-sm">Target Calculated Value</div></Cols>
        <Label className="mt-4 mb-1 text-cyan">SAFETY & VERIFICATION</Label><KV k="Risk Classification:" v={<RiskBadge risk="MEDIUM" />} /><KV k="Restart Required:" v="Yes" /><KV k="Verification Method:" v="Readback" />
      </Modal>
    </div>
  );
}
