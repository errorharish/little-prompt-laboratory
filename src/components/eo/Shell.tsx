import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Circle, PanelLeftClose, PanelLeftOpen, Zap } from "lucide-react";
import { ICONS } from "./icons";
import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Btn } from "./kit";
import { AutoChip } from "./AutoChip";
import { useAutoOptimizeBoot } from "./autoOptimizeStore";
import { PAGES, V4_TABS, hrefFor, pageBySlug } from "@/lib/eo/registry";

function Icon({ name, className }: { name: string; className?: string }) {
  const C = ICONS[name] ?? Circle;
  return <C aria-hidden="true" className={className} />;
}

const DOCK_LABEL: Record<string, string> = {
  Dashboard: "HOME",
  InputOptimizer: "INPUT",
  SystemInfo: "SYSTEM",
  RegistryTweak: "REGISTRY",
  RegistryValues: "VALUES",
  StartupManager: "STARTUP",
  Network: "NETWORK",
  Storage: "STORAGE",
  Tools: "TOOLS",
  Normal: "NORMAL",
  Pro: "PRO",
  Ultimate: "ULTIMATE",
  Debloat: "DEBLOAT",
  BiosSafe: "BIOS",
  MaxPerformance: "MAX PERF",
  AiOptimization: "AI",
  BackupRestore: "BACKUP",
  Settings: "SETTINGS",
  About: "ABOUT",
};

const DOCK_KEY = "eo-dock-collapsed";

type Box = { x: number; y: number; w: number; h: number } | null;

/** Measures the element marked aria-current="page" inside `container` so one shared
 *  indicator can slide between nav items instead of each item painting its own. */
