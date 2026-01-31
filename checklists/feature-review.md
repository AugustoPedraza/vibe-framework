# Feature Review Checklist

> Run through this before submitting code.

## Code Quality

### Backend (Elixir/Ash)

- [ ] All Ash action results are pattern-matched
- [ ] Using `assign_async` (not sync loading in mount)
- [ ] Policies defined for all resources
- [ ] Notifiers handle events appropriately
- [ ] No business logic in LiveView (belongs in Ash)
- [ ] `mix compile --warnings-as-errors` passes
- [ ] `mix credo --strict` passes

### Frontend (Svelte)

- [ ] Using Svelte 5 runes (`$state`, `$derived`, `$props`)
- [ ] Using snippets (not slots)
- [ ] `$effect` only for side effects (not derived values)
- [ ] TypeScript types defined for props
- [ ] `npm run check` passes

---

## UI/UX

### Component Usage

- [ ] Using existing UI components (not raw HTML)
- [ ] Using design tokens (not raw Tailwind colors)
- [ ] Components use props (not class overrides)

### States

- [ ] Loading state shows skeleton (not spinner)
- [ ] Error state handled with retry option
- [ ] Empty state shows helpful message
- [ ] Success feedback provided

### Accessibility

- [ ] Icon-only buttons have `aria-label`
- [ ] Form inputs have labels
- [ ] Focus visible on interactive elements
- [ ] Touch targets >= 44x44px
- [ ] Color not used alone for meaning

### Mobile

- [ ] Safe areas respected
- [ ] Keyboard doesn't cover inputs
- [ ] No horizontal scroll
- [ ] Works in landscape orientation

---

## Real-time & Offline

- [ ] PubSub subscriptions in `connected?(socket)` guard
- [ ] Optimistic updates with rollback on error
- [ ] Actions queue when offline
- [ ] Reconnection syncs state

---

## Animation

- [ ] Exit duration < enter duration
- [ ] Using motion tokens (not arbitrary values)
- [ ] `prefers-reduced-motion` respected
- [ ] All `in:` transitions have matching `out:`

---

## Testing

- [ ] Unit tests for Ash resources
- [ ] LiveView tests for user flows
- [ ] Component tests for complex UI
- [ ] E2E tests for critical paths only
- [ ] `just check` passes

---

## Security

- [ ] No sensitive data in logs
- [ ] CSRF protection on forms
- [ ] Proper authorization checks
- [ ] User input validated/sanitized

---

## Performance

- [ ] Bundle size reasonable
- [ ] Virtual list for 100+ items
- [ ] Images optimized
- [ ] No unnecessary re-renders

---

## Before Merge

- [ ] Self-reviewed changes
- [ ] Tested on mobile device/emulator
- [ ] Documentation updated if needed
- [ ] No `console.log` or `dbg()` left in code
