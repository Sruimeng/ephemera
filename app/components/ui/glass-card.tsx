/**
 * 玻璃材质卡片组件
 * 暗色主题 - Dark Glassmorphism
 * @see llmdoc/guides/UI.md
 */

import type React from 'react';
import type { ReactNode } from 'react';

interface GlassCardProps {
  /** 子元素 */
  children: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 点击事件 */
  onClick?: () => void;
}

/**
 * 暗色玻璃卡片 - VisionOS 风格
 *
 * 设计规范:
 * - 背景: rgba(30,30,35,0.60) 极低透明度深灰
 * - 模糊: blur(40px) saturate(180%) 高强度模糊 + 饱和度提升
 * - 边框: 顶部亮/底部暗，模拟顶光
 * - 阴影: 深邃漫射阴影
 * - 文字: rgba(255,255,255,0.92) 反白
 * - 圆角: 32px (VisionOS 大圆角)
 *
 * @example
 * ```tsx
 * <GlassCard>
 *   <h2>标题</h2>
 *   <p>内容</p>
 * </GlassCard>
 * ```
 */
export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`
        bg-[rgba(30,30,35,0.60)]
        backdrop-blur-[40px]
        backdrop-saturate-[180%]
        border-t border-t-white/15
        border-b border-b-white/5
        border-l border-l-white/5
        border-r border-r-white/5
        rounded-[32px]
        shadow-[0_20px_40px_rgba(0,0,0,0.4)]
        text-white/92
        ${onClick ? 'cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

/**
 * 暗色玻璃面板 (用于底部悬浮面板)
 * VisionOS 风格 - 发光的透明切片
 */
export const GlassPanel: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`
        bg-[rgba(30,30,35,0.60)]
        backdrop-blur-[40px]
        backdrop-saturate-[180%]
        border-t border-t-white/15
        border-b border-b-white/5
        border-l border-l-white/5
        border-r border-r-white/5
        rounded-[32px]
        shadow-[0_20px_40px_rgba(0,0,0,0.4)]
        text-white/92
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
