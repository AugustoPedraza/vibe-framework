---
name: vibe polish
description: UI polish validation — single component or full codebase scan
args: "[component-path|route|--all]"
---

# Vibe Polish

> Short feedback loop for visual and UX validation. Validates components against `rules/ui-polish.md`, `rules/animation-patterns.md`, and `rules/ux-validation.md`.

## Usage

```
/vibe polish <component-path>    # Single component
/vibe polish <route>             # Route (requires MCP)
/vibe polish --all               # Scan entire codebase
```

## Single Component Mode

### With MCP (main session only — subagents cannot use MCP)

**Prerequisite:** Playwright MCP configured, dev server running at `localhost:4000`.

1. Navigate to component route via Playwright MCP `browser_navigate`
2. Validate DOM at two viewports:
   - Mobile (375x812): touch targets, safe areas, bottom-half primary actions
   - Desktop (1280x800): hover states, focus-visible, layout
3. Check computed styles against design tokens
4. Verify all 4 async states render correctly
5. Auto-fix safe issues: spacing, aria-labels, design token replacements
6. Output: pass/fail checklist per rule

### Without MCP (static analysis fallback)

1. Read component file
2. Check state completeness:
   - Async indicators present? (`{#await}`, `fetch(`, `onMount`, `loading` prop)
   - Loading state with skeleton/shimmer? (not spinner)
   - Error state with `role="alert"` + retry?
   - Empty state with guidance + CTA?
3. Check interactive states:
   - Buttons: hover + active + focus-visible CSS
   - Cards: hover lift effect
   - Links: hover underline animation
   - No bare `outline: none` without focus-visible
4. Check animation quality:
   - Transitions use design token durations (not hardcoded ms)
   - Exit duration is 67-85% of enter duration
   - Reduced motion respected
   - Only animating transform/opacity (GPU-safe)
5. Check mobile/PWA compliance:
   - Touch targets >= 44px (flag `h-8`, `w-8`, `p-2` on buttons)
   - No `vh` units (use `dvh`)
   - Safe area padding on edge-to-edge layouts
   - No horizontal scroll risk
6. Check design token compliance:
   - No raw Tailwind colors (except gray/blue/green scales)
   - No arbitrary values (`w-[300px]`)
   - Named z-index only
   - Standard spacing scale
7. Search ui-ux-pro-max for component-specific patterns:
   ```bash
   python3 ~/.claude/skills/ui-ux-pro-max-skill/search.py "<component-type>" --stack svelte --domain ux
   ```
8. Output: findings + fix suggestions

### Auto-Fix (Safe)

These fixes are applied automatically:
- Add `skeleton` class to plain gray loading divs
- Add `focus-visible:ring-2 focus-visible:ring-primary` to focusable elements missing it
- Replace `vh` with `dvh`
- Add `role="alert"` to error containers
- Add `aria-label` to icon-only buttons

## Full Codebase Mode (`--all`)

Retroactive cleanup of existing components.

1. Glob all `.svelte` files in `assets/svelte/`
2. For each file, run static analysis checks:
   - **State completeness** — loading/error/empty for async components
   - **Interactive states** — hover/active/focus on buttons, cards, links
   - **Animation quality** — timing, reduced-motion, performance
   - **Mobile/PWA compliance** — touch targets, safe areas, viewport units
   - **Design token compliance** — no raw colors, no arbitrary values, named z-index
3. Auto-fix safe issues (skeleton class, focus-visible ring, dvh units)
4. Create task list for remaining issues with fix instructions:
   ```
   TaskCreate: "Fix missing error state in ChatMessage.svelte"
   TaskCreate: "Add hover states to ProjectCard.svelte buttons"
   TaskCreate: "Replace vh with dvh in FullScreenLayout.svelte"
   ```
5. Summary output:
   ```
   X files scanned
   Y auto-fixed
   Z need manual attention (see task list)
   ```

## Category Breakdown

| Category | Checks | Auto-Fix |
|----------|--------|----------|
| State completeness | 4 states for async components | No (structural change) |
| Interactive states | hover/active/focus-visible | focus-visible ring |
| Animation | timing, reduced-motion, GPU safety | No |
| Mobile/PWA | touch targets, vh, safe areas, scroll | vh→dvh |
| Design tokens | colors, spacing, z-index, radius | No |
| Accessibility | aria-labels, roles, keyboard nav | aria-label on icon buttons |

## Integration

- Runs in **main session** (not subagent) when MCP is needed
- Static analysis mode can run anywhere
- Results feed into `/vibe check` quality score
- Hooks enforce rules on every edit; polish is the retroactive cleanup

## Related

- `rules/ui-polish.md` — Interactive states, skeleton, mobile, forms
- `rules/animation-patterns.md` — Svelte transition examples
- `rules/ux-validation.md` — Canonical async pattern
- `patterns/ux/skeleton-loading.md` — Skeleton variants
- `patterns/ux/mobile-pwa-checklist.md` — Mobile audit checklist
- `docs/mcp-browser-setup.md` — Playwright MCP installation
