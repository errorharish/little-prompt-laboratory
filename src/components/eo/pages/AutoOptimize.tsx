// AutoOptimizeView — recurring maintenance engine: task selection, schedule, lifecycle,
// safety preferences, simulated lifecycle events and history. Prototype only.
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ChevronDown,
  Pause,
  Play,
  Power,
  PowerOff,
  RotateCcw,
  Save,
  ShieldCheck,
  Square,
  Trash2,
  Zap,
} from "lucide-react";
import {
  Badge,
  Btn,
  Card,
  Check,
  EmptyState,
  Label,
  PageHeader,
  SectionTitle,
  SimNotice,
  Toggle,
} from "../kit";
import { Segmented } from "../controls";
import { autoOptimize, useAutoOptimize, useNow, type HistoryEntry } from "../autoOptimizeStore";
import { StatusPill, clockTime, engineStatus, relTime } from "../AutoOptimizePanel";
import {
  MAINT_CATEGORIES,
  MAINT_TASKS,
  PRESET_INTERVALS,
  STARTUP_DELAY_MIN,
  formatCountdown,
  formatInterval,
  validateCustomInterval,
  type AutoConfig,
  type IntervalUnit,
  type MaintRisk,
} from "@/lib/eo/autoOptimize";
import { cn } from "@/lib/utils";

const RISK_TONE: Record<MaintRisk, "success" | "warning"> = {
  SAFE: "success",
  LOW: "success",
  CONFIRM: "warning",
};
const RISK_LABEL: Record<MaintRisk, string> = {
  SAFE: "SAFE",
  LOW: "LOW RISK",
  CONFIRM: "PERMANENT",
};
const PRESET_LABELS = PRESET_INTERVALS.map((m) => (m === 60 ? "60 min" : `${m} min`));
const BROWSERS = ["Chrome", "Edge", "Firefox"];

/** Fields saved through Save & apply (enable / pause are immediate controls). */
const comparable = ({ enabled: _e, paused: _p, ...rest }: AutoConfig) => JSON.stringify(rest);

