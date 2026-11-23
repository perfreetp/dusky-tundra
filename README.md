# AeroFlow Viz · 赛车气动流场可视化工具

基于 **TypeScript + React + three.js (WebGPURenderer / TSL)** 的三维赛车空气动力学可视化应用。
支持车身表面压力色带、空间速度场体渲染、正交剖切云图、GPU 流线粒子与分区升阻力系数读数。

## 功能清单

| 模块 | 实现 |
| --- | --- |
| 数据导入 | 表面压力网格 + 规则网格速度场 JSON，支持 base64 二进制承载（见 `src/types/dataset.ts`） |
| 压力色带 | 每顶点 Cp 映射发散色带，双阈值滑块控制高低压显隐（区间外丢弃 / 钳制两种模式） |
| 正交剖切面 | YZ / ZX / XY 三个平面，拖动位置实时重算截面速度云图（96×96 三线性采样） |
| 体渲染 | Data3DTexture 体纹理 + TSL 光线步进，速率梯度驱动的涡结构着色，front-to-back 混合 |
| 深度正确 | 光线步进读取相机线性深度，遇到车身即停；透明对象按 renderOrder 分层，无穿插 |
| 流线粒子 | 上限 20,000，WebGPU 走 compute shader 推进 + 环形拖尾；WebGL 自动回退 CPU 推进 |
| 可调参数 | 推进步长系数、拖尾长度、粒子数量、撒播区域（尾翼 / 扩散器） |
| 区域高亮 | 尾翼、扩散器单独高亮，并显示对应 Cl / Cd 系数读数 |
| 视角 | 绕车自由漫游（OrbitControls）与贴地低角度视角一键切换 |
| 状态持久化 | 全部阈值 / 开关 / 相机位姿节流写入 localStorage |
| 分享文件 | 导出 JSON 分享文件（含数据指纹），他人导入后复现同一视角与色带配置 |

## 性能设计

- 10 万级体素（默认 64×34×48 = 104,448）与 2 万粒子同场景运行，实测稳定 20–60 FPS。
- 粒子位置 / 拖尾全部驻留 GPU storage buffer，每帧一次 compute dispatch，无 CPU↔GPU 回读。
- 体渲染单步 alpha 封顶 + 梯度场筛选，自由来流区近似零开销，突出涡核与尾迹。
- 剖面云图只在平面移动时重算 9,216 个采样点，与流线更新解耦，不阻塞渲染帧。

## 开发

```bash
npm install
npm run dev        # http://127.0.0.1:5180
npm test           # 23 个单元测试（编解码、采样、色带、状态持久化、示例数据）
npm run build      # 类型检查 + 生产构建
```

无 WebGPU 环境（如 headless 浏览器）自动回退 WebGL 后端，粒子系统对应切换到 CPU 实现，
语义与参数完全一致。带界面的 Chrome / Edge 113+ 默认启用 WebGPU。

## 数据格式

### 表面压力 `aero-surface-pressure`

```jsonc
{
  "format": "aero-surface-pressure",
  "version": 1,
  "meta": { "name": "my-car", "freeStream": { "speed": 28, "direction": [-1, 0, 0] } },
  "geometry": {
    "positions": { "encoding": "base64", "dtype": "float32", "count": 12000, "data": "..." },
    "indices":   { "encoding": "base64", "dtype": "uint32",  "count": 24000, "data": "..." },
    "regions": [
      { "id": "rearWing", "name": "尾翼", "triangleStart": 800, "triangleCount": 400 }
    ]
  },
  "pressure": { "values": { "encoding": "base64", "dtype": "float32", "count": 4000, "data": "..." } },
  "coefficients": {
    "rearWing": { "cl": -1.24, "cd": 0.182, "area": 1.1 },
    "diffuser": { "cl": -0.93, "cd": 0.076, "area": 1.87 }
  }
}
```

### 速度场 `aero-velocity-volume`

```jsonc
{
  "format": "aero-velocity-volume",
  "version": 1,
  "grid": {
    "size": [64, 34, 48],
    "origin": [-4.2, -0.3, -3.2],
    "spacing": [0.165, 0.130, 0.136]
  },
  "velocity": {
    "values": { "encoding": "base64", "dtype": "float32", "count": 313344, "data": "..." }
  },
  "scalar": { "name": "压力系数 Cp", "values": { "encoding": "base64", "dtype": "float32", "count": 104448, "data": "..." } }
}
```

- 速度数组按 `x 最快、z 最慢` 排列，每体素连续存 `vec3`。
- 也接受普通 `number[]`（小数据）；大数据强烈建议 base64 + float32，体积约为 JSON 数字数组的 1/4。
- 可一次导入包含两个数据集的 JSON 数组，应用会按 `format` 字段自动归类。

## 目录结构

```
src/
  types/dataset.ts        数据格式类型
  data/                   编解码、导入校验、内置示例数据生成器
  render/                 three.js 场景、TSL 材质、粒子、体渲染、剖切面
  state/store.ts          zustand 全局状态 + localStorage + 分享文件
  ui/                     React 控制面板与画布
  __tests__/              单元测试
scripts/                  CDP 端到端冒烟脚本
```
