'use client';

/**
 * Ephemera V1.1 日期路由
 * 支持 URL 直接访问特定日期: /{YYYY-MM-DD}
 * @see PRD V1.1
 */

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { FullscreenScene, FullscreenVoidScene } from '~/components/canvas/scene';
import { DateNavigation } from '~/components/ui/date-navigation';
import { DetailSheet } from '~/components/ui/detail-sheet';
import { HudOverlay } from '~/components/ui/hud-decorations';
import { InsightPanel, SourcesPanel, VoidInsightPanel } from '~/components/ui/insight-panel';
import { LanguageSwitcher } from '~/components/ui/language-switcher';
import { LoadingScreen } from '~/components/ui/loading-screen';
import { useDailyWorldByDate } from '~/hooks/use-daily-world';
import { useDateNavigationKeys, useEscapeKey } from '~/hooks/use-keyboard';

type Status = 'LOADING' | 'SUCCESS' | 'VOID';

/**
 * 解析日期字符串为 Date 对象
 */
function parseDate(dateStr: string): Date | null {
  // 验证格式 YYYY-MM-DD
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  // 验证日期有效性
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }

  return date;
}

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
 * 判断是否为今天
 */
function checkIsToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * 添加天数
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * HUD Header with DateNavigation
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
      {/* 第一行：左右角落装饰 (桌面端) */}
      <div className="absolute left-6 top-4 hidden sm:block">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#A3A3A3] tracking-[0.2em] font-mono uppercase">
            EPHEMERA.V1.1
          </span>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3B82F6]" />
        </div>
      </div>

      <div className="absolute right-6 top-4 hidden items-center gap-4 sm:flex">
        <LanguageSwitcher />
        <span className="text-[10px] text-[#A3A3A3] font-mono">SYS.NOMINAL</span>
      </div>

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

      {/* 移动端：语言切换器放在日期下方 */}
      <div className="flex items-center justify-center pb-2 sm:hidden">
        <LanguageSwitcher />
      </div>
    </header>
  );
}

/**
 * 日期路由页面
 * URL: /{YYYY-MM-DD}
 */
export default function DateRoute() {
  const { t } = useTranslation('common');
  const params = useParams();
  const navigate = useNavigate();
  const dateParam = params.date as string;

  // 状态
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // 解析日期
  const currentDate = useMemo(() => {
    const parsed = parseDate(dateParam);
    return parsed || new Date();
  }, [dateParam]);

  const isToday = useMemo(() => checkIsToday(currentDate), [currentDate]);
  const dateStr = useMemo(() => formatDate(currentDate), [currentDate]);

  // 验证日期格式
  const isValidDate = useMemo(() => parseDate(dateParam) !== null, [dateParam]);

  // 使用 hook 获取数据
  const { data, loading, error } = useDailyWorldByDate(isValidDate && !isToday ? dateStr : '');

  // 如果是今天，重定向到首页
  useEffect(() => {
    if (isToday) {
      navigate('/', { replace: true });
    }
  }, [isToday, navigate]);

  // 导航函数
  const goToPrev = () => {
    const prevDate = addDays(currentDate, -1);
    navigate(`/${formatDate(prevDate)}`);
  };

  const goToNext = () => {
    if (!isToday) {
      const nextDate = addDays(currentDate, 1);
      const nextDateStr = formatDate(nextDate);
      if (checkIsToday(nextDate)) {
        navigate('/');
      } else {
        navigate(`/${nextDateStr}`);
      }
    }
  };

  // 键盘快捷键
  useDateNavigationKeys(goToPrev, goToNext, !isDetailOpen);
  useEscapeKey(() => setIsDetailOpen(false), isDetailOpen);

  // 派生状态
  const status: Status = !isValidDate || error ? 'VOID' : loading ? 'LOADING' : 'SUCCESS';
  const displayError = !isValidDate ? new Error(t('error.invalidDate')) : error;
  const isLoading = status === 'LOADING';
  const isVoid = status === 'VOID';
  const showContent = status === 'SUCCESS' && data;

  return (
    <main className="hud-vignette min-h-screen">
      {/* 顶部时间 HUD */}
      <TimeHudHeader
        date={currentDate}
        isToday={isToday}
        isLoading={isLoading}
        onPrev={goToPrev}
        onNext={goToNext}
      />

      {/* 加载状态 */}
      {isLoading && <LoadingScreen />}

      {/* VOID 状态 */}
      {isVoid && (
        <>
          <FullscreenVoidScene />
          <HudOverlay />
          <VoidInsightPanel error={displayError} dateStr={dateStr} />
        </>
      )}

      {/* SUCCESS 状态 */}
      {showContent && data && (
        <>
          <FullscreenScene modelUrl={data.modelUrl} />
          <HudOverlay />

          {!isDetailOpen && (
            <>
              <InsightPanel data={data} onExpand={() => setIsDetailOpen(true)} />
              <SourcesPanel newsCount={data.news.length} onExpand={() => setIsDetailOpen(true)} />
            </>
          )}

          <DetailSheet
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
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
export function meta({ params }: { params: { date: string } }) {
  return [
    { title: `Ephemera | ${params.date}` },
    {
      name: 'description',
      content: `AI-generated 3D art for ${params.date}`,
    },
    { name: 'theme-color', content: '#050505' },
  ];
}
