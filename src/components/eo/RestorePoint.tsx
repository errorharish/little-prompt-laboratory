// Restore point workflow UI (shared): System Protection check → "System Protection Is
// Disabled" dialog → explicit enable confirmation → verification → creation → verification.
// Simulated end to end: no Windows API is called and no restore point is created.
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  XCircle,
} from "lucide-react";
import { Badge, Btn, KV, Modal } from "./kit";
import { OpProgress } from "./RunModal";
import {
  RP_MANUAL_STEPS,
  RP_TIMED,
  isRpBusy,
  protectionAfter,
  rpNext,
  type RpEvent,
  type RpPhase,
} from "@/lib/eo/restorePoint";
import { addRestorePoint, getRestore, setDevice, useRestore } from "./restoreStore";

const BUSY_TEXT: Partial<Record<RpPhase, [string, string]>> = {
  checking: ["Checking System Protection", "Reading the protection state of the system drive"],
  enabling: ["Enabling System Protection", "Waiting for administrator approval (simulated)"],
  "verifying-protection": ["Verifying System Protection", "Confirming the drive now reports on"],
  creating: ["Creating restore point", "Asking Windows to snapshot system files (simulated)"],
  "verifying-point": ["Verifying restore point", "Checking the new point exists in the list"],
};

export function useRestorePointFlow(defaultName: string) {
  const { device } = useRestore();
  const [phase, setPhase] = useState<RpPhase>("idle");
  const [name, setName] = useState(defaultName);
  const [progress, setProgress] = useState(0);
  const [createdAt, setCreatedAt] = useState<number | null>(null);
  const nameRef = useRef(name);
  nameRef.current = name;

  const send = useCallback((e: RpEvent) => {
    setPhase((p) => rpNext(p, e, getRestore().device));
  }, []);

  // Timed phases advance by themselves; the enable step is the only one that changes the
  // simulated device, and only after an explicit confirmation led here.
  useEffect(() => {
    const ms = RP_TIMED[phase];
    if (!ms) return;
    setProgress(0);
    const t0 = Date.now();
    const tick = setInterval(() => setProgress(Math.min(100, ((Date.now() - t0) / ms) * 100)), 60);
    const done = setTimeout(() => {
      const dev = getRestore().device;
      if (phase === "enabling" && protectionAfter(phase, dev) !== dev.protectionOn) {
        setDevice({ protectionOn: true });
      }
      const next = rpNext(phase, "done", getRestore().device);
      if (next === "created") {
        const at = Date.now();
        setCreatedAt(at);
        addRestorePoint({ name: nameRef.current.trim() || defaultName, drive: dev.drive, at });
      }
      setPhase(next);
    }, ms);
    return () => {
      clearInterval(tick);
      clearTimeout(done);
    };
  }, [phase, defaultName]);

  const reset = useCallback(() => {
    setPhase("idle");
    setCreatedAt(null);
    setName(defaultName);
  }, [defaultName]);

  return { phase, send, reset, name, setName, progress, device, createdAt };
}
export type RestorePointFlow = ReturnType<typeof useRestorePointFlow>;

