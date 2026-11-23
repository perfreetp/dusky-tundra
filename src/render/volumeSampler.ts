/**
 * 规则网格速度场的 CPU 采样器：三线性插值、世界坐标 <-> 体素坐标、
 * 边界判定。GPU 端在 TSL compute 里用同一套数学（见 particleSystem.ts）。
 */

export interface VolumeGrid {
  size: [number, number, number];
  origin: [number, number, number];
  spacing: [number, number, number];
  /** 扁平 vec3，x 最快、z 最慢 */
  velocities: Float32Array;
  /** 可选标量场（静压等），长度 nx*ny*nz */
  scalar: Float32Array | null;
  maxSpeed: number;
}

export interface VolumeBounds {
  min: [number, number, number];
  max: [number, number, number];
}

export function volumeBounds(grid: VolumeGrid): VolumeBounds {
  const [nx, ny, nz] = grid.size;
  return {
    min: [...grid.origin] as [number, number, number],
    max: [
      grid.origin[0] + (nx - 1) * grid.spacing[0],
      grid.origin[1] + (ny - 1) * grid.spacing[1],
      grid.origin[2] + (nz - 1) * grid.spacing[2],
    ],
  };
}

/** 世界坐标 -> 连续体素坐标（浮点索引） */
export function worldToVoxel(grid: VolumeGrid, x: number, y: number, z: number): [number, number, number] {
  return [
    (x - grid.origin[0]) / grid.spacing[0],
    (y - grid.origin[1]) / grid.spacing[1],
    (z - grid.origin[2]) / grid.spacing[2],
  ];
}

export function containsVoxel(grid: VolumeGrid, i: number, j: number, k: number): boolean {
  const [nx, ny, nz] = grid.size;
  return i >= 0 && j >= 0 && k >= 0 && i < nx && j < ny && k < nz;
}

const clampInt = (v: number, hi: number) => (v < 0 ? 0 : v > hi ? hi : v);

/**
 * 三线性采样速度。边界外返回 null（调用方决定回收/冻结粒子）。
 * out 复用避免热路径分配。
 */
export function sampleVelocity(
  grid: VolumeGrid,
  x: number,
  y: number,
  z: number,
  out = new Float32Array(3),
): Float32Array | null {
  const [nx, ny] = grid.size;
  const [fi, fj, fk] = worldToVoxel(grid, x, y, z);
  // 连续体素坐标合法区间 [0, n-1]，留 1e-4 浮点容差
  if (fi < -1e-4 || fj < -1e-4 || fk < -1e-4 ||
      fi > grid.size[0] - 1 + 1e-4 || fj > ny - 1 + 1e-4 || fk > grid.size[2] - 1 + 1e-4) {
    return null;
  }
  const i0 = Math.floor(fi);
  const j0 = Math.floor(fj);
  const k0 = Math.floor(fk);
  const i1 = clampInt(i0 + 1, nx - 1);
  const j1 = clampInt(j0 + 1, ny - 1);
  const k1 = clampInt(k0 + 1, grid.size[2] - 1);
  const tx = fi - i0;
  const ty = fj - j0;
  const tz = fk - k0;

  const slice = nx * ny;
  const idx = (i: number, j: number, k: number) => (k * slice + j * nx + i) * 3;

  let v000 = idx(i0, j0, k0);
  let v100 = idx(i1, j0, k0);
  let v010 = idx(i0, j1, k0);
  let v110 = idx(i1, j1, k0);
  let v001 = idx(i0, j0, k1);
  let v101 = idx(i1, j0, k1);
  let v011 = idx(i0, j1, k1);
  let v111 = idx(i1, j1, k1);
  const v = grid.velocities;

  const sx0 = 1 - tx;
  const sy0 = 1 - ty;
  const sz0 = 1 - tz;
  const w000 = sx0 * sy0 * sz0;
  const w100 = tx * sy0 * sz0;
  const w010 = sx0 * ty * sz0;
  const w110 = tx * ty * sz0;
  const w001 = sx0 * sy0 * tz;
  const w101 = tx * sy0 * tz;
  const w011 = sx0 * ty * tz;
  const w111 = tx * ty * tz;

  for (let c = 0; c < 3; c++) {
    out[c] =
      v[v000 + c] * w000 +
      v[v100 + c] * w100 +
      v[v010 + c] * w010 +
      v[v110 + c] * w110 +
      v[v001 + c] * w001 +
      v[v101 + c] * w101 +
      v[v011 + c] * w011 +
      v[v111 + c] * w111;
  }
  return out;
}

/** 标量场三线性采样（截面云图用），边界外返回 NaN */
export function sampleScalar(grid: VolumeGrid, x: number, y: number, z: number): number {
  const s = grid.scalar;
  if (!s) return NaN;
  const [nx, ny] = grid.size;
  const [fi, fj, fk] = worldToVoxel(grid, x, y, z);
  if (fi < -1e-4 || fj < -1e-4 || fk < -1e-4 ||
      fi > grid.size[0] - 1 + 1e-4 || fj > ny - 1 + 1e-4 || fk > grid.size[2] - 1 + 1e-4) {
    return NaN;
  }
  const i0 = Math.floor(fi);
  const j0 = Math.floor(fj);
  const k0 = Math.floor(fk);
  const i1 = clampInt(i0 + 1, nx - 1);
  const j1 = clampInt(j0 + 1, ny - 1);
  const k1 = clampInt(k0 + 1, grid.size[2] - 1);
  const tx = fi - i0;
  const ty = fj - j0;
  const tz = fk - k0;
  const slice = nx * ny;
  const idx = (i: number, j: number, k: number) => k * slice + j * nx + i;
  const c000 = s[idx(i0, j0, k0)];
  const c100 = s[idx(i1, j0, k0)];
  const c010 = s[idx(i0, j1, k0)];
  const c110 = s[idx(i1, j1, k0)];
  const c001 = s[idx(i0, j0, k1)];
  const c101 = s[idx(i1, j0, k1)];
  const c011 = s[idx(i0, j1, k1)];
  const c111 = s[idx(i1, j1, k1)];
  const sx0 = 1 - tx;
  const sy0 = 1 - ty;
  const sz0 = 1 - tz;
  return (
    c000 * sx0 * sy0 * sz0 +
    c100 * tx * sy0 * sz0 +
    c010 * sx0 * ty * sz0 +
    c110 * tx * ty * sz0 +
    c001 * sx0 * sy0 * tz +
    c101 * tx * sy0 * tz +
    c011 * sx0 * ty * tz +
    c111 * tx * ty * tz
  );
}

/** 速度模长（截面速度云图直接用） */
export function sampleSpeed(
  grid: VolumeGrid,
  x: number,
  y: number,
  z: number,
  scratch: Float32Array<ArrayBuffer>,
): number {
  const v = sampleVelocity(grid, x, y, z, scratch);
  if (!v) return NaN;
  return Math.hypot(v[0], v[1], v[2]);
}
