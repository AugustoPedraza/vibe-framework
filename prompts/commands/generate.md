# Generate Command

> `/vibe generate [FEATURE-ID]` - Generate scaffold from feature spec

## Purpose

Generate 70-80% complete implementation scaffolds from feature specs:
- Parse `ui_spec` YAML from feature spec
- Generate Svelte component with all states
- Generate LiveView shell
- Generate test stubs from acceptance scenarios

**Output:**
- `assets/svelte/components/features/{area}/{Name}Form.svelte`
- `lib/syna_web/live/{area}/{name}_live.ex`
- `test/syna_web/live/{area}/{name}_live_test.exs`

---

## Workflow

```
Read Spec -> Parse ui_spec -> Select Template -> Generate Files -> Verify
```

---

## Before Starting

1. Read feature spec: `docs/domain/features/{area}/{ID}.md`
2. Verify `ui_spec` block exists (error if missing)
3. Load `components.json` for component validation
4. Read templates from `assets/svelte/templates/`
5. Check for existing files (warn if overwriting)

---

## Phase 1: Parse Feature Spec

```
+======================================================================+
|  GEN PARSING FEATURE SPEC                                             |
|  Feature: [ID]                                                        |
+======================================================================+
```

### Extract Sections

| Section | Purpose |
|---------|---------|
| Title | Component/module naming |
| Acceptance Scenarios | Test stub generation |
| Wireframe | Layout reference |
| UX Requirements | State implementations |
| `ui_spec` | Primary generation source |
| Copy | User-facing strings |

### Validate ui_spec

Required fields:
- `screen` - Screen identifier
- `layout` - Layout type
- `components` - At least one component
- `states` - All 4 states defined
- `liveview.module` - LiveView module path

```
+---------------------------------------------------------------------+
|  FEATURE SPEC PARSED                                                 |
|                                                                      |
|  Feature: [ID] - [Title]                                             |
|  Area: [area]                                                        |
|                                                                      |
|  ui_spec:                                                            |
|    Screen: [screen]                                                  |
|    Layout: [layout]                                                  |
|    Components: [N] defined                                           |
|    States: [4/4] defined                                             |
|    LiveView: [module path]                                           |
|    Events: [N] defined                                               |
|                                                                      |
|  Scenarios: [N] (for test stubs)                                     |
|                                                                      |
|  Proceed with generation? [Enter]                                    |
+---------------------------------------------------------------------+
```

**CHECKPOINT** - Confirm before generating

---

## Phase 2: Component Validation

```
+======================================================================+
|  GEN VALIDATING COMPONENTS                                            |
|  Checking components.json...                                          |
+======================================================================+
```

### Validate Each Component

For each component in `ui_spec.components`:
1. Check component type exists in `components.json`
2. Validate props match component API
3. Check variant/size values are valid
4. Warn on missing optional props

```
+---------------------------------------------------------------------+
|  COMPONENT VALIDATION                                                |
|                                                                      |
|  [x] Input (type: email, size: md) - valid                           |
|  [x] Input (type: password, size: md) - valid                        |
|  [x] Button (variant: primary, size: md) - valid                     |
|  [!] Alert - missing 'dismissible' prop (optional, defaulting)       |
|                                                                      |
|  All components validated. Continue? [Enter]                         |
+---------------------------------------------------------------------+
```

---

## Phase 3: Select Template

```
+======================================================================+
|  GEN SELECTING TEMPLATE                                               |
|  Based on feature type...                                             |
+======================================================================+
```

### Template Selection Logic

| Feature Type | Template | Indicators |
|--------------|----------|------------|
| Form | `FormComponent.template.svelte` | Has form inputs, submit event |
| List | `ListComponent.template.svelte` | Has AnimatedList, data array |
| Detail | `FeatureComponent.template.svelte` | Has single entity display |
| UI | `UIComponent.template.svelte` | Stateless display only |

### Detection Rules

**Form Feature:**
- `ui_spec.components` contains Input/Select/Textarea
- `ui_spec.liveview.events` includes submit-type event
- Layout is `centered-card` or `stacked`

**List Feature:**
- `ui_spec.components` contains AnimatedList/DataTable
- `states.empty.applicable: true`
- Layout is `full-width`

**Detail Feature:**
- Single entity display
- Mix of display and action components
- Layout is `split` or `stacked`

