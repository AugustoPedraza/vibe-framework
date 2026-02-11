# BMAD Screen Spec Integration

> How vibe reads and implements screen specifications from the BMAD pipeline.

## Overview

Screen specs are the atomic unit of work in a BMAD-powered development pipeline. Each screen spec maps to a single `/vibe` run producing a small PR (~200-400 lines).

Screen specs are located at the path configured in `vibe.config.json > bmad.screen_specs_path` (default: `_bmad-output/implementation-artifacts/screen-specs/[FEATURE-ID]-[NUM].md`).

## Reading Screen Specs

When `/vibe [SCREEN-SPEC-ID]` is invoked:

1. **Locate spec**: Read `{bmad.screen_specs_path}/[ID].md`
2. **Parse sections**: Extract structured data from the spec (see screen-spec-reader.md)
3. **Load patterns**: Read referenced UX patterns from `{patterns.catalog_path}`

## Section → Phase Mapping

| Screen Spec Section | Vibe Phase | Agent |
|---------------------|-----------|-------|
| Data Requirements → Ash Resources | Phase 1: Domain | domain-agent |
| Data Requirements → LiveView Assigns | Phase 1: Domain | domain-agent |
| UI Specification → Layout | Phase 2: UI | ui-agent |
| UI Specification → Components | Phase 2: UI | ui-agent |
| UI Specification → States | Phase 2: UI | ui-agent |
| UI Specification → Interactions | Phase 2: UI | ui-agent |
| UI Specification → Navigation | Phase 2: UI | ui-agent |
| Completeness Review → Table Stakes | Phase 3: QA | qa-agent |
| Acceptance Criteria | Phase 4: Testing | test-agent |
| Dev Notes → Token Mappings | Phase 2: UI | ui-agent |
| Dev Notes → Testing Approach | Phase 4: Testing | test-agent |

## Pattern Enforcement

For each pattern listed in the spec's `UX Patterns` field:
1. Load the pattern's **Code Face** section from `{patterns.catalog_path}/[pattern].md`
2. Verify the component mapping matches what's in the spec
3. Check that all `[required]` table stakes items from the pattern are in the spec's Interactions
4. Apply design token mappings from the pattern's Code Face

## Completeness Verification

Before marking implementation complete:
1. All `[x]` items in Table Stakes Audit must have corresponding code
2. All acceptance criteria must have corresponding test assertions
3. All four states (loading, empty, error, success) must be implemented
4. Navigation entry/exit points must be wired up

## Example: `/vibe FEAT-001-01`

```
1. Read {bmad.screen_specs_path}/FEAT-001-01.md
2. Screen Type: Message List → load relevant patterns
3. Phase 1: Create/verify Ash resources per Data Requirements
4. Phase 2: Implement Svelte components per UI Specification
5. Phase 3: Run table-stakes audit against implementation
6. Phase 4: Write tests per Acceptance Criteria
```

## Anti-Patterns

- Never implement a screen spec without checking its status is `spec-ready`
- Never skip pattern enforcement — all referenced patterns must be loaded and verified
- Never implement partial states — all four states (loading, empty, error, success) are required
- Never ignore table stakes audit — MISSING items must be resolved before implementation
