# Premium transformation
- [x] Import GitHub source and fix code type errors (8 errors → 0).
- [x] Upgrade shared surfaces, controls, motion, accessibility and navigation (headings, skip link, focus, dialog labels, stepper, loading states, contrast).
- [x] Refine Dashboard, One-Click and shared run dialog; honest "sample/simulated" wording across pages.
- [x] Document navigation, tokens, type, spacing, depth, motion, states, dialogs, reduced motion and WPF component mapping in Blueprint.
- [x] Verify all destinations, One-Click workflow, dialogs, reduced motion, desktop overflow (1280 / 1024) and tests.
- [x] Clean up code-formatting warnings (840 → 0 errors; 4 dev-only fast-refresh notices remain).
- [ ] Audit page layouts against the original WPF reference files. Blocked: ERROR_OPTIMIZER_UI_REFERENCE.zip and related files are not in this project.
- [ ] Per-page redesign of manager pages (Startup, Service, Process, Network, Storage, Tools, Registry, V4 sub-pages) beyond shared-component and wording fixes. Needs the WPF references to avoid guessing layouts.

# Premium UI/UX evolution (prompt-4)
- [x] Glass, depth and motion tokens; compact spacing system; ambient lighting.
- [x] Shared components: cards (pointer light, large-card tilt), buttons (loading, sheen, pressed), toggles, checks, progress, expander, dialogs, menus, toasts, stepper.
- [x] Shell: glass chrome, sliding dock/tab indicators, collapsible dock, compact bars.
- [x] Blueprint updated; all 34 destinations, flows, reduced motion and tests verified.

# Focused upgrade (prompt-5)
- [x] Dashboard: illustrative Overall Optimization Score + Auto Optimize panel reusing the One-Click workflow.
- [x] Large telemetry chart moved to System Telemetry (tooltips, legend toggles, window, pause).
- [x] Premium RAM Limiter (slider + synced number field, reset/revert, simulated enforce) and shared Segmented/slider controls.
- [x] V4 Maximum Performance and Emulator Optimization redesigned; fake live logs removed.
- [x] Blueprint updated; all 34 destinations at 1280 / 1024, flows, and 22 tests verified.

# Final master transformation (prompt-6)
- [x] Auto Optimize restored as a recurring maintenance engine: user-selected tasks (temp files, standby list, per-browser cache, Recycle Bin, system caches), 1/5/10/30/60 min + custom up to 24 h, pause/resume, run now, cancel, overlap policy.
- [x] Launch / close / Windows startup / shutdown behaviour represented as simulated events; native architecture documented in Blueprint.
- [x] Dashboard: score + Auto Optimize control centre; Optimization Status and Recent Activity removed; one-row System Information strip.
- [x] Maintenance history with per-task outcomes; title-bar countdown chip.
- [x] 35 tests, all 34 destinations at 1280 / 1024 verified.
- [ ] Per-page layout redesign of the remaining manager pages beyond the shared components. Blocked: needs the WPF reference files to avoid guessing layouts.
