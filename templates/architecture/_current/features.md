# Current Features Inventory

> Catalog of all existing features (to be migrated or deprecated)

## Summary

| Status | Count |
|--------|-------|
| To Migrate | {count} |
| Keep As-Is | {count} |
| Deprecate | {count} |

---

## Core Features

### {FEATURE-1}: {Feature Name}

| Attribute | Value |
|-----------|-------|
| **Status** | To Migrate / Keep / Deprecate |
| **Priority** | High / Medium / Low |
| **Location** | `lib/app_web/live/feature_live.ex` |
| **Routes** | `/feature`, `/feature/:id` |
| **Dependencies** | {what it depends on} |
| **Dependents** | {what depends on it} |

**Current Behavior:**
- {behavior_1}
- {behavior_2}

**Migration Notes:**
- {note_1}

---

### {FEATURE-2}: {Feature Name}

| Attribute | Value |
|-----------|-------|
| **Status** | To Migrate / Keep / Deprecate |
| **Priority** | High / Medium / Low |
| **Location** | `lib/app_web/live/feature_live.ex` |
| **Routes** | `/feature` |
| **Dependencies** | {dependencies} |
| **Dependents** | {dependents} |

**Current Behavior:**
- {behavior_1}
- {behavior_2}

**Migration Notes:**
- {note_1}

---

## Supporting Features

### {FEATURE-3}: {Feature Name}

(Same format as above)

---

## Deprecated Features

### {FEATURE-X}: {Feature Name}

| Attribute | Value |
|-----------|-------|
| **Status** | Deprecate |
| **Reason** | {why deprecating} |
| **Replacement** | {what replaces it, if any} |
| **Timeline** | {when to remove} |

---

## Feature Dependencies Graph

```
FEATURE-1
├── depends on: FEATURE-2, AUTH
└── depended by: FEATURE-3

FEATURE-2
├── depends on: AUTH
└── depended by: FEATURE-1, FEATURE-4

AUTH (core)
└── depended by: all features
```

---

## Migration Order Recommendation

Based on dependencies, suggested migration order:

1. **AUTH** (core dependency)
2. **{FEATURE-X}** (no dependencies)
3. **{FEATURE-Y}** (depends only on AUTH)
4. ...

---

## Notes

- Run `/vibe migrate init` to auto-discover features
- Run `/vibe migrate [FEATURE]` to create migration spec
- Features must have regression tests before migration
