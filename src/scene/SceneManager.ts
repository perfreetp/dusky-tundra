import { Engine } from '@babylonjs/core/Engines/engine';
import { WebGPUEngine } from '@babylonjs/core/Engines/webgpuEngine';
import { Scene } from '@babylonjs/core/scene';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import '@babylonjs/core/Meshes/thinInstanceMesh';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Vector3, Quaternion, Matrix } from '@babylonjs/core/Maths/math.vector';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { VertexBuffer } from '@babylonjs/core/Buffers/buffer';
import type { AbstractEngine } from '@babylonjs/core/Engines/abstractEngine';
import {
  LOD_TIERS,
  type Branch,
  type PetalParams,
  type Variety
} from '../types';
import { buildCorollaLayout, buildPetalGeometry, type CorollaLayout } from '../core/petal';
import { computeBloomState, SEPAL_PARAMS } from '../core/growth';
import { makeRng, sampleCatmullRom, type MonotoneCurve } from '../core/mathUtils';

interface PetalBucket {
  matrices: number[];
  colors: number[];
}

interface Scaffold {
  rootMatrix: Matrix;
  head: Vector3;
  scale: number;
  yaw: number;
}

const UP = new Vector3(0, 1, 0);

/** 叶片几何参数（复用参数化曲面生成器） */
const LEAF_PARAMS: PetalParams = {
  layers: 1,
  petalsPerLayer: 3,
  length: 0.42,
  width: 0.2,
  bend: [0, 0.04, 0.1, 0.16],
  curl: [0, 0.02, 0.05, 0.08],
  segU: 6,
  segV: 8
};

export class SceneManager {
  private canvas: HTMLCanvasElement;
  engine!: AbstractEngine;
  scene!: Scene;
  private camera!: ArcRotateCamera;
  private engineName = 'WebGL2';

  private petalMat!: StandardMaterial;
  private sepalMat!: StandardMaterial;
  private stemMat!: StandardMaterial;
  private leafMat!: StandardMaterial;

  private stemMesh!: Mesh;
  private leafMesh!: Mesh;
  /** key: `${varietyId}:${tier}` */
  private petalMeshes = new Map<string, Mesh>();
  /** key: varietyId */
  private sepalMeshes = new Map<string, Mesh>();
  private layouts = new Map<string, CorollaLayout>();

