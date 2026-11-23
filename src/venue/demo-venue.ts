// 演示场馆生成器:按排布参数生成座席点阵、栏杆实体、舞台/场地关键点
// 坐标系:X 横向、Y 纵深(舞台在 +Y)、Z 向上,单位米
import type { OccluderBox, Seat, SeatSectionConfig, Vec3, ViewTarget } from '../types';
import { add, normalize, rotateY, scale } from '../utils/math3d';

/** 就坐观众眼位相对座面的高度(米),可在 1.0-1.3 间调节的基准 */
export const SEATED_EYE_OFFSET = 1.15;
/** 前排站立/坐姿观众代理:肩高与厚度 */
export const SPECTATOR_HEIGHT = 1.25;
export const SPECTATOR_WIDTH = 0.5;
export const SPECTATOR_DEPTH = 0.35;

export interface VenueModel {
  name: string;
  sections: SeatSectionConfig[];
  seats: Seat[];
  occluders: OccluderBox[];
  targets: ViewTarget[];
  /** 舞台台体(展示用) */
  stageBox: { center: Vec3; size: Vec3 };
  /** 场地平面尺寸 */
  field: { center: Vec3; size: Vec3 };
}

const SECTION_COLORS = [0x4f8cff, 0x34c759, 0xff9f0a, 0xaf52de, 0xff6482, 0x00c7c9];

/**
 * 生成一个四面看台的中型场馆:
 * - 南北两片直线大看台(南看台正对舞台)
 * - 东西两片侧看台
 * - 舞台架设在北看台一侧,场地居中
 * 总座席约 4800,满足上千座批量评分场景。
 */
