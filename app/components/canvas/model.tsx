'use client';

/**
 * GLB 模型加载组件
 * 支持滤镜材质替换 + 加载占位
 */

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type * as THREE from 'three';
import type { Group, Mesh } from 'three';
import { useStyleFilter } from '~/components/post-processing';
import {
  ASCIIMaterial,
  BlueprintMaterial,
  ClaymationMaterial,
  CrystalMaterial,
  HalftoneMaterial,
  PixelMaterial,
  SketchMaterial,
  SketchOutlineMaterial,
} from '~/components/post-processing/materials';
import { fetchModelAsBlob } from '~/constants/meta/service';
import { ModelLoadingPlaceholder } from './void-sphere';

interface ModelProps {
  url: string;
  scale?: number;
  position?: [number, number, number];
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

const MATERIAL_FILTERS = [
  'blueprint',
  'halftone',
  'ascii',
  'sketch',
  'crystal',
  'claymation',
  'pixel',
] as const;

type MaterialFilter = (typeof MATERIAL_FILTERS)[number];

function isMaterialFilter(filter: string): filter is MaterialFilter {
  return MATERIAL_FILTERS.includes(filter as MaterialFilter);
}

function FilterMaterial({ filter }: { filter: MaterialFilter }) {
  switch (filter) {
    case 'blueprint':
      return <BlueprintMaterial />;
    case 'halftone':
      return <HalftoneMaterial />;
    case 'ascii':
      return <ASCIIMaterial />;
    case 'sketch':
      return <SketchMaterial />;
    case 'crystal':
      return <CrystalMaterial />;
    case 'claymation':
      return <ClaymationMaterial />;
    case 'pixel':
      return <PixelMaterial />;
    default:
      return null;
  }
}

/**
 * 模型内容组件 - 支持材质替换
 */
function ModelContent({ url, onLoad }: { url: string; onLoad?: () => void }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<Group>(null);
  const hasCalledOnLoad = useRef(false);
  const { filter } = useStyleFilter();

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    if (hasCalledOnLoad.current) return;
    if (!onLoad) return;

    hasCalledOnLoad.current = true;
    onLoad();
  }, [onLoad]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const geometries = useMemo(() => {
    const geos: { geometry: THREE.BufferGeometry; matrix: THREE.Matrix4 }[] = [];
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        if (mesh.geometry) {
          geos.push({
            geometry: mesh.geometry,
            matrix: mesh.matrixWorld.clone(),
          });
        }
      }
    });
    return geos;
  }, [scene]);

  const useMaterialFilter = isMaterialFilter(filter);
  const isSketchFilter = filter === 'sketch';

  return (
    <group ref={groupRef}>
      {!useMaterialFilter && <primitive object={clonedScene} scale={3} />}

      {useMaterialFilter &&
        geometries.map((item, i) => (
          <group key={i}>
            <mesh geometry={item.geometry} scale={3}>
              <FilterMaterial filter={filter as MaterialFilter} />
            </mesh>
            {isSketchFilter && (
              <mesh geometry={item.geometry} scale={3}>
                <SketchOutlineMaterial />
              </mesh>
            )}
          </group>
        ))}
    </group>
  );
}

/**
 * 模型加载器
 */
function ModelLoader({ url, onLoad, onError }: ModelProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let revoke: string | null = null;
    setIsLoading(true);

    fetchModelAsBlob(url)
      .then((result) => {
        setBlobUrl(result);
        if (result !== url) revoke = result;
      })
      .catch((err) => {
        setError(err);
        onError?.(err);
        setIsLoading(false);
      });

    return () => {
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [url, onError]);

  const handleModelLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  if (error) return null;

  return (
    <>
      {/* 加载占位 - 模型加载完成前显示 */}
      {isLoading && <ModelLoadingPlaceholder />}

      {/* 模型内容 */}
      {blobUrl && (
        <Suspense fallback={<ModelLoadingPlaceholder />}>
          <ModelContent url={blobUrl} onLoad={handleModelLoad} />
        </Suspense>
      )}
    </>
  );
}

/**
 * GLB 模型组件
 */
export function Model({ url, onLoad, onError }: ModelProps) {
  if (!url) return null;

  return <ModelLoader url={url} onLoad={onLoad} onError={onError} />;
}

/**
 * 带动画的模型组件 (保留兼容性)
 */
export const AnimatedModel = Model;

/**
 * 预加载模型
 */
export function preloadModel(url: string) {
  if (url) {
    fetchModelAsBlob(url).then((blobUrl) => {
      useGLTF.preload(blobUrl);
    });
  }
}
