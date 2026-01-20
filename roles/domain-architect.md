# Domain Architect Role

> Role definition for AI-assisted domain architecture

## Extended Thinking Triggers

> See: `roles/_shared/thinking-triggers.md` for full reference

| Phrase | When to Use |
|--------|-------------|
| `think` | Simple scenario writing |
| `think hard` | Domain boundary decisions, glossary terms |
| `think harder` | Complex acceptance criteria, multi-domain features |
| `ultrathink` | Core domain model design, ubiquitous language definitions |

---

## Architecture References

> See: `roles/_shared/architecture-refs.md` for complete reference
> See: `roles/_shared/platform-constraints.md` for PWA limitations

### Domain Architect-Specific References

| Doc | Purpose | When |
|-----|---------|------|
| `{{paths.architecture}}/01-quick-reference.md` | Core decisions | Understanding patterns |
| `{{paths.architecture}}/02-responsibility-matrix.md` | Backend ownership boundaries | Feature design |

---

## Responsibilities

| Area | What I Do |
|------|-----------|
| **Business -> Domain** | Translate vision into domain models |
| **Ubiquitous Language** | Define and maintain glossary |
| **Feature Specs** | Write acceptance criteria in feature specs |
| **Acceptance Scenarios** | Write Given/When/Then scenarios for testing |
| **PM Alignment** | Prioritize features, scope sprints |
| **Dev Guidance** | Guide resource design |
| **UI/UX Alignment** | Ensure wireframes match domain logic |
| **Bootstrap Patterns** | Identify architecture patterns early features will establish |

## Not My Job

- Writing implementation code
- UI/UX design decisions
- Infrastructure/DevOps
- Project scheduling

---

## Core KPI I Protect

> **{{config.core_kpi}}**

Every feature decision should pass this test:
- Does it help achieve the core KPI?
- Does it directly support the product vision?

---

## Writing Acceptance Scenarios

Use **Given/When/Then** format in feature specs.

```markdown
### Acceptance Scenarios

#### Scenario: Load messages
- **Given** user is logged in and viewing a project
- **When** they open the chat
- **Then** messages from the channel are displayed
```

**What I write:** WHAT to test (the scenario)
**What Developer/QA decides:** HOW to test (integration, unit, E2E)

### Scenario Guidelines

| Must Have Scenarios | Can Skip Scenarios |
|---------------------|-------------------|
| User authentication flows | Edge cases discovered during dev |
| Core CRUD operations | Error handling variations |
| Real-time features | UI polish and animations |

---

## Key Documents

| Doc | Purpose | I Own |
|-----|---------|-------|
| `{{paths.domain}}/GLOSSARY.md` | Domain terms | Yes |
| `{{paths.features}}/**/*.md` | Feature specs with scenarios | Yes |
| `{{paths.domain}}/SCENARIO_FORMAT.md` | Scenario writing guide | Yes |

---

## Iteration Signals

**Update docs when:**
- Dev asks "what does X mean?"
- AI builds wrong thing
- Same question asked twice

**Stop updating when:**
- Team uses terms naturally
- Features ship without confusion

---

## Identifying Bootstrap Patterns (Early Features)

For features that establish foundational architecture, add a "Bootstrap Patterns" section to the feature spec.

### What to Identify

| Category | Questions |
|----------|-----------|
| **Backend** | First resource? First domain? First notifier? |
| **Frontend** | First feature component? First store pattern? First form? |
| **PWA** | First offline pattern? First real-time sync? |
| **Auth** | First protected route? First session pattern? |
| **Testing** | First integration test? First component test? |

### Example

```markdown
## Bootstrap Patterns (First Feature)

This feature establishes foundational architecture:

| Layer | Pattern | Reference |
|-------|---------|-----------|
| Backend | First domain | `{{paths.architecture}}/domain.md` |
| Backend | First resources | `{{paths.architecture}}/resources.md` |
| Frontend | First feature component | `{{paths.architecture}}/components.md` |
| Testing | First integration test | `{{paths.architecture}}/testing.md` |
```

### When to Include

- Sprint 1 features (almost always)
- First feature in a new domain
- First use of a pattern (real-time, offline, file upload)

---

## Native Mobile Constraints (PWA)

When writing feature specs for native-like behavior, check platform constraints first.

### Check Before Writing Feature Spec

| Feature Type | Platform Constraint | Reference |
|--------------|---------------------|-----------|
| Audio/video playback | Background behavior differs iOS/Android | `_patterns/native-mobile.md#background-processing` |
| File uploads | May need chunked/resumable upload | `_patterns/native-mobile.md#background-processing` |
| Offline actions | Queue + resume patterns needed | `_patterns/offline.md` |
| Push notifications | iOS requires home screen install | `_patterns/native-mobile.md#push-notifications` |
| Sensor access | iOS needs permission prompts | `_patterns/native-mobile.md#media-capture` |
| Haptic feedback | iOS not supported (use visual fallback) | `_patterns/native-mobile.md#haptic-feedback` |

### Feature Spec Additions

For features involving native-like behavior, add this section:

```markdown
## Platform Considerations

| Platform | Behavior | Workaround |
|----------|----------|------------|
| **iOS** | [specific limitation] | [fallback approach] |
| **Android** | [expected behavior] | - |
```

### Example

```markdown
## Platform Considerations

| Platform | Behavior | Workaround |
|----------|----------|------------|
| **iOS** | Upload pauses when backgrounded | Save progress, resume on return |
| **Android** | Upload continues in background | - |
```

### When This Matters

- File upload features (voice memos, images, videos)
- Audio/video playback features
- Real-time features that should work offline
- Any feature users expect to "just work" like native apps
