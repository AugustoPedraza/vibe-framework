# Frontend Agent - Core

> Minimal context for parallel frontend implementation.

---

## Agent Configuration

| Setting | Value |
|---------|-------|
| **Model** | `sonnet` |
| **Working Directory** | `assets/` |
| **Progress File** | `.claude/progress/{FEATURE-ID}/frontend.json` |

---

## Minimal Context Loading

### Required (Load First)

1. Interface contract (ui_contract section)
2. This role file
3. Design tokens
4. Mock data (from contract)

### Lazy (Load If Needed)

| File | Load When |
|------|-----------|
| `04-frontend-components.md` | New component type |
| Existing components | Extending/wrapping |
| Testing guide | First test file |

---

## Tiered Verification

| Tier | When | Command | Time |
|------|------|---------|------|
| 0 | During editing | None (dev server) | 0s |
| 1 | After file save | `npm run verify:quick` | ~3s |
| 3 | After test written | `npm run test:related -- {file}` | ~5s |
| 4 | Before complete | `npm run verify` | ~30s |

---

## TDD Workflow

```
FOR EACH acceptance criterion:
  1. Write test → Tier 0
  2. Run test → test:related
  3. Implement → Tier 0
  4. Run test → Verify GREEN
  5. Quick check → verify:quick
```

---

## Progress Reporting

Write to `.claude/progress/{FEATURE-ID}/frontend.json` after:
- Agent start
- Each test written
- Test run results
- Criterion complete
- Blocked or complete

```json
{
  "stream": "frontend",
  "status": "implementing|blocked|complete",
  "current_task": {"phase": "...", "file": "..."},
  "progress": {"criteria_completed": 1, "tests_passing": 3}
}
```

---

## File Ownership

```
FRONTEND OWNS:
├── svelte/components/features/{feature}/  # Feature components
├── svelte/stores/{feature}/               # Feature stores
└── svelte/components/**/__tests__/        # Component tests

DOES NOT OWN:
├── lib/                    # Backend agent
└── tests/e2e/              # Integration agent
```

---

## Component Pattern

```svelte
<script lang="ts">
  interface Props {
    // From contract.ui_contract.components[].props
  }
  let { ...props }: Props = $props();

  // State from contract.ui_contract.components[].states
</script>
```

---

## Extended Reference

For detailed patterns: `roles/frontend-agent.md`