```
+---------------------------------------------------------------------+
|  TEMPLATE SELECTED                                                   |
|                                                                      |
|  Detected type: Form                                                 |
|  Template: FormComponent.template.svelte                             |
|                                                                      |
|  Indicators:                                                         |
|    * Input components detected                                       |
|    * Submit event in liveview.events                                 |
|    * centered-card layout                                            |
|                                                                      |
|  Override template? [Enter to accept / type name]                    |
+---------------------------------------------------------------------+
```

---

## Phase 4: Generate Svelte Component

```
+======================================================================+
|  GEN GENERATING SVELTE COMPONENT                                      |
|  Output: assets/svelte/components/features/[area]/[Name].svelte       |
+======================================================================+
```

### Generation Rules

**Script Section:**
```svelte
<script lang="ts">
  import { pushEvent, pushEventAsync } from '$lib';
  // Import all components from ui_spec
  import { Component1, Component2 } from '$lib/components/ui';

  // Props from LiveView
  export let live: any;

  // Form state (if form template)
  let formData = {
    // From ui_spec.components with validation
  };

  // UI state
  let loading = false;
  let error: string | null = null;

  // Handlers from ui_spec.liveview.events
  async function handleSubmit() {
    loading = true;
    error = null;
    try {
      await pushEventAsync(live, 'event_name', formData);
      // Success handling from ui_spec.states.success
    } catch (e) {
      error = 'Error message from ui_spec.states.error';
    } finally {
      loading = false;
    }
  }
</script>
```

**Markup Section:**
- Generate component tree from `ui_spec.components`
- Include all 4 states (loading, error, empty, success)
- Apply layout from `ui_spec.layout`
- Include accessibility attributes

**Style Section:**
- No custom styles (use design tokens via components)
- Add `prefers-reduced-motion` respect

### Form Template Generation

```svelte
<script lang="ts">
  import { pushEventAsync } from '$lib';
  import { {Components} } from '$lib/components/ui';

  export let live: any;

  // Form state
  let {field1} = '';
  let {field2} = '';

  // UI state
  let loading = false;
  let error: string | null = null;

  // Validation (from ui_spec.components.validation)
  $: isValid = {validation_expression};

  async function handleSubmit() {
    if (!isValid) return;

    loading = true;
    error = null;

    try {
      await pushEventAsync(live, '{event_name}', { {fields} });
      // TODO: Handle success - {success.behavior}: {success.target}
    } catch (e) {
      error = '{error.copy}';
    } finally {
      loading = false;
    }
  }
</script>

<!-- Layout: {layout} -->
<div class="flex min-h-screen items-center justify-center p-4">
  <div class="w-full max-w-md">
    <!-- Error State -->
    {#if error}
      <Alert variant="error" class="mb-4">
        {error}
      </Alert>
    {/if}

    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <!-- Components from ui_spec -->
      {#each components}
      <FormField label="{label}" error={fieldError}>
        <{Component} bind:value={{field}} {...props} />
      </FormField>
      {/each}

      <!-- Submit Button -->
      <Button
        type="submit"
        variant="primary"
        size="md"
        {loading}
        disabled={loading || !isValid}
      >
        {loading ? '{loading.content}' : '{button.content}'}
      </Button>
    </form>
  </div>
</div>
```

### List Template Generation

```svelte
<script lang="ts">
  import { {Components} } from '$lib/components/ui';

  export let live: any;
  export let items: any[] = [];

  let loading = true;
  let error: string | null = null;
</script>

<div class="p-4">
  <!-- Loading State -->
  {#if loading}
    <div class="space-y-4">
      {#each Array(3) as _}
        <Skeleton variant="card" />
      {/each}
    </div>

  <!-- Error State -->
  {:else if error}
    <EmptyState
      preset="error"
      title="Something went wrong"
      description={error}
      on:retry={() => { /* TODO: Reload */ }}
    />

  <!-- Empty State -->
  {:else if items.length === 0}
    <EmptyState
      preset="{empty.preset}"
      title="{empty.title}"
      description="{empty.description}"
    >
      <Button variant="primary">{empty.action}</Button>
    </EmptyState>

  <!-- Success State: Data -->
  {:else}
    <AnimatedList {items} animation="fade" stagger={50} let:item>
      <!-- TODO: Item component -->
      <Card>
        {JSON.stringify(item)}
      </Card>
    </AnimatedList>
  {/if}
</div>
```

---

## Phase 5: Generate LiveView Shell

```
+======================================================================+
|  GEN GENERATING LIVEVIEW                                              |
|  Output: lib/syna_web/live/[area]/[name]_live.ex                      |
+======================================================================+
```

### LiveView Template

