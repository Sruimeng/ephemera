---
id: ui-design-system
type: guide
version: "2.0.0"
related_ids:
  - constitution
  - daily-world-dev
---

# 📘 Sruim Design System v2.0 (Apple Inspired)

## 1. 核心理念 (Philosophy)

* **Ethereal Precision (空灵精密):** 将天蓝色作为“光”而非“漆”。界面如同精密仪器，干净、克制，但有呼吸感。
* **Spatial (空间感):** 借鉴 visionOS，利用半透明材质（Glassmorphism）和微妙的阴影来构建层级，强调 3D 内容的呈现（非常适合你的 3D 渲染背景）。
* **Continuity (连续性):** 拒绝生硬的几何切角，拥抱平滑的连续曲率。

---

## 2. 色彩策略：Tint & Structure

Apple 风格通常不会大面积铺设高饱和度颜色，而是使用**中性色作为画布**，将你的 **Sruim Blue** 作为**强调色 (Tint Color)** 点缀关键交互。

| 角色 | 颜色 | Hex | 苹果风格用法 |
| --- | --- | --- | --- |
| **Canvas (画布)** | Off-White / Pure Black | `#F5F5F7` / `#000000` | 极浅的灰白色背景，而非纯白，减少眼部疲劳。 |
| **Tint (强调)** | **Sruim Blue** | `#007AFF` (接近你的 #54B6F5) | 用于按钮、选中状态、链接、图标。 |
| **Glass (材质)** | Translucent White | `rgba(255,255,255, 0.7)` | 配合高斯模糊，用于导航栏、侧边栏。 |
| **Text Primary** | SF Black | `#1D1D1F` | 近乎黑色的深灰，比纯黑更柔和。 |
| **Text Secondary** | Slate Gray | `#86868B` | 用于辅助说明，低对比度。 |

---

## 3. 图形形态：The Superellipse (超椭圆)

这是 Apple 硬件和软件图标的标志性特征。区别于标准的 `border-radius`，它的圆角过渡更加平滑自然。

* **规范：** 所有的容器、图标背景、Avatar 头像，都应采用**连续曲率圆角 (Squircle)**。
* **CSS 模拟技巧：** 虽然 CSS 标准圆角不是真正的超椭圆，但可以通过稍微加大圆角半径来接近这种感觉。
```css
.card-sruim {
  /* 大圆角，类似 iOS 的卡片 */
  border-radius: 20px; 
  /* Apple 风格的微妙描边，增加精致感 */
  border: 1px solid rgba(0, 0, 0, 0.04); 
}

```



---

## 4. 质感与光影 (Materiality)

作为 3D 工程师，你的界面应该体现“光”的质感。

### 4.1 磨砂玻璃 (Vision Glass)

不要使用简单的透明，要使用带有**背景模糊**和**饱和度提升**的磨砂效果，模拟高级光学玻璃。

```css
.sruim-glass {
  background: rgba(255, 255, 255, 0.72); /* 半透明白 */
  backdrop-filter: blur(20px) saturate(180%); /* 核心：模糊+饱和度提升 */
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3); /* 玻璃边缘高光 */
  box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.05); /* 极柔和的阴影 */
}

```

### 4.2 弥散光 (Ambient Glow)

为了呼应你 favicon 中的发光效果，但又不失 Apple 的克制：不要让文字直接发光，而是让**物体投射出蓝色的环境光**。

```css
.sruim-highlight-box {
  position: relative;
  background: white;
  z-index: 1;
}
/* 在元素背后生成一个柔和的蓝色光晕，像是屏幕背光 */
.sruim-highlight-box::after {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  width: 80%; height: 80%;
  transform: translate(-50%, -50%);
  background: #54B6F5;
  filter: blur(40px);
  opacity: 0.25; /* 极低透明度，若隐若现 */
  z-index: -1;
}

```

---

## 5. 字体排印 (Typography)

放弃 Nunito 这种过于圆润可爱的字体。Apple 风格强调**冷静、中性、易读**。

* **首选字体:** **San Francisco (SF Pro)** (如果是在 Apple 设备上)。
* **Web 替代:** **Inter** 或 **Roboto** (但在字重和字间距上要做微调)。
* **排版特征:**
* **Tracking (字间距):** 标题的字间距稍微收紧 (如 `-0.02em`)，小字号正文稍微由于 (`0.01em`)。
* **Weight (字重):** 使用 `500` (Medium) 或 `600` (Semi-bold) 作为标题，而不是粗壮的 `700+`。



```css
body {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif;
  -webkit-font-smoothing: antialiased; /* iOS 字体抗锯齿，这很重要 */
  color: #1D1D1F;
}

h1 {
  font-weight: 600;
  letter-spacing: -0.02em; /* 紧凑感 */
}

```

---

## 6. 组件应用示例

### 导航栏 / Header

* **背景:** 高度 44px 或 60px，使用 `.sruim-glass` 效果，固定在顶部。
* **Logo:** 左侧放置你的 `S` 图标。
* **链接:** 黑色文字，Hover 时变为 Sruim Blue。

### 项目卡片 (展示你的 3D 引擎)

* **外观:** 白色背景大圆角卡片，悬浮在浅灰背景上。
* **图片:** 卡片上方的缩略图不需要圆角（或者只有顶部圆角），铺满。
* **交互:** 鼠标悬停时，卡片不上移，而是**轻微放大 (Scale 1.02)** 并增加阴影扩散，这比位移更显高级。

### 按钮 (Primary Action)

从“糖果”变为“胶囊”。

```css
.btn-apple-style {
  background-color: #54B6F5; /* Sruim Blue */
  color: white;
  border-radius: 999px; /* 胶囊形 */
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  /* 移除投影，或者使用非常微弱的蓝色投影 */
  box-shadow: 0 2px 10px rgba(84, 182, 245, 0.2); 
}
.btn-apple-style:active {
  transform: scale(0.96); /* 按压回弹效果 */
  opacity: 0.8;
}

```

---

### 总结变化点

| 维度 | 旧版 (可爱/科技) | 新版 (Apple/工程) |
| --- | --- | --- |
| **圆角** | 圆形或大圆角 | 连续曲率超椭圆 (Squircle) |
| **颜色** | 大面积蓝色渐变 | 大面积灰白，蓝色仅作点缀 |
| **质感** | 霓虹发光 | 磨砂玻璃 + 物理光学 |
| **字体** | 圆体 (Nunito) | 无衬线 (SF Pro / Inter) |
| **氛围** | 活泼、游戏化 | 专业、冷静、空间感 |