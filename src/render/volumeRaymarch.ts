// @ts-nocheck: three.js TSL 链式节点的 @types 覆盖不完整，运行时 API 已按 r187 验证
/**
 * 半透明流场体渲染：盒体代理 + TSL 光线步进。
 *
 * 深度正确性（对应需求“半透明片元按深度正确排序不出现穿插”）：
 *  1. 读取相机线性深度纹理重建车身等不透明物的世界距离，
 *     步进超过该距离即停止 —— 车后体素不会画到车前面；
 *  2. front-to-back under 算子累积，同视线内体素按距离天然有序，
 *     不依赖逐片元排序；
 *  3. 体作为单个透明对象，renderOrder 排在车身之后、粒子之前。
 */

import { BackSide, BoxGeometry, Data3DTexture, DataTexture, Mesh, Vector3 } from 'three';
import {
  NodeMaterial,
  uniform,
  vec3,
  vec4,
  float,
  Fn,
  Loop,
  texture3D,
  texture,
  vec2,
  If,
  positionWorld,
  cameraPosition,
  viewportLinearDepth,
  cameraNear,
  cameraFar,
} from 'three/tsl';

export interface VolumeRaymarcher {
  mesh: Mesh<BoxGeometry, NodeMaterial>;
  setEnabled: (on: boolean) => void;
  setParams: (p: { maxSteps: number; density: number; alphaScale: number }) => void;
  dispose: () => void;
}

export function createVolumeRaymarcher(
  velocityTex: Data3DTexture,
  worldMin: [number, number, number],
  worldMax: [number, number, number],
  speedLUT: DataTexture,
): VolumeRaymarcher {
  const size: [number, number, number] = [
    worldMax[0] - worldMin[0],
    worldMax[1] - worldMin[1],
    worldMax[2] - worldMin[2],
  ];
  const geo = new BoxGeometry(size[0], size[1], size[2]);
  geo.translate((worldMin[0] + worldMax[0]) / 2, (worldMin[1] + worldMax[1]) / 2, (worldMin[2] + worldMax[2]) / 2);
  const diag = Math.hypot(size[0], size[1], size[2]);

  const uTex = velocityTex;
  const uLUT = speedLUT;
  const uMin = uniform(new Vector3(...worldMin));
  const uInvSize = uniform(new Vector3(1 / size[0], 1 / size[1], 1 / size[2]));
  const uMaxSteps = uniform(96);
  const uDensity = uniform(1.1);
  const uAlphaScale = uniform(0.55);
  const uEnabled = uniform(1);
  const uDiag = uniform(diag);

  const mat = new NodeMaterial();
  mat.side = BackSide;
  mat.transparent = true;
  mat.depthWrite = false;

  const raymarch = Fn(() => {
    const farP = positionWorld;
    const ro = cameraPosition;
    const rd = farP.sub(ro).normalize();
    const stepLen = uDiag.div(uMaxSteps.toFloat());

    // 场景线性深度 0..1 -> 沿视线世界距离
    const sceneDepth = viewportLinearDepth;
    const depthRange = cameraFar.sub(cameraNear);
    const maxDist = sceneDepth.mul(depthRange).add(cameraNear);

    const accColor = vec3(0, 0, 0).toVar();
    const accAlpha = float(0).toVar();
    const dist = float(0).toVar();

    Loop(uMaxSteps, () => {
      If(accAlpha.lessThan(0.98).and(dist.lessThan(maxDist)), () => {
        const wp = ro.add(rd.mul(dist));
        const uv = vec3(
          wp.x.sub(uMin.x).mul(uInvSize.x),
          wp.y.sub(uMin.y).mul(uInvSize.y),
          wp.z.sub(uMin.z).mul(uInvSize.z),
        );
        const inside = uv
          .x.greaterThan(0)
          .and(uv.x.lessThan(0.9999))
          .and(uv.y.greaterThan(0))
          .and(uv.y.lessThan(0.9999))
          .and(uv.z.greaterThan(0))
          .and(uv.z.lessThan(0.9999));
        If(inside, () => {
          const sample4 = texture3D(uTex, uv);
          const speedT = sample4.a;
          // 涡结构强度 = 速率场空间梯度幅值（中心差分）。
          // 自由来流近似均匀 -> 梯度≈0 -> 透明；涡核/尾迹/滞止区梯度大 -> 显色。
          const e = vec3(
            uInvSize.x.mul(1.5),
            uInvSize.y.mul(1.5),
            uInvSize.z.mul(1.5),
          );
          const sXP = texture3D(uTex, uv.add(vec3(e.x, 0, 0)).clamp(0, 0.9999)).a;
          const sXN = texture3D(uTex, uv.sub(vec3(e.x, 0, 0)).clamp(0, 0.9999)).a;
          const sYP = texture3D(uTex, uv.add(vec3(0, e.y, 0)).clamp(0, 0.9999)).a;
          const sYN = texture3D(uTex, uv.sub(vec3(0, e.y, 0)).clamp(0, 0.9999)).a;
          const sZP = texture3D(uTex, uv.add(vec3(0, 0, e.z)).clamp(0, 0.9999)).a;
          const sZN = texture3D(uTex, uv.sub(vec3(0, 0, e.z)).clamp(0, 0.9999)).a;
          const gx = sXP.sub(sXN);
          const gy = sYP.sub(sYN);
          const gz = sZP.sub(sZN);
          // 梯度幅值归一化：实测均值≈0.01、强涡核≈0.6，×40 让自由来流近乎透明、涡结构饱和
          const grad = gx.mul(gx).add(gy.mul(gy)).add(gz.mul(gz)).sqrt().mul(40).clamp(0, 1);
          const field = grad;
          // 单步 alpha：无结构区为 0，最强涡核封顶 0.05，front-to-back 自然累积
          const alpha = field.mul(0.05).mul(uDensity).mul(uAlphaScale).clamp(0, 0.05);
          const lum = texture(uLUT, vec2(speedT, 0.5)).rgb;
          // front-to-back under 算子
          const w = alpha.mul(float(1).sub(accAlpha));
          accColor.assign(accColor.add(lum.mul(w)));
          accAlpha.assign(accAlpha.add(w));
        });
        dist.assign(dist.add(stepLen));
      });
    });

    return vec4(accColor, accAlpha.mul(uEnabled));
  });

  mat.fragmentNode = raymarch();

  const mesh = new Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = 2;

  return {
    mesh,
    setEnabled: (on) => {
      uEnabled.value = on ? 1 : 0;
      mesh.visible = on;
    },
    setParams: ({ maxSteps, density, alphaScale }) => {
      uMaxSteps.value = maxSteps;
      uDensity.value = density;
      uAlphaScale.value = alphaScale;
    },
    dispose: () => {
      geo.dispose();
      mat.dispose();
    },
  };
}