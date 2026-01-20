# OpenSpec Analysis: Vibe Framework Improvements

## Executive Summary

OpenSpec introduces **spec-driven development** with clear separation between authoritative specifications and change proposals. Analyzing it against Vibe reveals opportunities to improve:

1. **Specification lifecycle management** (source of truth vs proposals)
2. **Change traceability** (structured deltas)
3. **Archive workflow** (living documentation)
4. **Flexible action execution** (non-linear phases)

---

## Framework Comparison

| Aspect | Vibe Framework | OpenSpec | Winner |
|--------|---------------|----------|--------|
| **Role Specialization** | 6 roles (Dev, QA, Designer, PM, Architect, Multi-Agent) | Single AI assistant with modes | Vibe |
| **Workflow Model** | Phase-based TDD | Action-based fluid | Tie* |
| **Spec Management** | Feature files (flat) | Specs + Changes (hierarchical) | OpenSpec |
| **Change Tracking** | Git-based | Structured deltas + archive | OpenSpec |
| **Tech Stack Focus** | Deep (Ash/Phoenix/Svelte) | Generic | Vibe |
| **Pattern Library** | RAG-lite index with feedback | None | Vibe |
| **Quality Measurement** | Numeric scoring rubric | Validation only | Vibe |
| **Multi-Agent Support** | Built-in coordination | None | Vibe |
| **Session Continuity** | Checkpoint persistence | Change folders | Tie |
| **UX Requirements** | 4-state mandatory | Generic scenarios | Vibe |

*Vibe's phases provide structure; OpenSpec's actions provide flexibility. Both valid.

---

## Key OpenSpec Concepts to Adopt

### 1. Specs vs Changes Architecture

**OpenSpec's Approach:**
```
openspec/
├── specs/           # Source of truth
│   └── auth/
│       └── spec.md  # Current auth behavior
└── changes/         # Proposals
    └── add-oauth/
        ├── proposal.md
        ├── tasks.md
        └── specs/   # Delta showing changes
            └── auth/
                └── spec.md  # ADDED/MODIFIED/REMOVED
```

**Vibe Currently:**
```
features/
└── AUTH-001-login.md  # Mixed: truth + proposal + tasks
```

**Problem:** No distinction between "what IS" and "what will CHANGE"

### 2. Structured Delta Format

**OpenSpec uses explicit change markers:**
```markdown
## ADDED Requirements

### OAuth Integration
The system SHALL support OAuth 2.0 providers.

#### Scenario: Google OAuth Login
- Given a user clicks "Sign in with Google"
- When they complete the OAuth flow
- Then they SHALL be authenticated with a linked account

## MODIFIED Requirements

### Session Management
The session duration SHALL be extended from 24h to 7 days.
(Previous: 24 hours)

## REMOVED Requirements

### Password Reset via SMS
SMS-based reset is deprecated and SHALL be removed.
```

**Benefit:** Clear traceability of what changed and why

### 3. Archive Workflow

**OpenSpec lifecycle:**
```
Draft → Review → Implement → Archive → (merged into specs/)
```

**After completion:**
- Change folder moves to `archived/`
- Deltas merge into authoritative `specs/`
- Creates living documentation

### 4. Fluid Actions (OPSX)

**Standard phases can be limiting when:**
- Discovery reveals the approach needs rethinking
- Implementation uncovers missing requirements
- Quick iterations need fast-forward through planning

**OPSX actions:**
- `/opsx:explore` - Think without structure
- `/opsx:ff` - Fast-forward through planning
- `/opsx:apply` - Implement with real-time spec updates

---

## Proposed Vibe Enhancements

### Enhancement 1: Domain Specs Directory

Add authoritative domain specifications separate from feature work.

**New structure:**
```
project/
├── .claude/
│   ├── specs/                    # NEW: Source of truth
│   │   ├── domains/
│   │   │   ├── auth.md           # Auth domain spec
│   │   │   ├── billing.md
│   │   │   └── notifications.md
│   │   ├── api.md                # API contracts
│   │   └── events.md             # Domain events
│   │
│   └── features/                 # Change proposals
│       ├── active/               # In progress
│       │   └── AUTH-001/
│       │       ├── proposal.md   # Why this change
│       │       ├── spec.md       # Feature spec (current)
│       │       └── delta.md      # NEW: Changes to domain
│       │
│       └── archived/             # Completed
│           └── AUTH-001/
```

**Impact:** Clear separation; better brownfield support

### Enhancement 2: Delta Tracking

Add `delta.md` to feature folders showing domain spec changes.

**Template:**
```markdown
# {FEATURE-ID} Domain Changes

## Affected Specs
- `specs/domains/auth.md`

## ADDED Requirements

### {Requirement Name}
The system SHALL {behavior}.

#### Scenario: {name}
- Given {precondition}
- When {action}
- Then {outcome}

## MODIFIED Requirements

### {Requirement Name}
**Was:** {previous behavior}
**Now:** {new behavior}

#### Updated Scenario: {name}
- Given {precondition}
- When {action}
- Then {outcome}

## REMOVED Requirements

### {Requirement Name}
Removed because: {rationale}
```

**Impact:** Traceability; audit trail; easier reviews

### Enhancement 3: Archive Command

New command: `/vibe archive [FEATURE-ID]`

**Workflow:**
1. Verify all scenarios pass
2. Move feature folder to `archived/`
3. Merge deltas into domain specs
4. Update `specs/` with new requirements
5. Log completion in `completed.md`

