# Convert Story Command

> `/vibe convert-story [STORY-ID]` - Convert a BMAD story to Vibe feature spec

## Purpose

Transform BMAD planning artifacts into implementation-ready Vibe feature specs:
- Extract story from `_bmad-output/planning-artifacts/epics.md`
- Map Given/When/Then to acceptance scenarios
- Add UI specification for AI generation
- Output: Complete Vibe feature spec

**Key Difference:**
- BMAD stories = Planning artifacts (what to build)
- Vibe feature specs = Implementation specs (how to build + generate)

---

## Workflow

```
Parse Story -> Map Scenarios -> Add UI Spec -> Determine Area -> Write Feature
```

---

## Before Starting

1. Locate BMAD epics file:
   - Primary: `_bmad-output/planning-artifacts/epics.md`
   - Fallback: `_bmad/output/epics.md`
2. Load `components.json` for UI component reference
3. Read `docs/UX_COPY.md` for copy guidelines
4. Check if feature already exists (avoid duplicates)

---

## Phase 1: Parse BMAD Story

```
+======================================================================+
|  CONV PARSING BMAD STORY                                              |
|  Story ID: [ID]                                                       |
+======================================================================+
```

### Story ID Format

Accept these formats:
- `1.1` - Story 1.1 from Epic 1
- `Story 1.1` - Full format
- `1.1: Service Provider Registration` - With title

### Extraction

From epics.md, extract:
1. **Story number** - e.g., "1.1"
2. **Title** - e.g., "Service Provider Registration"
3. **User story** - "As a... I want to... So that..."
4. **Acceptance criteria** - All Given/When/Then blocks
5. **Parent epic** - Epic number and title

```
+---------------------------------------------------------------------+
|  BMAD STORY FOUND                                                    |
|                                                                      |
|  Epic: [Epic Number] - [Epic Title]                                  |
|  Story: [Story ID] - [Story Title]                                   |
|                                                                      |
|  User Story:                                                         |
|  As a [role],                                                        |
|  I want to [action],                                                 |
|  So that [benefit].                                                  |
|                                                                      |
|  Acceptance Criteria: [N] scenarios found                            |
|                                                                      |
|  Proceed with conversion? [Enter]                                    |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - Wait for user confirmation

---

## Phase 2: Map to Vibe Scenarios

```
+======================================================================+
|  CONV MAPPING ACCEPTANCE SCENARIOS                                    |
|  Story: [ID]                                                          |
+======================================================================+
```

### Transform BMAD → Vibe Format

**BMAD Format:**
```
**Given** I am on the registration page
**When** I enter a valid email and password (8+ chars, 1 uppercase, 1 number)
**Then** my account is created and I am redirected to the dashboard
**And** I receive a welcome email confirmation
```

**Vibe Format:**
```markdown
#### Scenario: Successful registration
- **Given** user is on the registration page
- **When** they enter valid email and password
- **And** password meets requirements (8+ chars, uppercase, number)
- **And** click the register button
- **Then** account is created
- **And** redirected to `/projects`
- **And** welcome email is sent
```

### Mapping Rules

| BMAD | Vibe |
|------|------|
| "I am" | "user is" (third person) |
| "I enter" | "they enter" |
| "I see" | "error message X is shown" |
| Complex Then | Split into multiple Then/And |
| Technical details | Move to Notes section |

### Categorize Scenarios

Group by type:
1. **Happy path** - Primary success flow
2. **Validation** - Input validation errors
3. **Edge cases** - Rate limiting, duplicates, etc.
4. **Error handling** - System errors, network issues

```
+---------------------------------------------------------------------+
|  MAPPED SCENARIOS                                                    |
|                                                                      |
|  Happy Path:                                                         |
|    1. Successful [action] - main flow                                |
|                                                                      |
|  Validation:                                                         |
|    2. Invalid email format                                           |
|    3. Password too weak                                              |
|    4. Email already registered                                       |
|                                                                      |
|  Edge Cases:                                                         |
|    5. Rate limiting (4+ attempts)                                    |
|                                                                      |
|  Review scenarios? Adjust? [Enter to continue]                       |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - Allow scenario adjustments

---

## Phase 3: Determine Feature Area & ID

```
+======================================================================+
|  CONV DETERMINING FEATURE IDENTITY                                    |
|  Story: [ID]                                                          |
+======================================================================+
```

