/**
 * 平行移动标架（Parallel Transport Frame）。
 * 替代 Frenet 标架：直段/拐点处无退化、无翻转。
 * 输入节点位置，输出每节点法线 n、副法线 b（切线 t 一并产出）。
 */

/**
 * @param positions nodeCount*3 节点位置
 * @param nodeCount 节点数
 * @param normals 输出 nodeCount*3 法线
 * @param binormals 输出 nodeCount*3 副法线
 * @param tangents 输出 nodeCount*3 切线
 * @param initialNormal 首节点法线种子（不必与切线正交，内部正交化）
 */
export function computeParallelTransportFrames(
  positions: Float32Array,
  nodeCount: number,
  normals: Float32Array,
  binormals: Float32Array,
  tangents: Float32Array,
  initialNormal: [number, number, number],
): void {
  if (nodeCount === 0) return;

  // 首节点切线
  let tx: number, ty: number, tz: number;
  if (nodeCount === 1) {
    tx = 0; ty = 1; tz = 0;
  } else {
    tx = positions[3]! - positions[0]!;
    ty = positions[4]! - positions[1]!;
    tz = positions[5]! - positions[2]!;
    const tl = Math.hypot(tx, ty, tz) || 1;
    tx /= tl; ty /= tl; tz /= tl;
  }
  tangents[0] = tx; tangents[1] = ty; tangents[2] = tz;

  // 首法线 = 种子方向投影到切线垂直平面
  let nx = initialNormal[0] - tx * (initialNormal[0] * tx + initialNormal[1] * ty + initialNormal[2] * tz);
  let ny = initialNormal[1] - ty * (initialNormal[0] * tx + initialNormal[1] * ty + initialNormal[2] * tz);
  let nz = initialNormal[2] - tz * (initialNormal[0] * tx + initialNormal[1] * ty + initialNormal[2] * tz);
  let nl = Math.hypot(nx, ny, nz);
  if (nl < 1e-9) {
    // 种子与切线平行：换一个备用方向
    const alt: [number, number, number] = Math.abs(ty) > 0.9 ? [1, 0, 0] : [0, 1, 0];
    nx = alt[0] - tx * (alt[0] * tx + alt[1] * ty + alt[2] * tz);
    ny = alt[1] - ty * (alt[0] * tx + alt[1] * ty + alt[2] * tz);
    nz = alt[2] - tz * (alt[0] * tx + alt[1] * ty + alt[2] * tz);
    nl = Math.hypot(nx, ny, nz);
  }
  nx /= nl; ny /= nl; nz /= nl;
  normals[0] = nx; normals[1] = ny; normals[2] = nz;
  // b = t × n
  binormals[0] = ty * nz - tz * ny;
  binormals[1] = tz * nx - tx * nz;
  binormals[2] = tx * ny - ty * nx;

  let pnx = nx, pny = ny, pnz = nz;
  for (let i = 1; i < nodeCount; i++) {
    const i3 = i * 3;
    if (i < nodeCount - 1) {
      tx = positions[i3 + 3]! - positions[i3 - 3]!;
      ty = positions[i3 + 4]! - positions[i3 - 2]!;
      tz = positions[i3 + 5]! - positions[i3 - 1]!;
    } else {
      tx = positions[i3]! - positions[i3 - 3]!;
      ty = positions[i3 + 1]! - positions[i3 - 2]!;
      tz = positions[i3 + 2]! - positions[i3 - 1]!;
    }
    const tl = Math.hypot(tx, ty, tz) || 1;
    tx /= tl; ty /= tl; tz /= tl;
    tangents[i3] = tx; tangents[i3 + 1] = ty; tangents[i3 + 2] = tz;

    // 平行移动：n_i = n_{i-1} - t_i (t_i·n_{i-1})
    const dot = tx * pnx + ty * pny + tz * pnz;
    nx = pnx - tx * dot;
    ny = pny - ty * dot;
    nz = pnz - tz * dot;
    nl = Math.hypot(nx, ny, nz);
    if (nl < 1e-9) {
      // 切线反向极端情况：保留上一帧法线
      nx = pnx; ny = pny; nz = pnz;
    } else {
      nx /= nl; ny /= nl; nz /= nl;
    }
    normals[i3] = nx; normals[i3 + 1] = ny; normals[i3 + 2] = nz;
    binormals[i3] = ty * nz - tz * ny;
    binormals[i3 + 1] = tz * nx - tx * nz;
    binormals[i3 + 2] = tx * ny - ty * nx;

    pnx = nx; pny = ny; pnz = nz;
  }
}

/** 沿标架在节点 i 处生成环截面顶点（写入 ringOut，radial*3） */
export function writeRingVertices(
  positions: Float32Array,
  normals: Float32Array,
  binormals: Float32Array,
  nodeIndex: number,
  radius: number,
  radialSegments: number,
  ringOut: Float32Array,
): void {
  const i3 = nodeIndex * 3;
  const px = positions[i3]!, py = positions[i3 + 1]!, pz = positions[i3 + 2]!;
  const nx = normals[i3]!, ny = normals[i3 + 1]!, nz = normals[i3 + 2]!;
  const bx = binormals[i3]!, by = binormals[i3 + 1]!, bz = binormals[i3 + 2]!;
  for (let j = 0; j < radialSegments; j++) {
    const beta = (j / radialSegments) * Math.PI * 2;
    const cb = Math.cos(beta) * radius;
    const sb = Math.sin(beta) * radius;
    const o = j * 3;
    ringOut[o] = px + nx * cb + bx * sb;
    ringOut[o + 1] = py + ny * cb + by * sb;
    ringOut[o + 2] = pz + nz * cb + bz * sb;
  }
}
