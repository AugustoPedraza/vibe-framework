# Tracer Bullet Command

> `/vibe tracer [path]` - Minimal end-to-end slice to validate architecture

## Purpose

Implements the "Tracer Bullet" approach from The Pragmatic Programmer. Build a minimal working path through all layers of the system to validate architecture before investing in full implementation.

## Usage

```
/vibe tracer [FEATURE-ID]           # Tracer for feature
/vibe tracer --path "UI -> API -> DB"  # Explicit path specification
/vibe tracer --validate             # Check existing tracer still works
```

---

## Workflow

```
Define Path -> Minimal Implementation -> Validate -> Document
```

### Step 1: Define the Critical Path

```
+======================================================================+
|  TRACER BULLET INITIALIZATION                                         |
|  Feature: [FEATURE-ID]                                                |
+======================================================================+
|                                                                       |
|  Critical Path:                                                       |
|                                                                       |
|  [User Action] -> [Svelte Component] -> [LiveView] ->                 |
|  [Domain Action] -> [Database] -> [Response] -> [UI Update]           |
|                                                                       |
|  Layers to validate:                                                  |
|  [x] Frontend (Svelte 5)                                              |
|  [x] LiveView Integration (LiveSvelte)                                |
|  [x] Domain Logic (Ash)                                               |
|  [x] Data Layer (PostgreSQL)                                          |
|  [x] Real-time (PubSub) - if applicable                               |
|                                                                       |
+======================================================================+
```

### Step 2: Define Success Criteria

```
+---------------------------------------------------------------------+
|  SUCCESS CRITERIA                                                    |
|                                                                      |
|  "Can see X after doing Y"                                           |
|                                                                      |
|  Example:                                                            |
|  "Can see 'Hello World' message in chat after clicking Send"         |
|                                                                      |
|  Verification:                                                       |
|  - [ ] Data persists to database                                     |
|  - [ ] UI updates without page reload                                |
|  - [ ] Round-trip latency < 500ms                                    |
|                                                                      |
+---------------------------------------------------------------------+
```

---

## Tracer Implementation Rules

### What to Include

| Include | Why |
|---------|-----|
| Minimum viable data model | Validate schema works |
| One happy path action | Prove the plumbing |
| Basic UI feedback | Confirm data flows to user |
| Real database operations | Validate persistence |
| Actual routing | Prove navigation works |

### What to Skip

| Skip | Why |
|------|-----|
| Validation rules | Add after path works |
| Error handling | Polish phase |
| Edge cases | Not architecture validation |
| Styling/polish | UX layer, separate concern |
| Authorization | Add after basic flow works |
| Logging/telemetry | Observability layer |

---

## Tracer Bullet Checklist

<!-- AI:CHECKLIST tracer_bullet -->
```yaml
tracer_bullet:
  items:
    - id: path_defined
      description: Critical path through all layers documented
      verification:
        type: manual
        prompt: "Is the path from user action to database clear?"
      severity: blocker

    - id: success_criteria
      description: "Can see X after doing Y" statement defined
      verification:
        type: manual
        prompt: "Is there a clear, testable success statement?"
      severity: blocker

    - id: minimal_resource
      description: Ash resource with minimum attributes created
      verification:
        type: file_exists
        pattern: "lib/**/resources/*.ex"
      severity: blocker

    - id: minimal_action
      description: One action (create/read) implemented
      verification:
        type: grep_pattern
        pattern: "actions do"
        path: "lib/**/resources/*.ex"
      severity: blocker

    - id: liveview_shell
      description: LiveView with basic assigns
      verification:
        type: file_exists
        pattern: "lib/**/*_live.ex"
      severity: blocker

    - id: svelte_component
      description: Svelte component receives and displays data
      verification:
        type: file_exists
        pattern: "assets/svelte/**/*.svelte"
      severity: blocker

    - id: round_trip_works
      description: Data flows UI -> Backend -> DB -> UI
      verification:
        type: manual
        prompt: "Can you see the data after performing the action?"
      severity: blocker

    - id: documented
      description: Patterns validated documented for team
      verification:
        type: file_exists
        pattern: "_tracer.md"
      severity: warning
```
<!-- /AI:CHECKLIST -->

---

## Example Tracer Bullets

### Example 1: Chat Feature

```markdown
## Tracer: CHAT-001

### Critical Path
User types message -> ChatInput.svelte -> handle_event("send") ->
Conversations.send_message/2 -> Message resource created ->
PubSub broadcast -> ChatMessages.svelte updates

### Success Criteria
"Can see 'Hello' in message list after typing and clicking Send"

### Minimal Implementation
- Message resource: id, content, channel_id, inserted_at
- send action: accept content, relate to channel
- ChatLive: mount with channel_id, handle_event for send
- ChatInput.svelte: input + button, pushEvent on click
- ChatMessages.svelte: render messages from props

### What's Skipped (for now)
- [ ] User attribution (sender_id)
- [ ] Read receipts
- [ ] Typing indicators
- [ ] Message editing/deletion
- [ ] Rich media attachments
- [ ] Input validation
- [ ] Error handling
```

### Example 2: Authentication

