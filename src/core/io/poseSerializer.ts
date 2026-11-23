/**
 * PoseDocument 序列化/反序列化与文件下载。
 */
import type {
  FloorState,
  RopeDefinition,
  RopePose,
  RuntimeSettings,
  SceneConfig,
} from '../model/types';
import {
  CONTRACT_VERSION,
  POSE_CONTRACT,
  poseToEmbedded,
  validateDocument,
  type EmbeddedPose,
  type PoseDocument,
} from './poseContract';

export interface BuildDocumentOptions {
  scene: SceneConfig;
  ropes: RopeDefinition[];
  floors: FloorState[];
  runtime: RuntimeSettings;
  loopLengths?: Record<string, number>;
  /** 传入则嵌入当前姿态（像素级复现）；否则只导出参数由求解器复算 */
  poses?: Map<string, RopePose>;
}

export function buildDocument(opts: BuildDocumentOptions): PoseDocument {
  const doc: PoseDocument = {
    contract: POSE_CONTRACT,
    version: CONTRACT_VERSION,
    exportedAt: new Date().toISOString(),
    units: 'meter',
    scene: opts.scene,
    ropes: opts.ropes,
    floors: opts.floors,
    runtime: opts.runtime,
    loopLengths: opts.loopLengths,
  };
  if (opts.poses && opts.poses.size > 0) {
    const embedded: Record<string, EmbeddedPose> = {};
    for (const [id, pose] of opts.poses) {
      embedded[pose.cacheKey || id] = poseToEmbedded(pose);
    }
    doc.embeddedPoses = embedded;
  }
  return doc;
}

export function serializeDocument(doc: PoseDocument): string {
  return JSON.stringify(doc, null, 2);
}

export function parseDocument(text: string): PoseDocument {
  return validateDocument(JSON.parse(text));
}

/** 浏览器端触发下载 */
export function downloadJson(doc: PoseDocument, filename: string): void {
  const blob = new Blob([serializeDocument(doc)], { type: 'application/json' });
  triggerDownload(URL.createObjectURL(blob), filename);
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  triggerDownload(dataUrl, filename);
}

function triggerDownload(href: string, filename: string): void {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  if (href.startsWith('blob:')) setTimeout(() => URL.revokeObjectURL(href), 1000);
}
