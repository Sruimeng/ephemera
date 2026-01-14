---
id: readme
type: overview
related_ids: [constitution, strategy-ephemera-v3, daily-world-api-quick-ref]
---

# Ephemera V3 - Daily World News Aggregator

> **Project**: Digital Art Gallery + News Aggregation
> **Stack**: React Router v7 + React 19 + R3F (SPA Mode)
> **Status**: 🚧 Active Development

## 1. Project Overview

```
TYPE: News Aggregation Application
PURPOSE: 高性能新闻聚合前端，展示 AI 生成的每日简报
FEATURES:
  - 3D Art Visualization (R3F)
  - Multi-language Support (7 languages)
  - Real-time News API Integration
  - Post-processing Visual Effects
```

## 2. Tech Stack

### Core Dependencies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React Router | ^7.12.0 | SPA Routing |
| **UI** | React | ^19.0.0 | UI Framework |
| **Build** | Vite | ^7.3.1 | Build Tool |
| **Language** | TypeScript | ^5.8.3 | Type Safety |
| **Styling** | UnoCSS | ^66.2.0 | Atomic CSS |
| **State** | Zustand | ^5.0.3 | State Management |
| **3D** | React Three Fiber | ^9.5.0 | 3D Rendering |
| **Effects** | Postprocessing | ^6.38.2 | Visual Effects |

### 3D Rendering Stack

- **Engine**: React Three Fiber (R3F)
- **Tools**: @react-three/drei
- **Post-processing**: @react-three/postprocessing
- **Models**: GLB format via Tripo generation

## 3. Project Structure

```
ephemera/
├── app/                            # Application Source
│   ├── entry.client.tsx            # Client Entry Point
│   ├── root.tsx                    # Root Component
│   ├── root.css                    # Global Styles
│   ├── routes.ts                   # Route Configuration
│   │
│   ├── routes/                     # Route Pages
│   │   ├── _index.tsx              # Home Page (State Machine)
│   │   ├── $date.tsx               # Date-specific Route
│   │   └── 404/                    # 404 Page
│   │
│   ├── components/
│   │   ├── ui/                     # UI Components
│   │   │   ├── header.tsx
│   │   │   ├── loading-screen.tsx
│   │   │   ├── insight-panel.tsx
│   │   │   ├── detail-sheet.tsx
│   │   │   ├── glass-card.tsx
│   │   │   ├── date-pill.tsx
│   │   │   ├── date-navigation.tsx
│   │   │   ├── language-switcher.tsx
│   │   │   ├── filter-selector.tsx
│   │   │   └── hud-decorations.tsx
│   │   │
│   │   ├── canvas/                 # 3D Components
│   │   │   ├── scene.tsx           # Main Scene Container
│   │   │   ├── model.tsx           # GLB Model Loader
│   │   │   ├── void-sphere.tsx     # Void Sphere Component
│   │   │   └── index.ts
│   │   │
│   │   ├── post-processing/        # Visual Effects
│   │   │   ├── composer.tsx        # Effect Composer
│   │   │   ├── context.tsx         # Post-processing Context
│   │   │   ├── materials/          # Custom Materials
│   │   │   │   ├── ascii-material.tsx
│   │   │   │   ├── blueprint-material.tsx
│   │   │   │   ├── claymation-material.tsx
│   │   │   │   ├── crystal-material.tsx
│   │   │   │   ├── glitch-material.tsx
│   │   │   │   ├── halftone-material.tsx
│   │   │   │   ├── pixel-material.tsx
│   │   │   │   └── sketch-material.tsx
│   │   │   ├── effects/            # Post-processing Effects
│   │   │   │   ├── base-effects.tsx
│   │   │   │   ├── blueprint-edge-effect.tsx
│   │   │   │   ├── cyber-glitch-effect.tsx
│   │   │   │   └── scanline-effect.tsx
│   │   │   └── backgrounds/        # Background Scenes
│   │   │       ├── blueprint-grid-background.tsx
│   │   │       ├── matrix-rain-background.tsx
│   │   │       ├── newspaper-background.tsx
│   │   │       └── sketchbook-background.tsx
│   │   │
│   │   └── canonical.tsx
│   │   └── error-boundary.tsx
│   │   └── layout.tsx
│   │
│   ├── lib/                        # Utilities
│   │   ├── api.ts                  # API Client (v5)
│   │   ├── api-v5.ts               # API v5 Implementation
│   │   └── api-adapter.ts          # API Adapter
│   │
│   ├── hooks/                      # Custom Hooks
│   │   ├── use-daily-world.ts      # News Data Hook
│   │   ├── use-forge.ts            # 3D Forge Hook
│   │   ├── use-keyboard.ts         # Keyboard Controls
│   │   ├── use-context.ts          # Context Utilities
│   │   ├── debounce.ts
│   │   ├── navigate.ts
│   │   ├── request.ts
│   │   └── index.ts
│   │
│   ├── store/                      # State Management
│   │   ├── use-app-store.ts        # Main App Store
│   │   └── utils/
│   │
│   ├── types/                      # Type Definitions
│   │   ├── api.ts                  # API Types
│   │   ├── api-v5.ts               # API v5 Types
│   │   ├── store.ts                # Store Types
│   │   └── index.ts
│   │
│   ├── constants/                  # Configuration
│   │   ├── meta/                   # Service Config
│   │   │   ├── env.ts
│   │   │   ├── service.ts          # API Endpoints
│   │   │   └── index.ts
│   │   └── static/                 # Static Data
│   │       ├── enum.ts
│   │       ├── storage.ts
│   │       └── index.ts
│   │
│   ├── locales/                    # i18n Resources
│   │   ├── lib/                    # i18next Config
│   │   ├── en/                     # English
│   │   ├── zh/                     # Chinese
│   │   ├── ja/                     # Japanese
│   │   ├── ko/                     # Korean
│   │   ├── es/                     # Spanish
│   │   ├── pt/                     # Portuguese
│   │   ├── ru/                     # Russian
│   │   └── index.ts
│   │
│   └── utils/                      # Helper Functions
│       ├── cookie.ts
│       ├── storage.ts
│       ├── utils.ts
│       └── index.ts
│
├── llmdoc/                         # Documentation Center
├── public/                         # Static Assets
├── package.json                    # Dependencies
├── vite.config.ts                  # Vite Config
├── uno.config.ts                   # UnoCSS Config
├── tsconfig.json                   # TypeScript Config
├── react-router.config.ts          # React Router Config
└── Dockerfile                      # Container Build
```

