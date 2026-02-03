# Worktree Manager

> Automates git worktree creation and cleanup for parallel feature development.

---

## Overview

The Worktree Manager enables parallel feature development by:
- Creating isolated git worktrees for conflicting features
- Copying necessary state files to worktrees
- Managing worktree lifecycle (create, list, cleanup)
- Guiding users through multi-Claude-session workflow

---

## Create Worktree

### Command Sequence

```bash
# Create worktree from main branch
git worktree add ../project-{FEATURE-ID} -b feature/{FEATURE-ID}-integration main

# Copy .claude state directory
cp -r .claude/ ../project-{FEATURE-ID}/.claude/

# Initialize state for new worktree
# (modify active-features.json to include worktree path)
```

### Full Process

```typescript
async function createWorktree(featureId: string): Promise<WorktreeResult> {
  const worktreePath = `../project-${featureId}`;
  const branchName = `feature/${featureId}-integration`;

  // 1. Verify main is up to date
  await exec('git fetch origin main');

  // 2. Create worktree
  await exec(`git worktree add ${worktreePath} -b ${branchName} main`);

  // 3. Copy .claude directory
  await exec(`cp -r .claude/ ${worktreePath}/.claude/`);

  // 4. Update active-features.json in both locations
  updateActiveFeatures(featureId, worktreePath);

  // 5. Return result
  return {
    path: worktreePath,
    branch: branchName,
    ready: true
  };
}
```

### Output Display

```
Creating worktree for AUTH-002...

  git worktree add ../project-AUTH-002 -b feature/AUTH-002-integration main
  Preparing branch feature/AUTH-002-integration

  cp -r .claude/ ../project-AUTH-002/.claude/
  State files copied

═══════════════════════════════════════════════════════════════
  WORKTREE READY
═══════════════════════════════════════════════════════════════

Location: ../project-AUTH-002
Branch: feature/AUTH-002-integration

Next steps:
  1. Open new terminal
  2. cd ../project-AUTH-002
  3. Run: claude
  4. Run: /vibe AUTH-002

This session continues with the current feature.
```

---

## List Worktrees

### Command

```bash
git worktree list --porcelain
```

### Parsed Output

```typescript
interface Worktree {
  path: string;
  head: string;
  branch: string;
  feature?: string;  // Extracted from branch name
}

function parseWorktrees(): Worktree[] {
  const output = exec('git worktree list --porcelain');
  const worktrees: Worktree[] = [];
  let current: Partial<Worktree> = {};

  for (const line of output.split('\n')) {
    if (line.startsWith('worktree ')) {
      if (current.path) worktrees.push(current as Worktree);
      current = { path: line.substring(9) };
    } else if (line.startsWith('HEAD ')) {
      current.head = line.substring(5);
    } else if (line.startsWith('branch ')) {
      current.branch = line.substring(7);
      // Extract feature ID from branch name
      const match = current.branch.match(/feature\/([A-Z]+-\d+)/);
      if (match) current.feature = match[1];
    }
  }

  if (current.path) worktrees.push(current as Worktree);
  return worktrees;
}
```

### Display Format

```
GIT WORKTREES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PATH                      BRANCH                          FEATURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/home/user/project        master                          (main)
../project-AUTH-002       feature/AUTH-002-integration    AUTH-002
../project-BILLING-001    feature/BILLING-001-integration BILLING-001

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Remove Worktree

### Command Sequence

```bash
# Remove worktree (force if needed)
git worktree remove ../project-{FEATURE-ID}

# Or with force (if dirty)
git worktree remove --force ../project-{FEATURE-ID}

# Prune stale worktree references
git worktree prune
```

### Full Process

```typescript
async function removeWorktree(featureId: string): Promise<void> {
  const worktreePath = `../project-${featureId}`;

  // 1. Check worktree status
  const status = await getWorktreeStatus(worktreePath);

  if (status.hasUncommittedChanges) {
    // Warn user about uncommitted changes
    const proceed = await promptUser(
      `Worktree has uncommitted changes. Remove anyway? [y/N]`
    );
    if (!proceed) return;
  }

  // 2. Remove worktree
  await exec(`git worktree remove ${worktreePath}`);

  // 3. Prune references
  await exec('git worktree prune');

  // 4. Update active-features.json
  removeWorktreeFromActiveFeatures(featureId);

  console.log(`Worktree removed: ${worktreePath}`);
}
```

### Cleanup Prompt (After Feature Complete)

```
Feature AUTH-002 complete!

Worktree at ../project-AUTH-002 is no longer needed.

