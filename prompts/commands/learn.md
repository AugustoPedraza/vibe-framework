# Learn Command

> `/vibe learn [FEATURE-ID]` - Trigger continuous learning extraction

## Purpose

Capture learnings from completed work, extract reusable patterns, analyze human interventions, and update the system's knowledge base. Consolidates the retrospective workflow with continuous improvement.

## Usage

```
/vibe learn                      # Learn from current session
/vibe learn [FEATURE-ID]         # Learn from specific feature
/vibe learn --patterns           # Focus on pattern extraction
/vibe learn --pitfalls           # Focus on pitfall generation
```

---

## Workflow

```
Gather → Analyze Interventions → Extract Patterns → Update Index → Generate Pitfalls → Summary
```

---

## Step 1: Gather Context

```
+======================================================================+
|  LEARN: Continuous Learning Extraction                                |
|  Scope: [current session | FEATURE-ID]                                |
+======================================================================+

Loading context...
  [✓] Session history
  [✓] Fix sessions
  [✓] Watcher reports
  [✓] Current patterns
  [✓] Current pitfalls
```

---

## Step 2: Human Intervention Analysis

Automated scan for AI errors that required human fixes.

### Detection Patterns

```yaml
human_intervention_patterns:
  explicit_correction:
    signals: ["no, you should", "that's wrong", "you forgot", "don't do that"]
    severity: high
  redo_request:
    signals: ["try again", "redo this", "start over", "revert that"]
    severity: high
  manual_fix:
    signals: ["I'll fix it", "I fixed it", "I had to change", "I manually"]
    severity: medium
  repeated_error:
    signals: ["again", "same mistake", "keep forgetting", "every time"]
    severity: critical
```

### Analysis Display

```
+---------------------------------------------------------------------+
|  HUMAN INTERVENTION ANALYSIS                                         |
|                                                                      |
|  Interventions Detected: 3                                           |
|                                                                      |
|  1. [HIGH] Explicit Correction                                       |
|     User: "you forgot to add socket={@socket}"                       |
|     Category: Forgot required step                                   |
|     Preventable: YES - documented in polish-watcher.md               |
|     → Suggest pitfall: PIT-XXX                                       |
|                                                                      |
|  2. [MEDIUM] Manual Fix                                              |
|     User edited: lib/syna_web/live/chat_live.ex                      |
|     Changed: Added missing import statement                          |
|     Category: Missed import                                          |
|     Preventable: MAYBE - not explicitly documented                   |
|     → Suggest pitfall: PIT-XXX                                       |
|                                                                      |
|  3. [CRITICAL] Repeated Error                                        |
|     User: "you keep forgetting the socket prop"                      |
|     Category: Same as #1 - repeated mistake                          |
|     Preventable: YES - already documented                            |
|     → PRIORITY pitfall with blocker severity                         |
|                                                                      |
|  [c] Create pitfalls for all  [s] Select which  [v] View details     |
+---------------------------------------------------------------------+
```

---

## Step 3: Pattern Extraction

### Reusability Scoring

| Factor | Score | Criteria |
|--------|-------|----------|
| Domain Independence | +2 | Works with any domain (no business terms) |
| Tech Generality | +2 | Common framework pattern (not edge case) |
| Repetition | +1 | Same pattern appears 2+ times in codebase |
| Non-obvious | +1 | Solution isn't immediately apparent |
| Well-documented | +1 | Already has good comments/structure |

**Thresholds:**
- **HIGH (5+)**: Auto-promote to `patterns/`
- **MEDIUM (3-4)**: Consider for extraction
- **LOW (<3)**: Keep local only

### Pattern Detection Display

