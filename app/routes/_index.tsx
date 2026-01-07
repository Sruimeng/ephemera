'use client';

/**
 * Ephemera 首页
 * 数字美术馆 - 状态机控制
 * @see llmdoc/guides/ephemera-prd.md
 */

import { useEffect } from 'react';
import { FullscreenScene } from '~/components/canvas/scene';
import { DetailSheet } from '~/components/ui/detail-sheet';
import { TransparentHeader } from '~/components/ui/header';
import { InsightPanel } from '~/components/ui/insight-panel';
import { LoadingScreen } from '~/components/ui/loading-screen';
import { useDailyWorld } from '~/hooks/use-daily-world';
import { useAppStore } from '~/store/use-app-store';

/**
 * 错误视图组件
 */
function ErrorView({ error }: { error: Error | null }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-md text-center">
        {/* 错误图标 */}
        <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-red-100">
          <span className="i-lucide-alert-circle h-8 w-8 text-red-500" />
        </div>

        {/* 错误标题 */}
        <h1 className="mb-3 text-xl text-[#1D1D1F] font-semibold">Unable to Load</h1>

        {/* 错误信息 */}
        <p className="mb-6 text-sm text-[#86868B]">
          {error?.message || '发生未知错误，请稍后重试'}
        </p>

        {/* 重试按钮 */}
        <button onClick={() => window.location.reload()} className="btn-sruim">
          Try Again
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
    <main className="min-h-screen">
      {/* 加载状态 */}
      {state === 'loading' && <LoadingScreen message="Constructing the Zeitgeist..." />}

      {/* 错误状态 */}
      {state === 'error' && <ErrorView error={error} />}

      {/* Totem 状态: 3D 场景 + UI 覆盖层 */}
      {state === 'totem' && data && (
        <>
          {/* 3D 场景 (全屏背景) */}
          <FullscreenScene modelUrl={data.modelUrl} />

          {/* UI 覆盖层 */}
          <TransparentHeader date={data.date} />
          <InsightPanel data={data} onExpand={openDetail} />
        </>
      )}

      {/* Detail 状态: 3D 场景 + 详情抽屉 */}
      {state === 'detail' && data && (
        <>
          {/* 3D 场景 (全屏背景) */}
          <FullscreenScene modelUrl={data.modelUrl} />

          {/* UI 覆盖层 */}
          <TransparentHeader date={data.date} />

          {/* 详情抽屉 */}
          <DetailSheet
            isOpen={true}
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
  ];
}
