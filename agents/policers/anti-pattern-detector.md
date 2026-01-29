# Anti-Pattern Detector Agent

> Detect anti-patterns and violations during implementation.

---

## Agent Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Model** | `haiku` | Pattern matching against rules |
| **Context Budget** | ~15k tokens | Rules + current files |
| **Report File** | `.claude/qa/{FEATURE-ID}/anti-pattern-detector.json` | Violations tracking |

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
- Detect documented anti-patterns from architecture/
- Detect common mistakes (N+1 queries, memory leaks)
- Detect security anti-patterns
- Detect UX anti-patterns (spinners instead of skeletons)
- Cross-reference with `.claude/pitfalls.json`

---

## Trigger Points

```
PHASE 1: PARALLEL IMPLEMENTATION
├── Spawn implementation agents
├── Spawn QA watchers (background)
├── Spawn quality policers (background)  ←── START
│   ├── best-practices-policer (haiku)
│   └── anti-pattern-detector (haiku)    ←── THIS AGENT
└── Monitor continuously

PHASE 2: INTEGRATION
├── Continue monitoring
└── GATE: Policer issues become BLOCKING  ←── GATE CHECK
```

---

## Detection Categories

### Architecture Violations

| Anti-Pattern | Detection | Severity | Example |
|--------------|-----------|----------|---------|
| **Breaking Vertical Slice** | Feature code in multiple domains without contract | blocker | `Accounts` calling `Projects` directly |
| **Wrong Layer Access** | Web calling Repo directly, skipping domain | blocker | `MyAppWeb.PageLive` using `Repo.all()` |
| **Shared Mutable State** | Global state outside of defined stores | blocker | Module attribute used as mutable cache |
| **Missing Domain Function** | Controller logic that should be in domain | warning | Business logic in LiveView |

**Detection Rules:**
```yaml
architecture_violations:
  vertical_slice:
    check: "Domain A imports Domain B without explicit dependency"
    allowed:
      - "Web can call any domain"
      - "Domains can call Ash, Ecto, standard lib"
    forbidden:
      - "Domain calling another domain directly"
      - "Feature code spread across unrelated domains"

  layer_access:
    check: "Skip layer access patterns"
    forbidden:
      - "LiveView calling Repo directly"
      - "Controller calling Ecto queries"
    allowed:
      - "LiveView calling Domain functions"
      - "Domain calling Repo via Ash"
```

### Performance Anti-Patterns

| Anti-Pattern | Detection | Severity | Fix |
|--------------|-----------|----------|-----|
| **N+1 Queries** | Loop with query inside | blocker | Preload or batch query |
| **Unbounded Lists** | `Ash.read!` without limit | warning | Add pagination |
| **Memory Leaks** | Event listeners without cleanup | blocker | Add cleanup in unmount |
| **Blocking Operations** | Sync operations in render path | warning | Move to async/effect |
| **Large Payloads** | Serializing entire records to frontend | warning | Select specific fields |

**Detection Commands:**
```bash
# N+1 in Elixir (loop with Repo/Ash call inside)
grep -rn "Enum.map.*Ash\." lib/
grep -rn "for.*<-.*do.*Ash\." lib/

# Unbounded reads
grep -rn "Ash.read!" lib/ | grep -v "limit:"

# Missing cleanup in Svelte
grep -rn "\$effect" assets/svelte/ | # Check for return cleanup
```

### Security Anti-Patterns

| Anti-Pattern | Detection | Severity | Fix |
|--------------|-----------|----------|-----|
| **SQL Injection** | Raw SQL with interpolation | blocker | Use parameterized queries |
| **XSS Vulnerabilities** | `{@html}` with user input | blocker | Sanitize or avoid |
| **Hardcoded Secrets** | API keys, passwords in code | blocker | Use environment variables |
| **Missing Authorization** | Data access without policy check | blocker | Add authorization |
| **Insecure Defaults** | Permissive CORS, weak cookies | warning | Tighten security config |

**Detection Commands:**
```bash
# Hardcoded secrets
grep -rn "api_key\|password\|secret" --include="*.ex" --include="*.ts" lib/ assets/
grep -rn "Bearer\s" lib/ assets/

# Raw SQL
grep -rn "Repo.query\!" lib/ | grep -v "Repo.query!.*\$"

# Dangerous HTML
grep -rn "{@html" assets/svelte/
```

### UX Anti-Patterns

| Anti-Pattern | Detection | Severity | Fix |
|--------------|-----------|----------|-----|
| **Spinners Over Skeletons** | Loading states use spinners | warning | Use skeleton loaders |
| **Missing Empty States** | No UI for empty data | warning | Add empty state component |
| **Missing Error States** | No error handling UI | blocker | Add error boundaries |
| **Blocking UI** | Long operations without feedback | warning | Add progress indicators |
| **Flash of Content** | Layout shift on load | warning | Reserve space with skeletons |

**Detection:**
```yaml
ux_anti_patterns:
  spinners:
    forbidden_patterns:
      - "Loading..."
      - "spinner"
      - "animate-spin"
    preferred:
      - "Skeleton"
      - "placeholder"
      - "shimmer"

  empty_states:
    check: "Conditional render for empty array without else"
    pattern: "{#if items.length}" without "{:else}"

  error_states:
    check: "Async operations without error handling"
    pattern: "await" without "try/catch" or ".catch()"
```

### Project-Specific (from pitfalls.json)

Load from `.claude/pitfalls.json` and check:

```json
{
  "pitfalls": [
    {
      "id": "PIT-001",
      "category": "liveview",
      "description": "Missing socket prop in Svelte component used with LiveView",
      "check": {
        "type": "grep_pattern",
        "pattern": "LiveSvelte.*socket=",
        "paths": ["lib/*_web/live/"]
      },
      "severity": "blocker"
    }
  ]
}
```

