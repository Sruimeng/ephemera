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
      // Ephemera V2: Deep Space Terminal
      canvas: '#050505', // 接近纯黑的深炭色
      panel: 'rgba(20, 20, 20, 0.6)', // 深色玻璃
      'hud-accent': '#3B82F6', // 荧光蓝
      'hud-accent-dim': '#1E40AF', // 暗蓝
      text: {
        primary: '#E5E5E5', // 主文字
        dim: '#525252', // 暗淡文字
        tech: '#3B82F6', // 技术数据
        muted: '#404040', // 更暗的装饰文字
      },
    },
    fontFamily: {
      // 等宽字体 - 用于 HUD 数据
      mono: ['"JetBrains Mono"', '"SF Mono"', 'Menlo', 'monospace'],
      // 无衬线 - 用于正文
      sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      // 衬线体 - 用于哲学标题
      serif: ['"Playfair Display"', '"Times New Roman"', 'serif'],
    },
    animation: {
      keyframes: {
        'fade-in': '{from{opacity:0}to{opacity:1}}',
        'fade-out': '{from{opacity:1}to{opacity:0}}',
        'slide-up': '{from{transform:translateY(100%)}to{transform:translateY(0)}}',
        'slide-down': '{from{transform:translateY(0)}to{transform:translateY(100%)}}',
        'loading-bar': '{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}',
        // HUD 动画
        'pulse-glow': '{0%,100%{opacity:0.4}50%{opacity:1}}',
        'scan-line': '{0%{transform:translateY(-100%)}100%{transform:translateY(100%)}}',
        flicker: '{0%,100%{opacity:1}50%{opacity:0.8}}',
        'data-stream': '{0%{transform:translateY(0)}100%{transform:translateY(-50%)}}',
      },
      durations: {
        'fade-in': '0.3s',
        'fade-out': '0.3s',
        'slide-up': '0.4s',
        'slide-down': '0.4s',
        'loading-bar': '1.5s',
        'pulse-glow': '2s',
        'scan-line': '3s',
        flicker: '0.1s',
        'data-stream': '20s',
      },
      timingFns: {
        'fade-in': 'ease-out',
        'fade-out': 'ease-in',
        'slide-up': 'cubic-bezier(0.32, 0.72, 0, 1)',
        'slide-down': 'cubic-bezier(0.32, 0.72, 0, 1)',
        'loading-bar': 'ease-in-out',
        'pulse-glow': 'ease-in-out',
        'scan-line': 'linear',
        flicker: 'steps(2)',
        'data-stream': 'linear',
      },
      counts: {
        'loading-bar': 'infinite',
        'pulse-glow': 'infinite',
        'scan-line': 'infinite',
        'data-stream': 'infinite',
      },
    },
  },
  shortcuts: {
    // Ephemera V2: Deep Space Terminal Shortcuts
    'text-primary': 'text-[#E5E5E5]',
    'text-dim': 'text-[#525252]',
    'text-tech': 'text-[#3B82F6]',
    'text-muted': 'text-[#404040]',
    'bg-canvas': 'bg-[#050505]',
    'bg-panel': 'bg-[rgba(20,20,20,0.6)]',

    // HUD 技术边框
    'tech-border':
      'border border-white/10 bg-black/40 backdrop-blur-[10px] shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]',

    // HUD 面板 (小圆角，极细边框)
    'hud-panel':
      'bg-[rgba(10,10,10,0.8)] backdrop-blur-[20px] border border-white/5 rounded-sm shadow-[inset_0_0_30px_rgba(255,255,255,0.01),0_0_40px_rgba(0,0,0,0.5)]',

    // HUD 卡片
    'hud-card':
      'bg-[rgba(15,15,15,0.7)] backdrop-blur-[16px] border border-white/8 rounded-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',

    // 数据标签
    'data-label': 'font-mono text-xs text-[#525252] uppercase tracking-[0.2em]',

    // 数据值
    'data-value': 'font-mono text-sm text-[#3B82F6]',

    // 荧光按钮
    'btn-hud':
      'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all hover:bg-[#3B82F6]/20 hover:border-[#3B82F6]/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95',

    // 哲学标题 (衬线体)
    'title-philosophy': 'font-serif text-[#E5E5E5] tracking-tight',

    // HUD 装饰线
    'hud-line': 'h-px bg-gradient-to-r from-transparent via-white/10 to-transparent',
    'hud-line-v': 'w-px bg-gradient-to-b from-transparent via-white/10 to-transparent',
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
        'scrollbar-color': 'rgba(59, 130, 246, 0.3) rgba(10, 10, 10, 1)',
      },
    ],
    // HUD 内发光
    [
      'glow-inner',
      {
        'box-shadow': 'inset 0 0 20px rgba(59, 130, 246, 0.1)',
      },
    ],
    // 荧光文字阴影
    [
      'text-glow',
      {
        'text-shadow': '0 0 10px rgba(59, 130, 246, 0.5)',
      },
    ],
  ],
});
