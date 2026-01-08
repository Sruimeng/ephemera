/**
 * Store 类型定义
 * 应用状态管理类型
 * @see PRD V1.1 Section 2.3
 */

import type { NormalizedDailyWorld } from './api';

/**
 * 应用状态枚举
 * IDLE -> LOADING -> TOTEM <-> DETAIL
 *              |
 *              v
 *           VOID (原 ERROR)
 */
export type AppState = 'idle' | 'loading' | 'totem' | 'detail' | 'void';

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
  /** 当前选择的日期 */
  currentDate: Date;
  /** 是否为今天 */
  isToday: boolean;

  // ========== Actions ==========
  /** 设置应用状态 */
  setState: (state: AppState) => void;
  /** 设置数据并切换到 totem 状态 */
  setData: (data: NormalizedDailyWorld) => void;
  /** 设置错误并切换到 void 状态 */
  setError: (error: Error) => void;
  /** 设置 Void 状态 (无数据) */
  setVoid: (error: Error) => void;
  /** 重置所有状态 */
  reset: () => void;
  /** 打开详情面板 */
  openDetail: () => void;
  /** 关闭详情面板 */
  closeDetail: () => void;
  /** 设置当前日期 */
  setCurrentDate: (date: Date) => void;
  /** 前一天 */
  goToPrevDay: () => void;
  /** 后一天 */
  goToNextDay: () => void;
  /** 跳转到今天 */
  goToToday: () => void;
}
