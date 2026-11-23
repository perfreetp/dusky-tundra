/**
 * 引擎渲染与交互的全局配置常量。
 */
export const ENGINE_CONFIG = {
  clearColor: 0x0e1420,
  cameraFov: 50,
  cameraNear: 0.05,
  cameraFar: 200,
  initialCamera: [9, 30, 12] as [number, number, number],
  initialTarget: [0, 20, 0] as [number, number, number],
  ropeOpacity: 0.55,
  steelColor: 0x8a94a3,
  railColor: 0x5c6675,
  carColor: 0x2f7dd1,
  cwColor: 0x9a6b3f,
  sheaveColor: 0xb8c0cc,
  clipPlaneColor: 0x35e0d0,
  capColor: 0xf2d88a,
} as const;

/** 张力色标 LUT（蓝→青→绿→黄→红），与 DOM 图例共用 */
export const TENSION_LUT_STOPS: [number, [number, number, number]][] = [
  [0.0, [0.13, 0.35, 0.95]],
  [0.25, [0.1, 0.8, 0.85]],
  [0.5, [0.25, 0.85, 0.35]],
  [0.75, [0.98, 0.82, 0.2]],
  [1.0, [0.95, 0.22, 0.18]],
];
