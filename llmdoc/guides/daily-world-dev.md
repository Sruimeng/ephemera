---
id: daily-world-dev
type: guide
version: "2.0.0"
related_ids:
  - constitution
  - system-overview
  - daily-world-api-quick-ref
  - ui-design-system
  - ephemera-prd
---

# 🚀 Daily World 开发指南

> **模块**: Daily World (60s 读懂世界)  
> **目标**: 构建高性能新闻聚合前端，展示 AI 生成的每日简报

## 1. 开发环境准备

### 1.1 前置要求

```
REQUIREMENTS:
  - Node.js >= 20.0.0
  - pnpm >= 9.6.0
  - Git
  - VSCode (推荐)
```

### 1.2 项目初始化

```bash
# 克隆项目
git clone <repo-url> ephemera
cd ephemera

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 1.3 环境变量配置

```bash
# .env.local (开发环境)
VITE_API_BASE_URL=https://reify-sdk.zeabur.internal:8080

# .env.production (生产环境)
VITE_API_BASE_URL=https://reify-sdk.zeabur.internal:8080
```

---

## 2. 目录结构

```
app/
├── routes/                 # 路由页面
│   ├── _index.tsx          # 首页 (/)
│   └── daily/              # 新闻模块
│       ├── route.tsx       # 列表页 (/daily)
│       └── [id]/
│           └── route.tsx   # 详情页 (/daily/:id)
│
├── components/             # 组件库
│   ├── ui/                 # 基础 UI (Shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── business/           # 业务组件
│   │   ├── news-card.tsx
│   │   ├── daily-summary.tsx
│   │   └── news-list.tsx
│   └── canvas/             # 3D 场景组件
│       ├── background-scene.tsx
│       └── model-viewer.tsx
│
├── lib/                    # 工具库
│   ├── api.ts              # API 请求封装
│   └── utils.ts            # 通用工具
│
├── types/                  # 类型定义
│   └── api.d.ts            # API 类型
│
└── store/                  # 状态管理
    └── use-config-store.ts
```

---

## 3. 核心开发流程

### 3.1 创建新页面

```
PROCEDURE create_new_page(path):
  
  1. 在 app/routes/ 下创建对应目录结构
  2. 创建 route.tsx 文件
  3. 实现 loader 函数 (数据获取)
  4. 实现页面组件
  5. 更新 app/routes.ts 路由配置
```

**示例: 创建新闻列表页**

```typescript
// app/routes/daily/route.tsx
import type { Route } from "./+types/route";
import { getDailyNews } from '@/lib/api';
import { NewsList } from '@/components/business/news-list';

// 1. Loader: 服务端数据获取
export async function loader({ request }: Route.LoaderArgs) {
  const news = await getDailyNews();
  return { news };
}

// 2. Meta: SEO 标签
export function meta({ data }: Route.MetaArgs) {
  return [
    { title: "60s 读懂世界 | Sruim" },
    { name: "description", content: data?.news?.summary || "每日新闻简报" },
  ];
}

// 3. Component: 页面渲染
export default function DailyPage({ loaderData }: Route.ComponentProps) {
  const { news } = loaderData;
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-6">60s 读懂世界</h1>
      <NewsList data={news} />
    </main>
  );
}
```

### 3.2 创建业务组件

```
PROCEDURE create_business_component(name):
  
  1. 在 app/components/business/ 下创建文件
  2. 定义 Props 接口
  3. 实现组件逻辑
  4. 应用 Sruim Design System 样式
```

**示例: 新闻卡片组件**

```typescript
// app/components/business/news-card.tsx
import type { DailyWorldData } from '@/types/api';
import { cn } from '@/lib/utils';

interface NewsCardProps {
  data: DailyWorldData;
  variant?: 'default' | 'compact';
  className?: string;
}

