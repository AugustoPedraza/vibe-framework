# Explore Command

> `/vibe explore [topic]` - Think through ideas without committing to structure

## Purpose

Exploration mode for early-stage ideation. Allows thinking through problems, discovering requirements, and validating approaches before formalizing into a feature spec. No artifacts created until explicitly requested.

**Supports two modes:**
- **Free-form exploration** - Open-ended thinking and ideation
- **Structured discovery** - Formal discovery phases with wireframes, scenarios, and risk assessment

## Usage

```
/vibe explore "social login"              # Explore a topic (free-form)
/vibe explore                             # Continue current exploration
/vibe explore --related AUTH              # Explore related to existing features
/vibe explore --from-spec AUTH-001        # Explore extensions to existing spec
/vibe explore --discover [FEATURE-ID]     # Structured discovery mode
```

---

## Workflow

```
Topic -> Context Scan -> Guided Discovery -> Decision Point -> [Formalize | Continue | Exit]
```

---

## Step 1: Topic Introduction

```
+=====================================================================+
|  EXPLORE MODE                                                        |
|                                                                      |
|  Topic: {user's topic}                                               |
|                                                                      |
|  This is a thinking space. No files created until you're ready.      |
|  I'll help you think through the problem before committing.          |
+=====================================================================+
```

---

## Step 2: Context Scan

Automatically scan for relevant context:

```
+---------------------------------------------------------------------+
|  CONTEXT SCAN                                                        |
|                                                                      |
|  Related domain specs:                                               |
|  - specs/domains/auth.md (current auth implementation)               |
|  - specs/domains/users.md (user data model)                          |
|                                                                      |
|  Related features:                                                   |
|  - AUTH-001: User Login (status: complete)                           |
|  - AUTH-002: Password Reset (status: in_progress)                    |
|                                                                      |
|  Potentially relevant patterns:                                      |
|  - async-result-extraction (OAuth callbacks)                         |
|  - liveview-navigation (post-login redirect)                         |
|                                                                      |
|  Architecture constraints:                                           |
|  - Phoenix LiveView for real-time UI                                 |
|  - Ash Framework for domain logic                                    |
|  - No external auth libraries (per architecture)                     |
+---------------------------------------------------------------------+
```

---

## Step 3: Guided Discovery

Interactive exploration with structured questions:

```
+---------------------------------------------------------------------+
|  DISCOVERY: Social Login                                             |
|                                                                      |
|  Let me help you think through this...                               |
|                                                                      |
|  ## Scope Questions                                                  |
|                                                                      |
|  1. Which OAuth providers?                                           |
|     [ ] Google                                                       |
|     [ ] Apple (required for iOS App Store)                           |
|     [ ] GitHub                                                       |
|     [ ] Other: ___                                                   |
|                                                                      |
|  2. Account linking strategy?                                        |
|     ( ) Email match - link if emails match                           |
|     ( ) Always create new - separate accounts                        |
|     ( ) User choice - prompt on conflict                             |
|                                                                      |
|  3. What about existing users?                                       |
|     ( ) Can link social to existing account                          |
|     ( ) Social login for new users only                              |
|                                                                      |
|  [Enter responses or type thoughts...]                               |
+---------------------------------------------------------------------+
```

### Discovery Categories

Based on topic, ask relevant questions:

| Category | Example Questions |
|----------|-------------------|
| **Scope** | What's in/out? MVP vs future? |
| **Users** | Who uses this? What's their goal? |
| **Data** | What entities? Relationships? |
| **UX** | Key interactions? States? |
| **Technical** | Constraints? Dependencies? |
| **Edge Cases** | What could go wrong? |
| **Existing** | How does this relate to what exists? |

---

## Step 4: Thinking Space

Free-form thinking with AI assistance:

```
+---------------------------------------------------------------------+
|  THINKING SPACE                                                      |
|                                                                      |
|  Your thoughts so far:                                               |
|  > "Users should be able to sign in with Google or Apple"            |
|  > "Need to handle case where email already exists"                  |
|  > "Should show which social accounts are linked in settings"        |
|                                                                      |
|  AI observations:                                                    |
|  - This affects AUTH domain spec (new auth methods)                  |
|  - This affects USER domain spec (linked accounts)                   |
|  - Similar to AUTH-001 flow but with OAuth redirect                  |
|  - Consider: What if user has both Google and Apple?                 |
|                                                                      |
|  Unresolved questions:                                               |
|  ? Should social login be available on mobile app?                   |
|  ? How to handle OAuth token refresh?                                |
|  ? What data do we store from the provider?                          |
|                                                                      |
|  [c] Continue exploring  [a] Add thought  [f] Formalize  [x] Exit    |
+---------------------------------------------------------------------+
```

