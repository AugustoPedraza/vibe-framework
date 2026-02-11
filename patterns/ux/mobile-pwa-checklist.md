# Mobile / PWA Checklist Pattern

> Actionable audit checklist for mobile-first and PWA features. Load when building responsive or offline-capable features.

## Touch Target Audit

- [ ] All interactive elements >= **44x44px** (`min-h-11 min-w-11`)
- [ ] **8px minimum gap** between adjacent touch targets
- [ ] Icon-only buttons have sufficient padding (not just icon size)
- [ ] Small text links have adequate tap area (use padding, not just text)
- [ ] Checkbox/radio inputs have label-wrapped tap area (not just the input)

### Common violations

| Tailwind class | Computed size | Fix |
|---------------|---------------|-----|
| `h-8 w-8` | 32x32px | Use `h-11 w-11` or `min-h-11 min-w-11` |
| `p-2` on icon button | ~36x36px | Use `p-2.5` or `p-3` |
| `text-sm` link | ~20px tall | Wrap in `py-2` container |

## Safe Area Audit

- [ ] Top edge accounts for notch: `padding-top: env(safe-area-inset-top)`
- [ ] Bottom edge accounts for home indicator: `padding-bottom: env(safe-area-inset-bottom)`
- [ ] Landscape mode accounts for side insets
- [ ] Fixed bottom bars use safe area padding
- [ ] No content hidden behind system UI

### CSS pattern

```css
.app-shell {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

## Viewport Audit

- [ ] No horizontal scroll on any screen size (375px minimum)
- [ ] Uses `dvh` not `vh` for full-height layouts (iOS Safari)
- [ ] Meta viewport tag: `width=device-width, initial-scale=1`
- [ ] No `user-scalable=no` (accessibility violation)
- [ ] Images and media have `max-width: 100%`
- [ ] Tables use horizontal scroll wrapper or responsive layout
- [ ] Long text/URLs use `overflow-wrap: break-word`

### Viewport units

| Avoid | Use | Reason |
|-------|-----|--------|
| `100vh` | `100dvh` | iOS Safari address bar changes height |
| `vh` in calc | `dvh` in calc | Same iOS Safari issue |
| `vw` without overflow | `min(100vw, 100%)` | Scrollbar may cause overflow |

## Offline Audit (PWA)

- [ ] Service worker registered and active
- [ ] Critical assets cached (app shell, CSS, JS)
- [ ] API responses cached with stale-while-revalidate
- [ ] Offline fallback page exists
- [ ] User actions queue when offline (optimistic updates)
- [ ] Network status indicator shown when offline
- [ ] Cached data has TTL and invalidation strategy

### Offline UI pattern

```svelte
<script>
  const online = $state(navigator.onLine);

  $effect(() => {
    const goOnline = () => online = true;
    const goOffline = () => online = false;
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  });
</script>

{#if !online}
  <div role="status" class="bg-warning text-warning-foreground text-center py-2 text-sm">
    You're offline. Changes will sync when reconnected.
  </div>
{/if}
```

## Performance Audit

- [ ] Images optimized (WebP/AVIF, appropriate dimensions, lazy loaded)
- [ ] Code split by route (dynamic imports)
- [ ] Fonts: `font-display: swap`, subset if possible
- [ ] No render-blocking resources above the fold
- [ ] Lists virtualized if >50 items
- [ ] Heavy computations deferred with `requestIdleCallback`

## Gesture Audit

- [ ] No swipe gestures that conflict with browser back/forward (edges)
- [ ] Pull-to-refresh contained: `overscroll-behavior: contain` on scrollable areas
- [ ] Custom gestures have fallback tap/click alternatives
- [ ] No gesture-only interactions (accessibility: keyboard/button alternative)
- [ ] Scroll containers: `-webkit-overflow-scrolling: touch` for momentum

## Responsive Layout Checklist

| Breakpoint | Target | Key checks |
|------------|--------|------------|
| 375px | Small phone | No horizontal scroll, readable text, touch targets |
| 428px | Large phone | Same + bottom sheet vs modal |
| 768px | Tablet | Side panel vs full-screen, grid layout |
| 1280px | Desktop | Max content width, hover states active |

## Related

- `rules/ui-polish.md` — Mobile/PWA section
- `rules/pwa-patterns.md` — Service worker and caching rules
- `rules/accessibility.md` — Touch and gesture accessibility
