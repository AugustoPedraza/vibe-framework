# Test Watcher

> Background agent that detects and runs affected tests during development.

---

## Agent Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Model** | `sonnet` | Needs to understand test relationships |
| **Context Budget** | ~20k tokens | Test files + relationships |
| **Report File** | `.claude/qa/{FEATURE-ID}/test-watcher.json` | Issue tracking |

**Spawning configuration:**
```typescript
Task({
  subagent_type: "general-purpose",
  model: "sonnet",  // Understanding test relationships needs reasoning
  run_in_background: true,
  prompt: "..." // See below
})
```

---

## Responsibility

Monitors and validates:
- Test coverage for changed files
- Affected test detection
- Test regression detection
- Coverage tracking for new code

---

## Affected Test Detection

When a file changes, determine which tests to run:

### Elixir

```bash
# Direct test file
lib/accounts/resources/user.ex -> test/accounts/resources/user_test.exs

# Pattern matching
lib/{domain}/{type}/{name}.ex -> test/{domain}/{type}/{name}_test.exs
```

### Frontend

```bash
# Co-located test
svelte/components/features/auth/LoginForm.svelte -> svelte/components/features/auth/LoginForm.test.ts

# Shared component
svelte/components/ui/Button.svelte -> Run all tests that import Button
```

---

## Watcher Behavior

```
ON FILE CHANGE (from progress report):
  1. Identify affected test files
  2. Run affected tests only (fast feedback)
  3. Check if new code has test coverage
  4. Update watcher report
  5. Report to orchestrator:
     - Test failures: WARNING during impl, BLOCKING at gate
     - Missing coverage: WARNING always

ON CRITERION COMPLETE:
  1. Run related test suite
  2. Verify criterion tests pass
  3. Check coverage percentage

ON GATE (phase transition):
  1. Run full test suite
  2. Calculate coverage for new code
  3. BLOCK if tests fail or coverage below threshold
```

---

## Check Commands

### Elixir

```bash
# Run specific test
mix test test/accounts/resources/user_test.exs --seed 0

# Run related tests
mix test test/accounts/ --seed 0

# Run with coverage
mix test --cover
```

### Frontend

```bash
cd assets

# Run related tests
npm run test:related -- svelte/components/features/auth/LoginForm.svelte

# Run with coverage
npm test -- --coverage --run
```

---

## Report Schema

Write to `.claude/qa/{FEATURE-ID}/test-watcher.json`:

```json
{
  "watcher": "test-watcher",
  "feature_id": "AUTH-001",
  "status": "watching",
  "last_check": "2026-01-23T10:30:00Z",
  "issues": [
    {
      "severity": "warning",
      "file": "lib/accounts/resources/user.ex",
      "line": 45,
      "message": "New code not covered by tests",
      "auto_fixable": false,
      "coverage_gap": {
        "lines_added": 20,
        "lines_covered": 15,
        "coverage_percent": 75
      }
    },
    {
      "severity": "error",
      "file": "test/accounts/authenticate_test.exs",
      "line": 23,
      "message": "Test failure: expected {:ok, user}, got {:error, :not_found}",
      "auto_fixable": false,
      "test_name": "returns user for valid credentials"
    }
  ],
  "metrics": {
    "tests_run": 15,
    "tests_passing": 14,
    "tests_failing": 1,
    "tests_skipped": 0,
    "coverage": {
      "new_code": 85,
      "overall": 78,
      "threshold": 80
    }
  },
  "test_results": {
    "backend": {
      "passing": 8,
      "failing": 1,
      "duration_ms": 2340
    },
    "frontend": {
      "passing": 6,
      "failing": 0,
      "duration_ms": 1520
    }
  }
}
```

---

## Coverage Tracking

Track coverage for new code specifically:

```json
{
  "coverage": {
    "new_code": {
      "lib/accounts/resources/user.ex": {
        "lines_added": 50,
        "lines_covered": 45,
        "percent": 90
      },
      "lib/accounts/actions/authenticate.ex": {
        "lines_added": 30,
        "lines_covered": 28,
        "percent": 93
      }
    },
    "aggregate": {
      "new_lines": 80,
      "covered_lines": 73,
      "percent": 91
    },
    "threshold": 80
  }
}
```

---

## Test Failure Reporting

When tests fail, provide actionable information:

```json
{
  "failures": [
    {
      "file": "test/accounts/authenticate_test.exs",
      "test": "returns user for valid credentials",
      "line": 23,
      "error": {
        "expected": "{:ok, %User{}}",
        "got": "{:error, :not_found}",
        "stacktrace": "..."
      },
      "related_code": {
        "file": "lib/accounts/actions/authenticate.ex",
        "likely_cause": "User lookup may be failing"
      }
    }
  ]
}
```

