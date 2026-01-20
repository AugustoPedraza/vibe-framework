# Validate Command

> `/vibe validate [FEATURE-ID]` - Validate feature spec completeness and consistency

## Purpose

Check that a feature specification is complete and consistent before implementation begins. Catches structural issues, missing requirements, and inconsistencies early.

## Usage

```
/vibe validate AUTH-001        # Validate specific feature
/vibe validate                 # Validate current feature (from checkpoint)
/vibe validate --strict        # Fail on warnings (default: warnings OK)
/vibe validate --fix           # Auto-fix minor issues
```

---

## Workflow

```
Load Feature -> Structure Check -> Requirements Check -> Consistency Check -> Report
```

### Step 1: Load Feature

```
+---------------------------------------------------------------------+
|  VALIDATE: {FEATURE-ID}                                              |
|                                                                      |
|  Loading feature spec...                                             |
|  Path: .claude/features/{FEATURE-ID}/spec.md                         |
+---------------------------------------------------------------------+
```

### Step 2: Structure Validation

Check required sections exist:

```
+---------------------------------------------------------------------+
|  STRUCTURE CHECK                                                     |
|                                                                      |
|  Required sections:                                                  |
|  [x] Status                                                          |
|  [x] PM Context (Priority, User Value, Success)                      |
|  [x] Domain (Entities, Acceptance Scenarios)                         |
|  [x] Wireframe (Screen Layout, Key Interactions)                     |
|  [x] UX Requirements (States, Animations, Components, Copy)          |
|  [x] UI Specification (YAML block)                                   |
|  [ ] Domain Changes (OPTIONAL - for brownfield)                      |
|                                                                      |
|  Structure: PASS (6/6 required, 0/1 optional)                        |
+---------------------------------------------------------------------+
```

### Step 3: Requirements Validation

Check requirements quality:

```
+---------------------------------------------------------------------+
|  REQUIREMENTS CHECK                                                  |
|                                                                      |
|  Scenarios:                                                          |
|  [x] At least 1 happy path scenario                                  |
|  [x] At least 1 error/validation scenario                            |
|  [x] All scenarios have Given/When/Then                              |
|  [x] Scenarios use SHALL/MUST for assertions                         |
|                                                                      |
|  UX States:                                                          |
|  [x] Loading state defined                                           |
|  [x] Error state defined                                             |
|  [x] Empty state defined (or marked N/A)                             |
|  [x] Success state defined                                           |
|                                                                      |
|  UI Spec:                                                            |
|  [x] YAML is valid syntax                                            |
|  [x] All components have type                                        |
|  [x] States section matches UX Requirements                          |
|  [ ] a11y.focus_order defined (WARNING)                              |
|                                                                      |
|  Requirements: PASS (12/13, 1 warning)                               |
+---------------------------------------------------------------------+
```

### Step 4: Consistency Validation

Check cross-references:

```
+---------------------------------------------------------------------+
|  CONSISTENCY CHECK                                                   |
|                                                                      |
|  Component references:                                               |
|  [x] All UI spec components exist in components.json                 |
|  [x] Component props match component definitions                     |
|                                                                      |
|  Copy references:                                                    |
|  [x] All copy keys exist in UX_COPY.md (or inline)                   |
|                                                                      |
|  Domain references:                                                  |
|  [x] Entities match GLOSSARY.md terms                                |
|  [ ] API endpoints match specs/api.md (WARNING: 1 mismatch)          |
|                                                                      |
|  Delta consistency (if present):                                     |
|  [x] All ADDED requirements have scenarios                           |
|  [x] All MODIFIED show before/after                                  |
|  [x] No orphaned references                                          |
|                                                                      |
|  Consistency: PASS (7/8, 1 warning)                                  |
+---------------------------------------------------------------------+
```

---

## Validation Report

### Success Report

```
+=====================================================================+
|  VALIDATION COMPLETE: {FEATURE-ID}                                   |
|                                                                      |
|  Result: VALID                                                       |
|                                                                      |
|  Summary:                                                            |
|  - Structure:    PASS (6/6)                                          |
|  - Requirements: PASS (12/13)                                        |
|  - Consistency:  PASS (7/8)                                          |
|                                                                      |
|  Warnings (2):                                                       |
|  ~ a11y.focus_order not defined in UI spec                           |
|    Suggested: Add focus_order: [email-input, password-input, submit] |
|                                                                      |
|  ~ API endpoint mismatch                                             |
|    Spec says: POST /api/v1/auth/login                                |
|    specs/api.md has: POST /api/v1/sessions                           |
|    Action: Update spec or api.md to match                            |
|                                                                      |
|  Ready for implementation: YES (with warnings)                       |
|                                                                      |
|  [i] Start implementation  [f] Fix warnings  [s] Show details        |
+=====================================================================+
```

