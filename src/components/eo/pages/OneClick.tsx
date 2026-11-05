// OneClickOptimizationView.xaml — dedicated full-page workflow (not a modal).
// Flow: Analyze → Review → Confirm → Simulated result. All results are simulated.
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ShieldCheck,
  ChevronDown,
  ScanSearch,
  RotateCcw,
  X,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import {
  Badge,
  Btn,
  Card,
  Check,
  KV,
  Label,
  Modal,
  RiskBadge,
  SimNotice,
  SearchBox,
  EmptyState,
  LoadingState,
  Stepper,
  useSimRun,
} from "../kit";
import { RunModal } from "../RunModal";
import { ONE_CLICK_ACTIONS, ONE_CLICK_GROUPS } from "@/lib/eo/data";
import { filterRecommendations } from "@/lib/eo/recommendations";
import {
  recommendedSelection,
  summarizeSelection,
  toggleInSet,
  type SimulatedRunSummary,
} from "@/lib/eo/selection";
import { cn } from "@/lib/utils";

const FILTERS = {
  STATUS: [
    "All Optimizations",
    "Recommended Only",
    "Optional",
    "Already Optimized",
    "Protected Items",
  ],
  CATEGORY: ["System Performance", "Background Workload", "Memory", "Power / Performance"],
  "ACTION REQUIREMENTS": ["Can Optimize Now", "Background-Safe", "Requires Restart"],
};
const GUIDE = [
  ["CHECK", "ERROR OPTIMIZER scans your PC and finds relevant optimization opportunities."],
  [
    "REVIEW",
    "You can see what can be improved, why it was selected, and which apps are protected.",
  ],
  ["CHOOSE", "Keep the recommended changes or customize the selection for your specific needs."],
  [
    "OPTIMIZE",
    "ERROR OPTIMIZER applies only the selected safe changes. System files, drivers and active apps are protected.",
  ],
  [
    "VERIFY",
    "Every applied change is checked. If a change cannot be safely verified it is rolled back.",
  ],
];
const PROTECTED = [
  "Windows core binaries",
  "Display & audio drivers",
  "Active foreground application",
  "Anti-cheat & game launchers",
  "Security software",
  "User files & logins",
];
const STEPS = ["Analyze", "Review", "Confirm", "Simulated result"];

type LastRun = SimulatedRunSummary & { at: string; titles: string[] };

