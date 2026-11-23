# 场馆扩声覆盖渲染工具

基于 **TypeScript + SolidJS + three.js + troika-three-text** 的场馆扩声覆盖分析工具：在场馆模型上布置音箱，按含角度指向性的直达声模型计算数千采样点的总声压，分级色带渲染覆盖，支持两套布置的差值对比。

## 启动

```bash
npm install
npm run dev      # 开发服务器
npm run build    # tsc 严格类型检查 + 生产构建
npm test         # vitest 单测（16 个用例）
```

## 功能

- **音箱布置**：添加/删除音箱，TransformControls 水平拖拽，面板精确编辑安装高度、位置、方位角、俯角、覆盖半角（锥边 -6 dB）、额定 SPL、覆盖距离
- **指向性声学模型**（`src/acoustics/directivity.ts`）：
  - 覆盖半角反算余弦幂次 `n = 0.3 / log10(1/cos α)`，锥边恰为 −6 dB
  - `DI(θ) = 20·n·log10(cos θ)` 全角度连续——锥外按角度继续平滑衰减（90° 后触 −25 dB 地板），不是硬截断也不是只按距离
  - 反平方距离律 + 可选空气吸收 + 超覆盖距离滚降
- **多箱叠加**（`src/acoustics/engine.ts`）：能量域叠加 `10·log10(Σ10^(SPL_i/10))`，记录主导音箱与每箱贡献矩阵；rAF 分块调度（每块 256 点），参数变更可取消旧任务
- **采样网格**（`src/three/grid.ts`）：包围矩形规则网格向下 raycast 表面，取命中点与面法线；低/中/高 ≈ 1k/3k/8k 点，程序场馆与导入 GLTF 共用
- **色带渲染**（`src/three/coverage.ts`）：单个 InstancedMesh，重算只写 instanceColor；6 级绝对声压色带（阈值可调）与 B−A 发散差值色带
- **悬停查询**：实例拾取显示该点总 SPL、主导音箱与 top3 贡献 dB
- **隔离模式**：只渲染选中音箱的覆盖贡献与指向锥，其余音箱半透明
- **方案对比**：保存方案 A 快照后，可在 看 A / 看 B / 差值 B−A 间切换，差值直接读两份结果数组相减
- **GLTF/GLB 导入**：自动缩放到参考尺寸、居中落地，随后重新下探生成网格

## 目录

```
src/acoustics/   指向性模型、分块计算引擎、色带 LUT
src/three/       场景总装、程序场馆、网格、GLTF、音箱/指向锥、InstancedMesh 覆盖层、标签
src/state/       Solid store 与全部 action
src/components/  工具栏、视口、参数面板、对比面板、图例、Tooltip
test/            指向性/引擎/色带单测
```

## 关键约定

- 方位角 yaw：0 = 朝 −Z，俯视顺时针为正；俯角 tilt：正值向前下方
- 指向锥可视化长度 = 覆盖距离 D，锥底半径 = `D·tan(halfAngle)`
- 网格变化（密度/导入模型）会使方案 A 快照失效（采样点不再对应）
