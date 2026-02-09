# Project Pitfalls

> Auto-loaded common mistakes specific to this stack. Updated by the learning phase.

## Pitfall Template

When the learning phase discovers repeated mistakes, they are recorded here:

```yaml
# PIT-XXX: Short description
# Severity: blocker | warning
# Detection: grep pattern or manual check
# Fix: How to resolve
```

## Known Pitfalls

### PIT-001: Missing Socket Prop in LiveSvelte

LiveView components rendered via LiveSvelte receive a `live` prop for server communication.
Forgetting to destructure it causes silent failures.

```svelte
<!-- WRONG -->
<script>
  let { data } = $props();
  // No way to push events to server
</script>

<!-- CORRECT -->
<script>
  let { data, live } = $props();
  await live?.pushEventAsync('action', payload);
</script>
```

### PIT-002: Ash Read Without Limit

Unbounded `Ash.read!()` calls can return entire tables.

```elixir
# WRONG
users = MyApp.Accounts.User |> Ash.read!()

# CORRECT
users = MyApp.Accounts.User |> Ash.read!(page: [limit: 50])
```

### PIT-003: Effect for Derived Values

Using `$effect` to compute derived values instead of `$derived`.

```svelte
<!-- WRONG -->
let fullName = $state('');
$effect(() => { fullName = `${first} ${last}` });

<!-- CORRECT -->
const fullName = $derived(`${first} ${last}`);
```

### PIT-004: Svelte 4 Slot Syntax

Using deprecated `<slot />` instead of Svelte 5 snippets.

### PIT-005: Raw Colors in Components

Using `bg-blue-500` instead of semantic tokens like `bg-primary`.

## Adding New Pitfalls

The learning phase (Phase 5) automatically adds pitfalls here when it detects patterns
in human interventions during `/vibe fix` sessions. Each pitfall includes:
- Detection pattern (for automated scanning)
- Fix example
- Feature where it was first discovered
