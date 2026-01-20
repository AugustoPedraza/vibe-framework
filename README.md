# Vibe Ash+Svelte Framework

> AI-optimized development workflow for Ash + LiveSvelte projects with role-based phases, UX integration, and intelligent parallelization

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
/vibe AUTH-001                    # Implement feature (auto-detects full vs quick)
/vibe quick "fix login button"    # Bug/hotfix (condensed 2-phase workflow)
/vibe plan sprint-1               # Plan sprint
/vibe discover AUTH-003           # Pre-planning discovery
/vibe pivot                       # Course correction when stuck
/vibe debt "Need error handling"  # Capture tech debt
/vibe retro                       # Run retrospective
/vibe --help                      # Show help
```

---

## Commands

| Command | Description |
|---------|-------------|
| `/vibe [ID]` | Implement feature (auto-detects quick vs full workflow) |
| `/vibe quick [desc]` | Bug/hotfix mode (condensed 2-phase: Dev -> Verify) |
| `/vibe pivot` | Course correction when implementation diverges |
| `/vibe plan [sprint]` | Plan sprint (Domain -> Designer -> PM) with parallel analysis |
| `/vibe discover [ID]` | Pre-planning discovery with parallel research agents |
| `/vibe check` | Validate project structure + template sync status |
| `/vibe debt [desc]` | Capture technical debt with triage |
| `/vibe review [scope]` | Multi-agent code review (3 parallel agents: security, perf, patterns) |
| `/vibe status` | Show current progress + debt summary |
| `/vibe retro` | Retrospective with pattern extraction + debt review |
| `/vibe migrate init` | Initialize migration project (analyze current state) |
| `/vibe migrate [FEATURE]` | Create migration spec for existing feature |
| `/vibe migrate status` | Show migration progress |
| `/vibe explore [topic]` | Think through ideas without committing (OpenSpec-inspired) |
| `/vibe validate [ID]` | Validate feature spec completeness before implementation |
| `/vibe archive [ID]` | Archive completed feature, merge deltas into specs |
| `/vibe --help` | Show command reference |

---

## AI Optimization (Auto-Managed)

The framework is **AI-optimized** - AI makes optimal decisions automatically without user configuration.

### Task Type Detection

AI automatically detects the appropriate workflow:

| Task Type | Indicators | Workflow |
|-----------|------------|----------|
| **Hotfix/Typo** | "urgent", "typo", "copy fix", single file | Skip to implementation |
| **Bug Fix** | "bug", "fix", existing behavior, 2-3 files | `/vibe quick` (2 phases) |
| **Standard Feature** | Multiple scenarios, new component | Full workflow (4 phases) |

### Intelligent Parallelization

AI spawns parallel agents when beneficial:

| Command | Parallelization |
|---------|-----------------|
| `/vibe discover` | 3 agents (industry patterns, component audit, related features) |
| `/vibe review` | 3 agents (security, performance, pattern compliance) |
| `/vibe plan` | 1 agent per feature (for 3+ features) |
| QA Test Generation | Parallel by test type (unit, integration, e2e) |

### When AI Parallelizes

**DO parallelize when:**
- Task involves 3+ independent concerns
- Scope is discovery, review, or planning

**DON'T parallelize when:**
- Task is simple (single file, bug fix)
- Results depend on each other (implementation)

### Readiness Gate

Before Developer phase, AI verifies **ALL conditions** or hard blocks:

- All scenarios have Given/When/Then
- UI states defined (loading/error/empty/success)
- No open questions marked BLOCKING
- Dependencies available

---

## Workflow Phases

### Feature Implementation (`/vibe [ID]`) - Full Workflow

```
1. QA Engineer    -> Generate tests from scenarios + UX tests
2. Designer       -> UX verification & component selection
   ─── READINESS GATE ─── (AI verifies all conditions or blocks)
3. Developer      -> TDD implementation with UX checklist
4. QA Validation  -> Quality gates + UX verification
```

### Bug/Hotfix (`/vibe quick [desc]`) - Condensed Workflow

```
1. DEV PHASE     -> Read code, write minimal test, implement fix, run tests
2. VERIFY PHASE  -> Full test suite, `just check`, offer commit
```

### Course Correction (`/vibe pivot`)

```
1. ASSESS  -> What was planned vs what happened
2. DECIDE  -> Update spec / Change approach / Capture debt / Rollback
3. RESUME  -> Return to appropriate phase
```

### Sprint Planning (`/vibe plan [sprint]`)

```
1. Domain Architect -> Define scenarios (parallel agents for 3+ features)
2. Designer         -> Create wireframes, define states
3. Agile PM         -> Create GitHub issues
```

### Feature Discovery (`/vibe discover [ID]`)

```
1. Context Loading  -> Understand the feature
2. Research         -> 3 parallel agents (industry patterns, components, related features)
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

