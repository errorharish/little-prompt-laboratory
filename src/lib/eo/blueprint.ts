// WPF handoff data rendered by /blueprint. Every value mirrors src/styles.css or kit.tsx;
// `css` fields are asserted against styles.css in src/test/blueprint-sync.test.ts.

export const TOKENS: [name: string, hex: string, key: string, cls: string][] = [
  ["Canvas", "#050811", "FigmaCanvasBgColor", "bg-background"],
  ["Window", "#080D1A", "FigmaWindowBgColor", "bg-window"],
  ["Card", "#0D1426", "FigmaSecondaryPanelColor", "bg-card"],
  ["Elevated", "#121B33", "FigmaElevatedSurfaceColor", "bg-elevated"],
  ["Border subtle", "#1A2544", "FigmaBorderSubtleColor", "border-border"],
  ["Border medium", "#253560", "FigmaBorderMediumColor", "border-border-strong"],
  ["Electric blue", "#2563EB", "FigmaAccentElectricBlueColor", "bg-primary"],
  ["Cyan highlight", "#38BDF8", "(report) active indicator", "text-cyan"],
  ["Success", "#10B981", "FigmaStatusSuccessColor", "text-success"],
  ["Warning", "#F59E0B", "FigmaStatusWarningColor", "text-warning"],
  ["Danger", "#EF4444", "FigmaStatusDangerColor", "text-destructive"],
  ["Text primary", "#F8FAFC", "FigmaTextPrimaryColor", "text-foreground"],
  ["Text secondary", "#94A3B8", "FigmaTextSecondaryColor", "text-muted-foreground"],
  [
    "Text muted",
    "#77879F",
    "FigmaTextMutedColor (lifted from #64748B for contrast)",
    "text-subtle",
  ],
];

export const NAVIGATION: { area: string; detail: string }[] = [
  {
    area: "Suite switch",
    detail:
      "Title-bar V3/V4 pill (two toggle buttons, aria-pressed). V3 → Dashboard; V4 → Maximum Performance tab.",
  },
  {
    area: "V3 dock",
    detail:
      "GlassSidebarDock, 84px wide, 19 entries in 5 separator groups. Active item: cyan tint + 3px cyan bar with glow; aria-current=page.",
  },
  {
    area: "V4 tabs",
    detail:
      "48px strip with exactly 2 tabs (MAXIMUM PERFORMANCE, EMULATOR OPTIMIZATION). Sub-pages keep their parent tab active. V3 dock hidden.",
  },
  {
    area: "Unrouted pages",
    detail:
      "One-Click, Auto Optimize, Process Reduction, Service Manager, Performance Tuning, V4 Dashboard: reached from in-page links only.",
  },
  {
    area: "Routing",
    detail:
      "One registry (route key → XAML view → ViewModel). In WPF: MainViewModel route factory + DataTemplates in App.xaml.",
  },
  {
    area: "Keyboard",
    detail:
      "Skip link to content; Tab order: title bar → dock/tabs → page → sticky action bar. Esc closes dialogs and popovers.",
  },
];

export const TYPE_SCALE: { role: string; size: string; weight: string; notes: string }[] = [
  {
    role: "Page title (h1)",
    size: "24px",
    weight: "700",
    notes: "Uppercase; 1-Click hero uses 26px / 900",
  },
  {
    role: "Section title (h2)",
    size: "11.5px",
    weight: "700",
    notes: "Uppercase, 1×14px cyan accent bar",
  },
  { role: "Caption / label", size: "10.5px", weight: "700", notes: "Uppercase (eo-label)" },
  { role: "Body", size: "13px", weight: "400", notes: "Subtitles 13px; rows 12.5px; hints 11.5px" },
  {
    role: "Stat value",
    size: "24px",
    weight: "700",
    notes: "Tabular numerals; dashboard tiles 30px",
  },
  { role: "Badge", size: "9.5px", weight: "700", notes: "Uppercase, 4px radius" },
  { role: "Button", size: "10.5px", weight: "700", notes: "sm 10px · lg 12px; uppercase" },
  {
    role: "Mono",
    size: "11–11.5px",
    weight: "400",
    notes: "Cascadia Code → JetBrains Mono → Consolas",
  },
];

export const SPACING: [role: string, value: string][] = [
  ["Page padding", "24px (16px under 760px)"],
  ["Section gap", "16px"],
  ["Card padding", "20px"],
  ["Tile / grid gap", "10px"],
  ["Stat tile padding", "14px"],
  ["Row padding", "10–14px vertical, 12–14px horizontal"],
  ["Sticky action bar", "12px × 24px"],
  ["Radii", "4px badges · 8px cards, buttons, inputs, rows · full pills"],
];

export const DEPTH: { name: string; css: string; use: string }[] = [
  {
    name: "Card",
    css: "--shadow-card",
    use: "Resting cards: 1px inner top highlight + soft 32px drop.",
  },
  { name: "Elevated", css: "--shadow-elevated", use: "Card hover and sticky bars." },
  { name: "Glow", css: "--shadow-glow", use: "Primary buttons, active area, current step." },
  { name: "Overlay", css: "--overlay-shadow", use: "Dialogs (30px × 90px drop)." },
  {
    name: "Tilt",
    css: "--tilt-x",
    use: "Mouse-only card tilt, max ±0.9°. Off when depth = LOW or motion reduced. HIGH (DEEP) has no extra styling in the prototype yet.",
  },
];

