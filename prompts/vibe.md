# Vibe Orchestrator

> Master workflow that coordinates roles with clear phase separation for production-level code.

---

## Development Philosophy: Vertical Slices

> **Build complete features end-to-end, not horizontal layers.**

### What This Means

Instead of:
- Build all resources -> then all views -> then all components

Do:
- Build LOGIN feature completely (User resource -> LoginView -> LoginForm)
- Then build next feature completely (Resource -> View -> Component)

### Implementation Principles

1. **Feature-First** - Each `/vibe [ID]` implements one complete vertical slice
2. **YAGNI** - Don't build infrastructure "just in case"
3. **Aspirational Docs** - Architecture docs describe end state, not starting point
4. **Pull, Don't Push** - Reference patterns from architecture docs as needed

**Each feature adds only what it needs. Infrastructure emerges from features.**

---

## Usage

### Core Commands

| Command | What it does |
|---------|--------------|
| `/vibe [FEATURE-ID]` | Implement feature (QA -> Designer -> Dev -> QA) |
| `/vibe parallel [FEATURE-ID]` | **NEW** Parallel implementation (backend + frontend simultaneously) |
| `/vibe contract [FEATURE-ID]` | **NEW** Generate interface contract for parallel implementation |
| `/vibe quick [desc]` | Bug/hotfix mode (condensed 2-phase workflow) |
| `/vibe pivot` | Course correction when implementation diverges |
| `/vibe plan [sprint]` | Plan sprint (Domain -> Designer -> PM) |
| `/vibe discover [ID]` | Pre-planning discovery for a single feature |

### AI Generation Commands

| Command | What it does |
|---------|--------------|
| `/vibe generate [ID]` | **NEW** Generate scaffold from feature spec (ui_spec) |
| `/vibe lint [path]` | **NEW** UX Governor - validate tokens, states, a11y |
| `/vibe convert-story [ID]` | **NEW** Convert BMAD story to Vibe feature spec |
| `/vibe context` | **NEW** Generate project-context.md for BMAD compat |

### BMAD Integration Commands

| Command | What it does |
|---------|--------------|
| `/vibe ux-design [ID]` | **NEW** Deep UX exploration (14-step BMAD workflow) |
| `/vibe research [type]` | **NEW** Market/domain/technical research |
| `/vibe party` | **NEW** Multi-agent discussion (BMAD Party Mode) |

### Spec-Driven Commands (OpenSpec-Inspired)

| Command | What it does |
|---------|--------------|
| `/vibe explore [topic]` | **NEW** Think through ideas without committing to structure |
| `/vibe validate [ID]` | **NEW** Validate feature spec completeness and consistency |
| `/vibe archive [ID]` | **NEW** Archive completed feature, merge deltas into specs |

### Utility Commands

| Command | What it does |
|---------|--------------|
| `/vibe debt [desc]` | Capture technical debt with triage |
| `/vibe review [scope]` | Multi-agent code review with fresh context |
| `/vibe status` | Show current progress |
| `/vibe retro` | Capture learnings, extract patterns |
| `/vibe check` | Validate project structure + template sync |
| `/vibe sync` | **NEW** Sync epics/features to GitHub Projects |
| `/vibe --help` | Show command reference |

---

## Context Loading (Before Any Work)

**Always read silently before starting.**

### Pre-loaded Context Strategy (Efficiency Optimization)

> Load all relevant files ONCE at phase start to avoid repeated reads during implementation.

**At the start of EACH phase, batch-read all files needed:**

```
PHASE START: Read in PARALLEL (single response, multiple Read tool calls)
├── Feature spec
├── Related domain spec
├── Role guidance file
├── Existing component (if extending)
├── Test file (to see current state)
└── Relevant pattern files

DURING PHASE: Reference from memory, don't re-read
```

**Phase-Specific Pre-load Lists:**

| Phase | Files to Pre-load (read in parallel) |
|-------|-------------------------------------|
| QA Engineer | Feature spec, QA role, testing guide, existing tests |
| Designer | Feature spec, Designer role, components.json, UX copy |
| Developer | Feature spec, Dev role, failing tests, target files, patterns |
| QA Validation | Test results, QA role, verification records |

**Anti-pattern:** Reading the same file 3+ times during a phase. Load once, reference from memory.

### WHY (Business Value)
- `{{paths.domain}}/vision.md` - Product vision
- `{{paths.domain}}/index.md` - Sprint overview
- Project config: `.claude/vibe.config.json`

### WHAT (What We're Building)
- `{{paths.domain}}/GLOSSARY.md` - Domain terms
- `{{paths.features}}/{area}/{ID}.md` - Feature spec
- `{{paths.domain}}/SCENARIO_FORMAT.md` - BDD format

### HOW (How We Build)
- `{{paths.architecture}}/_fundamentals/quick-reference.md` - Core decisions
- `{{paths.architecture}}/_fundamentals/responsibility.md` - Frontend vs backend
- `{{paths.architecture}}/_guides/testing.md` - Test patterns
- `{{paths.architecture}}/_anti-patterns/` - What NOT to do
- `~/.claude/vibe-ash-svelte/patterns/` - Reusable patterns

### Pattern Retrieval (RAG-Lite)

**Before implementation, query the pattern index:**

1. Read `~/.claude/vibe-ash-svelte/patterns/index.json`
2. Match feature requirements against pattern `triggers` and `problem_keywords`
3. Suggest relevant patterns by `reusability_score` (5+ = highly recommended)
4. Check `related` patterns for complementary solutions
5. Note `usage_stats.success_rate` for proven patterns

**Display suggested patterns:**
```
+---------------------------------------------------------------------+
|  RELEVANT PATTERNS FOUND                                             |
|                                                                      |
|  1. [BACKEND] AsyncResult Status Extraction (score: 6)               |
|     Triggers: assign_async, loading state                            |
|     Path: patterns/backend/async-result-extraction.md                |
|                                                                      |
|  2. [UX] Directional Screen Transitions (score: 5)                   |
|     Triggers: page transition, navigation animation                  |
|     Path: patterns/ux/directional-transitions.md                     |
|                                                                      |
|  [r] Read pattern  [s] Skip  [a] Apply all                           |
+---------------------------------------------------------------------+
```

---

## Specs vs Changes Architecture (OpenSpec-Inspired)

> Separate authoritative specifications from change proposals.

### Directory Structure

```
{project}/
├── .claude/
│   ├── specs/                    # Source of truth (what IS)
│   │   ├── domains/              # Domain specifications
│   │   │   ├── auth.md           # Auth domain spec
│   │   │   └── {domain}.md       # Other domains
│   │   ├── api.md                # API contracts
│   │   └── events.md             # Domain events
│   │
│   └── features/                 # Change proposals (what will CHANGE)
│       ├── active/               # In progress
│       │   └── AUTH-001/
│       │       ├── spec.md       # Feature specification
│       │       └── delta.md      # Changes to domain specs
│       │
│       └── archived/             # Completed features
│           └── AUTH-001/
```

### Delta Tracking

For features that modify existing domain behavior, create `delta.md`:

```markdown
## ADDED Requirements
### {Requirement Name}
The system SHALL {behavior}.

## MODIFIED Requirements
### {Requirement Name}
**Was:** {previous behavior}
**Now:** {new behavior}

## REMOVED Requirements
### {Requirement Name}
Removed because: {rationale}
```

See: `templates/features/DELTA-TEMPLATE.md` for full template

### Lifecycle

```
/vibe explore → Create spec → /vibe validate → /vibe [ID] → /vibe archive
       ↓              ↓              ↓              ↓              ↓
   Thinking    Draft spec      Check ready    Implement    Merge to specs
```

### When to Use Each Command

| Situation | Command |
|-----------|---------|
| New idea, unsure of scope | `/vibe explore` |
| Ready to formalize feature | Create spec in `features/active/` |
| Before starting implementation | `/vibe validate [ID]` |
| Implementation work | `/vibe [ID]` |
| Feature complete, ready to finalize | `/vibe archive [ID]` |

---

## Project Validation (REQUIRED - Session Start)

**Before ANY /vibe command, validate the project structure.**

### Required Structure

```
{project}/
├── .claude/
│   └── vibe.config.json          # REQUIRED - Project configuration
├── architecture/                  # REQUIRED - Technical decisions
│   ├── README.md
│   ├── _index.md
│   ├── _fundamentals/            # At least quick-reference.md
│   ├── _guides/                  # At least one guide
│   ├── _patterns/
│   ├── _anti-patterns/
│   └── _checklists/
└── docs/domain/                   # REQUIRED - Product specs
    ├── GLOSSARY.md
    ├── vision.md
    ├── index.md
    └── features/                  # At least one feature spec
```

### Validation Steps

1. **Read `.claude/vibe.config.json`**
   - If missing: HARD BLOCK. Ask user to create config.

