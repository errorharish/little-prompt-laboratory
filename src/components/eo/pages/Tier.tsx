// TierView.xaml — one shared layout for Normal / Pro / Ultimate / Debloat / BIOS Safe / Max Performance.
// Debloat adds DEBLOAT TOOLBOX + blocklist editor; BIOS Safe adds MANUAL UEFI / FIRMWARE section.
import { useState } from "react";
import { Badge, Btn, Card, Check, Chips, Label, Modal, RiskBadge, SectionTitle, SimNotice, simulate, SearchBox, EmptyState, Details, KV } from "../kit";
import { RunModal } from "../RunModal";
import { CATALOG, HW, TIERS, type Risk } from "@/lib/eo/data";
import { cn } from "@/lib/utils";

const TIER_CATS: Record<string, string[]> = {
  normal: ["TELEMETRY", "PRIVACY", "POWER", "INPUT", "NTFS"],
  pro: ["CPU", "MEMORY", "NETWORK", "GAMING", "TELEMETRY"],
  ultimate: ["CPU", "MEMORY", "GPU", "GAMING", "NETWORK", "NTFS"],
  debloat: ["PRIVACY", "TELEMETRY"],
  "bios-safe": ["SYSTEM"],
  "max-performance": ["CPU", "GPU", "POWER", "MEMORY", "GAMING"],
};
const DEBLOAT_TOOLS: Record<string, { name: string; desc: string; risk: Risk }[]> = {
  BLOATWARE: [{ name: "Consumer Appx packages", desc: "Remove pre-installed consumer apps (news, weather, games).", risk: "LOW" }, { name: "Custom bloatware removal", desc: "Process packages from your customized blocklist.", risk: "MEDIUM" }],
  FEATURES: [{ name: "Optional Windows features", desc: "Disable unused legacy optional features.", risk: "MEDIUM" }],
  PRIVACY: [{ name: "Advertising ID & tailored experiences", desc: "Stop personalized ads and suggestions.", risk: "SAFE" }, { name: "Activity history", desc: "Disable timeline activity collection.", risk: "SAFE" }],
  REGISTRY: [{ name: "Telemetry policy keys", desc: "Apply telemetry policy level for this edition.", risk: "LOW" }],
  "WINDOWS UI": [{ name: "Widgets & taskbar feed", desc: "Hide the Windows 11 widgets feed.", risk: "SAFE" }, { name: "Start menu suggestions", desc: "Remove promoted Start menu entries.", risk: "SAFE" }],
  ADVANCED: [{ name: "Edge background tasks", desc: "Disable Edge startup boost & background mode.", risk: "MEDIUM" }],
};
const UEFI = [
  ["Enable Resizable BAR / Smart Access Memory", "Firmware setting · verify GPU and board support first"],
  ["Enable XMP / EXPO memory profile", "Firmware setting · runs RAM at rated speed"],
  ["Disable unused onboard controllers", "Firmware setting · optional"],
];
const BLOCKLIST = ["Microsoft.BingNews", "Microsoft.BingWeather", "Microsoft.GetHelp", "Microsoft.Getstarted", "Microsoft.MicrosoftSolitaireCollection", "Microsoft.People", "Microsoft.WindowsFeedbackHub", "Microsoft.ZuneMusic", "Microsoft.ZuneVideo", "Clipchamp.Clipchamp"];

