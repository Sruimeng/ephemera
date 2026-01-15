---
id: daily-world-api-quick-ref
type: guide
version: "3.0.0"
related_ids:
  - constitution
  - system-overview
  - daily-world-dev
  - ephemera-prd
---

# 🌍 Daily World API 快速参考 (AI 可读)

> **60s 读懂世界** - 获取每日世界观察报告的 API 接口  
> **API Base URL**: `https://reify-sdk.zeabur.internal`

## 1. 核心类型定义

```typescript
// API 响应包装器 (直接返回 data，无包装)
// 注意: 当前 API 直接返回数据对象，不使用 code/msg 包装

// Daily World 数据结构 (对应 Rust Struct) - V3 PRD 版本
interface DailyWorldData {
  date: string;              // ISO 8601 "YYYY-MM-DD"
  theme: string;             // 今日主题 (如 "The Duality of Connection")
  summary: string;           // 今日要闻摘要 (~100字) - 别名: philosophy_summary
  philosophy: string;        // 哲学评判 (~100字) - 兼容旧字段
  news: string[];            // 原始新闻标题列表
  object_description: string; // 3D 物体描述 (英文) - 别名: tripo_prompt
  tripo_prompt: string;      // Tripo 生成 Prompt (元艺术展示)
  model_url: string;         // GLB 模型 URL (可能为空或 http)
}

// 前端使用的规范化类型
interface NormalizedDailyWorld {
  date: string;
  theme: string;
  summary: string;           // 哲学总结
  news: string[];            // 原始新闻列表
  model_url: string;         // GLB 文件地址 (已转 https)
  tripo_prompt: string;      // 生成模型的 Prompt
}

// 错误响应
interface ApiError {
  error: {
    code: 'not_found' | 'invalid_date' | 'db_error';
    message: string;
  };
}
```

---

## 2. 服务器健康检查

### 接口定义

```typescript
interface HealthCheck {
  endpoint: "GET /health";
  response: "OK";  // 纯文本
}
```

### 调用示例

```bash
curl https://reify-sdk.zeabur.internal/health
```

### 预期响应

```
OK
```

### 判断逻辑

```
IF response == "OK" THEN
  服务器运行正常
ELSE
  服务器未启动或异常
```

---

## 3. Daily World API

### 3.1 获取最新数据

#### 接口定义

```typescript
interface DailyWorldRequest {
  method: "GET";
  endpoint: "/api/daily-world";
  headers: {
    "Content-Type": "application/json"
  };
}

interface DailyWorldResponse {
  data: DailyWorldData;
}
```

#### 调用示例

```bash
curl -X GET https://reify-sdk.zeabur.internal/api/daily-world \
  -H "Content-Type: application/json"
```

#### 成功响应 (HTTP 200)

```json
{
  "date": "2026-01-07",
  "theme": "The Duality of Connection",
  "summary": "As silicon valleys rise, human connections deepen yet fragment...",
  "philosophy": "竞争是进步的阶梯，但也是焦虑的源泉...",
  "news": [
    "Tech giants announce new AI partnerships",
    "Global markets respond to policy changes",
    "Climate summit reaches historic agreement"
  ],
  "object_description": "A rusty apple computer floating above flood",
  "tripo_prompt": "A rusty apple computer floating above flood, surrealist style",
  "model_url": "https://tripo-data.cdn.bcebos.com/xxx.glb"
}
```

#### 无数据响应 (HTTP 404)

```json
{
  "error": {
    "code": "not_found",
    "message": "暂无数据，请等待系统生成"
  }
}
```

### 3.2 按日期获取数据

#### 接口定义

```typescript
interface DailyWorldByDateRequest {
  method: "GET";
  endpoint: "/api/daily-world/{date}";
  pathParams: {
    date: string;  // 格式: "YYYY-MM-DD"
  };
}
```

#### 调用示例

```bash
curl -X GET https://reify-sdk.zeabur.internal/api/daily-world/2026-01-06 \
  -H "Content-Type: application/json"
```

#### 错误响应 (HTTP 400)

```json
{
  "error": {
    "code": "invalid_date",
    "message": "日期格式无效，请使用 YYYY-MM-DD 格式"
  }
}
```

---

## 4. 前端集成示例

### 4.1 API Hook (app/hooks/useDailyWorld.ts)