---

## Step 5: Impact Analysis

Before formalizing, show what will change:

```
+---------------------------------------------------------------------+
|  IMPACT ANALYSIS                                                     |
|                                                                      |
|  If we proceed, this feature would:                                  |
|                                                                      |
|  Domain changes:                                                     |
|  + ADD: SocialIdentity entity (provider, uid, user_id)               |
|  + ADD: link_social_account action on User                           |
|  + MODIFY: authenticate action (support social auth)                 |
|                                                                      |
|  New screens:                                                        |
|  + Social login buttons on login page                                |
|  + Linked accounts section in settings                               |
|  + Account linking conflict resolution                               |
|                                                                      |
|  API changes:                                                        |
|  + GET /auth/google (initiate OAuth)                                 |
|  + GET /auth/google/callback (handle callback)                       |
|  + POST /api/v1/users/:id/social_identities (link account)           |
|                                                                      |
|  Estimated complexity: MEDIUM (3-5 scenarios)                        |
|                                                                      |
|  [f] Create feature spec  [e] Edit scope  [c] Continue exploring     |
+---------------------------------------------------------------------+
```

---

## Step 6: Formalization Options

When ready to formalize:

```
+---------------------------------------------------------------------+
|  FORMALIZE                                                           |
|                                                                      |
|  Ready to create feature spec from exploration.                      |
|                                                                      |
|  Suggested structure:                                                |
|                                                                      |
|  Option A: Single feature                                            |
|    AUTH-003: Social Login                                            |
|    - All OAuth flows in one spec                                     |
|    - 5 scenarios                                                     |
|                                                                      |
|  Option B: Split features                                            |
|    AUTH-003: Google OAuth Login (2 scenarios)                        |
|    AUTH-004: Apple OAuth Login (2 scenarios)                         |
|    AUTH-005: Account Linking (3 scenarios)                           |
|                                                                      |
|  Option C: Phased approach                                           |
|    AUTH-003-MVP: Basic Google OAuth (2 scenarios)                    |
|    AUTH-003-FULL: Full social login (defer to later)                 |
|                                                                      |
|  [a] Option A  [b] Option B  [c] Option C  [m] Manual setup          |
+---------------------------------------------------------------------+
```

### On Formalization

1. Create feature folder: `.claude/features/{ID}/`
2. Generate `spec.md` from exploration
3. Generate `delta.md` with domain changes
4. Open spec in editor for refinement
5. Optionally run `/vibe validate` immediately

---

## Exploration Modes

### New Capability Exploration

```
/vibe explore "add notifications"
```

Focus on: Scope, user value, new entities, UX patterns

### Problem Exploration

```
/vibe explore "users are confused by error messages"
```

Focus on: Current state, pain points, solutions, impact

### Extension Exploration

```
/vibe explore --from-spec AUTH-001 "add remember me"
```

Focus on: What exists, what changes, backward compatibility

### Technical Exploration

```
/vibe explore "should we use WebSockets or SSE"
```

Focus on: Trade-offs, constraints, recommendations

---

## Context Preservation

Exploration state is preserved in session. Can return to it:

```
/vibe explore

Resuming exploration: Social Login

Last state:
- Scope: Google + Apple OAuth
- Decisions: Email-match linking
- Open questions: 2

[c] Continue  [r] Reset  [f] Formalize
```

---

## Examples

### Quick Exploration

```
/vibe explore "dark mode"

EXPLORE: dark mode

Context scan...
- No existing theme-related specs
- Design tokens exist in tokens.css
- components.json has no theme props

Quick assessment:
This is a UI-only change. Affects:
- All components (theme-aware styling)
- User preferences (store theme choice)
- PWA manifest (theme-color)

Complexity: LOW-MEDIUM

Do you want to:
[f] Create feature spec (straightforward)
[c] Explore further (edge cases)
[x] Exit
```

### Deep Exploration

```
/vibe explore "real-time collaboration"

EXPLORE: real-time collaboration

This is a significant capability. Let's think through it carefully.

Discovery questions:
1. What content is collaborative?
2. How many concurrent users?
3. Conflict resolution strategy?
4. Offline behavior?

[Answer questions to continue...]
```

---

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Explore obvious features | Go straight to `/vibe [ID]` |
| Explore during implementation | Finish current work first |
| Over-explore simple changes | Set time limit, then decide |
| Explore without context | Let AI scan related specs first |

---

## Integration

### With Main Workflow

```
/vibe explore "feature idea"
  ↓ (when ready)
/vibe AUTH-003           # Start implementation
```

