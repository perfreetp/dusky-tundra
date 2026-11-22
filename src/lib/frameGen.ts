import Module from 'manifold-3d';
import wasmUrl from 'manifold-3d/manifold.wasm?url';
import type { MeshPart } from './types';

type ManifoldAPI = Awaited<ReturnType<typeof Module>>;

let api: ManifoldAPI | null = null;
let loading: Promise<ManifoldAPI> | null = null;

export function initManifold(): Promise<ManifoldAPI> {
  if (api) return Promise.resolve(api);
  if (!loading) {
    loading = (async () => {
      const mod = await Module({ locateFile: () => wasmUrl });
      mod.setup();
      api = mod;
      return mod;
    })();
  }
  return loading;
}

interface RawMesh {
  vertProperties: Float32Array;
  triVerts: Uint32Array;
}

function toPart(raw: RawMesh, name: string, kind: MeshPart['kind']): MeshPart {
  const positions = new Float32Array(raw.vertProperties); // numProp = 3
  const indices = new Uint32Array(raw.triVerts);
  const n = positions.length / 3;
  return {
    id: `part-${name}`,
    name,
    kind,
    positions,
    original: positions.slice(),
    indices,
    zoneOfVertex: new Uint8Array(n),
    stress: new Float32Array(n),
  };
}

function box(
  M: ManifoldAPI['Manifold'],
  size: [number, number, number],
  center: [number, number, number],
  rotateY = 0,
) {
  let m = M.cube(size, true);
  if (rotateY) m = m.rotate([0, rotateY, 0]);
  return m.translate(center);
}

/**
 * 用 manifold-3d 布尔运算生成示例车架:
 *  - 外壳:中空乘员舱壳体,侧面切出车窗带
 *  - 内部梁:纵梁 / 横梁 / 门槛 / 立柱 / 顶梁 并集
 * 返回两个部件(外壳半透明 + 梁不透明),以及用 manifold 求得的初始体积。
 */
export async function generateDemoFrame(): Promise<{
  parts: MeshPart[];
  volumes: Record<string, number>;
}> {
  const mod = await initManifold();
  const { Manifold: M } = mod;

  // ---- 外壳 ----
  const outer = M.cube([4.4, 1.8, 1.3], true).translate([0, 0, 0.8]);
  const inner = M.cube([4.2, 1.6, 1.1], true).translate([0, 0, 0.8]);
  let shell = outer.subtract(inner);
  // 车窗带:侧面贯通切除,保留车顶
  const windowBand = M.cube([1.9, 2.2, 0.5], true).translate([0, 0, 1.1]);
  shell = shell.subtract(windowBand);
  // 前后风挡斜切
  const windshield = M.cube([1.2, 2.2, 0.8], true).rotate([0, 35, 0]).translate([-1.35, 0, 1.35]);
  const rearWindow = M.cube([1.2, 2.2, 0.8], true).rotate([0, -35, 0]).translate([1.35, 0, 1.35]);
  shell = shell.subtract(windshield).subtract(rearWindow);

  // ---- 内部梁 ----
  const beams: InstanceType<ManifoldAPI['Manifold']>[] = [];
  // 前后纵梁
  for (const sy of [-0.62, 0.62]) {
    beams.push(box(M, [1.3, 0.12, 0.16], [-1.45, sy, 0.35]));
    beams.push(box(M, [1.3, 0.12, 0.16], [1.45, sy, 0.35]));
  }
  // 门槛梁
  for (const sy of [-0.78, 0.78]) beams.push(box(M, [2.0, 0.1, 0.2], [0, sy, 0.32]));
  // 地板横梁
  for (const x of [-0.85, 0, 0.85]) beams.push(box(M, [0.12, 1.5, 0.1], [x, 0, 0.3]));
  // 前后防撞梁
  beams.push(box(M, [0.12, 1.6, 0.18], [-2.05, 0, 0.42]));
  beams.push(box(M, [0.12, 1.6, 0.18], [2.05, 0, 0.42]));
  // A / B 立柱
  for (const sy of [-0.72, 0.72]) {
    beams.push(box(M, [0.09, 0.09, 0.75], [-0.95, sy, 1.0], -18));
    beams.push(box(M, [0.09, 0.09, 0.75], [0.95, sy, 1.0], 18));
  }
  // 顶纵梁与顶横梁
  for (const sy of [-0.72, 0.72]) beams.push(box(M, [1.9, 0.08, 0.08], [0, sy, 1.42]));
  for (const x of [-0.9, 0.9]) beams.push(box(M, [0.08, 1.45, 0.07], [x, 0, 1.42]));

  const beamUnion = M.union(beams);

  // 细网格才能获得平滑的塑性变形场
  const shellFine = shell.refineToLength(0.22);
  const beamFine = beamUnion.refineToLength(0.18);

  const shellMesh = shellFine.getMesh();
  const beamMesh = beamFine.getMesh();
  const volumes = { shell: shell.volume(), beam: beamUnion.volume() };

  // 释放 wasm 对象
  for (const b of beams) b.delete();
  for (const m of [outer, inner, windowBand, windshield, rearWindow, shell, beamUnion, shellFine, beamFine]) m.delete();

  return {
    parts: [toPart(shellMesh, '外壳', 'shell'), toPart(beamMesh, '内部梁', 'beam')],
    volumes,
  };
}
