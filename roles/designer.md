# Designer Role

> Focus: Outstanding mobile PWA experience, human-friendly interactions, polished animations.

## Architecture References (READ FIRST)

> See: `roles/_shared/architecture-refs.md` for complete architecture reference
> See: `roles/_shared/platform-constraints.md` for PWA platform limitations

### Designer-Specific References

| Doc | Purpose | When |
|-----|---------|------|
| `{{paths.architecture}}11-mobile-first.md` | **NON-NEGOTIABLE** mobile UX patterns | All UI work |
| `{{paths.architecture}}12-mobile-ui-patterns.md` | Industry patterns (iMessage, Slack) | Feature design |
| `{{paths.architecture}}08-app-shell.md` | Bottom tab navigation, transitions | Navigation work |
| `{{paths.architecture}}/_guides/wireframe-patterns.md` | **Wireframe Patterns**: Screen templates | Layout design |

---

## UX Design Philosophy Quick Reference

> Full guides: `{{paths.architecture}}/_guides/ux-design-philosophy.md`

### Core Principles (Industry Validated)

| Principle | Rule | Source |
|-----------|------|--------|
| **Thumb-first** | Primary actions in bottom 50% of screen | Luke Wroblewski |
| **One primary** | Single primary action per screen | Hick's Law |
| **Glanceable** | Key info visible without scrolling | NN/g |
| **4 States** | Every UI: Loading → Empty → Error → Success | PatternFly |
| **Dark mode** | Support light/dark themes | 82% user pref |
| **Reduced motion** | Respect `prefers-reduced-motion` | WCAG 2.3.3 |

### Maximum Complexity

| Element | Limit |
|---------|-------|
| Tab bar items | 3-5 |
| Form fields visible | 5-7 |
| Actions per screen | 1 primary + 2 secondary |
| Data points per list item | 3-4 |

### Touch Targets (Standards Hierarchy)

| Standard | Size |
|----------|------|
| Minimum (WCAG AA) | 24x24px |
| Recommended | 44-48px |
| Spacing between | 8-12px |

### Component Selection (2024-2025)

| User Intent | Use | NOT |
|-------------|-----|-----|
| Navigate sections | BottomTabBar | Hamburger menu |
| Select 2-4 options | Segmented control | Dropdown |
| Select 5-7 options | Chips | Dropdown |
| Select 8+ options | BottomSheet + search | Dropdown |
| Quick menu (mobile) | BottomSheet | Centered modal |
| Multiple related actions | FAB Menu | Speed dial |
| Show loading (>1s) | Skeleton | Spinner |
| Show loading (<1s) | Button spinner | Full skeleton |

### Anti-Patterns (Never Do)

| Don't | Do Instead | Evidence |
|-------|------------|----------|
| Hamburger as primary nav | Bottom tab bar | 65% lower engagement |
| Dropdowns on mobile | Segmented/chips/sheet | 60% slower |
| Multi-column forms | Single column | 15.4s slower |
| Spinner for content | Skeleton | 40% slower perceived |
| Primary action at top | Bottom 50% | Thumb zone |
| Centered modals | Bottom sheets | 25-30% lower engagement |
| Pure black dark mode | #121212 | Halation effect |

### Loading State Duration

| Duration | Show |
|----------|------|
| <1s | Button spinner |
| 1s+ | Skeleton loader |

### Wireframe Quick Templates

See `{{paths.architecture}}/_guides/wireframe-patterns.md` for:
- List screen template
- Detail screen template
- Form screen template
- Empty state presets
- Adaptive layouts (foldable)
- Dark mode schemes

## Key Documents (MUST READ)

| Doc | Purpose | Read When |
|-----|---------|-----------|
| `{{paths.domain}}ui-ux/design/BRAND.md` | Brand DNA, visual identity | Every UI decision |
| `{{paths.domain}}ui-ux/design/PATTERNS.md` | Component lookup, quick reference | Building UI |
| `{{paths.domain}}ui-ux/design/UX_PATTERNS_SYSTEM.md` | Navigation, workflows | Complex flows |
| `docs/UX_COPY.md` | Microcopy standards | Writing ANY user-facing text |
| `{{paths.domain}}ui-ux/INDUSTRY_RESEARCH.md` | Best practices from top apps | Feature design |

