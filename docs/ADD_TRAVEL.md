# Hearn & 瑾怡 旅行足迹 - 维护指南

## 快速开始

这是一个纯静态网站，无需服务器或数据库。所有旅行数据存储在 `js/data.js` 文件中，直接编辑即可更新网站内容。

## 添加新的旅行目的地

### 1. 准备照片

将旅行照片放入对应的文件夹：

```
images/travels/
  └── {地点英文或拼音}/
      ├── cover.jpg    # 封面图（必填，推荐 1200x800）
      ├── 1.jpg        # 照片1
      ├── 2.jpg        # 照片2
      └── 3.jpg        # 更多照片...
```

**示例**：
```
images/travels/paris/
  ├── cover.jpg
  ├── 1.jpg
  ├── 2.jpg
  └── 3.jpg
```

**照片命名建议**：
- 使用简短的英文或拼音作为文件夹名（不含空格，用连字符）
- 照片格式：JPG 或 WebP（推荐 WebP，体积更小）
- 封面图尺寸：1200x800 像素
- 画廊照片：1200x800 或 800x1200 像素
- 单张照片建议不超过 500KB

### 2. 编辑数据文件

打开 `js/data.js`，在 `destinations` 数组中添加新的目的地对象：

```javascript
{
  id: "唯一标识",           // 必填，英文，不含空格，如 "paris-2024"
  name: "地点名称",         // 必填，中文，如 "巴黎"
  country: "国家",          // 必填，中文，如 "法国"
  lat: 48.8566,            // 必填，纬度，可在 Google Maps 获取
  lng: 2.3522,             // 必填，经度，可在 Google Maps 获取
  date: "2024-05-15",      // 必填，开始日期，格式 YYYY-MM-DD
  endDate: "2024-05-20",   // 必填，结束日期，格式 YYYY-MM-DD
  cover: "images/travels/paris/cover.jpg",  // 必填，封面图路径
  photos: [                // 必填，照片数组
    "images/travels/paris/1.jpg",
    "images/travels/paris/2.jpg",
    "images/travels/paris/3.jpg"
  ],
  tags: ["浪漫", "艺术", "美食"],  // 必填，标签数组（2-5个）
  story: "这里是旅行故事...",      // 必填，旅行故事文字
  summary: "一句话总结"            // 必填，短描述，用于卡片展示
}
```

**完整示例**：

```javascript
{
  id: "shanghai-2024",
  name: "上海",
  country: "中国",
  lat: 31.2304,
  lng: 121.4737,
  date: "2024-10-01",
  endDate: "2024-10-05",
  cover: "images/travels/shanghai/cover.jpg",
  photos: [
    "images/travels/shanghai/1.jpg",
    "images/travels/shanghai/2.jpg",
    "images/travels/shanghai/3.jpg",
    "images/travels/shanghai/4.jpg"
  ],
  tags: ["都市", "美食", "夜景", "文化"],
  story: "上海是一座充满魔力的城市。外滩的万国建筑在夜色中熠熠生辉，陆家嘴的摩天大楼直插云霄。我们在田子坊的小巷里寻找老上海的味道，在新天地感受时尚与历史的交融。城隍庙的小笼包让我们回味无穷，豫园的古典园林让我们流连忘返。这座城市的每一个角落，都在诉说着过去与未来的对话。",
  summary: "魔都上海，感受东方明珠的繁华与魅力"
}
```

### 3. 获取经纬度

