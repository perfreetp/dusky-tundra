/**
 * TypedArray1D <-> base64 编解码（小端序）。
 * 浏览器 atob/btoa 不支持 unicode，这里走分块二进制字符串，避免栈溢出。
 */

import type { TypedArray1D } from '../types/dataset';

const CHUNK = 0x8000;

export function base64FromUint8(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

export function uint8FromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += CHUNK) {
    const end = Math.min(i + CHUNK, bin.length);
    for (let j = i; j < end; j++) out[j] = bin.charCodeAt(j);
  }
  return out;
}

export function encodeFloat32(values: Float32Array): TypedArray1D {
  return {
    encoding: 'base64',
    dtype: 'float32',
    count: values.length,
    data: base64FromUint8(new Uint8Array(values.buffer, values.byteOffset, values.byteLength)),
  };
}

export function encodeUint32(values: Uint32Array): TypedArray1D {
  return {
    encoding: 'base64',
    dtype: 'uint32',
    count: values.length,
    data: base64FromUint8(new Uint8Array(values.buffer, values.byteOffset, values.byteLength)),
  };
}

/** 把任意 TypedArray1D 解码为具体类型化数组 */
export function decodeArray(field: TypedArray1D): Float32Array | Uint32Array {
  if (Array.isArray(field)) {
    return new Float32Array(field);
  }
  const bytes = uint8FromBase64(field.data);
  switch (field.dtype) {
    case 'float32': {
      if (bytes.byteLength !== field.count * 4) {
        throw new Error(`float32 数据长度不匹配：期望 ${field.count * 4} 字节，实际 ${bytes.byteLength}`);
      }
      return new Float32Array(bytes.buffer, bytes.byteOffset, field.count);
    }
    case 'uint32': {
      if (bytes.byteLength !== field.count * 4) {
        throw new Error(`uint32 数据长度不匹配：期望 ${field.count * 4} 字节，实际 ${bytes.byteLength}`);
      }
      return new Uint32Array(bytes.buffer, bytes.byteOffset, field.count);
    }
    case 'uint16': {
      if (bytes.byteLength !== field.count * 2) {
        throw new Error(`uint16 数据长度不匹配：期望 ${field.count * 2} 字节，实际 ${bytes.byteLength}`);
      }
      // 统一提升到 uint32 返回，调用方按索引语义使用
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      const out = new Uint32Array(field.count);
      for (let i = 0; i < field.count; i++) out[i] = view.getUint16(i * 2, true);
      return out;
    }
  }
}

export function asFloat32(field: TypedArray1D): Float32Array {
  const a = decodeArray(field);
  return a instanceof Float32Array ? a : Float32Array.from(a);
}

export function asUint32(field: TypedArray1D): Uint32Array {
  const a = decodeArray(field);
  return a instanceof Uint32Array ? a : Uint32Array.from(a);
}

/** 数据指纹：抽样哈希，用于分享文件校验当前载入的数据是否一致（非加密用途） */
export function fingerprintFloat32(values: Float32Array, salt = 0): string {
  let h1 = 0xdeadbeef ^ salt;
  let h2 = 0x41c6ce57 ^ salt;
  const step = Math.max(1, Math.floor(values.length / 4096));
  for (let i = 0; i < values.length; i += step) {
    const w = values[i];
    const n = Number.isFinite(w) ? w : 0;
    const bits = new DataView(new ArrayBuffer(4));
    bits.setFloat32(0, n, true);
    const k = bits.getUint32(0, true);
    h1 = Math.imul(h1 ^ k, 2654435761);
    h2 = Math.imul(h2 ^ ((k >>> 13) | (i & 0xffff)), 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const h = (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
  return `s${values.length.toString(36)}-${h}`;
}
