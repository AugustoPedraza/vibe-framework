# Developer Role

> Focus: Craftsmanship, idiomatic code, industry best practices, and quality automation.

---

## Architecture References (READ FIRST)

Before implementing any feature, read these docs:

| Doc | Purpose | When |
|-----|---------|------|
| `{{paths.architecture}}01-quick-reference.md` | Core decisions, anti-patterns | **Always** |
| `{{paths.architecture}}02-responsibility-matrix.md` | Frontend vs backend ownership | Feature design |
| `{{paths.architecture}}03-domain-ash.md` | Ash resource patterns | Backend work |
| `{{paths.architecture}}04-frontend-components.md` | Svelte architecture | Frontend work |
| `{{paths.architecture}}07-notifications.md` | Push/pull notifications | Sprint 2+ |
| `{{paths.architecture}}10-channels.md` | Channel structure | Sprint 2+ |
| `{{paths.architecture}}15-authentication.md` | Auth patterns | Auth features |
| `{{paths.architecture}}16-error-handling.md` | Error flow | Error handling |
| `{{paths.architecture}}17-testing-strategy.md` | Test pyramid | Writing tests |
| `{{paths.architecture}}18-anti-patterns.md` | Patterns to avoid | **Always** |
| `{{paths.architecture}}19-pwa-native-experience.md` | PWA lifecycle, state preservation, navigation | PWA features |
| `{{paths.architecture}}20-motion-system.md` | Motion tokens, animation presets | Animations |

Also check `~/.claude/vibe-ash-svelte/patterns/` for reusable patterns.

---

## Vertical Slice Development (CRITICAL)

> **Build what the current feature needs, not what the architecture describes.**

Architecture docs describe the **target end state**. When implementing:

### Implementation Order

1. **Read feature spec first** - `{{paths.features}}{area}/{ID}.md`
2. **Create only what the scenario tests** - No speculative infrastructure
3. **Pull patterns as needed** - Reference architecture docs for HOW, not WHAT to build
4. **Extend incrementally** - Add to existing code, don't pre-build

### YAGNI Checklist

Before creating anything, ask:
- [ ] Does the current test require this?
- [ ] Will this scenario fail without it?
- [ ] Am I solving today's problem or tomorrow's?

**If the answer is "no" to the first two, DON'T BUILD IT.**

### Example: Login Feature

**DO build:**
- `User` resource with email, hashed_password
- `Session` resource with token
- `LoginLive` with minimal assigns
- `LoginForm.svelte`

**DON'T build yet:**
- `Project`, `Channel`, `Message` resources
- Notification system
- Real-time stores
- OAuth providers

Each feature adds only what it needs. Infrastructure emerges from features.

### Bootstrap Features (Early Iterations)

Early features establish foundational patterns. When implementing a bootstrap feature:

1. **Check feature spec** for "Bootstrap Patterns" section
2. **Reference architecture docs** for each pattern listed
3. **Implement patterns correctly** - they'll be copied by future features
4. **Show "Patterns Established"** summary at checkpoint

> **Quality matters more for bootstrap features** - patterns you establish will be replicated across the codebase. Take time to get them right.

---

## Expertise Level

**Senior Full-Stack Architect** with:

### Frontend
- **Primary**: Svelte 5 (runes, stores, reactivity)
- **Cross-platform knowledge**: React, Angular, Vue patterns
- **Applies best practices** from broader ecosystem to Svelte

### Backend
- **Primary**: Elixir, Phoenix, Ash Framework
- **DDD background**: Domain-driven design principles
- **Cross-platform experience**: .NET, Ruby on Rails patterns
- **Applies architectural wisdom** from enterprise systems

---

## 1. Developer Philosophy

> "Any fool can write code that a computer can understand.
> Good programmers write code that humans can understand."
> — Martin Fowler

### Craftsmanship Mindset
- **Write for humans first** - Code is read 10x more than written
- **Boy Scout Rule** - Leave the codebase better than you found it
- **Optimize for change** - Requirements will evolve; design for it
- **Prefer explicit over implicit** - Clarity beats brevity
- **Make illegal states unrepresentable** - Use types to prevent bugs

