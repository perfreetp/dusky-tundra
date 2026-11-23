import type { ShuntingPlan, YardData } from '../types'

const YARD_KEY = 'marshalling-yard:yard:v1'
const PLANS_KEY = 'marshalling-yard:plans:v1'

export function saveYardToLocal(yard: YardData): void {
  try {
    localStorage.setItem(YARD_KEY, JSON.stringify(yard))
  } catch (err) {
    console.error('站场数据保存失败', err)
    throw new Error('浏览器存储空间不足，保存失败')
  }
}

export function loadYardFromLocal(): YardData | null {
  const raw = localStorage.getItem(YARD_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as YardData
  } catch {
    return null
  }
}

export function savePlansToLocal(plans: ShuntingPlan[]): void {
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans))
}

export function loadPlansFromLocal(): ShuntingPlan[] | null {
  const raw = localStorage.getItem(PLANS_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as ShuntingPlan[]
  } catch {
    return null
  }
}

/** 导出站场文件（含计划），供分享 */
export function exportYardFile(yard: YardData): void {
  const payload = {
    app: 'marshalling-yard-sim',
    exportedAt: new Date().toISOString(),
    yard,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `marshalling-yard-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importYardFile(file: File): Promise<YardData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        const yard: YardData = data.yard ?? data
        validateYard(yard)
        resolve(yard)
      } catch (err) {
        reject(err instanceof Error ? err : new Error('文件格式无法识别'))
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file)
  })
}

function validateYard(yard: YardData): void {
  const required: (keyof YardData)[] = [
    'nodes',
    'switches',
    'edges',
    'tracks',
    'gauge',
    'vehicles',
    'initialPlacement',
    'plans',
  ]
  for (const key of required) {
    if (yard[key] === undefined) throw new Error(`站场文件缺少字段：${key}`)
  }
}
