---
id: system-overview
type: architecture
related_ids: [constitution, doc-standard, index, daily-world-api-quick-ref, ephemera-prd]
---

# 📐 系统架构概览

> **项目名称**: ephemera (Project Reify)  
> **模块**: Daily World (60s 读懂世界)  
> **类型**: React Router v7 + React 19 + R3F 新闻聚合应用

## 1. 项目概述

```
PROJECT_TYPE: News Aggregation Application
FRAMEWORK: React Router v7 (SSR/SPA Hybrid)
REACT_VERSION: 19.0.0
BUILD_TOOL: Vite 6.3.5
PACKAGE_MANAGER: pnpm 9.6.0
3D_ENGINE: React Three Fiber (R3F)
DESIGN_SYSTEM: Sruim Design System v2.0
```

## 2. 系统架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Caddy (Reverse Proxy)                        │
│                    https://sruim.xin                            │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│   Next.js / React Router │     │     Rust Backend        │
│   (Frontend Container)   │     │   https://api.sruim.xin │
│   Port: 3000             │     │   Port: 8080            │
└─────────────────────────┘     └─────────────────────────┘
              │                               │
              │                               ▼
              │                 ┌─────────────────────────┐
              │                 │   SQLite Database       │
              │                 │   reify-sdk.db          │
              │                 └─────────────────────────┘
              │                               │
              │                               ▼
              │                 ┌─────────────────────────┐
              │                 │   External APIs         │
              │                 │   - DeepSeek LLM        │
              │                 │   - Tripo 3D            │
              │                 └─────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      3D Canvas (R3F)                            │
│                   Background Scene / Model Viewer               │
└─────────────────────────────────────────────────────────────────┘
```

## 3. 数据流架构

### 3.1 SSR 数据流 (Server-Side Rendering)

```
FLOW: SSR_DATA_FLOW

Browser Request
    │
    ▼
entry.server.tsx (SSR Entry)
    │
    ├─► loader() 函数执行
    │       │
    │       ▼
    │   fetch('https://api.sruim.xin/api/daily-world')
    │       │
    │       ▼
    │   Rust Backend 返回 JSON
    │       │
    │       ▼
    │   解析为 DailyWorldData
    │
    ▼
root.tsx (Layout)
    │
    ├─► <BackgroundScene /> (3D Canvas)
    │
    ▼
routes/daily/page.tsx
    │
    ├─► <NewsList data={loaderData} />
    │
    ▼
HTML Response (Hydration Ready)
```

### 3.2 客户端数据流 (Client-Side)

```
FLOW: CLIENT_DATA_FLOW

User Interaction
    │
    ▼
Client Component ('use client')
    │
    ├─► Zustand Store (状态管理)
    │       │
    │       ├─► useConfigStore (主题/语言)
    │       └─► useNewsStore (新闻缓存)
    │
    ├─► SWR / React Query (数据缓存)
    │       │
    │       ▼
    │   fetch() with revalidation
    │
    ▼
UI Update (React 19 Concurrent)
```

### 3.3 3D 渲染流程

```
FLOW: 3D_RENDER_FLOW

root.tsx
    │
    ▼
<BackgroundScene /> (Client Component)
    │
    ├─► 'use client' 指令
    │
    ▼
<Canvas> (R3F)
    │
    ├─► <ambientLight />
    ├─► <Stars /> (drei)
    ├─► <OrbitControls /> (可选)
    │
    ▼
Three.js WebGL Renderer
    │
    ▼
GPU Rendering
```

## 4. 应用状态机 (State Machine)

应用为单页应用 (SPA)，包含三个核心状态。

```
STATE_MACHINE: EphemeraApp

  ┌─────────┐     加载完成     ┌─────────┐     点击面板     ┌─────────┐
  │ LOADING │ ───────────────► │  TOTEM  │ ◄──────────────► │ DETAIL  │
  └─────────┘                  └─────────┘                  └─────────┘
       │                            │
       │ 加载失败                    │
       ▼                            │
  ┌─────────┐                       │
  │  ERROR  │ ◄─────────────────────┘
  └─────────┘      API 错误
```

### 4.1 状态 A: LOADING (启动与加载)

```
STATE: LOADING
TRIGGER: 用户访问页面

VISUAL:
  - 屏幕中央: Sruim Logo (淡入淡出)
  - Logo 下方: 进度条 (Sruim Blue, 2px)
  - 随机哲学短语

LOGIC:
  PARALLEL:
    - fetch(API_ENDPOINT)
    - preload(GLB_MODEL)
  
  ON_COMPLETE -> TOTEM
  ON_ERROR -> ERROR
```

### 4.2 状态 B: TOTEM (沉浸展示 - 主视图)

```
STATE: TOTEM
LAYERS:
  Z-INDEX 0:  3D Canvas (全屏)
  Z-INDEX 10: UI Layer (Header + InsightPanel)

3D_VIEWPORT:
  - Model: 屏幕正中央
  - OrbitControls: autoRotate, 限制垂直角度
  - Lighting: Studio + ContactShadows