  private scaffolds = new Map<number, Scaffold>();
  private lodCounts = new Array<number>(LOD_TIERS).fill(0);
  private totalPetalInstances = 0;
  private frameDrawCalls = 0;
  private frameDrawCallsReady = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  async init(): Promise<string> {
    const supported = await WebGPUEngine.IsSupportedAsync;
    if (supported) {
      const engine = new WebGPUEngine(this.canvas, { antialias: true, stencil: false });
      await engine.initAsync();
      this.engine = engine;
      this.engineName = 'WebGPU';
    } else {
      this.engine = new Engine(this.canvas, true, { stencil: false });
      this.engineName = 'WebGL2（回退）';
    }

    this.scene = new Scene(this.engine);
    this.scene.clearColor.set(0.07, 0.09, 0.08, 1);
    this.scene.fogMode = Scene.FOGMODE_EXP2;
    this.scene.fogColor = new Color3(0.07, 0.09, 0.08);
    this.scene.fogDensity = 0.012;
    this.scene.ambientColor = new Color3(0.35, 0.38, 0.32);

    this.camera = new ArcRotateCamera('cam', -Math.PI / 2.4, Math.PI / 3.2, 9, new Vector3(0, 1.6, 0), this.scene);
    this.camera.attachControl(this.canvas, true);
    this.camera.lowerRadiusLimit = 2;
    this.camera.upperRadiusLimit = 32;
    this.camera.upperBetaLimit = Math.PI / 2.05;
    this.camera.wheelDeltaPercentage = 0.01;
    this.camera.minZ = 0.05;

    const hemi = new HemisphericLight('hemi', new Vector3(0.2, 1, 0.3), this.scene);
    hemi.intensity = 0.55;
    hemi.groundColor = new Color3(0.12, 0.16, 0.1);
    const dir = new DirectionalLight('dir', new Vector3(-0.6, -1.2, -0.5), this.scene);
    dir.intensity = 0.7;

    // 地面
    const ground = MeshBuilder.CreateGround('ground', { width: 30, height: 24, subdivisions: 2 }, this.scene);
    const groundMat = new StandardMaterial('groundMat', this.scene);
    groundMat.diffuseColor = new Color3(0.1, 0.14, 0.09);
    groundMat.specularColor = new Color3(0.03, 0.03, 0.03);
    ground.material = groundMat;

    // 材质
    this.petalMat = new StandardMaterial('petalMat', this.scene);
    // 不设 diffuseColor：逐实例 instanceColor 直接作为漫反射色
    this.petalMat.ambientColor = new Color3(0.5, 0.5, 0.5);
    this.petalMat.specularColor = new Color3(0.05, 0.04, 0.05);
    this.petalMat.specularPower = 64;
    this.petalMat.backFaceCulling = false;
    // 双面光照：背面压暗，避免边缘透出灰白
    this.petalMat.twoSidedLighting = true;

    this.sepalMat = new StandardMaterial('sepalMat', this.scene);
    this.sepalMat.diffuseColor = new Color3(0.16, 0.34, 0.12);
    this.sepalMat.specularColor = new Color3(0.05, 0.05, 0.05);
    this.sepalMat.backFaceCulling = false;
    this.sepalMat.twoSidedLighting = true;

    this.stemMat = new StandardMaterial('stemMat', this.scene);
    this.stemMat.diffuseColor = new Color3(0.2, 0.38, 0.14);
    this.stemMat.specularColor = new Color3(0.04, 0.04, 0.04);

    this.leafMat = new StandardMaterial('leafMat', this.scene);
    this.leafMat.diffuseColor = new Color3(0.18, 0.4, 0.15);
    this.leafMat.specularColor = new Color3(0.05, 0.06, 0.04);
    this.leafMat.backFaceCulling = false;
    this.leafMat.twoSidedLighting = true;

    // 茎秆单元：单位圆柱，后续按段做薄实例
    this.stemMesh = MeshBuilder.CreateCylinder(
      'stemSeg',
      { height: 1, diameter: 0.035, tessellation: 6 },
      this.scene
    );
    this.stemMesh.material = this.stemMat;
    this.stemMesh.isPickable = false;
    this.stemMesh.alwaysSelectAsActiveMesh = true;

    this.leafMesh = this.createParamMesh('leaf', LEAF_PARAMS, this.leafMat);

    this.engine.runRenderLoop(() => {
      // 引擎的 _drawCalls 为累计计数器，借助渲染前后差值统计单帧 Draw Call
      const before = this.engine._drawCalls.current;
      this.scene.render();
      this.frameDrawCalls = this.engine._drawCalls.current - before;
      this.frameDrawCallsReady = true;
    });
    return this.engineName;
  }

  private createParamMesh(
    name: string,
    params: PetalParams,
    material: StandardMaterial,
    surfaceOptions: { openBend?: number; openCurl?: number } = {}
  ): Mesh {
    const geo = buildPetalGeometry(params, surfaceOptions);
    const mesh = new Mesh(name, this.scene);
    mesh.setVerticesData(VertexBuffer.PositionKind, geo.positions);
    mesh.setVerticesData(VertexBuffer.NormalKind, geo.normals);
    mesh.setVerticesData(VertexBuffer.UVKind, geo.uvs);
    mesh.setIndices(geo.indices);
    mesh.material = material;
    mesh.isPickable = false;
    mesh.alwaysSelectAsActiveMesh = true;
    // 薄实例逐实例颜色：Babylon 约定属性名为 instanceColor（注册时传 'color' 会自动映射，显式更稳妥）
    mesh.thinInstanceRegisterAttribute(VertexBuffer.ColorInstanceKind, 4);
    mesh.thinInstanceSetBuffer('matrix', null, 16, false);
    mesh.thinInstanceSetBuffer(VertexBuffer.ColorInstanceKind, null, 4, false);
    mesh.setEnabled(false);
    return mesh;
  }

