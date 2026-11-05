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
      "GlassSidebarDock, 84px wide (60px collapsed to icons, toggle at the bottom, remembered per browser), 19 entries in 5 separator groups. One shared active indicator (cyan tint + 3px cyan bar) slides between items; aria-current=page. Items tighten on windows under 860px tall.",
  },
  {
    area: "V4 tabs",
    detail:
      "44px strip with exactly 2 tabs (MAXIMUM PERFORMANCE, EMULATOR OPTIMIZATION) and a sliding underline indicator. Sub-pages keep their parent tab active. V3 dock hidden.",
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
    size: "20px",
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
    size: "22px",
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
  ["Shell", "Title bar 48px · V4 tabs 44px · footer 32px · dock 84px / 60px"],
  ["Page padding", "16px × 20px (14px under 760px)"],
  ["Section gap", "16px"],
  ["Card padding", "16px"],
  ["Tile / grid gap", "10px"],
  ["Stat tile padding", "10px × 12px"],
  ["Row padding", "10px vertical, 12px horizontal"],
  ["Buttons", "sm 28px · md 32px · lg 40px tall"],
  ["Sticky action bar", "10px × 20px, floating glass"],
  ["Radii", "4px badges · 8px cards, buttons, inputs, rows · full pills"],
];

export const DEPTH: { name: string; css: string; use: string }[] = [
  {
    name: "Card",
    css: "--shadow-card",
    use: "Resting cards: 1px inner top highlight + 2px contact shadow + soft 28px drop.",
  },
  {
    name: "Elevated",
    css: "--shadow-elevated",
    use: "Card / tile hover: three-layer shadow plus a faint cyan rim; tiles lift 2px.",
  },
  { name: "Pressed", css: "--shadow-pressed", use: "Button press: inner shadow + 1px drop." },
  { name: "Glow", css: "--shadow-glow", use: "Primary buttons, active area, current step." },
  {
    name: "Overlay",
    css: "--overlay-shadow",
    use: "Dialogs, menus and toasts (layered 12px + 90px drop).",
  },
  {
    name: "Chrome glass",
    css: "--glass-blur-chrome",
    use: "Title bar, dock, V4 tabs, footer: 72% surface + 14px blur. WPF: AcrylicBrush / Mica.",
  },
  {
    name: "Floating glass",
    css: "--glass-blur-float",
    use: "Dialogs, menus, toasts, sticky bars: 80% surface + 20px blur. Dense data cards get no blur.",
  },
  {
    name: "Pointer light",
    css: "--light-x",
    use: "Mouse-following 7% cyan highlight on card hover. Off on touch, LOW depth and reduced motion.",
  },
  {
    name: "Tilt",
    css: "--tilt-x",
    use: "Mouse-only tilt, max ±0.8°, only on cards ≥340×180px without form fields. Off when depth = LOW, on touch or motion reduced. HIGH (DEEP) deepens card shadows and hover lift.",
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
    duration: "120ms",
    easing: "linear",
    css: "--duration-fast: 120ms",
    wpf: "ColorAnimation 0:0:0.12",
  },
  {
    name: "Border, transform, shadow",
    duration: "180ms",
    easing: "cubic-bezier(.2,.8,.2,1)",
    css: "--duration-control: 180ms",
    wpf: "DoubleAnimation 0:0:0.18",
  },
  {
    name: "Spring (thumbs, icons, indicators)",
    duration: "180–320ms",
    easing: "cubic-bezier(.34,1.4,.64,1)",
    css: "--ease-spring: cubic-bezier(.34,1.4,.64,1)",
    wpf: "BackEase Amplitude 0.3, EasingMode=EaseOut",
  },
  {
    name: "Page enter",
    duration: "260ms",
    easing: "cubic-bezier(.2,.8,.2,1)",
    css: "--duration-page: 260ms",
    wpf: "PageTransitionHost: Opacity 0→1 + TranslateY 6→0, KeySpline 0.2,0.8 0.2,1",
  },
  {
    name: "Section stagger",
    duration: "320ms, +30ms each (max 5 steps)",
    easing: "cubic-bezier(.2,.8,.2,1)",
    css: "--stagger: 30ms",
    wpf: "BeginTime offsets 0 / 30 / 60 / 90 / 120 / 150ms",
  },
  {
    name: "Active indicator slide",
    duration: "320ms",
    easing: "spring",
    css: "transform var(--duration-slow) var(--ease-spring)",
    wpf: "One shared Border; animate TranslateTransform.Y (dock) / X (tabs)",
  },
  {
    name: "Hover lift",
    duration: "180ms",
    easing: "cubic-bezier(.2,.8,.2,1)",
    css: "--lift-hover: -2px",
    wpf: "TranslateTransform.Y → -2 on IsMouseOver (tiles)",
  },
  {
    name: "Dialog in",
    duration: "220ms",
    easing: "cubic-bezier(.2,.8,.2,1)",
    css: "eo-dialog-in 220ms",
    wpf: "Opacity 0→1, TranslateY 10→0, Scale 0.97→1",
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
    name: "Menu / popover",
    duration: "160ms",
    easing: "cubic-bezier(.2,.8,.2,1)",
    css: "eo-pop-in 160ms",
    wpf: "Popup: Opacity 0→1, TranslateY -4→0, Scale 0.97→1 from top-right",
  },
  {
    name: "Expander",
    duration: "180ms",
    easing: "cubic-bezier(.2,.8,.2,1)",
    css: "grid-template-rows var(--duration-control)",
    wpf: "Expander content: animate LayoutTransform ScaleY or Height",
  },
  {
    name: "Card tilt",
    duration: "260ms",
    easing: "cubic-bezier(.2,.8,.2,1)",
    css: "transform 260ms",
    wpf: "Optional; prefer elevation change over 3D in WPF",
  },
  {
    name: "Primary sheen",
    duration: "600ms",
    easing: "cubic-bezier(.2,.8,.2,1)",
    css: "transform 600ms",
    wpf: "Hover-only gradient sweep (OpacityMask offset)",
  },
  {
    name: "Chart draw",
    duration: "800ms",
    easing: "cubic-bezier(.2,.8,.2,1)",
    css: "eo-chart-draw 800ms",
    wpf: "StrokeDashOffset animation on Path",
  },
  {
    name: "Progress sheen",
    duration: "1.6s loop, running bars only",
    easing: "linear",
    css: "eo-sheen 1.6s",
    wpf: "Gradient offset animation while IsRunning",
  },
  {
    name: "Skeleton shimmer",
    duration: "1.3s loop",
    easing: "linear",
    css: "eo-shimmer 1.3s",
    wpf: "LinearGradientBrush offset animation, RepeatBehavior=Forever",
  },
  {
    name: "Completion",
    duration: "420ms",
    easing: "spring",
    css: "eo-success-pop 420ms",
    wpf: "Result card: Opacity + TranslateY 8→0 + Scale 0.98→1",
  },
];

