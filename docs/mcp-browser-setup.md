# MCP Browser Setup Guide

> Required for UI validation during `/vibe` and `/vibe polish` workflows

## Quick Setup (3 commands)

```bash
# 1. Install Playwright MCP server (Microsoft official)
npm install -D @playwright/mcp

# 2. Install browser
npx playwright install chromium

# 3. Add to ~/.claude/settings.json:
# {
#   "mcpServers": {
#     "playwright": {
#       "command": "npx",
#       "args": ["@playwright/mcp", "--headless"]
#     }
#   }
# }
```

**Note:** MCP tools are only available in the main session. Subagents spawned via Task tool cannot access MCP servers (Claude Code limitation). The `/vibe polish` command and Phase 3 MCP validation account for this by running in the main session.

---

## Overview

The UI validation feature uses MCP (Model Context Protocol) browser tools to:
- Render Svelte components with mock props
- Inspect DOM elements (dimensions, styles, accessibility)
- Validate against design system rules
- Provide fast feedback during development

**No screenshots needed** - validation works by inspecting the actual DOM.

---

## Prerequisites

- Node.js 18+
- Claude Code CLI with MCP support
- Dev server running (Phoenix/Vite)

---

## Installation Options

### Option 1: Playwright MCP Server (Recommended)

```bash
# Install globally
npm install -g @playwright/mcp

# Or add to your project
npm install --save-dev @playwright/mcp
```

**Configure in Claude settings** (`~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp", "--headless"]
    }
  }
}
```

### Option 2: Browser MCP Extension

For Chrome-based validation:

1. Install from Chrome Web Store: [Browser MCP](https://chromewebstore.google.com/detail/browser-mcp-automate-your/bjfgambnhccakkhmkepdoekmckoijdlc)

2. Configure in Claude settings:

```json
{
  "mcpServers": {
    "browser": {
      "command": "browser-mcp",
      "args": ["--headless"]
    }
  }
}
```

### Option 3: Puppeteer MCP Server

```bash
npm install -g @anthropic-ai/mcp-server-puppeteer
```

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server-puppeteer"],
      "env": {
        "PUPPETEER_HEADLESS": "true"
      }
    }
  }
}
```

---

## Project Configuration

Add UI validation config to your project's `.claude/vibe.config.json`:

```json
{
  "ui_validation": {
    "enabled": true,
    "blocking": true,
    "mcp_server": "@anthropic-ai/mcp-server-playwright",

    "dev_server": {
      "url": "http://localhost:4000",
      "startup_command": "mix phx.server",
      "ready_timeout": 30
    },

    "temp_file": {
      "path": "assets/__validate__.html",
      "base_css": "/assets/app.css",
      "cleanup": true
    },

    "viewports": [
      { "name": "mobile", "width": 375, "height": 812 },
      { "name": "desktop", "width": 1280, "height": 800 }
    ],

    "rules": {
      "touch_target_min": 44,
      "button_heights": [32, 40, 48],
      "spacing_grid": 4,
      "primary_action_zone": "bottom_half",
      "focus_visible_required": true,
      "skeleton_for_loading": true
    },

    "parallel": {
      "enabled": true,
      "max_agents": 4
    },

    "auto_fix": {
      "spacing": true,
      "design_tokens": true,
      "aria_labels": true,
      "layout": false
    },

    "components": {
      "SendMessage": {
        "path": "features/chat/SendMessage.svelte",
        "states": {
          "loading": { "loading": true, "messages": [], "error": null },
          "empty": { "loading": false, "messages": [], "error": null },
          "error": { "loading": false, "messages": [], "error": "Failed to load" },
          "success": { "loading": false, "messages": [{"id": 1, "text": "Hi"}], "error": null }
        }
      }
    }
  }
}
```

---

## How It Works

### During `/vibe [FEATURE-ID]`

1. **AI creates temp validation file:**

```html
<!-- assets/__validate__.html (temporary, auto-deleted) -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/assets/app.css">
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import SendMessage from '/src/components/features/chat/SendMessage.svelte';

    new SendMessage({
      target: document.getElementById('app'),
      props: {
        loading: true,
        messages: [],
        error: null
      }
    });
  </script>
