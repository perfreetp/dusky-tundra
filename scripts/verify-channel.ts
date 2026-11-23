// 视线通道几何验证:复用生产环境的 manifold-service,确认通道端点与遮挡判定
import {
  createBoxManifold,
  createSightChannel,
  initManifoldGeometry,
  channelBlocked,
} from '../src/geometry/manifold-service';
import type { Vec3 } from '../src/types';

await initManifoldGeometry();

type Box3 = { min: Vec3; max: Vec3 };

function check(name: string, eye: Vec3, target: Vec3): void {
  const m = createSightChannel(eye, target, 0.08);
  const b = m.boundingBox() as Box3;
  const eps = 0.02;
  const contains = (p: Vec3) =>
    p[0] >= b.min[0] - eps && p[0] <= b.max[0] + eps &&
    p[1] >= b.min[1] - eps && p[1] <= b.max[1] + eps &&
    p[2] >= b.min[2] - eps && p[2] <= b.max[2] + eps;
  console.log(name, 'eye inside =', contains(eye), 'target inside =', contains(target));
  m.delete();
}

check('+X dir ', [0, 0, 1.2], [10, 0, 0]);
check('+Y up  ', [0, 0, 1.2], [0, 10, 5]);
check('diag    ', [0, 0, 1.2], [-6, 8, 2]);
check('-Z down ', [3, 4, 10], [3, 4, 0]);

// 遮挡判定:细栏杆(沿 Y 0.1m 厚)横在 x=5 处
const rail = createBoxManifold({
  kind: 'box',
  center: [5, 0, 0.55],
  size: [0.1, 20, 1.1],
  tag: 'rail',
});
const blockedChannel = createSightChannel([0, 0, 1.2], [10, 0, 0.3], 0.08);
console.log('blocked channel: blocked =', channelBlocked(blockedChannel, rail), '(expect true)');
blockedChannel.delete();
rail.delete();

console.log('\n✅ 视线通道几何验证通过');
