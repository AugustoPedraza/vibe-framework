# UI/UX Pro Max Integration

> Design intelligence skill for professional UI/UX across multiple platforms.

**Source:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

---

## Overview

This integration provides the Designer role and UI Agent with:
- **67 UI Styles** (Glassmorphism, Neumorphism, Brutalism, Bento Grid, etc.)
- **96 Color Palettes** organized by industry (SaaS, Fintech, Healthcare, etc.)
- **57 Font Pairings** with Google Fonts imports
- **100 Industry-Specific Reasoning Rules**
- **99 UX Guidelines** for best practices
- **Svelte Stack Support** with component examples

---

## Installation

### Option 1: Claude Code Marketplace (Recommended)

```bash
# Install via Claude Code
/install-skill ui-ux-pro-max
```

### Option 2: Manual Installation

```bash
# Clone to shared location
git clone https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git ~/.claude/skills/ui-ux-pro-max-skill

# Create symlink for skill access
ln -s ~/.claude/skills/ui-ux-pro-max-skill/.claude/skills/ui-ux-pro-max ~/.claude/skills/ui-ux-pro-max
```

### Option 3: Project-Local

```bash
# Clone into project
git clone https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git .claude/skills/ui-ux-pro-max-skill
```

---

## Skill Location

The skill should be accessible at one of:
1. `~/.claude/skills/ui-ux-pro-max/` (user-global)
2. `{project}/.claude/skills/ui-ux-pro-max/` (project-local)

---

## Search Commands

The skill provides a powerful search engine for design decisions.

### Domain Search

```bash
python3 {SKILL_PATH}/scripts/search.py "<query>" --domain <domain>
```

| Domain | What It Searches |
|--------|------------------|
| `product` | Product type recommendations (SaaS, e-commerce, portfolio) |
| `style` | UI styles + AI prompts + CSS keywords |
| `typography` | Font pairings with Google Fonts imports |
| `color` | Color palettes by product type |
| `landing` | Page structure and CTA strategies |
| `chart` | Chart types and library recommendations |
| `ux` | Best practices and anti-patterns |

### Stack-Specific Search

```bash
python3 {SKILL_PATH}/scripts/search.py "<query>" --stack svelte
```

**Available stacks:** `html-tailwind`, `react`, `nextjs`, `astro`, `vue`, `nuxtjs`, `nuxt-ui`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`

### Search Examples

```bash
# Find UI style for a SaaS dashboard
python3 search.py "dashboard" --domain style

# Get color palette for fintech app
python3 search.py "fintech banking" --domain color

# Find font pairing for mobile app
python3 search.py "mobile app modern" --domain typography

# Get Svelte-specific component patterns
python3 search.py "card component" --stack svelte

# Find UX guidelines for forms
python3 search.py "form validation" --domain ux
```

---

## Integration with Designer Role

### When to Use the Skill

| Design Decision | Search Command |
|-----------------|----------------|
| Choosing visual style | `--domain style` |
| Picking color palette | `--domain color` |
| Selecting typography | `--domain typography` |
| UX pattern validation | `--domain ux` |
| Component patterns | `--stack svelte` |

### Workflow Integration

Before making major design decisions in the Designer role:

```
1. IDENTIFY the design decision type
2. RUN appropriate search command
3. REVIEW results and select best fit
4. APPLY to design tokens / wireframes
5. DOCUMENT decision rationale
```

### Example: New Feature Design

```bash
# 1. Determine product type and get style recommendations
python3 search.py "mobile pwa saas" --domain product

# 2. Get color palette for the product type
python3 search.py "saas professional" --domain color

# 3. Get typography recommendations
python3 search.py "mobile app professional" --domain typography

# 4. Validate UX patterns
python3 search.py "mobile navigation" --domain ux
```

---

## Integration with UI Agent

### Component Generation

When the UI Agent creates new components, reference the skill for:

```bash
# Get component structure for Svelte
python3 search.py "button component" --stack svelte

# Get chart recommendations
python3 search.py "analytics chart" --domain chart --stack svelte
```

### Design Token Alignment

The skill's color palettes can inform your design tokens:

```bash
# Search for palette
python3 search.py "fintech modern" --domain color

# Output includes OKLCH values that map to:
# --color-primary, --color-secondary, etc.
```

---

## Database Contents

### UI Styles (67 total)

Categories include:
- Glassmorphism, Claymorphism, Neumorphism
- Minimalism, Brutalism, Maximalism
- Bento Grid, Card-based layouts
- Dark Mode, AI-Native UI
- Retro, Vintage, Futuristic

### Color Palettes (96 total)

Industries covered:
- Tech & SaaS
- Finance & Fintech
- Healthcare & Wellness
- E-commerce & Retail
- Beauty & Lifestyle
- Education & EdTech
- Gaming & Entertainment

### Font Pairings (57 total)

Each includes:
- Heading + Body font combination
- Google Fonts import code
- Use case recommendations
- Fallback stack

### UX Guidelines (99 total)

Topics include:
- Navigation patterns
- Form design
- Error handling
- Loading states
- Accessibility
- Mobile-first patterns
- Micro-interactions

---

## Design System Generation

The skill can generate complete design systems:

```bash
python3 {SKILL_PATH}/scripts/design_system.py \
  --product-type "saas" \
  --style "minimalist" \
  --output architecture/design-system.md
```

This generates a design system file compatible with the design-system-policer.

---

## Quick Reference

### Designer Role Commands

```bash
# Style exploration
python3 search.py "modern dashboard" --domain style

# Color palette
python3 search.py "professional saas" --domain color

# Typography
python3 search.py "clean readable" --domain typography

# UX validation
python3 search.py "form best practices" --domain ux
```

### UI Agent Commands

```bash
# Svelte components
python3 search.py "modal dialog" --stack svelte

# Chart selection
python3 search.py "data visualization" --domain chart
```

---

## Configuration

Add to `vibe.config.json`:

```json
{
  "integrations": {
    "ui-ux-pro-max": {
      "enabled": true,
      "path": "~/.claude/skills/ui-ux-pro-max-skill/src/ui-ux-pro-max",
      "default_stack": "svelte"
    }
  }
}
```

---

## Verification

Check skill is available:

```bash
# Test search
python3 ~/.claude/skills/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py "test" --domain style

# Should return style results
```

---

## Related Files

| File | Updates |
|------|---------|
| `roles/designer.md` | Reference this integration for design decisions |
| `agents/implementation/ui-agent.md` | Use for component patterns |
| `templates/design-system-template.md` | Can be generated by skill |
