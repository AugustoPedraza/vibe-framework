# PWA Anti-Patterns

> Mobile and offline patterns to avoid.

## Quick Reference

| Don't | Do Instead | Why |
|-------|------------|-----|
| Assume always online | Design offline-first | Mobile networks unreliable |
| Show spinners | Show skeletons | Native apps show structure |
| Block UI during fetch | Optimistic updates | Feels slow otherwise |
| Forget error/empty states | Handle all states | Crashes look unprofessional |
| Small touch targets | 44x44px minimum | Fat finger problem |
| Ignore safe areas | Use env() | Notches exist |

---

## Assuming Always Online

**Don't**: Build like users are always connected.

**Do**: Design for intermittent connectivity.

```svelte
<!-- WRONG - Assumes online -->
<script>
  async function sendMessage(content) {
    await live?.pushEventAsync('send', { content });
  }
</script>

<!-- CORRECT - Offline-aware -->
<script>
  import { connectionStore } from '$lib/stores/connection';
  import { offlineQueue } from '$lib/stores/offline';

  async function sendMessage(content) {
    // Optimistic update
    messages = [...messages, { content, status: 'pending' }];

    if (!$connectionStore.connected) {
      offlineQueue.add('send', { content });
      return;
    }

    try {
      await live?.pushEventAsync('send', { content });
    } catch (e) {
      offlineQueue.add('send', { content });
    }
  }
</script>
```

---

## Spinners for Content Loading

**Don't**: Show generic spinners while content loads.

**Do**: Show skeleton loaders that match content structure.

```svelte
<!-- WRONG - Spinner -->
{#if loading}
  <div class="spinner" />
{:else}
  <Card title={data.title} />
{/if}

<!-- CORRECT - Skeleton -->
{#if loading}
  <Skeleton variant="card" />
{:else}
  <Card title={data.title} />
{/if}
```

### Loading State Timing

| Duration | Show |
|----------|------|
| 0-100ms | Nothing |
| 100-300ms | Button spinner |
| 300ms+ | Skeleton loader |

---

## Blocking UI During Fetch

**Don't**: Make users wait for server confirmation.

**Do**: Update UI immediately with optimistic state.

```svelte
<!-- WRONG - Blocking -->
<script>
  let loading = $state(false);

  async function likePost() {
    loading = true;
    await live?.pushEventAsync('like', { id });
    loading = false;
  }
</script>

<button disabled={loading} onclick={likePost}>
  {loading ? 'Liking...' : 'Like'}
</button>

<!-- CORRECT - Optimistic -->
<script>
  let liked = $state(false);

  async function likePost() {
    liked = true;  // Immediate feedback
    haptic('light');

    try {
      await live?.pushEventAsync('like', { id });
    } catch (e) {
      liked = false;  // Rollback on error
    }
  }
</script>

<button onclick={likePost}>
  {liked ? 'Liked' : 'Like'}
</button>
```

---

## Missing Error/Empty States

**Don't**: Only handle the happy path.

**Do**: Handle loading, error, empty, and success states.

```svelte
<!-- WRONG - Only success state -->
{#each items as item}
  <ItemCard {item} />
{/each}

<!-- CORRECT - All states -->
{#if loading}
  <Skeleton variant="list" count={3} />
{:else if error}
  <EmptyState preset="error" title="Failed to load">
    <Button onclick={retry}>Try again</Button>
  </EmptyState>
{:else if items.length === 0}
  <EmptyState preset="default" title="No items yet" />
{:else}
  {#each items as item}
    <ItemCard {item} />
  {/each}
{/if}
```

---

## Small Touch Targets

**Don't**: Make buttons smaller than 44x44px.

**Do**: Ensure all tappable elements are touch-friendly.

```css
/* WRONG - Too small */
.icon-button {
  width: 24px;
  height: 24px;
}

/* CORRECT - Touch-friendly */
.icon-button {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Touch Target Checklist

| Element | Minimum | Spacing |
|---------|---------|---------|
| Buttons | 44x44px | 8px apart |
| List items | 48px height | - |
| Form inputs | 44px height | 12px apart |

---

## Ignoring Safe Areas

**Don't**: Hardcode padding or let content hide behind notches.

**Do**: Use CSS environment variables.

```css
/* WRONG - Fixed padding */
.app-shell {
  padding-top: 20px;
  padding-bottom: 34px;
}

/* CORRECT - Safe areas */
.app-shell {
  padding-top: env(safe-area-inset-top, 0);
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.bottom-nav {
  height: calc(56px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

## Ignoring Keyboard

**Don't**: Let keyboard cover input fields.

**Do**: Adjust layout when keyboard appears.

```svelte
<script>
  let keyboardHeight = $state(0);

  $effect(() => {
    if (!('virtualKeyboard' in navigator)) return;

    const vk = navigator.virtualKeyboard;
    vk.overlaysContent = true;

    function handleChange() {
      keyboardHeight = vk.boundingRect.height;
    }

    vk.addEventListener('geometrychange', handleChange);
    return () => vk.removeEventListener('geometrychange', handleChange);
  });
</script>

<div class="chat-input" style="bottom: {keyboardHeight}px">
  <input />
</div>
```

---

## Native Navigation Patterns

**Don't**: Try to replicate iOS/Android navigation exactly.

**Do**: Use web navigation with mobile-friendly enhancements.

```svelte
<!-- WRONG - Native back gesture simulation -->
<script>
  // Complex gesture detection trying to match native
</script>

<!-- CORRECT - Web navigation + simple enhancement -->
<script>
  import { swipe } from '$lib/actions/swipe';

  function handleBack() {
    history.back();
  }
</script>

<div use:swipe on:swiperight={handleBack}>
  <!-- Page content -->
</div>
```

---

## Queuing Without Limits

**Don't**: Queue offline actions indefinitely.

**Do**: Add expiry and retry limits.

```typescript
// WRONG - Unlimited queue
offlineQueue.add('action', payload);

// CORRECT - With limits
const MAX_RETRIES = 3;
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

function addToQueue(type, payload) {
  const action = {
    type,
    payload,
    timestamp: Date.now(),
    retries: 0
  };
  // Prune old items
  queue.update(q => q.filter(a => Date.now() - a.timestamp < MAX_AGE_MS));
  queue.update(q => [...q, action]);
}
```

---

## Assuming Native Parity

**Don't**: Assume PWA can do everything native apps can.

**Do**: Check platform capability matrix before designing features.

| API | Android | iOS | Common Mistake |
|-----|---------|-----|----------------|
| Background Sync | Yes | No | Expecting auto-sync on iOS |
| Background Fetch | Yes | No | Expecting uploads to continue when backgrounded on iOS |
| Vibration | Yes | No | Using haptic feedback without visual fallback |
| Background audio | Yes | Pauses | Expecting music to continue when locked on iOS |
| Service Worker (bg) | Continues | Stops in seconds | Assuming background processing works on iOS |

---

## Checklist

- [ ] Works offline (at least shows cached content)
- [ ] Touch targets >= 44x44px
- [ ] Safe areas respected
- [ ] Keyboard doesn't cover inputs
- [ ] Loading shows skeletons (not spinners)
- [ ] Error and empty states handled
- [ ] Optimistic updates with rollback
- [ ] Offline queue has limits

---

## Related Docs

- [native-mobile.md](../patterns/frontend/native-mobile.md) - Platform capability matrix
