# Pattern: Async Media Loading

> Polished image loading with lazy loading, fade-in animations, and graceful fallbacks.

## Problem

Raw `<img>` tags in lists and cards create poor UX:
- Images load all at once (no lazy loading)
- Content jumps when images pop in
- Broken images show ugly placeholder
- No loading indication while fetching

## Solution

A Svelte action that provides:
- Native lazy loading (`loading="lazy"`)
- Fade-in animation on load (respects reduced motion)
- Callback-based state management for loading/error
- Handles cached images (no flicker)

Combined with component state for skeleton placeholders and fallbacks.

## Example

### The asyncMedia Action

```typescript
// $lib/actions/asyncMedia.ts
export interface AsyncMediaOptions {
  fadeClass?: string;      // Default: 'animate-fade-in'
  loadingClass?: string;   // Default: 'opacity-0'
  lazy?: boolean;          // Default: true
  onload?: (detail: { loaded: boolean }) => void;
  onerror?: (detail: { error: boolean }) => void;
}

export function asyncMedia(node: HTMLImageElement, options: AsyncMediaOptions = {}) {
  const {
    fadeClass = 'animate-fade-in',
    loadingClass = 'opacity-0',
    lazy = true,
    onload,
    onerror,
  } = options;

  // Start hidden
  node.classList.add(loadingClass);

  // Enable native lazy loading
  if (lazy && !node.getAttribute('loading')) {
    node.loading = 'lazy';
  }

  function handleLoad() {
    node.classList.remove(loadingClass);
    node.classList.add(fadeClass);
    onload?.({ loaded: true });
  }

  function handleError() {
    node.classList.remove(loadingClass);
    onerror?.({ error: true });
  }

  // Handle already-cached images
  if (node.complete && node.naturalWidth > 0) {
    handleLoad();
  } else {
    node.addEventListener('load', handleLoad);
    node.addEventListener('error', handleError);
  }

  return {
    destroy() {
      node.removeEventListener('load', handleLoad);
      node.removeEventListener('error', handleError);
    },
  };
}
```

### Usage in List Item (Thumbnail)

```svelte
<script lang="ts">
  import { asyncMedia } from '$lib/actions';

  interface Props {
    imageUrl?: string | null;
    fallbackIcon: Component;
  }
  let { imageUrl, fallbackIcon: FallbackIcon }: Props = $props();

  let loaded = $state(false);
  let error = $state(false);

  // Show fallback if no URL or image failed
  const showFallback = $derived(!imageUrl || error);
</script>

<div class="relative w-12 h-12 rounded-lg overflow-hidden">
  <!-- Skeleton while loading -->
  {#if imageUrl && !loaded && !error}
    <div class="absolute inset-0 bg-muted animate-pulse"></div>
  {/if}

  <!-- Image with lazy loading -->
  {#if imageUrl && !error}
    <img
      src={imageUrl}
      alt=""
      use:asyncMedia={{
        lazy: true,
        onload: () => (loaded = true),
        onerror: () => (error = true),
      }}
      class="w-full h-full object-cover"
    />
  {/if}

  <!-- Fallback (no image or error) -->
  {#if showFallback}
    <div class="absolute inset-0 bg-muted flex items-center justify-center">
      <FallbackIcon class="w-6 h-6 text-muted-foreground" />
    </div>
  {/if}
</div>
```

### Usage in Hero (Eager Loading)

```svelte
<script lang="ts">
  import { asyncMedia } from '$lib/actions';

  let { coverUrl }: Props = $props();

  let loaded = $state(false);
  let error = $state(false);
</script>

<div class="relative w-full h-48">
  <!-- Skeleton -->
  {#if coverUrl && !loaded && !error}
    <div class="absolute inset-0 bg-muted animate-pulse"></div>
  {/if}

  <!-- Hero image - eager load (above fold) -->
  {#if coverUrl && !error}
    <img
      src={coverUrl}
      alt="Cover"
      use:asyncMedia={{
        lazy: false,  <!-- Hero is above fold, load immediately -->
        onload: () => (loaded = true),
        onerror: () => (error = true),
      }}
      class="w-full h-full object-cover"
    />
  {/if}

  <!-- Gradient fallback on error -->
  {#if !coverUrl || error}
    <div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5"></div>
  {/if}
</div>
```

## When to Use

**ALWAYS use this pattern for images.** Specifically:

- Thumbnails in lists (lazy load)
- Avatar images (lazy load)
- Hero/cover images (eager load - `lazy: false`)
- Card images (lazy load)
- Any user-uploaded or external images

## When NOT to Use

- Icons (use SVG components instead)
- Decorative images that are part of UI (use CSS)
- Images that are critical for initial render and tiny (inline as base64)

## Critical Implementation Notes

### Always Handle Three States

```svelte
<!-- 1. Loading state (skeleton) -->
{#if imageUrl && !loaded && !error}
  <Skeleton />
{/if}

<!-- 2. Success state (image) -->
{#if imageUrl && !error}
  <img use:asyncMedia />
{/if}

<!-- 3. Error/fallback state -->
{#if !imageUrl || error}
  <Fallback />
{/if}
```

### Lazy vs Eager Loading

```typescript
// Below fold (lists, cards) - lazy load
use:asyncMedia={{ lazy: true }}

// Above fold (hero, header) - eager load
use:asyncMedia={{ lazy: false }}
```

### Handle Cached Images

The action checks `node.complete` to handle browser-cached images:

```typescript
if (node.complete && node.naturalWidth > 0) {
  handleLoad(); // Already loaded from cache
}
```

### CSS Requirements

Ensure these classes exist:

```css
.animate-fade-in {
  animation: fadeIn 200ms ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: none;
    opacity: 1;
  }
}
```

## Anti-Patterns

### DON'T: Plain img tags

```svelte
<!-- ❌ BAD: No lazy loading, no fallback, no loading state -->
<img src={imageUrl} alt="" />
```

### DON'T: Missing error handling

```svelte
<!-- ❌ BAD: Broken image shows ugly icon -->
{#if imageUrl}
  <img src={imageUrl} use:asyncMedia />
{/if}
```

### DON'T: Missing loading state

```svelte
<!-- ❌ BAD: Content jumps when image loads -->
{#if imageUrl && !error}
  <img use:asyncMedia />
{:else}
  <Fallback />
{/if}
```

## Tech Stack

`svelte5` `typescript` `pwa` `ux` `accessibility`

## Source

Discovered in: Syna / HOME-002
Date: 2026-01-21
