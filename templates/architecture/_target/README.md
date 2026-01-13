# Target Architecture

> Our migration target is the [vibe-ash-svelte-template]({migration.template_repo})

## How to Use

1. **For new features:** Follow patterns in this directory
2. **For migrations:** Transform legacy code to match these patterns
3. **For questions:** Check template repo for examples

---

## Key Differences from Current

| Aspect | Current | Target |
|--------|---------|--------|
| Backend | {current_stack.backend} | Ash Framework |
| Frontend | {current_stack.frontend} | Svelte + LiveSvelte |
| State | LiveView assigns | Svelte stores |
| PWA | Limited | Full PWA support |
| Components | Phoenix components | Svelte component library |
| Forms | Ecto changesets | Ash forms |
| Auth | {current_auth} | Ash.Authentication |
| Policies | Custom plugs | Ash policies |

---

## Target Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Backend | Elixir + Ash | Domain modeling, data layer |
| Web | Phoenix + LiveSvelte | Real-time UI |
| Frontend | Svelte 5 | Reactive components |
| Styling | Tailwind CSS 4 | Design tokens |
| Database | PostgreSQL | Persistence |
| Auth | Ash.Authentication | Identity management |

---

## Patterns (from template)

The template provides these architecture patterns:

### Fundamentals
- `_fundamentals/quick-reference.md` - Core decisions, patterns
- `_fundamentals/vertical-slice.md` - Feature organization

### Guides
- `_guides/testing.md` - BDD, test pyramid
- `_guides/forms.md` - Ash forms + Svelte
- `_guides/realtime.md` - Channels, presence

### Patterns
- `_patterns/ash-resource.md` - Ash resource patterns
- `_patterns/svelte-component.md` - Component patterns
- `_patterns/livesvelte.md` - LiveView + Svelte integration

### Anti-Patterns
- `_anti-patterns/` - What to avoid

### Checklists
- `_checklists/ux-pwa.md` - PWA requirements
- `_checklists/accessibility.md` - A11y requirements
- `_checklists/quality.md` - Code quality

---

## Template Repository

**URL:** {migration.template_repo}

**To sync patterns:**
```bash
# Clone template (if not done)
git clone {migration.template_repo} ~/projects/vibe-ash-svelte-template

# Run vibe check to see sync status
/vibe check
```

---

## Migration Pattern

When migrating a feature:

### 1. Create Ash Resource (same table)

```elixir
# Map to existing table - NO schema changes
defmodule App.Domain.Resource do
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer

  postgres do
    table "existing_table"  # Use existing!
    repo App.Repo
  end
end
```

### 2. Create Svelte Components

```svelte
<!-- Follow template patterns -->
<script>
  import { pushEvent } from '$lib';

  export let data;
</script>
```

### 3. Create LiveView with LiveSvelte

```elixir
defmodule AppWeb.FeatureLive do
  use AppWeb, :live_view

  def render(assigns) do
    ~H"""
    <.svelte name="Feature" props={%{data: @data}} socket={@socket} />
    """
  end
end
```

### 4. Test Compatibility

- Regression tests must pass
- Same behavior as legacy
- Then switch routes

---

## Notes

- Always reference template for patterns
- Don't modify database schema during migration
- Regression tests required before migration
- See `.claude/migration.md` for progress tracking