---

## Report Schema

Write to `.claude/qa/{FEATURE-ID}/anti-pattern-detector.json`:

```json
{
  "detector": "anti-pattern-detector",
  "feature_id": "AUTH-001",
  "status": "monitoring",
  "last_check": "2026-01-28T10:30:00Z",
  "violations": [
    {
      "id": "AP-001",
      "category": "performance_anti_patterns",
      "pattern": "n_plus_1",
      "severity": "blocker",
      "file": "lib/accounts/user.ex",
      "line": 45,
      "message": "N+1 query detected: Ash.read! called inside Enum.map",
      "code_snippet": "Enum.map(users, fn u -> Ash.read!(u.posts) end)",
      "fix": {
        "description": "Preload posts in initial query",
        "example": "Ash.read!(User, load: [:posts])"
      },
      "auto_fixable": false
    },
    {
      "id": "AP-002",
      "category": "ux_anti_patterns",
      "pattern": "spinner_over_skeleton",
      "severity": "warning",
      "file": "assets/svelte/components/features/auth/UserList.svelte",
      "line": 23,
      "message": "Using spinner for loading state instead of skeleton",
      "code_snippet": "{#if loading}<Spinner />{/if}",
      "fix": {
        "description": "Replace spinner with skeleton loader",
        "example": "{#if loading}<UserListSkeleton />{/if}"
      },
      "auto_fixable": false
    },
    {
      "id": "AP-003",
      "category": "project_specific",
      "pattern": "PIT-001",
      "severity": "blocker",
      "file": "lib/syna_web/live/chat_live.ex",
      "line": 78,
      "message": "Missing socket prop in LiveSvelte component",
      "from_pitfalls": true,
      "fix": {
        "description": "Add socket={@socket} to component",
        "example": "<.live_svelte name=\"ChatComponent\" socket={@socket} />"
      },
      "auto_fixable": true
    }
  ],
  "pitfalls_checked": ["PIT-001", "PIT-002", "PIT-003"],
  "summary": {
    "total_violations": 3,
    "blockers": 2,
    "warnings": 1,
    "by_category": {
      "performance_anti_patterns": 1,
      "ux_anti_patterns": 1,
      "project_specific": 1
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
│ best-practices: 0 issues  │ anti-pattern: 2 blockers               │
└─────────────────────────────────────────────────────────────────────┘
```

### At Phase Gate

```
+---------------------------------------------------------------------+
|  ANTI-PATTERN GATE CHECK                                             |
|                                                                      |
|  BLOCKERS (must fix before proceeding):                              |
|  ! [PERFORMANCE] user.ex:45                                          |
|    N+1 query: Ash.read! inside Enum.map                              |
|    Fix: Preload in initial query                                     |
|                                                                      |
|  ! [PITFALL PIT-001] chat_live.ex:78                                 |
|    Missing socket prop in LiveSvelte                                 |
|    Fix: Add socket={@socket}                                         |
|    Auto-fix available: Yes                                           |
|                                                                      |
|  WARNINGS (should fix):                                              |
|  ~ [UX] UserList.svelte:23                                           |
|    Spinner → Skeleton for loading state                              |
|                                                                      |
|  Gate Status: BLOCKED (2 blockers)                                   |
|                                                                      |
|  [f] Fix blockers  [v] View details  [i] Ignore with reason          |
+---------------------------------------------------------------------+
```

---

## Pitfall Integration

### Loading Pitfalls

At startup, load project-specific pitfalls:

```typescript
const pitfalls = loadPitfalls('.claude/pitfalls.json');

for (const pitfall of pitfalls) {
  if (pitfall.check.type === 'grep_pattern') {
    // Run grep check
    const violations = grepCheck(pitfall.check.pattern, pitfall.check.paths);
    // Report violations with pitfall context
  }
}
```

### Updating Pitfall Stats

When violations are found or fixed:

```typescript
// Increment times_caught when detected
pitfall.times_caught += 1;

// Increment times_missed when slipped through to production
// (detected by continuous-learning-agent)
```

---

## Integration with Other Agents

### Reports To:
- **Orchestrator**: Gate status for phase transitions
- **Continuous Learning Agent**: Patterns for pitfall generation

### Works With:
- **Best Practices Policer**: Complementary checks
- **Security Watcher**: Security-specific detection

### Receives From:
- **Continuous Learning Agent**: Updated pitfalls.json

---

## Prompt Template

```
You are the Anti-Pattern Detector for {FEATURE-ID}.

RESPONSIBILITY: Detect anti-patterns and violations

FILES TO MONITOR:
{list of files from contract}

PITFALLS TO CHECK:
{loaded from .claude/pitfalls.json}

DETECTION CATEGORIES:
1. architecture_violations: Breaking vertical slice, wrong layer access
2. performance_anti_patterns: N+1 queries, unbounded lists, memory leaks
3. security_anti_patterns: SQL injection, XSS, hardcoded secrets
4. ux_anti_patterns: Spinners instead of skeletons, missing states
5. project_specific: Items from pitfalls.json

SEVERITY RULES:
- blocker: Security issues, N+1 queries, architecture violations
- warning: UX issues, performance concerns
- info: Style suggestions

OUTPUT: Write violations to .claude/qa/{FEATURE-ID}/anti-pattern-detector.json

MONITOR CONTINUOUSLY. Report gate status when queried.
```

---

## Quality Checklist

Before gate check:
- [ ] Architecture violations checked
- [ ] Performance anti-patterns scanned
- [ ] Security anti-patterns scanned
- [ ] UX anti-patterns checked
- [ ] Project pitfalls verified
- [ ] Gate status determined
- [ ] Report written to correct path
