# Code Quality Checklist

> Run before every commit and PR

---

## Pre-Commit (MUST PASS)

### Code Quality
- [ ] All tests pass
- [ ] No lint errors
- [ ] No type errors
- [ ] Code is formatted

### Security
- [ ] No hardcoded secrets or credentials
- [ ] No console.log / debug statements
- [ ] No TODO comments in committed code
- [ ] Input validation present

### Design Tokens
- [ ] No raw Tailwind colors
- [ ] No hardcoded z-index values
- [ ] Standard spacing scale only
- [ ] Uses existing components

---

## Test Coverage

### Thresholds
- [ ] Statement coverage >= 80%
- [ ] Branch coverage >= 60%
- [ ] Function coverage >= 80%
- [ ] New code has tests

### Test Quality
- [ ] Tests follow AAA pattern
- [ ] Descriptive test names
- [ ] No skipped tests (.skip)
- [ ] Mocks cleaned up

---

## Code Review Focus

### Readability
- [ ] Clear, intent-revealing names
- [ ] Functions do one thing
- [ ] Early returns (no deep nesting)
- [ ] Comments explain "why" not "what"

### Maintainability
- [ ] DRY (no copy-paste code)
- [ ] YAGNI (no speculative features)
- [ ] Follows existing patterns
- [ ] Easy to modify

### Error Handling
- [ ] All error cases handled
- [ ] User-friendly error messages
- [ ] Logging for debugging
- [ ] Graceful degradation

### Performance
- [ ] No N+1 queries
- [ ] Efficient algorithms
- [ ] Lazy loading where appropriate
- [ ] Optimistic updates for UX

---

## PR Checklist

### Before Opening
- [ ] Tests pass locally
- [ ] Lint/format pass
- [ ] Commit messages are meaningful
- [ ] Branch is up to date with main

### PR Description
- [ ] Summary of changes
- [ ] Link to issue/feature spec
- [ ] Testing instructions
- [ ] Screenshots for UI changes

### Review Complete
- [ ] All comments addressed
- [ ] CI passes
- [ ] Approved by reviewer
- [ ] No merge conflicts

---

## Programmatic Checklists (AI-Parseable)

> Machine-verifiable checklists with human-readable context

### Pre-Commit Verification

<!-- AI:CHECKLIST pre_commit -->
```yaml
pre_commit:
  description: "Automated verification before committing"
  items:
    - id: tests_pass
      description: All tests pass
      verification:
        type: command
        command: "{{commands.test}}"
        success_pattern: "0 failures"
      severity: blocker
      auto_fix: false

    - id: no_debug
      description: No debug statements in code
      verification:
        type: grep_pattern
        pattern: "console\\.log|IO\\.inspect|debugger|binding\\.pry"
        paths: ["lib/", "assets/svelte/"]
        should_match: false
      severity: blocker
      auto_fix: false

    - id: no_secrets
      description: No hardcoded secrets or credentials
      verification:
        type: grep_pattern
        pattern: "(password|secret|api_key|token)\\s*=\\s*[\"'][^\"']{8,}[\"']"
        paths: ["lib/", "assets/"]
        exclude: ["test/", "*_test.exs", "*.test.ts"]
        should_match: false
      severity: blocker
      auto_fix: false

    - id: formatted
      description: Code is properly formatted
      verification:
        type: command
        command: "mix format --check-formatted"
        success_pattern: ""
      severity: warning
      auto_fix:
        command: "mix format"

    - id: no_raw_colors
      description: No raw Tailwind colors (use design tokens)
      verification:
        type: grep_pattern
        pattern: "bg-(red|blue|green|yellow|purple|pink|gray)-[0-9]+"
        paths: ["assets/svelte/"]
        should_match: false
      severity: warning
      auto_fix: false

    - id: no_hardcoded_zindex
      description: No hardcoded z-index values
      verification:
        type: grep_pattern
        pattern: "z-\\[?[0-9]+"
        paths: ["assets/svelte/"]
        exclude: ["**/tailwind.config.*"]
        should_match: false
      severity: warning
      auto_fix: false

    - id: lint_clean
      description: No lint errors
      verification:
        type: command
        command: "mix credo --strict"
        success_pattern: "no issues"
      severity: warning
      auto_fix: false

    - id: types_valid
      description: Type checking passes
      verification:
        type: command
        command: "npm run check"
        success_pattern: ""
      severity: warning
      auto_fix: false
```
<!-- /AI:CHECKLIST -->

### Test Quality Verification

