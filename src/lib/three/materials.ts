import * as THREE from 'three';
import type { MaterialState } from '../types';

/** 在画布上绘制噪点(白底暗点,作为乘法贴图) */
function drawSpeckle(canvas: HTMLCanvasElement, density: number, amp: number, seed: number): void {
  const size = canvas.width;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  let s = seed;
  const rnd = (): number => (s = (s * 16807) % 2147483647) / 2147483647;
  const n = Math.floor(density * 4200);
  for (let i = 0; i < n; i++) {
    const g = Math.max(0, Math.min(255, Math.round(255 - amp * 255 * rnd())));
    ctx.fillStyle = `rgb(${g},${g},${g})`;
    const r = 1 + rnd() * 1.5;
    ctx.fillRect(rnd() * size, rnd() * size, r, r);
  }
}

/** 金属片法线贴图(以 (128,128,255) 为基准的随机扰动) */
function drawFlakeNormal(canvas: HTMLCanvasElement, density: number, seed: number): void {
  const size = canvas.width;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'rgb(128,128,255)';
  ctx.fillRect(0, 0, size, size);
  let s = seed;
  const rnd = (): number => (s = (s * 16807) % 2147483647) / 2147483647;
  const n = Math.floor(density * 5000);
  for (let i = 0; i < n; i++) {
    const rC = 128 + Math.floor((rnd() - 0.5) * 160);
    const gC = 128 + Math.floor((rnd() - 0.5) * 160);
    ctx.fillStyle = `rgb(${rC},${gC},255)`;
    const r = 1 + rnd() * 1.5;
    ctx.fillRect(rnd() * size, rnd() * size, r, r);
  }
}

function makeTex(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(24, 24);
  return t;
}

/**
 * 三层车漆材质:
 *  - 底色层:map(涂装图集)+ roughness/metalness
 *  - 金属漆层:程序化片状颗粒(法线扰动 + 粗糙度/金属度噪点贴图)
 *  - 清漆层:clearcoat + clearcoatRoughness,金属度映射为反射强度
 */
export class LiveryMaterial {
  readonly material: THREE.MeshPhysicalMaterial;
  private roughCanvas: HTMLCanvasElement;
  private metalCanvas: HTMLCanvasElement;
  private normalCanvas: HTMLCanvasElement;
  private roughTex: THREE.CanvasTexture;
  private metalTex: THREE.CanvasTexture;
  private normalTex: THREE.CanvasTexture;

  constructor(decalTexture: THREE.Texture) {
    this.roughCanvas = document.createElement('canvas');
    this.metalCanvas = document.createElement('canvas');
    this.normalCanvas = document.createElement('canvas');
    this.roughCanvas.width = this.roughCanvas.height = 256;
    this.metalCanvas.width = this.metalCanvas.height = 256;
    this.normalCanvas.width = this.normalCanvas.height = 256;
    this.roughTex = makeTex(this.roughCanvas);
    this.metalTex = makeTex(this.metalCanvas);
    this.normalTex = makeTex(this.normalCanvas);

    this.material = new THREE.MeshPhysicalMaterial({
      map: decalTexture,
      side: THREE.DoubleSide,
      roughnessMap: this.roughTex,
      metalnessMap: this.metalTex,
      normalMap: this.normalTex,
      normalScale: new THREE.Vector2(0.3, 0.3),
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    });
  }

  update(m: MaterialState): void {
    const mat = this.material;
    // 底色层
    mat.roughness = m.base.roughness;
    // 金属漆层的金属度叠加进整体金属度,使片状颗粒可见
    mat.metalness = Math.min(1, m.base.metalness + m.flake.metalness * m.flake.intensity * 0.5);
    // 金属漆层:颗粒密度/强度与粗糙度、金属度起伏
    mat.normalScale.setScalar(0.04 + m.flake.intensity * 0.5);
    drawSpeckle(this.roughCanvas, 0.35 + m.flake.intensity * 0.6, m.flake.roughness * m.flake.intensity, 7);
    drawSpeckle(this.metalCanvas, 0.35 + m.flake.intensity * 0.6, m.flake.metalness * m.flake.intensity, 13);
    drawFlakeNormal(this.normalCanvas, 0.3 + m.flake.intensity * 0.7, 29);
    this.roughTex.needsUpdate = true;
    this.metalTex.needsUpdate = true;
    this.normalTex.needsUpdate = true;
    // 清漆层
    mat.clearcoat = m.coat.intensity;
    mat.clearcoatRoughness = m.coat.roughness;
    // 清漆"金属度"映射为环境反射强度
    mat.envMapIntensity = m.envIntensity * (0.4 + m.coat.metalness * 1.2);
  }
}