2. **Check `architecture/` exists with required categories**
   - If missing: HARD BLOCK. Offer to scaffold from template.

3. **Check `docs/domain/` exists with required files**
   - If missing: HARD BLOCK. Offer to scaffold minimal domain structure.

### Scaffolding from Template

When scaffolding is needed, read files from:
`~/projects/vibe-ash-svelte-template/`

Copy directory structures, then customize based on vibe.config.json.

### Hard Block Message Format

When validation fails, display:

```
⚠️ VIBE FRAMEWORK: Project structure incomplete

Missing:
  ✗ architecture/_fundamentals/quick-reference.md
  ✗ docs/domain/GLOSSARY.md

Options:
  1. Scaffold from template (I'll create the missing files)
  2. Point me to existing docs (if they're in a different location)
  3. Skip validation (NOT RECOMMENDED - workflow may fail)

Which option?
```

### Session Tracking

After successful validation, note that validation passed for this session.
Do NOT re-validate on subsequent /vibe commands in the same conversation.

---

## Checkpoint Persistence (Session Continuity)

> Save implementation state to resume across sessions.

### Checkpoint Location

```
{project}/.claude/checkpoints/{FEATURE-ID}.json
```

### When to Save Checkpoint

Save checkpoint automatically:
- After each phase completes (QA, Designer, Developer scenarios)
- When encountering a blocker
- Before suggesting `/clear`
- At each CHECKPOINT prompt

### Checkpoint Save

```json
{
  "feature_id": "AUTH-001",
  "current_phase": "developer",
  "current_scenario": 2,
  "total_scenarios": 3,
  "phases_completed": {...},
  "files_modified": [...],
  "patterns_used": [...],
  "updated_at": "ISO-8601"
}
```

See: `templates/checkpoint-schema.json` for full schema

### Resume Flow

On `/vibe [FEATURE-ID]`, check for existing checkpoint:

```
+---------------------------------------------------------------------+
|  CHECKPOINT FOUND                                                    |
|                                                                      |
|  Feature: AUTH-001 - User Login                                      |
|  Last Phase: Developer (Scenario 2 of 3)                             |
|  Last Updated: 2026-01-20 11:15:00                                   |
|                                                                      |
|  Files Modified:                                                     |
|    - lib/accounts/resources/user.ex (created)                        |
|    - components/features/auth/LoginForm.svelte (created)             |
|                                                                      |
|  Tests: 4 passing, 1 failing                                         |
|  Patterns Used: async-result-extraction                              |
|                                                                      |
|  [r] Resume from checkpoint                                          |
|  [s] Start fresh (overwrites checkpoint)                             |
|  [v] View checkpoint details                                         |
+---------------------------------------------------------------------+
```

### Resume Actions by Phase

| Phase | Resume Action |
|-------|---------------|
| QA Test Gen | Re-display test stubs, proceed to Designer |
| Designer | Re-display handoff, proceed to Readiness Gate |
| Developer (mid) | Load scenario N, run test, continue TDD cycle |
| QA Validation | Re-run tests, recalculate quality score |

### Smart Resume (Enhanced Recovery)

When checkpoint has `smart_resume` data, use it for faster restoration:

**Resume Display:**
```
+---------------------------------------------------------------------+
|  SMART RESUME: AUTH-001                                              |
|                                                                      |
|  Last Working On:                                                    |
|    File: lib/accounts/resources/user.ex:45                          |
|    Action: modifying                                                 |
|                                                                      |
|  Failing Test:                                                       |
|    test/accounts/user_test.exs:78                                    |
|    "returns error for invalid credentials"                           |
|    Error: expected {:error, :invalid_credentials}, got {:ok, %User{}}|
|                                                                      |
|  Current Criterion:                                                  |
|    Scenario: User enters invalid credentials                         |
|    Status: implementing (THEN clause)                                |
|                                                                      |
|  Resume Hints:                                                       |
|    • Test failing at user_test.exs:78 - needs credential validation  |
|    • Pattern: Use Ash.Error for invalid credentials                  |
|                                                                      |
|  [r] Resume at exact position  [s] Resume at scenario start          |
|  [f] Resume from failing test  [v] View full checkpoint              |
+---------------------------------------------------------------------+
```

**Resume Options:**
| Option | What Happens | Best For |
|--------|--------------|----------|
| Exact position | Open file at line, show failing test | Quick continuation |
| Scenario start | Begin scenario from scratch | Context feels stale |
| Failing test | Run test, show output, continue | TDD focus |

**Saving Smart Resume Data:**
At each checkpoint, capture:
- Last file + line being edited
- Current failing test (if any)
- Acceptance criterion being worked on
- AI-generated hints for context restoration

### Checkpoint Cleanup

Delete checkpoint when:
- Feature completes successfully (PR created)
- User explicitly starts fresh
- Feature is abandoned (manual delete)

### Display in Status

```
Current Feature: AUTH-001
  Phase: Developer (Scenario 2 of 3)
  Checkpoint: .claude/checkpoints/AUTH-001.json (saved 5 min ago)
```

---

## Verification Requirements (MECHANICAL ENFORCEMENT)

> Every phase transition requires machine-verifiable proof, not just documentation.

### Verification Record Location

```
{project}/.claude/verification/{FEATURE-ID}/
├── qa-test-creation.json      # Proof test files were created
├── qa-test-execution.json     # Proof tests ran and FAILED (RED)
├── dev-scenario-1-pre.json    # Proof test failed before implementation
├── dev-scenario-1-post.json   # Proof test passed after implementation
└── qa-validation.json         # Final test execution proof
```

See: `templates/verification-record-schema.json` for full schema

### Phase 1 Exit Gate (QA Engineer)

**HARD BLOCK CONDITIONS** - Must produce verification records:

1. **Test File Creation Record** - AI verifies each test file exists:
   ```bash
   ls -la test/path/to/feature_test.exs
   wc -l test/path/to/feature_test.exs
   ```

2. **Test Execution Record (RED State)** - AI captures actual test output:
   ```bash
   mix test test/path/to/feature_test.exs 2>&1 | head -50
   ```

**GATE CHECK**: QA Phase cannot complete unless:
- [ ] `qa-test-creation.json` exists with files confirmed
- [ ] `qa-test-execution.json` shows failing tests (exit_code != 0)

### Phase 3 Exit Gate (Developer - Per Scenario)

For EACH scenario, must produce:
1. Pre-implementation Test Record (RED) - `test_counts.failing > 0`
2. Post-implementation Test Record (GREEN) - `test_counts.failing == 0`

**GATE CHECK**: Cannot proceed to next scenario unless both records exist.

### Phase 4 Exit Gate (QA Validation)

**GATE CHECK**: Cannot create PR unless:
- [ ] All `dev-scenario-N-pre.json` and `dev-scenario-N-post.json` exist
- [ ] `qa-validation.json` shows 0 failures
- [ ] All pitfall checks passed (see Project Pitfalls System)

### Display Format

After each gate verification:
```
+---------------------------------------------------------------------+
|  VERIFICATION GATE: [Phase] -> [Next Phase]                          |
|                                                                      |
|  Records Verified:                                                   |
|    [OK] qa-test-creation.json - 3 files, 5 tests                     |
|    [OK] qa-test-execution.json - 5 failing (RED confirmed)           |
|                                                                      |
|  Gate Status: PASSED                                                 |
+---------------------------------------------------------------------+
```

If gate fails:
```
+---------------------------------------------------------------------+
|  VERIFICATION GATE: [Phase] -> [Next Phase]                          |
|                                                                      |
|  Records Verified:                                                   |
|    [OK] qa-test-creation.json - 3 files, 5 tests                     |
|    [FAIL] qa-test-execution.json - MISSING                           |
|                                                                      |
|  Gate Status: BLOCKED                                                |
|                                                                      |
|  Action Required:                                                    |
|    Run tests and capture output before proceeding                    |
+---------------------------------------------------------------------+
```

---

## Practice Compliance Checkpoints

> Role practices are not fire-and-forget. Mid-phase checkpoints verify compliance.

### Developer Practice Compliance (After Each Scenario)

Run after each developer scenario completion, before proceeding to next:

<!-- AI:CHECKLIST dev_practice_compliance -->
```yaml
dev_practice_compliance:
  description: "Verify developer followed TDD and YAGNI practices"
  items:
    - id: micro_iteration
      description: Built in single-focus increments
      verification:
        type: manual
        prompt: "Did you implement ONE concern at a time?"
      severity: warning

    - id: yagni
      description: Only built what the test required
      verification:
        type: manual
        prompt: "Did you add any code NOT required by the current failing test?"
      severity: warning

    - id: pattern_compliance
      description: Used patterns from architecture docs
      verification:
        type: manual
        prompt: "No raw Tailwind colors, no hardcoded z-index, design tokens used?"
      severity: warning

    - id: test_driven
      description: Wrote code to make tests pass, not tests to validate code
      verification:
        type: manual
        prompt: "Was implementation driven by the failing test, not the other way around?"
      severity: warning
```
<!-- /AI:CHECKLIST -->

