<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- ERROR OPTIMIZER is a browser visual prototype of a WPF app: every action is simulated (`simulate`, `useSimRun`) and must stay labeled as such — never call real system APIs. Why: the user wants a blueprint, not real optimizations.
- Page registry lives in `src/lib/eo/registry.ts` (route key, XAML view, ViewModel, dock group); `src/routes/$page.tsx` renders `PAGE_COMPONENTS` from `src/components/eo/pageMap.tsx`. Why: one place maps original WPF routes to prototype pages.
- Uploaded XAML is the layout source of truth over the build report; conflicts go in `MISSING_REFERENCES`, not silent guesses.
- Selection toggles, default selections and simulated-run summaries go through `src/lib/eo/selection.ts`: PROTECTED items are never auto-selected and run summaries always report 0 real changes. Why: the prototype must never fabricate optimization results.
- WPF handoff data (tokens, type, spacing, depth, motion, states, component map) lives in `src/lib/eo/blueprint.ts`; every motion/depth `css` value must exist in `src/styles.css` (enforced by `src/test/blueprint-sync.test.ts`). Why: the blueprint must describe the running prototype, not invented values.
- Registry icons resolve through the explicit map in `src/components/eo/icons.ts`, never `import * as` lucide. Why: keeps the icon bundle small; a test checks every page has an icon.
- Visual language (glass surfaces, layered shadows, motion tokens, compact spacing, sliding nav indicators) is defined once in `src/styles.css` and the shared components in `kit.tsx`/`Shell.tsx`; pages compose those and do not define their own shadows, blur or keyframes. Why: keeps all 34 destinations consistent and the Blueprint accurate.
- Form controls beyond the base kit (segmented control, range slider, numeric field, score ring, count-up) live in `src/components/eo/controls.tsx`; slider value rules are pure in `src/lib/eo/slider.ts` and score rules in `src/lib/eo/score.ts` (tested in `src/test/premium-rules.test.ts`). Why: one implementation keeps every slider/score consistent and testable.
- Auto Optimize is a recurring maintenance engine, separate from 1-Click: pure rules (tasks, interval validation, run planning, overlap, summaries) in `src/lib/eo/autoOptimize.ts` (tested in `src/test/auto-optimize-rules.test.ts`); one simulated scheduler store in `src/components/eo/autoOptimizeStore.ts`, booted from the Shell and shared by the Dashboard panel, Auto Optimize page and title-bar chip. Why: one schedule and one set of safety rules everywhere.
- The 1-Click page owns `useOptimizeWorkflow` and `ReviewSelectionModal`. Why: Analyze → Review → Confirm is a different flow from scheduled maintenance.
- The large live telemetry chart belongs on System Telemetry (`Telemetry.tsx`); the Dashboard shows only compact overview tiles. Why: user-directed hierarchy change.
- `Modal` portals to `document.body`; cards use transform/backdrop-filter, which would trap a fixed overlay inside the card.
