---
id: strategy-ephemera-v3
type: strategy
version: "1.0.0"
related_ids:
  - ephemera-prd
  - constitution
  - daily-world-api-quick-ref
  - daily-world-dev
  - ui-design-system
---

# 🎯 Strategy: Ephemera V3 数字美术馆开发

> **Mission**: 根据 PRD 完成 Ephemera V3 数字美术馆的完整开发
> **Status**: 📋 待审批
> **Created**: 2026-01-07

## 1. 项目概述

```
PRODUCT: Ephemera V3 - Digital Art Gallery
CORE_CONCEPT: 展示"今日的世界精神" (Zeitgeist)

STATE_MACHINE:
  [IDLE] → [LOADING] → [TOTEM] ↔ [DETAIL]
                ↓
            [ERROR]

TECH_STACK:
  - Framework: React Router v7 + React 19
  - 3D Engine: React Three Fiber (R3F) + Drei
  - Styling: UnoCSS + Tailwind
  - State: Zustand
  - Animation: Framer Motion
```

## 2. 类型定义 (Type-First)

### 2.1 API 响应类型

```typescript
// app/types/api.d.ts

/** 后端原始响应 (对应 Rust Struct) */
interface DailyWorldData {
  date: string;              // "YYYY-MM-DD"
  theme: string;             // 今日主题
  summary: string;           // 哲学总结
  philosophy: string;        // 兼容旧字段
  news: string[];            // 原始新闻列表
  object_description: string; // 3D 物体描述
  tripo_prompt: string;      // Tripo 生成 Prompt
  model_url: string;         // GLB 模型 URL
}

/** 前端规范化类型 */
interface NormalizedDailyWorld {
  date: string;
  theme: string;
  summary: string;
  news: string[];
  modelUrl: string;          // 已转 https
  tripoPrompt: string;
}

/** API 错误响应 */
interface ApiError {
  error: {
    code: 'not_found' | 'invalid_date' | 'db_error';
    message: string;
  };
}
```

### 2.2 应用状态类型

```typescript
// app/types/store.d.ts

type AppState = 'idle' | 'loading' | 'totem' | 'detail' | 'error';

interface AppStore {
  // State
  state: AppState;
  data: NormalizedDailyWorld | null;
  error: Error | null;
  
  // Actions
  setState: (state: AppState) => void;
  setData: (data: NormalizedDailyWorld) => void;
  setError: (error: Error) => void;
  reset: () => void;
}
```

### 2.3 组件 Props 类型

```typescript
// app/types/components.d.ts

interface SceneProps {
  modelUrl: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

interface InsightPanelProps {
  theme: string;
  summary: string;
  onExpand: () => void;
}

interface DetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  news: string[];
  tripoPrompt: string;
}

interface HeaderProps {
  date: string;
}

interface LoadingScreenProps {
  progress?: number;
  message?: string;
}
```

## 3. 文件结构规划

```
app/
├── types/
│   ├── api.d.ts              # API 类型定义
│   ├── store.d.ts            # Store 类型定义
│   └── components.d.ts       # 组件 Props 类型
│
├── lib/
│   ├── api.ts                # API 请求封装
│   └── utils.ts              # 工具函数 (cn, formatDate)
│
├── hooks/
│   └── use-daily-world.ts    # useDailyWorld Hook
│
├── store/
│   └── use-app-store.ts      # Zustand 应用状态
│
├── components/
│   ├── canvas/               # 3D 组件
│   │   ├── scene.tsx         # 主场景容器
│   │   └── model.tsx         # GLB 模型加载器
│   │
│   └── ui/                   # UI 组件
│       ├── loading-screen.tsx
│       ├── header.tsx
│       ├── insight-panel.tsx
│       ├── detail-sheet.tsx
│       ├── glass-card.tsx
│       └── date-pill.tsx
│
└── routes/
    └── _index.tsx            # 首页 (状态机控制)
```

