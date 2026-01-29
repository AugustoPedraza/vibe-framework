# Best Practices Policer Agent

> Enforce coding standards and best practices during implementation.

---

## Agent Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Model** | `haiku` | Pattern matching against rules |
| **Context Budget** | ~15k tokens | Rules + current files |
| **Report File** | `.claude/qa/{FEATURE-ID}/best-practices-policer.json` | Violations tracking |

**Spawning configuration:**
```typescript
Task({
  subagent_type: "general-purpose",
  model: "haiku",
  run_in_background: true,
  prompt: "..." // See below
})
```

---

## Responsibility

Run continuously during implementation and at phase gates:
- Enforce Ash Framework patterns (resources, actions)
- Enforce Svelte 5 patterns (runes, reactivity, effect cleanup)
- Enforce Phoenix/LiveView conventions
- Verify design token usage (no raw colors)
- Check accessibility compliance
- Validate component structure

---

## Trigger Points

```
PHASE 1: PARALLEL IMPLEMENTATION
├── Spawn implementation agents
├── Spawn QA watchers (background)
├── Spawn quality policers (background)  ←── START
│   ├── best-practices-policer (haiku)   ←── THIS AGENT
│   └── anti-pattern-detector (haiku)
└── Monitor continuously

PHASE 2: INTEGRATION
├── Continue monitoring
└── GATE: Policer issues become BLOCKING  ←── GATE CHECK
```

---

## Rule Categories

### Ash Framework Patterns

| Rule | Check | Severity | Auto-fixable |
|------|-------|----------|--------------|
| **Resource Structure** | Resources use `Ash.Resource` macro | blocker | No |
| **Action Definitions** | Actions have proper arguments and returns | warning | No |
| **Change Validations** | Changes use `Ash.Changeset` validations | warning | No |
| **Policy Usage** | Public actions have `authorize? true` | blocker | Yes |
| **Error Handling** | Actions return `{:ok, _}` or `{:error, _}` | blocker | No |

**Ash Patterns Checklist:**
```yaml
ash_patterns:
  resources:
    - "Must define domain with `use Ash.Resource, domain: ...`"
    - "Must have at least one primary action"
    - "Must define attributes with types"
  actions:
    - "Create actions must accept required attributes"
    - "Update actions must specify changes"
    - "Read actions must define filters explicitly"
  policies:
    - "Public actions need `authorize? true`"
    - "Sensitive data needs field policies"
```

### Svelte 5 Patterns

| Rule | Check | Severity | Auto-fixable |
|------|-------|----------|--------------|
| **Runes Usage** | Use `$state`, `$derived`, `$effect` not legacy syntax | blocker | Yes |
| **Effect Cleanup** | `$effect` with subscriptions returns cleanup | blocker | No |
| **Derived Stores** | Computed values use `$derived` not functions | warning | Yes |
| **Props Definition** | Components use `$props()` not `export let` | blocker | Yes |
| **Snippet Usage** | Dynamic content uses `{@render}` with snippets | warning | No |

**Svelte 5 Detection:**
```bash
# Find legacy syntax
grep -r "export let " assets/svelte/**/*.svelte
grep -r "\$:" assets/svelte/**/*.svelte
grep -r "writable\|readable" assets/svelte/**/*.ts

# Verify runes usage
grep -r "\$state\|\$derived\|\$effect" assets/svelte/**/*.svelte
```

### Phoenix/LiveView Conventions

| Rule | Check | Severity | Auto-fixable |
|------|-------|----------|--------------|
| **Mount Pattern** | `mount/3` assigns only required initial state | warning | No |
| **Handle Event** | `handle_event/3` validates params | blocker | No |
| **Assigns Access** | Use `socket.assigns.key` not pattern match in function head | info | No |
| **PubSub** | Subscribe in mount, handle in `handle_info/2` | warning | No |

### Design System Compliance

| Rule | Check | Severity | Auto-fixable |
|------|-------|----------|--------------|
| **Design Tokens** | No raw colors (`#fff`, `rgb()`) - use `--color-*` | warning | Yes |
| **Spacing Grid** | Use `--spacing-*` variables, not arbitrary values | warning | Yes |
| **Typography** | Use `--font-*` tokens, not raw font declarations | warning | Yes |
| **Motion** | Use `--duration-*` presets, not arbitrary timings | info | Yes |
| **Z-Index** | Use `--z-*` tokens, not raw numbers | warning | Yes |

**Token Detection:**
```bash
# Find raw colors
grep -rE "(color|background|border):\s*#" assets/svelte/
grep -rE "rgb\(|rgba\(|hsl\(" assets/svelte/

# Find raw spacing
grep -rE "(margin|padding|gap):\s*[0-9]+px" assets/svelte/

# Find raw z-index
grep -rE "z-index:\s*[0-9]+" assets/svelte/
```

### Accessibility Compliance

| Rule | Check | Severity | Auto-fixable |
|------|-------|----------|--------------|
| **ARIA Labels** | Interactive elements have accessible names | blocker | Yes |
| **Keyboard Navigation** | All interactions keyboard accessible | blocker | No |
| **Focus Management** | Focus visible on all interactive elements | warning | Yes |
| **Alt Text** | Images have alt attributes | blocker | Yes |
| **Form Labels** | Form inputs have associated labels | blocker | Yes |