function useActiveBox(deps: unknown[]) {
  const ref = useRef<HTMLElement>(null);
  const [box, setBox] = useState<Box>(null);
  const measure = useCallback(() => {
    const el = ref.current?.querySelector<HTMLElement>('[aria-current="page"]');
    setBox(
      el ? { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight } : null,
    );
  }, []);
  useEffect(() => {
    measure();
    // Re-measure after the dock width transition settles.
    const t = setTimeout(measure, 340);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { ref, box };
}

export function Shell({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const navigate = useNavigate();
  useAutoOptimizeBoot();
  const slug = loc.pathname.replace(/^\//, "");
  const page = pageBySlug(slug);
  const isBlueprint = slug === "blueprint";
  const isV4 = page?.suite === "V4";
  const dock = PAGES.filter((p) => p.inDock);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    setCollapsed(window.localStorage.getItem(DOCK_KEY) === "1");
  }, []);
  const toggleDock = () =>
    setCollapsed((c) => {
      window.localStorage.setItem(DOCK_KEY, c ? "0" : "1");
      return !c;
    });
  const dockBox = useActiveBox([slug, collapsed, isV4]);
  const tabBox = useActiveBox([slug, isV4]);

  return (
    <div className="relative isolate flex h-screen flex-col overflow-hidden">
      <div aria-hidden="true" className="eo-ambient" />
      <a href="#main-content" className="eo-skip">
        Skip to page content
      </a>
      {/* ── Title bar (48px) ── */}
      <header className="eo-shell-header relative z-20 flex h-12 shrink-0 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="eo-brand flex h-7 w-7 items-center justify-center rounded-lg eo-glow">
            <Zap aria-hidden="true" className="h-3.5 w-3.5 fill-current text-primary-foreground" />
          </div>
          <span className="eo-shell-brand text-[14px] font-black">ERROR OPTIMIZER</span>
          <div
            role="group"
            aria-label="Suite"
            className="eo-suite-pill flex rounded-md border border-border bg-background/70 p-0.5"
          >
            {(["V3", "V4"] as const).map((v) => (
              <Btn
                key={v}
                size="sm"
                variant="ghost"
                pressed={(v === "V4") === !!isV4}
                title={
                  v === "V3"
                    ? "Switch to Error Optimizer V3 Classic Suite"
                    : "Switch to Error Optimizer V4 Professional Suite"
                }
                onClick={() =>
                  navigate({
                    to: v === "V3" ? "/" : "/$page",
                    params: v === "V4" ? { page: "v4-max-performance" } : undefined,
                  } as never)
                }
                className={cn(
                  "h-6 rounded border-0 px-3 text-[10.5px] font-black tracking-widest",
                  (v === "V4") === !!isV4
                    ? "eo-brand text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {v}
              </Btn>
            ))}
          </div>
          <span className="hidden text-[10px] font-semibold text-subtle xl:inline">
            PERFORMANCE ENGINEERING SUITE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <AutoChip />
          <Link
            to="/blueprint"
            title="Design and WPF handoff documentation"
            aria-current={isBlueprint ? "page" : undefined}
            className={cn(
              "rounded-md border px-2.5 py-1 text-[10px] font-bold tracking-widest",
              isBlueprint
                ? "border-cyan/60 bg-cyan/15 text-cyan"
                : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
            )}
          >
            BLUEPRINT
          </Link>
          <span className="rounded-md border border-warning/40 bg-warning/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-warning">
            DEMO DATA
          </span>
          <span className="eo-service-label flex items-center gap-1.5 rounded-md border border-success/30 bg-success/10 px-2.5 py-1 text-[10px] font-bold text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> SIMULATED
            SERVICES
          </span>
        </div>
      </header>

      {/* ── V4 top navigation (MainWindow.xaml: exactly 2 tabs) ── */}
      {isV4 && (
        <div className="eo-shell-tabs relative z-10 flex h-11 shrink-0 items-center justify-between border-b border-border px-4">
          <nav
            ref={tabBox.ref}
            aria-label="V4 sections"
            className="relative flex h-full items-center gap-1"
          >
            {tabBox.box && (
              <span
                aria-hidden="true"
                className="eo-tab-indicator"
                style={{
                  transform: `translateX(${tabBox.box.x}px)`,
                  width: tabBox.box.w,
                  top: tabBox.box.y,
                  height: tabBox.box.h,
                }}
              />
            )}
            {V4_TABS.map((s) => {
              const p = pageBySlug(s);
              if (!p) return null;
              const active =
                slug === s ||
                (s === "emulator-optimization" &&
                  ["emulator-modules", "emulator-deployer", "low-end-steam"].includes(slug)) ||
                (s === "v4-max-performance" &&
                  ["v4-dashboard", "v4-core-optimizer"].includes(slug));
              return (
                <Link
                  key={s}
                  to="/$page"
                  params={{ page: s }}
                  title={p.tooltip}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "eo-nav-item relative flex h-8 items-center gap-2 rounded-lg px-4 text-[11px] font-bold tracking-[0.12em]",
                    active
                      ? "text-cyan"
                      : "text-muted-foreground hover:bg-highlight/50 hover:text-foreground",
                  )}
                >
                  <Icon name={p.icon} className="h-4 w-4" />
                  {s === "v4-max-performance" ? "MAXIMUM PERFORMANCE" : "EMULATOR OPTIMIZATION"}
                </Link>
              );
            })}
          </nav>
          <span className="rounded border border-cyan/30 bg-cyan/10 px-2 py-1 text-[9.5px] font-bold tracking-widest text-cyan">
            INDEPENDENT FROM V3 1-CLICK
          </span>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        {/* ── Glass sidebar dock (84px, 60px collapsed, V3 only) ── */}
        {!isV4 && (
          <div
            className="eo-dock relative z-10 flex shrink-0 flex-col border-r border-border"
            data-collapsed={collapsed}
            style={{ width: collapsed ? 60 : 84 }}
          >
            <nav
              ref={dockBox.ref}
              aria-label="V3 pages"
              className="relative flex min-h-0 flex-1 flex-col items-center gap-0.5 overflow-y-auto py-2"
            >
              {dockBox.box && (
                <span
                  aria-hidden="true"
                  className="eo-dock-indicator"
                  style={{
                    transform: `translate(${dockBox.box.x}px, ${dockBox.box.y}px)`,
                    width: dockBox.box.w,
                    height: dockBox.box.h,
                  }}
                />
              )}
              {dock.map((p, i) => {
                const active = slug === p.slug;
                const sep = i > 0 && dock[i - 1]?.dockGroup !== p.dockGroup;
                return (
                  <Fragment key={p.routeKey}>
                    {sep && <div className="eo-dock-sep my-1.5 h-px w-10 shrink-0 bg-border" />}
                    <Link
                      to={hrefFor(p.slug) as never}
                      title={p.tooltip}
                      aria-label={p.title}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "eo-nav-item relative flex w-[68px] shrink-0 flex-col items-center gap-1 rounded-lg py-2",
                        active
                          ? "text-cyan"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
                      )}
                    >
                      <Icon name={p.icon} className="h-4 w-4" />
                      <span className="eo-nav-label text-[9.2px] font-semibold tracking-wide">
                        {DOCK_LABEL[p.routeKey]}
                      </span>
                    </Link>
                  </Fragment>
                );
              })}
            </nav>
            <div className="eo-dock-toggle flex shrink-0 justify-center border-t border-border py-1.5">
              <Btn
                size="sm"
                variant="ghost"
                pressed={collapsed}
                onClick={toggleDock}
                title={collapsed ? "Show dock labels" : "Collapse dock to icons"}
                label={collapsed ? "Show dock labels" : "Collapse dock to icons"}
                className="h-7 w-10 border-transparent px-0"
              >
                {collapsed ? (
                  <PanelLeftOpen aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <PanelLeftClose aria-hidden="true" className="h-4 w-4" />
                )}
              </Btn>
            </div>
          </div>
        )}

        <main
          id="main-content"
          tabIndex={-1}
          className="min-w-0 flex-1 overflow-y-auto outline-none"
        >
          <div key={loc.pathname} className="eo-page-content eo-enter mx-auto max-w-[1440px]">
            {children}
          </div>
        </main>
      </div>

      {/* ── Footer status bar (32px) ── */}
      <footer className="eo-shell-footer relative z-10 flex h-8 shrink-0 items-center justify-between border-t border-border px-4 text-[10px] font-semibold text-subtle">
        <span>
          <span className="text-cyan">⚡</span> ERROR OPTIMIZER {isV4 ? "V4" : "V3"} ·{" "}
          {(page?.routeKey ?? (isBlueprint ? "BLUEPRINT" : "")).toUpperCase()} · BROWSER PROTOTYPE
        </span>
        <span>RESOLUTION: 1280 × 820 BASE · UNIVERSAL OPTIMIZATION SUITE</span>
      </footer>
    </div>
  );
}
