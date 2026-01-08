/**
 * 应用状态管理 Store
 * 使用 Zustand 管理应用全局状态
 * @see PRD V1.1 Section 2.3
 */

import { create } from 'zustand';
import type { AppStore } from '~/types/store';

/**
 * 判断是否为今天 (本地时区)
 */
function checkIsToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * 添加/减少天数
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 应用状态 Store
 *
 * 状态机:
 * IDLE -> LOADING -> TOTEM <-> DETAIL
 *              |
 *              v
 *           VOID (无数据)
 *
 * @example
 * ```tsx
 * function App() {
 *   const { state, data, setState, setData, currentDate, goToPrevDay } = useAppStore();
 *
 *   useEffect(() => {
 *     setState('loading');
 *     fetchData().then(setData).catch(setVoid);
 *   }, [currentDate]);
 *
 *   switch (state) {
 *     case 'loading': return <LoadingScreen />;
 *     case 'totem': return <TotemView data={data} />;
 *     case 'detail': return <DetailView data={data} />;
 *     case 'void': return <VoidView />;
 *   }
 * }
 * ```
 */
export const useAppStore = create<AppStore>((set, get) => ({
  // ========== Initial State ==========
  state: 'idle',
  data: null,
  error: null,
  currentDate: new Date(),
  isToday: true,

  // ========== Actions ==========

  /**
   * 设置应用状态
   */
  setState: (newState) => set({ state: newState }),

  /**
   * 设置数据并自动切换到 totem 状态
   */
  setData: (newData) =>
    set({
      data: newData,
      state: 'totem',
      error: null,
    }),

  /**
   * 设置错误并自动切换到 void 状态
   * @deprecated 使用 setVoid 替代
   */
  setError: (newError) =>
    set({
      error: newError,
      state: 'void',
      data: null,
    }),

  /**
   * 设置 Void 状态 (无数据)
   */
  setVoid: (newError) =>
    set({
      error: newError,
      state: 'void',
      data: null,
    }),

  /**
   * 重置所有状态到初始值
   */
  reset: () =>
    set({
      state: 'idle',
      data: null,
      error: null,
      currentDate: new Date(),
      isToday: true,
    }),

  /**
   * 打开详情面板 (totem -> detail)
   */
  openDetail: () =>
    set((currentState: AppStore) => ({
      state: currentState.state === 'totem' ? 'detail' : currentState.state,
    })),

  /**
   * 关闭详情面板 (detail -> totem)
   */
  closeDetail: () =>
    set((currentState: AppStore) => ({
      state: currentState.state === 'detail' ? 'totem' : currentState.state,
    })),

  /**
   * 设置当前日期
   */
  setCurrentDate: (date) =>
    set({
      currentDate: date,
      isToday: checkIsToday(date),
      state: 'loading',
    }),

  /**
   * 前一天
   */
  goToPrevDay: () => {
    const { currentDate } = get();
    const prevDate = addDays(currentDate, -1);
    set({
      currentDate: prevDate,
      isToday: false, // 回退肯定不是今天
      state: 'loading',
    });
  },

  /**
   * 后一天
   */
  goToNextDay: () => {
    const { currentDate, isToday } = get();
    // 如果已经是今天，不能再往后
    if (isToday) return;

    const nextDate = addDays(currentDate, 1);
    set({
      currentDate: nextDate,
      isToday: checkIsToday(nextDate),
      state: 'loading',
    });
  },

  /**
   * 跳转到今天
   */
  goToToday: () =>
    set({
      currentDate: new Date(),
      isToday: true,
      state: 'loading',
    }),
}));

/**
 * 选择器: 获取当前是否在加载状态
 */
export const selectIsLoading = (state: AppStore) => state.state === 'loading';

/**
 * 选择器: 获取当前是否显示详情
 */
export const selectIsDetailOpen = (state: AppStore) => state.state === 'detail';

/**
 * 选择器: 获取当前是否为 Void 状态
 */
export const selectIsVoid = (state: AppStore) => state.state === 'void';

/**
 * 选择器: 获取当前是否有错误 (兼容)
 * @deprecated 使用 selectIsVoid 替代
 */
export const selectHasError = (state: AppStore) => state.state === 'void';
