# Testing Strategy

> Test pyramid: Unit (fast, many) -> Integration (medium) -> E2E (slow, few).

---

## Test Pyramid

```
                    +----------+
                   /   E2E    \         Few, critical paths only
                  / (Playwright)\
                 +---------------+
                /  Integration  \       LiveView flows
               / (LiveView tests)\
              +-------------------+
             /        Unit         \    Ash resources, Svelte components
            /   (ExUnit + Vitest)   \
           +-----------------------+
```

| Layer | Tools | Scope | Speed |
|-------|-------|-------|-------|
| Unit | ExUnit, Vitest | Resources, Components | Fast |
| Integration | Phoenix.LiveViewTest | LiveView flows | Medium |
| E2E | Playwright | Critical user journeys | Slow |

---

## Test Organization

```
test/
+-- {app}/                        # Domain unit tests
|   +-- accounts/
|   |   +-- user_test.exs
|   |   +-- session_test.exs
|   +-- projects/
|   |   +-- project_test.exs
|   +-- conversations/
|       +-- channel_test.exs
|       +-- message_test.exs
|
+-- {app}_web/                    # Web layer tests
|   +-- live/
|   |   +-- auth/
|   |   |   +-- login_live_test.exs
|   |   +-- projects/
|   |       +-- index_live_test.exs
|   +-- controllers/
|       +-- session_controller_test.exs
|
+-- support/                      # Test helpers
    +-- conn_case.ex             # HTTP/LiveView setup
    +-- data_case.ex             # Database setup
    +-- fixtures/
        +-- accounts_fixtures.ex

assets/tests/
+-- unit/
|   +-- components/
|       +-- ui/
|       |   +-- Button.test.ts
|       |   +-- Input.test.ts
|       +-- features/
|           +-- auth/
|               +-- LoginForm.test.ts
|
+-- integration/                 # Cross-component tests
|   +-- (optional)
|
+-- e2e/                         # Playwright E2E tests
    +-- auth.spec.ts
    +-- projects.spec.ts
    +-- fixtures/
        +-- auth.ts
```

---

## Backend Testing

### Ash Resource Tests

```elixir
# test/{app}/accounts/user_test.exs
defmodule MyApp.Accounts.UserTest do
  use MyApp.DataCase

  alias MyApp.Accounts.User

  describe "register action" do
    test "creates user with valid data" do
      assert {:ok, user} =
        User
        |> Ash.Changeset.for_create(:register, %{
          email: "test@example.com",
          password: "password123"
        })
        |> Ash.create()

      assert user.email == "test@example.com"
      assert user.hashed_password != "password123"
    end

    test "fails with duplicate email" do
      user_fixture(email: "test@example.com")

      assert {:error, %Ash.Error.Invalid{}} =
        User
        |> Ash.Changeset.for_create(:register, %{
          email: "test@example.com",
          password: "password123"
        })
        |> Ash.create()
    end
  end
end
```

### LiveView Tests

```elixir
# test/{app}_web/live/auth/login_live_test.exs
defmodule MyAppWeb.Auth.LoginLiveTest do
  use MyAppWeb.ConnCase, async: true

  import Phoenix.LiveViewTest

  describe "login page" do
    test "renders login form", %{conn: conn} do
      {:ok, _view, html} = live(conn, ~p"/login")

      assert html =~ "Sign in"
      assert html =~ "Email"
      assert html =~ "Password"
    end

    test "redirects to projects on successful login", %{conn: conn} do
      user = user_fixture(email: "test@example.com", password: "password123")

      {:ok, view, _html} = live(conn, ~p"/login")

      # Simulate Svelte form submission
      view
      |> element("#login-form")
      |> render_submit(%{email: "test@example.com", password: "password123"})

      assert_redirect(view, ~p"/projects")
    end
  end
end
```

---

## Frontend Testing (Vitest)

### Component Tests