### QA Practice Compliance (End of QA Phase)

Run before exiting QA Test Generation phase:

<!-- AI:CHECKLIST qa_practice_compliance -->
```yaml
qa_practice_compliance:
  description: "Verify QA followed test-first practices"
  items:
    - id: aaa_pattern
      description: Tests follow Arrange-Act-Assert
      verification:
        type: manual
        prompt: "Do tests have clear setup, action, assertion sections?"
      severity: warning

    - id: ux_states_covered
      description: All 4 UX states have tests
      verification:
        type: manual
        prompt: "Are there tests for loading, error, empty, and success states?"
      severity: warning

    - id: scenario_coverage
      description: All acceptance scenarios have tests
      verification:
        type: manual
        prompt: "Does each Given/When/Then scenario have a corresponding test?"
      severity: warning

    - id: e2e_if_required
      description: E2E tests written if critical path
      verification:
        type: manual
        prompt: "If feature is auth/payment/realtime, are E2E tests written?"
      severity: blocker
      applies_to: ["auth features", "payment features", "realtime features"]
```
<!-- /AI:CHECKLIST -->

### Compliance Display Format

```
+---------------------------------------------------------------------+
|  PRACTICE COMPLIANCE: Developer (Scenario 1)                         |
|                                                                      |
|  [OK] micro_iteration - Built in single-focus increments             |
|  [OK] yagni - Only built what the test required                      |
|  [WARN] pattern_compliance - Review design token usage               |
|  [OK] test_driven - Implementation driven by failing test            |
|                                                                      |
|  Status: PASSED (1 warning)                                          |
+---------------------------------------------------------------------+
```

---

## Project Pitfalls System

> Learn from mistakes. Don't repeat them.

### Pitfalls Location

```
{project}/.claude/pitfalls.json
```

See: `templates/project-pitfalls-schema.json` for schema
See: `templates/pitfalls-example.json` for common pitfalls

### Integration Points

1. **Session Start** - Display relevant pitfalls for feature type
2. **Developer Checkpoints** - Run pitfall checks before each scenario completion
3. **QA Validation** - Run ALL pitfall checks (blocker = HARD BLOCK)
4. **Retro** - Prompt to capture new pitfalls discovered

### Pitfall Check Display

```
+---------------------------------------------------------------------+
|  PITFALL CHECK: Scenario 1 Complete                                  |
|                                                                      |
|  [OK] PIT-001: Component in app.js                                   |
|  [FAIL] PIT-002: Missing socket={@socket}                            |
|         Found in: lib/syna_web/live/chat_live.ex:15                  |
|                                                                      |
|  1 pitfall detected. Fix before proceeding.                          |
+---------------------------------------------------------------------+
```

### Severity Rules

| Severity | Enforcement |
|----------|-------------|
| blocker  | HARD BLOCK - Cannot proceed until fixed |
| warning  | Show warning, allow proceed with acknowledgment |
| suggestion | Show reminder, no block |

### Pitfall Counter Updates

When a pitfall check catches an issue:
- Increment `times_caught` in pitfalls.json
- Display in checkpoint: "Caught before it caused issues"

When a pitfall is discovered via human intervention (retro analysis):
- Increment `times_missed` in pitfalls.json
- Higher missed count = consider upgrading severity

### Session Start Pitfall Display

At the beginning of `/vibe [FEATURE-ID]`:

```
+---------------------------------------------------------------------+
|  RELEVANT PITFALLS FOR THIS FEATURE                                  |
|                                                                      |
|  Blockers to watch:                                                  |
|    PIT-001: Export new components in app.js                          |
|    PIT-002: Include socket={@socket} in LiveSvelte                   |
|                                                                      |
|  Warnings:                                                           |
|    PIT-003: Use design tokens, not raw colors                        |
|    PIT-005: Handle all 4 UX states                                   |
|                                                                      |
|  [c] Continue  [v] View all pitfalls                                 |
+---------------------------------------------------------------------+
```

---

## Template Sync (AI-Driven)

When user runs `/vibe check` or requests sync:

### Sync Process

1. **Read Template File**
   - Path: `~/projects/vibe-ash-svelte-template/architecture/{path}`
   - Read entire contents

2. **Read Project File**
   - Path: `{project}/architecture/{path}`
   - Read entire contents

3. **Compare & Explain**
   - Show what's different
   - Note any project-specific customizations that would be lost
   - Explain WHY template has certain content (if obvious)

4. **Offer Options**
   - Merge from template (overwrite project file)
   - Keep project version
   - Merge specific sections (AI identifies mergeable parts)

5. **Execute via Edit tool**
   - If user approves, use Edit tool to update project file
   - No external scripts needed

### Divergence Types

| Type | AI Action |
|------|-----------|
| Template has new section | Propose adding section to project |
| Project has custom section | Keep project version, note in report |
| Same section, different content | Show diff, let user decide |
| Project missing entire file | Propose copying from template |

---

## Phase Separators

Display when switching roles:

```
+======================================================================+
|  [ICON] [ROLE] PHASE                                                 |
|  [Context: Feature/Scenario/Task]                                    |
+======================================================================+
```

**Icons:**
- `QA` QA ENGINEER
- `DEV` DEVELOPER
- `DOM` DOMAIN ARCHITECT
- `UX` DESIGNER
- `PM` AGILE PM
- `REV` CODE REVIEWER
- `OPS` DEVOPS
- `RET` RETROSPECTIVE

---

## Task Implementation Workflow

**Trigger:** `/vibe [FEATURE-ID]`

### Phase 1: QA Engineer (Test-First Development)

```
+======================================================================+
|  QA ENGINEER PHASE - WRITING ACTUAL TESTS                            |
|  Feature: [ID] - [Title]                                             |
+======================================================================+
```

1. Load context (WHY + WHAT + HOW)
2. Load role: `~/.claude/vibe-ash-svelte/roles/qa-engineer.md`
3. Read feature spec: `{{paths.features}}/{area}/{ID}.md`
4. Extract acceptance scenarios (Given/When/Then)
5. **Check UX Test Requirements:**
   - [ ] Skeleton/loading state test
   - [ ] Error state test
   - [ ] Empty state test
   - [ ] Offline behavior test (if PWA)
   - [ ] Accessibility (aria-labels, focus management)
6. **WRITE ACTUAL TEST FILES** (TDD - Tests First):
   - Backend: Write ExUnit tests in `test/` directory
   - Frontend: Write Vitest tests in `assets/svelte/**/*.test.ts`
   - E2E (if required): Write Playwright tests in `assets/tests/e2e/`
   - **Tests MUST be executable and initially FAILING**
7. **RUN TESTS** to verify they fail (RED state):
   ```bash
   mix test test/path/to/feature_test.exs  # Backend
   cd assets && npm test -- --run           # Frontend
   cd assets && npx playwright test         # E2E
   ```
   Display test output showing failures
8. **Generate QA → Designer Handoff** (structured JSON)
   ```json
   {
     "feature_id": "[ID]",
     "scenarios": [...],
     "test_files_created": ["test/...", "assets/..."],
     "tests_failing": 5,
     "ux_requirements": { "loading": true, "error": true, "empty": true, "success": true },
     "e2e_required": true/false
   }
   ```
   See: `templates/handoffs/qa-to-designer.json` for full schema
9. **HARD BLOCK if no tests written** - Cannot proceed without executable tests
10. **CREATE VERIFICATION RECORDS**:
    - Create `qa-test-creation.json` with file paths and line counts
    - Create `qa-test-execution.json` with test output and failure count
    - Save to `{project}/.claude/verification/{FEATURE-ID}/`
11. **RUN PRACTICE COMPLIANCE** - Execute `qa_practice_compliance` checklist
12. **VERIFICATION GATE** - Display gate status, BLOCK if records missing or compliance fails
13. **CHECKPOINT** - Wait for Enter

### Phase 2: Designer (UX Verification)

```
+======================================================================+
|  DESIGNER PHASE                                                      |
|  Feature: [ID] - [Title]                                             |
+======================================================================+
```

1. Load role: `~/.claude/vibe-ash-svelte/roles/designer.md`
2. Load checklist: `~/.claude/vibe-ash-svelte/checklists/ux-pwa.md`
3. Verify UI requirements from feature spec
4. Confirm component selection (existing vs new)
5. Check UX requirements:
   - [ ] Offline behavior defined
   - [ ] Touch targets >= 44px
   - [ ] Loading/error/empty states specified
   - [ ] Haptic feedback points identified (if mobile)
