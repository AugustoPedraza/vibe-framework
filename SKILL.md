---
name: vibe
description: Autonomous feature implementation framework for Ash/Elixir + Svelte projects. Agent-first parallel architecture with TDD, quality gates, and stacked PRs.
commands:
  - name: vibe
    description: Full autonomous workflow for feature implementation
    args: "[FEATURE-ID]"
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
```

## Architecture

Vibe is a **thin orchestration layer** on top of native Claude Code capabilities:

- **TaskCreate/TaskUpdate** for progress tracking and state management
- **Auto memory** for persistent decisions and patterns learned
- **Hooks** for automated format/lint enforcement
- **Rules** auto-loaded into every session for anti-patterns and quality gates
- **Subagents** via Task tool for parallel implementation

## Agent Taxonomy

**Implementation Agents** (spawned via Task tool):
- `domain-agent` - Ash resources, actions, validations, policies
- `api-agent` - LiveView handlers, routing, API wiring
- `ui-agent` - Svelte components, stores, interactions
- `data-agent` - Migrations, seeds, data layer

**QA Agents** (spawned in background):
- `ci-fixer` - Auto-fix CI failures after PR creation
- `refactoring-analyzer` - DRY, orthogonality, tech debt analysis

## Integration

- **BMAD** - Planning and discovery (see `integrations/bmad.md`)
- **UI/UX Pro Max** - Design intelligence (see `integrations/ui-ux-pro-max.md`)
- **Playwright MCP** - UI validation via browser inspection (see `templates/mcp.json`)

## File Structure

```
commands/       # Command prompts (one per command)
agents/         # Agent prompts for Task tool injection
patterns/       # Reusable implementation patterns (RAG-lite)
rules/          # Output templates for .claude/rules/ in target projects
hooks/          # Hook configs + shell scripts
integrations/   # BMAD, UI/UX Pro Max
templates/      # Feature, domain, migration, and MCP templates
config/         # Project config schema
docs/           # Reference documentation
```
