// OneClickOptimizationView.xaml — dedicated full-page workflow (not a modal).
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, ChevronDown } from "lucide-react";
import { Badge, Btn, Card, Check, KV, Label, Modal, RiskBadge, SectionTitle, SimNotice, SearchBox, EmptyState, Bar, useSimRun } from "../kit";
import { RunModal } from "../RunModal";
import { ONE_CLICK_ACTIONS, ONE_CLICK_GROUPS } from "@/lib/eo/data";
import { filterRecommendations } from "@/lib/eo/recommendations";
import { cn } from "@/lib/utils";

const FILTERS = {
  STATUS: ["All Optimizations", "Recommended Only", "Optional", "Already Optimized", "Protected Items"],
  CATEGORY: ["System Performance", "Background Workload", "Memory", "Power / Performance"],
  "ACTION REQUIREMENTS": ["Can Optimize Now", "Background-Safe", "Requires Restart"],
};
const GUIDE = [
  ["CHECK", "ERROR OPTIMIZER scans your PC and finds relevant optimization opportunities."],
  ["REVIEW", "You can see what can be improved, why it was selected, and which apps are protected."],
  ["CHOOSE", "Keep the recommended changes or customize the selection for your specific needs."],
  ["OPTIMIZE", "ERROR OPTIMIZER applies only the selected safe changes. System files, drivers and active apps are protected."],
  ["VERIFY", "Every applied change is checked. If a change cannot be safely verified it is rolled back."],
];