[m] Merge changes to main worktree first
[r] Remove worktree (changes already merged)
[k] Keep worktree
```

---

## Merge Worktree Changes

### Before Cleanup

If changes exist in worktree that should be in main:

```bash
# From main worktree
cd /home/user/project

# Fetch from worktree
git fetch ../project-AUTH-002 feature/AUTH-002-integration

# Merge or rebase
git merge FETCH_HEAD
# or
git rebase FETCH_HEAD
```

### Auto-Merge Flow

```typescript
async function mergeAndCleanupWorktree(featureId: string): Promise<void> {
  const worktreePath = `../project-${featureId}`;
  const branch = `feature/${featureId}-integration`;

  // 1. Fetch changes
  await exec(`git fetch ${worktreePath} ${branch}`);

  // 2. Check if anything to merge
  const diff = await exec('git diff HEAD...FETCH_HEAD --stat');
  if (!diff.trim()) {
    console.log('No changes to merge from worktree.');
  } else {
    // 3. Merge
    await exec('git merge FETCH_HEAD -m "Merge worktree changes"');
  }

  // 4. Remove worktree
  await removeWorktree(featureId);
}
```

---

## Orphan Detection

### On Session Start

Check for worktrees not in active-features.json:

```typescript
function detectOrphanWorktrees(): Worktree[] {
  const worktrees = parseWorktrees();
  const activeFeatures = loadJSON('.claude/active-features.json');

  const orphans = worktrees.filter(wt => {
    if (!wt.feature) return false;  // Not a feature worktree
    if (wt.path === process.cwd()) return false;  // Main worktree

    // Check if tracked in active features
    const feature = activeFeatures.features[wt.feature];
    return !feature || feature.worktree !== wt.path;
  });

  return orphans;
}
```

### Orphan Cleanup Prompt

```
ORPHAN WORKTREES DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The following worktrees are not tracked in active-features.json:

  ../project-OLD-FEATURE   feature/OLD-FEATURE-integration

[r] Remove orphan worktrees
[a] Add to active features tracking
[i] Ignore
```

---

## State Synchronization

### Copy State Files

When creating worktree, copy essential state:

```bash
# Essential directories
cp -r .claude/ ../project-{ID}/.claude/

# Exclude temporary/cache files
rm -rf ../project-{ID}/.claude/cache/
rm -rf ../project-{ID}/.claude/progress/*/
```

### State to Copy

| Path | Include | Reason |
|------|---------|--------|
| `.claude/vibe.config.json` | Yes | Project configuration |
| `.claude/contracts/` | Yes | Feature contracts |
| `.claude/active-features.json` | Yes | Feature tracking |
| `.claude/checkpoints/` | No | Session-specific |
| `.claude/cache/` | No | Temporary |
| `.claude/progress/` | No | Feature-specific |

---

## Error Handling

### Branch Already Exists

```
Error: Branch feature/AUTH-002-integration already exists.

Options:
  [u] Use existing branch (checkout)
  [n] Create new branch (feature/AUTH-002-integration-v2)
  [d] Delete and recreate
```

### Worktree Path Exists

```
Error: Path ../project-AUTH-002 already exists.

This might be a leftover from a previous session.

[r] Remove and recreate
[u] Use existing (if valid worktree)
[c] Cancel
```

### Dirty Main Worktree

```
Warning: Main worktree has uncommitted changes.

Creating worktree will branch from current HEAD, not main.

[s] Stash changes and continue
[c] Commit changes first
[p] Proceed anyway (branch from dirty state)
```

---

## Integration Points

### With Active Features

```typescript
// On worktree create
function updateActiveFeatures(featureId: string, worktreePath: string) {
  const features = loadJSON('.claude/active-features.json');

  if (features.features[featureId]) {
    features.features[featureId].worktree = worktreePath;
    features.updated_at = new Date().toISOString();
    writeJSON('.claude/active-features.json', features);
  }
}

// On worktree remove
function removeWorktreeFromActiveFeatures(featureId: string) {
  const features = loadJSON('.claude/active-features.json');

  if (features.features[featureId]) {
    features.features[featureId].worktree = null;
    features.updated_at = new Date().toISOString();
    writeJSON('.claude/active-features.json', features);
  }
}
```

### With Feature Collision

```typescript
// When user chooses "proceed with worktree"
if (userChoice === 'p' && collision.overlap > 0.3) {
  const result = await createWorktree(featureId);
  displayWorktreeInstructions(result);
}
```

---

## Related

- `active-features.md` - Feature tracking and state management
- `feature-collision.md` - Collision detection triggering worktree creation
- `github-ready.md` - Alternative feature suggestions
- `../orchestrator/core.md` - Main orchestrator workflow
