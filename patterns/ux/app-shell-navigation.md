# Pattern: App Shell Navigation

> Mobile-first application shell with bottom tab bar navigation and responsive layout.

## Problem

Mobile PWA apps need a native-feeling navigation experience with:
- Bottom tab bar for primary destinations
- Consistent header/content/footer structure
- Safe area handling for notched devices
- Responsive adaptation for larger screens

## Solution

Create an AppShell wrapper component that:
1. Provides consistent layout structure
2. Renders bottom tab bar with active state
3. Handles safe area insets
4. Supports notification badges
5. Shows user avatar in profile tab

## Example

```svelte
<script lang="ts">
  import { BottomTabBar, Avatar } from '$components/ui';
  import { Home, Users, Bell } from '@lucide/svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    currentRoute: string;
    notificationBadge?: number;
    currentUser?: { initials: string; avatarUrl?: string | null } | null;
    children?: Snippet;
  }

  let { currentRoute, notificationBadge = 0, currentUser = null, children }: Props = $props();

  // Map routes to tab IDs
  const activeTab = $derived(() => {
    if (currentRoute.startsWith('/dashboard')) return 'dashboard';
    if (currentRoute.startsWith('/items')) return 'items';
    if (currentRoute.startsWith('/notifications')) return 'notifications';
    if (currentRoute.startsWith('/profile')) return 'profile';
    return 'dashboard';
  });

  const tabs = $derived([
    { id: 'dashboard', label: 'Dashboard', icon: homeIcon },
    { id: 'items', label: 'Items', icon: itemsIcon },
    { id: 'notifications', label: 'Alerts', icon: bellIcon, badge: notificationBadge },
    { id: 'profile', label: 'Profile', icon: profileIcon },
  ]);

  function handleTabSelect(tabId: string) {
    window.location.href = `/${tabId}`;
  }
</script>

{#snippet profileIcon()}
  <Avatar size="xs" initials={currentUser?.initials || '?'} src={currentUser?.avatarUrl} />
{/snippet}

<div class="flex flex-col min-h-dvh bg-background">
  <main class="flex-1 flex flex-col pb-14">
    {@render children?.()}
  </main>

  <div class="fixed bottom-0 inset-x-0 z-sticky">
    <BottomTabBar {tabs} activeTab={activeTab()} onSelect={handleTabSelect} />
  </div>
</div>
```

## When to Use

- Mobile-first PWA with 3-5 primary destinations
- Apps requiring persistent bottom navigation
- When user avatar should appear in navigation
- Apps with notification badge requirements

## When NOT to Use

- Desktop-only applications (use sidebar instead)
- Single-page apps without navigation needs
- Apps with more than 5 primary destinations
- When deep navigation hierarchy is needed

## Integration Notes

1. **LiveView/LiveSvelte**: Pass `currentRoute` from LiveView assigns
2. **Safe Areas**: Use `z-sticky` token for proper layering
3. **Content Padding**: Main content needs `pb-14` to clear tab bar
4. **Responsive**: Consider hiding bottom bar on desktop (>840px)

## Tech Stack

`svelte5` `tailwind` `mobile-first` `pwa` `navigation`

## Source

Discovered in: Syna / NAV-001
Date: 2026-01-22
