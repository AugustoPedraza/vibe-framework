# Pattern: LiveView Navigation with Direction Tracking

> Enable smooth, app-like navigation in LiveView+Svelte apps with directional screen transitions

## Problem

Standard `<a>` tags in Svelte components cause full page reloads, which:
- Disconnect the WebSocket and reconnect (slow)
- Lose application state
- Create a jarring visual experience
- Don't support directional animations (forward vs back)

## Solution

Create a navigation utility that:
1. Intercepts link clicks
2. Uses LiveView's `pushHistoryPatch` for WebSocket-based navigation
3. Tracks navigation direction in sessionStorage
4. Coordinates with CSS animations for directional transitions

## Example

### Navigation Utility

```typescript
// lib/utils/navigation.ts

interface LiveSocket {
  pushHistoryPatch: (
    event: Event,
    href: string,
    linkState: 'push' | 'replace',
    targetEl: Element | null
  ) => void;
}

declare global {
  interface Window {
    liveSocket?: LiveSocket;
  }
}

export type NavDirection = 'forward' | 'back';

export function setNavDirection(direction: NavDirection): void {
  sessionStorage.setItem('navDirection', direction);
}

export function getNavDirection(): NavDirection {
  const direction = (sessionStorage.getItem('navDirection') as NavDirection) || 'forward';
  sessionStorage.removeItem('navDirection'); // Clear after reading
  return direction;
}

export function liveNavigate(href: string, options: { replace?: boolean } = {}): void {
  const liveSocket = window.liveSocket;

  if (!liveSocket) {
    console.warn('[navigation] LiveSocket not available, using regular navigation');
    window.location.href = href;
    return;
  }

  setNavDirection('forward');
  const linkState = options.replace ? 'replace' : 'push';
  const event = new CustomEvent('phx:live-navigate');
  liveSocket.pushHistoryPatch(event, href, linkState, null);
}

export function handleLiveClick(event: MouseEvent): void {
  const target = event.currentTarget as HTMLAnchorElement;

  if (!target?.href) return;

  // Don't intercept modified clicks (new tab, etc.)
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (event.button !== 0) return;

  event.preventDefault();
  liveNavigate(target.href);
}
```

### Usage in Svelte Component

```svelte
<script>
  import { handleLiveClick } from '$lib/utils/navigation';
</script>

<a href="/items/{item.id}" onclick={handleLiveClick}>
  {item.name}
</a>
```

### Back Button Handling (app.js)

```javascript
// Handle back button with bfcache support
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Page restored from bfcache - reload to sync state
    window.location.reload();
  }
});

window.addEventListener('popstate', () => {
  // Browser back/forward - set direction for animations
  sessionStorage.setItem('navDirection', 'back');
});
```

## When to Use

- LiveView applications with Svelte components
- When you want app-like navigation without full page reloads
- When you need directional screen transitions (forward/back)
- PWA applications where smooth transitions matter

## When NOT to Use

- Server-rendered pages without LiveView
- When you need full page reloads (e.g., to clear state)
- External links (the utility falls back automatically)

## Tech Stack

`phoenix` `liveview` `livesvelte` `svelte` `typescript` `pwa`

## Source

Discovered in: Syna / HOME-001
Date: 2026-01-20
