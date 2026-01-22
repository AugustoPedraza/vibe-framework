# Developer Role

> Focus: Craftsmanship, idiomatic code, industry best practices, and quality automation.

---

## Extended Thinking Triggers

> See: `roles/_shared/thinking-triggers.md` for full reference

| Phrase | When to Use |
|--------|-------------|
| `think` | Basic reasoning, simple decisions |
| `think hard` | Multiple options, trade-offs to consider |
| `think harder` | Complex refactoring, architecture decisions |
| `ultrathink` | Bootstrap patterns, foundational code that will be copied |

---

## Architecture References (READ FIRST)

> See: `roles/_shared/architecture-refs.md` for complete reference

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
| `{{paths.architecture}}/_patterns/pwa-auth.md` | PWA auth (offline, re-auth UX, session management) | Auth + PWA features |
| `{{paths.architecture}}16-error-handling.md` | Error flow | Error handling |
| `{{paths.architecture}}17-testing-strategy.md` | Test pyramid | Writing tests |
| `{{paths.architecture}}18-anti-patterns.md` | Patterns to avoid | **Always** |
| `{{paths.architecture}}19-pwa-native-experience.md` | **Pattern Catalog**: PWA patterns (form preservation, offline, gestures) | PWA features |
| `{{paths.architecture}}20-motion-system.md` | **Pattern Catalog**: Motion patterns (modal, sheet, toast animations) | Animations |
| `{{paths.architecture}}08-app-shell.md` | **Pattern Catalog**: Shell patterns (tabs, navigation, badges) | App shell work |
| `{{paths.architecture}}11-mobile-first.md` | **Pattern Catalog**: Mobile patterns (touch, swipe, haptics) | Mobile UX |
| `{{paths.architecture}}/_patterns/native-mobile.md` | **Pattern Catalog**: Native-like PWA (camera, uploads, haptics) | Native features |
| `{{paths.architecture}}/_guides/ux-design-philosophy.md` | UX principles (thumb zone, cognitive load) | Understanding design decisions |
| `{{paths.architecture}}/_guides/component-intent.md` | Component selection guidance | Choosing UI patterns |
| `{{paths.architecture}}/_guides/desktop-ux.md` | Desktop patterns (sidebar, split-pane, width constraints) | Responsive layouts |
| `{{paths.architecture}}/_patterns/adaptive-layouts.md` | Layout transformations (mobile → desktop) | Desktop adaptations |
| `{{paths.architecture}}/_guides/visual-design-system.md` | Visual polish (elevation, micro-interactions, typography) | UI polish |
| `{{paths.architecture}}/_patterns/design-tokens.md` | Design token reference (shadows, spacing, animations) | Styling consistency |

Also check `~/.claude/vibe-ash-svelte/patterns/` for reusable patterns.

---

## Vertical Slice Development (CRITICAL)

> **Build what the current feature needs, not what the architecture describes.**

Architecture docs describe the **target end state**. When implementing:

### Implementation Order

1. **Read feature spec first** - `{{paths.features}}{area}/{ID}.md`
2. **Create only what the scenario tests** - No speculative infrastructure
3. **Pull patterns from catalogs** - Architecture docs are reference catalogs, pull patterns when features need them
4. **Extend incrementally** - Add to existing code, don't pre-build

### Pattern Catalog Usage

Architecture docs (08, 11, 19, 20) are **pattern catalogs**, not build plans:
- Each pattern has a **"Use when"** trigger - check if your feature matches
- Start with **minimal implementation** - simpler is better
- Expand to **full implementation** only when needed
- Check **"What NOT to Build"** sections to avoid over-engineering

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

### Micro-Iteration Workflow (REQUIRED for Vibe Coding)

> **One baby step at a time. Verify visually. Then iterate.**

When building UI features with AI assistance, avoid implementing multiple concerns at once. Broad feedback across scrolling, navigation, format, header, etc. becomes unmanageable.

#### The Pattern

```
┌─────────────────────────────────────────┐
│  1. SINGLE FOCUS                        │
│     One concern only per iteration      │
│     Example: "Just the message bubble"  │
├─────────────────────────────────────────┤
│  2. STOP AND SHOW                       │
│     Implement minimal change            │
│     Wait for manual/visual verification │
├─────────────────────────────────────────┤
│  3. CONFIRM OR FIX                      │
│     User says "good, next" or "adjust X"│
│     No moving forward until confirmed   │
├─────────────────────────────────────────┤
│  4. ITERATE                             │
│     Move to next slice only after       │
│     previous is verified                │
└─────────────────────────────────────────┘
```

#### Example: Building a Messaging List

| Step | Focus | What Gets Built | Wait For |
|------|-------|-----------------|----------|
| 1 | Message bubble | Single hardcoded bubble | Visual check |
| 2 | Bubble variants | Sent vs received styling | Visual check |
| 3 | List container | Scroll container, multiple bubbles | Scroll test |
| 4 | Header | Chat header with back button | Visual check |
| 5 | Timestamps | Time display between messages | Visual check |
| 6 | Real data | Connect to LiveView props | Functional test |

