// AiOptimizationView, BackupRestoreView, SettingsView, AboutView, PerformanceTuningView
import { useState, type ReactNode } from "react";
import {
  Badge,
  Bar,
  Btn,
  Card,
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
} from "../kit";
import { useAppearance } from "../Appearance";
import { NumberField, RangeSlider, Segmented } from "../controls";
import { RotateCcw, ShieldCheck, Target } from "lucide-react";
import { CATALOG, HW, PROFILES } from "@/lib/eo/data";
import { cn } from "@/lib/utils";

/* ───────── AI OPTIMIZATION (3 sub-modules via top segmented control) ───────── */
export function AiOptimizationPage() {
  const [query, setQuery] = useState("");
  const [workloadOptions, setWorkloadOptions] = useState<Record<string, boolean>>({});
  const [autoPower, setAutoPower] = useState(false);
  const [mod, setMod] = useState("RAM LIMITER");
  const [mode, setMode] = useState("AUTO");
  const [ctl, setCtl] = useState("NORMAL");
  const [inv, setInv] = useState("ALL");
  const [limit, setLimit] = useState(RAM_DEFAULT_GB);
  const [enforced, setEnforced] = useState<number | null>(null);
  const [fg, setFg] = useState(true);
  const [plan, setPlan] = useState(false);
  return (
    <div className="space-y-4">
      <PageHeader
        title="AI Optimization"
        badges={
          <>
            <Badge tone="cyan">3 MODULES</Badge>
            <Badge tone="warning">SAMPLE DATA</Badge>
          </>
        }
        sub="Sample RAM limits, workload profiles and power recommendations; confirmation required."
      />
      <Card className="flex flex-wrap items-center justify-between gap-3 py-3">
        <Segmented
          label="AI module"
          options={["RAM LIMITER", "WORKLOAD OPTIMIZATION", "POWER PLAN OPTIMIZATION"]}
          value={mod}
          onChange={setMod}
        />
        <div className="flex items-center gap-2">
          <Btn size="sm" variant="ghost" onClick={() => simulate("Refresh")}>
            Refresh
          </Btn>
          <Segmented
            label="Control mode"
            options={["NORMAL", "CUSTOM"]}
            value={ctl}
            onChange={setCtl}
          />
        </div>
      </Card>
      <StatTiles
        items={[
          { label: "RAM USAGE · SAMPLE", value: "38%", sub: "32 GB system memory" },
          { label: "AUTO ACTIONS", value: 3 },
          { label: "HIGH-RAM APPS", value: 2 },
          { label: "CUSTOM TARGETS", value: 1 },
          { label: "SAFE", value: 6, tone: "success" },
          { label: "MEDIUM RISK", value: 1, tone: "warning" },
          { label: "HIGH RISK", value: 0, tone: "danger" },
        ]}
      />
      <Card className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="text-[12px] text-muted-foreground">
          <span className="font-semibold text-foreground">{mod}</span> · Passive monitoring ·
          Foreground shield
        </div>
        <Badge tone="success">AI READY</Badge>
      </Card>

      <div key={mod} className="eo-swap space-y-4">
        {mod === "RAM LIMITER" && (
          <>
            <Card
              className="grid items-center gap-3"
              style={{ gridTemplateColumns: "repeat(5,1fr) auto" } as React.CSSProperties}
            >
              {[
                ["ENGINE", "RAM Limiter (sample)"],
                ["ACTIVE MODE", mode],
                ["STRATEGY", "Working-set trim"],
                ["STARTUP", "Off"],
                ["STATUS", "Monitoring"],
              ].map(([k, v]) => (
                <div key={k}>
                  <Label className="text-[10px]">{k}</Label>
                  <div className="text-[13px] font-semibold">{v}</div>
                </div>
              ))}
              <Badge tone="cyan">RAM CONTROL: ON</Badge>
            </Card>
            <Card>
              <Label as="h2" className="mb-1 text-foreground">
                PROFILE / TARGET CONFIGURATION
              </Label>
              <p className="mb-3 text-xs text-muted-foreground">
                Control mode is active from the top mode selector.
              </p>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <Label>ACTIVE MODE</Label>
                <Segmented
                  label="RAM limiter mode"
                  options={["AUTO", "LIGHT", "AGGRESSIVE"]}
                  value={mode}
                  onChange={setMode}
                />
                <span className="ml-auto flex items-center gap-2">
                  <Label>FOREGROUND PROTECTION</Label>
                  <Toggle label="Foreground protection" on={fg} onChange={setFg} />
                </span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-foreground">
                  SEARCH & SELECT APPLICATION TO ADD CUSTOM RAM LIMIT
                </Label>
                <Btn size="sm" onClick={() => simulate("Add custom app")}>
                  + Add custom app
                </Btn>
              </div>
              <SearchBox
                placeholder="Search running applications…"
                value={query}
                onChange={setQuery}
              />
            </Card>
            {query && !"chrome.exe".includes(query.toLowerCase()) ? (
              <EmptyState
                title="No matching application"
                sub="The sample list only contains chrome.exe. Nothing on this PC is enumerated."
                action={<Btn onClick={() => setQuery("")}>Clear search</Btn>}
              />
            ) : (
              <RamLimiterPanel
                value={limit}
                onChange={setLimit}
                enforced={enforced}
                onEnforce={() => {
                  setEnforced(limit);
                  simulate(`Enforce ${limit.toFixed(2)} GB limit for chrome.exe`);
                }}
                mode={mode}
                foreground={fg}
              />
            )}
            <Card>
              <Label className="mb-2 text-foreground">CONFIGURED CUSTOM TARGETS</Label>
              <div
                className="grid items-center gap-3 rounded-lg border border-border bg-window px-3 py-2 text-[12.5px]"
                style={{ gridTemplateColumns: "minmax(0,1fr) 160px auto" }}
              >
                <span className="font-semibold">Discord.exe</span>
                <Bar value={(1 / RAM_MAX_GB) * 100} />
                <span className="text-right font-mono text-[11.5px] text-muted-foreground">
                  1.00 GB limit
                </span>
              </div>
            </Card>
            <Card>
              <Label className="mb-2 text-foreground">CURRENTLY RUNNING WORKLOADS</Label>
              <p className="text-xs text-muted-foreground">
                No high-RAM applications currently running.
              </p>
            </Card>
          </>
        )}

        {mod === "WORKLOAD OPTIMIZATION" && (
          <>
            <Card>
              <Label className="mb-2 text-foreground">CURRENTLY RUNNING WORKLOADS</Label>
              <div className="flex items-center gap-3 rounded-lg border border-dashed border-border-strong p-4">
                <span className="text-xl">🎮</span>
                <div>
                  <div className="text-[13px] font-bold">NO SUPPORTED WORKLOAD RUNNING</div>
                  <p className="text-xs text-muted-foreground">
                    Launch any supported game, emulator, creative tool, or video AI workload to
                    activate its profile.
                  </p>
                </div>
              </div>
            </Card>
            <Card>
              <Label className="mb-3 text-foreground">INSTALLED WORKLOAD INVENTORY</Label>
              <div className="mb-3 flex items-center justify-between">
                <Chips
                  options={["ALL", "GAMES", "CREATIVE", "VIDEO AI", "EMULATORS"]}
                  value={inv}
                  onChange={setInv}
                />
                <Btn size="sm" onClick={() => simulate("Add custom app")}>
                  + Add custom app
                </Btn>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["Valorant", "GAMES"],
                  ["Counter-Strike 2", "GAMES"],
                  ["After Effects", "CREATIVE"],
                  ["DaVinci Resolve", "CREATIVE"],
                  ["Topaz Video AI", "VIDEO AI"],
                  ["MSI App Player 5", "EMULATORS"],
                ]
                  .filter((x) => inv === "ALL" || x[1] === inv)
                  .map(([n, c]) => (
                    <div
                      key={n}
                      className="flex items-center justify-between rounded-lg border border-border bg-window px-3 py-2.5 text-[12.5px]"
                    >
                      <span className="font-semibold">{n}</span>
                      <Badge>{c}</Badge>
                    </div>
                  ))}
              </div>
              <Btn
                size="sm"
                variant="ghost"
                className="mt-3"
                onClick={() => simulate("Force rescan inventory")}
              >
                Force rescan inventory
              </Btn>
            </Card>
            <Card>
              <div className="mb-3 flex items-center justify-between">
                <Label className="text-foreground">SELECTED TARGET CONFIGURATION</Label>
                <Btn size="sm" variant="primary" onClick={() => simulate("Save profile")}>
                  Save profile
                </Btn>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Foreground CPU priority boost",
                  "GPU preference: High performance",
                  "Suspend background updaters",
                  "Standby memory refresh on launch",
                ].map((o) => (
                  <div
                    key={o}
                    className="flex items-center justify-between rounded-lg border border-border bg-window px-3 py-2.5 text-[12.5px]"
                  >
                    <span>{o}</span>
                    <Toggle
                      label={o}
                      on={workloadOptions[o] !== false}
                      onChange={(v) => setWorkloadOptions((s) => ({ ...s, [o]: v }))}
                    />
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <Label className="mb-2 text-foreground">SAVED CUSTOM PROFILES</Label>
              <p className="text-xs text-muted-foreground">No saved profiles yet.</p>
            </Card>
          </>
        )}

        {mod === "POWER PLAN OPTIMIZATION" && (
          <>
            <Card>
              <Label className="mb-3 text-cyan">AI POWER RECOMMENDATION</Label>
              <div className="grid grid-cols-3 gap-3.5">
                {[
                  ["RECOMMENDED PLAN:", "AI Max Performance"],
                  ["HARDWARE:", "Desktop · 8C/16T"],
                  ["WORKLOAD:", "Gaming"],
                  ["CURRENT ACTIVE:", "Balanced"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <Label className="text-[10px]">{k}</Label>
                    <div className="text-[13px] font-semibold">{v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Btn variant="primary" onClick={() => setPlan(true)}>
                  + Create power plan
                </Btn>
                <Btn onClick={() => simulate("Restore previous plan")}>Restore previous</Btn>
                <Btn variant="ghost" onClick={() => simulate("Refresh")}>
                  Refresh
                </Btn>
              </div>
            </Card>
            <Card className="flex items-center justify-between">
              <div>
                <div className="text-[13px] font-bold">AUTO ENABLE ON WINDOWS STARTUP</div>
                <p className="text-xs text-muted-foreground">Continuous Enforcement</p>
              </div>
              <Toggle label="Power plan startup policy" on={autoPower} onChange={setAutoPower} />
            </Card>
            <Card>
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Label className="text-foreground">ERROR OPTIMIZER AI</Label>
                    <Badge tone="cyan">MACHINE-SPECIFIC POLICIES</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Machine-specific AI power schemes calibrated for the sample processor and
                    workload.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Btn size="sm" onClick={() => simulate("AI Battery Efficiency")}>
                    AI battery efficiency
                  </Btn>
                  <Btn size="sm" variant="primary" onClick={() => simulate("AI Max Performance")}>
                    AI max performance
                  </Btn>
                </div>
              </div>
            </Card>
            <Card>
              <div className="mb-3 flex items-center gap-2">
                <Label className="text-foreground">WINDOWS POWER PLANS</Label>
                <Badge tone="warning">SAMPLE PLANS</Badge>
              </div>
              <div className="space-y-1.5">
                {["Balanced", "High performance", "Ultimate Performance", "Power saver"].map(
                  (p, i) => (
                    <div
                      key={p}
                      className="flex items-center justify-between rounded-lg border border-border bg-window px-3 py-2.5 text-[12.5px]"
                    >
                      <span>{p}</span>
                      {i === 0 ? (
                        <Badge tone="success">ACTIVE</Badge>
                      ) : (
                        <Btn size="sm" variant="ghost" onClick={() => simulate(`Activate ${p}`)}>
                          Activate
                        </Btn>
                      )}
                    </div>
                  ),
                )}
              </div>
            </Card>
          </>
        )}
      </div>
      <SimNotice />
      <Modal
        open={plan}
        onClose={() => setPlan(false)}
        title="Create new custom Windows power plan"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setPlan(false)}>
              Cancel
            </Btn>
            <Btn
              variant="primary"
              onClick={() => {
                setPlan(false);
                simulate("Create & verify power plan");
              }}
            >
              Create & verify in Windows
            </Btn>
          </>
        }
      >
        <Cols cols="1fr 1fr">
          <div>
            <Label className="mb-1">PLAN NAME</Label>
            <input
              className="h-9 w-full rounded-lg border border-border bg-window px-3 text-sm"
              defaultValue="EO Custom Performance"
            />
          </div>
          <div>
            <Label className="mb-1">DUPLICATE REAL BASE SCHEME</Label>
            <select className="h-9 w-full rounded-lg border border-border bg-window px-2 text-sm">
              <option>High performance</option>
              <option>Balanced</option>
            </select>
          </div>
        </Cols>
      </Modal>
    </div>
  );
}

/* ── RAM Limiter panel: slider + numeric field always share one value ── */
const RAM_MIN_GB = 0.5;
const RAM_MAX_GB = 8;
const RAM_STEP_GB = 0.25;
const RAM_DEFAULT_GB = 2; // original prototype default (2048 MB); shown as the recommended mark
const SYSTEM_RAM_GB = 32; // sample system memory (HW.ram)
const gb = (v: number) => `${v.toFixed(2)} GB`;

function RamLimiterPanel({
  value,
  onChange,
  enforced,
  onEnforce,
  mode,
  foreground,
}: {
  value: number;
  onChange: (v: number) => void;
  enforced: number | null;
  onEnforce: () => void;
  mode: string;
  foreground: boolean;
}) {
  const dirty = enforced !== value;
  const atDefault = value === RAM_DEFAULT_GB;
  const share = (value / SYSTEM_RAM_GB) * 100;
  return (
    <Card className="eo-hero eo-ram">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="eo-auto-mark" aria-hidden="true">
            <Target className="h-4 w-4" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[15px] font-black uppercase">RAM Limiter</h2>
              <Badge tone="warning">SAMPLE TARGET</Badge>
            </div>
            <p className="mt-0.5 max-w-xl text-[11.5px] text-muted-foreground">
              Cap the working set of one application. The limiter stays a passive monitor until you
              enforce the target — in this prototype, enforcing is simulated.
            </p>
          </div>
        </div>
        <span aria-live="polite">
          {enforced === null ? (
            <Badge tone="muted">NOT ENFORCED</Badge>
          ) : dirty ? (
            <Badge tone="warning">UNSAVED CHANGE</Badge>
          ) : (
            <Badge tone="success">ENFORCED · SIMULATED</Badge>
          )}
        </span>
      </div>

      <div className="eo-ram-grid mt-4 grid gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Label className="text-[10px]">TARGET APPLICATION</Label>
              <div className="text-[13px] font-bold">chrome.exe</div>
            </div>
            <div className="text-right">
              <Label className="text-[10px]">SYSTEM MEMORY · SAMPLE</Label>
              <div className="text-[13px] font-semibold">
                {SYSTEM_RAM_GB} GB total · 19.8 GB free
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-end gap-3">
            <div className="eo-ram-readout tabular-nums" aria-hidden="true">
              {value.toFixed(2)}
              <span>GB</span>
            </div>
            <div className="pb-1.5 text-[11px] text-muted-foreground">
              max working set · {share.toFixed(1)}% of system memory
              <div className={cn("font-bold", atDefault ? "text-success" : "text-cyan")}>
                {atDefault
                  ? "RECOMMENDED CONFIGURATION"
                  : `${value > RAM_DEFAULT_GB ? "+" : "−"}${Math.abs(value - RAM_DEFAULT_GB).toFixed(2)} GB vs recommended`}
              </div>
            </div>
          </div>

          <RangeSlider
            id="eo-ram-limit"
            className="mt-3"
            label="Maximum RAM limit for chrome.exe"
            value={value}
            onChange={onChange}
            min={RAM_MIN_GB}
            max={RAM_MAX_GB}
            step={RAM_STEP_GB}
            valueText={gb(value)}
            marks={[
              { value: RAM_MIN_GB, label: `MIN ${RAM_MIN_GB} GB` },
              { value: RAM_DEFAULT_GB, label: `RECOMMENDED ${RAM_DEFAULT_GB} GB`, tone: "success" },
              { value: 4, label: "4 GB" },
              { value: RAM_MAX_GB, label: `MAX ${RAM_MAX_GB} GB` },
            ]}
          />

          <div className="mt-4">
            <div className="mb-1 flex justify-between text-[10px] font-bold text-subtle">
              <span>LIMIT IN CONTEXT OF {SYSTEM_RAM_GB} GB SYSTEM MEMORY</span>
              <span>{share.toFixed(1)}%</span>
            </div>
            <div
              className="eo-ram-context"
              style={{ "--share": `${share}%` } as React.CSSProperties}
            >
              <span />
            </div>
          </div>
        </div>

        <div className="eo-ram-side flex flex-col gap-2.5">
          <label htmlFor="eo-ram-number" className="eo-label text-[10px] text-muted-foreground">
            EXACT LIMIT
          </label>
          <NumberField
            id="eo-ram-number"
            label="Maximum RAM limit in gigabytes"
            value={value}
            onChange={onChange}
            min={RAM_MIN_GB}
            max={RAM_MAX_GB}
            step={RAM_STEP_GB}
            unit="GB"
          />
          <p className="text-[10.5px] text-subtle">
            {RAM_MIN_GB}–{RAM_MAX_GB} GB in {RAM_STEP_GB} GB steps · arrow keys adjust
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Btn
              size="sm"
              variant="ghost"
              disabled={atDefault}
              onClick={() => onChange(RAM_DEFAULT_GB)}
              title="Reset to the recommended default (2 GB)"
            >
              <RotateCcw aria-hidden="true" className="h-3 w-3" />
              Reset
            </Btn>
            <Btn
              size="sm"
              variant="ghost"
              disabled={enforced === null || !dirty}
              onClick={() => enforced !== null && onChange(enforced)}
              title="Discard the change and return to the enforced value"
            >
              Revert
            </Btn>
          </div>
          <Btn variant="primary" size="lg" disabled={!dirty} onClick={onEnforce}>
            Enforce target
          </Btn>
          <p className="text-[10.5px] text-muted-foreground" aria-live="polite">
            {enforced === null
              ? "No limit enforced yet."
              : `Enforced at ${gb(enforced)} (simulated).`}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-[11px]">
        <div>
          <Label className="text-[10px]">MODE</Label>
          <div className="font-semibold">{mode} · working-set trim</div>
        </div>
        <div>
          <Label className="text-[10px]">FOREGROUND SHIELD</Label>
          <div
            className={cn(
              "flex items-center gap-1 font-semibold",
              foreground ? "text-success" : "text-warning",
            )}
          >
            <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
            {foreground ? "Protected while in focus" : "Off — limit applies in focus"}
          </div>
        </div>
        <div>
          <Label className="text-[10px]">HOW IT WORKS</Label>
          <div className="text-muted-foreground">
            Pages above the limit are trimmed to standby; the app is never closed.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ───────── BACKUP & RESTORE ───────── */
const TX = [
  ["High Performance Power Plan Activation", "POWER", "Normal", "2026-11-05 10:12", true],
  ["Disable Mouse Acceleration", "INPUT", "Input Optimizer", "2026-11-05 10:13", true],
  ["DNS Resolver Cache Flush", "NETWORK", "Network", "2026-11-05 10:20", false],
  ["Svchost Split Threshold", "REGISTRY", "RAM Registry Values", "2026-11-04 21:44", true],
] as const;
export function BackupRestorePage() {
  const [query, setQuery] = useState("");
  const [f, setF] = useState("ALL");
  const [d, setD] = useState<(typeof TX)[number] | null>(null);
  const [restore, setRestore] = useState(false);
  const vis = TX.filter(
    (t) =>
      t[0].toLowerCase().includes(query.toLowerCase()) &&
      (f === "ALL" ||
        t[1] === f ||
        (f === "✓ RESTORABLE" && t[4]) ||
        (f === "NON-REVERSIBLE" && !t[4])),
  );
  return (
    <div className="space-y-4">
      <PageHeader
        title="Backup & Restore"
        badges={<Badge tone="cyan">UNIVERSAL TRANSACTION ENGINE</Badge>}
        sub="Sample transaction backups, profile containers and restore points."
        actions={
          <>
            <Btn variant="ghost" onClick={() => simulate("Refresh")}>
              Refresh
            </Btn>
            <Btn variant="primary" onClick={() => simulate("Create restore point")}>
              Create restore point
            </Btn>
            <Btn variant="danger" onClick={() => setRestore(true)}>
              Restore entire system
            </Btn>
          </>
        }
      />
      <StatTiles
        items={[
          { label: "TOTAL BACKUPS", value: 14 },
          { label: "PROFILES", value: 3 },
          { label: "OPTIMIZATIONS", value: 9 },
          { label: "REGISTRY VALUES", value: 2 },
          { label: "SYSTEM RESTORE", value: 1, tone: "cyan" },
          { label: "RESTORABLE", value: 13, tone: "success" },
          { label: "NON-REVERSIBLE", value: 1, tone: "warning" },
        ]}
      />
      <Card>
        <Label className="mb-3 text-foreground">PROFILE CONTAINERS</Label>
        <div className="grid grid-cols-3 items-stretch gap-3.5">
          {[
            ["Normal", 6],
            ["Input Optimizer", 2],
            ["Network", 1],
          ].map(([n, c]) => (
            <div
              key={n as string}
              className="flex items-center justify-between gap-3 border-r border-border px-3 py-2 last:border-r-0"
            >
              <div>
                <div className="text-[13px] font-bold">{n}</div>
                <div className="text-[11.5px] text-muted-foreground">
                  {c} transactions · restorable
                </div>
              </div>
              <Btn size="sm" onClick={() => setRestore(true)}>
                Restore profile
              </Btn>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <Cols cols="1fr auto" className="mb-3">
          <SearchBox placeholder="Search transactions…" value={query} onChange={setQuery} />
          <Btn size="sm" variant="ghost" onClick={() => setF("ALL")}>
            Reset filters
          </Btn>
        </Cols>
        <Chips
          options={[
            "ALL",
            "REGISTRY",
            "POWER",
            "INPUT",
            "NETWORK",
            "STORAGE",
            "MEMORY",
            "SERVICES",
            "REPAIR",
            "✓ RESTORABLE",
            "NON-REVERSIBLE",
          ]}
          value={f}
          onChange={setF}
        />
        <Label className="mt-4 mb-2 text-foreground">TRANSACTION HISTORY</Label>
        {vis.length ? (
          <div className="space-y-1.5">
            {vis.map((t) => (
              <button
                key={t[0]}
                onClick={() => setD(t)}
                className="grid w-full items-center gap-3 rounded-lg border border-border bg-window px-3 py-2 text-left text-[12.5px] hover:border-cyan/40"
                style={{ gridTemplateColumns: "minmax(0, 1fr) 80px 110px 120px 120px" }}
              >
                <span className="font-semibold">{t[0]}</span>
                <Badge>{t[1]}</Badge>
                <span className="text-muted-foreground">{t[2]}</span>
                <span className="font-mono text-[11px] text-subtle">{t[3]}</span>
                <Badge tone={t[4] ? "success" : "warning"}>
                  {t[4] ? "✓ RESTORABLE" : "NON-REVERSIBLE"}
                </Badge>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState
            title="NO BACKUP TRANSACTIONS RECORDED YET"
            sub="Universal transaction records and state backups will appear here automatically."
          />
        )}
      </Card>
      <SimNotice />
      <Modal
        open={!!d}
        onClose={() => setD(null)}
        title="Transaction details"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setD(null)}>
              Close
            </Btn>
            {d?.[4] && (
              <Btn
                variant="primary"
                onClick={() => {
                  setD(null);
                  setRestore(true);
                }}
              >
                Restore
              </Btn>
            )}
          </>
        }
      >
        {d && (
          <div className="space-y-4">
            <div>
              <KV k="Optimization:" v={d[0]} />
              <KV k="Profile / Module:" v={d[2]} />
              <KV k="Category & Risk:" v={d[1]} />
              <KV k="Timestamp:" v={d[3]} />
              <KV k="Machine Identity:" v="DEMO-PC" />
            </div>
            <Details title="TARGET KEY / PATH & STATE TRANSITION">
              <KV k="Before State:" v="Captured value" />
              <KV k="After State:" v="Applied value" />
            </Details>
            <div>
              <Label className="mb-1 text-cyan">ROLLBACK DIAGNOSTICS</Label>
              <KV k="Rollback Method:" v="Snapshot restore" />
              <KV k="Status:" v={d[4] ? "Available" : "Not reversible"} />
            </div>
          </div>
        )}
      </Modal>
      <Modal
        open={restore}
        onClose={() => setRestore(false)}
        title="Proceed with restore?"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setRestore(false)}>
              Cancel
            </Btn>
            <Btn
              variant="danger"
              onClick={() => {
                setRestore(false);
                simulate("Restore");
              }}
            >
              Proceed with restore
            </Btn>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Restored values are read back from Windows and verified (simulated in this prototype).
        </p>
      </Modal>
    </div>
  );
}

/* ───────── SETTINGS ───────── */
function Row({
  t,
  s,
  children,
}: {
  t: string | undefined;
  s: string | undefined;
  children: ReactNode;
}) {
  return (
    <div
      className="grid items-center gap-3.5 border-b border-border py-2 last:border-0"
      style={{ gridTemplateColumns: "minmax(150px, 1fr) auto" }}
    >
      <div>
        <div className="text-[13px] font-semibold">{t}</div>
        <div className="text-[11.5px] text-muted-foreground">{s}</div>
      </div>
      <div className="flex min-w-0 flex-wrap items-center justify-end">{children}</div>
    </div>
  );
}
function Tog({ init = true }: { init?: boolean }) {
  const [v, setV] = useState(init);
  return <Toggle on={v} onChange={setV} />;
}
function Seg({ o, d }: { o: string[]; d: string }) {
  const [v, setV] = useState(d);
  return <Chips options={o} value={v} onChange={setV} />;
}
function Rng({ d = 60, label = "Setting level" }: { d?: number; label?: string }) {
  const [v, setV] = useState(d);
  return (
    <div className="flex w-64 items-center gap-2">
      <RangeSlider
        className="flex-1"
        label={label}
        value={v}
        onChange={setV}
        min={0}
        max={100}
        step={1}
      />
      <span className="w-8 text-right font-mono text-[11px] tabular-nums">{v}</span>
    </div>
  );
}
const ACCENTS = ["Cyan", "Electric blue", "Emerald", "Amber", "Red", "Teal"];
export function SettingsPage() {
  const appearance = useAppearance();
  const acc = appearance.accent;
  const setAcc = appearance.setAccent;
  return (
    <div className="space-y-4">
      <PageHeader
        title="Preferences & System Settings"
        sub="Session appearance, simulated startup policies and safety preferences."
        actions={
          <Btn
            variant="ghost"
            onClick={() => {
              setAcc(0);
              appearance.setReduced(false);
              appearance.setAnimations(true);
              appearance.setTransitions(true);
              appearance.setDepth("MEDIUM (3D)");
              simulate("Reset appearance defaults");
            }}
          >
            Reset defaults
          </Btn>
        }
      />
      <Card>
        <SectionTitle
          title="STARTUP & BACKGROUND RUNTIME"
          right={
            <Btn
              size="sm"
              variant="ghost"
              onClick={() => simulate("Refresh sample startup status")}
            >
              Refresh status
            </Btn>
          }
        />
        <Row t="Start with Windows" s="Simulated Windows startup registration">
          <Tog init={false} />
        </Row>
        <Row t="Start Minimized" s="Launch silently to background">
          <Tog init={false} />
        </Row>
        <Details inline title="STARTUP STATUS" hint="Sample registration & bootstrap">
          <div className="grid grid-cols-3 gap-3.5">
            {[
              ["Windows Startup", "Not registered"],
              ["Startup Bootstrap", "Idle"],
              ["Last Startup", "—"],
            ].map(([k, v]) => (
              <KV key={k} k={k} v={v} />
            ))}
          </div>
        </Details>
      </Card>
      <Card>
        <SectionTitle title="AI ENGINE STARTUP POLICIES" />
        {[
          ["AI Power Plan Auto-Enable", "Activate scheme on Windows logon"],
          ["AI Workload Optimization", "Safe passive monitoring on boot"],
          ["AI RAM Limiter", "Memory pressure monitor on boot"],
          ["Smart Auto Optimize", "Authoritative scheduler reconciliation"],
        ].map(([t, s]) => (
          <Row key={t} t={t} s={s}>
            <Tog init={false} />
          </Row>
        ))}
      </Card>
      <Card>
        <SectionTitle
          title="APPEARANCE & THEME ENGINE"
          sub="Accent, display and motion preferences for this session."
        />
        <Row t="Solid Accent Studio" s="Global brand & 100% unified hue">
          <div className="flex gap-1.5">
            {ACCENTS.map((c, i) => (
              <button
                key={c}
                aria-label={`${c} accent`}
                title={`${c} accent`}
                aria-pressed={acc === i}
                onClick={() => setAcc(i)}
                className={cn(
                  "h-6 w-6 rounded-full border-2",
                  acc === i ? "border-foreground" : "border-transparent",
                )}
                data-swatch={i}
              />
            ))}
          </div>
        </Row>
        <Details inline title="ACCENT & GLASS" hint="Fine-tuning and gradient direction">
          <Row t="Hue / Saturation / Brightness" s="Fine-tune the accent">
            <Rng label="Accent hue, saturation and brightness" />
          </Row>
          <Row t="Gradient Theme Studio" s="Multi-color atmospheric spectrum">
            <Seg
              o={["LEFT → RIGHT", "TOP → BOTTOM", "DIAGONAL", "DIAGONAL REV", "RADIAL"]}
              d="DIAGONAL"
            />
          </Row>
          <Row t="Gradient Animation" s="Slow atmospheric motion">
            <Seg o={["OFF", "SUBTLE (SLOW)", "DYNAMIC"]} d="SUBTLE (SLOW)" />
          </Row>
          <Row t="Window Glass Transparency" s="How much of the window behind is visible">
            <Rng d={20} label="Window glass transparency" />
          </Row>
          <Row t="Card / Panel Opacity" s="Opacity of internal cards and panels">
            <Rng d={90} label="Card and panel opacity" />
          </Row>
        </Details>
        <Row t="UI Animations" s="Tactile controls and depth transitions">
          <Toggle
            label="UI Animations"
            on={appearance.animations}
            onChange={appearance.setAnimations}
          />
        </Row>
        <Row t="Page Transitions" s="Directional fade between pages">
          <Toggle
            label="Page Transitions"
            on={appearance.transitions}
            onChange={appearance.setTransitions}
          />
        </Row>
        <Row t="Reduced Motion" s="Also respects your system accessibility preference">
          <Toggle label="Reduced Motion" on={appearance.reduced} onChange={appearance.setReduced} />
        </Row>
        <Details inline title="AMBIENT EFFECTS" hint="Particles and background motion">
          <Row t="Particle Density" s="Background & intelligence orb particles">
            <Seg o={["OFF", "LOW (30)", "MED (80)", "HIGH (150)"]} d="MED (80)" />
          </Row>
          <Row t="Background Motion Mode" s="Ambient gradient drift & light sweep">
            <Seg o={["STATIC", "SUBTLE", "DYNAMIC"]} d="SUBTLE" />
          </Row>
        </Details>
        <Row t="3D Spatial Depth" s="Restrained surface tilt and elevation">
          <Chips
            options={["LOW (2D)", "MEDIUM (3D)", "HIGH (DEEP)"]}
            value={appearance.depth}
            onChange={appearance.setDepth}
          />
        </Row>
        <Details inline title="EFFECT SPECIFICATIONS" hint="Parallax and cursor blueprint">
          <p className="text-xs text-muted-foreground">
            Star density/opacity/parallax/speed/glow/depth/twinkle, cursor effects & trail, hover,
            proximity glow and halo cursor size/intensity sliders live here (see blueprint).
          </p>
        </Details>
      </Card>
      <Card>
        <SectionTitle title="PERFORMANCE & TELEMETRY ENGINE" />
        <Row t="System Performance Mode" s="Adaptive resource consumption budget">
          <Seg o={["AUTO", "LOW RESOURCE (SMOOTH)", "BALANCED", "HIGH TELEMETRY"]} d="AUTO" />
        </Row>
        <Row t="Monitor Update Interval" s="Live hardware metric polling rate">
          <Seg o={["1s (Fast)", "2s", "3s (Default)", "5s", "10s (Eco)"]} d="3s (Default)" />
        </Row>
      </Card>
      <Card>
        <SectionTitle title="SAFETY GUARDRAILS & TRANSACTIONAL RECOVERY" />
        <Row t="Confirm Medium Risk" s="Prompt before moderate system changes">
          <Tog />
        </Row>
        <Row t="Confirm High Risk" s="Enforce dialogs on sensitive parameters">
          <Tog />
        </Row>
        <Row t="Automatic Transactional Backup" s="Pre-execution registry & service snapshots">
          <Tog />
        </Row>
      </Card>
      <Card>
        <SectionTitle title="AUDIT LOGGING & LOG RETENTION" />
        <Row t="Detailed Execution Logs" s="Record verbose API return codes & traces">
          <Tog init={false} />
        </Row>
        <Row t="Log Retention Period" s="Automatic cleanup of older transaction logs">
          <Seg o={["3 Days", "7 Days (Default)", "14 Days", "30 Days"]} d="7 Days (Default)" />
        </Row>
      </Card>
      <Card>
        <SectionTitle title="SYSTEM SPECIFICATIONS & VERSION" />
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Version", "V3 + V4 (prototype)"],
            ["Build Identifier", "browser-blueprint"],
            ["Optimization Architecture", "Unified Safe IPC Service"],
          ].map(([k, v]) => (
            <KV key={k} k={k} v={v} />
          ))}
        </div>
      </Card>
      <SimNotice>
        Appearance changes apply throughout this session. Windows and safety settings remain
        simulated; nothing is saved or changed on your computer.
      </SimNotice>
    </div>
  );
}

/* ───────── ABOUT ───────── */
export function AboutPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("ALL");
  const [d, setD] = useState<(typeof CATALOG)[number] | null>(null);
  const cats = ["ALL", ...Array.from(new Set(CATALOG.map((c) => c.cat)))];
  const vis = CATALOG.filter(
    (c) => (cat === "ALL" || c.cat === cat) && c.name.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div className="space-y-4">
      <PageHeader
        title="About Error Optimizer"
        sub="Explore sample hardware, optimization profiles and recovery details."
      />
      <Card
        className="grid items-center gap-4"
        style={{ gridTemplateColumns: "auto 1fr auto" } as React.CSSProperties}
      >
        <Badge tone="warning">PROTOTYPE · SAMPLE STATE</Badge>
        <span className="text-xs text-muted-foreground">
          Core optimization engine loaded (prototype)
        </span>
        <span className="text-[11px] font-bold">
          INTEGRITY: <span className="text-muted-foreground">NOT ASSESSED (PROTOTYPE)</span>
        </span>
      </Card>
      <Card>
        <SectionTitle
          title="CONNECT WITH ERROR OPTIMIZER"
          sub="Official community, content and social channels."
        />
        <div className="grid grid-cols-2 items-stretch gap-3.5">
          {[
            ["DISCORD", "Community Server", "JOIN DISCORD →"],
            ["YOUTUBE", "@Errorfftamil", "WATCH YOUTUBE →"],
            ["INSTAGRAM", "@errorexeff", "OPEN INSTAGRAM →"],
            ["KICK", "Live Streaming", "WATCH ON KICK →"],
          ].map(([a, b, c]) => (
            <div
              key={a}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-3 py-2"
            >
              <Label className="text-cyan">{a}</Label>
              <div className="mt-1 text-sm font-bold">{b}</div>
              <Btn size="sm" onClick={() => simulate(c)}>
                {c}
              </Btn>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <SectionTitle
          title="HARDWARE & ENGINE STATUS"
          right={
            <Btn size="sm" onClick={() => simulate("Rescan hardware")}>
              Rescan hardware
            </Btn>
          }
        />
        <div className="grid grid-cols-3 gap-3.5">
          {[
            ["LOCAL MACHINE", "DEMO-PC"],
            ["PLATFORM ARCHITECTURE", "x64"],
            ["CURRENT OS", HW.os],
            ["WINDOWS COMPATIBILITY", "Supported"],
            ["CPU / PROCESSOR", HW.cpu],
            ["GRAPHICS ADAPTER (GPU)", HW.gpu],
            ["PHYSICAL MEMORY (RAM)", "32 GB"],
            ["POWER SOURCE", "AC"],
            ["OPTIMIZATION ENGINE", "Loaded"],
            ["BACKEND SERVICE", "Simulated"],
            ["PROFILE ENGINE", "7 profiles"],
            ["TRANSACTIONAL BACKUP", "Armed"],
          ].map(([k, v]) => (
            <div key={k}>
              <Label className="text-[10px]">{k}</Label>
              <div className="text-[12.5px] font-semibold">{v}</div>
            </div>
          ))}
        </div>
      </Card>
      <StatTiles
        items={[
          { label: "TOTAL CATALOG", value: CATALOG.length },
          { label: "APPLICABLE", value: 22, tone: "cyan" },
          { label: "ALREADY OPT.", value: 6, tone: "success" },
          { label: "PENDING", value: 16, tone: "warning" },
          { label: "SAFE", value: CATALOG.filter((c) => c.risk === "LOW").length, tone: "success" },
          {
            label: "MEDIUM RISK",
            value: CATALOG.filter((c) => c.risk === "MEDIUM").length,
            tone: "warning",
          },
          { label: "HIGH RISK", value: 0, tone: "danger" },
        ]}
      />
      <Card>
        <SectionTitle title="SYSTEM OPTIMIZATION PROFILES" sub="7 Specialized Engine Profiles" />
        <div className="flex flex-wrap gap-2">
          {PROFILES.map((p) => (
            <div
              key={p}
              className="rounded-lg border border-border bg-window px-3 py-2 text-center text-[12px] font-bold"
            >
              {p}
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <SectionTitle
          title="OPTIMIZATION CATALOG & KNOWLEDGE BASE"
          sub="Registered catalog metadata (not the complete operation inventory)."
        />
        <Cols cols="2fr auto" className="mb-3 items-center">
          <SearchBox placeholder="Search the catalog…" value={q} onChange={setQ} />
          <span className="text-[10px] font-bold tracking-widest text-subtle">SORT: NAME</span>
        </Cols>
        <Chips options={cats} value={cat} onChange={setCat} />
        <div className="mt-3 grid grid-cols-2 gap-2">
          {vis.map((c) => (
            <button
              key={c.id}
              onClick={() => setD(c)}
              className="flex items-center justify-between rounded-lg border border-border bg-window px-3 py-2 text-left text-[12.5px] hover:border-cyan/40"
            >
              <span>{c.name}</span>
              <span className="flex gap-1.5">
                <Badge>{c.cat}</Badge>
                <RiskBadge risk={c.risk} />
              </span>
            </button>
          ))}
        </div>
      </Card>
      <Modal
        open={!!d}
        onClose={() => setD(null)}
        title={d?.name ?? ""}
        width="max-w-3xl"
        footer={<Btn onClick={() => setD(null)}>Close details</Btn>}
      >
        {d &&
          [
            "SECTION 1: OVERVIEW & PURPOSE",
            "SECTION 2: WHAT DOES IT DO?",
            "SECTION 3: WHY IS IT USED?",
            "SECTION 4: WHAT IT CHANGES",
            "SECTION 5: CURRENT STATE vs TARGET OPTIMIZED STATE",
            "SECTION 6: APPLICABILITY & HARDWARE ENVIRONMENT",
            "SECTION 7: RISK CLASSIFICATION & SAFETY GUARANTEES",
            "SECTION 8: BACKUP & TRANSACTIONAL ROLLBACK",
            "SECTION 9: POST-EXECUTION READBACK & VERIFICATION",
          ].map((s) => (
            <div key={s} className="mb-3 rounded-lg border border-border bg-window p-3">
              <Label className="text-cyan">{s}</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                {s.includes("RISK") ? (
                  <RiskBadge risk={d.risk} />
                ) : (
                  "Populated from OptimizationCatalog metadata in the native app."
                )}
              </p>
            </div>
          ))}
      </Modal>
    </div>
  );
}

/* ───────── PERFORMANCE TUNING ───────── */
export function PerformanceTuningPage() {
  const [guide, setGuide] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <PageHeader
        title="Performance Tuning"
        sub="Simulated CPU and GPU tuning for supported hardware; no changes are applied."
        actions={
          <>
            <Btn variant="ghost" onClick={() => simulate("Revert to stock")}>
              Revert to stock
            </Btn>
            <Btn variant="ghost" onClick={() => setGuide(true)}>
              Guide
            </Btn>
            <Btn onClick={() => simulate("Rescan")}>Rescan</Btn>
          </>
        }
      />
      <Cols cols="1fr 1fr" gap={14} className="items-stretch">
        {[
          ["CPU PERFORMANCE", HW.cpu, "42°C"],
          ["GPU PERFORMANCE", HW.gpu, "44°C"],
        ].map(([t, n, temp]) => (
          <Card key={t}>
            <div className="mb-3 flex items-center justify-between">
              <Label className="text-foreground">{t}</Label>
              <Badge tone="success">SUPPORTED</Badge>
            </div>
            <div className="text-sm font-semibold">{n}</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <KV k="CURRENT STATE" v="Stock" />
              <KV k="TEMPERATURE" v={temp} />
            </div>
            <Btn
              variant="primary"
              className="mt-4 w-full"
              onClick={() => {
                setActive(t ?? "");
                simulate(`Review ${t}`);
              }}
            >
              Start {t?.split(" ")[0]} tuning
            </Btn>
          </Card>
        ))}
      </Cols>
      <StatTiles
        items={[
          { label: "THERMAL PROTECTION", value: "Active", tone: "success" },
          { label: "STABILITY MONITORING", value: "Ready", tone: "success" },
          { label: "POWER SOURCE", value: "AC" },
        ]}
      />
      <Card className="flex items-center justify-between">
        <div>
          <Label>SESSION FLOW:</Label>
          <div className="mt-1 text-[13px] font-semibold">
            1. CHECK · 2. TEST · 3. TUNE · 4. VERIFY · 5. DECIDE
          </div>
        </div>
        <Btn
          variant="danger"
          size="sm"
          disabled={!active}
          onClick={() => {
            setActive(null);
            simulate("Stop tuning preview");
          }}
        >
          Stop
        </Btn>
      </Card>
      <Bar value={active ? 20 : 0} />
      {active && (
        <p className="text-xs text-cyan">
          {active} · Simulated compatibility review. No tuning or benchmark has been performed.
        </p>
      )}
      <Details title="ADVANCED DETAILS — HARDWARE ENVELOPE & VERIFICATION DETAILS">
        <p className="text-xs text-muted-foreground">
          Evaluation Policy: evaluates maximum verified stable performance — never unverified
          overclocking.
        </p>
      </Details>
      <SimNotice />
      <Modal
        open={guide}
        onClose={() => setGuide(false)}
        title="How Performance Tuning works"
        sub="ERROR OPTIMIZER only uses safe hardware controls supported by your CPU and GPU."
        footer={
          <Btn variant="primary" onClick={() => setGuide(false)}>
            Got it
          </Btn>
        }
      >
        {[
          ["1. CHECK", "Checks whether your CPU or GPU supports safe tuning controls."],
          ["2. TEST", "Measures your current baseline performance and temperature."],
          ["3. TUNE", "Applies one controlled change."],
          ["4. VERIFY", "Checks stability, temperature and real performance."],
          [
            "5. DECIDE",
            "Keeps the change only if it improves verified stable performance. Otherwise it is reverted.",
          ],
        ].map(([a, b]) => (
          <div key={a} className="mb-2 rounded-lg border border-border bg-window p-3">
            <div className="eo-label text-foreground">{a}</div>
            <p className="text-xs text-muted-foreground">{b}</p>
          </div>
        ))}
      </Modal>
    </div>
  );
}
