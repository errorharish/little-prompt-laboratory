import { useEffect, useRef, useId, useState, type ReactNode } from "react";
import type React from "react";
import { cn } from "@/lib/utils";
import type { Risk } from "@/lib/eo/data";
import { X, ChevronDown, FlaskConical, Search } from "lucide-react";
import { toast } from "sonner";

/* ── Card (FigmaCardStyle / GlassCard) ── */
export function Card({ className, children, glow, style }: { className?: string | undefined; children: ReactNode; glow?: boolean | undefined; style?: React.CSSProperties | undefined }) {
  const ref = useRef<HTMLDivElement>(null);
  return <div ref={ref} style={style} onPointerMove={(e) => {
    const node = ref.current;
    if (!node || e.pointerType !== "mouse" || node.querySelector("input, select") || document.documentElement.dataset.motion === "reduced" || document.documentElement.dataset.depth === "flat") return;
    const box = node.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width, y = (e.clientY - box.top) / box.height;
    node.style.setProperty("--tilt-x", `${(0.5 - y) * 1.8}deg`);
    node.style.setProperty("--tilt-y", `${(x - 0.5) * 1.8}deg`);
    node.style.setProperty("--light-x", `${x * 100}%`);
  }} onPointerLeave={() => { ref.current?.style.setProperty("--tilt-x", "0deg"); ref.current?.style.setProperty("--tilt-y", "0deg"); }} className={cn("eo-card eo-depth p-5", glow && "eo-glow", className)}>{children}</div>;
}

export function Label({ children, className }: { children: ReactNode; className?: string | undefined }) {
  return <div className={cn("eo-label text-muted-foreground", className)}>{children}</div>;
}

export function SectionTitle({ title, sub, right, badge }: { title: string; sub?: string | undefined; right?: ReactNode | undefined; badge?: ReactNode | undefined }) {
  return (
    <div className="eo-section-title mb-4 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="h-3.5 w-1 rounded-full bg-cyan" />
          <h3 className="eo-label text-[11.5px] text-foreground">{title}</h3>
          {badge}
        </div>
        {sub && <p className="mt-1 pl-3 text-xs text-muted-foreground">{sub}</p>}
      </div>
      {right && <div className="flex shrink-0 flex-wrap items-center gap-2">{right}</div>}
    </div>
  );
}

/* ── Badges (Theme/Badges.xaml) ── */
type Tone = "cyan" | "primary" | "success" | "warning" | "danger" | "muted";
const toneCls: Record<Tone, string> = {
  cyan: "border-cyan/30 bg-cyan/10 text-cyan",
  primary: "border-primary/40 bg-primary/15 text-primary-hover",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-destructive/30 bg-destructive/10 text-destructive",
  muted: "border-border bg-elevated text-muted-foreground",
};
export function Badge({ tone = "muted", children, className }: { tone?: Tone | undefined; children: ReactNode; className?: string | undefined }) {
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-[4px] border px-1.5 py-0.5 text-[9.5px] font-bold tracking-[0.1em] uppercase", toneCls[tone], className)}>
      {children}
    </span>
  );
}
export const riskTone = (r: Risk): Tone => (r === "SAFE" || r === "LOW" ? "success" : r === "MEDIUM" ? "warning" : r === "HIGH" ? "danger" : "cyan");
export function RiskBadge({ risk }: { risk: Risk }) {
  return <Badge tone={riskTone(risk)}>{risk === "LOW" ? "LOW RISK" : risk}</Badge>;
}
export function DemoBadge({ label = "DEMO" }: { label?: string | undefined }) {
  return <Badge tone="warning">{label}</Badge>;
}

