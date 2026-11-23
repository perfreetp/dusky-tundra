/**
 * 用户导入数据的 JSON 格式定义。
 *
 * 两类数据：
 *  1. 车身表面压力（三角网格 + 每顶点压力系数 Cp + 分区升阻力系数）
 *  2. 空间速度场（规则网格体素，每体素 vec3 速度，可选标量）
 *
 * 大体量数组支持两种承载方式：
 *  - 普通 number[]（小数据、可读性好）
 *  - base64 + 显式 dtype（十万级体素的标准方式，体积约为 JSON 数字数组的 1/4）
 */

export type TypedArray1D =
  | number[]
  | { encoding: 'base64'; dtype: 'float32' | 'uint32' | 'uint16'; count: number; data: string };

export interface DatasetMeta {
  name: string;
  /** 自由来流，单位 m/s；direction 为单位向量 */
  freeStream?: { speed: number; direction: [number, number, number] };
  /** 参考动压 / 面积等仿真备注，仅展示用 */
  notes?: string;
  createdAt?: string;
}

export interface MeshRegion {
  id: string;
  name: string;
  /** 对应 BufferGeometry group 的三角形起始与数量（mergeGeometries(useGroups) 约定） */
  triangleStart: number;
  triangleCount: number;
}

export interface SurfacePressureDataset {
  format: 'aero-surface-pressure';
  version: 1;
  meta: DatasetMeta;
  geometry: {
    /** 扁平 xyz，长度 vertexCount*3 */
    positions: TypedArray1D;
    /** 三角索引，长度 triangleCount*3；缺失时按非索引网格解释 */
    indices?: TypedArray1D;
    regions?: MeshRegion[];
  };
  pressure: {
    /** 每顶点压力系数 Cp，长度 vertexCount */
    values: TypedArray1D;
    min?: number;
    max?: number;
  };
  /** 各气动区域的升阻力系数读数（cl 负值表示下压力） */
  coefficients?: Record<string, { cl: number; cd: number; area?: number }>;
}

export interface VelocityVolumeDataset {
  format: 'aero-velocity-volume';
  version: 1;
  meta: DatasetMeta;
  grid: {
    size: [number, number, number];
    origin: [number, number, number];
    /** 三轴体素间距 */
    spacing: [number, number, number];
  };
  velocity: {
    /** 扁平 vec3，长度 nx*ny*nz*3，索引顺序 x 最快、z 最慢 */
    values: TypedArray1D;
    /** 归一化用的速度上限；缺失时按数据最大模长计算 */
    maxSpeed?: number;
  };
  /** 可选每体素标量（如静压），长度 nx*ny*nz */
  scalar?: { name: string; values: TypedArray1D } | undefined;
}

export type AnyAeroDataset = SurfacePressureDataset | VelocityVolumeDataset;

export function isSurfaceDataset(d: AnyAeroDataset): d is SurfacePressureDataset {
  return d.format === 'aero-surface-pressure';
}

export function isVolumeDataset(d: AnyAeroDataset): d is VelocityVolumeDataset {
  return d.format === 'aero-velocity-volume';
}
