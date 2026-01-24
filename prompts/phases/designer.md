# Designer Phase

> Verify UX completeness and select components.

---

## Phase Entry

```
+======================================================================+
|  🎨 DESIGNER PHASE                                                    |
|  Feature: {ID} - {Title}                                              |
|  Context: roles/designer/core.md                                      |
+======================================================================+
```

## Objective

Verify UX requirements are complete and select appropriate components.

---

## Workflow

### 1. Review Feature Spec UX

Check feature spec for:
- [ ] Wireframe or layout description
- [ ] All 4 states defined (loading, error, empty, success)
- [ ] Interaction descriptions
- [ ] Accessibility requirements
- [ ] Mobile considerations

### 2. Review QA Handoff

Load QA handoff from checkpoint:
- Scenarios covered
- UX requirements extracted
- E2E requirements

### 3. Component Selection

For each UI element in feature:

| Decision | Options |
|----------|---------|
| **Existing component** | Reuse from component library |
| **Modify existing** | Extend with new props/variants |
| **New component** | Create new (specify patterns) |

### 4. Verify Design Token Usage

Check that feature spec specifies:
- [ ] Colors from design tokens (not raw values)
- [ ] Spacing from standard scale
- [ ] Typography from system
- [ ] Motion from presets

### 5. Mobile UX Check

For mobile-first features:
- [ ] Touch targets ≥44px
- [ ] Primary actions in thumb zone
- [ ] Safe areas respected
- [ ] Gestures specified (swipe, pull, etc.)

---

## Component Selection Quick Reference

| User Intent | Use | NOT |
|-------------|-----|-----|
| Navigate sections | BottomTabBar | Hamburger |
| Select 2-4 options | Segmented | Dropdown |
| Select 5-7 options | Chips | Dropdown |
| Select 8+ options | BottomSheet + search | Dropdown |
| Show loading (>1s) | Skeleton | Spinner |

---

## UX State Verification

For each component/screen:

### Loading State
- [ ] Skeleton or spinner defined
- [ ] Primary action disabled
- [ ] Progress indicator if determinate

### Error State
- [ ] Error message defined
- [ ] Retry action available
- [ ] Doesn't block entire screen

### Empty State
- [ ] Empty message defined
- [ ] CTA to take action
- [ ] Illustration if appropriate

### Success State
- [ ] Data display defined
- [ ] Interactions specified
- [ ] Transition animations

---

## Accessibility Check

- [ ] aria-labels for interactive elements
- [ ] Focus management specified
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader flow logical

---

## Phase Exit

### Output

```json
{
  "feature_id": "{ID}",
  "components": [
    {"name": "LoginForm", "type": "new", "notes": "..."},
    {"name": "Button", "type": "existing", "variant": "primary"}
  ],
  "ui_states": ["loading", "error", "empty", "success"],
  "patterns_suggested": ["async-result-extraction"],
  "design_tokens": {
    "colors": ["primary", "muted", "destructive"],
    "spacing": ["p-4", "gap-2"],
    "motion": ["duration-normal"]
  },
  "accessibility": {
    "touch_targets": "verified",
    "aria_labels": "specified",
    "focus_management": "specified"
  },
  "mobile_ux": {
    "thumb_zone": "verified",
    "safe_areas": "specified",
    "gestures": ["swipe-to-delete"]
  }
}
```

### Transition

Save handoff to checkpoint → Proceed to Readiness Gate
