# Quality Gates

> Auto-loaded quality verification rules for all code changes.

## Pre-Commit (MUST PASS)

### Code Quality
- All tests pass
- No lint errors
- No type errors
- Code is formatted

### Security
- No hardcoded secrets or credentials
- No `console.log` / `IO.inspect` / `dbg()` in production code
- No TODO/FIXME comments in committed code
- Input validation present at system boundaries

### Design Tokens
- No raw Tailwind colors (use `bg-primary`, `text-foreground`, etc.)
- No hardcoded z-index values (use `z-modal`, `z-dropdown`, etc.)
- Standard spacing scale only (0, 0.5, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24)
- Use existing components, don't recreate

## Test Coverage Thresholds
- Statement coverage >= 80%
- Branch coverage >= 60%
- All new code has tests
- No skipped tests (`.skip`, `@tag :skip`)

## PR Quality
- Tests pass locally
- Lint/format pass
- Commit messages are meaningful
- Branch is up to date with main
- PR has summary explaining what and why

## Detection Patterns

```yaml
# Debug statements (blocker)
pattern: "console\\.log|IO\\.inspect|debugger|dbg\\(\\)"
paths: ["lib/", "assets/svelte/"]

# Hardcoded secrets (blocker)
pattern: "(password|secret|api_key|token)\\s*=\\s*[\"'][^\"']{8,}[\"']"
paths: ["lib/", "assets/"]
exclude: ["test/", "*_test.exs", "*.test.ts"]

# Raw Tailwind colors (warning)
pattern: "bg-(red|blue|green|yellow|purple|pink|gray)-[0-9]+"
paths: ["assets/svelte/"]

# Hardcoded z-index (warning)
pattern: "z-\\[?[0-9]+"
paths: ["assets/svelte/"]
exclude: ["**/tailwind.config.*"]
```

## Auto-Fixable Issues

| Issue | Fix Command |
|-------|------------|
| Elixir formatting | `mix format` |
| Frontend formatting | `npx prettier --write` |
| Design tokens | Replace raw color with semantic token |
