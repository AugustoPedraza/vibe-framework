---
name: vibe
description: Autonomous feature implementation framework for Ash/Elixir + Svelte projects. Single-agent TDD pipeline with parallel validation, quality gates, and one PR per spec.
commands:
  - name: vibe
    description: Full autonomous workflow for feature implementation
    args: "[SCREEN-SPEC-ID]"
    file: commands/vibe.md
  - name: vibe check
    description: Standalone PR verification with parallel agents
    args: "<PR_URL|PR_NUMBER>"
    file: commands/check.md
  - name: vibe quick
    description: Condensed workflow for bugs, hotfixes, and small changes
    args: "[description]"
    file: commands/quick.md
  - name: vibe fix
    description: Targeted fix for user-reported issues with triage routing
    args: "[FEATURE-ID] \"description\""
    file: commands/fix.md
  - name: vibe pivot
    description: Course correction when implementation diverges from plan
    file: commands/pivot.md
  - name: vibe migrate
    description: Test-driven migration workflow for strangler fig pattern
    args: "[subcommand]"
    file: commands/migrate.md
  - name: vibe polish
    description: UI polish validation — single component or full codebase scan
    args: "[component-path|route|--all]"
    file: commands/polish.md
---

# Vibe Framework

> Autonomous feature implementation for Ash/Elixir + Svelte projects.

## Quick Start

```
/vibe AUTH-001         # Full autonomous workflow
/vibe quick "fix bug"  # Bug/hotfix mode
/vibe check 123        # PR verification
/vibe fix "broken"     # Targeted fix
/vibe pivot            # Course correction
/vibe migrate init     # Legacy migration
/vibe polish Button.svelte  # Single component polish
/vibe polish --all     # Full codebase polish
```

## Architecture

Vibe is a **single-agent TDD pipeline** with parallel validation, built on native Claude Code capabilities:

- **4 phases**: PREP → BUILD → VERIFY → MONITOR
- **Single focused agent** implements full vertical slice (DATA → DOMAIN → API → UI → WIRE)
- **Strict TDD**: test first → red → implement → green, per layer
- **Parallel validation**: 3 background agents verify backend, frontend, and spec-compliance
- **One PR per spec** to main (not stacked PRs)

### Core Capabilities Used

- **Layer reference guides** (`references/`) — checklists consulted per build layer
- **Auto memory** — persistent decisions and patterns learned
- **Hooks** — automated format/lint/size enforcement
- **Rules** — auto-loaded anti-patterns and quality gates
- **Background Task agents** — parallel verification in Phase 3

## Layer References

| Layer | Reference Guide | Purpose |
|-------|----------------|---------|
| DATA | `references/data-layer.md` | Migrations, seeds, schema |
| DOMAIN | `references/domain-layer.md` | Ash resources, actions, policies |
| API | `references/api-layer.md` | LiveView handlers, routing, wiring |
| UI | `references/ui-layer.md` | Svelte components, stores, a11y |

## QA Agents (Background)

- `agents/ci-fixer.md` — Auto-fix CI failures after PR creation
- `agents/refactoring-analyzer.md` — DRY, orthogonality, tech debt analysis

## Integration

- **BMAD** — Planning and discovery (see `integrations/bmad-screen-specs.md`)
- **Playwright MCP** — UI validation via browser inspection (see `docs/mcp-browser-setup.md`)

## File Structure

```
commands/       # Command prompts (one per command)
references/     # Layer reference guides (checklists for build phase)
agents/         # QA agent prompts (ci-fixer, refactoring-analyzer)
patterns/       # Reusable implementation patterns (RAG-lite)
rules/          # Output templates for .claude/rules/ in target projects
hooks/          # Hook configs + shell scripts
integrations/   # BMAD screen spec integration
templates/      # Feature, domain, migration, and MCP templates
config/         # Project config schema
docs/           # Reference documentation
```
