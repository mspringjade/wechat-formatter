# 公众号一键排版助手 (WeChat Formatter)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/mspringjade/wechat-formatter.svg?style=social)](https://github.com/mspringjade/wechat-formatter/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/mspringjade/wechat-formatter.svg)](https://github.com/mspringjade/wechat-formatter/issues)

**在线体验：[https://typezen.online](https://typezen.online)**

一款专为微信公众号设计的「Markdown转微信排版」辅助工具。写好 Markdown 文本，一键套用 50 套不同风格的精美排版，并可以直接复制粘贴到微信公众平台后台。

## 核心特性

- **全面格式支持**：原生支持所有常见的 Markdown 语法解析（由 `marked` 驱动）。
- **丰富的主题模板**：系统自动生成多达 **50套** 精美模板，涵盖 5 大种类风格，一键切换。
- **响应式排版**：三栏式工作流，支持实时手机框预览，适应桌面、平板以及手机环境。
- **一键无痕复制**：自动内联处理 CSS，点击"一键复制发布"可以直接粘贴进微信公众号文章编辑器并完美保留所有颜色与样式。

## 完整支持的 Markdown 语法列表

本工具全面适配并重新设计了各类基础语法在微信公众号中的表现形式：

1. **基本与段落语法**：普通文本段落展示与两端对齐。
2. **标题语法** (`#`)：支持 1~6 级标题格式，不同模板拥有各异的视觉展现（如下划线、大号引用于标题等）。
3. **换行语法**：支持直接回车触发普通换行 (`<br>`) 不剥离空白。
4. **强调语法** (`**加粗**` / `*斜体*`)：加粗文字结合了荧光笔高亮、彩色背景等特殊效果；斜体具有各主题独立的颜色搭配。
5. **引用语法** (`>`)：区块引用被设计为精美的卡片式摘要或警示框款式。
6. **列表语法** (`-` / `1.`)：有序和无序列表适配不同主题的标记符号（包括圆点、字母、花朵符或实心球等）。
7. **代码语法** (`\``` ` 及 `\``) ：适配多行代码块环境，内联代码具备独特高亮样式包裹，专门优化避免排版越界。
8. **分隔线语法** (`---`)：针对各个主题色系单独设置了虚线、实线、甚至阴影效果的分隔线。
9. **链接语法** (`[]()`)：自动增加主题色下划线或破折号特效，适配手机端阅读盲区问题。
10. **图片语法** (`![]()`)：为文章内的图片自动赋予倒角、微阴影及主题颜色描边。并且支持**多图自动并排（多排）**，只需将多张连续图片放在同一个段落即可自动触发等宽布局。同时还支持在编辑区直接粘贴截屏/复制的图片。
11. **转义字符** (`\`) 及其它基本功能：完美兼容标准 Markdown 规范渲染。
12. **内嵌 HTML**：支持渲染文章中混写的 HTML 标签代码，并在最外层进行样式隔离兜底。

## 主题分类

50 套模板主要分为以下 5 大类别：
1. **纯净极简风（10套）**：没有冗余元素的精简阅读体验。
2. **沉稳商务风（10套）**：严控排版细节，尽显职业素养。
3. **诗意文艺风（10套）**：细腻排版，给文字呼吸的空间。
4. **极客科技风（10套）**：打破常规的模块化终端设计，使用前卫渐变。
5. **欢庆节庆风（10套）**：浓烈色彩传递节日喜悦气息。

## 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 pnpm

### 本地运行

```bash
# 克隆项目
git clone https://github.com/mspringjade/wechat-formatter.git

# 进入项目目录
cd wechat-formatter

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可体验。

### 构建部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

## 注意事项

由于微信公众平台仅允许 `内联样式 (inline-css)`，本系统在转换过程中已将所有样式自动映射至 DOM 的 `style=""` 属性中，确保粘贴过程零损失。

## 贡献指南

欢迎所有形式的贡献！

### 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 贡献方式

- 提交 Bug 报告或功能建议
- 提出新功能想法
- 改进文档
- 提交代码修复或新功能

## 访问地址

- 在线体验：[https://typezen.online](https://typezen.online)
- GitHub：[https://github.com/mspringjade/wechat-formatter](https://github.com/mspringjade/wechat-formatter)

---

如果这个项目对你有帮助，欢迎 Star 支持一下！
