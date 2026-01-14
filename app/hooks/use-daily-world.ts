/**
 * useDailyWorld Hook
 * Time travel state machine
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeDailyContext } from '~/lib/api-adapter';
import { getDailyContext, getForgeAssets, NotFoundError } from '~/lib/api-v5';
import type { NormalizedDailyWorld } from '~/types/api';

export type DailyWorldStatus = 'LOADING' | 'SUCCESS' | 'VOID';

export interface UseDailyWorldStateMachine {
  date: Date;
  dateStr: string;
  data: NormalizedDailyWorld | null;
  status: DailyWorldStatus;
  error: Error | null;
  isToday: boolean;
  actions: {
    prev: () => void;
    next: () => void;
    goTo: (date: Date) => void;
    goToToday: () => void;
  };
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function checkIsToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function useDailyWorldStateMachine(): UseDailyWorldStateMachine {
  const [date, setDate] = useState<Date>(() => new Date());
  const [data, setData] = useState<NormalizedDailyWorld | null>(null);
  const [status, setStatus] = useState<DailyWorldStatus>('LOADING');
  const [error, setError] = useState<Error | null>(null);

  const dateStr = useMemo(() => formatDate(date), [date]);
  const isToday = useMemo(() => checkIsToday(date), [date]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setStatus('LOADING');
      setError(null);

      try {
        // Fetch context (v5 API)
        const ctx = isToday ? await getDailyContext() : await getDailyContext(dateStr);

        // Try to get existing model from forge assets
        let modelUrl = '';
        try {
          const assets = await getForgeAssets(ctx.context_id);
          const completed = assets.assets.find((a) => a.status === 'completed' && a.model_url);
          if (completed?.model_url) {
            modelUrl = completed.model_url;
          }
        } catch {
          // No assets yet, that's fine
        }

        if (isMounted) {
          setData(normalizeDailyContext(ctx, modelUrl));
          setStatus('SUCCESS');
        }
      } catch (err) {
        if (isMounted) {
          const errorObj = err instanceof Error ? err : new Error('Unknown error');
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
// Legacy hooks (backward compatibility)
// ============================================================

export interface UseDailyWorldResult {
  data: NormalizedDailyWorld | null;
  loading: boolean;
  error: Error | null;
}

/**
 * @deprecated Use useDailyWorldStateMachine
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

        const ctx = await getDailyContext();

        let modelUrl = '';
        try {
          const assets = await getForgeAssets(ctx.context_id);
          const completed = assets.assets.find((a) => a.status === 'completed' && a.model_url);
          if (completed?.model_url) {
            modelUrl = completed.model_url;
          }
        } catch {
          // No assets
        }

        if (isMounted) {
          setData(normalizeDailyContext(ctx, modelUrl));
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
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
 * @deprecated Use useDailyWorldStateMachine
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

        const ctx = await getDailyContext(date);

        let modelUrl = '';
        try {
          const assets = await getForgeAssets(ctx.context_id);
          const completed = assets.assets.find((a) => a.status === 'completed' && a.model_url);
          if (completed?.model_url) {
            modelUrl = completed.model_url;
          }
        } catch {
          // No assets
        }

        if (isMounted) {
          setData(normalizeDailyContext(ctx, modelUrl));
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
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
 * @deprecated Use useDailyWorldStateMachine
 */
export function useDailyWorldWithRefetch() {
  const [data, setData] = useState<NormalizedDailyWorld | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const ctx = await getDailyContext();

      let modelUrl = '';
      try {
        const assets = await getForgeAssets(ctx.context_id);
        const completed = assets.assets.find((a) => a.status === 'completed' && a.model_url);
        if (completed?.model_url) {
          modelUrl = completed.model_url;
        }
      } catch {
        // No assets
      }

      setData(normalizeDailyContext(ctx, modelUrl));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export { NotFoundError };
