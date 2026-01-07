'use client';

/**
 * GLB 模型加载组件
 * 使用 @react-three/drei 的 useGLTF 加载 GLB 模型
 * @see llmdoc/guides/daily-world-dev.md
 */

import { useGLTF } from '@react-three/drei';
import type React from 'react';
import { useEffect, useRef } from 'react';
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
