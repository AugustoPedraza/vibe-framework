# Vibe Core Orchestrator

> Agent-first parallel execution with tiered context loading for optimal performance.

---

## Agent-First Architecture (DEFAULT)

```
/vibe [ID]         # Parallel mode (DEFAULT)
/vibe [ID] --quick # Simple tasks (single agent)
/vibe [ID] --solo  # Legacy sequential mode
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
| `/vibe [ID]` | Parallel (default) | Orchestrator + agent files |
| `/vibe [ID] --quick` | Quick | Single agent, minimal context |
| `/vibe [ID] --solo` | Sequential | Legacy phase files |
| `/vibe contract [ID]` | Contract gen | Contract schema |
| `/vibe plan [sprint]` | Planning | Domain + PM |
| `/vibe convert-story [ID]` | BMAD bridge | Convert story to spec |

---

## Workflow Skeleton

### Parallel Mode (DEFAULT): `/vibe [FEATURE-ID]`

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 0: CONTRACT                                                   │
│  Context: agents/orchestrator/core.md                                │
│  Output: .claude/contracts/{ID}.json with agent_assignments          │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 1: PARALLEL IMPLEMENTATION                                    │
│                                                                      │
│  ┌─ domain-agent (opus) ───────────┐                                 │
│  │ Ash resources, actions, tests   │                                 │
│  └─────────────────────────────────┘                                 │
│  ┌─ ui-agent (sonnet) ─────────────┐  ← Run in parallel              │
│  │ Svelte components, UI tests     │                                 │
│  └─────────────────────────────────┘                                 │
│  ┌─ data-agent (sonnet) ───────────┐                                 │
│  │ Migrations, seeds               │                                 │
│  └─────────────────────────────────┘                                 │
│                                                                      │
│  + QA WATCHERS (background): format, lint, test, security            │
│                                                                      │
│  Output: Implementation complete, watchers report issues             │
├─────────────────────────────────────────────────────────────────────┤
│  SYNC POINT: All implementation agents complete                      │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 2: INTEGRATION                                                │
│  Context: agents/implementation/api-agent.md                         │
│  Output: LiveView handlers, wiring, E2E tests                        │
│  GATE: Watcher issues become BLOCKING                                │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 3: VALIDATION                                                 │
│  Aggregate watcher reports, calculate quality score                  │
│  Output: PR ready if passing                                         │
└─────────────────────────────────────────────────────────────────────┘
```

### Quick Mode: `/vibe [FEATURE-ID] --quick`

```
┌─────────────────────────────────────────────────────────────────────┐
│  SINGLE AGENT (sonnet)                                               │
│  Context: agents/implementation/{relevant-agent}.md                  │
│  Actions: Write test → Implement → Run test → Verify                 │
│  No watchers, no parallel agents                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Solo Mode (Legacy): `/vibe [FEATURE-ID] --solo`

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 1: QA ENGINEER                                                │
│  Context: phases/qa.md + roles/qa-engineer/core.md                   │
│  Output: Test stubs (RED state)                                      │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 2: DESIGNER                                                   │
│  Context: phases/designer.md + roles/designer/core.md                │
│  Output: UX verification, component selection                        │
├─────────────────────────────────────────────────────────────────────┤
│  READINESS GATE                                                      │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 3: DEVELOPER                                                  │
│  Context: phases/developer.md + roles/developer/core.md              │
│  Output: Implementation (GREEN state)                                │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 4: QA VALIDATION                                              │
│  Context: phases/validation.md + roles/qa-engineer/core.md           │
│  Output: Quality score, PR ready                                     │
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
- `prompts/vibe.md` - Full orchestrator (reference)
- `agents/orchestrator/core.md` - Orchestrator guidance
- `agents/implementation/*.md` - Implementation agent specs
- `agents/watchers/*.md` - QA watcher specs
- `contracts/watcher-report.schema.json` - Watcher report schema
- `context/loading-strategy.md` - Detailed tier system
- `patterns/README.md` - Pattern discovery workflow

### BMAD Integration

Vibe uses BMAD for planning, with a single bridge:
- `/vibe convert-story [ID]` - Convert BMAD story to Vibe spec

BMAD owns: stories, UX exploration, research, architecture
Vibe owns: implementation (agents, TDD, quality gates)
