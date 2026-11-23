// 端到端评分流水线验证:射线预筛 + manifold 布尔两层判定
import {
  buildBlockerSet,
  buildBlockerUnion,
  channelBlocked,
  channelBlockedBySet,
  createSightChannel,
  initManifoldGeometry,
  type BlockerSet,
  type Manifold,
} from '../src/geometry/manifold-service';
import { normalize, rayBoxHit, sub } from '../src/utils/math3d';
import {
  buildAllSpectatorProxies,
  generateDemoVenue,
  applyEyeHeight,
} from '../src/venue/demo-venue';
import type { OccluderBox, ScoreRequest, Vec3 } from '../src/types';

await initManifoldGeometry();

const venue = generateDemoVenue();
console.log(`场馆:${venue.name},座席 ${venue.seats.length},遮挡物 ${venue.occluders.length}`);

applyEyeHeight(venue.seats, 1.2);
const proxyMap = buildAllSpectatorProxies(venue.seats);

const sample = venue.seats.filter((_, i) => i % 16 === 0).slice(0, 300);
const req: ScoreRequest = {
  seats: sample.map((s) => ({ id: s.id, eye: s.eye })),
  targets: venue.targets,
  occluders: venue.occluders,
  spectatorProxies: sample
    .map((s) => ({ seatId: s.id, boxes: proxyMap.get(s.id) ?? [] }))
    .filter((x) => x.boxes.length > 0),
  eyeHeight: 1.2,
  channelRadius: 0.08,
};

const structural: BlockerSet = buildBlockerSet(req.occluders);
const specBoxesMap = new Map(req.spectatorProxies.map((g) => [g.seatId, g.boxes]));
const specUnions = new Map<number, Manifold>();

function rayHitsAny(eye: Vec3, target: Vec3, boxes: OccluderBox[]): boolean {
  const dir = normalize(sub(target, eye));
  const d = Math.hypot(target[0] - eye[0], target[1] - eye[1], target[2] - eye[2]);
  for (const box of boxes) {
    const t = rayBoxHit(eye, dir, box.center, box.size, box.yaw ?? 0);
    if (t !== null && t <= d) return true;
  }
  return false;
}

let fullyVisible = 0;
let partial = 0;
let bad = 0;
let booleans = 0;
let rayChecks = 0;
const scoreDist = new Map<number, number>();

const t1 = performance.now();
for (const s of req.seats) {
  let score = 0;
  for (const target of req.targets) {
    rayChecks++;
    const sHit = rayHitsAny(s.eye, target.position, req.occluders);
    const specBoxes = specBoxesMap.get(s.id);
    const pHit = !sHit && specBoxes ? rayHitsAny(s.eye, target.position, specBoxes) : false;

    if (!sHit && !pHit) {
      score += 1;
      continue;
    }

    booleans++;
    const ch = createSightChannel(s.eye, target.position, req.channelRadius);
    let label: string | null = null;
    if (sHit) label = channelBlockedBySet(ch, structural);
    if (label === null && pHit && specBoxes) {
      let u = specUnions.get(s.id);
      if (!u) {
        u = buildBlockerUnion(specBoxes);
        specUnions.set(s.id, u);
      }
      if (channelBlocked(ch, u)) label = '前排观众';
    }
    ch.delete();

    if (label === null) score += 1;
    else if (label.includes('观众')) score += 0.5;
  }
  const pct = Math.round((score / req.targets.length) * 100);
  scoreDist.set(pct, (scoreDist.get(pct) ?? 0) + 1);
  if (pct === 100) fullyVisible++;
  else if (pct >= 50) partial++;
  else bad++;
}
const dt = performance.now() - t1;

structural.union.delete();
for (const t of structural.tagged) t.manifold.delete();
for (const u of specUnions.values()) u.delete();

console.log(`${sample.length} 席 × ${req.targets.length} 目标:射线 ${rayChecks} 次,manifold 布尔 ${booleans} 次(占比 ${(100 * booleans / rayChecks).toFixed(0)}%)`);
console.log(`评分耗时 ${dt.toFixed(0)}ms(每席 ${(dt / sample.length).toFixed(2)}ms)`);
console.log(`全可见 ${fullyVisible} / 部分遮挡 ${partial} / 严重遮挡 ${bad}`);
console.log('分数分布:', [...scoreDist.entries()].sort((a, b) => a[0] - b[0]).map(([k, v]) => `${k}分:${v}`).join('  '));

if (fullyVisible + partial + bad !== sample.length) throw new Error('座席计数不一致');
if (fullyVisible === sample.length) throw new Error('所有座席全部可见,遮挡判定可能失效');
console.log('\n✅ 两层评分流水线验证通过');
