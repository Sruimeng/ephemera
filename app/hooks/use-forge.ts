/**
 * Forge Hook
 * Create and poll forge tasks
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { MAX_POLL_DURATION, POLL_INTERVAL } from '~/constants/meta/service';
import { createForgeTask, getForgeAssets, getForgeStatus } from '~/lib/api-v5';
import type { ForgeAsset, ForgeCreateRequest, ForgeStatusResponse } from '~/types/api-v5';

export type ForgeHookStatus = 'IDLE' | 'CREATING' | 'POLLING' | 'COMPLETED' | 'FAILED';

export interface UseForgeResult {
  status: ForgeHookStatus;
  task: ForgeStatusResponse | null;
  assets: ForgeAsset[];
  error: Error | null;
  create: (request: ForgeCreateRequest) => Promise<void>;
  loadAssets: (contextId: string) => Promise<void>;
}

export function useForge(): UseForgeResult {
  const [status, setStatus] = useState<ForgeHookStatus>('IDLE');
  const [task, setTask] = useState<ForgeStatusResponse | null>(null);
  const [assets, setAssets] = useState<ForgeAsset[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const poll = useCallback(async (taskId: string) => {
    const startTime = Date.now();
    abortRef.current = new AbortController();

    setStatus('POLLING');

    while (true) {
      if (abortRef.current.signal.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }

      const result = await getForgeStatus(taskId);
      setTask(result);

      if (result.status === 'completed') {
        setStatus('COMPLETED');
        return result;
      }

      if (result.status === 'failed') {
        throw new Error(result.error_message || 'Forge failed');
      }

      if (Date.now() - startTime > MAX_POLL_DURATION) {
        throw new Error('Polling timeout');
      }

      await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(resolve, POLL_INTERVAL);
        abortRef.current?.signal.addEventListener('abort', () => {
          clearTimeout(timeoutId);
          reject(new DOMException('Aborted', 'AbortError'));
        });
      });
    }
  }, []);

  const create = useCallback(
    async (request: ForgeCreateRequest) => {
      setStatus('CREATING');
      setError(null);
      setTask(null);

      try {
        const response = await createForgeTask(request);

        setTask({
          task_id: response.task_id,
          status: response.status,
          model_url: null,
          error_message: null,
          progress_percent: 0,
        });

        if (response.status === 'completed') {
          setStatus('COMPLETED');
          return;
        }

        await poll(response.task_id);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          setStatus('IDLE');
          return;
        }

        setError(err instanceof Error ? err : new Error('Unknown error'));
        setStatus('FAILED');
      }
    },
    [poll],
  );

  const loadAssets = useCallback(async (contextId: string) => {
    try {
      const response = await getForgeAssets(contextId);
      setAssets(response.assets);
    } catch {
      // Silent fail, assets may not exist
      setAssets([]);
    }
  }, []);

  return {
    status,
    task,
    assets,
    error,
    create,
    loadAssets,
  };
}