#### Anti-Pattern: Big Bang Implementation

```
❌ DON'T: Implement header + list + scroll + format +
         navigation + timestamps all at once

   Result: "Scrolling is broken, header is wrong,
            timestamps look off, back button doesn't work"

✅ DO: One slice → verify → next slice → verify
```

#### Scoping Questions

Before implementing, ask:
- **What is the ONE thing** this iteration should accomplish?
- **How will we verify** it works? (visual check, interaction, data)
- **What are we NOT touching** yet?

#### When User Gives Broad Feedback

If feedback spans multiple concerns, **pause and scope**:

```
User: "The chat looks wrong - scrolling, bubbles, and header all need work"

Response: "Let's tackle one at a time. Which should we fix first?
1. Scrolling behavior
2. Message bubble styling
3. Header layout

Pick one and we'll verify before moving to the next."
```

---

## Refactoring Triggers

> Know when to refactor and how much thinking to apply

### Rule of Three

The fundamental rule for when to abstract:

| Occurrence | Action |
|------------|--------|
| First time | Just do it. Implement directly. |
| Second time | Note the duplication. Add a comment or TODO. |
| Third time | **Refactor.** Extract to shared module/component. |

**Don't abstract prematurely.** Duplication is better than the wrong abstraction.

### Refactoring Decision Tree

<!-- AI:DECISION_TREE refactoring_triggers -->
```yaml
refactoring_triggers:
  triggers:
    - trigger: "duplication"
      indicators:
        - ">= 3 occurrences of same code"
        - ">= 70% similarity across >= 5 lines"
      thinking_level: "think_hard"
      action: "Extract to shared module or component"
      checklist:
        - "Identify all occurrences"
        - "Ensure tests cover all uses"
        - "Extract with clear interface"
        - "Update all call sites"
        - "Run tests"

    - trigger: "long_function"
      indicators:
        - "> 25 lines"
        - "> 3 levels of nesting"
        - "> 5 local variables"
      thinking_level: "think"
      action: "Extract methods for logical sections"
      checklist:
        - "Identify logical groupings"
        - "Name extracted functions clearly"
        - "Keep original function as orchestrator"

    - trigger: "shotgun_surgery"
      indicators:
        - "Single change requires editing > 3 files"
        - "Related changes scattered across codebase"
      thinking_level: "think_harder"
      action: "Consolidate related logic"
      checklist:
        - "Map all affected files"
        - "Identify common concept"
        - "Create focused module"
        - "Move related code together"

    - trigger: "feature_envy"
      indicators:
        - "Function uses more data from other module than its own"
        - "Frequent dot chaining into other structs"
      thinking_level: "think_hard"
      action: "Move function to module that owns the data"
      checklist:
        - "Identify which module owns the data"
        - "Move function to owner module"
        - "Update callers"

    - trigger: "primitive_obsession"
      indicators:
        - "Same group of primitives passed together"
        - "Repeated validation of primitives"
      thinking_level: "think"
      action: "Create value object or struct"
      checklist:
        - "Define struct with validations"
        - "Add constructor function"
        - "Replace primitives at boundaries"

    - trigger: "speculative_generality"
      indicators:
        - "Abstractions with single implementation"
        - "Unused parameters 'for future use'"
        - "Complex inheritance with no variation"
      thinking_level: "think"
      action: "Remove unused abstraction, simplify"
      checklist:
        - "Verify no other uses exist"
        - "Inline the abstraction"
        - "Remove unused parameters"

  never_refactor_when:
    - "Under time pressure (creates bugs)"
    - "Without test coverage (unsafe)"
    - "When feature is still evolving"
    - "For aesthetic reasons only"
```
<!-- /AI:DECISION_TREE -->

### Code Smell Detection

| Smell | How to Spot | Refactoring |
|-------|-------------|-------------|
| **Long Function** | > 25 lines, needs scrolling | Extract Method |
| **Long Parameter List** | > 4 parameters | Introduce Parameter Object |
| **Duplicated Code** | Same code in 3+ places | Extract Function/Component |
| **Data Clumps** | Same 3+ fields appear together | Extract Struct |
| **Feature Envy** | Method uses other class more than own | Move Method |
| **Divergent Change** | One module changes for unrelated reasons | Split Module |
| **Shotgun Surgery** | One change touches many modules | Consolidate |
| **Dead Code** | Unreachable or unused code | Delete |
| **Speculative Generality** | "Might need later" abstractions | Inline/Remove |

### Safe Refactoring Process

```
1. VERIFY TEST COVERAGE
   - Run coverage report
   - If < 80%, write characterization tests first

2. MAKE ONE CHANGE
   - Single responsibility per commit
   - Don't mix refactoring with features

3. RUN TESTS
   - All tests must pass
   - Watch for timing-dependent failures

4. COMMIT
   - "refactor(scope): description"
   - Small, atomic commits

5. REPEAT
   - One smell at a time
   - Stop when tests green
```

### Refactoring Anti-Patterns

