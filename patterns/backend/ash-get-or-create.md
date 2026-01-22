# Pattern: Ash Get-or-Create

> Idempotent resource retrieval that creates if not found

## Problem

When you need to ensure a resource exists before using it:
- First-time access should create the resource
- Subsequent access should return existing
- Must handle race conditions gracefully
- Error handling between "not found" and "other errors" is subtle

## Solution

Use `read_one` (not `read_one!`) with pattern matching to distinguish "not found" from other errors, then create if needed.

## Example

```elixir
defmodule MyApp.Conversations do
  @doc """
  Gets or creates the INBOX channel for a project.
  """
  def get_or_create_inbox(project_id, opts \\ []) do
    case get_inbox_channel(project_id, opts) do
      {:ok, channel} ->
        {:ok, channel}

      {:error, %Ash.Error.Query.NotFound{}} ->
        create_inbox_channel(project_id, opts)

      error ->
        error
    end
  end

  # Use read_one (NOT read_one!) to get tuple result
  defp get_inbox_channel(project_id, _opts) do
    MyApp.Conversations.Channel
    |> Ash.Query.filter(project_id == ^project_id and name == "INBOX")
    |> Ash.read_one()
    |> case do
      {:ok, nil} -> {:error, %Ash.Error.Query.NotFound{}}
      {:ok, channel} -> {:ok, channel}
      error -> error
    end
  end

  defp create_inbox_channel(project_id, opts) do
    MyApp.Conversations.Channel
    |> Ash.Changeset.for_create(:create, %{
      project_id: project_id,
      name: "INBOX"
    })
    |> Ash.create(opts)
  end
end
```

## Anti-Pattern: Using read_one!

```elixir
# BAD: read_one! raises, making error handling complex
defp get_inbox_channel(project_id, _opts) do
  MyApp.Conversations.Channel
  |> Ash.Query.filter(project_id == ^project_id and name == "INBOX")
  |> Ash.read_one!(not_found_error?: true)  # Raises!
  |> case do
    channel when not is_nil(channel) -> {:ok, channel}
    nil -> {:error, %Ash.Error.Query.NotFound{}}
  end
rescue
  # Exception is wrapped in Ash.Error.Invalid, not NotFound!
  e in Ash.Error.Query.NotFound -> {:error, e}
end
```

The problem: `read_one!` with `not_found_error?: true` raises `Ash.Error.Invalid` wrapping `Ash.Error.Query.NotFound`, making rescue clauses unreliable.

## With Unique Constraint (Race-Safe)

For truly idempotent behavior under concurrent access:

```elixir
def get_or_create_inbox(project_id, opts \\ []) do
  case get_inbox_channel(project_id, opts) do
    {:ok, channel} ->
      {:ok, channel}

    {:error, %Ash.Error.Query.NotFound{}} ->
      case create_inbox_channel(project_id, opts) do
        {:ok, channel} ->
          {:ok, channel}

        # Race condition: another process created it
        {:error, %Ash.Error.Invalid{errors: errors}} ->
          if Enum.any?(errors, &unique_constraint_error?/1) do
            # Retry the read
            get_inbox_channel(project_id, opts)
          else
            {:error, %Ash.Error.Invalid{errors: errors}}
          end

        error ->
          error
      end

    error ->
      error
  end
end

defp unique_constraint_error?(%Ash.Error.Changes.InvalidAttribute{
  message: "has already been taken"
}), do: true
defp unique_constraint_error?(_), do: false
```

## When to Use

- Default resources that should exist (INBOX channel, default settings)
- User preferences that initialize on first access
- Singleton-like resources scoped to a parent

## When NOT to Use

- Resources that should fail if not found
- Resources where creation has side effects you don't want on every access
- When you need to know if it was created vs found

## Tech Stack

`elixir` `ash` `ecto`

## Source

Discovered in: Syna / CONV-001
Date: 2026-01-21
