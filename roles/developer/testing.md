# Developer Role - Testing

> TDD patterns and testing best practices. Load during TDD cycle.

---

## Red-Green-Refactor Cycle

```
┌─────────────────────────────────────────┐
│  1. RED: Write failing test first       │
│     - Define expected behavior          │
│     - Test should fail (proves it works)│
├─────────────────────────────────────────┤
│  2. GREEN: Minimal code to pass         │
│     - Just enough to make test green    │
│     - Don't over-engineer               │
├─────────────────────────────────────────┤
│  3. REFACTOR: Clean up                  │
│     - Remove duplication                │
│     - Improve naming                    │
│     - Tests still pass                  │
└─────────────────────────────────────────┘
```

---

## BDD Workflow (From Scenarios to Tests)

Before implementing a feature:

1. **Read the feature spec** at `{{paths.features}}{area}/{ID}.md`
2. **Find Acceptance Scenarios** (Given/When/Then format)
3. **Each scenario = one test** (or test group)
4. **Map Given/When/Then -> AAA pattern:**
   - Given -> Arrange (setup)
   - When -> Act (action)
   - Then -> Assert (verification)

### Example: Scenario to Test

```markdown
# Scenario from spec
#### Scenario: Send message
- **Given** user is in project chat
- **When** they type and send a message
- **Then** message appears in the list
```

```elixir
# Implemented test
test "sends message and displays in list" do
  # Given (Arrange): user in project chat
  user = insert(:user)
  project = insert(:project, participants: [user])
  {:ok, view, _} = live(conn, ~p"/projects/#{project.id}")

  # When (Act): type and send message
  view |> form("#message-form", message: %{content: "Hello"}) |> render_submit()

  # Then (Assert): message appears
  assert has_element?(view, "[data-testid='message']", "Hello")
end
```

---

## AAA Pattern (Arrange, Act, Assert)

### TypeScript/Vitest

```typescript
it('should increment counter when button clicked', async () => {
  // ARRANGE - Setup test conditions
  const onIncrement = vi.fn();
  render(Counter, { props: { count: 0, onIncrement } });

  // ACT - Perform the action
  await fireEvent.click(screen.getByRole('button', { name: /increment/i }));

  // ASSERT - Verify the result
  expect(onIncrement).toHaveBeenCalledOnce();
});
```

### Elixir/ExUnit

```elixir
test "creates user with valid params" do
  # Arrange
  params = %{email: "test@example.com", name: "Test"}

  # Act
  result = Accounts.create_user(params)

  # Assert
  assert {:ok, user} = result
  assert user.email == "test@example.com"
end
```

---

## What to Test (HIGH VALUE)

| Test This | Why |
|-----------|-----|
| State transitions | Core logic, prevents regressions |
| User interactions | Click, submit, navigate |
| Error handling | User-facing failures |
| Edge cases | null, empty, boundaries |
| API contracts | Input/output shapes |

## What NOT to Test (LOW VALUE)

| Skip This | Why |
|-----------|-----|
| CSS classes | Fragile, implementation detail |
| Third-party code | Already tested upstream |
| Private functions | Test via public API |
| Static markup | No logic to verify |

---

## Testing Native/PWA Features

| Feature | Test Strategy |
|---------|---------------|
| Camera access | Mock `getUserMedia`, test permission denied |
| Upload resume | Simulate network interruption, verify recovery |
| Draft persistence | Test localStorage + IndexedDB fallback |
| Haptics | Skip on iOS (no API), test Android pattern |
| Push notifications | Mock subscription, test backend push |

### Example: Testing Upload Resume

```typescript
describe('UploadManager', () => {
  it('should save progress when visibility changes to hidden', async () => {
    const manager = new UploadManager();
    const file = new Blob(['test'], { type: 'text/plain' });

    const uploadId = await manager.createUpload({ file, filename: 'test.txt' });

    // Simulate backgrounding (iOS)
    document.dispatchEvent(new Event('visibilitychange'));
    Object.defineProperty(document, 'visibilityState', { value: 'hidden' });

    const progress = manager.getProgress(uploadId);
    expect(progress.savedToStorage).toBe(true);
  });

  it('should resume from last chunk after interruption', async () => {
    localStorage.setItem('upload_progress_123', JSON.stringify({
      id: '123',
      uploadedChunks: [0, 1, 2],
      totalChunks: 5,
      status: 'paused'
    }));

    const manager = new UploadManager();
    const progress = manager.getProgress('123');

    expect(progress.uploadedChunks.length).toBe(3);
    expect(progress.canResume).toBe(true);
  });
});
```

---

## Test Commands

```bash
# Backend tests
mix test                           # All tests
mix test test/path/to/file.exs     # Specific file
mix test --cover                   # With coverage

# Frontend tests
cd assets && npm test              # All tests
cd assets && npm test -- --run     # Non-watch mode
cd assets && npm test -- --coverage # With coverage

# E2E tests
cd assets && npx playwright test   # All E2E
```

---

## Test File Organization

### Backend (ExUnit)

```
test/
├── {domain}/                    # Domain tests
│   ├── resources/               # Resource tests
│   │   └── user_test.exs
│   └── {domain}_test.exs        # Domain integration
├── {project}_web/               # Web layer tests
│   └── live/                    # LiveView tests
│       └── chat_live_test.exs
└── support/                     # Helpers
    ├── fixtures.ex
    └── factory.ex
```

### Frontend (Vitest)

```
assets/
├── svelte/
│   └── components/
│       └── Button/
│           ├── Button.svelte
│           └── Button.test.ts   # Co-located test
└── tests/
    └── e2e/                     # Playwright tests
        └── login.spec.ts
```

---

## Testing Checklist

Before marking scenario complete:

- [ ] Test written first (RED)
- [ ] Minimal implementation (GREEN)
- [ ] Refactored if needed
- [ ] All 4 UX states tested (loading, error, empty, success)
- [ ] Edge cases covered
- [ ] No console.log / IO.inspect in test