6. **Generate Designer → Developer Handoff** (structured JSON)
   ```json
   {
     "feature_id": "[ID]",
     "components": [{"name": "...", "type": "new|existing|modify"}],
     "ui_states": ["loading", "error", "empty", "success"],
     "patterns_suggested": ["pattern-id-from-index"],
     "design_tokens": { "colors": [...], "spacing": [...], "motion": [...] }
   }
   ```
   See: `templates/handoffs/designer-to-developer.json` for full schema
7. **CHECKPOINT** - Wait for Enter

### Readiness Gate (HARD BLOCK)

**Before entering Developer phase, verify ALL conditions:**

```
+---------------------------------------------------------------------+
|  IMPLEMENTATION READINESS CHECK                                      |
|                                                                      |
|  Specification:                                                      |
|  □ All scenarios have Given/When/Then?                               |
|  □ UI states defined (loading/error/empty/success)?                  |
|  □ No open questions marked as BLOCKING?                             |
|                                                                      |
|  Technical:                                                          |
|  □ Dependencies available?                                           |
|  □ No blocking issues from other features?                           |
|                                                                      |
|  Environment:                                                        |
|  □ Tests can run?                                                    |
|  □ Dev server works?                                                 |
+---------------------------------------------------------------------+
```

**If ANY fail → HARD BLOCK:**
```
⚠️ Cannot start implementation.

Missing:
  ✗ [List specific missing items]

Options:
  [1] Fix now (go back to Designer phase)
  [2] Mark as known gap and proceed (NOT RECOMMENDED)
```

**Do NOT proceed to Developer phase until all checks pass.**

### Phase 3: Developer (TDD Implementation)

```
+======================================================================+
|  DEVELOPER PHASE - TDD CYCLE                                         |
|  Implementing: [ID] - [Scenario Name]                                |
+======================================================================+
```

For EACH scenario:
1. Load role: `~/.claude/vibe-ash-svelte/roles/developer.md`
2. **RUN TEST** - Execute the specific test file written in QA phase:
   ```bash
   mix test test/path/to/feature_test.exs --seed 0
   ```
   **Show RED failure output** - If test doesn't exist or doesn't fail, STOP.
3. Propose implementation approach
4. **Implement incrementally** (only what this scenario needs)
5. **UX Implementation Checklist:**
   - [ ] Touch targets >= 44px
   - [ ] No spinners (use skeleton loaders)
   - [ ] Safe area insets respected
   - [ ] Animation uses motion tokens
   - [ ] `prefers-reduced-motion` respected
6. **RUN TEST AGAIN** - Execute same test:
   ```bash
   mix test test/path/to/feature_test.exs --seed 0
   ```
   **Show GREEN pass output** - If test still fails, iterate on implementation
7. **RUN FULL TEST SUITE** to check for regressions:
   ```bash
   mix test
   ```

8. **UI VALIDATION LOOP** (if scenario involves frontend components):

   Read `ui_validation` config from project's `vibe.config.json`.
   If `ui_validation.enabled` is true and Svelte components were modified:

   **For EACH modified component:**

   a. **Generate validation states** from config:
      - Get component path from `ui_validation.components[name].path`
      - Get states from `ui_validation.components[name].states`
      - Get viewports from `ui_validation.viewports`

   b. **FOR EACH state** (loading, empty, error, success):

      i. **Create temp validation file** (AI creates, validates, deletes):
         ```html
         <!-- {project}/{ui_validation.temp_file.path} -->
         <!DOCTYPE html>
         <html>
         <head>
           <link rel="stylesheet" href="{ui_validation.temp_file.base_css}">
         </head>
         <body>
           <div id="app"></div>
           <script type="module">
             import Component from '{component.path}';
             new Component({
               target: document.getElementById('app'),
               props: {state_props}
             });
           </script>
         </body>
         </html>
         ```

      ii. **Parallel validation** (if `ui_validation.parallel.enabled`):
          Spawn agents for each viewport simultaneously

      iii. **MCP Browser inspection** - For each viewport, check:
           - Touch targets >= `rules.touch_target_min` (44px)
           - Button heights in `rules.button_heights` ([32, 40, 48])
           - Spacing on `rules.spacing_grid` (4px) grid
           - Primary action in `rules.primary_action_zone` (mobile only)
           - Focus visible on all interactives
           - No raw Tailwind colors (design tokens only)

      iv. **Collect results**

   c. **Delete temp file** (if `ui_validation.temp_file.cleanup`)

   d. **Display validation report:**
      ```
      +---------------------------------------------------------------------+
      |  UI VALIDATION: ComponentName                                        |
      |  States: 4 | Viewports: 2 | Checks: 8                                |
      +---------------------------------------------------------------------+
      |                                                                      |
      |              │ mobile (375x812)     │ desktop (1280x800)             |
      |  ───────────┼──────────────────────┼─────────────────────────────── |
      |  loading    │ [OK] 6/6 rules       │ [OK] 6/6 rules                 |
      |  empty      │ [OK] 6/6 rules       │ [OK] 6/6 rules                 |
      |  error      │ [FAIL] Touch target  │ [OK] 6/6 rules                 |
      |             │   Retry btn: 36px    │                                |
      |  success    │ [OK] 6/6 rules       │ [OK] 6/6 rules                 |
      |                                                                      |
      |  Status: BLOCKED (1 error)                                           |
      +---------------------------------------------------------------------+
      ```

   e. **IF validation fails:**

      - **Auto-fixable** (per `ui_validation.auto_fix`):
        - `spacing`: Round to nearest grid value → Apply fix, re-validate
        - `design_tokens`: Replace raw color → Apply fix, re-validate
        - `aria_labels`: Generate from context → Apply fix, re-validate

      - **Needs human decision** (or `auto_fix.layout: false`):
        ```
        +---------------------------------------------------------------------+
        |  UI VALIDATION BLOCKED                                               |
        |                                                                      |
        |  Issue: Touch target too small                                       |
        |  Component: ErrorState.svelte                                        |
        |  Element: <Button>Retry</Button>                                     |
        |  Current: 36x36px                                                    |
        |  Required: >= 44x44px                                                |
        |                                                                      |
        |  AI Assessment:                                                      |
        |    Button uses size="sm" (32px). Options:                            |
        |    1. Change to size="md" (40px) + padding                           |
        |    2. Add min-w-11 min-h-11 classes                                  |
        |                                                                      |
        |  [1-2] Apply suggested fix                                           |
        |  [f] Provide fix hint (describe what to do)                          |
        |  [s] Skip this rule (add exception)                                  |
        |  [m] I'll fix manually (pause validation)                            |
        |  [a] Abort scenario                                                  |
        +---------------------------------------------------------------------+
        ```

      - **If user chooses [s] Skip**, record exception:
        Save to `{project}/.claude/verification/{FEATURE-ID}/ui-exceptions.json`

   f. **Re-validate after fix** (loop back to step b.iii)

   g. **ALL PASS** → Continue to step 9

   **HARD BLOCK** (if `ui_validation.blocking: true`):
   Cannot proceed until all validation errors resolved or excepted.

9. **CREATE VERIFICATION RECORDS**:
    - Create `dev-scenario-{N}-pre.json` with pre-implementation test output
    - Create `dev-scenario-{N}-post.json` with post-implementation test output
    - Create `ui-validation-scenario-{N}.json` with UI validation results
    - Save to `{project}/.claude/verification/{FEATURE-ID}/`
10. **RUN PITFALL CHECKS** - Verify against project `pitfalls.json`
    - Display any caught pitfalls
    - BLOCK if blocker-severity pitfall detected
11. **RUN PRACTICE COMPLIANCE** - Execute `dev_practice_compliance` checklist
12. **VERIFICATION GATE** - Display gate status showing:
    - Pre/post records exist and show RED → GREEN transition
    - UI validation results (pass/fail/exceptions)
    - Pitfall check results
    - Practice compliance results
13. **CHECKPOINT** - Wait for Enter
    - Display: Tests before (X failing) → Tests after (all passing)
    - Display: UI Validation (X components, Y states validated)
    - For **bootstrap features**, show "Patterns Established" summary

**HARD BLOCK**: If tests don't pass, cannot proceed to next scenario.

**YAGNI Reminder**: If you're creating something the current scenario doesn't test, STOP.

Repeat for all scenarios.

### Phase 4: QA Validation

```
+======================================================================+
|  QA VALIDATION PHASE                                                 |
|  Running: Full test suite                                            |
+======================================================================+
```

1. **RUN ALL TESTS** - Execute complete test suites:
   ```bash
   # Backend tests
   mix test

   # Frontend tests
   cd assets && npm test -- --run

   # E2E tests (if applicable)
   cd assets && npx playwright test
   ```
   **Display actual test output** - Show pass/fail counts and any failures

2. **TEST COVERAGE REPORT**:
   ```bash
   mix test --cover
   cd assets && npm test -- --coverage --run
   ```
   Display coverage percentages for new code

