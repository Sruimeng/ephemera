---
id: shared-utilities
type: reference
related_ids: [doc-standard, daily-world-api-quick-ref, system-overview, strategy-api-v5-migration]
---

# Shared Utilities Reference

## Type Definitions

```typescript
// Storage
type S<T> = T extends Record<string, any> ? T | null : string | null;

// Loading Hook
type LoadingRequest<T> = {
  request: (...args: Parameters<T>) => Promise<void>;
  isLoading: boolean;
};

// Keyboard Bindings
type KeyHandler = () => void;
interface KeyBindings {
  ArrowLeft?: KeyHandler;
  ArrowRight?: KeyHandler;
  Escape?: KeyHandler;
  Space?: KeyHandler;
  [key: string]: KeyHandler | undefined;
}

// Video URL Result
type VideoUrlResult =
  | { type: 'bilibili'; bvid: string }
  | { type: 'youtube'; src: string }
  | null;
```

## API Utilities

### Location
`/Users/mac/Desktop/project/Sruimeng/ephemera/app/lib/api.ts`

### Functions

```typescript
getDailyWorld(): Promise<NormalizedDailyWorld>
// Fetch today's data. Throws NotFoundError on 404.

getDailyWorldByDate(date: string): Promise<NormalizedDailyWorld>
// Fetch data for specific date (YYYY-MM-DD). Throws NotFoundError on 404.

healthCheck(): Promise<boolean>
// Check API server status.

normalizeData(raw: DailyWorldData): NormalizedDailyWorld
// Transform backend response to frontend format.
// - Converts http -> https
// - Maps object_description -> theme
// - Maps philosophy -> summary
// - Applies CORS proxy for tripo3d.com URLs

class NotFoundError extends Error
// Soft 404 error. Use to distinguish "no data" from network errors.
```

### Constants

```typescript
API_BASE = 'https://reify-sdk.zeabur.internal'
FALLBACK_MODEL_URL = 'https://raw.githubusercontent.com/...'
```

## Storage Utilities

### Location
`/Users/mac/Desktop/project/Sruimeng/ephemera/app/utils/storage.ts`

### Functions

```typescript
// Common Storage (no user prefix)
setCommonStorage(key: CommonStorage, value: unknown): void
getCommonStorage<T>(key: CommonStorage): S<T> | null
removeCommonStorage(key: CommonStorage): void

// User-Scoped Storage (auto-prefixed with userId)
setStorage(key: Storage, value: unknown): void
getStorage<T>(key: Storage): S<T> | null
removeStorage(key: Storage): void
```

### Storage Keys

```typescript
// app/constants/static/storage.ts
enum Storage {
  UID = 't_uid'
}

enum CommonStorage {
  Signup = 't_signup',
  Login = 't_login',
  UserDetail = 't_user_detail',
  EuCookie = 't.cookieAccept',
  Comment = 't_comment'
}
```

## Cookie Utilities

### Location
`/Users/mac/Desktop/project/Sruimeng/ephemera/app/utils/cookie.ts`

### Functions

```typescript
isInEU(): boolean
// Check if user is in EU timezone.

allowCookies(): boolean
// Check if cookies are allowed (EU users must consent).
```

## DOM & URL Utilities

### Location
`/Users/mac/Desktop/project/Sruimeng/ephemera/app/utils/utils.ts`

### Functions

```typescript
isMobileDevice(ua: string | null): boolean
// Detect mobile device from user agent.

sleep(ms: number): Promise<void>
// Async sleep.

pf<T>(): { promise: Promise<T>; resolve: (value: T) => void; reject: (reason?: unknown) => void }
// Create promise with exposed resolve/reject.

jump(url: string, blank?: boolean): void
// Open URL in new tab (blank=true) or current window.

copy(text: string): Promise<boolean>
// Copy text to clipboard. Returns success status.

formatFileSize(bytes: number, decimals?: number): string
// Format bytes to human-readable string (KB, MB, GB).

extractBVId(url: string): string | null
// Extract Bilibili video BV ID from URL.

extractVideoId(url: string): string | null
// Extract YouTube video ID from URL (supports standard, share, shorts).

videoUrlHandler(url: string): VideoUrlResult
// Parse video URL and return platform-specific info.
// Rejects URLs with Chinese characters.
```