export function generateDemoVenue(): VenueModel {
  const sections: SeatSectionConfig[] = [];
  const seats: Seat[] = [];
  const occluders: OccluderBox[] = [];
  let seatId = 0;

  const ROWS = 20;
  const COLS_MAIN = 80;
  const COLS_SIDE = 60;
  const ROW_SPACING = 0.85;
  const COL_SPACING = 0.55;
  const ROW_RISE = 0.32;

  const makeStraightSection = (
    id: string,
    name: string,
    color: number,
    origin: Vec3,
    alongDir: Vec3,
    depthDir: Vec3,
    cols: number,
    baseHeight: number,
  ): SeatSectionConfig => ({
    id,
    name,
    color,
    kind: 'straight',
    rows: ROWS,
    cols,
    rowSpacing: ROW_SPACING,
    colSpacing: COL_SPACING,
    rowRise: ROW_RISE,
    baseHeight,
    origin,
    alongDir: normalize(alongDir),
    depthDir: normalize(depthDir),
  });

  // 南看台(主看台,正对舞台):沿 X 展开,向 -Y 爬坡
  sections.push(
    makeStraightSection(
      'south',
      '南看台(主看台)',
      SECTION_COLORS[0],
      [-(COLS_MAIN - 1) * COL_SPACING * 0.5, -18, 0],
      [1, 0, 0],
      [0, -1, 0],
      COLS_MAIN,
      0.4,
    ),
  );
  // 北看台(舞台两侧侧翼):舞台占据中央 24m,拆成两段
  const wingCols = (COLS_MAIN - 48) / 2;
  sections.push(
    makeStraightSection(
      'north-west',
      '北看台·西翼',
      SECTION_COLORS[1],
      [-(COLS_MAIN - 1) * COL_SPACING * 0.5, 18, 0],
      [1, 0, 0],
      [0, 1, 0],
      wingCols,
      0.4,
    ),
  );
  sections.push(
    makeStraightSection(
      'north-east',
      '北看台·东翼',
      SECTION_COLORS[2],
      [24 + (48 - wingCols) * COL_SPACING * 0.5 + 1, 18, 0],
      [1, 0, 0],
      [0, 1, 0],
      wingCols,
      0.4,
    ),
  );
  // 东西侧看台:沿 Y 展开,向 ±X 爬坡
  sections.push(
    makeStraightSection(
      'west',
      '西看台',
      SECTION_COLORS[3],
      [-28, -(COLS_SIDE - 1) * COL_SPACING * 0.5, 0],
      [0, 1, 0],
      [-1, 0, 0],
      COLS_SIDE,
      0.4,
    ),
  );
  sections.push(
    makeStraightSection(
      'east',
      '东看台',
      SECTION_COLORS[4],
      [28, -(COLS_SIDE - 1) * COL_SPACING * 0.5, 0],
      [0, 1, 0],
      [1, 0, 0],
      COLS_SIDE,
      0.4,
    ),
  );

  for (const section of sections) {
    for (let row = 0; row < section.rows; row++) {
      for (let col = 0; col < section.cols; col++) {
        const along = scale(section.alongDir!, col * section.colSpacing);
        const depth = scale(section.depthDir, row * section.rowSpacing);
        const z = section.baseHeight + row * section.rowRise;
        const position: Vec3 = [
          section.origin[0] + along[0] + depth[0],
          section.origin[1] + along[1] + depth[1],
          z,
        ];
        seats.push({
          id: seatId++,
          sectionId: section.id,
          row,
          col,
          position,
          eye: [position[0], position[1], position[2] + SEATED_EYE_OFFSET],
          sectionColor: section.color,
        });
      }
    }
  }

  // ---- 结构遮挡物 ----
  // 1) 每个分区第一排前方的护栏(沿排方向的细长盒体,1.1m 高)
  for (const section of sections) {
    const width = section.cols * section.colSpacing;
    const frontCenter = add(
      add(section.origin, scale(section.alongDir!, width / 2 - section.colSpacing / 2)),
      scale(section.depthDir, -0.45),
    );
    const yaw = Math.atan2(section.alongDir![0], section.alongDir![1]);
    occluders.push({
      kind: 'box',
      center: [frontCenter[0], frontCenter[1], section.baseHeight + 0.55],
      size: [width + 0.4, 0.08, 1.1],
      yaw,
      tag: 'rail',
      label: `${section.name}前排护栏`,
    });
  }
  // 2) 看台每 5 排一道横向通道护栏
  for (const section of sections) {
    const width = section.cols * section.colSpacing;
    const yaw = Math.atan2(section.alongDir![0], section.alongDir![1]);
    for (let row = 5; row < section.rows; row += 5) {
      const c = add(
        add(section.origin, scale(section.alongDir!, width / 2 - section.colSpacing / 2)),
        scale(section.depthDir, row * section.rowSpacing - 0.2),
      );
      occluders.push({
        kind: 'box',
        center: [c[0], c[1], section.baseHeight + row * section.rowRise + 0.55],
        size: [width, 0.06, 1.1],
        yaw,
        tag: 'rail',
        label: `${section.name}通道护栏 R${row}`,
      });
    }
  }
  // 3) 舞台两侧音响/结构柱(实体墙)
  occluders.push({
    kind: 'box',
    center: [-14, 22, 3],
    size: [2.5, 2.5, 6],
    tag: 'stage',
    label: '舞台西侧结构柱',
  });
  occluders.push({
    kind: 'box',
    center: [14, 22, 3],
    size: [2.5, 2.5, 6],
    tag: 'stage',
    label: '舞台东侧结构柱',
  });
  // 4) 场地边围栏(南看台前,矮栏杆)
  occluders.push({
    kind: 'box',
    center: [0, -16.6, 0.6],
    size: [44, 0.08, 1.2],
    tag: 'rail',
    label: '场地南围栏',
  });

  // ---- 舞台与场地关键点 ----
  const targets: ViewTarget[] = [
    { id: 'stage-center', label: '舞台中心', position: [0, 24, 1.5], kind: 'stage' },
    { id: 'stage-left', label: '舞台左区', position: [-9, 24, 2.0], kind: 'stage' },
    { id: 'stage-right', label: '舞台右区', position: [9, 24, 2.0], kind: 'stage' },
    { id: 'stage-front', label: '舞台前沿', position: [0, 19.5, 0.8], kind: 'stage' },
    { id: 'field-center', label: '场地中心', position: [0, 2, 0.2], kind: 'field' },
    { id: 'field-near', label: '场地近点', position: [0, -10, 0.2], kind: 'field' },
  ];

  return {
    name: '演示综合馆(四面看台)',
    sections,
    seats,
    occluders,
    targets,
    stageBox: { center: [0, 24, 0.6], size: [22, 8, 1.2] },
    field: { center: [0, 2, 0.05], size: [40, 32, 0.1] },
  };
}

