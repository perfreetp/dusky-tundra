/**
 * 渲染顺序常量集中管理，避免半透明穿插错乱。
 */
export const RENDER_ORDER = {
  /** 钢结构/导轨/轿厢/绳轮（不透明，先写深度） */
  STRUCTURE: 0,
  /** 封口圆盘（近不透明，先于半透明绳写深度） */
  CAP: 9,
  /** 半透明绳体（depthWrite=false） */
  ROPE: 10,
  /** 剖切截面环/标记 */
  SECTION: 11,
  /** HUD 辅助线/包围盒 */
  HELPER: 20,
} as const;
