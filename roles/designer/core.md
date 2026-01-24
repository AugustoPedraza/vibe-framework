# Designer Role - Core

> Essential UX philosophy and mobile-first patterns. Always loaded during Designer phase.

---

## UX Design Philosophy Quick Reference

### Core Principles (Industry Validated)

| Principle | Rule | Source |
|-----------|------|--------|
| **Thumb-first** | Primary actions in bottom 50% of screen | Luke Wroblewski |
| **One primary** | Single primary action per screen | Hick's Law |
| **Glanceable** | Key info visible without scrolling | NN/g |
| **4 States** | Every UI: Loading -> Empty -> Error -> Success | PatternFly |
| **Dark mode** | Support light/dark themes | 82% user pref |
| **Reduced motion** | Respect `prefers-reduced-motion` | WCAG 2.3.3 |

### Maximum Complexity

| Element | Limit |
|---------|-------|
| Tab bar items | 3-5 |
| Form fields visible | 5-7 |
| Actions per screen | 1 primary + 2 secondary |
| Data points per list item | 3-4 |

### Touch Targets

| Standard | Size |
|----------|------|
| Minimum (WCAG AA) | 24x24px |
| Recommended | 44-48px |
| Spacing between | 8-12px |

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

## Component Selection (2024-2025)

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

---

## Anti-Patterns (Never Do)

| Don't | Do Instead | Evidence |
|-------|------------|----------|
| Hamburger as primary nav | Bottom tab bar | 65% lower engagement |
| Dropdowns on mobile | Segmented/chips/sheet | 60% slower |
| Multi-column forms | Single column | 15.4s slower |
| Spinner for content | Skeleton | 40% slower perceived |
| Primary action at top | Bottom 50% | Thumb zone |
| Centered modals | Bottom sheets | 25-30% lower engagement |
| Pure black dark mode | #121212 | Halation effect |

---

## 4 UX States (REQUIRED)

Every UI component must define all 4 states:

### Loading State
- Show skeleton, not spinner (for >1s loads)
- Disable primary action
- Show progress if determinate

### Empty State
- Clear message explaining "why empty"
- CTA to take action
- Illustration if space permits

### Error State
- Human-readable message
- Retry action visible
- Don't block entire screen

### Success State
- Render data correctly
- All interactions work
- Match design spec

---

## Designer Phase Responsibilities

| Area | What I Do |
|------|-----------|
| **UX Verification** | Verify feature spec UX is complete |
| **Component Selection** | Choose existing vs new components |
| **State Definition** | Define all 4 states for new UI |
| **Design Token Usage** | Ensure correct tokens used |
| **Accessibility** | WCAG AA compliance check |
| **Mobile UX** | Touch targets, gestures, safe areas |

---

## Designer -> Developer Handoff

```json
{
  "feature_id": "[ID]",
  "components": [
    {"name": "...", "type": "new|existing|modify"}
  ],
  "ui_states": ["loading", "error", "empty", "success"],
  "patterns_suggested": ["pattern-id-from-manifest"],
  "design_tokens": {
    "colors": ["primary", "muted"],
    "spacing": ["p-4", "gap-2"],
    "motion": ["duration-normal"]
  },
  "accessibility": {
    "touch_targets": "verified",
    "aria_labels": "verified",
    "focus_management": "verified"
  }
}
```

---

## Extended Modules

Load additional modules as needed:
- `roles/designer/components.md` - Component selection guide
- `roles/designer/mobile.md` - Platform-specific UX
- `roles/designer/wireframes.md` - Wireframe patterns
