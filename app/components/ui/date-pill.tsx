/**
 * HUD DatePill 组件
 * Ephemera V2: Deep Space Terminal
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
 * HUD 风格日期显示
 */
export const DatePill: React.FC<DatePillProps> = ({ date, className = '' }) => {
  const formattedDate = dayjs(date).format('YYYY.MM.DD');

  return (
    <time
      dateTime={date}
      className={`
        font-mono text-sm text-[#E5E5E5] tabular-nums
        ${className}
      `}
    >
      {formattedDate}
    </time>
  );
};

/**
 * 带图标的日期显示
 */
export const DatePillWithIcon: React.FC<DatePillProps> = ({ date, className = '' }) => {
  const formattedDate = dayjs(date).format('YYYY.MM.DD');

  return (
    <div
      className={`
        inline-flex items-center gap-2
        font-mono text-sm
        ${className}
      `}
    >
      <span className="i-lucide-calendar h-3 w-3 text-[#404040]" />
      <time dateTime={date} className="text-[#E5E5E5] tabular-nums">
        {formattedDate}
      </time>
    </div>
  );
};