/* ── Buttons (Theme/Buttons.xaml: Primary / Secondary / Ghost / Danger) ── */
type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
const btnCls: Record<BtnVariant, string> = {
  primary: "eo-brand text-primary-foreground border-transparent hover:brightness-110 shadow-[var(--shadow-glow)]",
  secondary: "bg-elevated text-foreground border-border-strong hover:border-cyan/50 hover:bg-highlight",
  ghost: "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-border-strong",
  danger: "bg-destructive/10 text-destructive border-destructive/40 hover:bg-destructive/20",
  success: "bg-success/10 text-success border-success/40 hover:bg-success/20",
};
export function Btn({ variant = "secondary", children, onClick, className, size = "md", title, disabled }: { variant?: BtnVariant | undefined; children: ReactNode; onClick?: () => void | undefined; className?: string | undefined; size?: "sm" | "md" | "lg" | undefined; title?: string | undefined; disabled?: boolean | undefined }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border font-bold tracking-[0.08em] uppercase transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none",
        size === "sm" ? "h-7 px-2.5 text-[10px]" : size === "lg" ? "h-11 px-5 text-xs" : "h-9 px-3.5 text-[10.5px]",
        btnCls[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ── Page header (every View starts with Grid cols=*,Auto: title block + actions) ── */
export function PageHeader({ title, sub, badges, actions, accent = "bg-cyan" }: { title: string; sub?: string | undefined; badges?: ReactNode | undefined; actions?: ReactNode | undefined; accent?: string | undefined }) {
  return (
    <div className="eo-page-header mb-5 flex flex-wrap items-start justify-between gap-4">
      <div className="flex gap-3">
        <span className={cn("mt-1 h-9 w-1 rounded-full", accent)} />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[22px] font-bold tracking-[0.04em] uppercase">{title}</h1>
            {badges}
          </div>
          {sub && <p className="mt-1 max-w-2xl text-[13px] text-muted-foreground">{sub}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ── Stat strip (UniformGrid / cols=*,10,* tile rows) ── */
export function StatTiles({ items, cols }: { items: { label: string; value: ReactNode; sub?: string | undefined; tone?: Tone | undefined }[]; cols?: number | undefined }) {
  const tc: Record<Tone, string> = { cyan: "text-cyan", primary: "text-primary-hover", success: "text-success", warning: "text-warning", danger: "text-destructive", muted: "text-foreground" };
  return (
    <div className="eo-stat-grid grid gap-2.5" style={{ gridTemplateColumns: `repeat(${cols ?? items.length}, minmax(0,1fr))` }}>
      {items.map((s) => (
        <div key={s.label} className="eo-card eo-stat p-3.5">
          <Label className="text-[9.5px]">{s.label}</Label>
          <div className={cn("mt-1.5 text-2xl font-bold tabular-nums", tc[s.tone ?? "muted"])}>{s.value}</div>
          {s.sub && <div className="mt-0.5 text-[11px] text-subtle">{s.sub}</div>}
        </div>
      ))}
    </div>
  );
}

/* ── Filter chips (rows of RadioButton/Button filters) ── */
export function Chips({ options, value, onChange, className }: { options: string[]; value: string; onChange: (v: string) => void; className?: string | undefined }) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === o}
          onClick={() => onChange(o)}
          className={cn(
            "h-7 rounded-md border px-2.5 text-[10px] font-bold tracking-[0.08em] uppercase transition-colors",
            value === o ? "border-cyan/50 bg-cyan/15 text-cyan" : "border-border bg-window text-muted-foreground hover:text-foreground",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function SearchBox({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="eo-search relative"><Search className="pointer-events-none absolute left-3 top-3 h-3.5 w-3.5 text-subtle" /><input
      aria-label={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-9 w-full rounded-lg border border-border bg-window pl-9 pr-3 text-sm text-foreground placeholder:text-subtle outline-none focus:border-cyan/60"
    /></div>
  );
}

export function Bar({ value, tone = "cyan", className }: { value: number; tone?: Tone | undefined; className?: string | undefined }) {
  const bg: Record<Tone, string> = { cyan: "bg-cyan", primary: "bg-primary", success: "bg-success", warning: "bg-warning", danger: "bg-destructive", muted: "bg-subtle" };
  return (
    <div role="progressbar" aria-label="Progress" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100} className={cn("h-1.5 w-full overflow-hidden rounded-full bg-window", className)}>
      <div className={cn("h-full rounded-full transition-all duration-500", bg[tone])} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

/* ── Toggle (PremiumToggle) & Check ── */
export function Toggle({ on, onChange, label = "Toggle setting" }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={cn("relative h-5 w-9 shrink-0 rounded-full border transition-colors", on ? "border-cyan/60 bg-cyan/30" : "border-border-strong bg-window")}>
      <span className={cn("absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all", on ? "left-[18px] bg-cyan" : "left-0.5 bg-subtle")} />
    </button>
  );
}
export function Check({ on, onChange, label = "Select item" }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" role="checkbox" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={cn("eo-check flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border text-[10px] font-black", on ? "border-cyan bg-cyan text-sidebar-primary-foreground" : "border-border-strong bg-window")}>
      {on ? "✓" : ""}
    </button>
  );
}

/* ── Key / value row ── */
export function KV({ k, v, mono }: { k: string | undefined; v: ReactNode; mono?: boolean | undefined }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 py-1.5 text-[12.5px] last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className={cn("text-right font-semibold", mono && "font-mono text-[11.5px]")}>{v}</span>
    </div>
  );
}

/* ── DETAILS expander: hides raw technical inventories (build report §1 rule) ── */
export function Details({ title = "ADVANCED DETAILS", children }: { title?: string | undefined; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="eo-card overflow-hidden">
      <button aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-5 py-3.5">
        <span className="eo-label text-muted-foreground">{title}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="border-t border-border px-5 py-4 eo-enter">{children}</div>}
    </div>
  );
}

/* ── Modal overlay (WPF Popup/Grid overlays) ── */
export function Modal({ open, onClose, title, sub, children, footer, width = "max-w-2xl" }: { open: boolean; onClose: () => void; title: string; sub?: string | undefined; children: ReactNode; footer?: ReactNode | undefined; width?: string | undefined }) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const titleId = useId();
  const [visible, setVisible] = useState(open);
  useEffect(() => {
    if (open) { setVisible(true); return; }
    const timer = setTimeout(() => setVisible(false), 150);
    return () => clearTimeout(timer);
  }, [open]);
  useEffect(() => {
    if (!open || !visible) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const elements = () => Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input, select, a[href], [tabindex="0"]') ?? []);
    elements()[0]?.focus();
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); closeRef.current(); }
      if (e.key !== "Tab") return;
      const targets = elements(), first = targets[0], last = targets.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    window.addEventListener("keydown", h);
    return () => { window.removeEventListener("keydown", h); previous?.focus(); };
  }, [open, visible]);
  if (!visible) return null;
  return (
    <div className={cn("eo-overlay fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-6 backdrop-blur-sm", !open && "eo-dismiss")} onClick={onClose}>
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby={titleId} className={cn("eo-card eo-modal flex max-h-[86vh] w-full flex-col p-0", width)} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div><h2 id={titleId} className="text-base font-bold uppercase">{title}</h2>{sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}</div>
          <Btn onClick={onClose} size="sm" variant="ghost" title="Close dialog"><X className="h-4 w-4" /></Btn>
        </div>
        <div className="min-h-0 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-6 py-3.5">{footer}</div>}
      </div>
    </div>
  );
}

