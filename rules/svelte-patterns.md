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

## Dynamic Styles

> Default to Tailwind utility classes. Only use `style:` directives when the value is unknowable at build time.

### Decision Tree

1. **Can I use a Tailwind class?** → Use it. Done.
2. **Is it a toggle between known states?** → `class:bg-primary={active}`. Done.
3. **Is the value dynamic but needs Tailwind variants (hover/focus/responsive)?** → CSS custom property bridge:
   ```svelte
   <div style:--brand={user.color} class="bg-(--brand) hover:opacity-80">
   ```
4. **Is it runtime data (position, dimension, percentage)?** → `style:` directive:
   ```svelte
   <div style:width="{percent}%" style:transform="translateY({offset}px)">
   ```
5. **Is it a complex computed value?** → `$derived` + `style:` directive.

### Correct vs Wrong

```svelte
<!-- CORRECT: Dynamic data via style: directive -->
<div class="h-2 bg-primary rounded-full" style:width="{progress}%">

<!-- CORRECT: CSS custom property bridge for theming -->
<div style:--brand={theme.primary} class="bg-(--brand) text-(--on-brand)">

<!-- CORRECT: Computed position (drag, scroll, virtualized list) -->
<div class="fixed pointer-events-none z-toast"
     style:transform="translate3d({x}px, {y}px, 0)">

<!-- CORRECT: Dynamic grid from data -->
<div class="grid gap-4" style:grid-template-columns="repeat({cols}, minmax(0, 1fr))">

<!-- WRONG: Hardcoded value that should be a Tailwind class -->
<div style:color="red">
<div style="padding: 16px">
<div style:background-color="#3b82f6">

<!-- WRONG: Static value via style attribute -->
<div style="display: flex; gap: 1rem">  <!-- use class="flex gap-4" -->

<!-- WRONG: Known set that should be a class map -->
<div style:width={size === 'sm' ? '32px' : '64px'}>
<!-- use instead: -->
<div class={size === 'sm' ? 'w-8' : 'w-16'}>
```

### When `style:` Directives Are Correct

| Use case | Pattern | Why |
|----------|---------|-----|
| Progress bars | `style:width="{pct}%"` | Value is data, not design |
| Drag & drop | `style:transform="translate3d(…)"` | Pointer-driven coordinates |
| Charts/SVG | SVG attrs (`x`, `y`, `width`) | Native SVG API |
| User themes | `style:--color-primary={val}` at container | Tokens cascade to children |
| Virtualized lists | `style:transform="translateY(…)"` | Computed row positions |
| Bottom sheets | `style:height="{snap}dvh"` | Gesture-driven snap points |
| Dynamic grids | `style:grid-template-columns` | Data-driven column count |

### When `style:` Directives Are Wrong

Use Tailwind classes or class maps instead:

| Use case | Wrong | Correct |
|----------|-------|---------|
| Avatar sizes | `style:width="32px"` | `class={sizeMap[size]}` with `w-8`/`w-10`/`w-12` |
| Static layout | `style="display: flex"` | `class="flex"` |
| Known colors | `style:color="red"` | `class="text-error"` |
| Spacing | `style="padding: 8px"` | `class="p-2"` |
| Toast stacking | `style:gap="8px"` | `class="gap-2"` |
| Skeletons | `style:background="linear-gradient(…)"` | Scoped `<style>` with `@keyframes` |

### ESLint: Disabling for Justified Uses

When `style:` is the correct tool, add an `eslint-disable` with justification:

```svelte
<!-- eslint-disable-next-line svelte/no-inline-styles -- Dynamic progress from API data -->
<div class="h-2 bg-primary rounded-full" style:width="{progress}%">
```

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