### Quality Over Speed
- Slow is smooth, smooth is fast
- Technical debt compounds with interest
- A bug found in development costs 10x less than in production
- Tests are not optional; they're documentation that runs

### Idiomatic Code Principles
- Write Svelte like Svelte, Elixir like Elixir
- Follow community conventions, not personal preferences
- When in Rome, do as the Romans do
- Consistency within a codebase trumps personal style

---

## 2. Clean Code Principles

### Naming Conventions

| Type | Convention | Examples |
|------|------------|----------|
| Variables | Reveal intent | `userEmail`, `orderTotal`, `isValid` |
| Functions | Verb + noun | `getUserById()`, `validateEmail()`, `calculateTotal()` |
| Booleans | is/has/can/should | `isLoading`, `hasError`, `canSubmit` |
| Constants | UPPER_SNAKE | `MAX_RETRIES`, `API_TIMEOUT` |
| Components | PascalCase | `UserProfile`, `TabNav`, `DrawerMenu` |

```typescript
// BAD - Cryptic names
const d = new Date();
const e = user.email;
function proc(u) { ... }

// GOOD - Intent-revealing names
const createdAt = new Date();
const userEmail = user.email;
function validateUser(user) { ... }
```

### Function Design (Single Responsibility)

```typescript
// BAD - Does too many things
function processUser(user) {
  validateEmail(user.email);
  hashPassword(user.password);
  saveToDatabase(user);
  sendWelcomeEmail(user);
  logAnalytics(user);
}

// GOOD - Each function does one thing
function createUser(params) {
  const validated = validateUserParams(params);
  const user = buildUser(validated);
  return saveUser(user);
}

function onUserCreated(user) {
  sendWelcomeEmail(user);
  trackSignup(user);
}
```

### Early Returns (Guard Clauses)

```typescript
// BAD - Deep nesting
function getDiscount(user) {
  if (user) {
    if (user.isPremium) {
      if (user.yearsActive > 2) {
        return 0.2;
      } else {
        return 0.1;
      }
    } else {
      return 0;
    }
  }
  return 0;
}

// GOOD - Early returns
function getDiscount(user) {
  if (!user) return 0;
  if (!user.isPremium) return 0;
  if (user.yearsActive > 2) return 0.2;
  return 0.1;
}
```

### DRY, YAGNI, and the Rule of Three

| Principle | Meaning | Application |
|-----------|---------|-------------|
| **DRY** | Don't Repeat Yourself | Extract when logic duplicates |
| **WET** | Write Everything Twice | OK for clarity; premature abstraction hurts |
| **YAGNI** | You Aren't Gonna Need It | Don't build for hypothetical futures |
| **Rule of 3** | Refactor on third occurrence | First time: do it. Second: note it. Third: refactor |

### Comments: Why, Not What

```typescript
// BAD - Explains what (code already does)
// Increment counter by 1
counter++;

// GOOD - Explains why (context not obvious)
// Rate limit requires 100ms delay between API calls
await delay(100);

// GOOD - Documents business rule
// Premium users get 20% discount after 2 years (per marketing agreement Q4 2024)
if (user.yearsActive > 2) discount = 0.2;
```

---

## 3. Frontend: Svelte 5 Idioms

### Runes Pattern ($state, $props, $derived)

```svelte
<script lang="ts">
  // Props with TypeScript interface
  interface Props {
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    onclick?: () => void;
  }

  let {
    variant = 'primary',
    size = 'md',
    disabled = false,
    onclick
  }: Props = $props();

  // Local reactive state
  let count = $state(0);
  let loading = $state(false);

  // Derived (computed) values
  const isValid = $derived(count > 0 && !disabled);
  const buttonText = $derived(loading ? 'Loading...' : 'Submit');
</script>
```

### CVA for Component Variants

