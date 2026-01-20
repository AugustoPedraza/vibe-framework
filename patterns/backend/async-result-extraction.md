# Pattern: AsyncResult Status Extraction

> Safely extract status and data from Phoenix LiveView's assign_async results with comprehensive pattern matching

## Problem

Phoenix LiveView's `assign_async` returns an `AsyncResult` struct with various states:
- Loading (with optional previous results)
- Success (with result data)
- Failed (with error reason)

The struct shape varies based on:
- Whether it's still loading
- How the result was structured in the async function
- Whether there was a previous successful result

Without proper pattern matching, you may miss edge cases leading to crashes or incorrect UI states.

## Solution

Create a dedicated extraction function with pattern matching clauses for all possible `AsyncResult` states. Return a tuple of `{status_string, data}` for easy consumption by render logic.

## Example

### Basic Extraction Function

```elixir
defmodule MyAppWeb.SomeLive do
  use MyAppWeb, :live_view

  def mount(_params, _session, socket) do
    socket =
      socket
      |> assign_async(:items, fn -> load_items() end)

    {:ok, socket}
  end

  defp load_items do
    case MyApp.Items.list() do
      {:ok, items} -> {:ok, %{items: items}}
      {:error, reason} -> {:error, reason}
    end
  end

  # Extract status and data from AsyncResult
  # Handle all possible states to avoid pattern match errors

  # Still loading (no previous result)
  defp extract_status(%{loading: loading}) when is_list(loading),
    do: {"loading", nil}

  # Success with wrapped result (when async returns %{key: value})
  defp extract_status(%{ok?: true, result: %{items: items}}),
    do: {"success", items}

  # Success with direct struct result
  defp extract_status(%{ok?: true, result: %MyApp.Item{} = item}),
    do: {"success", item}

  # Success with special case (e.g., empty state)
  defp extract_status(%{ok?: true, result: :empty}),
    do: {"empty", nil}

  # Success but nil result (treated as error)
  defp extract_status(%{ok?: true, result: nil}),
    do: {"error", nil}

  # Failed state
  defp extract_status(%{failed: failed}) when not is_nil(failed),
    do: {"error", nil}

  # Fallback (treat unknown as loading)
  defp extract_status(_),
    do: {"loading", nil}

  def render(assigns) do
    {status, items} = extract_status(assigns.items)
    assigns = assign(assigns, status: status, items: items)

    ~H"""
    <.svelte
      name="ItemList"
      props={%{status: @status, items: @items}}
      socket={@socket}
    />
    """
  end
end
```

### With Multiple Async Assigns

```elixir
defmodule MyAppWeb.DashboardLive do
  # When you have multiple async assigns, create specific extractors

  defp extract_user_status(%{loading: _}), do: {"loading", nil}
  defp extract_user_status(%{ok?: true, result: user}), do: {"success", user}
  defp extract_user_status(%{failed: _}), do: {"error", nil}
  defp extract_user_status(_), do: {"loading", nil}

  defp extract_stats_status(%{loading: _}), do: {"loading", nil}
  defp extract_stats_status(%{ok?: true, result: %{stats: stats}}), do: {"success", stats}
  defp extract_stats_status(%{failed: _}), do: {"error", nil}
  defp extract_stats_status(_), do: {"loading", nil}

  defp build_props(assigns) do
    {user_status, user} = extract_user_status(assigns.user)
    {stats_status, stats} = extract_stats_status(assigns.stats)

    %{
      userStatus: user_status,
      user: user,
      statsStatus: stats_status,
      stats: stats
    }
  end
end
```

## Key Patterns

| AsyncResult State | Pattern Match | Status |
|-------------------|---------------|--------|
| Loading | `%{loading: loading}` when `is_list(loading)` | "loading" |
| Success (wrapped) | `%{ok?: true, result: %{key: value}}` | "success" |
| Success (direct) | `%{ok?: true, result: %Struct{}}` | "success" |
| Success (nil) | `%{ok?: true, result: nil}` | "error" |
| Failed | `%{failed: failed}` when `not is_nil(failed)` | "error" |
| Unknown | `_` | "loading" |

## When to Use

- Any LiveView using `assign_async` for data loading
- When passing status to Svelte/JS components via props
- When you need to distinguish between loading, success, empty, and error states

## When NOT to Use

- Simple synchronous data loading (just use regular assigns)
- When you don't need granular status tracking

## Tech Stack

`elixir` `phoenix` `liveview` `assign_async`

## Source

Discovered in: Syna / HOME-001
Date: 2026-01-20
