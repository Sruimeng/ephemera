---
id: constitution
type: reference
related_ids: [doc-standard, system-overview, index, ui-design-system, daily-world-api-quick-ref]
---

# 📜 Constitution - Project Reify 项目宪法

> **项目名称**: ephemera (Project Reify)  
> **模块**: Daily World (60s 读懂世界)  
> **类型**: React Router v7 + React 19 + R3F 新闻聚合应用  
> **状态**: 🚧 开发中

## 1. 项目定位

```
TYPE: News Aggregation Application
PURPOSE: 高性能新闻聚合前端，展示 AI 生成的每日简报
TARGET: 
  - 极致首屏 (SSR 秒开)
  - SEO 优化
  - 3D 增强体验

FEATURES:
  - 服务端渲染 (SSR)
  - 国际化 (7 种语言)
  - 主题切换
  - 状态管理 (Zustand)
  - 3D 背景/交互 (R3F)
  - Apple 风格设计系统
```

## 2. 技术栈规范

### 2.1 核心依赖

| 类别 | 选型 | 版本 | 用途 |
|------|------|------|------|
| **框架** | React | ^19.0.0 | UI 框架 |
| **路由** | React Router | ^7.6.2 | SSR 路由管理 |
| **构建工具** | Vite | ^6.3.5 | 构建打包 |
| **语言** | TypeScript | ^5.8.3 | 类型安全 |
| **样式** | UnoCSS | ^66.2.0 | 原子化 CSS |
| **状态管理** | Zustand | ^5.0.3 | 轻量状态管理 |
| **国际化** | i18next + remix-i18next | ^24.2.1 | 多语言支持 |
| **表单** | React Hook Form + Zod | ^7.54.2 | 表单验证 |
| **主题** | remix-themes | ^2.0.1 | 主题切换 |

### 2.2 3D 渲染栈

| 类别 | 选型 | 用途 |
|------|------|------|
| **3D 引擎** | React Three Fiber (R3F) | Three.js React 封装 |
| **工具库** | @react-three/drei | R3F 常用组件 |
| **后处理** | @react-three/postprocessing | 视觉特效 |

### 2.3 UI 组件栈

| 类别 | 选型 | 用途 |
|------|------|------|
| **组件库** | Shadcn/UI | 基于 Radix UI 的可定制组件 |
| **设计系统** | Sruim Design System | Apple 风格设计规范 |
| **图标** | Lucide React | 图标库 |

### 2.4 开发工具

| 工具 | 版本 | 用途 |
|------|------|------|
| ESLint | ^9.23.0 | 代码检查 |
| Prettier | ^3.3.3 | 代码格式化 |
| Stylelint | ^16.14.1 | 样式检查 |
| Husky | ^9.1.7 | Git Hooks |
| pnpm | 9.6.0 | 包管理器 |

### 2.5 部署环境

| 组件 | 说明 |
|------|------|
| **服务器** | 阿里云 ECS |
| **反向代理** | Caddy (自动 HTTPS) |
| **容器化** | Docker (Standalone 模式) |
| **镜像仓库** | 阿里云 ACR |
| **API 域名** | `https://reify-sdk.zeabur.internal:8080` |

## 3. 目录结构规范

