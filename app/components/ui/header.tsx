/**
 * 顶部导航栏组件
 * 暗色主题 - Dark Glassmorphism
 * @see llmdoc/guides/ephemera-prd.md
 */

import type React from 'react';
import { DatePill } from './date-pill';

/**
 * Sruim Logo 组件
 * 纯净的 Sruim Blue 胶囊按钮
 */
const SruimLogo: React.FC = () => {
  return (
    <div className="h-9 w-15 flex items-center justify-center rounded-xl bg-[#54B6F5] text-lg text-white font-bold shadow-[0_2px_8px_-2px_rgba(84,182,245,0.4)]">
      Sruim
    </div>
  );
};

interface HeaderProps {
  /** 日期字符串 (YYYY-MM-DD) */
  date: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 顶部导航栏
 * 暗色主题玻璃效果
 *
 * 布局:
 * - 左侧: Sruim Logo (小尺寸)
 * - 右侧: 日期胶囊
 *
 * @example
 * ```tsx
 * <Header date="2026-01-07" />
 * ```
 */
export const Header: React.FC<HeaderProps> = ({ date, className = '' }) => {
  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        h-16
        px-6
        flex items-center justify-between
        bg-[rgba(20,20,25,0.75)]
        backdrop-blur-[24px]
        backdrop-saturate-[180%]
        border-b border-white/10
        safe-area-pt
        ${className}
      `}
    >
      {/* 左侧: Logo + 标题 */}
      <div className="flex items-center gap-3">
        <SruimLogo />
        <span className="text-lg text-[#F5F5F7] font-semibold tracking-tight">Ephemera</span>
      </div>

      {/* 右侧: 日期胶囊 */}
      <DatePill date={date} />
    </header>
  );
};

/**
 * 透明 Header (用于 Totem 状态)
 * 不带背景色，仅显示 Logo 和日期
 */
export const TransparentHeader: React.FC<HeaderProps> = ({ date, className = '' }) => {
  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        h-16
        px-6
        flex items-center justify-between
        safe-area-pt
        ${className}
      `}
    >
      {/* 左侧: Logo */}
      <div className="flex items-center gap-3">
        <SruimLogo />
      </div>

      {/* 右侧: 日期胶囊 */}
      <DatePill date={date} />
    </header>
  );
};
