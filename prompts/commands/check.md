# /vibe check

> Validate project structure and show sync status with template.

---

## Trigger

`/vibe check`

---

## Workflow

### Phase 1: Read Configuration

```
+======================================================================+
|  CHECK PROJECT VALIDATION                                             |
|  Project: {project.name}                                              |
+======================================================================+
```

1. Read `.claude/vibe.config.json`
2. Extract:
   - `project.name`
   - `project.core_kpi`
   - `paths.architecture`
   - `paths.domain`
   - `sync.template_path` (default: `~/projects/vibe-ash-svelte-template`)

---

### Phase 2: Validate Structure

Check all required directories and files exist:

**Architecture Requirements:**
- [ ] `architecture/` directory exists
- [ ] `architecture/README.md` exists
- [ ] `architecture/_index.md` exists
- [ ] `architecture/_fundamentals/` exists with at least `quick-reference.md`
- [ ] `architecture/_guides/` exists with at least one guide
- [ ] `architecture/_patterns/` exists
- [ ] `architecture/_anti-patterns/` exists
- [ ] `architecture/_checklists/` exists

**Domain Requirements:**
- [ ] `docs/domain/` directory exists
- [ ] `docs/domain/GLOSSARY.md` exists
- [ ] `docs/domain/vision.md` exists
- [ ] `docs/domain/index.md` exists
- [ ] `docs/domain/features/` exists with at least one feature spec

**Config Requirements:**
- [ ] `.claude/vibe.config.json` exists and is valid JSON
- [ ] Required fields present: `project.name`, `paths.architecture`, `paths.domain`

Report any gaps.

---

### Phase 3: Check Template Sync

For each category in architecture/:
1. Read template files from `~/projects/vibe-ash-svelte-template/architecture/{category}/`
2. Read project files from `{project}/architecture/{category}/`
3. Compare file by file
4. Categorize as:
   - **In sync** - Files are identical
   - **Differs** - Same file, different content
   - **New in template** - Template has file project doesn't
   - **Project-specific** - Project has file template doesn't

---

### Phase 4: Report Status

Output format:

```
=== Vibe Framework Check ===

Project: {project.name}
Core KPI: {project.core_kpi}

Structure:
  ✓ .claude/vibe.config.json
  ✓ architecture/ (5 categories, 23 files)
  ✓ docs/domain/ (5 feature specs, glossary, vision)

Template Sync:
  ✓ _fundamentals/ (3 files) in sync
  ⚠ _guides/ (8 files) - 1 differs
     └─ testing.md (project has custom sections)
  ✓ _patterns/ (3 files) in sync
  ✓ _anti-patterns/ (4 files) in sync
  ✓ _checklists/ (3 files) in sync

Workflow:
  Patterns extracted: {count} (in ~/.claude/vibe-ash-svelte/patterns/)
  Tech debt: {count} items (in .claude/backlog.md)
  Last retro: {date or "never"}

Overall: ✓ Ready for /vibe commands
```

If validation fails:

```
=== Vibe Framework Check ===

Project: {project.name}
Core KPI: {project.core_kpi}

Structure:
  ✓ .claude/vibe.config.json
  ✗ architecture/ - MISSING _fundamentals/quick-reference.md
  ✗ docs/domain/ - MISSING GLOSSARY.md

Template Sync:
  (skipped - structure incomplete)

Overall: ✗ NOT READY - Fix structure issues first

Options:
  1. Scaffold missing files from template
  2. Show me what files are needed
```

---

### Phase 5: Offer Actions (if issues found)

**For missing structure:**
- Offer to scaffold from template
- List exactly what will be created
- Wait for user approval before creating

**For divergent files:**
- Ask if user wants to see diff
- If yes, read both files and show meaningful diff
- Offer to sync (merge from template) or keep project version

---

## Sync Actions

When user requests sync for a divergent file:

1. Read template file: `~/projects/vibe-ash-svelte-template/architecture/{path}`
2. Read project file: `{project}/architecture/{path}`
3. Show diff summary:
   ```
   File: _guides/testing.md

   Template has:
     + New section "Performance Testing" (lines 450-520)
     + Updated "E2E Testing" examples (lines 200-250)

   Project has:
     + Custom section "Syna-specific Testing" (lines 300-350)

   Options:
     [1] Merge template additions (keeps project customizations)
     [2] Replace with template (loses project customizations)
     [3] Keep project version
   ```
4. Execute chosen action using Edit tool

---

## Example Output

```
/vibe check

=== Vibe Framework Check ===

Project: Syna
Core KPI: Homeowner refuses to communicate outside the platform

Structure:
  ✓ .claude/vibe.config.json
  ✓ architecture/ (5 categories, 23 files)
  ✓ docs/domain/ (5 feature specs, glossary, vision)

Template Sync:
  ✓ _fundamentals/ (3 files) in sync
  ✓ _guides/ (8 files) in sync
  ✓ _patterns/ (3 files) in sync
  ✓ _anti-patterns/ (4 files) in sync
  ✓ _checklists/ (3 files) in sync

Workflow:
  Patterns extracted: 0 (in ~/.claude/vibe-ash-svelte/patterns/)
  Tech debt: 0 items
  Last retro: never

Overall: ✓ Ready for /vibe commands
```

---

## Related Commands

- `/vibe` - Main workflow (validates on first run)
- `/vibe retro` - Extract patterns, update learnings
- `/vibe status` - Show current sprint/feature progress
