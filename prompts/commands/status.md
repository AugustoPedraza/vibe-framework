# Status Command

> `/vibe status` - Show current implementation progress

## Display Format

```
+======================================================================+
|  VIBE STATUS                                                         |
|  Project: {{project.name}}                                           |
+======================================================================+

Current Sprint: [sprint-name]

Features:
  [x] AUTH-001: Login (completed)
  [>] AUTH-002: Register (in progress - Developer phase)
  [ ] AUTH-003: Password Reset (pending)

Current Feature: AUTH-002
  Phase: Developer (Scenario 2 of 3)
  Tests: 2 passing, 1 failing

Recent Activity:
  * Completed LoginForm component
  * Added User resource with email/password
  * Pending: Session persistence

Patterns Discovered This Session:
  * patterns/backend/ash-authentication.md (promoted)
  * patterns/frontend/form-validation.md (pending review)
```

## Data Sources

Read from:
- `.claude/IMPLEMENTATION_PLAN.md` - Current progress
- `.claude/learnings.md` - Session history
- `vibe.config.json` - Project config
- Feature specs for status

## Status Symbols

| Symbol | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[>]` | In progress |
| `[ ]` | Pending |
| `[!]` | Blocked |
