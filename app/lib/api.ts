/**
 * API 请求封装
 * @deprecated Use api-v5.ts instead
 * @see llmdoc/guides/daily-world-api-quick-ref.md
 */

import type { DailyWorldData, NormalizedDailyWorld } from '~/types/api';

/**
 * @deprecated Use API_V5_BASE from constants/meta/service.ts
 */
const API_BASE = 'https://api.sruim.xin';

interface ApiResponse {
  data: DailyWorldData;
}

/**
 * @deprecated Use processModelUrl from constants/meta/service.ts
 */
function processModelUrl(url: string): string {
  if (!url) return '';

  const httpsUrl = url.replace(/^http:/, 'https:');

  try {
    const hostname = new URL(httpsUrl).hostname;
    if (hostname.endsWith('tripo3d.com')) {
      return `${API_BASE}/api/proxy-model?url=${encodeURIComponent(httpsUrl)}`;
    }
  } catch {
    // Invalid URL
  }

  return httpsUrl;
}

/**
 * @deprecated Use normalizeDailyContext from api-adapter.ts
 */
export function normalizeData(raw: DailyWorldData): NormalizedDailyWorld {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[DEPRECATED] normalizeData: Use normalizeDailyContext from api-adapter.ts');
  }

  return {
    date: raw.date,
    theme: raw.object_description || 'Daily Zeitgeist',
    summary: raw.philosophy || '',
    news: raw.news || [],
    modelUrl: processModelUrl(raw.model_url || ''),
    tripoPrompt: raw.object_description || '',
  };
}

/**
 * Soft 404 error
 */
export class NotFoundError extends Error {
  code = 'not_found' as const;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

interface SoftErrorResponse {
  error?: {
    code: string;
    message: string;
  };
}

/**
 * @deprecated Use getDailyContext from api-v5.ts
 */
export async function getDailyWorld(): Promise<NormalizedDailyWorld> {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[DEPRECATED] getDailyWorld: Use getDailyContext from api-v5.ts');
  }

  const response = await fetch(`${API_BASE}/api/daily-world`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new NotFoundError('暂无数据，请等待系统生成');
    }
    throw new Error(`API 请求失败: ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse | SoftErrorResponse;

  if ('error' in json && json.error?.code === 'not_found') {
    throw new NotFoundError(json.error.message || '数据不存在');
  }

  const apiResponse = json as ApiResponse;
  const raw: DailyWorldData = apiResponse.data;
  return normalizeData(raw);
}

/**
 * @deprecated Use getDailyContext(date) from api-v5.ts
 */
export async function getDailyWorldByDate(date: string): Promise<NormalizedDailyWorld> {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[DEPRECATED] getDailyWorldByDate: Use getDailyContext(date) from api-v5.ts');
  }

  const response = await fetch(`${API_BASE}/api/daily-world/${date}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new NotFoundError('该日期暂无数据');
    }
    if (response.status === 400) {
      throw new Error('日期格式无效，请使用 YYYY-MM-DD 格式');
    }
    throw new Error(`API 请求失败: ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse | SoftErrorResponse;

  if ('error' in json && json.error?.code === 'not_found') {
    throw new NotFoundError(json.error.message || '该日期数据不存在');
  }

  const apiResponse = json as ApiResponse;
  const raw: DailyWorldData = apiResponse.data;
  return normalizeData(raw);
}

/**
 * Health check
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    const text = await response.text();
    return text === 'OK';
  } catch {
    return false;
  }
}