/* ── Simulation helpers ── */
export function SimNotice({ children }: { children?: ReactNode | undefined }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-[11.5px] text-warning">
      <FlaskConical className="h-3.5 w-3.5 shrink-0" />
      <span>{children ?? "PROTOTYPE NOTICE: Demonstration data only. No Windows registry, service, file or driver is read or changed."}</span>
    </div>
  );
}

export function simulate(label: string | undefined) {
  toast(`${label} — simulated`, { description: "Prototype only. No real system changes were made." });
}

export function useSimRun(durationMs = 2200) {
  const [progress, setProgress] = useState<number | null>(null);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const delay = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancel = () => {
    if (interval.current) clearInterval(interval.current);
    if (delay.current) clearTimeout(delay.current);
    interval.current = null; delay.current = null; setProgress(null);
  };
  useEffect(() => () => { if (interval.current) clearInterval(interval.current); if (delay.current) clearTimeout(delay.current); }, []);
  const start = (onDone?: () => void) => {
    if (interval.current || delay.current) return;
    setProgress(0);
    const t0 = Date.now();
    interval.current = setInterval(() => {
      const p = Math.min(100, ((Date.now() - t0) / durationMs) * 100);
      setProgress(p);
      if (p >= 100) {
        if (interval.current) clearInterval(interval.current);
        interval.current = null;
        delay.current = setTimeout(() => { delay.current = null; setProgress(null); onDone?.(); }, 200);
      }
    }, 80);
  };
  return { progress, running: progress !== null, start, cancel };
}

export function EmptyState({ title, sub, action }: { title: string; sub: string; action?: ReactNode | undefined }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong px-6 py-10 text-center">
      <div className="eo-label text-foreground">{title}</div>
      <p className="mt-1 max-w-md text-xs text-muted-foreground">{sub}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* Grid with explicit fractional columns, mirroring WPF ColumnDefinitions */
export function Cols({ cols, gap = 12, children, className }: { cols: string; gap?: number | undefined; children: ReactNode; className?: string | undefined }) {
  return (
    <div className={cn("grid", className)} style={{ gridTemplateColumns: cols, gap }}>
      {children}
    </div>
  );
}