<!-- AI:CHECKLIST test_quality -->
```yaml
test_quality:
  description: "Verify test quality standards"
  items:
    - id: coverage_statements
      description: Statement coverage >= 80%
      verification:
        type: coverage_threshold
        metric: statements
        threshold: 80
      severity: warning

    - id: coverage_branches
      description: Branch coverage >= 60%
      verification:
        type: coverage_threshold
        metric: branches
        threshold: 60
      severity: warning

    - id: no_skipped_tests
      description: No skipped tests (.skip, @tag :skip)
      verification:
        type: grep_pattern
        pattern: "\\.skip|@tag :skip|xit\\(|xdescribe\\("
        paths: ["test/", "assets/**/__tests__/", "assets/tests/"]
        should_match: false
      severity: warning

    - id: aaa_pattern
      description: Tests follow Arrange-Act-Assert pattern
      verification:
        type: manual
        prompt: "Do all tests have clear setup, action, and assertion sections?"
      severity: suggestion

    - id: descriptive_names
      description: Test names describe expected behavior
      verification:
        type: manual
        prompt: "Do test names follow 'should X when Y' pattern?"
      severity: suggestion
```
<!-- /AI:CHECKLIST -->

### Security Review Verification

<!-- AI:CHECKLIST security_review -->
```yaml
security_review:
  description: "Security verification for auth/data features"
  items:
    - id: server_side_validation
      description: All user inputs validated server-side
      verification:
        type: manual
        prompt: "Are all user inputs validated in Ash resources or controllers?"
      severity: blocker
      applies_to: ["auth features", "form submissions", "API endpoints"]

    - id: no_exposed_secrets
      description: Sensitive data not exposed in responses
      verification:
        type: grep_pattern
        pattern: "password|hashed_password|secret|private_key"
        paths: ["lib/**/*_json.ex", "lib/**/*_view.ex"]
        context: "JSON/View serialization"
        should_match: false
      severity: blocker

    - id: auth_on_actions
      description: Authorization checks on all sensitive actions
      verification:
        type: ash_policy_check
        resources: ["User", "Project", "Message"]
        actions: ["update", "destroy"]
        requires_policy: true
      severity: blocker

    - id: csrf_protection
      description: CSRF tokens present on forms
      verification:
        type: grep_pattern
        pattern: "csrf_token|_csrf_token"
        paths: ["lib/**/*_live.ex"]
        should_match: true
      severity: blocker

    - id: no_sql_injection
      description: No raw SQL queries with user input
      verification:
        type: grep_pattern
        pattern: "Repo\\.query.*\\$\\{|execute.*\\$\\{"
        paths: ["lib/"]
        should_match: false
      severity: blocker
```
<!-- /AI:CHECKLIST -->

### Accessibility Verification

<!-- AI:CHECKLIST accessibility -->
```yaml
accessibility:
  description: "WCAG AA compliance verification"
  items:
    - id: touch_targets
      description: Touch targets >= 44px
      verification:
        type: manual
        prompt: "Are all interactive elements at least 44x44px on mobile?"
      severity: warning
      standard: "WCAG 2.5.5"

    - id: aria_labels
      description: Icon-only buttons have aria-labels
      verification:
        type: grep_pattern
        pattern: "<button[^>]*>\\s*<(Icon|svg)[^>]*>\\s*</button>"
        context: "Buttons with only icon children should have aria-label"
        paths: ["assets/svelte/"]
        should_match: false
        note: "Pattern detects icon-only buttons; verify aria-label exists"
      severity: warning

    - id: form_labels
      description: All form inputs have labels
      verification:
        type: manual
        prompt: "Do all form inputs have associated labels (for/id or aria-label)?"
      severity: warning
      standard: "WCAG 1.3.1"

    - id: color_contrast
      description: Text has 4.5:1 contrast ratio
      verification:
        type: manual
        prompt: "Does all text meet WCAG AA contrast requirements?"
      severity: warning
      standard: "WCAG 1.4.3"

    - id: reduced_motion
      description: Animations respect prefers-reduced-motion
      verification:
        type: grep_pattern
        pattern: "prefers-reduced-motion"
        paths: ["assets/svelte/", "assets/css/"]
        should_match: true
        note: "Should find reduced-motion media queries"
      severity: warning
      standard: "WCAG 2.3.3"

    - id: keyboard_navigation
      description: All interactive elements keyboard accessible
      verification:
        type: manual
        prompt: "Can all actions be performed via keyboard alone?"
      severity: warning
      standard: "WCAG 2.1.1"
```
<!-- /AI:CHECKLIST -->

### PR Quality Verification

<!-- AI:CHECKLIST pr_quality -->
```yaml
pr_quality:
  description: "Pull request quality standards"
  items:
    - id: pr_description
      description: PR has meaningful description
      verification:
        type: manual
        prompt: "Does PR description explain what and why?"
      severity: warning

    - id: linked_issue
      description: PR links to issue or feature spec
      verification:
        type: regex_match
        pattern: "(Closes|Fixes|Relates to) #[0-9]+|[A-Z]+-[0-9]+"
        target: "pr_description"
      severity: suggestion

    - id: atomic_commits
      description: Commits are atomic and well-messaged
      verification:
        type: manual
        prompt: "Does each commit represent one logical change with clear message?"
      severity: suggestion

    - id: no_merge_conflicts
      description: Branch has no merge conflicts with main
      verification:
        type: command
        command: "git merge-tree $(git merge-base HEAD main) HEAD main"
        success_pattern: ""
      severity: blocker

    - id: ci_passes
      description: All CI checks pass
      verification:
        type: external
        service: "github_actions"
        status: "success"
      severity: blocker

    - id: review_approved
      description: At least one approval from reviewer
      verification:
        type: external
        service: "github_pr"
        required_approvals: 1
      severity: blocker
```
<!-- /AI:CHECKLIST -->

