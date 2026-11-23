/**
 * 摆幅模型：两端铰支弦的一阶模态叠加。
 * 逐帧（L2）调用，原地把摆幅位移叠加到渲染缓冲，不写回基准姿态缓存。
 */
import type { FloorState, RopeDefinition, RopePose } from '../model/types';
import { clamp } from '../math/interpolate';

const TWO_PI = Math.PI * 2;

/**
 * 对整根绳施加摆幅。
 * @param base 基准姿态（L1，只读）
 * @param rendered 渲染缓冲（可与 base 不同数组；首节点从 base 拷贝后叠加）
 * @param time 秒
 * @param floor 当前档位
 */
export function applySwing(
  def: RopeDefinition,
  base: RopePose,
  rendered: Float32Array,
  time: number,
  floor: FloorState,
  clearances: Float32Array,
  ropeRadius: number,
  margin: number,
): void {
  const { lateralDir, baseAmplitude, damping, phase } = def.swing;
  const n = base.nodeCount;

  // 找各自由段的 Y 范围
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < n; i++) {
    if (base.arcFlags[i] === 1) continue;
    const y = base.positions[i * 3 + 1]!;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  if (!Number.isFinite(minY)) {
    rendered.set(base.positions.subarray(0, n * 3));
    return;
  }
  const spanLen = Math.max(1e-6, maxY - minY);

  // 弦一阶固有频率 ω1 = (π/L)·sqrt(T/μ)，取段内平均张力
  let tSum = 0;
  let tCnt = 0;
  for (let i = 0; i < n; i++) {
    if (base.arcFlags[i] === 0) {
      tSum += base.tension[i]!;
      tCnt++;
    }
  }
  const tAvg = tCnt > 0 ? tSum / tCnt : 1;
  const omega = (Math.PI / spanLen) * Math.sqrt(Math.max(1, tAvg) / Math.max(1e-6, def.linearDensity));

  // 档位因子：速度 + 加速度
  const kv = clamp(Math.abs(floor.speed) / 2.5, 0, 1) + 0.5 * clamp(Math.abs(floor.acceleration) / 1.2, 0, 1);
  const kq = 0.6 + 0.8 * floor.loadCoeff;
  const amplitude = baseAmplitude * kv * kq * Math.sqrt(spanLen / 10);
  const decay = Math.exp(-damping * time * 0.1);
  const g = Math.sin(omega * time + phase) * decay;

  for (let i = 0; i < n; i++) {
    const o = i * 3;
    rendered[o] = base.positions[o]!;
    rendered[o + 1] = base.positions[o + 1]!;
    rendered[o + 2] = base.positions[o + 2]!;
    if (base.arcFlags[i] === 1) continue;

    const xi = clamp((base.positions[o + 1]! - minY) / spanLen, 0, 1);
    const mode = Math.sin(Math.PI * xi) + 0.15 * Math.sin(TWO_PI * xi);
    let dx = lateralDir[0] * amplitude * mode * g;
    let dy = lateralDir[1] * amplitude * mode * g;
    let dz = lateralDir[2] * amplitude * mode * g;

    // 净空钳制（零 BVH）：位移模长不得超过 clearance - r - margin
    const limit = clearances[i]! - ropeRadius - margin;
    const mag = Math.hypot(dx, dy, dz);
    if (limit > 0 && mag > limit) {
      const s = limit / mag;
      dx *= s;
      dy *= s;
      dz *= s;
    } else if (limit <= 0) {
      dx = 0;
      dy = 0;
      dz = 0;
    }
    rendered[o] = rendered[o]! + dx;
    rendered[o + 1] = rendered[o + 1]! + dy;
    rendered[o + 2] = rendered[o + 2]! + dz;
  }
}
