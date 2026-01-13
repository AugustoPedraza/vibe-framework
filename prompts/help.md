# /vibe - AI-Assisted Development Workflow

## USAGE

```
/vibe <command> [options]
```

## COMMANDS

| Command | Description |
|---------|-------------|
| `/vibe [FEATURE-ID]` | Implement feature (QA -> Designer -> Dev -> QA) |
| `/vibe quick [desc]` | Bug/hotfix mode (condensed 2-phase workflow) |
| `/vibe pivot` | Course correction when implementation diverges |
| `/vibe plan [sprint]` | Plan sprint (Domain -> Designer -> PM) |
| `/vibe discover [ID]` | Pre-planning discovery (research, wireframe, draft scenarios) |
| `/vibe check` | Validate project structure + template sync status |
| `/vibe debt [desc]` | Capture technical debt with triage decision |
| `/vibe review [scope]` | Multi-agent code review (fresh context) |
| `/vibe status` | Show current progress |
| `/vibe retro` | Capture learnings, extract reusable patterns |
| `/vibe migrate init` | Initialize migration project (analyze current state) |
| `/vibe migrate [FEATURE]` | Create migration spec for existing feature |
| `/vibe migrate status` | Show migration progress |

## OPTIONS

| Option | Description |
|--------|-------------|
| `--help`, `-h` | Show this help |
| `--config` | Show project config |
| `--roles` | List available roles |

## EXAMPLES

```bash
/vibe AUTH-001                    # Implement login feature
/vibe quick "fix login button"    # Quick bug fix (condensed workflow)
/vibe pivot                       # Course correction when stuck
/vibe plan sprint-1               # Plan Sprint 1 features
/vibe discover AUTH-003           # Discovery phase for password reset
/vibe check                       # Validate project structure
/vibe debt "Need error handling"  # Capture tech debt item
/vibe review                      # Review staged changes
/vibe review AUTH-001             # Review feature implementation
/vibe review --security           # Security-focused review
/vibe retro                       # Run retrospective with pattern extraction
/vibe status                      # Show implementation progress

# Migration commands (for existing projects)
/vibe migrate init                # Analyze and document current state
/vibe migrate PROFILE             # Create migration spec for profile feature
/vibe migrate status              # Show migration progress
/vibe MIGRATE-PROFILE             # Implement migration (after tests pass)
```

## WORKFLOW PHASES (per feature)

```
1. QA Engineer    -> Generate tests from scenarios
2. Designer       -> UX verification & component selection
3. Developer      -> TDD implementation
4. QA Validation  -> Quality gates & coverage
```

## PROJECT REQUIREMENTS

Create `.claude/vibe.config.json` in your project:

```json
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
  },
  "ux": {
    "pwa": true,
    "mobile_first": true
  }
}
```

## AI OPTIMIZATION

The framework automatically optimizes based on task type:

**Auto-Detection:**
- Bug fixes → Suggests `/vibe quick`
- New features → Uses full 4-phase workflow
- Complex tasks → Uses parallel agents

**Parallelization (automatic):**
- Discovery: 3 agents for research
- Review: 3 agents (security, performance, patterns)
- Test generation: 3 agents (unit, integration, e2e)
- Planning: 1 agent per feature (up to 3)

**Context Management:**
- AI recommends `/clear` when switching features
- Uses Explore agents for fresh context on codebase questions

## PATTERN DISCOVERY

During retrospective (`/vibe retro`), AI will:
1. Scan implementation for reusable patterns
2. Score pattern reusability (HIGH/MEDIUM)
3. Suggest extraction to `~/.claude/vibe-ash-svelte/patterns/`
4. User approves which patterns to promote

Promoted patterns are available across all projects.

## MIGRATION MODE

For migrating existing projects to Ash+Svelte using strangler fig pattern:

**Setup:**
1. Add `migration.enabled: true` to `.claude/vibe.config.json`
2. Run `/vibe check` to scaffold migration structure
3. Run `/vibe migrate init` to analyze current codebase

**Workflow:**
```
/vibe migrate init       # Document current state
/vibe migrate FEATURE    # Create migration spec (generates test requirements)
(write tests)            # Tests in target architecture
(tests pass legacy)      # Verify tests work against old code
/vibe MIGRATE-FEATURE    # Implement migration (blocked until tests pass)
```

**Safety Rule:** NO migration without regression tests first.
Tests must be written in target architecture and pass against legacy code.

**Config Example:**
```json
{
  "migration": {
    "enabled": true,
    "template_repo": "https://github.com/AugustoPedraza/vibe-ash-svelte-template",
    "current_stack": {
      "backend": ["phoenix", "liveview"],
      "frontend": ["liveview"]
    }
  }
}
```

## MORE INFO

- Framework: `~/.claude/vibe-ash-svelte/`
- Roles: `~/.claude/vibe-ash-svelte/roles/`
- Checklists: `~/.claude/vibe-ash-svelte/checklists/`
- Patterns: `~/.claude/vibe-ash-svelte/patterns/`
- Templates: `~/.claude/vibe-ash-svelte/templates/`