```
+---------------------------------------------------------------------+
|  PATTERN EXTRACTION                                                  |
|                                                                      |
|  DETECTED PATTERNS:                                                  |
|                                                                      |
|  1. [HIGH: 6] Ash action with async notification                     |
|     File: lib/accounts/resources/user.ex:45-80                       |
|     Factors:                                                         |
|       +2 domain independent                                          |
|       +2 tech general (common Ash pattern)                           |
|       +1 appears 2x in codebase                                      |
|       +1 non-obvious (async timing)                                  |
|     → Will promote to: patterns/backend/ash-async-notification.md    |
|                                                                      |
|  2. [MEDIUM: 4] Form with real-time validation                       |
|     File: assets/svelte/components/features/auth/LoginForm.svelte    |
|     Factors:                                                         |
|       +2 domain independent                                          |
|       +1 appears 2x in codebase                                      |
|       +1 well-documented                                             |
|     → Consider for extraction                                        |
|                                                                      |
|  [1,2] Select to extract  [a] All high  [n] None                     |
+---------------------------------------------------------------------+
```

---

## Step 4: Pattern Usage Feedback

Collect feedback on patterns used during the session:

```
+---------------------------------------------------------------------+
|  PATTERN USAGE FEEDBACK                                              |
|                                                                      |
|  Patterns used this session:                                         |
|                                                                      |
|  1. async-result-extraction                                          |
|     Used in: lib/syna_web/live/home_live.ex                          |
|     How well did it work?                                            |
|       [5] Perfect - no adaptation needed                             |
|       [4] Good - minor tweaks                                        |
|       [3] OK - needed some adaptation                                |
|       [2] Rough - significant changes required                       |
|       [1] Poor - didn't really apply                                 |
|     Feedback (optional): _______________                             |
|                                                                      |
|  2. liveview-navigation                                              |
|     Used in: assets/lib/utils/navigation.ts                          |
|     Rating [1-5]: ___                                                |
|     Feedback (optional): _______________                             |
|                                                                      |
|  [s] Skip feedback  [Enter] Submit                                   |
+---------------------------------------------------------------------+
```

### Success Rate Calculation

```
new_success_rate = (previous_rate × previous_uses + (score/5)) / (previous_uses + 1)
```

### Low Success Rate Alert

If pattern drops below 60%:

```
+---------------------------------------------------------------------+
|  LOW SUCCESS RATE ALERT                                              |
|                                                                      |
|  Pattern: async-result-extraction                                    |
|  Success rate: 55% (below 60% threshold)                             |
|                                                                      |
|  Recent feedback:                                                    |
|  - "Needed heavy adaptation for list items"                          |
|  - "Pattern didn't fit pagination scenario"                          |
|                                                                      |
|  Options:                                                            |
|  [1] Review and update pattern                                       |
|  [2] Add variant for different use cases                             |
|  [3] Mark as deprecated                                              |
|  [4] Keep as-is for now                                              |
+---------------------------------------------------------------------+
```

---

## Step 5: Update Pattern Index

For promoted patterns, update `patterns/index.json`:

```json
{
  "id": "ash-async-notification",
  "name": "Ash Action with Async Notification",
  "path": "backend/ash-async-notification.md",
  "category": "backend",
  "tags": ["ash", "async", "notification"],
  "triggers": ["notification", "async action", "after action"],
  "problem_keywords": ["notify after save", "async callback"],
  "solution_summary": "Use Ash notifier with async: true",
  "reusability_score": 6,
  "usage_stats": {
    "times_used": 1,
    "success_rate": 1.0,
    "feedback": ["Discovered in Syna / AUTH-001"]
  }
}
```

---

## Step 6: Generate Pitfalls

For detected interventions, create pitfall entries:

```json
{
  "id": "PIT-004",
  "category": "liveview",
  "description": "Missing socket prop in Svelte component used with LiveView",
  "example": "User correction: 'you forgot to add socket={@socket}'",
  "solution": "Always pass socket={@socket} to LiveSvelte components",
  "check": {
    "type": "grep_pattern",
    "pattern": "live_svelte.*socket=",
    "paths": ["lib/*_web/live/"],
    "should_match": true
  },
  "severity": "blocker",
  "discovered_in": "AUTH-001",
  "discovered_at": "2026-01-28",
  "discovered_via": "human_intervention_analysis",
  "times_caught": 0,
  "times_missed": 1
}
```

### Severity Assignment Rules

