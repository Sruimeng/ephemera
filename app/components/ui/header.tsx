/**
 * HUD Header 组件
 * Ephemera V2: Deep Space Terminal
 * @see llmdoc/guides/ephemera-prd.md
 */

import dayjs from 'dayjs';
import type React from 'react';
import { LiveTimestamp, SignalIndicator, StatusDot } from './hud-decorations';

interface HudHeaderProps {
  /** 日期字符串 (YYYY-MM-DD) */
  date: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * HUD 风格顶部导航
 * 左侧: 日期 + 时间戳
 * 右侧: 状态指示
 */
export const HudHeader: React.FC<HudHeaderProps> = ({ date, className = '' }) => {
  const formattedDate = dayjs(date).format('YYYY.MM.DD');

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        px-6 py-4
        flex items-start justify-between
        safe-area-pt
        ${className}
      `}
    >
      {/* 左侧: 日期 + 时间戳 */}
      <div className="flex flex-col gap-1">
        {/* 主日期 */}
        <div className="flex items-baseline gap-3">
          <time dateTime={date} className="text-sm text-[#F5F5F5] font-mono tabular-nums">
            {formattedDate}
          </time>
          <span className="text-[#A3A3A3]">{'//'}</span>
          <LiveTimestamp />
        </div>

        {/* 数据标签 */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#A3A3A3] tracking-[0.2em] font-mono uppercase">
            Daily Zeitgeist
          </span>
          <StatusDot status="online" />
        </div>
      </div>

      {/* 右侧: 系统状态 */}
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#A3A3A3] tracking-wider font-mono uppercase">
            EPHEMERA.V2
          </span>
          <SignalIndicator />
        </div>
        <span className="text-[10px] text-[#A3A3A3] font-mono">SYS.NOMINAL</span>
      </div>
    </header>
  );
};

/**
 * 透明 Header (兼容旧接口)
 */
export const TransparentHeader = HudHeader;

/**
 * 旧版 Header (兼容)
 */
export const Header = HudHeader;
