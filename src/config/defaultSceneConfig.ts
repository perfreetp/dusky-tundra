/**
 * 内置参数化默认井道场景。
 * 12 层站、1:1 曳引、8 根曳引绳 + 1 根限速器闭合绳环。
 * 坐标：米，Y 向上，原点底坑中心。
 */
import type {
  FloorState,
  RopeDefinition,
  RopeStation,
  SceneConfig,
  Vec3,
} from '../core/model/types';
import { buildAllFloorStates, type FloorDefinition } from '../core/model/floorModel';

export const DEFAULT_FLOOR_COUNT = 12;
export const DEFAULT_TRACTION_ROPE_COUNT = 8;

export function createDefaultSceneConfig(): SceneConfig {
  return {
    version: 1,
    units: 'meter',
    upAxis: 'Y',
    hoistway: {
      pitDepth: 1.4,
      headroomHeight: 4.2,
      travel: 33.0,
      width: 2.6,
      depth: 2.4,
    },
    car: {
      hangerOffset: [-0.55, 0, 0],
      height: 2.4,
      halfExtents: [0.9, 1.2, 0.85],
    },
    counterweight: {
      hangerOffset: [0.85, 0, 0],
      height: 2.6,
      halfExtents: [0.25, 1.3, 0.7],
      motionRatio: 1,
    },
    sheaves: [
      {
        id: 'tractionMain',
        kind: 'traction',
        center: [0, 37.2, 0],
        axis: [0, 0, 1],
        pitchRadius: 0.32,
        grooveCount: DEFAULT_TRACTION_ROPE_COUNT,
        groovePitch: 0.016,
        firstGrooveOffset: -0.056,
        wrapSign: 1,
      },
      {
        id: 'governorTop',
        kind: 'governor',
        center: [1.05, 37.0, 0.95],
        axis: [0, 0, 1],
        pitchRadius: 0.16,
        grooveCount: 1,
        groovePitch: 0,
        firstGrooveOffset: 0,
        wrapSign: 1,
      },
      {
        id: 'governorTension',
        kind: 'tension',
        center: [1.05, 1.2, 0.95],
        axis: [0, 0, 1],
        pitchRadius: 0.14,
        grooveCount: 1,
        groovePitch: 0,
        firstGrooveOffset: 0,
        wrapSign: 1,
      },
    ],
    anchors: [
      { id: 'carTop', follower: 'car', position: [-0.55, 0, 0] },
      { id: 'cwTop', follower: 'counterweight', position: [0.85, 0, 0] },
      {
        id: 'governorCarArm',
        follower: 'car',
        position: [-0.55, 0, 0.95],
      },
      {
        id: 'governorFixed',
        position: [1.05, 35.6, 0.95],
      },
    ],
    rails: [
      { id: 'railLeft', base: [-0.95, 0, 0], height: 38.6, halfWidth: 0.045 },
      { id: 'railRight', base: [0.95, 0, 0], height: 38.6, halfWidth: 0.045 },
    ],
  };
}

/** 曳引绳定义：carTop 锚点 → 曳引轮槽 → 对重 */
export function createTractionRopes(scene: SceneConfig): RopeDefinition[] {
  const sheave = scene.sheaves.find((s) => s.id === 'tractionMain')!;
  const ropes: RopeDefinition[] = [];
  for (let g = 0; g < sheave.grooveCount; g++) {
    const stations: RopeStation[] = [
      { type: 'anchor', anchorId: 'carTop' },
      { type: 'sheave', sheaveId: 'tractionMain', grooveIndex: g },
      { type: 'span', toFollower: 'counterweight' },
    ];
    const phase = (g / sheave.grooveCount) * Math.PI * 2;
    ropes.push({
      id: `traction-${String(g).padStart(2, '0')}`,
      kind: 'traction',
      radius: 0.006,
      linearDensity: 0.34,
      stations,
      swing: {
        baseAmplitude: 0.035,
        damping: 0.15,
        phase,
        lateralDir: [0, 0, 1],
      },
    });
  }
  return ropes;
}

/** 限速器绳：闭合环路，经顶轮与底坑张紧轮，一侧随轿厢夹持臂 */
export function createGovernorRope(): RopeDefinition {
  const stations: RopeStation[] = [
    { type: 'anchor', anchorId: 'governorCarArm' },
    { type: 'span', toAnchorId: 'governorFixed' },
    { type: 'sheave', sheaveId: 'governorTop', grooveIndex: 0, wrap: 'full' },
    { type: 'span', toFollower: 'tensionSheave' },
    { type: 'sheave', sheaveId: 'governorTension', grooveIndex: 0, wrap: 'full' },
    { type: 'span', toFollower: 'car' },
  ];
  return {
    id: 'governor-loop',
    kind: 'governor',
    radius: 0.004,
    linearDensity: 0.1,
    stations,
    swing: {
      baseAmplitude: 0.02,
      damping: 0.2,
      phase: 0.7,
      lateralDir: [1, 0, 0],
    },
  };
}

export function createDefaultRopes(scene: SceneConfig): RopeDefinition[] {
  return [...createTractionRopes(scene), createGovernorRope()];
}

export function createDefaultFloorDefs(): FloorDefinition[] {
  const defs: FloorDefinition[] = [];
  for (let i = 0; i < DEFAULT_FLOOR_COUNT; i++) {
    defs.push({
      floorId: `F${i + 1}`,
      label: `${i + 1} 层`,
      position: i / (DEFAULT_FLOOR_COUNT - 1),
      speed: i === 0 ? 0 : 2.0,
      acceleration: 0.6,
      loadCoeff: 0.5,
    });
  }
  return defs;
}

export function createDefaultFloors(scene: SceneConfig): FloorState[] {
  return buildAllFloorStates(scene, createDefaultFloorDefs());
}

/** 限速器闭合环路总长度（米，配置常量） */
export const GOVERNOR_LOOP_LENGTH = 74.0;

/** 默认楼层表的循环播放行程方向 */
export function defaultLateral(): Vec3 {
  return [0, 0, 1];
}
