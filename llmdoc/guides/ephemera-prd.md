---
id: ephemera-prd
type: guide
version: "1.0.0"
related_ids:
  - constitution
  - system-overview
  - daily-world-api-quick-ref
  - daily-world-dev
  - ui-design-system
---

# 📱 Ephemera V3 产品需求文档 (PRD)

> **Version:** 1.0 | **Status:** Ready for Dev | **API Status:** Online

## 1. 项目概述

### 1.1 产品定位

```
PRODUCT_TYPE: Digital Art Gallery (数字美术馆)
CORE_CONCEPT: 展示"今日的世界精神" (Zeitgeist)
DESIGN_PHILOSOPHY: 极简主义 WebGL 容器，非新闻网站

CORE_TASK:
  1. 获取后端数据
  2. 渲染 Tripo 生成的 GLB 模型
  3. 展示 LLM 的哲学总结
```

### 1.2 API 端点

```
ENDPOINT: GET https://reify-sdk.zeabur.internal/api/daily-world
STATUS: Online
```

### 1.3 数据结构

```typescript
interface DailyWorldData {
  date: string;           // "2026-01-07"
  theme: string;          // "The Duality of Connection"
  summary: string;        // 哲学总结 (philosophy_summary)
  news: string[];         // 原始新闻列表
  model_url: string;      // GLB 模型 URL
  tripo_prompt: string;   // 生成模型的 Prompt
}
```

---

## 2. 设计规范实现

### 2.1 色彩定义 (Tailwind Config)

| 角色 | 颜色 | Hex | 用途 |
|------|------|-----|------|
| Canvas Bg | Apple Light Grey | `#F5F5F7` | 整个网页背景 |
| Sruim Blue | Tint Color | `#54B6F5` | 主按钮、加载进度条、选中态 |
| Text Primary | Near Black | `#1D1D1F` | 主文本 |
| Text Secondary | Slate Grey | `#86868B` | 辅助文本 |
| Glass Surface | Translucent | `rgba(255,255,255,0.65)` | 玻璃材质 + `backdrop-blur-xl` |

### 2.2 字体排印

```css
font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;

/* 标题字距微调 */
.heading {
  letter-spacing: -0.02em; /* tracking-tight */
}
```

---

## 3. 页面状态机 (State Machine)

应用为单页应用 (SPA)，包含三个层级状态。

```
STATE_MACHINE: EphemeraApp

  [IDLE] ---> [LOADING] ---> [TOTEM] <---> [DETAIL]
                 |
                 v
              [ERROR]
```

### 3.1 状态 A: 启动与加载 (The Setup)

```
STATE: LOADING
TRIGGER: 用户访问页面
DURATION: 直到 API + GLB 加载完成

VISUAL_ELEMENTS:
  - 屏幕中央: Sruim Logo (淡入淡出)
  - Logo 下方: 进度条 (Sruim Blue, height: 2px)
  - 随机哲学短语: "Constructing the Zeitgeist..."

LOGIC:
  PARALLEL:
    - fetch(API_ENDPOINT)
    - preload(GLB_MODEL)
  
  ON_COMPLETE:
    - Logo 消失 (fade out)
    - 模型浮现 (fade in)
    - TRANSITION -> TOTEM
```

### 3.2 状态 B: 沉浸展示 (The Totem - 主视图)

```
STATE: TOTEM
TRIGGER: 加载完成

LAYERS:
  Z-INDEX 0: 3D 视口 (Canvas)
  Z-INDEX 10: UI 层 (Header + Insight Panel)

3D_VIEWPORT:
  - 全屏 Canvas
  - 模型位于屏幕正中央
  - OrbitControls:
      - autoRotate: true (speed: 0.5)
      - enablePan: false
      - minPolarAngle: Math.PI / 4
      - maxPolarAngle: Math.PI / 1.5
  - 光影:
      - Studio Lighting

UI_LAYER:
  HEADER:
    - 左侧: 小尺寸 Sruim Logo
    - 右侧: 日期胶囊 (Glassmorphism) "2026.01.07"
  
  INSIGHT_PANEL (底部):
    - 位置: 屏幕底部中央悬浮
    - 材质: 玻璃卡片 (glass-panel)
    - 内容:
        - H2: 今日主题 (data.theme)
        - P: 哲学总结 (data.summary)
        - Button: "i" 或 "Sources" 链接
```

### 3.3 状态 C: 详情与历史 (The Detail - 抽屉模式)

```
STATE: DETAIL
TRIGGER: 点击底部面板或 "Sources" 按钮

ANIMATION:
  - 底部面板向上滑动扩展 (iOS Sheet 风格)
  - Framer Motion: slideUp

CONTENT:
  - 今日新闻源: data.news[] 列表
  - Prompt Reveal: data.tripo_prompt (元艺术展示)
  - 历史回溯 (Roadmap): 横向滚动日期圆点

ON_DISMISS:
  - 向下滑动关闭
  - TRANSITION -> TOTEM
```