```markdown
## Tracer: AUTH-001

### Critical Path
User enters email/password -> LoginForm.svelte -> handle_event("login") ->
Accounts.authenticate/2 -> Session created -> Cookie set ->
Redirect to dashboard -> User sees logged-in state

### Success Criteria
"Can see dashboard with username after entering valid credentials"

### Minimal Implementation
- User resource: id, email, hashed_password
- Session resource: id, token, user_id
- authenticate action: verify password, create session
- LoginLive: handle_event, set session cookie
- LoginForm.svelte: email + password inputs, submit button
- DashboardLive: show current_user.email

### What's Skipped (for now)
- [ ] Registration flow
- [ ] Password reset
- [ ] Email verification
- [ ] OAuth providers
- [ ] Remember me
- [ ] Session expiration
- [ ] Rate limiting
```

---

## Tracer Documentation Template

Generate `_tracer.md` in feature directory:

```markdown
# Tracer Bullet: [FEATURE-ID]

## Date
[YYYY-MM-DD]

## Critical Path
[Diagram or text description of the path through layers]

## Success Criteria
"Can see [X] after doing [Y]"

## Patterns Validated

### Backend
- [ ] Ash resource definition pattern
- [ ] Action with changeset
- [ ] Domain function wrapper

### Frontend
- [ ] LiveView -> Svelte props flow
- [ ] Svelte -> LiveView event flow
- [ ] Reactive state update

### Integration
- [ ] LiveSvelte component mounting
- [ ] pushEvent / handleEvent pattern
- [ ] assign_async for data loading

## Files Created
- `lib/myapp/domain/resource.ex`
- `lib/myapp_web/live/feature_live.ex`
- `assets/svelte/components/Feature.svelte`

## Next Steps
After tracer validates architecture:
1. Add validation rules
2. Implement error handling
3. Add remaining actions
4. Polish UI
5. Add tests

## Issues Discovered
[Any architectural issues found during tracer implementation]
```

---

## AI-Friendly Output Schema

<!-- AI:SCHEMA tracer_output -->
```json
{
  "tracer_id": "TRACER-CHAT-001",
  "feature_id": "CHAT-001",
  "status": "validated",
  "critical_path": {
    "layers": ["svelte", "liveview", "domain", "postgres", "pubsub"],
    "flow": "ChatInput -> handle_event -> send_message -> Message -> broadcast -> ChatMessages"
  },
  "success_criteria": {
    "statement": "Can see 'Hello' in message list after clicking Send",
    "verified": true,
    "latency_ms": 120
  },
  "patterns_validated": [
    "ash_resource_minimal",
    "liveview_svelte_props",
    "svelte_push_event",
    "pubsub_broadcast"
  ],
  "files_created": [
    "lib/myapp/conversations/resources/message.ex",
    "lib/myapp_web/live/chat_live.ex",
    "assets/svelte/components/chat/ChatInput.svelte",
    "assets/svelte/components/chat/ChatMessages.svelte"
  ],
  "skipped_concerns": [
    "validation",
    "error_handling",
    "authorization",
    "styling"
  ],
  "issues_found": [],
  "next_steps": [
    "Add content validation",
    "Implement error states",
    "Add sender attribution"
  ],
  "created_at": "2026-01-22T10:00:00Z"
}
```
<!-- /AI:SCHEMA -->

---

## When to Use Tracer Bullets

### Good Candidates

| Scenario | Why Tracer Helps |
|----------|------------------|
| New feature area | Validates unfamiliar integration points |
| New technology | Proves the tech works in your stack |
| Complex data flow | Confirms data reaches all destinations |
| Real-time features | Validates WebSocket/PubSub plumbing |
| Multi-service integration | Proves services communicate |

### Skip Tracer When

| Scenario | Why Skip |
|----------|----------|
| CRUD on existing pattern | Pattern already proven |
| UI-only changes | No new architectural concerns |
| Bug fixes | Path already works |
| Refactoring | Not adding new paths |

---

## Tracer vs Spike vs Prototype

| Approach | Purpose | Keep Code? |
|----------|---------|------------|
| **Tracer Bullet** | Validate architecture, keep and extend | Yes |
| **Spike** | Explore unknowns, learn, throw away | No |
| **Prototype** | Explore UX/features, may throw away | Maybe |

**Tracer bullets are production code** - minimal but correct. Build on them.

---

## Integration with Vibe Workflow

### During Feature Planning

```
/vibe start [FEATURE-ID]
  -> Domain Architect identifies critical path
  -> Suggests tracer bullet if new patterns involved
```

### Before Full Implementation

```
/vibe tracer [FEATURE-ID]
  -> Implements minimal path
  -> Validates architecture
  -> Documents patterns for Developer phase
```

### Validation Gate

```
+---------------------------------------------------------------------+
|  TRACER VALIDATION GATE                                              |
|                                                                      |
|  Feature: [FEATURE-ID]                                               |
|  Tracer Status: [PASS/FAIL]                                          |
|                                                                      |
|  If PASS: Proceed to full implementation                             |
|  If FAIL: Investigate architecture issues before proceeding          |
|                                                                      |
+---------------------------------------------------------------------+
```
