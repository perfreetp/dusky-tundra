import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { MeshPart } from './types';

/** 散度定理计算封闭(或近似封闭)网格体积 */
export function meshVolume(positions: Float32Array, indices: Uint32Array): number {
  let v = 0;
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i] * 3;
    const b = indices[i + 1] * 3;
    const c = indices[i + 2] * 3;
    const ax = positions[a];
    const ay = positions[a + 1];
    const az = positions[a + 2];
    const bx = positions[b];
    const by = positions[b + 1];
    const bz = positions[b + 2];
    const cx = positions[c];
    const cy = positions[c + 1];
    const cz = positions[c + 2];
    v +=
      ax * (by * cz - bz * cy) -
      ay * (bx * cz - bz * cx) +
      az * (bx * cy - by * cx);
  }
  return Math.abs(v) / 6;
}

function geometryToPart(geo: THREE.BufferGeometry, name: string, kind: MeshPart['kind']): MeshPart {
  const posAttr = geo.getAttribute('position');
  const positions = new Float32Array(posAttr.array as ArrayLike<number>);
  let indices: Uint32Array;
  if (geo.index) {
    indices = new Uint32Array(geo.index.array as ArrayLike<number>);
  } else {
    indices = new Uint32Array(posAttr.count);
    for (let i = 0; i < indices.length; i++) indices[i] = i;
  }
  const n = positions.length / 3;
  return {
    id: `part-${Math.random().toString(36).slice(2, 9)}`,
    name,
    kind,
    positions,
    original: positions.slice(),
    indices,
    zoneOfVertex: new Uint8Array(n),
    stress: new Float32Array(n),
  };
}

function collectGeometries(root: THREE.Object3D): THREE.BufferGeometry[] {
  const geos: THREE.BufferGeometry[] = [];
  root.updateMatrixWorld(true);
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh && mesh.geometry) {
      const g = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
      for (const key of Object.keys(g.attributes)) {
        if (key !== 'position') g.deleteAttribute(key);
      }
      const nonIndexed = g.index ? g.toNonIndexed() : g;
      geos.push(nonIndexed);
    }
  });
  return geos;
}

/** 解析导入的车架网格文件 (STL / OBJ / GLTF / GLB) */
export async function parseMeshFile(file: File): Promise<MeshPart> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const buf = await file.arrayBuffer();
  let geo: THREE.BufferGeometry;

  if (ext === 'stl') {
    geo = new STLLoader().parse(buf);
  } else if (ext === 'obj') {
    const text = new TextDecoder().decode(buf);
    const group = new OBJLoader().parse(text);
    const geos = collectGeometries(group);
    if (!geos.length) throw new Error('OBJ 中没有网格数据');
    geo = geos.length === 1 ? geos[0] : mergeGeometries(geos, false)!;
  } else if (ext === 'gltf' || ext === 'glb') {
    const gltf = await new GLTFLoader().parseAsync(buf, '');
    const geos = collectGeometries(gltf.scene);
    if (!geos.length) throw new Error('GLTF 中没有网格数据');
    geo = geos.length === 1 ? geos[0] : mergeGeometries(geos, false)!;
  } else {
    throw new Error(`不支持的格式: .${ext}(支持 STL / OBJ / GLTF / GLB)`);
  }

  const part = geometryToPart(geo, file.name, 'solid');
  normalizeScale(part);
  return part;
}

/** 超大/超小网格缩放到约 4m 长,便于统一物理参数 */
function normalizeScale(part: MeshPart): void {
  const p = part.positions;
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < p.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], p[i + k]);
      max[k] = Math.max(max[k], p[i + k]);
    }
  }
  const extent = Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2]);
  if (!(extent > 0)) return;
  const s = 4 / extent;
  if (Math.abs(s - 1) < 0.05) return;
  for (let i = 0; i < p.length; i += 3) {
    p[i] *= s;
    p[i + 1] *= s;
    p[i + 2] *= s;
  }
  part.original.set(part.positions);
}

