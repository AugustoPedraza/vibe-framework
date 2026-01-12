# Vibe Orchestrator

> Master workflow that coordinates roles with clear phase separation for production-level code.

---

## Development Philosophy: Vertical Slices

> **Build complete features end-to-end, not horizontal layers.**

### What This Means

Instead of:
- Build all resources -> then all views -> then all components

Do:
- Build LOGIN feature completely (User resource -> LoginView -> LoginForm)
- Then build next feature completely (Resource -> View -> Component)

### Implementation Principles

1. **Feature-First** - Each `/vibe [ID]` implements one complete vertical slice
2. **YAGNI** - Don't build infrastructure "just in case"
3. **Aspirational Docs** - Architecture docs describe end state, not starting point
4. **Pull, Don't Push** - Reference patterns from architecture docs as needed

**Each feature adds only what it needs. Infrastructure emerges from features.**

---

## Usage

| Command | What it does |
|---------|--------------|
| `/vibe [FEATURE-ID]` | Implement feature (QA -> Designer -> Dev -> QA) |
| `/vibe plan [sprint]` | Plan sprint (Domain -> Designer -> PM) |
| `/vibe discover [ID]` | Pre-planning discovery for a single feature |
| `/vibe debt [desc]` | Capture technical debt with triage |
| `/vibe review [scope]` | Multi-agent code review with fresh context |
| `/vibe status` | Show current progress |
| `/vibe retro` | Capture learnings, extract patterns |
| `/vibe --help` | Show command reference |

---

## Context Loading (Before Any Work)

**Always read silently before starting:**

### WHY (Business Value)
- `{{paths.domain}}/vision.md` - Product vision
- `{{paths.domain}}/index.md` - Sprint overview
- Project config: `.claude/vibe.config.json`

### WHAT (What We're Building)
- `{{paths.domain}}/GLOSSARY.md` - Domain terms
- `{{paths.features}}/{area}/{ID}.md` - Feature spec
- `{{paths.domain}}/SCENARIO_FORMAT.md` - BDD format

### HOW (How We Build)
- `{{paths.architecture}}/_fundamentals/quick-reference.md` - Core decisions
- `{{paths.architecture}}/_fundamentals/responsibility.md` - Frontend vs backend
- `{{paths.architecture}}/_guides/testing.md` - Test patterns
- `{{paths.architecture}}/_anti-patterns/` - What NOT to do
- `~/.claude/vibe-ash-svelte/patterns/` - Reusable patterns

---

## Project Validation (REQUIRED - Session Start)

**Before ANY /vibe command, validate the project structure.**

### Required Structure

```
{project}/
├── .claude/
│   └── vibe.config.json          # REQUIRED - Project configuration
├── architecture/                  # REQUIRED - Technical decisions
│   ├── README.md
│   ├── _index.md
│   ├── _fundamentals/            # At least quick-reference.md
│   ├── _guides/                  # At least one guide
│   ├── _patterns/
│   ├── _anti-patterns/
│   └── _checklists/
└── docs/domain/                   # REQUIRED - Product specs
    ├── GLOSSARY.md
    ├── vision.md
    ├── index.md
    └── features/                  # At least one feature spec
```

### Validation Steps

1. **Read `.claude/vibe.config.json`**
   - If missing: HARD BLOCK. Ask user to create config.

2. **Check `architecture/` exists with required categories**
   - If missing: HARD BLOCK. Offer to scaffold from template.

3. **Check `docs/domain/` exists with required files**
   - If missing: HARD BLOCK. Offer to scaffold minimal domain structure.

### Scaffolding from Template

When scaffolding is needed, read files from:
`~/projects/vibe-ash-svelte-template/`

Copy directory structures, then customize based on vibe.config.json.

### Hard Block Message Format

When validation fails, display:

```
⚠️ VIBE FRAMEWORK: Project structure incomplete

Missing:
  ✗ architecture/_fundamentals/quick-reference.md
  ✗ docs/domain/GLOSSARY.md

Options:
  1. Scaffold from template (I'll create the missing files)
  2. Point me to existing docs (if they're in a different location)
  3. Skip validation (NOT RECOMMENDED - workflow may fail)

Which option?
```

