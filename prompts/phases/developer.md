# Developer Phase

> TDD implementation: RED -> GREEN -> REFACTOR

---

## Phase Entry

```
+======================================================================+
|  💻 DEVELOPER PHASE                                                   |
|  Feature: {ID} - {Title}                                              |
|  Context: roles/developer/core.md                                     |
+======================================================================+
```

## Objective

Implement feature using TDD, one scenario at a time.

---

## Pre-Implementation

### 1. Load Context

From checkpoint:
- Designer handoff (components, patterns)
- QA handoff (test files)
- Prior decisions (if resuming)

### 2. Pattern Matching

```
1. Query patterns/manifest.json
2. Match feature requirements against triggers
3. Load matched patterns (top 3-5)
4. Display matched patterns
```

### 3. Architecture Reference

Load on-demand based on work type:

| Work Type | Load |
|-----------|------|
| Backend | `03-domain-ash.md` |
| Frontend | `04-frontend-components.md` |
| Auth | `15-authentication.md` |
| Testing | `17-testing-strategy.md` |

---

## Implementation Loop

For each scenario in feature spec:

### Step 1: RED (Failing Test)

1. Read the test created by QA phase
2. Run test to confirm it fails
3. Understand what needs to be implemented

```bash
mix test test/path/to/specific_test.exs
# Expected: FAIL
```

### Step 2: GREEN (Minimal Implementation)

1. Write MINIMAL code to make test pass
2. Don't over-engineer
3. Follow existing patterns

```bash
mix test test/path/to/specific_test.exs
# Expected: PASS
```

### Step 3: REFACTOR (Clean Up)

1. Remove duplication
2. Improve naming
3. Apply patterns if Rule of Three
4. Ensure tests still pass

---

## Micro-Iteration (REQUIRED)

> One baby step at a time. Verify. Then iterate.

```
┌─────────────────────────────────────────┐
│  1. SINGLE FOCUS                        │
│     One concern only per iteration      │
├─────────────────────────────────────────┤
│  2. STOP AND SHOW                       │
│     Implement minimal change            │
│     Wait for visual verification        │
├─────────────────────────────────────────┤
│  3. CONFIRM OR FIX                      │
│     "good, next" or "adjust X"          │
├─────────────────────────────────────────┤
│  4. ITERATE                             │
│     Next slice after verified           │
└─────────────────────────────────────────┘
```

---

## YAGNI Checklist

Before creating anything:

- [ ] Does the current test require this?
- [ ] Will this scenario fail without it?
- [ ] Am I solving today's problem?

**If "no" to first two: DON'T BUILD IT.**

---

## Role Extension Loading

Load additional modules when needed:

| Work Type | Load Module |
|-----------|-------------|
| Elixir/Ash | `roles/developer/backend.md` |
| Svelte/TS | `roles/developer/frontend.md` |
| TDD patterns | `roles/developer/testing.md` |
| Phase complete | `roles/developer/checklist.md` |

---

## Scenario Complete

After each scenario passes:

1. Update checkpoint with scenario_completed
2. Save files_modified
3. Update tests_status
4. Move to next scenario

```json
{
  "scenarios_completed": [
    {"scenario_number": 1, "name": "...", "completed_at": "..."}
  ]
}
```

---

## Phase Exit

### Pre-Exit Checklist

Load `roles/developer/checklist.md` and verify:

- [ ] All tests pass
- [ ] No lint errors
- [ ] No type errors
- [ ] No console.log / IO.inspect
- [ ] Design tokens used (no raw values)
- [ ] Accessibility attributes present

### Run Quality Checks

```bash
{{commands.check}}
```

### Output

```json
{
  "feature_id": "{ID}",
  "scenarios_completed": ["all"],
  "tests_status": {
    "unit": {"passing": 10, "failing": 0},
    "integration": {"passing": 5, "failing": 0}
  },
  "patterns_used": ["async-result-extraction"],
  "files_modified": [...]
}
```

### Transition

Save to checkpoint → Proceed to QA Validation
