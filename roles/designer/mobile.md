# Designer Role - Mobile UX

> Platform-specific mobile patterns. Load when designing mobile features.

---

## Platform-Specific UX

| Component | iOS Consideration | Android Consideration |
|-----------|-------------------|----------------------|
| Upload progress | Show "Keep app open" message | Can show "Continues in background" |
| Haptic feedback | Not available (use visual feedback) | Available via Vibration API |
| Loading states | Skeleton + optimistic update | Same |
| Error states | Platform-appropriate messaging | Same |

---

## Upload UX Requirements

When designing upload features (images, videos, voice memos):

| Requirement | Design Guidance |
|-------------|-----------------|
| Progress indicator | Show percentage AND bytes (e.g., "45% - 2.3 MB / 5.1 MB") |
| Pause/Resume | Visible buttons, not hidden in menu |
| Status visibility | Clear badges: uploading, paused, failed |
| iOS guidance | Add "Keep app open for faster upload" text |
| Failed state | Red badge + "Retry" button, not just toast |
| Floating indicator | Shows on ALL pages during upload (SPA navigation) |

---

## Camera/Media UX Requirements

When designing camera or media capture features:

| Requirement | Design Guidance |
|-------------|-----------------|
| Permission request | Explain WHY before triggering browser prompt |
| Permission denied | Show helpful fallback (not just error) |
| Camera switch | Clear front/back toggle button |
| Capture feedback | Visual pulse (Android gets haptic, iOS doesn't) |
| Preview | Always show captured media before upload |

---

## When Haptics Aren't Available (iOS)

Design visual fallbacks for haptic-dependent interactions:

| Action | With Haptics | Without Haptics (iOS) |
|--------|--------------|----------------------|
| Button press | Haptic tap | Scale-down animation |
| Swipe action | Haptic notch | Visual resistance |
| Selection | Haptic tick | Checkmark animation |
| Error | Haptic buzz | Red flash + shake |
| Success | Haptic pulse | Green glow + scale |

---

## Gesture Patterns

### Swipe Actions

```
┌─────────────────────────────────────────┐
│  ← Swipe left: Delete (destructive)     │
│  → Swipe right: Archive (constructive)  │
│                                         │
│  Show action buttons on swipe           │
│  Return to closed on release            │
│  44px minimum swipe distance            │
└─────────────────────────────────────────┘
```

### Pull-to-Refresh

```
┌─────────────────────────────────────────┐
│  Pull distance: 80px to trigger         │
│  Visual: Spinner appears at 40px        │
│  Haptic: Tick when threshold reached    │
│  Release: Full refresh animation        │
│  Bounce: Natural elastic effect         │
└─────────────────────────────────────────┘
```

### Long-Press

```
┌─────────────────────────────────────────┐
│  Duration: 500ms to trigger             │
│  Visual: Scale down at 200ms            │
│  Haptic: Confirm tick at 500ms          │
│  Release: Context menu or preview       │
│  Cancel: Move finger >10px              │
└─────────────────────────────────────────┘
```

---

## Safe Areas

### iOS Notch/Dynamic Island

```
┌────────────────────────────────────────┐
│           ████████████                 │  <- Top safe: 47-59px
│                                        │
│                                        │
│          [CONTENT AREA]                │
│                                        │
│                                        │
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│  <- Bottom safe: 34px
│              ━━━━━                     │  <- Home indicator
└────────────────────────────────────────┘
```

### Implementation

```css
/* Use env() for safe areas */
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
padding-left: env(safe-area-inset-left);
padding-right: env(safe-area-inset-right);
```

---

## Offline UX Requirements

| State | UI Pattern |
|-------|------------|
| Online | No indicator (default) |
| Offline | Subtle banner at top, toast on action |
| Reconnecting | Pulse animation on indicator |
| Queued action | Badge count on tab/icon |
| Sync complete | Brief success toast |

### Offline Action Queue

```
┌─────────────────────────────────────────┐
│  📤 3 messages waiting to send          │
│                                         │
│  When online:                           │
│  - Auto-send in order                   │
│  - Show progress                        │
│  - Clear queue on success               │
│                                         │
│  On failure:                            │
│  - Keep in queue                        │
│  - Show retry option                    │
└─────────────────────────────────────────┘
```

---

## Form Design

### Single Column (Mobile)

```
┌─────────────────────────────────────────┐
│  Label                                  │
│  ┌─────────────────────────────────┐   │
│  │ Input                            │   │
│  └─────────────────────────────────┘   │
│  Helper text                            │
│                                         │
│  Label                                  │
│  ┌─────────────────────────────────┐   │
│  │ Input                            │   │
│  └─────────────────────────────────┘   │
│                                         │
│          ┌─────────────────┐            │
│          │   Submit (CTA)   │            │
│          └─────────────────┘            │
└─────────────────────────────────────────┘
```

### Form Field States

| State | Visual |
|-------|--------|
| Default | Border: muted |
| Focus | Border: primary, ring |
| Error | Border: destructive, message below |
| Success | Border: success, checkmark |
| Disabled | Opacity: 50%, cursor: not-allowed |

---

## Keyboard Behavior

| Situation | Design |
|-----------|--------|
| Input focus | Scroll field into view above keyboard |
| Form submit | Dismiss keyboard, show result |
| Numeric input | Show numeric keyboard (inputmode="numeric") |
| Email input | Show email keyboard (type="email") |
| Search input | Show search keyboard with "Search" button |