</body>
</html>
```

2. **MCP Browser opens the page:**
   - Sets viewport (mobile/desktop)
   - Waits for component to render

3. **DOM Inspection (no screenshots):**
   - `boundingBox()` - Check element dimensions
   - `getComputedStyle()` - Check spacing, colors
   - `focus()` - Test focus visibility
   - `evaluate()` - Run custom checks

4. **Validation Results:**
   - Touch targets >= 44px
   - Button heights in [32, 40, 48]
   - Spacing on 4px grid
   - Design tokens used (no raw colors)
   - Focus visible on interactives
   - Primary action in bottom half (mobile)

5. **AI deletes temp file**

6. **Report displayed:**

```
+---------------------------------------------------------------------+
|  UI VALIDATION: SendMessage                                          |
|  States: 4 | Viewports: 2 | Checks: 8                                |
+---------------------------------------------------------------------+
|                                                                      |
|              │ mobile (375x812)     │ desktop (1280x800)             |
|  ───────────┼──────────────────────┼───────────────────────────────  |
|  loading    │ [OK] 6/6 rules       │ [OK] 6/6 rules                 |
|  empty      │ [OK] 6/6 rules       │ [OK] 6/6 rules                 |
|  error      │ [FAIL] Touch target  │ [OK] 6/6 rules                 |
|             │   Retry btn: 36px    │                                |
|  success    │ [OK] 6/6 rules       │ [OK] 6/6 rules                 |
|                                                                      |
|  Status: BLOCKED (1 error)                                           |
+---------------------------------------------------------------------+
```

---

## Validation Rules Reference

### Dimensions (from `rules` config)

| Rule | Check | Default |
|------|-------|---------|
| `touch_target_min` | Interactive elements >= Npx | 44px |
| `button_heights` | Buttons match design system | [32, 40, 48] |
| `input_height` | Input fields height | 40px |
| `spacing_grid` | Padding/margin divisible by N | 4px |

### Layout (mobile only)

| Rule | Check |
|------|-------|
| `primary_action_zone: bottom_half` | Submit/primary buttons in bottom 50% of viewport |

### Accessibility

| Rule | Check |
|------|-------|
| `focus_visible_required` | All interactives have visible focus indicator |
| Aria labels | Icon-only buttons have `aria-label` |
| Form labels | Inputs have associated labels |

### Design Tokens

| Rule | Check |
|------|-------|
| No raw colors | `bg-blue-500` → should be `bg-primary` |
| No arbitrary values | `w-[300px]` → should use standard spacing |
| No invalid spacing | `p-5`, `m-7` → not in allowed list |
| No invalid radius | `rounded-xl` → should be `rounded-lg` |

### States

| Rule | Check |
|------|-------|
| `skeleton_for_loading` | Loading states use skeleton, not spinner |

---

## Human Intervention

When validation fails and AI can't auto-fix:

```
+---------------------------------------------------------------------+
|  UI VALIDATION BLOCKED                                               |
|                                                                      |
|  Issue: Primary action in top half (thumb zone violation)            |
|  Component: LoginForm.svelte                                         |
|  Element: <Button type="submit">Sign In</Button>                     |
|  Current: y = 180px                                                  |
|  Required: y > 406px (bottom 50%)                                    |
|                                                                      |
|  AI Assessment:                                                      |
|    Form is vertically centered. Options:                             |
|    1. Move button outside form, anchor to bottom                     |
|    2. Use flex column-reverse                                        |
|    3. Add spacer to push content down                                |
|                                                                      |
|  [1-3] Apply suggested fix                                           |
|  [f] Provide fix hint (describe what to do)                          |
|  [s] Skip this rule (add exception)                                  |
|  [m] I'll fix manually (pause validation)                            |
|  [a] Abort scenario                                                  |
+---------------------------------------------------------------------+
```

**Options:**

- **[1-3]** - AI applies the suggested fix and re-validates
- **[f]** - You describe what to do, AI implements
- **[s]** - Skip rule, record exception (flagged in PR)
- **[m]** - You fix manually, then continue validation
- **[a]** - Abort current scenario

---

## Exceptions

When you skip a rule with `[s]`, it's recorded:

```json
// .claude/verification/{FEATURE-ID}/ui-exceptions.json
{
  "exceptions": [
    {
      "rule": "primary_action_zone",
      "component": "LoginForm.svelte",
      "reason": "Design requires centered form for brand consistency",
      "approved_by": "human",
      "timestamp": "2026-01-23T12:00:00Z"
    }
  ]
}
```

Exceptions are:
- Shown in QA Validation summary
- Included in PR description
- Require re-approval if component changes significantly

---

## Troubleshooting

### MCP Server Not Found

```
Error: MCP server 'playwright' not configured
```

**Fix:** Check `~/.claude/settings.json` has the MCP server configured.

### Dev Server Not Running

```
Error: Could not connect to http://localhost:4000
```

**Fix:** Start your dev server before running `/vibe`.

### Component Import Fails

```
Error: Cannot find module './components/features/chat/SendMessage.svelte'
```

**Fix:** Check `ui_validation.components[name].path` matches actual file location.

### Validation Times Out

```
Error: Validation timed out after 30s
```

**Fix:**
- Increase `dev_server.ready_timeout`
- Check component doesn't have infinite loading state
- Ensure mock props are valid

---

## Parallel Validation

When `parallel.enabled: true`, AI spawns multiple agents:

```
Validating SendMessage...
  ├─► Agent 1: mobile + loading
  ├─► Agent 2: mobile + empty
  ├─► Agent 3: mobile + error
  ├─► Agent 4: mobile + success
  (wait for batch)
  ├─► Agent 1: desktop + loading
  ├─► Agent 2: desktop + empty
  ...
