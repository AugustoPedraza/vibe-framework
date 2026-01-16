# Sync Command

> `/vibe sync` - Sync epics and features to GitHub Projects

## Purpose

Keep GitHub Projects board in sync with:
- BMAD epics from `_bmad-output/planning-artifacts/epics.md`
- Vibe feature specs from `docs/domain/features/`
- Feature status updates

**Output:** GitHub issues created/updated, Project board synced

---

## Prerequisites

### GitHub CLI Authentication

Verify `gh` is authenticated:
```bash
gh auth status
```

If not authenticated:
```bash
gh auth login
```

### Project Board Setup

Requires GitHub Project (v2) with:
- Status field with options: `Todo`, `In Progress`, `Done`, `Blocked`
- Priority field (optional)
- Epic label

---

## Workflow

```
Scan Artifacts -> Map to Issues -> Create/Update -> Sync Status
```

---

## Phase 1: Scan Artifacts

```
+======================================================================+
|  SYNC SCANNING PROJECT ARTIFACTS                                      |
|  Looking for epics and features...                                    |
+======================================================================+
```

### Scan BMAD Epics

Read `_bmad-output/planning-artifacts/epics.md`:
- Extract epic titles and descriptions
- Extract story IDs and titles
- Note story status if present

### Scan Vibe Features

Read `docs/domain/features/**/*.md`:
- Extract feature ID and title
- Extract status from `Status:` field
- Note priority from PM Context

### Build Sync Map

```
+---------------------------------------------------------------------+
|  ARTIFACTS FOUND                                                     |
|                                                                      |
|  BMAD Epics: 9                                                       |
|    Epic 1: User Authentication (6 stories)                           |
|    Epic 2: Project Workspace (6 stories)                             |
|    ...                                                               |
|                                                                      |
|  Vibe Features: 6                                                    |
|    AUTH-001: Login [done]                                            |
|    AUTH-002: Register [in-progress]                                  |
|    PROJ-001: Create Project [todo]                                   |
|    ...                                                               |
|                                                                      |
|  Continue with sync? [Enter]                                         |
+---------------------------------------------------------------------+
```

---

## Phase 2: GitHub Project Discovery

```
+======================================================================+
|  SYNC CONNECTING TO GITHUB                                            |
|  Finding project board...                                             |
+======================================================================+
```

### Find Project

```bash
# List organization projects
gh project list --owner {org}

# Or list user projects
gh project list
```

### Get Project Details

```bash
# Get project fields
gh project field-list {project-number} --owner {owner}
```

### Cache Project Metadata

Store:
- Project ID
- Status field ID
- Status option IDs (Todo, In Progress, Done, Blocked)

```
+---------------------------------------------------------------------+
|  GITHUB PROJECT FOUND                                                |
|                                                                      |
|  Project: Syna Development                                           |
|  Owner: IFC-Roofing                                                  |
|                                                                      |
|  Status Field: Found                                                 |
|    - Todo                                                            |
|    - In Progress                                                     |
|    - Done                                                            |
|    - Blocked                                                         |
|                                                                      |
|  Continue with sync? [Enter]                                         |
+---------------------------------------------------------------------+
```

---

## Phase 3: Create/Update Issues

```
+======================================================================+
|  SYNC CREATING ISSUES                                                 |
|  Syncing to GitHub...                                                 |
+======================================================================+
```

### Epic Issues

For each BMAD epic:

```bash
# Check if epic issue exists
gh issue list --label "epic" --search "Epic {N}:"

# Create epic issue if not exists
gh issue create \
  --title "Epic {N}: {Title}" \
  --label "epic,planning" \
  --body "$(cat <<'EOF'
## Goal
{Epic goal from BMAD}

## Stories
- [ ] Story {N}.1: {Title}
- [ ] Story {N}.2: {Title}
...

## Requirements
{FR/NFR references from BMAD}

---
_Synced from BMAD epics.md_
EOF
)"
```

### Feature Issues

For each Vibe feature:

```bash
# Check if feature issue exists
gh issue list --search "{ID}:"

# Create feature issue if not exists
gh issue create \
  --title "{ID}: {Title}" \
  --label "feature" \
  --body "$(cat <<'EOF'
## Description
{One-line description}

## Acceptance Criteria
{Scenarios from feature spec}

## Status
{Current status from spec}

---
_Synced from docs/domain/features/{area}/{ID}.md_
EOF
)"

# Add to project
gh project item-add {project-number} --owner {owner} --url {issue_url}
```