## React Hooks

### Location
`/Users/mac/Desktop/project/Sruimeng/ephemera/app/hooks/`

### Loading State

```typescript
// hooks/request.ts
useLoadingRequest<T>(fn: T, deps?: DependencyList): LoadingRequest<T>
// Wrap async function with loading state + debounce.

useLoading(): { isLoading: boolean; withLoading: <T>(fn: () => Promise<T>) => Promise<T> }
// Simple loading wrapper without debounce.
```

### Debounce/Throttle

```typescript
// hooks/debounce.ts
useDebounce<T>(fn: T, deps?: DependencyList): DebouncedFunc<T>
// Debounce function (200ms delay).

useThrottle<T>(fn: T, deps?: DependencyList): DebouncedFunc<T>
// Throttle function (100ms delay).
```

### Navigation

```typescript
// hooks/navigate.ts
useNavigateWithQuery(): (path: string) => void
// Navigate while preserving query string.
```

### Keyboard

```typescript
// hooks/use-keyboard.ts
useKeyboard(bindings: KeyBindings, options?: UseKeyboardOptions): void
// Register keyboard shortcuts. Ignores input fields by default.

useDateNavigationKeys(onPrev: () => void, onNext: () => void, enabled?: boolean): void
// Shortcut for ArrowLeft/ArrowRight navigation.

useEscapeKey(onClose: () => void, enabled?: boolean): void
// Shortcut for ESC key.
```

### Daily World State Machine

```typescript
// hooks/use-daily-world.ts
useDailyWorldStateMachine(): UseDailyWorldStateMachine
// Time travel state machine.
// States: LOADING | SUCCESS | VOID
// Returns: { date, dateStr, data, status, error, isToday, actions }
// Actions: { prev, next, goTo, goToToday }

// Deprecated (backward compatibility)
useDailyWorld(): UseDailyWorldResult
useDailyWorldByDate(date: string): UseDailyWorldResult
useDailyWorldWithRefetch(): UseDailyWorldResult & { refetch: () => void }
```

## Zustand Store Utilities

### Location
`/Users/mac/Desktop/project/Sruimeng/ephemera/app/store/utils/utils.tsx`

### Functions

```typescript
create<T, U>(name: string, store: Store<T, U>): {
  Provider: React.FC<Props>;
  useStore: () => U;
  useVanillaStore: () => Ref<T, U>;
}
// Create Zustand store with:
// - Context-based provider
// - SSR support (global symbol registry)
// - Hot reload support
// - Shallow comparison by default
// - subscribeWithSelector middleware
```

## Reusable Patterns

### State Machine Pattern
```typescript
// See: hooks/use-daily-world.ts
type Status = 'LOADING' | 'SUCCESS' | 'VOID';
const [status, setStatus] = useState<Status>('LOADING');
```

### Loading State Pattern
```typescript
const { isLoading, withLoading } = useLoading();
await withLoading(async () => {
  // async operation
});
```

### Error Handling Pattern
```typescript
try {
  const data = await getDailyWorld();
} catch (err) {
  if (err instanceof NotFoundError) {
    // Handle soft 404 (VOID state)
  } else {
    // Handle network error
  }
}
```

### URL Processing Pattern
```typescript
// Force HTTPS
const httpsUrl = url.replace(/^http:/, 'https:');

// CORS proxy for specific domains
if (httpsUrl.includes('tripo3d.com')) {
  return `${API_BASE}/api/proxy-model?url=${encodeURIComponent(httpsUrl)}`;
}
```

### Storage Pattern
```typescript
// User-scoped storage (auto-prefixed)
setStorage(Storage.UID, userId);
const uid = getStorage<string>(Storage.UID);

// Common storage (no prefix)
setCommonStorage(CommonStorage.EuCookie, 'true');
const accepted = getCommonStorage(CommonStorage.EuCookie);
```

### Keyboard Binding Pattern
```typescript
useKeyboard({
  ArrowLeft: goToPrevDay,
  ArrowRight: goToNextDay,
  Escape: closeDetail,
}, { enabled: isOpen });
```

## File Locations

