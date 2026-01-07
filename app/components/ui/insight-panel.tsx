/**
 * 底部信息面板组件
 * 暗色主题 - Dark Glassmorphism
 * @see llmdoc/guides/ephemera-prd.md
 * @see llmdoc/agent/strategy-insight-panel-refactor.md
 */

import type React from 'react';
import type { NormalizedDailyWorld } from '~/types/api';
import { GlassPanel } from './glass-card';

interface InsightPanelProps {
  /** Daily World 完整数据 */
  data: NormalizedDailyWorld;
  /** 展开详情回调 */
  onExpand: () => void;
  /** 自定义类名 */
  className?: string;
}

/**
 * 底部信息面板
 * 暗色主题玻璃材质
 *
 * 位置: 屏幕底部中央悬浮
 * 材质: 暗色玻璃卡片 (dark glass-panel)
 * 内容:
 *   - H2: 物体描述 (data.theme) - 浅灰白 #F5F5F7
 *   - P: 哲学总结 (data.summary) - 次级灰 #A1A1A6
 *   - Button: "Sources" 链接 - Sruim Blue #54B6F5
 *
 * @example
 * ```tsx
 * <InsightPanel
 *   data={dailyWorldData}
 *   onExpand={() => setShowDetail(true)}
 * />
 * ```
 */
export const InsightPanel: React.FC<InsightPanelProps> = ({ data, onExpand, className = '' }) => {
  // 面板标题: 使用 theme (object_description)
  const title = data.theme || "Today's Reflection";
  // 面板正文: 使用 summary (philosophy)
  const body = data.summary;

  return (
    <div
      className={`
        fixed bottom-4 left-4 right-4 z-40
        max-w-xl mx-auto
        safe-area-pb
        ${className}
      `}
    >
      {/* 增加内部留白 p-8，让卡片更有呼吸感 */}
      <GlassPanel className="p-8">
        {/* 物体描述标题: 浅灰白，紧凑字间距，字重 600 */}
        <h2 className="mb-4 text-lg text-[#F5F5F7] font-semibold leading-snug tracking-[-0.5px]">
          {title}
        </h2>

        {/* 哲学总结: 次级灰 #A1A1A6，加大行高 1.8 */}
        <p className="line-clamp-3 mb-6 text-sm text-[#A1A1A6] leading-[1.8]">{body}</p>

        {/* 展开按钮: 纯净 Sruim Blue 胶囊 */}
        <button
          onClick={onExpand}
          className="inline-flex items-center gap-2 rounded-full bg-[#54B6F5] px-5 py-2.5 text-sm text-white font-medium shadow-[0_4px_12px_rgba(84,182,245,0.3)] transition-all active:scale-95 hover:bg-[#3da5e8]"
        >
          <span className="i-lucide-info h-4 w-4" />
          Sources
        </button>
      </GlassPanel>
    </div>
  );
};

/**
 * 紧凑版信息面板
 * 用于移动端或小屏幕
 */
export const CompactInsightPanel: React.FC<InsightPanelProps> = ({
  data,
  onExpand,
  className = '',
}) => {
  // 面板标题: 使用 theme (object_description)
  const title = data.theme || "Today's Reflection";
  // 面板正文: 使用 summary (philosophy)
  const body = data.summary;

  return (
    <div
      className={`
        fixed bottom-4 left-4 right-4 z-40
        safe-area-pb
        ${className}
      `}
    >
      <GlassPanel className="p-4" onClick={onExpand}>
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base text-[#F5F5F7] font-semibold tracking-tight">
              {title}
            </h2>
            <p className="mt-1.5 truncate text-xs text-[#A1A1A6]">{body}</p>
          </div>
          <span className="i-lucide-chevron-up ml-3 h-5 w-5 text-[#A1A1A6]" />
        </div>
      </GlassPanel>
    </div>
  );
};
