# Data Layer Reference

> Checklist for migrations, seeds, and schema management.

## File Locations

```
priv/repo/migrations/       # Database migrations
priv/repo/seeds.exs          # Seed data
priv/repo/seeds/             # Seed modules
priv/resource_snapshots/     # Ash resource snapshots
```

## Implementation Checklist

1. **Check if migration is needed** — Only create if spec requires new tables/columns
2. **Create reversible migration** — Always use `change` blocks
3. **Run migration forward** — `mix ecto.migrate`, verify success
4. **Test rollback** — `mix ecto.rollback`, verify it works cleanly
5. **Create seeds** — For development/testing if needed
6. **Verify schema** — Matches spec data requirements

## Migration Pattern

```elixir
defmodule Syna.Repo.Migrations.CreateFeatureTable do
  use Ecto.Migration

  def change do
    create table(:feature_items) do
      add :name, :string, null: false
      add :status, :string, default: "pending"
      add :user_id, references(:users, on_delete: :delete_all), null: false
      timestamps()
    end

    create index(:feature_items, [:user_id])
    create unique_index(:feature_items, [:name, :user_id])
  end
end
```

## Safe Migration Patterns

- Add nullable columns first, backfill, then alter for NOT NULL
- Never add NOT NULL columns to existing tables without defaults
- Always create reversible migrations (use `change` not `up`/`down`)
- Use `references(..., on_delete: ...)` for foreign keys

## Ash Migration Generation

Prefer Ash-generated migrations when possible:

```bash
mix ash.codegen add_feature_table
```

This reads the Ash resource definition and generates the appropriate migration.

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Tables | plural snake_case | `users`, `feature_items` |
| Columns | singular snake_case | `email_verified_at` |
| Foreign keys | `{table}_id` | `user_id` |
| Timestamps | `*_at` suffix | `created_at` |

## Anti-Patterns

- Creating non-reversible migrations without `change` block
- Adding NOT NULL to existing tables without defaults
- Hardcoding data in migrations (use seeds)
- Skipping rollback verification
