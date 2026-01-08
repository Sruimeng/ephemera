'use client';

/**
 * HUD 装饰组件
 * Ephemera V2: Deep Space Terminal
 * 无意义但好看的技术图腾
 */

import type React from 'react';
import { useEffect, useState } from 'react';

/**
 * 实时时间戳显示
 */
export const LiveTimestamp: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [time, setTime] = useState<string>('00:00:00.000');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // 转换为北京时间 (UTC+8)
      // 原理: 获取当前UTC时间戳，加上8小时偏移量，然后读取UTC时间分量
      const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);

      const hours = beijingTime.getUTCHours().toString().padStart(2, '0');
      const mins = beijingTime.getUTCMinutes().toString().padStart(2, '0');
      const secs = beijingTime.getUTCSeconds().toString().padStart(2, '0');
      const ms = beijingTime.getUTCMilliseconds().toString().padStart(3, '0');
      setTime(`${hours}:${mins}:${secs}.${ms}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 47); // ~21fps for subtle flicker
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`font-mono text-xs text-[#D4D4D4] tabular-nums ${className}`}>{time} CN</span>
  );
};

/**
 * 十字准星
 */
export const Crosshair: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none ${className}`}>
      {/* 中心点 */}
      <div className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-[#3B82F6]/30 -translate-x-1/2 -translate-y-1/2" />

      {/* 水平线 */}
      <div className="absolute left-1/2 top-1/2 h-px w-8 from-transparent via-[#3B82F6]/20 to-transparent bg-gradient-to-r -translate-x-1/2 -translate-y-1/2" />

      {/* 垂直线 */}
      <div className="absolute left-1/2 top-1/2 h-8 w-px from-transparent via-[#3B82F6]/20 to-transparent bg-gradient-to-b -translate-x-1/2 -translate-y-1/2" />

      {/* 角标记 */}
      <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute left-0 top-0 h-1.5 w-px bg-[#3B82F6]/30" />
        <div className="absolute left-0 top-0 h-px w-1.5 bg-[#3B82F6]/30" />
        <div className="absolute right-0 top-0 h-1.5 w-px bg-[#3B82F6]/30" />
        <div className="absolute right-0 top-0 h-px w-1.5 bg-[#3B82F6]/30" />
        <div className="absolute bottom-0 left-0 h-1.5 w-px bg-[#3B82F6]/30" />
        <div className="absolute bottom-0 left-0 h-px w-1.5 bg-[#3B82F6]/30" />
        <div className="absolute bottom-0 right-0 h-1.5 w-px bg-[#3B82F6]/30" />
        <div className="absolute bottom-0 right-0 h-px w-1.5 bg-[#3B82F6]/30" />
      </div>
    </div>
  );
};

/**
 * 坐标读数
 */
export const CoordinateReadout: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`font-mono text-[10px] text-[#A3A3A3] ${className}`}>
      <div>X: {coords.x.toString().padStart(4, '0')}</div>
      <div>Y: {coords.y.toString().padStart(4, '0')}</div>
    </div>
  );
};

/**
 * 角落装饰框
 */
export const CornerBracket: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}> = ({ position, className = '' }) => {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4 rotate-90',
    'bottom-left': 'bottom-4 left-4 -rotate-90',
    'bottom-right': 'bottom-4 right-4 rotate-180',
  };

  return (
    <div className={`fixed pointer-events-none ${positionClasses[position]} ${className}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/30">
        <path d="M0 8V0H8" stroke="currentColor" strokeWidth="1" />
        <path d="M0 0L6 6" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      </svg>
    </div>
  );
};

/**
 * 数据流装饰
 */
export const DataStream: React.FC<{ className?: string }> = ({ className = '' }) => {
  const lines = [
    '0x7F3A9B2C',
    'SYS.INIT',
    '████████',
    '0xDEADBEEF',
    'SYNC.OK',
    '░░░░░░░░',
    '0x1A2B3C4D',
    'DATA.RDY',
  ];

  return (
    <div className={`font-mono text-[8px] text-[#737373] overflow-hidden h-16 ${className}`}>
      <div className="animate-data-stream">
        {[...lines, ...lines].map((line, i) => (
          <div key={i} className="leading-tight">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 信号强度指示器
 */
export const SignalIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-end gap-0.5 ${className}`}>
      <div className="h-1 w-0.5 bg-[#3B82F6]/60" />
      <div className="h-1.5 w-0.5 bg-[#3B82F6]/60" />
      <div className="h-2 w-0.5 bg-[#3B82F6]/60" />
      <div className="h-2.5 w-0.5 bg-[#3B82F6]/40" />
      <div className="h-3 w-0.5 bg-[#3B82F6]/20" />
    </div>
  );
};

/**
 * HUD 完整覆盖层
 * 包含所有装饰元素
 */
export const HudOverlay: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none z-30 ${className}`}>
      {/* 四角装饰框 */}
      <CornerBracket position="top-left" />
      <CornerBracket position="top-right" />
      <CornerBracket position="bottom-left" />
      <CornerBracket position="bottom-right" />

      {/* 中心十字准星 */}
      <Crosshair className="fixed inset-0" />

      {/* 左下角: 坐标读数 */}
      <div className="fixed bottom-20 left-6">
        <CoordinateReadout />
      </div>

      {/* 右下角: 数据流 */}
      <div className="fixed bottom-20 right-6">
        <DataStream />
      </div>

      {/* 顶部边缘线 */}
      <div className="fixed left-1/4 right-1/4 top-0 h-px from-transparent via-white/5 to-transparent bg-gradient-to-r" />

      {/* 底部边缘线 */}
      <div className="fixed bottom-0 left-1/4 right-1/4 h-px from-transparent via-white/5 to-transparent bg-gradient-to-r" />
    </div>
  );
};

/**
 * 状态指示点
 */
export const StatusDot: React.FC<{
  status: 'online' | 'offline' | 'syncing';
  className?: string;
}> = ({ status, className = '' }) => {
  const colors = {
    online: 'bg-[#22C55E]',
    offline: 'bg-[#EF4444]',
    syncing: 'bg-[#3B82F6] animate-pulse',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`h-1.5 w-1.5 rounded-full ${colors[status]}`} />
      <span className="text-[10px] text-[#808080] font-mono uppercase">{status}</span>
    </div>
  );
};
