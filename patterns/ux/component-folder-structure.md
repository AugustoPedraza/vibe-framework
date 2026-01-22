# Pattern: Component Folder Structure

> Organize Svelte components into folders that mirror visual composition hierarchy.

---

## Problem

As Svelte 5 components grow in complexity, flat file structures become problematic:

- Hard to understand which components belong together
- Unclear parent-child relationships
- Barrel exports become unwieldy with many flat files
- Component grouping doesn't match mental model of the UI

---

## Solution

Use folder-based organization where each major UI section gets its own folder:

- **Folder name = Component name** (e.g., `MessageThread/`)
- **`index.svelte`** = Main component that orchestrates sub-components
- **Sibling files** = Sub-components, types, utilities specific to that component
- **Barrel exports** = Only export top-level folders, not internals

### Visual Composition Rule

**Folder boundaries should match what you see on screen:**
- If a component is the "page chrome" or container → folder
- If a component is a self-contained area (scroll area, sidebar, form section) → folder
- If a component is only used inside one parent → sibling file, not folder

---

## Example

```
features/
└── chat/
    ├── index.ts                    # Barrel: export { ChatPage, MessageList }
    ├── ChatPage/
    │   ├── index.svelte            # Page orchestrator
    │   ├── ChatHeader.svelte       # Header with title, tabs
    │   ├── ChatInput.svelte        # Message input form
    │   ├── ChatLoadingState.svelte # Skeleton during load
    │   └── types.ts                # ChatPage-specific types
    └── MessageList/
        ├── index.svelte            # Scrollable message area
        ├── MessageItem.svelte      # Individual message bubble
        ├── DateDivider.svelte      # "Today", "Yesterday" separators
        └── ScrollButton.svelte     # "Jump to bottom" button
```

**Barrel export (index.ts):**
```typescript
// Only export top-level components, not internals
export { default as ChatPage } from './ChatPage/index.svelte';
export { default as MessageList } from './MessageList/index.svelte';
```

**Importing internally:**
```svelte
<script lang="ts">
  // ChatPage/index.svelte imports its children
  import ChatHeader from './ChatHeader.svelte';
  import ChatInput from './ChatInput.svelte';
  import MessageList from '../MessageList/index.svelte';
</script>
```

---

## When to Use

- Component has 3+ sub-components
- Component represents a distinct visual region (page, panel, section)
- Sub-components are only used within this parent
- You want test file structure to mirror component structure

---

## When NOT to Use

- Simple components with 1-2 files (keep flat)
- Utility components shared across many parents
- Components that are truly standalone (Button, Input, etc.)

---

## Variations

- **Test mirroring**: Tests folder structure mirrors component folders
  ```
  tests/unit/components/features/chat/
  ├── ChatPage/
  │   └── ChatPage.test.ts
  └── MessageList/
      └── MessageList.test.ts
  ```

- **Collocated types**: Put types.ts in the folder when types are component-specific

---

## Tech Stack

`svelte5` `typescript` `component-architecture` `organization`

---

## Related Patterns

- [Motion Presets](./motion-presets.md) - Animation tokens for consistent UI motion
- [Async Media Loading](../frontend/async-media-loading.md) - Image loading in components

---

## Source

- **Discovered in**: Syna / CONV-002
- **Date**: 2026-01-22
- **Original file**: `assets/svelte/components/features/conversations/`
