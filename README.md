# Vibe Ash+Svelte Framework

> Autonomous feature implementation for Ash/Elixir + Svelte projects. Thin orchestration layer on top of native Claude Code capabilities.

## Quick Start

1. **Create project config** at `.claude/vibe.config.json`:

```json
{
  "project": { "name": "MyProject", "core_kpi": "Primary success metric" },
  "stack": { "backend": ["elixir", "ash"], "frontend": ["svelte"] },
  "paths": { "architecture": "architecture/", "domain": "docs/domain/", "features": "docs/domain/features/" }
}
```

2. **Run commands**:

```
/vibe AUTH-001          # Full autonomous workflow
/vibe quick "fix bug"   # Bug/hotfix mode
/vibe check 123         # PR verification
/vibe fix AUTH-001 "broken login"  # Targeted fix
/vibe pivot             # Course correction
/vibe migrate init      # Legacy migration
```

## Commands

| Command | Description |
|---------|-------------|
| `/vibe [ID]` | Full autonomous feature implementation (parallel agents, stacked PRs) |
| `/vibe quick [desc]` | Bug/hotfix (condensed 2-phase: Dev → Verify) |
| `/vibe check <PR>` | Standalone PR verification with 6 parallel analysis agents |
| `/vibe fix [ID] "desc"` | Targeted fix with triage routing and model escalation |
| `/vibe pivot` | Course correction (ASSESS → DECIDE → RESUME) |
| `/vibe migrate [sub]` | Strangler fig migration (init, status, or feature-based) |

## Architecture

Vibe is a **thin orchestration layer** on native Claude Code features:

| Native Feature | Replaces |
|----------------|----------|
| **TaskCreate/TaskUpdate** | Custom checkpoint/verification/tracking systems |
| **Auto memory** | Custom pattern files, session decisions |
| **Hooks** (`hooks/hooks.json`) | Format-watcher, lint-watcher agents |
| **Rules** (`rules/`) | Custom tier loading, reinforcement protocol |
| **Subagents** (Task tool) | Sequential role-based workflow |

### Agent Taxonomy

**Implementation Agents** (spawned via Task tool, run in parallel):

| Agent | Responsibility | File Ownership |
|-------|---------------|----------------|
| `domain-agent` | Ash resources, actions, validations, policies | `lib/{domain}/` |
| `api-agent` | LiveView handlers, routing, API wiring | `lib/{app}_web/live/` |
| `ui-agent` | Svelte components, stores, interactions | `assets/svelte/` |
| `data-agent` | Migrations, seeds, data layer | `priv/repo/` |

**QA Agents** (spawned in background):

| Agent | Responsibility |
|-------|---------------|
| `ci-fixer` | Auto-fix CI failures after PR creation (max 3 retries) |
| `refactoring-analyzer` | DRY, orthogonality, tech debt scoring |

### Workflow Phases

```
Phase 0: CONTRACT    → Parse feature spec, generate agent contracts (plan mode)
Phase 1: SYNC        → Data + Domain + UI agents in parallel, stacked PRs
Phase 2: INTEGRATE   → API agent wires domain↔UI, integration PR
Phase 3: VALIDATE    → Quality gates, refactoring analysis, security scan
Phase 4: POLISH      → Auto-fix issues, final PR to main
Phase 5: LEARN       → Extract patterns, update auto memory
```

## Integrations

| Integration | Purpose | Config |
|-------------|---------|--------|
| **BMAD** | Planning and discovery | `integrations/bmad.md` |
| **BMAD Screen Specs** | Atomic work items from BMAD pipeline | `integrations/bmad-screen-specs.md` |
| **Screen Spec Reader** | Parsing screen spec format | `integrations/screen-spec-reader.md` |
| **UI/UX Pro Max** | Design intelligence | `integrations/ui-ux-pro-max.md` |
| **Playwright MCP** | UI validation via browser | `.mcp.json` in target project |

## Directory Structure

```
~/.claude/vibe-ash-svelte/
├── SKILL.md              # Entry point (YAML frontmatter, command registry)
├── commands/             # Command prompts (one per command)
│   ├── vibe.md           # Main workflow (~400 lines, single source of truth)
│   ├── check.md          # PR verification
│   ├── quick.md          # Bug/hotfix
│   ├── fix.md            # Targeted fix
│   ├── pivot.md          # Course correction
│   └── migrate.md        # Legacy migration
├── agents/               # Agent prompts for Task tool injection
│   ├── domain-agent.md
│   ├── api-agent.md
│   ├── ui-agent.md
│   ├── data-agent.md
│   ├── ci-fixer.md
│   └── refactoring-analyzer.md
├── patterns/             # Reusable implementation patterns (RAG-lite)
│   ├── manifest.json     # Single lightweight index
│   ├── backend/          # Ash, Elixir patterns
│   ├── frontend/         # Svelte, LiveSvelte patterns
│   ├── pwa/              # PWA patterns
│   └── ux/               # UX patterns
├── rules/                # Auto-loaded rules for target projects
│   ├── svelte-patterns.md
│   ├── elixir-patterns.md
│   ├── animation-patterns.md
│   ├── pwa-patterns.md
│   ├── quality-gates.md
│   ├── accessibility.md
│   ├── ux-validation.md
│   └── project-pitfalls.md
├── hooks/                # Hook configs for automated enforcement
│   └── hooks.json
├── integrations/         # External tool integration
│   ├── bmad.md
│   └── ui-ux-pro-max.md
├── templates/            # Feature/domain/migration templates
├── config/               # Project config schema
│   └── vibe.config.schema.json
└── docs/                 # Reference documentation
```

## Project Requirements

Your project needs:

1. `.claude/vibe.config.json` — Project configuration (see schema in `config/`)
2. `{paths.architecture}/` — Architecture decisions
3. `{paths.domain}/` — Domain docs with GLOSSARY.md, vision.md
4. `{paths.features}/` — Feature specs with BDD scenarios

## Pattern Library

Patterns are loaded from two sources: **framework patterns** (built-in) and **project patterns** (configured via `vibe.config.json > patterns`). Project patterns override framework patterns when IDs collide. See [`docs/pattern-discovery.md`](docs/pattern-discovery.md) for full details.

```
/vibe AUTH-001
→ Framework patterns: manifest.json matches "ash auth" → patterns/pwa/auth.md
→ Project patterns: {patterns.catalog_path} loaded if configured
→ Agents receive merged patterns in prompt
```

## Rules

Copy rules from `rules/` to your project's `.claude/rules/` directory. They are auto-loaded into every Claude Code session:

```bash
cp ~/.claude/vibe-ash-svelte/rules/*.md /path/to/project/.claude/rules/
```

## Hooks

Copy hooks config to your project. Hooks auto-run on file edits:

```bash
cp ~/.claude/vibe-ash-svelte/hooks/hooks.json /path/to/project/.claude/hooks.json
```

## Migration Mode (Strangler Fig)

For migrating existing projects to Ash+Svelte incrementally:

```
/vibe migrate init       # Analyze current state
/vibe migrate FEATURE    # Create migration spec
/vibe MIGRATE-FEATURE    # Implement (requires passing regression tests)
```

**Safety rule**: No migration without regression tests first. Tests must be written in target architecture and pass against legacy code before migration starts.
