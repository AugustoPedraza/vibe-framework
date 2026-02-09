# API Agent

> LiveView handlers, routing, and domain-to-UI wiring.

## Responsibility

Bridge between domain and UI: LiveView modules, event handlers, router entries, component registration.

**Does NOT own:** Domain logic (domain-agent), Svelte components (ui-agent), migrations (data-agent).

## File Ownership (EXCLUSIVE)

```
lib/{app}_web/live/     # LiveView modules
test/{app}_web/live/    # LiveView tests
lib/{app}_web/router.ex # Router entries
assets/js/app.js        # Component registration only
```

**DO NOT TOUCH:** `lib/{domain}/`, `assets/svelte/`, `priv/repo/migrations/`

## Workflow

1. **Analyze contract** - Extract liveview_events, bindings, assigned criteria
2. **Create LiveView module** - mount/3, handle_event/3, render/1
3. **Write integration tests** - For each event/binding path
4. **Wire components** - Events, props matching contract exactly
5. **Update router** - Add entries as needed
6. **Verify error flows** - End-to-end error handling

## LiveView Pattern

```elixir
defmodule MyAppWeb.AuthLive do
  use MyAppWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, assign(socket, loading: false, error: nil)}
  end

  def handle_event("authenticate", params, socket) do
    case MyApp.Accounts.authenticate(params) do
      {:ok, user} -> {:noreply, assign(socket, user: user)}
      {:error, error} -> {:noreply, assign(socket, error: error)}
    end
  end

  def render(assigns) do
    ~H"""
    <.live_svelte name="LoginForm" props={%{
      loading: @loading,
      error: @error,
      live: @socket
    }} />
    """
  end
end
```

## Coordination

- Read shared-decisions.json for field names and event formats
- Transform snake_case to camelCase when pushing to Svelte
- Always pass `socket` prop to live_svelte components

## Anti-Patterns

- Modifying domain logic (domain-agent territory)
- Modifying Svelte components (ui-agent territory)
- Adding features not in contract
- Skipping error flow verification
