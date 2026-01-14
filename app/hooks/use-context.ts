/**
 * Context Hooks
 * History and Fossil context fetching
 */

import { useEffect, useState } from 'react';
import { getFossilContext, getHistoryContext } from '~/lib/api-v5';
import type { FossilContext, HistoryContext } from '~/types/api-v5';

export type ContextStatus = 'LOADING' | 'SUCCESS' | 'ERROR';

export interface UseHistoryContextResult {
  data: HistoryContext | null;
  status: ContextStatus;
  error: Error | null;
}

export interface UseFossilContextResult {
  data: FossilContext | null;
  status: ContextStatus;
  error: Error | null;
}

export function useHistoryContext(year: number): UseHistoryContextResult {
  const [data, setData] = useState<HistoryContext | null>(null);
  const [status, setStatus] = useState<ContextStatus>('LOADING');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setStatus('LOADING');
      setError(null);

      try {
        const ctx = await getHistoryContext(year);
        if (isMounted) {
          setData(ctx);
          setStatus('SUCCESS');
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setData(null);
          setStatus('ERROR');
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [year]);

  return { data, status, error };
}

export function useFossilContext(year: number): UseFossilContextResult {
  const [data, setData] = useState<FossilContext | null>(null);
  const [status, setStatus] = useState<ContextStatus>('LOADING');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setStatus('LOADING');
      setError(null);

      try {
        const ctx = await getFossilContext(year);
        if (isMounted) {
          setData(ctx);
          setStatus('SUCCESS');
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setData(null);
          setStatus('ERROR');
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [year]);

  return { data, status, error };
}
