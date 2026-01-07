/**
 * API 请求封装
 * @see llmdoc/guides/daily-world-api-quick-ref.md
 */

import type { DailyWorldData, NormalizedDailyWorld } from '~/types/api';

/**
 * API 基础 URL
 * 生产环境: https://api.sruim.xin
 */
const API_BASE = 'https://api.sruim.xin';

/**
 * API 响应包装类型
 * 后端返回 { data: DailyWorldData }
 */
interface ApiResponse {
  data: DailyWorldData;
}

/**
 * 公开可用的 GLB 模型 URL (用于演示/fallback)
 * 来源: Khronos glTF Sample Models
 */
export const FALLBACK_MODEL_URL =
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';

/**
 * 处理模型 URL
 * - 强制转换为 https
 * - 如果 URL 为空，返回 fallback 模型
 * - 如果是 tripo3d.com 的 URL，通过代理访问以解决 CORS 问题
 *
 * @param url - 原始模型 URL
 * @returns 处理后的 URL
 */
function processModelUrl(url: string): string {
  if (!url) return FALLBACK_MODEL_URL;

  // 强制转换为 https
  const httpsUrl = url.replace(/^http:/, 'https:');

  // 如果是 tripo3d.com 的 URL，通过代理访问
  if (httpsUrl.includes('tripo3d.com')) {
    return `${API_BASE}/api/proxy-model?url=${encodeURIComponent(httpsUrl)}`;
  }

  return httpsUrl;
}

/**
 * 规范化 API 响应数据
 * - 处理 http -> https 转换 (Tripo 有时返回 http)
 * - 统一字段命名 (snake_case -> camelCase)
 * - 处理 CORS 代理 (开发环境)
 *
 * @param raw - 后端原始响应
 * @returns 规范化后的数据
 */
export function normalizeData(raw: DailyWorldData): NormalizedDailyWorld {
  return {
    date: raw.date,
    // 使用 object_description 作为主题
    theme: raw.object_description || 'Daily Zeitgeist',
    // 使用 philosophy 作为总结
    summary: raw.philosophy || '',
    // 新闻列表 (现在是 { title, content }[] 格式)
    news: raw.news || [],
    // 处理模型 URL (https 转换，fallback)
    modelUrl: processModelUrl(raw.model_url || ''),
    // 使用 object_description 作为 tripoPrompt
    tripoPrompt: raw.object_description || '',
  };
}

/**
 * 获取今日 Daily World 数据
 *
 * @throws Error - API 请求失败或数据不存在
 * @returns 规范化后的 Daily World 数据
 *
 * @example
 * ```ts
 * const data = await getDailyWorld();
 * console.log(data.theme); // "The Duality of Connection"
 * ```
 */
export async function getDailyWorld(): Promise<NormalizedDailyWorld> {
  const response = await fetch(`${API_BASE}/api/daily-world`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('暂无数据，请等待系统生成');
    }
    throw new Error(`API 请求失败: ${response.status}`);
  }

  const json: ApiResponse = await response.json();
  // 提取 data 字段
  const raw: DailyWorldData = json.data;
  return normalizeData(raw);
}

/**
 * 按日期获取 Daily World 数据
 *
 * @param date - 日期字符串，格式: "YYYY-MM-DD"
 * @throws Error - API 请求失败或数据不存在
 * @returns 规范化后的 Daily World 数据
 *
 * @example
 * ```ts
 * const data = await getDailyWorldByDate('2026-01-06');
 * ```
 */
export async function getDailyWorldByDate(date: string): Promise<NormalizedDailyWorld> {
  const response = await fetch(`${API_BASE}/api/daily-world/${date}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('该日期暂无数据');
    }
    if (response.status === 400) {
      throw new Error('日期格式无效，请使用 YYYY-MM-DD 格式');
    }
    throw new Error(`API 请求失败: ${response.status}`);
  }

  const json: ApiResponse = await response.json();
  // 提取 data 字段
  const raw: DailyWorldData = json.data;
  return normalizeData(raw);
}

/**
 * 健康检查
 *
 * @returns 服务器是否正常运行
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
