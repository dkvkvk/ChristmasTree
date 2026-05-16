# Three.js 粒子圣诞树 🎄

> 使用 Three.js + GLSL 着色器构建的沉浸式粒子圣诞树，含音乐播放、雪花飘落、礼盒装饰、气球等节日元素。

![Three.js](https://img.shields.io/badge/Three.js-v0.171-black?logo=threedotjs)
![Vue](https://img.shields.io/badge/Vue-3.x-42b883?logo=vuedotjs)
![Vite](https://img.shields.io/badge/Vite-6.x-646cff?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)


## 功能特性

- 🎄 **粒子圣诞树** — 双层螺旋 + 锥形粒子构建，带旋转与呼吸动画
- ⭐ **树顶星星** — 3D 星星模型 + 彩虹色环绕粒子，GLSL 着色器驱动
- ❄️ **雪花飘落** — 物理运动模拟，支持水平漂移，触底自动复位
- 🎈 **彩色气球** — 节日氛围装饰气球，带飘动效果
- 🎁 **礼物盒** — 场景底部随机摆放的礼物盒装饰
- 🎵 **音乐播放器** — 内置圣诞音乐列表，支持切歌与进度控制
- 🪞 **反光地面** — 镜面反射地板增强沉浸感
- 💡 **后期处理** — UnrealBloom 泛光效果，让画面更加梦幻
- 🎛️ **参数面板** — lil-gui 实时调节粒子数量、颜色、光效等参数

## 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) >= 16

### 安装与运行

```bash
# 1. 克隆项目
git clone https://github.com/dkvkvk/Threejs-ChristmasTree.git
cd Threejs-ChristmasTree

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

打开浏览器访问 `http://localhost:5173`，即可看到效果。

### 构建生产版本

```bash
npm run build
# 产物输出至 dist/ 目录
```

## 参数面板说明

运行后，右上角的控制面板支持实时调节以下参数：

### 圣诞树参数

| 参数 | 范围 | 说明 |
|------|------|------|
| `粒子数量` | 1000 ~ 10000 | 构成圣诞树的粒子总数 |
| `粒子大小` | 0.01 ~ 0.2 | 单个粒子的渲染尺寸 |
| `树高` | 2 ~ 10 | 圣诞树的高度 |
| `树宽` | 1 ~ 5 | 圣诞树底部半径 |
| `旋转速度` | 0 ~ 0.01 | 整棵树的自转速度 |
| `透明度` | 0 ~ 1 | 粒子透明度 |
| `闪耀大小` | 0.1 ~ 1.0 | 粒子发光范围 |

### 颜色 & 星星参数

| 参数 | 说明 |
|------|------|
| `星星颜色` | 顶部星星及其粒子的颜色 |
| `星星大小` | 顶部星星模型的缩放比例（0.1 ~ 1） |

### 后期处理参数

| 参数 | 范围 | 说明 |
|------|------|------|
| `发光强度` | 0 ~ 3 | 泛光效果的亮度 |
| `发光半径` | 0 ~ 1 | 泛光扩散范围 |
| `发光阈值` | 0 ~ 1 | 触发泛光的亮度阈值 |
| `曝光度` | 0 ~ 2 | 整体画面明暗 |

## 项目结构

```
Threejs-ChristmasTree/
├── public/                     # 静态资源
│   ├── draco/                  # Draco 解码器（GLB 压缩）
│   ├── model/                  # 3D 模型（star.glb 等）
│   └── music/                  # 圣诞音乐文件
├── src/
│   ├── components/
│   │   ├── ChristmasTree.vue   # 主场景组件
│   │   └── MusicPlayer.vue     # 音乐播放器组件
│   ├── three/
│   │   ├── scene.js            # Three.js 场景初始化
│   │   ├── renderer.js         # 渲染器 & 后期处理
│   │   ├── controls.js         # lil-gui 参数控制面板
│   │   ├── christmasTree.js    # 粒子圣诞树核心逻辑
│   │   ├── snow.js             # 雪花飘落效果
│   │   ├── decorations.js      # 场景装饰（彩灯等）
│   │   ├── balloons.js         # 彩色气球
│   │   ├── giftBoxes.js        # 礼物盒
│   │   └── musicalElements.js  # 音符等音乐元素
│   ├── shader/                 # GLSL 着色器文件
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── index.html
├── vite.config.js
└── package.json
```

## 技术栈

| 技术 | 用途 |
|------|------|
| [Three.js](https://threejs.org/) v0.171 | 3D 场景渲染 |
| [Vue 3](https://vuejs.org/) | 前端框架 |
| [Vite](https://vitejs.dev/) | 构建工具 |
| [GLSL](https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)) | 自定义顶点/片元着色器 |
| [lil-gui](https://lil-gui.georgealways.com/) | 实时参数调试面板 |
| [GSAP](https://gsap.com/) | 动画补间 |
| [DRACOLoader](https://threejs.org/docs/#examples/en/loaders/DRACOLoader) | 3D 模型压缩解码 |

## 浏览器支持

| 浏览器 | 支持情况 |
|--------|---------|
| Chrome（推荐） | ✅ 完整支持 |
| Firefox | ✅ 完整支持 |
| Safari | ✅ 完整支持 |
| 移动端 | ⚠️ 支持，性能取决于设备 |

> **要求**：浏览器需支持 **WebGL 2.0**。

## 生产部署

### 使用 PM2（Node.js 静态服务）

```bash
npm run build
npm install -g serve pm2
pm2 start "serve dist -p 3000" --name christmas-tree
pm2 save
pm2 startup
```

### Nginx 静态部署

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /www/wwwroot/Threejs-ChristmasTree/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/javascript application/json;
}
```

### 宝塔面板

1. 安装 `Node.js版本管理器`
2. 上传项目到服务器，执行 `npm install && npm run build`
3. 添加站点，网站目录指向 `dist/`
4. 开启伪静态规则（选 `vue` 或手动配置 `try_files`）

## License

[MIT](./LICENSE) © dkvkvk