```
ephemera/
├── app/                        # 应用源代码 (React Router v7 约定)
│   ├── entry.client.tsx        # 客户端入口
│   ├── entry.server.tsx        # 服务端入口 (SSR)
│   ├── root.tsx                # 根组件 (Layout + 3D Canvas)
│   ├── root.css                # 全局样式
│   ├── routes.ts               # 路由配置
│   │
│   ├── .server/                # 服务端专用代码
│   ├── components/             # 组件库
│   │   ├── ui/                 # 基础 UI (Shadcn)
│   │   ├── business/           # 业务组件
│   │   └── canvas/             # 3D 场景组件 (R3F)
│   ├── constants/              # 常量配置
│   ├── hooks/                  # 自定义 Hooks
│   ├── lib/                    # 工具库
│   │   ├── api.ts              # API 请求封装
│   │   └── utils.ts            # 通用工具
│   ├── locales/                # 国际化资源
│   ├── routes/                 # 路由页面
│   │   ├── _index.tsx          # 首页
│   │   └── daily/              # 新闻模块
│   ├── store/                  # Zustand 状态管理
│   ├── types/                  # 类型定义
│   └── utils/                  # 工具函数
│
├── llmdoc/                     # LLM 文档中心
├── public/                     # 静态资源
├── package.json                # 依赖配置
├── vite.config.ts              # Vite 配置
├── uno.config.ts               # UnoCSS 配置
├── Dockerfile                  # 多阶段构建
└── README.md                   # 项目说明
```

## 4. 编码规范

### 4.1 命名约定

```
RULE: File Naming
  - 组件文件: kebab-case (e.g., news-card.tsx, daily-summary.tsx)
  - 工具文件: kebab-case (e.g., api.ts, utils.ts)
  - Hook 文件: camelCase (e.g., useRequest.ts, useDebounce.ts)
  - 常量文件: kebab-case (e.g., env.ts, service.ts)
  - 3D 组件: PascalCase (e.g., BackgroundScene.tsx, ModelViewer.tsx)

RULE: Variable Naming
  - 组件: PascalCase (e.g., NewsCard, DailySummary)
  - 函数/变量: camelCase (e.g., fetchDailyNews)
  - 常量: UPPER_SNAKE_CASE (e.g., API_BASE_URL)
  - 类型/接口: PascalCase (e.g., DailyWorldData, ApiResponse)
```

### 4.2 组件规范

```typescript
// ✅ 正确：函数组件 + TypeScript + Props 接口
interface NewsCardProps {
  data: DailyWorldData;
  variant?: 'default' | 'compact';
}

export function NewsCard({ data, variant = 'default' }: NewsCardProps) {
  return (
    <article className="card-sruim p-4">
      <h2 className="text-lg font-semibold">{data.summary}</h2>
      <time className="text-secondary">{data.date}</time>
    </article>
  );
}
```

### 4.3 Server Component vs Client Component

```typescript
// ✅ Server Component (默认) - 用于数据获取
// app/routes/daily/page.tsx
export default async function DailyPage() {
  const news = await getDailyNews(); // 服务端直接调用
  return <NewsList data={news} />;
}

// ✅ Client Component - 用于交互/3D
// app/components/canvas/BackgroundScene.tsx
'use client';
import { Canvas } from '@react-three/fiber';

export function BackgroundScene() {
  return <Canvas>...</Canvas>;
}
```

### 4.4 状态管理规范

```typescript
// ✅ 正确：Zustand Store 结构
interface ConfigStore {
  // 状态
  theme: 'light' | 'dark';
  locale: string;
  // 动作
  setTheme: (theme: 'light' | 'dark') => void;
  setLocale: (locale: string) => void;
}

const useConfigStore = create<ConfigStore>((set) => ({
  theme: 'light',
  locale: 'zh',
  setTheme: (theme) => set({ theme }),
  setLocale: (locale) => set({ locale }),
}));
```

### 4.5 API 请求规范

```typescript
// ✅ 正确：类型安全的 API 封装
// app/lib/api.ts
const API_BASE = 'https://reify-sdk.zeabur.internal:8080';

export async function getDailyNews(): Promise<DailyWorldData> {
  const res = await fetch(`${API_BASE}/api/daily-world`);
  if (!res.ok) throw new Error('Failed to fetch');
  const json: ApiResponse<DailyWorldData> = await res.json();
  return json.data;
}
```

## 5. 设计系统规范

参见 [`UI.md`](../guides/UI.md) - Sruim Design System v2.0

### 5.1 核心原则

