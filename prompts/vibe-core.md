# Vibe Core Orchestrator

> Unified autonomous workflow with end-to-end execution. Pauses only when human judgment is required.

---

## Autonomy Settings (Default Behavior)

```yaml
auto_fix:
  format: true                    # Always auto-fix format issues
  lint_auto_fixable: true         # Auto-fix lint issues that can be automated
  polish_safe: true               # Auto-fix safe polish suggestions

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

---

## Commands (5 Essential)

```
/vibe [ID]           # Full autonomous workflow (features)
/vibe quick [desc]   # Bugs/hotfixes (no spec needed)
/vibe fix [desc]     # Recovery when paused
/vibe pivot          # Course correction when stuck
/vibe migrate [cmd]  # Legacy migration workflow
```

**Removed commands** (absorbed into workflow):
- `/vibe generate` → Phase 0 auto-generates if ui_spec exists
- `/vibe lint` → Watchers handle continuously
- `/vibe validate` → Phase 0 auto-validates spec
- `/vibe review` → Phase 3 auto-runs review --all
- `/vibe analyze` → Included in review --all
- `/vibe archive` → Phase 5 auto-archives
- `/vibe learn` → Phase 5 auto-extracts patterns
- `/vibe patterns` → Phase 1 auto-matches patterns
- `/vibe tracer`, `/vibe convert-story`, `/vibe explore` → Removed

---

## Agent-First Architecture (DEFAULT)

```
/vibe [ID]         # Parallel mode (DEFAULT)
/vibe [ID] --quick # Simple tasks (single agent)
```

### Agent Taxonomy

**Implementation Agents:**
| Agent | Model | Context | Files |
|-------|-------|---------|-------|
| domain-agent | opus | ~40k | `agents/implementation/domain-agent.md` |
| api-agent | opus | ~35k | `agents/implementation/api-agent.md` |
| ui-agent | sonnet | ~30k | `agents/implementation/ui-agent.md` |
| data-agent | sonnet | ~25k | `agents/implementation/data-agent.md` |

**QA Watcher Agents (Background):**
| Agent | Model | Context | Files |
|-------|-------|---------|-------|
| format-watcher | haiku | ~10k | `agents/watchers/format-watcher.md` |
| lint-watcher | haiku | ~15k | `agents/watchers/lint-watcher.md` |
| test-watcher | sonnet | ~20k | `agents/watchers/test-watcher.md` |
| security-watcher | haiku | ~15k | `agents/watchers/security-watcher.md` |
| polish-watcher | sonnet | ~25k | `agents/watchers/polish-watcher.md` |

**Orchestrator:** `agents/orchestrator/core.md`

---

## Context Loading Strategy

### Tier System

```
TIER 1 - CORE (Always Load - ~10% context)
├── This file (vibe-core.md)
├── Agent-specific file from agents/
└── Feature spec from project

TIER 2 - ON-DEMAND (Load when triggered - ~20%)
├── Matched patterns only (via manifest.json)
├── Referenced architecture docs only
└── Contract sections when needed

TIER 3 - CHECKPOINT (Restore from prior session)
├── patterns_used from checkpoint
├── context_summary for continuity
└── decisions_made for consistency
```

### Loading Rules

1. **Start of Session**: Load TIER 1 only
2. **Pattern Match**: Query `patterns/manifest.json`, load only matched patterns
3. **Resume**: Load checkpoint's `context_cache` before TIER 1
4. **Agent Spawning**: Load specific agent file for spawned agent

---

## Command Reference

| Command | Mode | Context |
|---------|------|---------|
| `/vibe [ID]` | Full autonomous | Orchestrator + all phases |
| `/vibe quick [desc]` | Quick fix | Single agent, minimal context |
| `/vibe fix [desc]` | Recovery | Targeted fix when paused |
| `/vibe pivot` | Correction | Course change when stuck |
| `/vibe migrate [cmd]` | Migration | Legacy system migration |

---

## Workflow Skeleton

### Full Autonomous Mode: `/vibe [FEATURE-ID]`

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 0: CONTRACT (auto)                                            │
│  ├── Validate spec (absorbed from /vibe validate)                    │
│  ├── Generate scaffold (absorbed from /vibe generate)                │
│  ├── Create integration branch                                       │
│  ├── Setup stacked PRs (DEFAULT)                                     │
│  └── AUTO-PROCEED                                                    │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 1: PARALLEL IMPLEMENTATION (auto)                             │
│  ├── Auto-match patterns (absorbed from /vibe patterns)              │
│  ├── Spawn: domain-agent, ui-agent, data-agent                       │
│  ├── Spawn: format/lint/test/security watchers                       │
│  ├── Spawn: best-practices-policer, anti-pattern-detector            │
│  ├── Context reinforcement at 25%, 50%, 75%                          │
│  ├── Format issues: AUTO-FIX                                         │
│  ├── Lint warnings: NOTIFY, proceed                                  │
│  └── SYNC: All agents complete → AUTO-PROCEED                        │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 2: INTEGRATION (auto with gates)                              │
│  ├── Create PRs: data/, domain/, ui/                                 │
│  ├── Spawn: api-agent                                                │
│  ├── GATE: Tests passing?                                            │
│  │   ├── YES → AUTO-PROCEED                                          │
│  │   └── NO → **PAUSE**                                              │
│  └── Create PR: api/                                                 │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 3: VALIDATION + AUTO-REVIEW (auto with gates)                 │
│  ├── Aggregate all reports                                           │
│  ├── Run refactoring-analyzer                                        │
│  ├── Calculate quality score                                         │
│  ├── GATE: Quality >= 4.0?                                           │
│  │   └── YES → Continue                                              │
│  ├── AUTO-RUN: /vibe review --all (absorbed)                         │
│  │   ├── 3 parallel agents (security, performance, patterns)         │
│  │   ├── Include DRY analysis                                        │
│  │   ├── Include orthogonality analysis                              │
│  │   └── GATE: No blockers?                                          │
│  │       ├── YES → AUTO-PROCEED                                      │
│  │       └── NO → **PAUSE**                                          │
│  └── Continue to Phase 4                                             │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 4: POLISH (auto)                                              │
│  ├── Run polish-watcher                                              │
│  ├── Auto-fix safe suggestions                                       │
│  ├── List remaining suggestions                                      │
│  └── AUTO-CREATE final PR → main                                     │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 5: LEARNING (auto, background)                                │
│  ├── Extract patterns (absorbed from /vibe learn)                    │
│  ├── Archive feature (absorbed from /vibe archive)                   │
│  ├── Generate pitfalls from interventions                            │
│  └── Update pattern index                                            │
├─────────────────────────────────────────────────────────────────────┤
│  DONE! (Only paused if issues found)                                 │
└─────────────────────────────────────────────────────────────────────┘
```