| Anti-Pattern | Why It's Bad | Do Instead |
|--------------|--------------|------------|
| Big Bang refactor | High risk, hard to review | Small incremental changes |
| Refactoring without tests | Can't verify correctness | Add tests first |
| Mixing refactor + feature | Unclear what changed | Separate commits |
| Premature abstraction | Wrong abstraction | Wait for Rule of Three |
| Refactoring during crunch | Bugs under pressure | Wait for calm period |

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

## 6. User Messaging & Error Handling

See `{{paths.architecture}}/_guides/user-messaging.md` for complete system.
See `{{paths.architecture}}/_patterns/errors.md` for error flow.

### User Messaging Checklist

**Copy:**
- [ ] Use Copy modules for all user-facing strings
- [ ] Backend: `import AppWeb.Copy.{Toasts, Errors, Auth}`
- [ ] Frontend: import from `$lib/copy/`
- [ ] Never hardcode strings in components

**Toasts:**
- [ ] Use `push_toast/3` for notifications (not `put_flash`)
- [ ] Types: `:success`, `:error`, `:warning`, `:info`
- [ ] Include `duration` for important messages

**Error Handling:**
- [ ] Use `ErrorHelpers.classify/1` to categorize errors
- [ ] System errors → generic message + Sentry
- [ ] User errors → specific field hints
- [ ] Auth errors → toast + redirect to login

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

## 8. Native Mobile Implementation (PWA)

> Reference: `{{paths.architecture}}/_patterns/native-mobile.md`

### Platform Check Pattern

Always check platform before using native APIs:

```typescript
// CORRECT: Check before using
if ('vibrate' in navigator) {
  navigator.vibrate(pattern);
}

// WRONG: Assume availability
navigator.vibrate(pattern); // Crashes on iOS
```

### TDD for Native Features

Native features require specific test patterns:

| Feature | Test Strategy |
|---------|---------------|
| Camera access | Mock `getUserMedia`, test permission denied |
| Upload resume | Simulate network interruption, verify recovery |
| Draft persistence | Test localStorage + IndexedDB fallback |
| Haptics | Skip on iOS (no API), test Android pattern |
| Push notifications | Mock subscription, test backend push |

### Example: Testing Upload Resume

```typescript
// tests/upload-manager.test.ts
describe('UploadManager', () => {
  it('should save progress when visibility changes to hidden', async () => {
    const manager = new UploadManager();
    const file = new Blob(['test'], { type: 'text/plain' });

    const uploadId = await manager.createUpload({ file, filename: 'test.txt' });

    // Simulate backgrounding (iOS)
    document.dispatchEvent(new Event('visibilitychange'));
    Object.defineProperty(document, 'visibilityState', { value: 'hidden' });

    const progress = manager.getProgress(uploadId);
    expect(progress.savedToStorage).toBe(true);
  });

  it('should resume from last chunk after interruption', async () => {
    // Simulate interrupted upload with 3 of 5 chunks done
    localStorage.setItem('upload_progress_123', JSON.stringify({
      id: '123',
      uploadedChunks: [0, 1, 2],
      totalChunks: 5,
      status: 'paused'
    }));

    const manager = new UploadManager();
    const progress = manager.getProgress('123');

    expect(progress.uploadedChunks.length).toBe(3);
    expect(progress.canResume).toBe(true);
  });
});
```

### Code Must Follow

- [ ] Platform check before native API use
- [ ] Graceful fallback when API unavailable
- [ ] Test covers both supported and unsupported cases
- [ ] Visual feedback backup for missing haptics
- [ ] Progress saves on visibility change (iOS backgrounding)

---

## 9. TDD & Testing

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

## 10. Documentation Guidance

**When to write documentation (and when not to).**

### DO Document

| Situation | What to Write |
|-----------|---------------|
| New public API | `@doc` with examples |
| Complex business logic | Inline comment explaining WHY |
| Breaking change | Update CHANGELOG.md |
| New pattern | Note for `/vibe retro` to capture |
| Non-obvious workaround | Comment explaining the workaround |
| External API integration | Module doc with endpoint info |

### DON'T Document

| Situation | Why |
|-----------|-----|
| Self-explanatory code | Code should be readable |
| What the code does | Code says what, comments say why |
| Every function | Only when behavior isn't obvious |
| TODOs | Use `/vibe debt` instead |

### @doc Examples (Elixir)

```elixir
@doc """
Registers a new user with email verification.

## Examples

    iex> Accounts.register_user(%{email: "test@example.com", password: "secret123"})
    {:ok, %User{}}

    iex> Accounts.register_user(%{email: "invalid"})
    {:error, %Ash.Error.Invalid{}}

## Options

  * `:skip_verification` - Skip email verification (testing only)

"""
@spec register_user(map(), keyword()) :: {:ok, User.t()} | {:error, term()}
def register_user(params, opts \\ [])
```

### Inline Comment Examples

```elixir
# GOOD - Explains why
# Rate limit requires 100ms delay between API calls per provider docs
Process.sleep(100)

# GOOD - Business rule
# Premium users get 20% discount after 2 years (per marketing Q4 2024)
discount = if user.years_active > 2, do: 0.20, else: 0.10

# BAD - Explains what (obvious from code)
# Increment counter by 1
counter = counter + 1
```

