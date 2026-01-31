# Async Media Pattern

> Polished image loading with fade-in transitions.

## Quick Reference

| Use Case | Pattern |
|----------|---------|
| Avatar with fallback | Layer image over initials, fade in |
| Cover/Hero image | Skeleton placeholder, fade in |
| Gallery images | Lazy load, fade in |

## The Action

```svelte
<img use:asyncMedia={{ onload, onerror }}>
```

**Location**: `assets/svelte/lib/actions/asyncMedia.ts`

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `fadeClass` | `'animate-fade-in'` | Class applied when image loads |
| `loadingClass` | `'opacity-0'` | Class applied during loading |
| `lazy` | `true` | Set `loading="lazy"` attribute |
| `onload` | - | Callback when image loads successfully |
| `onerror` | - | Callback when image fails to load |

## Callback Parameters

Both callbacks receive an `AsyncMediaEventDetail` object:

```typescript
interface AsyncMediaEventDetail {
  loaded: boolean;
  error: boolean;
  naturalWidth?: number;
  naturalHeight?: number;
}
```

## Patterns

### Avatar (Initials Fallback)

Initials are always rendered as background; image fades in on top.

```svelte
<script>
  import { asyncMedia } from '$lib/actions';

  let error = $state(false);
</script>

<div class="relative">
  <!-- Always visible as fallback -->
  <div class="initials">{initials}</div>

  <!-- Fades in over initials -->
  {#if src && !error}
    <img
      {src}
      use:asyncMedia={{ onerror: () => (error = true) }}
      class="absolute inset-0"
    />
  {/if}
</div>
```

### Cover (Skeleton Fallback)

Skeleton shown during load; image fades in when ready.

```svelte
<script>
  import { asyncMedia } from '$lib/actions';

  let loaded = $state(false);
  let error = $state(false);
</script>

<!-- Skeleton while loading -->
{#if coverUrl && !loaded && !error}
  <div class="bg-muted animate-pulse absolute inset-0"></div>
{/if}

<!-- Image with async loading (no lazy for above-fold) -->
{#if coverUrl && !error}
  <img
    src={coverUrl}
    use:asyncMedia={{
      lazy: false,
      onload: () => (loaded = true),
      onerror: () => (error = true)
    }}
  />
{/if}
```

### Gallery (Lazy Loading)

Default lazy loading for off-screen images.

```svelte
{#each images as image}
  <img
    src={image.url}
    alt={image.alt}
    use:asyncMedia={{ onerror: () => handleError(image.id) }}
  />
{/each}
```

## Animation Tokens

The action uses existing design tokens:

- **Duration**: `--duration-normal` (200ms)
- **Easing**: `--ease-primary`
- **Class**: `animate-fade-in` (respects reduced motion)

```css
/* From tokens.css */
.animate-fade-in {
  animation: fade-in var(--duration-normal) var(--ease-primary) both;
}

/* Reduced motion: animations disabled automatically */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: none;
  }
}
```

## Why an Action (not a Component)

1. **Composable**: Works with any `<img>` element
2. **Non-breaking**: Existing components just add `use:asyncMedia`
3. **Flexible**: Each component keeps its own placeholder logic
4. **Consistent**: All actions follow same pattern in `$lib/actions`

## Related

- [async-media-loading.md](./async-media-loading.md) - Full media loading pattern
- [../../anti-patterns/animations.md](../../anti-patterns/animations.md) - Animation anti-patterns
