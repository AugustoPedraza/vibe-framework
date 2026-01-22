# Design by Contract Pattern

> Enforce function contracts with preconditions, postconditions, and invariants

## Problem

Functions are called with invalid inputs, return unexpected outputs, or leave the system in inconsistent states. Bugs manifest far from their source, making debugging difficult.

## Solution

Apply Design by Contract principles using Elixir/Ash idioms:
- **Preconditions**: Validate inputs before processing
- **Postconditions**: Verify outputs meet expectations
- **Invariants**: Ensure system properties always hold

---

## When to Use

| Scenario | Apply Contract |
|----------|----------------|
| Public API functions | Preconditions + Postconditions |
| Domain boundaries | Full contracts |
| Data transformations | Invariants |
| Critical business logic | All three |
| Internal utilities | Lightweight or none |

---

## Implementation

### Preconditions via Guards and Validations

```elixir
defmodule MyApp.Accounts do
  # AI:PRECONDITION - email must be valid format
  # AI:PRECONDITION - password must be at least 8 characters
  def register_user(email, password) when is_binary(email) and is_binary(password) do
    with :ok <- validate_email(email),
         :ok <- validate_password(password) do
      do_register(email, password)
    end
  end

  def register_user(_, _) do
    {:error, :invalid_arguments}
  end

  defp validate_email(email) do
    if String.contains?(email, "@"), do: :ok, else: {:error, :invalid_email}
  end

  defp validate_password(password) do
    if String.length(password) >= 8, do: :ok, else: {:error, :password_too_short}
  end
end
```

### Preconditions via Ash Validations

```elixir
defmodule MyApp.Accounts.User do
  use Ash.Resource

  actions do
    create :register do
      accept [:email, :password]

      # Precondition: email format
      validate match(:email, ~r/@/)

      # Precondition: password strength
      validate string_length(:password, min: 8)

      # Precondition: business rule
      validate {MyApp.Validations.UniqueEmail, []}
    end
  end
end
```

### Postconditions via Type Specs

```elixir
defmodule MyApp.Calculator do
  # AI:POSTCONDITION - returns non-negative integer
  @spec calculate_total(list(item())) :: {:ok, non_neg_integer()} | {:error, term()}
  def calculate_total(items) when is_list(items) do
    total = items |> Enum.map(& &1.price) |> Enum.sum()

    # Postcondition check (development/test only)
    if Mix.env() != :prod do
      unless is_integer(total) and total >= 0 do
        raise "Postcondition violated: total must be non-negative integer"
      end
    end

    {:ok, total}
  end
end
```

### Postconditions via Ash Changes

```elixir
defmodule MyApp.Orders.Order do
  use Ash.Resource

  actions do
    create :place do
      # Postcondition: order number is assigned
      change fn changeset, _context ->
        Ash.Changeset.after_action(changeset, fn _changeset, order ->
          if order.order_number do
            {:ok, order}
          else
            {:error, "Postcondition violated: order_number must be assigned"}
          end
        end)
      end
    end
  end
end
```

### Invariants via Change Hooks

```elixir
defmodule MyApp.Accounts.Account do
  use Ash.Resource

  attributes do
    attribute :balance, :integer, default: 0
  end

  actions do
    update :withdraw do
      accept [:amount]

      # Invariant: balance can never go negative
      validate fn changeset, _context ->
        current = Ash.Changeset.get_data(changeset, :balance)
        amount = Ash.Changeset.get_argument(changeset, :amount) || 0

        if current - amount >= 0 do
          :ok
        else
          {:error, field: :amount, message: "Insufficient balance"}
        end
      end
    end
  end

  # Global invariant check
  changes do
    change fn changeset, _context ->
      Ash.Changeset.after_action(changeset, fn _changeset, account ->
        # AI:INVARIANT - balance is never negative
        if account.balance < 0 do
          {:error, "Invariant violated: balance cannot be negative"}
        else
          {:ok, account}
        end
      end)
    end
  end
end
```

