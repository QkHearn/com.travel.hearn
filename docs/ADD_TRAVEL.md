# Hearn & 瑾怡 旅行足迹 2.0 - 使用指南

## 全新升级

2.0 版本带来了全新设计：
- **清新自然风格**：阿尔卑斯少女般的蓝天白云、草地阳光
- **编辑页面**：5分钟完成一个地点记录，地图选点 + 照片上传 + AI写故事
- **聚合统计**：自动按省/市层级统计（如四川 = 成都3个 + 雅安2个）
- **AI 故事生成**：Kimi 根据照片自动创作旅行故事
- **GitHub 一键提交**：无需手动编辑代码文件

---

## 快速开始：5分钟添加一个新地点

### 第一步：打开编辑页面
在浏览器中打开 `admin.html`（如 `http://localhost:8000/admin.html`）

### 第二步：配置 GitHub
1. 在 GitHub 生成 Fine-grained personal access token：
   - Settings → Developer settings → Personal access tokens → Fine-grained tokens
   - 选择你的仓库，权限勾选 **Contents: Read and Write**
2. 在编辑页面填入：
   - **GitHub Token**: 刚才生成的 token
   - **仓库地址**: `你的用户名/仓库名`（如 `hearn/travel-journal`）
   - **分支**: `main`
3. 点击 **测试连接**，显示绿色 ✓ 后点击 **下一步**

### 第三步：地图选点
1. 在地图上点击你要记录的位置，或在上方的搜索框输入地名搜索
2. 系统会自动获取经纬度和省市区信息
3. 点击 **下一步**

### 第四步：填写信息
- **地点名称**: 如 "锦里古街"
- **日期**: 选择旅行日期范围
- **标签**: 用逗号分隔，如 `古街, 美食, 文化, 夜景`
- **一句话总结**: 描述这个地方的一句话
- 省/市/区会自动填充，可手动修改
- 点击 **下一步**

### 第五步：上传照片
1. 拖拽或点击上传照片（支持多选）
2. 第一张自动设为封面
3. 点击照片可设为封面，点击 ✕ 删除
4. 点击 **下一步**

### 第六步：写故事
**方式 A - AI 生成（推荐）**：
1. 配置 Kimi API Key（可选，首次需要）
   - 访问 [platform.moonshot.cn](https://platform.moonshot.cn) 注册获取
2. 点击 **AI 根据照片生成故事**
3. 等待 10-20 秒，AI 会根据你的照片创作故事
4. 可在文本框中修改

**方式 B - 手动撰写**：
- 直接在文本框中写下你的旅行故事

点击 **下一步**

### 第七步：提交
预览无误后，点击 **提交到 GitHub**，等待进度条完成即可！

大约 1-2 分钟后，网站会自动更新显示新添加的地点。

---

## 手动维护（备用方案）

如果不需要编辑页面，也可以手动维护：

### 1. 准备照片
```
images/travels/
  └── {地点拼音}/
      ├── cover.jpg    # 封面图（第一张自动作为封面）
      ├── 1.jpg
      ├── 2.jpg
      └── 3.jpg
```

### 2. 编辑数据文件
打开 `js/data.js`，在 `destinations` 数组中添加：

```javascript
{
  id: "chengdu-jinli-1234",
  name: "锦里古街",
  country: "中国",
  province: "四川",      // 用于聚合统计
  city: "成都",          // 用于聚合统计
  district: "武侯区",    // 可选
  lat: 30.6456,
  lng: 104.0494,
  date: "2024-10-01",
  endDate: "2024-10-02",
  cover: "images/travels/chengdu-jinli-1234/cover.jpg",
  photos: [
    "images/travels/chengdu-jinli-1234/1.jpg",
    "images/travels/chengdu-jinli-1234/2.jpg",
    "images/travels/chengdu-jinli-1234/3.jpg"
  ],
  tags: ["古街", "美食", "文化", "夜景"],
  story: "锦里的夜晚，红灯笼高高挂起...",
  summary: "在锦里古街感受成都的热闹与烟火气"
}
```

### 3. 部署
推送到 GitHub 仓库即可自动更新。

---

## 技术说明

### 风格系统
- 色彩：天空蓝 `#E8F4FD`、草地绿 `#7CB342`、海水蓝 `#4FC3F7`、阳光金 `#FFD54F`
- 字体：霞鹜文楷（中文标题）+ Nunito（英文/UI）
- 动画：飘动云朵 Canvas 背景、花瓣飘落、3D 卡片倾斜、滚动触发淡入

### 数据结构
| 字段 | 必填 | 说明 |
|------|------|------|
| id | ✓ | 唯一标识，英文/数字 |
| name | ✓ | 地点名称 |
| country | ✓ | 国家 |
| province | | 省份，用于聚合统计 |
| city | | 城市，用于聚合统计 |
| district | | 区县，可选 |
| lat/lng | ✓ | 经纬度 |
| date | ✓ | 开始日期 YYYY-MM-DD |
| endDate | | 结束日期 |
| cover | ✓ | 封面图路径 |
| photos | ✓ | 照片路径数组 |
| tags | ✓ | 标签数组 |
| story | ✓ | 旅行故事 |
| summary | ✓ | 一句话总结 |

### API 配置
- **GitHub Token**: 仅需 `Contents: Read and Write` 权限
- **Kimi API**: 可选，用于 AI 故事生成，在 [platform.moonshot.cn](https://platform.moonshot.cn) 获取

---

## 常见问题

**Q: 添加新地点后网站没有更新？**
A: GitHub Pages 有缓存，等待 1-2 分钟后强制刷新（Ctrl+F5 / Cmd+Shift+R）。

**Q: GitHub 提交失败？**
A: 检查 Token 是否有仓库写入权限，仓库名称格式是否为 `用户名/仓库名`。

**Q: AI 生成故事失败？**
A: 检查 Kimi API Key 是否正确，免费额度是否用完。也可手动撰写故事。

**Q: 照片上传失败？**
A: GitHub API 单文件限制 100MB，建议单张照片不超过 10MB。浏览器会自动压缩。

**Q: 如何修改已有地点？**
A: 目前编辑页面只支持添加新地点。修改已有地点需要手动编辑 `js/data.js` 文件。
