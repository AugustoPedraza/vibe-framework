# Code Review Command

> `/vibe review [scope]` - Multi-agent code review with fresh context

## Purpose

Spawn a separate review agent with fresh context to review code. Separate context often yields better review results than self-review.

## Usage

```
/vibe review                    # Review staged changes
/vibe review [FEATURE-ID]       # Review feature implementation
/vibe review --security         # Security-focused review
/vibe review --patterns         # Pattern compliance review
```

---

## Workflow

```
Scope -> Fresh Context -> Review -> Report -> Action Items
```

### Step 1: Determine Scope

```
+======================================================================+
|  REV CODE REVIEW                                                     |
|  Scope: [staged | feature | file]                                    |
+======================================================================+
```

| Scope | What's Reviewed |
|-------|-----------------|
| `staged` | `git diff --staged` |
| `[FEATURE-ID]` | All changes for feature |
| `[file-path]` | Single file |

### Step 2: Fresh Context Load

The review agent loads ONLY:
- Architecture quick reference
- Anti-patterns document
- Relevant checklists
- The code being reviewed

**Does NOT load**: Current conversation context, implementation history

### Step 3: Review Categories

```
+---------------------------------------------------------------------+
|  REVIEW IN PROGRESS                                                  |
|                                                                      |
|  Checking:                                                           |
|  [x] Code quality & idioms                                           |
|  [x] Security vulnerabilities                                        |
|  [x] Pattern compliance                                              |
|  [x] Error handling                                                  |
|  [x] Test coverage                                                   |
|  [x] UX/Accessibility                                                |
|  [ ] Performance (if --perf flag)                                    |
+---------------------------------------------------------------------+
```

---

## Review Checklist

### Code Quality
- [ ] Follows Elixir/Svelte idioms
- [ ] No magic numbers or hardcoded values
- [ ] Functions are single-purpose
- [ ] Naming reveals intent
- [ ] No commented-out code

### Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] SQL injection protected (Ash handles)
- [ ] XSS prevented (Svelte handles)
- [ ] Authorization checks in place

### Pattern Compliance
- [ ] Uses design tokens (not raw colors)
- [ ] Uses motion presets (not arbitrary durations)
- [ ] Uses z-index tokens (not hardcoded)
- [ ] Follows vertical slice principle
- [ ] YAGNI respected

### Error Handling
- [ ] All Ash errors handled
- [ ] User-friendly error messages
- [ ] Errors logged appropriately
- [ ] No silent failures

### Test Coverage
- [ ] Happy path tested
- [ ] Edge cases covered
- [ ] Error states tested
- [ ] UX states tested (loading, empty)

### UX/Accessibility
- [ ] Touch targets 44px+
- [ ] aria-labels on icon buttons
- [ ] Focus management correct
- [ ] Loading states use skeletons

---

## Review Report Format

```
+---------------------------------------------------------------------+
|  REVIEW COMPLETE                                                     |
|                                                                      |
|  Scope: [what was reviewed]                                          |
|  Files: [count]                                                      |
|                                                                      |
|  BLOCKERS (must fix):                                                |
|  ! [file:line] Security: Hardcoded API key                           |
|  ! [file:line] Error handling: Unhandled {:error, _} case            |
|                                                                      |
|  WARNINGS (should fix):                                              |
|  ~ [file:line] Pattern: Raw color used, should be design token       |
|  ~ [file:line] Naming: Function name doesn't reveal intent           |
|                                                                      |
|  SUGGESTIONS (consider):                                             |
|  ? [file:line] Could extract to helper function                      |
|  ? [file:line] Consider adding edge case test                        |
|                                                                      |
|  GOOD PATTERNS FOUND:                                                |
|  + [file:line] Clean error handling pattern                          |
|  + [file:line] Good use of motion tokens                             |
|                                                                      |
|  [f] Fix blockers  [a] Accept with warnings  [d] Details             |
+---------------------------------------------------------------------+
```

---

## Review Flags

| Flag | Focus Area |
|------|------------|
| `--security` | Security vulnerabilities only |
| `--patterns` | Design pattern compliance only |
| `--perf` | Performance concerns |
| `--a11y` | Accessibility compliance |
| `--all` | Full comprehensive review (default) |

---

## Multi-Agent Pattern (AI Optimization)

**Default behavior: Spawn 3 parallel review agents for comprehensive coverage.**

```
┌─ Agent 1: Security Review
│   - OWASP top 10 checks
│   - Input validation
│   - Auth/authz verification
│   - Secrets exposure
│
├─ Agent 2: Performance Review
│   - N+1 query detection
│   - Unbounded lists
│   - Memory leaks
│   - Caching opportunities
│
└─ Agent 3: Pattern Compliance Review
│   - Architecture patterns
│   - Design tokens
│   - UX consistency
│   - Code idioms
```

**Wait for all agents → Merge findings → Present unified report**

### When to Use Single Agent

Use single-agent review when:
- Reviewing very small changes (<10 lines)
- User explicitly requests single review
- Only one concern area (e.g., `--security` flag only)

### Parallel Review Output

```
+---------------------------------------------------------------------+
|  PARALLEL REVIEW COMPLETE                                            |
|                                                                      |
|  Agents: 3 completed                                                 |
|  Files reviewed: [count]                                             |
|                                                                      |
|  SECURITY AGENT:                                                     |
|  ! [file:line] Unvalidated user input                                |
|                                                                      |
|  PERFORMANCE AGENT:                                                  |
|  ~ [file:line] Potential N+1 query                                   |
|                                                                      |
|  PATTERN AGENT:                                                      |
|  ~ [file:line] Raw color instead of design token                     |
|                                                                      |
|  MERGED BLOCKERS: 1                                                  |
|  MERGED WARNINGS: 2                                                  |
|  MERGED SUGGESTIONS: 0                                               |
|                                                                      |
|  [f] Fix blockers  [a] Accept with warnings  [d] Details             |
+---------------------------------------------------------------------+
```

---

## Integration with /vibe Workflow

### During Implementation

After Developer phase, offer review:

```
DEVELOPER PHASE COMPLETE

Ready for QA validation.

[r] Quick review first  [q] Skip to QA  [Enter] Continue
```

### Before PR Creation

```
PR READY

Run code review before creating PR?

[y] Yes, review  [n] Create PR directly
```

---

## Anti-Patterns for Review

- Don't review your own code in same context (bias)
- Don't skip security review for "small" changes
- Don't ignore warnings repeatedly (fix or document why)
- Don't review without loading anti-patterns doc
