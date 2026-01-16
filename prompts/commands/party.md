# Party Mode Command

> `/vibe party` - Multi-agent discussion for complex decisions

## Purpose

Invoke BMAD's Party Mode for:
- Architecture decisions requiring multiple perspectives
- Trade-off discussions
- Design debates
- When you're stuck and need diverse viewpoints

**Output:** Discussion transcript with conclusions and action items

---

## When to Use

| Scenario | Use `/vibe party` |
|----------|------------------|
| Simple bug fix | No |
| Architecture decision | Yes |
| Technology choice | Yes |
| Complex UX trade-off | Yes |
| Stuck on approach | Yes |
| Need devil's advocate | Yes |

---

## Workflow

```
Define Topic -> Assemble Agents -> Discussion Rounds -> Synthesis -> Action Items
```

---

## Phase 1: Define Discussion Topic

```
+======================================================================+
|  PTY PARTY MODE                                                       |
|  Multi-agent discussion                                               |
+======================================================================+
```

```
+---------------------------------------------------------------------+
|  PARTY MODE SETUP                                                    |
|                                                                      |
|  What topic should we discuss?                                       |
|                                                                      |
|  Examples:                                                           |
|    "Should we use Phoenix PubSub or a separate message broker?"      |
|    "How should we handle offline message queuing?"                   |
|    "What's the best approach for real-time presence?"                |
|                                                                      |
|  Enter topic: ___                                                    |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - Wait for topic input

---

## Phase 2: Assemble Agents

```
+======================================================================+
|  PTY ASSEMBLING DISCUSSION PANEL                                      |
|  Selecting relevant perspectives                                      |
+======================================================================+
```

### Available BMAD Agents

| Agent | Persona | Perspective |
|-------|---------|-------------|
| Sally | UX Designer | User experience, accessibility |
| Barry | Quick Flow Dev | Rapid implementation, pragmatism |
| Mo | PM/BA | Business value, priorities |
| Pip | Data Architect | Data model, scalability |
| Alex | Tech Lead | Architecture, patterns |

### Agent Selection

Based on topic, suggest relevant agents:

```
+---------------------------------------------------------------------+
|  SUGGESTED PANEL                                                     |
|                                                                      |
|  Topic: "How should we handle offline message queuing?"              |
|                                                                      |
|  Recommended agents:                                                 |
|    [x] Sally (UX Designer) - User experience of offline              |
|    [x] Alex (Tech Lead) - Architecture implications                  |
|    [x] Pip (Data Architect) - Data sync patterns                     |
|    [ ] Barry (Dev) - Implementation complexity                       |
|    [ ] Mo (PM) - Business priority                                   |
|                                                                      |
|  Add/remove agents? [Enter to start discussion]                      |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - Confirm panel

---

## Phase 3: Discussion Rounds

```
+======================================================================+
|  PTY DISCUSSION IN PROGRESS                                           |
|  Round 1 of 3                                                         |
+======================================================================+
```

### Round Structure

**Round 1: Initial Perspectives**
Each agent presents their view on the topic.