### CHANGELOG Format

When making breaking changes, update CHANGELOG.md:

```markdown
## [Unreleased]

### Breaking Changes
- `Accounts.create_user/1` now requires `name` field

### Added
- New `Accounts.verify_email/1` function

### Fixed
- Fixed race condition in session creation
```

---

## 10.5 Multi-Perspective Code Review (Optional)

For complex implementations, invoke `/vibe review` to get perspectives from multiple AI tools.

### When to Use Multi-Agent Review

| Trigger | Example |
|---------|---------|
| Multiple valid approaches | "Could use store, context, or $derived" |
| Edge cases unclear | "What happens offline? On reconnection?" |
| Bootstrap patterns | Foundational code that will be copied |
| Performance-critical | Different optimization strategies possible |

### Workflow

```
1. Add // PERSPECTIVE: markers to complex sections
2. Run /vibe review {FEATURE-ID}
3. Review in Neovim (Copilot suggestions)
4. Research in terminal (codex "prompt")
5. Evaluate all suggestions against architecture
6. Document decision in _multi_review.md
```

### Code Markers

```svelte
// PERSPECTIVE: Is there a more idiomatic Svelte 5 approach?
function handleSubmit() {
  // implementation
}

// PERSPECTIVE: Edge case - what if user is offline?
async function saveData() {
  // implementation
}
```

### Tools

| Tool | Usage | Best For |
|------|-------|----------|
| Claude | `/vibe review` | Architecture alignment, final decisions |
| Copilot | Neovim insert mode | Syntax, Svelte idioms, edge cases |
| Codex | `codex "prompt"` | Industry research, alternatives |

### Skip Multi-Agent Review For

- Simple CRUD operations
- Minor bug fixes
- Copy/style updates
- Well-established patterns

See `~/.claude/vibe-ash-svelte/roles/multi-agent-liaison.md` for full protocol.

---

## 11. Environment Variables Checklist

See `{{paths.architecture}}/_guides/environment-variables.md` for complete guide.

### When Adding/Modifying ENV Vars

- [ ] Check if new ENV var is actually needed (prefer config files for non-secrets)
- [ ] Use `System.get_env/2` with sensible default where appropriate
- [ ] Add to `.env.example` with documentation comment
- [ ] Add to `docs/ENVIRONMENT.md` with full details
- [ ] Update Environment Matrix in docs
- [ ] PR description explicitly mentions ENV changes
- [ ] Notify ops/devops if production secret needed

### Naming Convention

| Pattern | Example | Use For |
|---------|---------|---------|
| `SERVICE_KEY` | `SENTRY_DSN`, `MAILGUN_API_KEY` | Third-party credentials |
| `FEATURE_SETTING` | `POOL_SIZE`, `CACHE_TTL` | Configurable settings |
| `APP_MODE` | `PHX_SERVER`, `PHX_HOST` | Application behavior |

### Required vs Optional

```elixir
# Required - fail fast with clear error
database_url = System.get_env("DATABASE_URL") ||
  raise "DATABASE_URL environment variable is missing"

# Optional - sensible default
pool_size = String.to_integer(System.get_env("POOL_SIZE", "10"))
```

---

## 12. Code Quality Automation

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

## 13. Anti-Patterns to Avoid

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

## 14. Quick Reference

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
- [ ] ENV changes documented (`.env.example` + `docs/ENVIRONMENT.md`)

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

---

## 15. Industry Principles

> Distilled wisdom from foundational texts that complement our existing patterns.

### From Clean Code (Robert Martin)

**Function Arguments**: ≤3 arguments; more = extract object

- **Why**: Many arguments increase complexity and make testing harder
- **Apply when**: Function has 4+ parameters
<!-- AI:PRINCIPLE source="clean-code" id="function-arguments" -->

**Function Length**: If you need a comment to explain a section, extract it

- **Why**: Comments explaining code sections signal the section should be its own function
- **Apply when**: You're about to write a comment like "// Now we do X"
<!-- AI:PRINCIPLE source="clean-code" id="function-length" -->

**Command-Query Separation**: Functions either DO something OR return something, never both

- **Why**: Mixing commands and queries creates confusion about side effects
- **Apply when**: A function both changes state AND returns a value
<!-- AI:PRINCIPLE source="clean-code" id="command-query" -->

**Boy Scout Rule**: Leave code cleaner than you found it

- **Why**: Small improvements compound; entropy is the default
- **Apply when**: Touching any code, even for unrelated changes
<!-- AI:PRINCIPLE source="clean-code" id="boy-scout" -->

**Newspaper Metaphor**: High-level at top, details below

- **Why**: Readers should understand intent before implementation
- **Apply when**: Organizing functions within a module
<!-- AI:PRINCIPLE source="clean-code" id="newspaper" -->

### From Philosophy of Software Design (Ousterhout)

**Deep vs Shallow Modules**: Simple interface, complex implementation > complex interface, simple implementation

