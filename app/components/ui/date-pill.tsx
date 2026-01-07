/**
 * 日期胶囊组件
 * 暗色主题 - Dark Glassmorphism
 * @see llmdoc/guides/UI.md
 */

import dayjs from 'dayjs';
import type React from 'react';

interface DatePillProps {
  /** 日期字符串 (YYYY-MM-DD) */
  date: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 日期胶囊
 * 暗色主题玻璃效果
 *
 * @example
 * ```tsx
 * <DatePill date="2026-01-07" />
 * // 显示: 2026.01.07
 * ```
 */
export const DatePill: React.FC<DatePillProps> = ({ date, className = '' }) => {
  // 格式化日期: YYYY-MM-DD -> YYYY.MM.DD
  const formattedDate = dayjs(date).format('YYYY.MM.DD');

  return (
    <div
      className={`
        inline-flex items-center
        px-4 py-2
        bg-white/10
        backdrop-blur-[24px]
        backdrop-saturate-[180%]
        border border-white/10
        rounded-full
        text-sm font-medium
        text-[#F5F5F7]
        shadow-[0_2px_8px_-2px_rgba(0,0,0,0.3)]
        ${className}
      `}
    >
      <time dateTime={date}>{formattedDate}</time>
    </div>
  );
};

/**
 * 日期胶囊 (带图标)
 * 暗色主题
 */
export const DatePillWithIcon: React.FC<DatePillProps> = ({ date, className = '' }) => {
  const formattedDate = dayjs(date).format('YYYY.MM.DD');

  return (
    <div
      className={`
        inline-flex items-center gap-2
        px-4 py-2
        bg-white/10
        backdrop-blur-[24px]
        backdrop-saturate-[180%]
        border border-white/10
        rounded-full
        text-sm font-medium
        text-[#F5F5F7]
        shadow-[0_2px_8px_-2px_rgba(0,0,0,0.3)]
        ${className}
      `}
    >
      <span className="i-lucide-calendar h-4 w-4 text-[#A1A1A6]" />
      <time dateTime={date}>{formattedDate}</time>
    </div>
  );
};
