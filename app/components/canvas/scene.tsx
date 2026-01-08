'use client';

/**
 * Ephemera V2: Deep Space Terminal
 * 3D 场景容器组件 - 带后处理效果
 * @see PRD V1.1 Section 3.3
 */

import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, Noise } from '@react-three/postprocessing';
import type React from 'react';
import { Component, Suspense, type ReactNode } from 'react';
import { FALLBACK_MODEL_URL } from '~/lib/api';
import { Model } from './model';
import { VoidSphere } from './void-sphere';

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
 * 共享的 Canvas 配置和光照
 */
function SceneEnvironment({ children }: { children: ReactNode }) {
  return (
    <>
      {/* 深空雾气 */}
      <fog attach="fog" args={['#404040', 10, 50]} />

      {/* 环境反射 */}
      <Environment preset="city" environmentIntensity={0.5} />

      {/* 戏剧性光照系统 */}
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

      {children}

      {/* 接触阴影 */}
      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.6}
        scale={1000}
        blur={10}
        far={4}
        color="#000000"
      />

      {/* 交互控制 */}
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

      {/* 后处理效果 - 电影级质感 */}
      <EffectComposer enableNormalPass={false}>
        {/* Bloom 辉光 - 让高光溢出 */}
        <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.9} intensity={1.2} mipmapBlur />
        {/* Noise 噪点 - 模拟摄像机 ISO */}
        <Noise opacity={0.03} />
        {/* 注意: Vignette 暗角由 CSS .hud-vignette::after 处理，避免与 WebGL 效果重叠 */}
      </EffectComposer>
    </>
  );
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
        depth: true,
        stencil: false,
      }}
      style={{ background: 'transparent' }}
    >
      <SceneEnvironment>
        <Suspense fallback={null}>
          <group position={[0, 0.3, 0]}>
            <Model url={url} onLoad={onLoad} onError={onError} />
          </group>
        </Suspense>
      </SceneEnvironment>
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

/**
 * Void 状态 3D 场景
 * 当 API 返回 not_found 时显示
 */
export const VoidScene: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <div className={`w-full h-full ${className || ''}`}>
      <Canvas
        camera={{
          position: [0, 0.5, 5],
          fov: 40,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <SceneEnvironment>
          <Suspense fallback={null}>
            <VoidSphere />
          </Suspense>
        </SceneEnvironment>
      </Canvas>
    </div>
  );
};

/**
 * 全屏 Void 场景
 */
export const FullscreenVoidScene: React.FC = () => {
  return <VoidScene className="fixed inset-0 z-0" />;
};
