# Platform Constraints (PWA)

> **Include this section in roles that deal with native-like features.**
> Usage: `> See: roles/_shared/platform-constraints.md`

## PWA Platform Reality

This is a Progressive Web App. Native APIs have platform-specific limitations.

### Quick Reference: iOS vs Android

| Feature | iOS PWA | Android PWA |
|---------|---------|-------------|
| Background uploads | **Pauses** when backgrounded | Continues |
| Background audio | **Pauses** when backgrounded | Continues |
| Haptic feedback | **Not available** | Vibration API works |
| Push notifications | Requires home screen install | Standard behavior |
| Bluetooth/NFC | **Not supported** | Supported |
| File system access | **Not supported** | Limited support |
| Contact picker | **Not supported** | Contact Picker API |

### Design Implications

| When You See | Design Fallback |
|--------------|-----------------|
| "Vibrate on action" | Add visual feedback (scale, color change) |
| "Continue in background" | Show "Keep app open" message on iOS |
| "Access contacts" | Use manual entry, skip contact import |
| "Background sync" | Queue + resume on return pattern |

### Feature Spec Additions

For features involving native-like behavior, include:

```markdown
## Platform Considerations

| Platform | Behavior | Workaround |
|----------|----------|------------|
| **iOS** | [specific limitation] | [fallback approach] |
| **Android** | [expected behavior] | - |
```

### Example Platform Sections

#### File Upload Feature
```markdown
## Platform Considerations
| Platform | Behavior | Workaround |
|----------|----------|------------|
| **iOS** | Upload pauses when backgrounded | Save progress, resume on return, show guidance |
| **Android** | Upload continues in background | - |
```

#### Haptic Feedback Feature
```markdown
## Platform Considerations
| Platform | Behavior | Workaround |
|----------|----------|------------|
| **iOS** | Vibration API not available | Use visual feedback (scale animation, color pulse) |
| **Android** | Standard vibration patterns | - |
```

### When to Escalate to Architect

Raise for architecture discussion if feature requires:
- True background audio playback (may need Capacitor)
- Bluetooth/NFC on iOS (requires Capacitor)
- Proximity sensor access (requires Capacitor)
- Deep OS integration beyond PWA capabilities

### Red Flags in Requirements

| User Request | Reality Check |
|--------------|---------------|
| "Works like WhatsApp voice messages" | iOS cannot do background recording |
| "Upload continues when I close the app" | iOS: no. Android: yes |
| "Vibrate on every tap" | iOS: not possible |
| "Access phone contacts" | iOS: not supported in PWA |

### Full Reference

See `{{paths.architecture}}/_patterns/native-mobile.md` for:
- Detailed platform capabilities
- Implementation patterns
- Testing requirements
- UX design guidance