  /** 品种参数/曲线编辑后：重建该品种相关曲面与布局缓存 */
  rebuildVariety(variety: Variety): void {
    this.layouts.set(variety.id, buildCorollaLayout(variety.petal, makeRng(hashString(variety.id))));
    for (let tier = 0; tier < LOD_TIERS; tier++) {
      const key = `${variety.id}:${tier}`;
      this.petalMeshes.get(key)?.dispose();
      this.petalMeshes.delete(key);
    }
    this.sepalMeshes.get(variety.id)?.dispose();
    this.sepalMeshes.delete(variety.id);
  }

  private ensureLayout(variety: Variety): CorollaLayout {
    let layout = this.layouts.get(variety.id);
    if (!layout) {
      layout = buildCorollaLayout(variety.petal, makeRng(hashString(variety.id)));
      this.layouts.set(variety.id, layout);
    }
    return layout;
  }

  private ensurePetalMesh(variety: Variety, tier: number): Mesh {
    const key = `${variety.id}:${tier}`;
    let mesh = this.petalMeshes.get(key);
    if (!mesh) {
      // LOD：开放度越低的分档曲面细分越少
      const f = 0.45 + 0.55 * (tier / (LOD_TIERS - 1));
      // 该档代表开放度：把瓣尖反卷与卷边烘焙进静态曲面，运行时零顶点计算
      const tierOpen = (tier + 0.5) / LOD_TIERS;
      const lodParams: PetalParams = {
        ...variety.petal,
        segU: Math.max(3, Math.round(variety.petal.segU * f)),
        segV: Math.max(4, Math.round(variety.petal.segV * f))
      };
      const lodMesh = this.createParamMesh(`petal:${key}`, lodParams, this.petalMat, {
        openBend: -0.45 + tierOpen * 1.15, // 花苞内抱 → 盛开瓣尖强烈外卷
        openCurl: 0.04 + tierOpen * 0.28
      });
      mesh = lodMesh;
      this.petalMeshes.set(key, mesh);
    }
    return mesh;
  }

  private ensureSepalMesh(variety: Variety): Mesh {
    let mesh = this.sepalMeshes.get(variety.id);
    if (!mesh) {
      mesh = this.createParamMesh(`sepal:${variety.id}`, SEPAL_PARAMS, this.sepalMat);
      this.sepalMeshes.set(variety.id, mesh);
    }
    return mesh;
  }

  /** 重建茎秆与叶片（仅当花枝布局/变体变化时调用，拖时间轴不触发） */
  updateScaffold(branches: Branch[]): void {
    const stemMatrices: number[] = [];
    const leafMatrices: number[] = [];
    this.scaffolds.clear();

    for (const branch of branches) {
      const rng = makeRng(branch.id * 7919 + 13);
      const height = 2.1 + rng() * 0.5;
      const bendAmp = (0.05 + rng() * 0.12) * height;
      const bendDir = rng() * Math.PI * 2;
      const bx = Math.cos(bendDir);
      const bz = Math.sin(bendDir);

      const local = [
        { x: 0, y: 0, z: 0 },
        { x: bx * bendAmp * 0.25, y: height * 0.33, z: bz * bendAmp * 0.25 },
        { x: bx * bendAmp * 0.7, y: height * 0.66, z: bz * bendAmp * 0.7 },
        { x: bx * bendAmp, y: height, z: bz * bendAmp }
      ];
      const path = sampleCatmullRom(local, 4).map((p) => {
        // 枝局部坐标 → 世界（绕 Y 偏航 + 根位置 + 统一缩放）
        const lx = p.x;
        const lz = p.z;
        const cy = Math.cos(branch.yaw);
        const sy = Math.sin(branch.yaw);
        return new Vector3(
          branch.position.x + (lx * cy + lz * sy) * branch.scale,
          branch.position.y + p.y * branch.scale,
          branch.position.z + (-lx * sy + lz * cy) * branch.scale
        );
      });

      // 茎段薄实例（圆柱基元直径 0.035、高 1，缩放时保持世界粗细，仅高度取段长）
      const q = new Quaternion();
      const m = new Matrix();
      const s = new Vector3();
      for (let i = 0; i < path.length - 1; i++) {
        const a = path[i];
        const b = path[i + 1];
        const dir = b.subtract(a);
        const len = dir.length();
        dir.scaleInPlace(1 / (len || 1));
        quatFromUp(dir, q);
        const mid = a.add(b).scaleInPlace(0.5);
        s.set(1, len, 1);
        Matrix.ComposeToRef(s, q, mid, m);
        stemMatrices.push(...m.asArray());
      }

      // 叶片错落分布：3 片，交替方位；叶片基元沿 +Y 生长，俯仰角使叶片斜向上展开
      const leafNodes = [0.28, 0.48, 0.68];
      for (let k = 0; k < leafNodes.length; k++) {
        const t = leafNodes[k];
        const idx = Math.min(path.length - 1, Math.round(t * (path.length - 1)));
        const node = path[idx];
        const az = rng() * Math.PI * 2 + (k % 2) * Math.PI;
        const pitch = -(0.5 + rng() * 0.45); // 绕 X 负转：叶片由竖直转向水平伸出
        const lq = Quaternion.RotationYawPitchRoll(az, pitch, 0);
        const lscale = (0.75 + rng() * 0.5) * branch.scale;
        s.set(lscale, lscale, lscale);
        Matrix.ComposeToRef(s, lq, node, m);
        leafMatrices.push(...m.asArray());
      }

      const rootQ = Quaternion.RotationYawPitchRoll(branch.yaw, 0, 0);
      const rootScale = new Vector3(branch.scale, branch.scale, branch.scale);
      const rootMatrix = Matrix.Compose(rootScale, rootQ, path[path.length - 1]);
      this.scaffolds.set(branch.id, {
        rootMatrix,
        head: path[path.length - 1],
        scale: branch.scale,
        yaw: branch.yaw
      });
    }

    this.applyInstances(this.stemMesh, stemMatrices, null);
    this.applyInstances(this.leafMesh, leafMatrices, null);
  }

