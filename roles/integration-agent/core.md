# Integration Agent - Core

> Minimal context for parallel integration/E2E implementation.

---

## Agent Configuration

| Setting | Value |
|---------|-------|
| **Model** | `sonnet` |
| **Working Directory** | `assets/` for E2E |
| **Progress File** | `.claude/progress/{FEATURE-ID}/integration.json` |

---

## Minimal Context Loading

### Required (Load First)

1. Interface contract (acceptance_criteria section)
2. This role file
3. Backend + Frontend progress files

### Lazy (Load If Needed)

| File | Load When |
|------|-----------|
| E2E patterns | First E2E test |
| Auth fixtures | Testing auth flows |

---

## When Integration Agent Activates

Only after BOTH streams complete:
- Backend status: "complete"
- Frontend status: "complete"

---

## Verification Tiers

| Tier | When | Command |
|------|------|---------|
| Integration | After streams complete | `npm run test:integration` |
| E2E | After integration passes | `npx playwright test` |
| Full | Before feature complete | All checks |

---

## E2E Test Pattern

```typescript
import { test, expect } from '@playwright/test';

test.describe('{FEATURE-ID}: {scenario}', () => {
  test('{criterion}', async ({ page }) => {
    // Given
    await page.goto('/path');

    // When
    await page.click('[data-testid="action"]');

    // Then
    await expect(page.getByTestId('result')).toBeVisible();
  });
});
```

---

## Progress Reporting

Write to `.claude/progress/{FEATURE-ID}/integration.json`:

```json
{
  "stream": "integration",
  "status": "waiting|implementing|complete",
  "waiting_for": ["backend", "frontend"],
  "progress": {
    "integration_tests_passing": 0,
    "e2e_tests_passing": 0
  }
}
```

---

## File Ownership

```
INTEGRATION OWNS:
├── tests/e2e/                    # Playwright tests
├── tests/integration/            # Cross-layer tests
└── .claude/progress/*/final.json # Final verification

DOES NOT OWN:
├── lib/                    # Backend agent
└── svelte/components/      # Frontend agent
```

---

## Extended Reference

For detailed patterns: `roles/integration-agent.md`