---

## Contract Documentation

### Using Semantic Markers

```elixir
defmodule MyApp.Billing do
  @moduledoc """
  Billing domain with strict contracts.

  <!-- AI:HARD_BLOCK -->
  All monetary values MUST be in cents (integers).
  <!-- /AI:HARD_BLOCK -->
  """

  # AI:PRECONDITION - amount must be positive integer (cents)
  # AI:PRECONDITION - currency must be ISO 4217 code
  # AI:POSTCONDITION - returns {:ok, charge} with charge.id set
  # AI:POSTCONDITION - on error, no side effects occur
  # AI:INVARIANT - charge amount equals input amount
  @spec create_charge(pos_integer(), String.t(), map()) ::
          {:ok, Charge.t()} | {:error, term()}
  def create_charge(amount_cents, currency, metadata)
      when is_integer(amount_cents) and amount_cents > 0 and
           is_binary(currency) and byte_size(currency) == 3 do
    # Implementation
  end
end
```

### Contract Test Pattern

```elixir
defmodule MyApp.BillingContractTest do
  use ExUnit.Case, async: true

  describe "create_charge/3 contracts" do
    # Precondition tests
    test "rejects non-positive amounts" do
      assert {:error, _} = Billing.create_charge(0, "USD", %{})
      assert {:error, _} = Billing.create_charge(-100, "USD", %{})
    end

    test "rejects invalid currency codes" do
      assert {:error, _} = Billing.create_charge(1000, "US", %{})
      assert {:error, _} = Billing.create_charge(1000, "USDD", %{})
    end

    # Postcondition tests
    test "successful charge has id assigned" do
      {:ok, charge} = Billing.create_charge(1000, "USD", %{})
      assert charge.id != nil
    end

    test "charge amount matches input" do
      {:ok, charge} = Billing.create_charge(1000, "USD", %{})
      assert charge.amount_cents == 1000
    end

    # Invariant tests
    test "failed charge has no side effects" do
      # Setup to cause failure
      {:error, _} = Billing.create_charge(1000, "USD", %{fail: true})
      # Verify no charge was created
      assert Billing.list_charges() == []
    end
  end
end
```

---

## Ash-Specific Patterns

### Ash Policy as Precondition

```elixir
defmodule MyApp.Projects.Project do
  use Ash.Resource

  policies do
    # Precondition: user must be authenticated
    policy action_type(:create) do
      authorize_if actor_present()
    end

    # Precondition: user must be project member
    policy action_type(:update) do
      authorize_if relates_to_actor_via(:participants)
    end
  end
end
```

### Ash Calculation as Derived Invariant

```elixir
defmodule MyApp.Orders.Order do
  use Ash.Resource

  attributes do
    attribute :subtotal_cents, :integer
    attribute :tax_cents, :integer
    attribute :total_cents, :integer
  end

  calculations do
    # Invariant: total = subtotal + tax
    calculate :calculated_total, :integer, expr(subtotal_cents + tax_cents)
  end

  validations do
    # Verify invariant on every change
    validate fn changeset, _context ->
      subtotal = Ash.Changeset.get_attribute(changeset, :subtotal_cents) || 0
      tax = Ash.Changeset.get_attribute(changeset, :tax_cents) || 0
      total = Ash.Changeset.get_attribute(changeset, :total_cents) || 0

      if total == subtotal + tax do
        :ok
      else
        {:error, field: :total_cents, message: "must equal subtotal + tax"}
      end
    end
  end
end
```

### Ash Notifier as Postcondition Verification

```elixir
defmodule MyApp.Notifiers.ContractVerifier do
  use Ash.Notifier

  def notify(%Ash.Notifier.Notification{action: action, data: record}) do
    verify_postconditions(action.name, record)
    :ok
  end

  defp verify_postconditions(:create_order, order) do
    unless order.order_number do
      Logger.error("Contract violation: order created without number",
        order_id: order.id
      )
      # In dev/test, could raise
    end
  end

  defp verify_postconditions(_, _), do: :ok
end
```

