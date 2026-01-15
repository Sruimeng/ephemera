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
export const API_V5_BASE = 'https://reify-sdk.zeabur.internal';
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