/** 按 X 轴归一化坐标把顶点分配到材料分区 */
export function assignZones(
  part: MeshPart,
  zones: { xMin: number; xMax: number }[],
): void {
  const p = part.original;
  let minX = Infinity;
  let maxX = -Infinity;
  for (let i = 0; i < p.length; i += 3) {
    if (p[i] < minX) minX = p[i];
    if (p[i] > maxX) maxX = p[i];
  }
  const span = Math.max(1e-9, maxX - minX);
  const zone = part.zoneOfVertex;
  for (let i = 0; i < zone.length; i++) {
    const t = (p[i * 3] - minX) / span;
    let z = zones.length - 1;
    for (let k = 0; k < zones.length; k++) {
      if (t >= zones[k].xMin && t <= zones[k].xMax) {
        z = k;
        break;
      }
    }
    zone[i] = z;
  }
}

/* ---------------- 导出 ---------------- */

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/** 导出变形后网格为二进制 STL(合并所有部件) */
export function exportSTL(parts: MeshPart, extraParts: MeshPart[], filename: string): void {
  const all = [parts, ...extraParts];
  let triCount = 0;
  for (const p of all) triCount += p.indices.length / 3;
  const buffer = new ArrayBuffer(84 + triCount * 50);
  const view = new DataView(buffer);
  view.setUint32(80, triCount, true);
  let offset = 84;
  const va = new THREE.Vector3();
  const vb = new THREE.Vector3();
  const vc = new THREE.Vector3();
  const n = new THREE.Vector3();
  const e1 = new THREE.Vector3();
  const e2 = new THREE.Vector3();
  for (const part of all) {
    const pos = part.positions;
    const idx = part.indices;
    for (let i = 0; i < idx.length; i += 3) {
      for (let k = 0; k < 3; k++) {
        const o = idx[i + k] * 3;
        if (k === 0) va.set(pos[o], pos[o + 1], pos[o + 2]);
        if (k === 1) vb.set(pos[o], pos[o + 1], pos[o + 2]);
        if (k === 2) vc.set(pos[o], pos[o + 1], pos[o + 2]);
      }
      e1.subVectors(vb, va);
      e2.subVectors(vc, va);
      n.crossVectors(e1, e2).normalize();
      view.setFloat32(offset, n.x, true);
      view.setFloat32(offset + 4, n.y, true);
      view.setFloat32(offset + 8, n.z, true);
      offset += 12;
      for (const v of [va, vb, vc]) {
        view.setFloat32(offset, v.x, true);
        view.setFloat32(offset + 4, v.y, true);
        view.setFloat32(offset + 8, v.z, true);
        offset += 12;
      }
      view.setUint16(offset, 0, true);
      offset += 2;
    }
  }
  download(new Blob([buffer], { type: 'model/stl' }), filename);
}

/** 导出变形后网格为 OBJ(合并所有部件,按部件分组) */
export function exportOBJ(parts: MeshPart[], filename: string): void {
  const lines: string[] = ['# deformed frame export'];
  let base = 1;
  for (const part of parts) {
    lines.push(`o ${part.name}`);
    const p = part.positions;
    for (let i = 0; i < p.length; i += 3) {
      lines.push(`v ${p[i].toFixed(6)} ${p[i + 1].toFixed(6)} ${p[i + 2].toFixed(6)}`);
    }
    const idx = part.indices;
    for (let i = 0; i < idx.length; i += 3) {
      lines.push(`f ${idx[i] + base} ${idx[i + 1] + base} ${idx[i + 2] + base}`);
    }
    base += p.length / 3;
  }
  download(new Blob([lines.join('\n')], { type: 'text/plain' }), filename);
}

/** 导出每顶点应力数据 CSV */
export function exportStressCSV(parts: MeshPart[], zoneNames: string[], filename: string): void {
  const lines = ['part,vertex,x,y,z,stress_MPa,zone'];
  for (const part of parts) {
    const p = part.positions;
    const s = part.stress;
    for (let i = 0; i < s.length; i++) {
      const j = i * 3;
      lines.push(
        `${part.name},${i},${p[j].toFixed(5)},${p[j + 1].toFixed(5)},${p[j + 2].toFixed(5)},${s[i].toFixed(2)},${zoneNames[part.zoneOfVertex[i]] ?? part.zoneOfVertex[i]}`,
      );
    }
  }
  download(new Blob([lines.join('\n')], { type: 'text/csv' }), filename);
}

/** 导出碰撞报告 JSON */
export function exportReport(data: unknown, filename: string): void {
  download(
    new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
    filename,
  );
}