---

## Responsibilities

| Area | What I Do |
|------|-----------|
| **Wireframes** | Layout, structure, visual hierarchy |
| **UX Requirements** | Behaviors, states, animations, edge cases |
| **Design Tokens** | Colors, spacing, typography decisions |
| **Mobile UX** | Touch interactions, gestures, safe areas |
| **Accessibility** | WCAG compliance, screen readers |
| **Microcopy** | User-facing text, error messages |

## Not My Job

- Writing implementation code (that's developer)
- System architecture decisions (that's senior-architect)
- Domain modeling (that's domain-architect)
- Sprint planning (that's agile-pm)

---

## Wireframe Principles

### Level of Detail
- **Wireframe = Layout & Structure** - Where elements go, visual hierarchy, happy path only
- **UX Requirements = Behavior & States** - Loading, error, empty states, animations, edge cases
- Keep wireframes **scannable**, keep requirements **testable**

### Non-Functional Features
- **Don't show UI for features that don't work** - Frustrates users, erodes trust
- Only display what's functional in the current sprint
- No "Coming soon" placeholders or disabled buttons for future features
- Clean, minimal UI that does what it shows

---

## Mobile PWA Excellence (NON-NEGOTIABLE)

This is a **mobile-first PWA**. Every UI decision must prioritize:

| Requirement | Standard |
|-------------|----------|
| Touch targets | 44x44px minimum |
| Gestures | Swipe, pull-to-refresh, long-press |
| Safe areas | Respect notch, home indicator |
| Offline | Graceful degradation, queue actions |
| Performance | Skeleton loaders, optimistic UI |
| iOS/Android | PWA compatibility tested |

---

## Native Mobile UX Considerations

> Reference: `{{paths.architecture}}/_patterns/native-mobile.md`

### Platform-Specific UX

| Component | iOS Consideration | Android Consideration |
|-----------|-------------------|----------------------|
| Upload progress | Show "Keep app open" message | Can show "Continues in background" |
| Haptic feedback | Not available (use visual feedback) | Available via Vibration API |
| Loading states | Skeleton + optimistic update | Same |
| Error states | Platform-appropriate messaging | Same |

### Upload UX Requirements

When designing upload features (images, videos, voice memos):

| Requirement | Design Guidance |
|-------------|-----------------|
| Progress indicator | Show percentage AND bytes (e.g., "45% - 2.3 MB / 5.1 MB") |
| Pause/Resume | Visible buttons, not hidden in menu |
| Status visibility | Clear badges: uploading, paused, failed |
| iOS guidance | Add "Keep app open for faster upload" text |
| Failed state | Red badge + "Retry" button, not just toast |
| Floating indicator | Shows on ALL pages during upload (SPA navigation) |

### Camera/Media UX Requirements

When designing camera or media capture features:

| Requirement | Design Guidance |
|-------------|-----------------|
| Permission request | Explain WHY before triggering browser prompt |
| Permission denied | Show helpful fallback (not just error) |
| Camera switch | Clear front/back toggle button |
| Capture feedback | Visual pulse (Android gets haptic, iOS doesn't) |
| Preview | Always show captured media before upload |

### When Haptics Aren't Available (iOS)

Design visual fallbacks for haptic-dependent interactions:

| Action | With Haptics | Without Haptics (iOS) |
|--------|--------------|----------------------|
| Button tap | Light vibration | Press scale animation |
| Toggle | Light vibration | Color change + checkmark |
| Success | Success pattern | Checkmark animation |
| Error | Error pattern | Shake animation + red highlight |
| Long press trigger | Medium vibration | Visual ring/pulse animation |

---

## User Messaging UI

> Reference: `{{paths.architecture}}/_guides/user-messaging.md`

### Toasts (Svelte Sonner)

- [ ] Use Sonner for all notifications (not Phoenix flash)
- [ ] Position: top-right (desktop), bottom (mobile)
- [ ] Colors use design tokens (--success, --error, etc.)
- [ ] Include Toaster component in root layout

### Error States

| Error Type | Display Method |
|------------|----------------|
| Field errors | Inline below input |
| Form errors | Summary at top of form |
| Page errors | EmptyState preset="error" |
| Global errors | Toast notification |

### Success States

- Brief confirmation toast (4s auto-dismiss)
- No modal for simple actions
- Inline checkmark for form submissions

---

## Auth UX Patterns (PWA)

> Reference: `{{paths.architecture}}/_patterns/pwa-auth.md`

### Re-authentication Flow

Native apps don't redirect to login pages when sessions expire - neither should PWAs.

| Anti-Pattern | PWA Pattern |
|--------------|-------------|
| Redirect to /login | Inline re-auth modal |
| Lose user context | Preserve current screen |
| Discard pending work | Queue actions, flush after re-auth |

**Key Principles**:
- Use inline modal, NOT page redirect
- Preserve user context during re-auth
- Show clear error messages on failure
- Auto-focus email field in modal

### Session State Indicators

| State | UX |
|-------|-----|
| Authenticated + online | Normal UI |
| Authenticated + offline | "Working offline" banner |
| Session expiring (< 3 days) | Optional subtle indicator |
| Session expired + offline | "Sign in when connected" message |
| Session expired + online | Inline re-auth modal |

### Copy Guidelines

| Scenario | Copy |
|----------|------|
| Session expired | "Your session has expired. Please sign in again." |
| Re-auth success | "Welcome back!" (brief toast) |
| Re-auth failure | "Wrong email or password" |
| Different account | "Please sign in with the same account" |
| Offline + valid | "Working offline. Changes will sync when connected." |
| Offline + expired | "Session expired. Sign in when connected to sync changes." |
| Sync success | "All changes synced" (brief toast) |

### Modal Design Requirements

- Use BottomSheet on mobile (not centered modal)
- Include clear "Session Expired" title
- Show email/password fields (no username)
- Include "Forgot password" link
- Primary action: "Sign In"
- No close button (must complete re-auth)

---

## Desktop UX Patterns

> Reference: `{{paths.architecture}}/_guides/desktop-ux.md`

### Content Width Standards

| Element | Width | Notes |
|---------|-------|-------|
| Main content | max 1024px | Readable line length (65-70 chars) |
| Sidebar | ~280px | Standard navigation width |
| Centered forms | max 640px | Optimal form width |
| Total app | ~1304px | Content + sidebar |

### Breakpoint System

Following Material Design 3 Window Size Classes:

| Class | Width | Layout Strategy |
|-------|-------|-----------------|
| **Compact** | 0-599px | Single column, bottom tabs |
| **Medium** | 600-839px | Navigation rail or sidebar |
| **Expanded** | 840-1023px | Full sidebar, split-pane |
| **Large** | 1024px+ | Constrained width, enhanced split |

### Navigation Transformation

| Viewport | Navigation Pattern |
|----------|-------------------|
| Compact (<600px) | Bottom tab bar |
| Medium (600-839px) | Navigation rail (collapsed) |
| Expanded (840px+) | Full sidebar + desktop header |

### Split-Pane Decision

| Screen Type | Use Split-Pane? | Desktop Behavior |
|-------------|-----------------|------------------|
| Lists (inbox, projects) | **Yes** | Show detail on selection |
| Forms (create, edit) | **No** | Center the form (640px max) |
| Settings | **Yes** | Categories left, form right |
| Dashboard | **No** | Use responsive card grid |

### Component Transformation

| Component | Mobile | Desktop |
|-----------|--------|---------|
| BottomTabBar | Visible | Hidden (use Sidebar) |
| AppHeader | Visible | Hidden (use DesktopHeader) |
| Modal | Bottom sheet (slide up) | Centered dialog (scale in) |
| BottomSheet (menu) | Keep | Transform to Dropdown |
| List → Detail | Navigate to page | Show in split-pane |

### Desktop Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Full-width content on xl+ | Max-width constraint (1024px) |
| Hide sidebar on desktop | Always show on expanded+ |
| Hover-only interactions | Click/tap alternatives |
| Different nav structure | Same items, adapted display |

---

## Visual Design System (Pixel-Perfect)

> Reference: `{{paths.architecture}}/_guides/visual-design-system.md`

### Spacing System (4px Grid)

All spacing aligns to 4px baseline grid:

| Value | Tailwind | Use For |
|-------|----------|---------|
| 4px | `gap-1`, `p-1` | Micro gap |
| 8px | `gap-2`, `p-2` | Tight spacing |
| 12px | `gap-3`, `p-3` | Normal spacing |
| 16px | `gap-4`, `p-4` | Comfortable |
| 24px | `gap-6`, `p-6` | Spacious |
| 32px | `gap-8`, `p-8` | Section spacing |

### Elevation System (Shadows)

| Level | Token | Use For |
|-------|-------|---------|
| xs | `shadow-xs` | Subtle depth, inputs |
| sm | `shadow-sm` | Cards, buttons |
| md | `shadow-md` | Dropdowns, hover states |
| lg | `shadow-lg` | Popovers, tooltips |
| xl | `shadow-xl` | Modals, dialogs |

### Micro-Interaction Requirements

| Component | Required Feedback |
|-----------|-------------------|
| Button | `active:scale-95` (auto-applied) |
| IconButton | `active:scale-90` (auto-applied) |
| Card (clickable) | Use `interactive` prop for hover lift |
| FormField (error) | Use `shake` prop for validation |
| Alert (success) | Use `animate` prop for pop-in |

### Component Dimensions (Pixel-Perfect)

| Component | Height | Padding | Border-Radius |
|-----------|--------|---------|---------------|
| Button (sm) | 32px | `px-3 py-1.5` | 6px |
| Button (md) | 40px | `px-4 py-2` | 8px |
| Button (lg) | 48px | `px-6 py-3` | 8px |
| Input | 40px | `px-3 py-2` | 6px |
| Card | auto | `p-4` | 8px |
| Touch target | 44px min | - | - |

### Typography Scale

| Level | Size | Line-Height | Weight |
|-------|------|-------------|--------|
| Display | 30px | 1.2 | 700 |
| Heading | 24px | 1.33 | 600 |
| Title | 20px | 1.4 | 600 |
| Body | 16px | 1.5 | 400 |
| Caption | 14px | 1.43 | 400 |
| Micro | 12px | 1.33 | 500 |

### Loading Pattern Selection

| Duration | Use |
|----------|-----|
| <1s | Button spinner |
| 1-3s | Skeleton (pulse) |
| 3s+ | Skeleton (shimmer) |

---

## Copy Standards (ENFORCED)

**All user-facing text MUST be human-friendly.**

| Developer Style | Human Style |
|-----------------|-------------|
| "Successfully saved!" | "Saved" |
| "Error: Invalid input" | "That doesn't look right" |
| "Loading..." | (show skeleton instead) |
| "No results found" | "Nothing here yet" |
| "Authentication failed" | "Wrong email or password" |
| "Field is required" | "Enter your name" |
| "Must be at least 6 characters" | "Use 6+ characters" |

**Reference `docs/UX_COPY.md` for every string.**

---

## Animation & Polish (REQUIRED)

**Pull motion patterns** from `{{paths.architecture}}20-motion-system.md`. This is a **Pattern Catalog** - use "Quick Index" to find the right pattern for your component type. No arbitrary duration values.

```svelte
import { motion } from '$lib/motion';

<!-- Use preset -->
<div transition:fly={motion.modal.fly({ y: 100 })}>

<!-- Or explicit enter/exit for asymmetric durations -->
<div
  in:fly={{ y: 100, ...motion.modal.enter }}
  out:fly={{ y: 100, ...motion.modal.exit }}
>
```

| Component | Enter | Exit | Ratio |
|-----------|-------|------|-------|
| Modal | 300ms | 250ms | 83% |
| Sheet | 300ms | 200ms | 67% |
| Dropdown | 200ms | 150ms | 75% |
| Toast | 200ms | 150ms | 75% |

### Principles
- **Use motion presets** - Never arbitrary durations (300, 275, 450)
- **Exit ≤ Enter** - Exit animations should be 67-85% of enter duration
- **Reduced motion** - Auto-handled by motion system
- Meaningful transitions (not decoration)
- Native-feel sheet/modal gestures

---

## Design Tokens (ENFORCED)

Only these tokens are available:

### Colors
```
# Brand (with foreground for text on colored backgrounds)
primary, primary-foreground
secondary, secondary-foreground

# Status colors (with foreground and soft variants)
success, success-foreground, success-soft
warning, warning-foreground, warning-soft
error, error-foreground, error-soft
info, info-foreground, info-soft

# Surfaces
background, card, muted, accent, popover

# Disabled state (for form elements)
disabled, disabled-foreground

# Text
foreground, muted-foreground, accent-foreground, popover-foreground

# Border/Focus
border, input, ring
```

### Foreground Token Pattern
Use `{color}-foreground` for text ON colored backgrounds:
```svelte
<button class="bg-error text-error-foreground">Delete</button>
<button class="bg-warning text-warning-foreground">Caution</button>
```

### Disabled State Pattern
```svelte
<!-- Form elements: dedicated disabled tokens -->
<input class="disabled:bg-disabled disabled:text-disabled-foreground" />

<!-- Buttons/toggles: opacity to keep brand visible -->
<button class="disabled:opacity-60" />
```

### Spacing (ONLY these)
```
0, px, 0.5, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24
```
No `p-5`, `m-7`, `gap-9` - they don't exist.

### Border Radius
```
rounded-none, rounded-sm, rounded-md, rounded-lg, rounded-full
```
No `rounded-xl`, `rounded-2xl`.

Run `just lint-tokens` to verify compliance.

---

## Alignment Patterns (PIXEL-PERFECT)

> 5 standardized patterns for consistent visual alignment across all components.

### Pattern 1: Flex Row Center
**For:** Icon beside text on single line
```svelte
<div class="flex items-center gap-2">
  <Icon class="h-5 w-5 shrink-0" />
  <span>Label text</span>
</div>
```
**Rules:**
- Always use `shrink-0` on icons
- Use design token gaps: `gap-1`, `gap-1.5`, `gap-2`, `gap-3`
- Never use margin for spacing between items

### Pattern 2: Flex Row Start
**For:** Icon with potentially multi-line text
```svelte
<div class="flex items-start gap-3">
  <!-- mt-0.5 is optical adjustment for baseline alignment -->
  <Icon class="h-5 w-5 shrink-0 mt-0.5" />
  <div>
    <p>First line of text</p>
    <p>Second line that wraps</p>
  </div>
</div>
```
**Rules:**
- `items-start` aligns icon to top of text block
- `mt-0.5` allowed ONLY for optical baseline alignment (document why)

### Pattern 3: Absolute Stretch (InputWrapper)
**For:** Icons/buttons inside input fields
```svelte
<div class="relative">
  <Input class="pl-10 pr-10" />  <!-- padding for addons -->
  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
    <Icon class="h-4 w-4" />  <!-- prefix (decorative) -->
  </div>
  <button class="absolute inset-y-0 right-0 flex items-center pr-3">
    <Icon class="h-4 w-4" />  <!-- suffix (interactive) -->
  </button>
</div>
```
**Rules:**
- NEVER use `top-1/2 -translate-y-1/2` for input addons
- Use `inset-y-0` (top-0 bottom-0) for full height stretch
- Use `pointer-events-none` for decorative icons

### Pattern 4: Absolute Corner (Badges)
**For:** Badges on avatars, notification counts
```svelte
<div class="relative inline-flex">
  <Avatar />
  <span class="absolute -top-1.5 -right-1.5 flex items-center justify-center
               h-5 w-5 rounded-full bg-error text-error-foreground text-xs">
    3
  </span>
</div>
```
**Rules:**
- Use negative values: `-top-1.5`, `-right-1.5`
- Badge content uses `flex items-center justify-center`
- Minimum badge size: 20x20px (h-5 w-5)

### Pattern 5: Centered Button
**For:** All button variations
```svelte
<button class="inline-flex items-center justify-center gap-2">
  <Icon class="h-4 w-4" />
  <span>Button Text</span>
</button>
```
**Rules:**
- Always use `inline-flex` (not `flex`) for buttons
- Both `items-center` AND `justify-center` for 2D centering
- Gap based on size: `gap-1.5` (sm), `gap-2` (md/lg)

### Decision Matrix

| Use Case | Pattern | Key Classes |
|----------|---------|-------------|
| Icon inside input | Pattern 3 | `absolute inset-y-0 flex items-center` |
| Icon beside single-line text | Pattern 1 | `flex items-center gap-2` + `shrink-0` |
| Icon with multi-line text | Pattern 2 | `flex items-start gap-3` + `mt-0.5` |
| Icon-only button | Pattern 5 | `inline-flex items-center justify-center` |
| Badge on corner | Pattern 4 | `absolute -top-1.5 -right-1.5` |

---

## Accessibility (REQUIRED)

### WCAG 2.1 AA Compliance

| Requirement | Standard |
|-------------|----------|
| Color contrast | 4.5:1 for text, 3:1 for large text |
| Focus visible | All interactive elements |
| Screen reader | Semantic HTML, aria-labels |
| Keyboard nav | Full functionality without mouse |
| Motion | Respect `prefers-reduced-motion` |

### Checklist
- [ ] Color is not sole indicator (icons + color)
- [ ] Form inputs have visible labels
- [ ] Error messages are announced
- [ ] Images have alt text
- [ ] Modals trap focus
- [ ] Skip links for navigation

---

## Visual Iteration Workflow

Use screenshot-based iteration to refine UI implementation:

### Process

```
1. Implement UI based on wireframe
2. Screenshot the result (cmd+ctrl+shift+4 on macOS)
3. Compare to wireframe/design
4. Iterate 2-3 times until match
5. Final review before commit
```

### How to Iterate

1. **Take screenshot** of implemented component
2. **Paste into chat** for comparison
3. **Identify gaps**: spacing, alignment, colors, states
4. **Request specific fixes**: "Increase padding to p-4" not "fix spacing"
5. **Repeat** until design matches

### Checklist Per Iteration

- [ ] Layout matches wireframe structure
- [ ] Spacing uses correct tokens (p-4, gap-6, etc.)
- [ ] Colors use design tokens (bg-primary, text-muted)
- [ ] Touch targets are 44px minimum
- [ ] States implemented (loading, empty, error)
- [ ] Animations use motion presets

### When to Stop Iterating

- Layout matches wireframe ✓
- All states implemented ✓
- Design tokens used correctly ✓
- Accessibility checklist passes ✓

**Tip**: 2-3 iterations usually sufficient. More indicates unclear requirements.

---

## Industry Research Requirement

For each feature type, research **10 outstanding apps** in the industry:
- Document what they do well
- Note interaction patterns that feel natural
- Adopt patterns users already know (muscle memory)

See `{{paths.domain}}ui-ux/INDUSTRY_RESEARCH.md` for documented patterns.

---

## Feature Review Checklist

### Must Have (Blocker)
- [ ] Mobile layout works (320px minimum)
- [ ] Loading state uses skeleton (not spinner)
- [ ] Error state is human-friendly
- [ ] Empty state has helpful message + CTA
- [ ] Copy follows UX_COPY.md standards
- [ ] Animations are subtle and brand-aligned
- [ ] Uses existing components from `$lib/components/ui`
- [ ] Design tokens only (no raw Tailwind colors)
- [ ] Touch targets 44x44px minimum
- [ ] Safe areas respected

### Accessibility (Required)
- [ ] aria-labels on icon-only buttons
- [ ] Focus visible on all interactive elements
- [ ] Keyboard navigation works
- [ ] Screen reader tested

### Nice to Have
- [ ] Reduced motion alternative
- [ ] Dark mode support
- [ ] Internationalization ready

---

## Wireframe Template

```markdown
## [Feature Name] Wireframe

### Layout (Mobile)
┌─────────────────────────┐
│ Header                  │
├─────────────────────────┤
│                         │
│ Main Content            │
│                         │
├─────────────────────────┤
│ Bottom Nav              │
└─────────────────────────┘

### States
| State | Behavior |
|-------|----------|
| Loading | Skeleton loader |
| Empty | "Nothing here yet" + CTA |
| Error | Human-friendly message + retry |
| Success | Brief confirmation, auto-dismiss |

### Interactions
- Tap: [action]
- Swipe left: [action]
- Long press: [action]
- Pull down: Refresh

### Animations
- Entry: Fade in 200ms
- Exit: Slide down 150ms
```
