/**
 * 加载状态组件
 * 显示 Logo 和进度条
 * @see llmdoc/guides/ephemera-prd.md
 */

import type React from 'react';

/**
 * 大尺寸 Sruim Logo
 */
const SruimLogoLarge: React.FC = () => {
  return (
    <div className="h-20 w-20 flex items-center justify-center rounded-2xl bg-[#54B6F5] text-4xl text-white font-bold shadow-[#54B6F5]/30 shadow-lg">
      S
    </div>
  );
};

interface LoadingScreenProps {
  /** 加载进度 (0-100) */
  progress?: number;
  /** 加载提示信息 */
  message?: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 加载状态屏幕
 *
 * 视觉元素:
 * - 屏幕中央: Sruim Logo (淡入淡出)
 * - Logo 下方: 进度条 (Sruim Blue, height: 2px)
 * - 随机哲学短语: "Constructing the Zeitgeist..."
 *
 * @example
 * ```tsx
 * <LoadingScreen progress={50} message="Loading model..." />
 * ```
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress,
  message,
  className = '',
}) => {
  // 默认加载提示语
  const defaultMessages = [
    'Constructing the Zeitgeist...',
    "Materializing today's spirit...",
    'Weaving digital threads...',
    'Sculpting the ephemeral...',
  ];

  const displayMessage =
    message || defaultMessages[Math.floor(Math.random() * defaultMessages.length)];

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex flex-col items-center justify-center
        bg-[#F5F5F7]
        ${className}
      `}
    >
      {/* Logo */}
      <div className="mb-8 animate-pulse">
        <SruimLogoLarge />
      </div>

      {/* 加载提示 */}
      <p className="mb-6 animate-fade-in text-sm text-[#86868B]">{displayMessage}</p>

      {/* 进度条 */}
      <div className="h-0.5 w-48 overflow-hidden rounded-full bg-[#E5E5E7]">
        {progress !== undefined ? (
          // 确定进度
          <div
            className="h-full bg-[#54B6F5] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        ) : (
          // 不确定进度 (动画)
          <div className="h-full animate-loading-bar bg-[#54B6F5]" />
        )}
      </div>

      {/* 进度百分比 */}
      {progress !== undefined && (
        <p className="mt-3 text-xs text-[#86868B]">{Math.round(progress)}%</p>
      )}
    </div>
  );
};

interface SkeletonLoaderProps {
  /** 自定义类名 */
  className?: string;
}

/**
 * 骨架屏加载组件
 * 用于内容区域的占位
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="mb-4 h-4 w-3/4 rounded bg-[#E5E5E7]" />
      <div className="mb-4 h-4 w-1/2 rounded bg-[#E5E5E7]" />
      <div className="h-4 w-5/6 rounded bg-[#E5E5E7]" />
    </div>
  );
};

interface LoadingSpinnerProps {
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 小型加载指示器
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        border-2 border-[#E5E5E7]
        border-t-[#54B6F5]
        rounded-full
        animate-spin
      `}
    />
  );
};
