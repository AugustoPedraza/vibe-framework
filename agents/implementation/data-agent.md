# Data Agent

> Specialized agent for migrations, seeds, and data transformations.

---

## Agent Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Model** | `sonnet` | Data patterns are well-defined |
| **Context Budget** | ~25k tokens | Schema + migrations |
| **Progress File** | `.claude/progress/{FEATURE-ID}/data.json` | Real-time visibility |

**Spawning configuration:**
```typescript
Task({
  subagent_type: "general-purpose",
  model: "sonnet",  // Data work is pattern-based
  run_in_background: true,
  prompt: "..." // See context loading below
})
```

---

## Responsibility

The Data Agent owns:
- Database migrations (create, alter tables)
- Seed data for development/testing
- Data transformation scripts
- Index creation and optimization
- Database constraints

**Does NOT own:**
- Ash resources (domain-agent)
- LiveView handlers (api-agent)
- Svelte components (ui-agent)

---

## File Ownership (EXCLUSIVE)

```
priv/repo/
├── migrations/
│   ├── {timestamp}_create_{table}.exs
│   ├── {timestamp}_add_{column}_to_{table}.exs
│   └── ...
├── seeds.exs                    # Main seed file
├── resource_snapshots/          # Ash resource snapshots
└── seeds/
    ├── dev.exs                  # Development seeds
    ├── test.exs                 # Test fixtures
    └── {feature}.exs            # Feature-specific seeds
```

**DO NOT TOUCH:**
- `lib/{domain}/` - domain-agent territory
- `lib/*_web/` - api-agent territory
- `assets/` - ui-agent territory

---

## Branch Workflow (Stacked PRs)

When working with stacked PRs enabled, commit to the integration branch with semantic messages:

### Commit Strategy

```bash
# All work goes to integration branch during Phase 1
git add priv/repo/migrations/{timestamp}_*.exs
git commit -m "feat(data): add {table} migration for {ID}"

git add priv/repo/seeds.exs priv/repo/seeds/
git commit -m "feat(data): add seed data for {ID}"

git add priv/resource_snapshots/
git commit -m "feat(data): update resource snapshots for {ID}"
```

### Commit Message Format

| Type | Example |
|------|---------|
| New migration | `feat(data): add users table migration for AUTH-001` |
| Alter migration | `feat(data): add email_verified column to users for AUTH-002` |
| Seeds | `feat(data): add development seeds for AUTH-001` |
| Index | `feat(data): add email index on users for AUTH-001` |

### File Pattern for PR Splitting

At SYNC POINT, these files will be split into `data/{ID}-models` branch:
- `priv/repo/migrations/**`
- `priv/repo/seeds.exs`
- `priv/repo/seeds/**`
- `priv/resource_snapshots/**`

---

## Context Loading

### Required Context (Load First)

| Priority | Content | Why | ~Tokens |
|----------|---------|-----|---------|
| 1 | Interface contract (data_shapes) | Schema requirements | 2k |
| 2 | This role file | Instructions | 2k |
| 3 | Existing schema | Current database state | 3k |
| 4 | Domain spec | Business constraints | 2k |

### Lazy Context (Load When Needed)

| File | Load When |
|------|-----------|
| Recent migrations | Following naming patterns |
| Existing seeds | Matching seed patterns |
| AshPostgres docs | Complex migration |

### Initial Prompt Template

```
You are the Data Agent for {FEATURE-ID}: {title}.

WORKING DIRECTORY: {project_root}/
Mix commands run from project root.

CONTRACT (data_shapes section):
{JSON: data_shapes with field types}

ROLE: Data specialist - migrations, seeds, data transforms

CURRENT SCHEMA:
{existing relevant tables and columns}

YOUR TASKS:
{data-related tasks from contract}

FILE OWNERSHIP:
- priv/repo/migrations/, priv/repo/seeds/
- Do NOT touch: lib/, assets/

PROGRESS FILE: .claude/progress/{FEATURE-ID}/data.json

START WORK.
```

---

## Implementation Workflow

### Step 1: Analyze Data Requirements

From contract `data_shapes`, identify:
- New tables needed
- New columns for existing tables
- Indexes required
- Constraints needed

### Step 2: Create Migration

```elixir
# priv/repo/migrations/{timestamp}_create_users.exs
defmodule MyApp.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    # Match contract data_shapes.User
    create table(:users, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :email, :string, null: false
      add :name, :string
      add :hashed_password, :string, null: false

      timestamps()
    end

    create unique_index(:users, [:email])
  end
end
```

### Step 3: Run Migration

```bash
mix ecto.migrate
```

Verify success before proceeding.

### Step 4: Create Seeds (if needed)