### With Validate

```
/vibe explore "feature idea"
  ↓
[f] Formalize
  ↓
Auto-runs: /vibe validate AUTH-003
```

### With Research

```
/vibe explore "new payment provider"
  ↓
"I need to research Stripe vs Square"
  ↓
/vibe research "Stripe vs Square for mobile-first apps"
  ↓
Return to exploration with findings
```

---

## Structured Discovery Mode (`--discover`)

> `/vibe explore --discover [FEATURE-ID]` - Pre-planning discovery for a single feature

Lightweight discovery phase to understand a feature BEFORE formal planning:
- Research and understand requirements
- Create wireframes or UI descriptions
- Draft acceptance scenarios (not finalized)
- Identify risks and unknowns
- Output: Discovery document

### Structured Discovery Workflow

```
Context -> Research -> Wireframe -> Scenarios (Draft) -> Risks -> Document
```

### Discovery Phase 1: Context Loading

```
+======================================================================+
|  DISC DISCOVERY PHASE                                                |
|  Feature: [ID]                                                       |
+======================================================================+
```

1. Load project context (WHY + WHAT from vibe.md)
2. If feature spec exists, read it
3. If not, gather initial requirements from user

```
+---------------------------------------------------------------------+
|  FEATURE CONTEXT                                                     |
|                                                                      |
|  Feature ID: [ID]                                                    |
|  Status: [New Feature / Existing Spec Found]                         |
|                                                                      |
|  Project: {{project.name}}                                           |
|  Core KPI: {{project.core_kpi}}                                      |
|                                                                      |
|  How might this feature support the KPI?                             |
|  [AI assessment based on feature name/context]                       |
|                                                                      |
|  Describe the feature (or press Enter if spec exists): ___           |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - Wait for user input

### Discovery Phase 2: Research (Parallelized)

```
+======================================================================+
|  UX DISCOVERY RESEARCH                                               |
|  Feature: [ID]                                                       |
+======================================================================+
```

**AI Optimization: Spawn 3 parallel agents for research:**

```
┌─ Agent 1: Industry Patterns
│   - Research how similar apps solve this
│   - Identify best practices
│   - Note emerging trends
│
├─ Agent 2: Component Audit
│   - Scan existing components in $lib/components/ui
│   - Identify reusable components
│   - Note gaps requiring new components
│
└─ Agent 3: Related Features
    - Check related features in docs/domain/features/
    - Identify dependencies
    - Note shared patterns
```

**Wait for all agents → Synthesize findings → Present**

```
+---------------------------------------------------------------------+
|  RESEARCH FINDINGS                                                   |
|                                                                      |
|  Industry Patterns:                                                  |
|  * [Pattern 1 - how similar apps solve this]                         |
|  * [Pattern 2 - alternative approach]                                |
|  * [Pattern 3 - emerging trend]                                      |
|                                                                      |
|  User Journey:                                                       |
|  [Entry Point] -> [Step 1] -> [Step 2] -> [Success State]            |
|                                                                      |
|  Existing Components to Reuse:                                       |
|  * [Component from $lib/components/ui] - [purpose]                   |
|                                                                      |
|  New Components Likely Needed:                                       |
|  * [New component] - [why]                                           |
|                                                                      |
|  Feedback or additions? (Enter to continue): ___                     |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - Wait for user feedback/additions

### Discovery Phase 3: Wireframe

```
+---------------------------------------------------------------------+
|  WIREFRAME: [Feature Name]                                           |
|                                                                      |
|  Mobile Layout (Primary):                                            |
|  +-------------------------+                                         |
|  | [Header/Nav]            |                                         |
|  +-------------------------+                                         |
|  |                         |                                         |
|  | [Main Content Area]     |                                         |
|  |                         |                                         |
|  +-------------------------+                                         |
|  | [Primary Action/CTA]    |                                         |
|  +-------------------------+                                         |
|                                                                      |
|  Desktop Adaptations:                                                |
|  * [How layout changes on larger screens]                            |
|                                                                      |
|  States:                                                             |
|  * Loading: [Skeleton description - no spinners]                     |
|  * Empty:   [Message + CTA to populate]                              |
|  * Error:   [Message + recovery action]                              |
|  * Success: [Confirmation behavior]                                  |
|                                                                      |
|  Key Interactions:                                                   |
|  * Tap [element]: [action]                                           |
|  * Swipe [direction]: [action]                                       |
|                                                                      |
|  Feedback or changes? (Enter to continue): ___                       |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - Wait for user feedback/modifications

### Discovery Phase 4: Draft Scenarios

```
+---------------------------------------------------------------------+
|  DRAFT ACCEPTANCE SCENARIOS                                          |
|  (These will be finalized during implementation)                     |
|                                                                      |
|  ### Scenario 1: [Happy path - primary use case]                     |
|  DRAFT                                                               |
|  - Given [precondition]                                              |
|  - When [user action]                                                |
|  - Then [expected outcome]                                           |
|                                                                      |
|  ### Scenario 2: [Alternate path or edge case]                       |
|  DRAFT                                                               |
|  - Given [precondition]                                              |
|  - When [user action]                                                |
|  - Then [expected outcome]                                           |
|                                                                      |
|  ### Scenario 3: [Error handling]                                    |
|  DRAFT                                                               |
|  - Given [precondition]                                              |
|  - When [error condition]                                            |
|  - Then [graceful handling]                                          |
|                                                                      |
|  Questions for Stakeholder:                                          |
|  * [Question about unclear requirement]                              |
|  * [Question about business rule]                                    |
|                                                                      |
|  Feedback or answers? (Enter to continue): ___                       |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - Wait for user feedback/answers

