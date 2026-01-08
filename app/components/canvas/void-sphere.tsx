/**
 * VoidSphere 组件
 * 空状态 3D 线框球体
 * @see PRD V1.1 Section 3.3
 */

'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type * as THREE from 'three';

interface VoidSphereProps {
  /** 球体颜色 (默认暗红) */
  color?: string;
  /** 线框粗细 */
  wireframeLinewidth?: number;
  /** 旋转速度 */
  rotationSpeed?: number;
  /** 缩放 */
  scale?: number;
}

/**
 * 线框球体 - Void 状态 3D 组件
 *
 * PRD 规格:
 * - 当 API 返回 not_found 时渲染
 * - 简单的 Wireframe Sphere (线框球)
 * - 缓慢自转
 * - 轻微 Glitch 效果 (故障)
 * - 颜色设为暗红
 */
export function VoidSphere({
  color = '#EF4444',
  rotationSpeed = 0.2,
  scale = 1.5,
}: VoidSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerMeshRef = useRef<THREE.Mesh>(null);

  // 动画帧
  useFrame((state, delta) => {
    if (meshRef.current) {
      // 缓慢自转
      meshRef.current.rotation.y += delta * rotationSpeed;
      meshRef.current.rotation.x += delta * rotationSpeed * 0.3;

      // 轻微的脉冲呼吸效果
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.02 + 1;
      meshRef.current.scale.setScalar(scale * pulse);
    }

    if (innerMeshRef.current) {
      // 内层反向旋转
      innerMeshRef.current.rotation.y -= delta * rotationSpeed * 0.5;
      innerMeshRef.current.rotation.z += delta * rotationSpeed * 0.2;
    }
  });

  return (
    <group position={[0, 0.3, 0]}>
      {/* 外层线框球 */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.6} />
      </mesh>

      {/* 内层线框球 - 更小更淡 */}
      <mesh ref={innerMeshRef} scale={0.6}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
      </mesh>

      {/* 中心发光点 */}
      <mesh scale={0.1}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>

      {/* 点光源 - 给场景添加红色氛围 */}
      <pointLight color={color} intensity={2} distance={5} decay={2} />
    </group>
  );
}

/**
 * 简化版线框球 (性能优先)
 */
export function SimpleVoidSphere({ color = '#EF4444', scale = 1.5 }: VoidSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.3, 0]} scale={scale}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
    </mesh>
  );
}
