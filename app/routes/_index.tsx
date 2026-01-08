'use client';

/**
 * Ephemera V1.1 首页
 * Digital Art Gallery - Time Walker
 * @see PRD V1.1
 */

import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { FullscreenScene, FullscreenVoidScene } from '~/components/canvas/scene';
import { DateNavigation } from '~/components/ui/date-navigation';
import { DetailSheet } from '~/components/ui/detail-sheet';
import { HudOverlay } from '~/components/ui/hud-decorations';
import { InsightPanel, SourcesPanel, VoidInsightPanel } from '~/components/ui/insight-panel';
import { LoadingScreen } from '~/components/ui/loading-screen';
import { useDailyWorldStateMachine } from '~/hooks/use-daily-world';
import { useDateNavigationKeys, useEscapeKey } from '~/hooks/use-keyboard';
import { useAppStore } from '~/store/use-app-store';

/**
 * 格式化日期为 YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * HUD Header with DateNavigation
 * 整合日期导航的顶部 HUD
 */
function TimeHudHeader({
  date,
  isToday,
  isLoading,
  onPrev,
  onNext,
}: {
  date: Date;
  isToday: boolean;
  isLoading: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 safe-area-pt">
      {/* 中央日期导航 */}
      <div className="flex items-center justify-center py-4">
        <DateNavigation
          date={date}
          isToday={isToday}
          isLoading={isLoading}
          onPrev={onPrev}
          onNext={onNext}
        />
      </div>

      {/* 角落装饰 */}
      <div className="absolute left-6 top-4 flex items-center gap-2">
        <span className="text-[10px] text-[#A3A3A3] tracking-[0.2em] font-mono uppercase">
          EPHEMERA.V1.1
        </span>
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3B82F6]" />
      </div>

      <div className="absolute right-6 top-4 flex items-center gap-2">
        <span className="text-[10px] text-[#A3A3A3] font-mono">SYS.NOMINAL</span>
      </div>
    </header>
  );
}

/**
 * 首页组件
 *
 * V1.1 状态机:
 * [LOADING] → [SUCCESS/TOTEM] ↔ [DETAIL]
 *         ↘ [VOID]
 *
 * 新功能:
 * - 时间漫游: 左右方向键/按钮切换日期 (通过 URL 导航)
 * - Void 状态: API 无数据时显示线框球
 * - 后处理: Bloom + Noise + Vignette
 */
export default function Index() {
  const navigate = useNavigate();

  // 使用新的状态机 Hook
  const { date, dateStr, data, status, error, isToday, actions } = useDailyWorldStateMachine();

  // Store 状态 (用于 Detail 面板)
  const { state, openDetail, closeDetail, setState, setData, setVoid } = useAppStore();

  // 派生状态
  const isLoading = status === 'LOADING';
  const isVoid = status === 'VOID';
  const isSuccess = status === 'SUCCESS';

  // Detail 状态
  const isDetailOpen = state === 'detail';

  // 同步 Hook 状态到 Store
  useEffect(() => {
    if (isLoading) {
      setState('loading');
    } else if (isVoid && error) {
      setVoid(error);
    } else if (isSuccess && data) {
      setData(data);
    }
  }, [isLoading, isVoid, isSuccess, data, error, setState, setVoid, setData]);

  // 导航到前一天 (通过 URL)
  const goToPrev = () => {
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    navigate(`/${formatDate(prevDate)}`);
  };

  // 后一天保持内部状态 (因为首页始终显示今天)
  const goToNext = actions.next;

  // 键盘快捷键
  useDateNavigationKeys(goToPrev, goToNext, !isDetailOpen);
  useEscapeKey(closeDetail, isDetailOpen);

  // 计算显示状态
  const showContent = useMemo(() => {
    // 只在有数据时显示内容面板
    return isSuccess && data;
  }, [isSuccess, data]);

  // 根据状态渲染
  return (
    <main className="hud-vignette min-h-screen">
      {/* 顶部时间 HUD - 始终显示 */}
      <TimeHudHeader
        date={date}
        isToday={isToday}
        isLoading={isLoading}
        onPrev={goToPrev}
        onNext={goToNext}
      />

      {/* 加载状态 */}
      {isLoading && <LoadingScreen />}

      {/* VOID 状态 - 无数据 */}
      {isVoid && (
        <>
          <FullscreenVoidScene />
          <HudOverlay />
          <VoidInsightPanel error={error} dateStr={dateStr} />
        </>
      )}

      {/* SUCCESS 状态 - 有数据 */}
      {showContent && data && (
        <>
          {/* 3D 场景 (全屏背景) */}
          <FullscreenScene modelUrl={data.modelUrl} />

          {/* HUD 装饰层 */}
          <HudOverlay />

          {/* Totem 独有 UI: 面板 */}
          {!isDetailOpen && (
            <>
              <InsightPanel data={data} onExpand={openDetail} />
              <SourcesPanel newsCount={data.news.length} onExpand={openDetail} />
            </>
          )}

          {/* Detail 抽屉 */}
          <DetailSheet
            isOpen={isDetailOpen}
            onClose={closeDetail}
            news={data.news}
            tripoPrompt={data.tripoPrompt}
          />
        </>
      )}
    </main>
  );
}

/**
 * Meta 标签
 */
export function meta() {
  return [
    { title: 'Ephemera | Time Walker' },
    {
      name: 'description',
      content: "Daily AI-generated 3D art reflecting the world's zeitgeist - Now with time travel",
    },
    { name: 'theme-color', content: '#050505' },
  ];
}
