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
