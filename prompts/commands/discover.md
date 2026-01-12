# Feature Discovery Command

> `/vibe discover [FEATURE-ID]` - Pre-planning discovery for a single feature

## Purpose

Lightweight discovery phase to understand a feature BEFORE formal planning:
- Research and understand requirements
- Create wireframes or UI descriptions
- Draft acceptance scenarios (not finalized)
- Identify risks and unknowns
- Output: Discovery document

**Key Difference from `/vibe plan`:**
- `/vibe discover` = Single feature, exploratory, no GitHub issues
- `/vibe plan` = Sprint scope, formal scenarios, creates GitHub issues

## Workflow

```
Context -> Research -> Wireframe -> Scenarios (Draft) -> Risks -> Document
```

---

## Before Starting

1. Load project config: `.claude/vibe.config.json`
2. Read vision: `{{paths.domain}}/vision.md`
3. Read glossary: `{{paths.domain}}/GLOSSARY.md`
4. Check for existing feature spec: `{{paths.features}}/{area}/{ID}.md`

---

## Phase 1: Context Loading

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

---

## Phase 2: Research (Designer Lens)

```
+======================================================================+
|  UX DISCOVERY RESEARCH                                               |
|  Feature: [ID]                                                       |
+======================================================================+
```

1. Load role context: `~/.claude/vibe-ash-svelte/roles/designer.md`
2. Research industry patterns for this feature type
3. Identify user journey touchpoints
4. Audit existing components

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
|  * [Component from $lib/components/ui] - [purpose]                   |
|                                                                      |
|  New Components Likely Needed:                                       |
|  * [New component] - [why]                                           |
|                                                                      |
|  Feedback or additions? (Enter to continue): ___                     |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - Wait for user feedback/additions

---

## Phase 3: Wireframe (Designer Lens)

```
+======================================================================+
|  UX WIREFRAME DRAFT                                                  |
|  Feature: [ID]                                                       |
+======================================================================+
```

Create ASCII wireframe and state descriptions:

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
|  * Long press [element]: [action]                                    |
|                                                                      |
|  Feedback or changes? (Enter to continue): ___                       |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - Wait for user feedback/modifications

---

## Phase 4: Draft Scenarios (Domain Architect Lens)

```
+======================================================================+
|  DOM DRAFT SCENARIOS                                                 |
|  Feature: [ID]                                                       |
+======================================================================+
```

1. Load role context: `~/.claude/vibe-ash-svelte/roles/domain-architect.md`
2. Draft Given/When/Then scenarios (marked as DRAFT)

```
+---------------------------------------------------------------------+
|  DRAFT ACCEPTANCE SCENARIOS                                          |
|  (These will be finalized during /vibe plan)                         |
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
|  * [Question about edge case handling]                               |
|  * [Question about business rule]                                    |
|                                                                      |
|  Feedback or answers? (Enter to continue): ___                       |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - Wait for user feedback/answers

---

## Phase 5: Risk Identification

```
+======================================================================+
|  RISK RISK ASSESSMENT                                                |
|  Feature: [ID]                                                       |
+======================================================================+
```

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
|  * [Depends on design decision Z]                                    |
|                                                                      |
|  Estimated Complexity: [S / M / L / XL]                              |
|  Reasoning: [Why this complexity level]                              |
|                                                                      |
|  Anything to add? (Enter to generate document): ___                  |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - Wait for user confirmation

---

## Phase 6: Generate Discovery Document

Create/update feature spec at `{{paths.features}}/{area}/{ID}.md`:

```markdown
# [Feature ID]: [Feature Name]

> [One-line description]

**Status:** Discovery Complete | Ready for Planning

---

## Discovery Summary

- **Discovered:** [Date]
- **Complexity:** [S / M / L / XL]
- **Dependencies:** [List or None]

---

## Business Context

### How This Supports KPI
[Connection to {{project.core_kpi}}]

### User Need
[What problem this solves for users]

---

## Research Findings

### Industry Patterns
- [Pattern 1]
- [Pattern 2]
- [Pattern 3]

### User Journey
```
[Entry] -> [Step 1] -> [Step 2] -> [Success]
```

### Component Audit
| Reuse | Component | Purpose |
|-------|-----------|---------|
| Yes | [name] | [purpose] |
| New | [name] | [purpose] |

---

## Wireframe (Draft)

### Mobile Layout
```
[ASCII wireframe]
```

### Desktop Adaptations
- [Adaptation notes]

### States
| State | Behavior |
|-------|----------|
| Loading | [Skeleton description] |
| Empty | [Message + CTA] |
| Error | [Message + recovery] |
| Success | [Confirmation] |

### Interactions
- Tap [element]: [action]
- Swipe: [action]

---

## Draft Scenarios

> **DRAFT** - These scenarios will be finalized during `/vibe plan`.

### Scenario: [Happy Path Name]
**DRAFT**
- **Given** [precondition]
- **When** [action]
- **Then** [outcome]

### Scenario: [Edge Case Name]
**DRAFT**
- **Given** [precondition]
- **When** [action]
- **Then** [outcome]

### Scenario: [Error Case Name]
**DRAFT**
- **Given** [precondition]
- **When** [error condition]
- **Then** [graceful handling]

---

## Risks & Unknowns

### Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk] | H/M/L | [Mitigation] |

### Unknowns
- [ ] [Unknown requiring clarification]
- [ ] [Unknown requiring research]

### Dependencies
- [Dependency 1]
- [Dependency 2]

---

## Open Questions

- [ ] [Question 1]
- [ ] [Question 2]
- [ ] [Question 3]

---

## Next Steps

1. Answer open questions
2. Run `/vibe plan [sprint]` to finalize scenarios and create issues
3. Run `/vibe [ID]` to implement
```

### Final Output

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
|  2. Run `/vibe plan [sprint]` to finalize scenarios                  |
|  3. Run `/vibe [ID]` to implement                                    |
|                                                                      |
|  NOTE: No GitHub issues created (use /vibe plan for that)            |
+---------------------------------------------------------------------+
```

---

## Anti-Patterns

- Never create GitHub issues (that's `/vibe plan`'s job)
- Never mark scenarios as final (always DRAFT)
- Never skip risk identification
- Never auto-continue without checkpoints
- Never skip wireframe phase even for API-only features (document data flow instead)
- Never assume requirements - capture as open questions
