/**
 * 预分配绳管 BufferGeometry + 多绳合批构建器。
 * 单 geometry、单次 draw call；平行移动标架；张力烘焙为顶点色。
 *
 * 两条更新路径：
 *  - rebuild()：楼层/负载/LOD 切换时全量重建（位置/法线/颜色/UV/索引）。
 *  - updatePositions()：逐帧摆幅，只重算位置+法线并流式上传，索引/颜色/UV 不动。
 */
import * as THREE from 'three';
import type { RopePose } from '../../core/model/types';
import { computeParallelTransportFrames, writeRingVertices } from '../../core/math/parallelTransport';
import { TENSION_LUT_STOPS } from '../../config/engineConfig';
import { MAX_NODES_PER_ROPE } from '../../core/perf/budgets';
import { RENDER_ORDER } from '../render/renderOrder';

export interface RopeBatchOptions {
  maxRopes: number;
  radialSegments: number;
}

interface RopeSlot {
  ropeId: string;
  nodeCount: number;
  /** 该绳首个顶点在合批缓冲中的下标 */
  vertexOffset: number;
  indexCount: number;
  radius: number;
}

export class RopeBatchBuilder {
  readonly geometry: THREE.BufferGeometry;
  readonly mesh: THREE.Mesh;
  private readonly maxRopes: number;
  private readonly radial: number;
  private readonly maxVertices: number;
  private readonly maxIndices: number;

  private positions: Float32Array;
  private normals: Float32Array;
  private colors: Float32Array;
  private uvs: Float32Array;
  private indices: Uint32Array;

  private frameNormals: Float32Array;
  private frameBinormals: Float32Array;
  private frameTangents: Float32Array;
  private ringScratch: Float32Array;

  private slots: RopeSlot[] = [];
  private slotById = new Map<string, number>();
  private usedVertices = 0;
  private usedIndices = 0;