### Sync Progress

```
+---------------------------------------------------------------------+
|  SYNC PROGRESS                                                       |
|                                                                      |
|  Epics:                                                              |
|    [x] Epic 1: User Authentication (created)                         |
|    [x] Epic 2: Project Workspace (exists)                            |
|    [x] Epic 3: Invitation & RBAC (created)                           |
|    ...                                                               |
|                                                                      |
|  Features:                                                           |
|    [x] AUTH-001: Login (exists, status updated)                      |
|    [x] AUTH-002: Register (created)                                  |
|    [x] PROJ-001: Create Project (created)                            |
|    ...                                                               |
|                                                                      |
|  Created: 8 issues                                                   |
|  Updated: 2 issues                                                   |
|  Skipped: 1 (already synced)                                         |
+---------------------------------------------------------------------+
```

---

## Phase 4: Sync Status

```
+======================================================================+
|  SYNC UPDATING STATUS                                                 |
|  Setting project board status...                                      |
+======================================================================+
```

### Status Mapping

| Vibe Status | GitHub Status |
|-------------|---------------|
| `todo` | Todo |
| `in-progress` | In Progress |
| `review` | In Progress |
| `done` | Done |
| `blocked` | Blocked |
| `deferred` | Todo |

### Update Project Items

```bash
# Get item ID
gh project item-list {project-number} --owner {owner} --format json

# Update status
gh project item-edit \
  --project {project-id} \
  --id {item-id} \
  --field-id {status-field-id} \
  --single-select-option-id {status-option-id}
```

---

## Phase 5: Completion

```
+======================================================================+
|  SYNC COMPLETE                                                        |
|  GitHub Projects synchronized                                         |
+======================================================================+
```

```
+---------------------------------------------------------------------+
|  SYNC SUMMARY                                                        |
|                                                                      |
|  GitHub Project: Syna Development                                    |
|  URL: https://github.com/orgs/IFC-Roofing/projects/1                 |
|                                                                      |
|  Epics: 9 synced                                                     |
|  Features: 6 synced                                                  |
|                                                                      |
|  Status Updates:                                                     |
|    Todo: 4                                                           |
|    In Progress: 1                                                    |
|    Done: 1                                                           |
|                                                                      |
|  Next sync: Run /vibe sync after status changes                      |
+---------------------------------------------------------------------+
```

---

## Options

### `--status`

Show sync status without making changes:

```bash
/vibe sync --status
```

Output:
- Issues that would be created
- Issues that would be updated
- Issues already in sync

### `--dry-run`

Show what would happen without making changes:

```bash
/vibe sync --dry-run
```

### `--features-only`

Sync only feature issues, skip epics:

```bash
/vibe sync --features-only
```

### `--epics-only`

Sync only epic issues:

```bash
/vibe sync --epics-only
```

### `--project [name]`

Specify project name:

```bash
/vibe sync --project "Sprint 1"
```

---

## Auto-Sync Triggers

The following commands should trigger sync:

| Command | Auto-sync Action |
|---------|------------------|
| `/vibe plan` | Create feature issues |
| `/vibe [ID]` (complete) | Update status to Done |
| `/vibe convert-story` | Create feature issue |

### Integration Pattern

After relevant commands, prompt:

```
+---------------------------------------------------------------------+
|  SYNC RECOMMENDED                                                    |
|                                                                      |
|  Feature AUTH-002 status changed to 'done'                           |
|                                                                      |
|  Sync to GitHub Projects? [y/N]                                      |
+---------------------------------------------------------------------+
```

---

## Configuration

Add to `.claude/vibe.config.json`:

```json
{
  "github": {
    "owner": "IFC-Roofing",
    "repo": "syna",
    "project": "Syna Development",
    "auto_sync": true
  }
}
```

---

## Troubleshooting

### "Project not found"

```bash
# Verify project exists
gh project list --owner {owner}

# Verify access
gh auth status
```

### "Permission denied"

```bash
# Re-authenticate with project scope
gh auth login --scopes "project"
```

### "Status field not found"

Project needs Status field configured:
1. Go to project settings
2. Add "Status" field (single select)
3. Add options: Todo, In Progress, Done, Blocked

---

## Anti-Patterns

- Never create duplicate issues (always check first)
- Never sync without verifying gh auth
- Never update status without reading current state
- Never skip epic creation (features need parent)
- Never hard-delete issues (close instead)
