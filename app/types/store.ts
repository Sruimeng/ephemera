/**
 * Store 类型定义
 * 应用状态管理类型
 * @see llmdoc/agent/strategy-ephemera-v3.md
 */

import type { NormalizedDailyWorld } from './api';

/**
 * 应用状态枚举
 * IDLE -> LOADING -> TOTEM <-> DETAIL
 *              |
 *              v
 *           ERROR
 */
export type AppState = 'idle' | 'loading' | 'totem' | 'detail' | 'error';

/**
 * 应用 Store 接口
 */
export interface AppStore {
  // ========== State ==========
  /** 当前应用状态 */
  state: AppState;
  /** Daily World 数据 */
  data: NormalizedDailyWorld | null;
  /** 错误信息 */
  error: Error | null;

  // ========== Actions ==========
  /** 设置应用状态 */
  setState: (state: AppState) => void;
  /** 设置数据并切换到 totem 状态 */
  setData: (data: NormalizedDailyWorld) => void;
  /** 设置错误并切换到 error 状态 */
  setError: (error: Error) => void;
  /** 重置所有状态 */
  reset: () => void;
  /** 打开详情面板 */
  openDetail: () => void;
  /** 关闭详情面板 */
  closeDetail: () => void;
}
