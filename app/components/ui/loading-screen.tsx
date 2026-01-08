/**
 * HUD LoadingScreen 组件
 * Ephemera V2: Deep Space Terminal
 * 终端风格加载界面
 * @see llmdoc/guides/ephemera-prd.md
 */

import type React from 'react';
import { useEffect, useState } from 'react';

/**
 * 终端启动日志
 */
const bootSequence = [
  '[SYS] Initializing Ephemera V2...',
  '[NET] Connecting to api.sruim.xin...',
  '[DAT] Fetching daily zeitgeist...',
  '[3D] Loading GLB model...',
  '[GFX] Preparing post-processing...',
  '[RDY] System ready.',
];

interface LoadingScreenProps {
  /** 加载进度 (0-100) */
  progress?: number;
  /** 加载提示信息 */
  message?: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 终端风格加载屏幕
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress,
  message,
  className = '',
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);

  // 模拟终端日志输出
  useEffect(() => {
    if (currentLogIndex < bootSequence.length) {
      const timer = setTimeout(
        () => {
          setLogs((prev) => [...prev, bootSequence[currentLogIndex]]);
          setCurrentLogIndex((prev) => prev + 1);
        },
        300 + Math.random() * 200,
      );
      return () => clearTimeout(timer);
    }
  }, [currentLogIndex]);

  // 随机数据装饰
  const [hexData, setHexData] = useState('0x00000000');
  useEffect(() => {
    const interval = setInterval(() => {
      const hex = Math.floor(Math.random() * 0xffffffff)
        .toString(16)
        .padStart(8, '0')
        .toUpperCase();
      setHexData(`0x${hex}`);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex flex-col items-center justify-center
        bg-[#050505]
        ${className}
      `}
    >
      {/* 角落装饰 */}
      <div className="absolute left-4 top-4 text-[10px] text-[#505050] font-mono">
        EPHEMERA.V2.BOOT
      </div>
      <div className="absolute right-4 top-4 text-[10px] text-[#505050] font-mono">{hexData}</div>

      {/* 主内容区 */}
      <div className="max-w-md w-full px-6">
        {/* Logo - 简约文字版 */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl text-[#3B82F6] tracking-[0.3em] font-mono text-glow">EPHEMERA</h1>
          <p className="mt-2 text-[10px] text-[#707070] tracking-[0.2em] font-mono">
            DIGITAL ART GALLERY
          </p>
        </div>

        {/* 终端日志 */}
        <div className="mb-6 h-32 overflow-hidden text-xs leading-relaxed font-mono">
          {logs.map((log, i) => (
            <div
              key={i}
              className={`
                ${log.includes('[RDY]') ? 'text-[#22C55E]' : 'text-[#808080]'}
                animate-fade-in
              `}
            >
              {log}
            </div>
          ))}
          {currentLogIndex < bootSequence.length && (
            <span className="inline-block h-4 w-2 animate-pulse bg-[#3B82F6]" />
          )}
        </div>

        {/* 进度条 */}
        <div className="relative">
          <div className="h-px w-full bg-white/10">
            {progress !== undefined ? (
              <div
                className="h-full bg-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            ) : (
              <div className="h-full animate-loading-bar bg-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            )}
          </div>

          {/* 进度数值 */}
          <div className="mt-3 flex justify-between text-[10px] font-mono">
            <span className="text-[#707070]">{message || 'Constructing the Zeitgeist...'}</span>
            {progress !== undefined && (
              <span className="text-[#3B82F6] tabular-nums">{Math.round(progress)}%</span>
            )}
          </div>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <span className="text-[10px] text-[#505050] font-mono">
          {"// AI-GENERATED 3D ART REFLECTING THE WORLD'S SPIRIT"}
        </span>
      </div>
    </div>
  );
};

interface SkeletonLoaderProps {
  className?: string;
}

/**
 * 骨架屏加载组件 - HUD 风格
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="mb-4 h-4 w-3/4 rounded-sm bg-white/5" />
      <div className="mb-4 h-4 w-1/2 rounded-sm bg-white/5" />
      <div className="h-4 w-5/6 rounded-sm bg-white/5" />
    </div>
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 小型加载指示器 - HUD 风格
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
        border border-white/10
        border-t-[#3B82F6]
        rounded-sm
        animate-spin
      `}
    />
  );
};
