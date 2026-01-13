# Migration Command

> `/vibe migrate [subcommand]` - Test-driven migration workflow for strangler fig pattern

## Purpose

Migrate existing features from legacy code to Ash+Svelte using test-first approach:
- Document current behavior
- Write regression tests in target architecture
- Implement migration only after tests pass against legacy code
- Verify tests pass against new code

**Safety Rule**: NO migration without test battery first.

---

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `/vibe migrate init` | Analyze current codebase, create architecture docs |
| `/vibe migrate [FEATURE]` | Create migration spec + test requirements for feature |
| `/vibe migrate status` | Show migration progress |

---

## /vibe migrate init

### Purpose

First-time setup for migration projects. Analyzes existing codebase and creates documentation structure.

### Workflow

```
+======================================================================+
|  MIGRATE INITIALIZATION                                               |
|  Project: {project.name}                                              |
+======================================================================+
```

**Phase 1: Verify Migration Config**

Check `.claude/vibe.config.json` has migration section:
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

If missing → BLOCK and show required config.

**Phase 2: Create Directory Structure**

```
architecture/
├── _current/              # Document existing system
│   ├── overview.md
│   ├── features.md
│   ├── database.md
│   └── api.md
└── _target/               # Copy from template
    ├── README.md
    ├── _fundamentals/
    ├── _guides/
    ├── _patterns/
    ├── _anti-patterns/
    └── _checklists/

docs/domain/features/
├── _current/              # Legacy feature specs
└── new/                   # New Ash+Svelte features

.claude/
└── migration.md           # Progress tracking
```

**Phase 3: Analyze Existing Codebase**

1. Scan for existing features (routes, controllers, contexts)
2. Create initial `architecture/_current/overview.md`
3. List discovered features in `architecture/_current/features.md`
4. Initialize `.claude/migration.md` tracking file

**Phase 4: Copy Target Architecture**

1. Read template from `~/projects/vibe-ash-svelte-template/architecture/`
2. Copy to `architecture/_target/`
3. Update `architecture/README.md` with links to both

**Output:**

```
+---------------------------------------------------------------------+
|  MIGRATION INITIALIZED                                               |
|                                                                      |
|  Created:                                                            |
|    ✓ architecture/_current/ (4 files)                                |
|    ✓ architecture/_target/ (from template)                           |
|    ✓ docs/domain/features/_current/                                  |
|    ✓ .claude/migration.md                                            |
|                                                                      |
|  Discovered Features: {count}                                        |
|  (Listed in architecture/_current/features.md)                       |
|                                                                      |
|  Next Steps:                                                         |
|  1. Review architecture/_current/ and add details                    |
|  2. Run `/vibe migrate FEATURE` for each feature to migrate          |
|  3. Run `/vibe NEW-XXX` for new features (Ash+Svelte native)         |
|                                                                      |
|  Press Enter to continue...                                          |
+---------------------------------------------------------------------+
```

---

## /vibe migrate [FEATURE]

### Purpose

Prepare migration for a specific legacy feature. Creates migration spec and BLOCKS until regression tests are written.

### Workflow

```
+======================================================================+
|  MIGRATE FEATURE ANALYSIS                                             |
|  Feature: [FEATURE]                                                   |
+======================================================================+
```

**Phase 1: Analyze Legacy Feature**

1. Read legacy code for the feature
2. Document current behavior:
   - Routes/endpoints
   - Database tables/queries
   - UI components/views
   - Business logic
   - Dependencies (what it uses)
   - Dependents (what uses it)

```
+---------------------------------------------------------------------+
|  LEGACY ANALYSIS: [FEATURE]                                          |
|                                                                      |
|  Location:                                                           |
|    - lib/app_web/live/feature_live.ex                                |
|    - lib/app/contexts/feature.ex                                     |
|                                                                      |
|  Routes: /feature, /feature/:id, /feature/new                        |
|  Tables: features, feature_items                                     |
|  Dependencies: User context, Auth plug                               |
|  Dependents: Dashboard, Reports                                      |
|                                                                      |
|  Current Behavior:                                                   |
|    * Lists all features for user                                     |
|    * Creates new feature with validation                             |
|    * Updates feature (owner only)                                    |
|    * Soft deletes feature                                            |
|                                                                      |
|  Confirm analysis? [Enter] or provide corrections: ___               |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - Wait for user confirmation

**Phase 2: Generate BDD Scenarios**

Based on analyzed behavior, generate Given/When/Then scenarios:

```
+---------------------------------------------------------------------+
|  MIGRATION SCENARIOS: [FEATURE]                                      |
|                                                                      |
|  ### Scenario 1: List user's features                                |
|  - Given user is logged in with features                             |
|  - When they visit /features                                         |
|  - Then they see only their features                                 |
|                                                                      |
|  ### Scenario 2: Create new feature                                  |
|  - Given user is logged in                                           |
|  - When they submit valid feature data                               |
|  - Then feature is created                                           |
|  - And they see success message                                      |
|                                                                      |
|  ### Scenario 3: Update feature (owner)                              |
|  - Given user owns a feature                                         |
|  - When they update the feature                                      |
|  - Then changes are saved                                            |
|                                                                      |
|  ### Scenario 4: Update feature (non-owner) - BLOCKED                |
|  - Given user does not own the feature                               |
|  - When they try to update it                                        |
|  - Then they get authorization error                                 |
|                                                                      |
|  [A] Add scenario  [E] Edit scenario  [Enter] Continue               |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - Wait for user to confirm scenarios