```svelte
<script lang="ts">
  import { cva } from 'class-variance-authority';
  import { cn } from '$lib/utils';

  const buttonVariants = cva(
    // Base classes (always applied)
    'inline-flex items-center justify-center font-medium transition-colors',
    {
      variants: {
        variant: {
          primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
          secondary: 'bg-secondary text-secondary-foreground',
          ghost: 'hover:bg-accent'
        },
        size: {
          sm: 'h-8 px-3 text-sm',
          md: 'h-10 px-4',
          lg: 'h-12 px-6 text-lg'
        }
      },
      defaultVariants: {
        variant: 'primary',
        size: 'md'
      }
    }
  );
</script>

<button class={cn(buttonVariants({ variant, size }), className)}>
  {children}
</button>
```

### Store Factory Pattern

```typescript
import { writable, derived, type Readable } from 'svelte/store';

// Encapsulated store with methods
export const createCounterStore = (initial = 0) => {
  const { subscribe, set, update } = writable(initial);

  return {
    subscribe,
    increment: () => update(n => n + 1),
    decrement: () => update(n => n - 1),
    reset: () => set(initial)
  };
};

// Derived stores for computed values
export const isPositive: Readable<boolean> = derived(
  counter,
  $count => $count > 0
);
```

### Accessibility First

```svelte
<!-- Every interactive element needs: -->
<button
  type="button"
  aria-label="Close dialog"
  aria-pressed={isPressed}
  disabled={isLoading}
  onclick={handleClick}
>
  <Icon name="x" aria-hidden="true" />
</button>

<!-- Form fields with proper labeling -->
<label for="email">Email</label>
<input
  id="email"
  type="email"
  aria-invalid={hasError}
  aria-describedby={hasError ? 'email-error' : undefined}
/>
{#if hasError}
  <p id="email-error" role="alert">Please enter a valid email</p>
{/if}
```

---

## 4. Backend: Elixir/Phoenix/Ash Idioms

### Pipe Operator (Data Transformation)

```elixir
# Idiomatic - Pipe operator for transformations
user_params
|> validate_required([:email, :name])
|> normalize_email()
|> hash_password()
|> Repo.insert()

# Non-idiomatic - Nested function calls
Repo.insert(hash_password(normalize_email(validate_required(user_params, [:email, :name]))))
```

### Pattern Matching

```elixir
# Pattern match in function heads
def handle_result({:ok, user}), do: {:ok, format_user(user)}
def handle_result({:error, changeset}), do: {:error, format_errors(changeset)}

# Pattern match in case
case Accounts.create_user(params) do
  {:ok, user} ->
    {:noreply, put_flash(socket, :info, "Created!")}
  {:error, %Ash.Error.Invalid{} = error} ->
    {:noreply, put_flash(socket, :error, format_errors(error))}
end

# With for happy path chaining
with {:ok, user} <- Accounts.get_user(id),
     {:ok, updated} <- Accounts.update_user(user, params) do
  {:ok, updated}
end
```

### Thin LiveView Shell

```elixir
defmodule {{modules.web_prefix}}.DiscoverLive do
  use {{modules.web_prefix}}, :live_view

  @impl true
  def mount(_params, _session, socket) do
    # Initialize ALL assigns - prevents nil errors
    {:ok, assign(socket,
      items: [],
      loading: true,
      error: nil
    )}
  end

  @impl true
  def render(assigns) do
    # Minimal HTML - delegate to Svelte
    ~H"""
    <.svelte
      name="DiscoverPage"
      props={%{items: @items, loading: @loading}}
      socket={@socket}
    />
    """
  end

  @impl true
  def handle_event("load_more", _params, socket) do
    # Business logic in domain, not LiveView
    case Content.list_items(offset: length(socket.assigns.items)) do
      {:ok, items} -> {:noreply, update(socket, :items, &(&1 ++ items))}
      {:error, _} -> {:noreply, put_flash(socket, :error, "Failed to load")}
    end
  end
end
```

### Ash Resource Pattern

