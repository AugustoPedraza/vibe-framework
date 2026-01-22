# Semantic Markers for AI Context

> Standardized markers for AI parsing and context extraction

## Purpose

Semantic markers provide consistent, machine-parseable annotations that:
1. Help AI understand code intent and constraints
2. Enable automated validation and checking
3. Improve code discoverability and documentation
4. Support tooling integration

---

## Documentation Markers

### Decision Points

Mark locations where significant decisions were made:

```markdown
<!-- AI:DECISION_POINT -->
**Decision**: Use WebSocket for real-time updates instead of polling.
**Rationale**: Lower latency, server push capability, established Phoenix Channels.
**Alternatives Considered**: SSE (no bidirectional), Polling (wasteful).
**Date**: 2026-01-15
<!-- /AI:DECISION_POINT -->
```

### Hard Blocks

Mark non-negotiable requirements:

```markdown
<!-- AI:HARD_BLOCK -->
**Requirement**: All user input MUST be validated server-side.
**Reason**: Client validation can be bypassed.
**Enforcement**: Ash changeset validations + policy checks.
<!-- /AI:HARD_BLOCK -->
```

### Checklists

Mark actionable checklists:

```markdown
<!-- AI:CHECKLIST:REQUIRED pre_commit -->
- [ ] Tests pass
- [ ] No lint errors
- [ ] No hardcoded secrets
<!-- /AI:CHECKLIST -->
```

### Pattern References

Mark when to use specific patterns:

```markdown
<!-- AI:PATTERN:USE_WHEN trigger="loading state needed" -->
Use the `AsyncResultStatus` pattern from `patterns/backend/async-result-extraction.md`
<!-- /AI:PATTERN -->
```

### Examples

Mark good and bad examples:

```markdown
<!-- AI:EXAMPLE:GOOD reason="Proper error handling" -->
```elixir
case Accounts.create_user(params) do
  {:ok, user} -> {:noreply, redirect(socket, to: ~p"/welcome")}
  {:error, error} -> {:noreply, assign(socket, :error, error)}
end
```
<!-- /AI:EXAMPLE -->

<!-- AI:EXAMPLE:BAD reason="Silent failure, no error handling" -->
```elixir
{:ok, user} = Accounts.create_user(params)  # Crashes on error!
```
<!-- /AI:EXAMPLE -->
```

---

## Code Markers (Elixir)

### Function Contracts

```elixir
# AI:PRECONDITION - user must be authenticated
# AI:POSTCONDITION - returns {:ok, _} or {:error, _}
# AI:PURE - no side effects, safe to retry
def calculate_discount(user, order) do
  # ...
end
```

### Invariants

```elixir
# AI:INVARIANT - email is always lowercase after this point
def normalize_email(email) do
  String.downcase(email)
end
```

### Security Annotations

```elixir
# AI:SECURITY - input sanitized, safe for display
# AI:SECURITY:SENSITIVE - contains PII, do not log
# AI:SECURITY:AUDIT - changes logged for compliance
def update_user_profile(user, params) do
  # ...
end
```

### Performance Hints

```elixir
# AI:PERF:CACHED - result cached for 5 minutes
# AI:PERF:EXPENSIVE - O(n^2), avoid in hot paths
# AI:PERF:ASYNC - runs in background, non-blocking
def compute_analytics(data) do
  # ...
end
```

### Deprecation

```elixir
# AI:DEPRECATED - use new_function/2 instead, remove after v2.0
# AI:DEPRECATED:DATE - 2026-06-01
def old_function(arg) do
  # ...
end
```

---

## Code Markers (TypeScript/Svelte)

### Function Contracts

```typescript
// AI:PRECONDITION - items array must not be empty
// AI:POSTCONDITION - returns sorted array, original unchanged
// AI:PURE - no side effects
function sortItems(items: Item[]): Item[] {
  return [...items].sort((a, b) => a.order - b.order);
}
```

### Component Intent

```svelte
<!-- AI:COMPONENT:INTENT
  Purpose: Display user avatar with fallback
  Props: user (required), size (optional)
  Accessibility: decorative image, aria-hidden
-->
<script lang="ts">
  // ...
</script>
```

### State Management

```typescript
// AI:STATE:SOURCE_OF_TRUTH - this store is the canonical source for user data
// AI:STATE:DERIVED - computed from userStore, do not modify directly
// AI:STATE:EPHEMERAL - UI-only, not persisted
```

### Event Handling

```svelte
<!-- AI:EVENT:BUBBLES - event propagates to parent -->
<!-- AI:EVENT:PREVENTS_DEFAULT - stops browser default behavior -->
<button on:click|preventDefault={handleClick}>
```

---

## YAML Schema Markers

### Decision Trees

```yaml
# <!-- AI:DECISION_TREE task_type -->
task_type_decision:
  rules:
    - condition: "..."
      result: "..."
# <!-- /AI:DECISION_TREE -->
```

### Checklists

```yaml
# <!-- AI:CHECKLIST pre_commit -->
pre_commit:
  items:
    - id: tests_pass
      description: All tests pass
      verification:
        type: command
        command: "mix test"
# <!-- /AI:CHECKLIST -->
```

### Schemas

