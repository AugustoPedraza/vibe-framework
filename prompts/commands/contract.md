# Contract Generation Command

> Generate interface contracts for parallel implementation from feature specs.

**Trigger:** `/vibe contract [FEATURE-ID]`

---

## Purpose

The contract command generates an **Interface Contract** that defines the precise boundaries between backend and frontend implementation. This enables parallel development by:

1. Defining immutable interfaces upfront
2. Assigning acceptance criteria to specific streams
3. Specifying mock data for isolated testing
4. Declaring file ownership to prevent conflicts

---

## Workflow

```
+======================================================================+
|  CONTRACT CONTRACT DEFINITION                                         |
|  Feature: [ID] - [Title]                                             |
+======================================================================+
```

### Step 1: Load Feature Context

Read in parallel:
- Feature spec: `{{paths.features}}/{area}/{ID}.md`
- Domain spec: `{{paths.domain}}/specs/domains/{domain}.md` (if exists)
- Existing components: Scan `assets/svelte/components/` for related
- API patterns: `{{paths.architecture}}/_patterns/api.md`

### Step 2: Extract API Contract

From the feature spec's acceptance scenarios, identify:

1. **Actions Required**
   - Map each scenario's "When" to an action
   - Determine action type (read/create/update/destroy/action)
   - Extract inputs from "Given" conditions
   - Extract outputs from "Then" expectations

2. **Error Codes**
   - Identify error scenarios (validation, auth, business rules)
   - Define consistent error code naming: `snake_case`
   - Map to HTTP status codes

3. **LiveView Events**
   - Name events to match action names where possible
   - Document payload structure

**Display for Review:**
```
+---------------------------------------------------------------------+
|  API CONTRACT DRAFT                                                  |
|                                                                      |
|  Domain: Accounts                                                    |
|  Resource: User                                                      |
|                                                                      |
|  Actions:                                                            |
|  1. authenticate (action)                                            |
|     Inputs: email:string, password:string                            |
|     Success: User                                                    |
|     Errors: invalid_credentials (401), account_locked (403)          |
|     LiveView: "authenticate"                                         |
|                                                                      |
|  [a] Approve  [e] Edit  [+] Add action  [-] Remove action            |
+---------------------------------------------------------------------+
```

### Step 3: Define Data Shapes

Create TypeScript-like type definitions for:

1. **Domain entities** (User, Session, etc.)
2. **Request payloads** (LoginCredentials, etc.)
3. **Response shapes** (for both success and error)

**Guidelines:**
- Use consistent naming: PascalCase for types
- Reference types by name, don't duplicate definitions
- Include optional/nullable markers

### Step 4: Extract UI Contract

From the feature spec's UI specification and wireframes:

1. **Components**
   - Identify new vs existing vs modify
   - Extract props from component usage in spec
   - Map UX states (loading/error/empty/success)
   - Document events dispatched

2. **LiveView Bindings**
   - Map assigns to Svelte props
   - Specify direction (one-way vs bidirectional)

3. **Accessibility Requirements**
   - ARIA labels required
   - Keyboard navigation
   - Focus management

**Display for Review:**
```
+---------------------------------------------------------------------+
|  UI CONTRACT DRAFT                                                   |
|                                                                      |
|  Components:                                                         |
|  1. LoginForm (NEW)                                                  |
|     Props: onSubmit, loading, error                                  |
|     States: default, loading, error                                  |
|     Events: submit                                                   |
|                                                                      |
|  LiveView Bindings:                                                  |
|     error -> error (LV -> Svelte)                                    |
|     loading -> loading (LV -> Svelte)                                |
|                                                                      |
|  [a] Approve  [e] Edit component  [+] Add component                  |
+---------------------------------------------------------------------+
```

### Step 5: Assign Acceptance Criteria

Categorize each scenario from the feature spec:

| Category | Criteria | Test Location |
|----------|----------|---------------|
| **Backend** | Business logic, validation, auth | `test/{domain}/` |
| **Frontend** | UI states, form behavior, visual | `assets/svelte/**/*.test.ts` |
| **Integration** | Full flow, wiring | LiveView tests |
| **E2E** | Critical paths, cross-page | Playwright |

