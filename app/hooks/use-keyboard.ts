/**
 * useKeyboard Hook
 * 键盘快捷键系统
 * @see PRD V1.1 Section 3.2
 */

import { useCallback, useEffect } from 'react';

type KeyHandler = () => void;

interface KeyBindings {
  /** 左方向键 */
  ArrowLeft?: KeyHandler;
  /** 右方向键 */
  ArrowRight?: KeyHandler;
  /** ESC 键 */
  Escape?: KeyHandler;
  /** 空格键 */
  Space?: KeyHandler;
  /** 其他自定义按键 */
  [key: string]: KeyHandler | undefined;
}

interface UseKeyboardOptions {
  /** 是否启用 */
  enabled?: boolean;
  /** 是否阻止默认行为 */
  preventDefault?: boolean;
  /** 忽略在输入框中的按键 */
  ignoreInputs?: boolean;
}

/**
 * 键盘快捷键 Hook
 *
 * PRD 规格:
 * - 支持左右方向键 ← / → 切换日期
 * - 支持 ESC 关闭详情面板
 *
 * @param bindings - 按键绑定映射
 * @param options - 配置选项
 *
 * @example
 * ```tsx
 * function App() {
 *   const { goToPrevDay, goToNextDay, closeDetail } = useAppStore();
 *
 *   useKeyboard({
 *     ArrowLeft: goToPrevDay,
 *     ArrowRight: goToNextDay,
 *     Escape: closeDetail,
 *   });
 * }
 * ```
 */
export function useKeyboard(bindings: KeyBindings, options: UseKeyboardOptions = {}) {
  const { enabled = true, preventDefault = true, ignoreInputs = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // 检查是否启用
      if (!enabled) return;

      // 忽略输入框中的按键
      if (ignoreInputs) {
        const target = event.target as HTMLElement;
        const tagName = target.tagName.toLowerCase();
        if (
          tagName === 'input' ||
          tagName === 'textarea' ||
          tagName === 'select' ||
          target.isContentEditable
        ) {
          return;
        }
      }

      // 查找匹配的处理器
      const handler = bindings[event.code] || bindings[event.key];
      if (handler) {
        if (preventDefault) {
          event.preventDefault();
        }
        handler();
      }
    },
    [bindings, enabled, preventDefault, ignoreInputs],
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}

/**
 * 日期导航快捷键 Hook
 * 封装左右方向键切换日期的逻辑
 *
 * @param onPrev - 前一天回调
 * @param onNext - 后一天回调
 * @param enabled - 是否启用 (默认 true)
 *
 * @example
 * ```tsx
 * function App() {
 *   const { goToPrevDay, goToNextDay } = useAppStore();
 *   useDateNavigationKeys(goToPrevDay, goToNextDay);
 * }
 * ```
 */
export function useDateNavigationKeys(onPrev: () => void, onNext: () => void, enabled = true) {
  useKeyboard(
    {
      ArrowLeft: onPrev,
      ArrowRight: onNext,
    },
    { enabled },
  );
}

/**
 * ESC 关闭 Hook
 *
 * @param onClose - 关闭回调
 * @param enabled - 是否启用 (默认 true)
 *
 * @example
 * ```tsx
 * function DetailSheet({ isOpen, onClose }) {
 *   useEscapeKey(onClose, isOpen);
 *   return <div>...</div>;
 * }
 * ```
 */
export function useEscapeKey(onClose: () => void, enabled = true) {
  useKeyboard(
    {
      Escape: onClose,
    },
    { enabled },
  );
}
