/**
 * 碰撞变形计算 Worker。
 * 持有原始网格与累积塑性状态;每次碰撞在累积基础上增量计算,
 * 20 万顶点级网格单次重算为 O(V + E·迭代),秒级以内完成。
 */

interface PartState {
  name: string;
  original: Float32Array;
  current: Float32Array;
  indices: Uint32Array;
  zoneOfVertex: Uint8Array;
  stress: Float32Array; // 累积最大应力
  // 邻接表(CSR),用于位移场拉普拉斯平滑
  nbrOffset: Uint32Array;
  nbrList: Uint32Array;
}

let parts: PartState[] = [];
let yieldStrengths: number[] = [250];

function buildAdjacency(indices: Uint32Array, vertCount: number): {
  nbrOffset: Uint32Array;
  nbrList: Uint32Array;
} {
  const degree = new Uint32Array(vertCount);
  for (let i = 0; i < indices.length; i++) degree[indices[i]]++;
  const nbrOffset = new Uint32Array(vertCount + 1);
  for (let i = 0; i < vertCount; i++) nbrOffset[i + 1] = nbrOffset[i] + degree[i];
  const nbrList = new Uint32Array(nbrOffset[vertCount]);
  const cursor = nbrOffset.slice(0, vertCount);
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i];
    const b = indices[i + 1];
    const c = indices[i + 2];
    nbrList[cursor[a]++] = b;
    nbrList[cursor[a]++] = c;
    nbrList[cursor[b]++] = a;
    nbrList[cursor[b]++] = c;
    nbrList[cursor[c]++] = a;
    nbrList[cursor[c]++] = b;
  }
  return { nbrOffset, nbrList };
}

function initParts(
  rawParts: {
    name: string;
    positions: Float32Array;
    indices: Uint32Array;
    zoneOfVertex: Uint8Array;
  }[],
  yields: number[],
): void {
  yieldStrengths = yields;
  parts = rawParts.map((p) => {
    const vertCount = p.positions.length / 3;
    const { nbrOffset, nbrList } = buildAdjacency(p.indices, vertCount);
    return {
      name: p.name,
      original: p.positions.slice(),
      current: p.positions.slice(),
      indices: p.indices,
      zoneOfVertex: p.zoneOfVertex,
      stress: new Float32Array(vertCount),
      nbrOffset,
      nbrList,
    };
  });
}

/** 散度定理体积 */
function volume(positions: Float32Array, indices: Uint32Array): number {
  let v = 0;
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i] * 3;
    const b = indices[i + 1] * 3;
    const c = indices[i + 2] * 3;
    const ax = positions[a];
    const ay = positions[a + 1];
    const az = positions[a + 2];
    v +=
      ax * (positions[b + 1] * positions[c + 2] - positions[b + 2] * positions[c + 1]) -
      ay * (positions[b] * positions[c + 2] - positions[b + 2] * positions[c]) +
      az * (positions[b] * positions[c + 1] - positions[b + 1] * positions[c]);
  }
  return Math.abs(v) / 6;
}

