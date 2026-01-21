# Pattern: Swipe-to-Close Drawer

> Mobile-native side drawer with swipe gesture support and safe area handling.

## Problem

Standard modal/drawer implementations lack mobile-native interactions:
- No swipe-to-dismiss gesture
- Safe areas not handled (notch, home indicator)
- Animation timing feels web-like, not native
- Body scroll not locked during open state

## Solution

A Svelte 5 drawer component with:
- Touch/mouse drag gesture tracking
- Threshold-based close on swipe
- CSS transitions with proper easing
- Safe area padding via `env()`
- Double `requestAnimationFrame` for smooth animation start

## Example

```svelte
<script>
  let {
    open = $bindable(false),
    side = 'left',
    title = '',
    children,
    onClose = () => {},
  } = $props();

  // Animation state
  let isVisible = $state(false);
  let isClosing = $state(false);
  let isAnimatingIn = $state(false);

  // Swipe gesture state
  let isDragging = $state(false);
  let dragStartX = $state(0);
  let dragCurrentX = $state(0);

  // Animation timing (native-feel)
  const ENTER_DURATION = 300;
  const EXIT_DURATION = 250;

  // Computed translateX for drag gesture
  const translateX = $derived.by(() => {
    if (isAnimatingIn || isClosing) {
      return side === 'left' ? '-100%' : '100%';
    }
    if (isDragging) {
      const delta = dragCurrentX - dragStartX;
      // Only allow dragging in close direction
      if (side === 'left' && delta < 0) {
        return `${Math.max(delta, -320)}px`;
      }
      if (side === 'right' && delta > 0) {
        return `${Math.min(delta, 320)}px`;
      }
    }
    return '0';
  });

  function handleClose() {
    if (isClosing) return;
    isClosing = true;
    document.body.style.overflow = '';

    setTimeout(() => {
      isClosing = false;
      isVisible = false;
      open = false;
      onClose();
    }, EXIT_DURATION);
  }

  function handleDragStart(e) {
    if (isClosing || isAnimatingIn) return;
    isDragging = true;
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    dragStartX = clientX;
    dragCurrentX = clientX;
  }

  function handleDragMove(e) {
    if (!isDragging) return;
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    dragCurrentX = clientX;
  }

  function handleDragEnd() {
    if (!isDragging) return;
    isDragging = false;

    const delta = dragCurrentX - dragStartX;
    const threshold = 80; // px

    // Close if dragged past threshold
    if ((side === 'left' && delta < -threshold) ||
        (side === 'right' && delta > threshold)) {
      handleClose();
    }
  }

  // Open/close effect with double rAF for smooth animation
  $effect(() => {
    if (open && !isVisible && !isClosing) {
      isVisible = true;
      isAnimatingIn = true;
      document.body.style.overflow = 'hidden';

      // Double rAF ensures DOM is ready before animation starts
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isAnimatingIn = false;
        });
      });
    } else if (!open && isVisible && !isClosing) {
      handleClose();
    }
  });

  // Cleanup on unmount
  $effect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  });
</script>

<svelte:window
  onkeydown={(e) => e.key === 'Escape' && open && handleClose()}
  onmousemove={isDragging ? handleDragMove : undefined}
  onmouseup={isDragging ? handleDragEnd : undefined}
  ontouchmove={isDragging ? handleDragMove : undefined}
  ontouchend={isDragging ? handleDragEnd : undefined}
/>

{#if isVisible}
  <!-- Backdrop -->
  <button
    type="button"
    class="fixed inset-0 z-40 bg-black transition-opacity"
    class:opacity-0={isClosing || isAnimatingIn}
    class:opacity-40={!isClosing && !isAnimatingIn}
    style="transition-duration: {isClosing ? EXIT_DURATION : ENTER_DURATION}ms;"
    onclick={handleClose}
    aria-label="Close drawer"
  ></button>

  <!-- Drawer Panel -->
  <div
    class="fixed inset-y-0 z-50 flex flex-col bg-white shadow-xl"
    class:left-0={side === 'left'}
    class:right-0={side === 'right'}
    class:transition-transform={!isDragging}
    style="
      width: min(320px, 85vw);
      transform: translateX({translateX});
      transition-duration: {isDragging ? '0ms' : (isClosing ? EXIT_DURATION : ENTER_DURATION) + 'ms'};
    "
    role="dialog"
    aria-modal="true"
    ontouchstart={handleDragStart}
  >
    <!-- Safe area top -->
    <div style="padding-top: env(safe-area-inset-top, 0);"></div>

    <!-- Content -->
    {@render children?.()}

    <!-- Safe area bottom -->
    <div style="padding-bottom: env(safe-area-inset-bottom, 0);"></div>
  </div>
{/if}
```

## When to Use

- Mobile-first PWA requiring native-feel interactions
- Side navigation or filter drawers
- Any slide-in panel that benefits from gesture dismissal

## When NOT to Use

- Desktop-only applications (swipe is mobile-centric)
- Drawers with critical forms (accidental swipe could lose data)
- Bottom sheets (use a different gesture pattern)

## Critical Implementation Notes

### Double requestAnimationFrame

```typescript
// Single rAF may not be enough - browser might batch
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    isAnimatingIn = false; // Now safe to animate
  });
});
```

**Why:** The first rAF schedules work after current frame. The second ensures the DOM has painted the initial state before transitioning.

### Transition Duration Toggle

```typescript
// Disable transitions during drag for responsive feel
style="transition-duration: {isDragging ? '0ms' : DURATION + 'ms'};"
```

### Safe Area Handling

```css
.pt-safe { padding-top: env(safe-area-inset-top, 0); }
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 0); }
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  [data-testid='drawer-panel'] {
    transition-duration: 0ms !important;
  }
}
```

## Tech Stack

`svelte5` `typescript` `pwa` `mobile` `gestures` `accessibility`

## Source

Discovered in: Syna / HOME-002
Date: 2026-01-21
