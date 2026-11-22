import * as THREE from 'three';

/**
 * 参数化赛车车身 + UV 展开图集。
 *
 * 车身由解析曲面定义(沿 X 轴放样的变截面环),因此 UV 展开是精确的:
 *   u = 沿车长参数(0=车尾, 1=车头),v = 环绕截面参数(0 在底部中线)。
 * 环向唯一的切口位于车底中线(视觉上不可见),贴花在图集内沿 v 方向
 * 做环绕重复绘制,接缝处连续不错位。
 */

export interface AtlasRegion {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  label: string;
}

export const ATLAS: Record<string, AtlasRegion> = {
  body: { x0: 0.02, y0: 0.22, x1: 0.7, y1: 0.98, label: '车身' },
  rearWing: { x0: 0.73, y0: 0.58, x1: 0.98, y1: 0.7, label: '尾翼主翼面' },
  endplateL: { x0: 0.73, y0: 0.73, x1: 0.85, y1: 0.98, label: '尾翼端板 L' },
  endplateR: { x0: 0.86, y0: 0.73, x1: 0.98, y1: 0.98, label: '尾翼端板 R' },
  frontWing: { x0: 0.73, y0: 0.44, x1: 0.98, y1: 0.55, label: '前翼' },
};

/** 导入自定义车身时使用的整幅图集区域 */
export const CUSTOM_REGION: AtlasRegion = { x0: 0.02, y0: 0.02, x1: 0.98, y1: 0.98, label: '导入车身(柱面展开)' };

export type PanelId = 'body' | 'rearWing' | 'endplateL' | 'endplateR' | 'frontWing' | 'custom';

const clamp01 = (x: number): number => Math.min(1, Math.max(0, x));
const smoothstep = (a: number, b: number, x: number): number => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const bump = (x: number, c: number, s: number): number => Math.exp(-(((x - c) / s) ** 2));

export const BODY = { halfLength: 2.6 };

export function halfWidth(u: number): number {
  const base = 0.95 * Math.pow(Math.sin(Math.PI * clamp01(u * 1.03)), 0.8);
  return 0.055 + base * (1 - 0.62 * smoothstep(0.6, 1, u));
}
export function centerY(u: number): number {
  return 0.34 - 0.05 * u + 0.04 * bump(u, 0.45, 0.3);
}
export function heightTop(u: number): number {
  return 0.16 + 0.34 * bump(u, 0.42, 0.22) + 0.1 * bump(u, 0.75, 0.12) + 0.06 * bump(u, 0.1, 0.15);
}
export function heightBot(u: number): number {
  return 0.2 + 0.04 * bump(u, 0.3, 0.3);
}

/** 车身参数曲面:u 沿车长,v 环绕截面(v=0 在底部中线) */
export function bodyPoint(u: number, v: number, out = new THREE.Vector3()): THREE.Vector3 {
  const a = -Math.PI / 2 + v * Math.PI * 2;
  const s = Math.sin(a);
  const x = -BODY.halfLength + u * BODY.halfLength * 2;
  const y = centerY(u) + (s >= 0 ? heightTop(u) : heightBot(u)) * s;
  const z = halfWidth(u) * Math.cos(a);
  return out.set(x, y, z);
}

export function rearWingPoint(u: number, v: number, out = new THREE.Vector3()): THREE.Vector3 {
  return out.set(
    -2.12 - u * 0.5,
    0.98 + 0.05 * Math.sin(v * Math.PI) + 0.05 * Math.sin(u * Math.PI),
    -0.95 + v * 1.9,
  );
}

export function endplatePoint(side: 1 | -1): (u: number, v: number, out?: THREE.Vector3) => THREE.Vector3 {
  return (u, v, out = new THREE.Vector3()) => out.set(-2.1 - u * 0.56, 0.8 + v * 0.44, side * 0.95);
}

export function frontWingPoint(u: number, v: number, out = new THREE.Vector3()): THREE.Vector3 {
  return out.set(2.28 + u * 0.46, 0.13 + 0.02 * Math.sin(v * Math.PI), -0.9 + v * 1.8);
}

export function surfacePoint(panel: PanelId, u: number, v: number, out = new THREE.Vector3()): THREE.Vector3 {
  switch (panel) {
    case 'body':
      return bodyPoint(u, v, out);
    case 'rearWing':
      return rearWingPoint(u, v, out);
    case 'endplateL':
      return endplatePoint(-1)(u, v, out);
    case 'endplateR':
      return endplatePoint(1)(u, v, out);
    case 'frontWing':
      return frontWingPoint(u, v, out);
    default:
      return out.set(0, 0, 0);
  }
}

/** 数值雅可比:∂S/∂u 与 ∂S/∂v(中心差分),用于贴花的曲率拉伸补偿 */
export function surfaceJacobian(panel: PanelId, u: number, v: number): { su: THREE.Vector3; sv: THREE.Vector3 } {
  const e = 1e-3;
  const um = clamp01(u - e);
  const up = clamp01(u + e);
  const vm = clamp01(v - e);
  const vp = clamp01(v + e);
  const su = surfacePoint(panel, up, v, new THREE.Vector3())
    .sub(surfacePoint(panel, um, v, new THREE.Vector3()))
    .divideScalar(Math.max(up - um, 1e-6));
  const sv = surfacePoint(panel, u, vp, new THREE.Vector3())
    .sub(surfacePoint(panel, u, vm, new THREE.Vector3()))
    .divideScalar(Math.max(vp - vm, 1e-6));
  return { su, sv };
}

