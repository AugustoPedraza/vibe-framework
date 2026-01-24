# Developer Role - Backend

> Elixir, Phoenix, and Ash Framework patterns. Load when doing backend work.

---

## Elixir Idioms

### Pipe Operator (Data Transformation)

```elixir
# Idiomatic - Pipe operator for transformations
user_params
|> validate_required([:email, :name])
|> normalize_email()
|> hash_password()
|> Repo.insert()

# Non-idiomatic - Nested function calls
Repo.insert(hash_password(normalize_email(validate_required(user_params, [:email, :name]))))
```

### Pattern Matching

```elixir
# Pattern match in function heads
def handle_result({:ok, user}), do: {:ok, format_user(user)}
def handle_result({:error, changeset}), do: {:error, format_errors(changeset)}

# With for happy path chaining
with {:ok, user} <- Accounts.get_user(id),
     {:ok, updated} <- Accounts.update_user(user, params) do
  {:ok, updated}
end
```

### Let It Crash

Don't defend against every error; let supervisors handle recovery:

```elixir
# WRONG: Hiding problems
def get_user(id) do
  try do
    Repo.get!(User, id)
  rescue
    _ -> nil
  end
end

# RIGHT: Let it crash, handle at boundaries
def get_user(id), do: Repo.get(User, id)
```

---

## Thin LiveView Shell

LiveViews are orchestrators, not business logic containers:

```elixir
defmodule {{modules.web_prefix}}.ChatLive do
  use {{modules.web_prefix}}, :live_view

  @impl true
  def mount(_params, _session, socket) do
    # Initialize ALL assigns - prevents nil errors
    {:ok, assign(socket,
      items: [],
      loading: true,
      error: nil
    )}
  end

  @impl true
  def render(assigns) do
    # Minimal HTML - delegate to Svelte
    ~H"""
    <.svelte
      name="ChatView"
      props={%{items: @items, loading: @loading}}
      socket={@socket}
    />
    """
  end

  @impl true
  def handle_event("submit", params, socket) do
    # Delegate to domain, not inline logic
    case Domain.create(params, actor: socket.assigns.current_user) do
      {:ok, record} -> {:noreply, push_navigate(socket, to: ~p"/success")}
      {:error, error} -> {:noreply, assign(socket, :error, error)}
    end
  end
end
```

---

## Ash Resource Pattern

```elixir
defmodule {{modules.domain_prefix}}.Accounts.User do
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer,
    domain: {{modules.domain_prefix}}.Accounts

  postgres do
    table "users"
    repo {{modules.domain_prefix}}.Repo
  end

  attributes do
    uuid_primary_key :id
    attribute :email, :string, allow_nil?: false, public?: true
    attribute :name, :string, allow_nil?: false, public?: true
    timestamps()
  end

  actions do
    defaults [:read, :destroy]

    create :register do
      accept [:email, :name, :password]
      change fn changeset, _context ->
        Ash.Changeset.change_attribute(changeset, :email,
          String.downcase(changeset.attributes[:email] || ""))
      end
    end
  end

  policies do
    policy action_type(:read) do
      authorize_if always()
    end
  end
end
```

---

## Ash Advanced Patterns

### Calculations (Computed Fields)

```elixir
calculations do
  # Count participants (computed at query time)
  calculate :participant_count, :integer, expr(count(participants))

  # Unread messages for actor
  calculate :unread_count, :integer, expr(
    count(messages, query: [filter: expr(not read and sender_id != ^actor(:id))])
  )

  # Full display name with fallback
  calculate :display_name, :string, expr(name || "Project #" <> id)
end
```

### Aggregates (Relationship Summaries)

```elixir
aggregates do
  count :message_count, :messages
  count :unread_count, :messages do
    filter expr(not read)
  end
  first :last_message, :messages, :content do
    sort inserted_at: :desc
  end
end
```

### Code Interface (Clean API)

```elixir
defmodule {{modules.domain_prefix}}.Conversations do
  use Ash.Domain

  def send_message(channel_id, content, opts \\ []) do
    Message
    |> Ash.Changeset.for_create(:send, %{channel_id: channel_id, content: content})
    |> Ash.create(opts)
  end

  def list_messages(channel_id, opts \\ []) do
    Message
    |> Ash.Query.filter(channel_id == ^channel_id)
    |> Ash.Query.sort(inserted_at: :asc)
    |> Ash.Query.load([:sender])
    |> Ash.read(opts)
  end
end
```

---

## The async_result() Helper

**Critical pattern** - Always convert AsyncResult for Svelte:

```elixir
def render(assigns) do
  ~H"""
  <.svelte
    name="ChatView"
    props={%{
      messages: async_result(@messages),
      project_id: @project_id
    }}
    socket={@socket}
  />
  """
end

# Convert AsyncResult to Svelte-friendly format
defp async_result(%Phoenix.LiveView.AsyncResult{ok?: true, result: result}),
  do: %{status: "ok", data: result}
defp async_result(%Phoenix.LiveView.AsyncResult{loading?: true}),
  do: %{status: "loading", data: nil}
defp async_result(%Phoenix.LiveView.AsyncResult{failed?: true, failed: reason}),
  do: %{status: "error", error: inspect(reason)}
defp async_result(_),
  do: %{status: "loading", data: nil}
```

---

## Error Handling

### Ash Error Types -> User Messages

| Ash Error | Meaning | User Message |
|-----------|---------|--------------|
| `Ash.Error.Invalid` | Validation failed | Field-specific inline errors |
| `Ash.Error.Query.NotFound` | Resource missing | "Not found" or silent |
| `Ash.Error.Forbidden` | Policy denied | "You don't have access" |
| `Ash.Error.Framework` | Internal error | "Something went wrong" |

### Error Formatting Helper

```elixir
defmodule {{modules.web_prefix}}.ErrorHelpers do
  def format_ash_errors(%Ash.Error.Invalid{errors: errors}) do
    Enum.reduce(errors, %{}, fn error, acc ->
      case error do
        %Ash.Error.Changes.InvalidAttribute{field: field, message: msg} ->
          Map.put(acc, to_string(field), humanize_message(msg))
        %Ash.Error.Changes.Required{field: field} ->
          Map.put(acc, to_string(field), "Required")
        _ -> acc
      end
    end)
  end

  defp humanize_message("has already been taken"), do: "Already in use"
  defp humanize_message("must have the @ sign and no spaces"), do: "Check your email"
  defp humanize_message(msg), do: msg
end
```

---

## Elixir Principles

### Pipelines Over Nesting
Use `|>` for data transformations, not nested calls.

### Pattern Match Early
Destructure in function heads, not function bodies.

### With for Happy Path
Use `with` for sequential operations that can fail.

### Actions Are Verbs
Name actions after what they DO: `:register`, `:send`, `:archive`.

### Policies Over Callbacks
Use Ash policies, not Phoenix plugs or manual checks.

### Calculations for Derived Data
Use Ash calculations, not virtual fields.

### assign_async for Data Loading
Never block mount; use assign_async.