  /**
   * 按当前积温重算所有花朵形变与着色。
   * 曲线改动后只需重新传入新 curve，所有花枝统一按新曲线重算。
   */
  updateBloom(branches: Branch[], variety: Variety, curve: MonotoneCurve, gdd: number): void {
    const layout = this.ensureLayout(variety);
    const petalBuckets = new Map<string, PetalBucket>();
    const sepalBuckets = new Map<string, number[]>();
    this.lodCounts.fill(0);
    this.totalPetalInstances = 0;

    const localPos = new Vector3();
    const localQ = new Quaternion();
    const localScale = new Vector3();
    const localM = new Matrix();
    const combined = new Matrix();

    for (const branch of branches) {
      const scaffold = this.scaffolds.get(branch.id);
      if (!scaffold) continue;
      const effectiveGdd = gdd - branch.gddOffset;
      const openness = curve.evaluate(effectiveGdd);
      const tier = Math.min(LOD_TIERS - 1, Math.max(0, Math.floor(openness * LOD_TIERS)));
      this.lodCounts[tier]++;
      const state = computeBloomState(layout, variety.petal, variety.color, openness);

      const pKey = `${variety.id}:${tier}`;
      let bucket = petalBuckets.get(pKey);
      if (!bucket) {
        bucket = { matrices: [], colors: [] };
        petalBuckets.set(pKey, bucket);
      }

      for (const p of state.petals) {
        localPos.set(p.position.x, p.position.y, p.position.z);
        Quaternion.RotationYawPitchRollToRef(p.rotation.y, p.rotation.x, p.rotation.z, localQ);
        localScale.set(p.scale.x, p.scale.y, p.scale.z);
        Matrix.ComposeToRef(localScale, localQ, localPos, localM);
        // 世界矩阵 = 根（位置/偏航/缩放）× 局部（花瓣方位/展开），Babylon 约定 this*other
        localM.multiplyToRef(scaffold.rootMatrix, combined);
        bucket.matrices.push(...combined.asArray());
        bucket.colors.push(p.color.x, p.color.y, p.color.z, 1);
        this.totalPetalInstances++;
      }

      let sepalMats = sepalBuckets.get(variety.id);
      if (!sepalMats) {
        sepalMats = [];
        sepalBuckets.set(variety.id, sepalMats);
      }
      for (const sp of state.sepals) {
        localPos.set(sp.position.x, sp.position.y, sp.position.z);
        Quaternion.RotationYawPitchRollToRef(sp.rotation.y, sp.rotation.x, sp.rotation.z, localQ);
        localScale.set(sp.scale.x, sp.scale.y, sp.scale.z);
        Matrix.ComposeToRef(localScale, localQ, localPos, localM);
        localM.multiplyToRef(scaffold.rootMatrix, combined);
        sepalMats.push(...combined.asArray());
      }
    }

    // 应用到各 LOD 曲面网格（空分档隐藏）
    for (let tier = 0; tier < LOD_TIERS; tier++) {
      const key = `${variety.id}:${tier}`;
      const bucket = petalBuckets.get(key);
      const existing = this.petalMeshes.get(key);
      if (!bucket || bucket.matrices.length === 0) {
        if (existing) this.applyInstances(existing, [], []);
        continue;
      }
      const mesh = this.ensurePetalMesh(variety, tier);
      this.applyInstances(mesh, bucket.matrices, bucket.colors);
    }
    // 切换品种时隐藏上一品种遗留网格
    for (const [key, mesh] of this.petalMeshes) {
      if (!key.startsWith(variety.id + ':')) this.applyInstances(mesh, [], []);
    }

    const sepalMesh = this.ensureSepalMesh(variety);
    this.applyInstances(sepalMesh, sepalBuckets.get(variety.id) ?? [], null);
    for (const [vid, mesh] of this.sepalMeshes) {
      if (vid !== variety.id) this.applyInstances(mesh, [], null);
    }
  }

