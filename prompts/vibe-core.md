# Vibe Core Orchestrator

> Minimal workflow orchestrator with tiered context loading for optimal performance.

---

## Context Loading Strategy

### Tier System

```
TIER 1 - CORE (Always Load - ~10% context)
├── This file (vibe-core.md)
├── Phase-specific file from prompts/phases/
└── Feature spec from project

TIER 2 - ON-DEMAND (Load when triggered - ~20%)
├── Matched patterns only (via manifest.json)
├── Referenced architecture docs only
└── Role extensions when needed

TIER 3 - CHECKPOINT (Restore from prior session)
├── patterns_used from checkpoint
├── context_summary for continuity
└── decisions_made for consistency
```

### Loading Rules

1. **Start of Session**: Load TIER 1 only
2. **Pattern Match**: Query `patterns/manifest.json`, load only matched patterns
3. **Resume**: Load checkpoint's `context_cache` before TIER 1
4. **Role Extensions**: Load `roles/{role}/{module}.md` only when that work begins

---

## Command Reference

| Command | Phase File | Context Tier |
|---------|------------|--------------|
| `/vibe [ID]` | `phases/workflow.md` | TIER 1 + matched patterns |
| `/vibe quick [desc]` | `phases/quick.md` | TIER 1 minimal |
| `/vibe parallel [ID]` | `phases/parallel.md` | TIER 1 + contracts |
| `/vibe plan [sprint]` | `commands/plan.md` | TIER 1 + domain |
| `/vibe retro` | `commands/retro.md` | TIER 1 + learnings |

---

## Workflow Skeleton

### Standard Feature: `/vibe [FEATURE-ID]`

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
│  Verify: Scenarios complete, UI states defined, no blockers          │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 3: DEVELOPER                                                  │
│  Context: phases/developer.md + roles/developer/core.md              │
│  + Load: roles/developer/{backend|frontend}.md as needed             │
│  + Load: Matched patterns from manifest.json                         │
│  Output: Implementation (GREEN state)                                │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 4: QA VALIDATION                                              │
│  Context: phases/validation.md + roles/qa-engineer/core.md           │
│  Output: Quality score, PR ready                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Quick Mode: `/vibe quick [desc]`

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 1: DEV (Condensed)                                            │
│  Context: phases/quick.md + roles/developer/core.md                  │
│  Actions: Read code → Write test → Implement → Run test              │
├─────────────────────────────────────────────────────────────────────┤
│  PHASE 2: VERIFY                                                     │
│  Context: phases/validation.md (minimal)                             │
│  Actions: Full test suite → Quality checks → Commit                  │
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
- `context/loading-strategy.md` - Detailed tier system
- `context/phase-boundaries.md` - Phase-specific context
- `roles/{role}/core.md` - Role essentials
- `patterns/README.md` - Pattern discovery workflow
