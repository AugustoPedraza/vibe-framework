---
name: vibe
description: Full autonomous workflow for feature implementation
args: "[SCREEN-SPEC-ID]"
---

# Vibe Core — Single-Agent TDD Pipeline

> Autonomous feature implementation. Single focused agent, 4 phases: PREP → BUILD → VERIFY → MONITOR. Pauses only when human judgment is required.

## Autonomy Settings

```yaml
auto_fix:
  format: true                    # Always auto-fix format issues
  lint_auto_fixable: true         # Auto-fix lint issues that can be automated
  polish_safe: true               # Auto-fix safe polish suggestions
  debug_statements: true          # Auto-remove debug statements from non-test code
  svelte4_syntax: true            # Auto-convert Svelte 4 → Svelte 5 patterns
  unused_imports: true            # Auto-remove unused imports

auto_proceed:
  tests_passing: true             # Continue when tests pass
  quality_above_4: true           # Continue when quality >= 4.0
  review_no_blockers: true        # Continue when review passes
  pr_workflow: "single"           # One PR per spec to main

pause_only_on:
  test_failures: true             # PAUSE - cannot auto-fix test logic after 3 attempts
  security_critical: true         # PAUSE - requires acknowledgment
  quality_below_threshold: true   # PAUSE - may need scope adjustment
  review_blockers: true           # PAUSE - must fix before PR
  n_plus_one: true                # PAUSE - structural fix needed

never:                            # HARD BLOCK - see rules/no-shortcuts.md
  exclude_files_from_commit: true # Fix the issue, don't exclude the file
  skip_hooks: true                # No --no-verify, no --no-check
  skip_tests: true                # No .skip, no @tag :skip, no TODO
  ignore_hook_blockers: true      # If hook says BLOCKER, fix it first
  selective_staging: true         # All modified files must be staged
```

## Commands

```
/vibe [ID]           # Full autonomous workflow (screen spec) — includes runtime monitoring after PR
/vibe check <PR>     # Standalone PR verification
/vibe quick [desc]   # Bugs/hotfixes (no spec needed)
/vibe fix [desc]     # Targeted fix when paused
/vibe pivot          # Course correction when stuck
/vibe migrate [cmd]  # Legacy migration workflow
/vibe polish [path]  # UI polish validation (single or --all)
```

## Layer References

Single agent consults these as checklists while building each layer:

| Layer | Reference Guide | When |
|-------|----------------|------|
| DATA | `references/data-layer.md` | Migrations needed |
| DOMAIN | `references/domain-layer.md` | Ash resources/actions |
| API | `references/api-layer.md` | LiveView wiring |
| UI | `references/ui-layer.md` | Svelte components |

**QA Agents** (spawned as background Task agents):
- `agents/ci-fixer.md` — Auto-fix CI failures after PR creation
- `agents/refactoring-analyzer.md` — Spec-compliance and tech debt analysis

## Project Validation (Session Start)

**Required structure** (HARD BLOCK if missing):

```
{project}/
├── .claude/vibe.config.json     # Project configuration
├── architecture/                 # Technical decisions
│   └── _fundamentals/           # At minimum quick-reference.md
└── docs/domain/                  # Product specs
    ├── GLOSSARY.md
    └── features/                 # Feature specs
```

Validate on first command only — skip on subsequent commands in session.

## Worktree Isolation (Required)

Every `/vibe` run MUST execute inside a worktree slot. Phase 1 enforces this:

1. Check if `.env.worktree` exists in project root
2. If YES: read it, confirm `PHX_PORT`/`VITE_PORT`/`POSTGRES_DB` are set, proceed
3. If NO (running in main): **PAUSE** immediately with:
   ```
   /vibe must run inside a worktree slot for isolation.

   Quick setup:
     just wt-setup 1                          # one-time (~1-3 min)
     just wt-switch 1 feature/{spec_id}       # switch to feature branch
     just wt-tmux 1                           # open tmux session

   Then re-run /vibe from that terminal.

   Tip: /bmad-bmm-implement-screen-spec handles this automatically.
   ```
4. Do NOT proceed — wait for user to switch terminals

---

## Workflow: `/vibe [SCREEN-SPEC-ID]`

### Phase 1: PREP (~1 min)

1. **Verify worktree** — Check `.env.worktree` exists. If missing, **PAUSE** (see "Worktree Isolation" above)
2. **Load screen spec** — Read `{bmad.screen_specs_path}/{ID}.md`, validate Status is `spec-ready` or `building`
3. **Auto-match patterns** — Extract keywords from spec title + acceptance criteria + UX Patterns field:
   ```
   1. Extract keywords from: spec title, screen type, UX Patterns field, AC text
   2. Match against patterns/manifest.json triggers (case-insensitive)
   3. Filter by stack intersection (from vibe.config.json)
   4. Sort by score descending
   5. Load top 3 pattern files into context
   6. Log which patterns were matched and why
   ```
