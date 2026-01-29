# /vibe - AI-Assisted Development Workflow

## USAGE

```
/vibe <command> [options]
```

## COMMANDS

### Core Implementation

| Command | Description |
|---------|-------------|
| `/vibe [FEATURE-ID]` | Implement feature (parallel agents with continuous QA) |
| `/vibe quick [desc]` | Bug/hotfix mode (condensed single-agent workflow) |
| `/vibe pivot` | Course correction when implementation diverges |
| `/vibe fix [desc]` | Targeted issue fixing (Phase 4 polish workflow) |

### AI Generation

| Command | Description |
|---------|-------------|
| `/vibe generate [ID]` | Generate scaffold from feature spec ui_spec |
| `/vibe lint [path]` | UX Governor - validate tokens, states, accessibility |
| `/vibe convert-story [ID]` | Convert BMAD story to Vibe feature spec |

### Code Quality

| Command | Description |
|---------|-------------|
| `/vibe review [scope]` | Multi-agent code review (fresh context) |
| `/vibe analyze [scope]` | On-demand refactoring and anti-pattern analysis |

### Spec-Driven

| Command | Description |
|---------|-------------|
| `/vibe explore [topic]` | Think through ideas without committing to structure |
| `/vibe validate [ID]` | Validate feature spec completeness and consistency |
| `/vibe archive [ID]` | Archive completed feature, merge deltas into specs |
| `/vibe tracer [path]` | Trace architecture dependencies |

### Learning & Patterns

| Command | Description |
|---------|-------------|
| `/vibe learn [ID]` | Continuous learning extraction (patterns, pitfalls) |
| `/vibe patterns [action]` | Search, browse, and manage patterns |

### Migration

| Command | Description |
|---------|-------------|
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
# Core Implementation
/vibe AUTH-001                    # Implement login feature (parallel agents)
/vibe AUTH-001 --quick            # Single agent mode for simple tasks
/vibe quick "fix login button"    # Quick bug fix
/vibe fix "socket prop missing"   # Targeted fix for specific issue
/vibe pivot                       # Course correction when stuck

# AI Generation
/vibe generate AUTH-001           # Generate scaffold from spec
/vibe lint                        # Validate all components
/vibe lint assets/svelte/         # Validate specific path
/vibe convert-story 1.2           # Convert BMAD Story 1.2 to Vibe spec

# Code Quality
/vibe review                      # Review staged changes
/vibe review AUTH-001             # Review feature implementation
/vibe review --security           # Security-focused review
/vibe review --all                # Full review with refactoring + anti-patterns
/vibe analyze                     # Analyze staged changes
/vibe analyze AUTH-001            # Analyze feature implementation
/vibe analyze --all               # Full codebase analysis

# Spec-Driven
/vibe explore "social login"      # Free-form ideation
/vibe explore --discover AUTH-003 # Structured discovery with wireframes
/vibe explore --from-spec AUTH-001 # Explore extensions
/vibe validate AUTH-001           # Check spec completeness
/vibe archive AUTH-001            # Archive and merge to specs

# Learning & Patterns
/vibe learn                       # Extract learnings from current session
/vibe learn AUTH-001              # Extract learnings from specific feature
/vibe patterns                    # List all patterns
/vibe patterns search "form"      # Search patterns
/vibe patterns show <id>          # Show pattern details
/vibe patterns stats              # Show usage statistics

# Migration (for existing projects)
/vibe migrate init                # Analyze and document current state
/vibe migrate PROFILE             # Create migration spec for profile feature
/vibe migrate status              # Show migration progress
```

## WORKFLOW PHASES (per feature)

```
PHASE 0: CONTRACT
├── Parse feature spec
├── Generate agent assignments
└── Lock contract

PHASE 1: PARALLEL IMPLEMENTATION
├── Domain Agent (opus)    ─┐
├── UI Agent (sonnet)      ─┼─> Work in parallel
├── Data Agent (sonnet)    ─┘
├── QA Watchers (background)
└── Quality Policers (background)

PHASE 2: INTEGRATION
├── API Agent (opus) - wiring
├── E2E tests
└── GATE: Blockers must resolve

PHASE 3: VALIDATION
├── Aggregate reports
├── Refactoring analysis
├── Quality score
└── GATE: Must pass

PHASE 4: POLISH
├── Polish watcher suggestions
├── Auto-fix option
└── PR creation

PHASE 5: LEARNING (automatic)
├── Pattern extraction
├── Pitfall generation
└── Update indexes
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
- New features → Uses full 5-phase workflow
- Complex tasks → Uses parallel agents

**Parallelization (automatic):**
- Implementation: 3 agents (domain, ui, data)
- QA: 4 watchers + 2 policers (continuous)
- Review: 3 agents (security, performance, patterns)

**Context Management:**
- AI recommends `/clear` when switching features
- Uses Explore agents for fresh context on codebase questions

## NEW AGENTS

### Quality Policers (Phase 1-2)
- **best-practices-policer** - Enforces Ash, Svelte 5, Phoenix patterns
- **anti-pattern-detector** - Catches architecture violations, N+1 queries

### Analyzers (Phase 3)
- **refactoring-analyzer** - Code smells, technical debt scoring

### Learning (Phase 5)
- **continuous-learning-agent** - Pattern extraction, pitfall generation

## PATTERN DISCOVERY

During `/vibe learn` or automatically in Phase 5:
1. Analyze human interventions for pitfall generation
2. Scan implementation for reusable patterns
3. Score pattern reusability (HIGH/MEDIUM/LOW)
4. Promote HIGH patterns to `patterns/`
5. Update pattern index with usage stats

Promoted patterns are available across all projects.

## MIGRATION MODE

For migrating existing projects to Ash+Svelte using strangler fig pattern:

**Setup:**
1. Add `migration.enabled: true` to `.claude/vibe.config.json`
2. Run `/vibe migrate init` to analyze current codebase

**Workflow:**
```
/vibe migrate init       # Document current state
/vibe migrate FEATURE    # Create migration spec
(write tests)            # Tests in target architecture
/vibe MIGRATE-FEATURE    # Implement migration
```

**Safety Rule:** NO migration without regression tests first.

## MORE INFO

- Framework: `~/.claude/vibe-ash-svelte/`
- Agents: `~/.claude/vibe-ash-svelte/agents/`
- Patterns: `~/.claude/vibe-ash-svelte/patterns/`
- Checklists: `~/.claude/vibe-ash-svelte/checklists/`
- Templates: `~/.claude/vibe-ash-svelte/templates/`
