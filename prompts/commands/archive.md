# Archive Command

> `/vibe archive [FEATURE-ID]` - Archive completed feature and merge changes into specs

## Purpose

Finalize a completed feature by:
1. Verifying all work is complete
2. Moving feature folder to `archived/`
3. Merging domain deltas into authoritative specs
4. Creating living documentation

## Usage

```
/vibe archive AUTH-001           # Archive specific feature
/vibe archive                    # Archive current feature (from checkpoint)
/vibe archive --dry-run          # Preview changes without applying
/vibe archive --skip-merge       # Archive without merging deltas
```

---

## Workflow

```
Pre-checks -> Preview Changes -> Merge Deltas -> Move to Archive -> Update Logs
```

---

## Step 1: Pre-flight Checks

```
+=====================================================================+
|  ARCHIVE: {FEATURE-ID}                                               |
|                                                                      |
|  Running pre-flight checks...                                        |
|                                                                      |
|  Completion status:                                                  |
|  [x] All scenarios implemented                                       |
|  [x] All tests passing                                               |
|  [x] QA validation complete                                          |
|  [x] Quality score: 4.2/5.0 (Good)                                   |
|                                                                      |
|  Blockers:                                                           |
|  [x] No open blockers                                                |
|                                                                      |
|  Files:                                                              |
|  [x] spec.md exists                                                  |
|  [x] delta.md exists (optional but present)                          |
|                                                                      |
|  Pre-checks: PASS                                                    |
+=====================================================================+
```

### Pre-check Failures

```
+=====================================================================+
|  ARCHIVE: {FEATURE-ID}                                               |
|                                                                      |
|  Pre-checks: FAILED                                                  |
|                                                                      |
|  Issues found:                                                       |
|  ! 2 scenarios not implemented                                       |
|    - Scenario 3: User forgets password                               |
|    - Scenario 5: Rate limiting                                       |
|                                                                      |
|  ! 1 test failing                                                    |
|    - test/auth/login_test.exs:45                                     |
|                                                                      |
|  ! QA validation not complete                                        |
|    - Run /vibe [FEATURE-ID] to complete QA phase                     |
|                                                                      |
|  Cannot archive until issues resolved.                               |
|                                                                      |
|  [f] Force archive (not recommended)  [r] Return to work             |
+=====================================================================+
```

---

## Step 2: Preview Changes

Show what will be archived and merged:

```
+---------------------------------------------------------------------+
|  ARCHIVE PREVIEW                                                     |
|                                                                      |
|  Feature: AUTH-001 - User Login                                      |
|  Status: complete                                                    |
|  Quality: 4.2/5.0                                                    |
|  Completed: 2026-01-20                                               |
|                                                                      |
|  Files to archive:                                                   |
|    .claude/features/AUTH-001/                                        |
|    ├── spec.md (main specification)                                  |
|    ├── delta.md (domain changes)                                     |
|    └── _multi_review.md (review notes)                               |
|                                                                      |
|  → Moving to: .claude/features/archived/AUTH-001/                    |
|                                                                      |
+---------------------------------------------------------------------+
|  DELTA MERGE PREVIEW                                                 |
|                                                                      |
|  Target: specs/domains/auth.md                                       |
|                                                                      |
|  ADDED Requirements (3):                                             |
|  + Session Management                                                |
|    "The system SHALL create a session on successful login"           |
|  + Remember Me                                                       |
|    "The system SHALL extend session to 7 days when requested"        |
|  + Rate Limiting                                                     |
|    "The system SHALL limit login attempts to 5 per minute"           |
|                                                                      |
|  MODIFIED Requirements (1):                                          |
|  ~ Authentication                                                    |
|    Was: "Email/password authentication"                              |
|    Now: "Email/password with optional remember me"                   |
|                                                                      |
|  REMOVED Requirements (0):                                           |
|    (none)                                                            |
|                                                                      |
+---------------------------------------------------------------------+
|  API UPDATES                                                         |
|                                                                      |
|  Target: specs/api.md                                                |
|                                                                      |
|  New endpoints:                                                      |
|  + POST /api/v1/sessions (create session)                            |
|  + DELETE /api/v1/sessions (logout)                                  |
|                                                                      |
+---------------------------------------------------------------------+
|                                                                      |
|  [a] Archive and merge  [p] Preview diff  [c] Cancel                 |
+---------------------------------------------------------------------+
```

---

## Step 3: Merge Deltas

When user confirms, merge changes into specs:

```
+---------------------------------------------------------------------+
|  MERGING DELTAS                                                      |
|                                                                      |
|  [x] Reading delta.md                                                |
|  [x] Parsing ADDED/MODIFIED/REMOVED sections                         |
|  [x] Updating specs/domains/auth.md                                  |
|      + Added: Session Management section                             |
|      + Added: Remember Me section                                    |
|      + Added: Rate Limiting section                                  |
|      ~ Modified: Authentication section                              |
|  [x] Updating Change History table                                   |
|  [x] Updating specs/api.md                                           |
|      + Added: POST /api/v1/sessions                                  |
|      + Added: DELETE /api/v1/sessions                                |
|                                                                      |
|  Merge complete.                                                     |
+---------------------------------------------------------------------+
```