---

## TypeScript/Svelte Contracts

### Runtime Validation with Zod

```typescript
import { z } from 'zod';

// Define contract schema
const CreateUserContract = z.object({
  // Preconditions
  email: z.string().email(),
  password: z.string().min(8),
  age: z.number().int().positive().optional()
});

// AI:PRECONDITION - input must match CreateUserContract schema
// AI:POSTCONDITION - returns user with id assigned
export function createUser(input: unknown): User {
  // Precondition check
  const validated = CreateUserContract.parse(input);

  const user = doCreateUser(validated);

  // Postcondition check (dev only)
  if (import.meta.env.DEV && !user.id) {
    throw new Error('Postcondition violated: user.id must be assigned');
  }

  return user;
}
```

### Component Contract Props

```svelte
<script lang="ts">
  import { z } from 'zod';

  // Contract definition
  const PropsContract = z.object({
    // Preconditions on props
    items: z.array(z.object({
      id: z.string(),
      name: z.string()
    })).min(1, 'At least one item required'),
    onSelect: z.function()
  });

  // AI:PRECONDITION - items must have at least one element
  // AI:PRECONDITION - each item must have id and name
  interface Props {
    items: { id: string; name: string }[];
    onSelect: (id: string) => void;
  }

  let { items, onSelect }: Props = $props();

  // Dev-only contract verification
  if (import.meta.env.DEV) {
    const result = PropsContract.safeParse({ items, onSelect });
    if (!result.success) {
      console.error('Props contract violation:', result.error);
    }
  }
</script>
```

---

## Anti-Patterns

### Overly Defensive Code

```elixir
# BAD - Checking everything everywhere
def process(data) do
  unless is_map(data), do: raise "data must be map"
  unless Map.has_key?(data, :id), do: raise "data must have id"
  unless is_binary(data.id), do: raise "id must be string"
  # ... 20 more checks

  # Actual logic buried
  do_process(data)
end

# GOOD - Contract at boundary, trust internally
def process(data) when is_map(data) do
  # Contract verified at function head
  do_process(data)
end
```

### Silent Contract Violations

```elixir
# BAD - Silently accepting invalid input
def calculate_discount(amount) do
  amount = max(amount, 0)  # Silently "fixing" negative amounts
  amount * 0.1
end

# GOOD - Explicit contract, clear error
def calculate_discount(amount) when is_number(amount) and amount >= 0 do
  amount * 0.1
end

def calculate_discount(_) do
  {:error, :invalid_amount}
end
```

### Contracts Without Tests

```elixir
# BAD - Contract documented but not tested
# AI:PRECONDITION - user must be admin
def admin_action(user) do
  # No test verifying non-admins are rejected!
  do_admin_stuff()
end

# GOOD - Contract tested
# Test file includes:
test "rejects non-admin users" do
  user = build(:user, role: :member)
  assert {:error, :unauthorized} = admin_action(user)
end
```

---

## Quick Reference

### Elixir Contract Tools

| Tool | Use For |
|------|---------|
| Guards (`when`) | Type-level preconditions |
| Pattern matching | Structural preconditions |
| `with` statements | Chained preconditions |
| `@spec` | Documentation + Dialyzer |
| Ash validations | Domain preconditions |
| Ash policies | Authorization preconditions |
| Ash changes | Postconditions/invariants |

### TypeScript Contract Tools

| Tool | Use For |
|------|---------|
| TypeScript types | Compile-time contracts |
| Zod schemas | Runtime validation |
| Assertions | Dev-only checks |
| Branded types | Semantic typing |

### Contract Checklist

- [ ] Public APIs have documented preconditions
- [ ] Critical functions have postcondition checks
- [ ] Domain invariants are enforced in Ash resources
- [ ] Contracts have corresponding tests
- [ ] Contract violations produce clear error messages
