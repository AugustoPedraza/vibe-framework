# Context Loading Strategy

> Tiered context loading for optimal performance and response quality.

---

## Overview

The vibe framework uses a 3-tier context loading system to minimize token usage while maintaining response quality. Only load what's needed, when it's needed.

---

## Tier 1: Core (Always Load)

**~10% of context budget**

Load at the start of every session/phase:

```yaml
tier1_core:
  always:
    - prompts/vibe-core.md           # Minimal orchestrator (~200 lines)
    - Current phase file from prompts/phases/
    - Feature spec: {{paths.features}}/{area}/{ID}.md
    - Role core: roles/{role}/core.md

  from_checkpoint:
    - context_cache.context_summary   # AI summary from prior session
```

### Loading Order

1. Check for checkpoint at `.claude/checkpoints/{FEATURE-ID}.json`
2. If checkpoint exists, load `context_cache.context_summary` first
3. Load `vibe-core.md` (workflow skeleton)
4. Load current phase file
5. Load feature spec
6. Load role core module

---

## Tier 2: On-Demand (Load When Triggered)

**~20% of context budget (as needed)**

Load only when specific triggers are matched:

```yaml
tier2_on_demand:
  patterns:
    trigger: "Pattern keywords in feature spec"
    source: patterns/manifest.json
    load: patterns/{category}/{matched-id}.md

  architecture:
    trigger: "Work type (backend, frontend, testing)"
    load: "Only referenced docs from architecture/"

  role_extensions:
    trigger: "Specific work type begins"
    load: roles/{role}/{module}.md
```

### Pattern Loading Flow

```
1. Read patterns/manifest.json (~50 lines, lightweight)
2. Extract keywords from feature spec
3. Match against pattern "triggers" array
4. Filter by project stack (from vibe.config.json)
5. Sort by reusability score (≥5 = recommended)
6. Load ONLY top 3-5 matched patterns
```

### Role Extension Loading

| Work Type | Load |
|-----------|------|
| Backend work | `roles/developer/backend.md` |
| Frontend work | `roles/developer/frontend.md` |
| TDD cycle | `roles/developer/testing.md` |
| Phase complete | `roles/developer/checklist.md` |
| E2E tests | `roles/qa-engineer/e2e.md` |
| Mobile design | `roles/designer/mobile.md` |

---

## Tier 3: Checkpoint Restore (Session Resume)

**~15% savings on resume**

When resuming from checkpoint, use cached context:

```yaml
tier3_checkpoint:
  restore:
    - context_cache.patterns_loaded     # Pre-load known relevant patterns
    - context_cache.decisions           # Restore decision context
    - context_cache.context_summary     # Quick context recap

  skip:
    - context_cache.architecture_docs_read  # Already incorporated
    - context_cache.skip_on_resume          # Explicitly marked
```

### Resume Flow

```
1. Load checkpoint from .claude/checkpoints/{FEATURE-ID}.json
2. Display smart_resume summary
3. Load context_cache.context_summary
4. Pre-load context_cache.patterns_loaded
5. Restore context_cache.decisions
6. Skip context_cache.architecture_docs_read
7. Start at checkpoint position with minimal reload
```

---

## Context Budget Allocation

### Traditional (Full Load)

```
Phase Start:
  vibe.md orchestrator:        ~25%
  role file (full):            ~20%
  feature spec:                 ~5%
  patterns (all):              ~10%
  architecture refs:           ~15%
  ────────────────────────────────────
  TOTAL before work:           ~75%
  Available for work:          ~25%
```

### Optimized (Tiered Load)

```
Phase Start (Tier 1):
  vibe-core.md:                 ~5%
  phase-specific.md:            ~5%
  role/core.md:                 ~5%
  feature spec:                 ~5%
  ────────────────────────────────────
  TOTAL Tier 1:                ~20%

On-Demand (Tier 2):
  matched patterns (2-3):       ~5%
  role extensions (1-2):        ~5%
  architecture docs (1-2):      ~5%
  ────────────────────────────────────
  TOTAL Tier 2:                ~15%

Resume (Tier 3 savings):
  checkpoint restore:          -15%
  skip already-read:           -10%
  ────────────────────────────────────
  NET on resume:               ~10%

TOTAL Available:               ~65-80%
```

---

## Anti-Patterns

### DON'T: Load Everything Upfront

```yaml
# BAD: Loads full context regardless of need
load:
  - prompts/vibe.md             # 2000+ lines
  - roles/developer.md          # 2300+ lines
  - patterns/index.json         # 470 lines
  - All architecture docs
```

### DON'T: Re-read Completed Work

```yaml
# BAD: Ignores checkpoint context
on_resume:
  - Load everything fresh
  - Re-read all patterns
  - Re-make all decisions
```

### DO: Load Incrementally

```yaml
# GOOD: Tiered loading
tier1:
  - vibe-core.md
  - phase file
  - role core

tier2:  # Only when needed
  - Matched patterns
  - Work-specific extensions

tier3:  # On resume
  - Restore from checkpoint
  - Skip already-incorporated
```

---

## Mandatory Context Clearing Rules

### Auto-Clear Triggers

```yaml
must_clear:
  after_feature_complete: true     # Always clear after Phase 5
  context_load_critical: true      # When >75% context used
  switching_features: true         # Before starting different feature

should_clear:
  after_3_fix_iterations: true     # Context may be polluted
  after_long_debug_session: true   # Focus may be lost
  different_domain_area: true      # e.g., auth → billing

auto_clear_on_completion:
  enabled: true
  message: "Feature complete. Context cleared for next task."
```

### Clear Trigger Display

After Phase 5 completion, the system automatically clears context:

```
═══════════════════════════════════════════════════════════════
  Phase: 5/5 LEARNING (background)
═══════════════════════════════════════════════════════════════
COMPLETE! PR #130 ready.

Context cleared automatically. Ready for next feature.
```

### Manual Clear Recommendations

Recommend `/clear` in these situations:
- After 3+ fix iterations on same issue (context may be polluted)
- After long debugging session (focus may be lost)
- Before switching domain areas (auth → billing) in same session

---

## Implementation Notes

### For AI Orchestrator

1. **Session Start**: Load Tier 1 only
2. **Pattern Match**: Query manifest.json, load matched patterns
3. **Work Type Change**: Load appropriate role extension
4. **Phase Complete**: Save context_cache to checkpoint
5. **Session Resume**: Restore from context_cache first
6. **Feature Complete**: Auto-clear context, remove from active-features.json

### For Human Reference

This strategy reduces context usage by 50-60% while maintaining quality by:
- Loading core rules always
- Loading patterns only when matched
- Restoring decisions from checkpoint
- Skipping already-incorporated context
- Auto-clearing after feature completion
