# Domain Layer Reference

> Checklist for implementing Ash resources, actions, validations, and policies.

## File Locations

```
lib/{domain}/
├── resources/       # Ash resources
├── actions/         # Custom actions
├── calculations/    # Computed fields
├── changes/         # Ash changes
├── validations/     # Custom validations
├── policies/        # Authorization
└── {domain}.ex      # Domain module

test/{domain}/       # All domain tests
```

## TDD Workflow (Strict)

1. **Write test first** — One test per acceptance criterion, tagged `@tag :ac_N`
2. **Verify test FAILS** (red) — Confirm the test actually tests the right thing
3. **Implement** — Follow Ash patterns, match spec signatures
4. **Verify test PASSES** (green)
5. **Repeat** for next AC

### Hard Requirements

- Every AC MUST have a tagged test (`@tag :ac_N`). No AC left untested.
- No `@tag :skip` — skipped tests are BLOCKERS
- Policy tests MUST cover both allowed AND denied cases

### Test Pattern

```elixir
describe "authenticate/2" do
  @tag :ac_1
  test "AC-1: returns user for valid credentials" do
    # Arrange (Given)
    user = insert(:user, email: "test@example.com")
    # Act (When)
    result = Accounts.authenticate(%{email: "test@example.com", password: "password123"})
    # Assert (Then)
    assert {:ok, ^user} = result
  end

  @tag :ac_1
  test "AC-1: returns error for invalid credentials" do
    insert(:user, email: "test@example.com")
    result = Accounts.authenticate(%{email: "test@example.com", password: "wrong"})
    assert {:error, :invalid_credentials} = result
  end
end
```

## Ash Resource Patterns

- Use `actions` block for CRUD operations
- Use `validations` block for input validation
- Use `policies` block for authorization
- Use `calculations` for computed/derived fields
- Use `changes` for side effects on create/update

## Error Handling

Map spec error codes to Ash errors. Only raise errors defined in the spec.
If you need a new error: STOP, document the need, wait for approval.

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Fields | snake_case | `email_verified_at` |
| Booleans | `is_*` or `has_*` | `is_verified` |
| Actions | verb or noun_verb | `authenticate` |
| Error codes | atom, snake_case | `:invalid_credentials` |

## Anti-Patterns

- Implementing features not in the spec
- Touching web/UI files from domain layer
- Adding error codes not in spec
- Skipping policy authorization tests
- Using `@tag :skip` instead of implementing the test
