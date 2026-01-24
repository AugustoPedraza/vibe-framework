# QA Engineer Role - Test Templates

> Standard test file templates. Load when writing tests.

---

## Backend Test (ExUnit + LiveView)

```elixir
# test/{project}_web/live/{feature}_live_test.exs
defmodule {{modules.web_prefix}}.{Feature}LiveTest do
  use {{modules.web_prefix}}.ConnCase, async: true
  import Phoenix.LiveViewTest

  describe "{FEATURE-ID}: {Scenario Name}" do
    setup [:create_user]  # Add fixtures as needed

    test "{scenario description}", %{conn: conn, user: user} do
      # Given: {precondition}
      # Setup code here

      # When: {action}
      {:ok, view, _html} = live(conn, ~p"/path")
      # Action code here

      # Then: {expected outcome}
      assert has_element?(view, "[data-testid='...']")
    end
  end
end
```

---

## Domain/Resource Test

```elixir
# test/{domain}/{resource}_test.exs
defmodule {{modules.domain_prefix}}.{Resource}Test do
  use {{modules.domain_prefix}}.DataCase, async: true

  describe "{FEATURE-ID}: {Scenario Name}" do
    test "{expected behavior} when {condition}" do
      # Arrange
      params = %{email: "test@example.com", name: "Test"}

      # Act
      result = Domain.create_resource(params)

      # Assert
      assert {:ok, resource} = result
      assert resource.email == "test@example.com"
    end

    test "returns error when {invalid condition}" do
      # Arrange
      params = %{email: "invalid"}

      # Act
      result = Domain.create_resource(params)

      # Assert
      assert {:error, %Ash.Error.Invalid{}} = result
    end
  end
end
```

---

## Frontend Test (Vitest + Testing Library)

```typescript
// assets/svelte/components/features/{feature}/__tests__/{Component}.test.ts
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Component from '../Component.svelte';

describe('{FEATURE-ID}: {Scenario Name}', () => {
  it('should {expected behavior} when {condition}', async () => {
    // Given: {precondition}
    const props = {
      status: 'success',
      data: [{ id: 1, name: 'Test' }]
    };

    // When: {action}
    render(Component, { props });
    await fireEvent.click(screen.getByTestId('button'));

    // Then: {expected outcome}
    expect(screen.getByTestId('result')).toBeInTheDocument();
  });

  it('should call handler when {interaction}', async () => {
    // Given
    const onSubmit = vi.fn();
    render(Component, { props: { onSubmit } });

    // When
    await fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Then
    expect(onSubmit).toHaveBeenCalledOnce();
  });
});
```

---

## UX States Test Template

```typescript
// assets/svelte/components/features/{feature}/__tests__/{Component}.states.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Component from '../Component.svelte';

describe('{Component} UX States', () => {
  describe('Loading State', () => {
    it('shows skeleton during loading', () => {
      render(Component, { props: { status: 'loading' } });
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('disables interactions during loading', () => {
      render(Component, { props: { status: 'loading' } });
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Error State', () => {
    it('shows error message', () => {
      render(Component, { props: { status: 'error', error: 'Failed to load' } });
      expect(screen.getByText('Failed to load')).toBeInTheDocument();
    });

    it('provides retry action', () => {
      const onRetry = vi.fn();
      render(Component, { props: { status: 'error', onRetry } });
      fireEvent.click(screen.getByRole('button', { name: /retry/i }));
      expect(onRetry).toHaveBeenCalled();
    });
  });

  describe('Empty State', () => {
    it('shows empty message when no data', () => {
      render(Component, { props: { status: 'success', data: [] } });
      expect(screen.getByText(/no items/i)).toBeInTheDocument();
    });

    it('provides CTA for empty state', () => {
      render(Component, { props: { status: 'success', data: [] } });
      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });
  });

  describe('Success State', () => {
    it('renders data correctly', () => {
      render(Component, { props: {
        status: 'success',
        data: [{ id: 1, name: 'Item 1' }]
      }});
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });
});
```

---

## Store Test Template

```typescript
// assets/svelte/stores/__tests__/{store}.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { createStore } from '../{store}';

describe('{Store}', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  it('initializes with default state', () => {
    expect(get(store)).toEqual({ items: [], loading: false });
  });

  it('updates state on action', () => {
    store.addItem({ id: 1, name: 'Test' });
    expect(get(store).items).toHaveLength(1);
  });

  it('resets to initial state', () => {
    store.addItem({ id: 1, name: 'Test' });
    store.reset();
    expect(get(store).items).toHaveLength(0);
  });
});
```

---

## Accessibility Test Template

```typescript
// assets/svelte/components/{Component}/__tests__/a11y.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { axe, toHaveNoViolations } from 'jest-axe';
import Component from '../Component.svelte';

expect.extend(toHaveNoViolations);

describe('{Component} Accessibility', () => {
  it('has no a11y violations in default state', async () => {
    const { container } = render(Component, { props: {} });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has proper aria-labels', () => {
    render(Component);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label');
  });

  it('supports keyboard navigation', async () => {
    render(Component);
    const button = screen.getByRole('button');
    button.focus();
    expect(document.activeElement).toBe(button);
  });

  it('has visible focus indicator', () => {
    render(Component);
    const button = screen.getByRole('button');
    button.focus();
    // Check focus is visible via CSS (implementation-specific)
  });
});
```

---

## Test File Locations

```
test/                           # Backend tests
├── {domain}/                   # Domain tests
│   └── resources/
│       └── {resource}_test.exs
├── {project}_web/              # Web layer tests
│   └── live/
│       └── {feature}_live_test.exs
└── support/                    # Test helpers
    └── factory.ex

assets/                         # Frontend tests
├── svelte/
│   └── components/
│       └── {Component}/
│           └── __tests__/
│               ├── {Component}.test.ts
│               └── a11y.test.ts
└── tests/
    └── e2e/                    # E2E tests
        └── {feature}.spec.ts
```