### Session Tracking

After successful validation, note that validation passed for this session.
Do NOT re-validate on subsequent /vibe commands in the same conversation.

---

## Template Sync (AI-Driven)

When user runs `/vibe check` or requests sync:

### Sync Process

1. **Read Template File**
   - Path: `~/projects/vibe-ash-svelte-template/architecture/{path}`
   - Read entire contents

2. **Read Project File**
   - Path: `{project}/architecture/{path}`
   - Read entire contents

3. **Compare & Explain**
   - Show what's different
   - Note any project-specific customizations that would be lost
   - Explain WHY template has certain content (if obvious)

4. **Offer Options**
   - Merge from template (overwrite project file)
   - Keep project version
   - Merge specific sections (AI identifies mergeable parts)

5. **Execute via Edit tool**
   - If user approves, use Edit tool to update project file
   - No external scripts needed

### Divergence Types

| Type | AI Action |
|------|-----------|
| Template has new section | Propose adding section to project |
| Project has custom section | Keep project version, note in report |
| Same section, different content | Show diff, let user decide |
| Project missing entire file | Propose copying from template |

---

## Phase Separators

Display when switching roles:

```
+======================================================================+
|  [ICON] [ROLE] PHASE                                                 |
|  [Context: Feature/Scenario/Task]                                    |
+======================================================================+
```

**Icons:**
- `QA` QA ENGINEER
- `DEV` DEVELOPER
- `DOM` DOMAIN ARCHITECT
- `UX` DESIGNER
- `PM` AGILE PM
- `REV` CODE REVIEWER
- `OPS` DEVOPS
- `RET` RETROSPECTIVE

---

## Task Implementation Workflow

**Trigger:** `/vibe [FEATURE-ID]`

### Phase 1: QA Engineer (Test Generation)

```
+======================================================================+
|  QA ENGINEER PHASE                                                   |
|  Feature: [ID] - [Title]                                             |
+======================================================================+
```

1. Load context (WHY + WHAT + HOW)
2. Load role: `~/.claude/vibe-ash-svelte/roles/qa-engineer.md`
3. Read feature spec: `{{paths.features}}/{area}/{ID}.md`
4. Extract acceptance scenarios (Given/When/Then)
5. **Check UX Test Requirements:**
   - [ ] Skeleton/loading state test
   - [ ] Error state test
   - [ ] Empty state test
   - [ ] Offline behavior test (if PWA)
   - [ ] Accessibility (aria-labels, focus management)
6. Generate test stubs
7. **CHECKPOINT** - Wait for Enter

### Phase 2: Designer (UX Verification)

```
+======================================================================+
|  DESIGNER PHASE                                                      |
|  Feature: [ID] - [Title]                                             |
+======================================================================+
```

1. Load role: `~/.claude/vibe-ash-svelte/roles/designer.md`
2. Load checklist: `~/.claude/vibe-ash-svelte/checklists/ux-pwa.md`
3. Verify UI requirements from feature spec
4. Confirm component selection (existing vs new)
5. Check UX requirements:
   - [ ] Offline behavior defined
   - [ ] Touch targets >= 44px
   - [ ] Loading/error/empty states specified
   - [ ] Haptic feedback points identified (if mobile)
6. **CHECKPOINT** - Wait for Enter

### Phase 3: Developer (Implementation)

```
+======================================================================+
|  DEVELOPER PHASE                                                     |
|  Implementing: [ID] - [Scenario Name]                                |
+======================================================================+
```

For EACH scenario:
1. Load role: `~/.claude/vibe-ash-svelte/roles/developer.md`
2. Run test -> Show **RED** failure
3. Propose implementation approach
4. **Implement incrementally** (only what this scenario needs)
5. **UX Implementation Checklist:**
   - [ ] Touch targets >= 44px
   - [ ] No spinners (use skeleton loaders)
   - [ ] Safe area insets respected
   - [ ] Animation uses motion tokens
   - [ ] `prefers-reduced-motion` respected
6. Run test -> Show **GREEN** pass
7. **CHECKPOINT** - Wait for Enter
   - For **bootstrap features**, show "Patterns Established" summary

**YAGNI Reminder**: If you're creating something the current scenario doesn't test, STOP.

