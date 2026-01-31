# Svelte Anti-Patterns

> React/Angular patterns that don't work in Svelte 5.

## Quick Reference

| Don't | Do Instead | Why |
|-------|------------|-----|
| Redux/NgRx stores | Svelte stores or `$state` | Built-in reactivity |
| `$effect` for derived values | `$derived` | Effects are for side effects |
| HOCs/Render props | Stores/context | No wrapper hell |
| React.memo/useMemo | Trust Svelte | No virtual DOM |
| PropTypes | TypeScript | Compile-time checking |
| Provider components | `setContext` directly | Simpler API |
| Slots (Svelte 4) | Snippets (Svelte 5) | Slots deprecated |

---

## Redux/NgRx Global State

**React/Angular**: Single source of truth with actions/reducers.

**Svelte**: Built-in reactivity with `$state` or simple stores.

```svelte
<!-- WRONG - Redux in Svelte -->
<script>
  import { useSelector, useDispatch } from 'some-redux';
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
</script>

<!-- CORRECT - Svelte stores -->
<script>
  import { user } from '$lib/stores/user';
</script>

{#if $user}
  <p>Welcome, {$user.name}</p>
{/if}
```

### Store Implementation

```typescript
// stores/user.ts
import { writable } from 'svelte/store';

function createUserStore() {
  const { subscribe, set } = writable(null);
  return {
    subscribe,
    login: (user) => set(user),
    logout: () => set(null)
  };
}

export const user = createUserStore();
```

---

## $effect for Derived Values

**React**: useEffect for everything.

**Svelte**: `$derived` for computed values, `$effect` ONLY for side effects.

```svelte
<!-- WRONG - Effect for derived value -->
<script>
  let firstName = $state('');
  let lastName = $state('');
  let fullName = $state('');

  $effect(() => {
    fullName = `${firstName} ${lastName}`;
  });
</script>

<!-- CORRECT - Use $derived -->
<script>
  let firstName = $state('');
  let lastName = $state('');

  const fullName = $derived(`${firstName} ${lastName}`);

  // $effect ONLY for actual side effects
  $effect(() => {
    document.title = `Hello ${fullName}`;
  });
</script>
```

---

## HOCs and Render Props

**React**: Share logic through wrapper components.

**Svelte**: Use stores or context directly.

```svelte
<!-- WRONG - HOC wrapper hell -->
<AuthProvider>
  <ThemeProvider>
    <DataProvider>
      <MyComponent />
    </DataProvider>
  </ThemeProvider>
</AuthProvider>

<!-- CORRECT - Direct store access -->
<script>
  import { auth } from '$lib/stores/auth';
  import { theme } from '$lib/stores/theme';
</script>

<MyComponent />
```

---

## Virtual DOM Optimizations

**React**: React.memo, useMemo, useCallback to prevent re-renders.

**Svelte**: Not needed. Svelte compiles reactivity at build time.

```svelte
<!-- WRONG - React-style memoization -->
<script>
  const memoizedData = memo(data);
  const handleClick = useCallback(() => {}, []);
</script>

<!-- CORRECT - Just write normal Svelte -->
<script>
  let count = $state(0);

  // Only use $derived.by() for ACTUALLY expensive computations
  const data = $derived.by(() => expensiveComputation(count));

  function handleClick() {
    console.log('clicked');
  }
</script>
```

---

## PropTypes Validation

**React**: Runtime type checking before TypeScript.

**Svelte**: Use TypeScript interfaces.

```svelte
<!-- WRONG - Runtime validation -->
<script>
  import { validateProps } from 'validation-lib';
  export let name;
  $: validateProps({ name }, schema);
</script>

<!-- CORRECT - TypeScript -->
<script lang="ts">
  interface Props {
    name: string;
    age?: number;
  }

  let { name, age = 0 }: Props = $props();
</script>
```

---

## Provider Components

**React**: Context.Provider wrapping components.

**Svelte**: Just use `setContext` in the parent.

```svelte
<!-- WRONG - Provider wrapper -->
<ThemeProvider theme="dark">
  <App />
</ThemeProvider>

<!-- CORRECT - setContext directly -->
<script>
  // In App.svelte or layout
  import { setContext } from 'svelte';
  setContext('theme', 'dark');
</script>

<!-- Child usage -->
<script>
  import { getContext } from 'svelte';
  const theme = getContext('theme');
</script>
```

---

## Svelte 5 Specific Anti-Patterns

### Using Stores When $state Suffices

```svelte
<!-- WRONG - Overkill for component state -->
<script>
  import { writable } from 'svelte/store';
  const count = writable(0);
</script>

<button onclick={() => $count++}>{$count}</button>

<!-- CORRECT - Use $state for component state -->
<script>
  let count = $state(0);
</script>

<button onclick={() => count++}>{count}</button>
```

### Using Slots Instead of Snippets

```svelte
<!-- WRONG - Deprecated slots -->
<Card>
  <slot name="header" />
  <slot />
</Card>

<!-- CORRECT - Snippets (Svelte 5) -->
<Card>
  {#snippet header()}
    <h2>Title</h2>
  {/snippet}
  Content here
</Card>
```

### In Component Receiving Snippets

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';

  let { header, children }: {
    header?: Snippet;
    children?: Snippet;
  } = $props();
</script>

<div class="card">
  {#if header}
    {@render header()}
  {/if}
  {@render children?.()}
</div>
```

### Not Using $bindable for Two-Way Binding

```svelte
<!-- WRONG - Manual two-way binding -->
<script>
  let { value, onValueChange } = $props();
</script>

<input value={value} oninput={(e) => onValueChange(e.target.value)} />

<!-- CORRECT - Use $bindable -->
<script>
  let { value = $bindable('') } = $props();
</script>

<input bind:value />
```

### Wrong $props Syntax

```svelte
<!-- WRONG - Type as argument (not supported) -->
<script lang="ts">
  let props = $props<{ name: string }>();
</script>

<!-- CORRECT - Destructure with type -->
<script lang="ts">
  let { name }: { name: string } = $props();
</script>
```

---

## Lifecycle Method Overuse

```svelte
<!-- WRONG - Separate onMount/onDestroy -->
<script>
  import { onMount, onDestroy } from 'svelte';

  let subscription;

  onMount(() => {
    subscription = subscribe();
  });

  onDestroy(() => {
    subscription?.unsubscribe();
  });
</script>

<!-- CORRECT - $effect with cleanup -->
<script>
  $effect(() => {
    const subscription = subscribe();
    return () => subscription.unsubscribe();
  });
</script>
```

---

## Related Docs

- [svelte-guide.md](../docs/frontend/svelte-guide.md) - Correct Svelte patterns
- [elixir.md](./elixir.md) - Backend anti-patterns
