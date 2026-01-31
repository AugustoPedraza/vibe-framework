# Responsibility Matrix

> Who owns what: Backend vs Frontend

## Quick Index

| If you need... | Section | Time |
|----------------|---------|------|
| Quick ownership lookup | [#ownership-table](#ownership-table) | 1 min |
| What LiveView does | [#liveview-does](#what-liveview-does) | 1 min |
| What LiveView doesn't do | [#liveview-doesnt](#what-liveview-does-not-do) | 1 min |
| What Svelte does | [#svelte-does](#what-svelte-does) | 1 min |

---

## Ownership Table

| Concern | LiveView (Backend) | Svelte (Frontend) |
|---------|-------------------|-------------------|
| **Routing** | `live_action`, URL | - |
| **Auth** | `on_mount`, session | - |
| **Data fetching** | `handle_params`, `assign_async` | - |
| **Business logic** | Ash actions, policies | - |
| **Real-time** | PubSub subscribe/broadcast | Store updates |
| **Form UI** | - | All form rendering |
| **Validation UI** | - | Instant feedback |
| **Animations** | - | Svelte transitions |
| **Gestures** | - | Touch handlers |
| **Offline** | - | Queue + sync |
| **CRUD operations** | Mutations, policies | Forms, optimistic updates |

---

## What LiveView Does

```
Routing via live_action
Auth gates via on_mount
Data fetching in handle_params
PubSub subscriptions
handle_event for Svelte submissions
push_event to send data to Svelte
push_navigate for navigation
```

---

## What LiveView Does NOT Do

> See [quickstart.md](./quickstart.md#anti-patterns) for rationale

- `phx-change` on form inputs
- Client-side validation (Svelte handles)
- UI state management (Svelte stores)
- Animations/transitions (Svelte)

---

## What Svelte Does

```
Form rendering and validation
Instant validation feedback
Animations and transitions
Touch gestures (swipe, pull-to-refresh)
Haptic feedback
Optimistic updates with rollback
Offline queue management
Tab bar and navigation UI
```

---

## Event Flow

```
User Action -> Svelte Component -> pushEvent() -> LiveView handle_event
                                                      |
                                              Ash Action
                                                      |
                                              Notifier (PubSub)
                                                      |
LiveView handle_info <- PubSub Broadcast
        |
push_event() -> Svelte Store Update -> UI Re-render
```

---

## Related Docs

- [quickstart.md](./quickstart.md) - Core decisions
- [backend/ash-framework.md](./backend/ash-framework.md) - Ash patterns
- [frontend/svelte-guide.md](./frontend/svelte-guide.md) - Svelte patterns
