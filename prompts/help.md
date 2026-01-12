# /vibe - AI-Assisted Development Workflow

## USAGE

```
/vibe <command> [options]
```

## COMMANDS

| Command | Description |
|---------|-------------|
| `/vibe [FEATURE-ID]` | Implement feature (QA -> Designer -> Dev -> QA) |
| `/vibe plan [sprint]` | Plan sprint (Domain -> Designer -> PM) |
| `/vibe status` | Show current progress |
| `/vibe retro` | Capture learnings, extract reusable patterns |

## OPTIONS

| Option | Description |
|--------|-------------|
| `--help`, `-h` | Show this help |
| `--config` | Show project config |
| `--roles` | List available roles |

## EXAMPLES

```bash
/vibe AUTH-001        # Implement login feature
/vibe plan sprint-1   # Plan Sprint 1 features
/vibe retro           # Run retrospective with pattern extraction
/vibe status          # Show implementation progress
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

## PATTERN DISCOVERY

During retrospective (`/vibe retro`), AI will:
1. Scan implementation for reusable patterns
2. Score pattern reusability (HIGH/MEDIUM)
3. Suggest extraction to `~/.claude/vibe-framework/patterns/`
4. User approves which patterns to promote

Promoted patterns are available across all projects.

## MORE INFO

- Framework: `~/.claude/vibe-framework/`
- Roles: `~/.claude/vibe-framework/roles/`
- Checklists: `~/.claude/vibe-framework/checklists/`
- Patterns: `~/.claude/vibe-framework/patterns/`
