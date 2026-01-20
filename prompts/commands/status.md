# Status Command

> `/vibe status` - Show current implementation progress

## Display Format

```
+======================================================================+
|  VIBE STATUS                                                         |
|  Project: {{project.name}}                                           |
|  Context: [MODERATE] ~40%                                            |
+======================================================================+

Current Sprint: [sprint-name]

Features:
  [x] AUTH-001: Login (completed)
  [>] AUTH-002: Register (in progress - Developer phase)
  [ ] AUTH-003: Password Reset (pending)

Current Feature: AUTH-002
  Phase: Developer (Scenario 2 of 3)
  Tests: 2 passing, 1 failing

Context Load:
  Files loaded: 15
  Roles active: developer, qa-engineer
  Patterns referenced: 2
  ⚠️  Recommendation: Clear after completing this feature

Recent Activity:
  * Completed LoginForm component
  * Added User resource with email/password
  * Pending: Session persistence

Patterns Discovered This Session:
  * patterns/backend/ash-authentication.md (promoted)
  * patterns/frontend/form-validation.md (pending review)

Technical Debt:
  In Progress: 0 items
  Sprint: 2 items (1M, 1S)
  Backlog: 3 items

  [!] TD-003 (sprint): Add error handling to API layer
```

## Data Sources

Read from:
- `.claude/IMPLEMENTATION_PLAN.md` - Current progress
- `.claude/learnings.md` - Session history
- `.claude/backlog.md` - Technical debt items
- `vibe.config.json` - Project config
- Feature specs for status

## Status Symbols

| Symbol | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[>]` | In progress |
| `[ ]` | Pending |
| `[!]` | Blocked |

## Context Load Indicators

| Indicator | Load % | Action |
|-----------|--------|--------|
| `[LIGHT]` | 0-25% | Continue normally |
| `[MODERATE]` | 26-50% | Normal operation |
| `[HEAVY]` | 51-75% | Plan /clear after feature |
| `[CRITICAL]` | 76-100% | /clear after current task |

### Context Load Calculation

Estimate based on session activity:
- Each role loaded: +5%
- Each feature spec: +3%
- Each architecture doc: +2-5%
- Each pattern: +2%
- Each code file: +1-3%
- Re-reads: ×0.5 (cached)

### Clear Recommendations

Show recommendation when:
- Load is HEAVY or CRITICAL
- Feature just completed
- Multiple iterations on same issue
- Before starting different feature type
