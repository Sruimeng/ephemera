/**
 * HUD InsightPanel 组件
 * Ephemera V2: Deep Space Terminal
 * 左下角布局，衬线体标题 + 等宽体数据
 * @see PRD V1.1 Section 3.4
 */

import type React from 'react';
import { useTranslation } from 'react-i18next';
import type { NormalizedDailyWorld } from '~/types/api';

interface InsightPanelProps {
  /** Daily World 完整数据 */
  data: NormalizedDailyWorld;
  /** 展开详情回调 */
  onExpand: () => void;
  /** 自定义类名 */
  className?: string;
}

/**
 * HUD 风格底部信息面板
 * 左下角布局，解构式设计
 */
export const InsightPanel: React.FC<InsightPanelProps> = ({ data, onExpand, className = '' }) => {
  const { t } = useTranslation('common');
  const title = data.theme || t('insight.todayReflection');
  const body = data.summary;

  return (
    <div
      className={`
        fixed bottom-0 left-0 z-40
        max-w-lg
        p-6
        safe-area-pb
        ${className}
      `}
    >
      {/* 数据标签 */}
      <div className="mb-3 flex items-center gap-3">
        <span className="text-[10px] text-[#A3A3A3] tracking-[0.2em] font-mono uppercase">
          {t('insight.objectDescription')}
        </span>
        <div className="h-px flex-1 from-white/10 to-transparent bg-gradient-to-r" />
      </div>

      {/* 哲学标题 - 衬线体 */}
      <h2 className="mb-4 text-xl text-[#F5F5F5] font-medium leading-tight tracking-tight font-serif">
        {title}
      </h2>

      {/* 哲学总结 - 无衬线 */}
      <p className="line-clamp-3 mb-6 text-sm text-[#D4D4D4] leading-relaxed">{body}</p>

      {/* HUD 按钮 */}
      <button
        onClick={onExpand}
        className="group flex items-center gap-3 border border-[#3B82F6]/20 rounded-sm bg-[#3B82F6]/5 px-4 py-2.5 text-xs text-[#3B82F6] tracking-wider font-mono uppercase transition-all active:scale-95 hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
      >
        <span className="h-3 w-3 flex items-center justify-center border border-current rounded-sm">
          <span className="i-lucide-plus h-2 w-2" />
        </span>
        <span>{t('insight.viewSources')}</span>
        <span className="text-[#A3A3A3]">[{data.news.length}]</span>
      </button>
    </div>
  );
};

/**
 * VOID 状态信息面板
 * 当 API 返回 not_found 时显示
 * @see PRD V1.1 Section 3.4 - Void 状态
 */
export const VoidInsightPanel: React.FC<{
  /** 错误信息 */
  error?: Error | null;
  /** 当前日期 */
  dateStr?: string;
  /** 自定义类名 */
  className?: string;
}> = ({ error, dateStr, className = '' }) => {
  const { t } = useTranslation('common');

  return (
    <div
      className={`
        fixed bottom-0 left-0 z-40
        max-w-lg
        p-6
        safe-area-pb
        ${className}
      `}
    >
      {/* 错误标签 */}
      <div className="mb-3 flex items-center gap-3">
        <span className="animate-pulse text-[10px] text-[#EF4444] tracking-[0.2em] font-mono uppercase">
          {t('void.signalLost')}
        </span>
        <div className="h-px flex-1 from-[#EF4444]/30 to-transparent bg-gradient-to-r" />
      </div>

      {/* 错误标题 - 等宽字体红色 */}
      <h2 className="mb-4 text-lg text-[#EF4444] font-bold tracking-tight font-mono">
        {t('void.errorTitle')}
      </h2>

      {/* 错误描述 */}
      <p className="mb-4 text-sm text-[#A3A3A3] leading-relaxed font-mono">
        {t('void.noArtifacts')}
      </p>

      {/* 技术细节 */}
      <div className="text-xs text-[#525252] font-mono space-y-1">
        {dateStr && (
          <p>
            {t('void.target')}: {dateStr}
          </p>
        )}
        {error && (
          <p>
            {t('void.reason')}: {error.message}
          </p>
        )}
        <p>{t('void.status')}</p>
      </div>
    </div>
  );
};

/**
 * 右侧源数据面板
 * 竖排浮动数据点
 */
export const SourcesPanel: React.FC<{
  newsCount: number;
  onExpand: () => void;
  className?: string;
}> = ({ newsCount, onExpand, className = '' }) => {
  const { t } = useTranslation('common');

  return (
    <div
      className={`
        fixed bottom-1/3 right-6 z-40
        flex flex-col items-end gap-4
        ${className}
      `}
    >
      {/* 数据点 */}
      <button
        onClick={onExpand}
        className="group flex flex-col items-end gap-1 transition-all hover:translate-x-[-4px]"
      >
        <span className="text-[10px] text-[#A3A3A3] tracking-[0.15em] font-mono uppercase">
          {t('insight.sources')}
        </span>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3B82F6]" />
          <span className="text-2xl text-[#3B82F6] font-mono tabular-nums text-glow">
            {newsCount.toString().padStart(2, '0')}
          </span>
        </div>
      </button>

      {/* 装饰线 */}
      <div className="h-16 w-px from-white/10 to-transparent bg-gradient-to-b" />
    </div>
  );
};

/**
 * 紧凑版信息面板 (移动端)
 */
export const CompactInsightPanel: React.FC<InsightPanelProps> = ({
  data,
  onExpand,
  className = '',
}) => {
  const { t } = useTranslation('common');
  const title = data.theme || t('insight.todayReflection');

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-40
        safe-area-pb
        ${className}
      `}
    >
      <button
        onClick={onExpand}
        className="w-full flex items-center justify-between hud-panel p-4 text-left transition-all active:scale-[0.98]"
      >
        <div className="min-w-0 flex-1">
          <span className="mb-1 block text-[10px] text-[#A3A3A3] tracking-[0.15em] font-mono uppercase">
            {t('insight.objectDescription')}
          </span>
          <h2 className="truncate text-base text-[#F5F5F5] font-medium font-serif">{title}</h2>
        </div>
        <div className="ml-4 flex items-center gap-2">
          <span className="text-xs text-[#3B82F6] font-mono">[{data.news.length}]</span>
          <span className="i-lucide-chevron-up h-4 w-4 text-[#A3A3A3]" />
        </div>
      </button>
    </div>
  );
};