```elixir
defmodule {liveview.module} do
  use SynaWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> assign(:page_title, "{title}")
     # TODO: Load initial data
    }
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.svelte
      name="{ComponentName}"
      props={%{
        # TODO: Pass data to component
      }}
      socket={@socket}
    />
    """
  end

  # Event handlers from ui_spec.liveview.events
  {#each events}
  @impl true
  def handle_event("{event.name}", %{{payload_destructure}}, socket) do
    # TODO: Implement {event.name}
    # Payload: {event.payload}
    {:noreply, socket}
  end
  {/each}
end
```

### Auth-Protected LiveView

If feature is in `auth` area or requires authentication:

```elixir
defmodule {liveview.module} do
  use SynaWeb, :live_view

  on_mount {SynaWeb.UserAuth, :ensure_authenticated}

  # ... rest of module
end
```

---

## Phase 6: Generate Test Stubs

```
+======================================================================+
|  GEN GENERATING TEST STUBS                                            |
|  Output: test/syna_web/live/[area]/[name]_live_test.exs               |
+======================================================================+
```

### Map Scenarios to Tests

For each acceptance scenario:
- Given → Arrange (setup)
- When → Act (action)
- Then → Assert (verify)

```elixir
defmodule {TestModule} do
  use SynaWeb.ConnCase, async: true

  import Phoenix.LiveViewTest

  describe "{feature_name}" do
    {#each scenarios}
    test "{scenario.name}", %{conn: conn} do
      # ARRANGE: Given {scenario.given}
      # TODO: Setup test data

      # ACT: When {scenario.when}
      {:ok, view, _html} = live(conn, ~p"/{path}")
      # TODO: Perform action

      # ASSERT: Then {scenario.then}
      # TODO: Add assertions
      assert true
    end
    {/each}
  end
end
```

### Test Helpers

Include appropriate test helpers based on feature:

```elixir
# For auth features
import SynaWeb.AuthTestHelpers

# For data features
import Syna.Factory

# For async features
import Syna.AsyncTestHelpers
```

---

## Phase 7: Verification

```
+======================================================================+
|  GEN VERIFICATION                                                     |
|  Checking generated files...                                          |
+======================================================================+
```

### File Verification

```bash
# Check Svelte component compiles
cd assets && npm run check

# Check LiveView compiles
mix compile --warnings-as-errors

# Run generated tests (should fail - TDD)
mix test test/syna_web/live/{area}/{name}_live_test.exs
```

```
+---------------------------------------------------------------------+
|  GENERATION COMPLETE                                                 |
|                                                                      |
|  Files created:                                                      |
|    [x] assets/svelte/components/features/{area}/{Name}.svelte        |
|    [x] lib/syna_web/live/{area}/{name}_live.ex                       |
|    [x] test/syna_web/live/{area}/{name}_live_test.exs                |
|                                                                      |
|  Verification:                                                       |
|    [x] Svelte compiles                                               |
|    [x] LiveView compiles                                             |
|    [!] Tests fail (expected - TDD red phase)                         |
|                                                                      |
|  TODO markers: [N] items need implementation                         |
|                                                                      |
|  Next steps:                                                         |
|    1. Run /vibe [ID] to implement with TDD                           |
|    2. Or manually complete TODO markers                              |
|                                                                      |
|  Generated scaffold is ~70-80% complete.                             |
|  Business logic and edge cases require manual implementation.        |
+---------------------------------------------------------------------+
```

---

## Generated Code Markers

The scaffold includes TODO markers for manual completion:

```elixir
# TODO: Implement {description}
# TODO: Handle success - {behavior}: {target}
# TODO: Load initial data
# TODO: Add assertions
```

Use `/vibe [ID]` to complete implementation with TDD workflow.

---

## Options

### `--dry-run`

Show what would be generated without writing files:

```bash
/vibe generate AUTH-001 --dry-run
```

### `--force`

Overwrite existing files:

```bash
/vibe generate AUTH-001 --force
```

### `--component-only`

Generate only the Svelte component:

```bash
/vibe generate AUTH-001 --component-only
```

### `--liveview-only`

Generate only the LiveView:

```bash
/vibe generate AUTH-001 --liveview-only
```

---

## Anti-Patterns

- Never generate without valid `ui_spec` (error and guide user)
- Never skip component validation (catch errors early)
- Never generate without all 4 states defined
- Never hardcode strings (use Copy from spec)
- Never skip accessibility attributes
- Never generate tests that pass (TDD requires red phase)
- Never auto-run generated code (user should review first)
- Never generate duplicate files without `--force` flag
