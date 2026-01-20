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

> See: `roles/_shared/architecture-refs.md` for complete architecture reference
> See: `roles/_shared/platform-constraints.md` for PWA platform test requirements

### QA-Specific References

| Doc | Purpose | When |
|-----|---------|------|
| `{{paths.architecture}}/_guides/testing.md` | Test pyramid, coverage, E2E | **Always** |
| `{{paths.architecture}}/_guides/errors.md` | Error testing patterns | Error scenarios |
| `{{paths.architecture}}/_anti-patterns/` | Testing anti-patterns | Avoiding mistakes |

### Pattern Catalogs (For Test Scenarios)

These docs define expected behaviors - use them to write test scenarios:

| Doc | Test Scenarios For |
|-----|--------------------|
| `{{paths.architecture}}19-pwa-native-experience.md` | Offline behavior, form preservation, skeleton loading |
| `{{paths.architecture}}20-motion-system.md` | Animation timing, reduced motion support |
| `{{paths.architecture}}11-mobile-first.md` | Touch targets (44px), swipe gestures, haptic feedback |
| `{{paths.architecture}}08-app-shell.md` | Tab navigation, badge updates, transitions |
| `{{paths.architecture}}/_patterns/native-mobile.md` | Camera, uploads, haptics, platform limits |

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

## E2E Test Requirements (MANDATORY)

> **Critical paths MUST have E2E tests.** These catch integration gaps that unit/integration tests miss.

### When to Write E2E Tests

| MUST Have E2E | Skip E2E (covered elsewhere) |
|---------------|------------------------------|
| Login/logout flow | Form field validation |
| Registration/onboarding | Individual component state |
| Payment/checkout flows | API response handling |
| Cross-page navigation | Error message display |
| Real-time features (chat, notifications) | Loading spinners |
| File upload/download | Button disabled states |

### E2E Checklist (Verify Before Completing QA Phase)

Before marking QA phase complete, check if current feature requires E2E:

- [ ] **Is this an auth flow?** (login, logout, register, password reset) → **E2E REQUIRED**
- [ ] **Does it span multiple pages?** (wizard, checkout, onboarding) → **E2E REQUIRED**
- [ ] **Does it involve real-time?** (chat, live updates) → **E2E REQUIRED**
- [ ] **Is it a critical business path?** (payment, data export) → **E2E REQUIRED**
- [ ] **Does it integrate multiple systems?** (LiveView + Svelte + PubSub) → **E2E REQUIRED**

### E2E Test Location

```
assets/tests/e2e/
├── auth.spec.ts        # Login, logout, register, password flows
├── projects.spec.ts    # Project CRUD, navigation
├── chat.spec.ts        # Real-time messaging
└── fixtures/
    └── auth.ts         # Authenticated page fixture
```

### Why E2E Catches What Others Miss

| Gap Type | Unit Tests | Integration Tests | E2E Tests |
|----------|------------|-------------------|-----------|
| Component not registered in app.js | ❌ | ❌ | ✅ |
| Route not defined in router | ❌ | ✅ | ✅ |
| LiveView ↔ Svelte event mismatch | ❌ | ❌ | ✅ |
| Session/cookie issues | ❌ | ❌ | ✅ |
| CSS breaking layout | ❌ | ❌ | ✅ |
| JavaScript bundle errors | ❌ | ❌ | ✅ |

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

## User Messaging Tests (MANDATORY)

> Reference: `{{paths.architecture}}/_guides/user-messaging.md`

### Error Handling Tests

- [ ] User errors show field-level hints (not toasts)
- [ ] Auth errors show toast AND redirect to /login
- [ ] System errors show generic "Something went wrong"
- [ ] System errors are reported to Sentry
- [ ] User/auth/business errors are NOT reported to Sentry

### Toast Tests

- [ ] Success actions show success toast
- [ ] Error actions show error toast
- [ ] Toasts auto-dismiss (default 4s)
- [ ] Toast can be dismissed manually

### Copy Tests

- [ ] All copy functions return strings
- [ ] Copy matches UX_COPY.md guidelines
- [ ] No hardcoded strings in components

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

## Mobile UX Testing Checklist

