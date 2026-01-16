# {ID}: {Title}

> {One-line description}

## Status: `todo`

## Source

<!-- Remove this section if not converted from BMAD -->
- **BMAD Story:** {Story ID} - {Story Title}
- **Epic:** {Epic Number} - {Epic Title}
- **Converted:** {Date}

## PM Context

- **Priority:** {P0|P1|P2}
- **User Value:** {What user gets from this feature}
- **Success:** {How we know it works}

## Domain

### Entities

- `{EntityName}` - {description}

### Acceptance Scenarios

#### Scenario: {Happy path name}
- **Given** {precondition}
- **When** {action}
- **Then** {outcome}

#### Scenario: {Validation/error name}
- **Given** {precondition}
- **When** {error condition}
- **Then** {graceful handling}

#### Scenario: {Edge case name}
- **Given** {precondition}
- **When** {unusual action}
- **Then** {expected behavior}

## Wireframe

### Screen Layout

```
Mobile Layout (Primary):
┌─────────────────────────┐
│     [Header/Nav]        │
├─────────────────────────┤
│                         │
│   ┌─────────────────┐   │
│   │ [Component]     │   │
│   └─────────────────┘   │
│                         │
│   ┌─────────────────┐   │
│   │ [Component]     │   │
│   └─────────────────┘   │
│                         │
│   ┌─────────────────┐   │
│   │ [Primary CTA]   │   │
│   └─────────────────┘   │
│                         │
└─────────────────────────┘
```

### Desktop Adaptations

- {How layout changes on larger screens}

### Key Interactions

- **Auto-focus:** {Which element gets focus}
- **Tap {element}:** {What happens}
- **Keyboard Enter:** {What happens}
- **Keyboard Escape:** {What happens}

### Mobile Behaviors

- Single column, centered content
- Keyboard pushes content up (never covers input)
- Touch targets 44px minimum
- Thumb-friendly button placement at bottom

## UX Requirements

### States (Required)

**Loading**
- Trigger: {form_submit | page_load | action}
- Behavior: {button spinner | skeleton | inline}
- Component disabled during loading

**Error**
- Trigger: {validation | api_error | network}
- Display: {inline | Alert | toast}
- Copy: "{error message from UX_COPY.md}"
- Recovery: {what user can do}

**Empty**
- Applicable: {yes | no}
- If yes:
  - Preset: {EmptyState preset}
  - Title: "{empty state title}"
  - Action: "{CTA to populate}"

**Success**
- Behavior: {redirect | toast | inline}
- Target: {/path | "message"}
- Animation: {checkmark flash 200ms}

### Animations (Required)

- Button press: `scale(0.98)` on active
- Error: Gentle horizontal shake (invalid submit)
- Success: Checkmark flash before redirect (200ms)
- Page transition: Fade in (300ms)
- List items: Staggered fade (50ms delay)

### Components

<!-- Reference components.json -->
- `{ComponentName}` - {purpose} ({props})

### Copy

<!-- Reference UX_COPY.md -->
- Page title: "{title}"
- Labels: {field}: "{label}"
- Placeholders: {field}: "{placeholder}"
- Button: "{button text}"
- Loading: "{loading text}"
- Error: "{error message}"
- Success: "{success message}"

## UI Specification

```yaml
ui_spec:
  screen: {screen-name}
  layout: {centered-card | full-width | split | stacked | sheet}

  components:
    - id: {component-id}
      type: {ComponentFromComponentsJson}
      props:
        {prop}: {value}
      validation:
        required: {true|false}
        {rule}: {value}

    - id: {component-id}
      type: {Component}
      props:
        variant: {variant}
        size: {size}
      content: "{button/label text}"

  states:
    loading:
      trigger: {trigger}
      component: {Component}
      props:
        loading: true
        disabled: true
      content: "{loading text}"

    error:
      trigger: {trigger}
      component: {Alert | inline}
      variant: error
      copy: "{error message}"

    empty:
      applicable: {true|false}
      preset: {preset}
      title: "{title}"
      description: "{description}"
      action: "{cta}"

    success:
      behavior: {redirect | toast | inline}
      target: "{path or message}"

  liveview:
    module: SynaWeb.{Area}.{Name}Live
    events:
      - name: {event_name}
        payload: [{field1}, {field2}]
        handler: handle_event

  a11y:
    focus_order: [{component-ids}]
    announce_errors: true
    keyboard_submit: true
```

## Bootstrap Patterns

<!-- Include this section for first feature in an area -->

| Layer | Pattern Established | Notes |
|-------|---------------------|-------|
| **Backend** | {pattern} | {notes} |
| **Frontend** | {pattern} | {notes} |
| **Testing** | {pattern} | {notes} |

## Notes

- MVP: {what's included in MVP}
- Defer: {what's deferred to later}
- Depends: {dependencies on other features}
- Technical: {implementation notes}