4. **Load critical rules** — Read `project-context.md` "Critical Don't-Miss Rules" section only (not the full file), plus the relevant layer reference guide(s) for this spec
5. **Create branch** — `git checkout -b feature/{ID}` from main (if not already on it)
6. **AUTO-PROCEED** to Phase 2

### Phase 2: BUILD (the core — single-agent TDD)

Single agent implements full vertical slice in dependency order:

```
1. DATA    — migration if new tables/columns needed
2. DOMAIN  — Ash resource/action + tests (TDD: test first → implement → green)
3. API     — LiveView mount/handle_event/render + integration test
4. UI      — Svelte component + vitest (TDD: test first → implement → green)
5. WIRE    — Register component in app.js, update router, verify end-to-end
```

**Per layer**, the agent:
- Consults the **layer reference guide** (`references/{layer}-layer.md`) as a checklist
- **Strict TDD**: writes test FIRST (tagged `@tag :ac_N` for Elixir, named `AC-N:` for vitest), verifies it FAILS (red), then implements until green
- **AC traceability**: every acceptance criterion in the spec MUST map to at least one tagged test. Track coverage as you go.
- Implements until test passes
- Moves to next layer

**Hard gates per layer** (self-check before moving on):

| Layer | Gate |
|-------|------|
| DATA | Migration runs forward AND rolls back cleanly |
| DOMAIN | All AC-tagged tests pass. No `@tag :skip`. Policies test both allowed and denied. |
| API | LiveView thin shell (<100 lines). `assign_async` for all data loading. Serialization to camelCase maps. |
| UI | All 4 states implemented (loading skeleton, empty CTA, error with retry + `role="alert"`, success). Component <300 lines (decompose if over). Touch targets 44px min. No arbitrary Tailwind values. Svelte 5 runes only. |
| WIRE | Component registered in `app.js`. Route exists. End-to-end navigation works. |

**Auto-fix** rules:
- Format: `mix format` / `prettier` (via hooks, already running)
- Debug statements: auto-remove from non-test files
- Svelte 4 syntax: auto-convert to Svelte 5
- Unused imports: auto-remove

**PAUSE only on**:
- Tests failing after 3 fix attempts
- Security issue found
- N+1 query pattern detected
- Component >300 lines and no clear decomposition path

### Phase 3: VERIFY + SHIP (~3 min)

**3a. Parallel validation** — spawn 3 background Task agents simultaneously:

1. **backend-verify**: `mix compile --warnings-as-errors && mix credo --strict && mix test`
2. **frontend-verify**: `cd assets && npx eslint svelte/ && npx svelte-check && npx vitest run`
3. **adversarial-spec-compliance** (read-only audit agent — ADVERSARIAL):
   - **Philosophy**: NEVER accept "looks good". Find minimum 3 specific, actionable issues. If <3 found, look harder: edge cases, null handling, integration issues, architecture violations.
   - **AC coverage**: For each acceptance criterion, find the tagged test (`@tag :ac_N` or `AC-N:`). Missing = BLOCKER.
   - **4-state audit**: For each async component, grep for loading/skeleton, error/role="alert", empty/EmptyState, success patterns. Missing state = BLOCKER.
   - **Table-stakes audit**: For each `[x]` item in spec's Table-Stakes Audit section, verify corresponding code exists. Missing = BLOCKER.
   - **Architecture compliance**: Thin shell (<100 lines), assign_async, camelCase serialization, Svelte 5 runes only. Violations = BLOCKER.
   - **Code quality deep dive**: Security (injection, auth), performance (N+1, loops), error handling, test quality (real assertions vs placeholders).
   - **Touch targets**: Check interactive elements for `min-h-11` or equivalent 44px. Missing = warning.
   - **Design tokens**: Check for raw colors, arbitrary values, hardcoded z-index. Violations = warning (hooks already catch these).
   - **Component sizes**: Any `.svelte` file >300 lines = BLOCKER.
   - **Severity output**: Categorize all findings as HIGH (must fix before PR), MEDIUM (should fix), LOW (nice to fix). Auto-fix HIGH and MEDIUM where possible.

**3b. Runtime + visual validation** (main session):
- Start dev server if not running:
  - **In worktree**: `source .env.worktree && mix phx.server > .smoke-server.log 2>&1 &` then `cd assets && source ../.env.worktree && npx vite --port $VITE_PORT > ../.smoke-vite.log 2>&1 &`
  - **NEVER use `just dev`** in a worktree — it starts Docker and conflicts with the main repo's postgres container
  - Read `.env.worktree` for the correct URL (e.g., `http://localhost:4010` for slot 1)
  - Wait for server ready: curl poll the URL, max 30s
- **Server log check**: Read `.smoke-server.log` for `[error]`, `[warning]`, compile errors
- For each new/modified screen route (if MCP Playwright available):
  - Navigate to route at 375px width (mobile) — take screenshot
  - `browser_console_messages` — capture JS errors/warnings
  - Navigate at 1280px width (desktop) — take screenshot
  - `browser_snapshot` — verify content renders, no layout breaks, touch targets visible
- Report runtime issues (console errors, server log errors) as part of the 3d gate check
- If MCP not available: server-log-only mode (skip browser checks), note "Install Playwright MCP for visual + console validation"

