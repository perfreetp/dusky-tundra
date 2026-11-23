/**
 * GLB/GLTF 导入管线：
 * 加载 → 归一化（单位/原点/Y 向上）→ 语义标注（extras > sidecar > 命名约定 > 启发式）
 *      → 碰撞几何合并建 BVH → 产出 SceneConfig（缺失则回退默认场景）。
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { SceneConfig, SheaveParam } from '../../core/model/types';
import type { BvhRegistry } from './BvhRegistry';

export interface ImportResult {
  object: THREE.Object3D;
  colliderNames: string[];
  sheaveParams: SheaveParam[];
  /** 标注缺失程度，供 UI 提示是否回退默认绳系统 */
  usedFallback: boolean;
}

const SEMANTIC_PREFIXES = ['collider__', 'sheave__', 'anchor__', 'rail__', 'car__', 'cw__'];

export async function importGlb(
  url: string,
  bvh: BvhRegistry,
  fallbackConfig: SceneConfig,
): Promise<ImportResult> {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(url);
  const object = gltf.scene;

  // 归一化：包围盒居中到原点、底坑落在 Y=0
  normalizeObject(object);

  const colliderNames: string[] = [];
  const sheaveParams: SheaveParam[] = [];
  const colliderGeometries: THREE.BufferGeometry[] = [];

  object.updateMatrixWorld(true);
  object.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh) return;

    const semantic = readSemantic(mesh);
    if (semantic.kind === 'collider' || semantic.kind === 'rail' || semantic.kind === 'sheave') {
      const geo = mesh.geometry.clone();
      geo.applyMatrix4(mesh.matrixWorld);
      colliderGeometries.push(geo);
      colliderNames.push(mesh.name || `collider_${colliderNames.length}`);
    }
    if (semantic.kind === 'sheave') {
      const inferred = inferSheave(mesh, fallbackConfig, mesh.name);
      if (inferred) sheaveParams.push(inferred);
    }
  });

  // 合并碰撞几何，建一次 BVH
  if (colliderGeometries.length > 0) {
    const merged = mergeGeometries(colliderGeometries, false);
    if (merged) {
      const colliderMesh = new THREE.Mesh(merged);
      colliderMesh.name = 'collider__merged';
      bvh.register('glb-merged', colliderMesh);
      for (const g of colliderGeometries) g.dispose();
    }
  }

  const usedFallback = sheaveParams.length === 0;
  return { object, colliderNames, sheaveParams, usedFallback };
}

function normalizeObject(object: THREE.Object3D): void {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);
  // 平移使底部落在 Y=0、XZ 居中
  const center = new THREE.Vector3();
  box.getCenter(center);
  object.position.x -= center.x;
  object.position.z -= center.z;
  object.position.y -= box.min.y;
  object.updateMatrixWorld(true);
}

interface Semantic {
  kind: 'collider' | 'sheave' | 'anchor' | 'rail' | 'car' | 'cw' | 'unknown';
}

function readSemantic(mesh: THREE.Mesh): Semantic {
  // 1) glTF extras
  const extras = (mesh.userData as Record<string, unknown> | undefined)?.semantic;
  if (typeof extras === 'string') {
    const kind = matchPrefix(extras);
    if (kind !== 'unknown') return { kind };
  }
  // 2) 命名约定
  return { kind: matchPrefix(mesh.name) };
}

function matchPrefix(name: string): Semantic['kind'] {
  for (const p of SEMANTIC_PREFIXES) {
    if (name.startsWith(p)) {
      return p.replace('__', '') as Semantic['kind'];
    }
  }
  return 'unknown';
}

/** 启发式：从圆柱网格拟合绳轮参数（轴、半径），槽位取配置默认 */
function inferSheave(
  mesh: THREE.Mesh,
  fallback: SceneConfig,
  name: string,
): SheaveParam | null {
  const geo = mesh.geometry as THREE.BufferGeometry;
  if (!geo.boundingBox) geo.computeBoundingBox();
  const box = geo.boundingBox!;
  const size = new THREE.Vector3();
  box.getSize(size);
  // 圆柱：两短轴近似相等且为直径，长轴为轮宽
  const dims = [size.x, size.y, size.z].sort((a, b) => a - b);
  const radius = dims[1]! / 2;
  if (radius < 0.05) return null;

  const worldPos = new THREE.Vector3();
  mesh.getWorldPosition(worldPos);
  const template = fallback.sheaves[0];
  return {
    id: name.replace('sheave__', '') || 'inferredSheave',
    kind: 'traction',
    center: [worldPos.x, worldPos.y, worldPos.z],
    axis: [0, 0, 1],
    pitchRadius: radius,
    grooveCount: template?.grooveCount ?? 8,
    groovePitch: template?.groovePitch ?? 0.016,
    firstGrooveOffset: template?.firstGrooveOffset ?? -0.056,
    wrapSign: 1,
  };
}
