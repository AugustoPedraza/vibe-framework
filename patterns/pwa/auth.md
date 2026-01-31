# PWA Authentication Pattern

> Native-like auth experience for PWAs with offline support.

## Quick Index

| If you need... | Section |
|----------------|---------|
| Cookies vs JWT decision | [#decision-framework](#decision-framework-cookies-vs-jwt) |
| Offline auth handling | [#offline-auth-handling](#offline-auth-handling) |
| Re-auth UX pattern | [#graceful-re-authentication](#graceful-re-authentication) |
| Auth store pattern | [#auth-store-pattern](#auth-store-pattern) |
| Security checklist | [#security-checklist](#security-checklist-pwa-specific) |

---

## Decision Framework: Cookies vs JWT

### Use Cookies When (Recommended for PWA)

| Scenario | Why Cookies Win |
|----------|-----------------|
| Phoenix/LiveView stack | Native session support, no custom headers |
| Single-domain application | SameSite protection works automatically |
| Want server-side session invalidation | Database sessions allow instant revocation |
| Standard session management | 30-day sliding window is natural |
| Security priority | HttpOnly cookies prevent XSS token theft |

### Comparison Matrix

| Factor | Cookies | JWT |
|--------|---------|-----|
| **LiveView compatibility** | Native | Requires custom auth header |
| **Security** | HttpOnly, no JS access | XSS-vulnerable in localStorage |
| **Token revocation** | Instant (delete DB session) | Requires blocklist |
| **CSRF protection** | SameSite=Lax built-in | Requires custom implementation |
| **Session management** | "Logout all devices" trivial | Token rotation complexity |
| **Phoenix ecosystem** | First-class support | Plugin/middleware required |

**Recommendation**: For Phoenix/Ash PWA applications, use **cookies with database-backed sessions**.

---

## Offline Auth Handling

### What to Cache Locally

| Data | Storage | Purpose | Security |
|------|---------|---------|----------|
| Session expiry timestamp | localStorage | Check if session likely valid | Safe |
| User profile (id, name, avatar) | localStorage | Display in offline mode | Safe |
| CSRF token | Memory only | Re-auth when online | Safe |
| Session token | **HttpOnly cookie ONLY** | Authentication | NEVER in JS |

### CRITICAL: Never Cache

- Session tokens in localStorage (XSS risk)
- Passwords or credentials
- Sensitive user data (financial, health, etc.)

### Offline Behavior Matrix

| Scenario | Expected Behavior |
|----------|-------------------|
| Session valid + offline | Full functionality, queue write actions |
| Session expired + offline | Read-only mode, queue with `requiresAuth` flag |
| Reconnection + valid session | Auto-flush queue |
| Reconnection + expired session | Show re-auth modal, then flush queue |

### Session Expiry Check (Frontend)

```typescript
// Check if session is likely still valid
function isSessionLikelyValid(): boolean {
  const expiresAt = localStorage.getItem('sessionExpiresAt');
  if (!expiresAt) return false;

  const expiry = parseInt(expiresAt, 10);
  const now = Date.now();

  // Add 1 minute buffer for clock skew
  return expiry > (now + 60000);
}

// Use before allowing offline write actions
function canPerformOfflineAction(): boolean {
  return isSessionLikelyValid() || !navigator.onLine;
}
```

---

## Graceful Re-authentication

### Anti-Pattern: Hard Redirect

```
Session expires -> Redirect to /login -> User loses context
                                      -> Unsaved work lost
                                      -> Jarring experience
```

### PWA Pattern: Inline Modal

```
Session expires -> Show ReauthModal -> User re-enters credentials
                                            |
                  Context preserved -> Flush pending actions -> Continue
```

### Auth State Indicators

| State | Display | User Action |
|-------|---------|-------------|
| Authenticated + online | Normal UI | None needed |
| Authenticated + offline | "Working offline" banner | Informational |
| Session expiring soon (< 3 days) | Subtle indicator (optional) | Optional re-auth |
| Session expired + offline | "Session expired" warning | Sign in when connected |
| Session expired + online | Inline re-auth modal | Re-enter credentials |

### ReauthModal Pattern

```svelte
<!-- ReauthModal.svelte -->
<script lang="ts">
  import { Modal, Input, Button, Alert } from '$lib/components/ui';

  let { open = $bindable(false), onSuccess } = $props<{
    open: boolean;
    onSuccess?: () => void;
  }>();

  let email = $state('');
  let password = $state('');
  let error = $state<string | null>(null);
  let loading = $state(false);

  async function handleReauth() {
    loading = true;
    error = null;

    try {
      // Call LiveView event
      await live?.pushEventAsync('reauth', { email, password });
      open = false;
      onSuccess?.();
    } catch (e) {
      error = 'Wrong email or password';
    } finally {
      loading = false;
    }
  }
</script>

<Modal bind:open title="Session Expired" closeable={false}>
  <p class="text-text-muted mb-4">
    Your session has expired. Please sign in again to continue.
  </p>

  {#if error}
    <Alert variant="error" class="mb-4">{error}</Alert>
  {/if}

  <form onsubmit|preventDefault={handleReauth} class="space-y-4">
    <Input
      type="email"
      bind:value={email}
      placeholder="Email"
      autocomplete="email"
      autofocus
    />
    <Input
      type="password"
      bind:value={password}
      placeholder="Password"
      autocomplete="current-password"
    />
    <Button type="submit" {loading} class="w-full">
      Sign In
    </Button>
  </form>
</Modal>
```

---

## Auth Store Pattern

### Implementation

```typescript
// $lib/stores/auth.ts
import { writable, derived } from 'svelte/store';

const STORAGE_KEY = 'auth_state';
const EXPIRY_WARNING_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

interface AuthState {
  isAuthenticated: boolean;
  sessionExpiresAt: number | null;
  user: UserProfile | null;
}

function createAuthStore() {
  // Restore from localStorage
  const initial = loadFromStorage();
  const { subscribe, set, update } = writable<AuthState>(initial);

  // Persist on change
  subscribe(state => saveToStorage(state));

  return {
    subscribe,

    setAuthenticated(user: UserProfile, expiresAt: number) {
      set({
        isAuthenticated: true,
        sessionExpiresAt: expiresAt,
        user
      });
    },

    updateExpiry(expiresAt: number) {
      update(s => ({ ...s, sessionExpiresAt: expiresAt }));
    },

    logout() {
      set({
        isAuthenticated: false,
        sessionExpiresAt: null,
        user: null
      });
      localStorage.removeItem(STORAGE_KEY);
    }
  };
}

export const authStore = createAuthStore();

// Derived stores
export const authStatus = derived(authStore, $auth => {
  if (!$auth.sessionExpiresAt) return 'unknown';

  const now = Date.now();
  const remaining = $auth.sessionExpiresAt - now;

  if (remaining <= 0) return 'expired';
  if (remaining < EXPIRY_WARNING_MS) return 'expiring_soon';
  return 'valid';
});

export const isAuthenticated = derived(authStore, $auth => $auth.isAuthenticated);
export const currentUser = derived(authStore, $auth => $auth.user);
```

---

## Security Checklist (PWA-Specific)

### Cookie Security

- [ ] **HttpOnly** flag set (no JS access to session token)
- [ ] **Secure** flag set (HTTPS only in production)
- [ ] **SameSite=Lax** (CSRF protection)
- [ ] **30-day max_age** aligned with DB session expiry
- [ ] **Partitioned** attribute for embedded PWA contexts

### Session Management

- [ ] Session token is **32+ bytes**, cryptographically random
- [ ] Sessions stored in **database** (not just signed cookies)
- [ ] Session expiry checked on **every authenticated request**
- [ ] **Sliding window extension** implemented (7-day threshold)
- [ ] **"Logout all devices"** functionality available

### Offline Security

- [ ] Session token **NEVER** stored in localStorage
- [ ] Only **session expiry timestamp** cached locally
- [ ] User profile cached is **non-sensitive** (id, name, avatar only)
- [ ] Queued actions flagged with **requiresAuth**
- [ ] Re-auth **validates session** before flushing queue

### Re-authentication UX

- [ ] Uses **inline modal** (not page redirect)
- [ ] Preserves **user context** during re-auth
- [ ] Validates **same user** on re-auth (prevent account switching)
- [ ] Shows **clear error messages** on failure
- [ ] **Auto-focuses** email field in modal

---

## Copy Guidelines

| Scenario | User-Facing Copy |
|----------|------------------|
| Session expired | "Your session has expired. Please sign in again." |
| Re-auth success | "Welcome back!" (brief toast) |
| Re-auth failure | "Wrong email or password" |
| Different account | "Please sign in with the same account" |
| Offline + valid | "Working offline. Changes will sync when connected." |
| Offline + expired | "Session expired. Sign in when connected to sync changes." |
| Sync success | "All changes synced" (brief toast) |

---

## Related Docs

- [../pwa.md](../../anti-patterns/pwa.md) - PWA anti-patterns
