// 座席清单导出/导入(JSON 文件)
import type { Seat, SeatListFile, SeatScore } from '../types';

export function buildSeatListFile(
  venueName: string,
  seats: Seat[],
  selectedIds: Set<number>,
  eyeHeight: number,
  scores: Map<number, SeatScore>,
): SeatListFile {
  const list = seats.filter((s) => selectedIds.has(s.id));
  return {
    format: 'venue-seat-list/v1',
    exportedAt: new Date().toISOString(),
    venueName,
    eyeHeight,
    seats: list.map((s) => {
      const score = scores.get(s.id)?.score;
      return {
        seatId: s.id,
        sectionId: s.sectionId,
        row: s.row,
        col: s.col,
        position: s.position,
        ...(score !== undefined ? { score } : {}),
      };
    }),
  };
}

export function downloadSeatList(file: SeatListFile): void {
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = file.exportedAt.slice(0, 19).replace(/[:T]/g, '-');
  a.href = url;
  a.download = `${file.venueName.replace(/[\\/:*?"<>|\s]+/g, '_')}_座席清单_${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export interface ImportResult {
  file: SeatListFile;
  selectedIds: number[];
  /** 清单中存在但当前场馆找不到的座席 id */
  missing: number[];
  /** 导入的评分(若文件中携带) */
  scores: { seatId: number; score: number }[];
}

export async function importSeatList(
  file: File,
  knownSeatIds: Set<number>,
): Promise<ImportResult> {
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('文件不是合法 JSON');
  }
  const data = parsed as Partial<SeatListFile>;
  if (data.format !== 'venue-seat-list/v1' || !Array.isArray(data.seats)) {
    throw new Error('文件格式不匹配(缺少 format=venue-seat-list/v1 或 seats 数组)');
  }
  const selectedIds: number[] = [];
  const missing: number[] = [];
  const scores: { seatId: number; score: number }[] = [];
  for (const item of data.seats) {
    if (typeof item.seatId !== 'number') continue;
    if (!knownSeatIds.has(item.seatId)) {
      missing.push(item.seatId);
      continue;
    }
    selectedIds.push(item.seatId);
    if (typeof item.score === 'number') scores.push({ seatId: item.seatId, score: item.score });
  }
  return {
    file: data as SeatListFile,
    selectedIds,
    missing,
    scores,
  };
}
