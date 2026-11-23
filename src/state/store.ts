/**
 * 轻量外部 store：getState/subscribe/emit，配合 useSyncExternalStore。
 * 只存低频 UI 状态；高频节点/帧数据留在 Engine。
 */
export interface StoreState {
  selectedFloorId: string;
  floorIndex: number;
  loadCoeff: number;
  speed: number;
  clipHeight: number | null;
  ropeOpacity: number;
  lodLevel: 'high' | 'mid' | 'low';
  showSectionMarkers: boolean;
  showTensionColor: boolean;
  playing: boolean;
  ropeVisible: boolean;
  bvhVisible: boolean;
}

type Listener = () => void;

export class Store<T extends object> {
  private state: T;
  private listeners = new Set<Listener>();

  constructor(initial: T) {
    this.state = initial;
  }

  getState = (): T => this.state;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  setState(patch: Partial<T>): void {
    this.state = { ...this.state, ...patch };
    for (const l of this.listeners) l();
  }

  emit(): void {
    for (const l of this.listeners) l();
  }
}
