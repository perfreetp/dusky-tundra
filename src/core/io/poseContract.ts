/**
 * 姿态 JSON 数据契约、最小 schema 校验与版本迁移。
 */
import type {
  FloorState,
  RopeDefinition,
  RopePose,
  RuntimeSettings,
  SceneConfig,
} from '../model/types';

export const POSE_CONTRACT = 'elevator-rope-pose';
export const CONTRACT_VERSION = 1;

export interface EmbeddedPose {
  nodeCount: number;
  positions: number[];
  tangents: number[];
  arcFlags: number[];
  spanIds: number[];
  clearances: number[];
  tension: number[];
}

export interface PoseDocument {
  contract: typeof POSE_CONTRACT;
  version: number;
  exportedAt: string;
  units: 'meter';
  scene: SceneConfig;
  ropes: RopeDefinition[];
  floors: FloorState[];
  runtime: RuntimeSettings;
  loopLengths?: Record<string, number>;
  embeddedPoses?: Record<string, EmbeddedPose>;
}

export class ContractError extends Error {}

/** 最小结构校验（深度校验交给表单/导入流程，这里保证求解器所需字段存在） */
export function validateDocument(doc: unknown): PoseDocument {
  if (typeof doc !== 'object' || doc === null) throw new ContractError('文档不是对象');
  const d = doc as Record<string, unknown>;
  if (d.contract !== POSE_CONTRACT) {
    throw new ContractError(`contract 字段不匹配: ${String(d.contract)}`);
  }
  if (typeof d.version !== 'number') throw new ContractError('缺少 version');
  for (const key of ['scene', 'ropes', 'floors', 'runtime'] as const) {
    if (d[key] === undefined) throw new ContractError(`缺少字段: ${key}`);
  }
  const scene = d.scene as SceneConfig;
  if (!scene.hoistway || !Array.isArray(scene.sheaves) || !Array.isArray(scene.anchors)) {
    throw new ContractError('scene 结构不完整');
  }
  const ropes = d.ropes as RopeDefinition[];
  if (!Array.isArray(ropes) || ropes.length === 0) throw new ContractError('ropes 为空');
  for (const r of ropes) {
    if (!r.id || !Array.isArray(r.stations)) throw new ContractError(`绳定义不完整: ${r.id}`);
  }
  return migrate(doc as PoseDocument);
}

/** 版本迁移（当前只有 v1，预留升级路径） */
function migrate(doc: PoseDocument): PoseDocument {
  if (doc.version > CONTRACT_VERSION) {
    throw new ContractError(`文件版本 ${doc.version} 高于支持版本 ${CONTRACT_VERSION}`);
  }
  return doc;
}

export function poseToEmbedded(pose: RopePose): EmbeddedPose {
  const n = pose.nodeCount;
  return {
    nodeCount: n,
    positions: Array.from(pose.positions.subarray(0, n * 3)),
    tangents: Array.from(pose.tangents.subarray(0, n * 3)),
    arcFlags: Array.from(pose.arcFlags.subarray(0, n)),
    spanIds: Array.from(pose.spanIds.subarray(0, n)),
    clearances: Array.from(pose.clearances.subarray(0, n)),
    tension: Array.from(pose.tension.subarray(0, n)),
  };
}
