import * as THREE from 'three';
import type { Speaker } from '../types';
import { forwardVector } from '../acoustics/directivity';
import { createSpeakerLabel, updateLabelText } from './labels';

const DEG2RAD = Math.PI / 180;
const CONE_SEGMENTS = 32;

interface SpeakerView {
  speaker: Speaker;
  /** 位置承载（TransformControls 绑定对象，仅承载位置） */
  holder: THREE.Group;
  /** 朝向组（yaw/tilt），音箱本体、喇叭、锥、标签都挂在下面 */
  aim: THREE.Group;
  body: THREE.Mesh;
  horn: THREE.Mesh;
  cone: THREE.Mesh;
  coneRim: THREE.LineLoop;
  label: ReturnType<typeof createSpeakerLabel>;
  coneMaterial: THREE.MeshBasicMaterial;
}

const _forward = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _zAxis = new THREE.Vector3(0, 0, 1);

/**
 * 音箱对象管理：本体 + 指向锥（半透明，长度=覆盖距离，半角=halfAngle）+ 标签。
 * 数据驱动 sync()，与 Solid store 中的 Speaker 保持一致。
 */
export class SpeakerManager {
  readonly group = new THREE.Group();
  private views = new Map<string, SpeakerView>();
  private selectedId: string | null = null;
  private isolated = false;

  private makeConeGeometry(sp: Speaker): THREE.ConeGeometry {
    const radius = Math.max(0.1, sp.range * Math.tan(sp.halfAngle * DEG2RAD));
    const geo = new THREE.ConeGeometry(radius, sp.range, CONE_SEGMENTS, 1, true);
    geo.translate(0, -sp.range / 2, 0); // 锥顶落在原点
    geo.rotateX(-Math.PI / 2); // +Y 轴 -> -Z（对准 Object3D 默认朝向）
    return geo;
  }

