# Format Watcher

> Background agent that monitors and validates code formatting during development.

---

## Agent Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Model** | `haiku` | Simple pattern matching |
| **Context Budget** | ~10k tokens | Minimal context needed |
| **Report File** | `.claude/qa/{FEATURE-ID}/format-watcher.json` | Issue tracking |

**Spawning configuration:**
```typescript
Task({
  subagent_type: "general-purpose",
  model: "haiku",  // Formatting is simple
  run_in_background: true,
  prompt: "..." // See below
})
```

---

## Responsibility

Monitors and validates:
- Elixir formatting (`mix format`)
- JavaScript/TypeScript formatting (`prettier`)
- Svelte component formatting
- Consistent code style

---

## Trigger Points

Run validation when:
- Implementation agent reports file change
- At phase transitions (BLOCKING)
- On manual trigger

---

## Check Commands

### Elixir

```bash
# Check formatting (doesn't modify)
mix format --check-formatted

# Format specific file
mix format lib/path/to/file.ex
```

### JavaScript/TypeScript/Svelte

```bash
# Check formatting
cd assets && npx prettier --check "svelte/**/*.{svelte,ts,js}"

# Format specific file
cd assets && npx prettier --write svelte/components/features/auth/LoginForm.svelte
```

---

## Watcher Behavior

```
ON FILE CHANGE (from progress report):
  1. Identify file type (ex, exs, ts, svelte, js)
  2. Run appropriate format check
  3. If violation found:
     - Log to report file
     - Attempt auto-fix if enabled
     - Report to orchestrator (NON-BLOCKING during implementation)
  4. Update watcher report

ON GATE (phase transition):
  - All format issues become BLOCKING
  - Must be resolved before proceeding
```

---

## Report Schema

Write to `.claude/qa/{FEATURE-ID}/format-watcher.json`:

```json
{
  "watcher": "format-watcher",
  "feature_id": "AUTH-001",
  "status": "watching",
  "last_check": "2026-01-23T10:30:00Z",
  "issues": [
    {
      "severity": "warning",
      "file": "lib/accounts/resources/user.ex",
      "line": null,
      "message": "File needs formatting",
      "auto_fixable": true,
      "auto_fixed": false
    }
  ],
  "metrics": {
    "checks_run": 15,
    "issues_found": 1,
    "issues_fixed": 0,
    "files_checked": ["lib/accounts/resources/user.ex", "..."]
  },
  "config": {
    "auto_fix": true,
    "blocking_at_gate": true
  }
}
```

---

## Auto-Fix Behavior

When `auto_fix: true` in watcher config:

1. **Elixir files**: Run `mix format {file}`
2. **Frontend files**: Run `prettier --write {file}`
3. Update report: `auto_fixed: true`
4. Notify orchestrator of fix

```json
{
  "issues": [
    {
      "file": "lib/accounts/resources/user.ex",
      "message": "File needs formatting",
      "auto_fixable": true,
      "auto_fixed": true,
      "fixed_at": "2026-01-23T10:30:15Z"
    }
  ]
}
```

---

## Gate Behavior

At phase transitions:

```
+---------------------------------------------------------------------+
|  FORMAT GATE CHECK                                                   |
|                                                                      |
|  Files Checked: 12                                                   |
|  Format Issues: 1                                                    |
|                                                                      |
|  Issues:                                                             |
|    [BLOCK] lib/accounts/resources/user.ex - needs formatting         |
|                                                                      |
|  Options:                                                            |
|    [f] Auto-fix all  [s] Skip (not recommended)  [v] View details    |
+---------------------------------------------------------------------+
```

If blocking issues exist and auto-fix is disabled:
- HARD BLOCK phase transition
- Display affected files
- Require resolution

---

## Integration with Orchestrator

The orchestrator:
1. Spawns format-watcher at start of parallel implementation
2. Receives non-blocking reports during implementation
3. Checks watcher status at gates
4. Aggregates watcher reports for final validation

---

## Prompt Template

```
You are the Format Watcher for {FEATURE-ID}.

RESPONSIBILITY: Monitor code formatting compliance

CONFIG:
- Auto-fix enabled: {true/false}
- Blocking at gates: {true/false}

WATCH FILES:
{list of files being modified by implementation agents}

ON FILE CHANGE:
1. Check formatting: mix format --check-formatted (Elixir) or prettier --check (JS/TS/Svelte)
2. If violation: log to report, attempt auto-fix if enabled
3. Update report file: .claude/qa/{FEATURE-ID}/format-watcher.json

START WATCHING.
```

---

## Quality Checklist

Before gate pass:
- [ ] All Elixir files pass `mix format --check-formatted`
- [ ] All frontend files pass `prettier --check`
- [ ] Report file updated with final status
- [ ] No blocking issues remain
