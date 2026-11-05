// Dashboard Auto Optimize panel — the central action area of the Dashboard.
// It drives the SAME workflow as the 1-Click page (useOptimizeWorkflow + ReviewSelectionModal +
// RunModal): Analyze → Review → Confirm → Simulated result. Protected items are never
// pre-selected, and the result always reports 0 changes on this PC.
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Cpu, MemoryStick, MonitorCog, ScanSearch, ShieldCheck, Sparkles, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Badge, Bar, Btn, Card, Check, Label, RiskBadge, Stepper } from "./kit";
import { Segmented } from "./controls";
import { RunModal } from "./RunModal";
import { ReviewSelectionModal } from "./ReviewSelectionModal";
import { useOptimizeWorkflow } from "./useOptimizeWorkflow";
import { HW, ONE_CLICK_ACTIONS, ONE_CLICK_GROUPS } from "@/lib/eo/data";
import { cn } from "@/lib/utils";

export const OPTIMIZATION_MODES = ["NORMAL", "ADVANCED", "CONSERVATIVE GAMING"];
export const MODE_TEXT: Record<string, string> = {
  NORMAL:
    "Normal optimization applies conservative timing adjustments, DPC interrupt balancing and safe scheduler defaults.",
  ADVANCED: "Advanced applies deeper scheduler and timer tuning for power users.",
  "CONSERVATIVE GAMING":
    "Conservative gaming keeps anti-cheat-sensitive settings untouched while biasing foreground latency.",
};
const STEPS = ["Analyze", "Review", "Confirm", "Simulated result"];

