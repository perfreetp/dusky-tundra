// 冒烟测试:在 Node 中加载构建产物里的 deform worker,
// 用 20 万顶点合成网格验证 init / collide / reset 与性能。
import { performance } from 'node:perf_hooks';
import { readdirSync } from 'node:fs';

const file = readdirSync('./dist/assets').find((f) => f.startsWith('deform.worker'));
if (!file) throw new Error('worker bundle not found, run npm run build first');

const handlers = {};
globalThis.self = {
  onmessage: null,
  postMessage(msg) {
    handlers.onResult?.(msg);
  },
};
globalThis.performance = performance;

await import(`../dist/assets/${file}`);

function send(msg) {
  return new Promise((resolve) => {
    handlers.onResult = resolve;
    self.onmessage({ data: msg });
  });
}

// 合成 20 万顶点网格(规则栅格管状结构)
function makeGrid(nx, ny, nz) {
  const positions = [];
  const indices = [];
  const idx = (i, j, k) => i * ny * nz + j * nz + k;
  for (let i = 0; i < nx; i++)
    for (let j = 0; j < ny; j++)
      for (let k = 0; k < nz; k++)
        positions.push((i / (nx - 1)) * 4 - 2, (j / (ny - 1)) * 1.8 - 0.9, (k / (nz - 1)) * 1.3);
  for (let i = 0; i < nx - 1; i++)
    for (let j = 0; j < ny - 1; j++)
      for (let k = 0; k < nz - 1; k++) {
        const a = idx(i, j, k), b = idx(i + 1, j, k), c = idx(i, j + 1, k), d = idx(i, j, k + 1);
        indices.push(a, b, c, b, d, c);
      }
  return { positions: new Float32Array(positions), indices: new Uint32Array(indices) };
}

const { positions, indices } = makeGrid(60, 60, 56); // 201,600 顶点
const n = positions.length / 3;
console.log(`vertices: ${n}, tris: ${indices.length / 3}`);

const zones = new Uint8Array(n);
for (let i = 0; i < n; i++) zones[i] = positions[i * 3] < 0 ? 0 : 1;

let t0 = performance.now();
let r = await send({
  id: 1,
  type: 'init',
  parts: [{ name: 'test', positions, indices, zoneOfVertex: zones }],
  yieldStrengths: [250, 550],
});
console.log(`init: ${(performance.now() - t0).toFixed(0)} ms, volume=${r.volumes[0].toFixed(4)}`);

for (let c = 0; c < 3; c++) {
  t0 = performance.now();
  r = await send({ id: 2 + c, type: 'collide', dir: [1, 0, 0], impulse: 8000 });
  const wall = performance.now() - t0;
  console.log(
    `collide #${c + 1}: worker=${r.timeMs.toFixed(0)} ms, wall=${wall.toFixed(0)} ms, maxStress=${r.maxStress.toFixed(1)} MPa, exceeded=${r.exceeded}, vol=${r.volumes[0].toFixed(4)}`,
  );
}

// 位移合理性:碰撞后前端顶点应沿 -X 移动
const out = r.positions[0];
let minX0 = Infinity, minX1 = Infinity;
for (let i = 0; i < n; i++) {
  minX0 = Math.min(minX0, positions[i * 3]);
  minX1 = Math.min(minX1, out[i * 3]);
}
console.log(`front x: ${minX0.toFixed(3)} -> ${minX1.toFixed(3)} (应向 +X 方向溃缩,即 minX 增大)`);

t0 = performance.now();
r = await send({ id: 9, type: 'reset' });
console.log(`reset: ${(performance.now() - t0).toFixed(0)} ms, maxStress=${r.maxStress}`);
console.log('SMOKE OK');