/**
 * 为指定座席生成"前排观众"代理盒体:
 * 同排左右相邻席 + 正前方一排的若干席,以坐姿上半身盒体表示。
 */
export function buildSpectatorProxies(
  seat: Seat,
  allSeats: Seat[],
  sectionOf: (id: string) => SeatSectionConfig | undefined,
): OccluderBox[] {
  const section = sectionOf(seat.sectionId);
  if (!section) return [];
  const boxes: OccluderBox[] = [];
  const isNeighbor = (s: Seat) =>
    s.sectionId === seat.sectionId &&
    ((s.row === seat.row && Math.abs(s.col - seat.col) === 1) ||
      (s.row === seat.row - 1 && Math.abs(s.col - seat.col) <= 2));
  for (const s of allSeats) {
    if (s.id === seat.id || !isNeighbor(s)) continue;
    boxes.push({
      kind: 'box',
      center: [s.position[0], s.position[1], s.position[2] + SPECTATOR_HEIGHT / 2],
      size: [SPECTATOR_WIDTH, SPECTATOR_DEPTH, SPECTATOR_HEIGHT],
      tag: 'spectator',
      label: `前排观众 R${s.row}C${s.col}`,
    });
  }
  return boxes;
}

/** 批量评分时为全部座席预生成前排观众代理(按同分区前排规则,避免 O(n²)) */
export function buildAllSpectatorProxies(seats: Seat[]): Map<number, OccluderBox[]> {
  const byKey = new Map<string, Seat>();
  for (const s of seats) byKey.set(`${s.sectionId}|${s.row}|${s.col}`, s);
  const result = new Map<number, OccluderBox[]>();
  for (const seat of seats) {
    const boxes: OccluderBox[] = [];
    const candidates: [number, number][] = [
      [seat.row, seat.col - 1],
      [seat.row, seat.col + 1],
      [seat.row - 1, seat.col - 2],
      [seat.row - 1, seat.col - 1],
      [seat.row - 1, seat.col],
      [seat.row - 1, seat.col + 1],
      [seat.row - 1, seat.col + 2],
    ];
    for (const [r, c] of candidates) {
      const s = byKey.get(`${seat.sectionId}|${r}|${c}`);
      if (!s || s.id === seat.id) continue;
      boxes.push({
        kind: 'box',
        center: [s.position[0], s.position[1], s.position[2] + SPECTATOR_HEIGHT / 2],
        size: [SPECTATOR_WIDTH, SPECTATOR_DEPTH, SPECTATOR_HEIGHT],
        tag: 'spectator',
        label: `前排观众 R${r}C${c}`,
      });
    }
    if (boxes.length) result.set(seat.id, boxes);
  }
  return result;
}

/** 用当前眼高重算座席眼位(在基准眼高上整体平移) */
export function applyEyeHeight(seats: Seat[], eyeHeight: number): void {
  const delta = eyeHeight - SEATED_EYE_OFFSET;
  for (const s of seats) {
    s.eye = [s.position[0], s.position[1], s.position[2] + SEATED_EYE_OFFSET + delta];
  }
}

export { rotateY };
