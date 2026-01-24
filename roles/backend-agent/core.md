# Backend Agent - Core

> Minimal context for parallel backend implementation.

---

## Agent Configuration

| Setting | Value |
|---------|-------|
| **Model** | `opus` |
| **Working Directory** | Project root |
| **Progress File** | `.claude/progress/{FEATURE-ID}/backend.json` |

---

## Minimal Context Loading

### Required (Load First)

1. Interface contract (source of truth)
2. This role file
3. Domain spec (business rules)

### Lazy (Load If Needed)

| File | Load When |
|------|-----------|
| `testing.md` | Writing first test |
| `03-domain-ash.md` | Unfamiliar Ash pattern |
| Existing resources | Extending existing code |

---

## TDD Workflow

```
FOR EACH acceptance criterion:
  1. Write test → Run to verify RED
  2. Implement → Minimal code to pass
  3. Run test → Verify GREEN
  4. Report progress → Update JSON
```

---

## Progress Reporting

Write to `.claude/progress/{FEATURE-ID}/backend.json` after:
- Agent start
- Each test written
- Test run results
- Criterion complete
- Blocked or complete

```json
{
  "stream": "backend",
  "status": "implementing|blocked|complete",
  "current_task": {"phase": "...", "file": "..."},
  "progress": {"criteria_completed": 1, "tests_passing": 3}
}
```

---

## File Ownership

```
BACKEND OWNS:
├── lib/{domain}/           # Ash resources, domain logic
├── test/{domain}/          # Domain tests
└── lib/{project}_web/live/ # LiveView handlers (thin shell)

DOES NOT OWN:
├── assets/svelte/          # Frontend agent
└── tests/e2e/              # Integration agent
```

---

## Sync Points

Check `.claude/contracts/{FEATURE-ID}/sync-point.json` before:
- Modifying contract
- Completing stream
- When blocked

---

## Extended Reference

For detailed patterns: `roles/backend-agent.md`
