// @ts-nocheck: three.js TSL 链式节点的 @types 覆盖不完整，运行时 API 已按 r187 验证
/**
 * 车身网格构建：
 *  - 解码后的表面数据 -> 单个 BufferGeometry（groups 保留气动分区）
 *  - TSL 材质：Cp 顶点属性 -> 压力色带；阈值外片元丢弃（hide 模式）
 *  - 尾翼/扩散器分区高亮（自发光混色）
 *  - 输出撒播用区域采样器（在区域三角形上按面积加权取点）
 */

import {
  BufferGeometry,
  BufferAttribute,
  Mesh,
  Uint32BufferAttribute,
  Vector3,
  Color,
  DoubleSide,
  DataTexture,
} from 'three';
import {
  NodeMaterial,
  Fn,
  attribute,
  uniform,
  texture,
  vec2,
  vec4,
  mix,
  select,
  If,
  Discard,
  color,
  float,
} from 'three/tsl';
import type { LoadedSurface } from '../data/loader';
import type { RegionId } from '../state/store';

export interface RegionMeta {
  id: string;
  name: string;
  triangleStart: number;
  triangleCount: number;
}

export interface CarModel {
  mesh: Mesh<BufferGeometry, NodeMaterial>;
  geometry: BufferGeometry;
  regions: Map<string, RegionMeta>;
  setPressureUniforms: (u: {
    low: number;
    high: number;
    hide: boolean;
    opacity: number;
    highlight: RegionId;
  }) => void;
  /** 在指定区域表面均匀采样世界坐标点 + 法线（粒子撒播） */
  sampleRegionPoints: (regionId: string, count: number) => { positions: Float32Array; normals: Float32Array };
  dispose: () => void;
}

const CP_MIN = -3;
const CP_MAX = 1.2;

// 分区高亮色（线性空间）
const HIGHLIGHT: Record<string, Color> = {
  rearWing: new Color().setRGB(1.0, 0.72, 0.05),
  diffuser: new Color().setRGB(0.1, 0.85, 1.0),
};

export function buildCarModel(loaded: LoadedSurface, pressureLUT: DataTexture): CarModel {
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(loaded.positions, 3));
  geo.setAttribute('cp', new BufferAttribute(loaded.cp, 1));
  if (loaded.indices) geo.setIndex(new Uint32BufferAttribute(loaded.indices, 1));

  const regions = new Map<string, RegionMeta>();
  for (const r of loaded.dataset.geometry.regions ?? []) {
    geo.addGroup(r.triangleStart, r.triangleCount, 0);
    regions.set(r.id, { ...r });
  }
  geo.computeVertexNormals();
  geo.computeBoundingSphere();

  // ---- TSL 压力材质 ----
  // 注意：If/Discard 等控制流必须运行在 Fn 栈内，不能在模块构建期裸调
  const cp = attribute('cp', 'float');
  const uLow = uniform(CP_MIN);
  const uHigh = uniform(CP_MAX);
  // 色带归一化范围跟随实际数据，避免窄范围数据全挤到暖端
  const uCpMin = uniform(loaded.cpMin);
  const uCpMax = uniform(loaded.cpMax);
  const uHide = uniform(1);
  const uOpacity = uniform(1);
  const uHighlight = uniform(0); // 0=none 1=wing 2=diffuser
  const uLUT = pressureLUT;

  const fragment = Fn(() => {
    const t = cp.sub(uCpMin).div(uCpMax.sub(uCpMin)).clamp(0, 1);
    const band = texture(uLUT, vec2(t, 0.5));

    const inRange = cp.greaterThanEqual(uLow).and(cp.lessThanEqual(uHigh));
    // hide 模式：阈值外直接丢弃片元
    If(uHide.equal(1).and(inRange.not()), () => {
      Discard();
    });
    // clamp 模式：阈值外压到色带两端
    const clampedT = select(cp.lessThan(uLow), float(0), select(cp.greaterThan(uHigh), float(1), t));
    const clampedBand = texture(uLUT, vec2(clampedT, 0.5));
    const baseColor = select(uHide.equal(1), band, clampedBand);

    const wingColor = color(HIGHLIGHT.rearWing);
    const diffColor = color(HIGHLIGHT.diffuser);
    const hlColor = select(uHighlight.equal(1), wingColor, diffColor);
    const hlMask = select(uHighlight.greaterThan(0), float(0.55), float(0));
    const finalColor = mix(baseColor.rgb, hlColor, hlMask);
    return vec4(finalColor, 1);
  });

  const mat = new NodeMaterial();
  mat.fragmentNode = fragment();
  mat.opacityNode = uOpacity;
  mat.transparent = true;
  mat.depthWrite = true;
  mat.side = DoubleSide;

  const mesh = new Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = 1;

  return {
    mesh,
    geometry: geo,
    regions,
    setPressureUniforms: ({ low, high, hide, opacity, highlight }) => {
      uLow.value = low;
      uHigh.value = high;
      uHide.value = hide ? 1 : 0;
      uOpacity.value = opacity;
      uHighlight.value = highlight === 'rearWing' ? 1 : highlight === 'diffuser' ? 2 : 0;
    },
    sampleRegionPoints: (regionId, count) => sampleRegion(loaded, regions, regionId, count),
    dispose: () => {
      geo.dispose();
      mat.dispose();
    },
  };
}

