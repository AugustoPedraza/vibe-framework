# Developer Role - Checklist

> Quality gates and pre-commit checks. Load at phase end.

---

## Pre-Commit Checklist

### Code Quality

- [ ] Tests pass (`{{commands.test}}`)
- [ ] No lint errors (`{{commands.check}}`)
- [ ] No type errors
- [ ] No console.log / IO.inspect left behind
- [ ] No hardcoded secrets or credentials
- [ ] No TODO comments without ticket reference

### Design Token Compliance

- [ ] No raw Tailwind colors (use `bg-primary`, not `bg-blue-500`)
- [ ] No hardcoded z-index (use `z-modal`, `z-overlay`)
- [ ] Standard spacing only (`p-4`, `m-6`, not `p-5`, `m-7`)
- [ ] No arbitrary values for common patterns

### Accessibility

- [ ] Interactive elements have aria-labels
- [ ] Form inputs have associated labels
- [ ] Focus visible on all interactive elements
- [ ] Color contrast meets WCAG AA (4.5:1+)

### Environment Changes

- [ ] New ENV vars added to `.env.example`
- [ ] New ENV vars documented in `docs/ENVIRONMENT.md`
- [ ] PR description mentions ENV changes

---

## Code Review Checklist

### Readability

- [ ] Does it follow existing patterns?
- [ ] Is the naming clear and consistent?
- [ ] Are there early returns instead of deep nesting?
- [ ] Is it the simplest solution that works?

### Maintainability

- [ ] No code duplication (Rule of Three)
- [ ] Single responsibility per function
- [ ] No speculative abstractions

### Error Handling

- [ ] All error cases handled
- [ ] User-friendly error messages
- [ ] No silent failures
- [ ] Logging for unexpected errors

### Performance

- [ ] No N+1 queries
- [ ] No blocking in mount (use assign_async)
- [ ] No unnecessary re-renders

---

## Refactoring Triggers

### When to Refactor

| Smell | Indicator | Action |
|-------|-----------|--------|
| Duplication | 3+ occurrences | Extract to shared |
| Long function | > 25 lines | Extract methods |
| Shotgun surgery | Change touches > 3 files | Consolidate |
| Feature envy | Uses other module's data more | Move method |
| Long parameter list | > 4 parameters | Parameter object |

### Safe Refactoring Process

```
1. VERIFY TEST COVERAGE
   - Run coverage report
   - If < 80%, write characterization tests first

2. MAKE ONE CHANGE
   - Single responsibility per commit
   - Don't mix refactoring with features

3. RUN TESTS
   - All tests must pass
   - Watch for timing-dependent failures

4. COMMIT
   - "refactor(scope): description"
   - Small, atomic commits
```

### Never Refactor When

- Under time pressure (creates bugs)
- Without test coverage (unsafe)
- When feature is still evolving
- For aesthetic reasons only

---

## CSS Anti-Patterns

### Z-Index

```svelte
<!-- WRONG -->
<div class="z-50 z-[999]">

<!-- CORRECT -->
<div class="z-modal z-overlay z-dropdown">
```

### Colors

```svelte
<!-- WRONG -->
<div class="bg-blue-500 text-gray-600">

<!-- CORRECT -->
<div class="bg-primary text-muted">
```

### Spacing

```svelte
<!-- WRONG -->
<div class="p-5 m-7 gap-9">

<!-- CORRECT -->
<div class="p-4 m-6 gap-8">
```

### Mobile Viewport

```svelte
<!-- WRONG -->
<div class="h-[100vh]">

<!-- CORRECT -->
<div class="h-dvh">
```

### Scroll Container

```svelte
<!-- WRONG -->
<div class="overflow-y-auto">

<!-- CORRECT -->
<div class="overflow-y-auto overscroll-contain">
```

---

## Backend Anti-Patterns

### Business Logic in LiveView

```elixir
# WRONG: 50 lines of logic in handle_event
def handle_event("submit", params, socket) do
  # validation, processing, side effects...
end

# CORRECT: Delegate to domain
def handle_event("submit", params, socket) do
  case Accounts.register_user(params) do
    {:ok, user} -> {:noreply, redirect(socket, to: ~p"/welcome")}
    {:error, error} -> {:noreply, assign(socket, :error, error)}
  end
end
```

### Missing socket in LiveSvelte

```elixir
# WRONG
<.svelte name="Component" props={%{data: @data}} />

# CORRECT
<.svelte name="Component" props={%{data: @data}} socket={@socket} />
```

### Unhandled Error Cases

```elixir
# WRONG
{:ok, result} = might_fail()

# CORRECT
case might_fail() do
  {:ok, result} -> handle_success(result)
  {:error, reason} -> handle_error(reason)
end
```

---

## Commands Reference

```bash
# Development
{{commands.dev}}        # Start dev server
{{commands.check}}      # All quality checks
{{commands.test}}       # All tests

# Frontend (from assets/)
npm run dev           # Vite dev server
npm run test          # Vitest
npm run lint          # ESLint

# Backend
mix phx.server        # Phoenix server
mix test              # ExUnit tests
mix format            # Format code
iex -S mix            # Interactive shell
```
