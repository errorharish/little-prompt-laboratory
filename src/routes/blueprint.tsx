import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Card, Label, PageHeader, SectionTitle } from "@/components/eo/kit";
import { MISSING_REFERENCES, PAGES, hrefFor } from "@/lib/eo/registry";

export const Route = createFileRoute("/blueprint")({
  head: () => ({
    meta: [
      { title: "UI Blueprint — ERROR OPTIMIZER Prototype" },
      { name: "description", content: "Page-by-page UI inventory, design tokens and missing references for rebuilding ERROR OPTIMIZER in .NET 8 WPF." },
      { property: "og:title", content: "UI Blueprint — ERROR OPTIMIZER Prototype" },
      { property: "og:description", content: "Page inventory, tokens and interaction patterns for the native WPF rebuild." },
    ],
  }),
  component: Blueprint,
});

const TOKENS = [
  ["Canvas", "#050811", "FigmaCanvasBgColor", "bg-background"], ["Window", "#080D1A", "FigmaWindowBgColor", "bg-window"], ["Card", "#0D1426", "FigmaSecondaryPanelColor", "bg-card"],
  ["Elevated", "#121B33", "FigmaElevatedSurfaceColor", "bg-elevated"], ["Border subtle", "#1A2544", "FigmaBorderSubtleColor", "border-border"], ["Border medium", "#253560", "FigmaBorderMediumColor", "border-border-strong"],
  ["Electric blue", "#2563EB", "FigmaAccentElectricBlueColor", "bg-primary"], ["Cyan highlight", "#38BDF8", "(report) active indicator", "text-cyan"], ["Success", "#10B981", "FigmaStatusSuccessColor", "text-success"],
  ["Warning", "#F59E0B", "FigmaStatusWarningColor", "text-warning"], ["Danger", "#EF4444", "FigmaStatusDangerColor", "text-destructive"], ["Text primary", "#F8FAFC", "FigmaTextPrimaryColor", "text-foreground"],
  ["Text secondary", "#94A3B8", "FigmaTextSecondaryColor", "text-muted-foreground"], ["Text muted", "#64748B", "FigmaTextMutedColor", "text-subtle"],
];