### Area Mapping (Epic → Feature Directory)

| Epic | Area | Feature Prefix |
|------|------|----------------|
| 1: Authentication | auth | AUTH- |
| 2: Project Workspace | projects | PROJ- |
| 3: Invitation & RBAC | invitations | INV- |
| 4: Real-Time Chat | conversations | CONV- |
| 5: Decision Workflow | decisions | DEC- |
| 6: Notifications | notifications | NOTIF- |
| 7: PWA/Offline | pwa | PWA- |
| 8: AI State | ai | AI- |
| 9: Accessibility | core | A11Y- |

### Generate Feature ID

1. Get prefix from epic mapping
2. Find next available number in area
3. Format: `{PREFIX}{NNN}` (e.g., AUTH-003)

```
+---------------------------------------------------------------------+
|  FEATURE IDENTITY                                                    |
|                                                                      |
|  Area: auth                                                          |
|  Existing features: AUTH-001, AUTH-002                               |
|  Suggested ID: AUTH-003                                              |
|                                                                      |
|  Accept ID or enter custom: [AUTH-003]                               |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - Confirm feature ID

---

## Phase 4: Add UI Specification

```
+======================================================================+
|  CONV UI SPECIFICATION                                                |
|  Feature: [ID]                                                        |
+======================================================================+
```

### Component Selection

Reference `components.json` for available components.

```
+---------------------------------------------------------------------+
|  UI COMPONENTS                                                       |
|                                                                      |
|  Based on the story, likely components:                              |
|                                                                      |
|  Forms:                                                              |
|    [ ] AuthForm - Authentication form wrapper                        |
|    [ ] Input - Text/email/password fields                            |
|    [ ] Button - Primary action                                       |
|    [ ] FormField - Label + input + error wrapper                     |
|                                                                      |
|  Feedback:                                                           |
|    [ ] Alert - Error/success messages                                |
|    [ ] Skeleton - Loading state                                      |
|                                                                      |
|  Which components will this feature use? (comma-separated)           |
|  > AuthForm, Input, Button, FormField                                |
+---------------------------------------------------------------------+
```

### State Specification

```
+---------------------------------------------------------------------+
|  UI STATES (Required for generation)                                 |
|                                                                      |
|  Loading State:                                                      |
|    Trigger: [form_submit / page_load / action]                       |
|    Behavior: [button spinner / skeleton / inline]                    |
|                                                                      |
|  Error State:                                                        |
|    Trigger: [validation / api_error / network]                       |
|    Component: [Alert / inline / toast]                               |
|    Copy: [from UX_COPY.md or custom]                                 |
|                                                                      |
|  Empty State:                                                        |
|    Applicable: [yes / no]                                            |
|    If yes: [EmptyState preset or custom]                             |
|                                                                      |
|  Success State:                                                      |
|    Behavior: [redirect / toast / inline]                             |
|    Target: [/path or message]                                        |
|                                                                      |
|  Describe states or accept defaults: [Enter for defaults]            |
+---------------------------------------------------------------------+
```

### Generate ui_spec YAML

```yaml
ui_spec:
  screen: [screen-name]
  layout: [centered-card | full-width | split | etc.]

  components:
    - id: [component-id]
      type: [Component]
      props:
        [prop]: [value]

  states:
    loading:
      trigger: [trigger]
      component: [Component]
      props: { [prop]: [value] }
    error:
      trigger: [trigger]
      copy: "[error message]"
    empty:
      applicable: [true/false]
    success:
      behavior: [redirect/toast/inline]
      target: "[path or message]"

  liveview:
    module: SynaWeb.[Area].[Name]Live
    events:
      - name: [event_name]
        payload: [field1, field2]
