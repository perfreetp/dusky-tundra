import type { LngLatRing, RegionStats } from './types'

export interface ExportPayload {
  type: 'wetland-habitat-suitability'
  version: 1
  exportedAt: string
  config: Record<string, unknown>
  region: LngLatRing | null
  regionStats: RegionStats | null
}

/** 导出配置 + 圈选范围为 JSON 文件 */
export function exportConfigFile(payload: ExportPayload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `湿地适宜度配置_${payload.exportedAt.slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(a.href)
}

/** 解析导入文件,返回校验后的 payload 或错误信息 */
export function parseImportFile(
  text: string,
): { ok: true; payload: ExportPayload } | { ok: false; message: string } {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    return { ok: false, message: '文件不是有效的 JSON' }
  }
  const p = data as Partial<ExportPayload>
  if (p?.type !== 'wetland-habitat-suitability') {
    return { ok: false, message: '文件类型不匹配,请选择本工具导出的配置文件' }
  }
  const cfg = p.config as Record<string, unknown> | undefined
  const w = cfg?.weights as { depth?: unknown; veg?: unknown } | undefined
  if (typeof w?.depth !== 'number' || typeof w?.veg !== 'number') {
    return { ok: false, message: '配置缺少有效的权重字段' }
  }
  if (p.region != null) {
    const valid =
      Array.isArray(p.region) &&
      p.region.length >= 3 &&
      p.region.every(
        (pt) => Array.isArray(pt) && typeof pt[0] === 'number' && typeof pt[1] === 'number',
      )
    if (!valid) return { ok: false, message: '圈选范围数据无效' }
  }
  return { ok: true, payload: p as ExportPayload }
}
