# Fix Command

> `/vibe fix [FEATURE-ID] "description"` - Targeted fix for user-reported issues

---

## Purpose

Fix user-reported issues by routing to specialized agents with minimal overhead:
- Reactive response to manual testing feedback
- Triage-based agent routing
- Session tracking for iterative fixes
- Model escalation on retry

**Use `/vibe fix` instead of `/vibe quick` when:**
- Issue relates to existing feature implementation
- You want automatic agent routing
- You may need to iterate ("still broken")
- You want fix history tracked

---

## Usage

```bash
/vibe fix "button is misaligned"              # Standalone (infers feature)
/vibe fix AUTH-001 "form doesn't submit"      # With feature ID
/vibe fix --session fix-AUTH-001-001          # Continue existing session
```

---

## Triage System

Route feedback to appropriate agent(s):

| Pattern Match | Category | Agent(s) |
|--------------|----------|----------|
| button, layout, style, spacing, color, css, margin, padding | `ui` | ui-agent |
| validation, error, constraint, rule, policy, guard | `logic` | domain-agent |
| submit, event, click, handler, flow, socket, hook | `integration` | api-agent |
| migration, schema, database, query, index | `data` | data-agent |
| login broken, flow fails, end-to-end | `mixed` | api-agent + domain/ui |

### Triage Priority

```
1. Exact keyword match → route to matching agent
2. Multiple matches → route to all matching agents
3. No match → default to api-agent (integration layer)
4. "still broken" + existing session → load previous context
```

---

## Before Starting

1. **Check for existing fix session**
   ```
   .claude/fix-sessions/{feature-id}-*.json
   ```
   If found and status != "resolved", offer to continue

2. **Load feature contract (if ID provided)**
   ```
   .claude/contracts/{ID}.json
   ```
   Use for context on agent assignments and file locations

3. **Infer feature from git diff (if no ID)**
   ```bash
   git diff --name-only HEAD~5
   ```
   Map changed files to feature via contracts

---

## Workflow

### Phase 0: TRIAGE

```
+======================================================================+
|  FIX TRIAGE                                                           |
|  Feedback: "{user description}"                                       |
+======================================================================+

Analyzing feedback...

Category: ui
Keywords matched: "button", "misaligned"
Agent(s): ui-agent

Context loaded:
  - Feature: AUTH-001 (from git diff)
  - Contract: .claude/contracts/AUTH-001.json
  - Files: assets/svelte/components/features/auth/LoginForm.svelte

[Enter] Start fix  [c] Change agent  [m] More context
```

### Phase 1: TARGETED FIX

```
+======================================================================+
|  TARGETED FIX                                                         |
|  Agent: ui-agent (sonnet)                                             |
|  Issue: "button is misaligned"                                        |
+======================================================================+
```

**Agent behavior:**
- Load ONLY relevant files from contract
- Make minimal changes (no refactoring)
- Use sonnet model initially
- Escalate to opus if this is a retry attempt

**Agent prompt includes:**
```
You are fixing a specific issue reported by the user.

ISSUE: {description}
CATEGORY: {category}
FILES: {relevant_files}

RULES:
1. Fix ONLY the reported issue
2. Make MINIMAL changes
3. Do NOT refactor unrelated code
4. Do NOT add new features
5. Preserve existing behavior
```

### Phase 2: QUICK VERIFY

```
+======================================================================+
|  QUICK VERIFY                                                         |
|  Running: Related tests only                                          |
+======================================================================+
```

**Run only related tests:**
```bash
# For UI fixes
cd assets && npm test -- --testPathPattern="LoginForm"

# For domain fixes
mix test test/accounts/ --max-cases 20

# For integration fixes
mix test test/integration/auth_test.exs
```

**Visual check for UI fixes:**
```
Screenshots captured:
  - Before: .claude/screenshots/fix-001-before.png
  - After: .claude/screenshots/fix-001-after.png

Visual diff available? [v] View  [Enter] Continue
```

### Phase 3: SESSION LOG

Write to `.claude/fix-sessions/{feature-id}-{date}-{N}.json`:

```json
{
  "session_id": "fix-AUTH-001-20260128-001",
  "feature_id": "AUTH-001",
  "created_at": "2026-01-28T10:30:00Z",
  "attempts": [
    {
      "attempt": 1,
      "timestamp": "2026-01-28T10:30:00Z",
      "feedback": "login button is misaligned",
      "triage": {
        "category": "ui",
        "keywords": ["button", "misaligned"],
        "agents": ["ui-agent"]
      },
      "model": "sonnet",
      "changes": [
        {
          "file": "assets/svelte/components/features/auth/LoginForm.svelte",
          "line": 45,
          "description": "Fixed button margin"
        }
      ],
      "verification": {
        "status": "passed",
        "tests_run": 3,
        "tests_passed": 3
      },
      "result": "success"
    }
  ],
  "status": "resolved"
}
```

---

## Iteration: "Still Broken"

When user reports issue again:

```
/vibe fix "still broken"
```

**Behavior:**
1. Load most recent fix session
2. Review previous attempt's changes
3. Ask clarifying questions if needed
4. Escalate model: sonnet → opus
5. Escalate scope: quick → standard verification
6. Track new attempt in session log

```
+======================================================================+
|  FIX ITERATION                                                        |
|  Session: fix-AUTH-001-20260128-001 (attempt 2)                       |
+======================================================================+

Previous fix (attempt 1):
  - Changed: LoginForm.svelte:45 (button margin)
  - Result: User reports still broken

Model escalation: sonnet → opus
Verification: quick → standard (full test suite)

[Enter] Continue  [d] Describe issue more  [r] Review previous changes
```

---

## Completion

```
+---------------------------------------------------------------------+
|  FIX COMPLETE                                                        |
|                                                                      |
|  Session: fix-AUTH-001-20260128-001                                  |
|  Attempts: 1                                                         |
|  Status: Resolved                                                    |
|                                                                      |
|  Changes:                                                            |
|    * LoginForm.svelte:45 - Fixed button margin                       |
|                                                                      |
|  Tests: 3/3 passing                                                  |
|                                                                      |
|  [c] Commit  [p] Create PR  [d] Done (uncommitted)                   |
+---------------------------------------------------------------------+
```

---

## Anti-Patterns

- **Never refactor unrelated code** - Fix only what's reported
- **Never run full test suite initially** - Only related tests
- **Never proceed without user confirmation** - Always confirm triage
- **Never skip session logging** - Enables iteration
- **Never ignore previous attempts** - Learn from fix history
- **Never use opus on first attempt** - Start with sonnet, escalate if needed

---

## Model Selection

| Scenario | Model |
|----------|-------|
| First attempt, any category | sonnet |
| Retry attempt (still broken) | opus |
| Mixed category (multiple agents) | opus for coordination |
| Simple UI fix | sonnet |
| Complex integration fix | opus |

---

## Integration with Polish Phase

`/vibe fix` can be triggered from Phase 4 (Polish) suggestions:

```
Polish detected 3 issues. Fix now?
  1. [ui] Button touch target 40px (should be 44px)
  2. [a11y] Missing ARIA label on input
  3. [a11y] Focus not visible on submit

[1-3] Fix specific  [a] Fix all  [s] Skip
```

Selecting an issue routes to `/vibe fix` with pre-filled context.
