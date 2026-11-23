import { describe, it, expect } from 'vitest';
import {
  base64FromUint8,
  uint8FromBase64,
  encodeFloat32,
  asFloat32,
  asUint32,
  fingerprintFloat32,
} from '../data/encoding';

describe('base64 编解码', () => {
  it('分块路径往返一致（含 >32KB 大数据）', () => {
    const bytes = new Uint8Array(40000);
    for (let i = 0; i < bytes.length; i++) bytes[i] = (i * 31 + 7) & 0xff;
    const b64 = base64FromUint8(bytes);
    const back = uint8FromBase64(b64);
    expect(back.length).toBe(bytes.length);
    let diff = 0;
    for (let i = 0; i < bytes.length; i++) if (back[i] !== bytes[i]) diff++;
    expect(diff).toBe(0);
  });

  it('float32 / uint32 往返保留位模式', () => {
    const f = new Float32Array([-2.5, 0, 1.25, 1e6, Number.NaN]);
    const back = asFloat32(encodeFloat32(f));
    expect(back.length).toBe(5);
    expect(back[0]).toBeCloseTo(-2.5);
    expect(back[2]).toBeCloseTo(1.25);
    expect(back[3]).toBe(1e6);
    expect(Number.isNaN(back[4])).toBe(true);
  });

  it('长度不匹配时抛错', () => {
    const bad = { encoding: 'base64' as const, dtype: 'float32' as const, count: 99, data: base64FromUint8(new Uint8Array(4)) };
    expect(() => asFloat32(bad)).toThrow(/不匹配/);
  });

  it('指纹对相同数据稳定、对不同数据变化', () => {
    const a = new Float32Array(1000).map((_, i) => Math.sin(i));
    const b = new Float32Array(1000).map((_, i) => Math.sin(i));
    const c = new Float32Array(1000).map((_, i) => Math.cos(i));
    expect(fingerprintFloat32(a)).toBe(fingerprintFloat32(b));
    expect(fingerprintFloat32(a)).not.toBe(fingerprintFloat32(c));
  });

  it('uint16 提升为 uint32', () => {
    const u16 = new Uint16Array([0, 1, 65535, 1234]);
    const bytes = new Uint8Array(u16.buffer);
    const field = {
      encoding: 'base64' as const,
      dtype: 'uint16' as const,
      count: 4,
      data: base64FromUint8(bytes),
    };
    const back = asUint32(field);
    expect(Array.from(back)).toEqual([0, 1, 65535, 1234]);
  });
});
