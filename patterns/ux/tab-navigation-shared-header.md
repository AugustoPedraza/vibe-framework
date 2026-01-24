# Pattern: Tab Navigation with Shared Header

> Tab-based navigation where header remains constant and only content area changes, providing seamless UX.

## Problem

When implementing tabbed views (e.g., Messages/Decisions, Details/Activity), switching tabs often causes:
- Header flickering or re-rendering
- Loss of header state (expanded sections, scroll position)
- Jarring visual transitions
- Duplicate header code across views

## Solution

Extract shared header components and render them at the parent level, with only the content area switching based on active tab. The header components receive the same props regardless of which tab is active.

## Example

```svelte
<!-- ParentView.svelte -->
<script lang="ts">
  import SharedHeader from './SharedHeader.svelte';
  import TabBar from './TabBar.svelte';
  import ContentA from './ContentA.svelte';
  import ContentB from './ContentB.svelte';

  interface Props {
    activeTab: 'content-a' | 'content-b';
    headerData: HeaderData;
    contentAData: unknown;
    contentBData: unknown;
  }

  let { activeTab, headerData, contentAData, contentBData }: Props = $props();
</script>

<div class="flex flex-col h-full">
  <!-- Shared header - never re-renders on tab change -->
  <SharedHeader data={headerData} />

  <!-- Tab navigation -->
  <TabBar {activeTab} />

  <!-- Content area - only this switches -->
  <div class="flex-1 overflow-y-auto">
    {#if activeTab === 'content-a'}
      <ContentA data={contentAData} />
    {:else}
      <ContentB data={contentBData} />
    {/if}
  </div>
</div>
```

```svelte
<!-- TabBar.svelte -->
<script lang="ts">
  import { liveNavigate } from '$lib/utils/navigation';

  interface Props {
    activeTab: string;
    basePath: string;
  }

  let { activeTab, basePath }: Props = $props();

  const tabs = [
    { id: 'content-a', label: 'Content A', path: '' },
    { id: 'content-b', label: 'Content B', path: '/content-b' },
  ];

  function handleTabClick(tab: typeof tabs[0]) {
    if (tab.id !== activeTab) {
      liveNavigate(`${basePath}${tab.path}`);
    }
  }
</script>

<nav class="flex border-b border-border">
  {#each tabs as tab}
    <button
      type="button"
      class="flex-1 py-3 text-sm font-medium transition-colors"
      class:text-primary={activeTab === tab.id}
      class:border-b-2={activeTab === tab.id}
      class:border-primary={activeTab === tab.id}
      onclick={() => handleTabClick(tab)}
    >
      {tab.label}
    </button>
  {/each}
</nav>
```

## Backend Support

```elixir
# Both LiveViews load the same header data
defmodule MyAppWeb.ContentALive do
  def mount(%{"id" => id}, _session, socket) do
    socket =
      socket
      |> assign(:active_tab, "content-a")
      |> assign_async(:page_data, fn -> load_shared_data(id) end)
    {:ok, socket}
  end
end

defmodule MyAppWeb.ContentBLive do
  def mount(%{"id" => id}, _session, socket) do
    socket =
      socket
      |> assign(:active_tab, "content-b")
      |> assign_async(:page_data, fn -> load_shared_data(id) end)
    {:ok, socket}
  end
end

# Shared data loader ensures consistency
defp load_shared_data(id) do
  # Load header data that's shared across tabs
  {:ok, %{header: header, participants: participants}}
end
```

## When to Use

- Multi-tab views within the same resource context (project, home, user)
- Views where header contains shared state (participant count, toggles)
- Mobile apps where header stability is important for UX
- Any tabbed interface where tabs share parent context

## When NOT to Use

- Completely different views that happen to have similar headers
- When tabs load entirely different resources
- When header content is tab-specific

## Key Benefits

1. **No header flicker** - Header never unmounts during tab switch
2. **State preservation** - Expanded sections, scroll positions maintained
3. **DRY code** - Header components shared, not duplicated
4. **Smooth UX** - Only content area animates/changes
5. **LiveView efficiency** - Uses `liveNavigate` for WebSocket-based routing

## Tech Stack

`svelte5` `phoenix` `liveview` `livesvelte` `navigation`

## Source

Discovered in: Syna / DEC-002
Date: 2026-01-24