1. 打开 [Google Maps](https://maps.google.com)
2. 搜索目的地
3. 右键点击地图上的位置
4. 选择第一串数字就是经纬度（格式：纬度, 经度）

或者使用在线工具：[LatLong.net](https://www.latlong.net/)

### 4. 预览更改

由于这是静态网站，你可以直接在浏览器中打开 `index.html` 文件预览效果：

```bash
# 在项目根目录下，用 Python 启动一个简单的服务器
python -m http.server 8000

# 然后访问 http://localhost:8000
```

或者在 VS Code 中安装 "Live Server" 插件，右键点击 `index.html` 选择 "Open with Live Server"。

### 5. 部署到 GitHub Pages

#### 方式一：通过 Git 命令行

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "添加上海旅行记录"

# 推送到 GitHub（需要先在 GitHub 创建仓库）
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

#### 方式二：通过 GitHub 网页

1. 在 GitHub 创建新仓库
2. 点击 "Uploading an existing file"
3. 拖拽所有文件到上传区域
4. 提交更改

#### 开启 GitHub Pages

1. 进入仓库的 Settings 页面
2. 左侧菜单选择 "Pages"
3. Source 选择 "Deploy from a branch"
4. Branch 选择 "main"，文件夹选择 "/ (root)"
5. 点击 Save
6. 等待几分钟后，网站会在 `https://你的用户名.github.io/仓库名` 上线

## 修改现有内容

### 修改旅行故事

直接编辑 `js/data.js` 中对应目的地的 `story` 字段。

### 修改照片

1. 替换 `images/travels/{地点}/` 文件夹中的图片
2. 如果新增或删除了照片，记得同步修改 `js/data.js` 中的 `photos` 数组

### 修改个人信息

编辑 `about.html` 文件中的文字内容。

## 文件结构说明

```
/
├── index.html          # 首页
├── map.html            # 地图页
├── gallery.html        # 相册页
├── stories.html        # 故事页
├── about.html          # 关于页
├── css/                # 样式文件
│   ├── base.css        # 基础样式和变量
│   ├── components.css  # 通用组件（导航、按钮、卡片等）
│   ├── home.css        # 首页样式
│   ├── map.css         # 地图页样式
│   ├── gallery.css     # 相册页样式
│   ├── stories.css     # 故事页样式
│   └── about.css       # 关于页样式
├── js/                 # JavaScript 文件
│   ├── data.js         # 旅行数据（你主要编辑的文件）
│   ├── main.js         # 通用功能（星空动画、导航等）
│   ├── home.js         # 首页逻辑
│   ├── map.js          # 地图逻辑
│   ├── gallery.js      # 相册逻辑
│   ├── stories.js      # 故事逻辑
│   ├── about.js        # 关于页逻辑
│   └── utils.js        # 工具函数
├── images/             # 图片文件夹
│   ├── hero/           # 首页背景（可选）
│   └── travels/        # 旅行照片（按地点分子文件夹）
└── docs/               # 文档
    └── ADD_TRAVEL.md   # 本文件
```

## 注意事项

1. **不要修改 CSS 和 JS 文件名**，HTML 页面依赖这些文件名加载资源
2. **保持 data.js 的格式正确**，特别是逗号和引号
3. **id 字段必须唯一**，建议使用 "地点-年份" 的格式
4. **照片路径要正确**，相对于网站根目录
5. **日期格式严格使用 YYYY-MM-DD**

## 常见问题

**Q: 添加新地点后网站没有更新？**
A: 浏览器可能缓存了旧的 data.js。按 Ctrl+F5（Windows）或 Cmd+Shift+R（Mac）强制刷新。

**Q: 地图上的标记位置不准确？**
A: 检查经纬度是否正确。注意：Google Maps 复制的格式是 "纬度, 经度"，data.js 中需要分别填入 `lat` 和 `lng`。

**Q: 照片显示不出来？**
A: 检查照片路径是否正确，区分大小写。确认照片确实存在于对应的文件夹中。

**Q: 想修改网站颜色或字体？**
A: 编辑 `css/base.css` 文件顶部的 CSS 变量。修改后所有页面会同步更新。

## 高级定制

### 修改网站颜色

编辑 `css/base.css` 中的 CSS 变量：

```css
:root {
  --starry-night: #0a0e27;      /* 主背景色 */
  --van-gogh-gold: #d4a017;      /* 强调色 */
  /* ... 其他变量 */
}
```

### 修改字体

在 `base.css` 中修改字体变量，并在 HTML `<head>` 中引入新的 Google Fonts。

### 添加新页面

1. 复制一个现有的 HTML 文件作为模板
2. 修改页面标题和内容
3. 在导航栏所有页面的 `<nav>` 中添加新链接
4. 创建对应的 CSS 和 JS 文件

## 技术支持

如需帮助，可以：
- 查看 GitHub Pages 官方文档：https://docs.github.com/pages
- 学习 Git 基础：https://git-scm.com/doc
- 了解 Leaflet 地图：https://leafletjs.com