```
+---------------------------------------------------------------------+
|  ROUND 1: INITIAL PERSPECTIVES                                       |
|                                                                      |
|  SALLY (UX Designer):                                                |
|  "From a user perspective, offline messaging is critical for our     |
|  target users. Home projects often happen in areas with spotty       |
|  signal - basements, garages. If messages don't queue and send       |
|  when back online, users will distrust the app. The UX needs to      |
|  clearly show 'pending' messages with a visual indicator."           |
|                                                                      |
|  ALEX (Tech Lead):                                                   |
|  "Architecturally, we have two options: IndexedDB queue on client    |
|  with retry logic, or Service Worker background sync. Service        |
|  Worker is cleaner but has browser support concerns. IndexedDB is    |
|  more work but gives us full control."                               |
|                                                                      |
|  PIP (Data Architect):                                               |
|  "The key concern is message ordering and conflict resolution.       |
|  If two offline users send messages, we need timestamp-based         |
|  ordering that's consistent. We should use logical clocks, not       |
|  wall-clock time."                                                   |
|                                                                      |
|  Questions or steering for next round? [Enter to continue]           |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - Allow user to steer discussion

**Round 2: Debate & Trade-offs**
Agents discuss trade-offs and challenge each other.

```
+---------------------------------------------------------------------+
|  ROUND 2: TRADE-OFFS                                                 |
|                                                                      |
|  ALEX → SALLY:                                                       |
|  "Sally, how important is showing send progress vs just 'pending'?   |
|  Service Worker doesn't give us progress events."                    |
|                                                                      |
|  SALLY:                                                              |
|  "For MVP, a simple pending indicator is fine. But we MUST have      |
|  a clear 'sent' confirmation. Users need closure."                   |
|                                                                      |
|  PIP → ALEX:                                                         |
|  "What about message deduplication? If retry sends same message      |
|  twice, we need idempotency keys."                                   |
|                                                                      |
|  ALEX:                                                               |
|  "Good point. We'll generate client-side UUIDs for each message.     |
|  Server rejects duplicates. Simple and reliable."                    |
|                                                                      |
|  Redirect discussion or continue? [Enter to continue]                |
+---------------------------------------------------------------------+
```

**Round 3: Convergence & Recommendations**
Agents work toward consensus.

```
+---------------------------------------------------------------------+
|  ROUND 3: CONVERGENCE                                                |
|                                                                      |
|  EMERGING CONSENSUS:                                                 |
|                                                                      |
|  1. Use IndexedDB for message queue (more control than SW)           |
|  2. Client-generated UUIDs for deduplication                         |
|  3. Visual pending indicator with "tap to retry" on failure          |
|  4. Logical timestamps for ordering                                  |
|  5. Batch sync on reconnection (efficient)                           |
|                                                                      |
|  REMAINING DISAGREEMENT:                                             |
|  - Sally wants retry limit UX; Alex prefers infinite retry           |
|                                                                      |
|  RESOLUTION:                                                         |
|  - Show pending for 24h, then "failed - tap to retry"                |
|  - Compromise between UX clarity and technical persistence           |
|                                                                      |
|  Accept conclusions or continue discussion? [Enter to conclude]      |
+---------------------------------------------------------------------+
```

---

## Phase 4: Synthesis

```
+======================================================================+
|  PTY DISCUSSION SYNTHESIS                                             |
|  Documenting conclusions                                              |
+======================================================================+
```

### Discussion Summary

```markdown
# Party Mode Discussion: Offline Message Queuing

**Date:** {date}
**Participants:** Sally (UX), Alex (Tech Lead), Pip (Data)
**Topic:** How should we handle offline message queuing?

## Key Points

### From Sally (UX):
- Offline critical for home project context
- Clear pending/sent indicators essential
- 24h pending limit before showing failure

### From Alex (Tech Lead):
- IndexedDB preferred over Service Worker
- Client-generated UUIDs for deduplication
- Batch sync on reconnection

### From Pip (Data):
- Logical clocks for consistent ordering
- Idempotency via message UUIDs
- Consider conflict resolution for future

## Conclusions

1. **Architecture:** IndexedDB message queue with retry logic
2. **Data Model:** Client UUID + logical timestamp per message
3. **UX:** Pending indicator → Sent confirmation → Failed after 24h
4. **Sync:** Batch upload on reconnection, server deduplicates

## Action Items

- [ ] Create feature spec for offline messaging (CONV-005)
- [ ] Add logical timestamp to Message schema
- [ ] Design pending/sent/failed UI states
- [ ] Research IndexedDB wrapper (Dexie.js vs native)

## Open Questions

- What's the max queue size before warning user?
- Should we compress batched messages?
```

---

## Phase 5: Action Items

```
+======================================================================+
|  PTY PARTY MODE COMPLETE                                              |
|  Action items generated                                               |
+======================================================================+
```

```
+---------------------------------------------------------------------+
|  PARTY MODE COMPLETE                                                 |
|                                                                      |
|  Transcript: _bmad-output/party-{topic}-{date}.md                    |
|                                                                      |
|  Conclusions:                                                        |
|    1. IndexedDB for offline queue                                    |
|    2. Client UUIDs for deduplication                                 |
|    3. Logical timestamps for ordering                                |
|    4. 24h pending limit with retry option                            |
|                                                                      |
|  Action Items:                                                       |
|    /vibe discover CONV-005 - Explore offline messaging               |
|    /vibe plan - Add to sprint backlog                                |
|                                                                      |
|  Create GitHub issues for action items? [y/N]                        |
+---------------------------------------------------------------------+
```

---

## Options

### `--agents [list]`

Specify agents directly:

```bash
/vibe party --agents "sally,alex" "API versioning strategy"
```

### `--rounds [N]`

Number of discussion rounds (default 3):

```bash
/vibe party --rounds 5 "complex topic"
```

### `--output [path]`

Custom output location:

```bash
/vibe party --output docs/decisions/ "topic"
```

---

## Integration

Party Mode outputs can inform:
- `/vibe discover` - Explore features identified in discussion
- `/vibe plan` - Add action items to sprint
- `/vibe context` - Update project context with decisions

---

## Anti-Patterns

- Never skip the convergence round (discussions need conclusions)
- Never use party mode for simple decisions (overkill)
- Never let one agent dominate (balance perspectives)
- Never skip action items (discussions need outcomes)
- Never auto-implement conclusions (require human confirmation)
