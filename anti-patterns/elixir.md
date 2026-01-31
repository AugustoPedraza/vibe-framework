# Elixir Anti-Patterns

> OOP patterns that don't work in Elixir/Ash.

## Quick Reference

| Don't | Do Instead | Why |
|-------|------------|-----|
| Factory pattern | Pattern matching | No classes needed |
| Singleton pattern | Named GenServer | Processes ARE singletons |
| Builder pattern | Maps/Changesets | Simpler, clearer |
| Repository wrapper | Ash directly | Ash IS the repository |
| Service layer | Ash actions | Logic in actions |
| Manual observers | PubSub | Built-in, scalable |
| DI containers | Config + args | Simpler alternatives |
| Class inheritance | Protocols/Behaviours | Composition over inheritance |

---

## Factory Pattern

**OOP**: Create objects without specifying exact classes.

**Elixir**: Just use functions with pattern matching.

```elixir
# WRONG - Factory pattern
defmodule UserFactory do
  def create_user("admin"), do: %AdminUser{}
  def create_user("guest"), do: %GuestUser{}
end

# CORRECT - Pattern matching
defmodule User do
  def new(:admin), do: %{role: :admin, permissions: [:all]}
  def new(:guest), do: %{role: :guest, permissions: [:read]}
end
```

---

## Singleton Pattern

**OOP**: Ensure a class has only one instance.

**Elixir**: Use a named GenServer. It IS a singleton.

```elixir
# WRONG - Singleton wannabe
defmodule DatabaseConnection do
  @instance nil
  def get_instance do
    # This doesn't work - Elixir is immutable
  end
end

# CORRECT - Named GenServer
defmodule MyApp.ConnectionPool do
  use GenServer

  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  def get_connection do
    GenServer.call(__MODULE__, :get_connection)
  end
end
```

---

## Builder Pattern

**OOP**: Construct complex objects step by step.

**Elixir**: Use maps or Ash changesets.

```elixir
# WRONG - Builder pattern
defmodule UserBuilder do
  defstruct [:name, :email]
  def new, do: %__MODULE__{}
  def set_name(builder, name), do: %{builder | name: name}
  def build(builder), do: builder
end

# CORRECT - Maps or Ash
user = %{name: "John", email: "john@example.com"}

# Or with Ash:
User
|> Ash.Changeset.for_create(:create, %{name: "John"})
|> Ash.create!()
```

---

## Repository Pattern

**OOP**: Abstract data access behind an interface.

**Elixir**: Ash resources ARE the repository.

```elixir
# WRONG - Repository wrapper
defmodule UserRepository do
  def find_by_id(id), do: MyApp.Accounts.User |> Ash.get!(id)
  def find_all, do: MyApp.Accounts.User |> Ash.read!()
end

# CORRECT - Use Ash domain directly
MyApp.Accounts.get_user!(id)
MyApp.Accounts.list_users()
```

---

## Service Layer Pattern

**OOP**: Separate business logic from data objects.

**Elixir**: Business logic belongs in Ash actions and notifiers.

```elixir
# WRONG - Service layer
defmodule UserService do
  def promote_to_admin(user) do
    user
    |> Ash.Changeset.for_update(:update, %{role: :admin})
    |> Ash.update!()
    |> send_promotion_email()
  end
end

# CORRECT - Ash action + notifier
defmodule MyApp.Accounts.User do
  actions do
    update :promote_to_admin do
      change set_attribute(:role, :admin)
    end
  end
end

defmodule MyApp.Accounts.Notifiers.UserNotifier do
  def notify(%{action: %{name: :promote_to_admin}} = notification) do
    send_promotion_email(notification.data)
  end
end
```

---

## Observer Pattern

**OOP**: Notify multiple objects of state changes.

**Elixir**: Use Phoenix PubSub.

```elixir
# WRONG - Manual observer
defmodule Subject do
  use GenServer
  def init(_), do: {:ok, %{observers: []}}
  def add_observer(pid, observer) do
    GenServer.call(pid, {:add_observer, observer})
  end
end

# CORRECT - PubSub
# In notifier:
Phoenix.PubSub.broadcast(MyApp.PubSub, "users:#{user.id}", {:user_updated, user})

# In LiveView:
Phoenix.PubSub.subscribe(MyApp.PubSub, "users:#{user.id}")
```

