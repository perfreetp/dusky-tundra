// 导出 / 导入:平面 + 配置 + 推演结果打包成 JSON 文件分享
import type { Plan, SimConfig, SimResult, Snapshot } from '../model/types'

export interface ExportFile {
  type: 'elevator-lobby-evac'
  version: 1
  exportedAt: string
  plan: Plan
  simConfig: SimConfig
  result: SimResult | null
}

interface SnapshotJson extends Omit<Snapshot, 'agents'> {
  agents: number[]
}

export function exportFile(plan: Plan, config: SimConfig, result: SimResult | null): void {
  const data: ExportFile = {
    type: 'elevator-lobby-evac',
    version: 1,
    exportedAt: new Date().toISOString(),
    plan,
    simConfig: config,
    result: result
      ? {
          ...result,
          snapshots: result.snapshots.map((s) => ({ ...s, agents: Array.from(s.agents) })) as unknown as Snapshot[],
        }
      : null,
  }
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `候梯厅疏散推演_${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function parseImport(text: string): { plan: Plan; config: SimConfig; result: SimResult | null } {
  const data = JSON.parse(text) as ExportFile
  if (data.type !== 'elevator-lobby-evac') throw new Error('不是本工具导出的文件')
  const result: SimResult | null = data.result
    ? {
        ...data.result,
        snapshots: (data.result.snapshots as unknown as SnapshotJson[]).map((s) => ({
          ...s,
          agents: Float32Array.from(s.agents),
        })),
      }
    : null
  return { plan: data.plan, config: data.simConfig, result }
}