```

Results merged into single report. Max agents controlled by `parallel.max_agents`.

---

## Adding New Components

1. Add to `ui_validation.components` in `vibe.config.json`:

```json
{
  "components": {
    "MyNewComponent": {
      "path": "features/myfeature/MyNewComponent.svelte",
      "states": {
        "loading": { "loading": true },
        "empty": { "data": [] },
        "error": { "error": "Something went wrong" },
        "success": { "data": [{ "id": 1 }] }
      },
      "viewports": ["mobile"],
      "skip_rules": ["primary_action_zone"]
    }
  }
}
```

2. AI will automatically validate during `/vibe` when this component is modified.

---

## Disabling Validation

### Temporarily (single session)

```
/vibe AUTH-001 --skip-ui-validation
```

### Per component

```json
{
  "components": {
    "LegacyComponent": {
      "path": "legacy/OldComponent.svelte",
      "skip": true
    }
  }
}
```

### Globally

```json
{
  "ui_validation": {
    "enabled": false
  }
}
```

---

## Best Practices

1. **Define states early** - Add component states to config when creating feature spec
2. **Use realistic mock data** - Props should mirror real LiveView assigns
3. **Test mobile first** - Most validation issues appear on small screens
4. **Don't skip rules lightly** - Exceptions should be rare and justified
5. **Keep components registered** - Add new components to config immediately

---

## Related Docs

- [vibe.md](../commands/vibe.md) - Main workflow documentation
- [polish.md](../commands/polish.md) - UI polish validation
- [ui-polish.md](../rules/ui-polish.md) - UI polish rules (auto-loaded)
- [ui-agent.md](../agents/ui-agent.md) - UI agent workflow
