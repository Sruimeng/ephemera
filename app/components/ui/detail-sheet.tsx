/**
 * 详情抽屉组件
 * 暗色主题 - Dark Glassmorphism
 * @see llmdoc/guides/ephemera-prd.md
 */

import type React from 'react';
import { useEffect, useRef } from 'react';
import type { NewsItem } from '~/types/api';
import { GlassPanel } from './glass-card';

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
 * 详情抽屉
 * 暗色主题玻璃材质
 *
 * 触发: 点击底部面板或 "Sources" 按钮
 * 动画: 底部向上滑动扩展 (iOS Sheet 风格)
 * 内容:
 *   - 今日新闻源: data.news[] 列表
 *   - Prompt Reveal: data.tripo_prompt (元艺术展示)
 *
 * @example
 * ```tsx
 * <DetailSheet
 *   isOpen={showDetail}
 *   onClose={() => setShowDetail(false)}
 *   news={data.news}
 *   tripoPrompt={data.tripoPrompt}
 * />
 * ```
 */
export const DetailSheet: React.FC<DetailSheetProps> = ({
  isOpen,
  onClose,
  news,
  tripoPrompt,
  className = '',
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  // 处理 ESC 键关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 处理背景点击关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩: 更深的黑色 + 模糊 */}
      <div
        className="fixed inset-0 z-50 animate-fade-in bg-black/40 backdrop-blur-sm"
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
        <GlassPanel className="overflow-hidden rounded-b-none">
          {/* 拖动指示器 */}
          <div className="flex justify-center pb-2 pt-4">
            <div className="h-1.5 w-12 rounded-full bg-white/20" />
          </div>

          {/* 可滚动内容区 */}
          <div className="max-h-[calc(85vh-48px)] overflow-y-auto px-6 pb-8 safe-area-pb">
            {/* 关闭按钮 */}
            <div className="mb-4 flex justify-end">
              <button
                onClick={onClose}
                className="rounded-full bg-white/10 p-2.5 text-[#A1A1A6] transition-all active:scale-95 hover:bg-white/20 hover:text-[#F5F5F7]"
                aria-label="关闭"
              >
                <span className="i-lucide-x h-5 w-5" />
              </button>
            </div>

            {/* 新闻源列表 */}
            <section className="mb-8">
              <h3 className="mb-4 text-lg text-[#F5F5F7] font-semibold tracking-tight">
                Today&apos;s Sources
              </h3>
              <ul className="space-y-3">
                {news.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 border border-white/10 rounded-2xl bg-white/5 p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.3)]"
                  >
                    <span className="h-6 w-6 flex flex-shrink-0 items-center justify-center rounded-full bg-[#54B6F5]/20 text-xs text-[#54B6F5] font-semibold">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm text-[#F5F5F7] font-medium leading-snug">
                        {item.title}
                      </h4>
                      <p className="mt-1.5 text-xs text-[#A1A1A6] leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Prompt Reveal */}
            {tripoPrompt && (
              <section>
                <h3 className="mb-4 text-lg text-[#F5F5F7] font-semibold tracking-tight">
                  Prompt Reveal
                </h3>
                <div className="overflow-x-auto rounded-2xl bg-black/40 p-5 text-sm text-[#54B6F5] leading-relaxed font-mono">
                  {tripoPrompt}
                </div>
                <p className="mt-3 text-xs text-[#A1A1A6] leading-relaxed">
                  This prompt was used to generate today&apos;s 3D artifact via Tripo AI.
                </p>
              </section>
            )}
          </div>
        </GlassPanel>
      </div>
    </>
  );
};
