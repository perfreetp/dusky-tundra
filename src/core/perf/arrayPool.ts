/**
 * TypedArray 池：按 (每元素长度) 维度借还，避免热路径 GC。
 * 泛型构造器参数化以支持 Float32Array / Uint8Array / Uint16Array。
 */
interface PoolEntry<T extends { length: number }> {
  buffer: T;
  free: boolean;
}

export class ArrayPool<T extends { length: number }> {
  private entries: PoolEntry<T>[] = [];
  private readonly ctor: new (length: number) => T;

  constructor(ctor: new (length: number) => T) {
    this.ctor = ctor;
  }

  /** 借出一个长度 >= length 的数组（不保证清零，调用方自行覆写有效区间） */
  acquire(length: number): T {
    for (const e of this.entries) {
      if (e.free && e.buffer.length >= length) {
        e.free = false;
        return e.buffer;
      }
    }
    const buffer = new this.ctor(length);
    this.entries.push({ buffer, free: false });
    return buffer;
  }

  release(buffer: T): void {
    for (const e of this.entries) {
      if (e.buffer === buffer) {
        e.free = true;
        return;
      }
    }
  }

  /** 池中已分配的总元素数（诊断用） */
  totalAllocated(): number {
    return this.entries.reduce((s, e) => s + e.buffer.length, 0);
  }

  clear(): void {
    this.entries.length = 0;
  }
}

export const float32Pool = new ArrayPool<Float32Array<ArrayBufferLike>>(Float32Array);
export const uint8Pool = new ArrayPool<Uint8Array<ArrayBufferLike>>(Uint8Array);
export const uint16Pool = new ArrayPool<Uint16Array<ArrayBufferLike>>(Uint16Array);
