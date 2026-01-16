# Project Context Command

> `/vibe context` - Generate project-context.md for BMAD compatibility

## Purpose

Create a unified context document that:
- Links BMAD planning artifacts to Vibe implementation
- Maps BMAD stories to Vibe feature specs
- Enables BMAD agents to find project structure
- Provides single source of truth for AI agents

**Output:** `project-context.md` at project root

---

## Workflow

```
Scan BMAD Artifacts -> Scan Vibe Features -> Build Mapping -> Generate Document
```

---

## Phase 1: Scan BMAD Artifacts

```
+======================================================================+
|  CTX SCANNING BMAD ARTIFACTS                                          |
|  Looking for planning documents...                                    |
+======================================================================+
```

### Locate BMAD Output

Check these locations in order:
1. `_bmad-output/planning-artifacts/` (preferred)
2. `_bmad/output/`
3. `docs/planning/`

### Required BMAD Files

| File | Purpose | Required |
|------|---------|----------|
| `prd.md` | Product Requirements | Yes |
| `epics.md` | Epics & Stories | Yes |
| `architecture.md` | Technical Decisions | No |

### Extract Metadata

From `epics.md`, extract:
- Epic titles and IDs
- Story IDs and titles
- Story status (if present)

```
+---------------------------------------------------------------------+
|  BMAD ARTIFACTS FOUND                                                |
|                                                                      |
|  Location: _bmad-output/planning-artifacts/                          |
|                                                                      |
|  Documents:                                                          |
|    [x] prd.md - Product Requirements                                 |
|    [x] epics.md - 9 epics, 50+ stories                               |
|    [x] architecture.md - Technical Architecture                      |
|                                                                      |
|  Continue scanning Vibe features? [Enter]                            |
+---------------------------------------------------------------------+
```

---

## Phase 2: Scan Vibe Features

```
+======================================================================+
|  CTX SCANNING VIBE FEATURES                                           |
|  Location: docs/domain/features/                                      |
+======================================================================+
```

### Locate Feature Specs

Scan `{{paths.features}}/` recursively for `*.md` files.

### Extract Feature Metadata

From each feature spec, extract:
- Feature ID (from filename or frontmatter)
- Title (from H1 header)
- Status (from Status field if present)
- Area (from parent directory)

```
+---------------------------------------------------------------------+
|  VIBE FEATURES FOUND                                                 |
|                                                                      |
|  Location: docs/domain/features/                                     |
|                                                                      |
|  Features:                                                           |
|    auth/AUTH-001.md - User Login           [done]                    |
|    auth/AUTH-002.md - User Registration    [in-progress]             |
|    conversations/CONV-001.md - View Messages                         |
|    conversations/CONV-002.md - Send Messages                         |
|    projects/PROJ-001.md - Create Project                             |
|    projects/PROJ-002.md - Project Settings                           |
|                                                                      |
|  Continue building mapping? [Enter]                                  |
+---------------------------------------------------------------------+
```

---

## Phase 3: Build Story-to-Feature Mapping

```
+======================================================================+
|  CTX BUILDING FEATURE MAPPING                                         |
|  Matching BMAD stories to Vibe features...                            |
+======================================================================+
```

### Matching Algorithm

1. **Exact ID Match**: Story 1.1 -> AUTH-001 (if explicitly linked)
2. **Title Match**: Fuzzy match story title to feature title
3. **Area Match**: Match epic area to feature directory
4. **Manual**: Prompt for unmapped stories

### Mapping Table

| BMAD Story | Story Title | Vibe Feature | Status |
|------------|-------------|--------------|--------|
| 1.1 | User Registration | AUTH-002 | in-progress |
| 1.2 | User Login | AUTH-001 | done |
| 1.3 | Password Reset | - | todo |
| 2.1 | Create Project | PROJ-001 | todo |

### Handle Unmapped Stories

For stories without matching features:
- Mark as `todo` in mapping
- Suggest running `/vibe convert-story [ID]` to create feature spec

```
+---------------------------------------------------------------------+
|  MAPPING COMPLETE                                                    |
|                                                                      |
|  Mapped: 6 stories -> 6 features                                     |
|  Unmapped: 44 stories (need feature specs)                           |
|                                                                      |
|  To create specs for unmapped stories:                               |
|    /vibe convert-story 1.3                                           |
|    /vibe convert-story 2.2                                           |
|    ...                                                               |
|                                                                      |
|  Generate project-context.md? [Enter]                                |
+---------------------------------------------------------------------+
```

---

## Phase 4: Generate project-context.md

```
+======================================================================+
|  CTX GENERATING PROJECT CONTEXT                                       |
|  Output: project-context.md                                           |
+======================================================================+
```

