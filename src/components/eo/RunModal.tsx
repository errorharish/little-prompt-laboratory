// Mirrors Controls/UniversalOptimizationModal.xaml: Approve → Restore point → staged run → summary.
import { useEffect, useState } from "react";
import { Badge, Bar, Btn, Chips, KV, Modal } from "./kit";
import { cn } from "@/lib/utils";

const STAGES = ["ANALYZING", "PREPARING", "APPLYING", "VERIFYING", "FINALIZING"];
type Phase = "approve" | "restore" | "running" | "done" | "cancelled";

export function RunModal({ open, onClose, profile, count }: { open: boolean; onClose: () => void; profile: string; count: number }) {
  const [phase, setPhase] = useState<Phase>("approve");
  const [p, setP] = useState(0);
  const [rpName, setRpName] = useState(`Before ${profile} optimization`);
  const [tab, setTab] = useState("Kernel");

  useEffect(() => {
    if (open) { setPhase("approve"); setP(0); setRpName(`Before ${profile} optimization`); }
  }, [open, profile]);

  useEffect(() => {
    if (phase !== "running" || !open) return;
    const id = setInterval(() => setP((v) => {
      if (v >= 100) { clearInterval(id); setPhase("done"); return 100; }
      return v + 2;
    }), 60);
    return () => clearInterval(id);
  }, [phase, open]);

  const stageIdx = Math.min(4, Math.floor(p / 20));

  return (
    <Modal open={open} onClose={onClose} title={`${profile} — Optimization`} sub="Simulated run. Nothing on this computer is changed." width="max-w-xl"
      footer={
        phase === "approve" ? (<><Btn variant="ghost" onClick={onClose}>Cancel optimization</Btn><Btn variant="primary" onClick={() => setPhase("restore")}>Approve & proceed</Btn></>) :
        phase === "restore" ? (<><Btn variant="ghost" onClick={onClose}>Cancel optimization</Btn><Btn variant="primary" onClick={() => setPhase("running")}>Create & continue</Btn></>) :
        phase === "running" ? (<Btn variant="danger" onClick={() => setPhase("cancelled")}>✕ Cancel optimization</Btn>) :
        (<><Btn variant="ghost" onClick={() => { setP(0); setPhase("running"); }}>⟳ Retry optimization</Btn><Btn variant="primary" onClick={onClose}>Close</Btn></>)
      }>
      {phase === "approve" && (
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">{count} selected optimizations will be analyzed, applied and verified. The snapshot and verification steps are demonstrated, not performed.</p>
          <KV k="Profile" v={profile} />
          <KV k="Selected items" v={count} />
          <KV k="Backup" v="Simulated snapshot" />
          <KV k="Rollback" v="Per-operation support in native app" />
        </div>
      )}
      {phase === "restore" && (
        <div className="space-y-3">
          <div className="eo-label text-foreground">Create restore point</div>
          <p className="text-xs text-muted-foreground">Name the simulated restore point. No actual restore point is created.</p>
          <input value={rpName} onChange={(e) => setRpName(e.target.value)} aria-label="Simulated restore point name" className="h-9 w-full rounded-lg border border-border bg-window px-3 text-sm outline-none focus:border-cyan/60" />
        </div>
      )}
      {(phase === "running" || phase === "cancelled") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between"><Badge tone="cyan">Cooperative engine</Badge><span className="font-mono text-2xl font-bold">{p.toFixed(0)}%</span></div>
          <div className="grid grid-cols-5 gap-1.5 overflow-x-auto">
            {STAGES.map((s, i) => (
              <div key={s} className={cn("rounded-md border py-1.5 text-center text-[9px] font-bold tracking-widest", i < stageIdx ? "border-success/40 text-success" : i === stageIdx && phase === "running" ? "border-cyan/60 bg-cyan/10 text-cyan" : "border-border text-subtle")}>{s}</div>
            ))}
          </div>
          <Bar value={p} />
          <div className="grid grid-cols-2 gap-3 text-xs"><KV k="Snapshot" v="Simulated" /><KV k="Rollback engine" v="Simulated" /></div>
          {phase === "cancelled" && <div className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs text-warning">OPTIMIZATION CANCELLED — staged changes were reverted (simulated).</div>}
        </div>
      )}
      {phase === "done" && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {[["SIM. APPLIED", Math.round(count * 0.7)], ["SIM. VERIFIED", Math.round(count * 0.7)], ["SAMPLE OPTIMAL", Math.round(count * 0.2)], ["PROTECTED / N/A", count - Math.round(count * 0.7) - Math.round(count * 0.2)]].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-border bg-window p-2.5 text-center"><div className="text-xl font-bold">{v}</div><div className="text-[9px] font-bold tracking-widest text-muted-foreground">{k}</div></div>
            ))}
          </div>
          <KV k="Execution time" v="2.9 s (simulated)" /><KV k="System backup" v="Sample snapshot" /><KV k="Rollback status" v="Not established by prototype" />
          <div className="eo-label text-muted-foreground">View advanced details · 4 subsystems</div>
          <Chips options={["Kernel", "Network", "Interrupts", "Protected"]} value={tab} onChange={setTab} />
          <div className="rounded-lg border border-border bg-window p-3 text-xs text-muted-foreground">Sample {tab.toLowerCase()} results appear here in the native app. Raw keys stay behind this view.</div>
        </div>
      )}
    </Modal>
  );
}