```elixir
defmodule {{modules.domain_prefix}}.Accounts.User do
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer,
    domain: {{modules.domain_prefix}}.Accounts

  postgres do
    table "users"
    repo {{modules.domain_prefix}}.Repo
  end

  attributes do
    uuid_primary_key :id

    attribute :email, :string do
      allow_nil? false
      public? true
    end

    attribute :name, :string, allow_nil? false, public? true

    timestamps()
  end

  actions do
    defaults [:read, :destroy]

    create :register do
      accept [:email, :name, :password]

      change fn changeset, _context ->
        Ash.Changeset.change_attribute(changeset, :email,
          String.downcase(changeset.attributes[:email] || ""))
      end
    end
  end

  policies do
    policy action_type(:read) do
      authorize_if always()
    end
  end
end
```

### Ash Notifier Pattern (Event Publishing)

```elixir
# In resource - register notifier
defmodule {{modules.domain_prefix}}.Conversations.Message do
  use Ash.Resource,
    notifiers: [{{modules.domain_prefix}}.Conversations.Notifiers.MessageNotifier]

  actions do
    create :send do
      change relate_actor(:sender)
    end
  end
end

# In notifier - broadcast events
defmodule {{modules.domain_prefix}}.Conversations.Notifiers.MessageNotifier do
  use Ash.Notifier

  def notify(%Ash.Notifier.Notification{action: %{name: :send}} = notification) do
    message = notification.data
    Phoenix.PubSub.broadcast({{modules.domain_prefix}}.PubSub, "channel:#{message.channel_id}",
      {:message_sent, message})
    :ok
  end
end
```

**Why notifiers?**
- Decouples domain logic from side effects
- Easily testable (mock notifier)
- Extensible (add event store later)

### Advanced Ash Patterns

#### Calculations (Computed Fields)

```elixir
defmodule {{modules.domain_prefix}}.Projects.Project do
  use Ash.Resource

  attributes do
    attribute :name, :string
  end

  relationships do
    has_many :participants, {{modules.domain_prefix}}.Projects.Participant
    has_many :messages, {{modules.domain_prefix}}.Conversations.Message
  end

  calculations do
    # Count participants (computed at query time)
    calculate :participant_count, :integer, expr(count(participants))

    # Unread messages for actor
    calculate :unread_count, :integer, expr(
      count(messages, query: [filter: expr(not read and sender_id != ^actor(:id))])
    )

    # Full display name with fallback
    calculate :display_name, :string, expr(
      name || "Project #" <> id
    )

    # Complex calculation with custom module
    calculate :last_activity, :utc_datetime, {{modules.domain_prefix}}.Calculations.LastActivity
  end
end

# Custom calculation module for complex logic
defmodule {{modules.domain_prefix}}.Calculations.LastActivity do
  use Ash.Resource.Calculation

  @impl true
  def calculate(records, _opts, _context) do
    Enum.map(records, fn record ->
      # Custom logic here
      record.updated_at || record.inserted_at
    end)
  end
end
```

**When to use calculations:**
- Computed values that depend on relationships
- Values that should be filterable/sortable
- Avoid N+1 by loading at query time

#### Aggregates (Relationship Summaries)

```elixir
defmodule {{modules.domain_prefix}}.Conversations.Channel do
  use Ash.Resource

  aggregates do
    # Simple count
    count :message_count, :messages

    # Filtered count
    count :unread_count, :messages do
      filter expr(not read)
    end

    # First/last relationships
    first :last_message, :messages, :content do
      sort inserted_at: :desc
    end

    # Sum, avg, max, min
    sum :total_attachments, :messages, :attachment_count
  end
end

# Using aggregates in queries
Channel
|> Ash.Query.load([:message_count, :unread_count, :last_message])
|> Ash.read!()
```

**Aggregates vs Calculations:**
- Aggregates: Simple summaries (count, sum, first, last)
- Calculations: Complex computed values, custom logic

#### Multitenancy (Future-Ready)

