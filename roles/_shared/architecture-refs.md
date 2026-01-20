# Shared Architecture References

> **Include this reference table in roles that need architecture context.**
> Usage: `> See: roles/_shared/architecture-refs.md`

## Core Architecture Documents

| Doc | Purpose | When |
|-----|---------|------|
| `{{paths.architecture}}/_fundamentals/quick-reference.md` | Core decisions, anti-patterns | **Always** |
| `{{paths.architecture}}/_fundamentals/responsibility.md` | Frontend vs backend ownership | Feature design |
| `{{paths.architecture}}/18-anti-patterns.md` | Patterns to avoid | **Always** |

## Domain & Testing

| Doc | Purpose | When |
|-----|---------|------|
| `{{paths.architecture}}/_guides/testing.md` | Test pyramid, coverage, E2E | Writing tests |
| `{{paths.architecture}}/_guides/errors.md` | Error handling patterns | Error scenarios |
| `{{paths.domain}}/GLOSSARY.md` | Domain terms | Feature specs, naming |

## Frontend Architecture

| Doc | Purpose | When |
|-----|---------|------|
| `{{paths.architecture}}/04-frontend-components.md` | Svelte architecture | Frontend work |
| `{{paths.architecture}}/_guides/ux-design-philosophy.md` | UX principles | Design decisions |
| `{{paths.architecture}}/_guides/component-intent.md` | Component selection | Choosing UI patterns |
| `{{paths.architecture}}/_guides/visual-design-system.md` | Visual polish | UI implementation |
| `{{paths.architecture}}/_patterns/design-tokens.md` | Design token reference | Styling |

## Backend Architecture

| Doc | Purpose | When |
|-----|---------|------|
| `{{paths.architecture}}/03-domain-ash.md` | Ash resource patterns | Backend work |
| `{{paths.architecture}}/16-error-handling.md` | Error flow | Error handling |
| `{{paths.architecture}}/15-authentication.md` | Auth patterns | Auth features |

## Mobile & PWA

| Doc | Purpose | When |
|-----|---------|------|
| `{{paths.architecture}}/11-mobile-first.md` | Mobile patterns | Mobile UX |
| `{{paths.architecture}}/19-pwa-native-experience.md` | PWA patterns | PWA features |
| `{{paths.architecture}}/_patterns/native-mobile.md` | Native-like PWA | Native features |

## Motion & Animation

| Doc | Purpose | When |
|-----|---------|------|
| `{{paths.architecture}}/20-motion-system.md` | Motion patterns | Animations |
| `{{paths.architecture}}/08-app-shell.md` | Shell patterns | App shell work |

## Pattern Catalogs

These docs are **reference catalogs** - pull patterns when features need them:

- `{{paths.architecture}}/08-app-shell.md` - Tabs, navigation, badges
- `{{paths.architecture}}/11-mobile-first.md` - Touch targets, swipe, haptics
- `{{paths.architecture}}/19-pwa-native-experience.md` - Offline, form preservation
- `{{paths.architecture}}/20-motion-system.md` - Modal, sheet, toast animations
- `{{paths.architecture}}/_patterns/native-mobile.md` - Camera, uploads, platform limits
- `~/.claude/vibe-ash-svelte/patterns/` - Reusable project patterns (see index.json)
