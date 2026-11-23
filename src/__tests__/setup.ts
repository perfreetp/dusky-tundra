/**
 * Node 26 自带实验性 localStorage（需 --localstorage-file 标志），
 * 会遮蔽 happy-dom 提供的实现。统一注入内存版 Storage，保证测试可重复。
 */
class MemoryStorage implements Storage {
  private m = new Map<string, string>();
  get length() {
    return this.m.size;
  }
  clear() {
    this.m.clear();
  }
  getItem(key: string) {
    return this.m.has(key) ? this.m.get(key)! : null;
  }
  key(index: number) {
    return Array.from(this.m.keys())[index] ?? null;
  }
  removeItem(key: string) {
    this.m.delete(key);
  }
  setItem(key: string, value: string) {
    this.m.set(key, String(value));
  }
}

const storage = new MemoryStorage();
Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true, writable: true });
if (typeof (globalThis as { window?: unknown }).window !== 'undefined') {
  Object.defineProperty(globalThis as { window: object }, 'window', {
    value: new Proxy((globalThis as { window: object }).window, {
      get(t, p) {
        if (p === 'localStorage') return storage;
        return Reflect.get(t as object, p);
      },
    }),
    configurable: true,
  });
}
