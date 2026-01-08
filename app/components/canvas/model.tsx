'use client';

/**
 * GLB 模型加载组件
 * 带切换动画的模型组件
 * @see PRD V1.1 Section 2.3 - 模型切换动画
 */

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import type { Group } from 'three';
import * as THREE from 'three';

interface ModelProps {
  /** GLB 模型 URL */
  url: string;
  /** 模型缩放比例 */
  scale?: number;
  /** 模型位置 */
  position?: [number, number, number];
  /** 加载完成回调 */
  onLoad?: () => void;
  /** 加载错误回调 */
  onError?: (error: Error) => void;
}

/**
 * GLB 模型组件
 *
 * @example
 * ```tsx
 * <Model url="https://example.com/model.glb" scale={1.5} />
 * ```
 */
export const Model: React.FC<ModelProps> = ({
  url,
  scale = 1,
  position = [0, 0, 0],
  onLoad,
  onError,
}) => {
  const groupRef = useRef<Group>(null);

  // 使用 useGLTF 加载模型
  const { scene } = useGLTF(url, true, true, (loader) => {
    loader.manager.onError = (errorUrl) => {
      onError?.(new Error(`Failed to load: ${errorUrl}`));
    };
  });

  useEffect(() => {
    if (scene) {
      // 计算模型边界框并居中
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // 将模型居中
      scene.position.sub(center);

      // 根据模型大小自动调整缩放
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = 2; // 目标大小
      const autoScale = targetSize / maxDim;

      if (groupRef.current) {
        groupRef.current.scale.setScalar(autoScale * scale);
      }

      onLoad?.();
    }
  }, [scene, scale, onLoad]);

  return (
    <group ref={groupRef} position={position}>
      <primitive object={scene.clone()} />
    </group>
  );
};

/**
 * 带动画的模型组件
 * 支持缩放过渡动画 (Scale 0 -> 1)
 *
 * PRD 规格:
 * - LOADING: 旧模型缩小消失 (Scale -> 0)
 * - SUCCESS: 新模型放大出现 (Scale -> 1)
 */
export const AnimatedModel: React.FC<
  ModelProps & {
    /** 是否显示 */
    visible?: boolean;
    /** 动画持续时间 (秒) */
    animationDuration?: number;
  }
> = ({
  url,
  scale = 1,
  position = [0, 0, 0],
  onLoad,
  onError,
  visible = true,
  animationDuration = 0.4,
}) => {
  const groupRef = useRef<Group>(null);
  const [currentScale, setCurrentScale] = useState(0);
  const targetScaleRef = useRef(visible ? 1 : 0);

  // 使用 useGLTF 加载模型
  const { scene } = useGLTF(url, true, true, (loader) => {
    loader.manager.onError = (errorUrl) => {
      onError?.(new Error(`Failed to load: ${errorUrl}`));
    };
  });

  // 更新目标缩放
  useEffect(() => {
    targetScaleRef.current = visible ? 1 : 0;
  }, [visible]);

  // 初始化模型
  useEffect(() => {
    if (scene) {
      // 计算模型边界框并居中
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // 将模型居中
      scene.position.sub(center);

      // 根据模型大小自动调整缩放
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = 2;
      const autoScale = targetSize / maxDim;

      if (groupRef.current) {
        // 存储自动缩放值
        groupRef.current.userData.autoScale = autoScale * scale;
      }

      onLoad?.();
    }
  }, [scene, scale, onLoad]);

  // 动画帧 - 平滑缩放过渡
  useFrame((_, delta) => {
    if (groupRef.current) {
      const autoScale = groupRef.current.userData.autoScale || scale;
      const target = targetScaleRef.current * autoScale;
      const speed = 1 / animationDuration;

      // 线性插值
      const newScale = THREE.MathUtils.lerp(currentScale, target, Math.min(delta * speed * 5, 1));

      if (Math.abs(newScale - currentScale) > 0.001) {
        setCurrentScale(newScale);
        groupRef.current.scale.setScalar(Math.max(newScale, 0.001)); // 防止 scale 为 0
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <primitive object={scene.clone()} />
    </group>
  );
};

/**
 * 预加载模型
 * 在组件渲染前预加载模型以提升性能
 *
 * @param url - GLB 模型 URL
 */
export function preloadModel(url: string) {
  if (url) {
    useGLTF.preload(url);
  }
}