/** Body for the current phase. Hosts (dialog or run modal) render their own footer. */
export function RestorePointBody({ flow }: { flow: RestorePointFlow }) {
  const { phase, device, progress, name, setName, createdAt } = flow;
  const busy = BUSY_TEXT[phase];
  return (
    <div className="eo-rp space-y-3" aria-live="polite">
      {phase === "idle" && (
        <>
          <label htmlFor="eo-rp-name" className="eo-label block text-foreground">
            Restore point name
          </label>
          <input
            id="eo-rp-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-window px-3 text-sm outline-none focus:border-cyan/60"
          />
          <p className="text-[11.5px] text-muted-foreground">
            System Protection on {device.drive} is checked first. Simulated: no restore point is
            created on this PC.
          </p>
        </>
      )}

      {busy && <OpProgress value={progress} title={`${busy[0]}…`} detail={busy[1]} active />}

      {(phase === "protection-off" || phase === "confirm-enable") && (
        <div className="eo-rp-alert" data-tone="warning" role="alert">
          <span className="eo-rp-alert-icon" aria-hidden="true">
            <ShieldOff />
          </span>
          <div className="min-w-0">
            <h3 className="eo-rp-alert-title">System Protection Is Disabled</h3>
            <p>
              Windows can only create a restore point when System Protection is on for the system
              drive. Nothing has been changed.
            </p>
            <div className="eo-rp-drive">
              <HardDrive aria-hidden="true" />
              <span>
                <b>{device.drive}</b> · System drive
              </span>
              <Badge tone="warning">PROTECTION OFF</Badge>
            </div>
          </div>
        </div>
      )}

      {phase === "confirm-enable" && (
        <div className="eo-rp-confirm" role="group" aria-label="Confirm enabling System Protection">
          <p className="text-[12.5px] font-semibold">
            Turn on System Protection for {device.drive} only?
          </p>
          <ul>
            <li>Windows asks for administrator approval.</li>
            <li>Only {device.drive} is changed — other drives stay as they are.</li>
            <li>Uses a small share of disk space for restore points.</li>
            <li>Existing restore points are never deleted.</li>
          </ul>
        </div>
      )}

      {phase === "enable-failed" && (
        <div className="eo-rp-alert" data-tone="danger" role="alert">
          <span className="eo-rp-alert-icon" aria-hidden="true">
            <ShieldAlert />
          </span>
          <div className="min-w-0">
            <h3 className="eo-rp-alert-title">System Protection could not be turned on</h3>
            <p>
              Protection on {device.drive} is still off, so no restore point was created. You can
              turn it on yourself:
            </p>
            <ol className="eo-rp-steps">
              {RP_MANUAL_STEPS.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {phase === "create-failed" && (
        <div className="eo-rp-alert" data-tone="danger" role="alert">
          <span className="eo-rp-alert-icon" aria-hidden="true">
            <XCircle />
          </span>
          <div className="min-w-0">
            <h3 className="eo-rp-alert-title">No restore point was created</h3>
            <p>
              System Protection is on, but Windows skipped the new point — by default it allows one
              restore point per 24 hours. The newest existing point is still available.
            </p>
          </div>
        </div>
      )}

      {phase === "created" && (
        <div className="eo-rp-alert" data-tone="success" role="status">
          <span className="eo-rp-alert-icon" aria-hidden="true">
            <CheckCircle2 />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="eo-rp-alert-title">Restore point created and verified</h3>
            <p>Simulated result — nothing was created on this PC.</p>
            <div className="mt-2">
              <KV k="Name" v={`“${name.trim()}”`} />
              <KV k="Drive" v={device.drive} />
              <KV k="Created" v={createdAt ? new Date(createdAt).toLocaleTimeString() : "—"} />
            </div>
          </div>
        </div>
      )}

      {phase === "cancelled" && (
        <div className="eo-rp-alert" data-tone="muted" role="status">
          <span className="eo-rp-alert-icon" aria-hidden="true">
            <AlertTriangle />
          </span>
          <div className="min-w-0">
            <h3 className="eo-rp-alert-title">Cancelled</h3>
            <p>No restore point was created and System Protection was not changed.</p>
          </div>
        </div>
      )}
    </div>
  );
}

/** Footer actions shared by every host. `onClose` ends the flow; `onCreated` continues. */
export function RestorePointActions({
  flow,
  onClose,
  onCreated,
  createdLabel = "Done",
  closeLabel = "Close",
}: {
  flow: RestorePointFlow;
  onClose: () => void;
  onCreated?: (() => void) | undefined;
  createdLabel?: string | undefined;
  closeLabel?: string | undefined;
}) {
  const { phase, send, name } = flow;
  if (isRpBusy(phase)) return <Btn disabled>Working…</Btn>;
  switch (phase) {
    case "idle":
      return (
        <>
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
          <Btn variant="primary" disabled={!name.trim()} onClick={() => send("start")}>
            Create restore point
          </Btn>
        </>
      );
    case "protection-off":
      return (
        <>
          <Btn variant="ghost" onClick={() => send("cancel")}>
            Cancel
          </Btn>
          <Btn variant="primary" onClick={() => send("enable")}>
            <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
            Enable System Protection
          </Btn>
        </>
      );
    case "confirm-enable":
      return (
        <>
          <Btn variant="ghost" onClick={() => send("back")}>
            Back
          </Btn>
          <Btn variant="primary" onClick={() => send("confirm")}>
            Confirm & enable
          </Btn>
        </>
      );
    case "enable-failed":
    case "create-failed":
      return (
        <>
          <Btn variant="ghost" onClick={onClose}>
            {closeLabel}
          </Btn>
          <Btn variant="primary" onClick={() => send("retry")}>
            Try again
          </Btn>
        </>
      );
    case "created":
      return (
        <Btn variant="primary" onClick={onCreated ?? onClose}>
          {createdLabel}
        </Btn>
      );
    default:
      return (
        <Btn variant="primary" onClick={onClose}>
          {closeLabel}
        </Btn>
      );
  }
}

/** Standalone dialog (Backup & Restore, Dashboard). Starts the check as soon as it opens. */
export function RestorePointDialog({
  open,
  onClose,
  defaultName = "Before optimization",
  autoStart = true,
}: {
  open: boolean;
  onClose: () => void;
  defaultName?: string | undefined;
  autoStart?: boolean | undefined;
}) {
  const flow = useRestorePointFlow(defaultName);
  const { reset, send } = flow;
  useEffect(() => {
    if (!open) return;
    reset();
    if (autoStart) send("start");
  }, [open, autoStart, reset, send]);
  const p = flow.phase;
  const off = p === "protection-off" || p === "confirm-enable";
  return (
    <Modal
      open={open}
      onClose={() => {
        if (!isRpBusy(p)) onClose();
      }}
      title={off ? "System Protection Is Disabled" : "Create restore point"}
      sub="Simulated · no Windows settings change and no restore point is created"
      width="max-w-md"
      icon={
        off ? (
          <ShieldOff className="h-4 w-4" />
        ) : p === "created" ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <ShieldCheck className="h-4 w-4" />
        )
      }
      tone={
        off
          ? "warning"
          : p === "created"
            ? "success"
            : p === "enable-failed" || p === "create-failed"
              ? "danger"
              : "cyan"
      }
      footer={<RestorePointActions flow={flow} onClose={onClose} />}
    >
      <RestorePointBody flow={flow} />
    </Modal>
  );
}
