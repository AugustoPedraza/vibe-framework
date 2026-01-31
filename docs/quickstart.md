# Quick Reference

> **Read this first before any implementation work.**

## Quick Index

| If you need... | Section | Time |
|----------------|---------|------|
| Core architecture decisions | [#core-decisions](#core-decisions) | 2 min |
| What LiveView handles | [#liveview-responsibilities](#what-liveview-does) | 1 min |
| What Svelte handles | [#svelte-responsibilities](#what-svelte-does) | 1 min |
| Common mistakes to avoid | [#anti-patterns](#anti-patterns) | 3 min |
| Hybrid pattern example | [#hybrid-pattern](#hybrid-pattern) | 5 min |

---

## Core Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Mobile Strategy** | PWA first | Native-like UX, no App Store overhead |
| **Forms** | Svelte-only | Instant feedback, no `phx-change` latency |
| **Validation** | Client-first, optimistic submit | Native feel |
| **Data Fetching** | LiveView `handle_params` | Server-authoritative |
| **Real-time** | PubSub -> LiveView -> Svelte | Event-driven |
| **Routing** | LiveView `live_action` | URL-based, deep linking |

---

## What LiveView Does

```
Routing (live_action)
Auth gates (on_mount)
Data fetching (handle_params)
PubSub subscriptions
Handle Svelte events (handle_event)
Push data to Svelte (push_event)
Navigation (push_navigate)
```

---

## What Svelte Does

```
All form UI and validation
Animations and transitions
Gestures (swipe, pull-to-refresh)
Haptic feedback
Optimistic updates
Offline queuing
Tab bar and page transitions
```

---

## Anti-Patterns

### LiveView Anti-Patterns

| Don't | Do Instead | Why |
|-------|------------|-----|
| Load data in `mount/3` | Use `assign_async` | Blocks initial render, feels slow |
| Use `phx-change` on forms | Svelte-only forms | Round-trip latency on every keystroke |
| Store UI state in assigns | Svelte `$state` | Unnecessary re-renders |
| Use LiveView for animations | Svelte transitions | Server round-trip too slow |

### Svelte Anti-Patterns

| Don't | Do Instead | Why |
|-------|------------|-----|
| Render 100+ items directly | Use `VirtualList` | DOM overload, scroll jank |
| Show spinners for loading | Show skeletons | Native apps show structure |
| Block UI during fetch | Optimistic updates | Feels slow, not native |
| Forget error/empty states | Handle all states | Crashes look unprofessional |

### UX Anti-Patterns

| Don't | Do Instead | Why |
|-------|------------|-----|
| Use spinners | Use skeleton loaders | Native apps show structure |
| Load all data at once | Infinite scroll + pagination | Memory issues, slow load |
| Ignore aspect ratio | Use `aspect-ratio` CSS | Layout shift (CLS) |
| Skip loading states | Always show skeletons | Feels broken |

---

## Hybrid Pattern

> **Rule**: NEVER load data synchronously in `mount/3` - use `assign_async`.

### LiveView as Container

```elixir
defmodule MyAppWeb.ChatLive do
  use MyAppWeb, :live_view

  def mount(%{"room_id" => room_id}, _session, socket) do
    # Subscribe immediately (non-blocking)
    if connected?(socket) do
      Phoenix.PubSub.subscribe(MyApp.PubSub, "room:#{room_id}")
    end

    {:ok,
      socket
      |> assign(room_id: room_id)
      # Use assign_async - renders skeleton immediately
      |> assign_async(:messages, fn -> load_messages(room_id) end)
    }
  end

  defp load_messages(room_id) do
    messages = MyApp.Chat.list_messages(room_id)
    {:ok, %{messages: messages}}
  end

  def render(assigns) do
    ~H"""
    <.svelte
      name="ChatView"
      props={%{
        messages: async_result(@messages),
        room_id: @room_id,
        current_user_id: @current_user.id
      }}
      socket={@socket}
    />
    """
  end

  # Helper to convert AsyncResult to Svelte-friendly format
  defp async_result(%Phoenix.LiveView.AsyncResult{ok?: true, result: result}),
    do: %{status: "ok", data: result}
  defp async_result(%Phoenix.LiveView.AsyncResult{loading?: true}),
    do: %{status: "loading", data: nil}
  defp async_result(%Phoenix.LiveView.AsyncResult{failed?: true, failed: reason}),
    do: %{status: "error", error: inspect(reason)}
  defp async_result(_),
    do: %{status: "loading", data: nil}

  # Handle Svelte events
  def handle_event("send_message", %{"content" => content}, socket) do
    case MyApp.Chat.send_message(socket.assigns.room_id, content) do
      {:ok, _message} -> {:noreply, socket}
      {:error, changeset} ->
        {:noreply, push_event(socket, "error", %{errors: format_errors(changeset)})}
    end
  end

  # Handle PubSub broadcasts
  def handle_info({:message_sent, message}, socket) do
    {:noreply, push_event(socket, "message:new", %{message: message})}
  end
end
```

### Svelte as Presentation

```svelte
<script lang="ts">
  import { Skeleton, EmptyState } from '$lib/components/ui';

  let { messages, room_id, current_user_id, live } = $props();

  let inputValue = $state('');

  // Listen for server events
  $effect(() => {
    if (live) {
      live.handleEvent('message:new', (msg) => /* append to list */);
      live.handleEvent('error', (err) => /* show error */);
    }
  });
</script>

<!-- Handle all async states -->
{#if messages.status === 'loading'}
  <Skeleton variant="card" />
{:else if messages.status === 'error'}
  <EmptyState preset="error" title="Couldn't load messages" />
{:else if messages.data.length === 0}
  <EmptyState preset="default" title="No messages yet" />
{:else}
  {#each messages.data as message}
    <MessageBubble {message} isOwn={message.sender_id === current_user_id} />
  {/each}
{/if}
```

---

## Related Docs

- [responsibility-matrix.md](./responsibility-matrix.md) - Frontend/Backend ownership
- [backend/ash-framework.md](./backend/ash-framework.md) - Ash resources and actions
- [frontend/svelte-guide.md](./frontend/svelte-guide.md) - Svelte 5 patterns
