# Current Database Schema

> Document existing database structure (shared during migration)

## Overview

| Database | PostgreSQL {version} |
|----------|----------------------|
| Migrations | Ecto |
| Tables | {count} |
| Relationships | {describe} |

---

## Core Tables

### users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  hashed_password VARCHAR(255) NOT NULL,
  -- {other fields}
  inserted_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

**Indexes:**
- `users_email_index` UNIQUE

**Used By:**
- {feature_1}, {feature_2}

---

### {table_name}

```sql
CREATE TABLE {table_name} (
  id UUID PRIMARY KEY,
  -- {fields}
  user_id UUID REFERENCES users(id),
  inserted_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

**Indexes:**
- {index_name}

**Used By:**
- {features}

---

## Relationships

```
users 1--* {table_1}
users 1--* {table_2}
{table_1} 1--* {table_3}
```

---

## Migration Strategy

### Shared Tables (During Migration)

Both old and new code will access:

| Table | Old Code | New Code (Ash) |
|-------|----------|----------------|
| users | Ecto schema | Ash resource (same table) |
| {table_1} | Ecto schema | Ash resource (same table) |

### Schema Changes

**IMPORTANT:** No schema changes until legacy code is fully removed.

After migration complete:
- [ ] Add any new columns needed by Ash
- [ ] Remove deprecated columns
- [ ] Update indexes for Ash query patterns

---

## Ash Resource Mapping

When creating Ash resources, map to existing tables:

```elixir
defmodule App.Domain.Resource do
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer

  postgres do
    table "{existing_table_name}"  # Use existing table!
    repo App.Repo
  end

  # Map existing columns
  attributes do
    uuid_primary_key :id
    attribute :email, :string
    # ...
  end
end
```

---

## Notes

- Do NOT run Ash migrations during coexistence
- Ash resources must match existing schema exactly
- Schema cleanup happens AFTER legacy code removal
