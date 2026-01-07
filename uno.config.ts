import {
  defineConfig,
  presetIcons,
  presetWind3,
  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';
import presetAnimations from 'unocss-preset-animations';

export default defineConfig({
  presets: [
    presetWind3({
      breakpoints: {
        sm: '768px',
      },
    }),
    presetAnimations(),
    presetIcons({
      autoInstall: true,
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup(), transformerCompileClass()],
  theme: {
    colors: {
      background: 'rgba(var(--color-background) / <alpha-value>)',
      foreground: 'rgba(var(--color-foreground) / <alpha-value>)',
      primary: 'rgba(var(--color-primary) / <alpha-value>)',
      secondary: 'rgba(var(--color-secondary) / <alpha-value>)',
      accent: 'rgba(var(--color-accent) / <alpha-value>)',
      muted: 'rgba(var(--color-muted) / <alpha-value>)',
      border: 'rgba(var(--color-border) / <alpha-value>)',
      // Sruim Design System Colors
      canvas: '#F5F5F7',
      tint: '#54B6F5',
      'text-primary': '#1D1D1F',
      'text-secondary': '#86868B',
    },
    animation: {
      keyframes: {
        'fade-in': '{from{opacity:0}to{opacity:1}}',
        'fade-out': '{from{opacity:1}to{opacity:0}}',
        'slide-up': '{from{transform:translateY(100%)}to{transform:translateY(0)}}',
        'slide-down': '{from{transform:translateY(0)}to{transform:translateY(100%)}}',
        'loading-bar': '{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}',
      },
      durations: {
        'fade-in': '0.3s',
        'fade-out': '0.3s',
        'slide-up': '0.3s',
        'slide-down': '0.3s',
        'loading-bar': '1.5s',
      },
      timingFns: {
        'fade-in': 'ease-out',
        'fade-out': 'ease-in',
        'slide-up': 'cubic-bezier(0.32, 0.72, 0, 1)',
        'slide-down': 'cubic-bezier(0.32, 0.72, 0, 1)',
        'loading-bar': 'ease-in-out',
      },
      counts: {
        'loading-bar': 'infinite',
      },
    },
  },
  shortcuts: {
    // Sruim Design System Shortcuts
    'text-primary': 'text-[#1D1D1F]',
    'text-secondary': 'text-[#86868B]',
    'bg-canvas': 'bg-[#F5F5F7]',
    'bg-tint': 'bg-[#54B6F5]',
    // 玻璃效果
    'glass-panel':
      'bg-white/65 backdrop-blur-xl backdrop-saturate-180 border border-white/40 shadow-xl rounded-3xl',
    'glass-card':
      'bg-white/72 backdrop-blur-xl backdrop-saturate-180 border border-white/30 shadow-xl rounded-[20px]',
    // 卡片
    'card-sruim':
      'bg-white rounded-[20px] border border-black/4 shadow-[0_4px_24px_-1px_rgba(0,0,0,0.05)]',
    // 按钮
    'btn-sruim':
      'bg-[#54B6F5] text-white rounded-full px-5 py-2 font-medium transition-all hover:bg-[#3da5e8] active:scale-95',
  },
  rules: [
    // 安全距离相关的工具类
    ['safe-area-pt', { 'padding-top': 'env(safe-area-inset-top, 0px)' }],
    ['safe-area-pb', { 'padding-bottom': 'env(safe-area-inset-bottom, 0px)' }],
    [
      'safe-area-px',
      {
        'padding-left': 'env(safe-area-inset-left, 0px)',
        'padding-right': 'env(safe-area-inset-right, 0px)',
      },
    ],
    [
      'safe-area-py',
      {
        'padding-top': 'env(safe-area-inset-top, 0px)',
        'padding-bottom': 'env(safe-area-inset-bottom, 0px)',
      },
    ],
    [
      'scrollbar-thin',
      {
        'scrollbar-width': 'thin',
        'border-radius': '30px',
        'scrollbar-color': 'rgba(153, 153, 153, 1) rgba(32, 32, 32, 1)',
      },
    ],
    // Glassmorphism backdrop-saturate
    ['backdrop-saturate-180', { 'backdrop-filter': 'saturate(180%)' }],
  ],
});
