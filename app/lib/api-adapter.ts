/**
 * API Adapter Layer
 * Normalizes v5 API responses to existing frontend types
 */

import type { NormalizedDailyWorld } from '~/types/api';
import type { DailyContext } from '~/types/api-v5';

/**
 * Convert DailyContext to NormalizedDailyWorld
 * Maintains backward compatibility with existing components
 */
export function normalizeDailyContext(ctx: DailyContext, modelUrl = ''): NormalizedDailyWorld {
  return {
    date: ctx.date,
    theme: ctx.suggested_prompt,
    summary: ctx.philosophy,
    news: ctx.news,
    modelUrl,
    tripoPrompt: ctx.suggested_prompt,
  };
}

/**
 * Extract context_id for forge operations
 */
export function extractContextId(ctx: DailyContext): string {
  return ctx.context_id;
}
