export interface Speaker {
  id: string;
  name: string;
  /** 安装位置（世界坐标，y 即安装高度） */
  x: number;
  y: number;
  z: number;
  /** 方位角（度），0 = 朝 -Z，顺时针（从上方看）为正 */
  yaw: number;
  /** 俯角（度），0 = 水平，正值向下 */
  tilt: number;
  /** 指向锥半角（度），覆盖全角 = 2 * halfAngle，锥边定义为 -6 dB */
  halfAngle: number;
  /** 额定声压级 dB SPL（1m 轴上） */
  spl: number;
  /** 覆盖距离 m（同时决定指向锥可视化长度与距离滚降起点） */
  range: number;
}

export interface SamplePoint {
  x: number;
  y: number;
  z: number;
  /** 表面法线 */
  nx: number;
  ny: number;
  nz: number;
}

export interface GridConfig {
  /** 密度档位 */
  density: 'low' | 'medium' | 'high';
  /** 空气吸收开关（简化 ISO 9613） */
  airAbsorption: boolean;
  /** 绝对声压分级上阈值（dB），长度 5，配合最低档形成 6 级色带 */
  thresholds: [number, number, number, number, number];
}

export type DisplayMode = 'absolute' | 'isolate' | 'diff';
export type SchemeView = 'B' | 'A' | 'diff';

export interface Snapshot {
  speakers: Speaker[];
  /** 每采样点总 SPL，长度 = 采样点数 */
  total: Float32Array;
  pointCount: number;
  speakerCount: number;
  createdAt: number;
}

export interface HoverInfo {
  index: number;
  clientX: number;
  clientY: number;
}
