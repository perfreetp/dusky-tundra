/**
 * 楼层档位 → 轿厢/对重位置运动学。
 * 坐标约定：Y 向上，原点底坑中心。
 */
import type { FloorState, SceneConfig } from './types';

export interface FloorDefinition {
  floorId: string;
  label: string;
  /** 归一化行程位置 0..1 */
  position: number;
  speed: number;
  acceleration: number;
  loadCoeff: number;
}

/** 轿厢悬吊点在最低楼层时的 Y 坐标 */
export function carBaseY(scene: SceneConfig): number {
  return scene.hoistway.pitDepth + scene.car.hangerOffset[1];
}

/** 当前档位轿厢悬吊点 Y */
export function carHangerY(scene: SceneConfig, position: number): number {
  return carBaseY(scene) + scene.hoistway.travel * position;
}

/**
 * 对重悬吊点 Y。对重与轿厢反向运动：
 * cwY(f) = cwY(0) - motionRatio * travel * position
 */
export function counterweightHangerY(scene: SceneConfig, position: number): number {
  const cwBase = scene.hoistway.pitDepth + scene.counterweight.hangerOffset[1];
  // 对重在顶部时（轿厢在底部）的初始高度
  const cwTop = cwBase + scene.counterweight.motionRatio * scene.hoistway.travel;
  return cwTop - scene.counterweight.motionRatio * scene.hoistway.travel * position;
}

/** 解析动态跟随点的世界坐标 */
export function followerPosition(
  scene: SceneConfig,
  follower: 'car' | 'counterweight' | 'tensionSheave',
  position: number,
  tensionSheaveY: number,
): [number, number, number] {
  switch (follower) {
    case 'car': {
      const o = scene.car.hangerOffset;
      return [o[0], carHangerY(scene, position), o[2]];
    }
    case 'counterweight': {
      const o = scene.counterweight.hangerOffset;
      return [o[0], counterweightHangerY(scene, position), o[2]];
    }
    case 'tensionSheave': {
      // 张紧轮 XZ 取限速器张紧轮配置，Y 由环路闭合解给出
      const tension = scene.sheaves.find((s) => s.kind === 'tension');
      if (tension) return [tension.center[0], tensionSheaveY, tension.center[2]];
      return [0, tensionSheaveY, 0];
    }
  }
}

/** 由楼层定义生成完整 FloorState（绳长先置 0，由求解器回填） */
export function buildFloorState(scene: SceneConfig, def: FloorDefinition): FloorState {
  return {
    floorId: def.floorId,
    label: def.label,
    position: def.position,
    carY: carHangerY(scene, def.position),
    counterweightY: counterweightHangerY(scene, def.position),
    speed: def.speed,
    acceleration: def.acceleration,
    loadCoeff: def.loadCoeff,
    ropeLengths: {},
  };
}

export function buildAllFloorStates(scene: SceneConfig, defs: FloorDefinition[]): FloorState[] {
  return defs.map((d) => buildFloorState(scene, d));
}

/**
 * 限速器闭合环路的张紧轮 Y 闭合解。
 * 环路总长守恒：L = (topY - carArmY) + (topY - tensionY) + 固定包角/水平段。
 * 解出 tensionY = 2*topY - carArmY + fixedDrop - L。
 * @param loopConstantLength 环路总长度（米，配置给定）
 * @param governorTopY 限速器轮（顶部）节圆高度
 * @param carArmY 轿厢侧夹持臂高度
 * @param fixedDrop 固定几何损耗（两轮水平段/包角常量）
 */
export function tensionSheaveClosureY(
  loopConstantLength: number,
  governorTopY: number,
  carArmY: number,
  fixedDrop: number,
): number {
  return 2 * governorTopY - carArmY + fixedDrop - loopConstantLength;
}