export function AutoOptimizePanel({
  mode,
  onMode,
}: {
  mode: string;
  onMode: (m: string) => void;
}) {
  const wf = useOptimizeWorkflow(1600);
  const [review, setReview] = useState(false);
  const [run, setRun] = useState(false);
  const { scan, analyzed, sel, summary, selectedItems, lastRun } = wf;
  const phase = scan.running ? "scanning" : lastRun ? "done" : analyzed ? "review" : "overview";
  const step = lastRun ? 4 : run || review ? 2 : analyzed ? 1 : 0;
  const progress = scan.progress ?? 0;
  const protectedSelected = summary.byRisk.PROTECTED;

  return (
    <Card className="eo-hero eo-auto flex flex-col">
      {/* Header: identity + profile */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="eo-auto-mark" aria-hidden="true">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[15px] font-black uppercase">Auto Optimize</h2>
              <Badge tone="cyan">V3 ENGINE</Badge>
              <Badge tone="warning">SIMULATED</Badge>
            </div>
            <p className="mt-0.5 text-[11.5px] text-muted-foreground">
              Adaptive, hardware-aware recommendations from the 1-Click engine (sample data).
            </p>
          </div>
        </div>
        <Segmented label="Optimization profile" options={OPTIMIZATION_MODES} value={mode} onChange={onMode} />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <Stepper steps={STEPS} current={step} label="Auto Optimize workflow" />
        <span className="text-[10px] font-bold text-subtle">
          {mode} PROFILE · {ONE_CLICK_ACTIONS.length} SAMPLE RECOMMENDATIONS
        </span>
      </div>

      {/* Body: fixed height so phases swap without moving the page */}
      <div className="eo-auto-body mt-3" aria-live="polite">
        {(phase === "overview" || phase === "scanning") && (
          <div key="overview" className="eo-swap grid h-full gap-3" style={{ gridTemplateColumns: "minmax(0,1.25fr) minmax(0,1fr)" }}>
            <div className={cn("eo-auto-cats relative", phase === "scanning" && "eo-scan")}>
              <Label as="h3" className="mb-1.5 text-[9.5px]">
                OPTIMIZATION CATEGORIES
              </Label>
              <ul className="space-y-1.5">
                {ONE_CLICK_GROUPS.map((g, i) => {
                  const count = ONE_CLICK_ACTIONS.filter((a) => a.group === g.key).length;
                  const checked = phase === "scanning" && progress >= ((i + 1) / ONE_CLICK_GROUPS.length) * 100 - 2;
                  const checking = phase === "scanning" && !checked && progress >= (i / ONE_CLICK_GROUPS.length) * 100;
                  return (
                    <li key={g.key} className="eo-auto-row" data-state={checked ? "done" : checking ? "active" : undefined}>
                      <span className="min-w-0 flex-1 truncate text-[11.5px] font-bold">{g.key}</span>
                      <span className="text-[10px] font-bold text-subtle">{count} REC.</span>
                      <span className="w-20 text-right text-[9.5px] font-bold">
                        {checked ? (
                          <span className="text-success">CHECKED</span>
                        ) : checking ? (
                          <span className="text-cyan">CHECKING…</span>
                        ) : (
                          <span className="text-subtle">AWAITING</span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {phase === "scanning" && (
                <div role="status" className="mt-2.5">
                  <div className="mb-1 flex justify-between text-[10px] font-bold text-cyan">
                    <span>ANALYZING SAMPLE DATA · NOTHING ON THIS PC IS SCANNED</span>
                    <span className="font-mono">{Math.round(progress)}%</span>
                  </div>
                  <Bar value={progress} active />
                </div>
              )}
            </div>
            <div className="eo-auto-profile">
              <Label as="h3" className="mb-1.5 text-[9.5px]">
                HARDWARE PROFILE · SAMPLE
              </Label>
              <ul className="space-y-1.5 text-[11.5px]">
                {(
                  [
                    [Cpu, HW.cpu],
                    [MonitorCog, HW.gpu],
                    [MemoryStick, HW.ram],
                  ] as const
                ).map(([Icon, v]) => (
                  <li key={v} className="flex items-center gap-2">
                    <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-cyan" />
                    <span className="truncate font-semibold">{v}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2.5 text-[11px] leading-snug text-muted-foreground">{MODE_TEXT[mode]}</p>
            </div>
          </div>
        )}

        {phase === "review" && (
          <div key="review" className="eo-swap flex h-full flex-col">
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-muted-foreground">
                <b className="text-foreground">{sel.size}</b> of {ONE_CLICK_ACTIONS.length} selected
                {summary.restart ? ` · ${summary.restart} needs a restart` : ""}
              </span>
              <span className="flex gap-1.5">
                <Btn size="sm" variant="ghost" onClick={wf.selectRecommended}>
                  Select recommended
                </Btn>
                <Btn size="sm" variant="ghost" disabled={!sel.size} onClick={wf.clear}>
                  Clear
                </Btn>
              </span>
            </div>
            <ul aria-label="Sample recommendations" className="eo-auto-list min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
              {ONE_CLICK_ACTIONS.map((a) => (
                <li key={a.id} className="eo-auto-rec" data-selected={sel.has(a.id) ? "true" : undefined}>
                  <Check label={`Select ${a.title}`} on={sel.has(a.id)} onChange={() => wf.toggle(a.id)} />
                  <span className="min-w-0 flex-1 truncate text-[11.5px] font-bold">{a.title}</span>
                  <RiskBadge risk={a.risk} />
                  {a.restart && <Badge tone="warning">RESTART</Badge>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {phase === "done" && lastRun && (
          <div key="done" className="eo-swap eo-result flex h-full flex-col justify-center rounded-lg border p-3">
            <Label as="h3" className="text-success">
              SIMULATED RUN COMPLETE · {lastRun.at}
            </Label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {(
                [
                  ["SELECTED", lastRun.selected],
                  ["SIMULATED STEPS", lastRun.simulatedSteps],
                  ["RESTART NOTED", lastRun.restartNoted],
                  ["CHANGES ON THIS PC", lastRun.realChanges],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="rounded-lg border border-border bg-window p-2 text-center">
                  <div className="text-lg font-bold tabular-nums">{v}</div>
                  <div className="text-[8.5px] font-bold text-muted-foreground">{k}</div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Demonstration only — no Windows setting, file or service was read or changed. The score
              is unaffected.
            </p>
          </div>
        )}
      </div>

      {/* Footer: safety + actions */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <span className="flex items-center gap-2 text-[10.5px] font-bold text-success">
          <ShieldCheck aria-hidden="true" className="h-4 w-4" />
          PROTECTED ITEMS NEVER AUTO-SELECTED
          {analyzed && <span className="text-subtle">· {protectedSelected} PROTECTED IN SELECTION</span>}
        </span>
        <div className="flex flex-wrap gap-2">
          <Link to="/$page" params={{ page: "one-click" }} title="Open the full 1-Click workflow">
            <Btn variant="ghost">
              Review recommendations
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Btn>
          </Link>
          {phase === "overview" || phase === "scanning" ? (
            <Btn variant="primary" size="lg" loading={scan.running} onClick={() => wf.analyze()}>
              {!scan.running && <ScanSearch aria-hidden="true" className="h-4 w-4" />}
              {scan.running ? "Analyzing…" : "Auto Optimize"}
            </Btn>
          ) : phase === "review" ? (
            <Btn variant="primary" size="lg" disabled={!sel.size} onClick={() => setReview(true)}>
              Review & confirm ({sel.size})
            </Btn>
          ) : (
            <Btn
              variant="primary"
              size="lg"
              onClick={() => {
                wf.dismissRun();
                wf.analyze();
              }}
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Analyze again
            </Btn>
          )}
        </div>
      </div>

      <ReviewSelectionModal
        open={review}
        onClose={() => setReview(false)}
        onConfirm={() => {
          setReview(false);
          setRun(true);
        }}
        items={selectedItems}
        summary={summary}
        onRemove={wf.toggle}
      />
      <RunModal
        open={run}
        onClose={() => setRun(false)}
        profile="Auto Optimize"
        count={sel.size}
        items={selectedItems}
        onComplete={wf.complete}
      />
    </Card>
  );
}