```yaml
# <!-- AI:SCHEMA estimation_output -->
estimation_output:
  type: object
  properties:
    estimate_id: { type: string }
# <!-- /AI:SCHEMA -->
```

---

## Usage Guidelines

### When to Use Markers

| Marker Type | Use When |
|-------------|----------|
| `DECISION_POINT` | Significant architectural or design decision |
| `HARD_BLOCK` | Non-negotiable requirement |
| `CHECKLIST` | Actionable verification steps |
| `PATTERN:USE_WHEN` | Documenting pattern applicability |
| `EXAMPLE:GOOD/BAD` | Teaching correct/incorrect approaches |
| `PRECONDITION` | Function has input requirements |
| `POSTCONDITION` | Function guarantees specific output |
| `INVARIANT` | Property that must always hold |
| `PURE` | Function has no side effects |
| `SECURITY` | Security-relevant code |
| `PERF` | Performance-relevant code |
| `DEPRECATED` | Code scheduled for removal |

### Marker Naming Convention

```
AI:[CATEGORY]:[SUBCATEGORY] [qualifier]
```

Examples:
- `AI:DECISION_POINT`
- `AI:CHECKLIST:REQUIRED`
- `AI:PATTERN:USE_WHEN`
- `AI:SECURITY:SENSITIVE`
- `AI:PERF:CACHED`

### Consistency Rules

1. **Always close block markers**: `<!-- AI:X -->` ... `<!-- /AI:X -->`
2. **Use consistent casing**: UPPER_SNAKE for categories
3. **Include rationale**: Explain why, not just what
4. **Keep markers close to code**: Don't separate marker from relevant code
5. **Update markers when code changes**: Stale markers are worse than none

---

## Tooling Integration

### Extracting Markers

```typescript
// Extract all markers of a type from a file
function extractMarkers(content: string, type: string): Marker[] {
  const regex = new RegExp(`AI:${type}(?::[A-Z_]+)?(?:\\s+(.+))?`, 'g');
  const markers: Marker[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    markers.push({
      type,
      qualifier: match[1],
      position: match.index,
      line: content.substring(0, match.index).split('\n').length
    });
  }
  return markers;
}
```

### Validation

```typescript
// Validate all PRECONDITION markers have corresponding checks
function validatePreconditions(file: string): ValidationResult[] {
  const markers = extractMarkers(file, 'PRECONDITION');
  // Check each precondition has runtime validation...
}
```

### IDE Integration

Markers can be used for:
- **Code folding**: Collapse decision points in IDE
- **Navigation**: Jump between markers
- **Linting**: Warn on missing required markers
- **Documentation generation**: Extract markers to docs

---

## Examples by Domain

### Authentication Code

```elixir
defmodule MyApp.Accounts do
  # AI:SECURITY:AUDIT - all auth attempts logged
  # AI:HARD_BLOCK - rate limiting MUST be applied

  # AI:PRECONDITION - email must be valid format
  # AI:POSTCONDITION - returns {:ok, session} or {:error, reason}
  # AI:SECURITY:SENSITIVE - password handling
  def authenticate(email, password) do
    # AI:INVARIANT - email is lowercase
    email = String.downcase(email)

    with {:ok, user} <- get_user_by_email(email),
         :ok <- verify_password(user, password) do
      # AI:SECURITY - session token generated securely
      create_session(user)
    end
  end
end
```

### UI Component

```svelte
<!-- AI:COMPONENT:INTENT
  Purpose: Secure password input with visibility toggle
  Accessibility: WCAG AA compliant
  Security: Never logs or exposes password value
-->

<!-- AI:PATTERN:USE_WHEN trigger="password field needed" -->

<script lang="ts">
  // AI:STATE:EPHEMERAL - visibility state not persisted
  let showPassword = $state(false);

  // AI:SECURITY - password never logged or exposed
  // AI:PRECONDITION - value is string
  let { value = $bindable(''), ...props }: Props = $props();
</script>

<!-- AI:EXAMPLE:GOOD reason="Proper aria attributes for password toggle" -->
<div class="relative">
  <input
    type={showPassword ? 'text' : 'password'}
    bind:value
    aria-describedby="password-requirements"
    {...props}
  />
  <button
    type="button"
    onclick={() => showPassword = !showPassword}
    aria-label={showPassword ? 'Hide password' : 'Show password'}
    aria-pressed={showPassword}
  >
    <Icon name={showPassword ? 'eye-off' : 'eye'} aria-hidden="true" />
  </button>
</div>
<!-- /AI:EXAMPLE -->
```

### Domain Logic

```elixir
defmodule MyApp.Billing do
  # AI:DECISION_POINT
  # Decision: Use cents for all money calculations
  # Rationale: Avoid floating point precision issues
  # Date: 2026-01-10

  # AI:INVARIANT - all amounts are in cents (integer)
  # AI:PURE - no side effects
  # AI:POSTCONDITION - returns non-negative integer
  def calculate_total(items) do
    items
    |> Enum.map(& &1.price_cents)
    |> Enum.sum()
    |> max(0)  # AI:INVARIANT - total is never negative
  end

  # AI:PERF:EXPENSIVE - hits external API
  # AI:PERF:CACHED - result cached 1 hour by Cachex
  def fetch_exchange_rate(currency) do
    # ...
  end
end
```
