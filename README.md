# Vibe Ash+Svelte Framework

> AI-assisted development workflow for Ash + LiveSvelte projects with role-based phases, UX integration, and pattern discovery

---

## Quick Start

1. **Create project config** in your project:

```json
// .claude/vibe.config.json
{
  "project": {
    "name": "MyProject",
    "core_kpi": "Primary success metric"
  },
  "stack": {
    "backend": ["elixir", "ash"],
    "frontend": ["svelte"]
  },
  "paths": {
    "architecture": "architecture/",
    "domain": "docs/domain/",
    "features": "docs/domain/features/"
  }
}
```

2. **Use /vibe commands** in Claude:

```
/vibe AUTH-001                    # Implement feature
/vibe plan sprint-1               # Plan sprint
/vibe discover AUTH-003           # Pre-planning discovery
/vibe debt "Need error handling"  # Capture tech debt
/vibe retro                       # Run retrospective
/vibe --help                      # Show help
```

---

## Commands

| Command | Description |
|---------|-------------|
| `/vibe [ID]` | Implement feature (QA -> Designer -> Dev -> QA) |
| `/vibe plan [sprint]` | Plan sprint (Domain -> Designer -> PM) |
| `/vibe discover [ID]` | Pre-planning discovery (research, wireframe, draft scenarios) |
| `/vibe check` | **NEW** Validate project structure + template sync status |
| `/vibe debt [desc]` | Capture technical debt with triage |
| `/vibe review [scope]` | Multi-agent code review (fresh context) |
| `/vibe status` | Show current progress + debt summary |
| `/vibe retro` | Retrospective with pattern extraction + debt review |
| `/vibe --help` | Show command reference |

---

## Workflow Phases

### Feature Implementation (`/vibe [ID]`)

```
1. QA Engineer    -> Generate tests from scenarios + UX tests
2. Designer       -> UX verification & component selection
3. Developer      -> TDD implementation with UX checklist
4. QA Validation  -> Quality gates + UX verification
```

### Sprint Planning (`/vibe plan [sprint]`)

```
1. Domain Architect -> Define scenarios, identify bootstrap patterns
2. Designer         -> Create wireframes, define states
3. Agile PM         -> Create GitHub issues
```

### Feature Discovery (`/vibe discover [ID]`)

```
1. Context Loading  -> Understand the feature
2. Research         -> Industry patterns, user journey
3. Wireframe        -> Draft UI/UX with states
4. Draft Scenarios  -> Given/When/Then (not finalized)
5. Risks            -> Technical risks, unknowns
6. Document         -> Generate discovery spec (no GitHub issues)
```

### Technical Debt (`/vibe debt [desc]`)

```
1. Capture    -> Description, category, effort, context
2. Triage     -> User decides: now / later / backlog / skip
3. Record     -> Update .claude/backlog.md
```

---

## 4-Layer Architecture

```
Layer 1: Vibe Framework (100% Reusable)
  ~/.claude/vibe-ash-svelte/
  - Workflow, roles, checklists, commands
  - No domain references

Layer 2: Generic Patterns (Reusable Tech Patterns)
  ~/.claude/vibe-ash-svelte/patterns/
  - Discovered via retrospectives
  - Ash, Svelte, PWA, UX patterns

Layer 3: Project Architecture (Domain-Influenced)
  {project}/architecture/
  - Project-specific patterns
  - May start from generic, evolves

Layer 4: Domain (100% Project Specific)
  {project}/docs/domain/
  - Features, glossary, scenarios
  - Business rules
```

---

## Project Validation (AI-Native Enforcement)

**On first `/vibe` command in a session**, AI validates:

1. `.claude/vibe.config.json` exists and is valid
2. `architecture/` exists with required categories
3. `docs/domain/` exists with required files

**If validation fails → HARD BLOCK:**
- Show what's missing
- Offer to scaffold from template
- User must approve before continuing

**Template location:** `~/projects/vibe-ash-svelte-template/`

### `/vibe check` Command

Explicit validation + template sync status:

```
/vibe check

=== Vibe Framework Check ===

Project: MyProject
Core KPI: Primary success metric

Structure:
  ✓ .claude/vibe.config.json
  ✓ architecture/ (5 categories, 23 files)
  ✓ docs/domain/ (5 feature specs, glossary, vision)

Template Sync:
  ✓ _fundamentals/ in sync
  ⚠ _guides/testing.md differs
  ✓ _patterns/ in sync

Overall: ✓ Ready for /vibe commands
```

---

## Template Sync (AI-Driven)

No CLI scripts needed. AI handles sync directly:

1. AI reads template file from `~/projects/vibe-ash-svelte-template/`
2. AI reads project file
3. AI shows diff and explains changes
4. AI proposes Edit operations
5. User approves or rejects

To sync from template → project:
- Run `/vibe check`
- If files differ, AI will offer to sync

---

## Pattern Discovery

During retrospective (`/vibe retro`):

1. AI detects reusable patterns in implementation
2. Scores pattern reusability (HIGH/MEDIUM)
3. User approves patterns to extract
4. Patterns saved to `~/.claude/vibe-ash-svelte/patterns/`
5. Available for all future projects

---

## Structure

```
~/.claude/vibe-ash-svelte/
├── README.md           # This file
├── prompts/
│   ├── vibe.md         # Master orchestrator (includes validation)
│   ├── help.md         # /vibe --help output
│   └── commands/
│       ├── check.md    # Project validation + template sync
│       ├── plan.md     # Sprint planning
│       ├── discover.md # Feature discovery
│       ├── debt.md     # Technical debt capture
│       ├── review.md   # Multi-agent code review
│       ├── status.md   # Progress display
│       └── retro.md    # Retrospective + pattern promotion
├── roles/
│   ├── developer.md
│   ├── designer.md
│   ├── qa-engineer.md
│   ├── domain-architect.md
│   └── agile-pm.md
├── checklists/
│   ├── ux-pwa.md
│   ├── accessibility.md
│   └── quality.md
├── patterns/
│   ├── README.md
│   ├── TEMPLATE.md
│   ├── backend/
│   ├── frontend/
│   ├── pwa/
│   └── ux/
└── config/
    └── vibe.config.schema.json
```

---

## Project Requirements

Your project needs:

1. `.claude/vibe.config.json` - Project configuration
2. `{{paths.architecture}}/` - Architecture decisions (scaffold from template)
3. `{{paths.domain}}/` - Domain docs with GLOSSARY.md, vision.md
4. `{{paths.features}}/` - Feature specs with scenarios

**Template repo must be cloned:**
```bash
git clone git@github.com:AugustoPedraza/vibe-ash-svelte-template.git ~/projects/vibe-ash-svelte-template
```

---

## Template Variables

Roles and prompts use these variables from vibe.config.json:

| Variable | Source |
|----------|--------|
| `{{project.name}}` | config.project.name |
| `{{config.core_kpi}}` | config.project.core_kpi |
| `{{paths.architecture}}` | config.paths.architecture |
| `{{paths.domain}}` | config.paths.domain |
| `{{paths.features}}` | config.paths.features |
| `{{commands.check}}` | config.commands.check |
| `{{commands.test}}` | config.commands.test |
| `{{sync.template_path}}` | config.sync.template_path |

### Sync Configuration

Add to vibe.config.json for template sync:

```json
{
  "sync": {
    "template_path": "~/projects/vibe-ash-svelte-template",
    "ignored_files": [],
    "last_sync": null
  }
}
```
