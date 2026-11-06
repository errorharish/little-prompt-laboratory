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

# Final product-wide redesign (prompt-7)
- [x] Auto Optimize settings: compact layout, Back to Dashboard, Advanced Settings collapsed.
- [x] Global page container, grid, spacing and alignment applied to all 34 destinations.
- [x] Shared components refined: cards, sidebar, buttons, tabs/segmented, sliders, toggles, inputs, progress, pills.
- [x] Optimization dialogs (run, review, detail, confirm) and toasts redesigned.
- [x] Motion: page transitions, hover, press, dialog enter/exit, expand/collapse, reduced motion.
- [x] Verify all 34 destinations at 1280×820 / 1024×768 and run tests.

# Selection, V4 navigation & quick actions (prompt-9)
- [x] Global default selection: every eligible optimization pre-selected (per page/profile), user changes persisted; protected, high-risk, destructive, done and unsupported items never auto-selected.
- [x] V4 navigation bar, logo and V3/V4 switcher premium upgrade.
- [x] V4 Maximum Performance and Emulator Optimization compact redesign.
- [x] Module Hub: Back to Emulator Optimization, state preserved.
- [x] Dashboard Quick Actions run in place (only One-Click navigates), no duplicate runs.
- [x] Verify all 34 destinations at 1280×820 / 1024×768, tests.

# Contextual guides & hidden scrollbars (prompt-10)
- [x] One guide registry + shared help popover; every optimization page has a header guide, key sections have their own.
- [x] Existing Guide dialogs (1-Click, Performance Tuning, V4 pages, Module Hub, Low End Steam) unified to one style.
- [x] Scrollbars hidden globally; scrolling kept; edge fades show more content.
- [x] Verify all 34 destinations at 1280×820 / 1024×768, tests.

# Restore point, quick actions split, input modes, health score (prompt-13)
- [x] Restore Point: System Protection status check, "System Protection Is Disabled" dialog, explicit enable → verify → retry (simulated); native plan in Blueprint.
- [x] Dashboard: Navigation Shortcuts (Telemetry, Startup, Boost Performance, One-Click) separate from Quick Optimize (run in place).
- [x] Input Optimization: Normal / Advanced / Custom modes; per-mode recommended defaults; Custom-only editing with save + reset.
- [x] Global rule: default = applicable AND recommended AND eligible.
- [x] System Telemetry: System Health Check with documented, reproducible score, missing-data handling, category breakdown, recommendations.
- [x] Verify all 34 destinations at 1280×820 / 1024×768, tests.

# Registry Values page (prompt-14)
- [x] RAM (5) and GPU (25) registry values from the original WPF engines, grouped, with sample current/target, risk, restart and applicability.
- [x] Two-column layout with RAM tier map and native apply steps; details dialog per value; demo notice at top.
- [x] Verify at 1280×820, 1163×690, 1024×768; tests.

# Global GUIDE button & dialog (prompt-15)
- [x] One GUIDE button + dialog (V4 Maximum Performance design) rendered by every optimization page header, V3 and V4; old header help icons and per-page dialogs removed.
- [x] Page-specific content: original V3/V4 guides kept verbatim; other pages use What / How / Benefits / Safety / When / Risks / Reversibility.
- [x] Verify all destinations at 1280×820 / 1024×768 (one button, correct guide, closes, fits), tests.
