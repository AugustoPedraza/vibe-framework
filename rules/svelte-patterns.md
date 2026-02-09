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
