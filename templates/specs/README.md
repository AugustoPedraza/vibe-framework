# Specifications Directory

> Authoritative source of truth for your project's domains and APIs.

## Purpose

This directory contains **current, authoritative specifications**. Feature work proposes changes to these specs via `delta.md` files, which are merged back after completion.

```
specs/           ← Source of truth (what IS)
features/        ← Change proposals (what will CHANGE)
```

## Structure

```
.claude/specs/
├── domains/                    # Domain specifications
│   ├── auth.md                 # Authentication domain
│   ├── users.md                # User management domain
│   └── {domain}.md             # Other domains
│
├── api.md                      # REST API specification
├── events.md                   # Domain events specification
└── glossary.md                 # Term definitions
```

## When to Create Domain Specs

Create a domain spec when:
- Starting a new bounded context
- First feature in a domain area
- Consolidating scattered requirements

Don't create specs for:
- UI-only features (no domain logic)
- One-off utilities
- External integrations (use API spec instead)

## Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│  1. Initial Creation                                         │
│     /vibe explore "new domain" → creates specs/domains/X.md  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  2. Feature Work                                             │
│     Feature proposes changes via delta.md                    │
│     Delta shows ADDED/MODIFIED/REMOVED requirements          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  3. Merge on Completion                                      │
│     /vibe archive merges deltas back into domain spec        │
│     Change history updated                                   │
└─────────────────────────────────────────────────────────────┘
```

## Templates

| Template | Use For |
|----------|---------|
| `DOMAIN-TEMPLATE.md` | New domain specifications |
| `API-TEMPLATE.md` | API endpoint documentation |

## Best Practices

1. **Keep specs authoritative** - If code differs from spec, update the spec
2. **Use SHALL/MUST** - Clear, testable assertions
3. **Include scenarios** - Every requirement has at least one scenario
4. **Track changes** - Use Change History table
5. **Version specs** - Increment version on breaking changes

## Integration with Features

### Reading Specs

```markdown
<!-- In feature spec -->
## Related Specs

- `specs/domains/auth.md` - Current auth implementation
```

### Proposing Changes

```markdown
<!-- In feature delta.md -->
## MODIFIED Requirements

### Session Duration
**Was:** Sessions expire after 24 hours
**Now:** Sessions SHALL expire after 7 days for "remember me"
```

### Verifying Consistency

```
/vibe validate AUTH-001

Checking consistency with specs...
[x] Entities match specs/domains/auth.md
[x] API endpoints match specs/api.md
```

## Commands

| Command | Effect on Specs |
|---------|-----------------|
| `/vibe explore` | May create new domain spec |
| `/vibe validate` | Checks consistency with specs |
| `/vibe archive` | Merges feature deltas into specs |
