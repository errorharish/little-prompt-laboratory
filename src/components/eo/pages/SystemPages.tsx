// InputOptimizerView, SystemInfoView, RegistryTweakView, RegistryValuesView, RegistryValuesRamView, GpuRegistryValuesView
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Badge,
  Bar,
  Btn,
  Card,
  Check,
  Chips,
  Cols,
  Details,
  KV,
  Label,
  Modal,
  PageHeader,
  RiskBadge,
  SearchBox,
  SectionTitle,
  SimNotice,
  StatTiles,
  simulate,
  useSimRun,
} from "../kit";
import { RunModal } from "../RunModal";
import { TelemetryConsole } from "../Telemetry";
import { toggleInSet } from "@/lib/eo/selection";
import { usePersistedSelection } from "../useSelection";
import { CATALOG, HW } from "@/lib/eo/data";
import { cn } from "@/lib/utils";

/* ───────── INPUT OPTIMIZER ───────── */
const NORMAL_INPUT = [
  "Disable mouse acceleration (1:1 raw pointer)",
  "Keyboard repeat rate maximization",
  "Keyboard repeat delay minimum",
  "Mouse hover time reduction",
];
const ADV_INPUT = [
  "Mouse data queue size",
  "Keyboard data queue size",
  "High-precision timer request",
  "USB selective suspend (input devices)",
];
// First row of each list is already applied on the sample system (shown as OPTIMIZED).
const INPUT_ITEMS = [...NORMAL_INPUT, ...ADV_INPUT].map((id) => ({
  id,
  risk: "LOW" as const,
  done: id === NORMAL_INPUT[0] || id === ADV_INPUT[0],
}));
export function InputOptimizerPage() {
  const [mode, setMode] = useState("NORMAL");
  const { sel, setSel } = usePersistedSelection("input-optimizer", INPUT_ITEMS);
  const test = useSimRun(2500);
  const [run, setRun] = useState(false);
  const [tested, setTested] = useState(false);
  const List = ({ title, sub, items }: { title: string; sub: string; items: string[] }) => (
    <Card>
      <SectionTitle title={title} sub={sub} right={<Badge>{items.length} sample settings</Badge>} />
      {mode === "CUSTOM" && (
        <div className="mb-2 flex gap-1.5">
          <Btn
            size="sm"
            onClick={() =>
              setSel((s) => new Set([...s, ...items.filter((x, n) => n > 0 || !s.has(x))]))
            }
          >
            Select all
          </Btn>
          <Btn
            size="sm"
            variant="ghost"
            onClick={() => setSel((s) => new Set([...s].filter((x) => !items.includes(x))))}
          >
            Deselect all
          </Btn>
        </div>
      )}
      <div className="space-y-1.5">
        {items.map((i, n) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-border bg-window px-3 py-2 text-[12.5px]"
          >
            {mode === "CUSTOM" && (
              <Check
                on={sel.has(i)}
                onChange={() =>
                  setSel((s) => {
                    return toggleInSet(s, i);
                  })
                }
              />
            )}
            <span className="flex-1">{i}</span>
            {n === 0 ? (
              <Badge tone="success">OPTIMIZED</Badge>
            ) : (
              <Badge tone="warning">PENDING</Badge>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
  return (
    <div className="space-y-4">
      <PageHeader
        title="Input Optimizer"
        badges={<Badge tone="cyan">LATENCY REDUCTION ENGINE</Badge>}
        sub="Simulated pointer, keyboard and timer tuning."
        actions={
          <>
            <Btn variant="ghost" onClick={() => simulate("Refresh")}>
              Refresh
            </Btn>
            <Btn variant="ghost" onClick={() => simulate("Restore defaults")}>
              Restore defaults
            </Btn>
          </>
        }
      />
      <StatTiles
        items={[
          { label: "MOUSE", value: "1:1 LINEAR", sub: "Sample pointer curve" },
          { label: "KEYBOARD", value: "31 / 0", sub: "Sample repeat / delay" },
          { label: "TIMER", value: "0.5 ms", sub: "Demo interval" },
          { label: "JITTER", value: "0.08 ms", sub: "Illustrative only" },
        ]}
      />
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionTitle
            title="INPUT PROFILE"
            sub="Normal presets or custom item selection · simulated."
          />
          <Chips options={["NORMAL", "CUSTOM"]} value={mode} onChange={setMode} />
        </div>
        <Details inline title="Aim-shake diagnosis" hint="Demo: no aim-shake">
          <p className="text-xs text-muted-foreground">
            Sample diagnosis of MarkC linear curves, acceleration thresholds and frame-time jitter;
            no measurements collected.
          </p>
        </Details>
      </Card>
      <Cols cols="minmax(0, 1fr) minmax(0, 1fr)" gap={14} className="items-stretch">
        <List
          title="NORMAL INPUT OPTIMIZATION"
          sub="Standard pointer and keyboard presets."
          items={NORMAL_INPUT}
        />
        <List
          title="ADVANCED INPUT OPTIMIZATION"
          sub="Queue, timer and USB configuration."
          items={ADV_INPUT}
        />
      </Cols>
      <Card>
        <SectionTitle
          title="SIMULATED INPUT TEST"
          sub="Sample input-test flow — no physical input measurements are captured."
          right={["5 SEC TEST", "10 SEC TEST", "30 SEC TEST"].map((x) => (
            <Btn
              key={x}
              size="sm"
              disabled={test.running}
              onClick={() => test.start(() => setTested(true))}
            >
              {x}
            </Btn>
          ))}
        />
        {test.running && <Bar value={test.progress ?? 0} className="mb-3" />}
        <StatTiles
          items={[
            { label: "SAMPLES", value: "—" },
            { label: "AVG INTERVAL", value: "—" },
            { label: "FREQUENCY", value: "—" },
            { label: "JITTER", value: "—", tone: "success" },
            { label: "TIMER RES", value: "0.5 ms" },
          ]}
        />
        <p className="mt-2 text-[10.5px] text-warning">
          {tested
            ? "Simulated test finished. No measurements were collected."
            : "Run the simulated test to preview its progress; real results require the native app."}
        </p>
      </Card>
      <Card>
        <Details
          inline
          title="Illustrative before / after states"
          hint="Demo values, not benchmarks"
        >
          <p className="mb-3 text-xs text-muted-foreground">
            Demo values only — not benchmark results or evidence of an improvement.
          </p>
          <Cols cols="1fr 40px 1fr">
            <div className="rounded-lg border border-border bg-window p-3">
              <Label className="mb-2">BEFORE OPTIMIZATION</Label>
              <KV k="Polling Rate:" v="500 Hz" />
              <KV k="Timer Resolution:" v="15.6 ms" />
              <KV k="Measured Jitter:" v="0.42 ms" />
            </div>
            <div className="flex items-center justify-center text-cyan">→</div>
            <div className="rounded-lg border border-success/30 bg-window p-3">
              <Label className="mb-2 text-success">AFTER OPTIMIZATION</Label>
              <KV k="Polling Rate:" v="1000 Hz" />
              <KV k="Timer Resolution:" v="0.5 ms" />
              <KV k="Measured Jitter:" v="0.08 ms" />
            </div>
          </Cols>
        </Details>
      </Card>
      <div className="flex justify-end">
        <Btn
          variant="primary"
          disabled={mode === "CUSTOM" && !sel.size}
          onClick={() => setRun(true)}
        >
          Review input settings
        </Btn>
      </div>
      <RunModal
        open={run}
        onClose={() => setRun(false)}
        profile="Input Optimizer"
        count={mode === "NORMAL" ? NORMAL_INPUT.length : sel.size}
      />
      <Card>
        <Details inline title="Diagnostic telemetry" hint="Native app readback">
          <p className="text-xs text-muted-foreground">
            Per-item diagnostic readback (registry location, current vs target value) is listed here
            in the native app. Hidden by default.
          </p>
        </Details>
      </Card>
      <SimNotice />
    </div>
  );
}

/* ───────── SYSTEM TELEMETRY ───────── */
export function SystemInfoPage() {
  const [f, setF] = useState("ALL");
  const [open, setOpen] = useState(false);
  const findings = [
    ["PASS", "HARDWARE", "CPU thermals within envelope"],
    ["PASS", "SECURITY", "UEFI Secure Boot enabled"],
    ["WARNINGS", "SECURITY", "Core Isolation (HVCI) is off"],
    ["PASS", "HARDWARE", "Memory running at EXPO speed"],
    ["WARNINGS", "HARDWARE", "Primary drive 46% used"],
  ];
  return (
    <div className="space-y-4">
      <PageHeader
        title="System Telemetry"
        badges={<Badge tone="cyan">HARDWARE & DIAGNOSTICS</Badge>}
        sub="Sample hardware, performance and system health diagnostics."
        actions={<Btn onClick={() => simulate("Refresh telemetry")}>Refresh</Btn>}
      />
      <Card className="flex flex-wrap items-center gap-4 py-3">
        {[
          "Hardware: OK",
          "Windows: OK",
          "Security: 1 warning",
          "Storage: OK",
          "Performance: OK",
          "Drivers: OK",
        ].map((x) => (
          <span key={x} className="text-[12px] font-semibold">
            <span className={x.includes("warning") ? "text-warning" : "text-success"}>●</span> {x}
          </span>
        ))}
        <Btn size="sm" className="ml-auto" onClick={() => setOpen(true)}>
          System health analysis
        </Btn>
      </Card>
      <TelemetryConsole />
      <Card>
        <SectionTitle title="SAMPLE HARDWARE" />
        <div className="grid grid-cols-3 gap-x-3.5">
          {[
            ["PROCESSOR (CPU)", HW.cpu, HW.cpuSub],
            ["GRAPHICS (GPU)", HW.gpu, HW.gpuSub],
            ["SYSTEM MEMORY", HW.ram, HW.ramSub],
            ["PRIMARY STORAGE", HW.storage, HW.storageSub],
            ["WINDOWS OS", HW.os, "Build 26100 · x64"],
            ["POWER & CHASSIS", "Desktop · AC power", "Ultimate Performance plan"],
          ].map(([a, b, c]) => (
            <div key={a} className="min-w-0 border-b border-border py-3">
              <Label className="text-cyan">{a}</Label>
              <div className="mt-2 text-sm font-bold">{b}</div>
              <div className="text-[11.5px] text-muted-foreground">{c}</div>
            </div>
          ))}
        </div>
        <Details inline title="Technical inventory" hint="Architecture, firmware and connectivity">
          <Cols cols="minmax(0, 1fr) minmax(0, 1fr)" gap={14}>
            <div>
              <Label className="mb-2 text-cyan">PROCESSOR (CPU) ARCHITECTURE</Label>
              <KV k="Physical Cores / Threads:" v="8 Cores / 16 Threads" />
              <KV k="Base / Max Frequency:" v="4.2 / 5.0 GHz" />
              <KV k="Level 3 (L3) Cache:" v="96 MB" />
              <KV k="Virtualization (VT-x / AMD-V):" v="Enabled" />
            </div>
            <div>
              <Label className="mb-2 text-cyan">SYSTEM MEMORY (RAM)</Label>
              <Bar value={38} className="mb-2" />
              <KV k="Memory Speed & Type:" v="DDR5-6000" />
              <KV k="Channel Mode:" v="Dual" />
              <KV k="Available Free RAM:" v="19.8 GB" />
              <KV k="Virtual Memory Headroom:" v="Ample" />
            </div>
            <div>
              <Label className="mb-2 text-cyan">MOTHERBOARD & FIRMWARE</Label>
              <KV k="Manufacturer & Model:" v="Sample X670E" />
              <KV k="BIOS Version & Vendor:" v="F12 · AMI" />
              <KV k="Firmware Architecture:" v="UEFI" />
              <KV k="TPM Hardware Security:" v="2.0" />
            </div>
            <div>
              <Label className="mb-2 text-cyan">SECURITY & SYSTEM INTEGRITY</Label>
              <KV k="UEFI Secure Boot:" v="On" />
              <KV k="TPM 2.0 Cryptography:" v="Ready" />
              <KV k="Microsoft Defender:" v="Active" />
              <KV k="Core Isolation (HVCI):" v="Off" />
            </div>
            <div>
              <Label className="mb-2 text-cyan">POWER & CHASSIS</Label>
              <KV k="Power Source:" v="AC" />
              <KV k="Battery Charge & Health:" v="N/A" />
              <KV k="Active Power Plan:" v="Ultimate Performance" />
            </div>
            <div>
              <Label className="mb-2 text-cyan">NETWORK & CONNECTIVITY</Label>
              <KV k="Active Interface:" v="Ethernet" />
              <KV k="Connection Type / Speed:" v="2.5 Gbps" />
              <KV k="IPv4 Address:" v="192.168.1.24" />
            </div>
          </Cols>
        </Details>
      </Card>
      <SimNotice />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="System health analysis"
        footer={<Btn onClick={() => setOpen(false)}>Done / Close</Btn>}
      >
        <Bar value={92} tone="success" className="mb-3" />
        <Chips
          options={["ALL", "WARNINGS", "PASS", "HARDWARE", "SECURITY"]}
          value={f}
          onChange={setF}
        />
        <div className="mt-3 space-y-1.5">
          {findings
            .filter((x) => f === "ALL" || x[0] === f || x[1] === f)
            .map((x) => (
              <div
                key={x[2]}
                className="flex items-center justify-between rounded-lg border border-border bg-window px-3 py-2 text-[12.5px]"
              >
                <span>{x[2]}</span>
                <Badge tone={x[0] === "PASS" ? "success" : "warning"}>{x[0]}</Badge>
              </div>
            ))}
        </div>
      </Modal>
    </div>
  );
}

/* ───────── REGISTRY INTELLIGENCE ───────── */
const REG_CATS = [
  "ALL",
  "RECOMMENDED",
  "OPTIMIZED",
  "NOT APPLICABLE",
  "CPU",
  "MEMORY",
  "NETWORK",
  "GAMING",
  "GPU",
  "PRIVACY",
  "TELEMETRY",
  "INPUT",
  "POWER",
  "NTFS",
  "SYSTEM",
];
const REG_LIST = CATALOG.map((c, i) => ({
  ...c,
  state: i % 5 === 0 ? "OPTIMIZED" : i % 7 === 0 ? "NOT APPLICABLE" : "PENDING",
}));
// Already-optimized rows are not re-selected; not-applicable rows can never be selected.
const REG_ITEMS = REG_LIST.map((i) => ({
  id: i.id,
  risk: i.risk,
  done: i.state === "OPTIMIZED",
  unsupported: i.state === "NOT APPLICABLE",
}));
export function RegistryTweakPage() {
  const [mode, setMode] = useState("NORMAL");
  const [cat, setCat] = useState("ALL");
  const [q, setQ] = useState("");
  const reg = usePersistedSelection("registry-tweak", REG_ITEMS);
  const { sel, setSel } = reg;
  const [detail, setDetail] = useState<(typeof CATALOG)[number] | null>(null);
  const [run, setRun] = useState(false);
  const list = REG_LIST;
  const vis = list.filter(
    (i) =>
      (cat === "ALL" ||
        i.cat === cat ||
        i.state === cat ||
        (cat === "RECOMMENDED" && i.state === "PENDING" && i.risk === "LOW")) &&
      i.name.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div className="space-y-4">
      <PageHeader
        title="Registry Intelligence"
        badges={
          <>
            <Badge tone="cyan">LOW LATENCY & SCHEDULING</Badge>
            <Badge tone="success">SAFE & REVERSIBLE</Badge>
          </>
        }
        sub="Simulated registry tuning for scheduling, memory, gaming and privacy."
      />
      <Card className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="flex gap-2">
          <Btn size="sm" variant="ghost" onClick={() => simulate("Refresh")}>
            Refresh
          </Btn>
          <Chips options={["NORMAL", "CUSTOM"]} value={mode} onChange={setMode} />
        </div>
        <p className="text-[11.5px] text-muted-foreground">
          Sample catalog · review settings before a simulated run.
        </p>
      </Card>
      {mode === "NORMAL" ? (
        <>
          <StatTiles
            items={[
              { label: "DEMO HEALTH", value: "86%", tone: "success" },
              { label: "TOTAL", value: list.length },
              { label: "APPLICABLE", value: list.length - 3, tone: "cyan" },
              { label: "OPTIMIZED", value: 6, tone: "success" },
              { label: "PENDING", value: list.length - 9, tone: "warning" },
              { label: "NOT APPLICABLE", value: 3 },
              { label: "FAILED", value: 0, tone: "danger" },
            ]}
          />
          <Card>
            <SectionTitle
              title="RECOMMENDED OPTIMIZATIONS"
              right={
                <Btn variant="primary" onClick={() => setRun(true)}>
                  Apply recommended
                </Btn>
              }
            />
            <div className="grid grid-cols-2 gap-2">
              {list
                .filter((i) => i.state === "PENDING")
                .slice(0, 8)
                .map((i) => (
                  <button
                    key={i.id}
                    onClick={() => setDetail(i)}
                    className="flex items-center justify-between rounded-lg border border-border bg-window px-3 py-2 text-left text-[12.5px] hover:border-cyan/40"
                  >
                    <span>{i.name}</span>
                    <RiskBadge risk={i.risk} />
                  </button>
                ))}
            </div>
          </Card>
          <Card>
            <Details inline title="Normal mode scope" hint="CPU, gaming and memory">
              <div className="grid grid-cols-3 items-stretch gap-3.5">
                {[
                  [
                    "⚡ CPU & Scheduling",
                    "Unparks CPU cores and tunes thread quantum prioritization for foreground apps.",
                  ],
                  [
                    "🎮 Gaming & MMCSS",
                    "Disables network throttling and reduces background multimedia reservation.",
                  ],
                  [
                    "💾 Memory & System",
                    "Enforces paging executive in RAM and optimizes SvcHost process thresholds.",
                  ],
                ].map(([a, b]) => (
                  <div key={a} className="rounded-xl border border-border bg-window p-4">
                    <div className="text-sm font-bold">{a}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{b}</p>
                  </div>
                ))}
              </div>
            </Details>
          </Card>
        </>
      ) : (
        <>
          <StatTiles
            items={[
              { label: "TOTAL", value: list.length, sub: "Catalog tweaks" },
              { label: "APPLICABLE", value: list.length - 3, sub: "Supported on PC", tone: "cyan" },
              { label: "SELECTED", value: sel.size, sub: "Manual selection", tone: "primary" },
              { label: "OPTIMIZED", value: 6, sub: "Verified optimal", tone: "success" },
              { label: "NOT APPLICABLE", value: 3, sub: "Unsupported/Absent" },
              { label: "FAILED", value: 0, sub: "Attempt errors", tone: "danger" },
            ]}
          />
          <Card>
            <div className="mb-3">
              <SearchBox
                placeholder="🔍 Search registry optimizations..."
                value={q}
                onChange={setQ}
              />
            </div>
            <Chips options={REG_CATS} value={cat} onChange={setCat} />
            <div className="mt-3 flex justify-end gap-1.5">
              <Btn size="sm" onClick={reg.selectAll}>
                Select all eligible
              </Btn>
              <Btn size="sm" variant="ghost" onClick={() => setSel(new Set())}>
                Deselect all
              </Btn>
              <Btn size="sm" onClick={() => simulate("Scan")}>
                ↻ Scan
              </Btn>
              <Btn size="sm" onClick={() => simulate("Save profile")}>
                💾 Save profile
              </Btn>
              <Btn size="sm" variant="primary" disabled={!sel.size} onClick={() => setRun(true)}>
                Apply selected
              </Btn>
            </div>
          </Card>
          <div className="space-y-3.5">
            <Card>
              <Label className="mb-3 text-foreground">REGISTRY OPTIMIZATION TARGETS</Label>
              <div className="space-y-1.5">
                {vis.map((i) => (
                  <div
                    key={i.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-window px-3 py-2 text-[12.5px]"
                  >
                    <Check
                      label={`Select ${i.name}`}
                      on={sel.has(i.id)}
                      onChange={() =>
                        setSel((s) => {
                          return toggleInSet(s, i.id);
                        })
                      }
                    />
                    <button
                      className="flex-1 text-left hover:text-cyan"
                      onClick={() => setDetail(i)}
                    >
                      {i.name}
                    </button>
                    <Badge>{i.cat}</Badge>
                    <Badge
                      tone={
                        i.state === "OPTIMIZED"
                          ? "success"
                          : i.state === "PENDING"
                            ? "warning"
                            : "muted"
                      }
                    >
                      {i.state}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <Details inline title="Activity log" hint="Simulated scan">
                <div className="space-y-1 font-mono text-[11px] text-muted-foreground">
                  <div>[sim] registry scan complete</div>
                  <div>[sim] {list.length} targets evaluated</div>
                </div>
              </Details>
            </Card>
          </div>
        </>
      )}
      <SimNotice />
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title="Optimization transparency details"
        sub={detail?.name}
        footer={<Btn onClick={() => setDetail(null)}>Close</Btn>}
      >
        {detail && (
          <div className="space-y-3">
            <KV k="Purpose & Description:" v={detail.name} />
            <KV k="Risk:" v={<RiskBadge risk={detail.risk} />} />
            <Details title="TECHNICAL REGISTRY LOCATION">
              <p className="font-mono text-[11px] text-muted-foreground">
                Optimization ID: {detail.id}
                <br />
                Exact key path is resolved at runtime by the native engine.
              </p>
            </Details>
            <Cols cols="minmax(0, 1fr) minmax(0, 1fr)" gap={14} className="items-stretch">
              <div className="rounded-lg border border-border bg-window p-3">
                <Label>Current State (sample)</Label>
                <div className="mt-1 text-sm">Runtime value</div>
              </div>
              <div className="rounded-lg border border-success/30 bg-window p-3">
                <Label className="text-success">Optimization Target</Label>
                <div className="mt-1 text-sm">Optimized value</div>
              </div>
            </Cols>
          </div>
        )}
      </Modal>
      <RunModal
        open={run}
        onClose={() => setRun(false)}
        profile="Registry Intelligence"
        count={sel.size || 8}
      />
    </div>
  );
}

/* ───────── REGISTRY VALUES (tab host: RAM | GPU) ───────── */
export function RegistryValuesPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Registry Values"
        sub="Explore sample RAM and GPU registry configurations."
      />
      <div className="grid grid-cols-2 items-stretch gap-3.5">
        <Link
          to="/$page"
          params={{ page: "registry-values-ram" }}
          className="eo-card eo-depth p-4 transition-colors hover:border-cyan/50"
        >
          <Badge tone="cyan">RAM</Badge>
          <h2 className="mt-3 text-sm font-bold">RAM registry values</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Service Host (svchost) split threshold configuration based on installed RAM.
          </p>
        </Link>
        <Link
          to="/$page"
          params={{ page: "gpu-registry-values" }}
          className="eo-card eo-depth p-4 transition-colors hover:border-cyan/50"
        >
          <Badge tone="cyan">GPU</Badge>
          <h2 className="mt-3 text-sm font-bold">GPU registry values</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Universal, NVIDIA and AMD hardware-aware GPU registry groups.
          </p>
        </Link>
      </div>
      <SimNotice />
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
      <PageHeader
        title="RAM Registry Values"
        sub="Preview the Service Host split threshold for sample RAM configurations."
        actions={
          <>
            <Link to="/$page" params={{ page: "registry-values" }}>
              <Btn size="sm" variant="ghost">
                ← Registry Values
              </Btn>
            </Link>
            <Btn onClick={() => simulate("Rescan registry")}>Rescan registry</Btn>
          </>
        }
      />
      <Card className="flex items-center justify-between">
        <div>
          <Label>TARGET VALUE</Label>
          <div className="mt-1 text-sm font-semibold">Service Host split threshold</div>
        </div>
        <Btn size="sm" variant="ghost" onClick={() => setOpen(true)}>
          Details
        </Btn>
      </Card>
      <Cols cols="minmax(0, 1fr) minmax(0, 1fr)" gap={14} className="items-stretch">
        <Card>
          <SectionTitle title="CHOOSE YOUR RAM SIZE" />
          <p className="mt-1 mb-3 text-xs text-muted-foreground">
            Select the physical RAM installed in your system.
          </p>
          <div className="flex items-center gap-3">
            <select
              aria-label="Installed RAM size"
              value={ram}
              onChange={(e) => setRam(+e.target.value)}
              className="h-9 flex-1 rounded-lg border border-border bg-window px-3 text-sm"
            >
              {RAM_SIZES.map((r) => (
                <option key={r} value={r}>
                  {r} GB
                </option>
              ))}
            </select>
            <Badge tone="cyan">Demo: 32 GB</Badge>
          </div>
          {ram !== 32 && (
            <p className="mt-2 text-[11.5px] text-warning">
              ⚠️ Selected RAM differs from sample hardware. Verify before applying.
            </p>
          )}
          <div className="mt-4 rounded-lg border border-border bg-window p-3">
            <Label className="mb-1">TARGET CONFIGURATION</Label>
            <KV k="Hex Value:" v={`0x${kb.toString(16).toUpperCase()}`} mono />
            <KV k="Decimal KB:" v={kb.toLocaleString()} mono />
            <KV k="Formula:" v={`${ram} GB × 1024 × 1024`} mono />
          </div>
        </Card>
        <Card>
          <SectionTitle title="CURRENT REGISTRY STATE" />
          <p className="mt-1 mb-3 text-xs text-muted-foreground">
            Sample registry readback; no live Windows access.
          </p>
          <div className="rounded-lg border border-border bg-window p-3">
            <Label className="mb-1">READBACK VALUE</Label>
            <KV k="Hex Value:" v="0x380000" mono />
            <KV k="Decimal KB:" v="3,670,016" mono />
          </div>
          <div className="mt-3">
            <StatTiles
              items={[
                { label: "SAMPLE INSTANCES", value: "74" },
                { label: "SAMPLE RAM USAGE", value: "1.1 GB" },
              ]}
            />
          </div>
        </Card>
      </Cols>
      <Card className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Btn variant="primary" onClick={() => simulate("Apply value")}>
            Apply value
          </Btn>
          <Btn onClick={() => simulate("Restore previous")}>Restore previous</Btn>
          <Btn variant="ghost" onClick={() => setRam(32)}>
            Reset selection
          </Btn>
        </div>
        <Btn variant="ghost" onClick={() => simulate("Schedule restart")}>
          Schedule restart
        </Btn>
      </Card>
      <SimNotice />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Technical value specification"
        footer={<Btn onClick={() => setOpen(false)}>Close details</Btn>}
      >
        {[
          ["Registry Path", "HKLM\\SYSTEM\\CurrentControlSet\\Control"],
          ["Value Name", "SvcHostSplitThresholdInKB"],
          ["Value Type", "REG_DWORD"],
          ["What It Controls", "Changes the configured Service Host split threshold."],
          ["Selected RAM Mapping", `${ram} GB`],
          ["Target Value", kb.toLocaleString() + " KB"],
          ["Backup State", "Automatic snapshot created prior to registry write."],
          ["Restart Requirement", "Requires Windows restart for full system effect."],
          ["Verification State", "Immediate readback verification required on write."],
        ].map(([k, v]) => (
          <div
            key={k}
            className="grid border-b border-border py-2 text-[12.5px]"
            style={{ gridTemplateColumns: "160px 1fr" }}
          >
            <span className="text-muted-foreground">{k}</span>
            <span className="font-mono text-[11.5px]">{v}</span>
          </div>
        ))}
      </Modal>
    </div>
  );
}

export function GpuRegistryValuesPage() {
  const [policy, setPolicy] = useState("Recommended");
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<string | null>(null);
  const groups = [
    {
      name: "UNIVERSAL GPU",
      tag: "SYSTEM-WIDE",
      detected: true,
      items: [
        "Hardware-Accelerated GPU Scheduling (HAGS)",
        "GPU priority for games (MMCSS)",
        "TDR delay calibration",
      ],
    },
    {
      name: "NVIDIA GPU",
      tag: "GEFORCE / RTX",
      detected: true,
      items: ["NVIDIA PowerMizer Maximum Performance Mode", "Disable NVIDIA telemetry container"],
    },
    {
      name: "AMD GPU",
      tag: "RADEON / ADRENALIN",
      detected: false,
      items: ["AMD Radeon ULPS Disable", "AMD shader cache mode"],
    },
  ];
  return (
    <div className="space-y-4">
      <PageHeader
        title="GPU Registry Values"
        sub="Hardware-aware GPU registry configuration, optimization and verification."
        actions={
          <>
            <Link to="/$page" params={{ page: "registry-values" }}>
              <Btn size="sm" variant="ghost">
                ← Registry Values
              </Btn>
            </Link>
            <Btn onClick={() => simulate("Rescan GPU")}>Rescan GPU</Btn>
            <Btn variant="primary" onClick={() => simulate("Apply all recommended")}>
              Apply all recommended
            </Btn>
          </>
        }
      />
      <Card>
        <Label className="mb-3 text-foreground">SAMPLE GRAPHICS HARDWARE</Label>
        <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1.1fr 1.1fr 1.8fr" }}>
          {[
            ["GPU Vendor", "NVIDIA"],
            ["Driver Version & Date", "566.36 · 2026-10"],
            ["WDDM Architecture", "WDDM 3.2"],
            ["OS Environment", HW.os],
          ].map(([k, v]) => (
            <div key={k}>
              <Label className="text-[9px]">{k}</Label>
              <div className="mt-0.5 text-sm font-semibold">{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Badge tone="success">Sample hardware profile</Badge>
        </div>
      </Card>
      <Card className="flex items-center gap-3 py-3">
        <Label>PROFILE POLICY:</Label>
        <select
          aria-label="GPU profile policy"
          value={policy}
          onChange={(e) => setPolicy(e.target.value)}
          className="h-8 rounded-lg border border-border bg-window px-2 text-sm"
        >
          {["Recommended", "Performance", "Conservative"].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </Card>
      <SectionTitle
        title="HARDWARE-AWARE OPTIMIZATION GROUPS"
        right={
          <>
            <Btn
              size="sm"
              onClick={() =>
                setSel(new Set(groups.filter((g) => g.detected).flatMap((g) => g.items)))
              }
            >
              Select all applicable
            </Btn>
            <Btn size="sm" variant="ghost" onClick={() => setSel(new Set())}>
              Clear selection
            </Btn>
            <Btn
              size="sm"
              variant="primary"
              disabled={!sel.size}
              onClick={() => simulate("Apply selected")}
            >
              Apply selected
            </Btn>
          </>
        }
      />
      {groups.map((g) => (
        <Card key={g.name} className={cn(!g.detected && "opacity-60")}>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-xs font-semibold text-foreground">{g.name}</h2>
            <Badge tone="cyan">{g.tag}</Badge>
            {!g.detected && <Badge>NOT IN SAMPLE</Badge>}
          </div>
          {!g.detected ? (
            <p className="text-xs text-muted-foreground">
              {g.name.split(" ")[0]} GPU is not part of the sample hardware. All{" "}
              {g.name.split(" ")[0]}-specific registry settings are skipped.
            </p>
          ) : (
            <div className="space-y-1.5">
              {g.items.map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-border bg-window px-3 py-2 text-[12.5px]"
                >
                  <Check
                    on={sel.has(i)}
                    onChange={() =>
                      setSel((s) => {
                        return toggleInSet(s, i);
                      })
                    }
                  />
                  <span className="flex-1">{i}</span>
                  <RiskBadge risk="MEDIUM" />
                  <Btn size="sm" variant="ghost" onClick={() => setDetail(i)}>
                    Details
                  </Btn>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
      <Card>
        <Details inline title="GPU diagnostic configuration" hint="Read-only">
          <p className="text-xs text-muted-foreground">
            Read-only diagnostic values. Never written.
          </p>
        </Details>
      </Card>
      <SimNotice />
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title="GPU registry optimization"
        sub={detail ?? ""}
        footer={
          <>
            <Btn variant="primary" onClick={() => simulate("Apply")}>
              Apply
            </Btn>
            <Btn onClick={() => simulate("Restore")}>Restore</Btn>
            <Btn variant="ghost" onClick={() => setDetail(null)}>
              Close
            </Btn>
          </>
        }
      >
        <Label className="mb-1 text-cyan">TECHNICAL SPECIFICATION</Label>
        <KV k="Optimization ID:" v="GPU.*" mono />
        <KV k="Registry Path:" v="Resolved at runtime" />
        <KV k="Hardware & Driver:" v="NVIDIA · 566.36" />
        <Label className="mt-4 mb-1 text-cyan">VALUE STATES</Label>
        <Cols cols="minmax(0, 1fr) minmax(0, 1fr)" gap={14} className="items-stretch">
          <div className="rounded-lg border border-border bg-window p-3 text-sm">
            Current Value: runtime
          </div>
          <div className="rounded-lg border border-success/30 bg-window p-3 text-sm">
            Target Calculated Value
          </div>
        </Cols>
        <Label className="mt-4 mb-1 text-cyan">SAFETY & VERIFICATION</Label>
        <KV k="Risk Classification:" v={<RiskBadge risk="MEDIUM" />} />
        <KV k="Restart Required:" v="Yes" />
        <KV k="Verification Method:" v="Readback" />
      </Modal>
    </div>
  );
}
