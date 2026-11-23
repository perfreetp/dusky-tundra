# 湿地鸟类栖息地适宜度分析工具

Vue 3 + TypeScript + MapLibre GL JS + three.js 实现的湿地鸟类栖息地适宜度渲染工具。

## 功能

- **底图图层**:OSM 底图(离线时退化为背景色)上叠加湿地水域、植被两个因子图层,可开关、可调透明度。
- **适宜度热力**:水深适宜度 + 植被覆盖双因子加权计算,滑杆实时调权重;5 套 5 档色带可切换;热力图与鸟群点位密度随权重联动重算。
- **鸟群点位**:默认 2 万个观测点位(three.js InstancedMesh 单次 draw call 渲染),按适宜度分档着色、按高度分层抬升;点位密度热力图以单点适宜度为权重;点击点位查看单点适宜度与因子得分;3D 斜视模式可观察点位与水下地形的相对高度。
- **区域评估**:矩形 / 多边形圈选,统计区域平均适宜度、面积、覆盖格网数、区内点位;配置与圈选范围自动存入 localStorage,可导出 / 导入 JSON 文件分享。

## 运行

```bash
npm install
npm run dev    # http://localhost:5173
npm run build  # 产物在 dist/
```

## 结构

```
src/
  core/        数据生成、适宜度模型、色带、持久化(纯逻辑,无 UI 依赖)
  stores/      Pinia 状态中枢:权重变化 → recompute() → dataVersion++ → 地图层联动
  map/         MapLibre 容器、因子/热力画布、three.js 三维点位图层、圈选工具
  pages/       底图图层 / 适宜度热力 / 鸟群点位 / 区域评估 四个流程页面
```

当前水域 / 植被栅格与鸟群点位为合成演示数据(`src/core/data.ts`),
接入真实数据时替换 `buildGrid()` 与 `generateBirdPoints()` 即可,其余链路不变。