## 4. Core Features

### 4.1 State Machine

```
STATE_MACHINE:
  [IDLE] → [LOADING] → [TOTEM] ↔ [DETAIL]
                ↓
            [ERROR]

TRANSITIONS:
  - Initial Load: IDLE → LOADING → TOTEM
  - View Details: TOTEM → DETAIL
  - Close Details: DETAIL → TOTEM
  - API Error: LOADING → ERROR
```

### 4.2 API Integration

**Endpoint**: `https://api.sruim.xin/api/daily-world`

**Data Flow**:
```typescript
// app/lib/api-v5.ts
FUNCTION getDailyWorld(date?: string):
  1. CONSTRUCT url = API_BASE + '/api/daily-world' + (date ? `?date=${date}` : '')
  2. FETCH with headers
  3. VALIDATE response
  4. RETURN NormalizedDailyWorld
```

**Type Safety**:
- `DailyWorldData` - Raw API response
- `NormalizedDailyWorld` - Frontend normalized data
- `ApiError` - Error handling

### 4.3 3D Visualization

**Scene Configuration**:
- **Canvas**: `#F5F5F7` background
- **Camera**: FOV 45°, Position [0, 0, 5]
- **Controls**: OrbitControls with vertical limits (45°-120°)
- **Lighting**: Ambient + Directional + Environment
- **Shadows**: Contact Shadows with blur

**Post-processing Effects**:
- ASCII Art
- Blueprint Grid
- Claymation
- Crystal
- Glitch
- Halftone
- Pixel
- Sketch
- Matrix Rain
- Newspaper
- Cyber Glitch
- Scanline

### 4.4 Internationalization

**Supported Languages**:
- English (en) - Default
- 中文 (zh)
- 日本語 (ja)
- 한국어 (ko)
- Español (es)
- Português (pt)
- Русский (ru)

**Resource Structure**:
```
app/locales/{lang}/
  ├── common.json       # Common UI Text
  └── error-toast.json  # Error Messages
```

## 5. Development

### 5.1 Prerequisites

```bash
Node.js >= 20.0.0
pnpm >= 9.6.0
```

### 5.2 Commands

```bash
# Development
pnpm dev

# Build
pnpm build
pnpm build-production
pnpm build-staging

# Production
pnpm start

# Quality
pnpm lint
pnpm typecheck

# Cleanup
pnpm clear
```

### 5.3 Environment

```typescript
// app/constants/meta/env.ts
API_BASE: 'https://api.sruim.xin'
```

## 6. Design System

### 6.1 Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Canvas | Off-White | `#F5F5F7` | Background |
| Tint | Sruim Blue | `#54B6F5` | Accent |
| Glass | Translucent | `rgba(255,255,255,0.72)` | Glassmorphism |
| Text Primary | SF Black | `#1D1D1F` | Main Text |
| Text Secondary | Slate Gray | `#86868B` | Secondary Text |

### 6.2 Glassmorphism

```css
backdrop-filter: blur(20px) saturate(180%);
background: rgba(255,255,255,0.72);
border: 1px solid rgba(255,255,255,0.3);
```

### 6.3 Border Radius

- **Cards**: 20px
- **Pills**: 999px
- **Containers**: 3xl (24px)

## 7. Deployment

### 7.1 Docker

```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder
FROM node:20-alpine AS runner
```

### 7.2 Production Server

- **Server**: Caddy
- **Config**: Automatic HTTPS
- **Mode**: Standalone Docker

## 8. Documentation

### 8.1 Core Documents

- **Constitution**: `llmdoc/reference/constitution.md` - Project standards
- **Strategy**: `llmdoc/agent/strategy-ephemera-v3.md` - Development plan
- **API Quick Ref**: `llmdoc/guides/daily-world-api-quick-ref.md` - API reference

### 8.2 Doc-Driven Development

```
1. Define types in llmdoc/reference/
2. Design architecture in llmdoc/architecture/
3. Write guides in llmdoc/guides/
4. Implement code
5. Update documentation
```

## 9. Quality Standards

### 9.1 Type Safety

- ✅ No `any` types
- ✅ Strict TypeScript
- ✅ Interface-first development

### 9.2 Component Rules

- ✅ Server Components for data fetching
- ✅ Client Components for interactivity
- ✅ `'use client'` for 3D components

### 9.3 Performance

- **FCP**: < 1.5s
- **TTI**: < 3s
- **SPA**: Client-side rendering

## 10. API Reference

**Base URL**: `https://api.sruim.xin`

**Endpoints**:
- `GET /api/daily-world` - Today's news
- `GET /api/daily-world?date=YYYY-MM-DD` - Specific date

**Response Type**:
```typescript
interface DailyWorldData {
  date: string;
  theme: string;
  summary: string;
  news: string[];
  model_url: string;
  tripo_prompt: string;
}
```

See: `app/lib/api-v5.ts:1`

## 11. License

MIT