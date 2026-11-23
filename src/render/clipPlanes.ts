/**
 * 三个正交剖切面（YZ / ZX / XY）：
 *  - 平面位置可拖动（TransformControls 手柄 + UI 滑块双通道）
 *  - 截面速度云图：对覆盖体数据包围盒的平面网格逐顶点采样体素速率，
 *    写进顶点颜色；移动平面时只重算受影响的一列顶点，保证不卡顿
 *  - 同时暴露当前截面采样结果，供流线系统在该平面附近重算（同步更新）
 */

import {
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Vector3,
} from 'three';
import type { VolumeGrid } from './volumeSampler';
import { sampleSpeed } from './volumeSampler';
import { speedColor } from './colormap';
import type { AxisId } from '../state/store';

const PLANE_RES = 96; // 每轴 96×96 采样，三面合计约 2.8 万点，重算单轴 O(96²)

interface AxisSpec {
  id: AxisId;
  /** 平面法线轴在 xyz 中的索引 */
  normalAxis: 0 | 1 | 2;
  /** 平面两切向轴 */
  tangentAxes: [0 | 1 | 2, 0 | 1 | 2];
}

const AXES: Record<AxisId, AxisSpec> = {
  yz: { id: 'yz', normalAxis: 0, tangentAxes: [2, 1] }, // 法向 X
  zx: { id: 'zx', normalAxis: 1, tangentAxes: [0, 2] }, // 法向 Y（水平面）
  xy: { id: 'xy', normalAxis: 2, tangentAxes: [0, 1] }, // 法向 Z
};

export interface ClipPlaneHandle {
  id: AxisId;
  group: Group;
  mesh: Mesh<PlaneGeometry, MeshBasicMaterial>;
  /** 当前法线轴世界坐标 */
  worldPosition: number;
  setEnabled: (on: boolean) => void;
  /** 归一化 0..1 位置 -> 更新几何与云图 */
  setNormalized: (t: number) => void;
  getNormalized: () => number;
  /** 世界坐标 -> 归一化 */
  worldToNormalized: (w: number) => number;
  /** 强制重算云图（体数据变化时） */
  refresh: () => void;
  dispose: () => void;
}

export interface ClipPlaneSystem {
  group: Group;
  handles: Record<AxisId, ClipPlaneHandle>;
  /** 三个面当前在体数据内覆盖的世界坐标区间（粒子重算联动用） */
  getActivePlanes: () => { axis: AxisId; worldPosition: number }[];
  dispose: () => void;
}

export function createClipPlanes(grid: VolumeGrid): ClipPlaneSystem {
  const root = new Group();
  const min: [number, number, number] = [...grid.origin];
  const max: [number, number, number] = [
    grid.origin[0] + (grid.size[0] - 1) * grid.spacing[0],
    grid.origin[1] + (grid.size[1] - 1) * grid.spacing[1],
    grid.origin[2] + (grid.size[2] - 1) * grid.spacing[2],
  ];
  const handles = {} as Record<AxisId, ClipPlaneHandle>;
  const scratch = new Float32Array(new ArrayBuffer(12));

  for (const spec of Object.values(AXES)) {
    handles[spec.id] = createHandle(spec, grid, min, max, scratch);
    root.add(handles[spec.id].group);
  }

  return {
    group: root,
    handles,
    getActivePlanes: () =>
      (Object.values(handles))
        .filter((h) => h.group.visible)
        .map((h) => ({ axis: h.id, worldPosition: h.worldPosition })),
    dispose: () => {
      for (const h of Object.values(handles)) h.dispose();
    },
  };
}

function createHandle(
  spec: AxisSpec,
  grid: VolumeGrid,
  min: [number, number, number],
  max: [number, number, number],
  scratch: Float32Array<ArrayBuffer>,
): ClipPlaneHandle {
  const [ta, tb] = spec.tangentAxes;
  const width = max[ta] - min[ta];
  const height = max[tb] - min[tb];
  const geo = new PlaneGeometry(width, height, PLANE_RES - 1, PLANE_RES - 1);
  // group 承担法线轴位移与朝向；mesh 固定在包围盒中心（局部原点）
  const group = new Group();
  if (spec.normalAxis === 0) group.rotation.y = Math.PI / 2; // 法向 X
  if (spec.normalAxis === 1) group.rotation.x = -Math.PI / 2; // 法向 Y
  group.position.set(
    (min[0] + max[0]) / 2,
    (min[1] + max[1]) / 2,
    (min[2] + max[2]) / 2,
  );

  const colors = new Float32Array(PLANE_RES * PLANE_RES * 3);
  geo.setAttribute('color', new Float32BufferAttribute(colors, 3));

  const mat = new MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    side: DoubleSide,
    depthWrite: false,
    depthTest: true,
  });
  const mesh = new Mesh(geo, mat);
  mesh.renderOrder = 10;
  mesh.frustumCulled = false;
  group.add(mesh);

  let normalized = 0.5;
  let worldPosition = (min[spec.normalAxis] + max[spec.normalAxis]) / 2;

  const tmp = new Vector3();

  function sampleContour() {
    const posAttr = geo.attributes.position as Float32BufferAttribute;
    const colAttr = geo.attributes.color as Float32BufferAttribute;
    // r187 WebGL 后端可能把大 attribute 转 PBO 并替换 array，每帧取当前引用
    const colors = colAttr.array as Float32Array;
    mesh.updateWorldMatrix(true, false);
    for (let i = 0; i < posAttr.count; i++) {
      tmp.fromBufferAttribute(posAttr, i).applyMatrix4(mesh.matrixWorld);
      // 法线轴坐标固定为当前平面位置，切向由顶点世界坐标给出
      const x = spec.normalAxis === 0 ? worldPosition : tmp.x;
      const y = spec.normalAxis === 1 ? worldPosition : tmp.y;
      const z = spec.normalAxis === 2 ? worldPosition : tmp.z;
      const speed = sampleSpeed(grid, x, y, z, scratch);
      if (Number.isNaN(speed)) {
        colors[i * 3] = 0.02;
        colors[i * 3 + 1] = 0.02;
        colors[i * 3 + 2] = 0.05;
      } else {
        const t = Math.min(1, speed / (grid.maxSpeed || 1));
        const [r, g, b] = speedColor(t);
        colors[i * 3] = r;
        colors[i * 3 + 1] = g;
        colors[i * 3 + 2] = b;
      }
    }
    colAttr.needsUpdate = true;
  }

  sampleContour();

  return {
    id: spec.id,
    group,
    mesh,
    get worldPosition() {
      return worldPosition;
    },
    setEnabled: (on) => {
      group.visible = on;
    },
    setNormalized: (t: number) => {
      normalized = Math.min(1, Math.max(0, t));
      worldPosition = min[spec.normalAxis] + normalized * (max[spec.normalAxis] - min[spec.normalAxis]);
      group.position.setComponent(spec.normalAxis, worldPosition);
      sampleContour();
    },
    getNormalized: () => normalized,
    worldToNormalized: (w: number) =>
      (w - min[spec.normalAxis]) / (max[spec.normalAxis] - min[spec.normalAxis]),
    refresh: sampleContour,
    dispose: () => {
      geo.dispose();
      mat.dispose();
    },
  };
}
