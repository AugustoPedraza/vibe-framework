# API Layer Reference

> Checklist for LiveView handlers, routing, and domain-to-UI wiring.

## File Locations

```
lib/{app}_web/live/     # LiveView modules
test/{app}_web/live/    # LiveView tests
lib/{app}_web/router.ex # Router entries
assets/js/app.js        # Component registration only
```

## Implementation Checklist

1. **Create LiveView module** — `mount/3`, `handle_event/3`, `render/1`
2. **Write integration tests** — For each event/binding path
3. **Wire components** — Events, props matching spec exactly
4. **Update router** — Add entries as needed
5. **Register component** — Add Svelte component to `assets/js/app.js`
6. **Verify error flows** — End-to-end error handling

## Hard Requirements

### Thin Shell (<100 lines)

LiveView modules must delegate ALL UI to Svelte via LiveSvelte. The LiveView is a thin shell:
- `mount/3` — Load data via `assign_async`, set initial assigns
- `handle_event/3` — Call domain functions, update assigns
- `render/1` — Single `<.live_svelte>` component tag

### assign_async for All Data Loading

All data fetching MUST use `assign_async` to enable skeleton loading states in Svelte:

```elixir
def mount(_params, _session, socket) do
  {:ok,
   socket
   |> assign_async(:projects, fn -> {:ok, %{projects: Projects.list()}} end)}
end
```

### Serialization (Ash → camelCase maps)

All Ash resources MUST be serialized to plain maps with camelCase keys before passing to Svelte:

```elixir
defp serialize_project(project) do
  %{
    id: project.id,
    projectName: project.name,
    createdAt: project.inserted_at
  }
end
```

### Component Registration

Every new Svelte component MUST be registered in `assets/js/app.js`:

```javascript
import MyComponent from "../svelte/components/features/my-feature/MyComponent.svelte";

const components = {
  // ... existing components
  MyComponent,
};
```

## LiveView Pattern

```elixir
defmodule SynaWeb.FeatureLive do
  use SynaWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> assign(error: nil)
     |> assign_async(:data, fn -> {:ok, %{data: load_data()}} end)}
  end

  def handle_event("action", params, socket) do
    case Syna.Domain.action(params) do
      {:ok, result} -> {:noreply, assign(socket, result: serialize(result))}
      {:error, error} -> {:noreply, assign(socket, error: format_error(error))}
    end
  end

  def render(assigns) do
    ~H"""
    <.live_svelte name="FeatureComponent" props={%{
      data: @data,
      error: @error
    }} />
    """
  end
end
```

## Router Wiring

```elixir
# lib/syna_web/router.ex
scope "/", SynaWeb do
  pipe_through [:browser, :require_authenticated_user]

  live "/feature", FeatureLive
end
```

## Coordination

- Transform snake_case to camelCase when pushing to Svelte
- Always pass `socket` prop to live_svelte components
- Error messages should be user-friendly strings, not raw Ash errors

## Anti-Patterns

- Business logic in LiveView (belongs in domain layer)
- Modifying Svelte components from API layer
- LiveView >100 lines (decompose into helper functions or move logic to domain)
- Skipping error flow verification
- Raw Ash structs passed to Svelte (must serialize to plain maps)