Repeat for all scenarios.

### Phase 4: QA Validation

```
+======================================================================+
|  QA VALIDATION PHASE                                                 |
|  Running: Full test suite                                            |
+======================================================================+
```

1. Run tests -> Show results
2. Run quality checks -> Show results
3. **UX Verification:**
   - [ ] Component lint passes
   - [ ] No raw colors (design tokens only)
   - [ ] No hardcoded z-index
   - [ ] PWA manifest valid (if PWA)
4. If all pass -> Offer to create PR
5. **CHECKPOINT** - Wait for Enter
6. Create PR with scenario checklist
7. Offer retro: "Quick retro? [Enter] Yes [s] Skip"

---

## Checkpoint Template

After each phase:

```
+---------------------------------------------------------------------+
|  [PHASE NAME] COMPLETE                                              |
|                                                                     |
|  [Summary of what was done]                                         |
|  * Item 1                                                           |
|  * Item 2                                                           |
|                                                                     |
|  Next: [What's coming]                                              |
|                                                                     |
|  Press Enter to continue...                                         |
+---------------------------------------------------------------------+
```

**ALWAYS wait for user input. Never auto-continue.**

---

## Context Management

### When to Clear Context

Use `/clear` to reset context and prevent degradation:

| Trigger | Action |
|---------|--------|
| After completing a feature | `/clear` before starting next feature |
| After sprint planning | `/clear` before implementation begins |
| Context feels "stale" | `/clear` and re-load relevant docs |
| After long debugging session | `/clear` to reset focus |

### Feature Completion Checkpoint

After QA Validation phase passes, show:

```
+---------------------------------------------------------------------+
|  FEATURE COMPLETE: [ID]                                              |
|                                                                      |
|  Ready for: PR creation / Next feature                               |
|                                                                      |
|  RECOMMENDED: Run /clear before starting next feature                |
|  (Prevents context degradation across features)                      |
|                                                                      |
|  [p] Create PR  [n] Next feature  [c] Clear & continue               |
+---------------------------------------------------------------------+
```

---

## Sprint Planning Workflow

**Trigger:** `/vibe plan [sprint]`

### Phase 0: Load Context
- Read all feature specs
- Read vision, glossary, design system

### Phase 1: Domain Architect

```
+======================================================================+
|  DOMAIN ARCHITECT PHASE                                              |
|  Feature: [ID] - [Title]                                             |
+======================================================================+
```

- Load role: `~/.claude/vibe-ash-svelte/roles/domain-architect.md`
- Define/refine BDD scenarios
- **Identify Bootstrap Patterns** for early features
- **CHECKPOINT** after each feature

### Phase 2: Designer

```
+======================================================================+
|  DESIGNER PHASE                                                      |
|  Feature: [ID] - [Title]                                             |
+======================================================================+
```

- Load role: `~/.claude/vibe-ash-svelte/roles/designer.md`
- Create wireframes
- Define states (loading, error, empty)
- **CHECKPOINT** after each feature

### Phase 3: Agile PM

```
+======================================================================+
|  AGILE PM PHASE                                                      |
|  Sprint: [Name]                                                      |
+======================================================================+
```

- Load role: `~/.claude/vibe-ash-svelte/roles/agile-pm.md`
- Review completeness
- Create GitHub issues
- **CHECKPOINT** before creating issues

---

## Retrospective Workflow

**Trigger:** `/vibe retro` or automatic at end of task

```
+======================================================================+
|  RETROSPECTIVE                                                       |
|  Session: [Feature ID] Implementation                                |
+======================================================================+
```

### Step 1: Gather Feedback

```
+---------------------------------------------------------------------+
|  What went well?                                                    |
|  * [AI summarizes smooth parts]                                     |
|                                                                     |
|  What was friction?                                                 |
|  * [AI identifies where user intervened]                            |
|                                                                     |
|  Anything missing from docs?                                        |
|  * [AI notes gaps encountered]                                      |
|                                                                     |
|  Your feedback: _______________                                     |
+---------------------------------------------------------------------+
```

### Step 2: Pattern Analysis

AI scans implementation for potential reusable patterns:

