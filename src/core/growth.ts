import {
  BUD_ANGLE_DEG,
  BLOOM_ANGLE_DEG,
  BUD_TILT_DEG,
  BLOOM_TILT_DEG,
  BUD_DIAMETER_SCALE,
  type AnthocyaninGradient,
  type PetalParams,
  type Vec3
} from '../types';
import { clamp, deg2rad, lerp, smoothstep, anthocyaninMix } from './mathUtils';
import type { CorollaLayout } from './petal';

export interface PetalInstance {
  /** 实例在世界中的位置（相对花朵基部，未含花枝根变换） */
  position: Vec3;
  /** 欧拉旋转（弧度），顺序 YXZ */
  rotation: Vec3;
  scale: Vec3;
  color: Vec3;
}

export interface SepalInstance {
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
}

export interface BloomState {
  /** 展开角（弧度），15°→120° */
  unfoldAngle: number;
  /** 花径缩放 */
  diameterScale: number;
  /** 花青素颜色（线性 0~1） */
  color: Vec3;
  petals: PetalInstance[];
  sepals: SepalInstance[];
}

/**
 * 按开放度 openness∈[0,1] 计算整朵花的实例变换。
 * 生长曲线改动后只需以新 openness 重新调用本函数 —— 所有花枝形变即按新曲线重算。
 */
export function computeBloomState(
  layout: CorollaLayout,
  params: PetalParams,
  gradient: AnthocyaninGradient,
  openness: number
): BloomState {
  const o = clamp(openness, 0, 1);
  const ease = smoothstep(o);

  // 展开角（语义量）：15°（花苞近直立）→ 120°（盛开），由生长曲线开放度驱动；
  // 实际几何倾斜在花瓣实例中映射为 15°→82° 并配合瓣尖反卷，避免出现水平平盘
  const unfoldDeg = lerp(BUD_ANGLE_DEG, BLOOM_ANGLE_DEG, ease);
  const unfoldAngle = deg2rad(unfoldDeg);

  // 花径同步放大：花苞 0.38 → 盛开 1.0
  const diameterScale = lerp(BUD_DIAMETER_SCALE, 1, ease);

  // 花青素：深红 → 浅粉
  const color = anthocyaninMix(gradient.deep, gradient.pale, o);

  const petals: PetalInstance[] = [];
  for (let L = 0; L < layout.layers.length; L++) {
    const layer = layout.layers[L];
    const layerT = layout.layers.length === 1 ? 0 : L / (layout.layers.length - 1);
    for (let i = 0; i < layer.count; i++) {
      const az = layer.azimuths[i];
      // 内层展开略滞后、外层先行，形成由外向内的开放次序
      const layerDelay = layerT * 0.18;
      const localO = clamp((o - layerDelay) / (1 - layerDelay), 0, 1);
      // 缓出曲线：中段保持约 45° 杯状，末段才快速张开到 98°，避免平盘
      const tiltEase = localO * localO * (3 - 2 * localO) ** 0.55;
      const tiltDeg =
        lerp(BUD_TILT_DEG, BLOOM_TILT_DEG, tiltEase) + layer.tiltBias * (1 - tiltEase);
      const tilt = deg2rad(tiltDeg);

      // 花瓣基部所在半径：随开放度外移，构成花径放大；层间梯度让外层更舒展
      const ringRadius =
        params.width * 0.16 * diameterScale * (0.25 + layerT * 1.05) * (0.6 + 0.4 * ease);
      const size = layer.sizeScale * lerp(0.82, 1, ease) * diameterScale;

      petals.push({
        position: {
          x: Math.sin(az) * ringRadius,
          y: layer.height * (1 - ease * 0.6),
          z: Math.cos(az) * ringRadius
        },
        // 先绕 Y 方位角，再绕局部 X 倾展开角
        rotation: { x: tilt, y: az, z: 0 },
        scale: { x: size, y: size, z: size },
        color
      });
    }
  }

  // 萼片：花苞时向上托住花瓣（15°），随展开逐渐外翻至水平以下（110°）
  const sepals: SepalInstance[] = [];
  const sepalTilt = deg2rad(lerp(15, 110, ease));
  for (let i = 0; i < layout.sepalCount; i++) {
    const az = layout.sepalAzimuths[i];
    sepals.push({
      position: { x: 0, y: -params.length * 0.04, z: 0 },
      rotation: { x: sepalTilt, y: az, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    });
  }

  return { unfoldAngle, diameterScale, color, petals, sepals };
}

/** 萼片简易几何参数（复用花瓣曲面生成器，单独一套参数） */
export const SEPAL_PARAMS: PetalParams = {
  layers: 1,
  petalsPerLayer: 5,
  length: 0.34,
  width: 0.16,
  bend: [0, -0.05, -0.15, -0.3],
  curl: [0, 0, 0.02, 0.05],
  segU: 6,
  segV: 8
};
