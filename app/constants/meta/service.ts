import { isDEV, isPROD } from './env';

/**
 * API Configuration
 */

// Legacy API URLs
const DevApiURL = 'http://localhost:3001/api';
const StagingApiURL = 'https://api-staging.example.com';
const ProdApiURL = 'https://api.example.com';

export const ApiURL = isDEV ? DevApiURL : isPROD ? ProdApiURL : StagingApiURL;

// Base URLs
const DevBaseUrl = 'http://localhost:3000';
const StagingBaseUrl = 'https://staging.example.com';
const ProdBaseUrl = 'https://example.com';

export const BaseUrl = isDEV ? DevBaseUrl : isPROD ? ProdBaseUrl : StagingBaseUrl;

// API v5
export const API_V5_BASE = 'https://api.sruim.xin';
export const APP_ID = '204bb605-dd38-4c3b-90b5-d1055310051b';

// Timeouts
export const API_TIMEOUT = 10000;
export const POLL_INTERVAL = 3000;
export const MAX_POLL_DURATION = 300000;

// Endpoints
export const API_ENDPOINTS = {
  DAILY: '/api/context/daily',
  HISTORY: (year: number) => `/api/context/history/${year}`,
  FOSSIL: (year: number) => `/api/context/fossil/${year}`,
  FORGE_CREATE: '/api/forge/create',
  FORGE_STATUS: (id: string) => `/api/forge/status/${id}`,
  FORGE_ASSETS: '/api/forge/assets',
  PROXY_MODEL: '/api/proxy-model',
} as const;

// Fallback model
export const FALLBACK_MODEL_URL =
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';

/**
 * Process model URL for CORS proxy
 * Only proxy tripo3d.com direct URLs, not CF Worker URLs
 */
export function processModelUrl(url: string): string {
  if (!url) return FALLBACK_MODEL_URL;

  const httpsUrl = url.replace(/^http:/, 'https:');

  try {
    const hostname = new URL(httpsUrl).hostname;
    if (hostname.endsWith('tripo3d.com')) {
      return `${API_V5_BASE}${API_ENDPOINTS.PROXY_MODEL}?url=${encodeURIComponent(httpsUrl)}`;
    }
  } catch {
    // Invalid URL, return as-is
  }

  return httpsUrl;
}

/**
 * Check if URL needs proxy auth header
 */
export function isProxyUrl(url: string): boolean {
  return url.startsWith(API_V5_BASE) && url.includes(API_ENDPOINTS.PROXY_MODEL);
}

/**
 * Fetch model as blob for proxy URLs
 */
export async function fetchModelAsBlob(url: string): Promise<string> {
  if (!isProxyUrl(url)) return url;

  const response = await fetch(url, {
    headers: { 'X-App-ID': APP_ID },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch model: ${response.status}`);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