---

## 4. 技术栈

| 类别 | 选型 | 用途 |
|------|------|------|
| **Framework** | Vite + React (TypeScript) | 构建框架 |
| **Styling** | Tailwind CSS | 原子化样式 |
| **3D Engine** | React Three Fiber (R3F) + Drei | WebGL 渲染 |
| **Animation** | Framer Motion | UI 动画 |
| **State** | Zustand | 状态管理 |

---

## 5. 关键代码规范

### 5.1 API Hook

```typescript
// hooks/useDailyWorld.ts

interface UseDailyWorldResult {
  data: NormalizedDailyWorld | null;
  loading: boolean;
  error: Error | null;
}

FUNCTION useDailyWorld(): UseDailyWorldResult
  1. useState: data, loading, error
  2. useEffect:
     a. fetch(API_ENDPOINT)
     b. IF model_url.startsWith('http:')
        THEN model_url = model_url.replace('http:', 'https:')
     c. setData(normalized)
  3. RETURN { data, loading, error }
```

### 5.2 3D 场景组件

```tsx
// components/canvas/Scene.tsx

<Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
  {/* 1. 环境设置 */}
  <color attach="background" args={['#F5F5F7']} />
  <Environment preset="city" />
  
  {/* 2. 模型加载与展示 */}
  <Suspense fallback={null}>
    <Model url={data.model_url} />
  </Suspense>
  
  {/* 3. 交互控制 */}
  <OrbitControls 
    enablePan={false} 
    minPolarAngle={Math.PI / 4} 
    maxPolarAngle={Math.PI / 1.5}
    autoRotate 
    autoRotateSpeed={0.5}
  />
</Canvas>
```

### 5.3 玻璃组件

```css
/* Tailwind custom utility */
.glass-panel {
  @apply bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl;
}
```

---

## 6. 开发优先级 (Sprint Plan)

### Sprint 1: 脚手架与 API 联调

```
TASKS:
  [ ] 初始化 Vite 项目
  [ ] 配置 Tailwind + UnoCSS
  [ ] 实现 useDailyWorld hook
  [ ] Console 验证 API 数据
```

### Sprint 2: 3D 查看器

```
TASKS:
  [ ] 搭建 R3F Canvas
  [ ] 实现 GLB 加载器
  [ ] 调整灯光和材质
  [ ] 配置 OrbitControls
```

### Sprint 3: UI 覆盖层

```
TASKS:
  [ ] 实现 Header 组件
  [ ] 实现 InsightPanel 组件
  [ ] 接入真实数据
  [ ] 实现 DetailSheet 抽屉
```

### Sprint 4: 细节打磨

```
TASKS:
  [ ] Framer Motion 入场动画
  [ ] Loading 状态优化
  [ ] Mobile 适配
  [ ] 性能优化
```

---

## 7. 组件清单

| 组件 | 路径 | 职责 |
|------|------|------|
| `App` | `app/root.tsx` | 根组件，状态机控制 |
| `LoadingScreen` | `components/loading-screen.tsx` | 加载状态 UI |
| `Scene` | `components/canvas/scene.tsx` | 3D 场景容器 |
| `Model` | `components/canvas/model.tsx` | GLB 模型加载 |
| `Header` | `components/ui/header.tsx` | 顶部导航栏 |
| `InsightPanel` | `components/ui/insight-panel.tsx` | 底部信息面板 |
| `DetailSheet` | `components/ui/detail-sheet.tsx` | 详情抽屉 |
| `GlassCard` | `components/ui/glass-card.tsx` | 玻璃材质卡片 |
| `DatePill` | `components/ui/date-pill.tsx` | 日期胶囊 |

---

## ⛔ 禁止事项 (Do NOTs)

### 设计
- 🚫 不要设计成新闻网站风格
- 🚫 不要使用纯黑 `#000000`
- 🚫 不要使用小圆角

### 3D
- 🚫 不要让模型看起来像"廉价游戏素材"
- 🚫 不要允许无限制的相机旋转（会看到底部）
- 🚫 不要忘记 `'use client'` 指令

### API
- 🚫 不要直接使用 http:// 的 model_url
- 🚫 不要在没有 loading 状态时渲染 3D

---

## 8. 相关文档

- API 参考: [`daily-world-api-quick-ref.md`](./daily-world-api-quick-ref.md)
- 开发指南: [`daily-world-dev.md`](./daily-world-dev.md)
- 设计系统: [`UI.md`](./UI.md)
- 系统架构: [`system-overview.md`](../architecture/system-overview.md)
- 项目宪法: [`constitution.md`](../reference/constitution.md)