---

## Gate Behavior

At phase transitions:

```
+---------------------------------------------------------------------+
|  TEST GATE CHECK                                                     |
|                                                                      |
|  Backend Tests: 8 passing, 1 failing                                 |
|  Frontend Tests: 6 passing, 0 failing                                |
|  E2E Tests: Not run yet (integration phase)                          |
|                                                                      |
|  Coverage (new code): 85%  [OK - threshold 80%]                      |
|                                                                      |
|  Failures:                                                           |
|    [FAIL] test/accounts/authenticate_test.exs:23                     |
|           "returns user for valid credentials"                       |
|           Expected {:ok, user}, got {:error, :not_found}             |
|                                                                      |
|  Gate Status: BLOCKED (1 failing test)                               |
|                                                                      |
|  Options:                                                            |
|    [r] Re-run failed tests  [d] Show failure details  [s] Skip test  |
+---------------------------------------------------------------------+
```

---

## Missing Coverage Detection

Identify new code without tests:

```
+---------------------------------------------------------------------+
|  COVERAGE WARNING                                                    |
|                                                                      |
|  New code missing coverage:                                          |
|                                                                      |
|  lib/accounts/resources/user.ex                                      |
|    Lines 45-52: validate_password function (8 lines uncovered)       |
|    Suggestion: Add test for password validation edge cases           |
|                                                                      |
|  This is a WARNING during implementation.                            |
|  Will become BLOCKING at QA Validation gate.                         |
+---------------------------------------------------------------------+
```

---

## Integration with Orchestrator

The orchestrator:
1. Spawns test-watcher at start of implementation
2. Receives test results as agents work
3. Alerts agents immediately on test failures
4. Enforces coverage thresholds at gates

---

## Prompt Template

```
You are the Test Watcher for {FEATURE-ID}.

RESPONSIBILITY: Monitor test execution and coverage

AFFECTED TEST DETECTION:
- Map source files to test files
- Detect shared dependencies
- Run minimal test set for fast feedback

COVERAGE TRACKING:
- Track coverage for NEW code specifically
- Threshold: {coverage_threshold}%

TEST COMMANDS:
- Elixir: mix test {path} --seed 0
- Frontend: npm run test:related -- {file}

REPORT FILE: .claude/qa/{FEATURE-ID}/test-watcher.json

ON FILE CHANGE: Run affected tests
ON CRITERION COMPLETE: Run related suite
ON GATE: Run full suite + coverage

START WATCHING.
```

---

## Pre-computed Fixes

> Analyze test failures and suggest fixes at detection time.

### Report Schema with Pre-computed Fix

```json
{
  "failures": [
    {
      "file": "test/accounts/authenticate_test.exs",
      "test": "returns user for valid credentials",
      "line": 23,
      "error": {
        "expected": "{:ok, %User{}}",
        "got": "{:error, :not_found}"
      },
      "precomputed_fix": {
        "type": "suggestion",
        "analysis": "User lookup returning :not_found suggests User.get!/1 is failing",
        "likely_files": ["lib/accounts/resources/user.ex"],
        "suggested_fix": {
          "file": "lib/accounts/resources/user.ex",
          "action": "Check get action accepts email lookup",
          "code_hint": "get_by_email = Ash.Changeset.filter(query, email: email)"
        }
      }
    }
  ],
  "coverage_gaps": [
    {
      "file": "lib/accounts/resources/user.ex",
      "lines": [45, 46, 47, 48, 49, 50, 51, 52],
      "function": "validate_password",
      "precomputed_fix": {
        "type": "test_template",
        "test_file": "test/accounts/user_test.exs",
        "template": "describe \"validate_password/1\" do\n  test \"returns ok for valid password\" do\n    # Add test implementation\n  end\n\n  test \"returns error for invalid password\" do\n    # Add test implementation\n  end\nend"
      }
    }
  ]
}
```

### Fix Types for Tests

| Issue | Fix Type | Content |
|-------|----------|---------|
| Assertion failure | suggestion | Analysis + likely cause + fix hint |
| Missing coverage | test_template | Ready-to-use test scaffold |
| Flaky test | suggestion | Stabilization approach |
| Setup error | command | Fixture/seed commands |

---

## Quality Checklist

Before gate pass:
- [ ] All tests passing (0 failures)
- [ ] Coverage on new code >= threshold
- [ ] No skipped tests for new code
- [ ] Report file updated with final status
- [ ] Failures have precomputed_fix suggestions
- [ ] Coverage gaps have test_template fixes
