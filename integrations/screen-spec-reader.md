# Screen Spec Reader

> Instructions for vibe's orchestrator to parse screen-spec format.

## Parsing Rules

### Frontmatter
The first line after the title contains `Status:` — only process specs with status `spec-ready`.

### Section Extraction

Extract these sections by heading:

| Heading | Parse As | Output |
|---------|----------|--------|
| `## Context` | Key-value pairs (after `-`) | metadata object |
| `### Components` | Markdown table | component list with props |
| `### States` | Bullet list with bold keys | state map |
| `### Interactions` | Markdown table | interaction list |
| `### Navigation` | Bullet list with bold keys | nav map |
| `### Ash Resources` | Markdown table | resource list |
| `### LiveView Assigns` | Markdown table | assign list |
| `## Acceptance Criteria` | Numbered list | test scenarios |
| `### Table Stakes Audit` | Checkbox list | completeness checklist |

### Pattern Resolution

For each pattern in `UX Patterns` list:
1. Normalize to filename: lowercase, replace spaces with hyphens, add `.md`
2. Read from `{patterns.catalog_path}/[filename]` (configured in `vibe.config.json > patterns.catalog_path`)
3. Extract the `## Code Face` section for implementation guidance
4. Extract the `## Table Stakes` section for completeness verification

### Component Resolution

For each component in the Components table:
1. Verify component exists at the listed path
2. If component has a `.d.ts` or props interface, extract prop types
3. Map to design tokens from the Token Mappings table

## Validation Before Implementation

Before starting implementation, verify:
- [ ] Spec status is `spec-ready`
- [ ] All referenced patterns exist in pattern catalog
- [ ] All referenced components exist in codebase
- [ ] All Ash resources reference valid domains
- [ ] No unresolved `MISSING` items in Table Stakes Audit

## Implementation Order

When multiple screen specs exist for a feature:
1. **Sort by spec number** (e.g., FEAT-001-01 before FEAT-001-02)
2. **Check dependencies** — later specs may depend on resources created by earlier ones
3. **Implement sequentially** — each spec builds on the previous

## State Requirements

Every screen spec implementation must handle these four states:

| State | Requirement |
|-------|-------------|
| **Loading** | Skeleton or spinner while data loads |
| **Empty** | Meaningful empty state when no data exists |
| **Error** | Error message with retry action |
| **Success** | Full data display with all interactions |

## Output Expectations

A completed screen spec implementation should produce:

| Output | Location |
|--------|----------|
| Ash resources (if new) | `lib/{project}/{domain}/resources/` |
| LiveView module | `lib/{project}_web/live/` |
| Svelte component(s) | `assets/svelte/components/features/` |
| Tests | `test/{project}_web/live/` |
| Component tests | `assets/svelte/components/**/*.test.ts` |
