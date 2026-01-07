/**
 * useDailyWorld Hook
 * 获取 Daily World 数据的 React Hook
 * @see llmdoc/guides/daily-world-api-quick-ref.md
 */

import { useCallback, useEffect, useState } from 'react';
import { getDailyWorld, getDailyWorldByDate } from '~/lib/api';
import type { NormalizedDailyWorld, UseDailyWorldResult } from '~/types/api';

/**
 * 获取今日 Daily World 数据的 Hook
 *
 * @returns {UseDailyWorldResult} 包含 data, loading, error 的对象
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { data, loading, error } = useDailyWorld();
 *
 *   if (loading) return <LoadingScreen />;
 *   if (error) return <ErrorScreen error={error} />;
 *   if (!data) return null;
 *
 *   return <Scene modelUrl={data.modelUrl} />;
 * }
 * ```
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
 * 按日期获取 Daily World 数据的 Hook
 *
 * @param date - 日期字符串，格式: "YYYY-MM-DD"
 * @returns {UseDailyWorldResult} 包含 data, loading, error 的对象
 *
 * @example
 * ```tsx
 * function HistoryPage({ date }: { date: string }) {
 *   const { data, loading, error } = useDailyWorldByDate(date);
 *   // ...
 * }
 * ```
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
 * 手动刷新 Daily World 数据的 Hook
 *
 * @returns 包含 data, loading, error, refetch 的对象
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { data, loading, refetch } = useDailyWorldWithRefetch();
 *
 *   return (
 *     <button onClick={refetch}>刷新数据</button>
 *   );
 * }
 * ```
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