**Strategic Pause Points (Only 5):**
1. Test failures (Phase 2)
2. Security critical issues
3. Quality below 4.0 threshold
4. Review blockers found (Phase 3)
5. Conflicts without clear resolution

### Quick Mode: `/vibe quick [description]`

For bugs and hotfixes that don't need a feature spec:

```
┌─────────────────────────────────────────────────────────────────────┐
│  SINGLE AGENT (sonnet)                                               │
│  Context: Minimal, focused on fix                                    │
│  Actions: Analyze → Write test → Implement → Verify                  │
│  No watchers, no parallel agents, no PR workflow                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

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

**Validation on first command only** - skip on subsequent commands in session.

---

## Pattern Retrieval (RAG-Lite)

### Matching Flow

```
1. Read patterns/manifest.json (lightweight - ~50 lines)
2. Match feature requirements against pattern triggers
3. Filter by project stack (from vibe.config.json)
4. Rank by reusability_score (5+ = recommended)
5. Load ONLY matched pattern files
```

### Display Format

```
+---------------------------------------------------------------------+
|  PATTERNS MATCHED (2 of 17)                                          |
|                                                                      |
|  1. [BACKEND] AsyncResult Status Extraction (score: 6)               |
|     Match: "loading state" in feature requirements                   |
|                                                                      |
|  2. [UX] Directional Transitions (score: 5)                          |
|     Match: "navigation animation" in UX spec                         |
|                                                                      |
|  Loading: patterns/backend/async-result-extraction.md                |
|  Loading: patterns/ux/directional-transitions.md                     |
+---------------------------------------------------------------------+
```

---

## Checkpoint Integration

### On Resume

```yaml
checkpoint_found:
  1. Display checkpoint summary
  2. Load context_cache.context_summary
  3. Pre-load context_cache.patterns_loaded
  4. Restore context_cache.decisions
  5. Resume at checkpoint position

context_budget_saved: ~30% (skip re-reading completed work)
```

### Checkpoint Save Triggers

| Trigger | Save Type |
|---------|-----------|
| File modification | Incremental (files_modified only) |
| Test passes | Incremental (tests_status only) |
| Scenario complete | Incremental (add to scenarios_completed) |
| Phase complete | Full checkpoint |
| Before `/clear` | Full checkpoint |

---

## Phase Transitions

### Phase Header Format

```
+======================================================================+
|  [ICON] [ROLE] PHASE                                                 |
|  Feature: [ID] - [Title]                                             |
|  Context: [files loaded for this phase]                              |
+======================================================================+
```

### Context Clearing Between Phases

```yaml
phase_transition:
  clear:
    - Previous role's extension modules
    - Non-applicable patterns
  retain:
    - Feature spec (always)
    - Decisions made (checkpoint)
    - Matched patterns (if still relevant)
  load:
    - New phase file
    - New role core
```

---

## Background Operations

### Parallel Execution

```yaml
background_ops:
  test_on_save:
    trigger: "file_saved"
    command: "mix test {affected_file}"
    blocking: false

  full_suite_on_scenario:
    trigger: "scenario_complete"
    command: "{{commands.test}}"
    blocking: false

  quality_check:
    trigger: "phase_complete"
    command: "{{commands.check}}"
    blocking: true  # Must pass before next phase
```

---

## Anti-Patterns

### Context Loading

- **DON'T**: Load full vibe.md (2000+ lines) for every command
- **DON'T**: Read entire role file when only core needed
- **DON'T**: Load all 17 patterns to find 2 matches
- **DON'T**: Re-read architecture docs already in checkpoint

### Workflow

- **DON'T**: Auto-continue without checkpoint
- **DON'T**: Implement multiple scenarios at once
- **DON'T**: Skip RED test verification
- **DON'T**: Create PR without quality gate pass

---

## Full Reference

For complete documentation, see:
- `agents/orchestrator/core.md` - Orchestrator guidance (primary reference)
- `prompts/commands/fix.md` - Fix command for recovery when paused
- `prompts/commands/pivot.md` - Course correction when stuck
- `prompts/commands/quick.md` - Bug/hotfix mode
- `prompts/commands/migrate.md` - Legacy migration workflow
- `agents/implementation/*.md` - Implementation agent specs
- `agents/watchers/*.md` - QA watcher specs
- `context/loading-strategy.md` - Detailed tier system
- `patterns/README.md` - Pattern discovery workflow

### BMAD Integration

BMAD handles all planning and discovery. Vibe handles implementation.
- BMAD owns: stories, UX exploration, research, architecture
- Vibe owns: implementation (agents, TDD, quality gates, PRs)
