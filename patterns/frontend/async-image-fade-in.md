# Pattern: Async Image Fade-In

> Smooth fade-in transition when asynchronously loaded images complete loading

## Problem

When images load asynchronously (lazy loading, dynamic src), they appear abruptly causing visual jarring. Users see either:
- A flash when the image pops in
- Content layout shifts
- No feedback during loading

## Solution

Track image loaded state and apply CSS opacity transition:
1. Start image at `opacity-0`
2. Use `asyncMedia` action to detect load completion
3. Transition to `opacity-100` when loaded
4. Skeleton/placeholder remains visible until fade completes

## Example

```svelte
<script>
  import { cn } from '$lib/utils';
  import { asyncMedia } from '$lib/actions';

  let { src, alt = '' } = $props();

  let loaded = $state(false);
  let error = $state(false);
</script>

<!-- Skeleton placeholder (always rendered behind) -->
<div class="absolute inset-0 bg-muted animate-pulse"></div>

<!-- Image with fade-in -->
{#if src && !error}
  <img
    {src}
    {alt}
    use:asyncMedia={{
      lazy: true,
      onload: () => (loaded = true),
      onerror: () => (error = true)
    }}
    class={cn(
      'w-full h-full object-cover',
      'transition-opacity duration-normal',
      loaded ? 'opacity-100' : 'opacity-0'
    )}
  />
{/if}
```

### For Avatar with Initials Fallback

```svelte
<script>
  let loaded = $state(false);
  let error = $state(false);
</script>

<!-- Initials always rendered as background -->
<div class="flex items-center justify-center bg-muted">
  {initials}
</div>

<!-- Image overlaid with fade-in -->
{#if src && !error}
  <img
    {src}
    {alt}
    use:asyncMedia={{
      onload: () => (loaded = true),
      onerror: () => (error = true)
    }}
    class={cn(
      'absolute inset-0 transition-opacity duration-normal',
      loaded ? 'opacity-100' : 'opacity-0'
    )}
  />
{/if}
```

## When to Use

- Lazy-loaded images (thumbnails, avatars, covers)
- Dynamic image sources that may change
- Any image where load timing is unpredictable
- Images that appear above skeleton content

## When NOT to Use

- Static images bundled with the app
- Images that must be visible immediately (critical above-fold)
- Very small icons where fade would be imperceptible

## Tech Stack

`svelte5` `typescript` `css-transitions` `pwa`

## Source

Discovered in: Syna / CONV-001
Date: 2026-01-21
