# Elixir/Ash Patterns

> Auto-loaded rules for Elixir and Ash Framework development.

## Ash Framework Rules

| Pattern | Correct | Wrong |
|---------|---------|-------|
| Data access | `MyApp.Accounts.list_users()` | `UserRepository.find_all()` |
| Business logic | Ash actions + notifiers | Service layer modules |
| State machine | `AshStateMachine` or pattern matching | Class-based state objects |
| Object creation | Maps or `Ash.Changeset` | Builder/Factory patterns |
| Events | Phoenix PubSub | Manual observer pattern |
| DI | Config + function args | DI containers |
| Shared behavior | Protocols/Behaviours | Class inheritance |
| Singleton | Named GenServer | Module attribute hacks |

## Ash Resource Requirements

- Resources use `Ash.Resource` macro with `domain:` option
- Actions have proper `argument` and `returns` declarations
- Public actions have `authorize? true`
- Sensitive data has field policies
- Error codes use atoms in snake_case (`:invalid_credentials`)

## Phoenix/LiveView Rules

- `mount/3` assigns only required initial state
- Use `assign_async` for data loading (non-blocking)
- `handle_event/3` validates params before processing
- Subscribe in `mount`, handle in `handle_info/2`
- Svelte handles form state; `pushEvent` only on submit

## Testing Rules

- Always generate unique identifiers in test helpers (use `System.unique_integer`)
- Never hardcode emails/slugs that could conflict in parallel test runs
- Tests follow Arrange-Act-Assert pattern
- Tag acceptance criteria: `@tag :ac_1`

## Anti-Patterns to Catch

```elixir
# WRONG - Blocks render
def mount(%{"id" => id}, _session, socket) do
  data = MyApp.get_data!(id)
  {:ok, assign(socket, data: data)}
end

# CORRECT - Non-blocking
def mount(%{"id" => id}, _session, socket) do
  {:ok, socket |> assign(id: id) |> assign_async(:data, fn ->
    {:ok, %{data: MyApp.get_data!(id)}}
  end)}
end
```
