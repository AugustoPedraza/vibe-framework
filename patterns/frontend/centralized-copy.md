# Pattern: Centralized Copy System

> Type-safe centralized management of user-facing strings with i18n-ready structure.

## Problem

User-facing text scattered across components leads to:
- Inconsistent terminology
- Difficult updates (change in multiple places)
- No i18n preparation
- Hardcoded strings that fail UX reviews

## Solution

Create a centralized copy system with:
1. TypeScript interfaces for type safety
2. Feature-specific copy files
3. Single import pattern in components
4. Structured hierarchy (feature → section → string)

## Example

### Type Definition

```typescript
// lib/copy/types.ts
export interface FeatureCopy {
  tabs: {
    home: string;
    settings: string;
  };
  home: {
    welcome: string;
    description: string;
    empty: {
      title: string;
      description: string;
    };
  };
  settings: {
    title: string;
    signOut: string;
    signingOut: string;
  };
}
```

### Copy Implementation

```typescript
// lib/copy/features/myfeature.ts
import type { FeatureCopy } from '../types';

export const myfeature: FeatureCopy = {
  tabs: {
    home: 'Home',
    settings: 'Settings',
  },
  home: {
    welcome: 'Welcome',
    description: 'Your items will appear here.',
    empty: {
      title: 'No items yet',
      description: 'Add your first item to get started.',
    },
  },
  settings: {
    title: 'Settings',
    signOut: 'Sign Out',
    signingOut: 'Signing out...',
  },
};
```

### Component Usage

```svelte
<script lang="ts">
  import { myfeature as copy } from '$lib/copy/features/myfeature';
</script>

<h1>{copy.home.welcome}</h1>
<p>{copy.home.description}</p>

{#if isEmpty}
  <EmptyState
    title={copy.home.empty.title}
    description={copy.home.empty.description}
  />
{/if}
```

## When to Use

- Any user-facing text (buttons, labels, messages)
- Empty state titles and descriptions
- Loading messages
- Error messages
- Form labels and placeholders

## When NOT to Use

- Debug/log messages (keep inline)
- Developer-facing strings
- Dynamic content from API
- Single-use strings in non-user paths

## Structure Guidelines

```
lib/copy/
├── types.ts              # All TypeScript interfaces
├── index.ts              # Re-exports
└── features/
    ├── auth.ts           # Auth feature copy
    ├── navigation.ts     # Navigation copy
    └── {feature}.ts      # Feature-specific copy
```

## Naming Conventions

- Interface names: `{Feature}Copy` (e.g., `NavigationCopy`)
- Export names: lowercase feature name (e.g., `navigation`)
- Keys: camelCase, descriptive (e.g., `signingOut`, not `loading2`)

## Tech Stack

`typescript` `svelte` `i18n-ready` `ux`

## Source

Discovered in: Syna / NAV-001
Date: 2026-01-22