```
+---------------------------------------------------------------------+
|  POTENTIAL REUSABLE PATTERNS DETECTED                               |
|                                                                     |
|  1. [BACKEND] Pattern name                                          |
|     File: path/to/file.ext:line                                     |
|     Reusability: HIGH/MEDIUM                                        |
|     Suggested: patterns/backend/pattern-name.md                     |
|                                                                     |
|  2. [FRONTEND] Pattern name                                         |
|     File: path/to/file.ext:line                                     |
|     Reusability: MEDIUM                                             |
|     Suggested: patterns/frontend/pattern-name.md                    |
|                                                                     |
|  Select patterns to promote: [1,2] [a]ll [n]one [e]dit              |
+---------------------------------------------------------------------+
```

### Step 3: Apply & Log

If approved:
1. Apply doc improvements to target files
2. Extract selected patterns to `~/.claude/vibe-ash-svelte/patterns/`
3. Append session summary to `.claude/learnings.md`
4. Commit changes to vibe-ash-svelte repo

---

## Feature Discovery Workflow

**Trigger:** `/vibe discover [FEATURE-ID]`

```
+======================================================================+
|  DISC DISCOVERY PHASE                                                |
|  Feature: [ID]                                                       |
+======================================================================+
```

### Purpose

Lightweight pre-planning for a single feature:
- Research requirements and industry patterns
- Create wireframes (mobile-first)
- Draft scenarios (marked as DRAFT, not finalized)
- Identify risks and unknowns
- Output: Discovery document

**Does NOT create GitHub issues** (use `/vibe plan` for that).

### Phases

1. **Context Loading** - Read vision, glossary, check existing spec
2. **Research** - Industry patterns, user journey, component audit
3. **Wireframe** - Draft UI/UX with states (loading/error/empty/success)
4. **Draft Scenarios** - Given/When/Then (Domain Architect lens)
5. **Risk Identification** - Technical risks, unknowns, dependencies
6. **Document** - Generate discovery spec at `{{paths.features}}/{area}/{ID}.md`

**CHECKPOINT after each phase. Never auto-continue.**

Load command: `~/.claude/vibe-ash-svelte/prompts/commands/discover.md`

---

## Technical Debt Workflow

**Trigger:** `/vibe debt [description]` or AI-detected during development

```
+======================================================================+
|  DEBT TECHNICAL DEBT CAPTURE                                         |
|  Context: [Current Feature] - [Current Phase]                        |
+======================================================================+
```

### Purpose

Capture technical debt or out-of-scope items with user decision on priority.

### Workflow

1. **Capture** - Description, category, effort, context
2. **User Decision** (CHECKPOINT):
   - `now` - Pause current work, address immediately
   - `later` - Add to sprint, continue current work
   - `backlog` - Add to future, continue current work
   - `skip` - Don't record, continue
3. **Record** - Update `.claude/backlog.md` based on decision

**ALWAYS wait for user decision. Never auto-triage.**

### Categories

- `tech-debt` - Code quality, architecture issues
- `out-of-scope` - Feature scope creep, new requirements
- `improvement` - Enhancement opportunities
- `refactor` - Code restructuring needs

Load command: `~/.claude/vibe-ash-svelte/prompts/commands/debt.md`

---

## Anti-Patterns (NEVER DO)

- Auto-continue without checkpoint
- Skip showing RED test failures
- Implement multiple scenarios at once
- Create PR without all tests passing
- Skip context loading
- Ignore role guidance
- Make assumptions without reading feature spec
- Skip UX/Designer phase
- Ignore UX checklists in phases
- Implement bootstrap feature without identifying patterns

---

## Role Loading Reference

| Phase | Role File | Key Focus |
|-------|-----------|-----------|
| QA (test gen) | `qa-engineer.md` | BDD -> AAA, test types, UX tests |
| Designer | `designer.md` | UX verification, component selection |
| Developer | `developer.md` | TDD, patterns, UX implementation |
| QA (validation) | `qa-engineer.md` | Quality gates, UX verification |
| Domain | `domain-architect.md` | Scenarios, glossary |
| PM | `agile-pm.md` | Issues, dependencies |
| DevOps | `devops.md` | CI/CD, deployment |
| Review | `code-reviewer.md` | Security, patterns |