```typescript
const API_BASE = 'https://reify-sdk.zeabur.internal';

/**
 * 规范化 API 响应
 * - 处理 http -> https 转换 (Tripo 有时返回 http)
 * - 统一字段命名
 */
function normalizeData(raw: DailyWorldData): NormalizedDailyWorld {
  return {
    date: raw.date,
    theme: raw.theme || 'Daily Zeitgeist',
    summary: raw.summary || raw.philosophy,
    news: raw.news || [],
    // 关键: 强制转换为 https (混合内容修复)
    model_url: raw.model_url?.replace(/^http:/, 'https:') || '',
    tripo_prompt: raw.tripo_prompt || raw.object_description || '',
  };
}

export async function getDailyWorld(): Promise<NormalizedDailyWorld> {
  const res = await fetch(`${API_BASE}/api/daily-world`, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('暂无数据');
    }
    throw new Error('API 请求失败');
  }
  
  const raw: DailyWorldData = await res.json();
  return normalizeData(raw);
}

export async function getDailyWorldByDate(date: string): Promise<NormalizedDailyWorld> {
  const res = await fetch(`${API_BASE}/api/daily-world/${date}`);
  if (!res.ok) throw new Error('获取数据失败');
  const raw: DailyWorldData = await res.json();
  return normalizeData(raw);
}
```

### 4.2 React Hook 封装

```typescript
// app/hooks/useDailyWorld.ts
import { useState, useEffect } from 'react';

interface UseDailyWorldResult {
  data: NormalizedDailyWorld | null;
  loading: boolean;
  error: Error | null;
}

export function useDailyWorld(): UseDailyWorldResult {
  const [data, setData] = useState<NormalizedDailyWorld | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getDailyWorld()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
```

### 4.3 Server Component 使用

```typescript
// app/routes/daily/page.tsx
import { getDailyNews } from '@/lib/api';

export default async function DailyPage() {
  const news = await getDailyNews();
  
  return (
    <article className="container mx-auto py-8">
      <time className="text-secondary">{news.date}</time>
      <h1 className="text-2xl font-semibold mt-2">{news.summary}</h1>
      <p className="mt-4 text-secondary">{news.philosophy}</p>
    </article>
  );
}
```

### 4.4 React Router v7 Loader 模式

```typescript
// app/routes/daily/route.tsx
import type { Route } from "./+types/route";
import { getDailyNews } from '@/lib/api';

export async function loader({ request }: Route.LoaderArgs) {
  const news = await getDailyNews();
  return { news };
}

export default function DailyPage({ loaderData }: Route.ComponentProps) {
  const { news } = loaderData;
  return (
    <article>
      <h1>{news.summary}</h1>
    </article>
  );
}
```

---

## 5. 完整测试流程

```
PROCEDURE test_daily_world_api():
  
  # Step 1: 健康检查
  response = GET /health
  ASSERT response.body == "OK"
  
  # Step 2: 获取今日数据
  response = GET /api/daily-world
  
  IF response.status == 200 THEN
    ASSERT response.body.data.date IS NOT NULL
    ASSERT response.body.data.summary IS NOT NULL
    RETURN SUCCESS
  
  ELSE IF response.status == 404 THEN
    # 数据尚未生成，等待后重试
    WAIT 60 seconds
    RETRY Step 2 (max 3 times)
  
  ELSE
    RETURN ERROR
```

---

## 6. 错误码速查

| HTTP | Code | 含义 | 处理方式 |
|------|------|------|----------|
| 200 | - | 成功 | 解析 `data` 字段 |
| 400 | `invalid_date` | 日期格式错误 | 检查日期格式 |
| 404 | `not_found` | 数据不存在 | 等待系统生成或显示占位 |
| 500 | `db_error` | 数据库错误 | 检查服务器日志 |

---

## 7. 环境配置

### 后端环境变量

```bash
# 必需
HOST=0.0.0.0
PORT=3000
DATABASE_URL=sqlite:./data/reify-sdk.db?mode=rwc
LLM_API_KEY=sk-your-deepseek-api-key

# 可选 (用于 3D 模型生成)
TRIPO_API_KEY=tsz-your-tripo-api-key
```

### 前端环境变量

```bash
# .env.production
VITE_API_BASE_URL=https://reify-sdk.zeabur.internal
```

---

## 8. 注意事项

### ✅ DO

- ✅ 首次调用前先执行健康检查
- ✅ 处理 404 响应（首次启动需等待数据生成）
- ✅ 缓存响应数据（每日数据不变）
- ✅ 使用 SSR loader 获取数据（SEO 友好）
- ✅ 检查 `model_url` 是否为空再渲染 3D 模型
- ✅ **强制转换 http -> https**（Tripo 有时返回 http URL）
- ✅ 使用 `normalizeData()` 统一字段命名

### ⛔ DO NOT

- 🚫 不要频繁轮询（数据每日更新一次）
- 🚫 不要忽略错误响应的 `code` 字段
- 🚫 不要假设 `model_url` 始终存在（可能为空字符串）
- 🚫 不要在 Client Component 中直接调用 API（应通过 loader 或 hook）
- 🚫 不要硬编码 API URL（使用环境变量）
- 🚫 **不要直接使用 http:// 的 model_url**（会导致混合内容错误）

---

## 9. 相关文档

- 产品需求: [`ephemera-prd.md`](./ephemera-prd.md)
- 系统架构: [`system-overview.md`](../architecture/system-overview.md)
- 开发指南: [`daily-world-dev.md`](./daily-world-dev.md)
- 项目宪法: [`constitution.md`](../reference/constitution.md)