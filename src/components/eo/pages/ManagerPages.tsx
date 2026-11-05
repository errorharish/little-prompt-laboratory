// StartupManagerView, ServiceManagerView, NetworkView, StorageView, ToolsView, ProcessReductionView
import { useState } from "react";
import {
  Badge,
  Bar,
  Btn,
  Card,
  Check,
  Chips,
  Cols,
  Details,
  EmptyState,
  KV,
  Label,
  Modal,
  PageHeader,
  RiskBadge,
  SearchBox,
  SectionTitle,
  SimNotice,
  StatTiles,
  Toggle,
  simulate,
  useSimRun,
} from "../kit";
import { cn } from "@/lib/utils";
import { toggleInSet } from "@/lib/eo/selection";

/* ───────── STARTUP MANAGER ───────── */
const STARTUP = [
  { name: "Steam Client Bootstrapper", pub: "Valve", impact: "HIGH", on: true, sys: false },
  { name: "Discord", pub: "Discord Inc.", impact: "HIGH", on: true, sys: false },
  { name: "Microsoft OneDrive", pub: "Microsoft", impact: "MEDIUM", on: true, sys: false },
  { name: "NVIDIA Display Container", pub: "NVIDIA", impact: "LOW", on: true, sys: true },
  { name: "Realtek Audio Console", pub: "Realtek", impact: "LOW", on: true, sys: true },
  { name: "Spotify", pub: "Spotify AB", impact: "MEDIUM", on: false, sys: false },
  { name: "Adobe Creative Cloud", pub: "Adobe", impact: "HIGH", on: true, sys: false },
  {
    name: "Windows Security notification",
    pub: "Microsoft",
    impact: "UNMEASURED",
    on: true,
    sys: true,
  },
];
export function StartupManagerPage() {
  const [items, setItems] = useState(STARTUP);
  const [f, setF] = useState("ALL");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<(typeof STARTUP)[number] | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);
  const vis = items.filter(
    (i) =>
      i.name.toLowerCase().includes(q.toLowerCase()) &&
      (f === "ALL" ||
        (f === "ENABLED" && i.on) ||
        (f === "DISABLED" && !i.on) ||
        (f === "HIGH IMPACT" && i.impact === "HIGH") ||
        (f === "MEDIUM" && i.impact === "MEDIUM") ||
        (f === "LOW" && i.impact === "LOW") ||
        (f === "USER APPS" && !i.sys) ||
        (f === "SYSTEM" && i.sys) ||
        (f === "UNMEASURED" && i.impact === "UNMEASURED")),
  );
  const flip = (n: string) =>
    setItems((s) => s.map((i) => (i.name === n ? { ...i, on: !i.on } : i)));
  return (
    <div className="space-y-4">
      <PageHeader
        title="Startup Manager"
        badges={<Badge tone="cyan">BOOT ACCELERATION</Badge>}
        sub="Manage startup applications and background tasks that launch automatically with Windows."
        actions={<Btn onClick={() => simulate("Rescan startup")}>Rescan startup</Btn>}
      />
      <StatTiles
        items={[
          { label: "TOTAL APPS", value: items.length },
          { label: "ENABLED", value: items.filter((i) => i.on).length, tone: "success" },
          { label: "DISABLED", value: items.filter((i) => !i.on).length },
          {
            label: "HIGH IMPACT",
            value: items.filter((i) => i.impact === "HIGH").length,
            tone: "danger",
          },
          {
            label: "MEDIUM IMPACT",
            value: items.filter((i) => i.impact === "MEDIUM").length,
            tone: "warning",
          },
          {
            label: "LOW IMPACT",
            value: items.filter((i) => i.impact === "LOW").length,
            tone: "cyan",
          },
        ]}
      />
      <Card>
        <Cols cols="1fr auto" className="mb-3 items-center">
          <SearchBox placeholder="Search startup items…" value={q} onChange={setQ} />
          <span className="text-[10px] font-bold tracking-widest text-subtle">
            SORT: NAME · IMPACT · STATUS · PUBLISHER
          </span>
        </Cols>
        <Chips
          options={[
            "ALL",
            "ENABLED",
            "DISABLED",
            "HIGH IMPACT",
            "MEDIUM",
            "LOW",
            "USER APPS",
            "SYSTEM",
            "UNMEASURED",
          ]}
          value={f}
          onChange={setF}
        />
        <div className="mt-3 space-y-1.5">
          {vis.map((i) => (
            <div
              key={i.name}
              className="grid items-center gap-3 rounded-lg border border-border bg-window px-3 py-2.5 text-[12.5px]"
              style={{ gridTemplateColumns: "1fr 140px 110px 90px auto" }}
            >
              <button
                className="text-left font-semibold hover:text-cyan"
                onClick={() => setDetail(i)}
              >
                {i.name}
              </button>
              <span className="text-muted-foreground">{i.pub}</span>
              <Badge
                tone={i.impact === "HIGH" ? "danger" : i.impact === "MEDIUM" ? "warning" : "muted"}
              >
                {i.impact}
              </Badge>
              {i.sys ? <Badge tone="cyan">SYSTEM</Badge> : <span />}
              <Toggle
                label={`Startup for ${i.name}`}
                on={i.on}
                onChange={() => (i.sys && i.on ? setConfirm(i.name) : flip(i.name))}
              />
            </div>
          ))}
          {!vis.length && (
            <EmptyState
              title="NO STARTUP ITEMS MATCH CRITERIA"
              sub="No startup applications or background entries match your current search."
              action={
                <Btn
                  size="sm"
                  onClick={() => {
                    setF("ALL");
                    setQ("");
                  }}
                >
                  Reset all filters
                </Btn>
              }
            />
          )}
        </div>
      </Card>
      <SimNotice />
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.name ?? ""}
        footer={<Btn onClick={() => setDetail(null)}>Close details</Btn>}
      >
        {detail && (
          <div className="space-y-4">
            <div>
              <Label className="mb-1 text-cyan">
                SECTION 1: APPLICATION IDENTITY & CLASSIFICATION
              </Label>
              <KV k="Category / Type" v={detail.sys ? "System component" : "User app"} />
              <KV k="Publisher" v={detail.pub} />
              <KV k="Disk file verification" v="Signed" />
            </div>
            <Details title="SECTION 2–3: STARTUP COMMAND, EXECUTION PATH & REGISTRY SOURCE">
              <p className="font-mono text-[11px] text-muted-foreground">
                Raw command line, executable path and Run-key location are shown here in the native
                app.
              </p>
            </Details>
            <div>
              <Label className="mb-1 text-cyan">SECTION 4: SYSTEM IMPACT & REQUIREMENTS</Label>
              <KV k="Boot impact" v={detail.impact} />
              <KV k="Elevated admin" v={detail.sys ? "Yes" : "No"} />
              <KV k="Restart required" v="No" />
            </div>
          </div>
        )}
      </Modal>
      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title="⚠️ Disable system startup entry?"
        sub="Safety confirmation required"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setConfirm(null)}>
              Cancel
            </Btn>
            <Btn
              variant="danger"
              onClick={() => {
                if (confirm) flip(confirm);
                setConfirm(null);
              }}
            >
              Disable anyway
            </Btn>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          This entry is identified as an IMPORTANT SYSTEM OR DRIVER COMPONENT. Disabling it may
          affect hardware features.
        </p>
      </Modal>
    </div>
  );
}