**3c. Auto-fix** any fixable issues (eslint --fix, format, etc.)

**3d. GATE**: Blockers remaining? YES → **PAUSE** with specific items. NO → continue.

**3e. Create PR** — single PR to main with:
- Title: `{SPEC-ID}: {Spec Title}`
- Body: Summary of changes, AC checklist (checkboxes), spec-compliance score
- Labels: `screen-spec`, feature-flow label

**3f. Update spec status** to `review`

**3g. Spawn ci-fixer** in background (max 3 retries)

### Phase 4: MONITOR (after PR)

> Server under Claude's control. Proactive error detection while user tests. The user NEVER copy-pastes logs.

**4a. Start server** (if not already running from Phase 3b):
- Read `.env.worktree` for `PHX_PORT`/`VITE_PORT`
- Start Phoenix: `source .env.worktree && mix phx.server > .smoke-server.log 2>&1 &`
- Start Vite: `cd assets && source ../.env.worktree && npx vite --port $VITE_PORT > ../.smoke-vite.log 2>&1 &`
- **NEVER `just dev`** in a worktree
- Wait for ready (curl poll, max 30s)

**4b. Proactive scan** (Playwright MCP required):
- For each route from the screen spec:
  - `browser_navigate` to route
  - `browser_console_messages` — capture JS errors/warnings
  - `browser_snapshot` — verify content renders
  - Check at mobile (375px) and desktop (1280px)
- Read `.smoke-server.log` for `[error]`, `[warning]`, compile errors
- If issues found: fix → re-scan (max 3 cycles)
- If MCP not available: server-log-only mode (skip browser checks)

**4c. Hand off to user**:
- Print: "Server running at {URL}"
- Print: route list with what to test (from spec acceptance criteria)
- Print: issues found and fixed (if any)
- Print: "I'm watching server logs. Just test — I'll catch errors."

**4d. Active monitoring loop** (ZERO copy-paste — Claude has direct access to everything):
- On **EVERY** user message: automatically read `.smoke-server.log` for new lines since last check
- If user says "check"/"status"/"re-scan": full browser + server log scan
- If user says "there's an error on X page": Claude navigates to X via Playwright, reads console + server log, finds root cause
- Errors found:
  - **Trivial** (missing import, typo, format, missing route): fix immediately, tell user what changed
  - **Complex** (logic error, missing handler, data issue): explain the bug clearly + propose solution, ask for confirmation before applying
- On "done"/"looks good"/"ship it": exit monitoring, print final summary

---

## Strategic Pause Points

| Pause Point | Condition | Why Human Needed |
|-------------|-----------|------------------|
| Tests failing | 3 fix attempts exhausted | Cannot auto-fix test logic |
| Security critical | Security issue found | Requires acknowledgment |
| Pre-PR verification | Blockers unfixable | Compile errors, type errors, N+1 patterns |
| Review blockers | Spec-compliance audit BLOCKER | Must fix before PR |

## Auto-Proceed Decision Matrix

| Decision Point | Autonomous Behavior |
|----------------|---------------------|
| PR workflow | Single PR to main |
| Format issues | Auto-fix always (via hooks) |
| Lint warnings | Notify, proceed |
| Tests passing | Auto-proceed |
| Tests failing | **PAUSE** after 3 attempts |
| Quality >= 4.0 | Auto-proceed to review |
| Quality < 4.0 | **PAUSE** |
| Review no blockers | Auto-proceed |
| PR creation | Auto-create |
| CLI check failures | Auto-fix if possible, else **PAUSE** |
| Debug statements | Auto-remove (non-test files) |
| Svelte 4 syntax | Auto-convert to Svelte 5 |
| TODO/FIXME comments | Warn, proceed |
| N+1 query pattern | **PAUSE** (structural fix needed) |
| Polish suggestions | Auto-fix safe ones |

## CI Auto-Fix

After every PR is created, spawn ci-fixer agent in background:

1. Monitor CI via `gh run view --log-failed`
2. Analyze root cause (test, lint, build, typecheck)
3. Generate minimal fix, verify locally, push
4. Repeat until green or max 3 retries
5. If still failing after 3 attempts: **PAUSE** with summary

## BMAD Integration

BMAD handles planning and discovery. Vibe handles implementation.
- BMAD owns: stories, UX exploration, research, architecture
- Vibe owns: implementation (TDD, quality gates, PRs)

## Quick Mode: `/vibe quick [description]`

Single agent handles: Analyze → Write test → Implement → Verify.
No parallel validation agents, no PR workflow.

## References

- `commands/check.md` — PR verification
- `commands/fix.md` — Targeted fix
- `commands/pivot.md` — Course correction
- `commands/quick.md` — Bug/hotfix mode
- `commands/migrate.md` — Legacy migration
- `commands/polish.md` — UI polish validation
- `references/*.md` — Layer reference guides (checklists)
- `patterns/README.md` — Pattern discovery
- `docs/mcp-browser-setup.md` — Playwright MCP setup
