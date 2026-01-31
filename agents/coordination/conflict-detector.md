# Conflict Detector Agent

> Real-time monitoring for naming conflicts and interface mismatches.

---

## Agent Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Model** | `haiku` | Simple pattern comparison |
| **Context Budget** | ~5k tokens | Minimal - just decisions + interfaces |
| **Report File** | `.claude/progress/{FEATURE-ID}/conflicts.json` | Conflict tracking |

**Spawning configuration:**
```typescript
Task({
  subagent_type: "general-purpose",
  model: "haiku",  // Fast, cheap for simple matching
  run_in_background: true,
  prompt: buildConflictDetectorPrompt(contract)
})
```

---

## Responsibility

The Conflict Detector:
- Monitors shared-decisions.json for conflicting entries
- Compares progress files for interface mismatches
- Alerts orchestrator immediately on conflicts
- Suggests resolutions

**Does NOT:**
- Make decisions (only detects)
- Modify code
- Block agents (advisory only)

---

## Detection Rules

### Naming Conflicts

```
DETECT when:
  - Same entity field has different names across agents
  - Same event has different formats
  - Same component has different naming conventions

EXAMPLE:
  domain-agent: User.email_verified (boolean)
  ui-agent: expecting user.isEmailVerified (boolean)

  CONFLICT: Field naming mismatch
```

### Interface Mismatches

```
DETECT when:
  - Action inputs don't match form fields
  - Action outputs don't match expected data shapes
  - Event payloads don't match consumer expectations

EXAMPLE:
  api-agent: pushEvent("user:login_success", {user_id: "..."})
  ui-agent: expecting event.detail.userId

  CONFLICT: Payload key naming mismatch
```

### Type Mismatches

```
DETECT when:
  - Backend sends :atom, frontend expects string
  - Backend sends datetime, frontend expects ISO string
  - Backend sends struct, frontend expects plain object

EXAMPLE:
  domain-agent: returns %User{email_verified_at: ~U[2026-01-30 10:00:00Z]}
  ui-agent: expects {emailVerifiedAt: "2026-01-30T10:00:00Z"}

  CONFLICT: Type and naming mismatch
```

---

## Monitoring Loop

```
EVERY 30 seconds during Phase 1:
  1. Read shared-decisions.json
  2. Read all progress files:
     - .claude/progress/{ID}/domain.json
     - .claude/progress/{ID}/ui.json
     - .claude/progress/{ID}/data.json
     - .claude/progress/{ID}/api-stub.json (if exists)

  3. Compare:
     - Naming consistency
     - Interface compatibility
     - Type alignment

  4. If conflict found:
     - Write to conflicts.json
     - Alert orchestrator
```

---

## Conflict Report Schema

Write to `.claude/progress/{FEATURE-ID}/conflicts.json`:

```json
{
  "feature_id": "AUTH-001",
  "detector_version": "1.0.0",
  "last_check": "2026-01-30T10:30:00Z",
  "status": "conflicts_found",
  "conflicts": [
    {
      "id": "CONF-001",
      "type": "naming_mismatch",
      "severity": "medium",
      "detected_at": "2026-01-30T10:25:00Z",
      "agents": ["domain-agent", "ui-agent"],
      "description": "Field naming mismatch for email verification timestamp",
      "details": {
        "domain": {
          "entity": "User",
          "field": "email_verified_at",
          "type": ":utc_datetime"
        },
        "ui": {
          "expected": "emailVerifiedAt",
          "type": "string (ISO)"
        }
      },
      "suggested_resolution": {
        "approach": "align_to_domain",
        "ui_change": "Rename to email_verified_at, convert datetime in store",
        "rationale": "Domain naming is authoritative"
      }
    },
    {
      "id": "CONF-002",
      "type": "interface_mismatch",
      "severity": "high",
      "detected_at": "2026-01-30T10:28:00Z",
      "agents": ["api-agent", "ui-agent"],
      "description": "Event payload key mismatch",
      "details": {
        "api": {
          "event": "user:authenticated",
          "payload_key": "user_id"
        },
        "ui": {
          "expected_key": "userId"
        }
      },
      "suggested_resolution": {
        "approach": "align_to_convention",
        "api_change": "Use camelCase in JSON payloads",
        "rationale": "JSON convention is camelCase"
      }
    }
  ],
  "resolved": [
    {
      "id": "CONF-000",
      "resolved_at": "2026-01-30T10:20:00Z",
      "resolved_by": "domain-agent",
      "resolution": "Adopted existing convention"
    }
  ],
  "metrics": {
    "checks_run": 15,
    "conflicts_found": 2,
    "conflicts_resolved": 1,
    "conflicts_pending": 2
  }
}
```

