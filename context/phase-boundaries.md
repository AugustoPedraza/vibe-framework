# Phase Context Boundaries

> Defines exactly what context to load for each workflow phase.

---

## Phase 1: QA Engineer

### Purpose
Generate executable tests from acceptance scenarios.

### Context to Load

```yaml
qa_engineer:
  tier1:
    - prompts/vibe-core.md
    - prompts/phases/qa.md
    - Feature spec: {{paths.features}}/{area}/{ID}.md
    - roles/qa-engineer/core.md

  tier2_on_demand:
    - roles/qa-engineer/templates.md     # When writing tests
    - roles/qa-engineer/e2e.md           # When E2E required

  skip:
    - All developer/ role modules
    - All designer/ role modules
    - Implementation patterns
```

### Expected Output
- Test files created in appropriate locations
- Tests running and FAILING (RED state)
- All 4 UX states covered
- QA -> Designer handoff document

---

## Phase 2: Designer

### Purpose
Verify UX completeness and select components.

### Context to Load

```yaml
designer:
  tier1:
    - prompts/vibe-core.md
    - prompts/phases/designer.md
    - Feature spec: {{paths.features}}/{area}/{ID}.md
    - roles/designer/core.md
    - QA handoff from checkpoint

  tier2_on_demand:
    - roles/designer/mobile.md           # PWA/mobile features
    - roles/designer/components.md       # Component selection
    - {{paths.architecture}}11-mobile-first.md  # Mobile patterns

  skip:
    - All developer/ role modules
    - All qa-engineer/ role modules
    - Backend patterns
```

### Expected Output
- UX verification complete
- Components selected (new vs existing)
- All 4 states defined
- Designer -> Developer handoff document

---

## Readiness Gate

### Purpose
Verify all prerequisites before implementation.

### Context to Load

```yaml
readiness_gate:
  tier1:
    - prompts/vibe-core.md (gate section only)
    - Feature spec
    - QA handoff
    - Designer handoff

  verify:
    - All scenarios have Given/When/Then
    - UI states defined (loading/error/empty/success)
    - No open BLOCKING questions
    - Dependencies available
    - Tests generated
    - Components selected
```

### Output
- PASS: Continue to Developer phase
- FAIL: Return to appropriate phase with specific gaps

---

## Phase 3: Developer

### Purpose
TDD implementation (RED -> GREEN -> REFACTOR).

### Context to Load

```yaml
developer:
  tier1:
    - prompts/vibe-core.md
    - prompts/phases/developer.md
    - Feature spec: {{paths.features}}/{area}/{ID}.md
    - roles/developer/core.md
    - Designer handoff from checkpoint

  tier2_on_demand:
    - roles/developer/backend.md         # Backend work
    - roles/developer/frontend.md        # Frontend work
    - roles/developer/testing.md         # TDD cycle
    - Matched patterns from manifest     # Feature-specific

  load_incrementally:
    - Architecture docs: Load only when referenced
    - Test files: Load current failing test

  skip:
    - All qa-engineer/ role modules
    - All designer/ role modules
```

### Pattern Loading

```yaml
pattern_matching:
  1. Read patterns/manifest.json
  2. Match feature keywords against triggers
  3. Filter by project stack
  4. Load top 3-5 matches
  5. Cache in checkpoint.context_cache.patterns_loaded
```

### Expected Output
- All tests passing (GREEN state)
- Code reviewed against checklist
- Implementation complete per scenarios

---

## Phase 4: QA Validation

### Purpose
Final quality gates and PR preparation.

### Context to Load

```yaml
qa_validation:
  tier1:
    - prompts/vibe-core.md
    - prompts/phases/validation.md
    - Feature spec (verification section)
    - roles/developer/checklist.md       # Quality gates

  tier2_on_demand:
    - Test results
    - Verification records

  skip:
    - All implementation guidance
    - Pattern files
    - Architecture deep-dives
```

### Expected Output
- All tests passing
- Quality gates passed
- Verification records complete
- PR ready

---

## Quick Mode (2-Phase)

### Phase 1: Dev (Condensed)

```yaml
quick_dev:
  tier1:
    - prompts/vibe-core.md
    - prompts/phases/quick.md
    - roles/developer/core.md

  tier2_on_demand:
    - roles/developer/backend.md OR frontend.md
    - Single matched pattern (if any)

  skip:
    - QA role modules
    - Designer role modules
    - Full pattern matching
```

### Phase 2: Verify

```yaml
quick_verify:
  tier1:
    - prompts/phases/validation.md
    - roles/developer/checklist.md

  actions:
    - Run full test suite
    - Run quality checks
    - Commit if passing
```

---

## Context Clearing Between Phases

```yaml
phase_transition:
  clear:
    - Previous role's extension modules
    - Non-applicable patterns
    - Previous phase file

  retain:
    - Feature spec (always)
    - Decisions made (in checkpoint)
    - Matched patterns (if still relevant)

  load:
    - New phase file
    - New role core
```

---

## Checkpoint Context Save

At the end of each phase, save to checkpoint:

```yaml
save_to_checkpoint:
  context_cache:
    patterns_loaded: [list of pattern IDs used]
    architecture_docs_read: [list of doc names]
    role_modules_used: [list of module paths]
    decisions:
      - type: pattern_choice
        choice: "Use async-result-extraction"
        reason: "Feature has loading states"
    context_summary: "Implementing AUTH-001 login with Ash..."
    files_in_memory: [key files for resume]
```

---

## Summary Table

| Phase | Core Load | On-Demand | Skip |
|-------|-----------|-----------|------|
| QA | vibe-core, qa/core, feature | templates, e2e | developer, designer |
| Designer | vibe-core, designer/core, feature | mobile, components | developer, qa |
| Developer | vibe-core, dev/core, feature | backend, frontend, patterns | qa, designer |
| Validation | vibe-core, checklist | test results | all implementation |
| Quick | vibe-core, dev/core | one extension | full pattern match |