/** 图集坐标 -> (面板, 面板参数) */
export function atlasToPanel(
  ax: number,
  ay: number,
  custom = false,
): { panel: PanelId; u: number; v: number; region: AtlasRegion } | null {
  if (custom) {
    const r = CUSTOM_REGION;
    if (ax >= r.x0 && ax <= r.x1 && ay >= r.y0 && ay <= r.y1) {
      return { panel: 'custom', u: (ax - r.x0) / (r.x1 - r.x0), v: (ay - r.y0) / (r.y1 - r.y0), region: r };
    }
    return null;
  }
  for (const [id, r] of Object.entries(ATLAS)) {
    if (ax >= r.x0 && ax <= r.x1 && ay >= r.y0 && ay <= r.y1) {
      return { panel: id as PanelId, u: (ax - r.x0) / (r.x1 - r.x0), v: (ay - r.y0) / (r.y1 - r.y0), region: r };
    }
  }
  return null;
}

/** 三档细分密度(车身网格 nu×nt,wing 为翼面密度倍率) */
export interface LevelDef {
  nu: number;
  nt: number;
  wing: number;
  texSize: number;
}
export const LEVELS: LevelDef[] = [
  { nu: 96, nt: 48, wing: 1, texSize: 1024 },
  { nu: 192, nt: 96, wing: 2, texSize: 2048 },
  { nu: 420, nt: 300, wing: 4, texSize: 4096 },
];

export interface BuiltGeometry {
  geometry: THREE.BufferGeometry;
  triangles: number;
}

/** 按细分档位重建车身+翼面几何体,UV 同步重算 */
export function buildCarGeometry(level: number): BuiltGeometry {
  const { nu, nt, wing } = LEVELS[level];
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const p = new THREE.Vector3();

  function grid(
    region: AtlasRegion,
    nU: number,
    nV: number,
    fn: (u: number, v: number, out: THREE.Vector3) => THREE.Vector3,
  ): number {
    const base = positions.length / 3;
    for (let i = 0; i <= nU; i++) {
      for (let j = 0; j <= nV; j++) {
        const u = i / nU;
        const v = j / nV;
        fn(u, v, p);
        positions.push(p.x, p.y, p.z);
        uvs.push(region.x0 + u * (region.x1 - region.x0), region.y0 + v * (region.y1 - region.y0));
      }
    }
    for (let i = 0; i < nU; i++) {
      for (let j = 0; j < nV; j++) {
        const a = base + i * (nV + 1) + j;
        const b = a + nV + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    return base;
  }

  // 车身(环向闭合,v=0 与 v=1 顶点位置相同、UV 不同,切口在车底中线)
  const bodyBase = grid(ATLAS.body, nu, nt, bodyPoint);
  // 首尾端盖(扇形),UV 贴在车身区域左右边缘
  for (const end of [0, 1] as const) {
    const u = end === 0 ? 0 : 1;
    const centerIdx = positions.length / 3;
    bodyPoint(u, 0.5, p);
    p.z = 0;
    positions.push(p.x, p.y, 0);
    uvs.push(end === 0 ? ATLAS.body.x0 : ATLAS.body.x1, (ATLAS.body.y0 + ATLAS.body.y1) / 2);
    const ring = bodyBase + (end === 0 ? 0 : nu * (nt + 1));
    for (let j = 0; j < nt; j++) {
      if (end === 0) indices.push(centerIdx, ring + j, ring + j + 1);
      else indices.push(centerIdx, ring + j + 1, ring + j);
    }
  }

  // 尾翼主翼面 / 左右端板 / 前翼
  grid(ATLAS.rearWing, 6 * wing, 24 * wing, rearWingPoint);
  grid(ATLAS.endplateL, 4 * wing, 8 * wing, endplatePoint(-1));
  grid(ATLAS.endplateR, 4 * wing, 8 * wing, endplatePoint(1));
  grid(ATLAS.frontWing, 4 * wing, 20 * wing, frontWingPoint);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return { geometry, triangles: indices.length / 3 };
}

/** 为导入的车身几何体生成柱面 UV 展开(绕 X 轴) */
export function applyCylindricalUV(geometry: THREE.BufferGeometry, region = CUSTOM_REGION): void {
  geometry.computeBoundingBox();
  const bb = geometry.boundingBox!;
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  const uv = new Float32Array(pos.count * 2);
  const cy = (bb.min.y + bb.max.y) / 2;
  const len = Math.max(bb.max.x - bb.min.x, 1e-6);
  for (let i = 0; i < pos.count; i++) {
    const u = (pos.getX(i) - bb.min.x) / len;
    const v = (Math.atan2(pos.getZ(i), pos.getY(i) - cy) + Math.PI) / (2 * Math.PI);
    uv[i * 2] = region.x0 + u * (region.x1 - region.x0);
    uv[i * 2 + 1] = region.y0 + v * (region.y1 - region.y0);
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}
