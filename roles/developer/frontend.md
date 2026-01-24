# Developer Role - Frontend

> Svelte 5 and TypeScript patterns. Load when doing frontend work.

---

## Svelte 5 Runes Pattern

```svelte
<script lang="ts">
  // Props with TypeScript interface
  interface Props {
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    onclick?: () => void;
  }

  let {
    variant = 'primary',
    size = 'md',
    disabled = false,
    onclick
  }: Props = $props();

  // Local reactive state
  let count = $state(0);
  let loading = $state(false);

  // Derived (computed) values
  const isValid = $derived(count > 0 && !disabled);
  const buttonText = $derived(loading ? 'Loading...' : 'Submit');
</script>
```

---

## Runes Guidelines

### $state for Local, $props for External

Clear separation of owned vs passed data:

```svelte
<script>
  // External - owned by parent
  let { items, onSelect } = $props();

  // Local - owned by this component
  let selectedIndex = $state(0);
  let isExpanded = $state(false);
</script>
```

### $derived for Computed Values

Never compute in render; use $derived:

```svelte
<script>
  let { items, filter } = $props();

  // WRONG: Computed in template
  // {#each items.filter(i => i.active) as item}

  // RIGHT: $derived
  const filteredItems = $derived(items.filter(i => i.active));
</script>

{#each filteredItems as item}
```

### $effect for Side Effects

Effects run after DOM updates; don't use for derived values:

```svelte
<script>
  let count = $state(0);

  // RIGHT: Sync external system
  $effect(() => {
    localStorage.setItem('count', count.toString());
  });

  // WRONG: Use $derived instead
  // $effect(() => { doubled = count * 2; });
</script>
```

---

## CVA for Component Variants

```svelte
<script lang="ts">
  import { cva } from 'class-variance-authority';
  import { cn } from '$lib/utils';

  const buttonVariants = cva(
    // Base classes (always applied)
    'inline-flex items-center justify-center font-medium transition-colors',
    {
      variants: {
        variant: {
          primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
          secondary: 'bg-secondary text-secondary-foreground',
          ghost: 'hover:bg-accent'
        },
        size: {
          sm: 'h-8 px-3 text-sm',
          md: 'h-10 px-4',
          lg: 'h-12 px-6 text-lg'
        }
      },
      defaultVariants: {
        variant: 'primary',
        size: 'md'
      }
    }
  );
</script>

<button class={cn(buttonVariants({ variant, size }), className)}>
  {children}
</button>
```

---

## Store Factory Pattern

```typescript
import { writable, derived, type Readable } from 'svelte/store';

// Encapsulated store with methods
export const createCounterStore = (initial = 0) => {
  const { subscribe, set, update } = writable(initial);

  return {
    subscribe,
    increment: () => update(n => n + 1),
    decrement: () => update(n => n - 1),
    reset: () => set(initial)
  };
};

// Derived stores for computed values
export const isPositive: Readable<boolean> = derived(
  counter,
  $count => $count > 0
);
```

---

## Accessibility First

```svelte
<!-- Every interactive element needs: -->
<button
  type="button"
  aria-label="Close dialog"
  aria-pressed={isPressed}
  disabled={isLoading}
  onclick={handleClick}
>
  <Icon name="x" aria-hidden="true" />
</button>

<!-- Form fields with proper labeling -->
<label for="email">Email</label>
<input
  id="email"
  type="email"
  aria-invalid={hasError}
  aria-describedby={hasError ? 'email-error' : undefined}
/>
{#if hasError}
  <p id="email-error" role="alert">Please enter a valid email</p>
{/if}
```

---

## Handling Async States from LiveView

```svelte
<script>
  let { messages, live } = $props();
</script>

{#if messages.status === 'loading'}
  <Skeleton variant="card" />
{:else if messages.status === 'error'}
  <EmptyState preset="error" title="Couldn't load" />
{:else if messages.data.length === 0}
  <EmptyState preset="default" title="No messages" />
{:else}
  {#each messages.data as message}
    <MessageBubble {message} />
  {/each}
{/if}
```

---

## Component Patterns

### Callback Props Over Events

```svelte
<script>
  // WRONG: Old dispatcher pattern
  // const dispatch = createEventDispatcher();
  // dispatch('select', item);

  // RIGHT: Callback props
  let { onSelect } = $props();

  function handleClick(item) {
    onSelect?.(item);
  }
</script>
```

### Slots for Content

```svelte
<!-- WRONG: Content as prop -->
<Alert message="<strong>Warning</strong>: Check input" />

<!-- RIGHT: Slot -->
<Alert>
  <strong>Warning</strong>: Check input
</Alert>
```

---

## Tailwind Patterns

### Design Tokens Only

```svelte
<!-- WRONG: Raw Tailwind colors -->
<div class="bg-blue-500 text-gray-600 border-slate-200">

<!-- CORRECT: Use design tokens -->
<div class="bg-primary text-muted border-border">
```

### Z-Index Tokens

| Token | Value | Use For |
|-------|-------|---------|
| `z-base` | 0 | Default content |
| `z-dropdown` | 100 | Dropdowns, menus |
| `z-sticky` | 200 | Sticky headers |
| `z-overlay` | 300 | Overlays, backdrops |
| `z-modal` | 400 | Modals, dialogs |
| `z-toast` | 600 | Toast notifications |

### Standard Spacing

Only these values: `0`, `0.5`, `1`, `2`, `3`, `4`, `6`, `8`, `12`, `16`, `20`, `24`

```svelte
<!-- Use these -->
<div class="p-4 m-6 gap-8">

<!-- These don't exist -->
<div class="p-5 m-7 gap-9">
```

### Class Ordering

Position from outside-in:

```html
<!-- RIGHT: Concentric order -->
<!-- Layout → Positioning → Box Model → Borders → Background → Typography → Effects -->
<div class="flex items-center p-4 rounded-lg bg-primary text-white shadow-md">
```

### Never Construct Dynamic Classes

```typescript
// WRONG: Tailwind can't detect these
const color = 'red';
<div class={`bg-${color}-500`}>

// RIGHT: Use complete class names
const colorClasses = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
};
<div class={colorClasses[color]}>
```

---

## Existing Stores (Use These)

| Store | Purpose | When to Use |
|-------|---------|-------------|
| `connectionStore` | Socket connection state | Show offline indicator |
| `realtimeStore` | Sync with PubSub | Messages, live updates |
| `offlineStore` | Queue actions for retry | Save to IndexedDB when offline |
| `visibilityStore` | Page focus state | Pause animations when hidden |
| `pwaStore` | Install prompt state | Show "install app" banner |

---

## Mobile/PWA Considerations

### Platform Check

```typescript
// CORRECT: Check before using
if ('vibrate' in navigator) {
  navigator.vibrate(pattern);
}

// WRONG: Assume availability
navigator.vibrate(pattern); // Crashes on iOS
```

### Safe Viewport Height

```svelte
<!-- WRONG: 100vh on mobile -->
<div class="h-[100vh]">

<!-- CORRECT: Dynamic viewport height -->
<div class="h-dvh">
```

### Scroll Container

```svelte
<!-- WRONG: Scroll container without overscroll -->
<div class="overflow-y-auto">

<!-- CORRECT: Prevent scroll bleed -->
<div class="overflow-y-auto overscroll-contain">
```
