import type { GridData } from '../core/types'
import { bandIndex, type Ramp } from '../core/ramps'

const SCALE = 4 // 每格网绘制的像素数

function makeCanvas(grid: GridData) {
  const canvas = document.createElement('canvas')
  canvas.width = grid.cols * SCALE
  canvas.height = grid.rows * SCALE
  return canvas
}

/** 水域图层:蓝色,透明度随水深增加 */
export function buildWaterCanvas(grid: GridData): HTMLCanvasElement {
  const canvas = makeCanvas(grid)
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(canvas.width, canvas.height)
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      const d = grid.depth[r * grid.cols + c]
      if (d <= 0) continue
      const t = Math.min(1, d / 1.2)
      const cr = Math.round(140 - 100 * t)
      const cg = Math.round(190 - 110 * t)
      const cb = Math.round(220 - 40 * t)
      const alpha = Math.round(120 + 120 * t)
      for (let dy = 0; dy < SCALE; dy++) {
        for (let dx = 0; dx < SCALE; dx++) {
          const p = ((r * SCALE + dy) * canvas.width + c * SCALE + dx) * 4
          img.data[p] = cr
          img.data[p + 1] = cg
          img.data[p + 2] = cb
          img.data[p + 3] = alpha
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}

/** 植被图层:绿色,透明度随覆盖度增加,深水区不显示 */
export function buildVegetationCanvas(grid: GridData): HTMLCanvasElement {
  const canvas = makeCanvas(grid)
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(canvas.width, canvas.height)
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      const i = r * grid.cols + c
      const v = grid.veg[i]
      if (v <= 0.05 || grid.depth[i] > 0.8) continue
      const t = v
      const cr = Math.round(120 - 70 * t)
      const cg = Math.round(170 - 40 * t)
      const cb = Math.round(80 - 40 * t)
      const alpha = Math.round(60 + 160 * t)
      for (let dy = 0; dy < SCALE; dy++) {
        for (let dx = 0; dx < SCALE; dx++) {
          const p = ((r * SCALE + dy) * canvas.width + c * SCALE + dx) * 4
          img.data[p] = cr
          img.data[p + 1] = cg
          img.data[p + 2] = cb
          img.data[p + 3] = alpha
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}

/** 适宜度热力图:按当前色带分 5 档渲染 */
export function buildSuitabilityCanvas(grid: GridData, ramp: Ramp): HTMLCanvasElement {
  const canvas = makeCanvas(grid)
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(canvas.width, canvas.height)
  const palette = ramp.colors.map((hex) => {
    const n = parseInt(hex.slice(1), 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  })
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      const v = grid.suit[r * grid.cols + c]
      const [cr, cg, cb] = palette[bandIndex(v)]
      for (let dy = 0; dy < SCALE; dy++) {
        for (let dx = 0; dx < SCALE; dx++) {
          const p = ((r * SCALE + dy) * canvas.width + c * SCALE + dx) * 4
          img.data[p] = cr
          img.data[p + 1] = cg
          img.data[p + 2] = cb
          img.data[p + 3] = 255
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}
