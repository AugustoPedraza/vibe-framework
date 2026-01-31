# Shared Decisions Protocol

> Decision broadcasting for consistent naming and patterns across agents.

---

## Problem

When multiple agents work in parallel, they make independent decisions:
- domain-agent names a field `user_id`
- ui-agent expects `userId`
- api-agent writes handler expecting `owner_id`

Result: Integration conflicts discovered late in Phase 2.

---

## Solution: Decision Broadcasting

Agents broadcast decisions to a shared file. Other agents read and align.

---

## Shared Decisions File

Location: `.claude/progress/{FEATURE-ID}/shared-decisions.json`

### Schema

```json
{
  "feature_id": "AUTH-001",
  "version": 1,
  "decisions": [
    {
      "id": "DEC-001",
      "type": "naming",
      "scope": "field",
      "decided_by": "domain-agent",
      "decided_at": "2026-01-30T10:00:00Z",
      "decision": {
        "entity": "User",
        "field": "email_verified_at",
        "rationale": "Matches Ash convention for timestamps"
      },
      "impacts": ["ui-agent", "api-agent"]
    },
    {
      "id": "DEC-002",
      "type": "naming",
      "scope": "event",
      "decided_by": "api-agent",
      "decided_at": "2026-01-30T10:05:00Z",
      "decision": {
        "event": "user:authenticated",
        "payload": ["user_id", "session_token"],
        "rationale": "noun:verb format per conventions"
      },
      "impacts": ["ui-agent"]
    },
    {
      "id": "DEC-003",
      "type": "pattern",
      "scope": "error_handling",
      "decided_by": "domain-agent",
      "decided_at": "2026-01-30T10:10:00Z",
      "decision": {
        "error_format": "tagged_tuple",
        "example": "{:error, %{code: :invalid_credentials, message: \"...\"}}"
      },
      "impacts": ["api-agent", "ui-agent"]
    }
  ],
  "naming_conventions": {
    "fields": {
      "style": "snake_case",
      "timestamps": "*_at suffix",
      "booleans": "is_* or has_* prefix"
    },
    "events": {
      "style": "noun:verb",
      "examples": ["user:created", "session:expired"]
    },
    "components": {
      "style": "PascalCase",
      "suffix": "Form, Card, List, etc."
    },
    "files": {
      "svelte": "kebab-case.svelte",
      "elixir": "snake_case.ex"
    }
  }
}
```

---

## Decision Types

| Type | Scope | Example |
|------|-------|---------|
| `naming` | field, function, event, component | Field name, event format |
| `pattern` | error_handling, data_shape, api_format | Error return format |
| `structure` | file_location, module_organization | Where to put new code |
| `interface` | contract_update, data_shape_change | Changes to shared interfaces |

---

## Agent Behavior

### On Making a Decision

```
WHEN agent makes a naming/pattern decision:
  1. Check shared-decisions.json for existing decisions
  2. If conflict: align with existing decision
  3. If new decision: broadcast to file

  broadcast_decision({
    type: "naming",
    scope: "field",
    decision: {...},
    impacts: ["list", "of", "affected", "agents"]
  })
```

### On Starting Work

```
WHEN agent starts criterion:
  1. Read shared-decisions.json
  2. Cache relevant decisions for this scope
  3. Apply cached conventions to new code
```

### On Conflict Detection

```
IF agent's planned decision conflicts with existing:
  1. PREFER existing decision (first-write wins)
  2. Log alignment in decision file
  3. If critical conflict: escalate to orchestrator
```

---

## Naming Convention Reference

Pre-loaded into shared-decisions.json at start:

### Fields (Elixir/Ash)

| Pattern | Convention | Example |
|---------|------------|---------|
| Timestamp | `*_at` suffix | `created_at`, `verified_at` |
| Boolean | `is_*` or `has_*` | `is_verified`, `has_password` |
| Foreign key | `*_id` suffix | `user_id`, `project_id` |
| Count | `*_count` suffix | `message_count` |

### Events (LiveView → Svelte)

| Pattern | Convention | Example |
|---------|------------|---------|
| Format | `noun:verb` | `user:created`, `session:expired` |
| Namespace | lowercase noun | `user:`, `project:`, `message:` |
| Action | past tense verb | `:created`, `:updated`, `:deleted` |

### Components (Svelte)

| Type | Convention | Example |
|------|------------|---------|
| UI Component | `PascalCase` | `Button`, `Input`, `Card` |
| Feature Component | `FeatureAction` | `LoginForm`, `UserCard` |
| File name | `kebab-case.svelte` | `login-form.svelte` |

### Files

| Language | Convention | Example |
|----------|------------|---------|
| Elixir | `snake_case.ex` | `user_live.ex` |
| Svelte | `kebab-case.svelte` | `user-card.svelte` |
| TypeScript | `kebab-case.ts` | `auth-store.ts` |
| Test | `*_test.exs` / `*.test.ts` | `user_test.exs` |

---

## Integration with Contract

The interface contract can pre-populate naming conventions:

```json
{
  "pinned_context": {
    "naming": {
      "components": "PascalCase",
      "files": "kebab-case",
      "events": "noun:verb",
      "variables": "camelCase"
    }
  },
  "shared_decisions": {
    "initial": [],
    "naming_conventions": { /* copied from above */ }
  }
}
```

---

## Orchestrator Integration

The orchestrator:
1. Creates shared-decisions.json in Phase 0
2. Seeds with project naming conventions
3. Monitors for conflicts during Phase 1
4. Uses conflict-detector agent for real-time monitoring

---

## Related

- `conflict-detector.md` - Real-time conflict detection agent
- `../orchestrator/core.md` - Orchestrator workflow
- `../../templates/contracts/interface-contract.schema.json` - Contract schema