---

## Report Schema

Write to `.claude/qa/{FEATURE-ID}/best-practices-policer.json`:

```json
{
  "policer": "best-practices-policer",
  "feature_id": "AUTH-001",
  "status": "monitoring",
  "last_check": "2026-01-28T10:30:00Z",
  "violations": [
    {
      "id": "BP-001",
      "category": "svelte_patterns",
      "rule": "runes_usage",
      "severity": "blocker",
      "file": "assets/svelte/components/features/auth/LoginForm.svelte",
      "line": 5,
      "message": "Using legacy 'export let' syntax instead of $props()",
      "current": "export let onSubmit;",
      "expected": "let { onSubmit } = $props();",
      "auto_fixable": true
    },
    {
      "id": "BP-002",
      "category": "design_system",
      "rule": "design_tokens",
      "severity": "warning",
      "file": "assets/svelte/components/features/auth/LoginForm.svelte",
      "line": 45,
      "message": "Raw color value, use design token",
      "current": "color: #3b82f6;",
      "expected": "color: var(--color-primary);",
      "auto_fixable": true
    },
    {
      "id": "BP-003",
      "category": "ash_patterns",
      "rule": "policy_usage",
      "severity": "blocker",
      "file": "lib/accounts/resources/user.ex",
      "line": 78,
      "message": "Public action missing authorize?",
      "current": "create :register do",
      "expected": "create :register, authorize?: true do",
      "auto_fixable": true
    }
  ],
  "summary": {
    "total_violations": 3,
    "blockers": 2,
    "warnings": 1,
    "auto_fixable": 3,
    "by_category": {
      "svelte_patterns": 1,
      "design_system": 1,
      "ash_patterns": 1
    }
  },
  "gate_status": "BLOCKED"
}
```

---

## Display Format

### During Implementation (Background)

```
QA POLICERS (background)
┌─────────────────────────────────────────────────────────────────────┐
│ best-practices: 2 blockers  │ anti-pattern: 0 issues               │
└─────────────────────────────────────────────────────────────────────┘
```

### At Phase Gate

```
+---------------------------------------------------------------------+
|  BEST PRACTICES GATE CHECK                                           |
|                                                                      |
|  BLOCKERS (must fix before proceeding):                              |
|  ! [SVELTE] LoginForm.svelte:5                                       |
|    Legacy 'export let' syntax → use $props()                         |
|    Auto-fix available: Yes                                           |
|                                                                      |
|  ! [ASH] user.ex:78                                                  |
|    Public action missing authorize?                                  |
|    Auto-fix available: Yes                                           |
|                                                                      |
|  WARNINGS (should fix):                                              |
|  ~ [DESIGN] LoginForm.svelte:45                                      |
|    Raw color #3b82f6 → var(--color-primary)                          |
|                                                                      |
|  Gate Status: BLOCKED (2 blockers)                                   |
|                                                                      |
|  [a] Auto-fix all  [f] Fix specific  [i] Ignore with reason          |
+---------------------------------------------------------------------+
```

---

## Auto-Fix Implementation

When user selects auto-fix:

1. Load violation with fix details
2. Apply transformation to file
3. Re-check file for additional violations
4. Update report

**Example Transformations:**

```typescript
// Svelte legacy → runes
"export let {prop};" → "let { {prop} } = $props();"

// Raw color → token
"color: #3b82f6;" → "color: var(--color-primary);"

// Missing authorize
"create :action do" → "create :action, authorize?: true do"
```

---

## Integration with Other Agents

### Reports To:
- **Orchestrator**: Gate status for phase transitions
- **Polish Watcher**: Non-blocking issues forwarded

### Works With:
- **Anti-Pattern Detector**: Complementary checks
- **Format Watcher**: Formatting vs. patterns distinction

---

## Prompt Template

```
You are the Best Practices Policer for {FEATURE-ID}.

RESPONSIBILITY: Enforce coding standards during implementation

FILES TO MONITOR:
{list of files from contract}

RULE CATEGORIES:
1. ash_patterns: Resource structure, action patterns, policies
2. svelte_patterns: Runes usage, derived stores, props
3. phoenix_patterns: LiveView lifecycle, handle_event, PubSub
4. design_system: Token compliance, spacing grid, typography
5. accessibility: ARIA labels, keyboard navigation, focus

SEVERITY RULES:
- blocker: Must fix before phase gate
- warning: Should fix, non-blocking
- info: Suggestion for improvement

AUTO-FIX RULES:
- Only mark as auto_fixable if transformation is deterministic
- Provide exact current and expected values

OUTPUT: Write violations to .claude/qa/{FEATURE-ID}/best-practices-policer.json

MONITOR CONTINUOUSLY. Report gate status when queried.
```

---

## Quality Checklist

Before gate check:
- [ ] All rule categories checked
- [ ] Violations categorized by severity
- [ ] Auto-fixable issues identified
- [ ] Gate status determined
- [ ] Report written to correct path
