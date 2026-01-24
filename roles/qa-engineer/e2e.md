# QA Engineer Role - E2E Testing

> E2E testing patterns with Playwright. Load when writing E2E tests.

---

## When to Write E2E Tests

### MUST Have E2E

| Scenario | Why |
|----------|-----|
| Login/logout flow | Full auth integration |
| Registration/onboarding | Multi-step user journey |
| Payment/checkout flows | Critical business path |
| Cross-page navigation | Router + state persistence |
| Real-time features | WebSocket + UI sync |
| File upload/download | Browser API + backend |

### Skip E2E (Covered Elsewhere)

| Scenario | Why |
|----------|-----|
| Form field validation | Unit test components |
| Individual component state | Integration tests |
| API response handling | Backend tests |
| Error message display | Component tests |
| Loading spinners | Component tests |
| Button disabled states | Component tests |

---

## E2E Checklist (Before QA Complete)

- [ ] **Is this an auth flow?** (login, logout, register) -> E2E REQUIRED
- [ ] **Does it span multiple pages?** (wizard, checkout) -> E2E REQUIRED
- [ ] **Does it involve real-time?** (chat, live updates) -> E2E REQUIRED
- [ ] **Is it a critical business path?** (payment, export) -> E2E REQUIRED
- [ ] **Does it integrate multiple systems?** (LiveView + Svelte + PubSub) -> E2E REQUIRED

---

## E2E Test Template (Playwright)

```typescript
// assets/tests/e2e/{feature}.spec.ts
import { test, expect } from '@playwright/test';

test.describe('{FEATURE-ID}: {Feature Name}', () => {
  test.beforeEach(async ({ page }) => {
    // Common setup (login, navigate, etc.)
  });

  test('{scenario description}', async ({ page }) => {
    // Given: {precondition}
    await page.goto('/path');
    await page.waitForLoadState('networkidle');

    // When: {action}
    await page.fill('[data-testid="input"]', 'value');
    await page.click('[data-testid="submit"]');

    // Then: {expected outcome}
    await expect(page.getByTestId('result')).toBeVisible();
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

---

## Auth Flow E2E Template

```typescript
// assets/tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('AUTH: Login Flow', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    // Given: user on login page
    await page.goto('/login');

    // When: valid credentials submitted
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="submit"]');

    // Then: redirected to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByTestId('user-menu')).toBeVisible();
  });

  test('invalid credentials show error', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[data-testid="email"]', 'wrong@example.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="submit"]');

    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('logout clears session', async ({ page }) => {
    // Given: logged in user
    await loginAsTestUser(page);

    // When: logout clicked
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout"]');

    // Then: redirected to login
    await expect(page).toHaveURL('/login');

    // And: protected route redirects
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });
});

// Helper function
async function loginAsTestUser(page) {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="submit"]');
  await page.waitForURL('/dashboard');
}
```

---

## Real-Time E2E Template

```typescript
// assets/tests/e2e/chat.spec.ts
import { test, expect } from '@playwright/test';

test.describe('CHAT: Real-Time Messaging', () => {
  test('message appears in recipient view', async ({ browser }) => {
    // Create two browser contexts (two users)
    const senderContext = await browser.newContext();
    const receiverContext = await browser.newContext();

    const senderPage = await senderContext.newPage();
    const receiverPage = await receiverContext.newPage();

    // Login both users
    await loginAs(senderPage, 'sender@example.com');
    await loginAs(receiverPage, 'receiver@example.com');

    // Both navigate to chat
    await senderPage.goto('/chat/123');
    await receiverPage.goto('/chat/123');

    // Sender sends message
    await senderPage.fill('[data-testid="message-input"]', 'Hello!');
    await senderPage.click('[data-testid="send-button"]');

    // Receiver sees message in real-time
    await expect(receiverPage.getByText('Hello!')).toBeVisible();

    // Cleanup
    await senderContext.close();
    await receiverContext.close();
  });
});
```

---

## Page Object Pattern

```typescript
// assets/tests/e2e/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.submitButton = page.getByTestId('submit');
    this.errorMessage = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// Usage in test
test('login with page object', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('test@example.com', 'password');
  await expect(page).toHaveURL('/dashboard');
});
```

---

## E2E Test Organization

```
assets/tests/e2e/
├── auth.spec.ts          # Login, logout, register, password
├── projects.spec.ts      # Project CRUD, navigation
├── chat.spec.ts          # Real-time messaging
├── pages/                # Page objects
│   ├── LoginPage.ts
│   └── DashboardPage.ts
└── fixtures/
    └── auth.ts           # Auth helpers
```

---

## Why E2E Catches What Others Miss

| Gap Type | Unit | Integration | E2E |
|----------|------|-------------|-----|
| Component not registered in app.js | - | - | Yes |
| Route not defined in router | - | Yes | Yes |
| LiveView <-> Svelte event mismatch | - | - | Yes |
| Session/cookie issues | - | - | Yes |
| CSS breaking layout | - | - | Yes |
| JavaScript bundle errors | - | - | Yes |
| Real-time subscription issues | - | - | Yes |

---

## E2E Commands

```bash
# Run all E2E tests
cd assets && npx playwright test

# Run specific test file
cd assets && npx playwright test tests/e2e/auth.spec.ts

# Run in headed mode (see browser)
cd assets && npx playwright test --headed

# Run with debug
cd assets && npx playwright test --debug

# Generate test from recording
cd assets && npx playwright codegen http://localhost:4000
```