  private buildView(sp: Speaker): SpeakerView {
    const holder = new THREE.Group();
    holder.name = `holder-${sp.id}`;
    const aim = new THREE.Group();
    holder.add(aim);

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2f3640, roughness: 0.6, metalness: 0.3 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.8, 1.2), bodyMat);
    body.userData.speakerId = sp.id;
    aim.add(body);

    const hornMat = new THREE.MeshStandardMaterial({ color: 0x161a1f, roughness: 0.8 });
    const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.5, 0.5, 16, 1, true), hornMat);
    horn.rotation.x = -Math.PI / 2;
    horn.position.z = -0.75;
    horn.userData.speakerId = sp.id;
    aim.add(horn);

    const coneMaterial = new THREE.MeshBasicMaterial({
      color: 0x4fc3f7,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const cone = new THREE.Mesh(this.makeConeGeometry(sp), coneMaterial);
    cone.visible = false;
    aim.add(cone);

    const rimGeo = new THREE.BufferGeometry();
    const coneRim = new THREE.LineLoop(
      rimGeo,
      new THREE.LineBasicMaterial({ color: 0x81d4fa, transparent: true, opacity: 0.7 }),
    );
    coneRim.visible = false;
    aim.add(coneRim);
    this.updateRim(coneRim, sp);

    const label = createSpeakerLabel(sp.name);
    aim.add(label);

    this.group.add(holder);
    const view: SpeakerView = {
      speaker: { ...sp },
      holder,
      aim,
      body,
      horn,
      cone,
      coneRim,
      label,
      coneMaterial,
    };
    this.applyTransform(view, sp);
    this.applySelectionStyle(view);
    return view;
  }

  private updateRim(rim: THREE.LineLoop, sp: Speaker): void {
    rim.geometry.dispose();
    const radius = Math.max(0.1, sp.range * Math.tan(sp.halfAngle * DEG2RAD));
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < CONE_SEGMENTS; i++) {
      const a = (i / CONE_SEGMENTS) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, -sp.range));
    }
    rim.geometry = new THREE.BufferGeometry().setFromPoints(pts);
  }

  /** 位置与朝向同步；锥几何仅在 range/halfAngle 变化时重建 */
  private applyTransform(view: SpeakerView, sp: Speaker): void {
    view.holder.position.set(sp.x, sp.y, sp.z);
    view.aim.rotation.set(sp.tilt * DEG2RAD, sp.yaw * DEG2RAD, 0);

    if (view.speaker.range !== sp.range || view.speaker.halfAngle !== sp.halfAngle) {
      view.cone.geometry.dispose();
      view.cone.geometry = this.makeConeGeometry(sp);
      this.updateRim(view.coneRim, sp);
    }
    if (view.speaker.name !== sp.name) {
      updateLabelText(view.label, sp.name);
    }
    view.speaker = { ...sp };
  }

  private applySelectionStyle(view: SpeakerView): void {
    const isSelected = view.speaker.id === this.selectedId;
    const dimmed = this.isolated && !isSelected;
    const mat = view.body.material as THREE.MeshStandardMaterial;
    mat.color.setHex(isSelected ? 0xffb74d : 0x2f3640);
    mat.opacity = dimmed ? 0.25 : 1;
    mat.transparent = dimmed;
    (view.horn.material as THREE.MeshStandardMaterial).opacity = dimmed ? 0.25 : 1;
    (view.horn.material as THREE.MeshStandardMaterial).transparent = dimmed;

    const showCone = isSelected || !this.isolated;
    view.cone.visible = showCone;
    view.coneRim.visible = showCone;
    view.coneMaterial.color.setHex(isSelected ? 0xffb74d : 0x4fc3f7);
  }

  sync(speakers: Speaker[], selectedId: string | null, isolated: boolean): void {
    this.selectedId = selectedId;
    this.isolated = isolated;
    const live = new Set<string>();

    for (const sp of speakers) {
      live.add(sp.id);
      let view = this.views.get(sp.id);
      if (!view) {
        view = this.buildView(sp);
        this.views.set(sp.id, view);
      } else {
        this.applyTransform(view, sp);
      }
      this.applySelectionStyle(view);
    }

    for (const [id, view] of this.views) {
      if (!live.has(id)) {
        this.group.remove(view.holder);
        view.body.geometry.dispose();
        (view.body.material as THREE.Material).dispose();
        view.horn.geometry.dispose();
        (view.horn.material as THREE.Material).dispose();
        view.cone.geometry.dispose();
        view.coneMaterial.dispose();
        view.coneRim.geometry.dispose();
        (view.coneRim.material as THREE.Material).dispose();
        view.label.dispose();
        this.views.delete(id);
      }
    }
  }

  /** 可拾取的音箱本体列表（raycast 用） */
  pickables(): THREE.Object3D[] {
    return [...this.views.values()].map((v) => v.body).concat([...this.views.values()].map((v) => v.horn));
  }

  holderOf(id: string): THREE.Object3D | null {
    return this.views.get(id)?.holder ?? null;
  }

  /** 读回 TransformControls 拖动后的水平位置 */
  positionOf(id: string): THREE.Vector3 | null {
    const v = this.views.get(id);
    return v ? v.holder.position.clone() : null;
  }

  /** 给定世界点是否落在某音箱指向锥内（半角判定，供调试/测试参考） */
  static coneContains(sp: Speaker, px: number, py: number, pz: number): boolean {
    const [fx, fy, fz] = forwardVector(sp);
    const dx = px - sp.x;
    const dy = py - sp.y;
    const dz = pz - sp.z;
    const dist = Math.hypot(dx, dy, dz);
    if (dist > sp.range || dist < 1e-6) return false;
    const cosTheta = (dx * fx + dy * fy + dz * fz) / dist;
    return cosTheta >= Math.cos(sp.halfAngle * DEG2RAD);
  }

  /** 让某音箱的 aim 组朝向一个世界点（辅助 API） */
  lookAt(id: string, target: THREE.Vector3): void {
    const view = this.views.get(id);
    if (!view) return;
    _forward.subVectors(view.holder.position, target).normalize();
    _quat.setFromUnitVectors(_zAxis, _forward);
    view.aim.quaternion.copy(_quat);
  }
}
