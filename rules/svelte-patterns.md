# Svelte 5 Patterns

> Auto-loaded rules for Svelte development. Prevents React/Angular anti-patterns.

## Required Patterns

| Pattern | Correct | Wrong |
|---------|---------|-------|
| Component props | `let { name }: Props = $props()` | `export let name` |
| Derived values | `const x = $derived(...)` | `$effect(() => { x = ... })` |
| Component state | `let count = $state(0)` | `const count = writable(0)` |
| Slots/children | `{@render children?.()}` with `Snippet` | `<slot />` |
| Two-way binding | `let { value = $bindable('') } = $props()` | `let { value, onChange }` |
| Cleanup | `$effect(() => { ...; return cleanup })` | Separate `onMount`/`onDestroy` |
| Context | `setContext('key', value)` | Provider wrapper components |
| Memoization | Trust Svelte compiler | `React.memo`, `useMemo` |

## $props Syntax

```svelte
<!-- CORRECT -->
<script lang="ts">
  interface Props { name: string; age?: number }
  let { name, age = 0 }: Props = $props();
</script>

<!-- WRONG: Type as argument -->
<script lang="ts">
  let props = $props<{ name: string }>();
</script>
```

## $effect Rules

- Use `$derived` for computed values, NEVER `$effect`
- `$effect` is ONLY for side effects (DOM manipulation, subscriptions, logging)
- Always return cleanup function for subscriptions

## Snippets (Svelte 5)

```svelte
<!-- Parent -->
<Card>
  {#snippet header()}
    <h2>Title</h2>
  {/snippet}
  Content here
</Card>

<!-- Card component -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  let { header, children }: { header?: Snippet; children?: Snippet } = $props();
</script>
<div class="card">
  {#if header}{@render header()}{/if}
  {@render children?.()}
</div>
```

## Store vs $state

- **$state**: Component-local state
- **Svelte stores**: Shared state across components
- Never use stores for component-local state

## Component Size Limits

| Threshold | Action |
|-----------|--------|
| **200+ lines** | Proactively split using folder structure pattern |
| **300 lines** | **Hard limit** (hook enforced). MUST decompose |

### Decomposition Pattern

Use component folder structure with `index.svelte` + sibling sub-components:

```
components/
  UserProfile/
    index.svelte        # Main component (re-exports, layout)
    ProfileHeader.svelte
    ProfileStats.svelte
    ProfileActions.svelte
```

- Barrel exports: only export top-level `index.svelte` from folder
- Sub-components are internal implementation details
- Reference: `patterns/ux/component-folder-structure.md`

## Component Reuse Checklist

Before creating a new component, check these locations in order:

1. **`ui/primitives/`** — Button, Input, Badge, Avatar, Icon
2. **`ui/compounds/`** — Card, FormField, SearchInput, DataTable
3. **`ui/patterns/`** — Modal, BottomSheet, Drawer, ConfirmDialog
4. **`features/shared/`** — EmptyState, SkeletonLoader, ErrorBoundary
5. **Extend existing** via snippet/prop before creating new component
