# Pattern: Directional Screen Transitions

> Create app-like navigation with direction-aware animations that respond to forward/back navigation

## Problem

Web apps feel less polished than native apps because:
- Page transitions are abrupt or non-existent
- Forward and back navigation look identical
- Users lose spatial context when navigating

Native apps use directional cues:
- Forward: New screen slides in from right
- Back: Previous screen slides in from left

## Solution

Coordinate three layers:
1. **CSS animations** - Define forward/back keyframes
2. **sessionStorage** - Track navigation direction
3. **Screen component** - Read direction and apply appropriate animation class

## Example

### CSS Animations (app.css or tokens.css)

```css
/* Page transition keyframes */
@keyframes page-enter-forward {
  from {
    opacity: 0;
    transform: translateX(12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes page-enter-back {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-page-enter-forward {
  animation: page-enter-forward var(--duration-normal) cubic-bezier(0, 0, 0.2, 1) both;
}

.animate-page-enter-back {
  animation: page-enter-back var(--duration-normal) cubic-bezier(0, 0, 0.2, 1) both;
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .animate-page-enter-forward,
  .animate-page-enter-back {
    animation: none;
  }
}
```

### Navigation Direction Tracking

```typescript
// lib/utils/navigation.ts

export type NavDirection = 'forward' | 'back';

export function setNavDirection(direction: NavDirection): void {
  sessionStorage.setItem('navDirection', direction);
}

export function getNavDirection(): NavDirection {
  const direction = (sessionStorage.getItem('navDirection') as NavDirection) || 'forward';
  sessionStorage.removeItem('navDirection'); // Clear after reading
  return direction;
}
```

### Screen Component

```svelte
<!-- components/ui/layouts/Screen.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { getNavDirection, type NavDirection } from '$lib/utils/navigation';

  interface Props {
    padded?: boolean;
    children?: import('svelte').Snippet;
  }

  let { padded = true, children }: Props = $props();

  let direction: NavDirection = $state('forward');

  onMount(() => {
    direction = getNavDirection();
  });
</script>

<div
  class="min-h-screen bg-background {padded ? 'px-4 py-6' : ''}"
  class:animate-page-enter-forward={direction === 'forward'}
  class:animate-page-enter-back={direction === 'back'}
>
  {@render children?.()}
</div>
```

### App.js Integration

```javascript
// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
  sessionStorage.setItem('navDirection', 'back');
});

// Handle bfcache restoration
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});
```

### Setting Forward Direction on Navigation

```typescript
// In your navigation handler
export function liveNavigate(href: string): void {
  setNavDirection('forward');
  // ... perform navigation
}
```

## Animation Design Guidelines

| Direction | Transform | Meaning |
|-----------|-----------|---------|
| Forward | `translateX(12px)` → `translateX(0)` | Slide in from right |
| Back | `translateX(-12px)` → `translateX(0)` | Slide in from left |

- Keep translation small (8-16px) for subtle effect
- Use fast timing (150-200ms) for snappy feel
- Apply ease-out curve for natural deceleration
- Always respect `prefers-reduced-motion`

## When to Use

- PWA or mobile-first web applications
- Single-page apps with client-side routing
- LiveView applications with live navigation
- Any app where spatial navigation context matters

## When NOT to Use

- Traditional multi-page websites
- Applications where back button behavior is complex
- When reduced motion is the primary user base

## Tech Stack

`css` `svelte` `typescript` `pwa` `accessibility`

## Source

Discovered in: Syna / HOME-001
Date: 2026-01-20
