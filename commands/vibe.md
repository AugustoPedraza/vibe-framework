---
name: vibe
description: Full autonomous workflow for feature implementation
args: "[FEATURE-ID]"
---

# Vibe Core Orchestrator

> Autonomous feature implementation with parallel agents. Pauses only when human judgment is required.

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
  pr_workflow: "stacked"          # Default to stacked PRs

pause_only_on:
  test_failures: true             # PAUSE - cannot auto-fix test logic
  security_critical: true         # PAUSE - requires acknowledgment
  quality_below_threshold: true   # PAUSE - may need scope adjustment
  review_blockers: true           # PAUSE - must fix before PR
  conflicts_unresolved: true      # PAUSE - naming/interface disputes
```

## Commands

```
/vibe [ID]           # Full autonomous workflow (features)
/vibe check <PR>     # Standalone PR verification
/vibe quick [desc]   # Bugs/hotfixes (no spec needed)
/vibe fix [desc]     # Targeted fix when paused
/vibe pivot          # Course correction when stuck
/vibe migrate [cmd]  # Legacy migration workflow
/vibe polish [path]  # UI polish validation (single or --all)
```

## Agent Taxonomy

**Implementation Agents** (spawned via Task tool):

| Agent | Responsibility | Files |
|-------|---------------|-------|
| domain-agent | Ash resources, actions, validations, policies | `agents/domain-agent.md` |
| api-agent | LiveView handlers, routing, API wiring | `agents/api-agent.md` |
| ui-agent | Svelte components, stores, interactions | `agents/ui-agent.md` |
| data-agent | Migrations, seeds, data layer | `agents/data-agent.md` |

**QA Agents** (spawned in background):

| Agent | Responsibility | Files |
|-------|---------------|-------|
| ci-fixer | Auto-fix CI failures after PR creation | `agents/ci-fixer.md` |
| refactoring-analyzer | DRY, orthogonality, tech debt | `agents/refactoring-analyzer.md` |

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

Validate on first command only - skip on subsequent commands in session.

## Workflow: `/vibe [FEATURE-ID]`

### Phase 0: CONTRACT

1. **Check active features** - Use TaskList to detect running features, check for file overlap
2. **Validate spec** - Check required sections, verify acceptance criteria format
3. **Generate scaffold** - If `ui_spec` exists, create component scaffolds and test stubs
4. **Generate contract** - Parse spec, classify criteria by agent, assign to TaskCreate with metadata
5. **Create integration branch** - `feature/{ID}-integration`, setup stacked PRs
6. **AUTO-PROCEED** to Phase 1

Use plan mode for spec analysis (safe read-only exploration before implementation).

### Phase 1: PARALLEL IMPLEMENTATION

1. **Match patterns** - Query `patterns/manifest.json`, load matched patterns into agent context
2. **Spawn implementation agents** via Task tool (parallel, `run_in_background: true`):
   - domain-agent, ui-agent, data-agent working simultaneously
3. **Track progress** via TaskCreate/TaskUpdate with metadata:
   ```json
   {"phase": 1, "criteria_completed": 2, "criteria_total": 5, "tests_passing": true}
   ```
4. **Auto-fix** format issues via hooks (PostToolUse)
5. **SYNC**: All agents complete -> AUTO-PROCEED to Phase 2

### Phase 2: INTEGRATION

1. **Create stacked PRs** - data/, domain/, ui/ branches
2. **Spawn ci-fixer** (background) for each PR - auto-fix failures (max 3 retries)
3. **Spawn api-agent** - Wire domain to UI, create LiveView handlers
4. **GATE**: Tests passing? YES -> AUTO-PROCEED, NO -> **PAUSE**
5. **Create API PR** + spawn ci-fixer

### Phase 3: VALIDATION + AUTO-REVIEW

1. **Aggregate reports** - Collect all agent/watcher results
2. **Run refactoring-analyzer** - DRY, orthogonality, tech debt scoring
3. **Calculate quality score** - Combined metric from all checks
4. **GATE**: Quality >= 4.0? YES -> Continue, NO -> **PAUSE**
5. **Pre-PR verification** (catches CI failures before PR creation):
   ```
   5a. CLI Tool Sweep (two parallel groups):
       Backend: mix compile --warnings-as-errors, mix credo --strict, mix test
       Frontend (cd assets): eslint --max-warnings=0, svelte-check, tsc --noEmit, vitest run
       (Skip: mix format, prettier — already handled by hooks)

   5b. Code Hygiene Scan (parallel Task subagent, modified files only via git diff):
       - Debug statements (console.log, IO.inspect, dbg, debugger) in non-test files → blocker
       - TODO/FIXME in new code → warning
       - Svelte 4 syntax leaks (export let, <slot/>, $:) → blocker
       - N+1 query patterns (Ash.read!/get! inside Enum.map/each) → blocker
       - Unused imports → warning

   5c. Auto-fix pass (per autonomy settings):
       - eslint --fix for auto-fixable errors
       - Remove debug statements from non-test files
       - Convert Svelte 4 → Svelte 5 patterns
       - Remove unused imports
       - Re-run failed checks to confirm fixes

   5d. GATE: Blockers remaining after auto-fix? YES → PAUSE, NO → proceed
       (Warnings reported but non-blocking)
   ```
6. **UI polish validation** (main session — MCP cannot run in subagents):
   ```
   If MCP available:
     For each modified .svelte file:
       - Navigate to component route via Playwright MCP
       - Validate at 375px and 1280px viewports
       - Check: states, touch targets, design tokens, responsiveness
       - Auto-fix safe issues (spacing, aria-labels, dvh)
       - Report state matrix
   Else:
     Run /vibe polish in static analysis mode for each modified component
     Log: "Install Playwright MCP for visual validation — see docs/mcp-browser-setup.md"
   ```
7. **Auto-review** - Spawn 3 parallel agents (security, performance, patterns)
8. **GATE**: No blockers? YES -> AUTO-PROCEED, NO -> **PAUSE**
9. **Create final PR** -> main + spawn ci-fixer

### Phase 4: POLISH

1. **Run proactive checks** - CSS, LiveView, Ash, A11y, Performance
2. **Auto-fix safe suggestions** - spacing, tokens, aria-labels
3. **List remaining suggestions** (info only, non-blocking)

### Phase 5: LEARNING (background)

1. **Extract patterns** - Analyze implementation for reusable patterns, score reusability
2. **Write to auto memory** - `memory/patterns-learned.md`, `memory/pitfalls.md`
3. **Archive feature** - Move spec to archived, update completed.md
4. **Update `rules/project-pitfalls.md`** with new pitfalls from interventions
5. **Cleanup** - Remove feature tracking, auto-clear context

**DONE!** (Only paused if issues found)

## Strategic Pause Points (Only 6)

| Pause Point | Condition | Why Human Needed |
|-------------|-----------|------------------|
| Tests failing | Phase 2 test gate fails | Cannot auto-fix test logic |
| Security critical | Security issue found | Requires acknowledgment |
| Quality below 4.0 | Quality score low | May need scope adjustment |
| Pre-PR verification | CLI/hygiene blockers unfixable | Compile errors, type errors, N+1 patterns |
| Review blockers | Auto-review finds blockers | Must fix before PR |
| Conflicts unresolved | Agent disagreements | Need decision |

## Auto-Proceed Decision Matrix

| Decision Point | Autonomous Behavior |
|----------------|---------------------|
| PR workflow | Stacked PRs default |
| Format issues | Auto-fix always (via hooks) |
| Lint warnings | Notify, proceed |
| Tests passing | Auto-proceed |
| Tests failing | **PAUSE** |
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

## Pattern Retrieval (RAG-Lite)

1. Read `patterns/manifest.json` (lightweight index)
2. Match feature requirements against pattern triggers
3. Filter by project stack (from `vibe.config.json`)
4. Rank by reusability_score (5+ = recommended)
5. Load ONLY matched pattern files into agent context

## Parallel Feature Coordination

When starting a feature while another is in progress:

1. Use TaskList to detect active features in current session
2. Check if currently running inside a worktree (look for `.env.worktree` in project root)
3. If in worktree: proceed normally — isolation is already handled by the slot
4. If in main worktree and active features detected:
   - Warn about potential collision
   - Suggest: `just wt-switch {slot} feature/{spec_id}` (pick an available slot via `just wt-list`)
   - **PAUSE** — tell user to switch terminal to the worktree tmux session, then re-run `/vibe`
5. If no collision detected: proceed normally in main

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
- Vibe owns: implementation (agents, TDD, quality gates, PRs)

## Quick Mode: `/vibe quick [description]`

Single agent handles: Analyze -> Write test -> Implement -> Verify.
No watchers, no parallel agents, no PR workflow.

## References

- `commands/check.md` - PR verification
- `commands/fix.md` - Targeted fix
- `commands/pivot.md` - Course correction
- `commands/quick.md` - Bug/hotfix mode
- `commands/migrate.md` - Legacy migration
- `commands/polish.md` - UI polish validation
- `agents/*.md` - Agent specifications
- `patterns/README.md` - Pattern discovery
- `docs/mcp-browser-setup.md` - Playwright MCP setup