## 4. Sprint 实现计划

### Sprint 1: API 联调

```
DELIVERABLES:
  - app/types/api.d.ts
  - app/lib/api.ts
  - app/hooks/use-daily-world.ts

PSEUDOCODE: normalizeData(raw: DailyWorldData)
  1. EXTRACT date, theme from raw
  2. summary = raw.summary OR raw.philosophy
  3. modelUrl = raw.model_url.replace('http:', 'https:')
  4. tripoPrompt = raw.tripo_prompt OR raw.object_description
  5. RETURN NormalizedDailyWorld

PSEUDOCODE: getDailyWorld()
  1. response = await fetch(API_BASE + '/api/daily-world')
  2. IF !response.ok THEN
       IF status == 404 THEN throw Error('暂无数据')
       ELSE throw Error('API 请求失败')
  3. raw = await response.json()
  4. RETURN normalizeData(raw)

PSEUDOCODE: useDailyWorld()
  1. STATE: data, loading, error
  2. useEffect:
       a. setLoading(true)
       b. TRY getDailyWorld() → setData
       c. CATCH → setError
       d. FINALLY setLoading(false)
  3. RETURN { data, loading, error }
```

### Sprint 2: 3D 查看器

```
DELIVERABLES:
  - app/components/canvas/scene.tsx
  - app/components/canvas/model.tsx

<MathSpec>
CANVAS_CONFIG:
  shadows: true
  camera:
    position: [0, 0, 5]
    fov: 45
  background: '#F5F5F7'

ORBIT_CONTROLS_CONFIG:
  enablePan: false
  enableZoom: true
  minPolarAngle: π/4      # 45° - 防止看到底部
  maxPolarAngle: π/1.5    # 120°
  autoRotate: true
  autoRotateSpeed: 0.5

LIGHTING_CONFIG:
  ambientLight:
    intensity: 0.5
  directionalLight:
    position: [10, 10, 5]
    intensity: 1
  Environment:
    preset: 'city'
</MathSpec>

PSEUDOCODE: Scene({ modelUrl })
  1. IF !modelUrl THEN RETURN null
  2. RENDER Canvas with config
  3. INSIDE Canvas:
       a. <color attach="background" args={['#F5F5F7']} />
       b. <Environment preset="city" />
       c. <Suspense fallback={null}>
            <Model url={modelUrl} />
            <ContactShadows {...config} />
          </Suspense>
       d. <OrbitControls {...config} />

PSEUDOCODE: Model({ url })
  1. { scene } = useGLTF(url)
  2. RETURN <primitive object={scene} />
```

### Sprint 3: UI 覆盖层

```
DELIVERABLES:
  - app/components/ui/loading-screen.tsx
  - app/components/ui/header.tsx
  - app/components/ui/insight-panel.tsx
  - app/components/ui/detail-sheet.tsx
  - app/components/ui/glass-card.tsx
  - app/components/ui/date-pill.tsx

DESIGN_TOKENS:
  colors:
    canvas: '#F5F5F7'
    tint: '#54B6F5'
    textPrimary: '#1D1D1F'
    textSecondary: '#86868B'
    glass: 'rgba(255,255,255,0.65)'
  
  borderRadius:
    card: '20px'
    pill: '999px'
  
  glassMorphism:
    background: 'rgba(255,255,255,0.72)'
    backdropFilter: 'blur(20px) saturate(180%)'
    border: '1px solid rgba(255,255,255,0.3)'

PSEUDOCODE: LoadingScreen({ progress, message })
  1. RENDER centered container
  2. SHOW Sruim Logo (fade animation)
  3. SHOW progress bar (Sruim Blue, height: 2px)
  4. SHOW message (default: "Constructing the Zeitgeist...")

PSEUDOCODE: Header({ date })
  1. RENDER fixed top bar (glass effect)
  2. LEFT: Sruim Logo (small)
  3. RIGHT: DatePill with formatted date

PSEUDOCODE: InsightPanel({ theme, summary, onExpand })
  1. RENDER bottom floating card (glass effect)
  2. H2: theme
  3. P: summary (line-clamp-3)
  4. Button: "Sources" → onExpand()

PSEUDOCODE: DetailSheet({ isOpen, onClose, news, tripoPrompt })
  1. IF !isOpen THEN RETURN null
  2. RENDER bottom sheet (slide up animation)
  3. SECTION: News Sources
       FOR each item in news:
         RENDER news item
  4. SECTION: Prompt Reveal
       RENDER tripoPrompt (monospace)
  5. ON swipe down → onClose()
```

