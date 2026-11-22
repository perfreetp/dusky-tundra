export type DecalType = 'text' | 'rect' | 'circle' | 'triangle' | 'star' | 'stripe';

export interface Decal {
  id: string;
  type: DecalType;
  text: string;
  font: string;
  color: string;
  /** 图集坐标 0..1(y 向下,与 canvas 一致) */
  x: number;
  y: number;
  /** 贴花在车身表面上的目标尺寸(米),回贴时按曲率补偿换算到 UV 空间 */
  size: number;
  /** 旋转角度(度) */
  rotation: number;
}

export interface PaintLayer {
  roughness: number;
  metalness: number;
  intensity: number;
}

export interface MaterialState {
  baseColor: string;
  /** 底色层 */
  base: PaintLayer;
  /** 金属漆层(片状颗粒) */
  flake: PaintLayer;
  /** 清漆层 */
  coat: PaintLayer;
  envIntensity: number;
}

export interface ProjectState {
  version: 1;
  name: string;
  decals: Decal[];
  materials: MaterialState;
  subdivision: number;
}

export const DEFAULT_MATERIALS: MaterialState = {
  baseColor: '#c8102e',
  base: { roughness: 0.35, metalness: 0.15, intensity: 1 },
  flake: { roughness: 0.45, metalness: 0.9, intensity: 0.6 },
  coat: { roughness: 0.08, metalness: 0.6, intensity: 1 },
  envIntensity: 1.1,
};

export const DECAL_TYPE_NAMES: Record<DecalType, string> = {
  text: '文字',
  rect: '矩形',
  circle: '圆形',
  triangle: '三角',
  star: '星形',
  stripe: '条纹',
};

let uid = 0;
export function createDecal(type: DecalType): Decal {
  uid += 1;
  return {
    id: `d${Date.now().toString(36)}_${uid}`,
    type,
    text: type === 'text' ? 'RACING' : '',
    font: 'Arial, sans-serif',
    color: '#ffffff',
    x: 0.18 + Math.random() * 0.36,
    y: 0.34 + Math.random() * 0.44,
    size: type === 'text' ? 0.8 : 0.5,
    rotation: 0,
  };
}