  constructor(material: THREE.Material, opts: RopeBatchOptions) {
    this.maxRopes = opts.maxRopes;
    this.radial = opts.radialSegments;
    this.maxVertices = this.maxRopes * MAX_NODES_PER_ROPE * this.radial;
    this.maxIndices = this.maxRopes * (MAX_NODES_PER_ROPE - 1) * this.radial * 6;

    this.positions = new Float32Array(this.maxVertices * 3);
    this.normals = new Float32Array(this.maxVertices * 3);
    this.colors = new Float32Array(this.maxVertices * 3);
    this.uvs = new Float32Array(this.maxVertices * 2);
    this.indices = new Uint32Array(this.maxIndices);

    this.frameNormals = new Float32Array(MAX_NODES_PER_ROPE * 3);
    this.frameBinormals = new Float32Array(MAX_NODES_PER_ROPE * 3);
    this.frameTangents = new Float32Array(MAX_NODES_PER_ROPE * 3);
    this.ringScratch = new Float32Array(this.radial * 3);

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage));
    this.geometry.setAttribute('normal', new THREE.BufferAttribute(this.normals, 3).setUsage(THREE.DynamicDrawUsage));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3).setUsage(THREE.DynamicDrawUsage));
    this.geometry.setAttribute('uv', new THREE.BufferAttribute(this.uvs, 2).setUsage(THREE.DynamicDrawUsage));
    this.geometry.setIndex(new THREE.BufferAttribute(this.indices, 1).setUsage(THREE.StaticDrawUsage));
    this.geometry.setDrawRange(0, 0);

    this.mesh = new THREE.Mesh(this.geometry, material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = RENDER_ORDER.ROPE;
  }

  /** 全量重建（楼层/负载/LOD 切换）。rendered 为含摆幅的渲染缓冲。 */
  rebuild(
    poses: Map<string, RopePose>,
    rendered: Map<string, Float32Array>,
    radii: Map<string, number>,
    initialNormal: [number, number, number],
  ): void {
    this.slots.length = 0;
    this.slotById.clear();
    this.usedVertices = 0;
    this.usedIndices = 0;

    let slotIndex = 0;
    for (const [ropeId, pose] of poses) {
      const n = pose.nodeCount;
      if (n < 2 || slotIndex >= this.maxRopes) continue;
      const radius = radii.get(ropeId) ?? 0.006;
      const renderPos = rendered.get(ropeId) ?? pose.positions;
      const vertexOffset = this.usedVertices;

      this.writeFrames(renderPos, n, initialNormal);
      const tMinMax = minMax(pose.tension, n);

      for (let i = 0; i < n; i++) {
        writeRingVertices(renderPos, this.frameNormals, this.frameBinormals, i, radius, this.radial, this.ringScratch);
        const tNorm = tMinMax.max - tMinMax.min < 1e-9
          ? 0.5
          : (pose.tension[i]! - tMinMax.min) / (tMinMax.max - tMinMax.min);
        const col = tensionColor(tNorm);

        for (let j = 0; j < this.radial; j++) {
          const vi = this.usedVertices;
          const o3 = vi * 3;
          const ro = j * 3;
          this.positions[o3] = this.ringScratch[ro]!;
          this.positions[o3 + 1] = this.ringScratch[ro + 1]!;
          this.positions[o3 + 2] = this.ringScratch[ro + 2]!;
          const nx = this.ringScratch[ro]! - renderPos[i * 3]!;
          const ny = this.ringScratch[ro + 1]! - renderPos[i * 3 + 1]!;
          const nz = this.ringScratch[ro + 2]! - renderPos[i * 3 + 2]!;
          const nl = Math.hypot(nx, ny, nz) || 1;
          this.normals[o3] = nx / nl;
          this.normals[o3 + 1] = ny / nl;
          this.normals[o3 + 2] = nz / nl;
          this.colors[o3] = col[0];
          this.colors[o3 + 1] = col[1];
          this.colors[o3 + 2] = col[2];
          this.uvs[vi * 2] = i / Math.max(1, n - 1);
          this.uvs[vi * 2 + 1] = j / this.radial;
          this.usedVertices++;
        }
      }

      let indexCount = 0;
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < this.radial; j++) {
          const a = vertexOffset + i * this.radial + j;
          const b = vertexOffset + i * this.radial + ((j + 1) % this.radial);
          const c = vertexOffset + (i + 1) * this.radial + j;
          const d = vertexOffset + (i + 1) * this.radial + ((j + 1) % this.radial);
          this.indices[this.usedIndices++] = a;
          this.indices[this.usedIndices++] = c;
          this.indices[this.usedIndices++] = b;
          this.indices[this.usedIndices++] = b;
          this.indices[this.usedIndices++] = c;
          this.indices[this.usedIndices++] = d;
          indexCount += 6;
        }
      }

      this.slots.push({ ropeId, nodeCount: n, vertexOffset, indexCount, radius });
      this.slotById.set(ropeId, slotIndex);
      slotIndex++;
    }

    this.geometry.setDrawRange(0, this.usedIndices);
    this.markUpdated(this.geometry.getAttribute('position') as THREE.BufferAttribute, this.usedVertices * 3);
    this.markUpdated(this.geometry.getAttribute('normal') as THREE.BufferAttribute, this.usedVertices * 3);
    this.markUpdated(this.geometry.getAttribute('color') as THREE.BufferAttribute, this.usedVertices * 3);
    this.markUpdated(this.geometry.getAttribute('uv') as THREE.BufferAttribute, this.usedVertices * 2);
    const idxAttr = this.geometry.getIndex()!;
    idxAttr.clearUpdateRanges();
    idxAttr.addUpdateRange(0, this.usedIndices);
    idxAttr.needsUpdate = true;
    this.geometry.computeBoundingSphere();
  }

  /**
   * 逐帧轻量更新：仅重算位置与法线（摆幅），索引/颜色/UV 复用 rebuild 结果。
   * 节点拓扑与 rebuild 时一致（同一份 basePoses），故 slot 偏移仍有效。
   */
  updatePositions(
    poses: Map<string, RopePose>,
    rendered: Map<string, Float32Array>,
    initialNormal: [number, number, number],
  ): void {
    for (const slot of this.slots) {
      const pose = poses.get(slot.ropeId);
      const renderPos = rendered.get(slot.ropeId);
      if (!pose || !renderPos) continue;
      const n = Math.min(slot.nodeCount, pose.nodeCount);

      this.writeFrames(renderPos, n, initialNormal);
      for (let i = 0; i < n; i++) {
        writeRingVertices(renderPos, this.frameNormals, this.frameBinormals, i, slot.radius, this.radial, this.ringScratch);
        for (let j = 0; j < this.radial; j++) {
          const vi = slot.vertexOffset + i * this.radial + j;
          const o3 = vi * 3;
          const ro = j * 3;
          this.positions[o3] = this.ringScratch[ro]!;
          this.positions[o3 + 1] = this.ringScratch[ro + 1]!;
          this.positions[o3 + 2] = this.ringScratch[ro + 2]!;
          const nx = this.ringScratch[ro]! - renderPos[i * 3]!;
          const ny = this.ringScratch[ro + 1]! - renderPos[i * 3 + 1]!;
          const nz = this.ringScratch[ro + 2]! - renderPos[i * 3 + 2]!;
          const nl = Math.hypot(nx, ny, nz) || 1;
          this.normals[o3] = nx / nl;
          this.normals[o3 + 1] = ny / nl;
          this.normals[o3 + 2] = nz / nl;
        }
      }
    }

    this.markUpdated(this.geometry.getAttribute('position') as THREE.BufferAttribute, this.usedVertices * 3);
    this.markUpdated(this.geometry.getAttribute('normal') as THREE.BufferAttribute, this.usedVertices * 3);
    // 摆幅幅度远小于井道尺度，复用 rebuild 时的包围球，避免逐帧遍历顶点
  }

  private writeFrames(
    renderPos: Float32Array,
    n: number,
    initialNormal: [number, number, number],
  ): void {
    computeParallelTransportFrames(
      renderPos,
      n,
      this.frameNormals,
      this.frameBinormals,
      this.frameTangents,
      initialNormal,
    );
  }

  private markUpdated(attr: THREE.BufferAttribute, count: number): void {
    attr.clearUpdateRanges();
    attr.addUpdateRange(0, count);
    attr.needsUpdate = true;
  }

  get ropeCount(): number {
    return this.slots.length;
  }

  dispose(): void {
    this.geometry.dispose();
  }
}

function minMax(arr: Float32Array, n: number): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < n; i++) {
    const v = arr[i]!;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (!Number.isFinite(min)) {
    min = 0;
    max = 1;
  }
  return { min, max };
}

/** LUT 分段线性插值，返回线性 RGB（0..1） */
export function tensionColor(t: number): [number, number, number] {
  const x = Math.max(0, Math.min(1, t));
  const stops = TENSION_LUT_STOPS;
  let lo = stops[0]!;
  let hi = stops[stops.length - 1]!;
  for (let k = 0; k < stops.length - 1; k++) {
    if (x >= stops[k]![0] && x <= stops[k + 1]![0]) {
      lo = stops[k]!;
      hi = stops[k + 1]!;
      break;
    }
  }
  const f = (x - lo[0]) / (hi[0] - lo[0] || 1);
  return [
    lo[1][0] + (hi[1][0] - lo[1][0]) * f,
    lo[1][1] + (hi[1][1] - lo[1][1]) * f,
    lo[1][2] + (hi[1][2] - lo[1][2]) * f,
  ];
}
