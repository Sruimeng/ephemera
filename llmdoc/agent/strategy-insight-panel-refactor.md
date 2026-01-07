---
id: strategy-insight-panel-refactor
type: strategy
version: "1.0.0"
related_ids:
  - daily-world-api-quick-ref
  - ui-design-system
  - ephemera-prd
---

# 🎯 Strategy: InsightPanel 数据驱动重构

## 1. 问题陈述

### 当前状态

```
API Response:
{
  "summary": "新闻摘要 (~100字)",      // 真实新闻
  "philosophy": "哲学思考 (~100字)",   // 哲学评判
  ...
}

当前 InsightPanel Props:
- theme: string      → 显示在标题
- summary: string    → 显示在正文
- onExpand: () => void

当前调用 (_index.tsx:87):
<InsightPanel 
  theme={data.theme}        // object_description
  summary={data.summary}    // philosophy (经过 normalizeData)
  onExpand={openDetail} 
/>
```

### 用户期望

| 位置 | 当前显示 | 期望显示 |
|------|----------|----------|
| 面板标题 | `object_description` | 可选标题或省略 |
| 面板正文 | `philosophy` | `philosophy` ✅ |
| Sources 按钮 | 打开 DetailSheet | 打开 DetailSheet 显示 `news[]` |

**核心问题**: 用户确认面板应显示 `philosophy`，"Sources" 按钮点击后展示真实新闻 `summary`/`news[]`。

---

## 2. 解决方案设计

### 2.1 新类型定义

```typescript
// 新增: InsightPanel 专用数据类型
interface InsightPanelData {
  /** 哲学思考 - 显示在面板正文 */
  philosophy: string;
  /** 物体描述 - 可选标题 */
  objectDescription?: string;
}

// 修改: InsightPanel Props
interface InsightPanelProps {
  /** Daily World 数据 (直接传入整个对象) */
  data: NormalizedDailyWorld;
  /** 展开详情回调 */
  onExpand: () => void;
  /** 自定义类名 */
  className?: string;
}
```

### 2.2 数据映射逻辑

```
PROCEDURE render_insight_panel(data: NormalizedDailyWorld):
  
  # 标题: 使用 object_description 或默认值
  title = data.theme || "Today's Reflection"
  
  # 正文: 使用 philosophy (已在 normalizeData 中映射到 summary)
  body = data.summary
  
  # 按钮: "Sources" → 触发 onExpand → 打开 DetailSheet
  # DetailSheet 显示 data.news[] 和 data.tripoPrompt
  
  RENDER:
    <GlassPanel>
      <h2>{title}</h2>
      <p>{body}</p>
      <button onClick={onExpand}>Sources</button>
    </GlassPanel>
```

### 2.3 API 数据流修正

当前 `normalizeData()` 存在问题:

```typescript
// 当前 (app/lib/api.ts:54-66)
function normalizeData(raw: DailyWorldData): NormalizedDailyWorld {
  return {
    theme: raw.object_description || 'Daily Zeitgeist',  // ❌ 错误映射
    summary: raw.summary || raw.philosophy || '',        // ⚠️ 混淆
    ...
  };
}
```

**修正方案**: 保持 `normalizeData` 不变，在组件层面正确使用字段。

---

## 3. 实现计划

### Step 1: 修改 NormalizedDailyWorld 类型

```typescript
// app/types/api.ts
interface NormalizedDailyWorld {
  date: string;
  theme: string;           // object_description (3D物体描述)
  summary: string;         // philosophy (哲学思考) - 保持现有映射
  philosophy?: string;     // 新增: 原始 philosophy 字段 (可选)
  news: string[];
  modelUrl: string;
  tripoPrompt: string;
}
```

### Step 2: 重构 InsightPanel 组件

```typescript
// app/components/ui/insight-panel.tsx

interface InsightPanelProps {
  /** Daily World 完整数据 */
  data: NormalizedDailyWorld;
  /** 展开详情回调 */
  onExpand: () => void;
  /** 自定义类名 */
  className?: string;
}

export const InsightPanel: React.FC<InsightPanelProps> = ({
  data,
  onExpand,
  className = '',
}) => {
  // 面板标题: 使用 theme (object_description)
  const title = data.theme || "Today's Reflection";
  
  // 面板正文: 使用 summary (philosophy)
  const body = data.summary;
  
  return (
    <GlassPanel>
      <h2>{title}</h2>
      <p>{body}</p>
      <button onClick={onExpand}>Sources</button>
    </GlassPanel>
  );
};
```

### Step 3: 更新调用处

```typescript
// app/routes/_index.tsx

// 旧代码:
<InsightPanel theme={data.theme} summary={data.summary} onExpand={openDetail} />

// 新代码:
<InsightPanel data={data} onExpand={openDetail} />
```

### Step 4: 同步更新 CompactInsightPanel

保持与 InsightPanel 相同的 Props 接口。

---

## 4. 影响分析

### 修改文件清单

| 文件 | 修改类型 | 说明 |
|------|----------|------|
| `app/components/ui/insight-panel.tsx` | 重构 | Props 改为接收 `data` 对象 |
| `app/routes/_index.tsx` | 调整 | 更新 InsightPanel 调用方式 |

### 不修改的文件

| 文件 | 原因 |
|------|------|
| `app/types/api.ts` | 类型定义已足够 |
| `app/lib/api.ts` | normalizeData 逻辑保持不变 |
| `app/components/ui/detail-sheet.tsx` | 已正确使用 news[] |

---

## 5. 验证清单

- [ ] InsightPanel 面板正文显示 `philosophy` 内容
- [ ] InsightPanel 标题显示 `object_description` 内容
- [ ] "Sources" 按钮点击后打开 DetailSheet
- [ ] DetailSheet 正确显示 `news[]` 列表
- [ ] CompactInsightPanel 同步更新
- [ ] TypeScript 类型检查通过
- [ ] 无运行时错误

---

## 6. 负面约束 (DO NOTs)

🚫 **不要** 修改 `normalizeData()` 函数的映射逻辑  
🚫 **不要** 在 InsightPanel 内部调用 API  
🚫 **不要** 改变 DetailSheet 的 Props 接口  
🚫 **不要** 移除现有的样式类名  

---

## 7. 审批

**请确认此策略后，我将开始实现。**