export function OneClickPage() {
  const scan = useSimRun(1400);
  const [query, setQuery] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [area, setArea] = useState<string | null>(null);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState("All Optimizations");
  const [guide, setGuide] = useState(false);
  const [review, setReview] = useState(false);
  const [detail, setDetail] = useState<string | null>(null);
  const [run, setRun] = useState(false);
  const [protOpen, setProtOpen] = useState(false);
  const [lastRun, setLastRun] = useState<LastRun | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => filterRecommendations(area, filter, query), [area, filter, query]);
  const summary = useMemo(() => summarizeSelection(ONE_CLICK_ACTIONS, sel), [sel]);
  const selectedItems = useMemo(() => ONE_CLICK_ACTIONS.filter((a) => sel.has(a.id)), [sel]);
  const toggle = (id: string) => setSel((s) => toggleInSet(s, id));
  const d = ONE_CLICK_ACTIONS.find((a) => a.id === detail);
  const step = lastRun ? 4 : run ? 2 : review ? 2 : analyzed ? 1 : 0;

  // Close the filter popover on outside click or Escape.
  useEffect(() => {
    if (!filterOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!filterRef.current?.contains(e.target as Node)) setFilterOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFilterOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [filterOpen]);

  const analyze = () => {
    setArea(null);
    scan.start(() => {
      setAnalyzed(true);
      setSel(recommendedSelection(ONE_CLICK_ACTIONS));
    });
  };
  const resetFilters = () => {
    setFilter("All Optimizations");
    setQuery("");
    setArea(null);
  };
  const onComplete = (s: SimulatedRunSummary) =>
    setLastRun({
      ...s,
      at: new Date().toLocaleTimeString(),
      titles: selectedItems.map((a) => a.title),
    });

  return (
    <div className="space-y-4 pb-20">
      {/* Header: cols=*,16,Auto */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to="/"
            className="mb-3 inline-flex items-center gap-1.5 text-[10.5px] font-bold tracking-widest text-muted-foreground hover:text-cyan"
            title="Return to main Dashboard"
          >
            <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" /> BACK TO DASHBOARD
          </Link>
          <Label className="text-cyan">DEDICATED 1-CLICK WORKFLOW</Label>
          <h1 className="mt-1 text-[26px] font-black tracking-[0.04em]">1-CLICK OPTIMIZATION</h1>
          <p className="mt-1 max-w-2xl text-[13px] text-muted-foreground">
            Analyze sample recommendations, review your choices, and confirm a simulated
            optimization. No Windows settings are changed.
          </p>
        </div>
        <div className="flex gap-2">
          <Btn
            variant="ghost"
            onClick={() => setGuide(true)}
            title="How 1-Click Optimization works"
          >
            Guide
          </Btn>
          <Btn disabled={scan.running} onClick={analyze} title="Analyze sample recommendations">
            {scan.running ? (
              <>Analyzing…</>
            ) : analyzed ? (
              <>
                <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
                Rescan
              </>
            ) : (
              <>
                <ScanSearch aria-hidden="true" className="h-3.5 w-3.5" />
                Analyze
              </>
            )}
          </Btn>
          <Btn
            variant="primary"
            size="lg"
            disabled={scan.running || !analyzed || !sel.size}
            onClick={() => setReview(true)}
          >
            Review selection
          </Btn>
        </div>
      </div>

      <Stepper steps={STEPS} current={step} label="1-Click workflow" />

      {/* Status strip: cols=Auto,12,*,Auto */}
      <Card className="flex items-center gap-4 py-3.5">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full",
            analyzed ? "bg-success/15 text-success" : "bg-cyan/15 text-cyan",
          )}
        >
          {analyzed ? (
            <ShieldCheck aria-hidden="true" className="h-5 w-5" />
          ) : (
            <ScanSearch aria-hidden="true" className="h-5 w-5" />
          )}
        </span>
        <div className="flex-1">
          <div className="text-sm font-bold">
            {scan.running
              ? "ANALYZING SAMPLE DATA…"
              : analyzed
                ? "DEMO RECOMMENDATIONS READY"
                : "NOT ANALYZED YET"}
          </div>
          <div className="text-[11.5px] text-muted-foreground">
            {analyzed
              ? `${ONE_CLICK_ACTIONS.length} recommended improvements across ${ONE_CLICK_GROUPS.length} areas (sample) · ${sel.size} selected`
              : scan.running
                ? "Loading the sample recommendation set. Nothing on this PC is scanned."
                : "Run Analyze to load the sample recommendations. Nothing on this PC is scanned."}
          </div>
        </div>
        <Badge tone={analyzed ? "success" : "muted"}>SIMULATED ANALYSIS</Badge>
      </Card>

      {/* Optimization areas */}
      <Card>
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <Label as="h2" className="text-foreground">
              OPTIMIZATION AREAS
            </Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Review the sample recommendations by area. Select an area to focus the list.
            </p>
          </div>
          <Btn
            size="sm"
            variant="ghost"
            disabled={!area}
            onClick={() => setArea(null)}
            title="Show all 1-Click optimization checks across all workloads"
          >
            Show all checks
          </Btn>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {ONE_CLICK_GROUPS.map((g) => {
            const inGroup = ONE_CLICK_ACTIONS.filter((a) => a.group === g.key);
            const picked = inGroup.filter((a) => sel.has(a.id)).length;
            return (
              <button
                type="button"
                key={g.key}
                aria-pressed={area === g.key}
                onClick={() => setArea(area === g.key ? null : g.key)}
                className={cn(
                  "rounded-xl border p-4 text-left transition-all",
                  area === g.key
                    ? "border-cyan/60 bg-cyan/10 eo-glow"
                    : "border-border bg-window hover:-translate-y-0.5 hover:border-border-strong",
                )}
              >
                <div className="eo-label text-foreground">{g.key}</div>
                <p className="mt-1 text-[11.5px] text-muted-foreground">{g.desc}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <Badge tone="cyan">{inGroup.length} RECOMMENDED</Badge>
                  {analyzed && (
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {picked}/{inGroup.length} SELECTED
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Recommended list */}
      <Card>
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <Label as="h2" className="text-foreground">
              RECOMMENDED OPTIMIZATIONS
            </Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose the sample changes to include; risk and restart requirements stay visible.
            </p>
          </div>
          <div ref={filterRef} className="relative flex flex-wrap gap-2">
            {filter !== "All Optimizations" && (
              <Btn
                size="sm"
                variant="ghost"
                onClick={() => setFilter("All Optimizations")}
                title="Remove filter"
                label={`Remove filter: ${filter}`}
              >
                <X aria-hidden="true" className="h-3 w-3" />
                {filter}
              </Btn>
            )}
            <Btn
              size="sm"
              expanded={filterOpen}
              controls="eo-oneclick-filter"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <SlidersHorizontal aria-hidden="true" className="h-3 w-3" />
              Filter
            </Btn>
            <Btn
              size="sm"
              disabled={!analyzed}
              onClick={() => setSel(recommendedSelection(ONE_CLICK_ACTIONS))}
            >
              Select recommended
            </Btn>
            <Btn size="sm" variant="ghost" disabled={!sel.size} onClick={() => setSel(new Set())}>
              Clear
            </Btn>
            {filterOpen && (
              <div
                id="eo-oneclick-filter"
                role="group"
                aria-label="Recommendation filters"
                className="eo-pop absolute top-9 right-0 z-20 w-64 space-y-3 rounded-lg border p-3"
              >
                {Object.entries(FILTERS).map(([h, opts]) => (
                  <div key={h}>
                    <Label className="mb-1 text-[9px]">{h}</Label>
                    {opts.map((o) => (
                      <button
                        type="button"
                        key={o}
                        aria-pressed={filter === o}
                        onClick={() => {
                          setFilter(o);
                          setFilterOpen(false);
                        }}
                        className={cn(
                          "block w-full rounded px-2 py-1 text-left text-xs",
                          filter === o
                            ? "bg-cyan/15 text-cyan"
                            : "text-muted-foreground hover:bg-elevated hover:text-foreground",
                        )}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mb-4">
          <SearchBox placeholder="Search recommendations…" value={query} onChange={setQuery} />
        </div>
        <div className="space-y-4" aria-live="polite">
          {scan.running && (
            <LoadingState
              label="Analyzing sample recommendations"
              progress={scan.progress}
              rows={3}
            />
          )}
          {!scan.running && !analyzed && (
            <EmptyState
              title="Analysis required"
              sub="Recommendations appear after you run Analyze. The prototype loads sample data only — it does not inspect this computer."
              action={
                <Btn variant="primary" onClick={analyze}>
                  <ScanSearch aria-hidden="true" className="h-3.5 w-3.5" />
                  Analyze
                </Btn>
              }
            />
          )}
          {!scan.running && analyzed && !visible.length && (
            <EmptyState
              title="No matching recommendations"
              sub={
                filter === "Protected Items" ||
                filter === "Already Optimized" ||
                filter === "Optional"
                  ? "The supplied sample data has no items in this state. The prototype does not invent them."
                  : "No sample recommendations match this search or filter."
              }
              action={<Btn onClick={resetFilters}>Reset filters</Btn>}
            />
          )}
          {!scan.running &&
            analyzed &&
            ONE_CLICK_GROUPS.filter((g) => visible.some((a) => a.group === g.key)).map((g) => (
              <section key={g.key} aria-label={g.key}>
                <h3 className="mb-2 eo-label text-[10px] text-cyan">{g.key}</h3>
                <ul className="space-y-2">
                  {visible
                    .filter((a) => a.group === g.key)
                    .map((a) => (
                      <li
                        key={a.id}
                        className={cn(
                          "flex items-center gap-4 rounded-xl border p-3.5 transition-colors",
                          sel.has(a.id)
                            ? "border-cyan/40 bg-cyan/5"
                            : "border-border bg-window hover:border-border-strong",
                        )}
                      >
                        <Check
                          label={`Select ${a.title}`}
                          on={sel.has(a.id)}
                          onChange={() => toggle(a.id)}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 text-[13px] font-bold">
                            {a.title}
                            <RiskBadge risk={a.risk} />
                            {a.restart && <Badge tone="warning">RESTART</Badge>}
                          </div>
                          <p className="text-[12px] text-muted-foreground">{a.desc}</p>
                          <p className="mt-0.5 text-[10.5px] text-success">{a.safety}</p>
                        </div>
                        <Btn
                          size="sm"
                          variant="ghost"
                          onClick={() => setDetail(a.id)}
                          label={`Details for ${a.title}`}
                        >
                          Details
                        </Btn>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
        </div>
      </Card>

      {/* Protection banner (expandable) */}
      <Card className="border-success/30">
        <button
          type="button"
          aria-expanded={protOpen}
          aria-controls="eo-protected-list"
          onClick={() => setProtOpen(!protOpen)}
          className="flex w-full items-center gap-3 text-left"
        >
          <ShieldCheck aria-hidden="true" className="h-5 w-5 text-success" />
          <div className="flex-1">
            <div className="eo-label text-success">YOUR APPS & SYSTEM ARE PROTECTED</div>
            <div className="text-xs text-muted-foreground">
              Critical Windows components, active applications, drivers, and games are never treated
              as optimization targets — and never selected automatically.
            </div>
          </div>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              protOpen && "rotate-180",
            )}
          />
        </button>
        {protOpen && (
          <ul
            id="eo-protected-list"
            className="mt-3 grid grid-cols-2 gap-1.5 pl-8 text-xs text-muted-foreground eo-enter"
          >
            {PROTECTED.map((x) => (
              <li key={x} className="flex items-center gap-1.5">
                <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 text-success" />
                {x}
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Completion report (after a simulated run) */}
      {lastRun && (
        <Card className="eo-result">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <Label as="h2" className="text-success">
                LAST SIMULATED RUN · {lastRun.at}
              </Label>
              <p className="mt-1 text-xs text-muted-foreground">
                A summary of the demonstration only. No Windows setting, file or service was read or
                changed.
              </p>
            </div>
            <Btn size="sm" variant="ghost" onClick={() => setLastRun(null)}>
              Dismiss
            </Btn>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(
              [
                ["SELECTED", lastRun.selected],
                ["SIMULATED STEPS", lastRun.simulatedSteps],
                ["RESTART NOTED", lastRun.restartNoted],
                ["CHANGES ON THIS PC", lastRun.realChanges],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="rounded-lg border border-border bg-window p-3">
                <div className="text-xl font-bold tabular-nums">{v}</div>
                <div className="text-[9.5px] font-bold text-muted-foreground">{k}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11.5px] text-muted-foreground">
            Included: {lastRun.titles.join(" · ")}
          </p>
        </Card>
      )}
      <SimNotice />

      {/* Sticky action bar: cols=*,Auto */}
      <div className="eo-sticky sticky bottom-0 flex items-center justify-between border-t border-border">
        <span className="text-xs text-muted-foreground" aria-live="polite">
          <b className="text-foreground">{sel.size}</b> selected
          {summary.restart ? ` · ${summary.restart} needs a restart` : ""} · Review risks and
          restart requirements before confirming the simulated run.
        </span>
        <div className="flex gap-2">
          <Btn variant="ghost" disabled={!sel.size} onClick={() => setSel(new Set())}>
            Clear
          </Btn>
          <Btn disabled={!sel.size} onClick={() => setReview(true)}>
            Review
          </Btn>
          <Btn
            variant="primary"
            disabled={!sel.size || scan.running}
            onClick={() => setReview(true)}
          >
            Optimize selected
          </Btn>
        </div>
      </div>

      <Modal
        open={guide}
        onClose={() => setGuide(false)}
        title="How 1-Click Optimization works"
        sub="Optimize your PC safely in a few simple steps."
        footer={
          <Btn variant="primary" onClick={() => setGuide(false)}>
            Got it
          </Btn>
        }
      >
        <ol className="space-y-3">
          {GUIDE.map(([t, desc], i) => (
            <li key={t} className="grid gap-3" style={{ gridTemplateColumns: "32px 1fr" }}>
              <span
                aria-hidden="true"
                className="eo-brand flex h-8 w-8 items-center justify-center rounded-full text-sm font-black"
              >
                {i + 1}
              </span>
              <div>
                <div className="eo-label text-foreground">{t}</div>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="pt-3 text-[11px] text-success">
          Protected apps, drivers and critical Windows components are never treated as targets.
        </p>
      </Modal>

      <Modal
        open={review}
        onClose={() => setReview(false)}
        title="Review your changes"
        sub="Simulated run · No Windows settings will be changed."
        width="max-w-3xl"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setReview(false)}>
              Back to edit
            </Btn>
            <Btn
              variant="primary"
              disabled={!sel.size}
              onClick={() => {
                setReview(false);
                setRun(true);
              }}
            >
              Confirm simulated run
            </Btn>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {(
              [
                ["SELECTED", summary.total, "text-foreground"],
                ["SAFE", summary.byRisk.SAFE, "text-success"],
                ["LOW RISK", summary.byRisk.LOW, "text-success"],
                ["NEEDS RESTART", summary.restart, "text-warning"],
              ] as const
            ).map(([k, v, c]) => (
              <div key={k} className="rounded-lg border border-border bg-window p-2.5 text-center">
                <div className={cn("text-xl font-bold tabular-nums", c)}>{v}</div>
                <div className="text-[9px] font-bold text-muted-foreground">{k}</div>
              </div>
            ))}
          </div>
          {!sel.size && (
            <EmptyState
              title="Nothing selected"
              sub="Go back and select at least one recommendation."
            />
          )}
          {ONE_CLICK_GROUPS.filter((g) => selectedItems.some((a) => a.group === g.key)).map((g) => (
            <section key={g.key} aria-label={g.key}>
              <h3 className="mb-1.5 eo-label text-[10px] text-cyan">{g.key}</h3>
              <ul className="space-y-1.5">
                {selectedItems
                  .filter((a) => a.group === g.key)
                  .map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-window px-3 py-2 text-sm"
                    >
                      <span className="min-w-0">{a.title}</span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        <RiskBadge risk={a.risk} />
                        {a.restart && <Badge tone="warning">RESTART</Badge>}
                        <Btn
                          size="sm"
                          variant="ghost"
                          label={`Remove ${a.title}`}
                          title="Remove from selection"
                          onClick={() => toggle(a.id)}
                        >
                          <X aria-hidden="true" className="h-3 w-3" />
                        </Btn>
                      </span>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
          {summary.restart > 0 && (
            <p className="rounded-lg border border-warning/30 bg-warning/5 p-2.5 text-[11.5px] text-warning">
              {summary.restart} selected item{summary.restart === 1 ? "" : "s"} would need a Windows
              restart in the native app.
            </p>
          )}
          <p className="text-[11px] text-muted-foreground">
            This demonstration does not establish real verification or rollback availability.
          </p>
        </div>
      </Modal>

      <Modal
        open={!!d}
        onClose={() => setDetail(null)}
        title={d?.title ?? ""}
        sub="Sample recommendation metadata — no machine state is detected."
        footer={
          d && (
            <>
              <Btn variant="ghost" onClick={() => setDetail(null)}>
                Close
              </Btn>
              <Btn variant={sel.has(d.id) ? "secondary" : "primary"} onClick={() => toggle(d.id)}>
                {sel.has(d.id) ? "Remove from selection" : "Add to selection"}
              </Btn>
            </>
          )
        }
      >
        {d && (
          <div className="space-y-4">
            <p className="text-[12.5px] text-muted-foreground">{d.desc}</p>
            <div>
              <Label as="h3" className="mb-1 text-cyan">
                ANALYSIS & TARGET STATE
              </Label>
              <KV k="Why recommended:" v={d.why} />
              <KV k="Current state:" v="Not detected in prototype" />
              <KV k="Target configuration:" v="Optimized (see native app)" />
            </div>
            <div>
              <Label as="h3" className="mb-1 text-cyan">
                SAFETY, VERIFICATION & RESTORE
              </Label>
              <KV k="Safety & Risk:" v={<RiskBadge risk={d.risk} />} />
              <KV k="Safety notes:" v={d.safety} />
              <KV k="Restart requirement:" v={d.restart ? "Required" : "Not required"} />
              <KV k="Verification method:" v="Readback (native app)" />
              <KV k="Rollback capability:" v="Determined per operation in native app" />
            </div>
          </div>
        )}
      </Modal>

      <RunModal
        open={run}
        onClose={() => setRun(false)}
        profile="1-Click"
        count={sel.size}
        items={selectedItems}
        onComplete={onComplete}
      />
    </div>
  );
}
