# 赛车涂装曲面预览工具 (Livery Studio)

基于 **TypeScript + Svelte + three.js + postprocessing** 的赛车车身涂装设计工具。
涂装工程自动保存在浏览器 localStorage,可通过导出 JSON 文件分享。

## 运行

```bash
npm install
npm run dev      # 开发服务器
npm run build    # 生产构建
npm run check    # 类型检查
```

## 功能与实现

### 车身曲面与二维展开图
- 内置参数化赛车车身(解析放样曲面 + 前翼/尾翼/尾翼端板),载入即生成精确的 UV 展开图集;
  也可导入 `.obj` / `.glb` / `.gltf` 自定义车身(自动生成柱面展开 UV)。
- 展开图集分区:车身、尾翼主翼面、左右尾翼端板、前翼。车身环向唯一切口位于车底中线(不可见)。

### 贴花编辑与回贴
- 在展开平面上添加文字与图形贴花(矩形/圆形/三角/星形/条纹),支持拖动、手柄旋转与缩放。
- **曲率补偿**:回贴时在贴花中心求参数曲面雅可比 `G`,绘制变换取 `D·G⁻¹·R·k`,
  使贴花在曲面上各向同性——曲率大的区域自动反向拉伸,视觉上不变形
  (`src/lib/three/decalComposer.ts`)。
- **接缝连续**:车身面板沿环向绘制 ±1 周期环绕副本,跨图集边缘的贴花在接缝两侧像素一致。

### 曲面细分(3 档)
- 低 96×48 / 中 192×96 / 高 420×300(约 26 万三角面片)。
- 切换档位时几何体、UV 与贴图分辨率(1024/2048/4096)联动重算,贴花按新曲面重新补偿。

### 三层车漆材质
- 底色层(颜色/粗糙度/金属度)+ 金属漆层(程序化片状颗粒:法线扰动 + 粗糙度/金属度噪点)
  + 清漆层(clearcoat 厚度/粗糙度/反射强度)。
- 环境反射由 PMREM 环境贴图实时驱动,强度可调。

### 视图
- 侧视 / 俯视 / 四分之三预设机位,平滑过渡;
- 局部放大聚焦:前轮拱、尾翼端板,用于检查贴花细节。

### 性能设计
- 贴花纹理只在贴花/材质变化时重绘(单张 CanvasTexture),40 个贴花重绘约几毫秒,旋转帧率不受影响;
- 三档几何体静态预生成,切换即换 BufferGeometry;
- 后期链:SMAA + Bloom + Vignette(postprocessing),HUD 实时显示 FPS 与三角面片数。

### 工程持久化与分享
- 所有状态(贴花、材质、细分档位、工程名)防抖自动保存到 localStorage;
- 「导出」下载 `*.livery.json`,「导入工程」恢复;「保存」立即写入浏览器。

## 目录结构

```
src/
  lib/
    types.ts              # 贴花/材质/工程数据模型
    stores.ts             # Svelte 响应式状态
    persistence.ts        # localStorage 保存 / JSON 导入导出
    shapes.ts             # 星形等矢量图形(canvas 与 SVG 共享)
    three/
      carBody.ts          # 参数化车身、UV 图集、三档细分、柱面展开
      decalComposer.ts    # 贴花合成(曲率补偿 + 接缝环绕)
      materials.ts        # 三层车漆材质
      scene.ts            # 渲染器、后期、视图机位、车身导入
  components/
    Viewport.svelte       # 3D 视口 + FPS HUD
    UnwrapEditor.svelte   # 二维展开图编辑器(拖动/旋转/缩放)
    DecalPanel.svelte     # 贴花列表与属性
    MaterialPanel.svelte  # 三层材质调节
  App.svelte              # 工具栏与布局
```
