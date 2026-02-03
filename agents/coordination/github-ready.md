# GitHub Ready Column Integration

> Queries GitHub project board for collision-free feature alternatives.

---

## Overview

When a collision is detected between features, this integration:
- Queries the GitHub project "Ready" column
- Filters out features with file overlap with active work
- Suggests top 3 non-conflicting alternatives
- Provides quick access to start suggested features

---

## Query Ready Features

### Using GitHub CLI

```bash
# Query project items in Ready status
gh project item-list {PROJECT_NUMBER} \
  --owner {OWNER} \
  --format json \
  --jq '.items[] | select(.status.name == "Ready")'
```

### Response Processing

```typescript
interface ProjectItem {
  id: string;
  title: string;
  content: {
    number: number;
    title: string;
    body: string;
    labels: string[];
  };
  status: {
    name: string;  // "Ready", "In Progress", "Done", etc.
  };
  fieldValues: {
    featureId?: string;
    area?: string;
    priority?: string;
  };
}

function parseReadyFeatures(items: ProjectItem[]): Feature[] {
  return items
    .filter(item => item.status.name === "Ready")
    .map(item => ({
      id: item.fieldValues.featureId || extractIdFromTitle(item.title),
      title: item.content.title,
      area: item.fieldValues.area,
      priority: item.fieldValues.priority,
      specPath: inferSpecPath(item)
    }));
}
```

---

## Collision-Free Filtering

### Step 1: Get Active Feature Files

```typescript
function getActiveFeatureFiles(): Set<string> {
  const activeFeatures = loadJSON('.claude/active-features.json');
  const files = new Set<string>();

  for (const feature of Object.values(activeFeatures.features)) {
    for (const path of feature.files_owned) {
      files.add(path);
    }
  }

  return files;
}
```

### Step 2: Estimate Feature Files

For features without contracts, estimate file ownership from spec:

```typescript
function estimateFileOwnership(feature: Feature): string[] {
  const files: string[] = [];

  // Infer from feature area
  const areaMap = {
    "auth": ["lib/accounts/", "assets/svelte/auth/"],
    "billing": ["lib/billing/", "assets/svelte/billing/"],
    "profile": ["lib/profiles/", "assets/svelte/profile/"],
    "admin": ["lib/admin/", "assets/svelte/admin/"],
    "notifications": ["lib/notifications/", "assets/svelte/notifications/"]
  };

  if (feature.area && areaMap[feature.area]) {
    files.push(...areaMap[feature.area]);
  }

  // Infer from feature ID prefix
  const idPrefix = feature.id.split('-')[0].toLowerCase();
  if (areaMap[idPrefix]) {
    files.push(...areaMap[idPrefix]);
  }

  return [...new Set(files)];
}
```

### Step 3: Calculate Overlap

```typescript
function filterCollisionFree(
  readyFeatures: Feature[],
  activeFiles: Set<string>
): Feature[] {
  return readyFeatures.filter(feature => {
    const estimatedFiles = estimateFileOwnership(feature);

    for (const file of estimatedFiles) {
      for (const activeFile of activeFiles) {
        if (pathsOverlap(file, activeFile)) {
          return false;  // Has collision
        }
      }
    }

    return true;  // No collision
  });
}
```

---

## Display Format

### Suggestions Display

```
Pick alternative from Ready column:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1] BILLING-001: Payment integration
    Area: billing | Priority: high
    No overlap with active features

[2] PROFILE-003: Avatar upload
    Area: profile | Priority: medium
    No overlap with active features

[3] NOTIF-002: Email preferences
    Area: notifications | Priority: low
    No overlap with active features

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1-3] Start feature  [r] Refresh list  [c] Cancel
```

### No Alternatives Available

```
Pick alternative from Ready column:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No collision-free features found in Ready column.

All 3 ready features have overlap with AUTH-001:
  - AUTH-002: 78% overlap (same domain)
  - AUTH-003: 65% overlap (same domain)
  - PROFILE-001: 35% overlap (shared components)

Options:
  [w] Wait for AUTH-001 to complete
  [p] Proceed with worktree anyway
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Configuration

### Project Settings

In `.claude/vibe.config.json`:

```json
{
  "github": {
    "project_number": 1,
    "owner": "organization-name",
    "ready_column": "Ready",
    "feature_id_field": "Feature ID"
  }
}
```

### Auto-Discovery

If not configured, attempt to discover:

```bash
# Find project associated with repo
gh project list --owner @me --format json

# Or from repo settings
gh repo view --json projectsV2
```

---

## Caching

### Cache Ready Features

To avoid repeated API calls:

```json
// .claude/cache/github-ready.json
{
  "cached_at": "2026-02-02T10:00:00Z",
  "ttl_seconds": 300,
  "features": [
    {
      "id": "BILLING-001",
      "title": "Payment integration",
      "area": "billing",
      "priority": "high"
    }
  ]
}
```

### Cache Invalidation

```typescript
function getReadyFeatures(): Feature[] {
  const cache = loadCache('.claude/cache/github-ready.json');

  if (cache && !isExpired(cache)) {
    return cache.features;
  }

  const features = fetchFromGitHub();
  saveCache('.claude/cache/github-ready.json', features);

  return features;
}
```

---

## Error Handling

### No GitHub Access

```
Cannot query GitHub Ready column:
  gh CLI not authenticated or project not accessible

Workaround:
  Run: gh auth login
  Or manually specify feature ID to start
```

### No Ready Column

```
Project does not have a "Ready" column.
Available columns: Backlog, In Progress, Done

Configure column name in .claude/vibe.config.json:
  "github": { "ready_column": "Backlog" }
```

### Empty Ready Column

```
No features in Ready column.

Check your GitHub project board for features to work on,
or create a feature spec manually in docs/domain/features/
```

---

## Integration Flow

### In Collision Detection

```typescript
// When collision detected
if (collision.overlap > 0.3) {
  // Fetch and filter alternatives
  const readyFeatures = await getReadyFeatures();
  const collisionFree = filterCollisionFree(
    readyFeatures,
    getActiveFeatureFiles()
  );

  // Display options
  displayCollisionWarning(collision, {
    alternatives: collisionFree.slice(0, 3)
  });
}
```

### User Selection

```typescript
// User picks alternative
if (userChoice === 'a' && selectedAlternative) {
  // Start the alternative feature instead
  await startFeature(selectedAlternative.id);
}
```

---

## Related

- `active-features.md` - Active feature tracking
- `feature-collision.md` - Collision detection logic
- `worktree-manager.md` - Worktree creation for parallel work
- `../orchestrator/core.md` - Orchestrator workflow