- **Why**: Interface complexity leaks everywhere; implementation complexity is contained
- **Apply when**: Designing any module, component, or API
<!-- AI:PRINCIPLE source="philosophy-software-design" id="deep-modules" -->

**Define Errors Out of Existence**: Design APIs where errors can't happen rather than handling them

- **Why**: The best error handling is avoiding errors entirely
- **Apply when**: Designing function signatures or API contracts
<!-- AI:PRINCIPLE source="philosophy-software-design" id="define-errors-out" -->

**Strategic vs Tactical**: Invest 10-20% extra time for cleaner design; tactical debt compounds

- **Why**: Quick hacks accumulate; strategic investment pays dividends
- **Apply when**: Feeling pressure to cut corners
<!-- AI:PRINCIPLE source="philosophy-software-design" id="strategic-vs-tactical" -->

**Complexity is Incremental**: Death by a thousand cuts; every "small hack" matters

- **Why**: No single decision causes complexity; the accumulation does
- **Apply when**: Justifying "just this once" shortcuts
<!-- AI:PRINCIPLE source="philosophy-software-design" id="complexity-incremental" -->

**Information Hiding**: Modules should hide complexity, not expose it

- **Why**: Internal details should never leak through interfaces
- **Apply when**: Deciding what to export from a module
<!-- AI:PRINCIPLE source="philosophy-software-design" id="information-hiding" -->

### From Pragmatic Programmer (Hunt & Thomas)

**Orthogonality**: Changes in one area shouldn't require changes elsewhere

- **Why**: Coupled code multiplies the cost of every change
- **Apply when**: A change ripples across multiple files unexpectedly
<!-- AI:PRINCIPLE source="pragmatic-programmer" id="orthogonality" -->

**Tracer Bullets**: Build thin end-to-end slices first to validate architecture

- **Why**: Early integration reveals assumptions; late integration reveals surprises
- **Apply when**: Starting a new feature or system
<!-- AI:PRINCIPLE source="pragmatic-programmer" id="tracer-bullets" -->

**Good Enough Software**: Know when to stop; perfect is enemy of shipped

- **Why**: Diminishing returns on polish; users need working software
- **Apply when**: Gold-plating beyond requirements
<!-- AI:PRINCIPLE source="pragmatic-programmer" id="good-enough" -->

**Don't Repeat Yourself**: Every piece of knowledge has a single, unambiguous representation

- **Why**: Duplicated knowledge diverges; single source stays consistent
- **Apply when**: Same logic exists in multiple places
<!-- AI:PRINCIPLE source="pragmatic-programmer" id="dry" -->

### From Refactoring (Fowler)

**When NOT to Refactor**: Don't refactor if deadline critical, code works and won't change, or rewrite is cheaper

- **Why**: Refactoring has costs; not all code deserves investment
- **Apply when**: Feeling urge to "clean up" stable code
<!-- AI:PRINCIPLE source="refactoring" id="when-not-to" -->

**Refactoring Triggers**: Long method, feature envy, data clumps, primitive obsession, divergent change

- **Why**: These code smells signal structural problems worth addressing
- **Apply when**: Code exhibits these specific patterns
<!-- AI:PRINCIPLE source="refactoring" id="triggers" -->

---

## 16. Elixir/Ash/Phoenix Principles

> Stack-specific wisdom for idiomatic, maintainable Elixir applications.

### From Elixir Best Practices

**Let It Crash**: Don't defend against every error; let supervisors handle recovery

- **Why**: Defensive coding hides bugs; crashes surface them; supervisors restart cleanly
- **Apply when**: Tempted to wrap everything in try/rescue
```elixir
# WRONG: Hiding problems
def get_user(id) do
  try do
    Repo.get!(User, id)
  rescue
    _ -> nil
  end
end

# RIGHT: Let it crash, handle at boundaries
def get_user(id), do: Repo.get(User, id)
```
<!-- AI:PRINCIPLE source="elixir-practices" id="let-it-crash" -->

**Pipelines Over Nesting**: Use |> for data transformations, not nested calls

- **Why**: Pipelines read top-to-bottom like prose; nesting reads inside-out
- **Apply when**: More than 2 function calls on the same data
```elixir
# WRONG: Nested
format(normalize(validate(params)))

# RIGHT: Pipeline
params |> validate() |> normalize() |> format()
```
<!-- AI:PRINCIPLE source="elixir-practices" id="pipelines" -->

**Pattern Match Early**: Destructure in function heads, not function bodies

- **Why**: Pattern matching in heads is declarative; guards are for constraints
- **Apply when**: Function behavior depends on input structure
```elixir
# WRONG: Conditional in body
def handle_result(result) do
  if result.ok?, do: handle_success(result), else: handle_error(result)
end

# RIGHT: Pattern match in head
def handle_result({:ok, value}), do: handle_success(value)
def handle_result({:error, reason}), do: handle_error(reason)
```
<!-- AI:PRINCIPLE source="elixir-practices" id="pattern-match-early" -->

**With for Happy Path**: Use `with` for sequential operations that can fail