**Phase 3: Generate Test Stubs**

Create test file stubs in **target architecture** (not legacy patterns):

```
+---------------------------------------------------------------------+
|  TEST REQUIREMENTS: [FEATURE]                                        |
|                                                                      |
|  Tests must be written in TARGET ARCHITECTURE:                       |
|                                                                      |
|  Backend (ExUnit + Ash):                                             |
|    test/app/domains/feature_test.exs                                 |
|    - test "lists user's features"                                    |
|    - test "creates feature with valid data"                          |
|    - test "updates feature when owner"                               |
|    - test "rejects update when not owner"                            |
|                                                                      |
|  Frontend (Vitest + Svelte):                                         |
|    assets/svelte/tests/Feature.test.ts                               |
|    - test "shows feature list"                                       |
|    - test "shows create form"                                        |
|    - test "handles success message"                                  |
|                                                                      |
|  Integration (ExUnit + LiveView):                                    |
|    test/app_web/live/feature_live_test.exs                           |
|    - test "full user flow"                                           |
|                                                                      |
|  [G] Generate test stubs  [S] Skip (I'll write manually)             |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - User chooses to generate or write manually

**Phase 4: Create Migration Spec**

Create `docs/domain/features/_current/MIGRATE-[FEATURE].md`:

```markdown
# MIGRATE-[FEATURE]: [Feature Name]

> Migration from [current stack] to Ash+Svelte

**Status:** Test Battery Required

---

## Legacy Analysis

### Location
- `lib/app_web/live/feature_live.ex`
- `lib/app/contexts/feature.ex`

### Routes
| Path | Method | Action |
|------|--------|--------|
| /feature | GET | List |
| /feature/:id | GET | Show |
| /feature/new | GET | New |

### Database Tables
- `features` (shared during migration)
- `feature_items` (shared during migration)

### Dependencies
- User context
- Auth plug

### Dependents
- Dashboard module
- Reports module

---

## Migration Scope

### Routes to Migrate
- [ ] /feature
- [ ] /feature/:id
- [ ] /feature/new

### Database Strategy
- Use existing tables (shared)
- New Ash resource maps to same table
- No schema changes until legacy removed

---

## Acceptance Scenarios

### Scenario 1: List user's features
- **Given** user is logged in with features
- **When** they visit /features
- **Then** they see only their features

### Scenario 2: Create new feature
...

---

## Test Requirements

### Backend Tests (ExUnit + Ash)
**File:** `test/app/domains/feature_test.exs`

- [ ] `test "lists user's features"`
- [ ] `test "creates feature with valid data"`
- [ ] `test "updates feature when owner"`
- [ ] `test "rejects update when not owner"`

### Frontend Tests (Vitest + Svelte)
**File:** `assets/svelte/tests/Feature.test.ts`

- [ ] `test "shows feature list"`
- [ ] `test "shows create form"`

### Integration Tests
**File:** `test/app_web/live/feature_live_test.exs`

- [ ] `test "full user flow"`

---

## Migration Readiness Gate

Before implementation can start:

- [ ] All test files created (target architecture)
- [ ] Tests pass against legacy code
- [ ] No blocking dependencies

**Current Status:** ⚠️ BLOCKED - Tests required

---

## Implementation Plan

1. Create Ash resource mapping to existing table
2. Create Svelte components
3. Create LiveView with LiveSvelte
4. Update routes (via proxy or config)
5. Verify all tests pass
6. Route traffic to new implementation
7. Remove legacy code

---

## Deprecation Checklist

- [ ] New implementation complete
- [ ] All tests pass (new code)
- [ ] Traffic routed to new code
- [ ] Legacy code removed
- [ ] Dependencies updated
```

**Phase 5: Update Migration Tracking**

Update `.claude/migration.md`:

```markdown
## Remaining (Legacy)

- [ ] **MIGRATE-FEATURE**: [Feature Name]
  - [ ] Regression tests written
  - [ ] Tests pass against legacy
  - [ ] Implementation complete
  - [ ] Tests pass against new code