**Assignment Rules:**
1. If scenario tests data transformation → Backend
2. If scenario tests UI behavior with mocked data → Frontend
3. If scenario requires real backend response → Integration
4. If scenario involves navigation or full user journey → E2E

**Display for Review:**
```
+---------------------------------------------------------------------+
|  ACCEPTANCE CRITERIA ASSIGNMENT                                      |
|                                                                      |
|  Backend (2):                                                        |
|    AC-1: Valid credentials → returns user                            |
|    AC-2: Invalid credentials → returns error                         |
|                                                                      |
|  Frontend (2):                                                       |
|    AC-3: Empty fields → shows validation                             |
|    AC-4: Loading state → shows indicator                             |
|                                                                      |
|  Integration (1):                                                    |
|    AC-5: Full login flow                                             |
|                                                                      |
|  E2E (1):                                                            |
|    E2E-1: Login success path [CRITICAL]                              |
|                                                                      |
|  [a] Approve  [m] Move criterion  [e] Edit                           |
+---------------------------------------------------------------------+
```

### Step 6: Generate Mock Data

Create mock data for isolated testing:

1. **Backend Responses**
   - Success response for each action
   - Error responses for each error code

2. **Frontend Fixtures**
   - Valid input data
   - Invalid input data (for validation testing)
   - Edge case data

### Step 7: Define File Ownership

Assign exclusive paths to each stream:

**Backend Stream Owns:**
```
lib/{domain}/resources/
lib/{domain}/actions/
test/{domain}/
```

**Frontend Stream Owns:**
```
assets/svelte/components/features/{area}/
assets/svelte/stores/
assets/svelte/**/*.test.ts
```

**Shared (Integration Phase Only):**
```
lib/{domain}_web/live/
```

### Step 8: Save Contract

Write contract to:
```
{project}/.claude/contracts/{FEATURE-ID}.json
```

**Display Summary:**
```
+---------------------------------------------------------------------+
|  CONTRACT GENERATED: AUTH-001                                        |
|                                                                      |
|  API: 1 action, 2 error codes                                        |
|  Data Shapes: 2 types                                                |
|  UI: 1 component, 3 states                                           |
|  Criteria: 2 backend, 2 frontend, 1 integration, 1 e2e               |
|                                                                      |
|  Saved: .claude/contracts/AUTH-001.json                              |
|                                                                      |
|  Next Steps:                                                         |
|    /vibe parallel AUTH-001  - Start parallel implementation          |
|    /vibe AUTH-001           - Start sequential implementation        |
+---------------------------------------------------------------------+
```

---

## Contract Validation

Before locking, validate:

1. **Completeness**
   - [ ] All scenarios have assigned criteria
   - [ ] All actions have inputs/outputs defined
   - [ ] All components have states defined
   - [ ] Mock data exists for all actions

2. **Consistency**
   - [ ] Data shapes referenced exist
   - [ ] LiveView events match actions
   - [ ] File ownership has no overlaps

3. **Implementability**
   - [ ] Actions are atomic and testable
   - [ ] Components are independent (no circular deps)
   - [ ] Integration criteria are minimal

---

## Contract Modification

After contract is locked (during parallel implementation):

**Minor Changes (Auto-approve):**
- Adding optional fields to data shapes
- Adding non-breaking error codes
- Adding accessibility improvements

**Breaking Changes (Human approval required):**
- Changing action inputs/outputs
- Removing fields from data shapes
- Changing component props that affect behavior

See `change-request.schema.json` for change request format.

---

## Command Options

| Option | Description |
|--------|-------------|
| `/vibe contract AUTH-001` | Generate contract for feature |
| `/vibe contract AUTH-001 --validate` | Validate existing contract |
| `/vibe contract AUTH-001 --lock` | Lock contract for parallel impl |
| `/vibe contract AUTH-001 --unlock` | Unlock (requires confirmation) |

---

## Related Commands

- `/vibe parallel [ID]` - Start parallel implementation with contract
- `/vibe [ID]` - Start sequential implementation (contract optional)
- `/vibe validate [ID]` - Validate feature spec before contract generation