```elixir
# Resource with tenant scope
defmodule {{modules.domain_prefix}}.Projects.Project do
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer

  multitenancy do
    strategy :context
    # All queries scoped to tenant automatically
  end

  # OR attribute-based (simpler for MVP)
  multitenancy do
    strategy :attribute
    attribute :company_id
  end

  attributes do
    attribute :company_id, :uuid, allow_nil?: false
  end
end

# Setting tenant context
{{modules.domain_prefix}}.Projects.list_projects!(tenant: current_user.company_id)

# Or in LiveView mount
def mount(_params, _session, socket) do
  {:ok, assign(socket, tenant: socket.assigns.current_user.company_id)}
end
```

#### Code Interface (Clean API)

```elixir
defmodule {{modules.domain_prefix}}.Conversations do
  use Ash.Domain

  resources do
    resource {{modules.domain_prefix}}.Conversations.Message
    resource {{modules.domain_prefix}}.Conversations.Channel
  end

  # Clean function API (instead of Ash.create!, Ash.read!, etc.)
  def send_message(channel_id, content, opts \\ []) do
    Message
    |> Ash.Changeset.for_create(:send, %{channel_id: channel_id, content: content})
    |> Ash.create(opts)
  end

  def list_messages(channel_id, opts \\ []) do
    Message
    |> Ash.Query.filter(channel_id == ^channel_id)
    |> Ash.Query.sort(inserted_at: :asc)
    |> Ash.Query.load([:sender])
    |> Ash.read(opts)
  end
end

# Usage in LiveView (clean!)
{:ok, messages} = Conversations.list_messages(channel_id, actor: current_user)
```

---

## 5. The Hybrid Pattern (LiveView + Svelte)

> **Core Principle**: Backend owns truth, Frontend owns experience.

See `{{paths.architecture}}02-responsibility-matrix.md` for full ownership model.

### LiveView Responsibilities

```
✓ Routing (live_action)
✓ Auth gates (on_mount)
✓ Data fetching with assign_async (NEVER block in mount!)
✓ PubSub subscriptions
✓ Handle Svelte events (handle_event)
✓ Push data to Svelte (push_event)
```

### Svelte Responsibilities

```
✓ ALL form UI and validation (NEVER use phx-change!)
✓ Animations and transitions
✓ Gestures (swipe, pull-to-refresh, long-press)
✓ Haptic feedback
✓ Optimistic updates
✓ Offline queuing
```

### The async_result() Helper

**Critical pattern** - Always convert AsyncResult for Svelte:

```elixir
defmodule {{modules.web_prefix}}.ChatLive do
  def mount(%{"project_id" => id}, _session, socket) do
    # CORRECT: Non-blocking async fetch
    {:ok,
      socket
      |> assign(project_id: id)
      |> assign_async(:messages, fn -> load_messages(id) end)
    }
  end

  def render(assigns) do
    ~H"""
    <.svelte
      name="ChatView"
      props={%{
        messages: async_result(@messages),
        project_id: @project_id
      }}
      socket={@socket}
    />
    """
  end

  # Convert AsyncResult to Svelte-friendly format
  defp async_result(%Phoenix.LiveView.AsyncResult{ok?: true, result: result}),
    do: %{status: "ok", data: result}
  defp async_result(%Phoenix.LiveView.AsyncResult{loading?: true}),
    do: %{status: "loading", data: nil}
  defp async_result(%Phoenix.LiveView.AsyncResult{failed?: true, failed: reason}),
    do: %{status: "error", error: inspect(reason)}
  defp async_result(_),
    do: %{status: "loading", data: nil}
end
```

### Svelte Handling Async States

```svelte
<script>
  let { messages, live } = $props();
</script>

{#if messages.status === 'loading'}
  <Skeleton variant="card" />
{:else if messages.status === 'error'}
  <EmptyState preset="error" title="Couldn't load" />
{:else if messages.data.length === 0}
  <EmptyState preset="default" title="No messages" />
{:else}
  {#each messages.data as message}
    <MessageBubble {message} />
  {/each}
{/if}
```

---

## 6. Error Handling