- **Why**: Avoids deeply nested case statements; explicit about failure handling
- **Apply when**: Multiple operations that each return {:ok, _} or {:error, _}
```elixir
with {:ok, user} <- Accounts.get_user(id),
     {:ok, project} <- Projects.get_project(project_id),
     :ok <- Policies.can_access?(user, project) do
  {:ok, project}
else
  {:error, :not_found} -> {:error, "Resource not found"}
  {:error, :unauthorized} -> {:error, "Access denied"}
end
```
<!-- AI:PRINCIPLE source="elixir-practices" id="with-happy-path" -->

### From Ash Framework Patterns

**Actions Are Verbs**: Name actions after what they DO, not what they return

- **Why**: Actions represent domain operations; verbs communicate intent
- **Apply when**: Defining Ash actions
```elixir
# WRONG: Noun-based
actions do
  create :user_creation
  update :status_update
end

# RIGHT: Verb-based
actions do
  create :register
  update :change_status
end
```
<!-- AI:PRINCIPLE source="ash-framework" id="actions-verbs" -->

**Policies Over Callbacks**: Use Ash policies, not Phoenix plugs or manual checks

- **Why**: Policies are declarative, composable, and tested with Ash
- **Apply when**: Any authorization logic
```elixir
# WRONG: Manual check in LiveView
def handle_event("delete", _, socket) do
  if can_delete?(socket.assigns.current_user, socket.assigns.resource) do
    # ...
  end
end

# RIGHT: Policy on action
policies do
  policy action(:delete) do
    authorize_if relates_to_actor_via(:owner)
  end
end
```
<!-- AI:PRINCIPLE source="ash-framework" id="policies-over-callbacks" -->

**Calculations for Derived Data**: Use Ash calculations, not virtual fields or manual computation

- **Why**: Calculations are lazy-loaded, filterable, and cacheable
- **Apply when**: Any computed value that depends on resource data
```elixir
calculations do
  calculate :full_name, :string, expr(first_name <> " " <> last_name)
  calculate :unread_count, :integer, expr(count(messages, query: [filter: expr(not read)]))
end
```
<!-- AI:PRINCIPLE source="ash-framework" id="calculations-derived" -->

**Changesets Are Transformations**: Changesets validate AND transform; use them for both

- **Why**: Changesets are pipelines of validations and changes
- **Apply when**: Any data mutation through Ash
```elixir
create :register do
  accept [:email, :name, :password]

  change fn changeset, _ ->
    changeset
    |> Ash.Changeset.change_attribute(:email, &String.downcase/1)
    |> Ash.Changeset.change_attribute(:name, &String.trim/1)
  end
end
```
<!-- AI:PRINCIPLE source="ash-framework" id="changesets-transform" -->

### From Phoenix/LiveView Patterns

**Thin LiveViews**: LiveViews are orchestrators, not business logic containers

- **Why**: Fat LiveViews are untestable; domain logic belongs in domains
- **Apply when**: LiveView exceeds 100 lines or contains business rules
```elixir
# WRONG: Business logic in LiveView
def handle_event("submit", params, socket) do
  # 50 lines of validation and processing...
end

# RIGHT: Delegate to domain
def handle_event("submit", params, socket) do
  case Accounts.register_user(params, actor: socket.assigns.current_user) do
    {:ok, user} -> {:noreply, redirect(socket, to: ~p"/welcome")}
    {:error, error} -> {:noreply, assign(socket, :error, error)}
  end
end
```
<!-- AI:PRINCIPLE source="phoenix-liveview" id="thin-liveviews" -->

**assign_async for Data Loading**: Never block mount; use assign_async

- **Why**: Blocking mount delays first paint; async loading shows skeleton immediately
- **Apply when**: Any data fetching in mount
```elixir
# WRONG: Blocking
def mount(_, _, socket) do
  messages = Messages.list_all()  # Blocks!
  {:ok, assign(socket, messages: messages)}
end

# RIGHT: Async
def mount(_, _, socket) do
  {:ok, assign_async(socket, :messages, fn -> Messages.list_all() end)}
end
```
<!-- AI:PRINCIPLE source="phoenix-liveview" id="assign-async" -->

**push_event for Svelte**: Use push_event to communicate with Svelte components

- **Why**: push_event is the bridge between LiveView state and Svelte reactivity
- **Apply when**: LiveView needs to trigger Svelte behavior
```elixir
# Push specific events
socket |> push_event("message:sent", %{message: message})

# Update Svelte stores
socket |> push_event("store:update", %{store: "messages", data: messages})
```
<!-- AI:PRINCIPLE source="phoenix-liveview" id="push-event-svelte" -->

---

## 17. Svelte 5 Principles

> Svelte 5 runes and modern patterns for reactive, performant components.

### From Svelte 5 Runes Patterns

**$state for Local, $props for External**: Clear separation of owned vs passed data

