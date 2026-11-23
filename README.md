# 电梯井道曳引绳姿态渲染工具

基于 **TypeScript + React 19 + Vite + three.js 0.187 + three-mesh-bvh 0.9.18** 的电梯井道监测工具：按楼层运行档位实时生成曳引绳、限速器绳的柔性绳体姿态，并正确参与遮挡与碰撞。

## 功能

- **几何**：GLB/GLTF 导入（语义标注 → 归一化 → 碰撞体合并建 BVH）+ 内置参数化默认井道（12 层站、8 槽曳引轮、限速器闭合绳环、导轨、轿厢、对重）
- **绳姿态求解（纯 TS 内核，无 three 依赖）**
  - 按楼层档位生成轿厢/对重位置与绳长（1:1 守恒、限速器环路闭合解）
  - 轮缘包角用线-圆解析切线 + 圆弧精确采样，构造上保证 `|P-C| ≡ R`，杜绝穿轮
  - 自由段 centripetal Catmull-Rom（α=0.5）采样，弧段锁定不进样条
  - 摆幅按运行速度/加速度档位 + 负载系数的弦模态模型，逐帧叠加不写回缓存
  - 多绳按绳槽数平行排布
- **BVH 碰撞**：绳与绳轮、导轨 `closestPointToPoint`/`raycastFirst` 检测，侵入节点沿法向投影 + 邻域 Catmull-Rom 局部弯曲修正；弧段节点零位移
- **剖切**：高度方向拖动剖切平面，绳体截面环显示；封口三规则（弧段抑制 / 净空收缩 / 平面内推开）保证不与轮缘穿插
- **渲染**：预分配绳管 + 平行移动标架，多绳合批单次 draw call；半透明绳体 `depthWrite=false` 与不透明钢结构分级 renderOrder 排序；张力分段渐变色标
- **缓存与性能**：基准姿态按 `ropeId|floorId|loadBand` 缓存，TypedArray 池化零 GC；楼层切换全量重建、逐帧仅刷新位置/法线
- **导入导出**：姿态 JSON（参数模式可复算 / 嵌入模式像素级复现，带契约校验）+ PNG 截图

## 性能

| 指标 | 实测 | 预算 |
|---|---|---|
| 37 绳 / 2698 节点 mid LOD 冷重算 | **1.53 ms** | 16 ms |
| 逐帧绳几何更新（9 绳） | **~2 ms** | — |
| low/mid 降级 | 1.07 / 1.95 ms | 降级链有效 |

> 无头环境 FPS 受 SwiftShader 软件光栅化限制（~35-40），逐帧 CPU 逻辑仅 ~2ms，真实 GPU 下不受此瓶颈约束。

## 目录结构

```
src/
├─ core/            # 纯计算内核（无 three，可进 Worker / Node 单测）
│  ├─ math/         # 向量、线圆切线、Catmull-Rom、平行移动标架、插值
│  ├─ model/        # 领域类型、楼层运动学、张力模型
│  ├─ rope/         # 求解管线、包角、样条、摆幅、BVH 碰撞、缓存
│  ├─ io/           # JSON 契约与序列化
│  └─ perf/         # LOD 预算、数组池、性能探针
├─ three/           # three 适配层（仅本层 import three）
│  ├─ Engine.ts     # 渲染总装与 rAF 循环
│  ├─ geometry/     # 绳管合批、截面环、封口池
│  ├─ materials/    # 绳/钢结构/封口材质、张力 LUT
│  ├─ bvh/          # BvhRegistry、GLB 导入管线
│  ├─ clip/         # 剖切平面、封口三规则
│  └─ scene/        # 默认参数化井道工厂
├─ state/           # 轻量 store
└─ react/           # 控制面板、楼层时间轴、剖切、HUD
scripts/           # Playwright 冒烟与剖切规则验证
```

## 常用命令

```bash
npm install
npm run dev        # 开发服务器
npm test           # vitest 单元/性能测试（23 个）
npm run build      # 类型检查 + 生产构建
npm run typecheck
node scripts/smoke.mjs         # 无头浏览器运行时冒烟（需先 npm run dev）
node scripts/cap-rules-test.mjs # 剖切封口三规则数据级验证
```

## 关键设计决策

1. **解析几何优先、BVH 兜底**：轮缘包角用圆弧参数化精确贴合并以 `arcFlag` 锁定，从数学上杜绝穿轮；BVH 只处理导轨/钢结构等非解析碰撞。
2. **基准姿态与逐帧摆幅分离**：楼层/负载决定的基准绳形进 L1 缓存；时间相关摆幅每帧无分配叠加到独立渲染缓冲，不污染缓存。
3. **零 GC 热路径**：节点/环截面缓冲全部预分配池化，几何缓冲一次分配靠 `drawRange`/`addUpdateRange` 控制有效区间。
4. **剖切不穿轮**：弧段切口直接抑制封口（轮体自身深度遮挡开口）+ 自由段净空收缩半径 + 平面内二维推开，配合封口先于半透明绳写深度。