export const MOTION: {
  name: string;
  duration: string;
  easing: string;
  css: string;
  wpf: string;
}[] = [
  {
    name: "Colour / background",
    duration: "140ms",
    easing: "linear",
    css: "--duration-fast: 140ms",
    wpf: "ColorAnimation 0:0:0.14",
  },
  {
    name: "Border, transform, shadow",
    duration: "180ms",
    easing: "linear",
    css: "--duration-control: 180ms",
    wpf: "DoubleAnimation 0:0:0.18",
  },
  {
    name: "Page enter",
    duration: "280ms",
    easing: "cubic-bezier(.2,.8,.2,1)",
    css: "--duration-page: 280ms",
    wpf: "PageTransitionHost: Opacity 0→1 + TranslateX 8→0, KeySpline 0.2,0.8 0.2,1",
  },
  {
    name: "Section stagger",
    duration: "320ms, +30ms each",
    easing: "cubic-bezier(.2,.8,.2,1)",
    css: "eo-section-in 320ms",
    wpf: "BeginTime offsets 0 / 30 / 60 / 90ms",
  },
  {
    name: "Dialog in",
    duration: "200ms",
    easing: "cubic-bezier(.2,.8,.2,1)",
    css: "eo-dialog-in 200ms",
    wpf: "Opacity 0→1, TranslateY 8→0, Scale 0.97→1",
  },
  {
    name: "Dialog out",
    duration: "150ms",
    easing: "ease",
    css: "eo-dialog-out 150ms",
    wpf: "Opacity →0, TranslateY →4, Scale →0.98; then Collapse",
  },
  {
    name: "Overlay fade",
    duration: "180ms in / 150ms out",
    easing: "ease",
    css: "eo-overlay-in 180ms",
    wpf: "Scrim Opacity animation",
  },
  {
    name: "Card tilt",
    duration: "260ms",
    easing: "cubic-bezier(.2,.8,.2,1)",
    css: "transform 260ms",
    wpf: "Optional; prefer elevation change over 3D in WPF",
  },
  {
    name: "Chart draw",
    duration: "800ms",
    easing: "cubic-bezier(.2,.8,.2,1)",
    css: "eo-chart-draw 800ms",
    wpf: "StrokeDashOffset animation on Path",
  },
  {
    name: "Skeleton shimmer",
    duration: "1.3s loop",
    easing: "linear",
    css: "eo-shimmer 1.3s",
    wpf: "LinearGradientBrush offset animation, RepeatBehavior=Forever",
  },
];

export const STATES: { state: string; spec: string }[] = [
  {
    state: "Hover",
    spec: "Secondary button: border cyan 50% + highlight fill. Card: edge-light border + elevated shadow. Rows: border-strong.",
  },
  { state: "Pressed", spec: "translateY(1px) scale(0.99); buttons scale(0.98)." },
  {
    state: "Focus",
    spec: "2px cyan outline, 3px offset, keyboard focus only (focus-visible). WPF: FocusVisualStyle.",
  },
  {
    state: "Selected",
    spec: "Rows: cyan 40% border + cyan 5% fill. Chips: cyan 50% border + cyan 15% fill (aria-pressed).",
  },
  { state: "Disabled", spec: "40% opacity, no pointer events." },
  { state: "Current step", spec: "Cyan pill + glow; done steps green with check; upcoming muted." },
];

export const MODAL_SPEC: string[] = [
  "Scrim: canvas colour at 80% + 4px background blur; click outside closes.",
  "Dialog: max-height 86vh, header / scroll body / footer, 8px radius, overlay shadow.",
  "Focus moves into the dialog, Tab is trapped, Esc closes, focus returns to the trigger.",
  "Run flow (UniversalOptimizationModal): Approve → Restore point → 5 stages → summary. The prototype summary reports 0 changes on this PC.",
];

export const REDUCED_MOTION: string[] = [
  "System prefers-reduced-motion, Settings → Reduced Motion, or UI Animations off: every animation and transition is removed and card tilt is disabled.",
  "Page Transitions off: only page and section entrance animations are removed.",
  "3D Spatial Depth LOW (2D): tilt removed, shadows kept.",
  "WPF: read SystemParameters.ClientAreaAnimation and the app setting; skip Storyboards when either is off.",
];

export const COMPONENT_MAP: { web: string; wpf: string; note: string }[] = [
  {
    web: "Card",
    wpf: "Border · FigmaCardStyle / GlassCard",
    note: "Gradient surface + 1px border",
  },
  {
    web: "Btn (primary / secondary / ghost / danger / success)",
    wpf: "Theme/Buttons.xaml styles",
    note: "success variant is a prototype addition",
  },
  {
    web: "Badge, RiskBadge",
    wpf: "Theme/Badges.xaml",
    note: "Risk → tone: SAFE/LOW green, MEDIUM amber, HIGH red, PROTECTED cyan",
  },
  { web: "Toggle", wpf: "PremiumToggle", note: "role=switch" },
  { web: "Check", wpf: "CheckBox style", note: "role=checkbox" },
  { web: "Chips", wpf: "RadioButton row (ToggleButton style)", note: "aria-pressed" },
  { web: "Details", wpf: "Expander", note: "Hides raw technical inventories" },
  { web: "Modal", wpf: "Grid overlay / Popup", note: "See dialog behaviour" },
  {
    web: "RunModal",
    wpf: "Controls/UniversalOptimizationModal.xaml",
    note: "Summary is honest about simulation",
  },
  { web: "StatTiles", wpf: "UniformGrid", note: "cols=*,10,*…" },
  { web: "PageHeader", wpf: "Grid cols=*,Auto", note: "Accent bar + h1 + actions" },
  {
    web: "Stepper",
    wpf: "No original reference",
    note: "New in prototype; horizontal ItemsControl suggested",
  },
  {
    web: "LoadingState",
    wpf: "No original reference",
    note: "New in prototype; shimmer Border suggested",
  },
  { web: "SimNotice", wpf: "None (prototype only)", note: "Omit in the native app" },
];
