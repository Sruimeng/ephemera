/**
 * API v5 Client
 */

import { API_ENDPOINTS, API_TIMEOUT, API_V5_BASE, APP_ID } from '~/constants/meta/service';
import type {
  ApiV5Error,
  DailyContext,
  ForgeAssetsResponse,
  ForgeCreateRequest,
  ForgeCreateResponse,
  ForgeStatusResponse,
  FossilContext,
  HistoryContext,
} from '~/types/api-v5';

// Re-export NotFoundError from legacy api.ts
export { NotFoundError } from './api';

class ContextApiError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ContextApiError';
  }
}

class ForgeApiError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ForgeApiError';
  }
}

function createHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-App-ID': APP_ID,
  };
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = API_TIMEOUT,
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: { ...createHeaders(), ...options.headers },
    });
  } finally {
    clearTimeout(id);
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiV5Error = await response.json().catch(() => ({
      code: 'unknown',
      message: `HTTP ${response.status}`,
    }));
    throw new ContextApiError(error.code, error.message);
  }

  const json = await response.json();
  return json.data as T;
}

/**
 * Get daily context (today or specific date)
 */
export async function getDailyContext(date?: string): Promise<DailyContext> {
  let url = `${API_V5_BASE}${API_ENDPOINTS.DAILY}`;
  if (date) url += `?date=${date}`;

  const response = await fetchWithTimeout(url);
  return handleResponse<DailyContext>(response);
}

/**
 * Get history context for a year
 */
export async function getHistoryContext(year: number): Promise<HistoryContext> {
  const url = `${API_V5_BASE}${API_ENDPOINTS.HISTORY(year)}`;
  const response = await fetchWithTimeout(url);
  return handleResponse<HistoryContext>(response);
}

/**
 * Get fossil context for a future year
 */
export async function getFossilContext(year: number): Promise<FossilContext> {
  const url = `${API_V5_BASE}${API_ENDPOINTS.FOSSIL(year)}`;
  const response = await fetchWithTimeout(url);
  return handleResponse<FossilContext>(response);
}

/**
 * Create a forge task
 */
export async function createForgeTask(request: ForgeCreateRequest): Promise<ForgeCreateResponse> {
  const url = `${API_V5_BASE}${API_ENDPOINTS.FORGE_CREATE}`;

  const response = await fetchWithTimeout(url, {
    method: 'POST',
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error: ApiV5Error = await response.json().catch(() => ({
      code: 'forge_error',
      message: `HTTP ${response.status}`,
    }));
    throw new ForgeApiError(error.code, error.message);
  }

  const json = await response.json();
  return json.data as ForgeCreateResponse;
}

/**
 * Get forge task status
 */
export async function getForgeStatus(taskId: string): Promise<ForgeStatusResponse> {
  const url = `${API_V5_BASE}${API_ENDPOINTS.FORGE_STATUS(taskId)}`;

  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    const error: ApiV5Error = await response.json().catch(() => ({
      code: 'forge_error',
      message: `HTTP ${response.status}`,
    }));
    throw new ForgeApiError(error.code, error.message);
  }

  const json = await response.json();
  return json.data as ForgeStatusResponse;
}

/**
 * Get forge assets for a context
 */
export async function getForgeAssets(contextId: string): Promise<ForgeAssetsResponse> {
  const url = `${API_V5_BASE}${API_ENDPOINTS.FORGE_ASSETS}?context_id=${encodeURIComponent(contextId)}`;

  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    const error: ApiV5Error = await response.json().catch(() => ({
      code: 'forge_error',
      message: `HTTP ${response.status}`,
    }));
    throw new ForgeApiError(error.code, error.message);
  }

  const json = await response.json();
  return json.data as ForgeAssetsResponse;
}

export { ContextApiError, ForgeApiError };

/**
 * Fetch model with fallback strategy
 * 1. Try alist_url first (China CDN)
 * 2. If fails, fallback to tripo_url via backend proxy
 */
export async function fetchModelWithFallback(
  alistUrl: string | null,
  tripoUrl: string | null,
): Promise<string> {
  // No URLs available
  if (!alistUrl && !tripoUrl) return '';

  // Try alist first
  if (alistUrl) {
    try {
      const res = await fetch(alistUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) return alistUrl;
    } catch {
      // alist failed, try fallback
    }
  }

  // Fallback to tripo via backend proxy
  if (tripoUrl) {
    return `${API_V5_BASE}${API_ENDPOINTS.PROXY_MODEL}?url=${encodeURIComponent(tripoUrl)}`;
  }

  return alistUrl || '';
}