### Sprint 4: 动画与状态机

```
DELIVERABLES:
  - app/store/use-app-store.ts
  - app/routes/_index.tsx (重构)

PSEUDOCODE: useAppStore (Zustand)
  STATE:
    state: 'idle'
    data: null
    error: null
  
  ACTIONS:
    setState(s) → set({ state: s })
    setData(d) → set({ data: d, state: 'totem' })
    setError(e) → set({ error: e, state: 'error' })
    reset() → set({ state: 'idle', data: null, error: null })

PSEUDOCODE: IndexPage (State Machine)
  1. INIT: state = 'loading'
  2. useEffect:
       a. PARALLEL:
            - fetch API data
            - preload GLB model
       b. ON success → setState('totem')
       c. ON error → setState('error')
  
  3. RENDER based on state:
       CASE 'loading':
         <LoadingScreen />
       CASE 'totem':
         <Scene modelUrl={data.modelUrl} />
         <Header date={data.date} />
         <InsightPanel {...data} onExpand={() => setState('detail')} />
       CASE 'detail':
         <Scene modelUrl={data.modelUrl} />
         <DetailSheet isOpen onClose={() => setState('totem')} {...data} />
       CASE 'error':
         <ErrorBoundary error={error} />

ANIMATION_SPEC:
  LoadingScreen → Totem:
    - Logo: fadeOut (duration: 0.5s)
    - Scene: fadeIn (duration: 0.8s, delay: 0.3s)
  
  Totem → Detail:
    - InsightPanel: slideUp (duration: 0.3s, ease: easeOut)
  
  Detail → Totem:
    - DetailSheet: slideDown (duration: 0.3s, ease: easeIn)
```

## 5. 依赖安装

```bash
# 3D 渲染
pnpm add three @react-three/fiber @react-three/drei

# 动画
pnpm add framer-motion

# 类型定义
pnpm add -D @types/three
```

## 6. UnoCSS 配置扩展

```typescript
// uno.config.ts shortcuts 扩展
shortcuts: {
  // 颜色
  'text-primary': 'text-[#1D1D1F]',
  'text-secondary': 'text-[#86868B]',
  'bg-canvas': 'bg-[#F5F5F7]',
  'bg-tint': 'bg-[#54B6F5]',
  
  // 玻璃效果
  'glass-panel': 'bg-white/65 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl',
  
  // 卡片
  'card-sruim': 'bg-white rounded-[20px] border border-black/4 shadow-[0_4px_24px_-1px_rgba(0,0,0,0.05)]',
  
  // 按钮
  'btn-sruim': 'bg-[#54B6F5] text-white rounded-full px-5 py-2 font-medium',
}
```

## 7. 验收标准

### 功能验收

```
CHECKLIST:
  [ ] API 数据正确获取并规范化
  [ ] GLB 模型正确加载和渲染
  [ ] OrbitControls 限制垂直旋转角度
  [ ] ContactShadows 正确显示
  [ ] 状态机正确切换 (Loading → Totem ↔ Detail)
  [ ] 玻璃效果正确应用
  [ ] 响应式布局 (Mobile + Desktop)
```

### 性能验收

```
METRICS:
  - First Contentful Paint: < 1.5s
  - Time to Interactive: < 3