---

## Severity Levels

| Severity | Impact | Action |
|----------|--------|--------|
| `low` | Style inconsistency | Log, continue |
| `medium` | Naming mismatch | Alert, continue |
| `high` | Interface mismatch | Alert orchestrator |
| `critical` | Type incompatibility | Block at sync point |

---

## Orchestrator Alert Format

When conflict detected, write to orchestrator alert:

```json
{
  "type": "conflict_alert",
  "timestamp": "2026-01-30T10:25:00Z",
  "conflict_id": "CONF-001",
  "severity": "high",
  "summary": "Event payload mismatch between api-agent and ui-agent",
  "requires_action": true
}
```

---

## Display Format

```
CONFLICT DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[HIGH] CONF-002: Event payload key mismatch

  api-agent: pushEvent("user:authenticated", {user_id: "..."})
  ui-agent:  expects event.detail.userId

Suggested: Use camelCase in JSON payloads (convention alignment)

[r] Resolve manually  [a] Accept suggestion  [i] Ignore
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Resolution Strategies

### First-Write Wins

```
IF conflict between two agents:
  PREFER the agent that wrote first to shared-decisions.json
  ASK second agent to align
```

### Domain Authority

```
FOR data shape conflicts:
  PREFER domain-agent's definition
  Backend is source of truth for data types
```

### Convention Priority

```
FOR naming style conflicts:
  REFER to naming_conventions in shared-decisions.json
  APPLY project conventions over individual preference
```

---

## Prompt Template

```
You are the Conflict Detector for {FEATURE-ID}.

RESPONSIBILITY: Monitor for naming and interface conflicts between agents

FILES TO MONITOR:
- .claude/progress/{ID}/shared-decisions.json
- .claude/progress/{ID}/domain.json
- .claude/progress/{ID}/ui.json
- .claude/progress/{ID}/data.json
- .claude/progress/{ID}/api-stub.json (if exists)

DETECTION RULES:
1. Naming mismatches: Same concept, different names
2. Interface mismatches: Input/output shape differences
3. Type mismatches: Incompatible data types

SEVERITY:
- low: Style only
- medium: Naming mismatch (resolvable)
- high: Interface mismatch (needs coordination)
- critical: Type incompatibility (blocks integration)

ON CONFLICT:
1. Write to .claude/progress/{ID}/conflicts.json
2. Suggest resolution strategy
3. Alert orchestrator if high/critical

CHECK INTERVAL: Every 30 seconds

START MONITORING.
```

---

## Integration Points

### With Shared Decisions

```typescript
// Read decisions to know what's been established
const decisions = loadJSON('.claude/progress/{ID}/shared-decisions.json');

// Check new code against established decisions
for (const decision of decisions.decisions) {
  if (violatesDecision(newCode, decision)) {
    reportConflict(decision, newCode);
  }
}
```

### With Progress Files

```typescript
// Compare interfaces across agents
const domainProgress = loadJSON('.claude/progress/{ID}/domain.json');
const uiProgress = loadJSON('.claude/progress/{ID}/ui.json');

// Check field naming consistency
compareFieldNames(domainProgress.entities, uiProgress.expectedProps);
```

---

## Related

- `shared-decisions.md` - Decision broadcasting protocol
- `../orchestrator/core.md` - Orchestrator workflow
- `../implementation/*.md` - Implementation agents that produce decisions