> Reference: `{{paths.architecture}}/_guides/ux-design-philosophy.md`

### Touch & Interaction

- [ ] Touch targets >= 24px (WCAG AA minimum)
- [ ] Recommended touch targets 44-48px for primary actions
- [ ] Spacing between targets >= 8px
- [ ] No dropdowns for selection (use segmented/chips/sheet)
- [ ] Primary actions in bottom 50% of screen (thumb zone)
- [ ] Single primary action per screen

### Visual

- [ ] Dark mode supported and tested
- [ ] Contrast ratio 4.5:1 minimum (text), 3:1 (large text/UI)
- [ ] No pure black (#000) backgrounds (use #121212)
- [ ] Color is not sole indicator (icons + color)

### Accessibility

- [ ] `prefers-reduced-motion` respected
- [ ] Motion < 100ms when reduced motion enabled
- [ ] Dynamic type accommodated
- [ ] Focus visible on all interactive elements
- [ ] Keyboard navigation works

### Loading States

- [ ] Skeleton for loads > 1s
- [ ] Button spinner for loads < 1s
- [ ] No full-page spinners
- [ ] Optimistic updates where appropriate

### Component Selection (Anti-Pattern Check)

| If You See | Flag As | Should Be |
|------------|---------|-----------|
| Hamburger as primary nav | Anti-pattern | Bottom tab bar |
| Dropdown with 2-7 options | Anti-pattern | Segmented control or chips |
| Centered modal on mobile | Anti-pattern | Bottom sheet |
| Spinner for content load | Anti-pattern | Skeleton loader |
| Pure black dark mode | Anti-pattern | #121212 background |

---

## Native Mobile Testing

> Reference: `{{paths.architecture}}/_patterns/native-mobile.md`

### Device Testing Requirements

Native-like features **MUST** be tested on real devices (not just simulators):

| Feature | iOS Device Test | Android Device Test |
|---------|-----------------|---------------------|
| Camera capture | Real camera, both front/back | Real camera, both front/back |
| Audio recording | Real mic, test background behavior | Real mic, test background |
| File upload | Test backgrounding (pauses), resume | Test background sync continues |
| Haptics | Verify no errors (API unavailable) | Verify vibration works |
| Push notifications | Home screen install required | Standard PWA behavior |

### Test Scenarios for Native Features

#### Upload Resume
- [ ] Start upload, switch apps, return → upload resumes (iOS pauses, Android continues)
- [ ] Start upload, lose network, regain → upload resumes from last chunk
- [ ] Start upload, force close app, reopen → prompt to resume or show saved progress
- [ ] iOS: verify upload pauses when backgrounded (expected behavior, not a bug)

#### Draft Persistence
- [ ] Type message, close tab → reopen shows draft banner
- [ ] Type message, navigate away in app → return shows draft
- [ ] Type message, force close app → reopen shows recovery banner
- [ ] Draft auto-saves (check localStorage/IndexedDB)

#### Camera/Microphone
- [ ] Permission denied → graceful fallback UI shown
- [ ] Permission granted → capture works
- [ ] Switch front/back camera mid-session
- [ ] iOS MediaRecorder → verify Settings > Safari > Advanced toggle works

#### Haptic Feedback (Behavior Test)
```typescript
// Test that haptic doesn't throw on iOS
it('should not throw when vibration unavailable', () => {
  // Mock missing API
  delete (navigator as any).vibrate;

  expect(() => haptic('light')).not.toThrow();
});
```

### E2E Test Additions for Native Features

| Feature Type | E2E Required? | Why |
|--------------|---------------|-----|
| File upload flow | Yes | Critical user journey |
| Camera capture flow | Yes (if core feature) | Permission + capture + preview |
| Push notification delivery | No (manual test) | Browser dependency |
| Draft recovery | Yes | Cross-session persistence |

### Platform-Specific Mocking

```typescript
// Mock iOS platform for testing
beforeEach(() => {
  Object.defineProperty(navigator, 'userAgent', {
    value: 'iPhone OS 16_0',
    configurable: true
  });
});

// Mock missing APIs
beforeEach(() => {
  delete (navigator as any).vibrate; // iOS doesn't have this
});
```

---

## Security Checks (Required for Auth/Data Features)

**Always verify when feature involves authentication, user data, or sensitive operations.**

### Input Validation
- [ ] All user inputs validated server-side (not just client)
- [ ] Input length limits enforced
- [ ] Type coercion handled safely
- [ ] File uploads validated (type, size, content)

### Authentication & Authorization
- [ ] Auth tokens validated on each request
- [ ] Session management secure (proper expiry, invalidation)
- [ ] Role-based access enforced at action level
- [ ] Sensitive actions require re-authentication

### Data Protection
- [ ] Sensitive data not logged (passwords, tokens, PII)
- [ ] Sensitive data not exposed in responses
- [ ] Proper data sanitization on output (XSS prevention)
- [ ] API responses don't leak internal structure

### Common Vulnerabilities (OWASP Top 10)
- [ ] SQL injection: Using Ash queries (parameterized by default)
- [ ] XSS: Svelte escapes by default, verify `{@html}` usage
- [ ] CSRF: Phoenix tokens in place
- [ ] Broken access control: Policies enforced on all actions
- [ ] Security misconfiguration: No debug info in production

### Test Scenarios for Security
```elixir
# Test unauthorized access
test "rejects unauthorized user" do
  assert {:error, %Ash.Error.Forbidden{}} = Domain.action(resource, actor: other_user)
end

# Test input validation
test "rejects invalid input" do
  assert {:error, _} = Domain.create(Resource, %{email: "not-an-email"})
end

# Test rate limiting (if applicable)
test "rate limits excessive requests" do
  for _ <- 1..100, do: make_request()
  assert {:error, :rate_limited} = make_request()
end
```

---

## PWA Auth Testing Checklist

> Reference: `{{paths.architecture}}/_patterns/pwa-auth.md`

### Session Persistence

- [ ] User stays logged in after closing browser (30-day session)
- [ ] User stays logged in after device restart
- [ ] Session extends on activity (test after 25 days if possible)
- [ ] Session expires after 30 days of inactivity

### Offline Auth Scenarios

- [ ] App works offline with valid session (full functionality)
- [ ] App shows read-only mode with expired session offline
- [ ] Re-auth modal appears on reconnection with expired session
- [ ] Queued actions flush after successful re-auth
- [ ] Failed auth actions stay queued (not discarded)

### Re-authentication UX

- [ ] Uses inline modal (not page redirect)
- [ ] Preserves user context during re-auth
- [ ] Validates same user on re-auth (prevent account switching)
- [ ] Shows clear error messages on failure
- [ ] Auto-focuses email field in modal

### Security

- [ ] Session token NOT visible in localStorage/sessionStorage (HttpOnly cookie only)
- [ ] Only session expiry timestamp is cached in localStorage
- [ ] Logout clears session from database
- [ ] "Logout all devices" invalidates other sessions
- [ ] CSRF token refreshed on LiveView mount

### Multi-device

- [ ] User can be logged in on multiple devices simultaneously
- [ ] Logout on one device doesn't affect others
- [ ] "Logout all devices" logs out all devices
- [ ] Session metadata (device, IP) tracked correctly

---

## Responsive Testing Checklist

> Reference: `{{paths.architecture}}/_guides/desktop-ux.md`

### Viewport Matrix

Test at these viewport widths to cover all breakpoints:

| Viewport | Width | Breakpoint Class | Test Focus |
|----------|-------|------------------|------------|
| Mobile S | 375px | Compact | Core mobile layout |
| Mobile L | 428px | Compact | Large mobile |
| Tablet P | 768px | Medium | Navigation rail transition |
| Tablet L | 1024px | Expanded | Desktop minimum |
| Desktop | 1280px | Large | Full desktop layout |
| Desktop L | 1440px | Large | Wide desktop |
| Desktop XL | 1920px | Large | Max common width |

### Navigation Transformation

- [ ] Bottom tabs visible at <600px
- [ ] Bottom tabs hidden at >=600px
- [ ] Sidebar visible at >=600px (or navigation rail at medium)
- [ ] Desktop header visible at >=600px
- [ ] Mobile AppHeader hidden at >=600px
- [ ] Navigation items consistent across breakpoints

### Layout Tests

- [ ] Content never exceeds 1024px width on large viewports
- [ ] Forms center correctly on desktop (max 640px)
- [ ] Split-pane shows detail on selection (>=840px)
- [ ] Split-pane list panel fixed width (~380px)
- [ ] Card grids reflow at breakpoints (1→2→3→4 cols)
- [ ] No horizontal scroll at any viewport

### Component Transformation

- [ ] Modal: slides from bottom on mobile, centered on desktop
- [ ] BottomSheet: transforms to dropdown for menus on desktop
- [ ] List detail: navigates on mobile, shows in split-pane on desktop
- [ ] Settings: full-width on mobile, split-pane on desktop

### Content Width

- [ ] Main content max-width: 1024px
- [ ] Centered forms max-width: 640px
- [ ] Sidebar width: ~280px
- [ ] White space on sides when viewport > 1304px

### Visual Regression Checkpoints

| Screen | Compact | Medium | Expanded | Large |
|--------|---------|--------|----------|-------|
| Dashboard | Stacked | 2-col | 3-col | 4-col |
| List view | List | List | Split | Split |
| Form | Full | Centered | Centered | Centered |
| Settings | List | List | Split | Split |
| Modal | Bottom | Bottom | Center | Center |

---

## Visual Design System Testing Checklist

> Reference: `{{paths.architecture}}/_guides/visual-design-system.md`

### Micro-Interaction Tests

- [ ] Buttons scale down on press (`active:scale-95`)
- [ ] Icon buttons scale down on press (`active:scale-90`)
- [ ] Interactive cards lift on hover (shadow increases, translates up)
- [ ] FormField shakes on validation error (when `shake` prop used)
- [ ] Success alerts animate in (when `animate` prop used)
- [ ] Loading skeletons pulse OR shimmer (based on prop)

### Elevation Tests

- [ ] Cards have `shadow-sm` (subtle elevation)
- [ ] Dropdowns have `shadow-md` (medium elevation)
- [ ] Modals have `shadow-xl` (high elevation)
- [ ] Interactive cards change shadow on hover (`shadow-sm` → `shadow-md`)

### Spacing Tests (4px Grid)

- [ ] All spacing values divisible by 4px
- [ ] Form fields use `space-y-4` (16px) gap
- [ ] Cards use `p-4` (16px) padding
- [ ] Touch targets >= 44px height

### Component Dimension Tests

| Component | Expected Height |
|-----------|-----------------|
| Button (sm) | 32px |
| Button (md) | 40px |
| Button (lg) | 48px |
| Input | 40px |
| Touch target min | 44px |

### Animation Timing Tests

- [ ] Button press feedback: ~100ms
- [ ] Hover effects: ~150ms
- [ ] State transitions: ~200ms
- [ ] Modal open/close: ~300ms

### Reduced Motion Tests

- [ ] All animations respect `prefers-reduced-motion`
- [ ] Shake animation disabled with reduced motion
- [ ] Shimmer animation disabled with reduced motion
- [ ] Transitions near-instant with reduced motion

### Loading State Tests

- [ ] Button shows spinner for <1s loads
- [ ] Skeleton pulse for 1-3s loads
- [ ] Skeleton shimmer for 3s+ loads (when shimmer prop used)
- [ ] No full-page spinners

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

## Multi-Agent Suggestion Evaluation

When evaluating suggestions from Copilot or Codex CLI during `/vibe review`:

### Evaluation Criteria

| Criterion | Check Against | Reject If |
|-----------|--------------|-----------|
| Architecture alignment | `{{paths.architecture}}18-anti-patterns.md` | Violates documented patterns |
| Design tokens | `{{paths.architecture}}/_patterns/design-tokens.md` | Uses raw Tailwind colors |
| Domain language | `{{paths.domain}}GLOSSARY.md` | Uses incorrect terminology |
| Simplicity | Current implementation | More complex without benefit |
| Testability | Test pyramid strategy | Harder to test |
| UI states | 4-state rule | Missing loading/error/empty |

### Accept/Reject Framework

```
1. Does it follow architecture docs? → NO → REJECT
2. Is it simpler than current? → NO → Needs strong justification
3. Does it improve testability? → YES → Strong accept signal
4. Does it handle edge cases? → YES → Accept if architecture-compliant
```

### Conflict Resolution Priority

| Priority | Rule |
|----------|------|
| 1 | Architecture docs win over all suggestions |
| 2 | Claude's reasoning wins when architecture silent |
| 3 | Simpler solution wins when reasoning equal |
| 4 | User decides when complexity equal |

### Documentation

Document all decisions in `_multi_review.md`:
- Which suggestions accepted and why
- Which suggestions rejected and why
- Final implementation rationale

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

---

## Implementation Quality Score

> **Produce a numeric quality score at the end of QA Validation phase.**

### Scoring Rubric

| Category | Weight | Score (0-5) | Criteria |
|----------|--------|-------------|----------|
| **Test Coverage** | 20% | ___ | 5: >90% | 4: 80-90% | 3: 70-80% | 2: 60-70% | 1: <60% |
| **Pattern Compliance** | 15% | ___ | 5: All patterns followed | 3: Minor deviations | 1: Major anti-patterns |
| **UX States (4-state)** | 15% | ___ | 5: All 4 states (loading/empty/error/success) | 3: Missing 1 | 1: Missing 2+ |
| **Accessibility** | 15% | ___ | 5: WCAG AA compliant | 3: Minor issues | 1: Major violations |
| **Error Handling** | 15% | ___ | 5: All paths handled | 3: Happy path only | 1: Silent failures |
| **Code Clarity** | 10% | ___ | 5: Self-documenting | 3: Some complexity | 1: Hard to follow |
| **Performance** | 10% | ___ | 5: Optimized | 3: Adequate | 1: Known issues |

### Calculation

```
Total = (TestCov × 0.20) + (Patterns × 0.15) + (UXStates × 0.15) +
        (A11y × 0.15) + (Errors × 0.15) + (Clarity × 0.10) + (Perf × 0.10)
```

### Score Thresholds

| Score | Rating | Action |
|-------|--------|--------|
| **4.5 - 5.0** | Excellent | Ready for PR |
| **4.0 - 4.4** | Good | Ready with minor polish |
| **3.0 - 3.9** | Acceptable | Address warnings before PR |
| **< 3.0** | Needs Work | BLOCK: Fix issues before proceeding |

### Score Report Format

```
+---------------------------------------------------------------------+
|  IMPLEMENTATION QUALITY SCORE                                        |
|                                                                      |
|  Feature: [FEATURE-ID]                                               |
|                                                                      |
|  | Category           | Weight | Score | Weighted |                  |
|  |--------------------|--------|-------|----------|                  |
|  | Test Coverage      |   20%  |  4.5  |   0.90   |                  |
|  | Pattern Compliance |   15%  |  5.0  |   0.75   |                  |
|  | UX States          |   15%  |  4.0  |   0.60   |                  |
|  | Accessibility      |   15%  |  4.0  |   0.60   |                  |
|  | Error Handling     |   15%  |  4.5  |   0.68   |                  |
|  | Code Clarity       |   10%  |  4.0  |   0.40   |                  |
|  | Performance        |   10%  |  4.0  |   0.40   |                  |
|  |--------------------|--------|-------|----------|                  |
|  | TOTAL              |  100%  |       |   4.33   |                  |
|                                                                      |
|  Rating: GOOD - Ready with minor polish                              |
|                                                                      |
|  Recommendations:                                                    |
|  - Consider adding skeleton for initial load state                   |
|  - Add aria-label to icon-only search button                         |
|                                                                      |
+---------------------------------------------------------------------+
```

### When to Apply

- **Always** at end of QA Validation phase (Phase 4)
- **Optionally** during `/vibe review` for existing code
- **Required** before creating PR

### Blockers by Category

| Category | Blocker Threshold |
|----------|-------------------|
| Test Coverage | Score < 3 (below 70%) |
| UX States | Score < 3 (missing 2+ states) |
| Error Handling | Score < 3 (silent failures) |
| Accessibility | Score < 2 (WCAG violations)
