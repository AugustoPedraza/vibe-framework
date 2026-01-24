# QA Validation Phase

> Final quality gates and PR preparation.

---

## Phase Entry

```
+======================================================================+
|  ✅ QA VALIDATION PHASE                                               |
|  Feature: {ID} - {Title}                                              |
|  Context: roles/developer/checklist.md                                |
+======================================================================+
```

## Objective

Verify implementation meets all quality standards and prepare for PR.

---

## Quality Gates

### 1. Test Suite

Run full test suite:

```bash
{{commands.test}}
```

**Required**:
- All unit tests pass
- All integration tests pass
- All E2E tests pass (if applicable)
- Coverage meets threshold (80%+)

### 2. Quality Checks

Run quality checks:

```bash
{{commands.check}}
```

**Required**:
- No lint errors
- No type errors
- No formatting issues
- No warnings treated as errors

### 3. Code Quality Verification

- [ ] No console.log / IO.inspect left
- [ ] No hardcoded secrets
- [ ] No TODO comments without ticket
- [ ] Design tokens used (no raw values)
- [ ] Accessibility attributes present

---

## UX Verification

For each component/screen:

### Loading State
- [ ] Skeleton/spinner displays correctly
- [ ] Actions disabled during load

### Error State
- [ ] Error message displays
- [ ] Retry works

### Empty State
- [ ] Empty message displays
- [ ] CTA functional

### Success State
- [ ] Data renders correctly
- [ ] Interactions work

---

## Verification Record

Create verification record at:
`.claude/verification/{FEATURE-ID}/qa-validation.json`

```json
{
  "feature_id": "{ID}",
  "validated_at": "ISO-8601",
  "test_results": {
    "unit": {"total": 10, "passing": 10},
    "integration": {"total": 5, "passing": 5},
    "e2e": {"total": 2, "passing": 2}
  },
  "quality_checks": {
    "lint": "pass",
    "types": "pass",
    "format": "pass"
  },
  "ux_states": {
    "loading": "verified",
    "error": "verified",
    "empty": "verified",
    "success": "verified"
  },
  "quality_score": 4.5
}
```

---

## Quality Score Calculation

| Criterion | Weight | Score |
|-----------|--------|-------|
| All tests pass | 25% | 0-5 |
| Code quality checks | 20% | 0-5 |
| UX states complete | 20% | 0-5 |
| Accessibility | 15% | 0-5 |
| Documentation | 10% | 0-5 |
| Pattern compliance | 10% | 0-5 |

**Minimum passing score**: 4.0

---

## PR Preparation

If all gates pass:

### 1. Generate Commit Message

```
feat({area}): {feature title}

- Implements {ID} acceptance scenarios
- Adds {components created}
- Uses patterns: {patterns_used}

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 2. Create PR (if requested)

```bash
gh pr create --title "feat({area}): {title}" --body "..."
```

---

## Phase Exit

### Success Output

```json
{
  "feature_id": "{ID}",
  "status": "complete",
  "quality_score": 4.5,
  "test_results": {...},
  "verification_record": ".claude/verification/{ID}/qa-validation.json",
  "pr_ready": true
}
```

### Failure Output

```json
{
  "feature_id": "{ID}",
  "status": "blocked",
  "blockers": [
    {"type": "test_failure", "details": "..."},
    {"type": "quality_check", "details": "..."}
  ],
  "action": "Return to Developer phase"
}
```

---

## Post-Completion

### Recommend Next Steps

1. Run `/vibe retro` for pattern extraction
2. Update `.claude/learnings.md` if discoveries made
3. Clear context with `/clear` before next feature