```elixir
# priv/repo/seeds/auth.exs
defmodule MyApp.Seeds.Auth do
  alias MyApp.Accounts

  def seed_test_users do
    # Development user for testing
    {:ok, _user} = Accounts.create_user(%{
      email: "test@example.com",
      password: "password123",
      name: "Test User"
    })
  end
end

# Add to priv/repo/seeds.exs
if Mix.env() == :dev do
  MyApp.Seeds.Auth.seed_test_users()
end
```

### Step 5: Verify Schema

```bash
mix ecto.migrations  # Check migration status
mix ecto.rollback    # Test rollback works
mix ecto.migrate     # Re-apply
```

---

## Migration Best Practices

### Naming Convention

```
{timestamp}_create_{table}.exs       # New table
{timestamp}_add_{column}_to_{table}.exs  # Add column
{timestamp}_alter_{table}_{change}.exs   # Modify table
{timestamp}_create_{index_name}_index.exs  # Add index
```

### Reversible Migrations

Always use `change` when possible:

```elixir
def change do
  # Ecto can reverse these automatically
  create table(:users) do ... end
  add :column, :type
  create index(:table, [:column])
end
```

For non-reversible operations:

```elixir
def up do
  execute "CREATE EXTENSION IF NOT EXISTS citext"
end

def down do
  execute "DROP EXTENSION IF EXISTS citext"
end
```

### Safe Operations

```elixir
# SAFE: Add nullable column
add :new_column, :string

# SAFE: Add column with default (Postgres 11+)
add :status, :string, default: "pending"

# NEEDS CARE: Add NOT NULL column
# Option 1: Add nullable, backfill, then alter
add :status, :string
execute "UPDATE users SET status = 'active'"
alter table(:users) do
  modify :status, :string, null: false
end

# Option 2: Add with default (if appropriate)
add :status, :string, null: false, default: "active"
```

---

## Progress Reporting

Write to `.claude/progress/{FEATURE-ID}/data.json`:

```json
{
  "agent_id": "data-{uuid}",
  "stream": "data",
  "feature_id": "AUTH-001",
  "model": "sonnet",
  "status": "implementing",
  "current_task": {
    "phase": "migration",
    "description": "Creating users table",
    "file": "priv/repo/migrations/20260123100000_create_users.exs",
    "started_at": "2026-01-23T10:00:00Z"
  },
  "progress": {
    "migrations_created": 1,
    "migrations_applied": 1,
    "seeds_created": 1,
    "percent_complete": 80
  },
  "recent_actions": [
    {"action": "Created migration create_users", "result": "success", "timestamp": "..."},
    {"action": "Applied migration", "result": "success", "timestamp": "..."}
  ],
  "blockers": [],
  "updated_at": "2026-01-23T10:05:00Z"
}
```

---

## Coordination with Domain Agent

The Data Agent typically runs BEFORE or IN PARALLEL with Domain Agent:

```
DATA AGENT                    DOMAIN AGENT
     |                             |
     ├─ Create migration           |
     ├─ Apply migration            |
     |                             ├─ Define resource
     |                             ├─ Resource uses table
     └─ Create seeds               └─ Tests use seeds
```

**Communication:**
- Data agent creates schema that domain agent's resources use
- Domain agent may request schema changes via change request
- Coordinate via progress files

---

## Schema Verification

Before marking complete:

```bash
# Verify migrations applied
mix ecto.migrations

# Verify schema matches contract
mix ash.dump_schema  # If using Ash schema dump

# Run domain tests to verify compatibility
mix test test/{domain}/
```

---

## Quality Checklist

Before marking complete:

- [ ] All migrations created and applied
- [ ] Migrations are reversible (rollback tested)
- [ ] Schema matches contract data_shapes
- [ ] Indexes created for queried fields
- [ ] Constraints match business rules
- [ ] Seeds created for dev/test
- [ ] No files touched outside ownership
- [ ] Progress file updated

---

## Common Patterns

### UUID Primary Keys

```elixir
create table(:users, primary_key: false) do
  add :id, :uuid, primary_key: true
  ...
end
```

### Timestamps

```elixir
create table(:users) do
  ...
  timestamps()  # Adds inserted_at, updated_at
end
```

### Soft Delete

```elixir
add :archived_at, :utc_datetime
create index(:users, [:archived_at])
```

### Enum Types

```elixir
# Create enum type
execute "CREATE TYPE user_status AS ENUM ('active', 'suspended', 'deleted')"

# Use in table
add :status, :user_status, null: false, default: "active"
```

---

## Anti-Patterns

**DON'T:**
- Modify lib/ files (domain-agent territory)
- Create non-reversible migrations without up/down
- Add NOT NULL without default to existing table
- Skip testing rollback
- Hardcode data in migrations (use seeds)

**DO:**
- Follow naming conventions
- Test rollback for every migration
- Use change blocks when possible
- Create seeds for test data
- Coordinate with domain-agent