- **Why**: Ownership clarity prevents mutation bugs and enables optimization
- **Apply when**: Declaring any reactive variable
```svelte
<script>
  // External - owned by parent
  let { items, onSelect } = $props();

  // Local - owned by this component
  let selectedIndex = $state(0);
  let isExpanded = $state(false);
</script>
```
<!-- AI:PRINCIPLE source="svelte5" id="state-props-separation" -->

**$derived for Computed Values**: Never compute in render; use $derived

- **Why**: $derived caches results; inline computation runs every render
- **Apply when**: Any value that depends on other reactive values
```svelte
<script>
  let { items, filter } = $props();

  // WRONG: Computed in template
  // {#each items.filter(i => i.active) as item}

  // RIGHT: $derived
  const filteredItems = $derived(items.filter(i => i.active));
</script>

{#each filteredItems as item}
```
<!-- AI:PRINCIPLE source="svelte5" id="derived-computed" -->

**$effect for Side Effects**: Effects run after DOM updates; don't use for derived values

- **Why**: Effects are for synchronization with external systems, not computation
- **Apply when**: Need to sync with localStorage, APIs, or other external state
```svelte
<script>
  let count = $state(0);

  // RIGHT: Sync external system
  $effect(() => {
    localStorage.setItem('count', count.toString());
  });

  // WRONG: Use $derived instead
  // $effect(() => { doubled = count * 2; });
</script>
```
<!-- AI:PRINCIPLE source="svelte5" id="effect-side-effects" -->

### From Svelte Component Patterns

**Slots Over Props for Content**: Use slots for projected content, not props

- **Why**: Slots are composable; content props create string escaping issues
- **Apply when**: Component accepts rich content
```svelte
<!-- WRONG: Content as prop -->
<Alert message="<strong>Warning</strong>: Check input" />

<!-- RIGHT: Slot -->
<Alert>
  <strong>Warning</strong>: Check input
</Alert>
```
<!-- AI:PRINCIPLE source="svelte-patterns" id="slots-over-props" -->

**Event Forwarding with Callbacks**: Use callback props, not createEventDispatcher

- **Why**: Svelte 5 prefers callback props; they're typed and explicit
- **Apply when**: Component needs to notify parent
```svelte
<script>
  // WRONG: Old dispatcher pattern
  // const dispatch = createEventDispatcher();
  // dispatch('select', item);

  // RIGHT: Callback props
  let { onSelect } = $props();

  function handleClick(item) {
    onSelect?.(item);
  }
</script>
```
<!-- AI:PRINCIPLE source="svelte-patterns" id="callback-props" -->

**CVA for Variant Styling**: Use class-variance-authority, not conditional classes

- **Why**: CVA provides type-safe variants with clear defaults
- **Apply when**: Component has multiple visual variants
```svelte
<script>
  import { cva } from 'class-variance-authority';

  const button = cva('rounded font-medium transition', {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        ghost: 'hover:bg-accent'
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6'
      }
    },
    defaultVariants: { variant: 'primary', size: 'md' }
  });
</script>

<button class={button({ variant, size })}>
```
<!-- AI:PRINCIPLE source="svelte-patterns" id="cva-variants" -->

### From Store Patterns

**Stores for Shared State**: Use Svelte stores for cross-component state

- **Why**: Stores provide reactive, subscribable state that works outside components
- **Apply when**: State needs to be shared across unrelated components
```typescript
// Factory pattern for encapsulated stores
export function createMessageStore() {
  const { subscribe, set, update } = writable<Message[]>([]);

  return {
    subscribe,
    addMessage: (msg: Message) => update(msgs => [...msgs, msg]),
    clear: () => set([])
  };
}

export const messages = createMessageStore();
```
<!-- AI:PRINCIPLE source="svelte-patterns" id="stores-shared-state" -->

**Derived Stores for Computed**: Use derived() for values computed from stores

- **Why**: Derived stores update automatically when source stores change
- **Apply when**: Computed value depends on multiple stores
```typescript
import { derived } from 'svelte/store';

export const unreadCount = derived(
  [messages, currentUser],
  ([$messages, $user]) => $messages.filter(m => !m.read && m.to === $user.id).length
);
```
<!-- AI:PRINCIPLE source="svelte-patterns" id="derived-stores" -->

---

## 18. Tailwind CSS Patterns

> Utility-first CSS patterns from official docs and Adam Wathan's philosophy.

### Utility-First Mental Model

**Separation of Concerns is About Dependency Direction**: With utilities, HTML depends on CSS (reusable); with semantic CSS, CSS depends on HTML (fragile)

- **Why**: Utilities are infinitely reusable; semantic classes couple to specific HTML structures
- **Apply when**: Deciding between utilities and custom classes
```html
<!-- WRONG: Premature abstraction for single-use element -->
<nav class="main-nav">...</nav>
<style>.main-nav { display: flex; ... }</style>

<!-- RIGHT: Utilities for single-use elements -->
<nav class="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
```
<!-- AI:PRINCIPLE source="tailwind" id="utility-first" -->

### @apply Decision Hierarchy

**Exhaust Other Options Before @apply**: utilities → loops → components → @apply (last resort)