  private applyInstances(mesh: Mesh, matrices: number[], colors: number[] | null): void {
    if (matrices.length === 0) {
      mesh.thinInstanceSetBuffer('matrix', null, 16, false);
      if (colors !== null) {
        mesh.thinInstanceSetBuffer(VertexBuffer.ColorInstanceKind, null, 4, false);
      }
      mesh.setEnabled(false);
      return;
    }
    mesh.setEnabled(true);
    mesh.thinInstanceSetBuffer('matrix', new Float32Array(matrices), 16, false);
    if (colors !== null) {
      mesh.thinInstanceSetBuffer(
        VertexBuffer.ColorInstanceKind,
        new Float32Array(colors),
        4,
        false
      );
    }
  }

  getLodCounts(): number[] {
    return [...this.lodCounts];
  }

  getTotalPetalInstances(): number {
    return this.totalPetalInstances;
  }

  getEngineName(): string {
    return this.engineName;
  }

  /** 调试用场景访问器（DEV 钩子） */
  getScene(): Scene {
    return this.scene;
  }

  /** 渲染性能统计（合批后的 Draw Call 等） */
  getRenderStats(): {
    engine: string;
    drawCalls: number;
    activeMeshes: number;
    totalVertices: number;
    thinInstanceMeshes: number;
  } {
    return {
      engine: this.engineName,
      drawCalls: this.frameDrawCallsReady ? this.frameDrawCalls : this.engine._drawCalls.current,
      activeMeshes: this.scene
        .getActiveMeshes()
        .data.slice(0, this.scene.getActiveMeshes().length)
        .filter((m) => m.isEnabled()).length,
      totalVertices: this.scene.getTotalVertices(),
      thinInstanceMeshes:
        [...this.petalMeshes.values()].filter((m) => m.isEnabled()).length +
        (this.stemMesh.isEnabled() ? 1 : 0) +
        (this.leafMesh.isEnabled() ? 1 : 0) +
        [...this.sepalMeshes.values()].filter((m) => m.isEnabled()).length
    };
  }

  resize(): void {
    this.engine.resize();
  }

  dispose(): void {
    this.engine.stopRenderLoop();
    this.scene.dispose();
    this.engine.dispose();
  }
}

function quatFromUp(dir: Vector3, out: Quaternion): void {
  const dot = Math.max(-1, Math.min(1, Vector3.Dot(UP, dir)));
  if (dot > 0.9999) {
    out.copyFromFloats(0, 0, 0, 1);
    return;
  }
  if (dot < -0.9999) {
    out.copyFromFloats(1, 0, 0, 0);
    return;
  }
  const axis = Vector3.Cross(UP, dir);
  axis.normalize();
  const angle = Math.acos(dot);
  Quaternion.RotationAxisToRef(axis, angle, out);
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
