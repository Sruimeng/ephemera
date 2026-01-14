---
id: tech-stack
type: reference
related_ids: [doc-standard]
---

# Tech Stack

## Core Framework

- **React** `19.0.0` - UI library
- **React Router** `7.12.0` - SSR routing + data loading
- **TypeScript** `5.8.3` - Type system
- **Vite** `7.3.1` - Build tool

## 3D Graphics

- **Three.js** `0.182.0` - WebGL engine
- **React Three Fiber** `9.5.0` - React renderer for Three.js
- **Drei** `10.7.7` - Three.js helpers
- **Postprocessing** `6.38.2` - Post-processing effects

## State & Data

- **Zustand** `5.0.3` - Client state management
- **Immer** `11.1.3` - Immutable state updates
- **React Hook Form** `7.54.2` - Form state
- **Zod** `4.3.5` - Schema validation

## i18n

- **i18next** `25.7.3` - Translation engine
- **react-i18next** `16.5.1` - React bindings
- **remix-i18next** `7.2.0` - SSR integration
- **i18next-browser-languagedetector** `8.0.0` - Language detection
- **i18next-fetch-backend** `7.0.0` - Translation loading

Supported languages: 7 (en, zh-CN, zh-TW, ja, ko, es, fr)

## Styling

- **UnoCSS** `66.2.0` - Atomic CSS engine
- **unocss-preset-shadcn** `1.0.1` - Component presets
- **unocss-preset-animations** `1.1.1` - Animation utilities

## Server

- **Express** `4.21.2` - HTTP server
- **@react-router/express** `7.12.0` - SSR middleware
- **@react-router/node** `7.12.0` - Node adapter

## Utilities

- **dayjs** `1.11.13` - Date manipulation
- **ofetch** `1.4.1` - HTTP client
- **lodash-es** `4.17.21` - Utility functions
- **cookie** `1.0.2` - Cookie parsing

## Dev Tools

- **ESLint** `9.23.0` - Linting
- **Prettier** `3.3.3` - Code formatting
- **Stylelint** `16.10.0` - CSS linting
- **Husky** `9.0.11` - Git hooks
- **lint-staged** `16.2.7` - Pre-commit linting

## Runtime Requirements

```
node >= 20.0.0
pnpm >= 9.6.0
```

## ⛔ Constraints

- 🚫 Do NOT use npm/yarn (pnpm only)
- 🚫 Do NOT downgrade React below 19.0.0
- 🚫 Do NOT mix Three.js versions (use 0.182.0)
- 🚫 Do NOT bypass TypeScript strict mode
