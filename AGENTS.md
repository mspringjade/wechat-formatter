# 项目指南：公众号一键排版助手 (WeChat Formatter)

## 项目概述

这是一款专为微信公众号设计的「Markdown转微信排版」辅助工具。用户编写 Markdown 文本，一键套用 50 套不同风格的精美排版，可直接复制粘贴到微信公众平台后台。

## 技术栈

- **框架**: Next.js 16.2.0 (App Router)
- **UI 库**: React 19.2.4
- **样式**: Tailwind CSS 4
- **Markdown 解析**: marked 17.0.4
- **语言**: TypeScript 5

> ⚠️ **重要**: Next.js 16 有破坏性变更，API、约定和文件结构可能与训练数据不同。编写代码前请先阅读 `node_modules/next/dist/docs/` 中的相关指南。

## 项目结构

```
wechat-formatter/
├── app/
│   ├── page.tsx           # 主页面组件（三栏布局）
│   ├── template-engine.ts # 模板引擎和 Markdown 渲染逻辑
│   ├── layout.tsx         # 根布局
│   ├── globals.css        # 全局样式
│   └── favicon.ico        # 网站图标
├── public/                # 静态资源
│   ├── logo.png           # 网站 Logo
│   ├── logo1.png          # 备用 Logo
│   └── reward.png         # 赞赏码图片
├── .agents/skills/        # Agent 技能配置
├── package.json           # 项目依赖
├── tsconfig.json          # TypeScript 配置
├── next.config.ts         # Next.js 配置
├── postcss.config.mjs     # PostCSS 配置
└── eslint.config.mjs      # ESLint 配置
```

## 核心功能模块

### 1. 模板系统 (`template-engine.ts`)

- **50 套模板**分为 5 大类：
  - `minimalist` - 极简风（10套）：圆点、清爽边框
  - `business` - 商务风（10套）：方块标识符、专业严谨
  - `literary` - 文艺风（10套）：花朵图标、留白设计
  - `tech` - 科技风（10套）：尖角、极客终端风格
  - `festive` - 节庆风（10套）：星星标识、浓烈色彩

- **模板配置接口** `TemplateConfig`：
  - 基础样式：颜色、字体、背景色（`backgroundColor`，确保暗黑模式兼容）
  - 各元素样式：标题(h1-h3)、段落、引用、列表、代码块、图片、分隔线、链接、表格等

### 2. Markdown 渲染

- 使用 `marked` 库解析 Markdown
- 自定义渲染器将样式内联到 HTML 元素
- **关键约束**：微信公众号只支持内联样式(inline-css)，所有样式必须写入 `style=""` 属性

### 3. 页面布局 (`page.tsx`)

- **三栏响应式布局**：
  - 左侧：Markdown 输入区
  - 中间：手机框预览区（模拟 iPhone 外观）
  - 右侧：模板选择和参数调整
- **移动端适配**：Tab 切换模式
- **一键复制**：使用 `document.execCommand('copy')` 复制渲染后的 HTML
- **滚动同步**：桌面端可开启编辑区与预览区同步滚动功能（移动端隐藏）
- **赞赏功能**：顶栏赞赏按钮，点击弹出赞赏码弹窗

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 运行 ESLint 检查
npm run lint
```

## 代码规范

### 样式约定

- 使用 Tailwind CSS 进行页面布局和样式
- 模板样式使用纯内联 CSS 字符串（兼容微信）
- 颜色使用标准 hex 格式（如 `#3b82f6`）

### 组件约定

- 使用 `'use client'` 标记客户端组件
- 使用 React Hooks 管理状态
- 事件处理函数定义在组件内部

### TypeScript 约定

- 接口定义放在文件顶部
- 避免使用 `any` 类型（渲染器除外，因 marked 类型复杂）
- 导出公共函数和类型

## 微信公众号兼容性注意事项

1. **样式内联**：所有 CSS 必须内联到 `style` 属性
2. **标签限制**：避免使用 `<script>`、部分 HTML5 语义标签
3. **布局方案**：
   - 外层容器使用 `<table>` 包裹，微信对 `div` 的背景色和边框支持差
   - 内部元素使用 `<section>` + `display: flex` 布局
4. **字体限制**：只能使用系统默认字体
5. **图片处理**：图片需要上传到微信服务器或使用微信支持的图床
6. **背景色**：使用 `background-color` 而非 `background` 简写，微信对简写支持差
7. **防止溢出**：
   - 表格添加 `table-layout: fixed; max-width: 100%;`
   - 单元格添加 `word-wrap: break-word; word-break: break-all;`
   - 避免使用 `width: max-content`，会导致内容溢出
8. **暗黑模式兼容**：
   - 必须为所有模板设置明确的 `backgroundColor` 属性
   - 外层 `<table>` 和内部 `<td>` 都需要设置 `background-color`
   - 防止用户电脑暗黑模式影响粘贴到公众号后的显示效果

## 常见开发任务

### 添加新模板

在 `template-engine.ts` 的 `generateTemplates()` 函数中添加新的模板配置。

### 修改 Markdown 渲染

在 `template-engine.ts` 的 `customRenderer` 对象中修改对应的渲染方法。

### 调整页面布局

修改 `page.tsx` 中的 Tailwind CSS 类名或组件结构。

### 添加新的排版参数

1. 在 `page.tsx` 中添加新的 state
2. 在右侧设置面板添加 UI 控件
3. 将参数传递给 `renderArticle()` 函数

### 添加交互功能

1. 使用 `useRef` 获取 DOM 元素引用
2. 使用 `useCallback` 包装事件处理函数（避免不必要的重渲染）
3. 对于需要阻止循环触发的场景，使用 `useRef` 作为标记（如 `isScrollingRef`）
