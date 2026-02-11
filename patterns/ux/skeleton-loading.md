# Skeleton Loading Pattern

> Shimmer-based loading placeholders that match content layout.

## When to Use

| Pattern | Use For |
|---------|---------|
| **Skeleton shimmer** | Content loading — lists, cards, profiles, data tables |
| Spinner | Action feedback — form submit, save, delete (brief, ~1-3s) |
| Progress bar | File uploads, multi-step processes with known progress |

**Rule:** If the user is *waiting for content to appear*, use skeleton. If the user *triggered an action*, use spinner.

## Shimmer CSS

```css
.skeleton {
  background: linear-gradient(90deg, var(--color-gray-200) 25%, var(--color-gray-100) 50%, var(--color-gray-200) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}
@keyframes shimmer {
  to { background-position: -200% 0; }
}
```

## Skeleton Variants

### Line skeleton (text placeholders)

```svelte
<!-- Single line -->
<div class="skeleton h-4 w-3/4"></div>

<!-- Multi-line block -->
<div class="space-y-2">
  <div class="skeleton h-4 w-full"></div>
  <div class="skeleton h-4 w-5/6"></div>
  <div class="skeleton h-4 w-2/3"></div>
</div>
```

### Avatar skeleton

```svelte
<div class="skeleton h-10 w-10 rounded-full"></div>
```

### Card skeleton

```svelte
<div class="rounded-lg border p-4 space-y-3">
  <div class="skeleton h-40 w-full rounded-md"></div>
  <div class="skeleton h-5 w-3/4"></div>
  <div class="skeleton h-4 w-1/2"></div>
</div>
```

### List skeleton

```svelte
{#each Array(5) as _, i}
  <div class="flex items-center gap-3 p-3">
    <div class="skeleton h-10 w-10 rounded-full shrink-0"></div>
    <div class="flex-1 space-y-2">
      <div class="skeleton h-4 w-1/2"></div>
      <div class="skeleton h-3 w-3/4"></div>
    </div>
  </div>
{/each}
```

### Table skeleton

```svelte
<div class="space-y-2">
  {#each Array(6) as _}
    <div class="flex gap-4 p-3">
      <div class="skeleton h-4 w-1/4"></div>
      <div class="skeleton h-4 w-1/3"></div>
      <div class="skeleton h-4 w-1/4"></div>
      <div class="skeleton h-4 w-1/6"></div>
    </div>
  {/each}
</div>
```

## Configurable Skeleton Component

```svelte
<script lang="ts">
  interface Props {
    lines?: number;
    avatar?: boolean;
    card?: boolean;
  }

  let { lines = 3, avatar = false, card = false }: Props = $props();
</script>

{#if card}
  <div class="rounded-lg border p-4 space-y-3">
    <div class="skeleton h-40 w-full rounded-md"></div>
    <div class="skeleton h-5 w-3/4"></div>
    <div class="skeleton h-4 w-1/2"></div>
  </div>
{:else if avatar}
  <div class="flex items-center gap-3">
    <div class="skeleton h-10 w-10 rounded-full shrink-0"></div>
    <div class="flex-1 space-y-2">
      <div class="skeleton h-4 w-1/2"></div>
      <div class="skeleton h-3 w-3/4"></div>
    </div>
  </div>
{:else}
  <div class="space-y-2">
    {#each Array(lines) as _, i}
      <div class="skeleton h-4" style="width: {100 - i * 12}%"></div>
    {/each}
  </div>
{/if}
```

## Integration with Async Pattern

```svelte
{#await promise}
  <!-- Match skeleton shape to actual content layout -->
  <div class="space-y-2">
    <div class="skeleton h-6 w-3/4"></div>
    <div class="skeleton h-4 w-1/2"></div>
  </div>
{:then data}
  <h2>{data.title}</h2>
  <p>{data.description}</p>
{:catch error}
  <div role="alert" class="text-error">{error.message}</div>
{/await}
```

## Key Principle

**Skeleton shape should mirror actual content layout.** A card skeleton should have the same dimensions and arrangement as the loaded card. This reduces perceived layout shift and feels faster.

## Reduced Motion

The shimmer animation respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; }
}
```

## Related

- `rules/ui-polish.md` — Skeleton CSS definition
- `rules/ux-validation.md` — Canonical async component pattern
- `rules/animation-patterns.md` — Animation performance rules
