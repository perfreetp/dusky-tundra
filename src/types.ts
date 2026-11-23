// 全局领域类型定义 —— 月季花期可视化工具

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** 生长曲线控制点：以积温 GDD 为横轴、开放度 (0~1) 为纵轴 */
export interface CurvePoint {
  gdd: number;
  open: number;
}

/** 花瓣参数化曲面控制点（弯曲 / 卷边均为 v∈[0,1] 上的四点样条） */
export interface PetalParams {
  /** 花瓣层数，5~9 */
  layers: number;
  /** 每层花瓣数量基数（实际数量随层递增） */
  petalsPerLayer: number;
  /** 花瓣长度（世界单位，相对茎高） */
  length: number;
  /** 花瓣最大宽度 */
  width: number;
  /** 纵向弯曲控制点 4 个，负值向内抱合、正值向外舒展 */
  bend: [number, number, number, number];
  /** 边缘卷边控制点 4 个，正值边缘外翻卷起 */
  curl: [number, number, number, number];
  /** 曲面细分（沿宽度 × 沿长度） */
  segU: number;
  segV: number;
}

/** 花青素着色：开放度 0=深红(花苞) → 开放度 1=浅粉(盛开) */
export interface AnthocyaninGradient {
  deep: Vec3;
  pale: Vec3;
}

/** 花型品种定义 */
export interface Variety {
  id: string;
  name: string;
  petal: PetalParams;
  curve: CurvePoint[];
  color: AnthocyaninGradient;
}

/** 一支带积温偏移的花枝（偏移量决定该支当前开放度） */
export interface Branch {
  id: number;
  /** 地面位置 */
  position: Vec3;
  /** 统一缩放 */
  scale: number;
  /** 绕 Y 轴朝向（弧度） */
  yaw: number;
  /** 积温偏移：该支实际积温 = 全局 gdd - gddOffset */
  gddOffset: number;
  /** 茎秆造型变体 0~3 */
  variant: number;
}

/** 积温页设置 */
export interface GddConfig {
  /** 日平均温 ℃ */
  dailyAvgTemp: number;
  /** 生物学零度（基点温度）℃ */
  baseTemp: number;
  /** 累积天数 */
  days: number;
}

/** 采收窗口（开放度阈值，反推所需积温区间） */
export interface HarvestWindow {
  openMin: number;
  openMax: number;
}

/** JSON 导出/导入的完整方案 */
export interface SchemeFile {
  format: 'rose-bloom-scheme';
  version: 1;
  exportedAt: string;
  gdd: GddConfig;
  harvest: HarvestWindow;
  varieties: Variety[];
  activeVarietyId: string;
  branches: Branch[];
  timelineGdd: number;
}

/** 开放度分档（驱动不同 LOD 曲面） */
export const LOD_TIERS = 8;

/** 展开角：花苞 15° → 盛开 120°（参数化语义；几何映射在 growth.ts 中转换为倾斜+反卷） */
export const BUD_ANGLE_DEG = 15;
export const BLOOM_ANGLE_DEG = 120;

/** 几何倾斜角范围：花苞近直立 15° → 盛开 82°（不到水平，靠瓣尖反卷表现完全开放） */
export const BUD_TILT_DEG = 15;
export const BLOOM_TILT_DEG = 82;

/** 花径放大倍数（花苞 → 盛开） */
export const BUD_DIAMETER_SCALE = 0.38;
