import * as THREE from 'three';
import type { SamplePoint } from '../types';
import type { CalcResult } from '../acoustics/engine';
import { absoluteColor, diffColor } from '../acoustics/colors';

const PATCH_SIZE = 1.6;
const LIFT = 0.12;

const _mat4 = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _up = new THREE.Vector3(0, 1, 0);
const _pos = new THREE.Vector3();
const _scale = new THREE.Vector3(1, 1, 1);
const _color = new THREE.Color();
const _normal = new THREE.Vector3();

/**
 * 采样点覆盖色带：单个 InstancedMesh 承载全部采样点，
 * 重算只写 instanceColor，网格变化时重建实例矩阵（材质保留）。
 */
export class CoverageLayer {
  private mesh: THREE.InstancedMesh;
  private readonly material: THREE.MeshBasicMaterial;
  private pointCount = 0;

  constructor() {
    this.material = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    this.mesh = this.createMesh(1);
  }

  get object(): THREE.InstancedMesh {
    return this.mesh;
  }

  private createMesh(capacity: number): THREE.InstancedMesh {
    const geo = new THREE.CircleGeometry(PATCH_SIZE / 2, 8);
    const inst = new THREE.InstancedMesh(geo, this.material, Math.max(1, capacity));
    inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    inst.name = 'coverage';
    inst.frustumCulled = false;
    inst.visible = false;
    return inst;
  }

  /** 网格变化后按新采样点重建实例矩阵 */
  rebuild(points: SamplePoint[]): void {
    const parent = this.mesh.parent;
    if (parent) parent.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.dispose();

    this.pointCount = points.length;
    const inst = this.createMesh(Math.max(1, this.pointCount));

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      _normal.set(p.nx, p.ny, p.nz);
      _pos.set(p.x + p.nx * LIFT, p.y + p.ny * LIFT, p.z + p.nz * LIFT);
      _q.setFromUnitVectors(_up, _normal);
      _mat4.compose(_pos, _q, _scale);
      inst.setMatrixAt(i, _mat4);
    }
    inst.instanceMatrix.needsUpdate = true;
    inst.visible = this.pointCount > 0;
    if (parent) parent.add(inst);
    this.mesh = inst;
  }

  /** 绝对/隔离模式着色（values 为总 SPL 或单箱贡献序列） */
  colorAbsolute(_result: CalcResult, values: Float32Array, thresholds: readonly number[]): void {
    const mesh = this.mesh;
    for (let i = 0; i < this.pointCount; i++) {
      _color.setHex(absoluteColor(values[i], thresholds));
      mesh.setColorAt(i, _color);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.visible = this.pointCount > 0;
  }

  /** 差值模式着色：B - A */
  colorDiff(current: Float32Array, baseline: Float32Array): void {
    const mesh = this.mesh;
    for (let i = 0; i < this.pointCount; i++) {
      const a = baseline[i];
      const b = current[i];
      const delta = Number.isFinite(a) && Number.isFinite(b) ? b - a : NaN;
      _color.setHex(diffColor(delta));
      mesh.setColorAt(i, _color);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.visible = this.pointCount > 0;
  }

  hide(): void {
    this.mesh.visible = false;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.mesh.dispose();
  }
}
