# 场馆座席可视预览工具

基于 **TypeScript + 原生 Web Components + three.js + manifold-3d** 的场馆座席视野分析工具。
载入场馆与看台后按排布生成座席点阵并分区着色,支持观众视角环视、实时遮挡标记、上千座席的几何布尔视野评分,以及座席清单的导出/导入还原。

## 功能

| 能力 | 实现方式 |
| --- | --- |
| 座席点阵与分区着色 | `InstancedMesh` 单绘制调用承载数千座席,按分区基色实例化着色 |
| 点击座席进入观众视角 | 射线精确命中 + 屏幕投影邻近回退,落入该座眼位环视 |
| 眼位高度调节 | 1.00–1.30 m 滑杆,实时重算眼位与遮挡 |
| 环视实时遮挡标记 | 拖动改 yaw/pitch,代数射线对栏杆/结构/前排观众盒体求交,标出被挡区域与视野内外关键点 |
| 框选批量评分 | Shift/右键拖拽框选,Web Worker 内对每座席每目标做 manifold 几何布尔 |
| 按分数重着色 | 0–100 分映射红→黄→绿,选中席与邻座高亮显示相对位置 |
| 外部网格载入 | GLB/GLTF/OBJ,参与展示与观众视角射线遮挡 |
| 清单导出/导入 | JSON(`venue-seat-list/v1`),含座席 id、坐标与评分,可还原选区 |

## 快速开始

```bash
npm install
npm run dev        # 开发服务器(自动打开浏览器)
npm run build      # 类型检查 + 生产构建
npm run preview    # 预览构建产物
```

## 验证脚本

```bash
npm run test:manifold   # 视线通道几何(圆柱朝向/端点/布尔遮挡)
npm run test:scoring    # 端到端评分流水线(射线预筛 + manifold 布尔)
```

浏览器自动化冒烟脚本(需先 `npm run dev` 并以 CDP 启动 Chrome):

```bash
node scripts/cdp-smoke.mjs       # 渲染/框选/Worker 评分/导出/导入全流程
node scripts/cdp-eye-view.mjs    # 观众视角/环视遮挡/眼高/退出
```

## 操作

- **左键拖拽**旋转场馆,滚轮缩放
- **单击座席**进入该座观众视角;视角下拖动环视,`↩` 按钮退出
- **Shift + 拖拽**(或右键拖拽)框选座席;**Ctrl/Cmd + 框选**叠加选区
- 框选后点顶部「批量评分」,完成后座席按分数重着色
- 勾选座席后「导出座席清单」,之后可「导入清单还原」选区与评分

## 架构

```
src/
├─ types.ts                     共享类型(座席/遮挡物/评分/清单文件)
├─ utils/math3d.ts              向量、HSL、代数射线-盒体求交
├─ geometry/
│  ├─ manifold-bootstrap.ts     轻量 wasm 引导(绕开 gltf-transform 重依赖)
│  └─ manifold-service.ts       视线通道圆柱、盒体 union、布尔遮挡判定
├─ venue/demo-venue.ts          四面看台演示场馆(4640 席)+ 前排观众代理
├─ workers/score.worker.ts      评分 Worker:射线预筛 + manifold 布尔 + 进度回报
├─ services/
│  ├─ score-service.ts          Worker 生命周期与消息协议
│  └─ seat-list.ts              清单 JSON 导出/导入
├─ three/
│  ├─ venue-scene.ts            场景、点选/框选、观众视角、遮挡标记渲染
│  └─ mesh-loader.ts            GLB/GLTF/OBJ 载入
└─ ui/                          原生 Web Components(toolbar/panels/app)
```

### 评分算法(两层判定)

1. **代数射线预筛(零几何成本)**:从眼位向关键点发射中心射线,对所有结构/观众盒体做
   `rayBoxHit`。射线都不命中时,有厚度的圆柱通道必然不相交,直接判可见。
2. **manifold 几何布尔(精确判定)**:射线命中的视线,构建沿眼位→关键点的细长圆柱
   (视线通道,半径 0.08 m,8 段),与结构实体 union 做 `intersect`,相交体积非空即被挡。
   结构遮挡计 0 票,前排观众遮挡计 0.5 票,通视计 1 票,归一到 0–100。

射线预筛把 manifold 布尔调用量降到约 30%,1000 席 × 6 目标约 3.4 秒(Worker 内,带进度条)。

### 坐标系

场馆数据采用 **Z-up**(`x` 横向、`y` 纵深、`z` 高度),three.js 为 **Y-up**,
场景边界统一按 `(x, z, y)` 映射;manifold 运算始终在数据坐标系进行,不受渲染转换影响。

## 关键技术备注

- **manifold-3d 圆柱默认沿 Z 轴**(非 Y),视线通道用「绕 X 俯仰 θ + 绕 Z 偏航 φ」对齐眼位→目标方向,
  全局系旋转按 x→y→z 顺序生效。详见 `manifold-service.ts` 注释与 `verify-channel.ts`。
- Worker 通过 `manifold-3d/lib/wasm.js` + GC 包装直接加载 wasm 核心,
  避免 `manifoldCAD` 入口拉入 gltf-transform,Worker 包体从 277 KB 降到 47 KB。
- 观众视角的遮挡判定用纯代数射线(实时),批量评分用 manifold 布尔(精确、有厚度),
  两条路径共享同一套盒体数据。
