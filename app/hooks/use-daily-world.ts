/**
 * useDailyWorld Hook
 * 时间漫游核心状态机
 * @see PRD V1.1 Section 2.3
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDailyWorld, getDailyWorldByDate } from '~/lib/api';
import type { NormalizedDailyWorld } from '~/types/api';

/**
 * 状态机状态
 * LOADING: 切换日期 / 首次加载
 * SUCCESS: API 返回有效数据
 * VOID: API 返回 not_found 或错误
 */
export type DailyWorldStatus = 'LOADING' | 'SUCCESS' | 'VOID';

/**
 * useDailyWorld 返回类型
 */
export interface UseDailyWorldStateMachine {
  /** 当前选择的日期 */
  date: Date;
  /** 日期字符串 YYYY-MM-DD */
  dateStr: string;
  /** API 数据 (VOID 状态时为 null) */
  data: NormalizedDailyWorld | null;
  /** 状态机状态 */
  status: DailyWorldStatus;
  /** 错误信息 (仅 VOID 状态) */
  error: Error | null;
  /** 是否为今天 */
  isToday: boolean;
  /** 导航动作 */
  actions: {
    /** 前一天 */
    prev: () => void;
    /** 后一天 (今天时禁用) */
    next: () => void;
    /** 跳转到指定日期 */
    goTo: (date: Date) => void;
    /** 跳转到今天 */
    goToToday: () => void;
  };
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
 * 判断是否为今天 (本地时区)
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
 * 添加/减少天数
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 时间漫游 Hook
 *
 * PRD 状态机:
 * - LOADING: 切换日期 / 首次加载 → UI 局部闪烁，3D 模型缩小消失
 * - SUCCESS: API 返回 Data → 显示 Theme/Summary，3D 模型放大出现
 * - VOID: API 返回 Error → 显示 "SIGNAL LOST"，3D 线框球体
 *
 * @example
 * ```tsx
 * function App() {
 *   const { date, data, status, actions } = useDailyWorldStateMachine();
 *
 *   return (
 *     <>
 *       <DateNavigation date={date} onPrev={actions.prev} onNext={actions.next} />
 *       {status === 'LOADING' && <LoadingScreen />}
 *       {status === 'SUCCESS' && <Scene modelUrl={data.modelUrl} />}
 *       {status === 'VOID' && <VoidSphere />}
 *     </>
 *   );
 * }
 * ```
 */
export function useDailyWorldStateMachine(): UseDailyWorldStateMachine {
  // 当前选择的日期
  const [date, setDate] = useState<Date>(() => new Date());
  // API 数据
  const [data, setData] = useState<NormalizedDailyWorld | null>(null);
  // 状态机状态
  const [status, setStatus] = useState<DailyWorldStatus>('LOADING');
  // 错误信息
  const [error, setError] = useState<Error | null>(null);

  // 派生状态
  const dateStr = useMemo(() => formatDate(date), [date]);
  const isToday = useMemo(() => checkIsToday(date), [date]);

  // 数据获取
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setStatus('LOADING');
      setError(null);

      try {
        // 根据是否为今天决定调用哪个 API
        const result = isToday ? await getDailyWorld() : await getDailyWorldByDate(dateStr);

        if (isMounted) {
          setData(result);
          setStatus('SUCCESS');
        }
      } catch (err) {
        if (isMounted) {
          const errorObj = err instanceof Error ? err : new Error('未知错误');
          setError(errorObj);
          setData(null);
          setStatus('VOID');
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [dateStr, isToday]);

  // 导航动作
  const actions = useMemo(
    () => ({
      prev: () => setDate((d) => addDays(d, -1)),
      next: () => {
        if (!isToday) {
          setDate((d) => addDays(d, 1));
        }
      },
      goTo: (newDate: Date) => setDate(newDate),
      goToToday: () => setDate(new Date()),
    }),
    [isToday],
  );

  return {
    date,
    dateStr,
    data,
    status,
    error,
    isToday,
    actions,
  };
}

// ============================================================
// 兼容旧接口 (向后兼容)
// ============================================================

/**
 * 旧版返回类型 (兼容)
 */
export interface UseDailyWorldResult {
  data: NormalizedDailyWorld | null;
  loading: boolean;
  error: Error | null;
}

/**
 * 获取今日 Daily World 数据的 Hook (兼容旧接口)
 * @deprecated 请使用 useDailyWorldStateMachine
 */
export function useDailyWorld(): UseDailyWorldResult {
  const [data, setData] = useState<NormalizedDailyWorld | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getDailyWorld();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('未知错误'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}

/**
 * 按日期获取 Daily World 数据的 Hook (兼容旧接口)
 * @deprecated 请使用 useDailyWorldStateMachine
 */
export function useDailyWorldByDate(date: string): UseDailyWorldResult {
  const [data, setData] = useState<NormalizedDailyWorld | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getDailyWorldByDate(date);
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('未知错误'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (date) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [date]);

  return { data, loading, error };
}

/**
 * 手动刷新 Daily World 数据的 Hook (兼容旧接口)
 * @deprecated 请使用 useDailyWorldStateMachine
 */
export function useDailyWorldWithRefetch() {
  const [data, setData] = useState<NormalizedDailyWorld | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getDailyWorld();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('未知错误'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
