import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Btn } from "./kit";
import { PAGES, V4_TABS, hrefFor, pageBySlug } from "@/lib/eo/registry";

function Icon({ name, className }: { name: string; className?: string }) {
  const C = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Circle;
  return <C aria-hidden="true" className={className} />;
}

const DOCK_LABEL: Record<string, string> = {
  Dashboard: "HOME", InputOptimizer: "INPUT", SystemInfo: "SYSTEM", RegistryTweak: "REGISTRY", RegistryValues: "VALUES",
  StartupManager: "STARTUP", Network: "NETWORK", Storage: "STORAGE", Tools: "TOOLS", Normal: "NORMAL", Pro: "PRO",
  Ultimate: "ULTIMATE", Debloat: "DEBLOAT", BiosSafe: "BIOS", MaxPerformance: "MAX PERF", AiOptimization: "AI",
  BackupRestore: "BACKUP", Settings: "SETTINGS", About: "ABOUT",
};

export function Shell({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const navigate = useNavigate();
  const slug = loc.pathname.replace(/^\//, "");
  const page = pageBySlug(slug);
  const isBlueprint = slug === "blueprint";
  const isV4 = page?.suite === "V4";
  const dock = PAGES.filter((p) => p.inDock);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <a href="#main-content" className="eo-skip">Skip to page content</a>
      {/* ── Title bar (56px) ── */}
      <header className="eo-shell-header flex h-14 shrink-0 items-center justify-between border-b border-border bg-window/80 px-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="eo-brand flex h-8 w-8 items-center justify-center rounded-lg eo-glow">
            <Icons.Zap className="h-4 w-4 fill-current text-primary-foreground" />
          </div>
          <span className="eo-shell-brand text-[15px] font-black">ERROR OPTIMIZER</span>
          <div role="group" aria-label="Suite" className="flex rounded-md border border-border bg-background p-0.5">
            {(["V3", "V4"] as const).map((v) => (
              <Btn
                key={v}
                size="sm" variant="ghost"
                pressed={(v === "V4") === !!isV4}
                title={v === "V3" ? "Switch to Error Optimizer V3 Classic Suite" : "Switch to Error Optimizer V4 Professional Suite"}
                onClick={() => navigate({ to: v === "V3" ? "/" : "/$page", params: v === "V4" ? { page: "v4-max-performance" } : undefined } as never)}
                className={cn("h-6 rounded px-3 text-[10.5px] font-black tracking-widest transition-colors", (v === "V4") === !!isV4 ? "eo-brand text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                {v}
              </Btn>
            ))}
          </div>
          <span className="hidden text-[10px] font-semibold text-subtle xl:inline">PERFORMANCE ENGINEERING SUITE</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/blueprint" title="Design and WPF handoff documentation" aria-current={isBlueprint ? "page" : undefined} className={cn("rounded-md border px-2.5 py-1 text-[10px] font-bold tracking-widest", isBlueprint ? "border-cyan/60 bg-cyan/15 text-cyan" : "border-border text-muted-foreground hover:text-foreground")}>
            BLUEPRINT
          </Link>
          <span className="rounded-md border border-warning/40 bg-warning/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-warning">DEMO DATA</span>
          <span className="eo-service-label flex items-center gap-1.5 rounded-md border border-success/30 bg-success/10 px-2.5 py-1 text-[10px] font-bold text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> SIMULATED SERVICES
          </span>
        </div>
      </header>

      {/* ── V4 top navigation (MainWindow.xaml: exactly 2 tabs) ── */}
      {isV4 && (
        <div className="eo-shell-tabs flex h-12 shrink-0 items-center justify-between border-b border-border bg-window/60 px-4">
          <nav aria-label="V4 sections" className="flex gap-1">
            {V4_TABS.map((s) => {
              const p = pageBySlug(s);
              if (!p) return null;
              const active = slug === s || (s === "emulator-optimization" && ["emulator-modules", "emulator-deployer", "low-end-steam"].includes(slug)) || (s === "v4-max-performance" && ["v4-dashboard", "v4-core-optimizer"].includes(slug));
              return (
                <Link key={s} to="/$page" params={{ page: s }} title={p.tooltip} aria-current={active ? "page" : undefined} className={cn("flex h-9 items-center gap-2 rounded-lg px-4 text-[11px] font-bold tracking-[0.12em] transition-colors", active ? "bg-primary/15 text-cyan shadow-[inset_0_-2px_0_var(--cyan)]" : "text-muted-foreground hover:text-foreground")}>
                  <Icon name={p.icon} className="h-4 w-4" />
                  {s === "v4-max-performance" ? "MAXIMUM PERFORMANCE" : "EMULATOR OPTIMIZATION"}
                </Link>
              );
            })}
          </nav>
          <span className="rounded border border-cyan/30 bg-cyan/10 px-2 py-1 text-[9.5px] font-bold tracking-widest text-cyan">INDEPENDENT FROM V3 1-CLICK</span>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        {/* ── Glass sidebar dock (84px, V3 only) ── */}
        {!isV4 && (
          <nav aria-label="V3 pages" className="eo-dock flex w-[84px] shrink-0 flex-col items-center gap-0.5 overflow-y-auto border-r border-border bg-sidebar/70 py-2">
            {dock.map((p, i) => {
              const active = slug === p.slug;
              const sep = i > 0 && dock[i - 1]?.dockGroup !== p.dockGroup;
              return (
                <Fragment key={p.routeKey}>
                  {sep && <div className="my-1.5 h-px w-10 bg-border" />}
                  <Link
                    to={hrefFor(p.slug) as never}
                    title={p.tooltip}
                     aria-label={p.title}
                     aria-current={active ? "page" : undefined}
                    className={cn(
                      "eo-nav-item relative flex w-[68px] flex-col items-center gap-1 rounded-lg py-2 transition-colors",
                      active ? "bg-primary/15 text-cyan" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
                    )}
                  >
                    {active && <span className="absolute top-2 bottom-2 -left-2 w-[3px] rounded-r bg-cyan shadow-[0_0_10px_var(--cyan)]" />}
                    <Icon name={p.icon} className="h-4 w-4" />
                    <span className="text-[9.2px] font-semibold tracking-wide">{DOCK_LABEL[p.routeKey]}</span>
                  </Link>
                </Fragment>
              );
            })}
          </nav>
        )}

        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 overflow-y-auto outline-none">
          <div key={loc.pathname} className="eo-page-content eo-enter mx-auto max-w-[1440px] p-6">{children}</div>
        </main>
      </div>

      {/* ── Footer status bar (36px) ── */}
      <footer className="eo-shell-footer flex h-9 shrink-0 items-center justify-between border-t border-border bg-window/80 px-4 text-[10px] font-semibold text-subtle">
        <span>
          <span className="text-cyan">⚡</span> ERROR OPTIMIZER {isV4 ? "V4" : "V3"} · {(page?.routeKey ?? (isBlueprint ? "BLUEPRINT" : "")).toUpperCase()} · BROWSER PROTOTYPE
        </span>
        <span>RESOLUTION: 1280 × 820 BASE · UNIVERSAL OPTIMIZATION SUITE</span>
      </footer>
    </div>
  );
}