### Failure Report

```
+=====================================================================+
|  VALIDATION COMPLETE: {FEATURE-ID}                                   |
|                                                                      |
|  Result: INVALID                                                     |
|                                                                      |
|  Summary:                                                            |
|  - Structure:    FAIL (4/6)                                          |
|  - Requirements: PASS (10/13)                                        |
|  - Consistency:  FAIL (5/8)                                          |
|                                                                      |
|  Errors (must fix):                                                  |
|  ! Missing required section: UX Requirements                         |
|    Add: ## UX Requirements with Loading/Error/Empty/Success states   |
|                                                                      |
|  ! Missing required section: UI Specification                        |
|    Add: ## UI Specification with YAML block                          |
|                                                                      |
|  ! Scenario missing Given/When/Then: "User submits form"             |
|    Line 45: Add structured scenario format                           |
|                                                                      |
|  ! Component not in components.json: "CustomButton"                  |
|    Either add to components.json or use existing component           |
|                                                                      |
|  Warnings (3): [w] View warnings                                     |
|                                                                      |
|  Ready for implementation: NO                                        |
|                                                                      |
|  [f] Fix errors  [e] Edit spec  [?] Help                             |
+=====================================================================+
```

---

## Validation Rules Reference

### Structure Rules

| Section | Required | Check |
|---------|----------|-------|
| Status | Yes | Must be valid status value |
| PM Context | Yes | Priority, User Value, Success present |
| Domain | Yes | Entities and Scenarios subsections |
| Wireframe | Yes | Screen Layout subsection |
| UX Requirements | Yes | States subsection with 4 states |
| UI Specification | Yes | Valid YAML block |
| Domain Changes | No | If brownfield, recommended |
| Bootstrap Patterns | No | If first in area, recommended |

### Scenario Rules

| Rule | Check |
|------|-------|
| Format | Has Given/When/Then structure |
| Assertions | Uses SHALL or MUST language |
| Coverage | At least 1 happy path + 1 error path |
| Testability | Each Then is verifiable |

### UX State Rules

| State | Required Fields |
|-------|-----------------|
| Loading | Trigger, Behavior, Disabled elements |
| Error | Trigger, Display type, Copy, Recovery |
| Empty | Applicable flag, if yes: Preset, Title, Action |
| Success | Behavior, Target |

### UI Spec YAML Rules

| Field | Required | Check |
|-------|----------|-------|
| screen | Yes | Valid screen name |
| layout | Yes | Valid layout type |
| components | Yes | Array with id, type |
| states | Yes | loading, error, success |
| liveview | Recommended | module, events |
| a11y | Recommended | focus_order, announce_errors |

---

## Auto-Fix Capabilities

With `--fix` flag, can auto-correct:

| Issue | Auto-Fix |
|-------|----------|
| Missing empty section | Add `applicable: false` |
| Missing a11y section | Generate from components |
| YAML formatting | Pretty-print YAML |
| Copy placeholder | Add `"{TBD}"` markers |

Cannot auto-fix:
- Missing scenarios
- Invalid component references
- Logical inconsistencies

---

## Integration with Workflow

### Before QA Phase

```
/vibe [FEATURE-ID]

Entering QA Test Generation phase...

Running pre-flight validation...
[x] Structure valid
[x] Requirements valid
[ ] Consistency warning (1)

Continue with warning? [y] Yes [n] No, fix first
```

### Before Implementation

```
Developer phase starting...

Validation check:
[x] Feature spec valid
[x] Domain delta valid (if present)
[x] Patterns identified

Proceeding with scenario 1...
```

### In CI/Pre-commit (Future)

```bash
# Could be added to pre-commit hooks
claude code "/vibe validate ${FEATURE_ID} --strict"
```

---

## Examples

### Validating New Feature

```
/vibe validate AUTH-001

VALIDATE: AUTH-001
Loading: .claude/features/AUTH-001/spec.md

Structure: PASS (6/6)
Requirements: PASS (13/13)
Consistency: PASS (8/8)

Result: VALID - Ready for implementation
```

### Validating with Fixes

```
/vibe validate AUTH-001 --fix

VALIDATE: AUTH-001

Auto-fixing issues...
  [x] Added a11y.focus_order based on component order
  [x] Fixed YAML indentation

Structure: PASS (6/6)
Requirements: PASS (13/13)
Consistency: PASS (8/8)

Result: VALID - 2 issues auto-fixed
```
