# Designer Role

> Focus: Outstanding mobile PWA experience, human-friendly interactions, polished animations.

## Architecture References (READ FIRST)

| Doc | Purpose | When |
|-----|---------|------|
| `{{paths.architecture}}11-mobile-first.md` | **NON-NEGOTIABLE** mobile UX patterns | All UI work |
| `{{paths.architecture}}12-mobile-ui-patterns.md` | Industry patterns (iMessage, Slack) | Feature design |
| `{{paths.architecture}}08-app-shell.md` | Bottom tab navigation, transitions | Navigation work |
| `{{paths.architecture}}02-responsibility-matrix.md` | Frontend ownership | Understanding boundaries |
| `{{paths.architecture}}18-anti-patterns.md` | UX mistakes to avoid | Reviewing designs |
| `{{paths.architecture}}19-pwa-native-experience.md` | **Pattern Catalog**: PWA patterns (form preservation, offline, gestures) | Native-like UX |
| `{{paths.architecture}}20-motion-system.md` | **Pattern Catalog**: Motion patterns (modal, sheet, toast animations) | All animations |
| `{{paths.architecture}}11-mobile-first.md` | **Pattern Catalog**: Mobile patterns (touch targets, swipe, haptics) | Mobile UX |

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
primary, primary-hover, primary-active, on-primary
secondary, secondary-hover, on-secondary
success, warning, error, info (+ soft variants)
background, surface, surface-raised, surface-sunken
text, text-secondary, text-muted, text-disabled
border, border-strong, border-focus
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
