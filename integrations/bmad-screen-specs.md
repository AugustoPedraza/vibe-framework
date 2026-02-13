# BMAD Screen Spec Integration

> How vibe reads and implements screen specifications from the BMAD pipeline.

## Overview

Screen specs are the atomic unit of work in a BMAD-powered development pipeline. Each screen spec maps to a single `/vibe` run producing a small PR (~200-400 lines).

Screen specs are located at the path configured in `vibe.config.json > bmad.screen_specs_path` (default: `_bmad-output/implementation-artifacts/screen-specs/[FEATURE-ID]-[NUM].md`).

## Reading Screen Specs

When `/vibe [SCREEN-SPEC-ID]` is invoked:

1. **Locate spec**: Read `{bmad.screen_specs_path}/[ID].md`
2. **Parse sections**: Extract structured data from the spec
3. **Auto-match patterns**: Extract keywords from spec, match against `patterns/manifest.json`, load top 3

## Section → Build Layer Mapping

| Screen Spec Section | Build Layer | Reference Guide |
|---------------------|-------------|-----------------|
| Data Requirements → Ash Resources | DATA + DOMAIN | `references/domain-layer.md` |
| Data Requirements → LiveView Assigns | API | `references/api-layer.md` |
| UI Specification → Layout | UI | `references/ui-layer.md` |
| UI Specification → Components | UI | `references/ui-layer.md` |
| UI Specification → States | UI | `references/ui-layer.md` |
| UI Specification → Interactions | UI | `references/ui-layer.md` |
| UI Specification → Navigation | UI + WIRE | `references/api-layer.md` |
| Acceptance Criteria | ALL (TDD per layer) | — |
| Table-Stakes Audit | VERIFY (Phase 3) | — |
| Dev Notes → Token Mappings | UI | `references/ui-layer.md` |
| Dev Notes → Testing Approach | ALL (TDD per layer) | — |

## Pattern Enforcement

For each pattern listed in the spec's `UX Patterns` field:
1. Load the pattern's **Code Face** section from `{patterns.catalog_path}/[pattern].md`
2. Verify the component mapping matches what's in the spec
3. Check that all `[required]` table stakes items from the pattern are in the spec's Interactions
4. Apply design token mappings from the pattern's Code Face

## Completeness Verification

Before marking implementation complete (Phase 3 spec-compliance check):
1. All `[x]` items in Table Stakes Audit must have corresponding code
2. All acceptance criteria must have corresponding tagged test assertions (`@tag :ac_N` or `AC-N:`)
3. All four states (loading, empty, error, success) must be implemented
4. Navigation entry/exit points must be wired up
5. Component registered in `assets/js/app.js`

## Anti-Patterns

- Never implement a screen spec without checking its status is `spec-ready`
- Never skip pattern enforcement — all referenced patterns must be loaded and verified
- Never implement partial states — all four states (loading, empty, error, success) are required
- Never ignore table stakes audit — MISSING items must be resolved before implementation