- **Why**: @apply recreates CSS problems Tailwind solves; use it only when no component framework
- **Apply when**: Tempted to use @apply for "cleaner" code
```css
/* WRONG: Using @apply just because it "looks cleaner" */
.card { @apply rounded-lg shadow-md p-4 bg-white; }
.card-title { @apply text-xl font-bold; }

/* RIGHT: Use a Svelte component instead */
/* @apply is ONLY for simple elements when you can't use components */
```

**If You Must Use @apply**:
```css
@layer components {
  .btn-primary {
    @apply rounded-full bg-primary px-5 py-2 font-semibold text-primary-foreground;
  }
}
```
<!-- AI:PRINCIPLE source="tailwind" id="apply-hierarchy" -->

### Dynamic Class Anti-Pattern

**Never Construct Class Names Dynamically**: Tailwind purges classes it can't find as complete strings

- **Why**: `bg-${color}-500` is invisible to Tailwind's scanner; classes get purged
- **Apply when**: Styling based on props or variables
```typescript
// WRONG: Tailwind can't detect these classes (they get purged!)
const color = 'red';
<div class={`bg-${color}-500`}>

// RIGHT: Use complete class names in a map
const colorClasses = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
};
<div class={colorClasses[color]}>

// RIGHT: Or safelist if truly dynamic
// tailwind.config.js
safelist: ['bg-red-500', 'bg-blue-500', 'bg-green-500']
```
<!-- AI:PRINCIPLE source="tailwind" id="no-dynamic-classes" -->

### Group/Peer Patterns

**Group for Parent-Based Styling**: Style children based on parent state

- **Why**: Enables hover/focus effects that span multiple elements
- **Apply when**: Child elements should react to parent state
```html
<!-- Basic group -->
<div class="group rounded-lg p-4 hover:bg-accent">
  <h3 class="group-hover:text-primary">Title</h3>
  <p class="group-hover:text-muted-foreground">Description</p>
</div>

<!-- Named groups for nesting -->
<li class="group/item hover:bg-accent">
  <span class="group-hover/item:text-primary">Item</span>
  <button class="invisible group-hover/item:visible">Edit</button>
</li>
```
<!-- AI:PRINCIPLE source="tailwind" id="group-pattern" -->

**Peer for Sibling-Based Styling**: Style elements based on preceding sibling state

- **Why**: Enables form validation feedback without JavaScript
- **Apply when**: Element should react to sibling state (peer must come BEFORE)
```html
<!-- Peer MUST come before elements that reference it -->
<input type="email" class="peer" placeholder="Email" />
<p class="invisible peer-invalid:visible text-error text-sm">
  Please enter a valid email
</p>

<!-- Named peers for multiple inputs -->
<input id="draft" class="peer/draft" type="radio" name="status" />
<input id="published" class="peer/published" type="radio" name="status" />
<div class="hidden peer-checked/draft:block">Draft options...</div>
<div class="hidden peer-checked/published:block">Published options...</div>
```
<!-- AI:PRINCIPLE source="tailwind" id="peer-pattern" -->

### Arbitrary Values Guidelines

**Use Arbitrary Values for True One-Offs**: `[value]` syntax for values not in your design system

- **Why**: Avoids config bloat for single-use values; keeps design system clean
- **Apply when**: Value is genuinely one-off (positioning, calc expressions)
```html
<!-- OK: Pixel-perfect positioning, truly one-off -->
<div class="top-[117px]">

<!-- OK: calc() expressions (use _ for spaces) -->
<div class="h-[calc(100dvh_-_64px)]">

<!-- OK: CSS variables -->
<div class="bg-[var(--dynamic-color)]">

<!-- WRONG: Should be in config if used repeatedly -->
<div class="p-[13px] text-[15px] gap-[7px]">

<!-- RIGHT: Add to config for repeated values -->
/* tailwind.config.js: spacing: { 'header': '64px' } */
<div class="h-header">
```
<!-- AI:PRINCIPLE source="tailwind" id="arbitrary-values" -->

### Class Ordering Convention

**Concentric CSS Order**: Position from outside-in for scannable classes

- **Why**: Consistent ordering makes classes easier to scan and maintain
- **Apply when**: Writing any utility class string
```html
<!-- WRONG: Random ordering -->
<div class="text-white p-4 flex bg-primary rounded-lg items-center shadow-md">

<!-- RIGHT: Concentric order (outside → inside) -->
<!-- Layout → Positioning → Box Model → Borders → Background → Typography → Effects -->
<div class="flex items-center p-4 rounded-lg bg-primary text-white shadow-md">
```

**Order Reference**:
1. Layout (`flex`, `grid`, `block`)
2. Positioning (`relative`, `absolute`, `z-*`)
3. Box Model (`w-*`, `h-*`, `p-*`, `m-*`)
4. Borders (`rounded-*`, `border-*`)
5. Background (`bg-*`)
6. Typography (`text-*`, `font-*`)
7. Effects (`shadow-*`, `opacity-*`)
8. Transitions (`transition-*`, `duration-*`)
<!-- AI:PRINCIPLE source="tailwind" id="class-order" -->
