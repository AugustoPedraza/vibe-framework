# Native Mobile Patterns (PWA)

> Achieving native-like mobile UX in PWA. Users don't ask for these patterns - they just expect them.

## Quick Index

| Pattern | Android | iOS | Section |
|---------|---------|-----|---------|
| Background uploads | Full | Pauses when backgrounded | [#background-processing](#background-processing) |
| Draft persistence | Full | Full | [#draft-persistence](#draft-persistence) |
| Camera/Mic | Full | Full | [#media-capture](#media-capture) |
| Haptic feedback | Full | iOS 18 workaround | [#haptic-feedback](#haptic-feedback) |
| Push notifications | Full | iOS 16.4+ (home screen) | [#push-notifications](#push-notifications) |
| File pickers | Full | Full | [#file-access](#file-access) |
| Sharing | Full | Full | [#sharing](#sharing) |

---

## Platform Capability Matrix (2025)

### Background & Offline

| API | Android/Chrome | iOS Safari | Impact |
|-----|----------------|------------|--------|
| Background Sync | Full | NOT supported | Cannot auto-sync when backgrounded |
| Background Fetch | Full | NOT supported | Cannot continue uploads in background |
| Service Worker (bg) | Continues | Stops within seconds | iOS kills SW on background |
| IndexedDB | Excellent | ~50MB, may evict after 7 days | Use `navigator.storage.persist()` |
| localStorage | 5-10MB | ~5MB | Reliable for small critical data |

### Media & Sensors

| Feature | Android | iOS Safari | Notes |
|---------|---------|------------|-------|
| Camera/Mic | Full | Full (since 13.0) | `getUserMedia()` |
| MediaRecorder | Full | Needs Settings toggle | iOS: Settings > Safari > Advanced |
| Lock screen controls | Full | Full (since 15.0) | MediaSession API |
| Background audio | Continues | Pauses | Cannot achieve on iOS without Capacitor |
| Vibration | Full | NOT supported | Use visual feedback on iOS |

### Sharing & Communication

| Feature | Android | iOS Safari | Notes |
|---------|---------|------------|-------|
| Web Share | Full | Full (since 12.1) | Share to other apps |
| Share files | Full | Full (since 15.0) | Share photos/videos |
| Contact picker | Full | No | Android only |
| Push notifications | Full | iOS 16.4+ (home screen) | Must be installed PWA |

---

## Background Processing

> **Use when**: Uploads, message sending, any action that should survive app backgrounding.

### The Reality

| Platform | Behavior |
|----------|----------|
| Android | Uploads continue in background via Background Sync/Fetch |
| iOS | Uploads PAUSE when backgrounded, resume when user returns |

### Implementation Pattern

```typescript
// $lib/stores/uploads.ts
import { writable, get } from 'svelte/store';
import { visibility } from './visibility';
import { isConnected } from './connection';

const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

interface UploadProgress {
  id: string;
  filename: string;
  totalSize: number;
  totalChunks: number;
  uploadedChunks: number[];
  status: 'pending' | 'uploading' | 'paused' | 'completed' | 'failed';
  createdAt: number;
  updatedAt: number;
  retries: number;
}

export class UploadManager {
  private uploads = writable<Map<string, UploadProgress>>(new Map());
  private abortControllers = new Map<string, AbortController>();

  constructor() {
    this.initVisibilityHandler();
    this.restoreFromStorage();
  }

  private initVisibilityHandler() {
    visibility.subscribe((state) => {
      if (state === 'hidden') {
        this.saveAllProgress();
      } else {
        this.checkForResumableUploads();
      }
    });
  }

  async createUpload(config: { file: File | Blob; filename: string }): Promise<string> {
    const id = crypto.randomUUID();
    const totalChunks = Math.ceil(config.file.size / CHUNK_SIZE);

    const progress: UploadProgress = {
      id,
      filename: config.filename,
      totalSize: config.file.size,
      totalChunks,
      uploadedChunks: [],
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      retries: 0,
    };

    // Store file chunks in IndexedDB
    await this.storeFileChunks(id, config.file);

    // Save progress to localStorage
    this.saveProgress(progress);

    // Start if online and foreground
    if (get(isConnected) && document.visibilityState === 'visible') {
      this.startUpload(id);
    }

    return id;
  }

  private saveProgress(progress: UploadProgress) {
    localStorage.setItem(`upload_progress_${progress.id}`, JSON.stringify(progress));
  }

  private saveAllProgress() {
    const current = get(this.uploads);
    for (const [id, progress] of current) {
      if (progress.status === 'uploading') {
        progress.status = 'paused';
        this.saveProgress(progress);
      }
    }
  }

  getProgress(id: string): UploadProgress | null {
    const stored = localStorage.getItem(`upload_progress_${id}`);
    return stored ? JSON.parse(stored) : null;
  }

  async resumeUpload(id: string) {
    const progress = this.getProgress(id);
    if (!progress || progress.status === 'completed') return;

    progress.status = 'uploading';
    this.saveProgress(progress);

    // Resume from last uploaded chunk
    await this.uploadFromChunk(id, progress.uploadedChunks.length);
  }

  pauseUpload(id: string) {
    const controller = this.abortControllers.get(id);
    controller?.abort();

    const progress = this.getProgress(id);
    if (progress) {
      progress.status = 'paused';
      this.saveProgress(progress);
    }
  }
}

export const uploadManager = new UploadManager();
```

### UX Guidelines

| Platform | Show This |
|----------|-----------|
| iOS | "Keep the app open while uploading" |
| Android | "Upload will continue in the background" |
| Both (paused) | "Upload paused - tap to resume" |
| Both (failed) | "Upload failed - tap to retry" |

---

## Draft Persistence

> **Use when**: Any text input that should survive crashes, battery death, navigation.

### Implementation Pattern

```typescript
// $lib/stores/drafts.ts
import { writable, get } from 'svelte/store';

interface Draft {
  id: string;
  contextType: 'message' | 'post' | 'comment';
  contextId: string;
  content: string;
  savedAt: number;
  version: number;
}

const STORAGE_KEY = 'pwa_drafts';
const DEBOUNCE_LS = 500;  // localStorage: fast, frequent
const DEBOUNCE_IDB = 2000; // IndexedDB: slower, durable

export class DraftStore {
  private cache = new Map<string, Draft>();
  private debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

  private getKey(type: string, id: string): string {
    return `${type}:${id}`;
  }

  async save(draft: Omit<Draft, 'id' | 'savedAt' | 'version'>): Promise<void> {
    const key = this.getKey(draft.contextType, draft.contextId);
    const existing = this.cache.get(key);

    const fullDraft: Draft = {
      ...draft,
      id: existing?.id || crypto.randomUUID(),
      savedAt: Date.now(),
      version: (existing?.version || 0) + 1,
    };

    // 1. Update memory immediately
    this.cache.set(key, fullDraft);

    // 2. Debounced localStorage save
    this.debouncedSave(key, fullDraft, DEBOUNCE_LS, 'localStorage');

    // 3. Debounced IndexedDB save
    this.debouncedSave(key, fullDraft, DEBOUNCE_IDB, 'indexedDB');
  }

  private debouncedSave(key: string, draft: Draft, delay: number, target: string) {
    const timerKey = `${target}:${key}`;
    const existing = this.debounceTimers.get(timerKey);
    if (existing) clearTimeout(existing);

    this.debounceTimers.set(timerKey, setTimeout(() => {
      if (target === 'localStorage') {
        this.saveToLocalStorage(draft);
      } else {
        this.saveToIndexedDB(draft);
      }
    }, delay));
  }

  async recover(): Promise<Draft[]> {
    const recovered: Draft[] = [];

    // 1. Try localStorage first (most reliable)
    const lsDrafts = this.getAllFromLocalStorage();
    for (const draft of Object.values(lsDrafts)) {
      recovered.push(draft);
    }

    // 2. Check IndexedDB for any missing/newer
    const idbDrafts = await this.getAllFromIndexedDB();
    for (const draft of idbDrafts) {
      const existing = recovered.find(d =>
        d.contextType === draft.contextType && d.contextId === draft.contextId
      );

      if (!existing || draft.version > existing.version) {
        if (existing) {
          const idx = recovered.indexOf(existing);
          recovered[idx] = draft;
        } else {
          recovered.push(draft);
        }
      }
    }

    return recovered;
  }
}

export const draftStore = new DraftStore();
```

---

## Haptic Feedback

> **Use when**: Button taps, toggles, confirmations, errors.

### The Reality

| Platform | Support | Pattern |
|----------|---------|---------|
| Android | Full | Vibration API |
| iOS Safari | NOT supported | Use visual feedback |
| iOS 18+ | Workaround | Hidden checkbox trick |

### Implementation Pattern

```typescript
// $lib/utils/haptics.ts
export type HapticType = 'light' | 'medium' | 'success' | 'warning' | 'error';

const patterns: Record<HapticType, number[]> = {
  light: [10],
  medium: [20],
  success: [10, 50, 10],
  warning: [30, 30, 30],
  error: [50, 30, 50],
};

export function haptic(type: HapticType = 'light'): void {
  // Respect reduced motion preference
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Try Vibration API (Android)
  if ('vibrate' in navigator) {
    navigator.vibrate(patterns[type]);
    return;
  }

  // iOS 18+ workaround
  if (isIOS18OrLater()) {
    triggerIOSHaptic();
  }

  // Otherwise: no haptic, rely on visual feedback
}

function isIOS18OrLater(): boolean {
  const match = navigator.userAgent.match(/OS (\d+)/);
  return match ? parseInt(match[1]) >= 18 : false;
}

function triggerIOSHaptic(): void {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.setAttribute('switch', '');
  checkbox.id = `haptic-${Date.now()}`;
  checkbox.style.cssText = 'position:absolute;opacity:0;pointer-events:none;';

  const label = document.createElement('label');
  label.setAttribute('for', checkbox.id);

  document.body.appendChild(checkbox);
  document.body.appendChild(label);

  label.click();

  requestAnimationFrame(() => {
    checkbox.remove();
    label.remove();
  });
}
```

### Usage Guidelines

| Action | Haptic Type | Visual Backup |
|--------|-------------|---------------|
| Button tap | `light` | Press animation |
| Toggle switch | `light` | Color change |
| Pull-to-refresh trigger | `medium` | Bounce animation |
| Success (sent, saved) | `success` | Checkmark animation |
| Error (failed) | `error` | Shake animation |
| Destructive action | `warning` | Red highlight |

---

## Sharing

> **Use when**: Share content to other apps.

### Implementation Pattern

```typescript
// $lib/utils/share.ts
interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

export async function share(data: ShareData): Promise<boolean> {
  if (!navigator.share) {
    // Fallback: copy to clipboard
    if (data.url) {
      await navigator.clipboard.writeText(data.url);
      return true;
    }
    return false;
  }

  // Check if files can be shared (Web Share 2.0)
  if (data.files?.length && !navigator.canShare?.({ files: data.files })) {
    // Remove files if not supported
    delete data.files;
  }

  try {
    await navigator.share(data);
    return true;
  } catch (e) {
    if ((e as Error).name === 'AbortError') {
      // User cancelled - not an error
      return false;
    }
    throw e;
  }
}
```

---

## PWA Platform Limitations

These features have limited or no PWA support. Design around them:

| Feature | PWA Reality | Design Strategy |
|---------|-------------|-----------------|
| Background audio | Pauses on iOS | Show "keep app open" message |
| Proximity sensor | No support | Use alternative UX patterns |
| Bluetooth | Android only | Feature-detect, hide on iOS |
| NFC | Android only | Feature-detect, hide on iOS |
| Deep linking | Limited | Use standard web URLs |
| App Store presence | PWA install only | Promote "Add to Home Screen" |

**Note**: This framework targets PWA-only. These are constraints to design around, not problems to solve with native wrappers.

---

## Verification Checklist

### Before Shipping Native-Like Features

- [ ] Tested on real iOS device (not just simulator)
- [ ] Tested on real Android device
- [ ] Handles permission denied gracefully
- [ ] Has visual feedback fallback (for missing haptics)
- [ ] Shows platform-appropriate messaging
- [ ] Works offline (or degrades gracefully)
- [ ] Upload progress saves on backgrounding
- [ ] Drafts recover after crash

---

## Related Docs

- [../../anti-patterns/pwa.md](../../anti-patterns/pwa.md) - PWA anti-patterns
