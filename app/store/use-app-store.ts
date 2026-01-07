/**
 * 应用状态管理 Store
 * 使用 Zustand 管理应用全局状态
 * @see llmdoc/agent/strategy-ephemera-v3.md
 */

import { create } from 'zustand';
import type { AppStore } from '~/types/store';

/**
 * 应用状态 Store
 *
 * 状态机:
 * IDLE -> LOADING -> TOTEM <-> DETAIL
 *              |
 *              v
 *           ERROR
 *
 * @example
 * ```tsx
 * function App() {
 *   const { state, data, setState, setData } = useAppStore();
 *
 *   useEffect(() => {
 *     setState('loading');
 *     fetchData().then(setData).catch(setError);
 *   }, []);
 *
 *   switch (state) {
 *     case 'loading': return <LoadingScreen />;
 *     case 'totem': return <TotemView data={data} />;
 *     case 'detail': return <DetailView data={data} />;
 *     case 'error': return <ErrorView />;
 *   }
 * }
 * ```
 */
export const useAppStore = create<AppStore>((set) => ({
  // ========== Initial State ==========
  state: 'idle',
  data: null,
  error: null,

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
   * 设置错误并自动切换到 error 状态
   */
  setError: (newError) =>
    set({
      error: newError,
      state: 'error',
    }),

  /**
   * 重置所有状态到初始值
   */
  reset: () =>
    set({
      state: 'idle',
      data: null,
      error: null,
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
 * 选择器: 获取当前是否有错误
 */
export const selectHasError = (state: AppStore) => state.state === 'error';