function Blueprint() {
  const groups = [
    { t: "V3 — Glass sidebar dock (19 entries, 5 separator groups)", items: PAGES.filter((p) => p.suite === "V3" && p.inDock) },
    { t: "V3 — Routes without a dock entry", items: PAGES.filter((p) => p.suite === "V3" && !p.inDock) },
    { t: "V4 — Top navigation & sub-pages", items: PAGES.filter((p) => p.suite === "V4") },
  ];
  return (
    <div className="space-y-4">
      <PageHeader title="UI Blueprint" badges={<Badge tone="cyan">FOR WPF REBUILD</Badge>} sub="Page inventory audited from ERROR_OPTIMIZER_UI_REFERENCE.zip (XAML is the source of truth), MainViewModel route factory, App.xaml DataTemplates and the backend manifest. Full written spec: ERROR_OPTIMIZER_UI_BLUEPRINT.md in Files." />
      <Card>
        <SectionTitle title="SHELL" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[12.5px] text-muted-foreground">
          <div>Window base 1280 × 820 · custom title bar 56px · footer 36px</div>
          <div>Title bar: brand tile (cyan→blue gradient) · ERROR OPTIMIZER · V3/V4 RadioButton pill · subtitle · DEMO DATA · status pill · min/close</div>
          <div>V3: GlassSidebarDock 84px, items 68px (16px icon + 9.2px label), 3px cyan active bar with glow</div>
          <div>V4: dock hidden, 48px top tab strip with 2 tabs + “INDEPENDENT FROM V3 1-CLICK” badge</div>
          <div>Content: PageTransitionHost (fade + 6px rise, 350ms), padding 24px, SlimScrollViewer</div>
          <div>Fonts: Segoe UI Variable Display (primary), Cascadia Code (mono). Radii 4/8/12/16/24</div>
        </div>
      </Card>
      {groups.map((g) => (
        <Card key={g.t}>
          <SectionTitle title={g.t} />
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="grid bg-window px-3 py-2 eo-label text-[9px] text-subtle" style={{ gridTemplateColumns: "150px 1fr 220px 220px 70px" }}><span>ROUTE KEY</span><span>PAGE · PURPOSE</span><span>XAML VIEW</span><span>VIEWMODEL</span><span /></div>
            {g.items.map((p) => (
              <div key={p.routeKey} className="grid items-center border-t border-border px-3 py-2 text-[12px]" style={{ gridTemplateColumns: "150px 1fr 220px 220px 70px" }}>
                <span className="font-mono text-cyan">{p.routeKey}</span>
                <span><b>{p.title}</b> <span className="text-muted-foreground">— {p.description}</span></span>
                <span className="font-mono text-[11px] text-muted-foreground">{p.view}</span>
                <span className="font-mono text-[11px] text-muted-foreground">{p.viewModel}</span>
                <Link to={hrefFor(p.slug) as never} className="text-[10.5px] font-bold text-cyan hover:underline">OPEN →</Link>
              </div>
            ))}
          </div>
        </Card>
      ))}
      <Card>
        <SectionTitle title="DESIGN TOKENS (DesignTokens.xaml → CSS)" />
        <div className="grid grid-cols-2 gap-2">
          {TOKENS.map(([n, hex, key, cls]) => (
            <div key={n} className="flex items-center gap-3 rounded-lg border border-border bg-window px-3 py-2 text-[12px]">
              <span className="h-6 w-6 shrink-0 rounded-md border border-border" style={{ background: hex }} />
              <span className="w-28 font-semibold">{n}</span><span className="w-20 font-mono">{hex}</span><span className="flex-1 font-mono text-[11px] text-muted-foreground">{key}</span><span className="font-mono text-[10.5px] text-subtle">{cls}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11.5px] text-muted-foreground">Tier accents: Normal #10B981 · Pro #2563EB · Ultimate #EF4444 · Debloat #06B6D4 · BIOS Safe #0EA5E9.</p>
      </Card>
      <Card>
        <SectionTitle title="REUSABLE PATTERNS" />
        <ul className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-[12.5px] text-muted-foreground">
          <li><b className="text-foreground">Page header</b> — Grid cols=*,Auto: accent bar, uppercase title, badges, subtitle; action buttons right.</li>
          <li><b className="text-foreground">Stat strip</b> — equal tiles (cols=*,10,*…) with label, number, caption.</li>
          <li><b className="text-foreground">Filter chips</b> — RadioButton rows; active = cyan border/tint.</li>
          <li><b className="text-foreground">Selectable item row</b> — checkbox, name, category + state + risk badges, Details button.</li>
          <li><b className="text-foreground">Details modal</b> — numbered SECTION 1…n blocks; raw paths behind a DETAILS expander.</li>
          <li><b className="text-foreground">Sticky action bar</b> — selection count + Clear / Review / Apply.</li>
          <li><b className="text-foreground">Run flow</b> — UniversalOptimizationModal: Approve → Restore point → 5 stages → summary (Applied / Verified / Already optimal / Protected).</li>
          <li><b className="text-foreground">Guide modal</b> — numbered steps; V4 guide uses 240px section rail + content pane.</li>
          <li><b className="text-foreground">Empty state</b> — dashed panel, uppercase title, hint, reset action.</li>
          <li><b className="text-foreground">Safety copy</b> — “Protected”, “Reversible”, “Verified” badges on every apply surface.</li>
        </ul>
      </Card>
      <Card className="border-warning/30">
        <SectionTitle title="MISSING OR CONFLICTING REFERENCES" sub="Areas where the uploads do not fully determine the layout. Nothing here was guessed silently." />
        <div className="space-y-2">{MISSING_REFERENCES.map((m) => <div key={m.area} className="rounded-lg border border-border bg-window p-3"><Label className="text-warning">{m.area}</Label><p className="mt-1 text-[12.5px] text-muted-foreground">{m.detail}</p></div>)}</div>
      </Card>
    </div>
  );
}