### Developer Practice Compliance

<!-- AI:CHECKLIST dev_practice_compliance -->
```yaml
dev_practice_compliance:
  description: "Verify developer followed TDD and YAGNI practices during implementation"
  when: "After each developer scenario completion, before proceeding to next"
  items:
    - id: micro_iteration
      description: Built in single-focus increments
      verification:
        type: manual
        prompt: "Did you implement ONE concern at a time, with test verification between each?"
      severity: warning
      rationale: "Micro-iterations catch errors early and make debugging easier"

    - id: yagni
      description: Only built what the test required
      verification:
        type: manual
        prompt: "Did you add any code NOT required by the current failing test?"
      severity: warning
      rationale: "Speculative code increases maintenance burden and obscures intent"

    - id: pattern_compliance
      description: Used patterns from architecture docs
      verification:
        type: manual
        prompt: "No raw Tailwind colors, no hardcoded z-index, design tokens used?"
      severity: warning
      rationale: "Consistent patterns make the codebase predictable and maintainable"

    - id: test_driven
      description: Wrote code to make tests pass, not tests to validate code
      verification:
        type: manual
        prompt: "Was implementation driven by the failing test, not the other way around?"
      severity: warning
      rationale: "TDD ensures tests are meaningful, not just code coverage theater"

    - id: minimal_changes
      description: Made only necessary changes
      verification:
        type: manual
        prompt: "Were changes limited to what the scenario required? No 'while I'm here' refactoring?"
      severity: warning
      rationale: "Unrelated changes obscure the purpose of commits and complicate review"

    - id: regression_check
      description: Full test suite still passes
      verification:
        type: command
        command: "{{commands.test}}"
        success_pattern: "0 failures"
      severity: blocker
      rationale: "New code must not break existing functionality"
```
<!-- /AI:CHECKLIST -->

### QA Practice Compliance

<!-- AI:CHECKLIST qa_practice_compliance -->
```yaml
qa_practice_compliance:
  description: "Verify QA followed test-first practices during test generation"
  when: "Before exiting QA Test Generation phase"
  items:
    - id: aaa_pattern
      description: Tests follow Arrange-Act-Assert
      verification:
        type: manual
        prompt: "Do tests have clear setup (Arrange), action (Act), and assertion (Assert) sections?"
      severity: warning
      rationale: "AAA pattern makes tests readable and maintainable"

    - id: ux_states_covered
      description: All 4 UX states have tests
      verification:
        type: manual
        prompt: "Are there tests for loading, error, empty, and success states?"
      severity: warning
      rationale: "Users experience all states; all states need verification"

    - id: scenario_coverage
      description: All acceptance scenarios have tests
      verification:
        type: manual
        prompt: "Does each Given/When/Then scenario from the spec have a corresponding test?"
      severity: blocker
      rationale: "Acceptance criteria define done; untested criteria are unverified"

    - id: test_isolation
      description: Tests are isolated and independent
      verification:
        type: manual
        prompt: "Can each test run independently without depending on other tests?"
      severity: warning
      rationale: "Coupled tests create flaky CI and debugging nightmares"

    - id: descriptive_names
      description: Test names describe expected behavior
      verification:
        type: manual
        prompt: "Do test names follow 'should X when Y' or 'given X when Y then Z' pattern?"
      severity: suggestion
      rationale: "Good test names serve as documentation"

    - id: e2e_if_required
      description: E2E tests written if critical path
      verification:
        type: manual
        prompt: "If feature is auth/payment/realtime, are E2E tests in assets/tests/e2e/?"
      severity: blocker
      applies_to: ["auth features", "payment features", "realtime features"]
      rationale: "Critical paths need end-to-end verification; unit tests aren't sufficient"
```
<!-- /AI:CHECKLIST -->

---

## Checklist Runner Usage

### Programmatic Execution

```bash
# Run all pre-commit checks
/vibe check --pre-commit

# Run specific checklist
/vibe check --checklist security_review

# Run with auto-fix
/vibe check --pre-commit --fix

# Output as JSON for tooling
/vibe check --pre-commit --format json
```

### AI Integration

AI agents can parse these checklists to:
1. Automatically verify conditions before actions
2. Generate fix suggestions for failures
3. Track compliance over time
4. Integrate with CI/CD pipelines

### Extending Checklists

Add new checklists following this schema:

```yaml
<!-- AI:CHECKLIST checklist_name -->
checklist_name:
  description: "What this checklist verifies"
  items:
    - id: unique_id
      description: Human-readable description
      verification:
        type: command | grep_pattern | manual | regex_match | coverage_threshold
        # type-specific fields...
      severity: blocker | warning | suggestion
      auto_fix:  # optional
        command: "fix command"
<!-- /AI:CHECKLIST -->
```
