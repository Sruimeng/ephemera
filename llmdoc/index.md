---
id: index
type: overview
related_ids: [constitution, system-overview, doc-standard, daily-world-api-quick-ref, ui-design-system, ephemera-prd]
---

# 📚 Ephemera: 数字美术馆 文档中心

> **项目名称**: Ephemera (Project Reify)
> **定位**: 数字美术馆 - 每日 AI 生成的 3D 艺术品展览
> **类型**: React Router v7 + React 19 + R3F 沉浸式体验应用
> **状态**: 🚧 开发中 (V3)

## 🎯 项目愿景

```
VISION: "每一天的新闻，都值得一座雕塑"

CORE_EXPERIENCE:
  - 用户进入 → 看到一个神秘的 3D 物体 (Totem)
  - 物体缓慢旋转，光影流动
  - 点击物体 → 展开今日新闻详情
  - 每天的物体都不同，由 AI 根据新闻主题生成

THREE_STATES:
  - LOADING: 骨架屏 + 加载动画
  - TOTEM: 3D 物体展示 (核心体验)
  - DETAIL: 新闻详情面板

ENGINEERING_GOALS:
  - 类型安全：与 Rust 后端数据结构严格一致
  - 轻量化：Docker 镜像 < 200MB
  - 设计系统：Sruim Design System (Apple Inspired)
```

## 🗂️ 文档导航

### 📐 架构文档 (Architecture)

| 文档 | 描述 |
|------|------|
| [`system-overview.md`](./architecture/system-overview.md) | 系统架构概览与数据流 |

### 📖 开发指南 (Guides)

| 文档 | 描述 |
|------|------|
| [`ephemera-prd.md`](./guides/ephemera-prd.md) | **📋 Ephemera V3 产品需求文档 (PRD)** |
| [`doc-standard.md`](./guides/doc-standard.md) | LLMDoc 文档规范 |
| [`daily-world-api-quick-ref.md`](./guides/daily-world-api-quick-ref.md) | Daily World API 快速参考 |
| [`daily-world-dev.md`](./guides/daily-world-dev.md) | Daily World 开发指南 (含 3D 场景规范) |
| [`UI.md`](./guides/UI.md) | Sruim Design System v2.0 |

### 📋 参考规范 (Reference)

| 文档 | 描述 |
|------|------|
| [`constitution.md`](./reference/constitution.md) | 项目宪法 - 编码规范与技术栈 |
| [`technical-debt.md`](./reference/technical-debt.md) | 技术债务报告 |

### 🤖 策略记忆 (Agent)

| 文档 | 描述 |
|------|------|
| `agent/strategy-*.md` | Agent 策略记录 |

## 🏗️ 项目结构

```
ephemera/
├── app/                        # 应用源代码 (React Router v7)
│   ├── entry.client.tsx        # 客户端入口
│   ├── entry.server.tsx        # 服务端入口 (SSR)
│   ├── root.tsx                # 根组件 (Layout + 3D Canvas)
│   ├── root.css                # 全局样式
│   ├── routes.ts               # 路由配置
│   │
│   ├── .server/                # 服务端专用代码
│   ├── components/             # 组件库
│   │   ├── ui/                 # 基础 UI (Shadcn)
│   │   ├── business/           # 业务组件 (NewsCard, DailySummary)
│   │   └── canvas/             # 3D 场景组件 (R3F)
│   ├── constants/              # 常量配置
│   ├── hooks/                  # 自定义 Hooks
│   ├── locales/                # 国际化 (7 种语言)
│   ├── routes/                 # 路由页面
│   │   ├── _index.tsx          # 首页
│   │   └── daily/              # 新闻模块
│   │       ├── page.tsx        # 列表页 (SSR)
│   │       └── [id]/page.tsx   # 详情页
│   ├── store/                  # Zustand 状态管理
│   ├── types/                  # 类型定义 (对应 Rust Struct)
│   └── utils/                  # 工具函数
│
├── llmdoc/                     # LLM 文档中心
├── public/                     # 静态资源
└── Dockerfile                  # 多阶段构建脚本
```

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建生产版本
pnpm build-production

# 类型检查
pnpm typecheck
```

## 📦 技术栈

### 核心依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `react` | ^19.0.0 | UI 框架 |
| `react-router` | ^7.6.2 | 路由管理 (SSR) |
| `@react-three/fiber` | latest | 3D 渲染 (R3F) |
| `@react-three/drei` | latest | R3F 工具库 |
| `zustand` | ^5.0.3 | 状态管理 |
| `i18next` | ^24.2.1 | 国际化 |
| `zod` | ^3.24.1 | 数据验证 |

### 开发工具

| 包名 | 版本 | 用途 |
|------|------|------|
| `vite` | ^6.3.5 | 构建工具 |
| `typescript` | ^5.8.3 | 类型系统 |
| `unocss` | ^66.2.0 | 原子化 CSS |
| `eslint` | ^9.23.0 | 代码检查 |
| `prettier` | ^3.3.3 | 代码格式化 |

### 部署环境

| 组件 | 说明 |
|------|------|
| **服务器** | 阿里云 ECS |
| **反向代理** | Caddy (自动 HTTPS) |
| **容器化** | Docker (Standalone 模式) |
| **API 域名** | `https://api.sruim.xin` |

## 📝 文档更新日志

| 日期 | 变更 |
|------|------|
| 2026-01-07 | **V3 升级**: 转型为"数字美术馆"定位 |
| 2026-01-07 | 添加 Ephemera V3 PRD 产品需求文档 |
| 2026-01-07 | 添加三态架构 (LOADING → TOTEM → DETAIL) |
| 2026-01-07 | 添加 3D 场景规范 (OrbitControls, ContactShadows) |
| 2026-01-07 | 转型为 Project Reify: Daily World 项目 |
| 2026-01-07 | 添加 R3F、Shadcn/UI 技术栈 |
| 2026-01-07 | 添加 Sruim Design System 设计规范 |
| 2026-01-07 | 创建 Daily World 开发指南 |

## 🔗 相关链接

- **产品需求**: [`ephemera-prd.md`](./guides/ephemera-prd.md) ⭐
- 项目宪法: [`constitution.md`](./reference/constitution.md)
- 系统架构: [`system-overview.md`](./architecture/system-overview.md)
- API 参考: [`daily-world-api-quick-ref.md`](./guides/daily-world-api-quick-ref.md)
- 设计系统: [`UI.md`](./guides/UI.md)