3. **E2E Verification (MANDATORY for critical paths):**
   - [ ] Check if feature requires E2E (see QA role checklist)
   - [ ] If E2E required: tests exist in `assets/tests/e2e/`
   - [ ] If E2E required: run `npx playwright test` -> Show results
   - [ ] E2E covers: login/logout, cross-page nav, real-time, payments

4. **Run quality checks**:
   ```bash
   just check  # Format + Credo + Dialyzer + Sobelow
   cd assets && npm run verify  # Lint + type check
   ```
   Show results

5. **UX Verification:**
   - [ ] Component lint passes
   - [ ] No raw colors (design tokens only)
   - [ ] No hardcoded z-index
   - [ ] PWA manifest valid (if PWA)

6. **FULL UI VALIDATION** (all feature components, all states, all viewports):

   If `ui_validation.enabled` in `vibe.config.json`:

   a. **Gather all components** modified in this feature

   b. **Run comprehensive validation:**
      - All components × all states × all viewports
      - Use parallel agents (up to `ui_validation.parallel.max_agents`)

   c. **Display comprehensive report:**
      ```
      +---------------------------------------------------------------------+
      |  FULL UI VALIDATION: Feature [FEATURE-ID]                            |
      |                                                                      |
      |  Components: 3 | States: 4 | Viewports: 2 | Total: 24 checks         |
      +---------------------------------------------------------------------+
      |                                                                      |
      |  LoginForm.svelte                                                    |
      |    loading   │ mobile: [OK]  │ desktop: [OK]                         |
      |    error     │ mobile: [OK]  │ desktop: [OK]                         |
      |    success   │ mobile: [OK]  │ desktop: [OK]                         |
      |                                                                      |
      |  PasswordInput.svelte                                                |
      |    default   │ mobile: [OK]  │ desktop: [OK]                         |
      |    error     │ mobile: [OK]  │ desktop: [OK]                         |
      |    focused   │ mobile: [OK]  │ desktop: [OK]                         |
      |                                                                      |
      |  ForgotPassword.svelte                                               |
      |    loading   │ mobile: [WARN] │ desktop: [OK]                        |
      |              │ spacing: 5px   │                                      |
      |    empty     │ mobile: [OK]   │ desktop: [OK]                        |
      |    success   │ mobile: [OK]   │ desktop: [OK]                        |
      |                                                                      |
      |  Summary: 23/24 passed, 1 warning, 0 errors                          |
      |  Exceptions: 0 (none from Developer phase)                           |
      |                                                                      |
      |  Status: PASS (with warnings)                                        |
      +---------------------------------------------------------------------+
      ```

   d. **Include exceptions report** (from Developer phase):
      - List any rules skipped with `[s]` during development
      - These will be flagged in PR description

   e. **HARD BLOCK** if any errors (warnings allowed to proceed)

   f. **Add to verification records:**
      - Create `ui-validation-final.json` with full results
      - Include in QA validation summary

7. **HARD BLOCK CONDITIONS** (Cannot proceed if ANY fail):
   - [ ] All tests pass (0 failures)
   - [ ] No new test files were deleted or skipped
   - [ ] Coverage on new code >= 80%
   - [ ] `just check` passes
   - [ ] UI validation passes (no errors, warnings allowed)

8. **Calculate Implementation Quality Score** (see `qa-engineer.md`)
   - Score each category (0-5): Test Coverage, Pattern Compliance, UX States, Accessibility, Error Handling, Code Clarity, Performance
   - **NEW:** Include UI validation score (errors: -1, warnings: -0.25)
   - Apply weights and calculate total
   - Display score report with recommendations
   - **BLOCK if score < 3.0** - return to Developer phase

9. **FINAL PITFALL CHECK** - Run ALL pitfall checks:
   - Load `{project}/.claude/pitfalls.json`
   - Execute all checks regardless of `applies_to`
   - **HARD BLOCK** if any blocker-severity pitfall fails
   - Display full pitfall report

10. **VERIFY ALL RECORDS EXIST** - Check verification records:
    - [ ] `qa-test-creation.json` exists
    - [ ] `qa-test-execution.json` exists
    - [ ] All `dev-scenario-N-pre.json` exist for each scenario
    - [ ] All `dev-scenario-N-post.json` exist for each scenario
    - [ ] All `ui-validation-scenario-N.json` exist for each scenario
    - [ ] `ui-validation-final.json` exists
    - **BLOCK if any records missing**

11. **CREATE FINAL VERIFICATION RECORD**:
    - Create `qa-validation.json` with final test results
    - Include quality score, pitfall check summary, and UI validation summary

12. **VERIFICATION GATE** - Display final gate status:
    ```
    +---------------------------------------------------------------------+
    |  FINAL VERIFICATION GATE: QA Validation -> PR                        |
    |                                                                      |
    |  Verification Records: [OK] 10/10 records present                    |
    |  Pitfall Checks: [OK] 6 passed, 0 failed                             |
    |  Quality Score: 4.2/5.0 [OK]                                         |
    |  Test Results: [OK] 12 passing, 0 failing                            |
    |  UI Validation: [OK] 24/24 checks passed (1 warning)                 |
    |  UI Exceptions: 0                                                    |
    |                                                                      |
    |  Gate Status: PASSED - Ready for PR                                  |
    +---------------------------------------------------------------------+
    ```

13. If gate passes -> Offer to create PR
14. **CHECKPOINT** - Wait for Enter
15. Create PR with scenario checklist + quality score + test results + UI validation summary
16. Offer post-completion options:
    ```
    Feature implementation complete!

    Tests: X passing, 0 failing
    Coverage: XX% (new code)
    Quality Score: X.X/5.0

    [p] Create PR
    [a] Archive feature (merge deltas to specs)
    [r] Quick retro (extract patterns)
    [c] Continue (skip all)
    ```

**E2E HARD BLOCK:** If feature is a critical path (auth, payment, real-time) and E2E tests don't exist or fail, do NOT proceed to PR. Go back and add E2E tests.

---

## Parallel Implementation Workflow (Optional)

> For features with well-defined contracts, backend and frontend can be implemented simultaneously.

**Trigger:** `/vibe parallel [FEATURE-ID]`

---

### Agent Context Management Best Practices

> Spawned agents are NOT inside your context. Design prompts carefully.

**Key Insight:** When you spawn an agent with `Task()`, it starts fresh. It doesn't see:
- Prior conversation history
- Files you've already read
- Decisions you've made

**Context Loading Strategy by Agent Type:**

| Agent | Model | Context Priority | Budget |
|-------|-------|------------------|--------|
| Backend | opus | Contract → Role → Domain spec | ~40k tokens |
| Frontend | sonnet | Contract (UI) → Role → Tokens | ~30k tokens |
| Integration | opus | Contract → Role → Both impls | ~50k tokens |

**Prompt Structure for Agent Spawning:**

```
1. IDENTITY: "You are the [Role] Agent for [FEATURE-ID]"

2. CONTEXT (inline or paths):
   - Contract (critical sections only)
   - Role file (key sections)
   - Domain-specific context

3. TASK:
   - Specific acceptance criteria
   - File ownership boundaries
   - Progress file location

4. START COMMAND: "START WORK."
```

**Anti-Patterns:**
- ❌ Spawning with "implement this feature" - too vague
- ❌ Loading all architecture docs - wastes context
- ❌ Not specifying progress file - loses visibility
- ❌ Including full conversation history - unnecessary

**Good Pattern:**
```typescript
Task({
  model: "opus",
  run_in_background: true,
  prompt: `
You are the Backend Agent for AUTH-001.

CONTRACT (key sections):
${JSON.stringify(contract.api_contract, null, 2)}

ROLE SUMMARY:
- Own lib/accounts/, test/accounts/
- Write tests first (TDD)
- Match contract exactly

YOUR CRITERIA:
- AC-1: Valid credentials return user
- AC-2: Invalid credentials return error

PROGRESS FILE: .claude/progress/AUTH-001/backend.json

START WORK.
`
});
```

---

### When to Use Parallel Mode

| Use Parallel When | Use Sequential When |
|-------------------|---------------------|
| Feature has clear API contract | Contract is unclear or evolving |
| Backend/frontend are independent | Tight coupling between layers |
| Medium+ complexity (5+ scenarios) | Simple features (< 5 scenarios) |
| Time-sensitive delivery | Quality is primary concern |

