---
id: strategy-api-v5-migration
type: strategy
related_ids: [llmdoc-index, tech-stack, shared-utilities]
---

# Strategy: Vestige/Reify-SDK v5 API Migration

## 1. Analysis

**Context:**
- Current: `reify-sdk.zeabur.internal:8080/api/daily-world` (v4)
- Target: `reify-sdk.zeabur.internal:8080/api/context/*` + `reify-sdk.zeabur.internal:8080/api/forge/*` (v5)
- Breaking: New response shapes, new endpoints, auth header required

**Constitution:**
- React 19 + RR7 + TypeScript strict
- pnpm only
- No `any` type
- Keep `NotFoundError` pattern
- Keep state machine pattern (`LOADING | SUCCESS | VOID`)

**Style Protocol:** Terse. Type definitions > Comments. Early returns. No fluff.

**Negative Constraints:**
- NO breaking existing hook interface (`useDailyWorldStateMachine`)
- NO removing backward-compat hooks until v2.0
- NO hardcoded API URLs in components
- NO `any` type assertions

## 2. Assessment

<Assessment>
**Complexity:** Level 2 (Moderate)
</Assessment>

Rationale: Type mapping + endpoint swap. No math/physics. No shader work.

## 3. Type Specification

### New Types (`app/types/api-v5.ts`)

```typescript
// Response wrapper
interface ApiV5Response<T> { data: T }
interface ApiV5Error { code: string; message: string }

// Context API
interface DailyContext {
  context_id: string
  date: string
  news: NewsItem[]
  philosophy: string
  suggested_prompt: string
  keywords: string[]
}

interface HistoryContext {
  context_id: string
  year: number
  year_display: string
  events: HistoryEvent[]
  symbols: string[]
  synthesis: string
  philosophy: string
  suggested_prompt: string
}

interface FossilContext {
  context_id: string
  year: number
  predictions: FossilPrediction[]
  symbols: string[]
  synthesis: string
  philosophy: string
  archaeologist_report: string
  suggested_prompt: string
}

interface HistoryEvent { year: number; title: string; description: string }
interface FossilPrediction { title: string; description: string; probability: number }

// Forge API
interface ForgeTask {
  task_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  model_url: string | null
  error_message: string | null
  progress_percent: number
}

interface ForgeCreateRequest {
  context_id: string
  prompt?: string
}

// Union for all context types
type AnyContext = DailyContext | HistoryContext | FossilContext
```

### Mapping: Old -> New

| Old Type | New Type | Notes |
|----------|----------|-------|
| `DailyWorldData` | `DailyContext` | `object_description` -> `suggested_prompt` |
| `NormalizedDailyWorld` | Keep | Adapter layer normalizes |

## 4. The Plan

<ExecutionPlan>

**Block 1: Types** [DONE]
1. ~~Create `app/types/api-v5.ts` with new interfaces~~
2. ~~Export from `app/types/index.ts`~~

**Block 2: Config** [DONE]
1. ~~Update `app/constants/meta/service.ts`:~~
   - ~~Add `API_V5_BASE = 'https://api.sruim.xin'`~~
   - ~~Add `APP_ID = '204bb605-dd38-4c3b-90b5-d1055310051b'`~~
   - ~~Add `FALLBACK_MODEL_URL`~~
   - ~~Remove `processModelUrl()` - CF Worker handles proxy~~

**Block 3: API Client** [DONE]
1. ~~Create `app/lib/api-v5.ts`:~~
   ```
   createHeaders() -> { 'X-App-ID': APP_ID, 'Content-Type': 'application/json' }

   getDailyContext(date?: string) -> DailyContext
     GET /api/context/daily?date={date}

   getHistoryContext(year: number) -> HistoryContext
     GET /api/context/history/{year}

   getFossilContext(year: number) -> FossilContext
     GET /api/context/fossil/{year}

   createForgeTask(req: ForgeCreateRequest) -> ForgeTask
     POST /api/forge/create

   getForgeStatus(taskId: string) -> ForgeTask
     GET /api/forge/status/{taskId}
   ```
2. ~~Keep `NotFoundError` class (import from existing)~~

