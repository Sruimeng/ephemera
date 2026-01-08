/**
 * HUD DetailSheet 组件
 * Ephemera V2: Deep Space Terminal
 * @see llmdoc/guides/ephemera-prd.md
 */

import type React from 'react';
import { useEffect, useRef } from 'react';
import type { NewsItem } from '~/types/api';

interface DetailSheetProps {
  /** 是否打开 */
  isOpen: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 新闻列表 */
  news: NewsItem[];
  /** Tripo Prompt */
  tripoPrompt: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * HUD 风格详情抽屉
 * 终端风格，等宽字体，小圆角
 */
export const DetailSheet: React.FC<DetailSheetProps> = ({
  isOpen,
  onClose,
  news,
  tripoPrompt,
  className = '',
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  // ESC 键关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 背景点击关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 z-50 animate-fade-in bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      {/* 抽屉内容 */}
      <div
        ref={sheetRef}
        className={`
          fixed bottom-0 left-0 right-0 z-50
          max-h-[85vh]
          animate-slide-up
          ${className}
        `}
      >
        <div className="overflow-hidden hud-panel rounded-b-none">
          {/* 拖动指示器 */}
          <div className="flex justify-center py-3">
            <div className="h-1 w-12 rounded-full bg-white/10" />
          </div>

          {/* 头部 */}
          <div className="flex items-center justify-between border-b border-white/5 px-6 pb-4">
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-[#707070] tracking-[0.2em] font-mono uppercase">
                Data.Sources
              </span>
              <span className="text-xs text-[#3B82F6] font-mono">[{news.length}]</span>
            </div>

            <button
              onClick={onClose}
              className="flex items-center gap-2 border border-white/10 rounded-sm px-3 py-1.5 text-[10px] text-[#808080] tracking-wider font-mono uppercase transition-all active:scale-95 hover:border-white/20 hover:text-[#A0A0A0]"
            >
              <span className="i-lucide-x h-3 w-3" />
              <span>Close</span>
              <span className="text-[#606060]">[ESC]</span>
            </button>
          </div>

          {/* 可滚动内容区 */}
          <div className="max-h-[calc(85vh-80px)] overflow-y-auto px-6 py-6 safe-area-pb scrollbar-thin">
            {/* 新闻源列表 */}
            <section className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-[10px] text-[#707070] tracking-[0.2em] font-mono uppercase">
                  Input.News
                </span>
                <div className="h-px flex-1 from-white/10 to-transparent bg-gradient-to-r" />
              </div>

              <ul className="space-y-3">
                {news.map((item, index) => (
                  <li key={index} className="hud-card p-4">
                    <div className="flex items-start gap-4">
                      {/* 索引 */}
                      <span className="text-xs text-[#3B82F6] font-mono tabular-nums">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>

                      {/* 内容 */}
                      <div className="min-w-0 flex-1">
                        <h4 className="mb-2 text-sm text-[#F5F5F5] font-medium leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#909090] leading-relaxed">{item.content}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Prompt Reveal */}
            {tripoPrompt && (
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-[10px] text-[#707070] tracking-[0.2em] font-mono uppercase">
                    Output.Prompt
                  </span>
                  <div className="h-px flex-1 from-white/10 to-transparent bg-gradient-to-r" />
                </div>

                <div className="hud-card p-4">
                  <pre className="whitespace-pre-wrap break-words text-sm text-[#3B82F6] leading-relaxed font-mono">
                    {tripoPrompt}
                  </pre>
                </div>

                <p className="mt-3 text-[10px] text-[#707070] font-mono">
                  {'// Generated via Tripo.AI → GLB Model'}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
