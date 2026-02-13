# UI Layer Reference

> Checklist for implementing Svelte components, stores, interactions, and accessibility.

## File Locations

```
assets/svelte/
├── components/      # Svelte components
├── stores/          # Component stores
├── lib/             # Shared utilities
├── types/           # TypeScript types
assets/tests/        # Component tests
assets/css/          # Feature CSS
```

Working directory: `assets/`

## Implementation Checklist (12 Steps)

1. **Search for existing components** — Before creating ANY component, search `ui/` and `features/shared/` for similar components. Extend via snippet/prop before creating new.
2. **Analyze spec** — Extract props, states, events, accessibility requirements
3. **Write tests first (TDD)** — One test per acceptance criterion, named `AC-N: description`
4. **Verify tests FAIL** (red) — Confirm they test the right thing
5. **Implement component** — Svelte 5 runes, design tokens, all 4 states
6. **VERIFY states actively** — Grep the component for loading/error/empty patterns. If ANY are missing, add them before proceeding.
7. **Check component size** — If >300 lines, STOP and decompose using folder structure (`index.svelte` + sibling sub-components) before continuing
8. **Add visual polish** — Every interactive element needs:
   - Buttons: hover + active + focus-visible states
   - Cards: hover lift effect
   - Links: underline animation
   - Transitions: per animation patterns (modal, dropdown, toast, sheet, list stagger)
9. **Check accessibility** — aria-labels, keyboard nav, focus management, `role="alert"` on errors
10. **Check design tokens** — No raw colors (gray/blue/green allowed, semantic preferred), proper spacing, named z-index, no arbitrary values
11. **PWA/mobile check** — Touch targets 44px minimum, safe areas, no horizontal scroll, `dvh` not `vh`, bottom sheets not modals on mobile
12. **Vitest verification** — All AC-named tests pass

## Hard Requirements (BLOCKERS)

### 4-State Requirement

Every async component MUST handle ALL four states. Missing any state = BLOCKER.

| State | Pattern | NOT Acceptable |
|-------|---------|----------------|
| Loading | Skeleton shimmer with `animate-pulse` | Spinner (spinner only for action-submit, never content loading) |
| Error | User-friendly message + retry button + `role="alert"` | Silent failure, console.error only |
| Empty | EmptyState component with guidance + CTA | Blank screen, "No data" text only |
| Success | Actual content | — |

### 300-Line Hard Limit

If component exceeds 300 lines, MUST decompose into folder structure before moving on:
```
ComponentName/
├── index.svelte          # Main component (re-exports)
├── SubComponentA.svelte  # Extracted piece
└── SubComponentB.svelte  # Extracted piece
```

### Vitest Test Per AC

Each acceptance criterion gets a named test:
```typescript
test('AC-1: displays user profile information', () => { ... });
test('AC-2: handles edit mode toggle', () => { ... });
```

## Svelte 5 Patterns (Required)

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    onSubmit: (data: FormData) => void;
    loading?: boolean;
    error?: string | null;
    live?: any;
  }

  let { onSubmit, loading = false, error = null, live }: Props = $props();

  const isValid = $derived(/* validation logic */);

  $effect(() => {
    // Side effects only (subscriptions, DOM manipulation)
    return () => { /* cleanup */ };
  });
</script>
```

## Deprecated Tokens (DO NOT USE)

| Don't Use | Use Instead |
|-----------|-------------|
| `text-text-disabled` | `text-muted-foreground` |
| `bg-surface-sunken` | `bg-muted` |

## Tailwind CSS 4 Bugs

`max-w-sm`, `max-w-md`, `max-w-lg` generate incorrect values. Manual overrides exist in `app.css`.

## Design Token Rules

- No raw Tailwind colors: `red-500`, `purple-300`, etc. (gray/blue/green scales allowed, semantic preferred)
- No arbitrary values: `w-[300px]`, `p-[15px]` — use token scale
- No hardcoded z-index: use named tokens (`z-base`, `z-raised`, `z-dropdown`, `z-sticky`, `z-overlay`, `z-modal`, `z-popover`, `z-toast`, `z-tooltip`)
- No non-standard border radius: use `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full`

## Touch Target Rules

- Minimum 44px (use `min-h-11`)
- Common violation: `h-8`/`p-2` buttons — always add `min-h-11`
- All interactive links need `inline-flex items-center min-h-11`

## Anti-Patterns

### Code Patterns
- Using `export let` instead of `$props()` (Svelte 4 syntax)
- Using `$effect` for derived values (use `$derived`)
- Creating a new component without checking `ui/` and `features/shared/` first
- Components exceeding 300 lines without decomposition
- Calling real backend APIs (use mocks in tests)
- Missing any of the 4 states

### Visual Polish Violations
- Static gray loading boxes (use shimmer skeleton with animation)
- Missing hover/active feedback on buttons, cards, or links
- `outline: none` without `:focus-visible` replacement
- Same duration for enter and exit transitions (exit should be 67-85% of enter)
- Spinner for content loading (use skeleton; spinner only for actions like form submit)
- `vh` units on mobile (use `dvh` for iOS Safari compatibility)
- Touch targets under 44px
- Modals on mobile (use bottom sheets instead)
- Hardcoded animation durations instead of design tokens
