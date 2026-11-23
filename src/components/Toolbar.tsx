// 左侧工具栏:绘制工具 + 文件操作
import type { Tool } from './PixiStage'

interface Props {
  tool: Tool
  onTool: (t: Tool) => void
  onDemo: () => void
  onClear: () => void
  onExport: () => void
  onImport: (file: File) => void
  computing: boolean
  hasPrev: boolean
  showCompare: boolean
  onToggleCompare: () => void
}

const TOOLS: { key: Tool; label: string; hint: string }[] = [
  { key: 'select', label: '选择', hint: '点击选中对象 / 拖动平移' },
  { key: 'floor', label: '楼层平面', hint: '拖拽铺设可行走区域' },
  { key: 'waiting', label: '候梯区', hint: '拖拽框出候梯区' },
  { key: 'elevator', label: '电梯厅', hint: '拖拽放置电梯' },
  { key: 'stair', label: '楼梯口', hint: '拖拽放置楼梯口' },
  { key: 'source', label: '客流源', hint: '在入口处点击放置' },
  { key: 'delete', label: '删除', hint: '点击对象删除' },
]

export default function Toolbar(p: Props) {
  return (
    <div className="toolbar">
      {TOOLS.map((t) => (
        <button
          key={t.key}
          title={t.hint}
          className={p.tool === t.key ? 'tool active' : 'tool'}
          onClick={() => p.onTool(t.key)}
        >
          {t.label}
        </button>
      ))}
      <div className="tool-sep" />
      <button className="tool" onClick={p.onDemo}>示例平面</button>
      <button className="tool" onClick={p.onClear}>清空平面</button>
      <div className="tool-sep" />
      <button className="tool" onClick={p.onExport}>导出文件</button>
      <label className="tool as-btn">
        导入文件
        <input
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) p.onImport(f)
            e.target.value = ''
          }}
        />
      </label>
      {p.hasPrev && (
        <>
          <div className="tool-sep" />
          <label className="compare-toggle">
            <input type="checkbox" checked={p.showCompare} onChange={p.onToggleCompare} />
            对比上一次结果
          </label>
        </>
        )}
      {p.computing && <div className="computing">重算中…(旧结果保留显示)</div>}
    </div>
  )
}
