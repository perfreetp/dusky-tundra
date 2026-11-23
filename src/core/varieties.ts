import type { Variety } from '../types';

/** 内置品种：曲线控制点与花瓣参数均可在品种页编辑 */
export const DEFAULT_VARIETIES: Variety[] = [
  {
    id: 'var-crimson-glory',
    name: '深红荣耀（HT 杂交茶香）',
    petal: {
      layers: 7,
      petalsPerLayer: 8,
      length: 0.55,
      width: 0.42,
      bend: [-0.1, -0.28, -0.18, 0.12],
      curl: [0.02, 0.08, 0.18, 0.3],
      segU: 10,
      segV: 14
    },
    curve: [
      { gdd: 0, open: 0 },
      { gdd: 120, open: 0.08 },
      { gdd: 260, open: 0.32 },
      { gdd: 420, open: 0.68 },
      { gdd: 560, open: 0.92 },
      { gdd: 620, open: 1 }
    ],
    color: {
      deep: { x: 0.42, y: 0.02, z: 0.08 },
      pale: { x: 0.98, y: 0.62, z: 0.72 }
    }
  },
  {
    id: 'var-pink-chiffon',
    name: '粉雪纺（丛生丰花）',
    petal: {
      layers: 9,
      petalsPerLayer: 10,
      length: 0.46,
      width: 0.38,
      bend: [-0.06, -0.18, -0.05, 0.22],
      curl: [0.01, 0.05, 0.12, 0.22],
      segU: 10,
      segV: 14
    },
    curve: [
      { gdd: 0, open: 0 },
      { gdd: 100, open: 0.12 },
      { gdd: 220, open: 0.4 },
      { gdd: 340, open: 0.72 },
      { gdd: 440, open: 0.95 },
      { gdd: 480, open: 1 }
    ],
    color: {
      deep: { x: 0.72, y: 0.12, z: 0.28 },
      pale: { x: 1.0, y: 0.78, z: 0.85 }
    }
  },
  {
    id: 'var-bud-firm',
    name: '紧苞红衣（耐储运切花）',
    petal: {
      layers: 6,
      petalsPerLayer: 7,
      length: 0.6,
      width: 0.36,
      bend: [-0.18, -0.4, -0.3, -0.05],
      curl: [0, 0.03, 0.1, 0.18],
      segU: 10,
      segV: 14
    },
    curve: [
      { gdd: 0, open: 0 },
      { gdd: 160, open: 0.05 },
      { gdd: 340, open: 0.22 },
      { gdd: 520, open: 0.55 },
      { gdd: 660, open: 0.9 },
      { gdd: 720, open: 1 }
    ],
    color: {
      deep: { x: 0.35, y: 0.01, z: 0.05 },
      pale: { x: 0.95, y: 0.5, z: 0.6 }
    }
  }
];