export function TierPage({ slug }: { slug: string }) {
  const t = TIERS[slug];
  if (!t) return null;
  const items = CATALOG.filter((c) => (TIER_CATS[slug] ?? []).includes(c.cat)).map((c, i) => ({ ...c, scope: c.cat === "SYSTEM" ? "UEFI" : "WINDOWS", done: i % 4 === 3 }));
  const [sel, setSel] = useState<Set<string>>(new Set(items.filter((i) => !i.done && i.risk !== "MEDIUM").map((i) => i.id)));
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<(typeof items)[number] | null>(null);
  const [logsCleared, setLogsCleared] = useState(false);
  const [scope, setScope] = useState("ALL");
  const [toolCat, setToolCat] = useState("BLOATWARE");
  const [block, setBlock] = useState(false);
  const [blockSel, setBlockSel] = useState<Set<string>>(new Set(BLOCKLIST.slice(0, 7)));
  const [run, setRun] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const accent = ({ "tier-normal": "bg-tier-normal", "tier-pro": "bg-tier-pro", "tier-ultimate": "bg-tier-ultimate", "tier-debloat": "bg-tier-debloat", "tier-bios": "bg-tier-bios", primary: "bg-primary" })[t.color];
  const counts = { safe: items.filter((i) => i.risk === "SAFE" || i.risk === "LOW").length, med: items.filter((i) => i.risk === "MEDIUM").length, high: items.filter((i) => i.risk === "HIGH").length };
  const pending = items.filter((i) => !i.done);
  const vis = items.filter((i) => (scope === "ALL" || i.scope === scope) && i.name.toLowerCase().includes(query.toLowerCase()));
  const tog = (id: string) => setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="space-y-4 pb-16">
      {/* Header cols=Auto,*,Auto */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-3"><span className={cn("mt-1 h-10 w-1 rounded-full", accent)} /><div>
          <div className="flex items-center gap-2"><h1 className="text-[22px] font-bold tracking-[0.04em] uppercase">{t.name}</h1><Badge tone="cyan">TIER PROFILE</Badge>{t.extendsFrom && <Badge>EXTENDS {t.extendsFrom.toUpperCase()}</Badge>}</div>
          <p className="mt-1 max-w-3xl text-[13px] text-muted-foreground">{t.desc}</p></div></div>
        <div className="flex gap-2"><Btn variant="ghost" onClick={() => simulate("Refresh")}>Refresh</Btn><Btn onClick={() => simulate("Scan system")}>Scan system</Btn><Btn variant="ghost" onClick={() => simulate("Restore backup")}>Restore backup</Btn></div>
      </div>

      {/* Hero cols=1.1*,10,1.35*,10,0.95* */}
      <div className="eo-profile-overview grid gap-2.5" style={{ gridTemplateColumns: "1.1fr 1.35fr 0.95fr" }}>
        <Card><Label className="mb-3 text-foreground">SYSTEM SPECIFICATION <Badge tone="warning">DEMO DATA</Badge></Label>
          <div className="grid grid-cols-2 gap-3 text-[12.5px]">{[["PROCESSOR", HW.cpu], ["GRAPHICS", HW.gpu], ["MEMORY", HW.ram], ["OPERATING SYSTEM", HW.os]].map(([k, v]) => <div key={k}><Label className="text-[9px]">{k}</Label><div className="mt-0.5 font-semibold">{v}</div></div>)}</div></Card>
        <Card><Label className="mb-3 text-foreground">OPTIMIZATION STATUS</Label>
          <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr 1.1fr 1fr 1fr" }}>{[["TOTAL", t.entries, ""], ["APPLICABLE", items.length, "text-cyan"], ["HIGHLY REC.", counts.safe, "text-primary-hover"], ["OPTIMIZED", items.length - pending.length, "text-success"], ["PENDING", pending.length, "text-warning"]].map(([k, v, c]) => <div key={k as string} className="rounded-lg border border-border bg-window p-2.5 text-center"><div className={cn("text-xl font-bold", c as string)}>{v}</div><div className="text-[8.5px] font-bold tracking-widest text-subtle">{k}</div></div>)}</div>
          <p className="mt-2 text-[10.5px] text-subtle">TOTAL = raw profile entries (manifest). Inherited entries are not deduplicated.</p></Card>
        <Card><Label className="mb-3 text-foreground">RISK & SAFETY</Label>
          <div className="grid grid-cols-3 gap-2">{[["SAFE", counts.safe, "text-success"], ["MEDIUM", counts.med, "text-warning"], ["HIGH", counts.high, "text-destructive"]].map(([k, v, c]) => <div key={k as string} className="rounded-lg border border-border bg-window p-2.5 text-center"><div className={cn("text-xl font-bold", c as string)}>{v}</div><div className="text-[9px] font-bold tracking-widest text-subtle">{k}</div></div>)}</div></Card>
      </div>

      <Card><SectionTitle title="TOP RECOMMENDATIONS" />
        {pending.length === 0 ? <div className="text-sm text-success">SYSTEM IS CURRENTLY FULLY OPTIMIZED FOR THIS PROFILE</div> :
          <div className="grid grid-cols-3 gap-2.5">{pending.slice(0, 3).map((i) => <div key={i.id} className="rounded-xl border border-border bg-window p-3.5"><div className="flex items-center justify-between"><Badge tone="cyan">{i.cat}</Badge><RiskBadge risk={i.risk} /></div><div className="mt-2 text-[13px] font-semibold">{i.name}</div></div>)}</div>}
      </Card>

      {t.toolbox === "debloat" && (
        <Card><SectionTitle title="DEBLOAT TOOLBOX" right={<Btn size="sm" onClick={() => setBlock(true)}>Customize blocklist</Btn>} />
          <Chips options={Object.keys(DEBLOAT_TOOLS)} value={toolCat} onChange={setToolCat} />
          <div className="mt-3 grid grid-cols-2 gap-2.5">{(DEBLOAT_TOOLS[toolCat] ?? []).map((d) => <div key={d.name} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-window p-3.5"><div><div className="text-[13px] font-semibold">{d.name}</div><p className="text-[11.5px] text-muted-foreground">{d.desc}</p></div><div className="flex flex-col items-end gap-2"><RiskBadge risk={d.risk} /><Btn size="sm" onClick={() => simulate(d.name)}>Run</Btn></div></div>)}</div>
        </Card>
      )}

      <Card><SectionTitle title="WHAT WILL CHANGE (OPTIMIZATION PREVIEW)" right={<Btn size="sm" variant="ghost" onClick={() => simulate("Save custom profile")}>Save custom profile</Btn>} />
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <Chips options={["ALL", "WINDOWS", "UEFI"]} value={scope} onChange={setScope} />
          <div className="flex gap-1.5"><Btn size="sm" onClick={() => setSel(new Set(vis.map((i) => i.id)))}>Select all</Btn><Btn size="sm" onClick={() => setSel(new Set(vis.filter((i) => i.risk !== "MEDIUM" && i.risk !== "HIGH").map((i) => i.id)))}>Safe only</Btn><Btn size="sm" variant="ghost" onClick={() => setSel(new Set())}>Deselect</Btn></div>
        </div>
        <div className="mb-3"><SearchBox placeholder="Search profile recommendations…" value={query} onChange={setQuery} /></div>
        <div className="grid grid-cols-2 gap-2">{vis.map((i) => (
          <div key={i.id} className={cn("flex items-center gap-3 rounded-xl border p-3", sel.has(i.id) ? "border-cyan/40 bg-cyan/5" : "border-border bg-window")}>
            <Check label={`Select ${i.name}`} on={sel.has(i.id)} onChange={() => tog(i.id)} />
            <div className="min-w-0 flex-1"><div className="text-[12.5px] font-semibold">{i.name}</div><div className="mt-1 flex gap-1.5"><Badge>{i.cat}</Badge>{i.done ? <Badge tone="success">OPTIMIZED</Badge> : <Badge tone="warning">PENDING</Badge>}</div></div>
            <div className="flex flex-col items-end gap-2"><RiskBadge risk={i.risk} /><Btn size="sm" variant="ghost" onClick={() => setDetail(i)}>Details</Btn></div>
          </div>))}
          {vis.length === 0 && <p className="text-xs text-muted-foreground">No items in this scope.</p>}
        </div>
      </Card>

      {t.toolbox === "bios" && (
        <Card><SectionTitle title="MANUAL UEFI / FIRMWARE OPTIMIZATIONS" sub="These must be changed by you in firmware setup. Error Optimizer only guides and verifies." right={<Btn size="sm" variant="danger" onClick={() => simulate("Reboot to UEFI firmware")}>Reboot to UEFI firmware</Btn>} />
          <div className="space-y-2">{UEFI.map(([n, d]) => <div key={n} className="rounded-lg border border-border bg-window p-3"><div className="text-[13px] font-semibold">{n}</div><div className="text-[11.5px] text-muted-foreground">{d}</div></div>)}</div>
        </Card>
      )}

      <Card className="py-3"><div className="flex w-full items-center justify-between"><Label>ADVANCED LOGS & DIAGNOSTICS</Label><span className="flex gap-1.5"><Btn size="sm" variant="ghost" onClick={() => simulate("Copy logs")}>Copy logs</Btn><Btn size="sm" variant="ghost" onClick={() => setLogsCleared(true)}>Clear</Btn><Btn size="sm" variant="ghost" onClick={() => setLogsOpen(!logsOpen)}>Expand / Collapse</Btn></span></div>
        {logsOpen && !logsCleared && <pre className="mt-3 rounded-lg bg-background p-3 font-mono text-[11px] text-muted-foreground">[sim] {t.id} profile loaded · {t.entries} entries{"\n"}[sim] applicability evaluated at runtime in native app</pre>}
      </Card>
      <SimNotice />

      <div className="sticky bottom-0 -mx-6 flex items-center justify-between border-t border-border bg-window/95 px-6 py-3 backdrop-blur">
        <span className="text-xs text-muted-foreground">Simulated profile run · Recovery support varies by operation. <b className="text-foreground">{sel.size}</b> selected</span>
        <Btn variant="primary" disabled={!sel.size} onClick={() => setRun(true)}>Apply {t.name}</Btn>
      </div>

      <Modal open={block} onClose={() => setBlock(false)} title="Customize bloatware blocklist" footer={<><Btn variant="ghost" onClick={() => setBlock(false)}>Cancel</Btn><Btn variant="primary" onClick={() => { setBlock(false); simulate("Save blocklist"); }}>Save blocklist</Btn></>}>
        <div className="mb-3 flex justify-end"><Btn size="sm" variant="ghost" onClick={() => setBlockSel(new Set(BLOCKLIST.slice(0, 7)))}>Reset defaults</Btn></div>
        <div className="space-y-1.5">{BLOCKLIST.map((b) => <div key={b} className="flex items-center gap-3 rounded-md border border-border bg-window px-3 py-2 font-mono text-xs"><Check on={blockSel.has(b)} onChange={() => setBlockSel((s) => { const n = new Set(s); n.has(b) ? n.delete(b) : n.add(b); return n; })} />{b}</div>)}</div>
        <p className="mt-3 text-[11px] text-muted-foreground">Selected packages will be processed during Custom Bloatware Removal.</p>
      </Modal>
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.name ?? ""} sub="Sample catalog entry · No machine state has been detected." footer={<Btn onClick={() => setDetail(null)}>Close</Btn>}>
        {detail && <div className="space-y-3"><KV k="Category" v={detail.cat} /><KV k="Risk classification" v={<RiskBadge risk={detail.risk} />} /><KV k="Sample state" v={detail.done ? "Already optimized (demo)" : "Pending (demo)"} /><KV k="Applicability" v="Evaluated by native engine; not detected here" /><KV k="Restart requirement" v="Per-operation metadata required" /><Details><KV k="Original operation identifier" v={detail.id} mono /><p className="mt-3 text-xs text-muted-foreground">Purpose, target values and readback rules must come from the original catalog; this sample does not infer them.</p></Details></div>}
      </Modal>
      <RunModal open={run} onClose={() => setRun(false)} profile={t.name} count={sel.size} />
    </div>
  );
}