### Discovery Phase 5: Risk Identification

```
+---------------------------------------------------------------------+
|  RISKS & UNKNOWNS                                                    |
|                                                                      |
|  Technical Risks:                                                    |
|  | Risk                      | Impact | Mitigation                 | |
|  |---------------------------|--------|----------------------------| |
|  | [Technical risk 1]        | H/M/L  | [How to address]           | |
|  | [Technical risk 2]        | H/M/L  | [How to address]           | |
|                                                                      |
|  Unknowns (Need Clarification):                                      |
|  * [Unknown 1] - Ask: [who/what]                                     |
|  * [Unknown 2] - Research: [what to look into]                       |
|                                                                      |
|  Dependencies:                                                       |
|  * [Depends on feature X]                                            |
|  * [Depends on external service Y]                                   |
|                                                                      |
|  Estimated Complexity: [S / M / L / XL]                              |
|  Reasoning: [Why this complexity level]                              |
|                                                                      |
|  Anything to add? (Enter to generate document): ___                  |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - Wait for user confirmation

### Discovery Phase 6: Generate Document

Create/update feature spec at `{{paths.features}}/{area}/{ID}.md`:

```markdown
# [Feature ID]: [Feature Name]

> [One-line description]

**Status:** Discovery Complete | Ready for Implementation

---

## Discovery Summary

- **Discovered:** [Date]
- **Complexity:** [S / M / L / XL]
- **Dependencies:** [List or None]

---

## Research Findings

### Industry Patterns
- [Pattern 1]
- [Pattern 2]

### User Journey
[Entry] -> [Step 1] -> [Step 2] -> [Success]

### Component Audit
| Reuse | Component | Purpose |
|-------|-----------|---------|
| Yes | [name] | [purpose] |
| New | [name] | [purpose] |

---

## Wireframe (Draft)

### Mobile Layout
[ASCII wireframe]

### States
| State | Behavior |
|-------|----------|
| Loading | [Skeleton description] |
| Empty | [Message + CTA] |
| Error | [Message + recovery] |

---

## Draft Scenarios

> **DRAFT** - These scenarios will be finalized during implementation.

### Scenario: [Happy Path Name]
- **Given** [precondition]
- **When** [action]
- **Then** [outcome]

---

## Risks & Unknowns

### Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk] | H/M/L | [Mitigation] |

### Open Questions
- [ ] [Question 1]
- [ ] [Question 2]

---

## Next Steps

1. Answer open questions
2. Run `/vibe [ID]` to implement
```

### Discovery Output

```
+---------------------------------------------------------------------+
|  DISCOVERY COMPLETE                                                  |
|                                                                      |
|  Document: {{paths.features}}/{area}/{ID}.md                         |
|                                                                      |
|  Summary:                                                            |
|  * Research findings documented                                      |
|  * Wireframe created (mobile-first)                                  |
|  * [N] draft scenarios                                               |
|  * [N] risks identified                                              |
|  * [N] open questions                                                |
|                                                                      |
|  Complexity: [S/M/L/XL]                                              |
|                                                                      |
|  Next Steps:                                                         |
|  1. Review document and answer open questions                        |
|  2. Run `/vibe [ID]` to implement                                    |
+---------------------------------------------------------------------+
```

### Discovery Anti-Patterns

- Never mark scenarios as final (always DRAFT)
- Never skip risk identification
- Never auto-continue without checkpoints
- Never skip wireframe phase even for API-only features (document data flow instead)
- Never assume requirements - capture as open questions
