/**
 * 材质工厂：绳体（半透明/顶点张力色/局部剖切）、钢结构、封口。
 * 张力在几何层烘焙为顶点色，材质保持标准 PBR，剖切走内建 clippingPlanes。
 */
import * as THREE from 'three';
import { ENGINE_CONFIG } from '../../config/engineConfig';

export interface RopeMaterialOptions {
  opacity: number;
  clippingPlanes: THREE.Plane[];
}

export function createRopeMaterial(opts: RopeMaterialOptions): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    vertexColors: true,
    transparent: true,
    opacity: opts.opacity,
    depthWrite: false,
    side: THREE.DoubleSide,
    roughness: 0.55,
    metalness: 0.15,
    clippingPlanes: opts.clippingPlanes,
    clipShadows: true,
  });
}

export function createStructureMaterial(
  color: number,
  clippingPlanes: THREE.Plane[],
): THREE.MeshStandardMaterial {
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.7,
    metalness: 0.55,
    clippingPlanes,
    clipShadows: true,
  });
  mat.depthWrite = true;
  mat.side = THREE.FrontSide;
  return mat;
}

/** 封口材质：近不透明、写深度、与绳管共享剖切平面（防止自身被切出缝） */
export function createCapMaterial(clippingPlanes: THREE.Plane[]): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: ENGINE_CONFIG.capColor,
    roughness: 0.5,
    metalness: 0.2,
    transparent: true,
    opacity: 0.95,
    side: THREE.DoubleSide,
    clippingPlanes,
    clipShadows: true,
    depthWrite: true,
  });
}

/** 剖切截面环材质：不参与 clipping，避免被同一平面切没 */
export function createSectionMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: ENGINE_CONFIG.clipPlaneColor,
    emissive: new THREE.Color(ENGINE_CONFIG.clipPlaneColor),
    emissiveIntensity: 0.35,
    roughness: 0.4,
    metalness: 0.1,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}
