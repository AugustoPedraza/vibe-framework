# Active Feature Coordination

> Tracks running features and coordinates parallel development.

---

## Overview

The active features system enables safe parallel feature development by:
- Tracking which features are currently in progress
- Detecting file ownership collisions between features
- Managing git worktrees for parallel work
- Auto-cleanup on feature completion

---

## State File

**Location:** `.claude/active-features.json`

```json
{
  "version": "1.0.0",
  "updated_at": "2026-02-02T10:30:00Z",
  "features": {
    "AUTH-001": {
      "status": "in_progress",
      "phase": 2,
      "progress": 65,
      "worktree": null,
      "files_owned": [
        "lib/accounts/",
        "assets/svelte/auth/",
        "test/accounts/"
      ],
      "started_at": "2026-02-02T10:00:00Z",
      "contract_path": ".claude/contracts/AUTH-001.json"
    },
    "BILLING-001": {
      "status": "in_progress",
      "phase": 1,
      "progress": 30,
      "worktree": "../project-BILLING-001",
      "files_owned": [
        "lib/billing/",
        "assets/svelte/billing/",
        "test/billing/"
      ],
      "started_at": "2026-02-02T10:15:00Z",
      "contract_path": ".claude/contracts/BILLING-001.json"
    }
  }
}
```

---

## On Feature Start Protocol

### Step 1: Check Active Features

```typescript
const activeFeatures = loadJSON('.claude/active-features.json');

if (Object.keys(activeFeatures.features).length > 0) {
  // Collision check required
  const collisions = checkCollisions(newFeatureSpec, activeFeatures);

  if (collisions.overlap > 0.3) {
    displayCollisionWarning(collisions);
    // User must choose: wait, proceed, or pick alternative
  }
}
```

### Step 2: Extract File Ownership

From feature spec and contract:

```typescript
function extractFileOwnership(contract) {
  const files = [];

  for (const [agent, config] of Object.entries(contract.agent_assignments)) {
    files.push(...config.files);
  }

  return files;
}
```

### Step 3: Register New Feature

```typescript
function registerFeature(featureId, contract) {
  const activeFeatures = loadJSON('.claude/active-features.json');

  activeFeatures.features[featureId] = {
    status: "in_progress",
    phase: 0,
    progress: 0,
    worktree: null,
    files_owned: extractFileOwnership(contract),
    started_at: new Date().toISOString(),
    contract_path: `.claude/contracts/${featureId}.json`
  };

  activeFeatures.updated_at = new Date().toISOString();

  writeJSON('.claude/active-features.json', activeFeatures);
}
```

---

## Progress Update Protocol

### On Phase Transition

```typescript
function updateFeatureProgress(featureId, phase, progress) {
  const activeFeatures = loadJSON('.claude/active-features.json');

  if (activeFeatures.features[featureId]) {
    activeFeatures.features[featureId].phase = phase;
    activeFeatures.features[featureId].progress = progress;
    activeFeatures.updated_at = new Date().toISOString();

    writeJSON('.claude/active-features.json', activeFeatures);
  }
}
```

### Progress Calculation

| Phase | Base Progress |
|-------|---------------|
| 0 - Contract | 0-5% |
| 1 - Implementation | 5-50% |
| 2 - Integration | 50-70% |
| 3 - Validation | 70-85% |
| 4 - Polish | 85-95% |
| 5 - Learning | 95-100% |

---

## On Feature Complete Protocol

### Step 1: Remove from Active Features

```typescript
function completeFeature(featureId) {
  const activeFeatures = loadJSON('.claude/active-features.json');

  const feature = activeFeatures.features[featureId];
  if (feature) {
    // Save to history (optional)
    saveToHistory(featureId, feature);

    // Remove from active
    delete activeFeatures.features[featureId];
    activeFeatures.updated_at = new Date().toISOString();

    writeJSON('.claude/active-features.json', activeFeatures);
  }
}
```

### Step 2: Cleanup Worktree (if used)

```bash
# If worktree was used, prompt for cleanup
if [ -n "$WORKTREE_PATH" ]; then
  echo "Feature complete. Worktree at: $WORKTREE_PATH"
  echo "[m] Merge to main worktree  [k] Keep  [r] Remove"
fi
```

### Step 3: Auto-Clear Context

After feature removal, display:

```
═══════════════════════════════════════════════════════════════
  Phase: 5/5 LEARNING (background)
═══════════════════════════════════════════════════════════════
COMPLETE! PR #130 ready.

Context cleared automatically. Ready for next feature.
```

---

## Display Formats

### Active Features Summary

```
ACTIVE FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUTH-001    Phase 2/5  [████████░░░░] 65%   main worktree
BILLING-001 Phase 1/5  [███░░░░░░░░░] 30%   ../project-BILLING-001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Collision Warning

```
COLLISION WARNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUTH-002 overlaps with AUTH-001:
  - Both modify: lib/accounts/, assets/svelte/auth/
  - Overlap: 45% (medium risk)

Options:
  [w] Wait for AUTH-001 (~15 min remaining)
  [p] Proceed with worktree (parallel development)
  [a] Pick alternative from Ready column
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Error Handling

### Stale Feature Detection

If a feature shows no progress for 30+ minutes:

```typescript
function detectStaleFeatures() {
  const activeFeatures = loadJSON('.claude/active-features.json');
  const now = new Date();

  for (const [id, feature] of Object.entries(activeFeatures.features)) {
    const lastUpdate = new Date(feature.updated_at || feature.started_at);
    const minutesStale = (now - lastUpdate) / (1000 * 60);

    if (minutesStale > 30) {
      warnStaleFeature(id, minutesStale);
    }
  }
}
```

### Orphaned Worktrees

On session start, check for orphaned worktrees:

```bash
# List worktrees
git worktree list --porcelain

# Compare with active-features.json
# Remove orphans or prompt for action
```

---

## Integration Points

### With Orchestrator

- Phase 0: Register feature on start
- Phase transitions: Update progress
- Phase 5: Complete and remove feature

### With Feature Collision Detector

- Provides file ownership data
- Receives collision analysis results

### With Worktree Manager

- Creates worktrees when parallel needed
- Cleanup on feature completion

### With GitHub Ready Integration

- Provides list of active features to exclude
- Receives alternative feature suggestions

---

## Related

- `feature-collision.md` - Collision detection between features
- `worktree-manager.md` - Git worktree automation
- `github-ready.md` - GitHub Ready column integration
- `../orchestrator/core.md` - Orchestrator workflow
