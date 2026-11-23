// 外部场馆/看台网格加载:GLTF/GLB 与 OBJ
// 载入的网格用于展示与观众视角射线遮挡;manifold 评分仍基于可解析的结构盒体
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import type { Vec3 } from '../types';

export interface LoadedMesh {
  object: THREE.Object3D;
  /** 可参与射线遮挡的网格列表 */
  collidables: THREE.Mesh[];
  /** 网格轴对齐包围盒(世界系) */
  bbox: { min: Vec3; max: Vec3 };
  name: string;
}

const gltfLoader = new GLTFLoader();
const objLoader = new OBJLoader();

export async function loadVenueMesh(file: File): Promise<LoadedMesh> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  const url = URL.createObjectURL(file);
  try {
    let object: THREE.Object3D;
    if (ext === 'glb' || ext === 'gltf') {
      const gltf = await gltfLoader.loadAsync(url);
      object = gltf.scene;
    } else if (ext === 'obj') {
      object = await objLoader.loadAsync(url);
    } else {
      throw new Error(`不支持的网格格式:${ext ?? '未知'}(支持 .glb/.gltf/.obj)`);
    }

    object.name = file.name;
    const collidables: THREE.Mesh[] = [];
    object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        collidables.push(mesh);
      }
    });

    const b3 = new THREE.Box3().setFromObject(object);
    const bbox = {
      min: fromThreeVec(b3.min),
      max: fromThreeVec(b3.max),
    };
    return { object, collidables, bbox, name: file.name };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function fromThreeVec(v: THREE.Vector3): Vec3 {
  return [v.x, v.z, v.y];
}
