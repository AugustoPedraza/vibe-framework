# Migration Progress: {project.name}

> Tracking migration from {current_stack} to Ash+Svelte

## Target Architecture

Reference: [{migration.template_repo}]({migration.template_repo})

---

## Summary

| Status | Count |
|--------|-------|
| Migrated | 0 |
| In Progress | 0 |
| Blocked (needs tests) | 0 |
| Remaining | TBD |
| New (Ash+Svelte native) | 0 |

---

## Progress Bar

```
░░░░░░░░░░░░░░░░░░░░ 0%
```

---

## Migrated Features

> Features successfully migrated to Ash+Svelte

(none yet)

<!-- Template:
- [x] **{FEATURE-ID}**: {Feature Name}
  - Migrated: {date}
  - Tests: ✓ passing
-->

---

## In Progress

> Features currently being migrated

(none yet)

<!-- Template:
- [ ] **MIGRATE-{FEATURE}**: {Feature Name} ({percentage}%)
  - [x] Regression tests written (target architecture)
  - [x] Tests pass against legacy code
  - [ ] Ash resources created
  - [ ] Svelte components created
  - [ ] LiveView integration
  - [ ] Tests pass against new code
  - [ ] Routes switched
-->

---

## Blocked (Needs Tests)

> Features with migration specs but missing regression tests

(none yet)

<!-- Template:
- [ ] **MIGRATE-{FEATURE}**: {Feature Name}
  - Spec: `docs/domain/features/_current/MIGRATE-{FEATURE}.md`
  - Missing: {what tests are needed}
-->

---

## Remaining (Legacy)

> Legacy features not yet analyzed for migration

Run `/vibe migrate init` to populate this list.

<!-- Template:
- [ ] {FEATURE}: {Description}
  - Location: `lib/app_web/live/{feature}_live.ex`
  - Routes: /feature, /feature/:id
  - Priority: High/Medium/Low
-->

---

## New Features (Ash+Svelte Native)

> Features built directly in Ash+Svelte (not migrations)

(none yet)

<!-- Template:
- [x] **{FEATURE-ID}**: {Feature Name}
  - Spec: `docs/domain/features/new/{FEATURE-ID}.md`
  - Completed: {date}
-->

---

## Migration Order

Recommended order based on dependencies:

1. **AUTH** - Core dependency (all features need this)
2. (Run `/vibe migrate init` to generate)

---

## Safety Checklist

Before marking ANY feature as migrated:

- [ ] Regression tests written in target architecture
- [ ] Tests pass against legacy code
- [ ] Tests pass against new code
- [ ] Routes switched to new implementation
- [ ] Legacy code removed (or deprecated)
- [ ] No breaking changes to dependents

---

## Commands Reference

| Command | Purpose |
|---------|---------|
| `/vibe migrate init` | Analyze codebase, populate this file |
| `/vibe migrate [FEATURE]` | Create migration spec for feature |
| `/vibe migrate status` | Show this progress summary |
| `/vibe MIGRATE-{FEATURE}` | Implement migration (requires tests) |
| `/vibe NEW-{ID}` | Build new feature in Ash+Svelte |

---

## Notes

- **Safety Rule:** NO migration without regression tests first
- Tests must be written in target architecture (ExUnit + Ash, Vitest + Svelte)
- Tests must pass against legacy code BEFORE implementation starts
- Database schema shared during migration (no Ash migrations until legacy removed)
