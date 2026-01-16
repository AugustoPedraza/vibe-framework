# UX/PWA Verification Checklist

> Use this checklist during Designer phase and QA validation

---

## Mobile-First (Required)

- [ ] Touch targets >= 44x44px
- [ ] Safe area insets respected (notch, home indicator)
- [ ] Virtual keyboard doesn't cover inputs
- [ ] Responsive from 320px to 1440px
- [ ] No horizontal scroll on mobile

---

## Loading States (Required)

- [ ] Skeleton loaders (no spinners)
- [ ] 0-100ms: Show nothing
- [ ] 100-300ms: Button spinner only
- [ ] 300ms+: Full skeleton
- [ ] Optimistic updates where appropriate

---

## Error States (Required)

- [ ] User-friendly error messages (not technical)
- [ ] Retry action available
- [ ] Error boundary for component crashes
- [ ] Inline field errors (not alerts)

---

## Empty States (Required)

- [ ] Helpful message explaining what to do
- [ ] Action button if applicable
- [ ] Illustration optional
- [ ] No "No data" or "null" text

---

## Offline (If PWA)

- [ ] App shell cached
- [ ] Offline indicator visible
- [ ] Actions queued when offline
- [ ] Graceful sync on reconnect
- [ ] No errors when offline

---

## Gestures (If Mobile)

- [ ] Pull-to-refresh on lists
- [ ] Swipe actions where natural
- [ ] Long-press for context menus
- [ ] Haptic feedback on key actions

---

## Animation (If Animated)

- [ ] Uses motion tokens (not custom durations)
- [ ] Respects `prefers-reduced-motion`
- [ ] Spring physics for interactive elements
- [ ] No janky transitions
- [ ] Exit duration <= Enter duration

---

## Accessibility (Required)

- [ ] All images have alt text
- [ ] Icon buttons have aria-label
- [ ] Focus visible on interactive elements
- [ ] Color contrast >= 4.5:1
- [ ] Screen reader tested
- [ ] Keyboard navigation works
- [ ] Color is not sole indicator

---

## Copy Standards (Required)

- [ ] No developer-style messages
- [ ] Positive framing (what TO DO)
- [ ] Specific and brief (5-7 words)
- [ ] Human-friendly tone

---

## Design Tokens (Required)

- [ ] No raw Tailwind colors (bg-blue-500)
- [ ] Uses design tokens (bg-primary, text-muted-foreground)
- [ ] Foreground tokens for colored backgrounds (text-error-foreground)
- [ ] Disabled tokens for form elements (bg-disabled, text-disabled-foreground)
- [ ] No hardcoded z-index (use z-modal, z-overlay)
- [ ] Standard spacing scale only

---

## Alignment (Pixel-Perfect)

- [ ] Input addons use Pattern 3 (inset-y-0 flex items-center), NOT transforms
- [ ] Icons in flex containers have `shrink-0`
- [ ] No arbitrary margins for alignment (only `mt-0.5` with documented reason)
- [ ] Consistent gap values based on size scale
- [ ] Badges use Pattern 4 (negative positioning)
- [ ] Buttons use Pattern 5 (inline-flex items-center justify-center)
