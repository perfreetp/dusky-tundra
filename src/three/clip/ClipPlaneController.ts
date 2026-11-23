/**
 * 剖切平面控制：法向固定 (0,-1,0)，沿井道高度拖动只改 constant。
 * 绳与钢结构材质共享同一 Plane 实例，保证切口共面。
 */
import * as THREE from 'three';

export class ClipPlaneController {
  readonly plane: THREE.Plane;
  /** 截面辅助网格（半透明水平面） */
  readonly helper: THREE.Mesh;
  private enabled = false;
  private height = 0;

  constructor() {
    // Plane(normal, constant)：normal·P + constant = 0；法向 (0,-1,0) 时 constant = height
    this.plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
    const helperGeo = new THREE.PlaneGeometry(6, 6);
    const helperMat = new THREE.MeshBasicMaterial({
      color: 0x35e0d0,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.helper = new THREE.Mesh(helperGeo, helperMat);
    this.helper.rotation.x = -Math.PI / 2;
    this.helper.visible = false;
    this.helper.renderOrder = 20;
  }

  setHeight(h: number | null): void {
    if (h === null) {
      this.disable();
      return;
    }
    this.enabled = true;
    this.height = h;
    this.plane.constant = h;
    this.helper.visible = true;
    this.helper.position.set(0, h, 0);
  }

  disable(): void {
    this.enabled = false;
    this.helper.visible = false;
  }

  get isEnabled(): boolean {
    return this.enabled;
  }

  get currentHeight(): number {
    return this.height;
  }

  dispose(): void {
    this.helper.geometry.dispose();
    (this.helper.material as THREE.Material).dispose();
  }
}