```

**Final Output:**

```
+---------------------------------------------------------------------+
|  MIGRATION SPEC CREATED                                              |
|                                                                      |
|  File: docs/domain/features/_current/MIGRATE-[FEATURE].md            |
|                                                                      |
|  Status: ⚠️ BLOCKED - Regression tests required                      |
|                                                                      |
|  Next Steps:                                                         |
|  1. Write tests in target architecture (see spec for files)          |
|  2. Verify tests pass against LEGACY code                            |
|  3. Run `/vibe MIGRATE-[FEATURE]` to implement                       |
|                                                                      |
|  NOTE: Implementation blocked until tests pass against legacy.       |
+---------------------------------------------------------------------+
```

---

## /vibe migrate status

### Purpose

Show migration progress across all features.

### Output

```
+======================================================================+
|  MIGRATION STATUS                                                     |
|  Project: {project.name}                                              |
+======================================================================+

Target: https://github.com/AugustoPedraza/vibe-ash-svelte-template

Progress:
  ████████░░░░░░░░░░░░ 40%

| Status | Count |
|--------|-------|
| Migrated | 4 |
| In Progress | 2 |
| Blocked (needs tests) | 3 |
| Remaining | 6 |
| New (Ash+Svelte native) | 5 |

---

## Migrated ✓

- [x] AUTH-001: User authentication
- [x] PWA-001: App manifest
- [x] PWA-002: Service worker
- [x] PROFILE-001: User profile

## In Progress

- [ ] MIGRATE-DASHBOARD: Dashboard (75%)
  - [x] Regression tests written
  - [x] Tests pass against legacy
  - [x] Ash resources created
  - [ ] Svelte components
  - [ ] Tests pass against new code

- [ ] MIGRATE-SETTINGS: Settings (25%)
  - [x] Regression tests written
  - [ ] Tests pass against legacy
  - [ ] Implementation started

## Blocked ⚠️ (Needs Tests)

- [ ] MIGRATE-REPORTS: Reports module
- [ ] MIGRATE-BILLING: Billing
- [ ] MIGRATE-NOTIFICATIONS: Notifications

## Remaining

- [ ] MIGRATE-ADMIN: Admin panel
- [ ] MIGRATE-SEARCH: Search
- [ ] MIGRATE-EXPORT: Export/Import
...

## New Features (Ash+Svelte Native)

- [x] CHAT-001: Real-time chat
- [x] OFFLINE-001: Offline support
- [ ] NOTIF-001: Push notifications
...

---

Commands:
  /vibe migrate [FEATURE]    # Start migration for feature
  /vibe MIGRATE-XXX          # Implement migration (if tests pass)
  /vibe NEW-XXX              # Build new feature in Ash+Svelte
```

---

## Implementing a Migration: /vibe MIGRATE-[FEATURE]

When user runs `/vibe MIGRATE-[FEATURE]`:

**Pre-check (HARD BLOCK):**

```
+---------------------------------------------------------------------+
|  MIGRATION READINESS CHECK                                           |
|                                                                      |
|  Feature: MIGRATE-[FEATURE]                                          |
|                                                                      |
|  Test Coverage:                                                      |
|  [x] Regression tests written (target architecture)                  |
|  [x] Tests pass against legacy code                                  |
|  [x] All BDD scenarios have corresponding tests                      |
|  [x] Edge cases covered                                              |
|                                                                      |
|  ✓ READY FOR IMPLEMENTATION                                          |
+---------------------------------------------------------------------+
```

If tests don't exist or don't pass:

```
+---------------------------------------------------------------------+
|  MIGRATION BLOCKED                                                   |
|                                                                      |
|  Feature: MIGRATE-[FEATURE]                                          |
|                                                                      |
|  Test Coverage:                                                      |
|  [x] Regression tests written                                        |
|  [ ] Tests pass against legacy code                                  |
|      └─ 3 tests failing (see test/app/domains/feature_test.exs)      |
|                                                                      |
|  ✗ CANNOT START IMPLEMENTATION                                       |
|                                                                      |
|  Fix tests first, then run `/vibe MIGRATE-[FEATURE]` again.          |
+---------------------------------------------------------------------+
```

**If ready, proceed with standard vibe workflow (QA → Designer → Dev → QA).**

---

## Anti-Patterns

- Starting migration without tests
- Writing tests in legacy patterns (use target architecture)
- Changing database schema before legacy is removed
- Migrating features with failing tests
- Skipping the readiness gate

---

## Related Commands

- `/vibe check` - Validates project structure (detects migration mode)
- `/vibe [FEATURE-ID]` - Standard implementation (for new features)
- `/vibe status` - Shows overall progress including migration