**Display:**
```
+---------------------------------------------------------------------+
|  ARCHIVE: AUTH-001                                                   |
|                                                                      |
|  Pre-checks:                                                         |
|  [x] All scenarios passing                                           |
|  [x] QA validation complete (4.2/5.0)                                |
|  [x] No blockers                                                     |
|                                                                      |
|  Changes to merge:                                                   |
|  + specs/domains/auth.md: 3 additions, 1 modification                |
|  + specs/api.md: 2 new endpoints                                     |
|                                                                      |
|  [a] Archive and merge  [p] Preview changes  [c] Cancel              |
+---------------------------------------------------------------------+
```

**Impact:** Living documentation; specs stay current

### Enhancement 4: Validate Command

New command: `/vibe validate [FEATURE-ID]`

**Checks:**
```
+---------------------------------------------------------------------+
|  VALIDATE: AUTH-001                                                  |
|                                                                      |
|  Structure:                                                          |
|  [x] proposal.md exists                                              |
|  [x] spec.md has required sections                                   |
|  [x] All scenarios have Given/When/Then                              |
|  [ ] delta.md exists (OPTIONAL for new domains)                      |
|                                                                      |
|  Requirements:                                                       |
|  [x] All SHALL statements have scenarios                             |
|  [x] UX states defined (loading, error, empty, success)              |
|  [x] UI spec YAML is valid                                           |
|                                                                      |
|  Consistency:                                                        |
|  [x] Scenarios match test file names                                 |
|  [x] Component names match components.json                           |
|  [ ] API endpoints match specs/api.md (WARNING: 1 mismatch)          |
|                                                                      |
|  Result: VALID (1 warning)                                           |
+---------------------------------------------------------------------+
```

**Impact:** Catch issues before implementation

### Enhancement 5: Explore Mode

New command: `/vibe explore`

**Purpose:** Think through ideas without committing to structure

**Workflow:**
```
/vibe explore "I want to add social login"

+---------------------------------------------------------------------+
|  EXPLORE MODE                                                        |
|                                                                      |
|  Topic: Social login integration                                     |
|                                                                      |
|  Let me think through this...                                        |
|                                                                      |
|  Questions to consider:                                              |
|  - Which providers? (Google, Apple, GitHub)                          |
|  - Account linking strategy?                                         |
|  - Existing users?                                                   |
|                                                                      |
|  Related specs:                                                      |
|  - specs/domains/auth.md (current auth flow)                         |
|  - specs/api.md (session endpoints)                                  |
|                                                                      |
|  Patterns that may apply:                                            |
|  - async-result-extraction (for OAuth callbacks)                     |
|                                                                      |
|  Ready to formalize?                                                 |
|  [f] Create feature spec  [c] Continue exploring  [x] Exit           |
+---------------------------------------------------------------------+
```

**Impact:** Reduces premature commitment; better discovery

### Enhancement 6: Fast-Forward Mode

New command: `/vibe ff [FEATURE-ID]`

**Purpose:** Generate all planning artifacts at once for simple features

**Workflow:**
```
/vibe ff AUTH-002

+---------------------------------------------------------------------+
|  FAST-FORWARD: AUTH-002                                              |
|                                                                      |
|  Generating planning artifacts...                                    |
|                                                                      |
|  [x] QA scenarios (3 generated)                                      |
|  [x] Designer wireframes (1 screen)                                  |
|  [x] UI spec YAML                                                    |
|  [x] Domain delta (1 modification)                                   |
|                                                                      |
|  Ready for review before implementation.                             |
|                                                                      |
|  [r] Review all  [i] Start implementing  [e] Edit specific           |
+---------------------------------------------------------------------+
```

**Guardrail:** Only for features scoring LOW complexity (<3 scenarios)

**Impact:** Faster iteration for simple features

---

## Implementation Status

| Enhancement | Effort | Impact | Priority | Status |
|-------------|--------|--------|----------|--------|
| 2. Delta Tracking | Low | High | P1 | ✅ DONE |
| 4. Validate Command | Low | Medium | P1 | ✅ DONE |
| 5. Explore Mode | Medium | High | P1 | ✅ DONE |
| 1. Specs Directory | Medium | High | P2 | ✅ DONE |
| 3. Archive Command | Medium | Medium | P2 | ✅ DONE |
| 6. Fast-Forward | Low | Medium | P3 | ⏳ Future |

### Implemented Files

- `templates/features/DELTA-TEMPLATE.md` - Delta tracking template
- `prompts/commands/validate.md` - Validate command
- `prompts/commands/explore.md` - Explore command
- `prompts/commands/archive.md` - Archive command
- `templates/specs/DOMAIN-TEMPLATE.md` - Domain spec template
- `templates/specs/API-TEMPLATE.md` - API spec template
- `templates/specs/README.md` - Specs directory guide
- Updated `prompts/vibe.md` with new commands and Specs vs Changes architecture
- Updated `prompts/help.md` with new command reference
- Updated `templates/features/FEATURE-TEMPLATE.md` with Domain Changes section

---

## What NOT to Adopt

| OpenSpec Feature | Reason to Skip |
|------------------|----------------|
| Single AI mode | Vibe's roles provide specialization |
| Generic tech focus | Ash/Svelte specificity is valuable |
| No pattern library | RAG-lite patterns are working well |
| No quality scoring | Numeric rubric provides gradient |
| CLI tooling | Claude Code handles file ops |

---

## Integration with Existing Enhancements

The recent LLM toolkit enhancements complement these changes:

| Existing | OpenSpec Addition | Synergy |
|----------|-------------------|---------|
| Pattern index | Delta tracking | Patterns referenced in deltas |
| Quality scoring | Validate command | Validation includes score check |
| Checkpoints | Archive workflow | Checkpoint → complete → archive |
| Structured handoffs | Explore mode | Explore outputs structured context |

---

## Next Steps

1. **Review this analysis** with user
2. **Prioritize enhancements** based on current pain points
3. **Implement P1 items** (delta, validate, explore)
4. **Test with real feature** before full rollout
5. **Document changes** in Vibe README