## Spec-Driven Development (OpenSpec-Inspired)

The framework supports **spec-driven development** with clear separation between authoritative specifications and change proposals.

### Core Concept: Specs vs Changes

```
specs/           ← Source of truth (what IS)
features/        ← Change proposals (what will CHANGE)
```

### Directory Structure

```
{project}/.claude/
├── specs/                    # Authoritative specifications
│   ├── domains/              # Domain specs (auth, billing, etc.)
│   │   ├── auth.md
│   │   └── users.md
│   ├── api.md                # API contracts
│   └── events.md             # Domain events
│
└── features/
    ├── active/               # In-progress features
    │   └── AUTH-001/
    │       ├── spec.md       # Feature specification
    │       └── delta.md      # Changes to domain specs
    │
    └── archived/             # Completed features
        └── AUTH-001/
```

### Spec-Driven Commands

| Command | Purpose |
|---------|---------|
| `/vibe explore [topic]` | Think through ideas before committing to structure |
| `/vibe validate [ID]` | Check spec completeness before implementation |
| `/vibe archive [ID]` | Finalize feature, merge deltas into authoritative specs |

### Complete Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. EXPLORE                                                          │
│     /vibe explore "social login"                                     │
│     → Think through scope, edge cases, related specs                 │
│     → No files created until ready                                   │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  2. FORMALIZE                                                        │
│     Create spec in features/active/AUTH-003/                         │
│     → spec.md (feature specification)                                │
│     → delta.md (ADDED/MODIFIED/REMOVED domain changes)               │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  3. VALIDATE                                                         │
│     /vibe validate AUTH-003                                          │
│     → Check structure completeness                                   │
│     → Verify scenarios have Given/When/Then                          │
│     → Confirm UX states defined                                      │
│     → Check consistency with existing specs                          │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  4. IMPLEMENT                                                        │
│     /vibe AUTH-003                                                   │
│     → Full 4-phase workflow (QA → Designer → Dev → QA)               │
│     → TDD implementation                                             │
│     → Quality scoring                                                │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  5. ARCHIVE                                                          │
│     /vibe archive AUTH-003                                           │
│     → Verify all tests pass                                          │
│     → Merge delta.md into specs/domains/auth.md                      │
│     → Move feature to archived/                                      │
│     → Create living documentation                                    │
└─────────────────────────────────────────────────────────────────────┘
```

### Delta Tracking

For brownfield features (modifying existing behavior), create `delta.md`:

```markdown
## ADDED Requirements

### OAuth Integration
The system SHALL support OAuth 2.0 providers.

#### Scenario: Google OAuth Login
- Given a user clicks "Sign in with Google"
- When they complete the OAuth flow
- Then they SHALL be authenticated

## MODIFIED Requirements

### Session Duration
**Was:** Sessions expire after 24 hours
**Now:** Sessions SHALL expire after 7 days for "remember me"

## REMOVED Requirements