See `{{paths.architecture}}16-error-handling.md` for complete error flow.

### Ash Error Types -> User Messages

| Ash Error | Meaning | User Message |
|-----------|---------|--------------|
| `Ash.Error.Invalid` | Validation failed | Field-specific inline errors |
| `Ash.Error.Query.NotFound` | Resource missing | "Not found" or silent |
| `Ash.Error.Forbidden` | Policy denied | "You don't have access" |
| `Ash.Error.Framework` | Internal error | "Something went wrong" |

### Error Formatting Helper

```elixir
defmodule {{modules.web_prefix}}.ErrorHelpers do
  def format_ash_errors(%Ash.Error.Invalid{errors: errors}) do
    Enum.reduce(errors, %{}, fn error, acc ->
      case error do
        %Ash.Error.Changes.InvalidAttribute{field: field, message: msg} ->
          Map.put(acc, to_string(field), humanize_message(msg))
        %Ash.Error.Changes.Required{field: field} ->
          Map.put(acc, to_string(field), "Required")
        _ -> acc
      end
    end)
  end

  # Convert technical -> human (per docs/UX_COPY.md)
  defp humanize_message("has already been taken"), do: "Already in use"
  defp humanize_message("must have the @ sign and no spaces"), do: "Check your email"
  defp humanize_message(msg), do: msg
end
```

### LiveView Error Pattern

```elixir
def handle_event("save", params, socket) do
  case Domain.create(params, actor: socket.assigns.current_user) do
    {:ok, record} ->
      {:noreply, push_navigate(socket, to: ~p"/success")}

    {:error, %Ash.Error.Invalid{} = error} ->
      {:noreply, push_event(socket, "form:errors", %{errors: format_ash_errors(error)})}

    {:error, %Ash.Error.Forbidden{}} ->
      {:noreply, put_flash(socket, :error, "You don't have access")}

    {:error, error} ->
      Logger.error("Unexpected error", error: inspect(error))
      {:noreply, put_flash(socket, :error, "Something went wrong")}
  end
end
```

---

## 7. Store Patterns