```
PRINCIPLE: Ethereal Precision (空灵精密)
  - 天蓝色作为"光"而非"漆"
  - 干净、克制，但有呼吸感

PRINCIPLE: Spatial (空间感)
  - 半透明材质 (Glassmorphism)
  - 微妙阴影构建层级

PRINCIPLE: Continuity (连续性)
  - 平滑连续曲率 (Squircle)
  - 拒绝生硬几何切角
```

### 5.2 色彩规范

| 角色 | 颜色 | Hex | 用法 |
|------|------|-----|------|
| Canvas | Off-White | `#F5F5F7` | 背景画布 |
| Tint | Sruim Blue | `#54B6F5` | 强调色 |
| Glass | Translucent | `rgba(255,255,255,0.7)` | 磨砂玻璃 |
| Text Primary | SF Black | `#1D1D1F` | 主文本 |
| Text Secondary | Slate Gray | `#86868B` | 辅助文本 |

## 6. 文档驱动开发 (Doc-Driven)

```
PRINCIPLE: 文档先于代码
  1. 在 llmdoc/reference/ 定义规范
  2. 在 llmdoc/architecture/ 设计架构
  3. 在 llmdoc/guides/ 编写开发指南
  4. 然后才编写代码

WORKFLOW:
  READ llmdoc/reference/constitution.md
  → DESIGN in llmdoc/architecture/
  → IMPLEMENT code
  → UPDATE llmdoc/guides/
```

## 7. 国际化规范

```
SUPPORTED_LANGUAGES:
  - en (English) - 默认
  - zh (中文)
  - ja (日本語)
  - ko (한국어)
  - es (Español)
  - pt (Português)
  - ru (Русский)

FILE_STRUCTURE:
  app/locales/{lang}/
    ├── common.json      # 通用文本
    └── error-toast.json # 错误提示

USAGE:
  import { useTranslation } from 'react-i18next';
  const { t } = useTranslation();
  t('common.key')
```

## ⛔ 禁止事项 (Do NOTs)

### 类型安全
- 🚫 **不要**使用 `any` 类型，必须定义明确的类型
- 🚫 **不要**忽略 TypeScript 错误，必须修复

### 组件规范
- 🚫 **不要**在 Server Component 中使用 `useState`/`useEffect`
- 🚫 **不要**在 Client Component 中直接调用后端 API
- 🚫 **不要**在 3D 组件中忘记 `'use client'` 指令

### 状态管理
- 🚫 **不要**在 Store 中存储可派生的状态
- 🚫 **不要**直接修改 Zustand store 外部的状态

### 样式规范
- 🚫 **不要**使用内联样式，使用 UnoCSS 原子类
- 🚫 **不要**使用纯黑 `#000000`，使用 `#1D1D1F`
- 🚫 **不要**使用标准 `border-radius`，使用大圆角 (20px+)

### 工程规范
- 🚫 **不要**硬编码配置值，使用环境变量
- 🚫 **不要**在没有文档的情况下添加新功能
- 🚫 **不要**使用 `var`，使用 `const` 或 `let`

## 8. 版本控制规范

### 8.1 Commit Message 格式

```
TYPE(scope): description

TYPE:
  - feat: 新功能
  - fix: 修复 bug
  - docs: 文档更新
  - style: 代码格式 (不影响功能)
  - refactor: 重构
  - test: 测试相关
  - chore: 构建/工具相关

EXAMPLE:
  feat(daily): add news card component
  fix(api): handle network timeout
  docs(llmdoc): update constitution
```

## 9. 相关文档

- 文档规范: [`doc-standard.md`](../guides/doc-standard.md)
- 系统概览: [`system-overview.md`](../architecture/system-overview.md)
- API 参考: [`daily-world-api-quick-ref.md`](../guides/daily-world-api-quick-ref.md)
- 设计系统: [`UI.md`](../guides/UI.md)
- 技术债务: [`technical-debt.md`](./technical-debt.md)