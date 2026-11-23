/**
 * 生成两份符合导入格式的模板 JSON（表面压力 + 速度场），
 * 输出到 public/sample-data/ 供用户下载参考或直接导入验证。
 * 运行：npx tsx scripts/generate-template.ts
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { buildSurfaceDataset, buildVolumeDataset } from '../src/data/sampleGenerator';

mkdirSync('public/sample-data', { recursive: true });

const surface = buildSurfaceDataset();
const volume = buildVolumeDataset();

// 去掉仅运行时使用的指纹字段，保持模板与公开格式一致
const { fingerprint: _fp1, ...surfacePublic } = surface;
const { fingerprint: _fp2, ...volumePublic } = volume;
void _fp1;
void _fp2;

writeFileSync('public/sample-data/surface-pressure.json', JSON.stringify(surfacePublic, null, 2));
writeFileSync('public/sample-data/velocity-volume.json', JSON.stringify(volumePublic, null, 2));
writeFileSync(
  'public/sample-data/bundle.json',
  JSON.stringify([surfacePublic, volumePublic]),
);

console.log('模板已写入 public/sample-data/');
console.log('  surface-pressure.json');
console.log('  velocity-volume.json');
console.log('  bundle.json（两个数据集打包，可一次导入）');
