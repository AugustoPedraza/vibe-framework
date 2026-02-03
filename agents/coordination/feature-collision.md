# Feature Collision Detector

> Detects file ownership overlaps between features to prevent merge conflicts.

---

## Overview

The Feature Collision Detector analyzes file ownership across features to:
- Identify features that modify the same files/directories
- Calculate collision risk percentage
- Suggest alternatives or worktree creation
- Prevent merge conflicts in parallel development

**Note:** This handles **inter-feature** collisions. For **intra-feature** conflicts (between agents within the same feature), see `conflict-detector.md`.

---

## Collision Detection Flow

### Step 1: Gather File Ownership

```typescript
function gatherFileOwnership(featureId, contract) {
  const files = new Set();

  // From agent assignments
  for (const [agent, config] of Object.entries(contract.agent_assignments)) {
    for (const pattern of config.files) {
      files.add(pattern);
    }
  }

  return Array.from(files);
}
```

### Step 2: Calculate Overlap

```typescript
function calculateOverlap(filesA: string[], filesB: string[]): number {
  let overlapCount = 0;
  let totalUnique = new Set([...filesA, ...filesB]).size;

  for (const fileA of filesA) {
    for (const fileB of filesB) {
      if (pathsOverlap(fileA, fileB)) {
        overlapCount++;
        break;
      }
    }
  }

  return overlapCount / totalUnique;
}

function pathsOverlap(pathA: string, pathB: string): boolean {
  // Check if paths share a common ancestor or one contains the other
  return pathA.startsWith(pathB) ||
         pathB.startsWith(pathA) ||
         pathA === pathB;
}
```

### Step 3: Risk Assessment

```typescript
function assessRisk(overlap: number): CollisionRisk {
  if (overlap < 0.3) {
    return {
      level: "low",
      action: "proceed",
      message: "Minimal overlap, safe to proceed"
    };
  } else if (overlap < 0.7) {
    return {
      level: "medium",
      action: "warn",
      message: "Moderate overlap, worktree recommended"
    };
  } else {
    return {
      level: "high",
      action: "block",
      message: "High overlap, strongly suggest waiting"
    };
  }
}
```

---

## Collision Analysis Output

```json
{
  "requested_feature": "AUTH-002",
  "analysis_time": "2026-02-02T10:30:00Z",
  "active_features_checked": 1,
  "collisions": [
    {
      "feature_id": "AUTH-001",
      "phase": 2,
      "progress": 65,
      "overlap_percentage": 0.45,
      "risk_level": "medium",
      "overlapping_paths": [
        "lib/accounts/",
        "assets/svelte/auth/"
      ],
      "estimated_completion": "~15 minutes"
    }
  ],
  "recommendation": {
    "action": "wait_or_worktree",
    "wait_time_estimate": "15 minutes",
    "alternatives": ["BILLING-001", "PROFILE-003"]
  }
}
```

---

## Risk Level Matrix

| Overlap % | Risk Level | Recommended Action |
|-----------|------------|-------------------|
| 0-29% | Low | Proceed normally in same worktree |
| 30-49% | Medium | Warn, suggest worktree |
| 50-69% | Medium-High | Strongly suggest worktree |
| 70-100% | High | Recommend waiting |

---

## Display Formats

### No Collision

```
/vibe BILLING-001

No active features with overlap. Starting BILLING-001...
```

### Low Collision

```
/vibe PROFILE-002

Collision Check:
  Active: AUTH-001 (Phase 2, 65%)
  Overlap: 12% (low risk)

Proceeding with PROFILE-002...
```

### Medium Collision

```
/vibe AUTH-002

═══════════════════════════════════════════════════════════════
  COLLISION DETECTED
═══════════════════════════════════════════════════════════════

Currently running: AUTH-001 (Phase 2, 65% complete)
Requested: AUTH-002

Overlapping paths:
  - lib/accounts/
  - assets/svelte/auth/

Overlap: 45% (medium risk)
Risk: Merge conflicts likely if developed in parallel

Options:
  [w] Wait for AUTH-001 (~15 min remaining)
  [p] Proceed with worktree (parallel development)
  [a] Pick alternative from Ready column:
      → BILLING-001: Payment integration (no overlap)
      → PROFILE-003: Avatar upload (no overlap)
```

### High Collision

```
/vibe AUTH-002

═══════════════════════════════════════════════════════════════
  ⛔ HIGH COLLISION RISK
═══════════════════════════════════════════════════════════════

Currently running: AUTH-001 (Phase 2, 65% complete)
Requested: AUTH-002

Overlapping paths:
  - lib/accounts/
  - lib/accounts_web/
  - assets/svelte/auth/
  - test/accounts/

Overlap: 78% (high risk)

STRONGLY RECOMMENDED: Wait for AUTH-001 to complete

Options:
  [w] Wait for AUTH-001 (~15 min remaining) ← RECOMMENDED
  [p] Proceed anyway (high conflict risk)
  [a] Pick alternative from Ready column
```

---

## Path Matching Rules

### Exact Match
```
lib/accounts/user.ex == lib/accounts/user.ex → COLLISION
```

### Directory Containment
```
lib/accounts/ contains lib/accounts/user.ex → COLLISION
```

### No Match
```
lib/accounts/ vs lib/billing/ → NO COLLISION
```

### Wildcard Patterns
```
lib/**/resources/ → matches any resources directory
assets/svelte/*/ → matches any direct subdirectory
```

---

## Integration with Contract

Extract file ownership from contract:

```json
{
  "agent_assignments": {
    "domain-agent": {
      "files": ["lib/accounts/", "test/accounts/"]
    },
    "ui-agent": {
      "files": ["assets/svelte/components/features/auth/"]
    },
    "data-agent": {
      "files": ["priv/repo/migrations/"]
    },
    "api-agent": {
      "files": ["lib/*_web/live/auth/"]
    }
  }
}
```

Aggregated files_owned:
```
[
  "lib/accounts/",
  "test/accounts/",
  "assets/svelte/components/features/auth/",
  "priv/repo/migrations/",
  "lib/*_web/live/auth/"
]
```

---

## Estimation Logic

### Time to Completion

```typescript
function estimateCompletion(feature: ActiveFeature): string {
  const remaining = 100 - feature.progress;
  const elapsed = Date.now() - new Date(feature.started_at).getTime();
  const rate = feature.progress / elapsed;

  if (rate === 0) return "unknown";

  const msRemaining = remaining / rate;
  const minutes = Math.ceil(msRemaining / (1000 * 60));

  if (minutes < 5) return "< 5 minutes";
  if (minutes < 15) return "~10-15 minutes";
  if (minutes < 30) return "~20-30 minutes";
  return "> 30 minutes";
}
```

---

## Error Handling

### Missing Contract

```
Cannot analyze collision for AUTH-002:
Contract not found at .claude/contracts/AUTH-002.json

Generate contract first with: /vibe AUTH-002
```

### Stale Active Feature

```
Warning: AUTH-001 shows no progress for 45 minutes.
It may be stale. Consider removing from active-features.json.

[r] Remove AUTH-001 from tracking  [k] Keep and proceed with check
```

---

## Related

- `active-features.md` - Active feature state management
- `conflict-detector.md` - Intra-feature conflict detection (between agents)
- `worktree-manager.md` - Git worktree automation
- `github-ready.md` - Alternative feature suggestions