export const STATES: { state: string; spec: string }[] = [
  {
    state: "Hover",
    spec: "Secondary button: border cyan 50% + highlight fill; icons nudge 1px. Primary: brighter glow + one light sweep. Card: edge-light border, elevated shadow, pointer light. Tiles lift 2px. Rows: border-strong + faint fill.",
  },
  {
    state: "Pressed",
    spec: "translateY(1px) scale(0.99); buttons scale(0.98) + inner pressed shadow.",
  },
  {
    state: "Busy",
    spec: "Btn loading: spinner + aria-busy, clicks blocked. Running progress bars show a moving sheen.",
  },
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
  "Scrim: canvas colour at 75% + 4px background blur; click outside closes.",
  "Dialog: floating glass (80% surface + 20px blur), max-height 86vh, header / scroll body / tinted footer, 8px radius, overlay shadow.",
  "Menus and popovers share the floating glass and open from their anchor corner (eo-pop-in).",
  "Focus moves into the dialog, Tab is trapped, Esc closes, focus returns to the trigger.",
  "Run flow (UniversalOptimizationModal): Approve → Restore point → 5 stages → summary. The prototype summary reports 0 changes on this PC.",
];

export const REDUCED_MOTION: string[] = [
  "System prefers-reduced-motion, Settings → Reduced Motion, or UI Animations off: every animation and transition is removed and card tilt is disabled.",
  "Page Transitions off: only page and section entrance animations are removed.",
  "3D Spatial Depth LOW (2D): tilt and pointer light removed, shadows kept. HIGH (DEEP): deeper card shadows and a 3px hover lift.",
  "Touch / no-hover devices: tilt, pointer light and hover lift are disabled.",
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
  { web: "Details", wpf: "Expander", note: "Animated open; closed content is inert" },
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
