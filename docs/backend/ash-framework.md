# Backend Guide (Ash Framework)

> Ash Framework provides the domain layer with resources, actions, and policies.

## Quick Index

| If you need... | Section | Time |
|----------------|---------|------|
| Domain structure | [#domain-structure](#domain-structure) | 2 min |
| Resource template | [#resource-template](#resource-template) | 3 min |
| Event publishing | [#notifier-pattern](#notifier-pattern) | 2 min |
| Async data loading | [#assign-async](#assign-async-pattern) | 3 min |
| Presence tracking | [#presence](#presence-patterns) | 2 min |

---

## Core Principle: Vertical Slices

> **Build what the feature needs, not the full domain upfront.**

1. **Start minimal** - Create only the resources required for your feature
2. **Add attributes incrementally** - Only add fields you're actually using
3. **Policies later** - Use `authorize_if always()` initially, refine when auth is critical
4. **Notifiers on demand** - Add PubSub when real-time is actually needed

---

## Domain Structure

```
lib/my_app/
+-- accounts/                      # Bounded Context: Identity
|   +-- accounts.ex               # Domain API
|   +-- user.ex                   # Resource
|   +-- session.ex                # Resource
|   +-- policies/
|       +-- user_policy.ex
|
+-- {context}/                     # Your domain contexts
|   +-- {context}.ex              # Domain API
|   +-- {entity}.ex               # Resource
|   +-- notifiers/
|       +-- {entity}_notifier.ex  # PubSub broadcasts
|
+-- shared/                        # Shared Kernel
    +-- types/                     # Custom Ash types
    +-- changes/                   # Reusable Ash changes
```

---

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Domain Module | `MyApp.{Context}` | `MyApp.Accounts` |
| Resource | `MyApp.{Context}.{Entity}` | `MyApp.Accounts.User` |
| Action | `verb_noun` | `:create_user`, `:send_message` |
| Read Action | `get_*`, `list_*` | `:get_by_id`, `:list_active` |
| Notifier | `{Entity}Notifier` | `MessageNotifier` |
| Change | `{Verb}{Noun}` | `HashPassword`, `SetTimestamp` |

---

## Resource Template

```elixir
defmodule MyApp.{Context}.{Entity} do
  use Ash.Resource,
    domain: MyApp.{Context},
    data_layer: AshPostgres.DataLayer,
    notifiers: [MyApp.{Context}.Notifiers.{Entity}Notifier]

  postgres do
    table "{entities}"
    repo MyApp.Repo
  end

  attributes do
    uuid_primary_key :id

    # Add attributes here

    timestamps()
  end

  relationships do
    # Add relationships here
  end

  actions do
    defaults [:read, :destroy]

    # Define custom create/update actions
  end

  policies do
    policy action_type(:read) do
      authorize_if always()  # Replace with actual policy
    end
  end
end
```

---

## Event-Ready Actions

```elixir
defmodule MyApp.Conversations.Message do
  use Ash.Resource,
    domain: MyApp.Conversations,
    data_layer: AshPostgres.DataLayer,
    notifiers: [MyApp.Conversations.Notifiers.MessageNotifier]

  actions do
    create :send do
      accept [:content, :channel_id]
      change relate_actor(:sender)
      change set_attribute(:sent_at, &DateTime.utc_now/0)
    end
  end
end
```

---

## Notifier Pattern

Notifiers publish domain events to PubSub:

```elixir
defmodule MyApp.Conversations.Notifiers.MessageNotifier do
  use Ash.Notifier

  def notify(%Ash.Notifier.Notification{action: %{name: :send}} = notification) do
    message = notification.data
    topic = "channel:#{message.channel_id}"

    Phoenix.PubSub.broadcast(MyApp.PubSub, topic, {:message_sent, message})
    :ok
  end
end
```

---

## assign_async Pattern

> **Critical**: Never load data synchronously in `mount/3` - it blocks initial render.

```elixir
# WRONG - Blocks render, feels slow
def mount(%{"id" => id}, _session, socket) do
  data = MyApp.Projects.get_project!(id)  # Blocks!
  {:ok, assign(socket, project: data)}
end

# CORRECT - Non-blocking, shows loading state
def mount(%{"id" => id}, _session, socket) do
  {:ok,
   socket
   |> assign(id: id)
   |> assign_async(:project, fn ->
     {:ok, %{project: MyApp.Projects.get_project!(id)}}
   end)}
end
```

In your template, handle the async states:

```heex
<.async_result :let={project} assign={@project}>
  <:loading>
    <.skeleton variant="card" />
  </:loading>
  <:failed :let={_reason}>
    <.error_state message="Failed to load" />
  </:failed>

  <.svelte name="ProjectCard" props={%{project: project}} socket={@socket} />
</.async_result>
```

---

## Presence Patterns

Use Phoenix.Presence for real-time user tracking:

```elixir
defmodule MyAppWeb.Presence do
  use Phoenix.Presence,
    otp_app: :my_app,
    pubsub_server: MyApp.PubSub
end
```

In LiveView:

```elixir
def mount(%{"channel_id" => id}, _session, socket) do
  if connected?(socket) do
    # Track user presence
    {:ok, _} = MyAppWeb.Presence.track(
      self(),
      "channel:#{id}",
      socket.assigns.current_user.id,
      %{name: socket.assigns.current_user.name, joined_at: DateTime.utc_now()}
    )

    # Subscribe to presence updates
    Phoenix.PubSub.subscribe(MyApp.PubSub, "channel:#{id}")
  end

  {:ok, assign(socket, presences: %{})}
end

def handle_info(%{event: "presence_diff", payload: diff}, socket) do
  {:noreply, assign(socket, presences: MyAppWeb.Presence.sync_diff(socket.assigns.presences, diff))}
end
```

---

## Typing Indicators

```elixir
def handle_event("typing", %{"typing" => true}, socket) do
  Phoenix.PubSub.broadcast(
    MyApp.PubSub,
    "channel:#{socket.assigns.channel_id}:typing",
    {:typing, socket.assigns.current_user.id, socket.assigns.current_user.name}
  )
  {:noreply, socket}
end
```

---

## Related Docs

- [quickstart.md](../quickstart.md) - Core patterns
- [svelte-guide.md](../frontend/svelte-guide.md) - Svelte integration