UI_LAYER:
  - Header: Logo + DatePill
  - InsightPanel: Theme + Summary + SourcesButton
```

### 4.3 状态 C: DETAIL (详情抽屉)

```
STATE: DETAIL
TRIGGER: 点击 InsightPanel 或 Sources 按钮

ANIMATION: 底部面板向上滑动 (iOS Sheet)

CONTENT:
  - 新闻源列表: data.news[]
  - Prompt Reveal: data.tripo_prompt
  - 历史回溯: 日期圆点横向滚动 (Roadmap)

ON_DISMISS -> TOTEM
```

## 5. 核心类型定义

```typescript
// Daily World 数据结构 (V3 PRD 版本)
interface DailyWorldData {
  date: string;              // ISO 8601 "YYYY-MM-DD"
  theme: string;             // 今日主题
  summary: string;           // 哲学总结
  philosophy: string;        // 兼容旧字段
  news: string[];            // 原始新闻列表
  object_description: string; // 3D 物体描述
  tripo_prompt: string;      // Tripo 生成 Prompt
  model_url: string;         // GLB 模型 URL
}

// 规范化后的前端类型
interface NormalizedDailyWorld {
  date: string;
  theme: string;
  summary: string;
  news: string[];
  model_url: string;         // 已转 https
  tripo_prompt: string;
}

// 错误响应
interface ApiError {
  error: {
    code: 'not_found' | 'invalid_date' | 'db_error';
    message: string;
  };
}
```

## 6. 模块职责

### 6.1 Routes (路由页面)

```
位置: app/routes/
职责: 
  - 页面布局
  - loader/action 数据获取
  - SEO meta 标签

关键文件:
  - _index.tsx      # 首页
  - daily/page.tsx  # 新闻列表 (SSR)
  - daily/[id]/page.tsx  # 新闻详情
```

### 6.2 Components (组件)

```
位置: app/components/
职责: 可复用 UI 组件

子目录:
  - ui/        # 基础 UI (Shadcn)
  - business/  # 业务组件 (NewsCard, DailySummary)
  - canvas/    # 3D 场景组件 (BackgroundScene, ModelViewer)
```

### 6.3 Hooks (钩子)

```
位置: app/hooks/
职责: 状态逻辑封装

关键文件:
  - useRequest.ts   # API 请求封装
  - useDebounce.ts  # 防抖
  - useNavigate.ts  # 导航增强
```

### 6.4 Store (状态)

```
位置: app/store/
职责: Zustand 全局状态管理

关键 Store:
  - useConfigStore  # 主题、语言配置
  - useNewsStore    # 新闻数据缓存 (可选)
```

### 6.5 Lib (工具库)

```
位置: app/lib/
职责: 核心工具函数

关键文件:
  - api.ts    # API 请求封装 (fetch wrapper)
  - utils.ts  # 通用工具 (cn, formatters)
```

### 6.6 Types (类型定义)

```
位置: app/types/
职责: TypeScript 类型定义 (对应 Rust Struct)

关键文件:
  - api.d.ts  # API 响应类型
```

## 7. 渲染策略

### 7.1 Server Components (默认)

```typescript
// ✅ 用于数据获取的页面
// app/routes/daily/page.tsx
export async function loader() {
  const news = await getDailyNews();
  return { news };
}

export default function DailyPage() {
  const { news } = useLoaderData<typeof loader>();
  return <NewsList data={news} />;
}
```

### 7.2 Client Components

```typescript
// ✅ 用于交互/3D 的组件
// app/components/canvas/BackgroundScene.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

export function BackgroundScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas>
        <Stars />
      </Canvas>
    </div>
  );
}
```

## 8. 部署架构

```
DEPLOYMENT:

┌─────────────────────────────────────────┐
│           阿里云 ECS                     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Docker Compose          │   │
│  │                                 │   │
│  │  ┌───────────┐  ┌───────────┐  │   │
│  │  │  Frontend │  │  Backend  │  │   │
│  │  │  :3000    │  │  :8080    │  │   │
│  │  └───────────┘  └───────────┘  │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Caddy                   │   │
│  │   - sruim.xin → :3000          │   │
│  │   - api.sruim.xin → :8080      │   │
│  │   - 自动 HTTPS (Let's Encrypt) │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

## ⛔ 禁止事项

- 🚫 不要在 Server Components 中使用 `useState`/`useEffect`
- 🚫 不要在 Client Components 中直接调用后端 API (应通过 loader)
- 🚫 不要在 Routes 中定义可复用组件 (应放入 components/)
- 🚫 不要跳过 loader/action 直接 fetch
- 🚫 不要在 Store 中存储可派生状态
- 🚫 不要在 3D 组件中忘记 `'use client'` 指令

## 9. 相关文档

- 产品需求: [`ephemera-prd.md`](../guides/ephemera-prd.md)
- 项目宪法: [`constitution.md`](../reference/constitution.md)
- API 参考: [`daily-world-api-quick-ref.md`](../guides/daily-world-api-quick-ref.md)
- 开发指南: [`daily-world-dev.md`](../guides/daily-world-dev.md)
- 设计系统: [`UI.md`](../guides/UI.md)