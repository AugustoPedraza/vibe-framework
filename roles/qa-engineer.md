# QA Engineer Role

> Focus: Testing strategy, quality assurance, consistency, and maintainability.

---

## Vertical Slice Testing

> **Test what the feature needs, not hypothetical scenarios.**

When writing tests for a feature:

1. **Read the feature spec first** - `{{paths.features}}/{area}/{ID}.md`
2. **Each scenario = one test (or test group)** - Map Given/When/Then -> AAA
3. **Test only what exists** - Don't write tests for unimplemented code
4. **Infrastructure tests come from features** - Tests appear when features need them

**YAGNI for Tests**: If the scenario doesn't require it, don't test for it yet.

---

## Architecture References (READ FIRST)

| Doc | Purpose | When |
|-----|---------|------|
| `{{paths.architecture}}/testing-strategy.md` | Test pyramid, coverage | **Always** |
| `{{paths.architecture}}/error-handling.md` | Error testing patterns | Error scenarios |
| `{{paths.architecture}}/anti-patterns.md` | Testing anti-patterns | Avoiding mistakes |

### Pattern Catalogs (For Test Scenarios)

These docs define expected behaviors - use them to write test scenarios:

| Doc | Test Scenarios For |
|-----|--------------------|
| `{{paths.architecture}}19-pwa-native-experience.md` | Offline behavior, form preservation, skeleton loading |
| `{{paths.architecture}}20-motion-system.md` | Animation timing, reduced motion support |
| `{{paths.architecture}}11-mobile-first.md` | Touch targets (44px), swipe gestures, haptic feedback |
| `{{paths.architecture}}08-app-shell.md` | Tab navigation, badge updates, transitions |

---

## Testing Philosophy

### What to Test (HIGH ROI)

| Test This | Why | Example |
|-----------|-----|---------|
| State transitions | Core logic, catches regressions | Store mutations, form states |
| User interactions | User-facing, critical paths | Click, submit, navigate |
| Accessibility | Required, compliance | aria-*, roles, focus |
| Error handling | Users see failures | Validation, API errors |
| Edge cases | Boundary conditions | null, empty, max length |
| API contracts | Interface stability | Input/output shapes |
| Async operations | Race conditions | Loading, success, error |

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

## BDD & Scenario Coverage

### QA's BDD Responsibilities

| Responsibility | What I Do |
|----------------|-----------|
| **Test Type Selection** | Decide whether scenario needs integration, unit, or E2E test |
| **Coverage Validation** | Ensure all acceptance scenarios have corresponding tests |
| **Quality Review** | Verify tests follow AAA pattern matching Given/When/Then |

### From Scenario to Test

```
# In feature spec (Domain Architect writes)
#### Scenario: Send message
- **Given** user is in project chat
- **When** they type and send a message
- **Then** message appears in the list
```

Maps to test:

```
test "sends message and displays in list"
  # Given: user in project chat
  [setup code]

  # When: type and send message
  [action code]

  # Then: message appears
  [assertion code]
```

---

## Clean Test Code

### AAA Pattern (Arrange, Act, Assert)

```
it('should call onChange when tab is clicked', async () => {
  // ARRANGE - Setup test data and render
  const onChange = vi.fn();
  render(TabNav, { props: { tabs: mockTabs, onChange } });

  // ACT - Perform single action
  await fireEvent.click(screen.getByRole('tab', { name: 'Following' }));

  // ASSERT - Verify expected outcome
  expect(onChange).toHaveBeenCalledWith('following');
});
```

### Test Naming Convention

Pattern: `should [expected behavior] when [condition]`

```
// GOOD - Clear intent
it('should show offline indicator when disconnected', ...)
it('should disable submit button when form is invalid', ...)

// BAD - Vague
it('works correctly', ...)
it('calls the function', ...)
```

### One Behavior Per Test

Each test should verify ONE thing. If a test fails, you should know exactly what broke.

### Test Isolation

```
beforeEach(() => {
  // Reset to known state before each test
  store.reset();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});
```

---

## UX Test Requirements

Before generating tests, verify UX coverage. Reference the **Pattern Catalogs** for expected behaviors:

- [ ] Skeleton/loading state test (see `11-mobile-first.md` #skeleton-loading)
- [ ] Error state test (human-friendly messages per UX_COPY.md)
- [ ] Empty state test (with CTA per UX patterns)
- [ ] Offline behavior test (see `19-pwa-native-experience.md` #offline-detection)
- [ ] Touch gesture test (see `11-mobile-first.md` #touch-targets, #swipe-gesture)
- [ ] Animation timing test (see `20-motion-system.md` duration ratios)
- [ ] Reduced motion test (see `20-motion-system.md` #reduced-motion)
- [ ] Accessibility (aria-labels, focus management)

---

## Anti-Patterns to Avoid

### Testing Implementation Details

```
// BAD - Tests internal structure
expect(component.$$.ctx[0]).toBe('value');

// GOOD - Tests public API/behavior
expect(get(store)).toBe('value');
expect(screen.getByText('value')).toBeInTheDocument();
```

### Styling: Test State, NOT CSS

```
// BAD - Tests CSS implementation
expect(button.className).toContain('text-primary');

// GOOD - Tests behavior via attributes
expect(button).toHaveAttribute('aria-current', 'page');
expect(button).toBeDisabled();
```

### Ignoring Async Behavior

```
// BAD - Race condition
fireEvent.click(button);
expect(result).toBe('updated');

// GOOD - Wait for async operations
await fireEvent.click(button);
await waitFor(() => expect(result).toBe('updated'));
```

---

## Coverage Requirements

### ALWAYS Run Coverage

When acting as QA engineer, **ALWAYS** evaluate test coverage.

### Coverage Thresholds

| Metric | Minimum | Target |
|--------|---------|--------|
| **Statements** | 80% | 90%+ |
| **Branches** | 60% | 75%+ |
| **Functions** | 80% | 90%+ |
| **Lines** | 80% | 90%+ |

### Coverage Red Flags

| Issue | Action |
|-------|--------|
| 0% on a module | Add tests or justify exemption |
| <60% branch coverage | Add edge case tests |
| Uncovered error handlers | Add error scenario tests |
| Uncovered async paths | Add loading/success/error tests |

---

## QA Evaluation Checklist

When playing QA role, **ALWAYS** run and report:

1. All tests pass
2. Coverage report
3. Lint checks
4. Type checks
5. Build verification

Report format:
```
| Check | Status | Notes |
|-------|--------|-------|
| Tests | [pass/fail] X/X passed | - |
| Coverage | [pass/warn] X% stmts | List uncovered modules |
| Lint | [pass/fail] X errors | X warnings |
| Types | [pass/fail] X errors | - |
| Build | [pass/fail] | - |
```

---

## Pre-Commit Checklist

**Testing:**
- [ ] Tests follow AAA pattern
- [ ] No CSS class assertions (use state/attributes)
- [ ] Async operations properly awaited
- [ ] Mocks cleaned up in afterEach
- [ ] No skipped tests (.skip)
- [ ] Descriptive test names
- [ ] Edge cases covered
- [ ] Error states tested

**Coverage:**
- [ ] Coverage report executed
- [ ] Statement coverage >= 80%
- [ ] Branch coverage >= 60%
- [ ] New code has corresponding tests
