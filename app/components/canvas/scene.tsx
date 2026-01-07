'use client';

/**
 * 3D 场景容器组件
 * 包含 Canvas、灯光、控制器和模型
 * @see llmdoc/guides/daily-world-dev.md
 * @see llmdoc/guides/ephemera-prd.md
 */

import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import type React from 'react';
import { Component, Suspense, type ReactNode } from 'react';
import { FALLBACK_MODEL_URL } from '~/lib/api';
import { Model } from './model';

interface SceneProps {
  /** GLB 模型 URL */
  modelUrl: string;
  /** 模型加载完成回调 */
  onLoad?: () => void;
  /** 模型加载错误回调 */
  onError?: (error: Error) => void;
  /** 自定义类名 */
  className?: string;
}

/**
 * Canvas 错误边界
 * 捕获 R3F 渲染错误，显示 fallback 模型
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onError?: (error: Error) => void;
}

class CanvasErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('[Scene] Model load error:', error);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * 3D 场景组件
 *
 * 配置规范 (PRD):
 * - 背景色: #F5F5F7 (Apple Light Grey)
 * - OrbitControls: 限制垂直角度 45°-120°, 自动旋转 0.5 速度
 * - ContactShadows: opacity 0.4, blur 2.5
 * - Environment: city preset
 *
 * @example
 * ```tsx
 * <Scene modelUrl="https://example.com/model.glb" />
 * ```
 */
export const Scene: React.FC<SceneProps> = ({ modelUrl, onLoad, onError, className }) => {
  // 使用 fallback 模型 URL 如果原始 URL 为空
  const effectiveUrl = modelUrl || FALLBACK_MODEL_URL;

  /**
   * 渲染 Canvas 内容
   * 暗色主题: 深空灰背景 + 轮廓光
   */
  const renderCanvas = (url: string) => (
    <Canvas
      shadows
      camera={{
        // 相机位置上移，让模型显示在画面上半部分
        position: [0, 0.5, 5],
        fov: 40,
      }}
      gl={{
        antialias: true,
        // 开启透明背景，让 CSS 渐变背景透出来
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{ background: 'transparent' }}
    >
      {/* 1. 不设置背景色，使用 CSS 深空灰渐变背景 */}

      {/* 2. 暗色雾气: 与背景融合 */}
      <fog attach="fog" args={['#1a1a1f', 8, 40]} />

      {/* 3. 环境反射: 使用 city 预设，降低强度 */}
      <Environment preset="city" environmentIntensity={0.8} />

      {/* 4. 轮廓光 (Rim Light): 侧后方高强度冷光，勾勒边缘 */}
      <spotLight position={[5, 5, -5]} angle={0.5} penumbra={1} intensity={2} color="#4f8aff" />

      {/* 5. 模型加载 - 位置上移让模型在画面上半部分 */}
      <Suspense fallback={null}>
        <group position={[0, 0.3, 0]}>
          <Model url={url} onLoad={onLoad} onError={onError} />
        </group>

        {/* 6. 接触阴影: 暗背景下透明度调低，模糊度调高 */}
        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={0.5}
          scale={10}
          blur={3}
          far={4}
          color="#000000"
        />
      </Suspense>

      {/* 7. 交互控制 */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        // 限制垂直旋转角度: 45° - 120° (防止看到底部)
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        // 自动旋转
        autoRotate
        autoRotateSpeed={0.5}
        // 阻尼效果
        enableDamping
        dampingFactor={0.05}
        // 目标点上移
        target={[0, 0.3, 0]}
      />
    </Canvas>
  );

  return (
    <div className={`w-full h-full ${className || ''}`}>
      <CanvasErrorBoundary onError={onError} fallback={renderCanvas(FALLBACK_MODEL_URL)}>
        {renderCanvas(effectiveUrl)}
      </CanvasErrorBoundary>
    </div>
  );
};

/**
 * 全屏 3D 场景组件
 * 用于首页展示
 */
export const FullscreenScene: React.FC<Omit<SceneProps, 'className'>> = ({
  modelUrl,
  onLoad,
  onError,
}) => {
  return (
    <Scene modelUrl={modelUrl} onLoad={onLoad} onError={onError} className="fixed inset-0 z-0" />
  );
};