The codebase has these stores (use them, don't recreate):

| Store | Purpose | When to Use |
|-------|---------|-------------|
| `connectionStore` | Socket connection state | Show offline indicator |
| `realtimeStore` | Sync with PubSub | Messages, live updates |
| `offlineStore` | Queue actions for retry | Save to IndexedDB when offline |
| `visibilityStore` | Page focus state | Pause animations when hidden |
| `pwaStore` | Install prompt state | Show "install app" banner |

### Custom Store Pattern

```typescript
import { writable, type Readable } from 'svelte/store';

function createCounterStore(initial = 0) {
  const { subscribe, set, update } = writable(initial);

  return {
    subscribe,  // Required for $store syntax
    increment: () => update(n => n + 1),
    decrement: () => update(n => n - 1),
    reset: () => set(initial)
  };
}

export const counter = createCounterStore();
```

---

## 8. TDD & Testing

See `{{paths.architecture}}17-testing-strategy.md` for test pyramid and E2E patterns.

### Red-Green-Refactor Cycle

```
┌─────────────────────────────────────────┐
│  1. RED: Write failing test first       │
│     - Define expected behavior          │
│     - Test should fail (proves it works)│
├─────────────────────────────────────────┤
│  2. GREEN: Minimal code to pass         │
│     - Just enough to make test green    │
│     - Don't over-engineer               │
├─────────────────────────────────────────┤
│  3. REFACTOR: Clean up                  │
│     - Remove duplication                │
│     - Improve naming                    │
│     - Tests still pass                  │
└─────────────────────────────────────────┘
```

### BDD Workflow (From Scenarios to Tests)

Before implementing a feature:

1. **Read the feature spec** at `{{paths.features}}{area}/{ID}.md`
2. **Find Acceptance Scenarios** (Given/When/Then format)
3. **Each scenario = one test** (or test group)
4. **Map Given/When/Then -> AAA pattern:**
   - Given -> Arrange (setup)
   - When -> Act (action)
   - Then -> Assert (verification)

```markdown
# Scenario from spec
#### Scenario: Send message
- **Given** user is in project chat
- **When** they type and send a message
- **Then** message appears in the list
```

```elixir
# Implemented test
test "sends message and displays in list" do
  # Given (Arrange): user in project chat
  user = insert(:user)
  project = insert(:project, participants: [user])
  {:ok, view, _} = live(conn, ~p"/projects/#{project.id}")

  # When (Act): type and send message
  view |> form("#message-form", message: %{content: "Hello"}) |> render_submit()

  # Then (Assert): message appears
  assert has_element?(view, "[data-testid='message']", "Hello")
end
```

### AAA Pattern (Arrange, Act, Assert)

```typescript
it('should increment counter when button clicked', async () => {
  // ARRANGE - Setup test conditions
  const onIncrement = vi.fn();
  render(Counter, { props: { count: 0, onIncrement } });

  // ACT - Perform the action
  await fireEvent.click(screen.getByRole('button', { name: /increment/i }));

  // ASSERT - Verify the result
  expect(onIncrement).toHaveBeenCalledOnce();
});
```

```elixir
test "creates user with valid params" do
  # Arrange
  params = %{email: "test@example.com", name: "Test"}

  # Act
  result = Accounts.create_user(params)

  # Assert
  assert {:ok, user} = result
  assert user.email == "test@example.com"
end
```

### What to Test (HIGH VALUE)

| Test This | Why |
|-----------|-----|
| State transitions | Core logic, prevents regressions |
| User interactions | Click, submit, navigate |
| Error handling | User-facing failures |
| Edge cases | null, empty, boundaries |
| API contracts | Input/output shapes |

### What NOT to Test (LOW VALUE)

| Skip This | Why |
|-----------|-----|
| CSS classes | Fragile, implementation detail |
| Third-party code | Already tested upstream |
| Private functions | Test via public API |
| Static markup | No logic to verify |

---

## 9. Code Quality Automation

### Pre-Commit Checklist

```bash
# Run before every commit
{{commands.check}}  # Runs all quality checks

# Or manually:
mix compile --warnings-as-errors  # No warnings
mix format --check-formatted      # Formatting
mix credo --strict                # Linting
mix dialyzer                      # Type checking
mix test                          # Tests pass

# Frontend
npm run lint                      # ESLint
npm run check                     # Svelte check
npm run test                      # Vitest
```

### Formatting Rules

| Tool | Purpose | Command |
|------|---------|---------|
| `mix format` | Elixir formatting | Auto on save |
| Prettier | JS/TS/Svelte | Auto on save |
| ESLint | JS/TS linting | `npm run lint` |
| Credo | Elixir linting | `mix credo` |

### Type Checking

```bash
# Elixir - Dialyzer (gradual typing via specs)
@spec create_user(map()) :: {:ok, User.t()} | {:error, Changeset.t()}
def create_user(params), do: ...

# TypeScript - Strict mode
// tsconfig.json: "strict": true
interface Props {
  variant: 'primary' | 'secondary';  // Union types
  count: number;                      // Required
  onClick?: () => void;               // Optional
}
```

---

## 10. Anti-Patterns to Avoid

> See `{{paths.architecture}}18-anti-patterns.md` for comprehensive anti-patterns across Elixir, Svelte, and PWA.

### Frontend Anti-Patterns

```typescript
// Testing implementation details
expect(component.$$.ctx[0]).toBe('value');

// Test behavior instead
expect(screen.getByText('value')).toBeInTheDocument();

// Prop drilling through many layers
<A><B><C><D data={data} /></C></B></A>

// Use stores for shared state
import { dataStore } from '$lib/stores';

// Giant components (500+ lines)
// Extract smaller, focused components
```

### CSS/Tailwind Anti-Patterns

```svelte
<!-- WRONG: Hardcoded z-index -->
<div class="z-50 z-[999]">

<!-- CORRECT: Use z-index tokens -->
<div class="z-modal z-overlay z-dropdown">

<!-- WRONG: Raw Tailwind colors -->
<div class="bg-blue-500 text-gray-600 border-slate-200">

<!-- CORRECT: Use design tokens -->
<div class="bg-primary text-muted border-border">

<!-- WRONG: Non-standard spacing -->
<div class="p-5 m-7 gap-9">

<!-- CORRECT: Use defined spacing scale -->
<div class="p-4 m-6 gap-8">  <!-- or p-6, m-8 -->

<!-- WRONG: 100vh on mobile -->
<div class="h-[100vh]">

<!-- CORRECT: Dynamic viewport height -->
<div class="h-dvh">  <!-- or min-h-screen -->

<!-- WRONG: Scroll container without overscroll -->
<div class="overflow-y-auto">

<!-- CORRECT: Prevent scroll bleed -->
<div class="overflow-y-auto overscroll-contain">
```

#### Z-Index Token Reference

| Token | Value | Use For |
|-------|-------|---------|
| `z-base` | 0 | Default content |
| `z-raised` | 10 | Cards, elevated surfaces |
| `z-dropdown` | 100 | Dropdowns, menus |
| `z-sticky` | 200 | Sticky headers |
| `z-overlay` | 300 | Overlays, backdrops |
| `z-modal` | 400 | Modals, dialogs |
| `z-popover` | 500 | Popovers, tooltips |
| `z-toast` | 600 | Toast notifications |

#### Standard Spacing Scale

Only these spacing values exist: `0`, `0.5`, `1`, `2`, `3`, `4`, `6`, `8`, `12`, `16`, `20`, `24`

```svelte
<!-- Use these -->
<div class="p-4 m-6 gap-8">

<!-- These don't exist -->
<div class="p-5 m-7 gap-9">
```

### Backend Anti-Patterns

```elixir
# Business logic in LiveView
def handle_event("submit", params, socket) do
  # 50 lines of business logic...
end

# Business logic in domain instead
def handle_event("submit", params, socket) do
  case Accounts.register_user(params) do
    {:ok, user} -> {:noreply, redirect(socket, to: ~p"/welcome")}
    {:error, error} -> {:noreply, assign(socket, :error, error)}
  end
end

# Unhandled error cases
{:ok, result} = might_fail()

# Handle all cases
case might_fail() do
  {:ok, result} -> handle_success(result)
  {:error, reason} -> handle_error(reason)
end

# Missing socket in LiveSvelte
<.svelte name="Component" props={%{data: @data}} />

# Always include socket
<.svelte name="Component" props={%{data: @data}} socket={@socket} />
```

---

## 11. Quick Reference

### Commands

```bash
# Development
{{commands.dev}}        # Start dev server
{{commands.check}}      # All quality checks
{{commands.test}}       # All tests

# Frontend (from assets/)
npm run dev           # Vite dev server
npm run test          # Vitest
npm run lint          # ESLint

# Backend
mix phx.server        # Phoenix server
mix test              # ExUnit tests
mix format            # Format code
iex -S mix            # Interactive shell
```

### Before Every Commit

- [ ] Tests pass (`{{commands.test}}`)
- [ ] No lint errors (`{{commands.check}}`)
- [ ] No type errors
- [ ] Meaningful commit message
- [ ] No console.log / IO.inspect left behind
- [ ] No hardcoded secrets or credentials
- [ ] `npm run lint:components` passes (0 errors)
- [ ] No hardcoded z-index (use z-modal, z-overlay)
- [ ] No raw Tailwind colors (use design tokens)

### Code Review Checklist

- [ ] Does it follow existing patterns?
- [ ] Is the naming clear and consistent?
- [ ] Are edge cases handled?
- [ ] Is error handling complete?
- [ ] Are there tests for new behavior?
- [ ] Is it the simplest solution that works?
- [ ] No CSS anti-patterns (z-index, colors, spacing)
- [ ] Uses design tokens (not raw Tailwind)
- [ ] Mobile layout considerations (100dvh, safe areas)