### SMS Password Reset
Removed because: Security concerns with SMS interception
```

### When to Use Each Command

| Situation | Command |
|-----------|---------|
| New idea, unsure of scope | `/vibe explore` |
| Ready to formalize | Create spec manually |
| Before starting implementation | `/vibe validate` |
| Implementation work | `/vibe [ID]` |
| Feature complete | `/vibe archive` |

### Templates

| Template | Location | Purpose |
|----------|----------|---------|
| Domain Spec | `templates/specs/DOMAIN-TEMPLATE.md` | New domain specifications |
| API Spec | `templates/specs/API-TEMPLATE.md` | API documentation |
| Feature Spec | `templates/features/FEATURE-TEMPLATE.md` | Feature specifications |
| Delta | `templates/features/DELTA-TEMPLATE.md` | Change tracking |

---

## Structure

```
~/.claude/vibe-ash-svelte/
├── README.md           # This file
├── prompts/
│   ├── vibe.md         # Master orchestrator (includes AI optimization)
│   ├── help.md         # /vibe --help output
│   └── commands/
│       ├── check.md    # Project validation + template sync
│       ├── quick.md    # Bug/hotfix condensed workflow
│       ├── pivot.md    # Course correction when stuck
│       ├── plan.md     # Sprint planning (parallel features)
│       ├── discover.md # Feature discovery (parallel research)
│       ├── explore.md  # Think through ideas (OpenSpec-inspired)
│       ├── validate.md # Validate spec completeness
│       ├── archive.md  # Archive feature, merge to specs
│       ├── debt.md     # Technical debt capture
│       ├── review.md   # Multi-agent code review (parallel)
│       ├── status.md   # Progress display
│       ├── retro.md    # Retrospective + pattern promotion
│       └── migrate.md  # Strangler fig migration workflow
├── roles/
│   ├── developer.md
│   ├── designer.md
│   ├── qa-engineer.md
│   ├── domain-architect.md
│   ├── agile-pm.md
│   ├── multi-agent-liaison.md
│   └── _shared/        # Shared content across roles
│       ├── architecture-refs.md
│       ├── thinking-triggers.md
│       └── platform-constraints.md
├── checklists/
│   ├── ux-pwa.md
│   ├── accessibility.md
│   └── quality.md
├── patterns/
│   ├── README.md
│   ├── TEMPLATE.md
│   ├── index.json      # Semantic pattern index (RAG-lite)
│   ├── backend/
│   ├── frontend/
│   ├── pwa/
│   └── ux/
├── templates/
│   ├── architecture/
│   │   ├── _current/   # Templates for current state docs
│   │   └── _target/    # Templates for target state docs
│   ├── features/
│   │   ├── FEATURE-TEMPLATE.md
│   │   ├── DELTA-TEMPLATE.md   # Change tracking (OpenSpec)
│   │   └── MIGRATE-TEMPLATE.md
│   ├── specs/          # Authoritative spec templates
│   │   ├── README.md
│   │   ├── DOMAIN-TEMPLATE.md
│   │   └── API-TEMPLATE.md
│   ├── handoffs/       # Structured phase handoffs
│   │   ├── qa-to-designer.json
│   │   └── designer-to-developer.json
│   ├── checkpoint-schema.json
│   └── migration.md    # Progress tracking template
├── docs/
│   └── openspec-comparison.md  # OpenSpec analysis
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

---

## Migration Mode (Strangler Fig)

For migrating existing projects to Ash+Svelte incrementally using the strangler fig pattern.

### What is Strangler Fig?

- Keep old code running
- Build new features in Ash+Svelte
- Gradually migrate existing features
- Eventually retire legacy code

### Safety Rule

> **HARD RULE**: No migration without regression tests first.
> Tests must be written in **target architecture** (ExUnit + Ash, Vitest + Svelte).
> Tests must pass against **legacy code** before migration starts.

### Setup

1. **Add migration config** to `.claude/vibe.config.json`:

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

2. **Run `/vibe check`** to scaffold migration structure:

```
architecture/
├── _current/              # Document existing system
│   ├── overview.md
│   ├── features.md
│   ├── database.md
│   └── api.md
└── _target/               # Target architecture (from template)
    └── README.md

docs/domain/features/
├── _current/              # Legacy feature specs
└── new/                   # New Ash+Svelte features

.claude/migration.md       # Progress tracking
```

3. **Run `/vibe migrate init`** to analyze codebase

### Migration Workflow

```
1. /vibe migrate init         # Analyze current state, populate docs
2. /vibe migrate FEATURE      # Create migration spec + test requirements
3. (write regression tests)   # In target architecture
4. (verify tests pass legacy) # Tests must work against old code
5. /vibe MIGRATE-FEATURE      # Implement migration (blocked until tests pass)
6. (verify tests pass new)    # Same tests against new implementation
7. (switch routes)            # Route traffic to new code
8. (remove legacy)            # Clean up old code
```

### Migration Commands

| Command | Purpose |
|---------|---------|
| `/vibe migrate init` | Analyze codebase, create architecture docs |
| `/vibe migrate [FEATURE]` | Create migration spec with test requirements |
| `/vibe migrate status` | Show migration progress |
| `/vibe MIGRATE-[FEATURE]` | Implement migration (requires passing tests) |
| `/vibe NEW-[ID]` | Build new feature directly in Ash+Svelte |

### Migration Readiness Gate

Before `/vibe MIGRATE-FEATURE` can proceed:

```
Migration Readiness Check:
[x] Regression tests written (target architecture)
[x] Tests pass against legacy code
[x] All BDD scenarios have corresponding tests
[x] Edge cases covered

✓ READY FOR IMPLEMENTATION
```

If any condition fails → **HARD BLOCK** until tests pass.

### Key Principles

1. **Target Architecture** = [vibe-ash-svelte-template](https://github.com/AugustoPedraza/vibe-ash-svelte-template)
2. **Shared Database** = Both old and new code access same tables during migration
3. **No Schema Changes** = Until legacy code is fully removed
4. **Tests First** = Regression tests capture current behavior before migration
5. **Incremental** = Migrate one feature at a time
