'use client';

/**
 * Ephemera V2 首页
 * Digital Art Gallery - Deep Space Terminal
 * @see llmdoc/guides/ephemera-prd.md
 */

import { useEffect } from 'react';
import { FullscreenScene } from '~/components/canvas/scene';
import { DetailSheet } from '~/components/ui/detail-sheet';
import { TransparentHeader } from '~/components/ui/header';
import { HudOverlay } from '~/components/ui/hud-decorations';
import { InsightPanel, SourcesPanel } from '~/components/ui/insight-panel';
import { LoadingScreen } from '~/components/ui/loading-screen';
import { useDailyWorld } from '~/hooks/use-daily-world';
import { useAppStore } from '~/store/use-app-store';

/**
 * 错误视图组件 - HUD 风格
 */
function ErrorView({ error }: { error: Error | null }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] px-6">
      <div className="max-w-md text-center">
        {/* 错误图标 */}
        <div className="mb-6 text-4xl text-[#EF4444] font-mono">[!]</div>

        {/* 错误标题 */}
        <h1 className="mb-3 text-lg text-[#E5E5E5] tracking-wider font-mono uppercase">
          System.Error
        </h1>

        {/* 错误信息 */}
        <p className="mb-6 text-sm text-[#525252] font-mono">
          {error?.message || '发生未知错误，请稍后重试'}
        </p>

        {/* 重试按钮 */}
        <button onClick={() => window.location.reload()} className="btn-hud">
          Retry Connection
        </button>
      </div>
    </div>
  );
}

/**
 * 首页组件
 *
 * 状态机:
 * [IDLE] → [LOADING] → [TOTEM] ↔ [DETAIL]
 *              ↓
 *           [ERROR]
 */
export default function Index() {
  const { data, loading, error } = useDailyWorld();
  const { state, setState, setData, setError, openDetail, closeDetail } = useAppStore();

  // 同步 Hook 状态到 Store
  useEffect(() => {
    if (loading) {
      setState('loading');
    } else if (error) {
      setError(error);
    } else if (data) {
      setData(data);
    }
  }, [loading, error, data, setState, setError, setData]);

  // 根据状态渲染不同视图
  return (
    <main className="hud-vignette min-h-screen">
      {/* 加载状态 */}
      {state === 'loading' && <LoadingScreen />}

      {/* 错误状态 */}
      {state === 'error' && <ErrorView error={error} />}

      {/* 正常状态 (Totem/Detail) - 保持 Scene 始终存在 */}
      {(state === 'totem' || state === 'detail') && data && (
        <>
          {/* 3D 场景 (全屏背景) - 始终渲染以保持模型状态 */}
          <FullscreenScene modelUrl={data.modelUrl} />

          {/* HUD 装饰层 & 顶部导航 - 始终存在 */}
          <HudOverlay />
          <TransparentHeader date={data.date} />

          {/* Totem 独有 UI: 面板 */}
          {state === 'totem' && (
            <>
              <InsightPanel data={data} onExpand={openDetail} />
              <SourcesPanel newsCount={data.news.length} onExpand={openDetail} />
            </>
          )}

          {/* Detail 独有 UI: 抽屉 */}
          <DetailSheet
            isOpen={state === 'detail'}
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
    { title: 'Ephemera | Digital Art Gallery' },
    { name: 'description', content: "Daily AI-generated 3D art reflecting the world's zeitgeist" },
    { name: 'theme-color', content: '#050505' },
  ];
}