### Parallel Workflow Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 0: CONTRACT DEFINITION (~5 min)                              │
│  /vibe contract AUTH-001                                            │
│                                                                     │
│  Output: .claude/contracts/AUTH-001.json (LOCKED)                   │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 1: PARALLEL IMPLEMENTATION                                   │
│                                                                     │
│  ┌─────────────────────┐       ┌─────────────────────┐              │
│  │  BACKEND STREAM     │       │  FRONTEND STREAM    │              │
│  │                     │       │                     │              │
│  │  Role: backend-agent│       │  Role: frontend-agent              │
│  │  Tests: unit        │       │  Tests: component   │              │
│  │  Mocks: none        │       │  Mocks: backend     │              │
│  │                     │       │                     │              │
│  │  Owns:              │       │  Owns:              │              │
│  │  - lib/{domain}/    │       │  - assets/svelte/   │              │
│  │  - test/{domain}/   │       │  - *.test.ts        │              │
│  └──────────┬──────────┘       └──────────┬──────────┘              │
│             │                             │                         │
│             └──────────────┬──────────────┘                         │
│                            ▼                                        │
│             ┌──────────────────────────────┐                        │
│             │  SYNC POINT VERIFICATION     │                        │
│             │  Both streams must complete  │                        │
│             │  Contract compliance check   │                        │
│             └──────────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 2: INTEGRATION (~5 min)                                      │
│                                                                     │
│  Role: integration-agent                                            │
│  - Wire frontend to backend (remove mocks)                          │
│  - Create LiveView handlers                                         │
│  - Run integration tests                                            │
│  - Run E2E tests                                                    │
│  - UI validation (full system)                                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 3: FINAL VALIDATION (~2 min)                                 │
│                                                                     │
│  - Quality score calculation                                        │
│  - All tests passing                                                │
│  - PR creation                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Phase 0: Contract Definition

**Pre-requisite:** Feature spec must exist with acceptance scenarios.

1. Run `/vibe contract [FEATURE-ID]`
2. Generate interface contract from feature spec
3. Review and approve contract
4. Lock contract: `contract.locked = true`

**Contract defines:**
- API actions with exact signatures
- Data shapes (types)
- UI components with props/states
- Acceptance criteria per stream
- Mock data for isolated testing
- File ownership boundaries

**HARD BLOCK:** Cannot start parallel implementation without locked contract.

### Phase 1: Parallel Streams

**Agent Spawning Configuration:**

| Stream | Model | Rationale |
|--------|-------|-----------|
| Backend | `opus` | Complex business logic requires deep reasoning |
| Frontend | `sonnet` | UI patterns are well-defined, speed matters |
| Integration | `opus` | Careful wiring needs deep understanding |

**Spawn two agents simultaneously:**

```typescript
// Orchestrator spawns with minimal, focused context
const backendAgent = Task({
  subagent_type: "general-purpose",
  model: "opus",
  run_in_background: true,
  prompt: `
You are the Backend Agent for ${featureId}.

CONTEXT:
1. Contract: ${contractJson}
2. Role: ${backendAgentRole}
3. Domain spec: ${domainSpec}

Criteria: ${backendCriteria.join(', ')}
File ownership: lib/${domain}/, test/${domain}/

Report progress to: .claude/progress/${featureId}/backend.json
START WORK.
`
});

const frontendAgent = Task({
  subagent_type: "general-purpose",
  model: "sonnet",  // Faster for UI work
  run_in_background: true,
  prompt: `
You are the Frontend Agent for ${featureId}.

CONTEXT:
1. Contract (ui_contract + mock_data): ${uiContractJson}
2. Role: ${frontendAgentRole}
3. Design tokens: ${designTokens}

Criteria: ${frontendCriteria.join(', ')}
File ownership: assets/svelte/

Report progress to: .claude/progress/${featureId}/frontend.json
START WORK.
`
});
```

**Display:**
```
+======================================================================+
|  PARALLEL IMPLEMENTATION                                             |
|  Feature: AUTH-001 - User Login                                      |
|  Contract: v1 (locked)                                               |
+======================================================================+

Starting parallel streams...

┌─ Backend Stream ───────────────────┐ ┌─ Frontend Stream ──────────────────┐
│ Agent: backend-agent-abc123        │ │ Agent: frontend-agent-def456       │
│ Model: opus                        │ │ Model: sonnet                      │
│ Role: roles/backend-agent.md       │ │ Role: roles/frontend-agent.md      │
│ Criteria: AC-1, AC-2               │ │ Criteria: AC-3, AC-4               │
│ Status: in_progress                │ │ Status: in_progress                │
└────────────────────────────────────┘ └────────────────────────────────────┘
```

---

### Orchestrator Monitoring Loop

> The orchestrator doesn't wait blindly - it actively monitors agent progress.

**Progress Files:**
```
.claude/progress/{FEATURE-ID}/
├── backend.json    # Updated by backend agent
├── frontend.json   # Updated by frontend agent
└── integration.json # Updated by integration agent (Phase 2)
```

**Polling Behavior:**

```
WHILE agents running:
  1. Read progress files (every 30-60 seconds)
  2. Parse status from each stream
  3. Update consolidated display
  4. Check for blockers
  5. Handle stale agents (no update in 3+ minutes)

  IF blocker detected:
    - Display blocker details
    - Offer intervention options

  IF agent stale:
    - Check agent output file
    - Determine if stuck or still processing
    - Alert user if truly stuck
```

**Consolidated Progress Display (Updated Regularly):**
```
┌─ Backend Stream ───────────────────┐ ┌─ Frontend Stream ──────────────────┐
│ [===========         ] 50%         │ │ [================   ] 75%          │
│ Criteria: 1/2 complete             │ │ Criteria: 2/2 complete             │
│ Tests: 3 passing, 2 failing        │ │ Tests: 8 passing, 0 failing        │
│ Current: implementing AC-2         │ │ Current: WAITING AT SYNC POINT     │
│ Last update: 30s ago               │ │ Last update: 10s ago               │
└────────────────────────────────────┘ └────────────────────────────────────┘

Recent activity:
  [10:15:30] Backend: Created authenticate_test.exs
  [10:15:45] Frontend: LoginForm.svelte passing all tests
  [10:16:00] Backend: Running tests (3 pass, 2 fail)
```

**Blocker Detection:**
```
┌─ BLOCKER DETECTED ──────────────────────────────────────────────────────┐
│                                                                         │
│  Stream: backend                                                        │
│  Issue: test_failure                                                    │
│  Description: authenticate action returns wrong error code              │
│  Severity: blocking                                                     │
│                                                                         │
│  Agent hint: Need to map Ash.Error to contract error code               │
│                                                                         │
│  [c] Continue monitoring  [i] Intervene  [a] Abort stream               │
└─────────────────────────────────────────────────────────────────────────┘
```