**Block 4: Adapter Layer** [DONE]
1. ~~Create `app/lib/api-adapter.ts`:~~
   ```
   normalizeDailyContext(ctx: DailyContext) -> NormalizedDailyWorld
     date: ctx.date
     theme: ctx.suggested_prompt
     summary: ctx.philosophy
     news: ctx.news
     modelUrl: '' (fetched separately via Forge)
     tripoPrompt: ctx.suggested_prompt
   ```

**Block 5: Hook Migration** [DONE]
1. ~~Update `app/hooks/use-daily-world.ts`:~~
   - ~~Import from `api-v5.ts` instead of `api.ts`~~
   - ~~Replace `getDailyWorld()` -> `getDailyContext()`~~
   - ~~Replace `getDailyWorldByDate(date)` -> `getDailyContext(date)`~~
   - ~~Apply adapter in fetch logic~~

**Block 6: New Hooks** [PARTIAL]
1. ~~Create `app/hooks/use-context.ts`:~~
   ```
   useHistoryContext(year: number) -> { data, status, error }
   useFossilContext(year: number) -> { data, status, error }
   ```
2. ~~Create `app/hooks/use-forge.ts`:~~
   ```
   useForgeTask(contextId: string) -> { task, status, error, create, poll }
   ```

**Block 7: Fix Remaining Imports** [TODO]
1. `app/routes/$date.tsx:20`:
   - CURRENT: `import { getDailyWorldByDate } from '~/lib/api'`
   - FIX: Use `useDailyWorldByDate` hook from `~/hooks/use-daily-world`
   - Refactor to hook-based data fetching (already migrated)

2. `app/components/canvas/scene.tsx:13`:
   - CURRENT: `import { FALLBACK_MODEL_URL } from '~/lib/api'`
   - FIX: `import { FALLBACK_MODEL_URL } from '~/constants/meta/service'`

3. `app/hooks/use-context.ts:51,88`:
   - BUG: calls `fetch()` instead of `loadData()`
   - FIX: Replace `fetch()` with `loadData()` on lines 51 and 88

**Block 8: Deprecation** [TODO]
1. Mark old `app/lib/api.ts` functions as `@deprecated`
2. Add console.warn in dev mode

**Block 9: Cleanup (Future)**
1. Remove `app/lib/api.ts` in v2.0
2. Remove backward-compat hooks

</ExecutionPlan>

## 5. File Change Summary

| File | Action | Status | Description |
|------|--------|--------|-------------|
| `app/types/api-v5.ts` | CREATE | DONE | New v5 types |
| `app/types/index.ts` | UPDATE | DONE | Export v5 types |
| `app/constants/meta/service.ts` | UPDATE | DONE | Add API_V5_BASE, APP_ID, FALLBACK_MODEL_URL |
| `app/lib/api-v5.ts` | CREATE | DONE | New API client |
| `app/lib/api-adapter.ts` | CREATE | DONE | Old<->New type adapter |
| `app/lib/api.ts` | UPDATE | TODO | Add @deprecated |
| `app/hooks/use-daily-world.ts` | UPDATE | DONE | Use v5 client |
| `app/hooks/use-context.ts` | CREATE | BUGFIX | Fix `fetch()` -> `loadData()` |
| `app/hooks/use-forge.ts` | CREATE | DONE | Forge task hook |
| `app/routes/$date.tsx` | UPDATE | TODO | Use hook instead of direct import |
| `app/components/canvas/scene.tsx` | UPDATE | TODO | Fix FALLBACK_MODEL_URL import |

## 6. Do NOTs

- Do NOT change `useDailyWorldStateMachine` return type
- Do NOT remove `NormalizedDailyWorld` (adapter target)
- Do NOT inline API URLs in hooks
- Do NOT use `fetch` directly in components
- Do NOT skip error handling for soft-404

## 7. Verification Checklist

```
[x] TypeScript strict passes (core migration)
[ ] Fix use-context.ts bug (fetch -> loadData)
[ ] Fix $date.tsx import (use hook)
[ ] Fix scene.tsx import (use service.ts)
[ ] Existing routes render without changes
[ ] VOID state still works (NotFoundError)
[ ] Date navigation still works
[ ] No console errors in dev
```

## 8. Immediate Action Items

Priority order for Block 7:

1. **CRITICAL** `use-context.ts` - Bug causes hooks to fail silently
2. **HIGH** `scene.tsx` - Simple import path fix
3. **MEDIUM** `$date.tsx` - Refactor to use migrated hook
