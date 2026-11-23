export type AttachTarget = 'car' | 'shaft';

export interface AnnotationData {
  id: string;
  kind: 'fault';
  /** 楼层(随轿厢联动时会动态重算) */
  floor: number;
  /** 部件名 */
  partName: string;
  /** 备注 */
  note: string;
  /** 依附对象:轿厢(随轿厢移动)或井道(固定) */
  attachedTo: AttachTarget;
  /** 相对依附父节点的局部坐标 */
  localPosition: [number, number, number];
  createdAt: number;
}

export interface PersonData {
  id: string;
  kind: 'person';
  floor: number;
  label: string;
  attachedTo: 'car';
  localPosition: [number, number, number];
  /** 朝向角(弧度,绕Y轴) */
  heading: number;
  createdAt: number;
}

export interface PersistedState {
  carFloor: number;
  carTransparent: boolean;
  clipOn: boolean;
  shaftModelName: string | null;
  carModelName: string | null;
  annotations: AnnotationData[];
  persons: PersonData[];
}

export interface ExportFile {
  type: 'elevator-rescue-locate';
  version: 1;
  exportedAt: string;
  carFloor: number;
  floorCount: number;
  floorHeight: number;
  annotations: Array<AnnotationData & { worldPosition: [number, number, number] }>;
  persons: Array<PersonData & { worldPosition: [number, number, number] }>;
}

export type InteractionMode = 'navigate' | 'annotate' | 'person';