```

**CHECKPOINT** - Review UI spec

---

## Phase 5: Generate Wireframe

```
+======================================================================+
|  CONV WIREFRAME GENERATION                                            |
|  Feature: [ID]                                                        |
+======================================================================+
```

Based on components and states, generate ASCII wireframe:

```
+---------------------------------------------------------------------+
|  WIREFRAME: [Feature Name]                                           |
|                                                                      |
|  Mobile Layout (Primary):                                            |
|  +-------------------------+                                         |
|  |     [Logo/Header]       |                                         |
|  +-------------------------+                                         |
|  |                         |                                         |
|  |   ┌─────────────────┐   |                                         |
|  |   │ [Field 1]       │   |                                         |
|  |   └─────────────────┘   |                                         |
|  |                         |                                         |
|  |   ┌─────────────────┐   |                                         |
|  |   │ [Field 2]       │   |                                         |
|  |   └─────────────────┘   |                                         |
|  |                         |                                         |
|  |   ┌─────────────────┐   |                                         |
|  |   │  [Primary CTA]  │   |                                         |
|  |   └─────────────────┘   |                                         |
|  |                         |                                         |
|  +-------------------------+                                         |
|                                                                      |
|  Adjust wireframe? [Enter to continue]                               |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - Review wireframe

---

## Phase 6: Write Feature Spec

```
+======================================================================+
|  CONV WRITING FEATURE SPEC                                            |
|  Output: docs/domain/features/[area]/[ID].md                          |
+======================================================================+
```

### Feature Spec Template

```markdown
# [ID]: [Title]

> [One-line description from user story]

## Status: `todo`

## Source

- **BMAD Story:** [Story ID] - [Story Title]
- **Epic:** [Epic Number] - [Epic Title]
- **Converted:** [Date]

## PM Context

- **Priority:** [P0/P1/P2 based on epic order]
- **User Value:** [From user story "So that..."]
- **Success:** [Derived from acceptance criteria]

## Domain

### Entities
[Extracted from story context]

### Acceptance Scenarios

[Mapped scenarios from Phase 2]

## Wireframe

### Screen Layout
```
[ASCII wireframe from Phase 5]
```

### Key Interactions
[Derived from components]

### Mobile Behaviors
- Single column, centered content
- Touch targets 44px minimum
- Keyboard handling for form fields

## UX Requirements

### States (Required)

**Loading**
[From ui_spec.states.loading]

**Error**
[From ui_spec.states.error]

**Empty**
[From ui_spec.states.empty]

**Success**
[From ui_spec.states.success]

### Animations (Required)
- Button press: scale(0.98)
- Error: gentle shake
- Success: checkmark flash (200ms)
- Page transition: fade (300ms)

### Components
[From Phase 4 component selection]

### Copy
[From UX_COPY.md or generated]

## UI Specification

```yaml
[ui_spec YAML from Phase 4]
```

## Notes

[Technical details from BMAD story, deferred items, etc.]
```

### Write File

Create feature spec at `docs/domain/features/[area]/[ID].md`

```
+---------------------------------------------------------------------+
|  FEATURE SPEC CREATED                                                |
|                                                                      |
|  File: docs/domain/features/[area]/[ID].md                           |
|                                                                      |
|  Converted from:                                                     |
|    BMAD Story [Story ID]: [Story Title]                              |
|                                                                      |
|  Contents:                                                           |
|    * [N] acceptance scenarios                                        |
|    * UI specification (YAML)                                         |
|    * Wireframe (mobile-first)                                        |
|    * All 4 states defined                                            |
|                                                                      |
|  Next steps:                                                         |
|    1. Review and refine spec                                         |
|    2. /vibe generate [ID] - Generate scaffold                        |
|    3. /vibe [ID] - Implement with TDD                                |
|                                                                      |
|  Run /vibe context to update project mapping                         |
+---------------------------------------------------------------------+
```

---

## Batch Conversion

For converting multiple stories at once:

```bash
/vibe convert-story 1.1 1.2 1.3
```

Processes each story sequentially, prompting for UI spec per story.

For fully automated conversion (uses defaults):

```bash
/vibe convert-story --batch 1.1 1.2 1.3
```

Skips checkpoints, uses intelligent defaults for UI spec.

---

## Integration

After conversion, automatically suggest:
1. `/vibe context` - Update project-context.md mapping
2. `/vibe generate [ID]` - Generate scaffold from spec
3. `/vibe sync` - Sync to GitHub Projects

---

## Anti-Patterns

- Never skip UI specification (defeats purpose of conversion)
- Never copy BMAD format verbatim (must transform to Vibe style)
- Never duplicate existing features (check first)
- Never auto-continue without reviewing scenarios
- Never skip wireframe for UI features
- Never use technical jargon in copy (check UX_COPY.md)
- Never guess components (always reference components.json)
