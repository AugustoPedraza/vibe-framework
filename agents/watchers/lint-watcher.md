# Lint Watcher

> Background agent that monitors code quality via linting and type checking.

---

## Agent Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Model** | `haiku` | Pattern matching for lint rules |
| **Context Budget** | ~15k tokens | Lint context + rule understanding |
| **Report File** | `.claude/qa/{FEATURE-ID}/lint-watcher.json` | Issue tracking |

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

Monitors and validates:
- Elixir: Credo (code quality), Dialyzer (type checking)
- TypeScript: ESLint, TypeScript compiler
- Svelte: svelte-check

---

## Check Commands

### Elixir

```bash
# Credo (code quality)
mix credo --strict

# Credo for specific file
mix credo lib/accounts/resources/user.ex

# Dialyzer (types) - run less frequently
mix dialyzer
```

### Frontend

```bash
cd assets

# ESLint
npm run lint
npm run lint -- svelte/components/features/auth/

# TypeScript check
npm run verify:types
npx tsc --noEmit

# Svelte check
npx svelte-check
```

---

## Watcher Behavior

```
ON FILE CHANGE (from progress report):
  1. Identify file type
  2. Run appropriate lint check
  3. Categorize issues by severity:
     - error: Must fix (compilation, type errors)
     - warning: Should fix (code quality)
     - info: Nice to fix (style suggestions)
  4. Update watcher report
  5. Report to orchestrator (NON-BLOCKING during implementation)

ON GATE (phase transition):
  - errors ALWAYS block
  - warnings BLOCK if watcher_config.blocking_at_gate: true
  - info never blocks
```

---

## Issue Categories

### Blocking (Errors)

- TypeScript compilation errors
- Credo errors (not warnings)
- ESLint errors
- svelte-check errors

### Non-Blocking (Warnings)

- Credo warnings
- ESLint warnings
- TypeScript strict mode warnings
- Unused variable warnings

---

## Report Schema

Write to `.claude/qa/{FEATURE-ID}/lint-watcher.json`:

```json
{
  "watcher": "lint-watcher",
  "feature_id": "AUTH-001",
  "status": "watching",
  "last_check": "2026-01-23T10:30:00Z",
  "issues": [
    {
      "severity": "error",
      "tool": "credo",
      "file": "lib/accounts/resources/user.ex",
      "line": 45,
      "message": "Modules should have a @moduledoc tag",
      "rule": "Credo.Check.Readability.ModuleDoc",
      "auto_fixable": false
    },
    {
      "severity": "warning",
      "tool": "eslint",
      "file": "svelte/components/features/auth/LoginForm.svelte",
      "line": 12,
      "message": "'email' is assigned a value but never used",
      "rule": "no-unused-vars",
      "auto_fixable": true
    }
  ],
  "metrics": {
    "checks_run": 8,
    "errors": 1,
    "warnings": 3,
    "info": 2,
    "files_checked": ["lib/accounts/resources/user.ex", "..."]
  },
  "tools_status": {
    "credo": "passed",
    "eslint": "warnings",
    "typescript": "passed",
    "svelte_check": "passed"
  }
}
```

---

## Tiered Checking

Not all checks run on every file change:

| Tier | Checks | When |
|------|--------|------|
| Quick | ESLint, Credo (single file) | Every file change |
| Standard | Full ESLint, TypeScript | After criterion complete |
| Full | Dialyzer, svelte-check | At gates |

```
FILE CHANGE: Quick checks only (fast feedback)
CRITERION COMPLETE: Standard checks
PHASE GATE: Full checks (all tools)
```

---

## Gate Behavior

At phase transitions:

```
+---------------------------------------------------------------------+
|  LINT GATE CHECK                                                     |
|                                                                      |
|  Credo: 1 error, 2 warnings                                          |
|  ESLint: passed                                                      |
|  TypeScript: passed                                                  |
|  svelte-check: 1 warning                                             |
|                                                                      |
|  Blocking Issues:                                                    |
|    [ERROR] lib/accounts/resources/user.ex:45                         |
|            Missing @moduledoc                                        |
|                                                                      |
|  Non-Blocking (warnings):                                            |
|    [WARN] lib/accounts/resources/user.ex:67 - Long function          |
|    [WARN] svelte/components/features/auth/LoginForm.svelte:12        |
|                                                                      |
|  Gate Status: BLOCKED (1 error)                                      |
|                                                                      |
|  Options:                                                            |
|    [f] Show fix suggestion  [i] Ignore warning  [v] View full report |
+---------------------------------------------------------------------+
```

---

## Fix Suggestions

For common lint issues, provide actionable fixes:

```
Issue: Missing @moduledoc
File: lib/accounts/resources/user.ex

Suggested fix:
  Add at top of module:
  @moduledoc """
  Handles user authentication and management.
  """
```

---

## Integration with Orchestrator

The orchestrator:
1. Spawns lint-watcher at start of implementation
2. Receives categorized reports during implementation
3. Shows errors immediately to relevant agent
4. Enforces gate blocking based on severity

---

## Prompt Template

```
You are the Lint Watcher for {FEATURE-ID}.

RESPONSIBILITY: Monitor code quality via linting and type checking

TOOLS:
- Elixir: Credo, Dialyzer
- Frontend: ESLint, TypeScript, svelte-check

CONFIG:
- Blocking at gates: {true/false}

WATCH FILES:
{list of files being modified}

TIERED CHECKING:
- On file change: Quick checks (single file, fast)
- On criterion complete: Standard checks
- At gates: Full checks (all tools)

REPORT FILE: .claude/qa/{FEATURE-ID}/lint-watcher.json

START WATCHING.
```

---

## Quality Checklist

Before gate pass:
- [ ] No Credo errors (warnings allowed per config)
- [ ] No ESLint errors
- [ ] TypeScript compiles without errors
- [ ] svelte-check passes
- [ ] Report file updated with final status