/** 应力 -> 塑性位移 一次碰撞(在所有部件上累积) */
function collide(dir: [number, number, number], impulse: number): void {
  const [dx, dy, dz] = dir;
  // 全场包围盒 + 撞击参考点(沿冲击方向最极端的顶点)
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  let ref = -Infinity;
  const impact: number[] = [0, 0, 0];
  for (const part of parts) {
    const p = part.current;
    for (let i = 0; i < p.length; i += 3) {
      for (let k = 0; k < 3; k++) {
        if (p[i + k] < min[k]) min[k] = p[i + k];
        if (p[i + k] > max[k]) max[k] = p[i + k];
      }
      const t = p[i] * dx + p[i + 1] * dy + p[i + 2] * dz;
      if (t > ref) {
        ref = t;
        impact[0] = p[i];
        impact[1] = p[i + 1];
        impact[2] = p[i + 2];
      }
    }
  }
  const extent = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
  // 沿冲击方向的特征衰减长度 / 横向特征半径
  const along = Math.abs(dx) * extent[0] + Math.abs(dy) * extent[1] + Math.abs(dz) * extent[2];
  const Lc = Math.max(0.2, 0.45 * along);
  const latX = extent[0] * (1 - Math.abs(dx));
  const latY = extent[1] * (1 - Math.abs(dy));
  const latZ = extent[2] * (1 - Math.abs(dz));
  const Rc = Math.max(0.15, 0.35 * Math.max(latX, latY, latZ, 0.3));
  const Rc2 = Rc * Rc;
  const sigma0 = impulse * 0.08; // MPa,冲击峰值应力
  const Eh = 1500; // 塑性硬化模量 MPa
  const maxDisp = 0.35 * along;

  for (const part of parts) {
    const n = part.stress.length;
    const cur = part.current;
    const zone = part.zoneOfVertex;
    const disp = new Float32Array(part.current.length);

    for (let i = 0; i < n; i++) {
      const j = i * 3;
      const rx = cur[j] - impact[0];
      const ry = cur[j + 1] - impact[1];
      const rz = cur[j + 2] - impact[2];
      const t = rx * dx + ry * dy + rz * dz; // <= 0,沿 -dir 的穿透深度
      const lx = rx - t * dx;
      const ly = ry - t * dy;
      const lz = rz - t * dz;
      const lat2 = lx * lx + ly * ly + lz * lz;
      const falloff = Math.exp(t / Lc) / (1 + lat2 / Rc2);
      const sigma = sigma0 * falloff;
      if (sigma > part.stress[i]) part.stress[i] = sigma;

      const yieldS = yieldStrengths[zone[i]] ?? yieldStrengths[0] ?? 250;
      const over = sigma - yieldS;
      if (over > 0) {
        // 塑性应变 -> 沿冲击方向的永久位移
        let d = ((over / Eh) * Lc) / (1 + lat2 / (Rc2 * 4));
        if (d > maxDisp) d = maxDisp;
        disp[j] = -dx * d;
        disp[j + 1] = -dy * d;
        disp[j + 2] = -dz * d;
      }
    }

    // 位移场拉普拉斯平滑(2 轮),模拟结构连续性
    const { nbrOffset, nbrList } = part;
    const tmp = new Float32Array(disp.length);
    for (let iter = 0; iter < 2; iter++) {
      tmp.set(disp);
      for (let i = 0; i < n; i++) {
        const s = nbrOffset[i];
        const e = nbrOffset[i + 1];
        if (e === s) continue;
        let sx = 0;
        let sy = 0;
        let sz = 0;
        for (let k = s; k < e; k++) {
          const m = nbrList[k] * 3;
          sx += tmp[m];
          sy += tmp[m + 1];
          sz += tmp[m + 2];
        }
        const cnt = e - s;
        const j = i * 3;
        disp[j] = tmp[j] * 0.5 + (sx / cnt) * 0.5;
        disp[j + 1] = tmp[j + 1] * 0.5 + (sy / cnt) * 0.5;
        disp[j + 2] = tmp[j + 2] * 0.5 + (sz / cnt) * 0.5;
      }
    }

    for (let i = 0; i < cur.length; i++) cur[i] += disp[i];
  }
}

function collectResult(timeMs: number) {
  let maxStress = 0;
  const maxPoint: [number, number, number] = [0, 0, 0];
  let exceeded = 0;
  const positionsOut: Float32Array[] = [];
  const stressOut: Float32Array[] = [];
  const volumes: number[] = [];
  let maxZone = 0;

  for (const part of parts) {
    positionsOut.push(part.current.slice());
    stressOut.push(part.stress.slice());
    volumes.push(volume(part.current, part.indices));
    for (let i = 0; i < part.stress.length; i++) {
      const s = part.stress[i];
      const yieldS = yieldStrengths[part.zoneOfVertex[i]] ?? 250;
      if (s > yieldS) exceeded++;
      if (s > maxStress) {
        maxStress = s;
        maxZone = part.zoneOfVertex[i];
        maxPoint[0] = part.current[i * 3];
        maxPoint[1] = part.current[i * 3 + 1];
        maxPoint[2] = part.current[i * 3 + 2];
      }
    }
  }
  return {
    positions: positionsOut,
    stress: stressOut,
    volumes,
    maxStress,
    maxPoint,
    maxZone,
    exceeded,
    timeMs,
  };
}

function transferrables(r: ReturnType<typeof collectResult>): Transferable[] {
  const bufs: Transferable[] = [];
  for (const a of r.positions) bufs.push(a.buffer);
  for (const a of r.stress) bufs.push(a.buffer);
  return bufs;
}

self.onmessage = (ev: MessageEvent) => {
  const msg = ev.data;
  if (msg.type === 'init') {
    initParts(msg.parts, msg.yieldStrengths);
    const r = collectResult(0);
    (self as unknown as Worker).postMessage({ id: msg.id, type: 'result', ...r }, transferrables(r));
  } else if (msg.type === 'collide') {
    const t0 = performance.now();
    collide(msg.dir, msg.impulse);
    const r = collectResult(performance.now() - t0);
    (self as unknown as Worker).postMessage({ id: msg.id, type: 'result', ...r }, transferrables(r));
  } else if (msg.type === 'setZones') {
    yieldStrengths = msg.yieldStrengths;
    for (let i = 0; i < parts.length; i++) parts[i].zoneOfVertex = msg.zones[i];
    (self as unknown as Worker).postMessage({ id: msg.id, type: 'zonesApplied' });
  } else if (msg.type === 'reset') {
    for (const part of parts) {
      part.current.set(part.original);
      part.stress.fill(0);
    }
    const r = collectResult(0);
    (self as unknown as Worker).postMessage({ id: msg.id, type: 'result', ...r }, transferrables(r));
  }
};
