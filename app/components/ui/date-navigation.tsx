/**
 * DateNavigation 组件
 * 顶部时间控制器 - The Time HUD
 * @see PRD V1.1 Section 3.2
 */

import type React from 'react';

interface DateNavigationProps {
  /** 当前日期 */
  date: Date;
  /** 是否为今天 */
  isToday: boolean;
  /** 是否加载中 */
  isLoading?: boolean;
  /** 前一天 */
  onPrev: () => void;
  /** 后一天 */
  onNext: () => void;
  /** 自定义类名 */
  className?: string;
}

/**
 * 格式化日期为显示格式
 * 桌面端: YYYY.MM.DD
 * 移动端: MM.DD
 */
function formatDateForDisplay(date: Date, compact = false): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  if (compact) {
    return `${month}.${day}`;
  }
  return `${year}.${month}.${day}`;
}

/**
 * 时间导航组件
 *
 * 布局: [ < Prev ] [ 2026.01.08 ] [ Next > ]
 *
 * 交互规则:
 * - Prev: 总是可用
 * - Next: 若当前日期是今天则禁用 (时间线的终点)
 * - 支持键盘快捷键 ← / →
 */
export const DateNavigation: React.FC<DateNavigationProps> = ({
  date,
  isToday,
  isLoading = false,
  onPrev,
  onNext,
  className = '',
}) => {
  const displayDate = formatDateForDisplay(date);
  const compactDate = formatDateForDisplay(date, true);

  return (
    <nav
      className={`
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {/* Prev 按钮 */}
      <button
        onClick={onPrev}
        disabled={isLoading}
        className="group flex items-center gap-1.5 border border-white/10 rounded-sm px-3 py-1.5 text-xs text-[#A3A3A3] tracking-wider font-mono uppercase transition-all active:scale-95 disabled:cursor-not-allowed hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/5 hover:text-[#3B82F6] disabled:opacity-30"
        aria-label="前一天"
      >
        <span className="i-lucide-chevron-left h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* 日期显示 */}
      <div
        className={`
          min-w-[120px] sm:min-w-[140px]
          px-4 py-1.5
          border border-white/10 rounded-sm
          text-center
          transition-all
          ${isLoading ? 'animate-pulse bg-white/5' : ''}
        `}
      >
        {/* 桌面端显示完整日期 */}
        <time
          dateTime={date.toISOString().split('T')[0]}
          className="hidden text-sm text-[#F5F5F5] tracking-wide font-mono tabular-nums sm:block"
        >
          {displayDate}
        </time>
        {/* 移动端显示紧凑日期 */}
        <time
          dateTime={date.toISOString().split('T')[0]}
          className="text-sm text-[#F5F5F5] tracking-wide font-mono tabular-nums sm:hidden"
        >
          {compactDate}
        </time>

        {/* 今天标识 */}
        {isToday && (
          <span className="mt-0.5 block text-[9px] text-[#3B82F6] tracking-widest font-mono uppercase">
            Today
          </span>
        )}
      </div>

      {/* Next 按钮 */}
      <button
        onClick={onNext}
        disabled={isToday || isLoading}
        className="group flex items-center gap-1.5 border border-white/10 rounded-sm px-3 py-1.5 text-xs text-[#A3A3A3] tracking-wider font-mono uppercase transition-all active:scale-95 disabled:cursor-not-allowed hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/5 hover:text-[#3B82F6] disabled:opacity-30"
        aria-label="后一天"
      >
        <span className="hidden sm:inline">Next</span>
        <span className="i-lucide-chevron-right h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </button>
    </nav>
  );
};

/**
 * 紧凑版日期导航 (仅箭头)
 */
export const CompactDateNavigation: React.FC<DateNavigationProps> = ({
  date,
  isToday,
  isLoading = false,
  onPrev,
  onNext,
  className = '',
}) => {
  const compactDate = formatDateForDisplay(date, true);

  return (
    <nav
      className={`
        inline-flex items-center gap-1
        ${className}
      `}
    >
      {/* Prev */}
      <button
        onClick={onPrev}
        disabled={isLoading}
        className="p-1.5 text-[#A3A3A3] transition-colors active:scale-90 disabled:cursor-not-allowed hover:text-[#3B82F6] disabled:opacity-30"
        aria-label="前一天"
      >
        <span className="i-lucide-chevron-left h-4 w-4" />
      </button>

      {/* 日期 */}
      <span
        className={`
          min-w-[60px] text-center
          text-sm text-[#F5F5F5] font-mono tabular-nums
          ${isLoading ? 'animate-pulse' : ''}
        `}
      >
        {compactDate}
      </span>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={isToday || isLoading}
        className="p-1.5 text-[#A3A3A3] transition-colors active:scale-90 disabled:cursor-not-allowed hover:text-[#3B82F6] disabled:opacity-30"
        aria-label="后一天"
      >
        <span className="i-lucide-chevron-right h-4 w-4" />
      </button>
    </nav>
  );
};
