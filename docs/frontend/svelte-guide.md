# Frontend Guide (Svelte 5)

> Svelte components organized by purpose: UI (stateless) and Features (stateful).

## Quick Index

| If you need... | Section | Time |
|----------------|---------|------|
| Component structure | [#component-classification](#component-classification) | 2 min |
| Svelte 5 runes | [#svelte-5-runes](#svelte-5-runes) | 5 min |
| Props and snippets | [#props-pattern](#props-pattern) | 3 min |
| Store patterns | [#store-patterns](#store-patterns) | 3 min |
| Form pattern | [#form-pattern](#form-pattern) | 2 min |
| Page pattern | [#page-pattern](#page-pattern) | 2 min |

---

## Core Principle: Vertical Slices

> **Build components as features demand them, not upfront.**

1. **Use existing components first** - Check the UI library before creating new ones
2. **Create feature components on demand** - Only build what your feature needs
3. **Start simple, refactor later** - A working component > a perfect abstraction

---

## Component Classification

```
assets/svelte/components/
+-- ui/                           # Design System (stateless)
|   +-- primitives/               # Atoms: Button, Input, Badge
|   +-- compounds/                # Molecules: Card, FormField
|   +-- patterns/                 # Organisms: Modal, BottomSheet
|
+-- features/                     # Business Features (stateful)
    +-- auth/
    |   +-- LoginForm.svelte
    +-- {domain}/
    |   +-- {Feature}.svelte
    +-- shared/
        +-- UserAvatar.svelte
```

---

## Feature Component Organization

For features with **5+ components**, use nested folders to show composition hierarchy:

```
features/homes/
+-- HomeDetail/                   # Parent component folder
|   +-- index.svelte              # Main component (HomeDetail)
|   +-- HomeCover.svelte          # Sub-component (internal)
|   +-- HomeInfo.svelte           # Sub-component (internal)
|   +-- ProjectList.svelte        # Sub-component (internal)
|
+-- AddressDrawer/                # Another parent component
|   +-- index.svelte              # Main component (AddressDrawer)
|   +-- AddressListItem.svelte    # Sub-component (internal)
|   +-- AddressListItemSkeleton.svelte
|
+-- index.ts                      # Public exports only
```

### Why Nested Folders?

| Benefit | Explanation |
|---------|-------------|
| **Clear composition** | AI and developers see parent-child relationships |
| **Encapsulation** | Internal sub-components aren't exported |
| **Navigation** | Find related code in one place |
| **Scalability** | Features grow without becoming a flat mess |

### When to Use Nested vs Flat

| Condition | Structure |
|-----------|-----------|
| Feature has 1-4 components | Flat (all in `features/{domain}/`) |
| Feature has 5+ components | Nested (parent folders with `index.svelte`) |
| Component is reused across features | Move to `ui/` or `features/shared/` |

### Export Pattern (index.ts)

Only export components that other features need:

```typescript
// features/homes/index.ts
// Public API - only what other features import
export { default as HomeDetail } from './HomeDetail/index.svelte';
export { default as AddressDrawer } from './AddressDrawer/index.svelte';

// Internal components NOT exported:
// - HomeCover, HomeInfo, ProjectList (used only by HomeDetail)
// - AddressListItem, AddressListItemSkeleton (used only by AddressDrawer)
```

### Import Examples

```svelte
<!-- From another feature - use the public API -->
<script>
  import { HomeDetail } from '$components/features/homes';
</script>

<!-- Within the same feature folder - use relative paths -->
<script>
  // In HomeDetail/index.svelte
  import HomeCover from './HomeCover.svelte';
  import HomeInfo from './HomeInfo.svelte';
</script>
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| UI Component | `PascalCase` | `Button.svelte` |
| Feature Component | `{Feature}{Type}.svelte` | `ChatMessage.svelte` |
| Store | `{name}Store.ts` | `connectionStore.ts` |
| Type/Interface | `PascalCase` | `MessagePayload` |

---

## Svelte 5 Runes

> This project uses Svelte 5. All components MUST use runes syntax.

### State Management Primitives

| Rune | Purpose | Replaces |
|------|---------|----------|
| `$state()` | Reactive state declaration | `let x = 0` |
| `$derived()` | Computed values | `$: computed = ...` |
| `$effect()` | Side effects | `$: { sideEffect() }` |
| `$props()` | Component props | `export let prop` |
| `$bindable()` | Two-way bound props | `export let value = $bindable()` |

### State Examples

```svelte
<script lang="ts">
  // Svelte 5 - Use runes
  let count = $state(0);
  const doubled = $derived(count * 2);

  // OLD Svelte 4 - Don't use
  // let count = 0;
  // $: doubled = count * 2;
</script>
```

---

## Props Pattern

```svelte
<script lang="ts">
  // Svelte 5 props with types
  let { name, onSave, value = $bindable('') } = $props<{
    name: string;
    onSave: () => void;
    value?: string;
  }>();
</script>
```

---

## Snippets Replace Slots

Slots are deprecated in Svelte 5. Use snippets:

```svelte
<!-- OLD - Slots (deprecated) -->
<Card>
  <slot name="header" />
  <slot />
</Card>

<!-- NEW - Snippets -->
<Card>
  {#snippet header()}
    <h2>Title</h2>
  {/snippet}
  Content here
</Card>
```

In the component receiving snippets:

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';

  let { header, children }: {
    header?: Snippet;
    children?: Snippet;
  } = $props();
</script>

<div class="card">
  {#if header}
    <div class="card-header">{@render header()}</div>
  {/if}
  {@render children?.()}
</div>
```

---

## Generic Components

```svelte
<script lang="ts" generics="T">
  let { items, onSelect }: {
    items: T[];
    onSelect: (item: T) => void;
  } = $props();
</script>

{#each items as item}
  <button onclick={() => onSelect(item)}>
    Select
  </button>
{/each}
```

---

## Effect Rules

```svelte
<script lang="ts">
  // Good - Derived for transformations
  const fullName = $derived(`${firstName} ${lastName}`.trim());

  // Good - Effect for external side effects
  $effect(() => {
    document.title = `${count} items`;
  });

  // Bad - Effect for derived values
  // let fullName = $state('');
  // $effect(() => { fullName = `${firstName} ${lastName}` });
</script>
```

---

## Store Patterns

| Store | Purpose | Use Case |
|-------|---------|----------|
| `connectionStore` | Track socket state | Show offline indicator |
| `realtimeStore` | Sync with PubSub | Messages, feed items |
| `offlineStore` | Queue actions offline | PWA resilience |
| `visibilityStore` | Track page focus | Pause/resume updates |
| `pwaStore` | Install prompt state | PWA install banner |

### Store Sync Actions

| Action | Effect | Use Case |
|--------|--------|----------|
| `set` | Replace entire array | Initial load, refresh |
| `prepend` | Add to beginning | New items (posts, messages) |
| `append` | Add to end | Load more (pagination) |
| `update` | Modify matching item | Like count, status change |
| `remove` | Delete matching item | Item deleted |

### Store Usage

```typescript
import { connectionStatus, isConnected } from '$lib/stores/connection';
import { createRealtimeStore, registerStore } from '$lib/stores/realtime';
import { offlineQueue, withOfflineSupport } from '$lib/stores/offline';

// Create a real-time synced store
const feedStore = createRealtimeStore('feed', []);
registerStore(feedStore);

// Optimistic update with rollback
const { rollback, confirm } = feedStore.optimisticUpdate(itemId, { liked: true });

// Offline-aware action
const result = await withOfflineSupport('like_post', { id: 123 }, pushEvent);
```

---

## Form Pattern

```svelte
<script>
  import { FormField, Input, Button } from '$lib/components/ui';
  let name = $state('');
  let error = $state(null);
</script>

<FormField label="Full Name" {error} required>
  <Input bind:value={name} invalid={!!error} placeholder="John Doe" />
</FormField>

<Button type="submit" variant="primary">Submit</Button>
```

---

## Page Pattern

```svelte
<script lang="ts">
  import { Page, PageHeader, Section, Card, Button } from '$lib/components/ui';
</script>

<Page size="lg">
  <PageHeader title="Dashboard" description="Overview of your account">
    {#snippet actions()}
      <Button variant="primary">New Item</Button>
    {/snippet}
  </PageHeader>

  <Section title="Recent Activity">
    <Card>
      <!-- content -->
    </Card>
  </Section>
</Page>
```

---

## Component Usage

```svelte
<script>
  import { Button, Input, Card, Avatar } from '$lib/components/ui';
</script>

<Card title="User Profile">
  <Input size="md" placeholder="Name" bind:value={name} />
  <Button variant="primary" size="md">Save</Button>
</Card>
```

**Important**: Use props, not classes:

```svelte
<!-- CORRECT - Use variant/size props -->
<Button variant="danger" size="lg">Delete</Button>
<Input size="sm" invalid={hasError} />

<!-- WRONG - class prop doesn't exist -->
<Button class="mt-4 bg-red-500">Delete</Button>
```

---

## Real-time List Component

```svelte
<script>
  import { RealtimeList, TypingIndicator } from '$lib/components/ui';
  import { createPresenceStore } from '$lib';

  const presence = createPresenceStore('room:lobby');
</script>

<RealtimeList store="messages" let:item>
  <MessageBubble {item} />
</RealtimeList>

<TypingIndicator users={$presence.typingUsers} />
```

---

## Error Boundaries

```svelte
<!-- Error boundaries -->
<ErrorBoundary reportToServer>
  <RiskyComponent />
</ErrorBoundary>

<!-- Connection status indicator -->
<ConnectionStatus position="bottom-right" showOnlyWhenDisconnected />
```

---

## Related Docs

- [quickstart.md](../quickstart.md) - Core patterns
- [ash-framework.md](../backend/ash-framework.md) - Ash integration
