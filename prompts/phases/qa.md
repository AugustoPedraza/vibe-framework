# QA Phase

> Generate executable tests from acceptance scenarios.

---

## Phase Entry

```
+======================================================================+
|  🧪 QA ENGINEER PHASE                                                 |
|  Feature: {ID} - {Title}                                              |
|  Context: roles/qa-engineer/core.md                                   |
+======================================================================+
```

## Objective

Transform acceptance scenarios into executable, failing tests (RED state).

---

## Workflow

### 1. Read Feature Spec

Load feature spec from `{{paths.features}}/{area}/{ID}.md`

Extract:
- Acceptance scenarios (Given/When/Then)
- UX states required
- Error conditions

### 2. Determine Test Types

| Scenario Type | Test Type |
|---------------|-----------|
| User interaction | Integration (LiveView) |
| Business logic | Unit (Domain) |
| Multi-page flow | E2E (Playwright) |
| Component state | Unit (Vitest) |

### 3. Write Tests

For each scenario:

1. Create test file in appropriate location
2. Map Given/When/Then to AAA pattern
3. Write assertions for expected behavior
4. Include all 4 UX states (loading, error, empty, success)

### 4. Run Tests

```bash
# Verify RED state
{{commands.test}}
```

**Expected**: All tests FAIL (proving they test real behavior)

---

## Test Location Rules

```
Backend tests:
  test/{domain}/*_test.exs           # Domain logic
  test/{project}_web/live/*_test.exs # LiveView

Frontend tests:
  assets/svelte/components/**/__tests__/*.test.ts

E2E tests:
  assets/tests/e2e/*.spec.ts
```

---

## E2E Required Checklist

Before completing QA phase, check:

- [ ] Is this an auth flow? → E2E REQUIRED
- [ ] Does it span multiple pages? → E2E REQUIRED
- [ ] Does it involve real-time? → E2E REQUIRED
- [ ] Is it a critical business path? → E2E REQUIRED

---

## UX State Tests

Every UI component needs tests for:

| State | Test For |
|-------|----------|
| Loading | Skeleton visible, actions disabled |
| Error | Error message, retry available |
| Empty | Empty message, CTA visible |
| Success | Data rendered, interactions work |

---

## Phase Exit

### Output

```json
{
  "feature_id": "{ID}",
  "scenarios": ["..."],
  "test_files_created": ["test/...", "assets/..."],
  "tests_failing": {count},
  "ux_requirements": {
    "loading": true,
    "error": true,
    "empty": true,
    "success": true
  },
  "e2e_required": true|false,
  "e2e_files": ["..."]
}
```

### Transition

Save handoff to checkpoint → Transition to Designer phase