**Stale Agent Detection:**
```
┌─ STALE AGENT WARNING ───────────────────────────────────────────────────┐
│                                                                         │
│  Stream: frontend                                                       │
│  Last update: 4 minutes ago                                             │
│  Last action: "Writing LoginForm.test.ts"                               │
│                                                                         │
│  Checking agent status...                                               │
│                                                                         │
│  [w] Wait longer  [c] Check output  [r] Resume agent  [k] Kill agent    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

**File Locking:**
- Create lock file: `.claude/locks/{FEATURE-ID}.json`
- Each stream owns exclusive paths
- Attempting to modify another stream's files = HARD BLOCK

### Sync Point

When both streams signal complete:

```
+---------------------------------------------------------------------+
|  SYNC POINT: Parallel Streams Complete                               |
|                                                                      |
|  Backend Stream:                                                     |
|    Status: COMPLETE                                                  |
|    Criteria: 2/2 passed (AC-1, AC-2)                                 |
|    Tests: 5 passing, 0 failing                                       |
|                                                                      |
|  Frontend Stream:                                                    |
|    Status: COMPLETE                                                  |
|    Criteria: 2/2 passed (AC-3, AC-4)                                 |
|    Tests: 8 passing, 0 failing                                       |
|    UI Validation: 6/6 passed                                         |
|                                                                      |
|  Contract Compliance:                                                |
|    [OK] Backend actions match signatures                             |
|    [OK] Frontend components match props                              |
|    [OK] Data shapes compatible                                       |
|                                                                      |
|  Status: PASSED - Ready for Integration                              |
+---------------------------------------------------------------------+
```

**If sync point fails:**
- Identify blocking stream
- Display specific compliance issues
- Allow stream to resume and fix

### Contract Changes During Parallel

If a stream discovers the contract needs modification:

**Minor Changes (auto-approve):**
- Adding optional fields
- Adding new error codes
- Adding accessibility improvements

```
+---------------------------------------------------------------------+
|  CONTRACT CHANGE: AUTO-APPROVED                                      |
|                                                                      |
|  Change: Add 'too_many_attempts' error code                          |
|  Requested by: backend                                               |
|  Impact: Frontend may show new error (minor)                         |
|                                                                      |
|  Status: Applied to contract v2                                      |
|  Affected stream: frontend (notified)                                |
+---------------------------------------------------------------------+
```

**Breaking Changes (require approval):**
- Changing action signatures
- Removing fields
- Changing required props

```
+---------------------------------------------------------------------+
|  CONTRACT CHANGE: REQUIRES APPROVAL                                  |
|                                                                      |
|  Change: Add required 'userId' prop to LoginForm                     |
|  Requested by: frontend                                              |
|  Breaking reason: Integration must now pass userId                   |
|                                                                      |
|  Impact Analysis:                                                    |
|    Backend: none                                                     |
|    Frontend: already implemented                                     |
|    Integration: must update LiveView to pass prop                    |
|                                                                      |
|  [a] Approve  [r] Reject  [d] Discuss                                |
+---------------------------------------------------------------------+
```

### Phase 2: Integration

After sync point passes, run integration agent:

```
+======================================================================+
|  INTEGRATION PHASE                                                   |
|  Feature: AUTH-001 - User Login                                      |
+======================================================================+
```

Integration agent:
1. Loads both stream implementations
2. Creates LiveView handlers (shared paths)
3. Wires frontend to backend (removes mocks)
4. Runs integration tests (AC-5)
5. Runs E2E tests (E2E-1)
6. Full UI validation

### Configuration Options

In `vibe.config.json`:

```json
{
  "parallel_agents": {
    "enabled": true,
    "mode": "quality",
    "auto_approve_minor_changes": true,
    "require_human_for_breaking": true,
    "max_parallel_agents": 4,
    "lock_timeout_minutes": 120
  }
}
```

| Mode | Description |
|------|-------------|
| `quality` | Strict contract verification, full UI validation |
| `balanced` | Standard verification, essential UI validation |
| `speed` | Advisory warnings only, minimal validation |

---

## Checkpoint Template

After each phase:

```
+---------------------------------------------------------------------+
|  [PHASE NAME] COMPLETE                                              |
|                                                                     |
|  [Summary of what was done]                                         |
|  * Item 1                                                           |
|  * Item 2                                                           |
|                                                                     |
|  Next: [What's coming]                                              |
|                                                                     |
|  Press Enter to continue...                                         |
+---------------------------------------------------------------------+
```

**ALWAYS wait for user input. Never auto-continue.**

---

## Context Management

### When to Clear Context

Use `/clear` to reset context and prevent degradation:

| Trigger | Action |
|---------|--------|
| After completing a feature | `/clear` before starting next feature |
| After sprint planning | `/clear` before implementation begins |
| Context feels "stale" | `/clear` and re-load relevant docs |
| After long debugging session | `/clear` to reset focus |

### Feature Completion Checkpoint

After QA Validation phase passes, show:

```
+---------------------------------------------------------------------+
|  FEATURE COMPLETE: [ID]                                              |
|                                                                      |
|  Ready for: PR creation / Next feature                               |
|                                                                      |
|  RECOMMENDED: Run /clear before starting next feature                |
|  (Prevents context degradation across features)                      |
|                                                                      |
|  [p] Create PR  [n] Next feature  [c] Clear & continue               |
+---------------------------------------------------------------------+
```

---

## AI Optimization Guidelines

> You are an AI assistant. Use these guidelines to make optimal decisions automatically.

### Background Tooling (Immediate Efficiency Gain)

Run non-blocking operations in background while continuing work:

```
CURRENT (SLOW):
Write code → Run tests → Wait → See results → Continue
                        ↑ dead time

OPTIMIZED (FAST):
Write code → Run tests (background) → Continue working
                   ↓
            Results appear when ready, interrupt if failure
```

**When to use background execution:**

| Operation | Use Background | Rationale |
|-----------|----------------|-----------|
| `mix test` (full suite) | YES | Long-running, continue other work |
| `mix test path/to/file.exs` | NO | Quick, need immediate feedback |
| `npm run verify` | YES | Lint/type checks can run while coding |
| `just check` | YES | Quality checks run in parallel |
| `mix compile` | YES | Continue reading/planning while compiling |

**Implementation:**

```bash
# Background test run (Developer phase)
mix test --seed 0 &  # Run in background
# ... continue with other work ...
# Check results when needed
```

**In Task agents, use `run_in_background: true` for:**
- Full test suite runs
- Lint/format/type checks
- Build commands
- E2E test runs (long-running)

**IMPORTANT:** Always check background task results before:
- Moving to next scenario
- Creating PR
- Completing phase

### Task Type Detection (Auto-Detect Quick vs Full)

Before starting any `/vibe` command, assess the task type:

| Task Type | Indicators | Workflow |
|-----------|------------|----------|
| **Hotfix/Typo** | "urgent", "typo", "copy fix", single file | Skip to implementation (no phases) |
| **Bug Fix** | "bug", "fix", existing behavior, 2-3 files | `/vibe quick` (condensed 2-phase) |
| **Small Feature** | Single scenario, one component | Full workflow (4 phases) |
| **Standard Feature** | Multiple scenarios, new component | Full workflow (4 phases) |
| **Architectural** | New domain, cross-cutting concern | Full workflow + extra validation |

**When auto-detecting, confirm with user:**
```
This looks like a [bug fix]. Use quick workflow? [Y/n]
```

### When to Parallelize (Spawn Task Agents)

**DO parallelize when:**
- Task involves 3+ independent concerns (research, tests, review)
- Context would exceed ~50% capacity doing it sequentially
- User explicitly asks for speed
- Scope is discovery, review, or planning (not implementation)

**DON'T parallelize when:**
- Task is simple (single file, bug fix)
- Results depend on each other (sequential by nature)
- User prefers detailed step-by-step visibility

### Parallel Tool Calls (Built-in Optimization)

Claude Code automatically batches independent tool calls. Maximize this by:

**DO parallelize these operations:**
```
# Instead of sequential:
Read file A → Read file B → Read file C

# Do parallel (single response with multiple tool calls):
[Read file A] [Read file B] [Read file C]  # All in one response
```

**File Operations to Parallelize:**
| Operation | Parallel? | Example |
|-----------|-----------|---------|
| Read multiple files | YES | Feature spec + domain spec + test file |
| Read + Write different files | YES | Read config while writing component |
| Multiple Grep searches | YES | Search for imports + search for usages |
| Independent edits | YES | Edit component + edit test (different files) |
| Sequential edits (same file) | NO | Must wait for first edit to complete |

**Phase-Specific Parallel Opportunities:**

| Phase | What to Parallelize |
|-------|---------------------|
| Context Loading | Read all relevant files (feature spec, domain, architecture) at once |
| QA Test Gen | Write unit test file + integration test file simultaneously |
| Developer | Read implementation file + test file + pattern file together |
| QA Validation | Run `mix test` + `npm test` + `npm run verify` in parallel |

### Parallelization Points

| Phase | Parallel Strategy |
|-------|------------------|
| `/vibe discover` | 3 agents: industry patterns, component audit, related features |
| `/vibe plan` (multi-feature) | 1 agent per feature (up to 3 concurrent) |
| QA Test Generation | 3 agents: unit tests, integration tests, e2e scenarios |
| `/vibe review` | 3 agents: security, performance, pattern compliance |
| Dev Implementation | Sequential (dependencies matter) |
| Retro | Sequential (synthesis requires full context) |

### When to Use Agents vs Direct Execution

| Scenario | Use Task Agent | Use Direct Tool |
|----------|----------------|-----------------|
| Research/exploration | Explore agent | - |
| Code search (known location) | - | Grep/Glob |
| Multi-file implementation | Plan agent | - |
| Single file edit | - | Edit tool |
| Test generation (multiple types) | Multiple agents | - |
| Test generation (single type) | - | Direct write |

### Context Efficiency

- Read files only once, then reference from memory
- Use Explore agent for codebase questions (fresher context)
- Batch related edits in single phase
- Don't re-read architecture docs if already loaded this session

---

## Context Load Monitoring

> Track and display context usage to optimize /clear timing.

### Context Load by Phase

| Phase | Typical Load | Primary Files |
|-------|-------------|---------------|
| QA Engineer | ~15% | Feature spec, QA role, test guide |
| Designer | ~20% | Feature spec, Designer role, checklists, wireframe patterns |
| Developer | ~35% | Feature spec, Dev role, patterns, architecture refs |
| QA Validation | ~25% | Test results, QA role, quality checklist |
| Retro | ~20% | Learnings, pattern index, implementation files |

### Context Indicators

Display with `/vibe status`:

| Indicator | Load % | Meaning |
|-----------|--------|---------|
| `[LIGHT]` | 0-25% | Plenty of room |
| `[MODERATE]` | 26-50% | Normal operation |
| `[HEAVY]` | 51-75% | Consider clearing before next feature |
| `[CRITICAL]` | 76-100% | Clear after current task |

### Automatic /clear Recommendations

Display `/clear` suggestion when:

| Condition | Recommendation |
|-----------|----------------|
| After completing feature | **Always** - "Run /clear before starting next feature" |
| Before different feature type | **Suggest** - "Different feature type, /clear recommended" |
| After 3+ iterations on same issue | **Suggest** - "Multiple iterations, context may be stale" |
| Load indicator is CRITICAL | **Warn** - "Context load critical, /clear after this task" |
| After sprint planning | **Always** - "Planning complete, /clear before implementation" |

### Context Load Estimation

Estimate context load based on files read this session:

```
Base Load:
  + Role file loaded: +5%
  + Feature spec read: +3%
  + Architecture doc: +2-5% (varies by size)
  + Pattern file: +2%
  + Code file read: +1-3%

Multipliers:
  × File re-reads: × 0.5 (cached)
  × Large files (>500 lines): × 1.5
```

### Display Format (in checkpoints)

```
+---------------------------------------------------------------------+
|  [PHASE] COMPLETE                                                    |
|                                                                      |
|  Context Load: [MODERATE] ~35%                                       |
|  Files loaded this session: 12                                       |
|                                                                      |
|  [Summary of what was done]                                          |
|                                                                      |
|  Next: [What's coming]                                               |
|                                                                      |
|  Press Enter to continue...                                          |
+---------------------------------------------------------------------+
```

### When to Recommend Context Clear

Suggest `/clear` when:
- Switching from one feature to another
- Context feels "stale" (AI repeating itself, missing obvious things)
- After sprint planning (before implementation)
- After long debugging session (>30 min on single issue)

---

## Sprint Planning Workflow

**Trigger:** `/vibe plan [sprint]`

### Phase 0: Load Context
- Read all feature specs
- Read vision, glossary, design system

### Phase 1: Domain Architect

```
+======================================================================+
|  DOMAIN ARCHITECT PHASE                                              |
|  Feature: [ID] - [Title]                                             |
+======================================================================+
```

- Load role: `~/.claude/vibe-ash-svelte/roles/domain-architect.md`
- Define/refine BDD scenarios
- **Identify Bootstrap Patterns** for early features
- **CHECKPOINT** after each feature

### Phase 2: Designer

```
+======================================================================+
|  DESIGNER PHASE                                                      |
|  Feature: [ID] - [Title]                                             |
+======================================================================+
```

- Load role: `~/.claude/vibe-ash-svelte/roles/designer.md`
- Create wireframes
- Define states (loading, error, empty)
- **CHECKPOINT** after each feature

### Phase 3: Agile PM

```
+======================================================================+
|  AGILE PM PHASE                                                      |
|  Sprint: [Name]                                                      |
+======================================================================+
```

- Load role: `~/.claude/vibe-ash-svelte/roles/agile-pm.md`
- Review completeness
- Create GitHub issues
- **CHECKPOINT** before creating issues

---

## Retrospective Workflow

**Trigger:** `/vibe retro` or automatic at end of task

```
+======================================================================+
|  RETROSPECTIVE                                                       |
|  Session: [Feature ID] Implementation                                |
+======================================================================+
```

### Step 1: Gather Feedback

```
+---------------------------------------------------------------------+
|  What went well?                                                    |
|  * [AI summarizes smooth parts]                                     |
|                                                                     |
|  What was friction?                                                 |
|  * [AI identifies where user intervened]                            |
|                                                                     |
|  Anything missing from docs?                                        |
|  * [AI notes gaps encountered]                                      |
|                                                                     |
|  Your feedback: _______________                                     |
+---------------------------------------------------------------------+
```

### Step 2: Pattern Analysis

AI scans implementation for potential reusable patterns:

```
+---------------------------------------------------------------------+
|  POTENTIAL REUSABLE PATTERNS DETECTED                               |
|                                                                     |
|  1. [BACKEND] Pattern name                                          |
|     File: path/to/file.ext:line                                     |
|     Reusability: HIGH/MEDIUM                                        |
|     Suggested: patterns/backend/pattern-name.md                     |
|                                                                     |
|  2. [FRONTEND] Pattern name                                         |
|     File: path/to/file.ext:line                                     |
|     Reusability: MEDIUM                                             |
|     Suggested: patterns/frontend/pattern-name.md                    |
|                                                                     |
|  Select patterns to promote: [1,2] [a]ll [n]one [e]dit              |
+---------------------------------------------------------------------+
```

### Step 3: Apply & Log

If approved:
1. Apply doc improvements to target files
2. Extract selected patterns to `~/.claude/vibe-ash-svelte/patterns/`
3. Append session summary to `.claude/learnings.md`
4. Commit changes to vibe-ash-svelte repo

---

## Feature Discovery Workflow

**Trigger:** `/vibe discover [FEATURE-ID]`

```
+======================================================================+
|  DISC DISCOVERY PHASE                                                |
|  Feature: [ID]                                                       |
+======================================================================+
```

### Purpose

Lightweight pre-planning for a single feature:
- Research requirements and industry patterns
- Create wireframes (mobile-first)
- Draft scenarios (marked as DRAFT, not finalized)
- Identify risks and unknowns
- Output: Discovery document

**Does NOT create GitHub issues** (use `/vibe plan` for that).

### Phases

1. **Context Loading** - Read vision, glossary, check existing spec
2. **Research** - Industry patterns, user journey, component audit
3. **Wireframe** - Draft UI/UX with states (loading/error/empty/success)
4. **Draft Scenarios** - Given/When/Then (Domain Architect lens)
5. **Risk Identification** - Technical risks, unknowns, dependencies
6. **Document** - Generate discovery spec at `{{paths.features}}/{area}/{ID}.md`

**CHECKPOINT after each phase. Never auto-continue.**

Load command: `~/.claude/vibe-ash-svelte/prompts/commands/discover.md`

---

## Technical Debt Workflow

**Trigger:** `/vibe debt [description]` or AI-detected during development

```
+======================================================================+
|  DEBT TECHNICAL DEBT CAPTURE                                         |
|  Context: [Current Feature] - [Current Phase]                        |
+======================================================================+
```

### Purpose

Capture technical debt or out-of-scope items with user decision on priority.

### Workflow

1. **Capture** - Description, category, effort, context
2. **User Decision** (CHECKPOINT):
   - `now` - Pause current work, address immediately
   - `later` - Add to sprint, continue current work
   - `backlog` - Add to future, continue current work
   - `skip` - Don't record, continue
3. **Record** - Update `.claude/backlog.md` based on decision

**ALWAYS wait for user decision. Never auto-triage.**

### Categories

- `tech-debt` - Code quality, architecture issues
- `out-of-scope` - Feature scope creep, new requirements
- `improvement` - Enhancement opportunities
- `refactor` - Code restructuring needs

Load command: `~/.claude/vibe-ash-svelte/prompts/commands/debt.md`

---

## Anti-Patterns (NEVER DO)

- Auto-continue without checkpoint
- Skip showing RED test failures
- Implement multiple scenarios at once
- Create PR without all tests passing
- Skip context loading
- Ignore role guidance
- Make assumptions without reading feature spec
- Skip UX/Designer phase
- Ignore UX checklists in phases
- Implement bootstrap feature without identifying patterns

---

## Role Loading Reference

| Phase | Role File | Key Focus |
|-------|-----------|-----------|
| QA (test gen) | `qa-engineer.md` | BDD -> AAA, test types, UX tests |
| Designer | `designer.md` | UX verification, component selection |
| Developer | `developer.md` | TDD, patterns, UX implementation |
| QA (validation) | `qa-engineer.md` | Quality gates, UX verification |
| Domain | `domain-architect.md` | Scenarios, glossary |
| PM | `agile-pm.md` | Issues, dependencies |
| DevOps | `devops.md` | CI/CD, deployment |
| Review | `code-reviewer.md` | Security, patterns |

---

## Command Loading Reference

| Command | Prompt File |
|---------|-------------|
| `/vibe contract` | `prompts/commands/contract.md` |
| `/vibe explore` | `prompts/commands/explore.md` |
| `/vibe validate` | `prompts/commands/validate.md` |
| `/vibe archive` | `prompts/commands/archive.md` |
| `/vibe discover` | `prompts/commands/discover.md` |
| `/vibe quick` | `prompts/commands/quick.md` |
| `/vibe pivot` | `prompts/commands/pivot.md` |
| `/vibe debt` | `prompts/commands/debt.md` |
| `/vibe review` | `prompts/commands/review.md` |
| `/vibe status` | `prompts/commands/status.md` |
| `/vibe retro` | `prompts/commands/retro.md` |
| `/vibe check` | `prompts/commands/check.md` |
| `/vibe plan` | `prompts/commands/plan.md` |
| `/vibe generate` | `prompts/commands/generate.md` |
| `/vibe lint` | `prompts/commands/lint.md` |
| `/vibe convert-story` | `prompts/commands/convert-story.md` |
| `/vibe context` | `prompts/commands/context.md` |
| `/vibe ux-design` | `prompts/commands/ux-design.md` |
| `/vibe research` | `prompts/commands/research.md` |
| `/vibe party` | `prompts/commands/party.md` |
| `/vibe sync` | `prompts/commands/sync.md` |
