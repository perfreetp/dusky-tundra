import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { VenueBounds, VenueModel } from './venue';

const TARGET_MAX_DIM = 120;

/** 收集模型内所有 Mesh 作为 raycast 目标 */
function collectMeshes(root: THREE.Object3D): THREE.Mesh[] {
  const meshes: THREE.Mesh[] = [];
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
  });
  return meshes;
}

/**
 * 导入 GLTF/GLB：按包围盒缩放到参考尺寸，XZ 居中并落地到 y=0。
 * 返回与程序场馆同构的 VenueModel。
 */
export async function loadVenueGltf(file: File): Promise<VenueModel> {
  const buffer = await file.arrayBuffer();
  const loader = new GLTFLoader();
  const gltf = await loader.parseAsync(buffer, '');
  const root = gltf.scene;

  // 先更新世界矩阵再求包围盒
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = TARGET_MAX_DIM / maxDim;
  root.scale.multiplyScalar(scale);
  root.updateMatrixWorld(true);

  const box2 = new THREE.Box3().setFromObject(root);
  const c2 = new THREE.Vector3();
  box2.getCenter(c2);
  root.position.x -= c2.x;
  root.position.z -= c2.z;
  root.position.y -= box2.min.y;
  root.updateMatrixWorld(true);

  const finalBox = new THREE.Box3().setFromObject(root);
  const bounds: VenueBounds = {
    minX: finalBox.min.x,
    maxX: finalBox.max.x,
    minZ: finalBox.min.z,
    maxZ: finalBox.max.z,
  };

  const meshes = collectMeshes(root);
  return {
    root,
    raycastTargets: meshes,
    bounds,
    dispose: () => {
      meshes.forEach((m) => {
        m.geometry?.dispose();
        const mat = m.material;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
    },
  };
}