### Merge Conflict Handling

If spec was modified outside feature work:

```
+---------------------------------------------------------------------+
|  MERGE CONFLICT                                                      |
|                                                                      |
|  specs/domains/auth.md has been modified since feature started.      |
|                                                                      |
|  Conflicting section: Authentication                                 |
|                                                                      |
|  Current spec says:                                                  |
|    "Email/password with MFA support"                                 |
|                                                                      |
|  Delta wants:                                                        |
|    "Email/password with optional remember me"                        |
|                                                                      |
|  Resolution options:                                                 |
|  [k] Keep current spec (discard delta change)                        |
|  [o] Overwrite with delta                                            |
|  [m] Merge manually (opens editor)                                   |
|  [c] Cancel archive                                                  |
+---------------------------------------------------------------------+
```

---

## Step 4: Move to Archive

```
+---------------------------------------------------------------------+
|  ARCHIVING                                                           |
|                                                                      |
|  [x] Creating .claude/features/archived/AUTH-001/                    |
|  [x] Moving spec.md                                                  |
|  [x] Moving delta.md                                                 |
|  [x] Moving supporting files                                         |
|  [x] Adding archive metadata                                         |
|  [x] Removing from active features                                   |
|                                                                      |
|  Archive complete.                                                   |
+---------------------------------------------------------------------+
```

### Archive Metadata

Added to archived spec:

```markdown
---
archived: 2026-01-20
quality_score: 4.2
scenarios_completed: 5
patterns_used: [async-result-extraction, liveview-navigation]
merged_to: [specs/domains/auth.md, specs/api.md]
---
```

---

## Step 5: Update Logs

```
+---------------------------------------------------------------------+
|  LOGGING                                                             |
|                                                                      |
|  [x] Updated .claude/completed.md                                    |
|  [x] Updated .claude/learnings.md (if retro done)                    |
|  [x] Cleared checkpoint                                              |
|                                                                      |
+---------------------------------------------------------------------+
```

### completed.md Entry

```markdown
## AUTH-001: User Login

- **Completed:** 2026-01-20
- **Quality:** 4.2/5.0
- **Scenarios:** 5
- **Patterns:** async-result-extraction, liveview-navigation
- **Specs Updated:** auth.md, api.md
- **Archive:** .claude/features/archived/AUTH-001/
```

---

## Final Summary

```
+=====================================================================+
|  ARCHIVE COMPLETE: AUTH-001                                          |
|                                                                      |
|  Feature archived successfully.                                      |
|                                                                      |
|  Summary:                                                            |
|  - Specs updated: 2 files                                            |
|  - Requirements added: 3                                             |
|  - Requirements modified: 1                                          |
|  - Archive location: .claude/features/archived/AUTH-001/             |
|                                                                      |
|  The feature is now part of your project's living documentation.     |
|                                                                      |
|  Next steps:                                                         |
|  - Review updated specs in specs/domains/auth.md                     |
|  - Consider /vibe retro for pattern extraction                       |
|  - Start next feature with /vibe [FEATURE-ID]                        |
|                                                                      |
+=====================================================================+
```

---

## Archive Directory Structure

```
.claude/features/
├── active/                     # In-progress features
│   └── AUTH-002/
│
└── archived/                   # Completed features
    ├── AUTH-001/
    │   ├── spec.md             # Original spec (with archive metadata)
    │   ├── delta.md            # Domain changes (for reference)
    │   └── _multi_review.md    # Review notes (if any)
    │
    └── BILLING-001/
```

---

## Options

| Flag | Effect |
|------|--------|
| `--dry-run` | Show what would happen without changes |
| `--skip-merge` | Archive without merging deltas |
| `--force` | Archive even with failing pre-checks |
| `--no-log` | Don't update completed.md |

---

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Archive incomplete features | Complete all scenarios first |
| Skip delta merge | Merge to keep specs current |
| Archive without retro | Run `/vibe retro` first for learnings |
| Force archive with failures | Fix issues or document exceptions |

---

## Integration

### After QA Validation

```
/vibe AUTH-001

QA Validation complete: 4.2/5.0

[a] Archive feature  [r] Run retro  [c] Continue working
```

### With Retro

```
/vibe retro

Retro complete. Patterns extracted.

Archive this feature? [y] Yes [n] No
```

### With Git

After archive completes:
```
Changes to commit:
  - specs/domains/auth.md (updated)
  - specs/api.md (updated)
  - .claude/features/archived/AUTH-001/ (new)
  - .claude/completed.md (updated)

Suggested commit: "Complete AUTH-001: User Login - update specs"
```