| Category | File | Exports |
|----------|------|---------|
| API | `/app/lib/api.ts` | getDailyWorld, getDailyWorldByDate, healthCheck, NotFoundError |
| Storage | `/app/utils/storage.ts` | setStorage, getStorage, setCommonStorage, getCommonStorage |
| Cookie | `/app/utils/cookie.ts` | isInEU, allowCookies |
| DOM/URL | `/app/utils/utils.ts` | isMobileDevice, sleep, jump, copy, videoUrlHandler |
| Loading | `/app/hooks/request.ts` | useLoadingRequest, useLoading |
| Debounce | `/app/hooks/debounce.ts` | useDebounce, useThrottle |
| Navigation | `/app/hooks/navigate.ts` | useNavigateWithQuery |
| Keyboard | `/app/hooks/use-keyboard.ts` | useKeyboard, useDateNavigationKeys, useEscapeKey |
| Daily World | `/app/hooks/use-daily-world.ts` | useDailyWorldStateMachine |
| Store | `/app/store/utils/utils.tsx` | create |
| Constants | `/app/constants/static/storage.ts` | Storage, CommonStorage |
| Constants | `/app/constants/static/enum.ts` | Period |
| Constants | `/app/constants/static/service.ts` | CDNBaseURL, WebURL |
| Types | `/app/types/api.ts` | DailyWorldData, NormalizedDailyWorld, NewsItem |

## Negative Constraints

- Do NOT use getStorage/setStorage for non-user-specific data (use getCommonStorage instead)
- Do NOT call getDailyWorld with a date parameter (use getDailyWorldByDate)
- Do NOT use useDailyWorld for time travel (use useDailyWorldStateMachine)
- Do NOT forget to check NotFoundError type when catching API errors
- Do NOT use keyboard shortcuts without ignoreInputs option (default: true)
- Do NOT use videoUrlHandler with URLs containing Chinese characters (will return null)
- Do NOT assume model URLs are HTTPS (use normalizeData to convert)
- Do NOT access tripo3d.com URLs directly (use CORS proxy via normalizeData)
- Do NOT use post-processing materials outside Canvas context
- Do NOT forget to wrap Canvas with StyleFilterProvider

## Post-Processing System

### Location
`/Users/mac/Desktop/project/Sruimeng/ephemera/app/components/post-processing/`

### Type Definitions

```typescript
// Filter Types
type StyleFilter =
  | 'default' | 'blueprint' | 'halftone' | 'ascii'
  | 'sketch' | 'glitch' | 'crystal' | 'claymation' | 'pixel';

type FilterCategory = 'post' | 'material' | 'hybrid';
type PerformanceLevel = 1 | 2 | 3;
type SystemState = 'IDLE' | 'SCROLLING' | 'CHECKING' | 'CONSTRUCTING' | 'MATERIALIZED' | 'ERROR';

interface StyleFilterConfig {
  id: StyleFilter;
  label: string;
  category: FilterCategory;
  performance: PerformanceLevel;
}

interface StyleFilterContextValue {
  filter: StyleFilter;
  setFilter: (filter: StyleFilter) => void;
  config: PostProcessingConfig;
  setConfig: (config: Partial<PostProcessingConfig>) => void;
  systemState: SystemState;
  setSystemState: (state: SystemState) => void;
  isMobile: boolean;
  gpuTier: number;
}
```

### Module Exports

```typescript
// index.ts barrel exports

// Types
export type {
  StyleFilter, FilterCategory, PerformanceLevel,
  StyleFilterConfig, PostProcessingConfig, SystemState,
  StyleFilterContextValue,
};

// Constants
export { DEFAULT_POST_PROCESSING, STYLE_FILTERS, getFilterConfig, COLORS };

// Context & Hooks
export { StyleFilterProvider, useStyleFilter };

// Composer (base post-processing)
export { PostProcessingComposer };

// Effects
export { BaseEffects, ScanlineEffect };

// Materials (shader-based filters)
export {
  BlueprintMaterial, HalftoneMaterial, SketchMaterial,
  GlitchMaterial, CrystalMaterial, ClaymationMaterial, PixelMaterial,
};

// Backgrounds (filter-specific)
export {
  BlueprintGridBackground, MatrixRainBackground,
  NewspaperBackground, SketchbookBackground,
};
```

