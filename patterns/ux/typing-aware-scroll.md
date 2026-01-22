# Pattern: Typing-Aware Scroll Behavior

> Implement context-sensitive scroll behavior based on user intent (typing vs. receiving).

---

## Problem

Chat and feed interfaces need different scroll behavior depending on context:

- **User sends a message**: Should auto-scroll to show their message
- **User receives while at bottom**: Should auto-scroll to show new message
- **User is scrolled up reading history**: Should NOT auto-scroll (would be disorienting)
- **User starts typing**: Scroll input into view without disrupting their position

Handling all these cases correctly creates a native-feeling experience.

---

## Solution

Track scroll position and user intent to determine scroll behavior:

1. **Track "at bottom" state**: User is considered "at bottom" within a threshold (e.g., 100px)
2. **On send**: Always scroll to bottom (show the user's own message)
3. **On receive + at bottom**: Auto-scroll to show new message
4. **On receive + scrolled up**: Don't scroll, show "new messages" indicator
5. **On input focus**: Only scroll if needed to keep input visible

### Implementation Approach

```svelte
<script lang="ts">
  let scrollContainer: HTMLElement;
  let isAtBottom = $state(true);
  const SCROLL_THRESHOLD = 100;

  function checkAtBottom() {
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
    isAtBottom = scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD;
  }

  function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
    scrollContainer?.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior
    });
  }

  // Call on new message
  function handleNewMessage(isOwnMessage: boolean) {
    if (isOwnMessage || isAtBottom) {
      scrollToBottom();
    }
  }
</script>

<div bind:this={scrollContainer} onscroll={checkAtBottom}>
  {#each messages as message}
    <MessageItem {message} />
  {/each}
</div>

{#if !isAtBottom && newMessageCount > 0}
  <NewMessagesIndicator count={newMessageCount} onclick={scrollToBottom} />
{/if}
```

---

## Example

**New Messages Indicator component:**
```svelte
<script lang="ts">
  interface Props {
    visible: boolean;
    count: number;
    onclick: () => void;
  }

  let { visible, count, onclick }: Props = $props();
</script>

{#if visible}
  <button
    type="button"
    class="fixed bottom-20 left-1/2 -translate-x-1/2
           bg-primary text-primary-foreground px-4 py-2 rounded-full
           shadow-lg flex items-center gap-2"
    {onclick}
  >
    <span>{count} new message{count > 1 ? 's' : ''}</span>
    <span aria-hidden="true">↓</span>
  </button>
{/if}
```

**Scroll to bottom button (always visible when scrolled up):**
```svelte
{#if !isAtBottom}
  <button
    type="button"
    onclick={() => scrollToBottom()}
    class="absolute bottom-4 right-4 p-2 rounded-full bg-background shadow-md"
    aria-label="Scroll to bottom"
  >
    <ChevronDown class="w-5 h-5" />
  </button>
{/if}
```

---

## When to Use

- Chat interfaces with real-time messages
- Feed interfaces with new content arriving
- Any scrollable list where user position matters
- Comment threads with live updates

---

## When NOT to Use

- Static lists that don't receive live updates
- Single-page content without scroll tracking
- Infinite scroll where you always want to load more (not jump)

---

## Variations

- **Staggered animations**: When multiple messages arrive, animate with stagger delay
  ```typescript
  function handleBatchMessages(messages: Message[]) {
    messages.forEach((msg, i) => {
      setTimeout(() => addMessage(msg), i * 50); // 50ms stagger
    });
  }
  ```

- **Threshold tuning**: Adjust SCROLL_THRESHOLD based on message density
  - Dense chat: 50-100px
  - Sparse feed: 200-300px

---

## Tech Stack

`svelte5` `typescript` `ux` `realtime` `chat` `scroll`

---

## Related Patterns

- [Motion Presets](./motion-presets.md) - Animation timing for scroll and messages
- [LiveView Navigation](../frontend/liveview-navigation.md) - WebSocket-based updates

---

## Source

- **Discovered in**: Syna / CONV-002
- **Date**: 2026-01-22
- **Original file**: `assets/svelte/components/features/conversations/MessageThread/index.svelte`