export function NewsCard({ data, variant = 'default', className }: NewsCardProps) {
  return (
    <article 
      className={cn(
        // Sruim Design System: 大圆角卡片
        "bg-white rounded-[20px] p-6",
        "border border-black/4",
        "shadow-[0_4px_24px_-1px_rgba(0,0,0,0.05)]",
        // 悬停效果: 轻微放大
        "transition-transform hover:scale-[1.02]",
        className
      )}
    >
      <time className="text-[#86868B] text-sm">{data.date}</time>
      <h2 className="text-lg font-semibold text-[#1D1D1F] mt-2">
        {data.summary}
      </h2>
      {variant === 'default' && (
        <p className="text-[#86868B] mt-3 line-clamp-3">
          {data.philosophy}
        </p>
      )}
    </article>
  );
}
```

### 3.3 创建 3D 组件

```
PROCEDURE create_3d_component(name):
  
  1. 在 app/components/canvas/ 下创建文件
  2. 添加 'use client' 指令 (必须!)
  3. 导入 R3F 相关库
  4. 实现 3D 场景
```

**示例: 背景场景组件**

```typescript
// app/components/canvas/background-scene.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';

export function BackgroundScene() {
  return (
    <div className="fixed inset-0 -z-10 opacity-30 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

**示例: 模型查看器 (PRD 规范)**

```typescript
// app/components/canvas/model-viewer.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { cn } from '@/lib/utils';

interface ModelViewerProps {
  modelUrl: string;
  className?: string;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export function ModelViewer({ modelUrl, className }: ModelViewerProps) {
  if (!modelUrl) return null;
  
  return (
    <div className={cn("w-full h-[400px] rounded-[20px] overflow-hidden", className)}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        {/* 背景色: Apple Light Grey */}
        <color attach="background" args={['#F5F5F7']} />
        
        <Suspense fallback={null}>
          {/* Studio Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          {/* 模型 */}
          <Model url={modelUrl} />
          
          {/* 环境反射 */}
          <Environment preset="city" />
        </Suspense>
        
        {/* 交互控制: 限制垂直旋转 */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
```

### 3.4 3D 场景规范 (PRD 标准)

根据 [`ephemera-prd.md`](./ephemera-prd.md) 的要求，3D 场景必须遵循以下规范：

#### 3.4.1 Canvas 配置

```typescript
// 标准 Canvas 配置
<Canvas
  shadows                           // 启用阴影
  gl={{ alpha: true }}             // 允许透明背景
  camera={{
    position: [0, 0, 5],           // 相机位置
    fov: 45                         // 视野角度
  }}
>
  {/* 背景色由 CSS 控制 (极简灰白径向渐变) */}
  {/* <color attach="background" args={['#F5F5F7']} /> */}
  {/* ... */}
</Canvas>
```

#### 3.4.2 光照设置

```typescript
// Studio Lighting 配置
LIGHTING_CONFIG:
  ambientLight:
    intensity: 0.5
  
  directionalLight:
    position: [10, 10, 5]
    intensity: 1
  
  Environment:
    preset: "city" | "studio"
```

#### 3.4.3 OrbitControls 配置

```typescript
// 交互控制配置 (防止看到模型底部)
ORBIT_CONTROLS_CONFIG:
  enablePan: false              // 禁用平移
  enableZoom: true              // 允许缩放
  minPolarAngle: Math.PI / 4    // 最小垂直角度 (45°)
  maxPolarAngle: Math.PI / 1.5  // 最大垂直角度 (120°)
  autoRotate: true              // 自动旋转
  autoRotateSpeed: 0.5          // 旋转速度
```

#### 3.4.4 完整 Scene 组件

```tsx
// app/components/canvas/scene.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  Environment
} from '@react-three/drei';
import { Suspense } from 'react';

interface SceneProps {
  modelUrl: string;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export function Scene({ modelUrl }: SceneProps) {
  return (
    <Canvas 
      shadows 
      gl={{ alpha: true }}
      camera={{ position: [0, 0, 5], fov: 45 }}
    >
      {/* 1. 环境设置 */}
      {/* 背景色由 CSS 控制 (极简灰白径向渐变) */}
      {/* <color attach="background" args={['#F5F5F7']} /> */}
      <Environment preset="city" />
      
      {/* 2. 模型加载与展示 */}
      <Suspense fallback={null}>
        <Model url={modelUrl} />
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
  );
}
```

---

## 4. 样式开发规范

### 4.1 Sruim Design System 核心类

参见 [`UI.md`](./UI.md) 获取完整设计规范。

```css
/* 工业深灰风格背景 (增强对比度) */
body {
  background:
    radial-gradient(circle at 50% 50%, #404040 0%, #262626 60%, #171717 100%);
  color: #F5F5F5;
}
```

#### Canvas 场景适配

为了适配深灰背景，雾气颜色和光照需要微调：

```tsx
/* 1. 深色雾气 - 适配工业深灰背景 */
<fog attach="fog" args={['#404040', 10, 50]} />

/* 2. 环境反射 - 保持适中 */
<Environment preset="city" environmentIntensity={0.5} />
```

#### UI 适配 (HUD)

由于背景变暗，文字颜色需要反转回浅色：
- **主要文字**: `#F5F5F5` (几乎纯白)
- **次要文字**: `#D4D4D4` (浅灰)
- **标签/装饰**: `#A3A3A3` (中浅灰)
- **暗部装饰**: `#737373` (中灰)

```css

/* 磨砂玻璃效果 */
.sruim-glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.05);
}

/* 大圆角卡片 */
.card-sruim {
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

/* 胶囊按钮 */
.btn-sruim {
  background-color: #54B6F5;
  color: white;
  border-radius: 999px;
  padding: 8px 20px;
  font-weight: 500;
}
```

### 4.2 UnoCSS 快捷方式

```typescript
// uno.config.ts
export default defineConfig({
  shortcuts: {
    'text-primary': 'text-[#1D1D1F]',
    'text-secondary': 'text-[#86868B]',
    'bg-canvas': 'bg-[#F5F5F7]',
    'card-sruim': 'bg-white rounded-[20px] border border-black/4 shadow-[0_4px_24px_-1px_rgba(0,0,0,0.05)]',
  },
});
```

---

## 5. 状态管理

### 5.1 Zustand Store 模式

```typescript
// app/store/use-config-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConfigStore {
  theme: 'light' | 'dark';
  locale: string;
  setTheme: (theme: 'light' | 'dark') => void;
  setLocale: (locale: string) => void;
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      theme: 'light',
      locale: 'zh',
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'config-storage' }
  )
);
```

---

## 6. 部署流程

### 6.1 Docker 构建

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "build/server/index.js"]
```

### 6.2 部署命令

```bash
# 构建镜像
docker build -t ephemera:latest .

# 推送到阿里云 ACR
docker tag ephemera:latest registry.cn-hangzhou.aliyuncs.com/sruim/ephemera:latest
docker push registry.cn-hangzhou.aliyuncs.com/sruim/ephemera:latest

# 服务器更新
ssh server "cd /app && docker-compose pull && docker-compose up -d"
```

---

## 7. 开发检查清单

### 新功能开发

```
CHECKLIST: new_feature
  [ ] 阅读 llmdoc/reference/constitution.md
  [ ] 定义 TypeScript 类型
  [ ] 创建组件 (遵循 Sruim Design System)
  [ ] 编写 loader/action (如需数据)
  [ ] 添加错误处理 (error.tsx)
  [ ] 添加加载状态 (loading.tsx)
  [ ] 测试移动端适配
  [ ] 更新文档
```

### 代码审查

```
CHECKLIST: code_review
  [ ] 无 any 类型
  [ ] 无硬编码配置
  [ ] Server/Client Component 正确区分
  [ ] 3D 组件有 'use client'
  [ ] 样式使用 UnoCSS 原子类
  [ ] 颜色符合设计规范
```

---

## ⛔ 禁止事项 (Do NOTs)

### 组件开发
- 🚫 不要在 Server Component 中使用 `useState`/`useEffect`
- 🚫 不要在 Client Component 中直接调用后端 API
- 🚫 不要在 3D 组件中忘记 `'use client'` 指令
- 🚫 不要在 Routes 中定义可复用组件

### 样式开发
- 🚫 不要使用内联样式
- 🚫 不要使用纯黑 `#000000`，使用 `#1D1D1F`
- 🚫 不要使用小圆角，使用 20px+ 大圆角
- 🚫 不要使用 Nunito 字体，使用 SF Pro / Inter

### 状态管理
- 🚫 不要在 Store 中存储可派生状态
- 🚫 不要直接修改 Store 外部的状态

---

## 8. 相关文档

- 产品需求: [`ephemera-prd.md`](./ephemera-prd.md)
- 项目宪法: [`constitution.md`](../reference/constitution.md)
- 系统架构: [`system-overview.md`](../architecture/system-overview.md)
- API 参考: [`daily-world-api-quick-ref.md`](./daily-world-api-quick-ref.md)
- 设计系统: [`UI.md`](./UI.md)