```typescript
// assets/tests/unit/components/features/auth/LoginForm.test.ts
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import LoginForm from '$components/features/auth/LoginForm.svelte';

describe('LoginForm', () => {
  const mockLive = {
    pushEvent: vi.fn()
  };

  describe('rendering', () => {
    it('renders form elements', () => {
      render(LoginForm, { props: { live: mockLive } });

      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  describe('submission', () => {
    it('calls pushEvent with form data', async () => {
      render(LoginForm, { props: { live: mockLive } });

      await fireEvent.input(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      await fireEvent.input(screen.getByLabelText(/password/i), {
        target: { value: 'password123' }
      });
      await fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      expect(mockLive.pushEvent).toHaveBeenCalledWith('login', {
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});
```

---

## E2E Testing (Playwright)

### Auth Fixture

```typescript
// tests/e2e/fixtures/auth.ts
import { test as base, expect } from '@playwright/test';

// Test user seeded in database
const TEST_USER = {
  email: 'maria@email.com',
  password: 'password123'
};

export const test = base.extend({
  // Authenticated page fixture
  authenticatedPage: async ({ page }, use) => {
    // Login
    await page.goto('/login');
    await page.getByLabel('Email').fill(TEST_USER.email);
    await page.getByLabel('Password').fill(TEST_USER.password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Wait for redirect
    await page.waitForURL('/projects');

    await use(page);
  },
});

export { expect };
```

### E2E Test Examples

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from './fixtures/auth';

test.describe('Authentication', () => {
  test('user can log in with valid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill form
    await page.getByLabel('Email').fill('maria@email.com');
    await page.getByLabel('Password').fill('password123');

    // Submit
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Verify redirect
    await expect(page).toHaveURL('/projects');
  });

  test('user sees error on invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('wrong@email.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Verify error message
    await expect(page.getByText('Wrong email or password')).toBeVisible();

    // Verify still on login page
    await expect(page).toHaveURL('/login');
  });
});
```

---

## AI-Assisted Testing Workflows

### Workflow Decision Tree

```
What are you doing?
        |
        +-- Fixing a bug?
        |   +-- ERROR-DRIVEN: reproduce -> fix -> verify
        |
        +-- New feature?
        |   +-- TDD: test -> implement -> refactor
        |
        +-- Data transformation?
        |   +-- PROPERTY-BASED: define invariants -> generate cases
        |
        +-- User journey?
        |   +-- E2E: Playwright for critical paths only
        |
        +-- Acceptance criteria?
            +-- STRUCTURED EXUNIT: comments as Given/When/Then
```

### Bug Fixing Workflow (Error-Driven)

**Prompt Template:**
```
"I have this error:

[PASTE ERROR HERE]

1. Write a test that reproduces this error
2. Run the test (should fail)
3. Fix the code
4. Run the test (should pass)
5. Run just check"
```

### New Feature Workflow (TDD)

**Prompt Template:**
```
"Implement [FEATURE] using TDD:

1. Write a test describing the expected behavior
2. Run test (should fail)
3. Implement minimum code to pass
4. Run test (should pass)
5. Refactor if needed
6. Run just check"
```

### Acceptance Criteria: Structured ExUnit (Not Gherkin)

```elixir
# Same clarity, one file, AI-friendly
describe "User Login" do
  @tag :acceptance
  test "successful login redirects to dashboard" do
    # Given: user exists
    user = insert(:user, email: "test@example.com")

    # When: user logs in with valid credentials
    conn = post(build_conn(), "/login", %{
      email: "test@example.com",
      password: "password"
    })

    # Then: redirected to dashboard
    assert redirected_to(conn) == "/dashboard"
  end
end
```

---

## Testing Checklist

**Before PR:**
- [ ] All new code has tests
- [ ] Tests follow Given/When/Then pattern
- [ ] No `skip` or `only` left in tests
- [ ] Coverage thresholds met
- [ ] `just check` passes

**Test Quality:**
- [ ] Tests are isolated (no shared state)
- [ ] Fast tests run first (unit -> integration -> e2e)
- [ ] Flaky tests are fixed or removed
- [ ] Mocks are used sparingly (prefer fixtures)

**E2E Specific:**
- [ ] Only critical paths covered
- [ ] Test user seeded in database
- [ ] Mobile viewport tested
- [ ] Screenshots on failure enabled