### Usage Pattern

```typescript
// 1. Wrap app with provider
<StyleFilterProvider>
  <Canvas>
    <PostProcessingComposer />
    <YourScene />
  </Canvas>
</StyleFilterProvider>

// 2. Use hook in components
const { filter, setFilter, isMobile } = useStyleFilter();

// 3. Conditional background rendering
function ConditionalBackground() {
  const { filter } = useStyleFilter();
  if (filter === 'blueprint') return <BlueprintGridBackground />;
  if (filter === 'ascii') return <MatrixRainBackground />;
  return <DeepSpaceBackground />;
}
```

### Filter Categories

| Category | Description | Examples |
|----------|-------------|----------|
| `post` | Post-processing effects only | default, halftone, ascii, glitch |
| `material` | Shader material replacement | pixel, crystal, claymation |
| `hybrid` | Both material + post effects | blueprint, sketch |

### File Structure

```
post-processing/
├── index.ts           # Barrel exports
├── types.ts           # Type definitions
├── constants.ts       # STYLE_FILTERS, DEFAULT_POST_PROCESSING
├── context.tsx        # StyleFilterProvider, useStyleFilter
├── composer.tsx       # PostProcessingComposer
├── effects/
│   ├── index.ts
│   ├── base-effects.tsx
│   ├── scanline-effect.tsx
│   ├── blueprint-edge-effect.tsx
│   └── cyber-glitch-effect.tsx
├── materials/
│   ├── index.ts
│   ├── blueprint-material.tsx
│   ├── halftone-material.tsx
│   ├── ascii-material.tsx
│   ├── sketch-material.tsx
│   ├── glitch-material.tsx
│   ├── crystal-material.tsx
│   ├── claymation-material.tsx
│   └── pixel-material.tsx
└── backgrounds/
    ├── index.ts
    ├── blueprint-grid-background.tsx
    ├── matrix-rain-background.tsx
    ├── newspaper-background.tsx
    └── sketchbook-background.tsx
```

## API v5 Client

### Location
`/Users/mac/Desktop/project/Sruimeng/ephemera/app/lib/api-v5.ts`

### Functions

```typescript
getDailyContext(date?: string): Promise<DailyContext>
// GET /api/context/daily?date={date}

getHistoryContext(year: number): Promise<HistoryContext>
// GET /api/context/history/{year}

getFossilContext(year: number): Promise<FossilContext>
// GET /api/context/fossil/{year}

createForgeTask(req: ForgeCreateRequest): Promise<ForgeCreateResponse>
// POST /api/forge/create

getForgeStatus(taskId: string): Promise<ForgeStatusResponse>
// GET /api/forge/status/{taskId}

getForgeAssets(contextId: string): Promise<ForgeAssetsResponse>
// GET /api/forge/assets?context_id={contextId}
```

### Error Classes

```typescript
class ContextApiError extends Error { code: string }
class ForgeApiError extends Error { code: string }
```

### Headers

```typescript
createHeaders(): { 'Content-Type': 'application/json', 'X-App-ID': APP_ID }
```

## API Adapter

### Location
`/Users/mac/Desktop/project/Sruimeng/ephemera/app/lib/api-adapter.ts`

### Purpose
Normalize v5 API responses to legacy `NormalizedDailyWorld` format.

```typescript
normalizeDailyContext(ctx: DailyContext): NormalizedDailyWorld
// Maps: suggested_prompt -> theme, philosophy -> summary
```

## Forge Hook

### Location
`/Users/mac/Desktop/project/Sruimeng/ephemera/app/hooks/use-forge.ts`

### Functions

```typescript
useForgeTask(contextId: string): {
  task: ForgeTask | null;
  status: 'idle' | 'loading' | 'polling' | 'success' | 'error';
  error: Error | null;
  create: () => void;
  poll: () => void;
}
```

## Context Hooks

### Location
`/Users/mac/Desktop/project/Sruimeng/ephemera/app/hooks/use-context.ts`

### Functions

```typescript
useHistoryContext(year: number): { data, status, error }
useFossilContext(year: number): { data, status, error }
```
