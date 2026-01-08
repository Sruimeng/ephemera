'use client';

/**
 * Ephemera V2: Deep Space Terminal
 * 3D 场景容器组件 - 带后处理效果
 * @see llmdoc/guides/ephemera-prd.md
 */

import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
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
 * Ephemera V2 3D 场景组件
 *
 * 视觉特性:
 * - 深炭色背景 #050505
 * - 戏剧性光照: 主灯 + 冷色补光 (Rim Light)
 * - 后处理: Bloom (辉光) + Noise (噪点) + Vignette (暗角)
 * - OrbitControls: 限制垂直角度, 自动旋转
 */
export const Scene: React.FC<SceneProps> = ({ modelUrl, onLoad, onError, className }) => {
  const effectiveUrl = modelUrl || FALLBACK_MODEL_URL;

  const renderCanvas = (url: string) => (
    <Canvas
      shadows
      camera={{
        position: [0, 0.5, 5],
        fov: 40,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        // 提高色彩精度
        depth: true,
        stencil: false,
      }}
      style={{ background: 'transparent' }}
    >
      {/* 1. 深空背景色 - 移除以显示 CSS 径向渐变 */}
      {/* <color attach="background" args={['#050505']} /> */}

      {/* 2. 浅色雾气 - 适配深灰背景 */}
      {/* <fog attach="fog" args={['#050505', 10, 50]} /> */}
      <fog attach="fog" args={['#404040', 10, 50]} />

      {/* 3. 环境反射 - 保持适中 */}
      <Environment preset="city" environmentIntensity={0.5} />

      {/* 4. 戏剧性光照系统 */}
      {/* 主光源 - 从上方照射 */}
      <spotLight
        position={[5, 8, 5]}
        angle={0.3}
        penumbra={1}
        intensity={8}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Rim Light (轮廓光) - 冷蓝色，从侧后方 */}
      <pointLight position={[-5, 3, -5]} intensity={4} color="#3B82F6" />

      {/* 补光 - 微弱暖光，从对侧 */}
      <pointLight position={[5, -2, -3]} intensity={1} color="#1E40AF" />

      {/* 环境光 - 极微弱 */}
      <ambientLight intensity={0.15} />

      {/* 5. 模型加载 */}
      <Suspense fallback={null}>
        <group position={[0, 0.3, 0]}>
          <Model url={url} onLoad={onLoad} onError={onError} />
        </group>

        {/* 6. 接触阴影 - 更深更柔和 */}
        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={0.6}
          scale={1000}
          blur={10}
          far={4}
          color="#000000"
        />
      </Suspense>

      {/* 7. 交互控制 */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.05}
        target={[0, 0.3, 0]}
      />

      {/* 8. 后处理效果 - 电影级质感 */}
      <EffectComposer enableNormalPass={false}>
        {/* Bloom 辉光 - 让高光溢出 */}
        <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.9} intensity={1.2} mipmapBlur />
      </EffectComposer>
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
