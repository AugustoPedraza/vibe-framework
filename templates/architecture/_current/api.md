# Current API & Routes

> Document existing routes and endpoints

## Route Overview

| Type | Count | Notes |
|------|-------|-------|
| LiveView | {count} | Main app routes |
| REST API | {count} | JSON endpoints |
| Webhooks | {count} | External callbacks |

---

## LiveView Routes

### Public Routes

| Path | Module | Description |
|------|--------|-------------|
| `/` | `PageLive` | Home page |
| `/login` | `LoginLive` | Authentication |
| `/register` | `RegisterLive` | User registration |

### Authenticated Routes

| Path | Module | Description |
|------|--------|-------------|
| `/dashboard` | `DashboardLive` | User dashboard |
| `/{feature}` | `{Feature}Live` | {description} |
| `/{feature}/:id` | `{Feature}Live.Show` | {description} |

---

## REST API Endpoints

### Authentication

| Method | Path | Controller | Action |
|--------|------|------------|--------|
| POST | `/api/session` | `SessionController` | `create` |
| DELETE | `/api/session` | `SessionController` | `delete` |

### Resources

| Method | Path | Controller | Action |
|--------|------|------------|--------|
| GET | `/api/{resource}` | `{Resource}Controller` | `index` |
| GET | `/api/{resource}/:id` | `{Resource}Controller` | `show` |
| POST | `/api/{resource}` | `{Resource}Controller` | `create` |
| PATCH | `/api/{resource}/:id` | `{Resource}Controller` | `update` |
| DELETE | `/api/{resource}/:id` | `{Resource}Controller` | `delete` |

---

## Route Migration Strategy

### Phase 1: Coexistence

New routes coexist with old:

```elixir
# router.ex
scope "/", AppWeb do
  # Legacy routes (keep working)
  live "/old-feature", OldFeatureLive

  # New Ash+Svelte routes (parallel)
  live "/new-feature", NewFeatureLive
end
```

### Phase 2: Redirect

Once migration verified, redirect old to new:

```elixir
scope "/", AppWeb do
  # Redirect old to new
  get "/old-feature", Redirect, to: "/new-feature"

  # New routes only
  live "/new-feature", NewFeatureLive
end
```

### Phase 3: Cleanup

Remove old routes and legacy code.

---

## Authentication

### Current Auth Flow

```
User -> Login Form -> {auth_module} -> Session -> Protected Routes
```

### Migration to Ash Authentication

1. Ash.Authentication for new features
2. Session compatibility layer during migration
3. Full Ash auth after migration complete

---

## Notes

- Document all routes before migration
- Use `/vibe migrate [FEATURE]` to create migration specs
- Test routes work identically before/after migration