export function AutoOptimizePage() {
  const s = useAutoOptimize();
  const now = useNow();
  const [draft, setDraft] = useState<AutoConfig>(s.config);
  const dirty = comparable(draft) !== comparable(s.config);
  // Adopt the stored configuration when it loads or changes elsewhere, unless you are editing.
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  useEffect(() => {
    if (!dirtyRef.current) setDraft(s.config);
  }, [s.config]);

  const presetIdx = PRESET_INTERVALS.indexOf(
    draft.intervalMin as (typeof PRESET_INTERVALS)[number],
  );
  const [custom, setCustom] = useState(presetIdx === -1);
  const [customText, setCustomText] = useState(String(draft.intervalMin));
  const [unit, setUnit] = useState<IntervalUnit>("minutes");
  useEffect(() => {
    if (
      PRESET_INTERVALS.indexOf(s.config.intervalMin as (typeof PRESET_INTERVALS)[number]) === -1
    ) {
      setCustom(true);
      const m = s.config.intervalMin;
      if (m % 60 === 0) {
        setUnit("hours");
        setCustomText(String(m / 60));
      } else setCustomText(String(m));
    }
  }, [s.loaded, s.config.intervalMin]);
  const check = custom ? validateCustomInterval(customText, unit) : null;
  const intervalError = check && !check.ok ? check.error : null;

  const patch = (p: Partial<AutoConfig>) => setDraft((d) => ({ ...d, ...p }));
  const toggleTask = (id: string) =>
    patch({
      tasks: draft.tasks.includes(id) ? draft.tasks.filter((t) => t !== id) : [...draft.tasks, id],
    });
  const status = engineStatus(s);
  const save = () => {
    if (intervalError) return;
    autoOptimize.saveConfig({ ...draft, enabled: s.config.enabled, paused: s.config.paused });
  };
  const nextPreview = s.config.enabled && !s.config.paused ? s.nextAt : null;

  return (
    <div className="space-y-3.5 pb-16">
      <PageHeader
        title="Auto Optimize"
        badges={
          <>
            <Badge tone="cyan">MAINTENANCE ENGINE</Badge>
            <Badge tone="warning">SIMULATED</Badge>
          </>
        }
        sub="Choose which maintenance tasks run automatically, and how often. Runs are simulated in this prototype."
        actions={
          <>
            <Btn
              variant="ghost"
              disabled={!!s.run || !s.config.tasks.length}
              onClick={autoOptimize.runNow}
            >
              <Zap aria-hidden="true" className="h-3.5 w-3.5" /> Run now
            </Btn>
            {s.config.enabled &&
              (s.config.paused ? (
                <Btn onClick={autoOptimize.resume}>
                  <Play aria-hidden="true" className="h-3.5 w-3.5" /> Resume
                </Btn>
              ) : (
                <Btn onClick={autoOptimize.pause}>
                  <Pause aria-hidden="true" className="h-3.5 w-3.5" /> Pause
                </Btn>
              ))}
          </>
        }
      />

      {/* Master control + live status */}
      <Card className="eo-hero">
        <div
          className="eo-auto-master grid items-center gap-4"
          style={{ gridTemplateColumns: "auto minmax(0,1fr) auto" }}
        >
          <Toggle
            on={s.config.enabled}
            label="Auto Optimize"
            onChange={(on) => {
              if (on) {
                if (!draft.tasks.length || intervalError) return;
                autoOptimize.saveConfig({ ...draft, enabled: true, paused: false });
              } else autoOptimize.disable();
            }}
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[14px] font-black uppercase">Auto Optimize</span>
              <StatusPill status={status} />
              {s.power !== "on" && (
                <Badge tone="warning">
                  {s.power === "background"
                    ? "BACKGROUND AGENT · SIMULATED"
                    : s.power === "app-closed"
                      ? "APP CLOSED · SIMULATED"
                      : "PC OFF · SIMULATED"}
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-[11.5px] text-muted-foreground">
              {!draft.tasks.length
                ? "Select at least one task below to enable automatic maintenance."
                : s.config.enabled
                  ? `${formatInterval(s.config.intervalMin)} · ${s.config.tasks.length} tasks · ${s.config.profile} profile`
                  : "Off — nothing runs automatically. Turning it on saves the settings below."}
            </p>
          </div>
          <dl className="eo-auto-strip">
            <div>
              <dt>Next run</dt>
              <dd className="font-mono tabular-nums">
                {s.run
                  ? "Running…"
                  : status === "Paused" && s.pausedRemaining !== null
                    ? `Paused · ${formatCountdown(s.pausedRemaining)}`
                    : status === "Enabled" && s.nextAt && now
                      ? formatCountdown(s.nextAt - now)
                      : "—"}
              </dd>
            </div>
            <div>
              <dt>At</dt>
              <dd>{status === "Enabled" ? clockTime(s.nextAt) : "—"}</dd>
            </div>
            <div>
              <dt>Last run</dt>
              <dd>{relTime(s.lastRunAt, now)}</dd>
            </div>
          </dl>
        </div>
        {s.run && (
          <div className="mt-3 border-t border-border pt-3" aria-live="polite">
            <div className="mb-1.5 flex items-center justify-between text-[10.5px] font-bold text-cyan">
              <span>{s.run.trigger.toUpperCase()} RUN IN PROGRESS · SIMULATED</span>
              <Btn size="sm" variant="ghost" onClick={autoOptimize.cancel}>
                <Square aria-hidden="true" className="h-3 w-3" /> Cancel run
              </Btn>
            </div>
            <ul className="grid grid-cols-2 gap-1">
              {s.run.items.map((i) => (
                <li key={i.taskId} className="eo-run-row" data-state={i.state}>
                  <span aria-hidden="true" className="eo-run-dot" />
                  <span className="min-w-0 flex-1 truncate">{i.name}</span>
                  <span className="eo-run-state">
                    {i.state === "Running" ? "Working…" : i.state}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <div
        className="eo-auto-layout grid items-start gap-3.5"
        style={{ gridTemplateColumns: "minmax(0,1.45fr) minmax(0,1fr)" }}
      >
        {/* Maintenance tasks */}
        <Card>
          <SectionTitle
            title="MAINTENANCE TASKS"
            badge={
              <Badge tone="cyan">
                {draft.tasks.length} OF {MAINT_TASKS.length}
              </Badge>
            }
            sub="Only checked tasks ever run. Browser cleanup removes cache only."
            right={
              <>
                <Btn
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    patch({ tasks: MAINT_TASKS.filter((t) => t.recommended).map((t) => t.id) })
                  }
                >
                  Recommended
                </Btn>
                <Btn
                  size="sm"
                  variant="ghost"
                  disabled={!draft.tasks.length}
                  onClick={() => patch({ tasks: [] })}
                >
                  Clear
                </Btn>
              </>
            }
          />
          <div className="space-y-3">
            {MAINT_CATEGORIES.map((cat) => {
              const items = MAINT_TASKS.filter((t) => t.category === cat.key);
              const on = items.filter((t) => draft.tasks.includes(t.id)).length;
              return (
                <section
                  key={cat.key}
                  aria-labelledby={`eo-cat-${cat.key}`}
                  className="eo-task-group"
                >
                  <div className="eo-task-group-head">
                    <Check
                      label={`Select all ${cat.title}`}
                      on={on === items.length}
                      onChange={(v) =>
                        patch({
                          tasks: v
                            ? [...new Set([...draft.tasks, ...items.map((t) => t.id)])]
                            : draft.tasks.filter((id) => !items.some((t) => t.id === id)),
                        })
                      }
                    />
                    <div className="min-w-0 flex-1">
                      <h3 id={`eo-cat-${cat.key}`} className="text-[12px] font-bold">
                        {cat.title}
                      </h3>
                      <p className="truncate text-[10.5px] text-muted-foreground">{cat.sub}</p>
                    </div>
                    <span className="text-[10px] font-bold text-subtle tabular-nums">
                      {on}/{items.length}
                    </span>
                  </div>
                  <ul>
                    {items.map((t) => (
                      <TaskRow
                        key={t.id}
                        id={t.id}
                        on={draft.tasks.includes(t.id)}
                        onToggle={() => toggleTask(t.id)}
                        browserOpen={!!t.browser && s.openBrowsers.includes(t.browser)}
                        recycleAsk={t.id === "recycle-bin" && draft.recycleConfirm}
                        lowSkipped={t.risk === "LOW" && draft.safeOnly}
                      />
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </Card>

        <div className="space-y-3.5">
          {/* Schedule */}
          <Card>
            <SectionTitle
              title="SCHEDULE"
              sub="How often selected tasks run while Auto Optimize is on."
            />
            <Segmented
              label="Schedule interval"
              fill
              options={[...PRESET_LABELS, "Custom"]}
              value={custom ? "Custom" : (PRESET_LABELS[presetIdx] ?? "Custom")}
              onChange={(v) => {
                if (v === "Custom") {
                  setCustom(true);
                  const r = validateCustomInterval(customText, unit);
                  if (r.ok) patch({ intervalMin: r.minutes });
                  return;
                }
                setCustom(false);
                const m = PRESET_INTERVALS[PRESET_LABELS.indexOf(v)];
                if (m) patch({ intervalMin: m });
              }}
            />
            {custom && (
              <div className="eo-swap mt-3">
                <label
                  htmlFor="eo-custom-interval"
                  className="eo-label mb-1 block text-[9.5px] text-muted-foreground"
                >
                  CUSTOM INTERVAL · 1 MINUTE TO 24 HOURS
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="eo-custom-interval"
                    inputMode="numeric"
                    value={customText}
                    aria-invalid={!!intervalError}
                    aria-describedby="eo-custom-interval-hint"
                    onChange={(e) => {
                      setCustomText(e.target.value);
                      const r = validateCustomInterval(e.target.value, unit);
                      if (r.ok) patch({ intervalMin: r.minutes });
                    }}
                    className={cn(
                      "eo-input h-8 w-24 font-mono",
                      intervalError && "eo-input-invalid",
                    )}
                  />
                  <Segmented
                    label="Interval unit"
                    options={["minutes", "hours"]}
                    value={unit}
                    onChange={(v) => {
                      const u = v as IntervalUnit;
                      setUnit(u);
                      const r = validateCustomInterval(customText, u);
                      if (r.ok) patch({ intervalMin: r.minutes });
                    }}
                  />
                </div>
                <p
                  id="eo-custom-interval-hint"
                  role={intervalError ? "alert" : undefined}
                  className={cn(
                    "mt-1 text-[11px]",
                    intervalError ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  {intervalError ??
                    `${formatInterval(draft.intervalMin)} · examples: 2 min, 45 min, 12 hours`}
                </p>
              </div>
            )}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="eo-mini-fact">
                <span>Interval</span>
                <b>{formatInterval(draft.intervalMin).replace("Every ", "")}</b>
              </div>
              <div className="eo-mini-fact">
                <span>Next run</span>
                <b>
                  {dirty && s.config.enabled
                    ? `≈ ${clockTime((now || 0) + draft.intervalMin * 60_000)} after save`
                    : nextPreview
                      ? clockTime(nextPreview)
                      : "Not scheduled"}
                </b>
              </div>
            </div>
            <div className="mt-3">
              <Label className="mb-1.5 text-[9.5px]">IF A RUN IS STILL IN PROGRESS</Label>
              <Segmented
                label="Overlap policy"
                fill
                options={["Skip next run", "Queue one run"]}
                value={draft.overlap === "skip" ? "Skip next run" : "Queue one run"}
                onChange={(v) => patch({ overlap: v === "Skip next run" ? "skip" : "queue" })}
              />
              <p className="mt-1 text-[10.5px] text-subtle">
                Runs never overlap. At most one run waits in the queue.
              </p>
            </div>
            <div className="mt-3">
              <Label className="mb-1.5 text-[9.5px]">AUTOMATION PROFILE</Label>
              <Segmented
                label="Automation profile"
                fill
                options={["Light", "Balanced", "Thorough"]}
                value={draft.profile}
                onChange={(v) => patch({ profile: v as AutoConfig["profile"] })}
              />
            </div>
          </Card>

          {/* Lifecycle */}
          <Card>
            <SectionTitle
              title="APPLICATION & WINDOWS"
              sub="When Auto Optimize starts and stops."
            />
            <SettingRow
              title="Run on application launch"
              sub="Run eligible tasks once when the app opens."
              control={
                <Toggle
                  on={draft.runOnLaunch}
                  label="Run on application launch"
                  onChange={(v) => patch({ runOnLaunch: v })}
                />
              }
            />
            <div className="eo-setting-row block">
              <div className="text-[12.5px] font-semibold">When the application closes</div>
              <div
                role="radiogroup"
                aria-label="When the application closes"
                className="mt-2 space-y-1.5"
              >
                {(
                  [
                    ["stop", "Stop scheduling", "Nothing runs until you open the app again."],
                    ["exit-run", "Run once, then stop", "Eligible tasks run a final time on exit."],
                    [
                      "background",
                      "Keep running in background",
                      "Native app: background agent continues the schedule.",
                    ],
                  ] as const
                ).map(([v, t, d]) => (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={draft.closeBehavior === v}
                    onClick={() => patch({ closeBehavior: v })}
                    className="eo-radio-card"
                  >
                    <span aria-hidden="true" className="eo-radio" />
                    <span className="min-w-0">
                      <span className="block text-[12px] font-bold">{t}</span>
                      <span className="block text-[10.5px] text-muted-foreground">{d}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <SettingRow
              title="Start with Windows"
              sub="Native app: the scheduler starts after you sign in to Windows."
              control={
                <Toggle
                  on={draft.runOnWindowsStartup}
                  label="Start with Windows"
                  onChange={(v) => patch({ runOnWindowsStartup: v })}
                />
              }
            />
            {draft.runOnWindowsStartup && (
              <div className="eo-swap pb-1">
                <Label className="mb-1.5 text-[9.5px]">STARTUP MAINTENANCE POLICY</Label>
                <Segmented
                  label="Startup maintenance policy"
                  fill
                  options={[`Run after ${STARTUP_DELAY_MIN} min`, "Wait for next interval"]}
                  value={
                    draft.startupPolicy === "after-delay"
                      ? `Run after ${STARTUP_DELAY_MIN} min`
                      : "Wait for next interval"
                  }
                  onChange={(v) =>
                    patch({ startupPolicy: v.startsWith("Run") ? "after-delay" : "next-interval" })
                  }
                />
              </div>
            )}
            <p className="mt-2 text-[10.5px] text-subtle">
              Shutdown and restart are never delayed. Nothing runs while the PC is off; the schedule
              resumes after the next start.
            </p>
          </Card>

          {/* Safety */}
          <Card>
            <SectionTitle
              title="SAFETY PREFERENCES"
              badge={<ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-success" />}
            />
            <SettingRow
              title="Unattended runs: safe tasks only"
              sub="LOW-risk tasks run only when you press Run now."
              control={
                <Toggle
                  on={draft.safeOnly}
                  label="Unattended runs: safe tasks only"
                  onChange={(v) => patch({ safeOnly: v })}
                />
              }
            />
            <SettingRow
              title="Keep recent temporary files"
              sub="Skip temp files changed in the last 24 hours."
              control={
                <Toggle
                  on={draft.skipRecentTemp}
                  label="Keep recent temporary files"
                  onChange={(v) => patch({ skipRecentTemp: v })}
                />
              }
            />
            <SettingRow
              title="Ask before emptying the Recycle Bin"
              sub="Scheduled runs then skip the Recycle Bin — there is nobody to ask."
              control={
                <Toggle
                  on={draft.recycleConfirm}
                  label="Ask before emptying the Recycle Bin"
                  onChange={(v) => patch({ recycleConfirm: v })}
                />
              }
            />
            <div className="eo-setting-row">
              <div>
                <div className="text-[12.5px] font-semibold">Running browsers</div>
                <div className="text-[10.5px] text-muted-foreground">
                  Always skipped, never closed. Locked files are always skipped.
                </div>
              </div>
              <Badge tone="success">ALWAYS ON</Badge>
            </div>
            <div className="pt-2">
              <Label className="mb-1.5 text-[9.5px]">SIMULATE OPEN BROWSERS</Label>
              <div role="group" aria-label="Simulate open browsers" className="flex gap-1.5">
                {BROWSERS.map((b) => {
                  const open = s.openBrowsers.includes(b);
                  return (
                    <Btn
                      key={b}
                      size="sm"
                      variant={open ? "secondary" : "ghost"}
                      pressed={open}
                      onClick={() =>
                        autoOptimize.setOpenBrowsers(
                          open ? s.openBrowsers.filter((x) => x !== b) : [...s.openBrowsers, b],
                        )
                      }
                    >
                      {b} {open ? "open" : "closed"}
                    </Btn>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <LifecycleSimulator power={s.power} />
      <History entries={s.history} now={now} />
      <SimNotice>
        PROTOTYPE: the schedule runs only while this tab is open. No files, browser data, Recycle
        Bin, memory, service or Windows setting is read or changed. Lifecycle events are simulated.
      </SimNotice>

      {/* Save bar — only rendered while there is something to save */}
      {dirty && (
        <div className="eo-save-bar eo-swap" role="region" aria-label="Unsaved changes">
          <span className="text-[12px] font-semibold">
            {intervalError ? <span className="text-destructive">{intervalError}</span> : "You have unsaved changes"}
          </span>
          <div className="flex gap-2">
            <Btn variant="ghost" onClick={() => setDraft(s.config)}>
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" /> Discard
            </Btn>
            <Btn variant="primary" disabled={!!intervalError} onClick={save}>
              <Save aria-hidden="true" className="h-3.5 w-3.5" /> Save & apply
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingRow({ title, sub, control }: { title: string; sub: string; control: ReactNode }) {
  return (
    <div className="eo-setting-row">
      <div className="min-w-0">
        <div className="text-[12.5px] font-semibold">{title}</div>
        <div className="text-[10.5px] text-muted-foreground">{sub}</div>
      </div>
      {control}
    </div>
  );
}

function TaskRow({
  id,
  on,
  onToggle,
  browserOpen,
  recycleAsk,
  lowSkipped,
}: {
  id: string;
  on: boolean;
  onToggle: () => void;
  browserOpen: boolean;
  recycleAsk: boolean;
  lowSkipped: boolean;
}) {
  const t = MAINT_TASKS.find((x) => x.id === id);
  const [open, setOpen] = useState(false);
  if (!t) return null;
  const note = browserOpen
    ? `${t.browser} is open — will be skipped`
    : recycleAsk
      ? "Skipped on scheduled runs while confirmation is on"
      : lowSkipped
        ? "Runs only on Run now (safe-only mode)"
        : null;
  return (
    <li className="eo-task-row" data-selected={on || undefined}>
      <div className="flex items-center gap-2.5">
        <Check label={t.name} on={on} onChange={onToggle} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-[12px] font-semibold">{t.name}</span>
            {t.category === "BROWSER" && (
              <span className="text-[9.5px] font-bold text-success">CACHE ONLY</span>
            )}
          </div>
          <p className="truncate text-[10.5px] text-muted-foreground">{t.desc}</p>
        </div>
        {on && note && (
          <span className="hidden text-[10px] font-semibold text-warning xl:inline">{note}</span>
        )}
        <Badge tone={RISK_TONE[t.risk]}>{RISK_LABEL[t.risk]}</Badge>
        <Btn
          size="sm"
          variant="ghost"
          className="w-7 px-0"
          label={`${open ? "Hide" : "Show"} details for ${t.name}`}
          expanded={open}
          controls={`eo-task-${t.id}`}
          onClick={() => setOpen((o) => !o)}
        >
          <ChevronDown
            aria-hidden="true"
            className={cn("eo-chevron h-3.5 w-3.5", open && "rotate-180")}
          />
        </Btn>
      </div>
      {open && (
        <div id={`eo-task-${t.id}`} className="eo-swap eo-task-details">
          <p>{t.details}</p>
          {on && note && <p className="text-warning">{note}</p>}
          <p className="text-subtle">Source in this project: {t.source}</p>
        </div>
      )}
    </li>
  );
}

function LifecycleSimulator({ power }: { power: string }) {
  const items = [
    {
      icon: Power,
      t: "Application launch",
      d: "Restores the schedule; runs launch maintenance if enabled.",
      a: autoOptimize.simulateLaunch,
    },
    {
      icon: PowerOff,
      t: "Application close",
      d: "Applies the close behaviour you chose.",
      a: autoOptimize.simulateClose,
    },
    {
      icon: Play,
      t: "Windows startup",
      d: "Starts the background agent if Start with Windows is on.",
      a: autoOptimize.simulateWindowsStartup,
    },
    {
      icon: Square,
      t: "Shutdown / restart",
      d: "Stops any run without delaying shutdown; nothing runs while off.",
      a: autoOptimize.simulateShutdown,
    },
  ];
  return (
    <Card>
      <SectionTitle
        title="LIFECYCLE PREVIEW"
        badge={<Badge tone="warning">SIMULATED EVENTS</Badge>}
        sub="Preview how the native app will behave. These buttons do not close this tab or touch Windows."
        right={
          <span className="text-[10.5px] font-bold text-subtle">
            STATE:{" "}
            <span className="text-foreground">
              {power === "on"
                ? "APP OPEN"
                : power === "background"
                  ? "BACKGROUND AGENT"
                  : power === "app-closed"
                    ? "APP CLOSED"
                    : "PC OFF"}
            </span>
          </span>
        }
      />
      <div className="grid grid-cols-4 gap-2.5 eo-lifecycle">
        {items.map((i) => (
          <button key={i.t} type="button" onClick={i.a} className="eo-lifecycle-btn">
            <i.icon aria-hidden="true" className="h-4 w-4 text-cyan" />
            <span className="text-[12px] font-bold">Simulate {i.t.toLowerCase()}</span>
            <span className="text-[10.5px] text-muted-foreground">{i.d}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

function History({ entries, now }: { entries: HistoryEntry[]; now: number }) {
  const [open, setOpen] = useState<number | null>(null);
  const [filter, setFilter] = useState("All");
  const shown = useMemo(
    () =>
      entries.filter((e) =>
        filter === "All" ? true : filter === "Runs" ? e.kind === "run" : e.kind === "event",
      ),
    [entries, filter],
  );
  return (
    <section id="history" aria-labelledby="eo-history-title" className="scroll-mt-4">
      <Card>
        <SectionTitle
          id="eo-history-title"
          title="MAINTENANCE HISTORY"
          badge={<Badge>{entries.filter((e) => e.kind === "run").length} RUNS</Badge>}
          sub="Each run lists every selected task and what happened to it. Amounts are sample data."
          right={
            <>
              <Segmented
                label="History filter"
                options={["All", "Runs", "Events"]}
                value={filter}
                onChange={setFilter}
              />
              <Btn
                size="sm"
                variant="ghost"
                disabled={!entries.length}
                onClick={autoOptimize.clearHistory}
              >
                <Trash2 aria-hidden="true" className="h-3.5 w-3.5" /> Clear
              </Btn>
            </>
          }
        />
        {!shown.length ? (
          <EmptyState title="No history yet" sub="Runs and lifecycle events appear here." />
        ) : (
          <div className="eo-data-table rounded-lg border border-border">
            <div className="eo-history-row eo-history-head">
              <span>TIME</span>
              <span>TRIGGER / EVENT</span>
              <span>RESULT</span>
              <span>STATUS</span>
              <span />
            </div>
            <ul>
              {shown.slice(0, 20).map((e) =>
                e.kind === "event" ? (
                  <li key={e.id} className="eo-history-row">
                    <span className="font-mono text-[11px] text-subtle">{clockTime(e.at)}</span>
                    <span className="truncate font-semibold">{e.title}</span>
                    <span className="truncate text-muted-foreground">{e.detail}</span>
                    <Badge tone={e.tone}>EVENT</Badge>
                    <span />
                  </li>
                ) : (
                  <li key={e.id}>
                    <div className="eo-history-row">
                      <span
                        className="font-mono text-[11px] text-subtle"
                        title={relTime(e.at, now)}
                      >
                        {clockTime(e.at)}
                      </span>
                      <span className="truncate font-semibold">{e.trigger} run</span>
                      <span className="truncate text-muted-foreground">
                        {e.summary.completed} completed · {e.summary.skipped} skipped
                        {e.summary.cancelled ? ` · ${e.summary.cancelled} cancelled` : ""} ·{" "}
                        {(e.durationMs / 1000).toFixed(1)} s · 0 changes on this PC
                      </span>
                      <Badge
                        tone={
                          e.summary.status === "Completed"
                            ? "success"
                            : e.summary.status === "Cancelled"
                              ? "danger"
                              : "warning"
                        }
                      >
                        {e.summary.status}
                      </Badge>
                      <Btn
                        size="sm"
                        variant="ghost"
                        className="w-7 px-0"
                        label={`${open === e.id ? "Hide" : "Show"} tasks for run at ${clockTime(e.at)}`}
                        expanded={open === e.id}
                        onClick={() => setOpen(open === e.id ? null : e.id)}
                      >
                        <ChevronDown
                          aria-hidden="true"
                          className={cn("eo-chevron h-3.5 w-3.5", open === e.id && "rotate-180")}
                        />
                      </Btn>
                    </div>
                    {open === e.id && (
                      <ul className="eo-swap eo-history-items">
                        {e.items.map((i) => (
                          <li key={i.taskId} className="eo-run-row" data-state={i.state}>
                            <span aria-hidden="true" className="eo-run-dot" />
                            <span className="w-56 shrink-0 truncate font-semibold">{i.name}</span>
                            <span className="min-w-0 flex-1 truncate text-muted-foreground">
                              {i.note ?? ""}
                            </span>
                            <span className="eo-run-state">{i.state}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ),
              )}
            </ul>
          </div>
        )}
      </Card>
    </section>
  );
}
