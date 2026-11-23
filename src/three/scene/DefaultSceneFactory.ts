/**
 * 内置参数化井道的 three 场景工厂。
 * 产出钢结构/绳轮/轿厢/对重网格，并把导轨等碰撞体注册进 BvhRegistry。
 */
import * as THREE from 'three';
import type { SceneConfig, SheaveParam } from '../../core/model/types';
import { ENGINE_CONFIG } from '../../config/engineConfig';
import { createStructureMaterial } from '../materials/materials';
import type { BvhRegistry } from '../bvh/BvhRegistry';

export interface DefaultSceneHandles {
  group: THREE.Group;
  structureGroup: THREE.Group;
  car: THREE.Mesh;
  counterweight: THREE.Mesh;
  /** 绳轮网格（可用于旋转动画） */
  sheaves: Map<string, THREE.Mesh>;
}

export function buildDefaultScene(
  scene: SceneConfig,
  clipPlanes: THREE.Plane[],
  bvh: BvhRegistry,
): DefaultSceneHandles {
  const group = new THREE.Group();
  const structureGroup = new THREE.Group();
  group.add(structureGroup);

  const steelMat = createStructureMaterial(ENGINE_CONFIG.steelColor, clipPlanes);
  const railMat = createStructureMaterial(ENGINE_CONFIG.railColor, clipPlanes);
  const carMat = createStructureMaterial(ENGINE_CONFIG.carColor, clipPlanes);
  const cwMat = createStructureMaterial(ENGINE_CONFIG.cwColor, clipPlanes);
  const sheaveMat = createStructureMaterial(ENGINE_CONFIG.sheaveColor, clipPlanes);

  const { hoistway } = scene;
  const totalHeight = hoistway.pitDepth + hoistway.travel + hoistway.headroomHeight;

  // 井道四柱框架
  const postGeo = new THREE.BoxGeometry(0.08, totalHeight, 0.08);
  const hw = hoistway.width / 2;
  const hd = hoistway.depth / 2;
  for (const [x, z] of [
    [-hw, -hd],
    [hw, -hd],
    [-hw, hd],
    [hw, hd],
  ]) {
    const post = new THREE.Mesh(postGeo, steelMat);
    post.position.set(x!, totalHeight / 2, z!);
    structureGroup.add(post);
  }

  // 横梁（每 4 米一道）
  const beamGeo = new THREE.BoxGeometry(hoistway.width + 0.1, 0.06, 0.12);
  for (let y = 4; y < totalHeight; y += 4) {
    for (const z of [-hd, hd]) {
      const beam = new THREE.Mesh(beamGeo, steelMat);
      beam.position.set(0, y, z);
      structureGroup.add(beam);
    }
  }

  // 导轨（碰撞体）
  const firstRail = scene.rails[0]!;
  const railGeo = new THREE.BoxGeometry(
    firstRail.halfWidth * 2,
    firstRail.height,
    firstRail.halfWidth * 2,
  );
  for (const rail of scene.rails) {
    const railMesh = new THREE.Mesh(railGeo, railMat);
    railMesh.position.set(rail.base[0], rail.height / 2, rail.base[2]);
    railMesh.name = `collider__${rail.id}`;
    structureGroup.add(railMesh);
    bvh.register(rail.id, railMesh);
  }

  // 绳轮
  const sheaves = new Map<string, THREE.Mesh>();
  for (const sp of scene.sheaves) {
    const mesh = buildSheaveMesh(sp, sheaveMat);
    mesh.name = `sheave__${sp.id}`;
    structureGroup.add(mesh);
    sheaves.set(sp.id, mesh);
    // 绳轮本身也是碰撞体（防止绳穿轮的 BVH 兜底；弧段解析贴合为主）
    bvh.register(sp.id, mesh);
  }

  // 轿厢
  const car = new THREE.Mesh(
    new THREE.BoxGeometry(
      scene.car.halfExtents[0] * 2,
      scene.car.halfExtents[1] * 2,
      scene.car.halfExtents[2] * 2,
    ),
    carMat,
  );
  car.name = 'car__body';
  group.add(car);

  // 对重
  const counterweight = new THREE.Mesh(
    new THREE.BoxGeometry(
      scene.counterweight.halfExtents[0] * 2,
      scene.counterweight.halfExtents[1] * 2,
      scene.counterweight.halfExtents[2] * 2,
    ),
    cwMat,
  );
  counterweight.name = 'cw__body';
  group.add(counterweight);

  return { group, structureGroup, car, counterweight, sheaves };
}

function buildSheaveMesh(sp: SheaveParam, mat: THREE.Material): THREE.Mesh {
  const geo = new THREE.CylinderGeometry(sp.pitchRadius, sp.pitchRadius, 0.08, 32, 1);
  const mesh = new THREE.Mesh(geo, mat);
  // CylinderGeometry 默认轴为 Y，旋转使轴对齐 sp.axis（默认场景轴为 Z）
  const axis = new THREE.Vector3(...sp.axis).normalize();
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
  mesh.position.set(sp.center[0], sp.center[1], sp.center[2]);

  // 绳槽视觉环（细圆盘，沿轴排列）
  const grooveMat = new THREE.MeshStandardMaterial({
    color: 0x4a5260,
    roughness: 0.6,
    metalness: 0.6,
  });
  for (let g = 0; g < sp.grooveCount; g++) {
    const off = sp.firstGrooveOffset + g * sp.groovePitch;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(sp.pitchRadius, 0.003, 8, 40),
      grooveMat,
    );
    // Torus 默认法线朝 Z，旋转到轮轴方向
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), axis);
    ring.position.copy(mesh.position).addScaledVector(axis, off);
    mesh.add(ring);
    ring.position.sub(mesh.position); // 转为局部坐标
  }
  void mat;
  return mesh;
}