export function OneClickPage() {
  const scan = useSimRun(1400);
  const [query, setQuery] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [area, setArea] = useState<string | null>(null);
  const [sel, setSel] = useState<Set<string>>(new Set(ONE_CLICK_ACTIONS.map((a) => a.id)));
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState("All Optimizations");
  const [guide, setGuide] = useState(false);
  const [review, setReview] = useState(false);
  const [detail, setDetail] = useState<string | null>(null);
  const [run, setRun] = useState(false);
  const [protOpen, setProtOpen] = useState(false);

  const visible = useMemo(() => filterRecommendations(area, filter, query), [area, filter, query]);
  const toggle = (id: string) => setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const d = ONE_CLICK_ACTIONS.find((a) => a.id === detail);

  return (
    <div className="space-y-4 pb-20">
      {/* Header: cols=*,16,Auto */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/" className="mb-3 inline-flex items-center gap-1.5 text-[10.5px] font-bold tracking-widest text-muted-foreground hover:text-cyan" title="Return to main Dashboard"><ArrowLeft className="h-3.5 w-3.5" /> BACK TO DASHBOARD</Link>
          <Label className="text-cyan">DEDICATED 1-CLICK WORKFLOW</Label>
          <h1 className="mt-1 text-[26px] font-black tracking-[0.04em]">1-CLICK OPTIMIZATION</h1>
          <p className="mt-1 max-w-2xl text-[13px] text-muted-foreground">Analyze sample recommendations, review your choices, and confirm a simulated optimization. No Windows settings are changed.</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={() => setGuide(true)} title="How 1-Click Optimization works">Guide</Btn>
          <Btn disabled={scan.running} onClick={() => { setArea(null); scan.start(() => setAnalyzed(true)); }} title="Analyze sample recommendations">{scan.running ? "Analyzing…" : analyzed ? "Rescan" : "Analyze"}</Btn>
          <Btn variant="primary" size="lg" disabled={scan.running || !sel.size} onClick={() => setReview(true)}>Review selection</Btn>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">{["Analyze", "Review", "Confirm", "Simulated result"].map((step, i) => <Badge key={step} tone={i === (analyzed ? 1 : 0) ? "cyan" : "muted"}>{i + 1} · {step}</Badge>)}</div>
      {scan.running && <Bar value={scan.progress ?? 0} />}
      {/* Status strip: cols=Auto,12,*,Auto */}
      <Card className="flex items-center gap-4 py-3.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-success/15 text-success"><ShieldCheck className="h-5 w-5" /></span>
        <div className="flex-1"><div className="text-sm font-bold">DEMO RECOMMENDATIONS</div><div className="text-[11.5px] text-muted-foreground">{ONE_CLICK_ACTIONS.length} recommended improvements across {ONE_CLICK_GROUPS.length} areas (sample)</div></div>
        <Badge tone="success">SIMULATED ANALYSIS</Badge>
      </Card>

      {/* Optimization areas */}
      <Card>
        <div className="mb-3 flex items-start justify-between gap-4">
          <div><Label className="text-foreground">OPTIMIZATION AREAS</Label><p className="mt-1 text-xs text-muted-foreground">Review the sample recommendations by area.</p></div>
          <Btn size="sm" variant="ghost" onClick={() => setArea(null)} title="Show all 1-Click optimization checks across all workloads">Show all checks</Btn>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {ONE_CLICK_GROUPS.map((g) => {
            const n = ONE_CLICK_ACTIONS.filter((a) => a.group === g.key).length;
            return (
              <button key={g.key} onClick={() => setArea(area === g.key ? null : g.key)} className={cn("rounded-xl border p-4 text-left transition-all", area === g.key ? "border-cyan/60 bg-cyan/10 eo-glow" : "border-border bg-window hover:border-border-strong")}>
                <div className="eo-label text-foreground">{g.key}</div>
                <p className="mt-1 text-[11.5px] text-muted-foreground">{g.desc}</p>
                <div className="mt-3 flex items-center justify-between"><Badge tone="cyan">{n} RECOMMENDED</Badge></div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Recommended list */}
      <Card>
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div><Label className="text-foreground">RECOMMENDED OPTIMIZATIONS</Label><p className="mt-1 text-xs text-muted-foreground">Choose the sample changes to include; risk and restart requirements stay visible.</p></div>
          <div className="relative flex gap-2">
            {filter !== "All Optimizations" && <Btn size="sm" variant="ghost" onClick={() => setFilter("All Optimizations")}>✕ {filter}</Btn>}
            <Btn size="sm" onClick={() => setFilterOpen(!filterOpen)}>Filter ▾</Btn>
            <Btn size="sm" onClick={() => setSel(new Set(ONE_CLICK_ACTIONS.map((a) => a.id)))}>Select recommended</Btn>
            <Btn size="sm" variant="ghost" onClick={() => setSel(new Set())}>Clear</Btn>
            {filterOpen && (
              <div className="eo-card eo-enter absolute top-9 right-0 z-20 w-64 space-y-3 p-3">
                {Object.entries(FILTERS).map(([h, opts]) => (
                  <div key={h}><Label className="mb-1 text-[9px]">{h}</Label>{opts.map((o) => (
                    <button key={o} onClick={() => { setFilter(o); setFilterOpen(false); }} className={cn("block w-full rounded px-2 py-1 text-left text-xs", filter === o ? "bg-cyan/15 text-cyan" : "text-muted-foreground hover:bg-elevated hover:text-foreground")}>{o}</button>
                  ))}</div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mb-4"><SearchBox placeholder="Search recommendations…" value={query} onChange={setQuery} /></div>
        <div className="space-y-4">
          {!visible.length && <EmptyState title="No matching recommendations" sub="No sample recommendations are available for this filter." action={<Btn onClick={() => { setFilter("All Optimizations"); setQuery(""); setArea(null); }}>Reset filters</Btn>} />}
          {ONE_CLICK_GROUPS.filter((g) => visible.some((a) => a.group === g.key)).map((g) => (
            <div key={g.key}>
              <div className="mb-2 eo-label text-[10px] text-cyan">{g.key}</div>
              <div className="space-y-2">
                {visible.filter((a) => a.group === g.key).map((a) => (
                  <div key={a.id} className={cn("flex items-center gap-4 rounded-xl border p-3.5 transition-colors", sel.has(a.id) ? "border-cyan/40 bg-cyan/5" : "border-border bg-window")}>
                    <Check label={`Select ${a.title}`} on={sel.has(a.id)} onChange={() => toggle(a.id)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[13px] font-bold">{a.title}<RiskBadge risk={a.risk} />{a.restart && <Badge tone="warning">RESTART</Badge>}</div>
                      <p className="text-[12px] text-muted-foreground">{a.desc}</p>
                      <p className="mt-0.5 text-[10.5px] text-success">{a.safety}</p>
                    </div>
                    <Btn size="sm" variant="ghost" onClick={() => setDetail(a.id)}>Details</Btn>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Protection banner (expandable) */}
      <Card className="border-success/30">
        <button onClick={() => setProtOpen(!protOpen)} className="flex w-full items-center gap-3 text-left">
          <ShieldCheck className="h-5 w-5 text-success" />
          <div className="flex-1"><div className="eo-label text-success">YOUR APPS & SYSTEM ARE PROTECTED</div><div className="text-xs text-muted-foreground">Critical Windows components, active applications, drivers, and games are never treated as optimization targets.</div></div>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", protOpen && "rotate-180")} />
        </button>
        {protOpen && <ul className="mt-3 grid grid-cols-2 gap-1.5 pl-8 text-xs text-muted-foreground eo-enter">{["Windows core binaries", "Display & audio drivers", "Active foreground application", "Anti-cheat & game launchers", "Security software", "User files & logins"].map((x) => <li key={x}>✓ {x}</li>)}</ul>}
      </Card>
      <SimNotice />

      {/* Sticky action bar: cols=*,Auto */}
      <div className="sticky bottom-0 -mx-6 flex items-center justify-between border-t border-border bg-window/95 px-6 py-3 backdrop-blur">
        <span className="text-xs text-muted-foreground"><b className="text-foreground">{sel.size}</b> selected · Review risks and restart requirements before confirming the simulated run.</span>
        <div className="flex gap-2"><Btn variant="ghost" onClick={() => setSel(new Set())}>Clear</Btn><Btn onClick={() => setReview(true)}>Review</Btn><Btn variant="primary" disabled={!sel.size || scan.running} onClick={() => setReview(true)}>Optimize selected</Btn></div>
      </div>

      <Modal open={guide} onClose={() => setGuide(false)} title="How 1-Click Optimization works" sub="Optimize your PC safely in a few simple steps." footer={<Btn variant="primary" onClick={() => setGuide(false)}>Got it</Btn>}>
        <div className="space-y-3">{GUIDE.map(([t, d], i) => (
          <div key={t} className="grid gap-3" style={{ gridTemplateColumns: "32px 1fr" }}><span className="eo-brand flex h-8 w-8 items-center justify-center rounded-full text-sm font-black">{i + 1}</span><div><div className="eo-label text-foreground">{t}</div><p className="text-xs text-muted-foreground">{d}</p></div></div>
        ))}<p className="pt-2 text-[11px] text-success">Protected apps, drivers and critical Windows components are never treated as targets.</p></div>
      </Modal>

      <Modal open={review} onClose={() => setReview(false)} title="Review your changes" sub="Simulated run · No Windows settings will be changed." footer={<><Btn variant="ghost" onClick={() => setReview(false)}>Back to edit</Btn><Btn variant="primary" disabled={!sel.size} onClick={() => { setReview(false); setRun(true); }}>Optimize selected</Btn></>}>
        <div className="space-y-2">{ONE_CLICK_ACTIONS.filter((a) => sel.has(a.id)).map((a) => <div key={a.id} className="flex items-center justify-between rounded-lg border border-border bg-window px-3 py-2 text-sm"><span>{a.title}</span><RiskBadge risk={a.risk} /></div>)}
          <p className="pt-2 text-[11px] text-muted-foreground">This demonstration does not establish real verification or rollback availability.</p></div>
      </Modal>

      <Modal open={!!d} onClose={() => setDetail(null)} title={d?.title ?? ""} sub="Sample recommendation metadata — no machine state is detected." footer={<Btn onClick={() => setDetail(null)}>Close</Btn>}>
        {d && <div className="space-y-4">
          <div><Label className="mb-1 text-cyan">ANALYSIS & TARGET STATE</Label><KV k="Why recommended:" v={d.why} /><KV k="Current detected state:" v="Not detected in prototype" /><KV k="Target configuration:" v="Optimized (see native app)" /></div>
          <div><Label className="mb-1 text-cyan">SAFETY, VERIFICATION & RESTORE</Label><KV k="Safety & Risk:" v={<RiskBadge risk={d.risk} />} /><KV k="Restart requirement:" v={d.restart ? "Required" : "Not required"} /><KV k="Verification method:" v="Readback" /><KV k="Rollback capability:" v="Determined per operation in native app" /></div>
        </div>}
      </Modal>

      <RunModal open={run} onClose={() => setRun(false)} profile="1-Click" count={sel.size} />
    </div>
  );
}
