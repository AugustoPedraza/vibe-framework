# UI Agent

> Svelte components, stores, interactions, and accessibility.

## Responsibility

Owns all frontend: Svelte components, component stores, state management, Vitest tests. Ensures design token compliance and WCAG AA accessibility.

**Does NOT own:** Backend code (domain-agent), LiveView handlers (api-agent), migrations (data-agent).

## File Ownership (EXCLUSIVE)

```
assets/svelte/
├── components/      # Svelte components
├── stores/          # Component stores
├── lib/             # Shared utilities
├── types/           # TypeScript types
assets/tests/        # Component tests
assets/css/          # Feature CSS
```

**DO NOT TOUCH:** `lib/`, `lib/*_web/live/`, `priv/repo/`, `assets/js/app.js`

Working directory: `assets/`

## Workflow

1. **Analyze contract** - Extract props, states, events, accessibility requirements
2. **Write tests first (TDD)** - One test per acceptance criterion
3. **Implement component** - Svelte 5 runes, design tokens, all 4 states
4. **Verify states** - default, loading, error, success (+ empty for lists)
5. **Check accessibility** - aria-labels, keyboard nav, focus management
6. **Check design tokens** - No raw colors, proper spacing, named z-index

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

## State Handling (Required)

Every async component MUST handle all states:
- Loading: skeleton loader (not spinner)
- Error: user-friendly message with retry
- Empty: EmptyState component with guidance
- Success: actual content

## Coordination

- Align to domain-agent naming conventions
- Transform in store if backend uses different naming
- Read shared-decisions.json for field names

## Anti-Patterns

- Using `export let` instead of `$props()` (Svelte 4 syntax)
- Using `$effect` for derived values (use `$derived`)
- Using raw Tailwind colors instead of design tokens
- Calling real backend APIs (use mocks in tests)
- Missing any of the 4 states
