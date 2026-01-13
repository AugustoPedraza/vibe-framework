# MIGRATE-{FEATURE}: {Feature Name}

> Migration from {current_stack} to Ash+Svelte

**Status:** Test Battery Required

---

## Legacy Analysis

### Location

| Type | Path |
|------|------|
| LiveView | `lib/app_web/live/{feature}_live.ex` |
| Context | `lib/app/contexts/{feature}.ex` |
| Templates | `lib/app_web/live/{feature}_live.html.heex` |

### Routes

| Path | Method | Action |
|------|--------|--------|
| /{feature} | GET | List |
| /{feature}/:id | GET | Show |
| /{feature}/new | GET | New |
| /{feature} | POST | Create |
| /{feature}/:id | PATCH | Update |
| /{feature}/:id | DELETE | Delete |

### Database Tables

| Table | Shared During Migration? |
|-------|--------------------------|
| {table_name} | Yes |
| {related_table} | Yes |

### Dependencies

What this feature uses:

- [ ] User context / Authentication
- [ ] {other_dependency}

### Dependents

What uses this feature:

- [ ] {dependent_feature_1}
- [ ] {dependent_feature_2}

---

## Current Behavior

Document what the feature does NOW:

### {Behavior 1}
- {description}

### {Behavior 2}
- {description}

### Edge Cases
- {edge_case_1}
- {edge_case_2}

---

## Migration Scope

### Routes to Migrate

- [ ] /{feature}
- [ ] /{feature}/:id
- [ ] /{feature}/new

### Database Strategy

- Use existing tables (shared)
- New Ash resource maps to same table
- No schema changes until legacy removed

### Component Mapping

| Legacy | Target (Ash+Svelte) |
|--------|---------------------|
| `{Feature}Live` | `{Feature}Live` + `Feature.svelte` |
| `{feature}_live.html.heex` | Svelte components |
| Context functions | Ash domain actions |

---

## Acceptance Scenarios

> These scenarios document current behavior and become regression tests

### Scenario 1: {scenario_name}

- **Given** {precondition}
- **When** {action}
- **Then** {expected_result}

### Scenario 2: {scenario_name}

- **Given** {precondition}
- **When** {action}
- **Then** {expected_result}

### Scenario 3: {scenario_name}

- **Given** {precondition}
- **When** {action}
- **Then** {expected_result}

### Scenario 4: Error - {error_case}

- **Given** {precondition}
- **When** {invalid_action}
- **Then** {error_handling}

---

## Test Requirements

> Tests must be written in **target architecture** (not legacy patterns)

### Backend Tests (ExUnit + Ash)

**File:** `test/app/domains/{domain}/{feature}_test.exs`

| Test | Scenario |
|------|----------|
| `test "scenario 1 description"` | Scenario 1 |
| `test "scenario 2 description"` | Scenario 2 |
| `test "scenario 3 description"` | Scenario 3 |
| `test "error case description"` | Scenario 4 |

### Frontend Tests (Vitest + Svelte)

**File:** `assets/svelte/tests/{Feature}.test.ts`

| Test | What it tests |
|------|---------------|
| `test "renders feature list"` | List rendering |
| `test "shows loading state"` | Loading state |
| `test "handles error state"` | Error handling |
| `test "empty state with CTA"` | Empty state |

### Integration Tests (LiveView)

**File:** `test/app_web/live/{feature}_live_test.exs`

| Test | What it tests |
|------|---------------|
| `test "full user flow"` | End-to-end flow |

---

## Migration Readiness Gate

Before implementation can start:

- [ ] All test files created (target architecture)
- [ ] Tests pass against legacy code
- [ ] All scenarios have corresponding tests
- [ ] Edge cases covered
- [ ] No blocking dependencies

**Current Status:** Test Battery Required

---

## Implementation Plan

Once tests pass against legacy code:

1. **Create Ash Resource**
   - Map to existing table
   - Define attributes matching schema
   - Define actions matching current behavior
   - Add policies

2. **Create Svelte Components**
   - `{Feature}List.svelte`
   - `{Feature}Form.svelte`
   - `{Feature}Item.svelte`

3. **Create LiveView with LiveSvelte**
   - `{Feature}Live` module
   - Connect Svelte components
   - Handle events

4. **Update Routes**
   - Add new route (parallel)
   - Verify behavior matches
   - Switch traffic
   - Remove old route

5. **Verify & Cleanup**
   - All tests pass (new code)
   - Remove legacy code
   - Update dependents

---

## Deprecation Checklist

- [ ] New implementation complete
- [ ] All tests pass (new code)
- [ ] Traffic routed to new code
- [ ] Legacy code removed
- [ ] Dependencies updated
- [ ] Documentation updated

---

## Notes

{Any additional context, gotchas, or considerations}
