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
/vibe AUTH-001        # Implement feature
/vibe plan sprint-1   # Plan sprint
/vibe retro           # Run retrospective
/vibe --help          # Show help
```

---

## Commands

| Command | Description |
|---------|-------------|
| `/vibe [ID]` | Implement feature (QA -> Designer -> Dev -> QA) |
| `/vibe plan [sprint]` | Plan sprint (Domain -> Designer -> PM) |
| `/vibe status` | Show current progress |
| `/vibe retro` | Retrospective with pattern extraction |
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
├── COMMANDS.md         # Command reference
├── prompts/
│   ├── vibe.md         # Master orchestrator
│   ├── help.md         # /vibe --help output
│   └── commands/       # Command handlers
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
2. `{{paths.features}}/` - Feature specs with scenarios
3. `{{paths.domain}}/GLOSSARY.md` - Domain terms
4. `{{paths.architecture}}/` - Architecture decisions

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