/* ───────── SERVICE MANAGER ───────── */
const SERVICES = [
  {
    name: "Connected User Experiences and Telemetry",
    run: true,
    safety: "SAFE TO STOP",
    start: "Automatic",
    ms: true,
  },
  {
    name: "Windows Search",
    run: true,
    safety: "WITH CAUTION",
    start: "Automatic (Delayed)",
    ms: true,
  },
  { name: "Print Spooler", run: true, safety: "SAFE TO STOP", start: "Automatic", ms: true },
  {
    name: "Remote Procedure Call (RPC)",
    run: true,
    safety: "DO NOT STOP",
    start: "Automatic",
    ms: true,
  },
  { name: "Steam Client Service", run: false, safety: "SAFE TO STOP", start: "Manual", ms: false },
  { name: "Xbox Live Auth Manager", run: false, safety: "WITH CAUTION", start: "Manual", ms: true },
  { name: "Fax", run: false, safety: "SAFE TO STOP", start: "Disabled", ms: true },
];
export function ServiceManagerPage() {
  const [f, setF] = useState("ALL");
  const [q, setQ] = useState("");
  const [d, setD] = useState<(typeof SERVICES)[number] | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);
  const vis = SERVICES.filter(
    (s) =>
      s.name.toLowerCase().includes(q.toLowerCase()) &&
      (f === "ALL" ||
        (f === "RUNNING" && s.run) ||
        (f === "STOPPED" && !s.run) ||
        s.safety === f ||
        (f === "THIRD PARTY" && !s.ms) ||
        (f === "MICROSOFT" && s.ms) ||
        (f === "DISABLED" && s.start === "Disabled")),
  );
  const tone = (s: string) =>
    (s === "SAFE TO STOP" ? "success" : s === "WITH CAUTION" ? "warning" : "danger") as
      "success" | "warning" | "danger";
  return (
    <div className="space-y-4">
      <PageHeader
        title="Service Manager"
        sub="Inspect, monitor, and optimize Windows background services. Identify safe-to-stop services with dependency awareness."
        actions={<Btn onClick={() => simulate("Rescan services")}>Rescan services</Btn>}
      />
      <StatTiles
        items={[
          { label: "TOTAL SERVICES", value: 284 },
          { label: "RUNNING", value: 112, tone: "success" },
          { label: "STOPPED", value: 172 },
          { label: "SAFE TO STOP", value: 21, tone: "cyan" },
          { label: "WITH CAUTION", value: 34, tone: "warning" },
          { label: "DO NOT STOP", value: 57, tone: "danger" },
        ]}
      />
      <Card>
        <Cols cols="1fr auto" className="mb-3 items-center">
          <SearchBox placeholder="Search services…" value={q} onChange={setQ} />
          <span className="text-[10px] font-bold tracking-widest text-subtle">
            SORT: ACTION SAFETY · NAME · STATE · STARTUP · PUBLISHER
          </span>
        </Cols>
        <Chips
          options={[
            "ALL",
            "RUNNING",
            "STOPPED",
            "SAFE TO STOP",
            "WITH CAUTION",
            "THIRD PARTY",
            "MICROSOFT",
            "DISABLED",
          ]}
          value={f}
          onChange={setF}
        />
        <div className="mt-3 space-y-1.5">
          {vis.map((s) => (
            <button
              key={s.name}
              onClick={() => setD(s)}
              className="grid w-full items-center gap-3 rounded-lg border border-border bg-window px-3 py-2.5 text-left text-[12.5px] hover:border-cyan/40"
              style={{ gridTemplateColumns: "1fr 90px 150px 130px" }}
            >
              <span className="font-semibold">{s.name}</span>
              <Badge tone={s.run ? "success" : "muted"}>{s.run ? "RUNNING" : "STOPPED"}</Badge>
              <span className="text-muted-foreground">{s.start}</span>
              <Badge tone={tone(s.safety)}>{s.safety}</Badge>
            </button>
          ))}
          {!vis.length && (
            <EmptyState
              title="NO SERVICES MATCH CRITERIA"
              sub="No Windows services match your current search query or filter selection."
              action={
                <Btn
                  size="sm"
                  onClick={() => {
                    setF("ALL");
                    setQ("");
                  }}
                >
                  Reset all filters
                </Btn>
              }
            />
          )}
        </div>
      </Card>
      <SimNotice />
      <Modal
        open={!!d}
        onClose={() => setD(null)}
        title={d?.name ?? ""}
        width="max-w-3xl"
        footer={
          <>
            <Btn onClick={() => simulate("Start")}>Start</Btn>
            <Btn
              variant={d?.safety === "DO NOT STOP" ? "ghost" : "danger"}
              disabled={d?.safety === "DO NOT STOP"}
              onClick={() => d && setConfirm(d.name)}
            >
              Stop
            </Btn>
            <Btn onClick={() => simulate("Restart")}>Restart</Btn>
            <Btn variant="ghost" onClick={() => setD(null)}>
              Close details
            </Btn>
          </>
        }
      >
        {d && (
          <div className="space-y-4">
            <div>
              <Label className="mb-1 text-cyan">SECTION 1: SERVICE IDENTITY & DESCRIPTION</Label>
              <Cols cols="1fr 1fr">
                <KV k="Publisher" v={d.ms ? "Microsoft" : "Third party"} />
                <KV k="Account context" v="LocalSystem" />
              </Cols>
            </div>
            <Details title="SECTION 2: BINARY & EXECUTION PATH">
              <p className="font-mono text-[11px] text-muted-foreground">
                Executable path and process type are shown here in the native app.
              </p>
            </Details>
            <div>
              <Label className="mb-1 text-cyan">SECTION 3: ACTION SAFETY & RISK ANALYSIS</Label>
              <Cols cols="1fr 1fr">
                <KV k="Windows critical service" v={d.safety === "DO NOT STOP" ? "Yes" : "No"} />
                <KV k="Microsoft signature" v={d.ms ? "Verified" : "—"} />
              </Cols>
            </div>
            <div>
              <Label className="mb-1 text-cyan">SECTION 4: DEPENDENCIES & ACTIVE DEPENDENTS</Label>
              <Cols cols="1fr 1fr">
                <KV k="Depends on" v="RPCSS" />
                <KV k="Active dependents" v="0" />
              </Cols>
            </div>
            <div>
              <Label className="mb-2 text-cyan">
                SECTION 5: STARTUP CONFIGURATION QUICK ACTIONS
              </Label>
              <div className="flex gap-1.5">
                {["AUTOMATIC", "AUTOMATIC (DELAYED)", "MANUAL", "DISABLED"].map((x) => (
                  <Btn key={x} size="sm" onClick={() => simulate(`Set startup ${x}`)}>
                    {x}
                  </Btn>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title="⚠️ Action requires explicit user confirmation"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setConfirm(null)}>
              Cancel (safe)
            </Btn>
            <Btn
              variant="danger"
              onClick={() => {
                setConfirm(null);
                simulate(`Stop ${confirm}`);
              }}
            >
              Confirm & proceed
            </Btn>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Stopping “{confirm}” may affect dependent features.
        </p>
      </Modal>
    </div>
  );
}

/* ───────── NETWORK BOOST ───────── */
const NET = [
  ["Disable Multimedia Network Throttling Index", "MMCSS", "PENDING"],
  ["TCP Window Auto-Tuning Calibration (Normal)", "TCP/IP", "OPTIMIZED"],
  ["Receive Side Scaling (RSS)", "HARDWARE", "OPTIMIZED"],
  ["TCP ACK frequency", "TCP/IP", "PENDING"],
  ["Interrupt moderation", "HARDWARE", "PENDING"],
  ["System responsiveness reservation", "MMCSS", "PENDING"],
];
export function NetworkPage() {
  const [f, setF] = useState("ALL");
  const [q, setQ] = useState("");
  const t = useSimRun(3000);
  const [tested, setTested] = useState(false);
  const vis = NET.filter(
    (n) =>
      n[0]?.toLowerCase().includes(q.toLowerCase()) && (f === "ALL" || n[1] === f || n[2] === f),
  );
  return (
    <div className="space-y-4">
      <PageHeader
        title="Network Boost"
        sub="Analyze and optimize the Windows network stack for lower latency, minimal jitter and stable throughput."
        actions={
          <>
            <Btn
              variant="primary"
              disabled={t.running}
              onClick={() => t.start(() => setTested(true))}
            >
              ⚡ Run network test
            </Btn>
            <Btn variant="ghost" onClick={() => simulate("Restore backup")}>
              ↺ Restore backup
            </Btn>
            <Btn variant="ghost" onClick={() => simulate("Refresh")}>
              ↻ Refresh
            </Btn>
          </>
        }
      />
      {t.running && <Bar value={t.progress ?? 0} />}
      <div className="grid gap-3" style={{ gridTemplateColumns: "1.1fr 1.3fr 1.1fr" }}>
        <Card>
          <Label className="mb-2 text-foreground">ACTIVE NETWORK INTERFACE</Label>
          <div className="text-sm font-bold">Ethernet · Realtek 2.5GbE</div>
          <div className="mb-2 text-[11.5px] text-success">• Status: Connected</div>
          <div className="grid grid-cols-2 gap-x-3">
            <KV k="LINK SPEED" v="2.5 Gbps" />
            <KV k="GATEWAY" v="192.168.1.1" />
            <KV k="IPv4" v="192.168.1.24" />
            <KV k="MTU" v="1500" />
          </div>
          <KV k="DNS SERVERS" v="1.1.1.1, 8.8.8.8" />
        </Card>
        <Card>
          <Label className="mb-2 text-foreground">NETWORK HEALTH & DIAGNOSTICS</Label>
          <div className="grid grid-cols-4 gap-2">
            {[
              ["LATENCY", tested ? "11 ms" : "—"],
              ["JITTER", tested ? "1.4 ms" : "—"],
              ["LOSS", tested ? "0%" : "—"],
              ["DNS TIME", tested ? "9 ms" : "—"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-border bg-window p-2.5 text-center">
                <div className="text-lg font-bold">{v}</div>
                <div className="text-[9px] font-bold tracking-widest text-subtle">{k}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-4 text-[11.5px]">
            <span>
              Gateway: <b className="text-success">Reachable</b>
            </span>
            <span>
              Internet: <b className="text-success">Online</b>
            </span>
          </div>
        </Card>
        <Card>
          <Label className="mb-2 text-foreground">INTERNET THROUGHPUT</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-border bg-window p-3 text-center">
              <div className="text-xl font-bold text-cyan">{tested ? "912" : "—"}</div>
              <div className="text-[9px] font-bold tracking-widest text-subtle">DOWNLOAD Mbps</div>
            </div>
            <div className="rounded-lg border border-border bg-window p-3 text-center">
              <div className="text-xl font-bold text-cyan">{tested ? "486" : "—"}</div>
              <div className="text-[9px] font-bold tracking-widest text-subtle">UPLOAD Mbps</div>
            </div>
          </div>
          <Btn size="sm" className="mt-3 w-full" onClick={() => simulate("Flush DNS cache")}>
            🚀 Flush DNS cache
          </Btn>
        </Card>
      </div>
      <StatTiles
        items={[
          { label: "TOTAL", value: 24 },
          { label: "SUPPORTED", value: 22 },
          { label: "APPLICABLE", value: 18, tone: "cyan" },
          { label: "PENDING", value: 4, tone: "warning" },
          { label: "OPTIMIZED", value: 14, tone: "success" },
          { label: "NOT APPLICABLE", value: 4 },
        ]}
      />
      <Card>
        <Cols cols="320px 1fr" className="mb-3 items-center">
          <SearchBox placeholder="Search network targets…" value={q} onChange={setQ} />
          <Chips
            options={["ALL", "TCP/IP", "MMCSS", "HARDWARE", "PENDING", "OPTIMIZED"]}
            value={f}
            onChange={setF}
          />
        </Cols>
        <div className="mb-4 flex items-center justify-between rounded-xl border border-cyan/30 bg-cyan/5 p-4">
          <div>
            <Label className="text-foreground">BATCH SYSTEM NETWORK OPTIMIZATION</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Simulates backup, apply and readback for all currently pending network targets. No
              network settings are changed.
            </p>
          </div>
          <Btn variant="primary" onClick={() => simulate("Batch network optimization")}>
            Optimize all pending
          </Btn>
        </div>
        <Label className="mb-2 text-foreground">PERSISTENT NETWORK OPTIMIZATION TARGETS</Label>
        <div className="space-y-1.5">
          {vis.map((n) => (
            <div
              key={n[0]}
              className="flex items-center justify-between rounded-lg border border-border bg-window px-3 py-2.5 text-[12.5px]"
            >
              <span className="font-semibold">{n[0]}</span>
              <span className="flex gap-1.5">
                <Badge>{n[1]}</Badge>
                <Badge tone={n[2] === "OPTIMIZED" ? "success" : "warning"}>{n[2]}</Badge>
              </span>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <SectionTitle title="ONE-TIME NETWORK ACTIONS & MAINTENANCE" />
        <div
          className="grid items-center gap-4 rounded-lg border border-border bg-window p-3"
          style={{ gridTemplateColumns: "auto 1fr auto auto" }}
        >
          <span className="text-xl">🌐</span>
          <div>
            <div className="text-[13px] font-semibold">
              DNS Resolver Cache Flush{" "}
              <span className="text-[11px] text-cyan">• Maintenance Action</span>
            </div>
            <p className="text-[11.5px] text-muted-foreground">
              Flushes and purges the Windows DNS client resolver cache to resolve domain lookup
              issues.
            </p>
          </div>
          <Badge>SESSION STATUS: READY</Badge>
          <Btn size="sm" onClick={() => simulate("Flush DNS cache")}>
            🚀 Flush DNS cache
          </Btn>
        </div>
      </Card>
      <SimNotice />
    </div>
  );
}

/* ───────── STORAGE OPTIMIZER ───────── */
const CLEAN_CATS = [
  ["Windows temporary files", "1.2 GB", "SAFE"],
  ["DirectX shader cache", "640 MB", "SAFE"],
  ["Windows Update cleanup", "1.1 GB", "SAFE"],
  ["Crash dumps & error reports", "380 MB", "SAFE"],
  ["Delivery Optimization cache", "210 MB", "LOW"],
  ["Browser caches (logins preserved)", "—", "PROTECTED"],
] as const;
export function StoragePage() {
  const [fileSel, setFileSel] = useState<Set<string>>(new Set());
  const [cleanSel, setCleanSel] = useState<Set<string>>(
    new Set(CLEAN_CATS.filter((c) => c[2] === "SAFE").map((c) => c[0])),
  );
  const [drive, setDrive] = useState("All drives");
  const [minimum, setMinimum] = useState("100 MB");
  const [sortFiles, setSortFiles] = useState("Size");
  const fileRows = [
    ["gameplay_capture_0412.mp4", "D:\\Captures", "8.4 GB", "VIDEO"],
    ["win11_24h2.iso", "D:\\Downloads", "5.8 GB", "ISO"],
    ["project_backup.zip", "C:\\Users\\Demo", "2.1 GB", "ARCHIVE"],
  ];

  const [explorer, setExplorer] = useState(false);
  const [smart, setSmart] = useState(false);
  const [type, setType] = useState("ALL");
  const visibleFiles = fileRows
    .filter(
      (r) =>
        (type === "ALL" ||
          r[3] === ({ VIDEOS: "VIDEO", ARCHIVES: "ARCHIVE" } as Record<string, string>)[type] ||
          r[3] === type) &&
        (drive === "All drives" || r[1]?.startsWith(drive)),
    )
    .sort((a, b) =>
      sortFiles === "Name"
        ? (a[0] ?? "").localeCompare(b[0] ?? "")
        : parseFloat(b[2] ?? "0") - parseFloat(a[2] ?? "0"),
    );
  const [scanned, setScanned] = useState(false);
  const deep = useSimRun(2400);
  if (explorer)
    return (
      <div className="space-y-4">
        <div className="grid items-center gap-3" style={{ gridTemplateColumns: "auto 1fr auto" }}>
          <Btn variant="ghost" onClick={() => setExplorer(false)}>
            ◄ Back to overview
          </Btn>
          <div>
            <h1 className="text-xl font-bold tracking-wide">FULL FILE EXPLORER</h1>
            <p className="text-xs text-muted-foreground">
              Search, inspect, and safely manage real files across all accessible locations.
            </p>
          </div>
          <Btn variant="primary" onClick={() => setScanned(true)}>
            Scan files
          </Btn>
        </div>
        <Card>
          <Label className="mb-2 text-foreground">FILESYSTEM SCAN SUMMARY</Label>
          <div className="flex flex-wrap gap-2 text-[11.5px]">
            {[
              "📁 ALL: 128",
              "🎬 VIDEOS: 22",
              "🖼️ IMAGES: 41",
              "🎵 AUDIO: 9",
              "📄 DOCS: 18",
              "⚙️ APPS: 7",
              "📦 ARCHIVES: 12",
              "💿 ISO: 2",
              "💻 PROJECTS: 11",
              "📁 OTHER: 6",
            ].map((x) => (
              <span key={x} className="rounded-md border border-border bg-window px-2 py-1">
                {x}
              </span>
            ))}
          </div>
        </Card>
        <Card>
          <div className="grid grid-cols-3 gap-4">
            {[
              ["DRIVE", ["All drives", "C:", "D:"]],
              ["MINIMUM SIZE", ["100 MB", "500 MB", "1 GB"]],
              ["SORT BY", ["Size", "Modified", "Name"]],
            ].map(([k, o]) => (
              <div key={k as string}>
                <Label className="mb-1">{k as string}</Label>
                <select
                  aria-label={k as string}
                  value={k === "DRIVE" ? drive : k === "MINIMUM SIZE" ? minimum : sortFiles}
                  onChange={(e) =>
                    k === "DRIVE"
                      ? setDrive(e.target.value)
                      : k === "MINIMUM SIZE"
                        ? setMinimum(e.target.value)
                        : setSortFiles(e.target.value)
                  }
                  className="h-9 w-full rounded-lg border border-border bg-window px-2 text-sm"
                >
                  {(o as string[]).map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <Label className="mt-4 mb-2">QUICK TYPE FILTERS</Label>
          <Chips
            options={[
              "ALL",
              "VIDEOS",
              "IMAGES",
              "AUDIO",
              "DOCS",
              "APPS",
              "ARCHIVES",
              "ISO",
              "PROJECTS",
              "OTHER",
            ]}
            value={type}
            onChange={setType}
          />
        </Card>
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-warning">— User review required before deletion</span>
            <div className="flex gap-1.5">
              <Btn size="sm" onClick={() => setFileSel(new Set(fileRows.map((r) => r[0] ?? "")))}>
                Select all
              </Btn>
              <Btn
                size="sm"
                onClick={() => setFileSel(new Set(visibleFiles.map((r) => r[0] ?? "")))}
              >
                Select filtered
              </Btn>
              <Btn size="sm" variant="ghost" onClick={() => setFileSel(new Set())}>
                Deselect all
              </Btn>
              <Btn
                size="sm"
                variant="danger"
                disabled={!fileSel.size}
                onClick={() => {
                  simulate(`Move ${fileSel.size} sample files to Recycle Bin`);
                  setFileSel(new Set());
                }}
              >
                Delete selected
              </Btn>
            </div>
          </div>
          {!scanned ? (
            <EmptyState
              title="No files scanned yet."
              sub="Scan your drives to find large files and manage storage."
              action={<Btn onClick={() => setScanned(true)}>Scan files</Btn>}
            />
          ) : (
            <div className="eo-data-table rounded-lg border border-border">
              <div
                className="grid bg-window px-3 py-2 eo-label text-[9px] text-subtle"
                style={{ gridTemplateColumns: "34px 1fr 72px 72px 120px 90px 95px" }}
              >
                <span />
                <span>FILE & LOCATION</span>
                <span>SIZE</span>
                <span>TYPE</span>
                <span>SAFETY</span>
                <span>MODIFIED</span>
                <span>ACTIONS</span>
              </div>
              {visibleFiles.map((r) => (
                <div
                  key={r[0]}
                  className="grid items-center border-t border-border px-3 py-2 text-[12px]"
                  style={{ gridTemplateColumns: "34px 1fr 72px 72px 120px 90px 95px" }}
                >
                  <Check
                    label={`Select ${r[0]}`}
                    on={fileSel.has(r[0] ?? "")}
                    onChange={(v) =>
                      setFileSel((current) => {
                        const next = new Set(current);
                        if (v) next.add(r[0] ?? "");
                        else next.delete(r[0] ?? "");
                        return next;
                      })
                    }
                  />
                  <div>
                    <div className="font-semibold">{r[0]}</div>
                    <div className="text-[10.5px] text-subtle">{r[1]}</div>
                  </div>
                  <span>{r[2]}</span>
                  <span>{r[3]}</span>
                  <Badge tone="warning">USER FILE</Badge>
                  <span className="text-subtle">2026-10-12</span>
                  <Btn
                    size="sm"
                    variant="ghost"
                    onClick={() => simulate(`Reveal sample location for ${r[0]}`)}
                  >
                    Reveal
                  </Btn>
                </div>
              ))}
            </div>
          )}
        </Card>
        <SimNotice>Sample file list. The prototype cannot see your files.</SimNotice>
      </div>
    );
  return (
    <div className="space-y-4">
      <PageHeader
        title="Storage Optimizer"
        sub="Analyze storage, find unnecessary files, and safely manage disk space."
        actions={
          <>
            <Btn variant="primary" onClick={() => setSmart(true)}>
              Smart clean
            </Btn>
            <Btn variant="ghost" onClick={() => simulate("Refresh")}>
              Refresh
            </Btn>
          </>
        }
      />
      <StatTiles
        items={[
          { label: "STORAGE HEALTH", value: "100%", tone: "success" },
          { label: "FREE SPACE", value: "1.08 TB" },
          { label: "USED SPACE", value: "920 GB" },
          { label: "RECLAIMABLE", value: "3.4 GB", sub: "Run scan to update", tone: "cyan" },
        ]}
      />
      <Card>
        <Label className="mb-3 text-foreground">DETECTED DRIVES</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["C:  Samsung 990 PRO", 46, "NVMe · 2 TB"],
            ["D:  WD Blue SN580", 71, "NVMe · 1 TB"],
          ].map(([n, u, s]) => (
            <div key={n as string} className="rounded-lg border border-border bg-window p-3">
              <div className="flex justify-between text-[13px] font-semibold">
                <span>{n}</span>
                <span className="text-muted-foreground">{u}%</span>
              </div>
              <Bar
                value={u as number}
                tone={(u as number) > 70 ? "warning" : "cyan"}
                className="my-2"
              />
              <div className="text-[11px] text-subtle">{s}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <SectionTitle
          title="DEEP CLEAN"
          sub="All applicable cleanup optimizations in this sample."
          right={
            deep.running ? (
              <Btn size="sm" variant="ghost" onClick={deep.cancel}>
                Cancel
              </Btn>
            ) : (
              <Btn size="sm" onClick={() => deep.start()}>
                Scan applicability
              </Btn>
            )
          }
        />
        {deep.running && <Bar value={deep.progress ?? 0} className="mb-3" />}
        <StatTiles
          items={[
            { label: "TOTAL CHECKS", value: 18 },
            { label: "SUPPORTED", value: 16 },
            { label: "APPLICABLE", value: 6, tone: "cyan" },
            { label: "ALREADY CLEAN", value: 8, tone: "success" },
            { label: "NOT APPLICABLE", value: 2 },
            { label: "PROTECTED", value: 2, tone: "warning" },
          ]}
        />
        <div className="mt-3 grid grid-cols-2 gap-2">
          {CLEAN_CATS.map(([n, s, r]) => (
            <div
              key={n}
              className="flex items-center justify-between rounded-lg border border-border bg-window px-3 py-2.5 text-[12.5px]"
            >
              <span>{n}</span>
              <span className="flex items-center gap-2">
                <span className="text-muted-foreground">{s}</span>
                <RiskBadge risk={r} />
              </span>
            </div>
          ))}
        </div>
      </Card>
      <Cols cols="1fr 1fr" gap={12}>
        <Card>
          <SectionTitle
            title="WINDOWS RECYCLE BIN"
            sub="Safely empty the Recycle Bin to immediately free up space."
          />
          <div className="grid grid-cols-2 gap-2">
            <KV k="SIZE" v="412 MB" />
            <KV k="ITEMS" v="38" />
          </div>
          <Btn className="mt-3" onClick={() => simulate("Empty Recycle Bin")}>
            Empty Recycle Bin
          </Btn>
        </Card>
        <Card>
          <SectionTitle
            title="FULL FILE EXPLORER"
            sub="Search, inspect, and safely manage real files across all accessible locations."
          />
          <Btn variant="primary" onClick={() => setExplorer(true)}>
            Open file explorer
          </Btn>
        </Card>
      </Cols>
      <SimNotice />
      <Modal
        open={smart}
        onClose={() => setSmart(false)}
        title="⚡ Smart clean"
        sub="Quick cleanup of safe, applicable temporary & cache data for THIS PC"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setSmart(false)}>
              Close
            </Btn>
            <Btn
              variant="primary"
              disabled={!cleanSel.size}
              onClick={() => {
                setSmart(false);
                simulate(`Clean ${cleanSel.size} sample categories`);
              }}
            >
              Clean selected
            </Btn>
          </>
        }
      >
        <div className="mb-3 grid grid-cols-3 gap-2">
          <KV k="SAFE REMOVABLE" v="3.4 GB" />
          <KV k="REVIEW / LOW RISK" v="210 MB" />
          <KV k="PROTECTED SYSTEM" v="2" />
        </div>
        <div className="mb-2 flex gap-1.5">
          <Btn size="sm" variant="ghost" onClick={() => simulate("Rescan sample cleanup")}>
            Rescan
          </Btn>
          <Btn
            size="sm"
            onClick={() =>
              setCleanSel(new Set(CLEAN_CATS.filter((c) => c[2] === "SAFE").map((c) => c[0])))
            }
          >
            Select all safe
          </Btn>
          <Btn size="sm" variant="ghost" onClick={() => setCleanSel(new Set())}>
            Deselect all
          </Btn>
        </div>
        <div className="space-y-1.5">
          {CLEAN_CATS.filter((c) => c[2] !== "PROTECTED").map(([n, s, r]) => (
            <div
              key={n}
              className="flex items-center gap-3 rounded-lg border border-border bg-window px-3 py-2 text-[12.5px]"
            >
              <Check
                label={`Select ${n}`}
                on={cleanSel.has(n)}
                onChange={(v) =>
                  setCleanSel((current) => {
                    const next = new Set(current);
                    if (v) next.add(n);
                    else next.delete(n);
                    return next;
                  })
                }
              />
              <span className="flex-1">{n}</span>
              <span className="text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

/* ───────── SYSTEM TOOLS ───────── */
const TOOLS = [
  ["System File Checker (SFC)", "REPAIR & INTEGRITY", true],
  ["DISM Component Store Repair", "REPAIR & INTEGRITY", true],
  ["Check Disk (read-only scan)", "HARDWARE & BIOS", true],
  ["Memory Diagnostic Scheduler", "MEMORY", true],
  ["Clear Standby Memory", "MEMORY", true],
  ["Temp & Cache Cleanup", "CLEANUP", false],
  ["Component Store Cleanup", "CLEANUP", true],
  ["Reset Windows Update Cache", "WINDOWS OS", true],
  ["Rebuild Icon & Thumbnail Cache", "WINDOWS OS", false],
  ["Reset Network Stack (Winsock)", "NETWORK", true],
  ["Flush DNS Resolver Cache", "NETWORK", false],
  ["Restart Graphics Driver", "GPU & DISPLAY", false],
  ["Clear DirectX Shader Cache", "GPU & DISPLAY", false],
  ["Battery & Energy Report", "HARDWARE & BIOS", true],
  ["Re-register Store Apps", "ADVANCED", true],
  ["Reboot to UEFI Firmware", "ADVANCED", true],
] as const;
export function ToolsPage() {
  const [c, setC] = useState("ALL TOOLS");
  const [q, setQ] = useState("");
  const [activity, setActivity] = useState<string[]>([]);
  const [runT, setRunT] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const r = useSimRun(3000);
  const stage = ["PREPARING", "SCANNING", "VERIFYING", "REPAIRING", "FINALIZING"][
    Math.min(4, Math.floor((r.progress ?? 0) / 20))
  ];
  const vis = TOOLS.filter(
    (t) => (c === "ALL TOOLS" || t[1] === c) && t[0].toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div className="space-y-4">
      <PageHeader
        title="System Tools & Health Diagnostics"
        sub="Unified toolbox — 16 advanced Windows diagnostics, repair, and cleanup tools."
        actions={
          <Btn variant="ghost" onClick={() => simulate("Refresh")}>
            Refresh
          </Btn>
        }
      />
      <Card
        className="grid items-center gap-5"
        style={{ gridTemplateColumns: "auto 1fr auto" } as React.CSSProperties}
      >
        <div className="text-center">
          <div className="text-4xl font-black text-success">92</div>
          <div className="text-[10px] font-bold text-subtle">/ 100</div>
        </div>
        <p className="text-sm text-muted-foreground">
          System health score based on integrity, storage and memory checks (sample).
        </p>
        <div className="flex gap-2">
          <Btn variant="primary" onClick={() => simulate("One-click optimize")}>
            One-click optimize
          </Btn>
          <Btn onClick={() => simulate("Re-scan health")}>Re-scan health</Btn>
        </div>
      </Card>
      <SearchBox
        placeholder="Search tools, categories, actions, or components (e.g. sfc, ram, dism, network)…"
        value={q}
        onChange={setQ}
      />
      <Chips
        options={[
          "ALL TOOLS",
          "CLEANUP",
          "MEMORY",
          "REPAIR & INTEGRITY",
          "HARDWARE & BIOS",
          "WINDOWS OS",
          "NETWORK",
          "GPU & DISPLAY",
          "ADVANCED",
        ]}
        value={c}
        onChange={setC}
      />
      <div className="grid grid-cols-4 gap-2.5">
        {vis.map(([n, cat, elev]) => (
          <div key={n} className="eo-card flex flex-col p-4">
            <Label className="text-cyan">{cat}</Label>
            <div className="mt-1.5 flex-1 text-[13px] font-bold">{n}</div>
            <div className="mt-3 flex items-center justify-between">
              {elev ? (
                <Badge tone="warning">REQUIRES ELEVATION</Badge>
              ) : (
                <Badge tone="success">STANDARD</Badge>
              )}
              <span className="flex gap-1">
                <Btn size="sm" variant="ghost" onClick={() => setInfo(n)}>
                  Info
                </Btn>
                <Btn
                  size="sm"
                  onClick={() => {
                    setRunT(n);
                    r.start(() => setActivity((a) => [`${n} — simulated completion`, ...a]));
                  }}
                >
                  Run
                </Btn>
              </span>
            </div>
          </div>
        ))}
      </div>
      {!vis.length && (
        <EmptyState
          title="NO TOOLS FOUND"
          sub="No system tools or diagnostics match your current search query or active category."
          action={
            <Btn
              size="sm"
              onClick={() => {
                setC("ALL TOOLS");
                setQ("");
              }}
            >
              Reset all filters
            </Btn>
          }
        />
      )}
      <Card>
        <SectionTitle title="RECENT TOOL ACTIVITY" />
        <p className="text-xs text-muted-foreground">
          {activity.length ? activity.join(" · ") : "No tool actions executed in this session yet."}
        </p>
      </Card>
      <SimNotice />
      <Modal
        open={!!runT}
        onClose={() => setRunT(null)}
        title={`TOOL: ${runT ?? ""}`}
        sub="SERVICE: simulated"
        footer={
          <>
            <span className="mr-auto text-[11px] text-success">
              ● Transactional safety (simulated)
            </span>
            <Btn
              variant="ghost"
              onClick={() => {
                r.cancel();
                setRunT(null);
              }}
            >
              {r.running ? "Cancel" : "Close"}
            </Btn>
          </>
        }
      >
        <div className="mb-2 flex justify-between text-[10px] font-bold tracking-widest">
          <span className="text-cyan">
            {r.running ? stage : "✓ SIMULATION COMPLETE • NO CHANGES MADE"}
          </span>
          <span>{(r.progress ?? 100).toFixed(0)}%</span>
        </div>
        <Bar value={r.progress ?? 100} tone={r.running ? "cyan" : "success"} />
        <div className="mt-4 grid gap-2" style={{ gridTemplateColumns: "1fr 1fr 90px 1fr" }}>
          <KV k="TARGET" v="Local PC" />
          <KV k="PROCESS" v="sim" />
          <KV k="ELAPSED" v="3 s" />
          <KV k="BACKEND" v="Simulated" />
        </div>
      </Modal>
      <Modal
        open={!!info}
        onClose={() => setInfo(null)}
        title={info ?? ""}
        footer={<Btn onClick={() => setInfo(null)}>Close</Btn>}
      >
        {[
          "FUNCTION OVERVIEW",
          "TECHNICAL SPECIFICATION & ENGINE",
          "AFFECTED SUBSYSTEMS & COMPONENTS",
        ].map((s) => (
          <div key={s} className="mb-3">
            <Label className="mb-1 text-cyan">{s}</Label>
            <p className="text-xs text-muted-foreground">
              Described in the native app from tool metadata.
            </p>
          </div>
        ))}
        <Label className="mb-1 text-cyan">SECURITY & EXECUTION ARCHITECTURE</Label>
        <Cols cols="1fr 1fr">
          <KV k="SAFETY LEVEL" v="Safe" />
          <KV k="ELEVATION" v="Admin" />
          <KV k="EXECUTION METHOD" v="Native" />
          <KV k="VERIFICATION" v="Exit code + readback" />
        </Cols>
      </Modal>
    </div>
  );
}

/* ───────── PROCESS INTELLIGENCE ───────── */
const PROCS = [
  {
    n: "OneDrive.exe",
    mem: 182,
    cpu: 0.4,
    s: "SAFE TO TERMINATE",
    why: "Sync client, restarts on demand",
    pid: 8412,
  },
  {
    n: "Teams.exe",
    mem: 420,
    cpu: 1.6,
    s: "SAFE TO TERMINATE",
    why: "Background chat client",
    pid: 6120,
  },
  {
    n: "SearchHost.exe",
    mem: 96,
    cpu: 0.1,
    s: "CAUTION",
    why: "Windows search UI host",
    pid: 3304,
  },
  {
    n: "explorer.exe",
    mem: 140,
    cpu: 0.6,
    s: "PROTECTED / SYSTEM",
    why: "Windows shell",
    pid: 4120,
  },
  {
    n: "AdobeUpdateService.exe",
    mem: 38,
    cpu: 0,
    s: "SAFE TO TERMINATE",
    why: "Updater service",
    pid: 2288,
  },
  {
    n: "csrss.exe",
    mem: 6,
    cpu: 0,
    s: "PROTECTED / SYSTEM",
    why: "Critical system process",
    pid: 712,
  },
];
export function ProcessReductionPage() {
  const [f, setF] = useState("ALL");
  const [sort, setSort] = useState("SAFETY + RAM");
  const [sel, setSel] = useState<Set<number>>(new Set());
  const [confirm, setConfirm] = useState(false);
  const [d, setD] = useState<(typeof PROCS)[number] | null>(null);
  const vis = PROCS.filter(
    (p) =>
      f === "ALL" ||
      p.s === f ||
      (f === "HIGH MEMORY (>100MB)" && p.mem > 100) ||
      (f === "HIGH CPU (>1%)" && p.cpu > 1),
  ).sort((a, b) =>
    sort === "RAM"
      ? b.mem - a.mem
      : sort === "CPU"
        ? b.cpu - a.cpu
        : sort === "NAME"
          ? a.n.localeCompare(b.n)
          : a.s.localeCompare(b.s) || b.mem - a.mem,
  );
  const tone = (s: string) =>
    (s === "SAFE TO TERMINATE" ? "success" : s === "CAUTION" ? "warning" : "cyan") as
      "success" | "warning" | "cyan";
  return (
    <div className="space-y-4">
      <PageHeader
        title="Process Intelligence"
        badges={<Badge tone="cyan">SAFE BACKGROUND PROCESS MANAGEMENT</Badge>}
        sub="Analyze running processes, identify non-essential background activity, and safely reclaim memory."
        actions={<Btn onClick={() => simulate("Rescan")}>↻ Refresh / Rescan</Btn>}
      />
      <StatTiles
        items={[
          {
            label: "SAFE TO TERMINATE",
            value: PROCS.filter((p) => p.s === "SAFE TO TERMINATE").length,
            sub: "Classified as safe",
            tone: "success",
          },
          { label: "SELECTED", value: sel.size, sub: "Marked for safe termination", tone: "cyan" },
          {
            label: "RAM RECLAIMABLE",
            value: `${PROCS.filter((p) => sel.has(p.pid)).reduce((a, p) => a + p.mem, 0)} MB`,
            sub: "From selected processes",
          },
          {
            label: "SYSTEM STATUS",
            value: "Healthy",
            sub: "Based on process & memory state",
            tone: "success",
          },
        ]}
      />
      <Card>
        <div className="mb-3 flex justify-between gap-2">
          <Chips
            options={[
              "ALL",
              "SAFE TO TERMINATE",
              "CAUTION",
              "PROTECTED / SYSTEM",
              "HIGH MEMORY (>100MB)",
              "HIGH CPU (>1%)",
            ]}
            value={f}
            onChange={setF}
          />
          <div className="flex gap-1.5">
            <Btn
              size="sm"
              onClick={() =>
                setSel(new Set(PROCS.filter((p) => p.s === "SAFE TO TERMINATE").map((p) => p.pid)))
              }
            >
              Select all safe
            </Btn>
            <Btn size="sm" variant="ghost" onClick={() => setSel(new Set())}>
              Deselect all
            </Btn>
          </div>
        </div>
        <div className="mb-3 flex items-center gap-2">
          <Label>SORT:</Label>
          <Chips options={["SAFETY + RAM", "RAM", "CPU", "NAME"]} value={sort} onChange={setSort} />
        </div>
        <Label className="mb-2 text-foreground">BACKGROUND PROCESS CANDIDATES</Label>
        <div className="eo-data-table rounded-lg border border-border">
          <div
            className="grid bg-window px-3 py-2 eo-label text-[9px] text-subtle"
            style={{ gridTemplateColumns: "32px 65px 1fr 65px 150px 1fr 60px 65px" }}
          >
            <span>SEL</span>
            <span>MEMORY</span>
            <span>PROCESS & IDENTITY</span>
            <span>CPU</span>
            <span>SAFETY LEVEL</span>
            <span>REASON</span>
            <span>PID</span>
            <span>ACTION</span>
          </div>
          {vis.map((p) => (
            <div
              key={p.pid}
              className="grid items-center border-t border-border px-3 py-2 text-[12px]"
              style={{ gridTemplateColumns: "32px 65px 1fr 65px 150px 1fr 60px 65px" }}
            >
              {p.s === "SAFE TO TERMINATE" ? (
                <Check
                  on={sel.has(p.pid)}
                  onChange={() =>
                    setSel((s) => {
                      return toggleInSet(s, p.pid);
                    })
                  }
                />
              ) : (
                <span />
              )}
              <span>{p.mem} MB</span>
              <span className="font-semibold">{p.n}</span>
              <span>{p.cpu}%</span>
              <Badge tone={tone(p.s)}>{p.s}</Badge>
              <span className="text-muted-foreground">{p.why}</span>
              <span className="font-mono text-subtle">{p.pid}</span>
              <Btn size="sm" variant="ghost" onClick={() => setD(p)}>
                Info
              </Btn>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-end">
          <Btn variant="danger" disabled={!sel.size} onClick={() => setConfirm(true)}>
            Terminate selected
          </Btn>
        </div>
      </Card>
      <SimNotice />
      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Terminate selected processes?"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setConfirm(false)}>
              Cancel
            </Btn>
            <Btn
              variant="danger"
              onClick={() => {
                setConfirm(false);
                setSel(new Set());
                simulate("Terminate processes");
              }}
            >
              Confirm terminate
            </Btn>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Warning: the selected background processes will be terminated immediately. Unsaved data in
          them may be lost.
        </p>
      </Modal>
      <Modal
        open={!!d}
        onClose={() => setD(null)}
        title={d?.n ?? ""}
        footer={<Btn onClick={() => setD(null)}>Close</Btn>}
      >
        {d && (
          <>
            <KV k="Process ID (PID):" v={d.pid} />
            <KV k="Publisher / Company:" v="Sample publisher" />
            <KV k="Working Set Memory:" v={`${d.mem} MB`} />
            <KV k="CPU Usage (Approx):" v={`${d.cpu}%`} />
            <KV k="Safety Level:" v={d.s} />
            <KV k="Analysis Reason:" v={d.why} />
          </>
        )}
      </Modal>
    </div>
  );
}