### Document Structure

```markdown
---
project_name: {{project.name}}
date: {{current_date}}
framework: vibe-ash-svelte
bmad_integration: true
---

# Project Context for AI Agents

_This file provides unified context for AI agents working with both BMAD and Vibe frameworks._

---

## Project Overview

- **Name:** {{project.name}}
- **Core KPI:** {{project.core_kpi}}
- **Tech Stack:** Phoenix + Ash + Svelte 5 + Tailwind CSS 4

---

## Planning Artifacts (BMAD)

| Document | Path | Description |
|----------|------|-------------|
| PRD | `_bmad-output/planning-artifacts/prd.md` | Product requirements, FRs, NFRs |
| Epics | `_bmad-output/planning-artifacts/epics.md` | Epics and stories with acceptance criteria |
| Architecture | `_bmad-output/planning-artifacts/architecture.md` | Technical architecture decisions |

---

## Domain Documentation (Vibe)

| Document | Path | Description |
|----------|------|-------------|
| Vision | `docs/domain/vision.md` | Product vision and goals |
| Glossary | `docs/domain/GLOSSARY.md` | Domain terminology |
| Features | `docs/domain/features/` | Feature specifications |

---

## Implementation

| Resource | Path | Description |
|----------|------|-------------|
| Architecture | `architecture/` | Technical implementation guides |
| Components | `components.json` | UI component API reference |
| AI Rules | `CLAUDE.md` | Project-specific AI instructions |

---

## Feature Mapping (BMAD -> Vibe)

| Epic | BMAD Story | Vibe Feature | Status |
|------|------------|--------------|--------|
{{#each mapping}}
| {{epic}} | {{story_id}}: {{story_title}} | {{feature_id}} | {{status}} |
{{/each}}

---

## Epics Overview

{{#each epics}}
### Epic {{number}}: {{title}}

**Stories:** {{story_count}}
**Mapped:** {{mapped_count}} / {{story_count}}

| Story | Title | Feature | Status |
|-------|-------|---------|--------|
{{#each stories}}
| {{id}} | {{title}} | {{feature}} | {{status}} |
{{/each}}

{{/each}}

---

## Quick Reference for AI Agents

### Starting Work

1. Read this file for project overview
2. Read `CLAUDE.md` for implementation rules
3. Read feature spec at `docs/domain/features/{area}/{ID}.md`
4. Reference `components.json` for UI components

### BMAD Workflows (via /vibe)

- `/vibe ux-design [ID]` - Deep UX exploration (14-step workflow)
- `/vibe research [type]` - Market/domain/technical research
- `/vibe party` - Multi-agent discussion mode

### Vibe Implementation

- `/vibe [ID]` - Full 4-phase implementation
- `/vibe generate [ID]` - AI scaffold generation
- `/vibe lint` - UX Governor validation

---

## Last Updated

- **Generated:** {{current_datetime}}
- **By:** `/vibe context`
```

### Write File

Write `project-context.md` to project root.

```
+---------------------------------------------------------------------+
|  PROJECT CONTEXT GENERATED                                           |
|                                                                      |
|  File: project-context.md                                            |
|                                                                      |
|  Contents:                                                           |
|    * Project overview                                                |
|    * BMAD artifact links (3 documents)                               |
|    * Vibe domain links (3 resources)                                 |
|    * Feature mapping ({{mapped_count}} mapped)                       |
|    * Epic overview ({{epic_count}} epics)                            |
|    * AI quick reference                                              |
|                                                                      |
|  Unmapped stories: {{unmapped_count}}                                |
|  Run `/vibe convert-story [ID]` to create feature specs              |
|                                                                      |
|  This file should be regenerated when:                               |
|    * New features are added                                          |
|    * Feature status changes                                          |
|    * BMAD planning is updated                                        |
+---------------------------------------------------------------------+
```

---

## Auto-Regeneration Triggers

Suggest regenerating `project-context.md` when:
- After `/vibe plan` creates new features
- After `/vibe [ID]` completes (status change)
- After `/vibe convert-story` creates new feature
- User explicitly runs `/vibe context`

---

## Integration with Other Commands

| Command | Integration |
|---------|-------------|
| `/vibe plan` | Call `/vibe context` after creating features |
| `/vibe [ID]` | Update status in project-context.md on completion |
| `/vibe convert-story` | Call `/vibe context` after creating feature |
| `/vibe sync` | Use project-context.md for GitHub Projects sync |

---

## Anti-Patterns

- Never manually edit project-context.md (it's generated)
- Never skip scanning existing features
- Never hardcode paths (use config)
- Never generate without reading existing BMAD artifacts
- Never assume BMAD structure without verification