| Condition | Severity |
|-----------|----------|
| Repeated error (same session) | blocker |
| Explicit correction | warning |
| Manual fix | warning |
| Already in pitfalls.json | upgrade to blocker + increment times_missed |

---

## Step 7: Learning Summary

Append to `.claude/learnings.md`:

```markdown
## 2026-01-28 - AUTH-001: User Login

### Implementation Summary
- Feature completed with 1 fix session
- Polish score: 4.5/5.0

### Human Interventions
- 3 interventions detected
- 2 new pitfalls created (PIT-004, PIT-005)
- 1 existing pitfall upgraded (PIT-002)

### Patterns Extracted
- **ash-async-notification** (HIGH: 6)
  - Async notification after Ash action
  - Promoted to patterns/backend/

### Pattern Usage
| Pattern | Score | Feedback |
|---------|-------|----------|
| async-result-extraction | 4/5 | Needed minor adaptation |
| liveview-form-binding | 5/5 | Perfect fit |

### Recommendations
- Update polish-watcher to check for socket prop
- Review async-result-extraction for list scenarios
```

### Final Display

```
+---------------------------------------------------------------------+
|  LEARNING COMPLETE                                                   |
|                                                                      |
|  Summary:                                                            |
|  * Interventions analyzed: 3                                         |
|  * Pitfalls created: 2 new, 1 updated                                |
|  * Patterns extracted: 1 (ash-async-notification)                    |
|  * Pattern feedback recorded: 2 patterns                             |
|                                                                      |
|  Files updated:                                                      |
|  * patterns/backend/ash-async-notification.md (created)              |
|  * patterns/index.json (updated)                                     |
|  * .claude/pitfalls.json (updated)                                   |
|  * .claude/learnings.md (appended)                                   |
|                                                                      |
|  To share patterns across projects:                                  |
|    cd ~/.claude/vibe-ash-svelte                                      |
|    git add patterns/                                                 |
|    git commit -m "Add pattern: ash-async-notification"               |
|    git push                                                          |
+---------------------------------------------------------------------+
```

---

## Flags

| Flag | Description |
|------|-------------|
| `--patterns` | Focus on pattern extraction only |
| `--pitfalls` | Focus on pitfall generation only |
| `--feedback` | Collect pattern usage feedback only |
| `--dry-run` | Show what would be created without writing |
| `--auto` | Accept all defaults without prompts |

---

## Examples

### After Feature Completion

```
/vibe AUTH-001
  ↓ (implementation complete)
/vibe learn AUTH-001

LEARN: AUTH-001

Analyzing session...
  [✓] Human interventions: 2 found
  [✓] Pattern candidates: 1 HIGH, 1 MEDIUM
  [✓] Usage feedback: 2 patterns

Create pitfalls? [y/n]
```

### Pattern Focus

```
/vibe learn --patterns

LEARN: Pattern extraction only

Scanning implementation files...

Detected:
  1. [HIGH: 6] Form validation with debounce
  2. [MEDIUM: 4] Optimistic UI update

Extract pattern #1? [y/n]
```

### Quick Feedback

```
/vibe learn --feedback

LEARN: Pattern usage feedback

Patterns used this session:
  1. async-result-extraction [1-5]: 4
  2. liveview-navigation [1-5]: 5

Feedback recorded. Success rates updated.
```

---

## Integration

### With Main Workflow

```
/vibe AUTH-001
  ↓ (Phase 5: LEARNING - automatic)
Continuous learning agent runs automatically after Phase 4
```

### With Analyze

```
/vibe analyze AUTH-001
  ↓
[l] Feed to learning
  ↓
Findings fed to learning agent for pattern extraction
```

### With Review

```
/vibe review AUTH-001
  ↓
[l] Feed findings to learn
  ↓
Review findings become learning inputs
```

---

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Skip learning after features | Run `/vibe learn` at least weekly |
| Ignore low success patterns | Review and update or deprecate |
| Create pitfalls without examples | Include exact user correction text |
| Extract patterns too early | Wait for 2+ occurrences |
