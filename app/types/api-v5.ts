/**
 * API v5 Types
 * @see https://api.sruim.xin/api/context/*
 */

import type { NewsItem } from './api';

// Response wrapper
export interface ApiV5Response<T> {
  data: T;
}

export interface ApiV5Error {
  code: string;
  message: string;
}

// History event
export interface HistoryEvent {
  title: string;
  description: string;
  category: 'politics' | 'technology' | 'culture' | 'economy' | 'science';
}

// Fossil prediction
export interface FossilPrediction {
  title: string;
  description: string;
}

// Daily Context (today's news)
export interface DailyContext {
  context_id: string;
  date: string;
  news: NewsItem[];
  philosophy: string;
  suggested_prompt: string;
  keywords: string[];
}

// History Context (past years)
export interface HistoryContext {
  context_id: string;
  year: number;
  year_display: string;
  events: HistoryEvent[];
  symbols: string[];
  synthesis: string;
  philosophy: string;
  suggested_prompt: string;
}

// Fossil Context (future predictions)
export interface FossilContext {
  context_id: string;
  year: number;
  predictions: FossilPrediction[];
  symbols: string[];
  synthesis: string;
  philosophy: string;
  archaeologist_report: string;
  suggested_prompt: string;
}

// Union type
export type AnyContext = DailyContext | HistoryContext | FossilContext;

// Type guards
export function isDailyContext(ctx: AnyContext): ctx is DailyContext {
  return 'date' in ctx && 'news' in ctx;
}

export function isHistoryContext(ctx: AnyContext): ctx is HistoryContext {
  return 'year' in ctx && 'events' in ctx;
}

export function isFossilContext(ctx: AnyContext): ctx is FossilContext {
  return 'year' in ctx && 'predictions' in ctx;
}

// Forge types
export type ForgeStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ForgeCreateRequest {
  context_id: string;
  modifier?: string;
  style?: string;
}

export interface ForgeCreateResponse {
  task_id: string;
  status: ForgeStatus;
  message: string;
}

export interface ForgeStatusResponse {
  task_id: string;
  status: ForgeStatus;
  tripo_url: string | null;
  alist_url: string | null;
  selected_url: string | null;
  error_message: string | null;
  progress_percent: number;
}

export interface ForgeAsset {
  task_id: string;
  status: ForgeStatus;
  tripo_url: string | null;
  alist_url: string | null;
  selected_url: string | null;
}

export interface ForgeAssetsResponse {
  context_id: string;
  assets: ForgeAsset[];
}