---

## Dependency Injection Containers

**OOP**: Manage object dependencies and lifecycle.

**Elixir**: Use application config or pass as arguments.

```elixir
# WRONG - DI container
defmodule Container do
  def get_service(:email), do: EmailService
end

# CORRECT - Config + module attributes
defmodule MyApp.Accounts do
  @email_service Application.compile_env(:my_app, :email_service, MyApp.RealEmailService)

  def send_welcome(user) do
    @email_service.send_welcome(user)
  end
end

# Or just pass as argument:
def send_welcome(user, email_service \\ MyApp.RealEmailService)
```

---

## Class Inheritance

**OOP**: Share behavior through inheritance hierarchies.

**Elixir**: Use protocols and behaviours.

```elixir
# WRONG - Inheritance simulation
defmodule Animal do
  defmacro __using__(_) do
    quote do
      use Mammal
    end
  end
end

# CORRECT - Protocols
defprotocol Speakable do
  def speak(animal)
end

defimpl Speakable, for: Dog do
  def speak(_), do: "Woof!"
end

# Behaviours for shared interfaces:
defmodule Animal do
  @callback speak() :: String.t()
end
```

---

## State Machine (Class-Based)

**OOP**: Model object state transitions with classes.

**Elixir**: Use atoms and pattern matching, or AshStateMachine.

```elixir
# WRONG - Class-based states
defmodule OrderState.Pending do
  def next(order), do: %{order | state: :shipped}
end

# CORRECT - Pattern matching
defmodule Order do
  def transition(%{state: :pending}, :ship), do: {:ok, %{state: :shipped}}
  def transition(%{state: :shipped}, :deliver), do: {:ok, %{state: :delivered}}
  def transition(order, action), do: {:error, "Cannot #{action} from #{order.state}"}
end

# Or AshStateMachine:
state_machine do
  initial_states [:pending]
  transitions do
    transition :ship, from: :pending, to: :shipped
  end
end
```

---

## Phoenix/LiveView Specific

### Loading Data in mount/3

```elixir
# WRONG - Blocks render
def mount(%{"id" => id}, _session, socket) do
  data = MyApp.get_data!(id)  # Blocks!
  {:ok, assign(socket, data: data)}
end

# CORRECT - Non-blocking
def mount(%{"id" => id}, _session, socket) do
  {:ok,
   socket
   |> assign(id: id)
   |> assign_async(:data, fn ->
     {:ok, %{data: MyApp.get_data!(id)}}
   end)}
end
```

### Using phx-change on Forms

```elixir
# WRONG - Round-trip on every keystroke
<.form phx-change="validate">
  <input name="email" />
</.form>

# CORRECT - Svelte handles form state
# Use Svelte for form UI, pushEvent only on submit
```

---

## Testing Anti-Patterns

### Hardcoded Test Data

**Problem**: Tests use hardcoded emails/slugs that conflict on CI or parallel runs.

```elixir
# WRONG - Conflicts between tests
test "creates user" do
  maria = insert_user(email: "maria@email.com")
end

test "another test" do
  maria = insert_user(email: "maria@email.com")  # Duplicate!
end
```

**Solution**: Always generate unique identifiers in test helpers.

```elixir
# CORRECT - Helper generates unique suffix
def insert_user(attrs \\ []) do
  unique_suffix = System.unique_integer([:positive])
  base_email = Keyword.get(attrs, :email)

  email =
    if base_email do
      [local, domain] = String.split(base_email, "@")
      "#{local}-#{unique_suffix}@#{domain}"
    else
      "test-#{unique_suffix}@example.com"
    end

  # maria@email.com -> maria-12345@email.com
  {:ok, user} = create_user(email: email, ...)
  user
end
```

---

## Related Docs

- [ash-framework.md](../docs/backend/ash-framework.md) - Correct Ash patterns
- [svelte.md](./svelte.md) - Frontend anti-patterns
