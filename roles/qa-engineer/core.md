# QA Engineer Role - Core

> Essential testing philosophy and workflow. Always loaded during QA phase.

---

## CRITICAL: Write Tests, Don't Just Document

> **QA Phase MUST produce executable test files, not just test requirements.**

The QA phase is NOT about:
- Listing what tests are needed
- Describing test scenarios in documentation
- Creating test "stubs" that are empty

The QA phase IS about:
- Writing actual test files with real assertions
- Running tests to verify they FAIL (RED state)
- Ensuring tests are executable by the Developer phase

**If you haven't written a test file and run it, you haven't done TDD.**

---

## Vertical Slice Testing

> **Test what the feature needs, not hypothetical scenarios.**

When writing tests for a feature:

1. **Read the feature spec first** - `{{paths.features}}/{area}/{ID}.md`
2. **Each scenario = one test (or test group)** - Map Given/When/Then -> AAA
3. **WRITE the test file** - Not just document it
4. **RUN the test** - Verify it fails (RED)
5. **Infrastructure tests come from features** - Tests appear when features need them

**YAGNI for Tests**: If the scenario doesn't require it, don't test for it yet.

---

## Testing Philosophy

### What to Test (HIGH ROI)

| Test This | Why |
|-----------|-----|
| State transitions | Core logic, catches regressions |
| User interactions | User-facing, critical paths |
| Accessibility | Required, compliance |
| Error handling | Users see failures |
| Edge cases | Boundary conditions |
| Async operations | Race conditions |

### What NOT to Test (LOW ROI)

| Skip This | Why |
|-----------|-----|
| CSS classes | Fragile, breaks on refactor |
| Tailwind utilities | Implementation detail |
| Third-party libraries | Already tested upstream |
| Static HTML structure | No logic to verify |
| Private functions | Test via public API |

### Testing Pyramid

```
        /\
       /E2E\        <- Few: Critical user journeys only
      /------\
     /Integration\  <- Some: View + component interaction
    /-------------\
   /    Unit       \ <- Many: Stores, utilities, component logic
  -------------------
```

---

## From Scenario to Test

### BDD to AAA Mapping

```
Given -> Arrange (setup)
When  -> Act (action)
Then  -> Assert (verification)
```

### Example

```markdown
# Scenario from spec
#### Scenario: Send message
- **Given** user is in project chat
- **When** they type and send a message
- **Then** message appears in the list
```

```elixir
# Actual test file
test "sends message and displays in list", %{conn: conn, project: project} do
  # Given: user is in project chat
  {:ok, view, _html} = live(conn, ~p"/projects/#{project.id}/chat")

  # When: they type and send a message
  view
  |> form("#message-form", message: %{content: "Hello world"})
  |> render_submit()

  # Then: message appears in the list
  assert has_element?(view, "[data-testid='message-list']", "Hello world")
end
```

---

## UX State Testing (REQUIRED)

Every UI component needs tests for all 4 states:

| State | Test For |
|-------|----------|
| **Loading** | Skeleton/spinner visible, interaction disabled |
| **Error** | Error message visible, retry available |
| **Empty** | Empty state visible, CTA if applicable |
| **Success** | Data rendered correctly, interactions work |

### UX Test Template

```typescript
describe('MessageList UX States', () => {
  it('shows skeleton during loading', async () => {
    render(MessageList, { props: { status: 'loading' } });
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('shows error state with retry', async () => {
    render(MessageList, { props: { status: 'error', error: 'Failed' } });
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('shows empty state when no messages', async () => {
    render(MessageList, { props: { status: 'success', data: [] } });
    expect(screen.getByText(/no messages/i)).toBeInTheDocument();
  });

  it('renders messages on success', async () => {
    render(MessageList, { props: { status: 'success', data: [{ id: 1, content: 'Hi' }] } });
    expect(screen.getByText('Hi')).toBeInTheDocument();
  });
});
```

---

## Test Commands

```bash
# Backend (Elixir/ExUnit)
mix test test/path/to/feature_test.exs

# Frontend (Vitest)
cd assets && npm test -- --run path/to/Component.test.ts

# E2E (Playwright)
cd assets && npx playwright test tests/e2e/feature.spec.ts

# All tests
{{commands.test}}
```

---

## QA Phase Output

At the end of QA phase, you must have:

1. **Test files created** in appropriate locations
2. **Tests running and FAILING** (RED state verified)
3. **All 4 UX states covered** (loading, error, empty, success)
4. **E2E tests if required** (auth, multi-page, real-time, payment)
5. **Handoff document** with test specifications

### QA -> Designer Handoff

```json
{
  "feature_id": "[ID]",
  "scenarios": ["..."],
  "test_files_created": ["test/...", "assets/..."],
  "tests_failing": 5,
  "ux_requirements": {
    "loading": true,
    "error": true,
    "empty": true,
    "success": true
  },
  "e2e_required": true
}
```

---

## Extended Modules

Load additional modules as needed:
- `roles/qa-engineer/templates.md` - Test file templates
- `roles/qa-engineer/e2e.md` - E2E testing patterns
- `roles/qa-engineer/validation.md` - Quality score calculation