/**
 * 区域表面采样：按三角形面积加权取点。
 * 用于在尾翼/扩散器等关键区域上方撒播流线粒子。
 * 使用确定性 LCG，保证同一份数据撒播结果可复现（分享文件回放一致）。
 */
function sampleRegion(
  loaded: LoadedSurface,
  regions: Map<string, RegionMeta>,
  regionId: string,
  count: number,
): { positions: Float32Array; normals: Float32Array } {
  const region = regions.get(regionId);
  const pos = loaded.positions;
  const idx = loaded.indices;
  const out = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  if (!region || !idx) return { positions: out, normals };

  const start = region.triangleStart * 3;
  const end = start + region.triangleCount * 3;
  const triArea: number[] = [];
  let total = 0;
  const a = new Vector3();
  const b = new Vector3();
  const c = new Vector3();
  const ab = new Vector3();
  const ac = new Vector3();
  const n = new Vector3();

  for (let i = start; i < end; i += 3) {
    const ia = idx[i] * 3;
    const ib = idx[i + 1] * 3;
    const ic = idx[i + 2] * 3;
    a.set(pos[ia], pos[ia + 1], pos[ia + 2]);
    b.set(pos[ib], pos[ib + 1], pos[ib + 2]);
    c.set(pos[ic], pos[ic + 1], pos[ic + 2]);
    ab.subVectors(b, a);
    ac.subVectors(c, a);
    const area = ab.cross(ac).length() * 0.5;
    triArea.push(area);
    total += area;
  }
  if (total === 0) return { positions: out, normals };

  let seed = hashRegion(regionId);
  const rnd = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  for (let p = 0; p < count; p++) {
    let r = rnd() * total;
    let tri = 0;
    for (let i = 0; i < triArea.length; i++) {
      r -= triArea[i];
      if (r <= 0) {
        tri = i;
        break;
      }
    }
    const fi = start + tri * 3;
    const ia = idx[fi] * 3;
    const ib = idx[fi + 1] * 3;
    const ic = idx[fi + 2] * 3;
    let u = rnd();
    let v = rnd();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    const w = 1 - u - v;
    const px = pos[ia] * w + pos[ib] * u + pos[ic] * v;
    const py = pos[ia + 1] * w + pos[ib + 1] * u + pos[ic + 1] * v;
    const pz = pos[ia + 2] * w + pos[ib + 2] * u + pos[ic + 2] * v;
    ab.set(pos[ib] - pos[ia], pos[ib + 1] - pos[ia + 1], pos[ib + 2] - pos[ia + 2]);
    ac.set(pos[ic] - pos[ia], pos[ic + 1] - pos[ia + 1], pos[ic + 2] - pos[ia + 2]);
    n.crossVectors(ab, ac).normalize();
    const lift = 0.03 + rnd() * 0.06;
    out[p * 3] = px + n.x * lift;
    out[p * 3 + 1] = py + n.y * lift;
    out[p * 3 + 2] = pz + n.z * lift;
    normals[p * 3] = n.x;
    normals[p * 3 + 1] = n.y;
    normals[p * 3 + 2] = n.z;
  }
  return { positions: out, normals };
}

function hashRegion(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}