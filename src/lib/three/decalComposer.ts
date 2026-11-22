import * as THREE from 'three';
import { atlasToPanel, surfaceJacobian } from './carBody';
import { drawStar } from '../shapes';
import type { Decal } from '../types';

/**
 * 贴花合成器:把全部贴花绘制到一张 UV 图集画布上,作为车身材质的 map。
 *
 * 曲率补偿:在贴花中心处求参数曲面的雅可比 G(把 (du,dv) 映射为曲面
 * 上的米制位移),绘制时施加 D·G⁻¹·R·k 的仿射变换,使贴花在曲面上
 * 各向同性——即在曲率大的区域自动反向拉伸,视觉上不变形。
 *
 * 接缝连续:车身面板沿 v 方向绘制 ±1 周期的环绕副本,跨越图集上下
 * 边缘(车底切口)的贴花在接缝两侧像素完全一致。
 */
export class DecalComposer {
  canvas: HTMLCanvasElement;
  texture: THREE.CanvasTexture;
  baseColor = '#c8102e';
  custom = false;
  private ctx: CanvasRenderingContext2D;

  constructor(public size = 2048) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = size;
    this.ctx = this.canvas.getContext('2d')!;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.flipY = false;
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = 8;
  }

  setSize(size: number): void {
    if (size === this.size) return;
    this.size = size;
    this.canvas.width = this.canvas.height = size;
  }

  render(decals: Decal[]): void {
    const { ctx, size } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = this.baseColor;
    ctx.fillRect(0, 0, size, size);
    for (const d of decals) this.drawDecal(d);
    this.texture.needsUpdate = true;
  }

  private drawDecal(d: Decal): void {
    const hit = atlasToPanel(d.x, d.y, this.custom);
    if (!hit) return;
    const { panel, u, v, region } = hit;
    const S = this.size;
    const cx = d.x * S;
    const cy = d.y * S;

    // 仿射矩阵 [a, b, c, d](canvas setTransform 约定)
    let m: [number, number, number, number];
    if (panel === 'custom') {
      // 导入车身无解析曲面,按平均比例近似
      const k = d.size * S * 0.18;
      m = [k, 0, 0, k];
    } else {
      const { su, sv } = surfaceJacobian(panel, u, v);
      const e1 = su.clone().normalize();
      const svProj = sv.clone().sub(e1.clone().multiplyScalar(sv.dot(e1)));
      const e2 = svProj.lengthSq() > 1e-12 ? svProj.normalize() : new THREE.Vector3(0, 1, 0);
      const g00 = su.dot(e1);
      const g01 = sv.dot(e1);
      const g11 = sv.dot(e2);
      const det = g00 * g11 || 1e-9;
      // G⁻¹:(du,dv) <- 曲面上的米制位移
      const i00 = g11 / det;
      const i01 = -g01 / det;
      const i11 = g00 / det;
      const r = (d.rotation * Math.PI) / 180;
      const cos = Math.cos(r);
      const sin = Math.sin(r);
      // A = G⁻¹·R
      const a00 = i00 * cos + i01 * sin;
      const a01 = -i00 * sin + i01 * cos;
      const a10 = i11 * sin;
      const a11 = i11 * cos;
      const k = d.size;
      const rw = (region.x1 - region.x0) * S;
      const rh = (region.y1 - region.y0) * S;
      // M = D·A·k,D 把 (u,v) 单位换算为图集像素
      m = [rw * a00 * k, rh * a10 * k, rw * a01 * k, rh * a11 * k];
    }

    const rx = region.x0 * S;
    const ry = region.y0 * S;
    const rwPx = (region.x1 - region.x0) * S;
    const rhPx = (region.y1 - region.y0) * S;
    // 车身面板沿 v 环绕,绘制 ±1 周期副本保证接缝连续
    const wraps = panel === 'body' && !this.custom ? [0, -rhPx, rhPx] : [0];

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(rx, ry, rwPx, rhPx);
    this.ctx.clip();
    for (const dy of wraps) {
      this.ctx.setTransform(m[0], m[1], m[2], m[3], cx, cy + dy);
      this.paint(d);
    }
    this.ctx.restore();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /** 在单位坐标系(1 单位 = size 米)下绘制贴花形状 */
  private paint(d: Decal): void {
    const ctx = this.ctx;
    ctx.fillStyle = d.color;
    switch (d.type) {
      case 'text': {
        ctx.save();
        ctx.scale(0.01, 0.01);
        ctx.font = `700 100px ${d.font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(d.text || ' ', 0, 0);
        ctx.restore();
        break;
      }
      case 'rect':
        ctx.fillRect(-0.5, -0.3, 1, 0.6);
        break;
      case 'stripe':
        ctx.fillRect(-0.5, -0.12, 1, 0.24);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, 0.5, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -0.5);
        ctx.lineTo(0.5, 0.4);
        ctx.lineTo(-0.5, 0.4);
        ctx.closePath();
        ctx.fill();
        break;
      case 'star':
        drawStar(ctx);
        break;
    }
  }
}
