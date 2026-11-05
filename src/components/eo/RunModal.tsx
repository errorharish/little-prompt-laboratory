// Mirrors Controls/UniversalOptimizationModal.xaml: Approve → Restore point → staged run → summary.
// Every phase is simulated. The summary reports only what the prototype did (nothing on this PC).
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ShieldCheck, Square, Zap } from "lucide-react";
import { Badge, Bar, Btn, Chips, Details, KV, Modal, RiskBadge, StatTiles, Stepper } from "./kit";
import type { Risk } from "@/lib/eo/data";
import { simulatedRunSummary, type SimulatedRunSummary } from "@/lib/eo/selection";
import { cn } from "@/lib/utils";

const STAGES = ["ANALYZING", "PREPARING", "APPLYING", "VERIFYING", "FINALIZING"];
const FLOW = ["Approve", "Restore point", "Simulated run", "Summary"];
type Phase = "approve" | "restore" | "running" | "done" | "cancelled";

export interface RunItem {
  id: string;
  title: string;
  risk: Risk;
  restart?: boolean | undefined;
}

export function RunModal({
  open,
  onClose,
  profile,
  count,
  items,
  onComplete,
}: {
  open: boolean;
  onClose: () => void;
  profile: string;
  count: number;
  items?: RunItem[] | undefined;
  onComplete?: ((summary: SimulatedRunSummary) => void) | undefined;
}) {
  const [phase, setPhase] = useState<Phase>("approve");
  const [p, setP] = useState(0);
  const [rpName, setRpName] = useState(`Before ${profile} optimization`);
  const [tab, setTab] = useState("Kernel");
  const [summary, setSummary] = useState<SimulatedRunSummary | null>(null);
  const started = useRef(0);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;
  const restartNoted = items?.filter((i) => i.restart).length ?? 0;

  useEffect(() => {
    if (open) {
      setPhase("approve");
      setP(0);
      setSummary(null);
      setRpName(`Before ${profile} optimization`);
    }
  }, [open, profile]);

  useEffect(() => {
    if (phase !== "running" || !open) return;
    started.current = Date.now();
    const id = setInterval(() => setP((v) => Math.min(100, v + 2)), 60);
    return () => clearInterval(id);
  }, [phase, open]);

  useEffect(() => {
    if (phase !== "running" || p < 100) return;
    const s = simulatedRunSummary(count, restartNoted, Date.now() - started.current);
    setSummary(s);
    setPhase("done");
    completeRef.current?.(s);
  }, [p, phase, count, restartNoted]);

  const stageIdx = Math.min(4, Math.floor(p / 20));
  const flowIdx =
    phase === "approve"
      ? 0
      : phase === "restore"
        ? 1
        : phase === "running" || phase === "cancelled"
          ? 2
          : 4;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${profile} — Optimization`}
      sub="Simulated run. Nothing on this computer is changed."
      width="max-w-xl"
      icon={
        phase === "done" ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : phase === "cancelled" ? (
          <Square className="h-4 w-4" />
        ) : phase === "approve" || phase === "restore" ? (
          <ShieldCheck className="h-4 w-4" />
        ) : (
          <Zap className="h-4 w-4" />
        )
      }
      tone={phase === "done" ? "success" : phase === "cancelled" ? "warning" : "cyan"}
      footer={
        phase === "approve" ? (
          <>
            <Btn variant="ghost" onClick={onClose}>
              Cancel optimization
            </Btn>
            <Btn variant="primary" disabled={!count} onClick={() => setPhase("restore")}>
              Approve & proceed
            </Btn>
          </>
        ) : phase === "restore" ? (
          <>
            <Btn variant="ghost" onClick={() => setPhase("approve")}>
              Back
            </Btn>
            <Btn variant="primary" disabled={!rpName.trim()} onClick={() => setPhase("running")}>
              Create & continue
            </Btn>
          </>
        ) : phase === "running" ? (
          <Btn variant="danger" onClick={() => setPhase("cancelled")}>
            Stop simulation
          </Btn>
        ) : (
          <>
            <Btn
              variant="ghost"
              onClick={() => {
                setP(0);
                setSummary(null);
                setPhase("running");
              }}
            >
              Run simulation again
            </Btn>
            <Btn variant="primary" onClick={onClose}>
              Close
            </Btn>
          </>
        )
      }
    >
      <div className="mb-4">
        <Stepper steps={FLOW} current={flowIdx} label="Optimization run progress" />
      </div>
      {phase === "approve" && (
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            {count} selected optimization{count === 1 ? "" : "s"} will be walked through the native
            app's analyze → apply → verify stages as a demonstration. No setting is read or changed.
          </p>
          <KV k="Profile" v={profile} />
          <KV k="Selected items" v={count} />
          {items && (
            <KV
              k="Restart noted in metadata"
              v={restartNoted ? `${restartNoted} item${restartNoted === 1 ? "" : "s"}` : "None"}
            />
          )}
          <KV k="Backup" v="Simulated snapshot" />
          <KV k="Rollback" v="Per-operation support in native app" />
        </div>
      )}
      {phase === "restore" && (
        <div className="space-y-3">
          <label htmlFor="eo-restore-name" className="eo-label block text-foreground">
            Create restore point
          </label>
          <p className="text-xs text-muted-foreground">
            Name the simulated restore point. No actual restore point is created.
          </p>
          <input
            id="eo-restore-name"
            value={rpName}
            onChange={(e) => setRpName(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-window px-3 text-sm outline-none focus:border-cyan/60"
          />
        </div>
      )}
      {(phase === "running" || phase === "cancelled") && (
        <div className="space-y-4">
          <OpProgress
            value={p}
            title={phase === "running" ? `${STAGES[stageIdx]}…` : "Simulation stopped"}
            detail={
              phase === "running"
                ? `Stage ${stageIdx + 1} of ${STAGES.length} · ${Math.round((p / 100) * count)} of ${count} items walked through`
                : `${Math.round((p / 100) * count)} of ${count} items reached · nothing to revert`
            }
            active={phase === "running"}
          />
          <ol aria-label="Run stages" className="grid grid-cols-5 gap-1.5">
            {STAGES.map((s, i) => (
              <li
                key={s}
                aria-current={i === stageIdx && phase === "running" ? "step" : undefined}
                className={cn(
                  "rounded-md border py-1.5 text-center text-[10px] font-bold",
                  i < stageIdx
                    ? "border-success/40 text-success"
                    : i === stageIdx && phase === "running"
                      ? "border-cyan/60 bg-cyan/10 text-cyan"
                      : "border-border text-subtle",
                )}
              >
                {s}
              </li>
            ))}
          </ol>
          <p role="status" aria-live="polite" className="sr-only">
            {phase === "running"
              ? `${STAGES[stageIdx]} ${Math.round(p / 10) * 10}%`
              : "Simulation stopped"}
          </p>
          {phase === "cancelled" && (
            <div
              role="alert"
              className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs text-warning"
            >
              Simulation stopped at {p.toFixed(0)}%. Nothing was changed, so there is nothing to
              revert.
            </div>
          )}
        </div>
      )}
      {phase === "done" && summary && (
        <div className="space-y-4" role="status" aria-live="polite">
          <StatTiles
            items={[
              { label: "SELECTED", value: summary.selected },
              { label: "SIMULATED", value: summary.simulatedSteps, tone: "cyan" },
              {
                label: "RESTART NOTED",
                value: items ? summary.restartNoted : "—",
                tone: "warning",
              },
              { label: "CHANGES ON THIS PC", value: summary.realChanges, tone: "success" },
            ]}
          />
          <KV k="Simulation time" v={`${(summary.elapsedMs / 1000).toFixed(1)} s`} />
          <KV k="Restore point" v={`“${rpName}” (simulated)`} />
          <KV k="Verification" v={summary.verification} />
          {items && items.length > 0 && (
            <ul aria-label="Simulated items" className="max-h-44 space-y-1 overflow-y-auto">
              {items.map((i) => (
                <li
                  key={i.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-border bg-window px-3 py-1.5 text-[12px]"
                >
                  <span className="min-w-0 truncate">{i.title}</span>
                  <span className="flex shrink-0 gap-1.5">
                    <RiskBadge risk={i.risk} />
                    <Badge tone="cyan">SIMULATED</Badge>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Details inline title="ADVANCED DETAILS" hint="4 subsystems">
            <Chips
              label="Advanced details subsystem"
              options={["Kernel", "Network", "Interrupts", "Protected"]}
              value={tab}
              onChange={setTab}
            />
            <div className="mt-2 rounded-lg border border-border bg-window p-3 text-xs text-muted-foreground">
              The native app lists real {tab.toLowerCase()} results here. The prototype has none to
              show, and raw keys stay behind this view.
            </div>
          </Details>
        </div>
      )}
    </Modal>
  );
}

/** Shared optimization progress block: ring, current operation, detail line and bar. */
export function OpProgress({
  value,
  title,
  detail,
  active,
}: {
  value: number;
  title: string;
  detail: string;
  active?: boolean | undefined;
}) {
  const r = 24;
  const len = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="eo-op">
      <div className="eo-op-head">
        <div className="eo-op-ring" aria-hidden="true">
          <svg viewBox="0 0 56 56" width="56" height="56">
            <defs>
              <linearGradient id="eo-op-grad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--cyan)" />
                <stop offset="100%" stopColor="var(--primary)" />
              </linearGradient>
            </defs>
            <circle className="eo-op-track" cx="28" cy="28" r={r} />
            <circle
              className="eo-op-arc"
              cx="28"
              cy="28"
              r={r}
              strokeDasharray={len.toFixed(2)}
              strokeDashoffset={(len * (1 - v / 100)).toFixed(2)}
            />
          </svg>
          <span>{Math.round(v)}%</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="eo-op-current">
            <span key={title}>{title}</span>
          </div>
          <div className="mt-0.5 text-[11.5px] text-muted-foreground">{detail}</div>
          <Badge tone="cyan" className="mt-1.5">
            SIMULATED
          </Badge>
        </div>
      </div>
      <Bar value={v} active={active} />
    </div>
  );
}
